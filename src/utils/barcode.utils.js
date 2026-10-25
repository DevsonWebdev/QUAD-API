const bwipjs = require('bwip-js');
const sharp = require("sharp");

function bwipjsOpts(symbology,dataToDecode) {
  return {
    bcid: symbology,
    text: dataToDecode,
  scale: 3, // 3x scaling
  height: 12, // bar height in millimetres
  includetext: true, // print human-readable text
    textxalign: 'center',
    padding: 15,
  }
}
// Create svg qrCode
async function sendBarcodeSvg(res, dataToDecode, barcodeFormat,symbology) {
  res.set({
    "Content-Type": barcodeFormat,
    "Cache-Control": "public, max-age=86400, immutable",
    "Content-Disposition": `inline, filename="barcode-quad-${Date.now()}.svg"`,
    'x-no-compression': 'true',
    'Connection': 'keep-alive'
  })

  const svgBuffer = await bwipjs.toSVG(bwipjsOpts(symbology,dataToDecode))
 return res.status(200).end(svgBuffer)
}
// Create Png barCode
async function sendPngBarCode(res, dataToDecode, barcodeFormat, symbology = 'code128') {

   res.set({
     "Content-Type": barcodeFormat,
     "Cache-Control": "public, max-age=86400, immutable",
     "Content-Disposition": `inline, filename="barcode-quad-${Date.now()}.png"`,
     'x-no-compression': 'true',
     'Connection': 'keep-alive'
   })

   const pngBufferBts = await bwipjs.toBuffer(bwipjsOpts(symbology,dataToDecode));
  return res.status(200).end(pngBufferBts)
}

module.exports = {
  sendPngBarCode,
  sendbarCodeSvg: sendBarcodeSvg,
}
