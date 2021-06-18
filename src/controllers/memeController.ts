import { Response, Request } from 'express';
import { Meme } from '../entity/Meme';

import config from '../config';

import path from 'path';

function GetMemes(_: Request, res: Response) {
  const memes = Meme.find();
  if (memes) res.status(200).json({ data: memes });
  else res.status(404).json({ message: 'Not found memes now.' });
}

async function GetMemeById(req: Request, res: Response) {
  try {
    const id = req.params['id'];
    const meme = await Meme.findOneOrFail(id);
    res.status(200).json({ data: meme });
  } catch (error) {
    res.status(404).json({ message: 'Meme not found.' });
  }
}

async function GetMemeImage(_: Request, res: Response) {
  res.status(200).sendFile(path.join(config.IMG_PATH, 'pic.png'));
}

export default {
  GetMemes,
  GetMemeById,
  GetMemeImage,
};
