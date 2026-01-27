// pages/TenderOfficerPage.jsx
import React from "react";
import { Bell, LogOut, Search } from "lucide-react";

const tenders = [
  {
    id: "TND001",
    title: "IT Infrastructure Upgrade Project",
    category: "Technology",
    description:
      "Complete overhaul of existing IT infrastructure including servers, networking equipment, and security systems.",
    amount: "$2,500,000",
    deadline: "2025-01-15",
    bids: 12,
    recentBids: [
      { vendor: "TechCorp Solutions", value: "$2,350,000", status: "Under Review" },
      { vendor: "Digital Systems Inc", value: "$2,450,000", status: "Submitted" },
      { vendor: "CloudTech Partners", value: "$2,380,000", status: "Submitted" },
    ],
    status: "Active",
  },
  {
    id: "TND002",
    title: "Office Furniture Procurement",
    category: "Furniture",
    description:
      "Supply and installation of modern office furniture for 500+ workstations including desks, chairs, and storage units.",
    amount: "$850,000",
    deadline: "2025-01-20",
    bids: 8,
    recentBids: [
      { vendor: "Office Solutions Ltd", value: "$820,000", status: "Under Review" },
      { vendor: "WorkSpace Pro", value: "$795,000", status: "Submitted" },
    ],
    status: "Evaluation",
  },
];

function TenderOfficerPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-5 flex flex-col">
        <h1 className="text-2xl font-bold mb-8">TrustTender</h1>
        <nav className="flex flex-col gap-3 text-gray-700 font-semibold">
          <button className="text-left py-2 px-3 bg-blue-50 rounded">Dashboard</button>
          <button className="text-left py-2 px-3">My Tenders <span className="ml-2 bg-gray-200 px-1 rounded text-xs">6</span></button>
          <button className="text-left py-2 px-3">Create Tender</button>
          <button className="text-left py-2 px-3">All Bids <span className="ml-2 bg-gray-200 px-1 rounded text-xs">47</span></button>
          <button className="text-left py-2 px-3">Vendors <span className="ml-2 bg-gray-200 px-1 rounded text-xs">234</span></button>
          <button className="text-left py-2 px-3">Security</button>
          <button className="text-left py-2 px-3">Analytics</button>
          <button className="text-left py-2 px-3">Settings</button>
        </nav>
        <div className="mt-auto bg-blue-50 p-3 rounded text-sm text-blue-700">
          Blockchain Status <br />
          <span className="text-xs text-gray-500">Connected &amp; Synced</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Top Navbar */}
        <div className="flex justify-between items-center mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tenders, vendors..."
              className="border rounded-md px-3 py-2 w-96 text-sm"
            />
            <Search className="absolute right-2 top-2 w-4 h-4 text-gray-400" />
          </div>
          <div className="flex items-center gap-4">
            <Bell className="w-5 h-5 text-gray-600" />
            <div className="flex items-center gap-2">
              <img src="https://via.placeholder.com/32" alt="avatar" className="rounded-full w-8 h-8" />
              <span className="text-sm font-semibold">John Smith</span>
              <span className="text-xs text-gray-500">Tender Officer</span>
              <span className="ml-2 px-2 bg-green-100 text-green-700 rounded text-xs">95</span>
              <LogOut className="w-5 h-5 text-gray-600 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Dashboard Widgets */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-xs">Active Tenders</h3>
            <p className="text-xl font-bold">6</p>
            <span className="text-green-500 text-xs">↑ 12% from last month</span>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-xs">Total Bids</h3>
            <p className="text-xl font-bold">58</p>
            <span className="text-green-500 text-xs">↑ 8% from last month</span>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-xs">Contract Value</h3>
            <p className="text-xl font-bold">$12.4M</p>
            <span className="text-green-500 text-xs">↑ 15% from last month</span>
          </div>
          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-gray-500 text-xs">Fraud Alerts</h3>
            <p className="text-xl font-bold">3</p>
            <span className="text-red-500 text-xs">Requires attention</span>
          </div>
        </div>

        {/* Tenders List */}
        <div className="space-y-6">
          {tenders.map((tender) => (
            <div key={tender.id} className="bg-white p-4 rounded shadow">
              <div className="flex justify-between items-start mb-2">
                <h2 className="font-bold">{tender.title}</h2>
                <span className={`text-xs font-semibold px-2 py-1 rounded ${tender.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {tender.status}
                </span>
              </div>
              <p className="text-gray-500 text-xs mb-2">
                ID: {tender.id} • {tender.category}
              </p>
              <p className="text-gray-600 text-sm mb-2">{tender.description}</p>
              <div className="flex text-gray-700 text-xs gap-4 mb-2">
                <span>💲 {tender.amount}</span>
                <span>📅 {tender.deadline}</span>
                <span>👥 {tender.bids} bids</span>
              </div>
              <div className="space-y-1">
                {tender.recentBids.map((bid, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{bid.vendor}</span>
                    <span>
                      {bid.value}{" "}
                      <span className={`ml-2 px-1 py-0.5 rounded text-white text-[10px] ${
                        bid.status === "Under Review" ? "bg-blue-500" : "bg-gray-500"
                      }`}>
                        {bid.status}
                      </span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default TenderOfficerPage;
