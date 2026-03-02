"use client";

import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Instagram, 
  Youtube,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Camera,
  Shield,
  Clock,
  Users
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const footerLinks = {
    product: [
      { name: "Features", href: "#features" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "/student/demo-session" },
      { name: "API Documentation", href: "#" },
      { name: "Security", href: "#" },
      { name: "Integrations", href: "#" }
    ],
    company: [
      { name: "About Us", href: "#about" },
      { name: "Careers", href: "#" },
      { name: "Press", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Contact", href: "#contact" },
      { name: "Partners", href: "#" }
    ],
    support: [
      { name: "Help Center", href: "#" },
      { name: "Documentation", href: "#" },
      { name: "System Status", href: "#" },
      { name: "Community", href: "#" },
      { name: "Training", href: "#" },
      { name: "Webinars", href: "#" }
    ],
    legal: [
      { name: "Privacy Policy", href: "#" },
      { name: "Terms of Service", href: "#" },
      { name: "Cookie Policy", href: "#" },
      { name: "GDPR", href: "#" },
      { name: "Compliance", href: "#" },
      { name: "Data Protection", href: "#" }
    ]
  };

  const socialLinks = [
    { name: "Facebook", icon: <Facebook className="w-5 h-5" />, href: "#", color: "hover:text-blue-600" },
    { name: "Twitter", icon: <Twitter className="w-5 h-5" />, href: "#", color: "hover:text-sky-500" },
    { name: "LinkedIn", icon: <Linkedin className="w-5 h-5" />, href: "#", color: "hover:text-blue-700" },
    { name: "Instagram", icon: <Instagram className="w-5 h-5" />, href: "#", color: "hover:text-pink-600" },
    { name: "YouTube", icon: <Youtube className="w-5 h-5" />, href: "#", color: "hover:text-red-600" }
  ];

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Newsletter Section */}
        <div className="border-b border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center mb-12">
              <h3 className="text-3xl sm:text-4xl font-bold mb-4">
                Stay Updated with <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">FaceRecSys</span>
              </h3>
              <p className="text-slate-300 text-lg max-w-2xl mx-auto">
                Get the latest updates, feature releases, and educational insights delivered to your inbox
              </p>
            </div>

            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-xl pl-12 pr-4 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSubscribed ? "Subscribed!" : "Subscribe"}
                  {!isSubscribed && <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                  FaceRecSys
                </div>
              </div>
              
              <p className="text-slate-300 leading-relaxed mb-8">
                Revolutionary face recognition technology transforming attendance management for educational institutions worldwide.
              </p>

              {/* Contact Info */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">contact@facerecsys.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  <span className="text-slate-300">San Francisco, CA</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex items-center gap-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`p-3 bg-slate-800/50 rounded-lg border border-slate-700 text-slate-400 ${social.color} transition-all duration-300 hover:scale-110 hover:bg-slate-700/50`}
                    aria-label={social.name}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Link Columns */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Product */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Product</h4>
                  <ul className="space-y-4">
                    {footerLinks.product.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Company */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Company</h4>
                  <ul className="space-y-4">
                    {footerLinks.company.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Support */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Support</h4>
                  <ul className="space-y-4">
                    {footerLinks.support.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Legal */}
                <div>
                  <h4 className="text-white font-semibold text-lg mb-6">Legal</h4>
                  <ul className="space-y-4">
                    {footerLinks.legal.map((link, index) => (
                      <li key={index}>
                        <a
                          href={link.href}
                          className="text-slate-300 hover:text-blue-400 transition-colors duration-300 hover:translate-x-1 transform inline-block"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="flex flex-col items-center">
                <Shield className="w-8 h-8 text-blue-400 mb-2" />
                <div className="text-white font-semibold">Enterprise Security</div>
                <div className="text-slate-400 text-sm">SOC 2 Compliant</div>
              </div>
              <div className="flex flex-col items-center">
                <Clock className="w-8 h-8 text-emerald-400 mb-2" />
                <div className="text-white font-semibold">99.9% Uptime</div>
                <div className="text-slate-400 text-sm">Guaranteed SLA</div>
              </div>
              <div className="flex flex-col items-center">
                <Users className="w-8 h-8 text-purple-400 mb-2" />
                <div className="text-white font-semibold">500+ Schools</div>
                <div className="text-slate-400 text-sm">Trusted Worldwide</div>
              </div>
              <div className="flex flex-col items-center">
                <Camera className="w-8 h-8 text-pink-400 mb-2" />
                <div className="text-white font-semibold">1M+ Students</div>
                <div className="text-slate-400 text-sm">Recognized Daily</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-slate-400 text-sm">
                © 2024 FaceRecSys. All rights reserved.
              </div>
              <div className="flex items-center gap-6 text-sm text-slate-400">
                <span>Made with ❤️ for education</span>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                  <span>System Status: Operational</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}