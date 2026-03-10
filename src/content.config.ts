import { defineCollection } from 'astro:content';
import fs from "node:fs";
import dayjs from 'dayjs';
import { CONTENT_COLLECTION, DATA_DIR, DATE_FORMAT, DATE_REGEX, IMAGE_EXT, TEXT_EXT } from './consts';

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
          return {
            id: file.name.replace('.txt', ''),
            text: fs.readFileSync(`${DATA_DIR}/${file.name}`, 'utf-8'),
          }
        });
    },
  })
};