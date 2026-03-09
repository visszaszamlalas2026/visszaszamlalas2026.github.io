import type { Dayjs } from "dayjs";
import { DATE_FORMAT, DATE_SHORT_FORMAT, TODAY } from "../consts";

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

export const DayButton = (props: { day: Dayjs, index: number, isOpened: boolean, doOpen: Function }) => {

  const thisType = dayToType(props.day, props.isOpened);

  const canBeOpened = thisType == DayButtonType.TodayExistsClosed || thisType == DayButtonType.PastExistsClosed;


  const dayButtonTypeToContent = (dayButtonType: DayButtonType) => {
    switch (dayButtonType) {
      case DayButtonType.Future: return <div style="cursor: wait;">future</div>;
      case DayButtonType.TodayExistsClosed: return <button onClick={() => { props.doOpen() }}>TODAY</button>;
      case DayButtonType.TodayExistsOpened: return <a href={`/${props.day.format(DATE_FORMAT)}`}>details</a>;
      case DayButtonType.TodayMissing: return <div>missing</div>;
      case DayButtonType.PastExistsClosed: return <button onClick={() => { props.doOpen() }}>click to open</button>;
      case DayButtonType.PastExistsOpened: return <a href={`/${props.day.format(DATE_FORMAT)}`}>details</a>;
      case DayButtonType.PastMissing: return <div>missing</div>;
    }
  }

  return <div>
    <span style={`background-color: ${colors[props.index % colors.length]}`}>{props.day.format(DATE_SHORT_FORMAT)}</span>
    {dayButtonTypeToContent(thisType)}
  </div>
}