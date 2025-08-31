import React from "react";
import { getProgressPoint } from "../../../helpers/bar-helper";
import { BarDisplay } from "./bar-display";
import { BarDateHandle } from "./bar-date-handle";
import { BarProgressHandle } from "./bar-progress-handle";
import { TaskItemProps } from "../task-item";
import styles from "./bar.module.css";

export const Bar: React.FC<TaskItemProps> = ({
  task,
  isProgressChangeable,
  isDateChangeable,
  rtl,
  onEventStart,
  isSelected,
}) => {
  const progressPoint = getProgressPoint(
    +!rtl * task.progressWidth + task.progressX,
    task.y,
    task.height
  );
  const handleHeight = task.height - 2;
  return (
    <g className={styles.barWrapper} tabIndex={0}>
      <BarDisplay
        x={task.x1}
        y={task.y}
        width={task.x2 - task.x1}
        height={task.height}
        progressX={task.progressX}
        progressWidth={task.progressWidth}
        barCornerRadius={task.barCornerRadius}
        styles={task.styles}
        isSelected={isSelected}
        hasViolation={task.hasViolation}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      {/* Deadline marker */}
      {task.deadlineX !== undefined && (
        <g className="deadlineMarker">
          <polygon
            points={`${task.deadlineX},${task.y - 4} ${task.deadlineX - 4},${task.y - 8} ${task.deadlineX + 4},${task.y - 8}`}
            fill="#2563eb"
          />
          <line
            x1={task.deadlineX}
            y1={task.y - 4}
            x2={task.deadlineX}
            y2={task.y + task.height}
            stroke="#2563eb"
            strokeWidth="1"
            strokeDasharray="2,2"
          />
        </g>
      )}
      <g className="handleGroup">
        {isDateChangeable && (
          <g>
            {/* left */}
            <BarDateHandle
              x={task.x1 + 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("start", task, e);
              }}
            />
            {/* right */}
            <BarDateHandle
              x={task.x2 - task.handleWidth - 1}
              y={task.y + 1}
              width={task.handleWidth}
              height={handleHeight}
              barCornerRadius={task.barCornerRadius}
              onMouseDown={e => {
                onEventStart("end", task, e);
              }}
            />
          </g>
        )}
        {isProgressChangeable && (
          <BarProgressHandle
            progressPoint={progressPoint}
            onMouseDown={e => {
              onEventStart("progress", task, e);
            }}
          />
        )}
      </g>
    </g>
  );
};
