import React from "react";
import { UserPlus, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Hero() {
    const navigate = useNavigate();
  return (
    <section className="relative bg-[url('/hero-bg.jpg')] bg-cover bg-center text-white py-[10.138rem]">
      {/* Overlay */}
      <div className="absolute inset-0 bg-[#1b2c78] "></div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-12 grid md:grid-cols-2 gap-16 items-center">
        {/* Left Content */}
        <div>
          <h1 className="text-5xl font-bold leading-tight mb-6">
            Secure Procurement <br />
            <span className="text-blue-300 block">Powered by </span>
            <span className="text-blue-300 block">Blockchain</span>
          </h1>
          <p className="text-blue-100 mb-8 text-sm max-w-xl">
            Revolutionize your tendering process with AI-powered fraud detection,
            transparent blockchain technology, and seamless procurement management.
          </p>

          {/* Buttons + Input */}
          <div className="flex flex-wrap items-center gap-4 mb-10">
            <button onClick={() => navigate("/login")} className="bg-[#698ebc] hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center space-x-2">
              <UserPlus className="w-5 h-5 mr-2" />
              <span>I'm a Tender Officer</span>
            </button>
            <button onClick={() => navigate("/login")} className="bg-[#698ebc] hover:bg-blue-700 px-6 py-3 rounded-lg flex items-center space-x-2">
               <Briefcase className="w-5 h-5 mr-2" />
              <span>I'm a Vendor</span>
            </button>
          </div>

          {/* Stats */}
          <div className="flex space-x-12">
            <div>
              <h3 className="text-3xl font-bold">500+</h3>
              <p className="text-blue-200 text-sm">Active Tenders</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">10K+</h3>
              <p className="text-blue-200 text-sm">Verified Vendors</p>
            </div>
            <div>
              <h3 className="text-3xl font-bold">99.9%</h3>
              <p className="text-blue-200 text-sm">Fraud Prevention</p>
            </div>
          </div>
        </div>

        {/* Right Side Box */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md p-8 rounded-lg shadow-lg">
          <h3 className="text-2xl font-semibold mb-8">Why Choose TrustTender?</h3>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-xl">🔒</div>
              <div>
                <h4 className="font-semibold">Blockchain Security</h4>
                <p className="text-blue-200 text-sm">Immutable records and transparent transactions</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-xl">🤖</div>
              <div>
                <h4 className="font-semibold">AI Fraud Detection</h4>
                <p className="text-blue-200 text-sm">Advanced algorithms prevent bid manipulation</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-xl">📊</div>
              <div>
                <h4 className="font-semibold">Smart Analytics</h4>
                <p className="text-blue-200 text-sm">Data-driven insights for better decisions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
