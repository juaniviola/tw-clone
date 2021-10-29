export default {
  getHashtag(text) {
    const hashtag = text.match(/#\w+/g);
    if (hashtag) return hashtag.map((x) => x.toLowerCase());

    return hashtag;
  },

  getMentions(text) {
    return text.match(/@\w+/g);
  },
};
