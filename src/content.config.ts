import { defineCollection } from 'astro:content';
import { glob, file } from 'astro/loaders';
import { z } from 'astro/zod';
import fs from "node:fs";

const dayTexts = defineCollection({
  loader: async () => {
    const arr = fs.readdirSync('./data', { withFileTypes: true }).filter((file) => file.name.endsWith('.txt')).map((file) => ({
      id: file.name.replace('.txt', ''),
      data: fs.readFileSync(`./data/${file.name}`, 'utf-8'),
    }));
    console.log({ arr });
    return arr;
  }
});

// const dayImages = defineCollection({
//   loader: glob({ pattern: "*.jpg", base: "./data" })
// });

export const collections = { dayTexts };