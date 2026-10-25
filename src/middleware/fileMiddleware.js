async function isImageFile(req, res, next) {
   if (!req.file) return res.status(400).json({
    status: "Failed",
    message: "No image found to be processed"
  })
  if (!req.file.mimetype.split("/")[0] === "image") return res.status(400).json({
    status: "Failed",
    message: "Please provide an image file"
  })
  next()
}

module.exports = {
  isImageFile
}
