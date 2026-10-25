const { pipeline } = require("node:stream/promises")

async function convertPdfToDocX(res,buffer) {
  const pdfFile ="";
  return await pipeline(pdfFile,res)
}

async function convertDocXToPdf(res,buffer) {
  const docXFile ="";
  return await pipeline(docXFile,res)
}

module.exports = {
  convertPdfToDocX,
  convertDocXToPdf
}
