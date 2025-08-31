import React, { useMemo } from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";
import Tippy from "@tippyjs/react";
import "tippy.js/dist/tippy.css"; // Import the default CSS
import "tippy.js/themes/light.css"; // Import the light theme

const localeDateStringCache: { [key: string]: string } = {};
const toLocaleDateStringFactory =
  (locale: string) =>
  (date: Date, dateTimeOptions: Intl.DateTimeFormatOptions) => {
    const key = date.toString();
    let lds = localeDateStringCache[key];
    if (!lds) {
      lds = date.toLocaleDateString(locale, dateTimeOptions);
      localeDateStringCache[key] = lds;
    }
    return lds;
  };
const dateTimeOptions: Intl.DateTimeFormatOptions = {
  weekday: "short",
  year: "numeric",
  month: "long",
  day: "numeric",
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task | Task[]) => void;
  hideTimeColumns?: boolean;
  enhancedTooltips?: boolean;
  hideActionColumn?: boolean;
  actionColumnWidth?: string;
  onActionClick?: (task: Task) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  locale,
  onExpanderClick,
  hideTimeColumns,
  enhancedTooltips = false,
  hideActionColumn,
  actionColumnWidth = "100px",
  onActionClick,
}) => {
  // Get container element to calculate available height
  const [containerHeight, setContainerHeight] = React.useState(0);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current?.parentElement) {
        setContainerHeight(containerRef.current.parentElement.clientHeight);
      }
    };
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);
  const toLocaleDateString = useMemo(
    () => toLocaleDateStringFactory(locale),
    [locale]
  );

  // Function to render enhanced tooltip content
  const renderEnhancedTooltip = (task: Task) => {
    if (!enhancedTooltips) return task.name;

    return (
      <div style={{ padding: "5px", fontFamily, fontSize }}>
        <div style={{ fontWeight: "bold", marginBottom: "5px" }}>
          {task.name}
        </div>
        <div>Start: {toLocaleDateString(task.start, dateTimeOptions)}</div>
        <div>End: {toLocaleDateString(task.end, dateTimeOptions)}</div>
        {task.deadline && (
          <div style={{ color: task.deadline < new Date() && task.progress < 100 ? "#ef4444" : undefined }}>
            Deadline: {toLocaleDateString(task.deadline, dateTimeOptions)}
          </div>
        )}
        {task.progress !== undefined && (
          <div>Progress: {Math.round(task.progress)}%</div>
        )}
        {task.strictEndDate && (
          <div style={{ fontSize: "0.9em", fontStyle: "italic" }}>
            ⚠️ Must complete by end date
          </div>
        )}
      </div>
    );
  };

  // Create a map of project IDs to their tasks to calculate indentation
  const projectsMap = useMemo(() => {
    const map = new Map<string, Task>();
    tasks.forEach(task => {
      map.set(task.id, task);
    });
    return map;
  }, [tasks]);

  // Calculate indentation level for a task
  const getIndentationLevel = (task: Task): number => {
    if (!task.project) {
      return 0;
    }
    // Find parent task
    const parentTask = projectsMap.get(task.project);
    if (!parentTask) {
      return 1; // First level of indentation if parent not found
    }
    // Recursively get parent's indentation level + 1
    return getIndentationLevel(parentTask) + 1;
  };

  // Calculate number of empty rows needed
  const visibleRows = Math.floor(containerHeight / rowHeight);
  const emptyRowsCount = Math.max(0, visibleRows - tasks.length);
  const emptyRows = Array.from({ length: emptyRowsCount }, (_, i) => i);

  return (
    <div
      ref={containerRef}
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        const indentationLevel = getIndentationLevel(t);
        const indentationWidth = indentationLevel * 20; // 20px per level

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: rowWidth,
                maxWidth: rowWidth,
              }}
            >
              <div
                className={styles.taskListNameWrapper}
                style={{
                  paddingLeft: `${indentationWidth}px`,
                }}
              >
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                {t.icon && (
                  <span className={styles.taskListIcon}>{t.icon}</span>
                )}
                {/* Check for violations */}
                {(() => {
                  const now = new Date();
                  const hasDeadlineViolation = t.deadline && now > t.deadline && t.progress < 100;
                  const hasStrictEndDateViolation = t.strictEndDate && t.progress < 100 && now > t.end;
                  const hasViolation = hasDeadlineViolation || hasStrictEndDateViolation;
                  
                  return hasViolation ? (
                    <span className={styles.taskListViolationDot} title={
                      hasDeadlineViolation ? "Past deadline" : "Incomplete past end date"
                    }></span>
                  ) : null;
                })()}
                {enhancedTooltips ? (
                  <Tippy
                    content={renderEnhancedTooltip(t)}
                    theme="light"
                    arrow={true}
                    delay={[200, 0]} // [show, hide] delay in ms
                    interactive={true}
                    allowHTML={true}
                  >
                    <div className={styles.taskListName}>{t.name}</div>
                  </Tippy>
                ) : (
                  <div className={styles.taskListName} title={t.name}>{t.name}</div>
                )}
              </div>
            </div>
            {!hideTimeColumns && (
              <React.Fragment>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <span title={toLocaleDateString(t.start, dateTimeOptions)}>
                    &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
                  </span>
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <span title={toLocaleDateString(t.end, dateTimeOptions)}>
                    &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
                  </span>
                </div>
              </React.Fragment>
            )}
            {!hideActionColumn && (
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: actionColumnWidth,
                  maxWidth: actionColumnWidth,
                }}
              >
                {t.action && onActionClick && (
                  <button
                    className={styles.taskListActionButton}
                    onClick={(e) => {
                      e.stopPropagation();
                      onActionClick(t);
                    }}
                    aria-label={t.action.ariaLabel || "Action"}
                  >
                    {t.action.icon}
                    {t.action.text && (
                      <span className={styles.taskListActionText}>
                        {t.action.text}
                      </span>
                    )}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
      {/* Render empty rows */}
      {emptyRows.map(index => (
        <div
          className={styles.taskListTableRow}
          style={{ height: rowHeight }}
          key={`empty-row-${index}`}
        >
          <div
            className={styles.taskListCell}
            style={{
              minWidth: rowWidth,
              maxWidth: rowWidth,
            }}
          >
            <div className={styles.taskListNameWrapper}>
              <div className={styles.taskListEmptyExpander}></div>
              <div className={styles.taskListName}>&nbsp;</div>
            </div>
          </div>
          {!hideTimeColumns && (
            <React.Fragment>
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;
              </div>
              <div
                className={styles.taskListCell}
                style={{
                  minWidth: rowWidth,
                  maxWidth: rowWidth,
                }}
              >
                &nbsp;
              </div>
            </React.Fragment>
          )}
          {!hideActionColumn && (
            <div
              className={styles.taskListCell}
              style={{
                minWidth: actionColumnWidth,
                maxWidth: actionColumnWidth,
              }}
            >
              &nbsp;
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
