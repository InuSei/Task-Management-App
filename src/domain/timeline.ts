import type { Task } from './task';
import { addDays, dueDateKey, isOverdue } from './taskGroups.ts';

export interface TimelineDay {
  key: string;
  tasks: Task[];
}

export interface Timeline {
  overdue: Task[];
  days: TimelineDay[];
}

/** Overdue bucket plus one bucket per day from today; tasks due past the window are left out. */
export function buildTimeline(tasks: readonly Task[], today: string, dayCount: number): Timeline {
  const days: TimelineDay[] = Array.from({ length: dayCount }, (_, i) => ({
    key: addDays(today, i),
    tasks: [],
  }));
  const byKey = new Map(days.map((day) => [day.key, day.tasks]));
  const overdue: Task[] = [];

  for (const task of tasks) {
    if (isOverdue(task, today)) overdue.push(task);
    else byKey.get(dueDateKey(task.dueDate) ?? '')?.push(task);
  }

  const dueKey = (task: Task) => dueDateKey(task.dueDate) ?? '';
  overdue.sort((a, b) => dueKey(a).localeCompare(dueKey(b)) || a.order - b.order);
  for (const day of days) day.tasks.sort((a, b) => a.order - b.order);
  return { overdue, days };
}
