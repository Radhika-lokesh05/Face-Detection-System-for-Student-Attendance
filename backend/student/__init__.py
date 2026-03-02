# This file makes the student directory a Python package
from .registration import student_registration_bp
from .updatedetails import student_update_bp
from .demo_session import demo_session_bp
from .view_attendance import attendance_bp

__all__ = [
    'student_registration_bp',
    'student_update_bp', 
    'demo_session_bp',
    'attendance_bp'
]
