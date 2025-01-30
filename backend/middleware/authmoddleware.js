// const jwt = require("jsonwebtoken");
// const User = require("../models/userModel");

// exports.isAuthenticatedUser = async (req, res, next) => {
//   try {
//     const { token } = req.cookies;

//     if (!token) {
//       return res.status(401).json({ message: "Please Login to access this resource" });
//     }

//     const decodedData = jwt.verify(token, process.env.JWT_SECRET);

//     req.user = await User.findById(decodedData.id);
//     next();
//   } catch (error) {
//     res.status(401).json({ message: "Authentication failed" });
//   }
// };

// exports.authorizeRoles = (...roles) => {
//   return (req, res, next) => {
//     if (!roles.includes(req.user.role)) {
//       return res.status(403).json({
//         message: `Role: ${req.user.role} is not allowed to access this resource`,
//       });
//     }
//     next();
//   };
// };



const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

exports.isAuthenticatedUser = async (req, res, next) => {
    try {
        let token;

        // Check if the token is in cookies or in the Authorization header (Bearer token)
        if (req.cookies.token) {
            token = req.cookies.token;
        } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1]; // Bearer <token>
        }

        if (!token) {
            return res.status(401).json({ success: false, message: "Please login to access this resource" });
        }

        // Verify the token
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);

        // Fetch user details from the database using the decoded token ID
        req.user = await User.findById(decodedData.id);
        if (!req.user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        next();
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
            if (!roles.includes(req.user.role)) {
                return res.status(403).json({ success: false, message: `Role: ${req.user.role} is not allowed to access this resource` });
            }
            next();
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    };
};