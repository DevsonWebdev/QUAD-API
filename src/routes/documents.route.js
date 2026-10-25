const express = require("express");
const documentsRouter = express.Router();
const {
  httpConvertDoc
} = require("../controllers/docs.controller")

documentsRouter.post("/convert",httpConvertDoc);
module.exports = documentsRouter;
