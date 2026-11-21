const UserModel = require("../models/users.model");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const { createToken, verifyToken } = require("../utils/jwt.util")
const crypto=require("crypto")
const sendEmail=require("../services/email")
const sendToken =function (res, user,statusCode=200) {
  const cookieOpts = {
    expires:new Date(Date.now()+(process.env.JWT_COOKIE_EXPIRES*24*60*60*1000)),
    httpOnly: true,
  }

  if (process.env.NODE_ENV === "production") {
    cookieOpts.secure = true;
  }

  const token = createToken(user._id);
  res.cookie("jwt", token, cookieOpts)

  res.status(statusCode).json({
    status: "Success!",
    data: {
      user: {
        userName: user.name,
        email: user.email,
        photo:user.photo
      },
    },
    token
  })
}

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
return sendToken(res,newUser,200)
})

const login = catchAsync(async function (req,res,next) {
  const { password, email } = req.body;
  if (!email || !password) return next(new AppError(400, "Please provide the required credentials"));

  const user =await UserModel.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword( user.password,password)))
    return next(new AppError(401, "Incorrect password or email, Please provide the correct credentials"));
  return sendToken(res,user)
  })

const protectRoute = catchAsync(async function (req, res, next) {
  let token;
  if (req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  } else {
    token = req.cookies.jwt;
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

const forgotPassword = catchAsync(async function (req, res, next) {
    const { email } = req.body;
    if (!email) return next(new AppError(400, "Please provide your email"));

    const user = await UserModel.findOne({ email });
    if (!user) return next(new AppError(404, "The user with the email specified does not exist, Please sign up for an account."));
    // Generating random reset token
    const resetToken = await user.createPasswordResetToken();
    // Saving previous changes
    await user.save({ validationBeforeSave: false })

  try {
      // Emailing user with reset token
  const resetUrl=`${req.protocol}://${req.get("host")}/api/v2/users/resetPassword/${resetToken}`
    await sendEmail({
      message: `Forgot your password? Submit a patch request with new password and passwordConfirm to:${resetUrl}\n If didn't please ignore this email `,
      email,
      Subject:"Your password reset token (Valid for 10minutes)"
    })
//========MUST CLEAR RESET TOKEN FROM RES
    return res.status(200).json({ resetToken,
      status: "Success",
      message:"Please check your email and click on the link provided to reset your password."
    })
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // Saving previous changes
    await user.save({ validationBeforeSave: false })
    return next(new AppError(500,"There was an error sending the reset email,please try again later."))
}
})

const resetPassword = catchAsync(async function (req, res, next) {
  const { password, passwordConfirm } = req.body;
  const { resetToken } = req.params;
  if(!resetToken)return next(new AppError(400,"Reset token is not available, try retriveing it via forgot password"))

  const hashedToken = crypto.createHash("sha256").update(resetToken).digest("hex")
  const user = await UserModel.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt:Date.now()}
  })
  if (!user) return next(new AppError(400, "Invalid reset token or it has expired"))
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
 return sendToken(res,user)
})

const updatePassword = catchAsync(async function (req, res, next) {
  const { currentPassword, newPassword,newPasswordConfirm} = req.body;
  if(!currentPassword||!newPassword)return next(new AppError(400,"Please provide the required credentials to continue password update."))

  const user = await UserModel.findOne({ email: req.user.email }).select("+password");
  const isCorrectPassword = await user.correctPassword(user.password, currentPassword);

  if(!user||!isCorrectPassword)return next(new AppError(401,"Wrong password or email,please provide the correct password"))
  user.password = newPassword;
  user.passwordConfirm = newPasswordConfirm;
  await user.save();

  const token=createToken(user._id)
  res.status(200).json({
    status: "Success",
    message:"Your password was successfully update",
    user: {
      userName: user.name,
      photo:user.photo
    },
    token
  })
})

const updateMe = catchAsync(async function (req, res, next) {
  const { password, passwordConfirm,name,email, } = req.body;
  if(password||passwordConfirm)return next(new AppError(400,"This route is not for updating passwords."))

  const updatedUser = await UserModel.findByIdAndUpdate(req.user._id, {
    email,
    name,
    photo: photo ? photo : undefined
  },{
    new: true,
    runValidators: true
  })

  res.status(200).json({
    status: "Success",
    message: "Your profile was successfully updated.",
    data:updatedUser
  })

})

 const deleteMe = catchAsync(async function (req,res,next) {
  await UserModel.findByIdAndUpdate(req.user._id, { active: false });

  return  res.status(204).json({
    status: "Success",
    data:null
  })
})

const getAccountInfo = catchAsync(async function (req, res, next) {
const user=req.user
  return res.status(200).json({
    status: "Success!",
    data: {
      user: {
        email: user.email,
        name: user.name,
        photo: user.photo,
        role:user.role
        } }
  })
 })

const changeProfilePhoto = catchAsync(async function (req, res, next) {
  const updatedUser = await UserModel.findByIdAndUpdate({ _id: req.user._id }, {
    $set: {
      photo: req.body.photo
    }
  },
    {
      returnDocument: 'after',
      runValidators: true,
    });

 return res.status(201).json({
    status: "Success",
    data: {
      updatedUser
    }
})
})
module.exports = {
  signUp,
  login,
  protectRoute,
  isAllowedTo,
  forgotPassword,
  updatePassword,
  resetPassword,
  updateMe,
  deleteMe,
  getAccountInfo,
  changeProfilePhoto
}
