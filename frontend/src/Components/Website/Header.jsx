import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Header = () => {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch user data from the token
  const fetchUser = async (token) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data.user); // Update state with user details
    } catch (error) {
      console.error("Error fetching user data:", error);
      Cookies.remove("token"); // Remove invalid token on error
      setUser(null); // Clear user data if token is invalid or expired
    }
  };

  const handleLogout = () => {
    Cookies.remove("token");
    localStorage.clear();
    setUser(null);
    navigate("/login"); // Redirect to login page
  };

  // Call fetchUser if the user is logged in and token exists
  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      fetchUser(token); // Fetch user data when the page loads if token exists
    } else {
      setUser(null); // Clear user state if no token found
    }
  }, []);

  const closeMenu = () => {
    setIsMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <header className="bg-gray-800 text-white p-4 flex flex-col lg:flex-row justify-between items-center">
      {/* Logo Section */}
      <div className="w-full lg:w-1/2 flex justify-start mb-4 lg:mb-0">
        <Link to="/" className="text-2xl font-bold">
          Task List
        </Link>
      </div>

      {/* Navbar Section */}
      <div className="w-full lg:w-1/2 flex justify-end">
        {/* Desktop Navigation */}
        <div className="hidden lg:flex flex-row gap-4 items-center">
          {user && (
            <>
              <Link to="/profile" className="text-white hover:underline">
                Profile
              </Link>
              {user.role === "admin" && (
                <Link to="/admin" className="text-yellow-400 hover:underline">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="text-red-500 hover:underline">
                Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <div className="lg:hidden flex items-center justify-between w-full">
          {/* Hamburger Icon */}
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white text-2xl">
            ☰
          </button>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="absolute top-16 left-0 right-0 bg-gray-800 p-4 flex flex-col items-center gap-4">
              {/* Close Button */}
              <button onClick={closeMenu} className="text-white text-3xl absolute top-2 right-4">
                ×
              </button>
              {user && (
                <>
                  <Link to="/profile" className="text-white hover:underline" onClick={closeMenu}>
                    Profile
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin" className="text-yellow-400 hover:underline" onClick={closeMenu}>
                      Admin
                    </Link>
                  )}
                  <button onClick={handleLogout} className="text-red-500 hover:underline">
                    <h1 onClick={closeMenu}>Logout</h1>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
