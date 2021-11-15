/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from '../Database/Database';
import config from '../config';

const { SECRET_TOKEN } = config;
const verifyToken = promisify(jwt.verify);

const deleteSpaces = (str) => {
  let string = str;
  while (string.includes(' ')) string = string.replace(' ', '');

  return string;
};

const stringCookieToArray = (str) => {
  const string = str;

  return string
    .split(';')
    .join('')
    .split('=');
};

const getCookieFromArray = (array, cookie) => {
  const index = array.indexOf(cookie);
  return index !== -1 ? array[index + 1] : null;
};

export default async function context({ req }) {
  try {
    const { cookie } = req.headers;
    if (!cookie) throw Error('Invalid cookie');

    const valueCookie = getCookieFromArray(stringCookieToArray(deleteSpaces(cookie)), 'user_token');
    if (!valueCookie) throw Error('Invalid value cookie');

    const token = await verifyToken(valueCookie, SECRET_TOKEN);
    const findUser = await db.User.getById(token.iss);

    if (!findUser || findUser.username !== token.name) throw Error('Invalid token');

    return { userToken: token.iss };
  } catch (error) {
    return { userToken: null };
  }
}
