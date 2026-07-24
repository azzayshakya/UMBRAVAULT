const ApiError = require("../utils/ApiError");

function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`));
}

module.exports = notFoundHandler;
