const mongoose = require('mongoose');
const validator = require("validator");
const bcrypt=require("bcrypt")
const userSchema = new mongoose.Schema(
  {
    photo: {
      type: String,
      default:""
  },
    name: {
      type: String,
      required: [true, 'Please add your name'],
      trim: true,
      maxlength: [50, 'Name cannot be more than 50 characters']
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Please provide a valid email"],
      index: true // Optimizes queries by email
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      trim: true,
      select:false,
      minLength: [8, "Password cannot be less than 8 characters"],
      maxLength:[20,"Password cannot be more that 20 characters"]
    },
    passwordConfirm: {
      type: String,
      required: [true, "Please confirm your   password"],
      trim: true,
      select:false,
      minLength: [8, "Password cannot be less than 8 characters"],
      maxLength: [20, "Password cannot be more that 20 characters"],
      validate: {
        validator: function (passCode) {
          return passCode === this.password
        },
        message:"Passwords do not match"
      }
    },
    passwordChangedAt: Date,
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
 })
// Comparative instance method
userSchema.methods.correctPassword =async function (storedUserPassword, userInputPassword) {
  return await bcrypt.compare(userInputPassword, storedUserPassword)
}

userSchema.methods.passwordHasChanged = async function (jwtTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000);
    const changed = changedTimestamp > jwtTimestamp;
    return changed;
}
  return false
}
const UserModel=mongoose.model("User",userSchema)
module.exports = UserModel;
