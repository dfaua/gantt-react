import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  todayLineEnabled: boolean;
  todayLineColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  todayLineEnabled,
  todayLineColor,
  rtl,
}) => {
  let y = 0;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  let todayLine: ReactChild = <line />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );

    // Calculate position for today's cell or line
    const isTodayCell =
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime());

    // RTL mode for today
    const isTodayCellRtl =
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime();

    // Handle today display based on settings
    if (isTodayCell) {
      if (todayLineEnabled) {
        // Calculate exact position for today line based on current time
        const cellStartTime = date.getTime();
        const cellEndTime =
          i + 1 !== dates.length
            ? dates[i + 1].getTime()
            : addToDate(
                date,
                date.getTime() - dates[i - 1].getTime(),
                "millisecond"
              ).getTime();
        const cellDuration = cellEndTime - cellStartTime;
        const timeElapsed = now.getTime() - cellStartTime;
        const relativePosition = timeElapsed / cellDuration;

        // Ensure position is within the cell (0 to 1)
        const boundedPosition = Math.max(0, Math.min(1, relativePosition));
        const exactX = tickX + boundedPosition * columnWidth;

        todayLine = (
          <line
            x1={exactX}
            y1={0}
            x2={exactX}
            y2={y}
            stroke={todayLineColor}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        );
      } else {
        // Use the background color cell method
        today = (
          <rect
            x={tickX}
            y={0}
            width={columnWidth}
            height={y}
            fill={todayColor}
          />
        );
      }
    } else if (isTodayCellRtl) {
      if (todayLineEnabled) {
        // Calculate exact position for today line in RTL mode
        const cellStartTime = dates[i + 1].getTime();
        const cellEndTime = date.getTime();
        const cellDuration = cellEndTime - cellStartTime;
        const timeElapsed = cellEndTime - now.getTime();
        const relativePosition = timeElapsed / cellDuration;

        // Ensure position is within the cell (0 to 1)
        const boundedPosition = Math.max(0, Math.min(1, relativePosition));
        const exactX = tickX + columnWidth - boundedPosition * columnWidth;

        todayLine = (
          <line
            x1={exactX}
            y1={0}
            x2={exactX}
            y2={y}
            stroke={todayLineColor}
            strokeWidth={2}
            strokeDasharray="4 4"
          />
        );
      } else {
        today = (
          <rect
            x={tickX + columnWidth}
            y={0}
            width={columnWidth}
            height={y}
            fill={todayColor}
          />
        );
      }
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      {!todayLineEnabled && <g className="today">{today}</g>}
      {todayLineEnabled && <g className="todayLine">{todayLine}</g>}
    </g>
  );
};
