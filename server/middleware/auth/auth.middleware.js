const { verifyAccessToken } = require("../../utils/tokenUtils/tokenVerifier");
const { extractToken } = require("../../utils/tokenUtils/tokenExtractor");
const ApiError = require("../../utils/apiError");
const logger = require("../../utils/logger");
const { accessToken } = require("../../config/jwt.config");

const authenticateAccessToken = async (req, res, next) => {
  const token = extractToken(req, {
    allowBearer: true,
    cookieKey: "accessToken",
  });
  if (!token) {
    throw ApiError.unauthorized("Access token missing");
  }

  try {
    const decoded = verifyAccessToken(token);
    req.user = { id: decoded.sub, role: decoded.role, jti: decoded.jti };
    return next();
  } catch (err) {
    logger.warn(`Access token verification failed: ${err.message}`);
    throw ApiError.unauthorized("Invalid or expired access token");
  }
};

module.exports = { authenticateAccessToken };
