import HeroSection from '@/app/components/HeroSection';
import FeaturesSection from "@/app/components/FeatureSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import PricingSection from "@/app/components/PricingSection";
import HowItWorksSection from "@/app/components/WorkSection";
import AboutSection from "@/app/components/AboutSection";
import ContactSection from "@/app/components/ContactSection";
import Footer from "@/app/components/Footer";
import Link from "next/link";

export default function HomePage() {
  return (
    <main className="bg-gradient-to-br from-slate-50 via-white to-blue-50 min-h-screen overflow-hidden">
      {/* Modern Navigation Bar */}
      <nav className="bg-white/90 backdrop-blur-xl border-b border-slate-200/60 shadow-lg sticky top-0 z-50 transition-all duration-300">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FaceRecSys
            </div>
          </div>
          
          <div className="hidden lg:flex space-x-8">
            <a href="#features" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#testimonials" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              Testimonials
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#pricing" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#how-it-works" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              How It Works
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#about" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              About
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
            <a href="#contact" className="text-slate-700 hover:text-blue-600 transition-all duration-300 font-medium hover:scale-105 relative group">
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </a>
          </div>
          
          <div className="flex space-x-3">
            <Link
              href="/signin"
              className="px-6 py-2.5 text-blue-600 font-semibold rounded-xl hover:bg-blue-50 transition-all duration-300 border-2 border-blue-200 hover:border-blue-300 hover:scale-105 hover:shadow-lg"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 hover:-translate-y-0.5"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Page Content with Smooth Animations */}
      <div className="space-y-24 overflow-hidden">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Features Section */}
        <section id="features" className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <FeaturesSection />
          </div>
        </section>
        
        {/* Testimonials Section */}
        <section id="testimonials" className="relative bg-gradient-to-r from-slate-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <TestimonialsSection />
          </div>
        </section>
        
        {/* Pricing Section */}
        <section id="pricing" className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <PricingSection />
          </div>
        </section>
        
        {/* How It Works Section */}
        <section id="how-it-works" className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-20 rounded-3xl mx-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <HowItWorksSection />
          </div>
        </section>
        
        {/* About Section */}
        <section id="about" className="relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <AboutSection />
          </div>
        </section>
        
        {/* Contact Section */}
        <section id="contact" className="relative bg-gradient-to-r from-slate-50 to-blue-50 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <ContactSection />
          </div>
        </section>
      </div>
      
      {/* Modern Footer */}
      <Footer />
    </main>
  );
}
