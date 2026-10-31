const express = require("express");
const usersRouter = express.Router();
const {
  createUser,
  deleteUser,
  updateUser,
  signUp,
  login
} = require("../../controllers/v2Controllers/users.controller")
const {isAdmin,protectRoute}=require("../../services/auth")

usersRouter.post("/signup", signUp);
usersRouter.post("/login",login)

usersRouter.post("/", createUser);
usersRouter.delete("/:userId",[protectRoute,isAdmin],deleteUser);
usersRouter.patch("/:userId",[protectRoute],updateUser)

module.exports = usersRouter;
