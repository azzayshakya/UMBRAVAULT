module.exports = {
  retryStrategy: (times) => {
    if (times > 10) return null;
    return 1000;
  },
  // Retry an individual Redis command
  maxRetriesPerRequest: 3,

  // Maximum time to establish the connection
  connectTimeout: 10000,

  // Wait until Redis is ready before accepting commands
  enableReadyCheck: true,

  // Queue commands while Redis is temporarily disconnected
  enableOfflineQueue: true,

  // Don't connect immediately when the client is created
  lazyConnect: false,
};