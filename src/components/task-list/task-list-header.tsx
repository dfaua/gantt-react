import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  hideTimeColumns?: boolean;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, hideTimeColumns }) => {
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        width: "100%",
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
          }}
        >
          &nbsp;Name
        </div>
        {!hideTimeColumns && (
          <React.Fragment>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: headerHeight * 0.5,
                marginTop: headerHeight * 0.2,
              }}
            />
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: rowWidth,
              }}
            >
              &nbsp;From
            </div>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: headerHeight * 0.5,
                marginTop: headerHeight * 0.25,
              }}
            />
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: rowWidth,
              }}
            >
              &nbsp;To
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
