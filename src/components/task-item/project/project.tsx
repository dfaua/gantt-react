import React from "react";
import { TaskItemProps } from "../task-item";
import styles from "./project.module.css";

export const Project: React.FC<TaskItemProps> = ({ task, isSelected }) => {
  const barColor = isSelected
    ? task.styles.backgroundSelectedColor
    : task.styles.backgroundColor;
  const processColor = isSelected
    ? task.styles.progressSelectedColor
    : task.styles.progressColor;
  const projectWith = task.x2 - task.x1;

  const projectLeftTriangle = [
    task.x1,
    task.y + task.height / 2 - 1,
    task.x1,
    task.y + task.height,
    task.x1 + 15,
    task.y + task.height / 2 - 1,
  ].join(",");
  const projectRightTriangle = [
    task.x2,
    task.y + task.height / 2 - 1,
    task.x2,
    task.y + task.height,
    task.x2 - 15,
    task.y + task.height / 2 - 1,
  ].join(",");

  return (
    <g tabIndex={0} className={styles.projectWrapper}>
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWith}
        y={task.y}
        height={task.height}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectBackground}
      />
      <rect
        x={task.progressX}
        width={task.progressWidth}
        y={task.y}
        height={task.height}
        ry={task.barCornerRadius}
        rx={task.barCornerRadius}
        fill={processColor}
      />
      <rect
        fill={barColor}
        x={task.x1}
        width={projectWith}
        y={task.y}
        height={task.height / 2}
        rx={task.barCornerRadius}
        ry={task.barCornerRadius}
        className={styles.projectTop}
      />
      <polygon
        className={styles.projectTop}
        points={projectLeftTriangle}
        fill={barColor}
      />
      <polygon
        className={styles.projectTop}
        points={projectRightTriangle}
        fill={barColor}
      />
      {/* Deadline marker */}
      {task.deadlineX !== undefined && (
        <g className="deadlineMarker">
          <polygon
            points={`${task.deadlineX},${task.y - 4} ${task.deadlineX - 4},${
              task.y - 8
            } ${task.deadlineX + 4},${task.y - 8}`}
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
      {/* Red border for violations - simplified rectangular outline */}
      {task.hasViolation && (
        <rect
          x={task.x1}
          width={projectWith}
          y={task.y}
          height={task.height}
          rx={task.barCornerRadius}
          ry={task.barCornerRadius}
          fill="none"
          stroke="#ef4444"
          strokeWidth={2}
          pointerEvents="none"
        />
      )}
    </g>
  );
};
