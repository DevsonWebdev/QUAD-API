const limiterOpts = {
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:"To many requests from this IP,please try again in 15 minutes."
};

module.exports = limiterOpts;
