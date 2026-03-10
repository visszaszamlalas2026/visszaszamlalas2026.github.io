import dayjs from "dayjs";

export const CONTENT_COLLECTION = 'days';

export const DATA_DIR = './gdrive';
//                        ^ magic path also used in [day].astro
export const PUBLIC_DIR = './public';
export const TEXT_EXT = '.txt';
export const IMAGE_EXT = '.jpg';
export const DATE_REGEX = '\\d{4}-\\d{2}-\\d{2}';

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_SHORT_FORMAT = "MM. DD.";
export const startDate = dayjs("2026-01-12", DATE_FORMAT);
export const endDate = dayjs("2026-04-12", DATE_FORMAT);
export const TODAY = dayjs();
