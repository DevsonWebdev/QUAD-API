const express = require("express");

const qrcodesRoute = require("./qrCodeReader.route")
const barCodeRouter=require("./barcode.route")
const imagesRouter = require("./images.route")

const v1Router = express.Router();

v1Router.use("/qrcodes", qrcodesRoute);
v1Router.use("/barcodes", barCodeRouter);
v1Router.use("/images", imagesRouter);
module.exports = v1Router;
