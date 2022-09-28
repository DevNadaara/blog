const jwt = require("jsonwebtoken");
const config = require("config");

module.exports = function (req, res, next) {
  if (!config.get("authRequired")) return next();
  const token = req.header("x-auth-token");

  if (!token) return res.status(401).send("access denied");

  try {
    const decoded = jwt.verify(token, config.get("jwtKey"));
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(400).send("invalid token");
  }
};
