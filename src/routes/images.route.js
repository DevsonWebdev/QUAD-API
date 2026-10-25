const express = require("express");
const { isSingleImage } = require("../middleware/multer");
const {
  httpConvertImage,
  httpEnhanceImage,
  httpResizeImage
} = require("../controllers/images.controller")
const {isImageFile}=require("../middleware/fileMiddleware")
const imagesRouter = express.Router();

imagesRouter.post("/convert",[isSingleImage,isImageFile],httpConvertImage);
imagesRouter.post("/enhance",[isSingleImage,isImageFile],httpEnhanceImage)
imagesRouter.post("/resize", [isSingleImage,isImageFile],httpResizeImage)

module.exports = imagesRouter;
