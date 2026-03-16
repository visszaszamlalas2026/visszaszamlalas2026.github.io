import { defineCollection } from 'astro:content';
import fs from "node:fs";
import dayjs from 'dayjs';
import { CONTENT_COLLECTION, DATA_DIR, DATE_FORMAT, DATE_REGEX, IMAGE_EXT, PUBLIC_DIR, TEXT_EXT } from './consts';

export const collections = {
  [CONTENT_COLLECTION]: defineCollection({
    loader: async () => {

      const dateImageFileRegexp = new RegExp(`^${DATE_REGEX}\\${IMAGE_EXT}*`);
      const dateImageFiles = fs.readdirSync(DATA_DIR, { withFileTypes: true })
        .filter((file) => dateImageFileRegexp.test(file.name))
        .map((file) => file.name)
        .map((fileName) => fileName.replace(IMAGE_EXT, ''));

      const dateTextFileRegexp = new RegExp(`^${DATE_REGEX}.*\\${TEXT_EXT}*`);
      const dateTextFiles = fs.readdirSync(DATA_DIR, { withFileTypes: true })
        .filter((file) => dateTextFileRegexp.test(file.name))
        .map((file) => ({
          date: file.name.replace(TEXT_EXT, '').split(' ')[0],
          fileName: file.name,
        }));

      return dateTextFiles.filter((dateTextFiles) =>
        !dayjs(dateTextFiles.date, DATE_FORMAT).isAfter(dayjs(), 'day')
      ).filter((dateTextFile) =>
        dateImageFiles.includes(dateTextFile.date)
      ).map((dateTextFile) => {

        // create folder and copy image there so its included in the static production build
        try {
          fs.mkdirSync(`${PUBLIC_DIR}/${dateTextFile.date}`);
        } catch (e) {
          // do nothing lol
        }
        fs.copyFileSync(`${DATA_DIR}/${dateTextFile.date}${IMAGE_EXT}`, `${PUBLIC_DIR}/${dateTextFile.date}/image.jpg`);
        fs.copyFileSync(`${DATA_DIR}/${dateTextFile.date}.thumb${IMAGE_EXT}`, `${PUBLIC_DIR}/${dateTextFile.date}/thumb.jpg`);

        const fileContents = fs.readFileSync(`${DATA_DIR}/${dateTextFile.fileName}`, 'utf-8').split('\r\n')
        .filter((line) => line !== '');

        return {
          id: dateTextFile.date,
          title: (fileContents[0] as string).trim(), // first line is title
          content: fileContents.slice(1).map((line) => line.trim()) // rest is content
        };
      });
    },
  })
};