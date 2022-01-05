/* eslint-disable import/no-named-as-default-member */
/* eslint-disable import/no-named-as-default */
/* eslint-disable no-underscore-dangle */
import express from 'express';
import jwt from 'jsonwebtoken';
import ms from 'ms';
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

    const comparePassword = await db.User.comparePassword({ id: user._id, password });
    if (!comparePassword) throw Error('Invalid credentials');

    const claimsToken = { iss: user._id, name: user.username };
    const token = await signToken(claimsToken, SECRET_TOKEN, { expiresIn: ms('7 days') });

    res.cookie('user_token', token, {
      httpOnly: true,
      secure: true,
      maxAge: ms('7 days'),
    });

    res.status(200).send({ _id: user._id, username: user.username });
  } catch (error) {
    res.status(404).send('Error ocurred');
  }
});

app.post('/logout', async (_, res) => {
  res.clearCookie('user_token');

  return res.status(200).send('logged out');
});

export default app;
