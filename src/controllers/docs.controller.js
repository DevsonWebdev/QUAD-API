const {
  convertPdfToDocX,
  convertDocXToPdf
} = require("../utils/docs.utils.js");

async function httpConvertDoc(req, res) {
  try {
    const { file,query } = req;
    const { mimetype, originalname,buffer } = file;
    const toDocFormat = query.toFormat==="docx"?"docx":"pdf"
    res.set({
      "Content-Type": `image/${toDocFormat}`,
      "Cache-Control": "no-store",
      "Content-Disposition":`attachment; filename="${originalname.split(".")[0]}-quad.${toDocFormat}"`
    })

  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message:`Image processing failed ${error.message}`
})
} finally {
  req.file.buffer = null;
}
}

module.exports = {
  httpConvertDoc
}
