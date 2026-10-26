const {sendPngBarCode,sendbarCodeSvg}=require("../utils/barcode.utils");
const catchAsync = require("../utils/catchAsync");


const createbarCode = catchAsync(async function (req, res) {

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
})


module.exports={createbarCode}
