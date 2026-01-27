import React from "react";
import { Shield, Lock, Key } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-2 mb-4">
            <div className="w-10 h-10 bg-white text-blue-800 rounded-full flex items-center justify-center font-bold text-lg">
            <Shield className="w-5 h-5" strokeWidth={5} />
          </div>
            <span className="text-white text-lg font-semibold">TrustTender</span>
          </div>
          <p className="text-xs">
            Revolutionizing procurement with blockchain technology and AI-powered fraud detection.
          </p>
        </div>

        {/* Platform */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs">Platform</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white">Features</a></li>
            <li><a href="#" className="hover:text-white">Security</a></li>
            <li><a href="#" className="hover:text-white">API</a></li>
            <li><a href="#" className="hover:text-white">Pricing</a></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs">Company</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white">About</a></li>
            <li><a href="#" className="hover:text-white">Careers</a></li>
            <li><a href="#" className="hover:text-white">Press</a></li>
            <li><a href="#" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Support */}
        <div>
          <h4 className="text-white font-semibold mb-4 text-xs">Support</h4>
          <ul className="space-y-2 text-xs">
            <li><a href="#" className="hover:text-white">Help Center</a></li>
            <li><a href="#" className="hover:text-white">Documentation</a></li>
            <li><a href="#" className="hover:text-white">Community</a></li>
            <li><a href="#" className="hover:text-white">Status</a></li>
          </ul>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-800 my-8"></div>

      {/* Bottom Section */}
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        <p>© 2025 TrustTender. All rights reserved.</p>
        <div className="flex space-x-4 mt-4 md:mt-0">
          <Shield className="w-5 h-5 text-blue-400" />
          <Key className="w-5 h-5 text-green-400" />
          <Lock className="w-5 h-5 text-purple-400" />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
