import { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all users by admin
  const fetchUsersByAdmin = async () => {
    const token = Cookies.get("token");
    if (!token) return;

    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/get-all-users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.users || []); // Ensure users is an array
    } catch (err) {
      console.error("Error fetching users:", err);
      setError("Failed to fetch users.");
      toast.error("Failed to fetch users.");
      Cookies.remove("token"); // Remove invalid token
    }
    setLoading(false);
  };

  // Delete user by admin
  const deleteUserByAdmin = async (id) => {
    const token = Cookies.get("token");
    if (!token) return;

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/admin/delete-user/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 200) {
        toast.success("User deleted successfully!");
        fetchUsersByAdmin(); // Refetch users after deletion
      }
    } catch (err) {
      console.error("Error deleting user:", err);
      toast.error("Error deleting user.");
    }
  };

  useEffect(() => {
    fetchUsersByAdmin();
  }, []);

  return (
    <div className="p-4 w-full max-w-6xl mx-auto">
      <h1 className="text-2xl md:text-3xl font-bold mb-4">All Users</h1>

      <ToastContainer position="top-right" autoClose={3000} />

      <div className="flex justify-between items-center mb-4"></div>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border rounded-lg table-auto">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2 text-sm text-left">No</th>
                <th className="p-2 text-sm text-left">Name</th>
                <th className="p-2 text-sm text-left">Role</th>
                <th className="p-2 text-sm text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id} className="border-t">
                    <td className="p-2 text-center">{index + 1}</td>
                    <td className="p-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-green-500 text-white">
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold">{user.name}</p>
                          <p className="font-semibold">{user._id}</p>

                          <p className="text-gray-500 text-sm">{user.phone}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-2 text-center">{user.role}</td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => deleteUserByAdmin(user._id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllUsers;
