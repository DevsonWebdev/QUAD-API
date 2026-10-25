const express = require("express");
const qrCodes = express.Router();

const {readQrCode,createQrCode}=require("../controllers/qrcodes.controller")
const { isSingleImage } = require("../middleware/multer")

qrCodes.post("/create",createQrCode)
qrCodes.post("/read",isSingleImage,readQrCode)

module.exports = qrCodes;
