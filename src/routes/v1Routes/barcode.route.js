const express = require("express");
const {createbarCode}=require("../../controllers/v1Controllers/barcode.controller")

const barCode = express.Router();

barCode.post("/create", createbarCode);

module.exports = barCode;
