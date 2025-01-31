/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";



const AllTasks = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

 const token = Cookies.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [token, navigate]);



  // Fetch tasks from API
  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/admin/get-all-tasks`, {
        headers: { Authorization: `Bearer ${token}` }
        // withCredentials: true,
      });
      if (response.status === 200) {
        setTasks(response.data.tasks);

      } else {
        toast.error("Failed to fetch tasks.");
      }
    } catch (error) {
      console.error(error);
      // toast.error("Error fetching tasks.");
    }
  };


  // Delete task
  const deleteTaskByAdmin = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/delete-by-admin/${id}`, 
       { headers: { Authorization: `Bearer ${token}` } });
        // { withCredentials: true });
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      console.error(error);
      toast.error("Error deleting task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="container mx-auto p-4 md:p-8">
      <ToastContainer position="top-right" autoClose={3000} />
      <h1 className="text-2xl md:text-3xl font-bold mb-4">All Task</h1>
      {/* Task List */}
      <div className="bg-white shadow-md rounded-md overflow-x-auto">
        <table className="w-full table-auto">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <tr>
              <th className="py-3 px-6 text-left">No.</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Description</th>
              <th className="py-3 px-6 text-left">Due Date</th>
              <th className="py-3 px-6 text-left">Creater's Id</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <tr key={task._id} className="border-b border-gray-200 hover:bg-gray-100">
                  <td className="py-3 px-6">{index + 1}</td>
                  <td className="py-3 px-6">{task.title}</td>
                  <td className="py-3 px-6">{task.description}</td>
                  <td className="py-3 px-6">{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6">{task.user}</td>
                  <td className="py-3 px-6 text-center">{task.status}</td>
                  <td className="py-3 px-6 text-center">
                    <button onClick={() => deleteTaskByAdmin(task._id)} className="bg-red-500 text-white py-1 px-3 rounded">Delete</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">No tasks found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AllTasks;
