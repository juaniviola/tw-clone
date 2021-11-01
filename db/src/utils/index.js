const methods = {
  getHashtag(text) {
    if (typeof text !== 'string') throw Error('Invalid parameter');
    const hashtag = text.match(/#\w+/g);
    if (hashtag) return hashtag.map((x) => x.toLowerCase());

    return hashtag;
  },

  getMentions(text) {
    if (typeof text !== 'string') throw Error('Invalid parameter');
    return text.match(/@\w+/g);
  },
};

export default methods;
