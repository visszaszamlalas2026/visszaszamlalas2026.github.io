import type { Dayjs } from "dayjs";
import { DATE_FORMAT, DATE_SHORT_FORMAT, TODAY } from "../consts";

const colors = ["cell-red", "cell-green", "cell-white"];

enum DayButtonType {
  Future,
  TodayExistsClosed,
  TodayExistsOpened,
  TodayMissing,
  PastExistsClosed,
  PastExistsOpened,
  PastMissing
};

export const DayButton = (props: { day: Dayjs, index: number, hasContent: boolean, isOpened: boolean, doOpen: Function }) => {

  const thisType = (() => {
    if (props.day.isBefore(TODAY, 'day')) {
      if (props.hasContent) {
        return props.isOpened ? DayButtonType.PastExistsOpened : DayButtonType.PastExistsClosed;
      } else {
        return DayButtonType.PastMissing;
      }
    } else if (props.day.isSame(TODAY, 'day')) {
      if (props.hasContent) {
        return props.isOpened ? DayButtonType.TodayExistsOpened : DayButtonType.TodayExistsClosed;
      } else {
        return DayButtonType.TodayMissing;
      }
    } else {
      return DayButtonType.Future;
    }
  })();

  const stateClassname = (() => {
    switch (thisType) {
      case DayButtonType.Future: return "future";
      case DayButtonType.TodayMissing: return "missing";
      case DayButtonType.TodayExistsOpened: return "opened";
      case DayButtonType.TodayExistsClosed: return "closed";
      case DayButtonType.PastMissing: return "missing";
      case DayButtonType.PastExistsClosed: return "closed";
      case DayButtonType.PastExistsOpened: return "opened";
    }
  })();

  const colorClassname = colors[props.index % colors.length];

  const renderDoors = () => {
    if ([DayButtonType.PastExistsClosed, DayButtonType.PastExistsOpened, DayButtonType.TodayExistsClosed, DayButtonType.TodayExistsOpened].includes(thisType)) {
      return <>
        <div className="door-left"></div>
        <div className="door-right"></div>
      </>;
    }
  }

  const renderContent = () => {
    if ([DayButtonType.PastExistsClosed, DayButtonType.PastExistsOpened, DayButtonType.TodayExistsClosed, DayButtonType.TodayExistsOpened].includes(thisType)) {
      return <div className="img" style={`background-image: url(${`/${props.day.format(DATE_FORMAT)}/image.jpg`})`}></div>;
    } else if ([DayButtonType.TodayMissing, DayButtonType.PastMissing].includes(thisType)) {
      return <div className="emoji">&#x1F480;</div>;
    }
  }

  const renderAction = () => {
    switch (thisType) {
      case DayButtonType.TodayExistsClosed:
      case DayButtonType.PastExistsClosed: return <button className="action" onClick={(event: MouseEvent) => { props.doOpen(event) }}></button>; break;

      case DayButtonType.TodayExistsOpened:
      case DayButtonType.PastExistsOpened: return <a className="action" href={`/${props.day.format(DATE_FORMAT)}`}></a>; break;

      default: return "";
    }
  }

  return <td className={colorClassname + ' ' + stateClassname}>
    {[DayButtonType.TodayMissing, DayButtonType.TodayExistsClosed, DayButtonType.TodayExistsOpened].includes(thisType) && <div className="today"></div>}
    <span>{props.day.format(DATE_SHORT_FORMAT)}</span>
    {renderContent()}
    {renderDoors()}
    {renderAction()}
  </td>
}