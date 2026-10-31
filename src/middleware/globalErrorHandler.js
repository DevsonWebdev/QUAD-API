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
      error: err,
      message: err.message,
      stack: err.stack
    });
}

const handleJwtError = () => new AppError(401, "Invalid token.Please log in again.");
const handleJwtExpiredError = () => new AppError(401, "Your token has expired.Please log in again.");
const handleCastError = () => new AppError();


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
   return sendDevErr(error, res)
  }else if (process.env.NODE_ENV === "production") {

    if (error instanceof MulterError) {
      return handleMulterErrors(error, res)
    }

    if (error.name === "TokenExpiredError")
    {return error= handleJwtExpiredError() };

    if (error.name === "JsonWebTokenError")
    { return error= handleJwtError() };

    //     if(error.name==="ValidationError")
        // if(errr.code===11000handle duplicate error
    //if(error.name==="CastError")
    console.log(error)
    return   sendProdErr(error, res)
  }
}

module.exports=handleGlobalErrors
