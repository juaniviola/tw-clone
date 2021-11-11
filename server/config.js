import dotenv from 'dotenv';

dotenv.config();

const config = {
  URL_DB: process.env.URL_DB,
  SECRET_TOKEN: process.env.SECRET_TOKEN || 's3cr3t',
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.ENV,
};

export default config;
