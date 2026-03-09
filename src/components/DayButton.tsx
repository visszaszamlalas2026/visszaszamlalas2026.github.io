import type { Dayjs } from "dayjs";
import { DATE_SHORT_FORMAT } from "../consts";

const colors = ["#d83423", "#eee", "#32a823"];

export const DayButton = (props: { day: Dayjs, index: number }) => {
  return <span style={`background-color: ${colors[props.index % colors.length]}`}>{props.day.format(DATE_SHORT_FORMAT)}</span>
}