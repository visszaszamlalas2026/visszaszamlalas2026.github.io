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

const dayButtonTypeToOpacity = (dayButtonType: DayButtonType) => {
  return dayButtonType == DayButtonType.Future ? "0.3" : "1";
}

const dayButtonTypeToCursor = (dayButtonType: DayButtonType) => {
  if (dayButtonType == DayButtonType.Future) {
    return "wait";
  } else if (dayButtonType == DayButtonType.TodayMissing || dayButtonType == DayButtonType.PastMissing) {
    return "not-allowed";
  } else {
    return "pointer";
  }
}

const dayButtonTypeToClassname = (dayButtonType: DayButtonType) => {
  switch (dayButtonType) {
    case DayButtonType.Future: return "future";
    case DayButtonType.TodayMissing: return "";
    case DayButtonType.TodayExistsOpened: return "opened";
    case DayButtonType.TodayExistsClosed: return "";
    case DayButtonType.PastMissing: return "";
    case DayButtonType.PastExistsClosed: return "";
    case DayButtonType.PastExistsOpened: return "opened";
  }
}


export const DayButton = (props: { day: Dayjs, index: number, hasContent: boolean, isOpened: boolean, doOpen: Function }) => {

  const thisType = dayToType(props.day, props.hasContent, props.isOpened);

  const color = colors[props.index % colors.length];

  const dayButtonTypeToContent = (dayButtonType: DayButtonType) => {
    switch (dayButtonType) {
      case DayButtonType.Future: return <div className="day-future" style={`background-color: ${color}`}>&#x231B;</div>;
      case DayButtonType.TodayExistsClosed: return <>
        <div className="today"></div>
        <button style={`background-color: ${color}`} onClick={() => { props.doOpen() }}>TODAY HAS</button>
      </>;
      case DayButtonType.TodayExistsOpened: return <>
        <div className="today"></div>
        <a style={`background-color: ${color}`} href={`/${props.day.format(DATE_FORMAT)}`}>
          <img src={`/${props.day.format(DATE_FORMAT)}/image.jpg`} />
        </a>
      </>;
      case DayButtonType.TodayMissing: return <div className="day-missing" style={`background-color: ${color}`}>
        &#x2754;
      </div>;
      case DayButtonType.PastExistsClosed: return <>
        <div className="door-left"></div>
        <div className="door-right"></div>
        <button style={`background-color: ${color}`} onClick={() => { props.doOpen() }}>click to open</button>
      </>;
      case DayButtonType.PastExistsOpened: return <>
        <a style={`background-color: ${color}`} href={`/${props.day.format(DATE_FORMAT)}`}>
          <img src={`/${props.day.format(DATE_FORMAT)}/image.jpg`} />
        </a>
      </>;
      case DayButtonType.PastMissing: return <div className="day-missing" style={`background-color: ${color}`}>
        &#x2754;
      </div>;
    }
  }

  return <td style={`opacity: ${dayButtonTypeToOpacity(thisType)}; cursor: ${dayButtonTypeToCursor(thisType)}`} className={dayButtonTypeToClassname(thisType)}>
    <span>{props.day.format(DATE_SHORT_FORMAT)}</span>
    <div>{dayButtonTypeToContent(thisType)}</div>
  </td>
}