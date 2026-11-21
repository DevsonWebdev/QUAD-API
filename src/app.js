const mongoSanitize = require('@exortek/express-mongo-sanitize');
const express = require("express");
const { xss } = require('express-xss-sanitizer');
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const hpp = require("hpp");
const cookieParser=require("cookie-parser")

const rateLimit = require("express-rate-limit");
const v1Api = require("./routes/v1Routes/v1Router")
const v2Api = require("./routes/v2Routes/v2Router")
const handleGlobalErrors = require("./middleware/globalErrorHandler")
const handleRouteNotFound = require("./routes/notFound.route")
const corsOpts = require("./config/cors.config")
const rateLimiterOpts = require("./config/expressLimiter.config");

const app = express();

// MIDDLEWARE
// Securyt headers
app.use(helmet())
app.use(cors(corsOpts));
app.use("/api",rateLimit(rateLimiterOpts))
// body data limit
app.use(express.json({ limit: "10kb" }));
// Data sanitization against NoSql query injection
app.use(mongoSanitize());
// Data sanitization against XSS
app.use(xss());
app.use(express.urlencoded())
app.use(cookieParser())
// Parameter pollution
app.use(hpp({ whitelist: [""] }));
// DEV LOGGING
 app.use(morgan("dev"));

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
