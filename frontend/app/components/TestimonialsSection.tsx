"use client";

import { Star, Quote } from "lucide-react";
import { useState, useEffect } from "react";

export default function TestimonialsSection() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const testimonials = [
    {
      name: "Dr. Sarah Johnson",
      role: "Principal, Westfield Academy",
      avatar: "SJ",
      rating: 5,
      content: "FaceRecSys has revolutionized our attendance system. The accuracy is incredible and students love how quick and easy it is. No more paper registers!",
      company: "Westfield Academy",
      gradient: "from-blue-500 to-indigo-600"
    },
    {
      name: "Prof. Michael Chen",
      role: "Head of IT, Tech University",
      avatar: "MC",
      rating: 5,
      content: "Implementation was seamless and the security features give us complete confidence. Our attendance rates have improved by 40% since deployment.",
      company: "Tech University",
      gradient: "from-emerald-500 to-teal-600"
    },
    {
      name: "Lisa Rodriguez",
      role: "Administrative Manager",
      avatar: "LR",
      rating: 5,
      content: "The real-time analytics and reporting features are outstanding. We can track attendance patterns and identify issues before they become problems.",
      company: "Central High School",
      gradient: "from-purple-500 to-pink-600"
    },
    {
      name: "James Wilson",
      role: "IT Director, Metro College",
      avatar: "JW",
      rating: 5,
      content: "Best investment we've made in educational technology. The ROI was evident within the first semester. Highly recommend to any institution.",
      company: "Metro College",
      gradient: "from-amber-500 to-orange-600"
    }
  ];

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 right-20 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className={`text-center mb-16 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Success Stories</span>
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Trusted by <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Educators</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed">
            See how institutions worldwide are transforming their attendance management with our cutting-edge technology
          </p>
        </div>

        {/* Main Testimonial Display */}
        <div className={`mb-16 transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="relative max-w-4xl mx-auto">
            {/* Quote Icon */}
            <div className="absolute -top-6 -left-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
              <Quote className="w-8 h-8 text-white" />
            </div>

            {/* Testimonial Card */}
            <div className="bg-white/90 backdrop-blur-lg rounded-3xl p-8 sm:p-12 border-2 border-slate-200 shadow-2xl relative overflow-hidden">
              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[activeTestimonial].gradient} opacity-5 transition-all duration-500`}></div>
              
              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(testimonials[activeTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-500 fill-current" />
                  ))}
                </div>

                {/* Testimonial Content */}
                <blockquote className="text-2xl sm:text-3xl text-slate-800 font-medium leading-relaxed mb-8 transition-all duration-500">
                  "{testimonials[activeTestimonial].content}"
                </blockquote>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 bg-gradient-to-br ${testimonials[activeTestimonial].gradient} rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {testimonials[activeTestimonial].avatar}
                  </div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">{testimonials[activeTestimonial].name}</div>
                    <div className="text-slate-600 font-medium">{testimonials[activeTestimonial].role}</div>
                    <div className="text-blue-600 font-semibold text-sm">{testimonials[activeTestimonial].company}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Testimonial Navigation */}
        <div className="flex justify-center gap-4 mb-16">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveTestimonial(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 ${
                index === activeTestimonial 
                  ? 'bg-blue-600 scale-125' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>

        {/* All Testimonials Grid */}
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className={`bg-white/80 backdrop-blur-lg rounded-2xl p-6 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer group ${
                index === activeTestimonial ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''
              }`}
              onClick={() => setActiveTestimonial(index)}
            >
              {/* Avatar and Rating */}
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${testimonial.gradient} rounded-full flex items-center justify-center text-white font-bold shadow-lg group-hover:scale-110 transition-transform`}>
                  {testimonial.avatar}
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>

              {/* Content */}
              <p className="text-slate-700 text-sm leading-relaxed mb-4 line-clamp-3">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div>
                <div className="font-bold text-slate-900 text-sm">{testimonial.name}</div>
                <div className="text-slate-600 text-xs">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className={`text-center mt-16 transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl p-8 border-2 border-blue-200">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
              Join Thousands of Satisfied Customers
            </h3>
            <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
              Experience the future of attendance management and see why educational institutions worldwide trust FaceRecSys
            </p>
            <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
              Start Your Free Trial
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}