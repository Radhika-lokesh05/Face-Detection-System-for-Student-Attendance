from flask import Blueprint, request, jsonify, current_app
from bson import ObjectId
import time

student_update_bp = Blueprint("student_update", __name__)

# ============================================================================
# STUDENT ROUTES (Students can only update their own records)
# ============================================================================

@student_update_bp.route('/api/students', methods=['GET'])
def get_students():
    """Get students for the logged-in user (email-based authorization for students only)"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Get logged-in user's email from request headers or query params
        user_email = request.headers.get('X-User-Email') or request.args.get('user_email')
        user_type = request.headers.get('X-User-Type', 'student')
        
        if not user_email:
            return jsonify({"success": False, "error": "User email required for authorization"}), 401
        
        # For students: only show their own record
        if user_type == 'student':
            query = {"email": user_email}
            
            # Get query parameters for additional filtering
            department = request.args.get('department', '')
            year = request.args.get('year', '')
            search = request.args.get('search', '')
            
            if department:
                query['department'] = department
            if year:
                query['year'] = year
            if search:
                query['$or'] = [
                    {'studentName': {'$regex': search, '$options': 'i'}},
                    {'studentId': {'$regex': search, '$options': 'i'}}
                ]
            
            # Exclude embedding field from response for performance
            students = list(students_col.find(query, {"embedding": 0}).sort('studentName', 1))
            
            # Convert ObjectId to string for JSON serialization
            for student in students:
                student['_id'] = str(student['_id'])
            
            return jsonify({
                "success": True, 
                "students": students,
                "count": len(students),
                "authorized_email": user_email,
                "user_type": user_type
            })
        else:
            # For teachers, redirect to admin endpoint
            return jsonify({
                "success": False, 
                "error": "Teachers should use /api/admin/students endpoint"
            }), 400
            
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/students/<student_id>', methods=['GET'])
def get_student(student_id):
    """Get specific student (email-based authorization for students)"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Get logged-in user's email and type
        user_email = request.headers.get('X-User-Email')
        user_type = request.headers.get('X-User-Type', 'student')
        
        if not user_email:
            return jsonify({"success": False, "error": "User email required for authorization"}), 401
        
        # Get student record
        student = students_col.find_one({"_id": ObjectId(student_id)}, {"embedding": 0})
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        
        # Authorization based on user type
        if user_type == 'student':
            # Check if logged-in user's email matches student's email
            if student.get('email') != user_email:
                return jsonify({
                    "success": False, 
                    "error": "Unauthorized: You can only view your own student record"
                }), 403
        elif user_type == 'teacher':
            # Teachers can view any student record
            pass
        else:
            return jsonify({"success": False, "error": "Invalid user type"}), 403
        
        student['_id'] = str(student['_id'])
        return jsonify({"success": True, "student": student})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/students/<student_id>', methods=['PUT'])
