const UsersModel=require("../../models/users.model")
const catchAsync = require("../../utils/catchAsync");
const AppError = require("../../utils/appError");
const { signUp, login } = require("../../services/auth")

const deleteUser = catchAsync(async function (req, res, next) {
  if(req.params.userId)return next(new AppError(400,"Please provide the users's userId to delete"))
  const user = req.usersModel.findByIdAndDelete(req.params.userId);
  return res.status(204).json({
    status: "Successful!",
    user,
  })
})

const updateUser = catchAsync(async function (req,res,next) {
  const {  name  }  =  req.body;
  const photo = req.file;
if(!photo||!name)return next(new AppError(403,"Please provide the field to be updated."))

  if (name) {
  // Update name
  } else {
    // Update photo
}

})

module.exports = {
  createUser:signUp,
  deleteUser,
  updateUser,
  signUp,
  login
}
