const {sendPngBarCode,sendbarCodeSvg}=require("../../utils/barcode.utils");
const catchAsync = require("../../utils/catchAsync");
const AppError=require("../../utils/appError")

const createbarCode = catchAsync(async function (req, res,next) {
  const format = req.query;
  const { text, symbology } = req.body;
   if (!text || text.length > 1000)return next(new AppError(400,"Please provide input of the required length  max (1000) characters"))

    const barCodeFormat = format === "png" ? "image/png" : "image/svg+xml";

  if (format === "png") return await sendPngBarCode(res, text, barCodeFormat, symbology);

  return await sendbarCodeSvg(res, text, barCodeFormat,symbology);
})


module.exports={createbarCode}
