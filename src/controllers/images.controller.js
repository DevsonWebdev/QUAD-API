const { convertImg ,enhanceImage,resizeImage} = require("../utils/images.utils")

const supportedFormats = ["heic", "heif", "avif", "jpeg", " jpg", "jpe", "tile", "dz", "png", " raw", "tiff", "tif", "webp", "gif", "jp2", "jpx", " j2k", "j2c", " jxl "];
const unrendered = ["avif", "tiff", "tif", "heif", "heic", "jxl", "bmp"]

async function httpConvertImage(req, res) {
  try {
    const { file, query } = req;
    const { toFormat } = query;
    const { buffer, mimetype, originalname } = file;

    if (mimetype.includes(toFormat)) return res.status(200).json({
      status: "Success!",
      message:`You file is already ${toFormat} nothing changed`
    })

    if(!supportedFormats.includes(toFormat))throw  new Error("Invalid format to convert image")
    const isRenderable = unrendered.includes(toFormat) ? "attachment" : "inline";

    res.set({
      "Content-Type": `image/${toFormat}`,
      "Cache-Control": "no-store",
      "Content-Disposition":`${isRenderable}; filename="${originalname.split(".")[0]}-quad.${toFormat}"`
    })

   return await  convertImg(res,buffer,toFormat.toLowerCase())
  } catch (error) {
    return  res.status(400).json({
        status: "Failed",
        message:`Image processing failed,${error.message}`
      })
  } finally {
    req.file.buffer = null;
  }
}

async function httpEnhanceImage(req, res) {
  try {
    const { file } = req;
    const { mimetype, originalname,buffer } = file;
    const imgFormat = mimetype.split("/")[1];
    res.set({
      "Content-Type": `image/${imgFormat}`,
      "Cache-Control": "no-store",
      "Content-Disposition":`attachment; filename="${originalname.split(".")[0]}-quad.${imgFormat}"`
    })
     return await enhanceImage(res,buffer)
  } catch (error) {
    res.status(500).json({
      status: "Failed",
      message:`Image processing failed ${error.message}`
})
} finally {
  req.file.buffer = null;
}
}

async function httpResizeImage(req,res) {
  try {
    const { file ,query} = req;
    const { width, height } = query;
    const { mimetype, originalname,buffer } = file;
    const imgFormat = mimetype.split("/")[1];
    if (!width || !height)return res.status(400).json({
      status: "Failed",
      message:"Provide all the dimensions for resizing the image"
    })
    if(width<50 || height<50 || width>5400||height>5400)return res.status(400).json({
      status: "Failed",
      message:"Provide valid dimensions for width and height each min(50) and max(5400) "
    })
    res.set({
      "Content-Type": `image/${imgFormat}`,
      "Cache-Control": "no-store",
      "Content-Disposition":`attachment; filename="${originalname.split(".")[0]}-quad.${imgFormat}"`
    })
    return await resizeImage(res, buffer, {
      width: Number(width)
      , height: Number(height)
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
  httpConvertImage,
  httpEnhanceImage,
   httpResizeImage
}
