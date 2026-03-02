"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Users, 
  Edit3, 
  Camera, 
  BarChart3, 
  LogOut,
  Menu,
  X
} from "lucide-react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [teacherName, setTeacherName] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeCard, setActiveCard] = useState<number | null>(null);

  useEffect(() => {
    const checkStatus = () => {
      try {
        const loggedIn = localStorage.getItem("isLoggedIn");
        const userType = localStorage.getItem("userType");
        const name = localStorage.getItem("username");
        const empId = localStorage.getItem("employeeId");

        if (!loggedIn || loggedIn !== "true" || userType !== "teacher") {
          setIsLoggedIn(false);
          router.push("/signin");
        } else {
          setIsLoggedIn(true);
          setTeacherName(name || "");
          setEmployeeId(empId || "");
          setLoading(false);
        }
      } catch {
        setIsLoggedIn(false);
        router.push("/signin");
      }
    };

    const timeoutId = setTimeout(checkStatus, 100);
    return () => clearTimeout(timeoutId);
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("http://127.0.0.1:5000/api/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch {
      // Ignore errors on logout
    }

    localStorage.clear();
    router.push("/");
  };

  const teacherMenuItems = [
    {
      title: "Student Registration",
      description: "Register new students with complete details and face recognition setup",
      icon: <Users className="w-7 h-7" />,
      path: "/student/registrationform",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      borderColor: "border-blue-200 hover:border-blue-300"
    },
    {
      title: "Update Student Details",
      description: "Modify existing student information and profile settings",
      icon: <Edit3 className="w-7 h-7" />,
      path: "/student/updatedetails",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
      borderColor: "border-emerald-200 hover:border-emerald-300"
    },
    {
      title: "Start Teaching Session",
      description: "Begin a live attendance session with face recognition",
      icon: <Camera className="w-7 h-7" />,
      path: "/teacher/start-session",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      borderColor: "border-purple-200 hover:border-purple-300"
    },
    {
      title: "Attendance Records",
      description: "View comprehensive attendance statistics and reports",
      icon: <BarChart3 className="w-7 h-7" />,
      path: "/student/view-attendance",
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 hover:bg-amber-100",
      borderColor: "border-amber-200 hover:border-amber-300"
    }
  ];

  if (isLoggedIn === null || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-500 mx-auto mb-4"></div>
          <p className="text-xl text-slate-700 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (isLoggedIn === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6 text-slate-700" /> : <Menu className="w-6 h-6 text-slate-700" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Teacher Dashboard</h1>
                  <p className="text-slate-600 text-sm font-medium">Welcome back, {teacherName}</p>
                  {employeeId && <p className="text-slate-500 text-xs">ID: {employeeId}</p>}
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors border border-red-200 hover:border-red-300"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-lg border-b border-slate-200 shadow-lg">
          <div className="px-4 sm:px-6 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {teacherMenuItems.map((item, idx) => (
                <div 
                  key={idx}
                  onClick={() => {
                    router.push(item.path);
                    setMobileMenuOpen(false);
                  }}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-md ${item.bgColor} ${item.borderColor}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-gradient-to-br ${item.color} shadow-sm`}>
                      <div className="text-white">
                        {item.icon}
                      </div>
                    </div>
                    <span className="text-slate-700 font-semibold text-sm">{item.title}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Welcome Message */}
          <div className="mb-12 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Teacher Dashboard</span>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-3 tracking-tight">
              Teacher Management Hub
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
              Manage student registrations, conduct sessions, and monitor attendance with advanced face recognition technology
            </p>
          </div>

          {/* Teacher Management Tools Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teacherMenuItems.map((item, idx) => (
              <div
                key={idx}
                onMouseEnter={() => setActiveCard(idx)}
                onMouseLeave={() => setActiveCard(null)}
                onClick={() => router.push(item.path)}
                className={`relative p-6 rounded-2xl border-2 transition-all duration-500 cursor-pointer group overflow-hidden bg-white hover:shadow-xl ${
                  item.borderColor
                } ${
                  activeCard === idx ? 'scale-105 shadow-xl -translate-y-1' : 'hover:scale-105 hover:-translate-y-1'
                }`}
              >
                {/* Animated Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  <div className={`p-4 rounded-xl bg-gradient-to-br ${item.color} w-fit mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white">
                      {item.icon}
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h4>
                  
                  <p className="text-slate-600 text-sm mb-6 leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  
                  <div className={`inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r ${item.color} text-white font-semibold text-sm transition-all duration-300 group-hover:gap-3 group-hover:shadow-lg group-hover:scale-105`}>
                    Get Started
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-10 group-hover:opacity-20 transition-opacity"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
