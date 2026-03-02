"use client";

import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowLeft, Play, Square, User, Calendar, BookOpen, GraduationCap, Users, CheckCircle2 } from "lucide-react";
import CameraCapture, { FaceData } from "../../components/CameraCapture";

export default function DemoSessionPage() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionActive, setSessionActive] = useState(false);
  const [recognitionStarted, setRecognitionStarted] = useState(false);
  const [status, setStatus] = useState("");
  const [facesData, setFacesData] = useState<FaceData[]>([]);
  const [recognizedStudents, setRecognizedStudents] = useState<string[]>([]);

  const [form, setForm] = useState({
    date: "",
    subject: "",
    department: "",
    year: "",
    division: "",
  });

  const departments = ["Computer Science", "IT", "Electronics", "Mechanical", "Civil"];
  const years = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
  const divisions = ["A", "B", "C", "D"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const createSession = async () => {
    if (!form.date || !form.subject || !form.department || !form.year || !form.division) {
      setStatus("Please fill all fields");
      return;
    }

    setStatus("Creating session...");
    try {
      const res = await fetch("http://localhost:5000/api/attendance/create_session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.session_id) {
        setSessionId(data.session_id);
        setStatus("✅ Session created! Click Start Recognition.");
        setSessionActive(true);
      } else {
        setStatus("❌ Failed to create session");
      }
    } catch (err) {
      console.error(err);
      setStatus("❌ Error creating session");
    }
  };

  const handleRecognize = useCallback(
    async (imageDataUrl: string) => {
      // Build payload: include session_id when available, otherwise include filters for demo recognition
      const payload: any = { image: imageDataUrl };
      if (sessionId) payload.session_id = sessionId;
      else {
        // include optional filters from the form for candidate narrowing
        if (form.department) payload.department = form.department;
        if (form.year) payload.year = form.year;
        if (form.division) payload.division = form.division;
      }

      try {
        const res = await fetch("http://localhost:5000/api/attendance/real-mark", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (data.faces && data.faces.length > 0) {
          const face = data.faces[0];
          if (face.match) {
            setStatus(`✅ Recognized ${face.match.name}`);
            setRecognizedStudents((prev) => (prev.includes(face.match.name) ? prev : [...prev, face.match.name]));
          } else {
            setStatus("❌ Face not recognized");
          }
          setFacesData(data.faces.map((f: FaceData) => ({ box: f.box, match: f.match })));
        } else {
          setStatus("❌ No faces detected");
          setFacesData([]);
        }
      } catch (err) {
        console.error(err);
        setStatus("❌ Recognition failed");
        setFacesData([]);
      }
    },
    [sessionId, form]
  );

  const handleStartRecognition = () => {
    setRecognitionStarted(true);
    setStatus("Starting live recognition...");
  };

  const handleStopRecognition = () => {
    setRecognitionStarted(false);
    setStatus("Recognition stopped");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-4 -right-4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float"></div>
        <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-pink-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-float" style={{ animationDelay: "4s" }}></div>
      </div>

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 relative z-10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/teacher/dashboard")}
                className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors group"
              >
                <ArrowLeft className="w-6 h-6 text-gray-600 group-hover:text-gray-800 transition-colors" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <Camera className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Attendance Session</h1>
                  <p className="text-gray-600 text-sm">Live face recognition attendance</p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                recognitionStarted 
                  ? "bg-green-100 border border-green-300" 
                  : "bg-gray-100 border border-gray-300"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  recognitionStarted ? "bg-green-600 animate-pulse" : "bg-gray-400"
                }`} />
                <span className={`text-sm font-medium ${
                  recognitionStarted ? "text-green-700" : "text-gray-600"
                }`}>
                  {recognitionStarted ? "LIVE" : "SETUP"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls */}
      <div className="px-6 py-4 border-b border-gray-200/50 bg-white/60 backdrop-blur-lg relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Left Controls */}
            <div className="flex flex-wrap gap-3">
              {sessionId && recognitionStarted && (
                <button
                  onClick={handleStopRecognition}
                  className="px-6 py-3 rounded-lg font-semibold bg-red-100 hover:bg-red-200 text-red-700 border-2 border-red-300 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Square className="w-5 h-5" />
                  Stop Recognition
                </button>
              )}

              {/* Demo recognition: start without creating a session */}
              {!sessionId && !recognitionStarted && (
                <button
                  onClick={() => {
                    setSessionActive(false);
                    setRecognitionStarted(true);
                    setStatus("Starting demo recognition...");
                  }}
                  className="px-6 py-3 rounded-lg font-semibold bg-green-100 hover:bg-green-200 text-green-700 border-2 border-green-300 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md hover:-translate-y-0.5"
                >
                  <Play className="w-5 h-5" />
                  Start Demo Recognition
                </button>
              )}

              <button
                onClick={() => router.push("/teacher/dashboard")}
                className="px-6 py-3 rounded-lg font-semibold bg-blue-100 hover:bg-blue-200 text-blue-700 border-2 border-blue-300 transition-all duration-300 flex items-center justify-center gap-3 hover:shadow-md hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>

            {/* Right Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 border border-gray-200">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${
                  recognitionStarted ? "text-green-600" : 
                  sessionId ? "text-amber-600" : "text-gray-600"
                }`}>
                  {recognitionStarted ? "Active" : sessionId ? "Ready" : "Setup"}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/70 border border-gray-200">
                <span className="text-gray-600">Students:</span>
                <span className="font-medium text-gray-800">
                  {recognizedStudents.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          {!sessionId ? (
            /* Session Creation Form */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Form Section */}
              <div className="bg-white/70 backdrop-blur-lg rounded-xl border-2 border-blue-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg">
                    <Calendar className="w-5 h-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Create Attendance Session</h2>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-gray-700 text-sm mb-2 block font-medium">Date</label>
                    <input 
                      type="date" 
                      name="date" 
                      value={form.date} 
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/60 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 text-sm mb-2 block font-medium">Subject</label>
                    <input 
                      type="text" 
                      name="subject" 
                      placeholder="Enter subject name"
                      value={form.subject} 
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/60 border border-gray-200 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    />
                  </div>

                  <div>
                    <label className="text-gray-700 text-sm mb-2 block font-medium">Department</label>
                    <select 
                      name="department" 
                      value={form.department} 
                      onChange={handleChange}
                      className="w-full p-3 rounded-lg bg-white/60 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                    >
                      <option value="">Select Department</option>
                      {departments.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-gray-700 text-sm mb-2 block font-medium">Year</label>
                      <select 
                        name="year" 
                        value={form.year} 
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-white/60 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Year</option>
                        {years.map(y => (
                          <option key={y} value={y}>{y}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="text-gray-700 text-sm mb-2 block font-medium">Division</label>
                      <select 
                        name="division" 
                        value={form.division} 
                        onChange={handleChange}
                        className="w-full p-3 rounded-lg bg-white/60 border border-gray-200 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Select Division</option>
                        {divisions.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <button 
                    onClick={createSession}
                    className="w-full py-3 px-4 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 flex items-center justify-center gap-3 mt-6 hover:shadow-lg hover:-translate-y-0.5"
                  >
                    <Calendar className="w-5 h-5" />
                    Create Session
                  </button>

                  {status && (
                    <div className={`p-3 rounded-lg text-center ${
                      status.includes("✅") ? "bg-green-100 border border-green-300 text-green-700" :
                      status.includes("❌") ? "bg-red-100 border border-red-300 text-red-700" :
                      "bg-blue-100 border border-blue-300 text-blue-700"
                    }`}>
                      {status}
                    </div>
                  )}
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-white/70 backdrop-blur-lg rounded-xl border-2 border-purple-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <BookOpen className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">How to Start</h2>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
                    <h4 className="text-gray-800 font-medium mb-2">Session Setup</h4>
                    <ul className="text-gray-600 text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Fill in all the session details
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Click "Create Session" to initialize
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Start face recognition when ready
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                    <h4 className="text-gray-800 font-medium mb-2">During Session</h4>
                    <ul className="text-gray-600 text-sm space-y-2">
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Students face the camera clearly
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        Attendance is marked automatically
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        View recognized students in real-time
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Session Active View */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Camera Section */}
              <div className="bg-white/70 backdrop-blur-lg rounded-xl border-2 border-purple-200 p-6 shadow-lg">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                    <Camera className="w-5 h-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Live Camera Feed</h2>
                </div>

                {!recognitionStarted ? (
                  <div className="text-center py-12 rounded-lg bg-gray-50 border border-gray-200">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Play className="w-10 h-10 text-gray-600" />
                    </div>
                    <p className="text-gray-600 font-medium mb-4">Ready to start recognition</p>
                    <button
                      onClick={handleStartRecognition}
                      className="px-6 py-3 rounded-lg font-semibold bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white transition-all duration-300 flex items-center justify-center gap-3 mx-auto hover:shadow-lg hover:-translate-y-0.5"
                    >
                      <Play className="w-5 h-5" />
                      Start Recognition
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-lg overflow-hidden bg-gray-50 border border-gray-200">
                    <CameraCapture
                      isLiveMode={true}
                      onCapture={handleRecognize}
                      facesData={facesData}
                      captureIntervalMs={2000}
                    />
                  </div>
                )}
              </div>

              {/* Results Section */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className="bg-white/70 backdrop-blur-lg rounded-xl border-2 border-blue-200 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Session Status</h2>
                  </div>

                  <div className={`p-4 rounded-lg border-2 transition-all ${
                    status.includes("✅") ? "bg-green-100 border-green-300" :
                    status.includes("❌") ? "bg-red-100 border-red-300" :
                    "bg-blue-100 border-blue-300"
                  }`}>
                    <p className={`font-semibold text-center ${
                      status.includes("✅") ? "text-green-700" :
                      status.includes("❌") ? "text-red-700" :
                      "text-blue-700"
                    }`}>
                      {status || "Waiting for recognition..."}
                    </p>
                  </div>
                </div>

                {/* Recognized Students */}
                <div className="bg-white/70 backdrop-blur-lg rounded-xl border-2 border-green-200 p-6 shadow-lg">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">Recognized Students</h2>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-sm rounded-lg">
                      {recognizedStudents.length}
                    </span>
                  </div>

                  {recognizedStudents.length > 0 ? (
                    <div className="max-h-64 overflow-y-auto">
                      <div className="space-y-2">
                        {recognizedStudents.map((student, index) => (
                          <div
                            key={student}
                            className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors"
                          >
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <CheckCircle2 className="w-4 h-4 text-green-600" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-gray-800 font-medium truncate">{student}</p>
                              <p className="text-green-600 text-xs">Attendance marked</p>
                            </div>
                            <div className="text-gray-500 text-sm flex-shrink-0">
                              #{index + 1}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 rounded-lg bg-gray-50 border border-gray-200">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600">No students recognized yet</p>
                      <p className="text-gray-500 text-sm mt-1">Students will appear here when recognized</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}