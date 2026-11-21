const UsersModel=require("../../models/users.model")
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { signUp, login } = require("../../services/auth")

const createUser = catchAsync(async function (req, res, next) {
  const {
    userName,
  password,
  passwordConfirm,
    email,role } = req.body;

  if (password !== passwordConfirm) return next(new AppError(400, "Passwords do not match "));

  const newUser = await UsersModel.create({
    name:userName,
    password,
    passwordConfirm,
    email,role
  })

  return res.status(201).json({
    status: "Successful",
    data: {
      newUser
    }
  })
})
const getAllUsers = catchAsync(async function (req, res, next) {
  const allUsers = await UsersModel.find({active:true})||[];
  return res.status(200).json({
    status: "Success",
    results: allUsers.length,
    data: {
      users: allUsers
  }
  })
})
const deleteUser = catchAsync(async function (req, res, next) {
      if(req.params.userId)return next(new AppError(400,"Please provide the users's userId to delete"))
      const user = req.usersModel.findByIdAndDelete(req.params.userId);
      if (!user) return next(new AppError(404, "There is no user with the specified id"));
      return res.status(204).json({
        status: "Successful!",
        data: { user },
      })
      })
const updateUser = catchAsync(async function (req, res, next) {
  const updatedUser = await UsersModel.findByIdAndUpdate({ _id: req.params.userId }, {
    $set:{ role:req.body.role }
  }, {
    // new: true, Deprecated
    returnDocument: 'after',
    runValidators: true
  })

  if (!updatedUser )return next(new AppError(404,"There is no user with the specified id"))

  return res.status(200).json({
    status: "Successful",
    data: {
      updatedUser
    }
  })
})

module.exports = {
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
  signUp,
  login
}
