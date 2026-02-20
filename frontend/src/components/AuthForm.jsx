// src/components/AuthForm.jsx
import React, { useState } from "react";
import { ArrowLeft, LogIn, UserPlus, User, Shield, Briefcase } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthForm({ type = "login", onSubmit }) {
  const navigate = useNavigate();
  const [role, setRole] = useState("TENDER_OFFICER");
  const [mode, setMode] = useState(type); // "login" | "register"
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    emailOtp: "",
    emailVerified: false,
    organizationName: "",
    companyName: "",
    organizationType: "Government", // new
    registrationId: "",             // new
    companyType: "Private Limited", // new
    gstNumber: "",                  // new
    cinNumber: "",                  // new
    phoneNumber: "",
    phoneOtp: "",
    phoneVerified: false,
    password: "",
    confirmPassword: "",
    aadhaarNumber: "",
    aadhaarOtp: "",
    aadhaarVerified: false,
    aadhaarToken: "",

  });

  const isEntityValid = () => {
    if (role === "TENDER_OFFICER")
      return (
        formData.organizationName.trim().length > 2 &&
        formData.registrationId.trim().length > 0
      );

    if (role === "VENDOR")
      return (
        formData.companyName.trim().length > 2 &&
        formData.gstNumber.trim().length > 0
      );

    return false;
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // ---------------- Aadhaar OTP ----------------
  const sendAadhaarOtp = async () => {
    if (!/^\d{12}$/.test(formData.aadhaarNumber)) {
      alert("Enter a valid 12-digit Aadhaar number");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/aadhaar/send-otp", {
        aadhaarNumber: formData.aadhaarNumber,
        phoneNumber: formData.phoneNumber,
      });
      alert("OTP sent (mock). Enter OTP to verify.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Failed to send Aadhaar OTP");
    }
  };

  const verifyAadhaarOtp = async () => {
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/aadhaar/verify-otp", {
        aadhaarNumber: formData.aadhaarNumber,
        otp: formData.aadhaarOtp,
      });
      if (res.data && res.data.verified) {
        setFormData((p) => ({ ...p, aadhaarVerified: true, aadhaarToken: res.data.aadhaarToken }));
        alert("Aadhaar verified");
      } else {
        alert("Aadhaar verification failed");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Verification failed");
    }
  };

  const startDigilocker = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/api/digilocker/auth-url");
      const url = resp.data.authUrl;
      const win = window.open(url, "digilocker", "width=600,height=700");

      window.addEventListener("message", function handler(e) {
        const data = e.data;
        if (data?.digilockerResult) {
          setFormData((p) => ({
            ...p,
            aadhaarVerified: data.digilockerResult.aadhaarVerified,
            aadhaarHash: data.digilockerResult.aadhaarHash,
          }));
          alert("DigiLocker verification successful!");
          window.removeEventListener("message", handler);
          if (win) win.close();
        }
      });
    } catch (err) {
      alert("Failed to start Digilocker flow");
    }
  };

  // ---------------- Email OTP ----------------
  const sendEmailOtp = async () => {
    if (!formData.email) {
      alert("Please enter your email first");
      return;
    }
    try {
      setLoading(true);
      await axios.post("http://localhost:5000/api/email/send-otp", { email: formData.email });
      alert("Email OTP sent. Check your inbox.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Failed to send Email OTP");
    }
  };

  const verifyEmailOtp = async () => {
    if (!formData.emailOtp) {
      alert("Please enter the OTP sent to your email");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/email/verify-otp", {
        email: formData.email,
        otp: formData.emailOtp,
      });
      if (res.data?.verified) {
        setFormData((p) => ({ ...p, emailVerified: true }));
        alert("Email verified successfully!");
      } else {
        alert("Email verification failed");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Email verification failed");
    }
  };

  // ---------------- Phone OTP ----------------
  const sendPhoneOtp = async () => {
    if (!formData.phoneNumber) {
      alert("Please enter your phone number first");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/phone/send-otp", {
        phoneNumber: formData.phoneNumber,
      });
      alert(res.data.message || "OTP sent successfully. Check your phone.");
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Failed to send OTP");
    }
  };

  const verifyPhoneOtp = async () => {
    if (!formData.phoneOtp) {
      alert("Please enter the OTP sent to your phone");
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post("http://localhost:5000/api/phone/verify-otp", {
        phoneNumber: formData.phoneNumber,
        otp: formData.phoneOtp,
      });
      if (res.data?.verified) {
        setFormData((p) => ({ ...p, phoneVerified: true }));
        alert("Phone verified successfully!");
      } else {
        alert("Phone verification failed");
      }
      setLoading(false);
    } catch (err) {
      setLoading(false);
      alert(err?.response?.data?.message || "Phone verification failed");
    }
  };

  // ---------------- Form Submit ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === "register" && !isEntityValid()) {
    alert(role === "TENDER_OFFICER"
      ? "Organization name and Registration ID required"
      : "Company name and GST number required"
    );
    return;
  }

    if (mode === "register") {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match");
        return;
      }
      if (!formData.emailVerified || !formData.phoneVerified || !formData.aadhaarVerified) {
        alert("Please verify your Email, Phone, and Aadhaar before registering.");
        return;
      }

      const payload = {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        role,
        emailVerified: formData.emailVerified,
        phoneVerified: formData.phoneVerified,
        aadhaarVerified: formData.aadhaarVerified,
        aadhaarToken: formData.aadhaarToken,
        aadhaarNumber: formData.aadhaarNumber,

      };

      if (role === "TENDER_OFFICER") {
        payload.organizationName = formData.organizationName;
        payload.organizationType = formData.organizationType;
        payload.registrationId = formData.registrationId;
      }

      if (role === "VENDOR") {
        payload.companyName = formData.companyName;
        payload.companyType = formData.companyType;
        payload.gstNumber = formData.gstNumber;
        payload.cinNumber = formData.cinNumber;
      }

      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/auth/register", payload);
        setLoading(false);
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          if (role === "TENDER_OFFICER") navigate("/tenderdashboard");
          else navigate("/vendordashboard");
        } else {
          alert("Registered. Please login.");
          setMode("login");
        }
      } catch (err) {
        setLoading(false);
        alert(err?.response?.data?.message || "Registration failed");
      }
    } else {
      // login
      try {
        setLoading(true);
        const res = await axios.post("http://localhost:5000/api/auth/login", {
          email: formData.email,
          password: formData.password,
        });
        setLoading(false);
        if (res.data?.token) {
          localStorage.setItem("token", res.data.token);
          const userRole = res.data.user?.role;
          if (userRole === "TENDER_OFFICER") navigate("/tenderdashboard");
          else navigate("/vendordashboard");
        }
      } catch (err) {
        setLoading(false);
        alert(err?.response?.data?.message || "Login failed");
      }
    }
  };

  const isLogin = mode === "login";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 relative p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-6 relative">
        <button onClick={() => navigate("/")} className="flex items-center text-xs font-semibold text-gray-600 mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" strokeWidth={3} /> Back
        </button>

        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-blue-800 text-white rounded-full flex items-center justify-center font-bold text-lg">
              <Shield className="w-5 h-5" strokeWidth={5} />
            </div>
            <h1 className="text-lg font-bold text-gray-900">TrustTender</h1>
          </div>

          <p className="text-lg p-1 font-bold text-black">{isLogin ? "Welcome Back" : "Create Account"}</p>
          <span className="text-xs font-semibold text-gray-500">
            {isLogin ? `Sign in as ${role === "TENDER_OFFICER" ? "Tender Officer" : "Vendor"}` : `Join as ${role === "TENDER_OFFICER" ? "Tender Officer" : "Vendor"}`}
          </span>
        </div>

        <div className="flex gap-2 mb-4">
          <button onClick={() => setRole("TENDER_OFFICER")}
            className={`flex-1 text-xs px-3 py-1 rounded-md ${role === "TENDER_OFFICER" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>
            <User className="w-4 h-4 mr-1 inline" /> Tender Officer
          </button>
          <button onClick={() => setRole("VENDOR")}
            className={`flex-1 text-xs px-3 py-1 rounded-md ${role === "VENDOR" ? "bg-blue-100 text-blue-800" : "bg-gray-100"}`}>
            <Briefcase className="w-4 h-4 mr-1 inline" /> Vendor
          </button>
        </div>

        <div className="flex bg-gray-200 rounded-md p-1 mb-4">
          <button className={`w-1/2 text-xs font-semibold rounded-md p-1.5 ${isLogin ? "bg-white shadow-sm" : "text-gray-500"}`} onClick={() => setMode("login")}>Login</button>
          <button className={`w-1/2 text-xs font-semibold rounded-md p-1.5 ${!isLogin ? "bg-white shadow-sm" : "text-gray-500"}`} onClick={() => setMode("register")}>Register</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {!isLogin && (
            <>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Full Name</label>
                <input name="fullName" value={formData.fullName} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">{role === "TENDER_OFFICER" ? "Organization Name" : "Company Name"}</label>
                <input name={role === "TENDER_OFFICER" ? "organizationName" : "companyName"} value={role === "TENDER_OFFICER" ? formData.organizationName : formData.companyName} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
              </div>

              {role === "TENDER_OFFICER" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-0.5">Organization Type</label>
                    <select name="organizationType" value={formData.organizationType} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs">
                      <option>Government</option>
                      <option>PSU</option>
                      <option>Private</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-0.5">Registration ID</label>
                    <input name="registrationId" value={formData.registrationId} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
                  </div>
                </>
              )}

              {role === "VENDOR" && (
                <>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-0.5">Company Type</label>
                    <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs">
                      <option>Proprietorship</option>
                      <option>Partnership</option>
                      <option>LLP</option>
                      <option>Private Limited</option>
                      <option>Public Limited</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-0.5">GST Number</label>
                    <input name="gstNumber" value={formData.gstNumber} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-0.5">CIN Number</label>
                    <input name="cinNumber" value={formData.cinNumber} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
                  </div>
                </>
              )}

              {/* Phone, Aadhaar fields remain unchanged */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Phone Number</label>
                <input name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
              </div>
              <div className="flex gap-2 mt-2">
                <button type="button" onClick={sendPhoneOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Send OTP</button>
                <input name="phoneOtp" value={formData.phoneOtp} onChange={handleChange} placeholder="Enter OTP" className="px-2 py-1 border rounded text-xs" />
                <button type="button" onClick={verifyPhoneOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Verify OTP</button>
              </div>
              <div className="text-xs mt-1">{formData.phoneVerified ? <span className="text-green-600">Phone verified</span> : <span className="text-red-500">Not verified</span>}</div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-0.5">Aadhaar Number</label>
                <input name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleChange} placeholder="12-digit Aadhaar" className="w-full px-2 py-1.5 border rounded-md text-xs" />
                <div className="flex gap-2 mt-2">
                  <button type="button" onClick={startDigilocker} className="px-3 py-1 text-xs bg-gray-100 rounded">Verify via DigiLocker</button>
                  <button type="button" onClick={sendAadhaarOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Send OTP</button>
                  <input name="aadhaarOtp" value={formData.aadhaarOtp} onChange={handleChange} placeholder="Enter OTP" className="px-2 py-1 border rounded text-xs" />
                  <button type="button" onClick={verifyAadhaarOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Verify OTP</button>
                </div>
                <div className="text-xs mt-1">{formData.aadhaarVerified ? <span className="text-green-600">Aadhaar verified</span> : <span className="text-red-500">Not verified</span>}</div>
              </div>
            </>
          )}

          {/* Email & Password fields */}
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Email Address</label>
            <input type="email" name="email" required value={formData.email} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
          </div>

          {!isLogin && (
            <div className="mt-2">
              <div className="flex gap-2">
                <button type="button" onClick={sendEmailOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Send OTP</button>
                <input name="emailOtp" value={formData.emailOtp} onChange={handleChange} placeholder="Enter Email OTP" className="px-2 py-1 border rounded text-xs" />
                <button type="button" onClick={verifyEmailOtp} className="px-3 py-1 text-xs bg-gray-100 rounded">Verify OTP</button>
              </div>
              <div className="text-xs mt-1">{formData.emailVerified ? <span className="text-green-600">Email verified</span> : <span className="text-red-500">Not verified</span>}</div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-700 mb-0.5">Password</label>
            <input type="password" name="password" required value={formData.password} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-0.5">Confirm Password</label>
              <input type="password" name="confirmPassword" required value={formData.confirmPassword} onChange={handleChange} className="w-full px-2 py-1.5 border rounded-md text-xs" />
            </div>
          )}

          <button type="submit" disabled={loading} className="w-full py-2 bg-black text-white rounded-md text-sm font-semibold flex items-center justify-center">
            {isLogin ? <><LogIn className="w-4 h-4 mr-2" /> Sign In</> : <><UserPlus className="w-4 h-4 mr-2" /> Create Account</>}
          </button>
        </form>

        <div className="mt-4 text-xs text-gray-500">
          <p>By registering you agree to our terms. Aadhaar is used for identity verification only.</p>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
