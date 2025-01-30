import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Verify = () => {
  const { name } = useParams(); // Extracting name from URL
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validate input
  const validateInput = () => {
    if (!code) {
      setError("Verification code is required!");
      return false;
    } else if (code.length < 4) {
      setError("Code must be at least 4 digits!");
      return false;
    }
    setError("");
    return true;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!validateInput()) return;

    setLoading(true); // Start loading state

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/verify/${name}`, { code });

      if (response.data.success) {
        toast.success(response.data.message);
        setTimeout(() => navigate("/login"), 2000); // Smooth redirect
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error verifying user");
    }

    setLoading(false); // Stop loading state
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Verify Account</h2>

        <form onSubmit={handleVerify}>
          {/* Code Input */}
          <div className="mb-6">
            <label htmlFor="code" className="block text-sm font-medium text-gray-600">Enter Code</label>
            <input
              type="number"
              id="code"
              name="code"
              placeholder="Enter verification code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className={`w-full p-3 border ${
                error ? "border-red-500" : "border-gray-300"
              } focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md mt-2`}
              required
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>

          {/* Verify Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 text-white text-lg font-semibold rounded-lg transition-all duration-300 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Verifying..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Verify;
