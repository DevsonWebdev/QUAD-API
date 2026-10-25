const QRCode = require("qrcode");
const jsQR = require("jsqr");
const sharp = require("sharp");

// Create svg qrCode
async function sendSvg(res,text,qrCodeFormat) {
    const svg = await QRCode.toString(String(text || ""),{ type: "svg", margin: 2,width:"300" })
return res.type(qrCodeFormat).send(svg)
}
// Create Png qrCode
 async function sendPng(res,text,qrCodeFormat) {
  res.type(qrCodeFormat);
  res.set("Cache-Control", "public, max-age=86400, immutable");
  QRCode.toFileStream(res, text, {
  margin: 2,
  width: "300",
  errorCorrectionLevel: "H"})
}
// Readng qrCodes
async function scanQrCode(file) {
    const { data, info } = await sharp(file.buffer, { density: 600 })
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true })
   const qrCodeData = jsQR(new Uint8ClampedArray(data), info.width, info.height)
  return qrCodeData ;
}

module.exports = {sendPng,sendSvg,scanQrCode }
