

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiMenu,
  FiLogOut,
  FiHome,
  FiBarChart2,
  FiActivity,
  FiDollarSign,
  FiCoffee
} from "react-icons/fi";

export default function DashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    monthlyRevenue: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [userProfile, setUserProfile] = useState({
    name: "",
    email: "",
    role: "",
  });
  const [showProfileBox, setShowProfileBox] = useState(false);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      const res = await fetch("/api/dashboard/stats"); // Replace with real API
      const data = await res.json();
      setStats({
        totalStudents: data.totalStudents,
        monthlyRevenue: data.monthlyRevenue,
      });
    };
    fetchStats();
  }, []);

  // Fetch recent activities
  useEffect(() => {
    const fetchRecentActivities = async () => {
      const res = await fetch("/api/dashboard/recent-activities"); // Replace with real API
      const data = await res.json();
      setRecentActivities(data);
    };
    fetchRecentActivities();
  }, []);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      const res = await fetch("/api/dashboard/user-profile"); // Replace with real API
      const data = await res.json();
      setUserProfile({
        name: data.name,
        email: data.email,
        role: data.role,
      });
    };
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      {/* Sidebar */}
      <aside
        className={`fixed md:relative z-20 bg-gradient-to-br from-indigo-800 to-fuchsia-700 text-white w-64 p-6 space-y-8 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="flex items-center space-x-3 mb-6">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Shri_Dharmasthala_Manjunatheshwara_College_of_Engineering_%26_Technology%2C_Dharwad_coat_of_arms.png"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-white shadow-lg"
          />
          <h1 className="text-xl font-bold leading-tight">Mess Warden</h1>
        </div>

        <nav className="space-y-4">
          <button
            onClick={() => router.push("/dashboard")}
            className="flex items-center w-full space-x-3 py-2 px-3 rounded-lg hover:bg-white/20 transition"
          >
            <FiHome className="text-xl" />
            <span className="font-medium">Dashboard</span>
          </button>

          {/* Manage Fees Section */}
          <div className="space-y-2">
            <div
              className="flex items-center w-full space-x-3 py-2 px-3 rounded-lg hover:bg-white/20 transition"
            >
              <FiDollarSign className="text-xl" />
              <span className="font-medium">Manage Fees</span>
            </div>
            
            {/* Fee Sub-options */}
            <div className="ml-6 space-y-2 border-l-2 border-white/30 pl-4">
              <button
                onClick={() => router.push("/dashboard/manage-fee-structure/generate-fee-reports")}
                className="flex items-center w-full space-x-3 py-1 px-3 rounded-lg hover:bg-white/20 transition text-sm"
              >
                <FiBarChart2 className="text-lg" />
                <span>Fee Reports</span>
              </button>
              <button
                onClick={() => router.push("/dashboard/manage-fee-structure")}
                className="flex items-center w-full space-x-3 py-1 px-3 rounded-lg hover:bg-white/20 transition text-sm"
              >
                <FiDollarSign className="text-lg" />
                <span>Fee Structure</span>
              </button>
              
             
            </div>
          </div>

          {/* Mess Menu Section */}
          <div className="space-y-2">
            <button
              onClick={() => router.push("/dashboard/manage-mess-menu")}
              className="flex items-center w-full space-x-3 py-2 px-3 rounded-lg hover:bg-white/20 transition"
            >
              <FiCoffee className="text-xl" />
              <span className="font-medium">Mess Menu</span>
            </button>
            
            
              
                
              
            
          </div>

          {/* Reports Section */}
          <button
            onClick={() => router.push("/dashboard/reports")}
            className="flex items-center w-full space-x-3 py-2 px-3 rounded-lg hover:bg-white/20 transition"
          >
            <FiBarChart2 className="text-xl" />
            <span className="font-medium">Notes</span>
          </button>
        </nav>

        {/* Logout button slightly up */}
        <button
          onClick={() => router.push("/dashboard/logout")}
          className="absolute bottom-16 left-6 flex items-center space-x-3 text-red-200 hover:text-white transition"
        >
          <FiLogOut className="text-xl" />
          <span>Logout</span>
        </button>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar */}
        <header className="flex items-center justify-between bg-white shadow-md py-4 px-6 sticky top-0 z-10">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden p-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <FiMenu className="text-2xl text-indigo-800" />
            </button>
            <h2 className="text-2xl font-bold text-indigo-800">
              Warden Dashboard
            </h2>
          </div>
          <div className="flex items-center space-x-4 relative">
            <span className="font-medium text-gray-700">👋 Welcome, Warden</span>
            <div
              className="relative"
              onMouseEnter={() => setShowProfileBox(true)}
              onMouseLeave={() => setShowProfileBox(false)}
            >
              <img
                src="https://i.ibb.co/3MM1N6s/user-avatar.png"
                className="w-10 h-10 rounded-full border-2 border-indigo-600 cursor-pointer"
                alt="avatar"
              />
              {showProfileBox && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-20">
                  <p className="font-semibold text-gray-800">
                    Name: {userProfile.name}
                  </p>
                  <p className="text-gray-600">Email: {userProfile.email}</p>
                  <p className="text-gray-600">Role: {userProfile.role}</p>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-8 bg-gradient-to-b from-white to-indigo-50">
          <h1 className="text-4xl font-extrabold text-gray-800 mb-10">
            📊 Control Center
          </h1>

          {/* Stats Section - Pending Payments Removed */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {[
              {
                label: "Total Students",
                value: stats.totalStudents,
                color: "from-fuchsia-500 to-pink-600",
              },
              {
                label: "Monthly Revenue",
                value: `₹${stats.monthlyRevenue.toLocaleString()}`,
                color: "from-pink-500 to-red-600",
              },
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`p-6 bg-white bg-opacity-90 rounded-2xl shadow-xl border-l-4 border-transparent hover:scale-[1.02] transform transition-all cursor-pointer bg-gradient-to-r ${stat.color} text-white`}
              >
                <h3 className="text-lg font-semibold mb-2">{stat.label}</h3>
                <p className="text-3xl font-extrabold">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Quick Links */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            ⚙️ Quick Actions
          </h2>
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <div
              onClick={() => router.push("/dashboard/manage-fee-structure")}
              className="cursor-pointer p-8 bg-gradient-to-r from-fuchsia-600 to-indigo-700 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <h3 className="text-2xl font-bold mb-2">💰 Manage Fees</h3>
              <p className="text-indigo-100">
                Update fee structure, track dues, and manage hostel & mess payments.
              </p>
            </div>

            <div
              onClick={() => router.push("/dashboard/manage-mess-menu")}
              className="cursor-pointer p-8 bg-gradient-to-r from-indigo-700 to-fuchsia-600 text-white rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
            >
              <h3 className="text-2xl font-bold mb-2">🍲 Mess Menu</h3>
              <p className="text-indigo-100">
                Create weekly menus, update meal timings, and view feedback.
              </p>
            </div>
          </div>

          {/* Recent Activity */}
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            📅 Recent Activity
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4 border-l-4 border-indigo-600">
            {recentActivities.length > 0 ? (
              recentActivities.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-4">
                  <FiActivity className="text-indigo-600 text-2xl mt-1" />
                  <div>{/* Add title & description when backend ready */}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No recent activity available.</p>
            )}
          </div>
        </main>
      </div>
    </div>
  )}
