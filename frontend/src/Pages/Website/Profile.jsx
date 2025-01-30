
// import { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import Cookies from "js-cookie";
// import Header from "../../Components/Website/Header";

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [oldPassword, setOldPassword] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const navigate = useNavigate();

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/me`, {
//           withCredentials: true,
//         });
//         if (response.status === 201) {
          
//           setUser(response.data.user);
//         } else {
//           toast.error("Failed to fetch user profile");
//         }
//       } catch (error) {
//         console.log(error)
//         toast.error("Authentication required. Redirecting to login...");
//         setTimeout(() => navigate("/login"), 2000);
//       }
//     };
//     fetchProfile();
//   }, [navigate]);

//   const handleLogout = () => {
//     localStorage.clear();
//     Cookies.remove("token");
//     axios
//       .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/logout`, {}, { withCredentials: true })
//       .then(() => {
//         toast.success("Logged out successfully");
//         setUser(null);
//         navigate("/login");
//       })
//       .catch(() => toast.error("Error logging out"));
//   };

//   const handlePasswordUpdate = async () => {
//     try {
//       const response = await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/api/v1/password/update`,
//         { oldPassword, newPassword },
//         { withCredentials: true }
//       );
//       if (response.status === 200) {
//         toast.success("Password updated successfully");
//         setShowModal(false);
//         setOldPassword("");
//         setNewPassword("");
//       }
//     } catch (error) {
//       toast.error(error.response?.data?.message || "unable to update password");
//     }
//   };

//   return (
//     <>
//     <Header/>
//     <div className="h-auto mt-3 p-4 md:p-8 bg-gray-50">
//       <ToastContainer position="top-right" autoClose={3000} />
//       <div className="text-[22px] md:text-[25px] font-bold">
//         <h1>User Profile</h1>
//       </div>
//       {user ? (
//         <div className="mt-6 flex items-center">
//           <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-[18px] font-medium">
//             {user.image ? (
//               <img src={user.image} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
//             ) : (
//               user.name.charAt(0).toUpperCase()
//             )}
//           </div>
//           <div className="ml-4">
//             <p className="text-[18px] font-medium">Hello, {user.name}!</p>
//             <p className="text-[16px]">Email: {user.email}</p>
//             <p className="text-[16px]">Role: {user.role}</p>
//             {user.role === "admin" && (
//               <button onClick={() => navigate("/admin")} className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md">
//                 Go to Admin Panel
//               </button>
//             )}
//             <button onClick={handleLogout} className="mt-4 ml-4 px-6 py-2 bg-red-500 text-white rounded-md">
//               Logout
//             </button>
//             <button onClick={() => setShowModal(true)} className="mt-4 ml-4 px-6 py-2 bg-green-500 text-white rounded-md">
//               Update Password
//             </button>
//           </div>
//         </div>
//       ) : (
//         <p className="mt-6 text-[16px]">Loading profile...</p>
//       )}

//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-bold mb-4">Update Password</h2>
//             <input
//               type="password"
//               placeholder="Old Password"
//               value={oldPassword}
//               onChange={(e) => setOldPassword(e.target.value)}
//               className="w-full p-2 mb-3 border rounded"
//             />
//             <input
//               type="password"
//               placeholder="New Password"
//               value={newPassword}
//               onChange={(e) => setNewPassword(e.target.value)}
//               className="w-full p-2 mb-3 border rounded"
//             />
//             <div className="flex justify-end">
//               <button onClick={() => setShowModal(false)} className="mr-3 px-4 py-2 bg-gray-500 text-white rounded-md">
//                 Cancel
//               </button>
//               <button onClick={handlePasswordUpdate} className="px-4 py-2 bg-green-500 text-white rounded-md">
//                 Update
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//     </>
//   );
// };

// export default Profile;


import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import Header from "../../Components/Website/Header";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/me`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          setUser(response.data.user);
        } else {
          toast.error("Failed to fetch user profile");
        }
      } catch (error) {
        console.error("Error fetching profile: ", error);
        if (error.response) {
          toast.error(error.response.data.message || "Failed to fetch user profile");
        } else {
          toast.error("Authentication required. Redirecting to login...");
        }
        setTimeout(() => navigate("/login"), 2000);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    Cookies.remove("token");
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/logout`, {}, { withCredentials: true })
      .then(() => {
        toast.success("Logged out successfully");
        setUser(null);
        navigate("/login");
      })
      .catch(() => toast.error("Error logging out"));
  };

  const handlePasswordUpdate = async () => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/v1/password/update`,
        { oldPassword, newPassword },
        { withCredentials: true }
      );
      if (response.status === 200) {
        toast.success("Password updated successfully");
        setShowModal(false);
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to update password");
    }
  };

  return (
    <>
      <Header />
      <div className="h-auto mt-3 p-4 md:p-8 bg-gray-50">
        <ToastContainer position="top-right" autoClose={3000} />
        <div className="text-[22px] md:text-[25px] font-bold">
          <h1>User Profile</h1>
        </div>
        {user ? (
          <div className="mt-6 flex items-center">
            <div className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center text-[18px] font-medium">
              {user.image ? (
                <img src={user.image} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div className="ml-4">
              <p className="text-[18px] font-medium">Hello, {user.name}!</p>
              <p className="text-[16px]">Email: {user.email}</p>
              <p className="text-[16px]">Role: {user.role}</p>
              {user.role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-md"
                >
                  Go to Admin Panel
                </button>
              )}
              <button
                onClick={handleLogout}
                className="mt-4 ml-4 px-6 py-2 bg-red-500 text-white rounded-md"
              >
                Logout
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 ml-4 px-6 py-2 bg-green-500 text-white rounded-md"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : (
          <p className="mt-6 text-[16px]">Loading profile...</p>
        )}

        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <h2 className="text-xl font-bold mb-4">Update Password</h2>
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 mb-3 border rounded"
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="mr-3 px-4 py-2 bg-gray-500 text-white rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePasswordUpdate}
                  className="px-4 py-2 bg-green-500 text-white rounded-md"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Profile;
