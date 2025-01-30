const express = require("express");
const { create, mytask, update, deletetask, deletetaskbyadmin, getalltasksbyadmin } = require("../controllers/TaskController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/authmoddleware");
const TaskRouter = express.Router();

TaskRouter.route("/create").post(isAuthenticatedUser , create);

TaskRouter.route("/my").get(isAuthenticatedUser, mytask);

TaskRouter.route("/update/:id").put(isAuthenticatedUser,update);

TaskRouter.route("/delete/:id").delete(isAuthenticatedUser , deletetask);

TaskRouter.route("/delete-by-admin/:id").delete(isAuthenticatedUser , authorizeRoles("admin"), deletetaskbyadmin);

TaskRouter.route("/admin/get-all-tasks").get(isAuthenticatedUser , authorizeRoles("admin"), getalltasksbyadmin);


module.exports = TaskRouter;