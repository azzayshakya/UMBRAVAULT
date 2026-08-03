require("dotenv").config();
module.exports = {
  retryStrategy: (times) => Math.min(times * 200, 5000),
  maxRetriesPerRequest: 3,
};
