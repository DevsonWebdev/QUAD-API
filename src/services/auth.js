const UserModel = require("../models/users.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createToken, verifyToken }=require("../utils/jwt.util")

const signUp = catchAsync(async function (req, res, next) {
  const {
    userName,
  password,
  passwordConfirm,
    email, } = req.body;

  if (password !== passwordConfirm) return next(new AppError(400, "Passwords do not match "));

  const newUser = await UserModel.create({
    name:userName,
    password,
    passwordConfirm,
    email
  })
  const token = createToken(newUser._id)
  res.status(201).json({
    status: "Success!",
    user: {
      userName: newUser.name,
      email: newUser.email,
      photo:newUser.photo
    },
    token
  })
})

const login = catchAsync(async function (req,res,next) {
  const { password, email } = req.body;
  if (!email || !password) return next(new AppError(400, "Please provide the required credentials"));

  const user =await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword( user.password,password)))
    return next(new AppError(401, "Incorrect password or email, Please provide the correct credentials"));
  const token=createToken(user._id)
  res.status(200).json({
    status: "Success",
    user: {
      userName: user.name,
      photo:user.photo
    },
    token
  })
  })

const protectRoute = catchAsync(async function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) return next(new AppError(401, "You are not logged in ,please log in."))

  const decoded = await verifyToken(token);

  const user = await UserModel.findById(decoded.id);
  if (!user) return next(new AppError(401, "The user to whom this token belongs does not exist."))

  if((await user.passwordHasChanged(decoded.iat)))return next(new AppError(401,"User recently changed password, please login again."))
  req.user = user;
  next()
})

const isAllowedTo =(...roles)=> catchAsync(async function (req, res, next) {
  if(!roles.includes(req.user.role))return next(new AppError(401,"Action denied, you are not authorised to perform this action"))
  next()
});

module.exports = {
  signUp,login,protectRoute,isAllowedTo
}
