const {resizeProfilePhoto}=require("../utils/images.utils")

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

async function imageResizer(req, res, next) {
  // 🔥🔥🔥
  if (!req.file) return next();
  const photo = await resizeProfilePhoto(req, res);
  console.log(photo)
  req.body.photo = photo || undefined;
 return next()
}

module.exports = {
  isImageFile,imageResizer
}
