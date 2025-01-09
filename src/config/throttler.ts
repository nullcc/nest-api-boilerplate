export const getThrottlerOptions = () => {
  return [
    {
      name: process.env.THROTTLER_LEVEL_SHORT,
      ttl: parseInt(process.env.THROTTLER_LEVEL_SHORT_TTL) || 60000,
      limit: parseInt(process.env.THROTTLER_LEVEL_SHORT_LIMIT) || 10,
    },
    {
      name: process.env.THROTTLER_LEVEL_MEDIUM,
      ttl: parseInt(process.env.THROTTLER_LEVEL_MEDIUM_TTL) || 60000,
      limit: parseInt(process.env.THROTTLER_LEVEL_MEDIUM_LIMIT) || 100,
    },
    {
      name: process.env.THROTTLER_LEVEL_LONG,
      ttl: parseInt(process.env.THROTTLER_LEVEL_LONG_TTL) || 60000,
      limit: parseInt(process.env.THROTTLER_LEVEL_LONG_LIMIT) || 1000,
    },
  ];
};
