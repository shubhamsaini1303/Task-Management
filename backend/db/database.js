// const mongoose = require("mongoose");

// const connectDatabse =  () => {

// mongoose.connect(process.env.DB_URI, {
// }).then((data)=>{console.log(`mongodb connected with server ${data.connection.host}`);
// });
// };

// module.exports = connectDatabse;



// Import necessary modules
require('dotenv').config();  // Ensure to load environment variables from .env file
const mongoose = require('mongoose');

// MongoDB connection function
const connectToDatabase = async () => {
  const MONGO_URI = process.env.DB_URI;  // MongoDB URI from environment variables

  if (!MONGO_URI) {
    console.error('MongoDB URI is not defined in the environment variables');
    process.exit(1); // Exit the process if no URI is provided
  }

  try {
    // Connect to MongoDB with the given URI
    await mongoose.connect(MONGO_URI);

    console.log('Connected to MongoDB successfully');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    process.exit(1); // Exit the process with failure on error
  }
};

// Export the function for external use
module.exports = connectToDatabase;
