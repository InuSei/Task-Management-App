import type { Task } from './task.ts';
import { dueDateKey } from './taskGroups.ts';

const NO_DUE = '￿'; // sorts undated tasks after dated ones

/** True when the person shares the task without owning it. */
export const isCollaborator = (task: Task, personId: string): boolean =>
  task.assigneeId !== personId && (task.collaboratorIds ?? []).includes(personId);

/** Tasks a person owns or collaborates on: open before done, then soonest deadline, then manual order. */
export function tasksForPerson(tasks: readonly Task[], personId: string): Task[] {
  return tasks
    .filter((t) => t.assigneeId === personId || isCollaborator(t, personId))
    .sort(
      (a, b) =>
        Number(a.status === 'done') - Number(b.status === 'done') ||
        (dueDateKey(a.dueDate) ?? NO_DUE).localeCompare(dueDateKey(b.dueDate) ?? NO_DUE) ||
        a.order - b.order,
    );
}

export function progressPercent(tasks: readonly Task[]): number {
  if (tasks.length === 0) return 0;
  return Math.round((tasks.filter((t) => t.status === 'done').length / tasks.length) * 100);
}
