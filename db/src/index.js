import mongoose from 'mongoose';
import { Tweet, User } from './api';

export function connect(uri) {
  return mongoose.connect(uri, { useNewUrlParser: true });
}

export { Tweet, User };
