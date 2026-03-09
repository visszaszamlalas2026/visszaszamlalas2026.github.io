import type { Dayjs } from "dayjs";
import { DATE_SHORT_FORMAT, TODAY } from "../consts";

const colors = ["#d83423", "#eee", "#32a823"];

enum DayButtonType {
  Future,
  TodayExistsClosed,
  TodayExistsOpened,
  TodayMissing,
  PastExistsClosed,
  PastExistsOpened,
  PastMissing
};

const dayToType = (day: Dayjs, isOpened: boolean): DayButtonType => {
  if (day.isBefore(TODAY, 'day')) {
    return isOpened ? DayButtonType.PastExistsOpened : DayButtonType.PastExistsClosed;
  } else if (day.isSame(TODAY, 'day')) {
    return isOpened ? DayButtonType.TodayExistsOpened : DayButtonType.TodayExistsClosed;
  } else {
    return DayButtonType.Future;
  }
}

const dayButtonTypeToString = (dayButtonType: DayButtonType) => {
  switch (dayButtonType) {
    case DayButtonType.Future: return "future";
    case DayButtonType.TodayExistsClosed: return "today closed";
    case DayButtonType.TodayExistsOpened: return "today opened";
    case DayButtonType.TodayMissing: return "today missing lol";
    case DayButtonType.PastExistsClosed: return "past closed";
    case DayButtonType.PastExistsOpened: return "past opened";
    case DayButtonType.PastMissing: return "past missing lol";
  }
}

const dayButtonTypeToCursor = (dayButtonType: DayButtonType) => {
  switch (dayButtonType) {
    case DayButtonType.Future: return "wait";
    case DayButtonType.TodayExistsClosed: return "pointer";
    case DayButtonType.TodayExistsOpened: return "pointer";
    case DayButtonType.TodayMissing: return "not-allowed";
    case DayButtonType.PastExistsClosed: return "pointer";
    case DayButtonType.PastExistsOpened: return "pointer";
    case DayButtonType.PastMissing: return "not-allowed";
  }
}

export const DayButton = (props: { day: Dayjs, index: number, isOpened: boolean, doOpen: Function }) => {

  const thisType = dayToType(props.day, props.isOpened);

  const canBeOpened = thisType == DayButtonType.TodayExistsClosed || thisType == DayButtonType.PastExistsClosed;

  return <div onClick={canBeOpened ? () => { props.doOpen(); } : () => { }} style={`cursor: ${dayButtonTypeToCursor(thisType)}`}>
    <span style={`background-color: ${colors[props.index % colors.length]}`}>{props.day.format(DATE_SHORT_FORMAT)}</span>
    {dayButtonTypeToString(thisType)}
  </div>
}