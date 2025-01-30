/* eslint-disable react/no-unescaped-entities */
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie"; 
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  // Validation function
  const validateInput = () => {
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!email) {
      newErrors.email = "Email is required!";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format!";
      valid = false;
    }

    if (!password) {
      newErrors.password = "Password is required!";
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters!";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true); // Start loading state

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/login`, { email, password });

      if (response.data.status === 1) {
        const { token, user } = response.data;
        console.log(response.data.message)

        Cookies.set("token", token, { expires: 7 });
        localStorage.setItem("user", JSON.stringify(user));

        toast.success("Login successfully");
        setTimeout(() => navigate("/"), 2000); // Smooth redirect
      } else {
        toast.error(response.data.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "There was an error logging in!");
    }

    setLoading(false); // Stop loading state
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="mb-6">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full p-3 border ${
                errors.email ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md mt-2`}
              required
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full p-3 border ${
                errors.password ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md mt-2`}
              required
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white text-lg font-semibold rounded-lg transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Sign-up Link */}
        <div className="mt-6 text-center text-sm text-gray-600">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-600 hover:underline">Sign Up</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
