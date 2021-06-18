import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express, { Response } from 'express';
import memeRoutes from './routes/memeRoutes';

import UpdateMemes from './services/memeParser';
import config from './config';

const app = express();
app.use(express.json());

// Routers
app.use('/memes', memeRoutes);

app.use((_, res: Response) => {
  res.status(404).json({ message: '404' });
});

createConnection()
  .then(async () => {
    UpdateMemes();
    setInterval(UpdateMemes, config.INTERVAL_TO_PARSE_MEME);
    app.listen(3000, () => {
      console.log('Server up at http://localhost:3000 port');
    });
  })
  .catch((error) => console.log(error));
