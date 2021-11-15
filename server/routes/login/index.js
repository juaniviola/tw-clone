/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import db from '../../Database/Database';
import config from '../../config';

const app = express.Router();
const signToken = promisify(jwt.sign);
const { SECRET_TOKEN } = config;

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await db.User.getByUsername(username);

    const verifyToken = await db.User.comparePassword({ id: user._id, password });
    if (!verifyToken) throw Error('Invalid credentials');

    const claimsToken = {
      iss: user._id,
      name: user.username,
      // TODO: add exp
    };
    const token = await signToken(claimsToken, SECRET_TOKEN);

    res.cookie('user_token', token, { httpOnly: true });
    res.status(200).send('logged');
  } catch (error) {
    res.status(404).send('Error ocurred');
  }
});

export default app;
