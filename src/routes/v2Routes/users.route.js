const express = require("express");
const usersRouter = express.Router();

usersRouter.get("/", (req, res) => {
  res.status(200).json({
    status: "Success",
    message:"Users router established"
  })
})

module.exports = usersRouter;
