import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./milestone.module.css";

export const Milestone: React.FC<TaskItemProps> = ({
  task,
  isDateChangeable,
  onEventStart,
  isSelected,
}) => {
  const transform = `rotate(45 ${task.x1 + task.height * 0.356} 
    ${task.y + task.height * 0.85})`;
  const getBarColor = () => {
    return isSelected
      ? task.styles.backgroundSelectedColor
      : task.styles.backgroundColor;
  };

  return (
    <g tabIndex={0} className={styles.milestoneWrapper}>
      <rect
        fill={getBarColor()}
        x={task.x1}
        width={task.height}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        transform={transform}
        className={styles.milestoneBackground}
        onMouseDown={e => {
          isDateChangeable && onEventStart("move", task, e);
        }}
      />
      {/* Red border for violations */}
      {task.hasViolation && (
        <rect
          x={task.x1}
          width={task.height}
          y={task.y}
          height={task.height}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          transform={transform}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2}
          pointerEvents="none"
        />
      )}
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
    </g>
  );
};
