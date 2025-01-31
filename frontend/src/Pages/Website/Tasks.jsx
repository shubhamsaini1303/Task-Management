import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Header from "../../Components/Website/Header";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const TaskManager = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: "", description: "", dueDate: "", status: "Pending" });
  const [editingTask, setEditingTask] = useState(null);
  const [editedTask, setEditedTask] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [dueDateFilter, setDueDateFilter] = useState("");

  const token = Cookies.get("token");
  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      toast.error("Please login first!");
      setTimeout(() => navigate("/login"), 1500);
    }
  }, [token, navigate]);

  const fetchTasks = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/my`, authHeaders);
      if (response.status === 200 && response.data.tasks) {
        let filteredTasks = response.data.tasks;
        if (statusFilter !== "All") filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
        if (dueDateFilter) {
          filteredTasks = filteredTasks.filter(task => new Date(task.dueDate).toLocaleDateString() === new Date(dueDateFilter).toLocaleDateString());
        }
        if (filteredTasks.length === 0) toast.info("No tasks found with the applied filters.");
        setTasks(filteredTasks);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch tasks.");
    }
  };

  const createTask = async () => {
    if (!newTask.title.trim() || !newTask.description.trim() || !newTask.dueDate) {
      toast.warning("All fields are required.");
      return;
    }
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/create`, newTask, authHeaders);
      toast.success("Task created successfully!");
      setNewTask({ title: "", description: "", dueDate: "", status: "Pending" });
      fetchTasks();
    } catch (error) {
      toast.error("Error creating task.");
    }
  };

  const updateTask = async () => {
    if (!editingTask) return;
    try {
      await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/update/${editingTask}`, editedTask, authHeaders);
      toast.success("Task updated successfully!");
      setShowPopup(false);
      setEditingTask(null);
      setEditedTask({});
      fetchTasks();
    } catch (error) {
      toast.error("Error updating task.");
    }
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/delete/${id}`, authHeaders);
      toast.success("Task deleted successfully!");
      fetchTasks();
    } catch (error) {
      toast.error("Error deleting task.");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [statusFilter, dueDateFilter]);

  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold text-center">Task Manager</h1>
        <div className="flex gap-4 mt-4">
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border p-2">
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          <input type="date" value={dueDateFilter} onChange={(e) => setDueDateFilter(e.target.value)} className="border p-2" />
          <button onClick={fetchTasks} className="bg-blue-500 text-white p-2 rounded">Apply Filters</button>
        </div>
        <div className="mt-4">
          <input type="text" placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} className="border p-2" />
          <input type="text" placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} className="border p-2" />
          <input type="date" value={newTask.dueDate} onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })} className="border p-2" />
          <button onClick={createTask} className="bg-green-500 text-white p-2 rounded">Create</button>
        </div>
        <div className="mt-6">
          {tasks.length > 0 ? tasks.map((task) => (
            <div key={task._id} className="border p-2 mb-2">
              <h3 className="font-bold">{task.title}</h3>
              <p>{task.description}</p>
              <p>{new Date(task.dueDate).toLocaleDateString()}</p>
              <p>{task.status}</p>
              <button onClick={() => { setEditingTask(task._id); setEditedTask(task); setShowPopup(true); }} className="bg-yellow-500 text-white p-1 rounded">Edit</button>
              <button onClick={() => deleteTask(task._id)} className="bg-red-500 text-white p-1 rounded ml-2">Delete</button>
            </div>
          )) : <p>No tasks found.</p>}
        </div>
      </div>
    </>
  );
};
export default TaskManager;
