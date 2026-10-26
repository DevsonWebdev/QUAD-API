const {sendPng,sendSvg ,scanQrCode}=require("../utils/qrCode.utils")
const catchAsync = require("../utils/catchAsync")

const createQrCode=catchAsync(async function(req,res) {
    const { format } = req.query;
    const { text } = req.body;

    if (!text || text.length<5 || text.length > 1000) {
      return res.status(400).json({
        status: "Failed",
        message:"Please provide text of the required length mini(10) and maxi (1000) characters"
      })
    }
    const qrCodeFormat = format === "png" ? "png" : "image/svg+xml";

    if (qrCodeFormat==="png") {
    return sendPng(res, text, qrCodeFormat)
    }
     return sendSvg(res, text, qrCodeFormat);
})
const readQrCode=catchAsync(async function(req,res) {
    if (!req.file) return res.status(400).json({
      status: "Failed",
      message: "Please provide requested image file"
    })

    const qrCodeFile = req.file;
    const qrCodeData = await scanQrCode(qrCodeFile);
    return res.status(200).json({
      status: "success !",
      data: qrCodeData.data,
      qrcCodeText: qrCodeData.chunks[0].text
    });

} )
module.exports={readQrCode,createQrCode}
