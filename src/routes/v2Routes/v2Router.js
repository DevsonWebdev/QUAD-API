const express = require("express");

const qrcodesRoute = require("./qrCodeReader.route")
const barCodeRouter=require("./barcode.route")
const imagesRouter = require("./images.route")
const usersRouter=require("./users.route")
const v1Router = express.Router();
const { protectRoute}=require("../../services/auth")
v1Router.use("/qrcodes",protectRoute, qrcodesRoute);
v1Router.use("/barcodes",protectRoute, barCodeRouter);
v1Router.use("/images", protectRoute,imagesRouter);
v1Router.use("/users", usersRouter);
module.exports = v1Router;
