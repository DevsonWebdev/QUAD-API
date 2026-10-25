const sharp = require("sharp");
const { pipeline } = require("node:stream/promises")

sharp.concurrency(2)
sharp.cache({
  memory: 50,
  files: 50,
  items: 100
})

async function convertImg(res, fileBuffer, imgFormat) {
  const { format } = await sharp(fileBuffer).metadata()
  if (!format) return res.status(415).json({
    status: "Failed",
    message: "Unsupported image format"
  })
  const converted = sharp(fileBuffer).toFormat(imgFormat);
  // Client abortion
  res.on("close", () => {
     if(!res.writableFinished)converted.destroy()
  })
return  await pipeline(converted,res)
}

async function enhanceImage(res,fileBuffer) {
   const enhancedImage = sharp(fileBuffer)
    .modulate({ brightness: 1.02, saturation: 1.08 })
    .linear(1.1, -5)
    .normalise({ lower: 1, upper: 99 })
    .sharpen({ sigma: 0.6, m1: 0, m2: 1.0 });
return  await pipeline(enhancedImage,res)
}

async function resizeImage(res, fileBuffer, dimensions) {
  const { width, height } = dimensions;
  const resizedImage = sharp(fileBuffer).resize(width,height);
return  await pipeline(resizedImage,res)
}
module.exports = {
  convertImg,
  enhanceImage,
  resizeImage
}
