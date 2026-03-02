"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  LogIn, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  BookOpen,
  Eye,
  EyeOff,
  UserPlus
} from "lucide-react";

export default function SignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    email: "", 
    password: "",
    userType: "student" // Default to student
  });
  const [status, setStatus] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Signing in...");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          userType: formData.userType
        }),
      });

      const data = await res.json();

      if (data.success) {
        setStatus("Login successful! Redirecting...");
        
        // Store login state and user info in localStorage
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("userType", formData.userType); // ✅ fixed consistency
        
        if (data.user) {
          localStorage.setItem("username", data.user.username || data.user.name || "");
          localStorage.setItem("userId", data.user._id || "");

          // Store teacher-specific info if applicable
          if (formData.userType === "teacher" && data.user.employeeId) {
            localStorage.setItem("employeeId", data.user.employeeId);
          }

          // Store student-specific info if applicable  
          if (formData.userType === "student" && data.user.studentId) {
            localStorage.setItem("studentId", data.user.studentId);
          }
        }

        // Redirect to appropriate dashboard based on user type
        setTimeout(() => {
          if (formData.userType === "teacher") {
            router.push("/teacher/dashboard");
          } else {
            router.push("/dashboard");
          }
        }, 1000);
      } else {
        setStatus(data.error || "Invalid credentials");
      }
    } catch {
      setStatus("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <LogIn className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Welcome Back</h1>
          </div>
          <p className="text-slate-600 text-sm font-medium">Sign in to your account to continue</p>
        </div>

        {/* Sign In Form */}
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <label className="block text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Sign in as:
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: "student" }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold hover:scale-105 ${
                    formData.userType === "student" 
                      ? "bg-blue-50 border-blue-300 text-blue-700 shadow-lg" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, userType: "teacher" }))}
                  className={`p-3 rounded-xl border-2 transition-all duration-300 flex items-center justify-center gap-2 text-sm font-semibold hover:scale-105 ${
                    formData.userType === "teacher" 
                      ? "bg-emerald-50 border-emerald-300 text-emerald-700 shadow-lg" 
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  Teacher
                </button>
              </div>
            </div>

            {/* Email Input */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="email"
                  type="email"
                  placeholder={`Enter your ${formData.userType} email`}
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-slate-700 text-sm font-semibold mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-12 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                formData.userType === 'teacher' 
                  ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                  : 'bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700'
              } text-white`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Signing In...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5" />
                  Sign In as {formData.userType === 'teacher' ? 'Teacher' : 'Student'}
                </>
              )}
            </button>
          </form>

          {/* Status Message */}
          {status && (
            <div className={`mt-6 p-4 rounded-xl text-center border-2 transition-all duration-300 ${
              status.includes("successful") 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                : status.includes("Error") || status.includes("Invalid") 
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-blue-50 text-blue-700 border-blue-200"
            }`}>
              {status}
            </div>
          )}

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-slate-200 text-center">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors font-semibold hover:scale-105 transform duration-300"
            >
              <UserPlus className="w-4 h-4" />
              Create new account
            </button>
          </div>
        </div>

        {/* Demo Info */}
        <div className="mt-6 text-center">
          <p className="text-slate-500 text-sm font-medium">
            Face Recognition Attendance System
          </p>
        </div>
      </div>
    </div>
  );
}
