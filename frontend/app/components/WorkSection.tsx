"use client";

import { Camera, Database, Brain, Monitor } from "lucide-react";

export default function HowItWorksSection() {
  const steps = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Capture Image",
      description: "User captures a high-quality image via webcam on the registration page with automatic face detection.",
      color: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600",
      step: "01"
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI Processing",
      description: "Advanced deep learning algorithms extract unique facial embeddings with state-of-the-art accuracy.",
      color: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-100", 
      textColor: "text-emerald-600",
      step: "02"
    },
    {
      icon: <Database className="w-8 h-8" />,
      title: "Secure Storage",
      description: "Encrypted facial embeddings are securely stored in MongoDB with enterprise-grade protection.",
      color: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-100",
      textColor: "text-purple-600", 
      step: "03"
    },
    {
      icon: <Monitor className="w-8 h-8" />,
      title: "Live Recognition",
      description: "Real-time webcam feeds are analyzed and matched against stored embeddings for instant identification.",
      color: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-100",
      textColor: "text-amber-600",
      step: "04"
    }
  ];

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">How It Works</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
          Simple Process, Powerful Results
        </h2>
        <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
          Our advanced facial recognition system follows a streamlined four-step process to deliver accurate and secure results.
        </p>
      </div>

      {/* Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {steps.map((step, index) => (
          <div
            key={index}
            className="group relative"
          >
            {/* Connecting Line */}
            {index < steps.length - 1 && (
              <div className="hidden lg:block absolute top-20 left-full w-full h-0.5 bg-gradient-to-r from-slate-300 to-transparent transform translate-x-4"></div>
            )}
            
            {/* Step Card */}
            <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 hover:border-slate-300 hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-2 relative overflow-hidden">
              {/* Animated Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
              
              {/* Step Number */}
              <div className="absolute top-4 right-4">
                <span className="text-3xl font-bold text-slate-200 group-hover:text-slate-300 transition-colors">
                  {step.step}
                </span>
              </div>
              
              {/* Content */}
              <div className="relative z-10">
                <div className={`p-4 rounded-xl ${step.iconBg} w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <div className={step.textColor}>
                    {step.icon}
                  </div>
                </div>
                
                <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-slate-600 leading-relaxed">
                  {step.description}
                </p>
              </div>

              {/* Decorative Circle */}
              <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Information */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Experience It?</h3>
          <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
            Join thousands of users who trust our facial recognition system for secure and accurate identification.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
              Start Free Trial
            </button>
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-colors">
              View Demo
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
