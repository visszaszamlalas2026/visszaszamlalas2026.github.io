import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import fs from "node:fs";
import dayjs from 'dayjs';
import { DATE_FORMAT } from './consts';

const DATA_DIR = './gdrive';
const PUBLIC_DIR = './public';
const TEXT_EXT = '.txt';
const IMAGE_EXT = '.jpg';
const DATE_REGEX = '\\d{4}-\\d{2}-\\d{2}';

const dayTexts = defineCollection({
  loader: async () => {

    const dateFileRegexp = new RegExp(`^${DATE_REGEX}\\..*`);
    const dateFiles = fs.readdirSync(DATA_DIR, { withFileTypes: true }).filter((file) => dateFileRegexp.test(file.name));

    return dateFiles.filter((file) => file.name.endsWith(TEXT_EXT))
      .filter((file) => {
        // date not in future, to not leak content haha
        return dayjs(file.name.replace(TEXT_EXT, ''), DATE_FORMAT).isBefore(dayjs().add(1, 'day'));
      })
      .filter((file) => {
        // has a corresponding image file
        return dateFiles.map((file) => file.name).filter((fileName) => fileName.endsWith('.jpg')).includes(file.name.replace(TEXT_EXT, IMAGE_EXT))
      })
      .map((file) => {

        // create folder and copy image there so its included in the static production build
        try {
          fs.mkdirSync(`${PUBLIC_DIR}/${file.name.replace(TEXT_EXT, '')}`);
        } catch (e) {

        }
        fs.copyFileSync(`${DATA_DIR}/${file.name.replace(TEXT_EXT, IMAGE_EXT)}`, `${PUBLIC_DIR}/${file.name.replace(TEXT_EXT, '')}/image.jpg`);

        return {
          id: file.name.replace('.txt', ''),
          text: fs.readFileSync(`${DATA_DIR}/${file.name}`, 'utf-8')
        }
      });
  }
});

// const dayImages = defineCollection({
//   loader: glob({ pattern: "*.jpg", base: "./data" })
// });

export const collections = { dayTexts };