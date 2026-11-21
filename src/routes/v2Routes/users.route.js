const express = require("express");
const {profilePhoto}=require("../../middleware/multer")
const {imageResizer}=require("../../middleware/fileMiddleware")
const usersRouter = express.Router();
const {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  signUp,
  login,
} = require("../../controllers/v2Controllers/users.controller")
const {
  isAllowedTo,
  protectRoute,
  forgotPassword,
  resetPassword,
  updatePassword,
  updateMe,
  deleteMe,
  getAccountInfo,
  changeProfilePhoto} = require("../../services/auth")

usersRouter.post("/signup",signUp);
usersRouter.post("/login", login);
usersRouter.get("/my-account", [protectRoute, isAllowedTo("user", "admin")], getAccountInfo)
usersRouter.post("/forgotPassword", forgotPassword);
usersRouter.patch("/updatePassword", protectRoute, updatePassword);
usersRouter.patch("/updateMe", protectRoute,updateMe)
usersRouter.patch("/change-profile-photo", protectRoute, profilePhoto,imageResizer, changeProfilePhoto)
usersRouter.delete("/deleteMe",protectRoute,deleteMe)
usersRouter.patch("/resetPassword/:resetToken", protectRoute, resetPassword);

usersRouter.get("/",[protectRoute,isAllowedTo("admin")],getAllUsers)
usersRouter.post("/",[protectRoute,isAllowedTo("admin")], createUser);
usersRouter.delete("/:userId",[protectRoute,isAllowedTo("admin")],deleteUser);
usersRouter.patch("/:userId",[protectRoute,isAllowedTo("admin")],updateUser)

module.exports = usersRouter;
