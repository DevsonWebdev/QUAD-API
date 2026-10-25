const {MulterError}=require("multer")

async function handleGlobalErrors(error, req, res, next) {
  const { code } = error;
  if (error instanceof MulterError) {
       if (code === "LIMIT_FIELD_KEY")
      return res.status(400).json({ status: "Failed", message: "Provide a field key " })

    if (code === "LIMIT_FIELD_VALUE")
      return res.status(400).json({ status: "Failed", message: "Provide an image file" })

       if (code === "LIMIT_FILE_SIZE")
      return res.status(400).json({ status: "Failed", message: "Image size too large, Max is 10Mbs" })
    // Default Error message
    return res.status(400).json({ status: "Failed", message: error.message })
  }
  else {
    return res.status(400).json({
      status: "Failed",  message:error.message})
  }
}

module.exports=handleGlobalErrors
