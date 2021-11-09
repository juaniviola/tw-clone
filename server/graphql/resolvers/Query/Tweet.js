/* eslint-disable import/no-named-as-default */
/* eslint-disable import/no-named-as-default-member */
import db from '../Database';
import wrapAsync from '../modules';

const Querys = {
  tweetById: (_, { id }) => wrapAsync(db.Tweet.getById, id),
  tweetsByHashtag: (_, { hashtag }) => wrapAsync(db.Tweet.getByHashtags, hashtag),
};

export default Querys;
