/* eslint-disable no-underscore-dangle */
import gql from 'graphql-tag';
import moment from 'moment';

const getPanelTweet = async (apollo, type, id) => {
  let query;

  if (type === 'tweets') {
    query = `
      tweetsByUser(id: $id) {
        _id
        user {
          _id
          username
        }
        description
        favs
        answers
        createdAt
        retweets
      }
    `;
  } else if (type === 'likes') {
    query = `
      tweetsLikedByUser(id: $id) {
        _id
        user {
          _id
          username
        }
        description
        favs
        answers
        createdAt
        retweets
      }
    `;
  } else if (type === 'retweets') {
    query = `
      tweetsRetweetedByUser(id: $id) {
        _id
        user {
          _id
          username
        }
        description
        favs
        answers
        createdAt
        retweets
      }
    `;
  }

  try {
    let tweets = [];
    const getTweets = await apollo.query({
      query: gql`
        query ($id: String!) {
          ${query}
        }
      `,

      variables: { id },
    });

    if (type === 'tweets') {
      tweets = getTweets.data?.tweetsByUser || null;
    } else if (type === 'likes') {
      tweets = getTweets.data?.tweetsLikedByUser || null;
    } else {
      tweets = getTweets.data?.tweetsRetweetedByUser || null;
    }

    return tweets.map((tweet) => ({
      ...tweet,
      createdAt: moment(tweet.createdAt).format('MMM Do YY'),
    }));
  } catch (error) {
    return null;
  }
};

const getInfoAndFollowers = async (apollo, username) => {
  try {
    const userInfo = await apollo.query({
      query: gql`
        query ($username: String!) {
          userByUsername(username: $username) {
            _id
            username
            fullName
          }
        }
      `,

      variables: { username },
    });

    const tweetsAndFollowers = await apollo.query({
      query: gql`
        query ($id: String!) {
          tweetsByUser(id: $id) {
            _id
            user {
              _id
              username
            }
            description
            favs
            answers
            createdAt
            retweets
          }

          userFollowers(id: $id) {
            followers { username }
            following { username }
          }
        }
      `,

      variables: { id: userInfo.data?.userByUsername?._id || null },
    });

    if (!tweetsAndFollowers.data?.tweetsByUser) return null;

    const user = {
      ...userInfo.data.userByUsername,
      ...tweetsAndFollowers.data.userFollowers,
    };

    const tweets = [...tweetsAndFollowers.data.tweetsByUser].map((tweet) => ({
      ...tweet,
      createdAt: moment(tweet.createdAt).format('MMM Do YY'),
    }));

    return {
      user,
      tweets,
    };
  } catch (error) {
    return null;
  }
};

export default {
  getInfoAndFollowers,
  getPanelTweet,
};
