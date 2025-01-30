const UserModel = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendVerificationEmail } = require("../helper/sendVerificationEmail");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        success: false,
        message: "All fields are required." 
      });
    }

    // Check if a user with the same email exists
    const existingUser = await UserModel.findOne({ email });

    const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (existingUser) {
      if (existingUser.isVerified) {
        return res.status(400).json({ 
          success: false,
          message: "Email already registered." 
        });
      } else {
        // Update existing unverified user with new password and verification code
        existingUser.password = await bcrypt.hash(password, 10);
        existingUser.verifyCode = verifyCode;
        existingUser.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry
        await existingUser.save();

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, name, verifyCode);
        if (!emailResponse.success) {
          return res.status(500).json({
            success: false,
            message: emailResponse.message,
          });
        }

        return res.status(200).json({
          success: true,
          message: "User already exists but email verification resent.",
        });
      }
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new UserModel({
      name,
      email,
      password: hashedPassword,
      verifyCode,
      verifyCodeExpiry: new Date(Date.now() + 3600000), // 1 hour expiry
      isVerified: false,
    });

    await newUser.save();

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, name, verifyCode);
    if (!emailResponse.success) {
      return res.status(500).json({
        success: false,
        message: emailResponse.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
    });
  } catch (error) {
    console.error("Error during user registration:", error);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message,
    });
  }
};

exports.verifyCode = async (req, res) => {
  try {
      const { code } = req.body;
      const { name } = req.params; // Get name from the URL params

      const decodedUsername = decodeURIComponent(name);
      const user = await UserModel.findOne({ name: decodedUsername });

      if (!user) {
          return res.status(404).json({
              success: false,
              message: "User not found"
          });
      }

      const isCodeValid = user.verifyCode === code;
      const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

      if (isCodeValid && isCodeNotExpired) {
          user.isVerified = true;
          await user.save();
          return res.status(200).json({
              success: true,
              message: "Account Verified Successfully"
          });
      } else if (!isCodeNotExpired) {
          return res.status(400).json({
              success: false,
              message: "Verification code has expired, please signup again to get a new code"
          });
      } else {
          return res.status(400).json({
              success: false,
              message: "Incorrect verification code"
          });
      }

  } catch (error) {
      console.error("Error verifying user", error);
      return res.status(500).json({
          success: false,
          message: "Error verifying user"
      });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // Find the user by email
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your account to access this resource." });
    }

    // Verify the password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials." });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, role: user.role }, // Include user details in the payload
      process.env.JWT_SECRET, // Use your JWT secret from environment variables
      { expiresIn: '7d' } // Set token expiration time
    );

    // Set the token in an HTTP-only cookie
    res.cookie('token', token, {
      httpOnly: true, // Makes the cookie inaccessible to client-side scripts
      secure: process.env.NODE_ENV, // Set secure flag in production
      sameSite: 'strict', // Prevent CSRF attacks
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // Send response with message and token (if needed on the client side)
    res.status(200).json({ 
      message: "Login successful", 
      status: 1,
      token,
      user
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in.", error: error.message });
  }
};


exports.logout = (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV,
    });

    res.status(200).json({ message: "Logout successful." });
  } catch (error) {
    res.status(500).json({ message: "Error logging out.", error: error.message });
  }
};


// Get User Details
exports.getUserDetails = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details.", error: error.message });
  }
};

// Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: "Profile updated successfully.", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating profile.", error: error.message });
  }
};

// Update Password
exports.updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await UserModel.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Old password is incorrect." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.status(200).json({ message: "Password updated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error updating password.", error: error.message });
  }
};

// Get All Users (Admin Only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await UserModel.find();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users.", error: error.message });
  }
};

// Delete User (Admin Only)
exports.DeleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user.", error: error.message });
  }
}; 
