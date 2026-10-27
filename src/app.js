const express = require("express");
const cors = require("cors");
const app = express();
const morgan = require("morgan")
const helmet = require("helmet")
const rateLimit = require("express-rate-limit");

const v1Api = require("./routes/v1Routes/v1Router")
const v2Api = require("./routes/v2Routes/v2Router")
const handleGlobalErrors = require("./middleware/globalErrorHandler")
const handleRouteNotFound = require("./routes/notFound.route")
const corsOpts = require("./config/cors.config")
const rateLimiterOpts=require("./config/expressLimiter.config");
// MIDDLEWARE
app.use(express.json());
app.use(cors(corsOpts));
app.use(helmet())
app.use(rateLimit(rateLimiterOpts))
if (process.env.NODE_ENV = "development") app.use(morgan("dev"));
// ROUTES
app.use("/api/v1", v1Api)
app.use("/api/v2",v2Api)
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
