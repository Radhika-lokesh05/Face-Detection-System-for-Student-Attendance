"use client";

import React, { useRef, useEffect, useState } from "react";

export interface MultiCameraCaptureProps {
  onCapture: (images: string[]) => void; // Returns array of 5 captured images
}

const directions = ["Front", "Left", "Right", "Up", "Down"];

const MultiCameraCapture: React.FC<MultiCameraCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraStatus, setCameraStatus] = useState<"loading" | "active" | "stopped">("stopped");
  const [cameraError, setCameraError] = useState<string>("");
  const [currentStep, setCurrentStep] = useState(0);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  // Start camera
  const startCamera = async () => {
    try {
      setCameraStatus("loading");
      setCameraError("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: "user" }
      });

      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraStatus("active");
    } catch (err) {
      console.error("Error accessing camera:", err);
      setCameraError("Failed to access camera. Please check permissions.");
      setCameraStatus("stopped");
    }
  };

  // Stop camera
  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setCameraStatus("stopped");
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
  }, []);

  const captureImage = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || cameraStatus !== "active") return;

    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const dataUrl = canvas.toDataURL("image/jpeg", 0.8);

    const updatedImages = [...capturedImages, dataUrl];
    setCapturedImages(updatedImages);
    setCurrentStep(currentStep + 1);

    if (updatedImages.length === directions.length) {
      onCapture(updatedImages); // Send all 5 images to parent
    }
  };

  return (
    <div className="flex flex-col items-center space-y-4">
      {/* Camera Status */}
      <div className="flex items-center space-x-2 text-sm">
        <div
          className={`w-3 h-3 rounded-full ${
            cameraStatus === "active"
              ? "bg-green-500"
              : cameraStatus === "loading"
              ? "bg-yellow-500 animate-pulse"
              : "bg-red-500"
          }`}
        ></div>
        <span className="text-gray-600">
          {cameraStatus === "active"
            ? "Camera Active"
            : cameraStatus === "loading"
            ? "Starting Camera..."
            : "Camera Stopped"}
        </span>
      </div>

      {/* Video */}
      <div className="relative">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`rounded-lg shadow-md w-full max-w-md ${
            cameraStatus === "active" ? "block" : "hidden"
          }`}
          style={{ maxHeight: "360px" }}
        />

        {cameraStatus === "loading" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600">Starting camera...</p>
            </div>
          </div>
        )}

        {cameraStatus === "stopped" && (
          <div className="flex items-center justify-center bg-gray-100 rounded-lg w-full max-w-md h-60">
            <p className="text-gray-600">Camera is stopped</p>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />

      {cameraError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="text-sm">{cameraError}</p>
          <button
            onClick={startCamera}
            className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {cameraStatus === "active" && currentStep < directions.length && (
        <div className="text-center text-white space-y-2">
          <p className="text-lg">
            Please look: <span className="font-bold">{directions[currentStep]}</span>
          </p>
          <button
            onClick={captureImage}
            className="px-6 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Capture
          </button>
        </div>
      )}

      {currentStep >= directions.length && (
        <div className="text-center text-green-400">
          <p>✅ All 5 images captured successfully!</p>
        </div>
      )}
    </div>
  );
};

export default MultiCameraCapture;
