"use client";

import { Camera, UserPlus, Shield, BarChart3, Clock, Settings } from "lucide-react";

export default function FeaturesSection() {
  const features = [
    {
      icon: <Camera className="w-8 h-8" />,
      title: "Real-time Recognition",
      description: "Recognize faces instantly using live webcam capture with industry-leading accuracy and speed.",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-100",
      textColor: "text-blue-600"
    },
    {
      icon: <UserPlus className="w-8 h-8" />,
      title: "Easy Registration",
      description: "Register new users seamlessly via webcam with secure encrypted facial embeddings storage.",
      color: "from-emerald-500 to-emerald-600", 
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-100",
      textColor: "text-emerald-600"
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "User Management",
      description: "Comprehensive dashboard to view, manage, and monitor all registered users with real-time analytics.",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50", 
      iconBg: "bg-purple-100",
      textColor: "text-purple-600"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Advanced Security",
      description: "Bank-grade encryption and secure data handling ensure your facial data remains completely protected.",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-100", 
      textColor: "text-amber-600"
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "Lightning Fast",
      description: "Sub-second processing times with optimized algorithms for instant recognition and response.",
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      iconBg: "bg-rose-100",
      textColor: "text-rose-600"
    },
    {
      icon: <Settings className="w-8 h-8" />,
      title: "Easy Integration",
      description: "Simple API integration with existing systems and customizable configuration options.",
      color: "from-indigo-500 to-indigo-600", 
      bgColor: "bg-indigo-50",
      iconBg: "bg-indigo-100",
      textColor: "text-indigo-600"
    }
  ];

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Features</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
          Powerful Features for Modern Recognition
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Experience cutting-edge facial recognition technology with enterprise-grade security and user-friendly interface.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div
            key={index}
            className={`group p-8 rounded-2xl border-2 border-slate-200 hover:border-slate-300 bg-white hover:shadow-xl transition-all duration-500 cursor-pointer hover:-translate-y-2`}
          >
            {/* Animated Background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-2xl`} />
            
            {/* Content */}
            <div className="relative z-10">
              <div className={`p-4 rounded-xl ${feature.iconBg} w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <div className={feature.textColor}>
                  {feature.icon}
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-slate-900 transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Decorative Elements */}
            <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full opacity-20 group-hover:opacity-30 transition-opacity"></div>
          </div>
        ))}
      </div>
    </section>
  );
}
