"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  UserPlus, 
  Mail, 
  Lock, 
  User, 
  GraduationCap, 
  BookOpen,
  ArrowLeft,
  Home,
  LogIn
} from "lucide-react";

export default function SignUpPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    userType: "student"
  });
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus("Registering...");

    try {
      const res = await fetch("http://127.0.0.1:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();

      if (data.success) {
        setStatus("Registration successful! Redirecting...");
        setTimeout(() => router.push("/signin"), 1500);
      } else {
        setStatus(data.error || "Registration failed");
      }
    } catch {
      setStatus("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-30">
        <div className="absolute -top-40 -right-32 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b-2 border-slate-200 relative z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/")}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border-2 border-slate-300 hover:scale-105 transform duration-300 shadow-md hover:shadow-lg"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Back to Home</span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-lg">
                  <UserPlus className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">Join Us Today</h1>
                  <p className="text-slate-600 text-sm font-medium">Create your account to get started</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all border-2 border-slate-300 hover:scale-105 transform duration-300 shadow-md hover:shadow-lg"
            >
              <Home className="w-5 h-5" />
              <span className="font-medium">Home</span>
            </button>
          </div>
        </div>
      </header>

      <main className="flex items-center justify-center p-4 sm:p-6 relative z-10">
        <div className="w-full max-w-md">
          {/* Sign Up Form */}
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 sm:p-8 border-2 border-slate-200 shadow-xl mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* User Type Selection */}
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <label className="block text-slate-700 text-sm font-semibold mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-purple-600" />
                  Sign up as:
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

              {/* Username Input */}
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-2">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    name="username"
                    type="text"
                    placeholder="Choose a unique username"
                    required
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
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
                    placeholder="Enter your email address"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
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
                    type="password"
                    placeholder="Create a strong password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
                  />
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 shadow-lg hover:shadow-xl ${
                  formData.userType === 'teacher' 
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700'
                } text-white`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Create {formData.userType === 'teacher' ? 'Teacher' : 'Student'} Account
                  </>
                )}
              </button>
            </form>

            {/* Status Message */}
            {status && (
              <div className={`mt-6 p-4 rounded-xl text-center border-2 transition-all duration-300 ${
                status.includes("successful") 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : status.includes("Error") || status.includes("failed")
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-purple-50 text-purple-700 border-purple-200"
              }`}>
                {status}
              </div>
            )}

            {/* Sign In Link */}
            <div className="mt-6 pt-6 border-t border-slate-200 text-center">
              <button
                onClick={() => router.push("/signin")}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors font-semibold hover:scale-105 transform duration-300"
              >
                <LogIn className="w-4 h-4" />
                Already have an account? Sign in
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
      </main>
    </div>
  );
}