import path from 'path';

const IMG_PATH = path.resolve(__dirname, '..', 'memes');

const MAX_PASSED_MEMES = 50;

const INTERVAL_TO_PARSE_MEME = 1000 * 60; // 1000 ms * 60 sec * 60 min

export default {
  IMG_PATH,
  MAX_PASSED_MEMES,
  INTERVAL_TO_PARSE_MEME,
};
