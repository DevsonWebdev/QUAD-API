const multer = require("multer");
const { memoryStorage } = multer;
const mbSize= Number(process.MAX_FILE_SIZE_MB)||10
const qrCodeUpload = multer({
  storage: memoryStorage(),
  limits: {
    fileSize: mbSize * 1024 * 1024,
    files:1
  }
})

module.exports = {
  isSingleImage:qrCodeUpload.single("image")
}
