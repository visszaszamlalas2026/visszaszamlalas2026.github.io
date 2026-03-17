import dayjs from "dayjs";
import type { Dayjs } from "dayjs";
import { CALENDAR_END, CALENDAR_START, DATE_FORMAT, TODAY } from "../consts";
import { splitArray, useLocalStorage } from "../util";
import { DayButton } from "./DayButton";
import { useEffect, useState } from "preact/hooks";
import JSConfetti from "js-confetti";
import { useWebHaptics } from "web-haptics/react";

export const Calendar = (props: { hasContentFor: string[] }) => {

  let confetti: JSConfetti;
  const { trigger: haptics } = useWebHaptics();

  const days = new Array(CALENDAR_END.diff(CALENDAR_START, "day") + 1)
    .fill("")
    .map((_, i) => dayjs(CALENDAR_START).add(i, "day"))
    .reverse();

  const weeks = splitArray(days, 7);

  const [daysOpened, setDaysOpened] = useLocalStorage('daysOpened', [CALENDAR_START.format(DATE_FORMAT)]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    confetti = new JSConfetti();
  });

  const isDayOpened = (day: Dayjs): boolean => {
    return isClient ? daysOpened.includes(day.format(DATE_FORMAT)) : true;
  }

  const doOpenDay = (day: Dayjs) => {
    if (!isDayOpened(day) && !day.isAfter(TODAY, 'day')) {
      setDaysOpened((daysOpened as string[]).concat(day.format(DATE_FORMAT)));
      haptics([{
        duration: 60,
        intensity: 1,
      }]);
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
                <DayButton index={wi * 7 + di} day={day} hasContent={props.hasContentFor.includes(day.format(DATE_FORMAT))} isOpened={isDayOpened(day)} doOpen={(event: MouseEvent) => {
                  doOpenDay(day);
                  if (typeof confetti !== 'undefined') {
                    confetti.addConfettiAtPosition({
                      emojis: ['⭐'],
                      emojiSize: 50,
                      confettiNumber: 30,
                      confettiDispatchPosition: {
                        x: event.x,
                        y: event.y
                      }
                    });
                  }
                }} />
              ))}
            </tr>
          ))
        }
      </tbody>
    </table>
    {isClient && <button className="close-all" onClick={() => {
      setDaysOpened([CALENDAR_START.format(DATE_FORMAT)]);
    }}>🙈 mindet becsuk</button>}
  </>;
}