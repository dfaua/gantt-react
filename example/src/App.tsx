import React, { useRef } from "react";
import { Task, ViewMode, Gantt } from "gantt-task-react";
import { ViewSwitcher } from "./components/view-switcher";
import { getStartEndDateForProject, initTasks } from "./helper";
import "gantt-task-react/dist/index.css";

// Define locally until the type is available from the package
interface GanttRef {
  jumpToNow: () => void;
  collapseAll: () => void;
  expandAll: () => void;
}

// Init
const App = () => {
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks());
  const [isChecked, setIsChecked] = React.useState(true);
  const [hideTimeCols, setHideTimeCols] = React.useState(true);
  const [enhancedTooltips, setEnhancedTooltips] = React.useState(true);
  const [useTodayLine, setUseTodayLine] = React.useState(true);
  const ganttRef = useRef<GanttRef>(null);
  const limitedGanttRef = useRef<GanttRef>(null);
  let columnWidth = 65;
  if (view === ViewMode.Year) {
    columnWidth = 350;
  } else if (view === ViewMode.Month) {
    columnWidth = 300;
  } else if (view === ViewMode.Week) {
    columnWidth = 250;
  }

  const handleJumpToNow = () => {
    ganttRef.current?.jumpToNow();
    limitedGanttRef.current?.jumpToNow();
  };

  const handleCollapseAll = () => {
    ganttRef.current?.collapseAll();
    limitedGanttRef.current?.collapseAll();
  };

  const handleExpandAll = () => {
    ganttRef.current?.expandAll();
    limitedGanttRef.current?.expandAll();
  };

  const handleTaskChange = (task: Task) => {
    console.log("On date change Id:" + task.id);
    let newTasks = tasks.map(t => (t.id === task.id ? task : t));
    if (task.project) {
      const [start, end] = getStartEndDateForProject(newTasks, task.project);
      const project = newTasks[newTasks.findIndex(t => t.id === task.project)];
      if (
        project.start.getTime() !== start.getTime() ||
        project.end.getTime() !== end.getTime()
      ) {
        const changedProject = { ...project, start, end };
        newTasks = newTasks.map(t =>
          t.id === task.project ? changedProject : t
        );
      }
    }
    setTasks(newTasks);
  };

  const handleTaskDelete = (task: Task) => {
    const conf = window.confirm("Are you sure about " + task.name + " ?");
    if (conf) {
      setTasks(tasks.filter(t => t.id !== task.id));
    }
    return conf;
  };

  const handleProgressChange = async (task: Task) => {
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On progress change Id:" + task.id);
  };

  const handleDblClick = (task: Task) => {
    alert("On Double Click event Id:" + task.id);
  };

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = (task: Task | Task[]) => {
    // If this is an array of tasks, it's a batch update
    if (Array.isArray(task)) {
      const newTasks = [...tasks];

      // Update all tasks in the batch
      task.forEach(t => {
        const index = newTasks.findIndex(
          existingTask => existingTask.id === t.id
        );
        if (index !== -1) {
          newTasks[index] = t;
        }
      });

      setTasks(newTasks);
      console.log("Batch update completed");
      return;
    }

    // Regular single task update
    setTasks(tasks.map(t => (t.id === task.id ? task : t)));
    console.log("On expander click Id:" + task.id);
  };

  return (
    <div className="Wrapper">
      <ViewSwitcher
        onViewModeChange={viewMode => setView(viewMode)}
        onViewListChange={setIsChecked}
        isChecked={isChecked}
      />
      <div style={{ padding: "0 0 1rem 0" }}>
        <label style={{ marginRight: "15px" }}>
          <input
            type="checkbox"
            checked={hideTimeCols}
            onChange={e => setHideTimeCols(e.target.checked)}
          />{" "}
          Hide Time Columns
        </label>
        <label style={{ marginRight: "15px" }}>
          <input
            type="checkbox"
            checked={useTodayLine}
            onChange={e => setUseTodayLine(e.target.checked)}
          />{" "}
          Show today as line instead of cell
        </label>
        <label style={{ marginRight: "15px" }}>
          <input
            type="checkbox"
            checked={enhancedTooltips}
            onChange={e => setEnhancedTooltips(e.target.checked)}
          />{" "}
          Enhanced Tooltips
        </label>
        <div style={{ marginTop: "10px" }}>
          <button
            onClick={handleJumpToNow}
            style={{
              padding: "5px 10px",
              background: "#0066FF",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Jump to Now
          </button>
          <button
            onClick={handleExpandAll}
            style={{
              padding: "5px 10px",
              background: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              marginRight: "8px",
            }}
          >
            Expand All
          </button>
          <button
            onClick={handleCollapseAll}
            style={{
              padding: "5px 10px",
              background: "#F44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Collapse All
          </button>
        </div>
      </div>
      <h3>Gantt With Unlimited Height</h3>
      <Gantt
        ref={ganttRef}
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        columnWidth={columnWidth}
        hideTimeColumns={hideTimeCols}
        todayLineEnabled={useTodayLine}
        todayLineColor="#0066FA"
        enhancedTooltips={enhancedTooltips}
      />
      <h3>Gantt With Limited Height</h3>
      <Gantt
        ref={limitedGanttRef}
        tasks={tasks}
        viewMode={view}
        onDateChange={handleTaskChange}
        onDelete={handleTaskDelete}
        onProgressChange={handleProgressChange}
        onDoubleClick={handleDblClick}
        onClick={handleClick}
        onSelect={handleSelect}
        onExpanderClick={handleExpanderClick}
        listCellWidth={isChecked ? "155px" : ""}
        ganttHeight={300}
        columnWidth={columnWidth}
        hideTimeColumns={hideTimeCols}
        todayLineEnabled={useTodayLine}
        todayLineColor="#0066FF"
      />
    </div>
  );
};

export default App;
