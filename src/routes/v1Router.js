const express = require("express");
const qrcodesRoute = require("./qrCodeReader.route")
const imagesRouter = require("./images.route")
const docsRouter=require("./documents.route")
const v1Router = express.Router();
// v1Router.use("/documents")
v1Router.use("/qrcodes", qrcodesRoute);
v1Router.use("/images", imagesRouter);
v1Router.use("/documents", docsRouter);
module.exports = v1Router;
