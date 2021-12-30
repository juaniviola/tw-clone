<template>
  <div class="profile">
    <div v-show="loading" class="loading"></div>

    <UserNotFound
      v-show="!loading && !user.username"
    />

    <UserCard
      class="user_card"
      v-show="!loading && user.username"
      :tweets="tweets"
      :user="user"
      :sameUser="sameUser"
      :following="following"
      @followUser="followUser"
      @unfollowUser="unfollowUser"
      @deleteTweet="deleteTweet"
      @selectedPanel="getTweets"
    />
  </div>
</template>

<script>
/* eslint-disable no-underscore-dangle */
import gql from 'graphql-tag';
import moment from 'moment';
import UserCard from '@/components/User/UserCard.vue';
import UserNotFound from '@/components/User/UserNotFound.vue';
import globalState from '@/utils/GlobalState';

export default {
  data() {
    return {
      loading: true,
      tweets: [],
      user: {},
      followers: {},
      sameUser: false,
      following: false,
    };
  },

  components: {
    UserCard,
    UserNotFound,
  },

  methods: {
    async followUser() {
      if (!this.user || !this.user._id) return;

      try {
        const followUser = await this.$apollo.mutate({
          mutation: gql`
            mutation ($userId: String!) {
              addFollow(userId: $userId)
            }
          `,

          variables: {
            userId: this.user._id,
          },
        });

        if (followUser.data?.addFollow) this.following = true;

        this.user.followers = [...this.user.followers, {
          username: globalState.getUser().username,
        }];
      } catch (error) {
        this.following = false;
      }
    },

    async unfollowUser() {
      if (!this.user || !this.user._id) return;

      try {
        const unfollowUser = await this.$apollo.mutate({
          mutation: gql`
            mutation ($userId: String!) {
              deleteFollow(userId: $userId)
            }
          `,

          variables: {
            userId: this.user._id,
          },
        });

        if (unfollowUser.data?.deleteFollow) this.following = false;

        this.user.followers = this.user.followers.filter(
          (user) => user.username !== globalState.getUser().username,
        );
      } catch (error) {
        this.following = true;
      }
    },

    async getTweets(type) {
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
        this.loading = true;
        this.tweets = [];
        const tweets = await this.$apollo.query({
          query: gql`
            query ($id: String!) {
              ${query}
            }
          `,

          variables: { id: this.user._id },
        });

        if (type === 'tweets') {
          this.tweets = tweets.data?.tweetsByUser || null;
        } else if (type === 'likes') {
          this.tweets = tweets.data?.tweetsLikedByUser || null;
        } else {
          this.tweets = tweets.data?.tweetsRetweetedByUser || null;
        }

        this.tweets = this.tweets.map((tweet) => ({
          ...tweet,
          createdAt: moment(tweet.createdAt).format('MMM Do YY'),
        }));
      } finally {
        this.loading = false;
      }
    },

    deleteTweet(id) {
      this.tweets = this.tweets.filter(({ _id }) => _id !== id);
    },
  },

  async mounted() {
    const { username } = this.$route.params;

    try {
      const userInfo = await this.$apollo.query({
        query: gql`
          query ($username: String!) {
            userByUsername(username: $username) {
              _id
              username
              fullName
            }
          }
        `,

        variables: {
          username,
        },
      });

      const tweetsAndFollowers = await this.$apollo.query({
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

        variables: {
          id: userInfo.data?.userByUsername?._id || null,
        },
      });

      if (!tweetsAndFollowers.data?.tweetsByUser) return;

      // set user with info and followers
      this.user = {
        ...userInfo.data.userByUsername,
        ...tweetsAndFollowers.data.userFollowers,
      };

      // set tweets and format createdAt
      this.tweets = [...tweetsAndFollowers.data.tweetsByUser];
      this.tweets = this.tweets.map((tweet) => ({
        ...tweet,
        createdAt: moment(tweet.createdAt).format('MMM Do YY'),
      }));

      // check if is same user
      if (this.user.username === globalState.getUser().username) this.sameUser = true;

      // check if is following
      if (this.user.followers?.some((x) => x.username === globalState.user.username)) {
        this.following = true;
      }
    } catch (error) {
      this.user = {};
      this.tweets = [];
      this.following = false;
    } finally {
      this.loading = false;
    }
  },
};
</script>

<style lang="scss" scoped>
  @import "./styles/User.scss";
</style>
