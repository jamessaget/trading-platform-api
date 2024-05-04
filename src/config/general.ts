import 'dotenv/config';

export const generalConfig = {
  httpPort: +process.env.TRADING_PLATFORM_API_HTTP_PORT ?? 3000,
  privateAuthKey: process.env.PRIVATE_AUTH_KEY ?? 'default',
  redis: {
    port: +process.env.REDIS_PORT ?? 6379,
    host: process.env.REDIS_HOST,
    password: process.env.REDIS_PASSWORD
  },
  passwordSalt: +process.env.PASSWORD_SALT_ROUNDS ?? 10,
};
