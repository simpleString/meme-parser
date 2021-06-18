import axios from 'axios';
import qs from 'qs';

import { Meme } from '../entity/Meme';

import { getCurrentDate } from '../utils/dateUtils';
import config from '../config';
import { writeFile } from 'fs/promises';
import path from 'path';

import { CheckMemePath } from '../utils/fileUtils';

interface IMeme {
  id: string;
  name: string;
  text: string;
  post_date: string;
  source: string;
  post_id: string;
  type: string;
  player: null;
}

const url = 'https://topmemas.top/app/load.php';

const baseUrl = 'topmemas.top';

const imgAPI = 'https://topmemas.top/img/img/';

async function GetMemes(id: string, passPosts = 10): Promise<IMeme[]> {
  /****
 If passed id return 10 posts after skipping first 10 posts.
 If not passed id return first 10 posts.

 ***/
  const data = {
    num: passPosts,
    type: 'pic',
    last: id,
  };

  const memeData = await axios.post(url, qs.stringify(data));
  if (memeData.status != 200) {
    throw Error('Server not response to requests.');
  }
  const memes: Array<IMeme> = memeData.data;
  return memes;
}

async function GetLastMeme(): Promise<IMeme> {
  const data = {
    num: 0,
    type: 'pic',
    last: -1,
  };
  const memeData = await axios.post(url, qs.stringify(data));
  if (memeData.status != 200) {
    throw Error('Server not response to requests.');
  }
  return memeData.data[0];
}

async function UpdateMemes() {
  await CheckMemePath(path.resolve(config.IMG_PATH, getCurrentDate()));
  try {
    let lastDownloadedMeme = await GetLastMeme();
    let lastMeme = await Meme.findOne({ where: { sourceId: lastDownloadedMeme.id, sourcePath: baseUrl } });
    if (!lastMeme) {
      const fileName = await SaveImg(lastDownloadedMeme);
      AddMemeToDB(lastDownloadedMeme, fileName);
      let memes: IMeme[];
      for (let i = 0; i < config.MAX_PASSED_MEMES; i += 10) {
        memes = await GetMemes(lastDownloadedMeme.id, i);
        memes.forEach(async (meme) => {
          const memeExist = await Meme.findOne({ where: { sourceId: meme.id } });
          if (!memeExist) {
            const fileName = await SaveImg(meme);
            AddMemeToDB(meme, fileName);
          }
        });
        lastDownloadedMeme = memes.pop()!;
      }
    }
  } catch (error) {
    console.error(error);
  }
}

async function SaveImg(meme: IMeme) {
  const picture = await axios.get(imgAPI + meme.name + '.jpg', {
    responseType: 'arraybuffer',
  });
  const buffer = Buffer.from(picture.data, 'base64');
  const imgPath = path.resolve(config.IMG_PATH, getCurrentDate(), meme.name + '.jpg');
  await writeFile(imgPath, buffer, {});
  return imgPath;
}

function AddMemeToDB(meme: IMeme, pathToMeme: string) {
  const memeC = Meme.create({
    sourcePath: baseUrl,
    imageId: Number(meme.name),
    sourceId: Number(meme.id),
    text: meme.text,
    pathToMeme: pathToMeme,
  });
  memeC.save();
}

export default UpdateMemes;
