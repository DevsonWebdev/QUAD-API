const express = require("express");
const cors = require("cors");
const app = express();

const v1Api = require("./routes/v1Router")
const handleGlobalErrors = require("./middleware/globalErrorHandler")
const handleRouteNotFound=require("./routes/notFound.route")

app.use(express.json());
app.use(cors({ origin: process.CORS_ORIGIN }));
app.use("/api/v1", v1Api)

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "Good",
    message: "Server is running healthfy!!",
  });
});

// Not found route
app.use(handleRouteNotFound)
// Global error handler
app.use(handleGlobalErrors)
module.exports = app;
