const express = require("express");
const {createbarCode}=require("../../controllers/v2Controllers/barcode.controller")

const barCode = express.Router();

barCode.post("/create", createbarCode);

module.exports = barCode;
