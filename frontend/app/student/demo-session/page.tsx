"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Camera, ArrowLeft, Play, Square, User, BarChart3 } from "lucide-react";
import CameraCapture, { FaceData } from "../../components/CameraCapture";

interface RecognizeResult {
  match: { user_id: string; name: string } | null;
  distance: number | null;
  confidence?: number;
  box?: [number, number, number, number];
}

export default function DemoSession() {
  const router = useRouter();
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [lastResult, setLastResult] = useState<RecognizeResult | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);

  const handleRecognize = useCallback(async (dataUrl: string) => {
    if (!isLiveActive) return;

    try {
      const res = await fetch("http://127.0.0.1:5000/api/demo/recognize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });
      const data = await res.json();

      if (data.success && data.faces && data.faces.length > 0) {
        const face = data.faces[0];
        setLastResult(face);
        setProcessedImage(data.processed_image || null);
      } else {
        setLastResult(null);
        setProcessedImage(null);
      }
    } catch (err) {
      console.error(err);
    }
  }, [isLiveActive]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-slate-200 shadow-sm">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push("/dashboard")}
                className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors group"
              >
                <ArrowLeft className="w-6 h-6 text-slate-600 group-hover:text-slate-800 transition-colors" />
              </button>
              
              <div className="flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight">Face Recognition Demo</h1>
                  <p className="text-slate-600 text-sm font-medium">Live demonstration and testing</p>
                </div>
              </div>
            </div>

            {/* Status Indicator */}
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
                isLiveActive 
                  ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                  : "bg-slate-100 border-slate-200"
              }`}>
                <div className={`w-2 h-2 rounded-full ${
                  isLiveActive ? "bg-emerald-500 animate-pulse" : "bg-slate-400"
                }`} />
                <span className={`text-sm font-semibold ${
                  isLiveActive ? "text-emerald-700" : "text-slate-600"
                }`}>
                  {isLiveActive ? "LIVE" : "STANDBY"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Controls - Moved Above */}
      <div className="px-4 sm:px-6 py-4 bg-white/50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            {/* Left Controls */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setIsLiveActive(!isLiveActive)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-3 border-2 ${
                  isLiveActive 
                    ? "bg-red-50 hover:bg-red-100 text-red-600 border-red-200 hover:border-red-300 shadow-sm" 
                    : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border-emerald-200 hover:border-emerald-300 shadow-sm"
                }`}
              >
                {isLiveActive ? (
                  <>
                    <Square className="w-5 h-5" />
                    Stop Demo
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" />
                    Start Demo
                  </>
                )}
              </button>

              <button
                onClick={() => router.push("/dashboard")}
                className="px-6 py-3 rounded-xl font-semibold bg-blue-50 hover:bg-blue-100 text-blue-600 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Dashboard
              </button>
            </div>

            {/* Right Stats */}
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-600 font-medium">Status:</span>
                <span className={`font-semibold ${
                  isLiveActive ? "text-emerald-600" : "text-amber-600"
                }`}>
                  {isLiveActive ? "Active" : "Inactive"}
                </span>
              </div>
              
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm">
                <span className="text-slate-600 font-medium">Last Result:</span>
                <span className={`font-semibold ${
                  lastResult?.match ? "text-emerald-600" : "text-slate-600"
                }`}>
                  {lastResult?.match ? "Match Found" : "No Match"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Camera and Results Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-8">
            {/* Camera Feed */}
            <div className="bg-white rounded-2xl border-2 border-purple-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Camera Feed</h2>
              </div>
              
              <div className="relative rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200">
                <CameraCapture
                  isLiveMode={isLiveActive}
                  captureIntervalMs={1000}
                  onCapture={handleRecognize}
                  facesData={
                    lastResult && lastResult.box
                      ? [{
                          ...lastResult,
                          box: lastResult.box
                        }]
                      : []
                  }
                />
                
                {/* Overlay Status */}
                {!isLiveActive && (
                  <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center backdrop-blur-sm">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                        <Play className="w-8 h-8 text-slate-600" />
                      </div>
                      <p className="text-white font-semibold">Click Start Demo to begin</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Results Panel */}
            <div className="bg-white rounded-2xl border-2 border-blue-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold text-slate-800">Recognition Results</h2>
              </div>

              {/* Results Content */}
              <div className="space-y-6">
                {/* Status Card */}
                <div className={`p-4 rounded-xl border-2 transition-all ${
                  lastResult?.match 
                    ? "bg-emerald-50 border-emerald-200 shadow-sm" 
                    : "bg-slate-50 border-slate-200"
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-slate-600 text-sm font-medium">Status</span>
                    <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      lastResult?.match 
                        ? "bg-emerald-100 text-emerald-700 border border-emerald-200" 
                        : "bg-slate-100 text-slate-600 border border-slate-200"
                    }`}>
                      {lastResult?.match ? "MATCH FOUND" : "NO MATCH"}
                    </div>
                  </div>
                  <p className="text-slate-800 font-bold">
                    {lastResult?.match 
                      ? `Identified: ${lastResult.match.name}` 
                      : "No face recognized"}
                  </p>
                </div>

                {/* User Info - Only shown when match is found */}
                {lastResult?.match && (
                  <div className="p-4 rounded-xl bg-blue-50 border-2 border-blue-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500 rounded-lg">
                        <User className="w-5 h-5 text-white" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">User Information</h3>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <span className="text-slate-600 text-sm font-medium">Name:</span>
                        <p className="text-slate-800 font-semibold">{lastResult.match.name}</p>
                      </div>
                      <div>
                        <span className="text-slate-600 text-sm font-medium">User ID:</span>
                        <p className="text-slate-800 font-mono text-sm bg-slate-100 px-2 py-1 rounded">{lastResult.match.user_id}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* No Match State */}
                {!lastResult?.match && isLiveActive && (
                  <div className="p-6 rounded-xl bg-slate-50 border-2 border-slate-200">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-3">
                        <User className="w-6 h-6 text-slate-500" />
                      </div>
                      <p className="text-slate-700 font-semibold">No face recognized</p>
                      <p className="text-slate-500 text-sm mt-1">Ensure face is clearly visible in camera</p>
                    </div>
                  </div>
                )}

                {/* Instructions */}
                <div className="p-4 rounded-xl bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-slate-200">
                  <h4 className="text-slate-800 font-bold mb-3">How it works:</h4>
                  <ul className="text-slate-600 text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Click "Start Demo" to begin face recognition
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Position your face clearly in the camera view
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Results will appear here in real-time
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                      Click "Stop Demo" to end the session
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Processed Image Section */}
          {processedImage && (
            <div className="bg-white rounded-2xl border-2 border-cyan-200 p-6 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl shadow-lg">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-slate-800">Processed Image</h3>
              </div>
              
              <div className="flex justify-center">
                <div className="rounded-xl overflow-hidden bg-slate-100 border-2 border-slate-200 max-w-2xl shadow-lg">
                  <img 
                    src={processedImage} 
                    alt="Processed" 
                    className="w-full h-auto max-h-96 object-contain"
                  />
                </div>
              </div>
              
              <p className="text-slate-600 text-sm mt-4 text-center">
                AI-processed image with face detection and recognition overlay
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}