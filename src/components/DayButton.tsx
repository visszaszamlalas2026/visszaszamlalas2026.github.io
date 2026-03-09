import type { Dayjs } from "dayjs";
import { DATE_SHORT_FORMAT, TODAY } from "../consts";

const colors = ["#d83423", "#eee", "#32a823"];

enum DayButtonType {
  Future,
  TodayExists,
  // TodayMissing,
  PastExists,
  // PastMissing
};

const dayToType = (day: Dayjs): DayButtonType => {
  if (day.isBefore(TODAY, 'day')) {
    return DayButtonType.PastExists;
  } else if (day.isSame(TODAY, 'day')) {
    return DayButtonType.TodayExists;
  } else {
    return DayButtonType.Future;
  }
}

export const DayButton = (props: { day: Dayjs, index: number, isOpened: boolean, doOpen: Function }) => {

  const thisType = dayToType(props.day);

  return <div onClick={() => { props.doOpen(); }}>
    <span style={`background-color: ${colors[props.index % colors.length]}`}>{props.day.format(DATE_SHORT_FORMAT)}</span>
    {thisType == DayButtonType.Future ? "future" : (thisType == DayButtonType.TodayExists ? "TODAY" : "past")}
    {props.isOpened ? "OPEN" : "closed"}
  </div>
}