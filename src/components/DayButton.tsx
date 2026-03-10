import type { Dayjs } from "dayjs";
import { CONTENT_COLLECTION, DATE_FORMAT, DATE_SHORT_FORMAT, TODAY } from "../consts";

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

const dayToType = (day: Dayjs, hasContent: boolean, isOpened: boolean): DayButtonType => {
  if (day.isBefore(TODAY, 'day')) {
    if (hasContent) {
      return isOpened ? DayButtonType.PastExistsOpened : DayButtonType.PastExistsClosed;
    } else {
      return DayButtonType.PastMissing;
    }
  } else if (day.isSame(TODAY, 'day')) {
    if (hasContent) {
      return isOpened ? DayButtonType.TodayExistsOpened : DayButtonType.TodayExistsClosed;
    } else {
      return DayButtonType.TodayMissing;
    }
  } else {
    return DayButtonType.Future;
  }
}

export const DayButton = (props: { day: Dayjs, index: number, hasContent: boolean, isOpened: boolean, doOpen: Function }) => {

  const thisType = dayToType(props.day, props.hasContent, props.isOpened);

  const dayButtonTypeToContent = (dayButtonType: DayButtonType) => {
    switch (dayButtonType) {
      case DayButtonType.Future: return <div style="cursor: wait;">future</div>;
      case DayButtonType.TodayExistsClosed: return <button onClick={() => { props.doOpen() }}>TODAY HAS</button>;
      case DayButtonType.TodayExistsOpened: return <a href={`/${props.day.format(DATE_FORMAT)}`}>details</a>;
      case DayButtonType.TodayMissing: return <div style="cursor: not-allowed;">missing</div>;
      case DayButtonType.PastExistsClosed: return <button onClick={() => { props.doOpen() }}>click to open</button>;
      case DayButtonType.PastExistsOpened: return <a href={`/${props.day.format(DATE_FORMAT)}`}>details</a>;
      case DayButtonType.PastMissing: return <div style="cursor: not-allowed;">missing</div>;
    }
  }

  return <td width="100px" style={`background-color: ${colors[props.index % colors.length]};`}>
    <span>{props.day.format(DATE_SHORT_FORMAT)}</span>
    <div>{dayButtonTypeToContent(thisType)}</div>
  </td>
}