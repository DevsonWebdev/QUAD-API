const { MulterError } = require("multer")
const AppError=require("../utils/appError")
function sendProdErr(err,res) {
    if (err.isOperational){
   return  res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    } else {
          console.error('ERROR 💥', err);
       return   res.status(500).json({
            status: 'error',
            message: 'Something went wrong!'
          });
        }
}
function sendDevErr(err, res) {
 return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
}

const handleJwtError = () => new AppError(401, "Invalid token.Please log in again.");
const handleJwtExpiredError = () => new AppError(401, "Your token has expired.Please log in again.");
const handleCastError = (err) => new AppError();
const handleDuplicationError=(err)=>new AppError(403,"User already exists log in to continue.")
const handleValidationError = (err) => new AppError();

function handleMulterErrors(error, res) {
  const { statusCode } = error;

  if (statusCode === "LIMIT_FIELD_KEY")
      return res.status(400).json({ status: "Failed", message: "Provide a field key " })

       if (statusCode === "LIMIT_FIELD_VALUE")
      return res.status(400).json({ status: "Failed", message: "Provide an image file" })

       if (statusCode === "LIMIT_FILE_SIZE")
      return res.status(400).json({ status: "Failed", message: "Image size too large, Max is 10Mbs" })
    }

async function handleGlobalErrors(error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === "development") {

    console.info("DEVELOPMENT ENVIRONMENT",process.env.NODE_ENV)
  return sendDevErr(error, res)
  }else if (process.env.NODE_ENV === "production") {
    console.info("PRODUCTION ENVIRONMENT",process.env.NODE_ENV)

    if (error instanceof MulterError){
      return handleMulterErrors(error)
    }

    if (error.name === "TokenExpiredError"){
        return error = handleJwtExpiredError(error)
      };

      if (error.name === "JsonWebTokenError") {
        return error = handleJwtError(error)
      };

      if (error.name === "ValidationError") {
      return error= handleValidationError(error)
      }

      if (errr.code === 11000) {
        // handle duplicate error
        return error=handleDuplicationError(error)
      }

      if (error.name === "CastError") {
      return error= handleCastError(error)
    }
    return   sendProdErr(error, res)
  }

}

module.exports=handleGlobalErrors
