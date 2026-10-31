const jwt = require("jsonwebtoken");
const { promisify } = require("util");

function createToken(userId) {
 const secretKey = process.env.JWT_SECRET;
  return jwt.sign({ id: userId },
    secretKey,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

async function verifyToken(token) {
    const secretKey = process.env.JWT_SECRET;
return await promisify(jwt.verify)(token,secretKey)
}

module.exports = { createToken, verifyToken };
