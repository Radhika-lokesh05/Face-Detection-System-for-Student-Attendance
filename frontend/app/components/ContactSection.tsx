"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export function ContactForm() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Message sent! This can be wired to backend.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Name</label>
          <input
            type="text"
            placeholder="Your full name"
            required
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Email</label>
          <input
            type="email"
            placeholder="your.email@example.com"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-semibold text-slate-700 mb-2">Message</label>
        <textarea
          placeholder="Tell us about your project or ask any questions..."
          required
          value={formData.message}
          onChange={e => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-blue-500 focus:outline-none transition-colors bg-white resize-none"
          rows={5}
        />
      </div>
      
      <button 
        type="submit" 
        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
      >
        <Send className="w-5 h-5" />
        Send Message
      </button>
    </form>
  );
}

export default function ContactSection() {
  const contactInfo = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Us",
      description: "Get in touch via email",
      contact: "hello@facerecognition.com",
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Call Us", 
      description: "Speak to our team",
      contact: "+1 (555) 123-4567",
      color: "text-emerald-600",
      bgColor: "bg-emerald-100"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Us",
      description: "Our office location",
      contact: "123 Tech Street, Silicon Valley",
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <section className="py-20">
      {/* Section Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-3 mb-4">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="text-blue-600 font-semibold text-sm uppercase tracking-wider">Contact Us</span>
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-4 tracking-tight">
          Let's Start a Conversation
        </h2>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Ready to revolutionize your identification system? We're here to help you get started.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Left Side - Contact Info */}
        <div className="space-y-8">
          <div>
            <h3 className="text-2xl font-bold text-slate-800 mb-6">Get in Touch</h3>
            <p className="text-slate-600 leading-relaxed mb-8">
              Have questions about our facial recognition system? Need a custom solution? 
              Our team of experts is ready to help you implement the perfect identification 
              system for your needs.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="space-y-4">
            {contactInfo.map((info, index) => (
              <div
                key={index}
                className="group p-6 bg-white rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-xl ${info.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                    <div className={info.color}>
                      {info.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-slate-800 mb-1">{info.title}</h4>
                    <p className="text-slate-600 text-sm mb-2">{info.description}</p>
                    <p className="text-slate-700 font-medium">{info.contact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side - Contact Form */}
        <div className="bg-white rounded-2xl p-8 border-2 border-slate-200 shadow-lg">
          <h3 className="text-2xl font-bold text-slate-800 mb-6">Send us a Message</h3>
          <ContactForm />
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-16 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-200 text-center">
        <h3 className="text-2xl font-bold text-slate-800 mb-3">Ready to Get Started?</h3>
        <p className="text-slate-600 mb-6 max-w-2xl mx-auto">
          Join the thousands of organizations already using our facial recognition technology 
          to enhance their security and streamline their operations.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl">
            Start Free Trial
          </button>
          <button className="px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold border-2 border-blue-200 hover:border-blue-300 transition-colors">
            Schedule Demo
          </button>
        </div>
      </div>
    </section>
  );
}
