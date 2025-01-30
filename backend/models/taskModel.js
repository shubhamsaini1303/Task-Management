// const mongoose = require('mongoose');

// // Assuming you have a User model already
// const User = require('../models/userModel'); // Adjust the path as per your project structure

// const taskSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     description: {
//       type: String,
//       required: true,
//     },
//     dueDate: {
//       type: Date,
//       required: true,
//     },
//     status: {
//       type: String,
//       enum: ['Pending', 'In Progress', 'Completed'],
//       default: 'Pending',
//     },
//     user: [{
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'User', // Reference to the User model
//       required: true,
//     }],
//   },
//   {
//     timestamps: true, // This will add createdAt and updatedAt fields
//   }
// );

// const Task = mongoose.model('Task', taskSchema);

// module.exports = Task;


const mongoose = require('mongoose');
const User = require('../models/userModel'); // Adjust the path as per your project structure

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['Pending', 'In Progress', 'Completed'],
      default: 'Pending',
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model
      required: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
