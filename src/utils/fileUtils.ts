import fs from 'fs/promises';

export async function CheckMemePath(filePath: string) {
  fs.access('memes').catch(async () => {
    await fs.mkdir('memes');
    fs.access(filePath).catch(async () => {
      console.log(filePath);
      await fs.mkdir(filePath);
    });
  });
}
