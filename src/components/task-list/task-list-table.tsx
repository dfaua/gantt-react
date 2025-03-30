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
}) => {
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
        {task.progress !== undefined && (
          <div>Progress: {Math.round(task.progress)}%</div>
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

  return (
    <div
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
                <Tippy
                  content={renderEnhancedTooltip(t)}
                  theme="light"
                  arrow={true}
                  delay={[200, 0]} // [show, hide] delay in ms
                  interactive={enhancedTooltips}
                  allowHTML={enhancedTooltips}
                >
                  <div className={styles.taskListName}>{t.name}</div>
                </Tippy>
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
                  <Tippy
                    content={toLocaleDateString(t.start, dateTimeOptions)}
                    theme="light"
                    arrow={true}
                    delay={[200, 0]}
                  >
                    <span>
                      &nbsp;{toLocaleDateString(t.start, dateTimeOptions)}
                    </span>
                  </Tippy>
                </div>
                <div
                  className={styles.taskListCell}
                  style={{
                    minWidth: rowWidth,
                    maxWidth: rowWidth,
                  }}
                >
                  <Tippy
                    content={toLocaleDateString(t.end, dateTimeOptions)}
                    theme="light"
                    arrow={true}
                    delay={[200, 0]}
                  >
                    <span>
                      &nbsp;{toLocaleDateString(t.end, dateTimeOptions)}
                    </span>
                  </Tippy>
                </div>
              </React.Fragment>
            )}
          </div>
        );
      })}
    </div>
  );
};
