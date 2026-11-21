const { MulterError } = require("multer")
const AppError=require("../utils/appError")
function sendProdErr(err, res) {
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
  console.log(err)
 return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
}

const handleJwtError = () => new AppError(401, "Invalid token.Please log in again.");
const handleJwtExpiredError = () => new AppError(401, "Your token has expired.Please log in again.");
const handleCastError = (err) => new AppError(400,`Invalid ${err.path}:${err.value}`);
const handleDuplicationError=(err)=>new AppError(403,"User already exists log in to continue.")
const handleValidationError = (err) => new AppError(400,err.message);

function handleMulterErrors(error, res) {
  const { code } = error;
  if (code === "LIMIT_FIELD_KEY") {
      return new AppError(400, "Provide a field key ")
  }
  if (code === "LIMIT_FIELD_VALUE") {
    return new AppError(400,"Provide an image file")
  }
  if (code === "LIMIT_FILE_SIZE") {
  return new AppError(400,"Image size too large, Max is 10Mbs" )
  }

}

async function handleGlobalErrors(error, req, res, next) {
  error.statusCode = error.statusCode || 500;
  error.status = error.status || 'error';

  if (process.env.NODE_ENV === "development") {
  return sendDevErr(error, res)
  }

  // Send Production Errors
      if (error instanceof MulterError){
       error= handleMulterErrors(error)
    }

    if (error.name === "TokenExpiredError"){
         error = handleJwtExpiredError(error)
      };

      if (error.name === "JsonWebTokenError") {
         error = handleJwtError(error)
      };

      if (error.name === "ValidationError") {
      error= handleValidationError(error)
      }

      if (error.code === 11000) {
        // handle duplicate error
         error=handleDuplicationError(error)
      }

      if (error.name === "CastError") {
       error= handleCastError(error)
      }

    return   sendProdErr(error, res)
};

module.exports = handleGlobalErrors;
