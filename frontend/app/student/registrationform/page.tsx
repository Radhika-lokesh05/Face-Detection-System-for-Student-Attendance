"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import MultiCameraCapture from "../../components/MultiCameraCapture";
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Building, 
  Calendar,
  Users,
  BookOpen,
  Camera,
  Home,
  IdCard,
  GraduationCap
} from "lucide-react";

interface StudentData {
  studentName: string;
  studentId: string;
  department: string;
  year: string;
  division: string;
  semester: string;
  email: string;
  phoneNumber: string;
}

export default function StudentRegistrationForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<StudentData>({
    studentName: "",
    studentId: "",
    department: "",
    year: "",
    division: "",
    semester: "",
    email: "",
    phoneNumber: ""
  });
  const [status, setStatus] = useState("");
  const [step, setStep] = useState(1); // 1: Form, 2: Photo Capture
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const [userType, setUserType] = useState<"student" | "teacher">("student");

  const dashboardPath = useMemo(
    () => (userType === "teacher" ? "/teacher/dashboard" : "/dashboard"),
    [userType]
  );

  useEffect(() => {
    try {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      const utype = (localStorage.getItem("userType") as "student" | "teacher") || "student";
      setUserType(utype);

      if (!loggedIn) {
        setIsAuthed(false);
        router.replace("/signin");
      } else {
        setIsAuthed(true);
      }
    } catch {
      setIsAuthed(false);
      router.replace("/signin");
    }
  }, [router]);

  const departments = [
    "Computer Science", "Information Technology", "Electronics", 
    "Mechanical", "Civil", "Electrical", "Chemical", "Biotechnology"
  ];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const divisions = ["A", "B", "C", "D"];
  const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const validateForm = () => {
    const required = Object.values(formData).every(value => value.trim() !== "");
    if (!required) {
      setStatus("Please fill all required fields");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setStatus("Please enter a valid email address");
      return false;
    }
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      setStatus("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
      setStatus("Please capture your 5 photos for face recognition");
    }
  };

  const handlePhotoCapture = async (images: string[]) => {
    setStatus("Registering student...");
    try {
      const headerEmail = (typeof window !== 'undefined' && localStorage.getItem('userEmail')) || formData.email;
      const res = await fetch("http://127.0.0.1:5000/api/register-student", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "X-User-Type": userType,
          "X-User-Email": headerEmail
        },
        body: JSON.stringify({
          ...formData,
          images // send the array of 5 images
        }),
      });
      const data = await res.json();
      
      if (data.success) {
        setStatus(`✅ Student registered successfully! ID: ${formData.studentId}`);
        setTimeout(() => router.replace(dashboardPath), 1200);
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus("❌ Error connecting to server");
    }
  };

  if (isAuthed === null) {
    return (
      <div className="flex items-center justify-center w-full h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600 mx-auto mb-6"></div>
          <p className="text-2xl text-slate-700 font-semibold">Checking access...</p>
          <p className="text-slate-500 mt-2">Please wait while we verify your permissions</p>
        </div>
      </div>
    );
  }

  if (isAuthed === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-4000"></div>
      </div>

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-xl border-b-2 border-slate-200 shadow-lg relative z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg">
              <User className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Student Registration</h1>
              <p className="text-slate-600 text-sm font-medium">
                Step {step} of 2: {step === 1 ? "Student Details" : "Photo Capture"}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <div className={`w-6 h-1.5 rounded-full transition-all duration-500 ${step >= 1 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
                <div className={`w-6 h-1.5 rounded-full transition-all duration-500 ${step >= 2 ? 'bg-blue-500' : 'bg-slate-200'}`}></div>
              </div>
            </div>
          </div>
          <button
            onClick={() => router.push(dashboardPath)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border-2 border-slate-300 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:block">Dashboard</span>
          </button>
        </div>
      </header>

      <main className="p-4 relative z-10 max-h-[calc(100vh-120px)] overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {step === 1 ? (
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-slate-200 shadow-2xl">
              {/* Compact Form Header */}
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl mb-3">
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-700 font-semibold">Student Information</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Register New Student</h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Fill in all required student details to create a comprehensive profile
                </p>
              </div>

              <form onSubmit={handleFormSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Personal Details Card */}
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg shadow-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Personal Details</h3>
                    </div>
                    <div className="space-y-4">
                      <InputField name="studentName" value={formData.studentName} onChange={handleInputChange} icon={User} label="Full Name *" placeholder="Enter student's full name" />
                      <InputField name="studentId" value={formData.studentId} onChange={handleInputChange} icon={IdCard} label="Student ID *" placeholder="Enter unique student ID" />
                      <InputField name="email" value={formData.email} onChange={handleInputChange} icon={Mail} label="Email Address *" placeholder="Enter student's email" type="email" />
                      <InputField name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} icon={Phone} label="Phone Number *" placeholder="Enter 10-digit phone number" type="tel" />
                    </div>
                  </div>

                  {/* Academic Details Card */}
                  <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-emerald-200 shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg shadow-lg">
                        <GraduationCap className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Academic Details</h3>
                    </div>
                    <div className="space-y-4">
                      <SelectField name="department" value={formData.department} onChange={handleInputChange} icon={Building} label="Department *" options={departments} placeholder="Select Department" />
                      <SelectField name="year" value={formData.year} onChange={handleInputChange} icon={Calendar} label="Year *" options={years} placeholder="Select Academic Year" />
                      <SelectField name="division" value={formData.division} onChange={handleInputChange} icon={Users} label="Division *" options={divisions} placeholder="Select Division" prefix="Division " />
                      <SelectField name="semester" value={formData.semester} onChange={handleInputChange} icon={BookOpen} label="Semester *" options={semesters} placeholder="Select Semester" prefix="Semester " />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl group"
                  >
                    <span>Continue to Photo Capture</span>
                    <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                    <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            // Photo Capture Step
            <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-6 border-2 border-slate-200 shadow-2xl">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl mb-3">
                  <Camera className="w-5 h-5 text-purple-600" />
                  <span className="text-purple-700 font-semibold">Photo Capture</span>
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2">Face Recognition Setup</h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Follow the on-screen directions and capture 5 clear photos for accurate face recognition
                </p>
              </div>

              <MultiCameraCapture onCapture={handlePhotoCapture} />

              <div className="mt-6 flex gap-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold border-2 border-slate-300 hover:border-slate-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Back to Form
                </button>
              </div>
            </div>
          )}

          {status && (
            <div className="mt-4 text-center">
              <div className={`inline-block px-6 py-3 rounded-xl font-semibold border-2 transition-all duration-300 ${
                status.includes("✅") 
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                  : status.includes("❌") 
                  ? "bg-red-50 text-red-700 border-red-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}>
                {status}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// ---------------- InputField Component ----------------
interface InputProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon: any;
  label: string;
  placeholder?: string;
  type?: string;
}

const InputField: React.FC<InputProps> = ({ name, value, onChange, icon: Icon, label, placeholder, type = "text" }) => (
  <div className="group">
    <label className="block text-slate-700 text-sm font-semibold mb-2 transition-all duration-300 group-focus-within:text-blue-600">
      {label}
    </label>
    <div className="relative">
      <input
        name={name}
        value={value}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        className="w-full px-4 py-3 pl-12 rounded-lg bg-white border-2 border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all duration-300 font-medium hover:border-slate-300 shadow-sm hover:shadow-md"
      />
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-slate-100 group-focus-within:bg-blue-100 transition-all duration-300">
        <Icon className="w-4 h-4 text-slate-500 group-focus-within:text-blue-600 transition-colors duration-300" />
      </div>
    </div>
  </div>
);

// ---------------- SelectField Component ----------------
interface SelectProps {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  icon: any;
  label: string;
  options: string[];
  placeholder?: string;
  prefix?: string;
}

const SelectField: React.FC<SelectProps> = ({ name, value, onChange, icon: Icon, label, options, placeholder, prefix }) => (
  <div className="group">
    <label className="block text-slate-700 text-sm font-semibold mb-2 transition-all duration-300 group-focus-within:text-emerald-600">
      {label}
    </label>
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-3 pl-12 rounded-lg bg-white border-2 border-slate-200 text-slate-800 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all duration-300 font-medium hover:border-slate-300 shadow-sm hover:shadow-md appearance-none cursor-pointer"
      >
        <option value="" className="text-slate-400">{placeholder || `Select ${label}`}</option>
        {options.map(opt => (
          <option key={opt} value={opt} className="text-slate-800 font-medium">
            {prefix ? `${prefix}${opt}` : opt}
          </option>
        ))}
      </select>
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 p-1 rounded-md bg-slate-100 group-focus-within:bg-emerald-100 transition-all duration-300">
        <Icon className="w-4 h-4 text-slate-500 group-focus-within:text-emerald-600 transition-colors duration-300" />
      </div>
      {/* Custom dropdown arrow */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
        <svg className="w-4 h-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  </div>
);
