const express = require("express");
const { register, login, logout, getUserDetails, updatePassword, getAllUsers, DeleteUser, verifyCode } = require("../controllers/UserController");
       const {isAuthenticatedUser , authorizeRoles} = require("../middleware/authmoddleware");
const UserRouter = express.Router();

UserRouter.route("/register").post(register);

UserRouter.route("/login").post(login);

UserRouter.route("/logout").post(logout);

UserRouter.route("/verify/:name").post(verifyCode);

UserRouter.route("/me").get(isAuthenticatedUser,getUserDetails);

UserRouter.route("/password/update").put(isAuthenticatedUser, updatePassword)

UserRouter.route("/admin/get-all-users").get(isAuthenticatedUser, authorizeRoles("admin"),getAllUsers);

UserRouter.route("/admin/delete-user/:id").delete(isAuthenticatedUser, authorizeRoles("admin"),DeleteUser);

module.exports= UserRouter;  