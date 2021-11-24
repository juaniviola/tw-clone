/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from '../Database/Database';
import config from '../config';

const { SECRET_TOKEN } = config;
const verifyToken = promisify(jwt.verify);

const getUserToken = (str) => str.split(' ').filter((cookie) => cookie.startsWith('user_token'));

const deleteWords = (str) => {
  const [cookie] = str;
  if (!cookie) return null;
  return cookie
    .replace('user_token=', '')
    .replace(';', '');
};

export default async function context({ req }) {
  try {
    const { cookie } = req.headers;
    if (!cookie) throw Error('Invalid cookie');

    const valueCookie = deleteWords(getUserToken(cookie));
    if (!valueCookie) throw Error('Invalid value cookie');

    const token = await verifyToken(valueCookie, SECRET_TOKEN);
    const findUser = await db.User.getById(token.iss);

    if (!findUser || findUser.username !== token.name) throw Error('Invalid token');

    return { userToken: token.iss };
  } catch (error) {
    return { userToken: null };
  }
}