def update_student(student_id):
    """Update student (email-based authorization for students, role-based for teachers)"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    data = request.get_json()
    
    try:
        # Get logged-in user's email and type
        user_email = request.headers.get('X-User-Email') or data.get('user_email')
        user_type = request.headers.get('X-User-Type', 'student')
        
        if not user_email:
            return jsonify({"success": False, "error": "User email required for authorization"}), 401
        
        # Validate student exists
        student = students_col.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        
        # Authorization check based on user type
        if user_type == 'student':
            # Students can only update their own record
            if student.get('email') != user_email:
                return jsonify({
                    "success": False, 
                    "error": "Unauthorized: You can only update your own student record"
                }), 403
            
            # Students cannot change email
            if data.get('email') and data.get('email') != student.get('email'):
                return jsonify({
                    "success": False, 
                    "error": "Email cannot be changed for security reasons. Contact administrator."
                }), 400
                
        elif user_type == 'teacher':
            # Teachers can update any student record
            # Check if new email conflicts with existing one (if changed)
            if data.get('email') and data.get('email') != student.get('email'):
                existing = students_col.find_one({
                    'email': data.get('email'),
                    '_id': {'$ne': ObjectId(student_id)}
                })
                if existing:
                    return jsonify({"success": False, "error": "Email already registered"}), 400
        else:
            return jsonify({"success": False, "error": "Invalid user type"}), 403
        
        # Check if new student ID conflicts with existing one (if changed)
        if data.get('studentId') and data.get('studentId') != student.get('studentId'):
            existing = students_col.find_one({
                'studentId': data.get('studentId'),
                '_id': {'$ne': ObjectId(student_id)}
            })
            if existing:
                return jsonify({"success": False, "error": "Student ID already exists"}), 400
        
        # Update student data (preserve face data)
        update_data = {
            "studentName": data.get("studentName", student.get("studentName")),
            "studentId": data.get("studentId", student.get("studentId")),
            "department": data.get("department", student.get("department")),
            "year": data.get("year", student.get("year")),
            "division": data.get("division", student.get("division")),
            "semester": data.get("semester", student.get("semester")),
            "phoneNumber": data.get("phoneNumber", student.get("phoneNumber")),
            "updated_at": time.time(),
            "updated_by": user_email,
            "updated_by_type": user_type
        }
        
        # Only update email if teacher is making the change
        if user_type == 'teacher':
            update_data["email"] = data.get("email", student.get("email"))
        
        result = students_col.update_one(
            {"_id": ObjectId(student_id)}, 
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            message = "Student details updated successfully"
            if user_type == 'student':
                message = "Your student details updated successfully"
            return jsonify({
                "success": True, 
                "message": message
            })
        else:
            return jsonify({"success": False, "error": "No changes made"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/students/<student_id>', methods=['DELETE'])
def delete_student(student_id):
    """Delete student (email-based authorization for students, role-based for teachers)"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Get logged-in user's email and type
        user_email = request.headers.get('X-User-Email')
        user_type = request.headers.get('X-User-Type', 'student')
        
        if not user_email:
            return jsonify({"success": False, "error": "User email required for authorization"}), 401
        
        student = students_col.find_one({"_id": ObjectId(student_id)})
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        
        # Authorization check based on user type
        if user_type == 'student':
            # Students can only delete their own record
            if student.get('email') != user_email:
                return jsonify({
                    "success": False, 
                    "error": "Unauthorized: You can only delete your own student record"
                }), 403
        elif user_type == 'teacher':
            # Teachers can delete any student record
            pass
        else:
            return jsonify({"success": False, "error": "Invalid user type"}), 403
        
        # Delete complete student record (including face data)
        students_col.delete_one({"_id": ObjectId(student_id)})
        
        message = f"Student {student.get('studentName')} deleted successfully"
        if user_type == 'student':
            message = f"Your student record ({student.get('studentName')}) deleted successfully"
            
        return jsonify({
            "success": True, 
            "message": message
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# Alternative routes for frontend compatibility
@student_update_bp.route('/api/update-student/<student_id>', methods=['PUT'])
def update_student_alt(student_id):
    """Alternative route for frontend compatibility"""
    return update_student(student_id)

@student_update_bp.route('/api/delete-student/<student_id>', methods=['DELETE'])
def delete_student_alt(student_id):
    """Alternative route for frontend compatibility"""
    return delete_student(student_id)

# ============================================================================
# TEACHER/ADMIN ROUTES (Teachers can access all students)
# ============================================================================

@student_update_bp.route('/api/admin/students', methods=['GET'])
def get_all_students_admin():
    """Admin/Teacher route to view all students with filtering"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Check if user is admin or teacher
        user_type = request.headers.get('X-User-Type')
        user_email = request.headers.get('X-User-Email')
        
        if user_type not in ['teacher', 'admin']:
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher/Admin access required"
            }), 403
        
        # Get query parameters for filtering
        department = request.args.get('department', '')
        year = request.args.get('year', '')
        division = request.args.get('division', '')
        student_id = request.args.get('studentId', '')
        search = request.args.get('search', '')
        
        # Build query
        query = {}
        if department:
            query['department'] = department
        if year:
            query['year'] = year
        if division:
            query['division'] = division
        if student_id:
            query['studentId'] = {'$regex': student_id, '$options': 'i'}
        if search:
            query['$or'] = [
                {'studentName': {'$regex': search, '$options': 'i'}},
                {'studentId': {'$regex': search, '$options': 'i'}},
                {'email': {'$regex': search, '$options': 'i'}}
            ]
        
        # Get all students (admin view) - exclude embedding for performance
        students = list(students_col.find(query, {"embedding": 0}).sort('studentName', 1))
        
        for student in students:
            student['_id'] = str(student['_id'])
        
        return jsonify({
            "success": True, 
            "students": students,
            "count": len(students),
            "admin_view": True,
            "user_type": user_type
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/teacher/students/search', methods=['GET'])
def search_students_teacher():
    """Advanced search for teachers with multiple filters"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Check if user is teacher
        user_type = request.headers.get('X-User-Type')
        if user_type != 'teacher':
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher access required"
            }), 403
        
        # Get search parameters
        student_id = request.args.get('studentId', '').strip()
        student_name = request.args.get('studentName', '').strip()
        department = request.args.get('department', '').strip()
        year = request.args.get('year', '').strip()
        division = request.args.get('division', '').strip()
        
        # Build query
        query = {}
        
        if student_id:
            query['studentId'] = {'$regex': student_id, '$options': 'i'}
        
        if student_name:
            query['studentName'] = {'$regex': student_name, '$options': 'i'}
        
        if department:
            query['department'] = department
            
        if year:
            query['year'] = year
            
        if division:
            query['division'] = division
        
        # Execute search (limit to 50 results for performance)
        students = list(students_col.find(
            query, 
            {"embedding": 0}  # Exclude embedding for performance
        ).limit(50).sort('studentName', 1))
        
        # Convert ObjectId to string
        for student in students:
            student['_id'] = str(student['_id'])
        
        return jsonify({
            "success": True,
            "students": students,
            "count": len(students),
            "query": query
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/teacher/student/<student_id_or_db_id>', methods=['GET'])
def get_student_by_id_teacher(student_id_or_db_id):
    """Teacher route to get any student by Student ID or database _id"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Check if user is teacher
        user_type = request.headers.get('X-User-Type')
        if user_type != 'teacher':
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher access required"
            }), 403
        
        # Try to find by studentId first (e.g., "STU001"), then by database _id
        student = students_col.find_one({"studentId": student_id_or_db_id}, {"embedding": 0})
        
        if not student:
            # If not found by studentId, try by database ObjectId
            try:
                student = students_col.find_one({"_id": ObjectId(student_id_or_db_id)}, {"embedding": 0})
            except:
                pass
        
        if not student:
            return jsonify({"success": False, "error": f"Student with ID '{student_id_or_db_id}' not found"}), 404
        
        student['_id'] = str(student['_id'])
        return jsonify({"success": True, "student": student})
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/teacher/student/<student_db_id>', methods=['PUT'])
def update_student_teacher(student_db_id):
    """Teacher route to update any student by database _id"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    data = request.get_json()
    
    try:
        # Check if user is teacher
        user_type = request.headers.get('X-User-Type')
        user_email = request.headers.get('X-User-Email')
        
        if user_type != 'teacher':
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher access required"
            }), 403
        
        # Validate student exists
        student = students_col.find_one({"_id": ObjectId(student_db_id)})
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        
        # Check if new student ID conflicts with existing one (if changed)
        if data.get('studentId') and data.get('studentId') != student.get('studentId'):
            existing = students_col.find_one({
                'studentId': data.get('studentId'),
                '_id': {'$ne': ObjectId(student_db_id)}
            })
            if existing:
                return jsonify({"success": False, "error": "Student ID already exists"}), 400
        
        # Check if new email conflicts with existing one (if changed)
        if data.get('email') and data.get('email') != student.get('email'):
            existing = students_col.find_one({
                'email': data.get('email'),
                '_id': {'$ne': ObjectId(student_db_id)}
            })
            if existing:
                return jsonify({"success": False, "error": "Email already registered"}), 400
        
        # Update student data (preserve face data)
        update_data = {
            "studentName": data.get("studentName", student.get("studentName")),
            "studentId": data.get("studentId", student.get("studentId")),
            "department": data.get("department", student.get("department")),
            "year": data.get("year", student.get("year")),
            "division": data.get("division", student.get("division")),
            "semester": data.get("semester", student.get("semester")),
            "email": data.get("email", student.get("email")),  # Teachers can update email
            "phoneNumber": data.get("phoneNumber", student.get("phoneNumber")),
            "updated_at": time.time(),
            "updated_by_teacher": user_email or 'teacher',
            "updated_by_type": "teacher"
        }
        
        result = students_col.update_one(
            {"_id": ObjectId(student_db_id)}, 
            {"$set": update_data}
        )
        
        if result.modified_count > 0:
            return jsonify({
                "success": True, 
                "message": f"Student {data.get('studentName', 'record')} updated successfully by teacher"
            })
        else:
            return jsonify({"success": False, "error": "No changes made"})
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/teacher/student/<student_db_id>', methods=['DELETE'])
def delete_student_teacher(student_db_id):
    """Teacher route to delete any student by database _id"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        # Check if user is teacher
        user_type = request.headers.get('X-User-Type')
        if user_type != 'teacher':
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher access required"
            }), 403
        
        student = students_col.find_one({"_id": ObjectId(student_db_id)})
        if not student:
            return jsonify({"success": False, "error": "Student not found"}), 404
        
        # Delete complete student record (including face data)
        students_col.delete_one({"_id": ObjectId(student_db_id)})
        
        return jsonify({
            "success": True, 
            "message": f"Student {student.get('studentName')} deleted successfully by teacher"
        })
    
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

# ============================================================================
# UTILITY ROUTES
# ============================================================================

@student_update_bp.route('/api/students/search', methods=['GET'])
def search_students():
    """General search students by various criteria"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        user_type = request.headers.get('X-User-Type', 'student')
        user_email = request.headers.get('X-User-Email')
        
        # Authorization check
        if user_type not in ['student', 'teacher', 'admin']:
            return jsonify({"success": False, "error": "Unauthorized"}), 403
        
        search_term = request.args.get('q', '')
        department = request.args.get('department', '')
        year = request.args.get('year', '')
        limit = int(request.args.get('limit', 10))
        
        if not search_term and not department and not year:
            return jsonify({"success": False, "error": "Search term or filters required"}), 400
        
        # Build search query
        query = {}
        
        # For students, limit to their own record
        if user_type == 'student':
            query['email'] = user_email
        
        if search_term:
            query['$or'] = [
                {'studentName': {'$regex': search_term, '$options': 'i'}},
                {'studentId': {'$regex': search_term, '$options': 'i'}},
                {'email': {'$regex': search_term, '$options': 'i'}}
            ]
        
        if department:
            query['department'] = department
        if year:
            query['year'] = year
        
        # Execute search
        students = list(students_col.find(
            query, 
            {"embedding": 0}  # Exclude embedding for performance
        ).limit(limit).sort('studentName', 1))
        
        for student in students:
            student['_id'] = str(student['_id'])
        
        return jsonify({
            "success": True,
            "students": students,
            "count": len(students),
            "search_term": search_term,
            "user_type": user_type
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

@student_update_bp.route('/api/students/stats', methods=['GET'])
def get_student_stats():
    """Get student statistics (admin/teacher only)"""
    db = current_app.config.get("DB")
    students_col = db.students
    
    try:
        user_type = request.headers.get('X-User-Type')
        
        if user_type not in ['teacher', 'admin']:
            return jsonify({
                "success": False, 
                "error": "Unauthorized: Teacher/Admin access required"
            }), 403
        
        # Basic stats
        total_students = students_col.count_documents({})
        
        # Students by department
        dept_pipeline = [
            {"$group": {"_id": "$department", "count": {"$sum": 1}}},
            {"$sort": {"count": -1}}
        ]
        dept_stats = list(students_col.aggregate(dept_pipeline))
        
        # Students by year
        year_pipeline = [
            {"$group": {"_id": "$year", "count": {"$sum": 1}}},
            {"$sort": {"_id": 1}}
        ]
        year_stats = list(students_col.aggregate(year_pipeline))
        
        # Students with face data
        face_registered = students_col.count_documents({"embedding": {"$exists": True, "$ne": None}})
        
        return jsonify({
            "success": True,
            "stats": {
                "total_students": total_students,
                "face_registered": face_registered,
                "by_department": dept_stats,
                "by_year": year_stats
            }
        })
        
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500
