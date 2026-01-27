import React from "react";
import { Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
function Navbar() {
  const navigate = useNavigate();
  return (
    <header className="absolute top-0 left-0 w-full z-20">
      <div className="max-w-7xl mx-auto px-12 flex items-center justify-between py-6">
        {/* Logo */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white text-blue-800 rounded-full flex items-center justify-center font-bold text-lg">
            <Shield className="w-5 h-5" strokeWidth={5} />
          </div>

          <span className="text-xl font-semibold text-white">TrustTender</span>
        </div>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center space-x-10 text-white">
          <a
            href="#features"
            className="transition-colors hover:text-blue-300"
          >
            Features
          </a>
          <a
            href="#about"
            className="transition-colors hover:text-blue-300"
          >
            About
          </a>
          <a
            href="#contact"
            className="transition-colors hover:text-blue-300"
          >
            Contact
          </a>
          <button onClick={() => navigate("/login")} className="bg-white text-blue-800 px-5 py-2 rounded hover:bg-gray-100">
            Sign In
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
