import React, { SyntheticEvent, useRef, useEffect } from "react";
import styles from "./vertical-scroll.module.css";

export const VerticalScroll: React.FC<{
  scroll: number;
  ganttHeight: number;
  ganttFullHeight: number;
  headerHeight: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({
  scroll,
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  rtl,
  onScroll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      // Calculate the maximum scroll position to prevent unexpected behavior
      const maxScrollTop = Math.max(0, ganttFullHeight - ganttHeight);

      // Ensure scroll position is within valid range
      const safeScrollValue = Math.min(Math.max(0, scroll), maxScrollTop);

      // Only update if needed to avoid extra renders
      if (scrollRef.current.scrollTop !== safeScrollValue) {
        scrollRef.current.scrollTop = safeScrollValue;
      }
    }
  }, [scroll, ganttFullHeight, ganttHeight]);

  return (
    <div
      style={{
        height: ganttHeight,
        marginTop: headerHeight,
        marginLeft: rtl ? "" : "-1rem",
      }}
      className={styles.scroll}
      onScroll={onScroll}
      ref={scrollRef}
    >
      <div
        style={{
          height: ganttFullHeight,
          width: 1,
        }}
      />
    </div>
  );
};
