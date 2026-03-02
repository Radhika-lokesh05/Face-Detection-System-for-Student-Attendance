"use client";

import { Check, Star, Zap, Shield, Users, ArrowRight } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(true);
  const [hoveredPlan, setHoveredPlan] = useState<number | null>(null);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for small schools and pilot programs",
      monthlyPrice: 49,
      annualPrice: 39,
      icon: <Users className="w-8 h-8" />,
      color: "from-blue-500 to-indigo-600",
      popular: false,
      features: [
        "Up to 100 students",
        "Basic face recognition",
        "Standard reporting",
        "Email support",
        "Mobile app access",
        "Data encryption"
      ]
    },
    {
      name: "Professional",
      description: "Ideal for medium-sized institutions",
      monthlyPrice: 99,
      annualPrice: 79,
      icon: <Zap className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-600",
      popular: true,
      features: [
        "Up to 500 students",
        "Advanced AI recognition",
        "Real-time analytics",
        "Priority support",
        "API access",
        "Custom integrations",
        "Bulk import/export",
        "Advanced security"
      ]
    },
    {
      name: "Enterprise",
      description: "For large universities and institutions",
      monthlyPrice: 199,
      annualPrice: 159,
      icon: <Shield className="w-8 h-8" />,
      color: "from-purple-500 to-pink-600",
      popular: false,
      features: [
        "Unlimited students",
        "Multi-campus support",
        "Custom AI training",
        "24/7 phone support",
        "White-label solution",
        "Advanced analytics",
        "Custom reporting",
        "Dedicated account manager",
        "SLA guarantee"
      ]
    }
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider">Flexible Pricing</span>
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          </div>
          
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6">
            Choose Your <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">Perfect Plan</span>
          </h2>
          
          <p className="text-xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-8">
            Transparent pricing with no hidden fees. Scale as your institution grows.
          </p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center bg-white/80 backdrop-blur-lg rounded-2xl p-2 border-2 border-slate-200 shadow-lg">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                !isAnnual 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-300 relative ${
                isAnnual 
                  ? 'bg-emerald-500 text-white shadow-lg' 
                  : 'text-slate-600 hover:text-emerald-600'
              }`}
            >
              Annual
              <span className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                20% OFF
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan, index) => (
            <div
              key={index}
              onMouseEnter={() => setHoveredPlan(index)}
              onMouseLeave={() => setHoveredPlan(null)}
              className={`relative bg-white/90 backdrop-blur-lg rounded-3xl border-2 shadow-xl transition-all duration-500 overflow-hidden group ${
                plan.popular 
                  ? 'border-emerald-300 shadow-emerald-200/50 scale-105' 
                  : 'border-slate-200 hover:border-slate-300'
              } ${
                hoveredPlan === index ? 'scale-105 shadow-2xl' : 'hover:scale-105'
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-6 py-2 rounded-full font-bold text-sm flex items-center gap-2 shadow-lg">
                    <Star className="w-4 h-4 fill-current" />
                    Most Popular
                  </div>
                </div>
              )}

              {/* Background Gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>

              <div className="relative z-10 p-8">
                {/* Plan Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${plan.color} rounded-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <div className="text-white">
                      {plan.icon}
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">{plan.description}</p>
                </div>

                {/* Pricing */}
                <div className="text-center mb-8">
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-5xl font-black text-slate-900">
                      ${isAnnual ? plan.annualPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-600 font-medium">/month</span>
                  </div>
                  {isAnnual && (
                    <div className="text-sm text-emerald-600 font-semibold mt-2">
                      Save ${(plan.monthlyPrice - plan.annualPrice) * 12}/year
                    </div>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-3">
                      <div className={`p-1 bg-gradient-to-br ${plan.color} rounded-full`}>
                        <Check className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-slate-700 font-medium">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* CTA Button */}
                <Link
                  href="/signup"
                  className={`block w-full py-4 text-center font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl ${
                    plan.popular
                      ? `bg-gradient-to-r ${plan.color} text-white hover:shadow-emerald-500/25`
                      : `border-2 border-slate-300 text-slate-700 hover:border-slate-400 bg-white/50`
                  }`}
                >
                  {plan.popular ? 'Start Free Trial' : 'Get Started'}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Enterprise CTA */}
        <div className="bg-gradient-to-r from-slate-50 to-blue-50 rounded-3xl p-8 border-2 border-slate-200 shadow-xl text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-slate-900 mb-4">
              Need a Custom Solution?
            </h3>
            <p className="text-slate-600 text-lg mb-6 leading-relaxed">
              Contact our sales team for custom pricing, features, and deployment options tailored to your institution's specific needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-slate-700 to-slate-800 text-white font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
                Contact Sales
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center justify-center gap-3 px-8 py-4 border-2 border-slate-300 text-slate-700 font-semibold rounded-2xl hover:border-slate-400 transition-all duration-300 bg-white/50">
                Schedule Demo
              </button>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="text-center mt-16">
          <p className="text-slate-500 font-medium mb-4">Trusted by 500+ educational institutions worldwide</p>
          <div className="flex items-center justify-center gap-4 text-slate-400">
            <Shield className="w-5 h-5" />
            <span className="text-sm">Enterprise Security</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span className="text-sm">99.9% Uptime SLA</span>
            <div className="w-1 h-1 bg-slate-400 rounded-full"></div>
            <span className="text-sm">24/7 Support</span>
          </div>
        </div>
      </div>
    </section>
  );
}