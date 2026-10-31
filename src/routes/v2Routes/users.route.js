const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  deleteUser,
  updateUser,
  signUp,
  login
} = require("../../controllers/v2Controllers/users.controller")
const {isAllowedTo,protectRoute}=require("../../services/auth")

usersRouter.post("/signup", signUp);
usersRouter.post("/login",login)

usersRouter.post("/",[protectRoute,isAllowedTo("admin")], createUser);
usersRouter.delete("/:userId",[protectRoute,isAllowedTo("admin")],deleteUser);
usersRouter.patch("/:userId",protectRoute,updateUser)

module.exports = usersRouter;
