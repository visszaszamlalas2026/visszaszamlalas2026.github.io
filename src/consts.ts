import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const TIMEZONE = 'Europe/Budapest';

dayjs.tz.setDefault(TIMEZONE);

export const CONTENT_COLLECTION = 'days';

export const DATA_DIR = './gdrive';
//                        ^ magic path also used in [day].astro
export const PUBLIC_DIR = './public';
export const TEXT_EXT = '.txt';
export const IMAGE_EXT = '.jpg';
export const DATE_REGEX = '\\d{4}-\\d{2}-\\d{2}';

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_SHORT_FORMAT = "M. DD.";
export const CALENDAR_START = dayjs.tz("2026-01-12 12:00:00", TIMEZONE);
export const CALENDAR_END = dayjs.tz("2026-04-12 12:00:00", TIMEZONE);
export const TODAY = dayjs().tz(TIMEZONE);