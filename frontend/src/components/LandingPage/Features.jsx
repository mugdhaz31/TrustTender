import React from "react";
import { Lock, Brain, Users, BarChart, Smartphone, Headphones, Handshake, Rocket} from "lucide-react";
import { useNavigate } from "react-router-dom";

function Features() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Lock className="w-8 h-8 text-blue-500" />,
      title: "Blockchain Security",
      description:
        "Every transaction is recorded on an immutable blockchain, ensuring complete transparency and preventing tampering.",
    },
    {
      icon: <Brain className="w-8 h-8 text-purple-500" />,
      title: "AI-Powered Detection",
      description:
        "Advanced machine learning algorithms detect suspicious patterns and prevent fraud before it happens.",
    },
    {
      icon: <Users className="w-8 h-8 text-green-500" />,
      title: "Vendor Management",
      description:
        "Comprehensive vendor profiles with performance tracking, ratings, and compliance monitoring.",
    },
    {
      icon: <BarChart className="w-8 h-8 text-orange-500" />,
      title: "Real-time Analytics",
      description:
        "Get instant insights with powerful dashboards and customizable reports for data-driven decisions.",
    },
    {
      icon: <Smartphone className="w-8 h-8 text-blue-400" />,
      title: "Mobile Optimized",
      description:
        "Access your procurement dashboard anywhere, anytime with our responsive mobile interface.",
    },
    {
      icon: <Headphones className="w-8 h-8 text-pink-400" />,
      title: "24/7 Support",
      description:
        "Round-the-clock customer support to help you navigate your procurement journey successfully.",
    },
  ];

  return (
    <div className="pt-16 bg-gray-50" id="features">
      {/* Features Section */}
      <div className="max-w-6xl mx-auto text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
        <p className="mt-2 text-gray-600">
          Experience the future of procurement with cutting-edge technology and unmatched security
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-gray-100">{feature.icon}</div>
            </div>
            <h3 className="font-semibold flex justify-center text-lg text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600  text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <section className="bg-[#1b2c78] py-20 mt-16 text-center text-white">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Procurement?
          </h2>
          <p className="text-sm mb-8 text-blue-100">
            Join thousands of organizations already using TrustTender for secure, transparent procurement.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              <Rocket className="w-5 h-5 mr-2" />
              Start as Tender Officer
            </button>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
            >
              <Handshake className="w-5 h-5 mr-2" />
              Start as Vendor
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Features;
