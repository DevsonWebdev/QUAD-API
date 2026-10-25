const {sendPngBarCode,sendbarCodeSvg,scanBarCode }=require("../utils/barcode.utils")

async function createbarCode(req, res) {
  try {
        const { text,symbology ,format} = req.body;
    if (!text || text.length<5 || text.length > 1000) {
      return res.status(400).json({
        status: "Failed",
        message:"Please provide text of the required length mini(10) and maxi (1000) characters"
      })
    }
    const barCodeFormat = format === "png" ? "image/png" : "image/svg+xml";

    if (format === "png") {
      return await sendPngBarCode(res, text, barCodeFormat,symbology)
    }
     return await sendbarCodeSvg(res, text, barCodeFormat,symbology);
  }
  catch (error) {
    if (!res.headersSent) {
      res.status(500).json({
        status: "Failed",
        message: 'Generation failed'
      })
    } else {
        res.end()
    }

  }
}

module.exports={createbarCode}
