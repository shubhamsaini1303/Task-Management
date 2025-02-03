/* eslint-disable react-hooks/exhaustive-deps */

 /* eslint-disable react-hooks/exhaustive-deps */
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
   const [newTask, setNewTask] = useState({
     title: "",
     description: "",
     dueDate: "",
     status: "Pending",
   });
   const [editingTask, setEditingTask] = useState(null);
   const [editedTask, setEditedTask] = useState({});
   const [showPopup, setShowPopup] = useState(false);
  
    // Filter states
   const [statusFilter, setStatusFilter] = useState("All");
   const [dueDateFilter, setDueDateFilter] = useState("");

      const token = Cookies.get("token");
  
   useEffect(() => {
     if (!token) {
       toast.error("Please login first!");
       setTimeout(() => navigate("/login"), 1500);
     }
   }, [token, navigate]);


   const fetchTasks = async () => {
     try {
       const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/v1/task/my`, {
        headers: { Authorization: `Bearer ${token}` }
        //  withCredentials: true,
       });
  
       if (response.status === 200 && response.data && response.data.tasks) {
         let filteredTasks = response.data.tasks;
  
          // Apply Status Filter
         if (statusFilter !== "All") {
           filteredTasks = filteredTasks.filter((task) => task.status === statusFilter);
         }
  
          // Apply Due Date Filter
         if (dueDateFilter) {
           filteredTasks = filteredTasks.filter((task) => {
             const taskDate = new Date(task.dueDate).toLocaleDateString();
             const filterDate = new Date(dueDateFilter).toLocaleDateString();
             return taskDate === filterDate;
           });
         }
  
         if (filteredTasks.length === 0) {
           toast.info("No tasks found with the applied filters.");
         }
  
         setTasks(filteredTasks);
       } else {
         toast.error("Failed to fetch tasks.");
       }
     } catch (error) {
       console.error(error);
       if (error.response && error.response.data) {
          // Show specific error message from API if available
          toast.error(error.response.data.message || "An error occurred.");
       } else {
         toast.error("Please Login First and Access this resource");
       }
     }
   };
  

   const createTask = async () => {
     const { title, description, dueDate, status } = newTask;
     if (!title.trim() || !description.trim() || !dueDate) {
       toast.warning("All fields are required.");
       return;
     }

     try {
       const response = await axios.post(
         `${import.meta.env.VITE_API_BASE_URL}/api/v1/task/create`,
         { title, description, dueDate, status },
        {headers: { Authorization: `Bearer ${token}` }}
        //  { withCredentials: true }
       );
       if (response.status === 201) {
         toast.success("Task created successfully!");
         setNewTask({ title: "", description: "", dueDate: "", status: "Pending" });
         fetchTasks();
       }
     } catch (error) {
       console.error(error);
       toast.error("Error creating task.");
     }
   };

   const updateTask = async () => {
     if (!editingTask) return;
     try {
       const response = await axios.put(
         `${import.meta.env.VITE_API_BASE_URL}/api/v1/task/update/${editingTask}`,
         editedTask,
        {headers: { Authorization: `Bearer ${token}` }}
        //  { withCredentials: true }
       );
       if (response.status === 200) {
         toast.success("Task updated successfully!");
         setShowPopup(false);
         setEditingTask(null);
         setEditedTask({});
         fetchTasks();
       }
     } catch (error) {
       console.error(error);
       toast.error("Error updating task.");
     }
   };

   const deleteTask = async (id) => {
     try {
       const response = await axios.delete(
         `${import.meta.env.VITE_API_BASE_URL}/api/v1/task/delete/${id}`,
        {headers: { Authorization: `Bearer ${token}` }}
        //  { withCredentials: true }
       );
       if (response.status === 200) {
         toast.success("Task deleted successfully!");
         fetchTasks();
       }
     } catch (error) {
       console.error(error);
       toast.error("Error deleting task.");
     }
   };

   useEffect(() => {
     fetchTasks();
   }, [statusFilter, dueDateFilter]);  // Re-fetch tasks when filters change

   return (

     <>
     <Header />
     <div className="h-auto mt-3 p-4 md:p-8">
       <ToastContainer position="top-right" autoClose={3000} />
       <div className="text-[22px] md:text-[25px] text-center font-bold">
         <h1>Task Manager</h1>
       </div>

       {/* Filter Section */}
       <div className="mt-4 flex flex-wrap gap-4 p-4 rounded-lg ">
   <select
     value={statusFilter}
     onChange={(e) => setStatusFilter(e.target.value)}
     className="border rounded p-2 w-full sm:w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
   >
     <option value="All">All Status</option>
     <option value="Pending">Pending</option>
     <option value="In Progress">In Progress</option>
     <option value="Completed">Completed</option>
   </select>

   <input
     type="date"
     value={dueDateFilter}
     onChange={(e) => setDueDateFilter(e.target.value)}
     className="border-2 border-black rounded p-2 w-full sm:w-[200px] focus:outline-none focus:ring-2 focus:ring-blue-500"
   />

   <button
     onClick={fetchTasks}
     className="bg-blue-500 w-full sm:w-[200px] text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-300 ease-in-out"
   >
     Apply Filters
   </button>
 </div>


       {/* Create Task Form */}
       <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         <input
           type="text"
           placeholder="Title"
           value={newTask.title}
           onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
           className="border rounded p-2"
         />
         <input
           type="text"
           placeholder="Description"
           value={newTask.description}
           onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
           className="border rounded p-2"
         />
         <input
           type="date"
           value={newTask.dueDate}
           onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
           className="border rounded p-2"
         />
         <button onClick={createTask} className="bg-blue-500 text-white py-2 px-4 rounded">Create</button>
       </div>

       {/* Task List */}
       <div className="mt-6 ">
   {tasks.length > 0 ? (
     <div className=" ">
       {tasks.map((task, index) => (
         <div key={task._id} className="shadow-xl  m-2">
           <div className="col-span-1 border p-2">{index + 1}</div>
           <div className="col-span-1 border p-2 font-bold">{task.title}</div>
           <div className="col-span-1 border p-2">{task.description}</div>
           <div className="col-span-1 border p-2 text-gray-500 text-sm">
             {new Date(task.dueDate).toLocaleDateString()}
           </div>
           <div className="col-span-1 border p-2 text-blue-500">{task.status}</div>
           <div className="col-span-1border p-2">
             <button 
               onClick={() => { setEditingTask(task._id); setEditedTask(task); setShowPopup(true); }} 
               className="bg-yellow-500 text-white py-1 px-3 rounded mr-2">
               Edit
             </button>
             <button 
               onClick={() => deleteTask(task._id)} 
               className="bg-red-500 text-white py-1 px-3 rounded">
               Delete
             </button>
           </div>
         </div>
       ))}
     </div>
   ) : (
     <p>No tasks found.</p>
   )}
 </div>

       {/* Update Task Popup */}
       {showPopup && (
         <div className="fixed top-0 left-0 w-full h-full bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
           <div className="bg-white p-6 rounded-md w-full max-w-lg">
             <h2 className="text-xl font-bold mb-4">Edit Task</h2>
             <input
               type="text"
               value={editedTask.title}
               onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
               className="border rounded p-2 mb-2 w-full"
             />
             <input
               type="text"
               value={editedTask.description}
               onChange={(e) => setEditedTask({ ...editedTask, description: e.target.value })}
               className="border rounded p-2 mb-2 w-full"
             />
             <input
               type="date"
               value={editedTask.dueDate?.split("T")[0]}
               onChange={(e) => setEditedTask({ ...editedTask, dueDate: e.target.value })}
               className="border rounded p-2 mb-2 w-full"
             />
             <select
               value={editedTask.status}
               onChange={(e) => setEditedTask({ ...editedTask, status: e.target.value })}
               className="border rounded p-2 mb-2 w-full"
             >
               <option value="Pending">Pending</option>
               <option value="In Progress">In Progress</option>
               <option value="Completed">Completed</option>
             </select>
             <div className="flex justify-between">
               <button onClick={updateTask} className="bg-green-500 text-white py-2 px-4 rounded">
                 Save
               </button>
               <button onClick={() => setShowPopup(false)} className="bg-gray-500 text-white py-2 px-4 rounded">
                 Close
               </button>
             </div>
           </div>
         </div>
       )}
     </div>
     </>

   );
 };

 export default TaskManager;
