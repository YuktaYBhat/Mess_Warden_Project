
"use client";
import { useState } from "react";
// Removed Next.js specific 'next/navigation' import and the custom useRouter stub function.

export default function AuthPage() {
  // Dummy router implementation for successful execution in this environment.
  // When you move this component to your Next.js project, replace this entire 
  // block with: const router = useRouter();
  const router = {
    push: function(path:any) {
      console.log(`Simulating navigation to: ${path}`);
    },
  }; 
  
  const [isLogin, setIsLogin] = useState(true); // State to toggle between Login and Sign Up
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleAuth = async (e:any) => {
    e.preventDefault();
    setError("");

    if (isLogin) {
      // --- Login Logic ---
      // Demo Credentials: warden@example.com / password123
      if (email === "warden@example.com" && password === "password123") {
        router.push("/dashboard"); 
      } else {
        setError("Invalid credentials. Please try again.");
      }
    } else {
      // --- Sign Up Logic ---
      if (password !== confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
      // Simulate successful signup then switch to login
      console.log("Signing up with:", email, password);
      setError("Registration successful! Please log in.");
      setIsLogin(true);
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    // Background: Light gray/white for high contrast with the vibrant card
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4 font-sans">
      
      {/* Main Card Container: Bright white card with soft shadow */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl shadow-2xl shadow-indigo-200/50 rounded-2xl overflow-hidden bg-white transition-all duration-500">
        
        {/* Left Side - Illustration / Info (Vibrant Gradient Accent) */}
        <div className="hidden md:flex flex-col justify-center items-center bg-gradient-to-br from-indigo-800 to-fuchsia-600 text-white p-12 w-1/2">
          
          {/* College Logo Placeholder */}
          <div className="mb-6">
            <img 
              // *** CHANGE THIS URL TO YOUR COLLEGE LOGO URL ***
              src="https://upload.wikimedia.org/wikipedia/commons/1/1d/Shri_Dharmasthala_Manjunatheshwara_College_of_Engineering_%26_Technology%2C_Dharwad_coat_of_arms.png" 
              alt="College Logo" 
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl transform hover:scale-105 transition duration-500"
            />
          </div>

          {/* Title: Welcome Mess Warden */}
          <h1 className="text-4xl font-extrabold mb-3 text-center tracking-wide">Welcome Mess Warden</h1>
          
          <p className="text-md text-indigo-100 text-center leading-relaxed">
            Your centralized, blue-ribbon portal for seamless management.
          </p>
          <div className="mt-6">
              <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium border border-white/50">{isLogin ? "Warden Login" : "New Warden Registration"}</span>
          </div>
        </div>

        {/* Right Side - Login/Signup Form (Clean White Panel) */}
        <div className="flex flex-col justify-center w-full md:w-1/2 p-10 md:p-12 bg-white">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
            {isLogin ? "Warden Sign In" : "Register New Account"}
          </h2>
          <p className="text-center text-sm text-gray-500 mb-8">
            {isLogin ? "Access your management dashboard" : "Setup your new warden account"}
          </p>

          <form onSubmit={handleAuth} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="warden@example.com"
                // Focus ring accent to Fuchsia
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none shadow-sm transition duration-200 placeholder-gray-400 text-gray-800"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                // Focus ring accent to Fuchsia
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none shadow-sm transition duration-200 placeholder-gray-400 text-gray-800"
                required
              />
            </div>

            {/* Confirm Password Field (Only for Sign Up) */}
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  // Focus ring accent to Fuchsia
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 outline-none shadow-sm transition duration-200 placeholder-gray-400 text-gray-800"
                  required
                />
              </div>
            )}

            {error && <p className={`text-sm text-center pt-2 font-medium ${error.includes('successful') ? 'text-green-600' : 'text-red-500'}`}>{error}</p>}

            {/* Primary Button with New Vibrant Gradient */}
            <button
              type="submit"
              // Updated Gradient: Fuchsia to Indigo
              className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-700 hover:from-fuchsia-700 hover:to-indigo-800 text-white py-3 mt-4 rounded-lg font-semibold text-lg shadow-md shadow-fuchsia-500/30 transition-all duration-300 transform hover:scale-[1.01] focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2"
            >
              {isLogin ? "Sign In to Dashboard" : "Create Account"}
            </button>
          </form>

          {/* Toggle Link */}
          <p className="text-center text-sm text-gray-600 mt-6">
            {isLogin ? "New user?" : "Already have an account?"}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(""); // Clear error on toggle
                setEmail("");
                setPassword("");
                setConfirmPassword("");
              }}
              // Updated Link accent color to Fuchsia
              className="ml-1 font-semibold text-fuchsia-600 hover:text-fuchsia-800 transition duration-150"
            >
              {isLogin ? "Create an Account" : "Sign In"}
            </button>
          </p>

          <p className="text-center text-xs text-gray-500 mt-10">
            &copy; {new Date().getFullYear()} Hostel Management System
          </p>
        </div>
      </div>
    </div>
  );
}
