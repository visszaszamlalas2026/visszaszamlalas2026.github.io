import { defineCollection } from 'astro:content';
import fs from "node:fs";
import dayjs from 'dayjs';
import { CONTENT_COLLECTION, DATA_DIR, DATE_FORMAT, DATE_REGEX, IMAGE_EXT, PUBLIC_DIR, TEXT_EXT } from './consts';

export const collections = {
  [CONTENT_COLLECTION]: defineCollection({
    loader: async () => {

      const dateFileRegexp = new RegExp(`^${DATE_REGEX}\\..*`);
      const dateFiles = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter((file) => dateFileRegexp.test(file.name));

      return dateFiles.filter((file) => file.name.endsWith(TEXT_EXT))
        .filter((file) => {
          // date not in future, to not leak content haha
          return !dayjs(file.name.replace(TEXT_EXT, ''), DATE_FORMAT).isAfter(dayjs(), 'day');
        })
        .filter((file) => {
          // has a corresponding image file
          return dateFiles.map((file) => file.name).filter((fileName) => fileName.endsWith('.jpg')).includes(file.name.replace(TEXT_EXT, IMAGE_EXT))
        })
        .map((file) => {

          // create folder and copy image there so its included in the static production build
          try {
            fs.mkdirSync(`${PUBLIC_DIR}/${file.name.replace('.txt', '')}`);
          } catch (e) {
            // do nothing lol
          }
          fs.copyFileSync(`${DATA_DIR}/${file.name.replace(TEXT_EXT, IMAGE_EXT)}`, `${PUBLIC_DIR}/${file.name.replace(TEXT_EXT, '')}/image.jpg`);

          return {
            id: file.name.replace('.txt', ''),
            text: fs.readFileSync(`${DATA_DIR}/${file.name}`, 'utf-8'),
          }
        });
    },
  })
};