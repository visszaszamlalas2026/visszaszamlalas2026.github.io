import dayjs from "dayjs";
import { endDate, startDate, DATE_SHORT_FORMAT } from "../consts";
import { splitArray } from "../util";
import { DayButton } from "./DayButton";


export const Calendar = (props: {}) => {
  const days = new Array(endDate.diff(startDate, "day") + 1)
    .fill("")
    .map((_, i) => dayjs(startDate).add(i, "day"))
    .reverse();

  const weeks = splitArray(days, 7);

  return <table>
    <tbody>
      {
        weeks.map((week, wi) => (
          <tr>
            {week.reverse().map((day, di) => (
              <td
              >
                <DayButton index={wi * 7 + di} day={day} />
              </td>
            ))}
          </tr>
        ))
      }
    </tbody>
  </table>
    ;
}