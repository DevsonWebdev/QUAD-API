const multer = require("multer");
const {memoryStorage} = multer;
const qrCodeUpload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: Number(process.MAX_FILE_SIZE_MB) * 1024 * 1024,
    files:1
  }
})

module.exports = {
  isSingleImage:qrCodeUpload.single("image")
}
