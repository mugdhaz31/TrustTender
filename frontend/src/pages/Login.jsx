// pages/Login.jsx
import React, { useState } from "react";
import AuthForm from "../components/AuthForm";

function Login() {
  const [mode, setMode] = useState("login"); // "login" or "register"

  const handleModeChange = (newMode) => setMode(newMode);

  const handleAuthSubmit = (formData) => {
    console.log("Form submitted:", formData);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow">
        <AuthForm
          type={mode}
          onSubmit={handleAuthSubmit}
          onModeChange={handleModeChange}
        />
      </div>
    </div>
  );
}

export default Login;
