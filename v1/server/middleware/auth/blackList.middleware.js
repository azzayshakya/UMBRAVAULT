const redisClient = require("../../services/redis.client");
const ApiError = require("../../utils/apiError");

const checkTokenBlacklist = async (req, res, next) => {
  const { jti } = req.user;
  const isBlacklisted = await redisClient.get(`blacklist:${jti}`);

  if (isBlacklisted) {
    throw ApiError.unauthorized("Token has been revoked, please log in again");
  }

  next();
};

module.exports = checkTokenBlacklist;
