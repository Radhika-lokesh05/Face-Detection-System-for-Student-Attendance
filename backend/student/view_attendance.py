from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
import time

attendance_bp = Blueprint("attendance", __name__)

# ------------------------- GET ATTENDANCE -------------------------
@attendance_bp.route('/api/attendance', methods=['GET'])
def get_attendance():
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records
    students_col = db.students

    date = request.args.get('date')
    department = request.args.get('department')
    year = request.args.get('year')
    division = request.args.get('division')
    subject = request.args.get('subject')
    student_id = request.args.get('student_id')

    try:
        # Query attendance collection
        query = {}
        if date: query["date"] = date
        if department: query["department"] = department
        if year: query["year"] = year
        if division: query["division"] = division
        if subject: query["subject"] = subject

        attendance_doc = attendance_col.find_one(query)

        # Build roster from students collection for given class filters
        roster_filter = {}
        if department: roster_filter["department"] = department
        if year: roster_filter["year"] = year
        if division: roster_filter["division"] = division

        roster = list(students_col.find(roster_filter)) if roster_filter else []

        # Map session students by id for quick lookup
        session_map = {}
        if attendance_doc:
            for s in attendance_doc.get("students", []):
                sid = s.get("student_id")
                session_map[sid] = s

        attendance_list = []
        seen_students = set()

        # Merge roster and session students: show present and absent
        for student in roster:
            sid = student.get("studentId") or student.get("student_id")
            if not sid or sid in seen_students:
                continue
            seen_students.add(sid)
            # Apply student_id filter if provided
            if student_id and sid != student_id:
                continue

            sess = session_map.get(sid, None)
            if sess:
                present = bool(sess.get("present"))
                marked_at = sess.get("marked_at")
                # Ensure marked_at is JSON-serializable (string)
                if marked_at is not None:
                    try:
                        # If it's a datetime from Mongo, convert to ISO
                        marked_at = marked_at.isoformat()
                    except Exception:
                        # Fallback to str()
                        marked_at = str(marked_at)
            else:
                present = False
                marked_at = None

                attendance_list.append({
                    "studentId": str(sid) if sid is not None else "",
                    "studentName": student.get("studentName") or student.get("student_name"),
                    "date": str(attendance_doc.get("date")) if attendance_doc else str(date),
                    "subject": str(attendance_doc.get("subject")) if attendance_doc else str(subject),
                    "department": str(attendance_doc.get("department")) if attendance_doc else str(department),
                    "year": str(attendance_doc.get("year")) if attendance_doc else str(year),
                    "division": str(attendance_doc.get("division")) if attendance_doc else str(division),
                    "status": "present" if present else "absent",
                    "markedAt": marked_at
                })

        # Also include any session-only students not in roster (fallback)
        if attendance_doc:
            for s in attendance_doc.get("students", []):
                sid = s.get("student_id")
                if sid in seen_students:
                    continue
                if student_id and sid != student_id:
                    continue
                seen_students.add(sid)
                # Convert any datetime in s.get('marked_at') to string
                marked = s.get("marked_at")
                if marked is not None:
                    try:
                        marked = marked.isoformat()
                    except Exception:
                        marked = str(marked)

                attendance_list.append({
                    "studentId": str(sid) if sid is not None else "",
                    "studentName": s.get("student_name"),
                    "date": str(attendance_doc.get("date")),
                    "subject": str(attendance_doc.get("subject")),
                    "department": str(attendance_doc.get("department")),
                    "year": str(attendance_doc.get("year")),
                    "division": str(attendance_doc.get("division")),
                    "status": "present" if s.get("present") else "absent",
                    "markedAt": marked
                })

        # Stats computed against roster size
        student_filter = roster_filter
        total_students = students_col.count_documents(student_filter) if student_filter else 0
        present_count = sum(1 for r in attendance_list if r.get("status") == "present")
        absent_count = max(total_students - present_count, 0)
        attendance_rate = round((present_count / total_students * 100) if total_students > 0 else 0, 1)

        return jsonify({
            "success": True,
            "attendance": attendance_list,
            "stats": {
                "totalStudents": total_students,
                "presentToday": present_count,
                "absentToday": absent_count,
                "attendanceRate": attendance_rate
            }
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


# ------------------------- EXPORT TO EXCEL -------------------------
@attendance_bp.route('/api/attendance/export', methods=['GET'])
def export_attendance():
    db = current_app.config.get("DB")
    attendance_col = db.attendance_records
    students_col = db.students

    date = request.args.get('date')
    department = request.args.get('department')
    year = request.args.get('year')
    division = request.args.get('division')
    subject = request.args.get('subject')

    try:
        # Get attendance doc
        query = {}
        if date: query["date"] = date
        if department: query["department"] = department
        if year: query["year"] = year
        if division: query["division"] = division
        if subject: query["subject"] = subject

        attendance_doc = attendance_col.find_one(query)
        present_students = set()

        if attendance_doc:
            for student in attendance_doc.get("students", []):
                present_students.add(student.get("student_id"))

        # Get all students in that class
        student_filter = {}
        if department: student_filter["department"] = department
        if year: student_filter["year"] = year
        if division: student_filter["division"] = division

        students = list(students_col.find(student_filter))
        export_data = []

        for student in students:
            sid = student.get("studentId") or student.get("student_id")
            name = student.get("studentName") or student.get("student_name")
            status = "present" if sid in present_students else "absent"
            export_data.append({
                "studentId": str(sid) if sid is not None else "",
                "name": name,
                "subject": str(subject) if subject else "N/A",
                "date": str(date) if date else "N/A",
                "status": status
            })

        return jsonify({"success": True, "data": export_data})

    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500