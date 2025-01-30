const mongoose = require("mongoose");
const { Schema } = mongoose;

// User schema
const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "please enter your username"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, "please enter your email"],
        unique: true,
        match: [/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "Please enter a valid Gmail address"]
    },
    password: {
        type: String,
        required: [true, "please enter your password"]
    },
    verifyCode: {
        type: String,
        required: [true, "please enter your verification code "]
    },
    verifyCodeExpiry: {
        type: Date,
        required: [true, "verification code is expire"]
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    role: {
        type: String,
        enum: ["admin","user"],
        default: "user",
    },
});


const User = mongoose.model("User" , UserSchema);

module.exports = User;