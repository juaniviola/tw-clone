import utils from '../../src/utils';

const { getHashtag, getMentions } = utils;

describe('src/utils ==> getHashtag()', () => {
  it('getHashtag() with hashtags. it should return two hashtags', () => {
    const phrase = "#hello world. I'm very #happy today";
    const hashtags = getHashtag(phrase);

    expect(hashtags.length).toEqual(2);
    expect(hashtags[0]).toEqual('#hello');
    expect(hashtags[1]).toEqual('#happy');
  });

  it('getHashtag() with no hashtags. it should return null', () => {
    const phrase = "hello world. I'm very happy today";
    const hashtags = getHashtag(phrase);

    expect(hashtags).toEqual(null);
  });

  it('getHashtag() with Array as parameter. it should return Error exception', () => {
    const phrase = Array(5).fill('#hola');

    expect(() => getHashtag(phrase)).toThrow('Invalid parameter');
  });
});

describe('src/utils ==> getMentions()', () => {
  it('getMentions() with mentions. it should return three mentions', () => {
    const phrase = 'Hello @name. How are you, @name2. @name2';
    const mentions = getMentions(phrase);

    expect(mentions.length).toEqual(3);
    expect(mentions[0]).toEqual('@name');
    expect(mentions[1]).toEqual('@name2');
    expect(mentions[2]).toEqual('@name2');
  });

  it('getMentions() with no mentions. it should return null', () => {
    const phrase = 'Hello name. How are you, name2. name2';
    const mentions = getMentions(phrase);

    expect(mentions).toEqual(null);
  });

  it('getMentions() with number as parameter. it should return Error exception', () => {
    const phrase = 1200;

    expect(() => getMentions(phrase)).toThrow('Invalid parameter');
  });
});
