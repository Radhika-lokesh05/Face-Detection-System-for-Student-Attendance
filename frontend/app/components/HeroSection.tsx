"use client";

import Link from "next/link";
import { ArrowRight, Camera, Shield, Clock, Users, CheckCircle, Star, Zap } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = ["Real-time Recognition", "Secure Data", "Easy Integration", "24/7 Support"];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-32 w-96 h-96 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse animation-delay-4000"></div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/10 rounded-full animate-float"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-purple-500/10 rounded-full animate-float animation-delay-1000"></div>
        <div className="absolute bottom-40 left-20 w-24 h-24 bg-emerald-500/10 rounded-full animate-float animation-delay-2000"></div>
        <div className="absolute bottom-20 right-10 w-12 h-12 bg-pink-500/10 rounded-full animate-float animation-delay-3000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className={`space-y-8 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-full text-blue-700 font-semibold text-sm animate-bounce-gentle">
              <Star className="w-4 h-4 text-yellow-500 fill-current" />
              <span>Revolutionary Face Recognition Technology</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>

            {/* Main Heading */}
            <div className="space-y-6">
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-slate-900 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Future of
                </span>
                <br />
                <span className="relative">
                  Attendance
                  <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transform scale-x-0 animate-scale-x"></div>
                </span>
              </h1>
              
              <p className="text-xl sm:text-2xl text-slate-600 leading-relaxed max-w-2xl font-medium">
                Transform your attendance management with cutting-edge AI technology. 
                <span className="text-blue-600 font-semibold"> Secure</span>, 
                <span className="text-emerald-600 font-semibold"> Fast</span>, and 
                <span className="text-purple-600 font-semibold"> Reliable</span>.
              </p>
            </div>

            {/* Dynamic Feature Display */}
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-slate-200 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-slate-600 text-sm font-medium">Currently featuring:</p>
                  <p className="text-2xl font-bold text-slate-800 transition-all duration-500">
                    {features[currentFeature]}
                  </p>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/signup"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-lg font-bold rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
              >
                <span className="relative z-10">Get Started Free</span>
                <ArrowRight className="w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </Link>
              
              <Link
                href="/student/demo-session"
                className="group flex items-center justify-center gap-3 px-8 py-4 bg-white/80 backdrop-blur-lg text-slate-700 text-lg font-bold rounded-2xl border-2 border-slate-300 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 hover:bg-slate-50"
              >
                <Camera className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                Try Live Demo
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex items-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span className="text-slate-600 font-medium">Enterprise Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <span className="text-slate-600 font-medium">Real-time Processing</span>
              </div>
            </div>
          </div>

          {/* Right Visual */}
          <div className={`relative lg:h-[600px] transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            {/* Main Illustration Container */}
            <div className="relative h-full bg-gradient-to-br from-white/50 to-blue-50/50 backdrop-blur-lg rounded-3xl border-2 border-white/20 shadow-2xl overflow-hidden">
              {/* Animated Stats Cards */}
              <div className="absolute top-8 right-8 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Recognition Rate</p>
                    <p className="text-lg font-bold text-slate-800">99.8%</p>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-lg p-4 rounded-xl shadow-lg border border-white/20 animate-float animation-delay-1000">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                  <div>
                    <p className="text-xs text-slate-600 font-medium">Processing Time</p>
                    <p className="text-lg font-bold text-slate-800">&lt; 0.5s</p>
                  </div>
                </div>
              </div>

              {/* Central Visual Element */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  {/* Main Circle */}
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                    <div className="w-48 h-48 bg-gradient-to-br from-white to-blue-50 rounded-full flex items-center justify-center">
                      <Camera className="w-20 h-20 text-blue-600 animate-bounce-gentle" />
                    </div>
                  </div>
                  
                  {/* Orbiting Elements */}
                  <div className="absolute inset-0 animate-spin-slow">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-emerald-500 rounded-full shadow-lg"></div>
                    <div className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-6 h-6 bg-purple-500 rounded-full shadow-lg"></div>
                    <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-8 bg-pink-500 rounded-full shadow-lg"></div>
                    <div className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-6 h-6 bg-yellow-500 rounded-full shadow-lg"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-slate-400 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-slate-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
}