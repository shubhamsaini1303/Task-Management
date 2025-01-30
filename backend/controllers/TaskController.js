const TaskModel = require("../models/taskModel");
const User = require("../models/taskModel");
const { validationResult } = require("express-validator");

// Create a new task

exports.create = async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, dueDate, status } = req.body;

    // Create the new task
    const newTask = new TaskModel({
      title,
      description,
      dueDate,
      status,
      user: req.user.id, // Assuming user ID is stored in req.user.id after authentication
    });

    // Save the task
    await newTask.save();

    // Populate user details
    const populatedTask = await TaskModel.findById(newTask._id).populate('user', 'name email');

    return res.status(201).json({
      message: 'Task created successfully',
      task: populatedTask,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// View all tasks for the logged-in user
exports.mytask = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user.id })
      .populate('user', 'name email') // Fetch user details (name and email)
      .sort({ createdAt: -1 });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};


// Update an existing task
exports.update = async (req, res) => {
  try {
    const { title, description, dueDate, status } = req.body;
    const taskId = req.params.id;

    const task = await TaskModel.findOne({ _id: taskId, user: req.user.id });
    if (!task) {
      return res.status(404).json({ message: "Task not found or not authorized" });
    }

    // Update task fields if provided
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.status = status || task.status;

    await task.save();

    return res.status(200).json({
      message: "Task updated successfully",
      task,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a task
exports.deletetask = async (req, res) => {
    try {
      const taskId = req.params.id;
  
      // Ensure user is authenticated
      if (!req.user || !req.user.id) {
        return res.status(401).json({ message: "Unauthorized" });
      }
  
      // Find the task by ID and ensure it belongs to the authenticated user
      const task = await TaskModel.findOne({ _id: taskId, user: req.user.id });
      if (!task) {
        return res.status(404).json({ message: "Task not found or not authorized" });
      }
  
      // Use findByIdAndDelete to delete the task
      await TaskModel.findByIdAndDelete(taskId);
  
      return res.status(200).json({
        message: "Task deleted successfully",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  

// Get all tasks for admin users
exports.getalltasksbyadmin = async (req, res) => {
  try {
    // Only allow admins to access
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: "Access denied, admin only" });
    }

    const tasks = await TaskModel.find().sort({ createdAt: -1 });

    if (tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }

    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Admin deletes a task by task ID
exports.deletetaskbyadmin = async (req, res) => {
    try {
      // Only allow admins to delete tasks
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: "Access denied, admin only" });
      }
  
      const taskId = req.params.id;
  
      // Find the task by its ID
      const task = await TaskModel.findById(taskId);
      if (!task) {
        return res.status(404).json({ message: "Task not found" });
      }
  
      // Use findByIdAndDelete instead of remove
      await TaskModel.findByIdAndDelete(taskId);
  
      return res.status(200).json({
        message: "Task deleted by admin successfully",
      });
    } catch (error) {
      // Log detailed error to help debug
      console.error("Error deleting task by admin:", error);
      return res.status(500).json({ message: "Server error" });
    }
  };
  