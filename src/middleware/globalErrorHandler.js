const { MulterError } = require("multer")

function sendDevErr(err,res) {
 return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
}

function sendProdErr(err,res) {
    if (err.isOperational){
   return  res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      })
    } else {
          console.error('ERROR 💥', err);
          res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!'
          });
        }
}

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

  if (process.NODE_ENV === "development") {
   return sendDevErr(error, res)
  } else {
    if (error instanceof MulterError) {
      return handleMulterErrors(error, res)
    }
    else {
      return sendProdErr(error, res)
    }
  }
}

module.exports=handleGlobalErrors
