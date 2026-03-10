import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { endDate, startDate, DATE_SHORT_FORMAT, DATE_FORMAT, TODAY } from "../consts";
import { splitArray, useLocalStorage } from "../util";
import { DayButton } from "./DayButton";
import { useEffect, useState } from "preact/hooks";

export const Calendar = (props: {}) => {
  const days = new Array(endDate.diff(startDate, "day") + 1)
    .fill("")
    .map((_, i) => dayjs(startDate).add(i, "day"))
    .reverse();

  const weeks = splitArray(days, 7);

  const [daysOpened, setDaysOpened] = useLocalStorage('daysOpened', []);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  });

  const isDayOpened = (day: Dayjs): boolean => {
    return isClient ? daysOpened.includes(day.format(DATE_FORMAT)) : true;
  }

  const doOpenDay = (day: Dayjs) => {
    if (!isDayOpened(day) && !day.isAfter(TODAY, 'day')) {
      setDaysOpened((daysOpened as string[]).concat(day.format(DATE_FORMAT)));
    }
  }

  return <>
    <table>
      <thead>
        <tr>
          {["H", "K", "Sze", "Cs", "P", "Szo", "V"].map((label) => <td>{label}</td>)}
        </tr>
      </thead>
      <tbody>
        {
          weeks.map((week, wi) => (
            <tr>
              {week.reverse().map((day, di) => (
                <td
                >
                  <DayButton index={wi * 7 + di} day={day} isOpened={isDayOpened(day)} doOpen={() => { doOpenDay(day) }} />
                </td>
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
    <button onClick={() => {
      setDaysOpened([]);
    }}>close all</button>
  </>
    ;
}