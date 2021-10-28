import mongoose from 'mongoose';
import api from './api';

export default async function connect (mongoUrl) {
  const { url, port, db } = mongoUrl;
  const urldb = `mongodb://${url}:${port}/${db}`;

  return mongoose.connect(urldb, { useNewUrlParser: true });
}

export { api };
