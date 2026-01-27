import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/LandingPage";
import TenderDashboard from "./pages/TenderDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import Login from "./pages/Login";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tenderdashboard" element={<TenderDashboard />} />
        <Route path="/vendordashboard" element={<VendorDashboard />} />
        <Route path="/login" element={<Login />} />  
      </Routes>
    </Router>
  );
}

export default App;
