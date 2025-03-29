import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      name: "Product Development",
      id: "MainProject",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Frontend Development",
      id: "FrontendProject",
      progress: 35,
      type: "project",
      hideChildren: false,
      project: "MainProject",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      name: "Initial Design",
      id: "Task0",
      progress: 100,
      type: "task",
      project: "FrontendProject",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      name: "Component Library",
      id: "Task1",
      progress: 80,
      dependencies: ["Task0"],
      type: "task",
      project: "FrontendProject",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Main UI Implementation",
      id: "Task2",
      progress: 50,
      dependencies: ["Task1"],
      type: "task",
      project: "FrontendProject",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      name: "Testing & Fixes",
      id: "Task3",
      type: "task",
      progress: 25,
      dependencies: ["Task2"],
      project: "FrontendProject",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      name: "Backend Development",
      id: "BackendProject",
      progress: 40,
      type: "project",
      hideChildren: false,
      project: "MainProject",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
      name: "API Design",
      id: "Task4",
      progress: 100,
      type: "task",
      project: "BackendProject",
      displayOrder: 8,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      name: "Database Setup",
      id: "Task5",
      type: "task",
      progress: 100,
      dependencies: ["Task4"],
      project: "BackendProject",
      displayOrder: 9,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Core Services",
      id: "CoreProject",
      progress: 30,
      type: "project",
      hideChildren: false,
      dependencies: ["Task5"],
      project: "BackendProject",
      displayOrder: 10,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      name: "Authentication Service",
      id: "Task6",
      progress: 80,
      type: "task",
      project: "CoreProject",
      displayOrder: 11,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      name: "Data Processing Service",
      id: "Task7",
      progress: 40,
      type: "task",
      project: "CoreProject",
      dependencies: ["Task6"],
      displayOrder: 12,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 12),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Notification Service",
      id: "Task8",
      progress: 0,
      type: "task",
      project: "CoreProject",
      dependencies: ["Task7"],
      displayOrder: 13,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      name: "API Testing & Documentation",
      id: "Task9",
      progress: 10,
      type: "task",
      project: "BackendProject",
      dependencies: ["CoreProject"],
      displayOrder: 14,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      name: "Integration Phase",
      id: "IntegrationProject",
      progress: 20,
      type: "project",
      hideChildren: false,
      project: "MainProject",
      dependencies: ["FrontendProject", "BackendProject"],
      displayOrder: 15,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      name: "Frontend-Backend Integration",
      id: "Task10",
      progress: 50,
      type: "task",
      project: "IntegrationProject",
      displayOrder: 16,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 20),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 22),
      name: "End-to-End Testing",
      id: "Task11",
      progress: 0,
      type: "task",
      dependencies: ["Task10"],
      project: "IntegrationProject",
      displayOrder: 17,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 25),
      name: "Release v1.0",
      id: "MilestoneRelease",
      progress: 0,
      type: "milestone",
      project: "MainProject",
      dependencies: ["IntegrationProject"],
      displayOrder: 18,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 2),
      name: "Post-Release Party",
      id: "Task12",
      progress: 0,
      isDisabled: true,
      type: "task",
      displayOrder: 19,
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  if (projectTasks.length === 0) {
    return [new Date(), new Date()];
  }

  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
