import dotenv from 'dotenv';

dotenv.config();

const config = {
  URL_DB: process.env.URL_DB,
  SECRET_TOKEN: process.env.SECRET_TOKEN || 's3cr3t',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 's3cr3t',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.ENV,
  CLIENT_URI: process.env.CLIENT_URI || 'http://localhost:8080',
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN || 'localhost',
};

export default config;
