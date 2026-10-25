const express = require("express");
const {createbarCode}=require("../controllers/barcode.controller")

const barCode = express.Router();

barCode.post("/create", createbarCode);

module.exports = barCode;
