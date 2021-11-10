import mongoose from 'mongoose';
import { Tweet, User } from './api';
import * as utils from './utils/methodsForApi';

export function connect(uri) {
  return mongoose.connect(uri, { useNewUrlParser: true });
}

export { Tweet, User, utils };
