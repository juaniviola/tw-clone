import jwt from 'jsonwebtoken';
import { promisify } from 'util';

const asyncVerifyToken = promisify(jwt.verify);

const wrapAsync = async (fn, params) => {
  try {
    const result = await fn(params);
    return result;
  } catch (_) { return null; }
};

const verifyToken = (token, key, opts) => asyncVerifyToken(token, key, opts);

export { wrapAsync, verifyToken };
