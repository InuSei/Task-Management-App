import type { Task } from './task.ts';
import { dueDateKey } from './taskGroups.ts';

const NO_DUE = '￿'; // sorts undated tasks after dated ones

/** A person's tasks: open before done, then soonest deadline, then manual order. */
export function tasksForPerson(tasks: readonly Task[], personId: string): Task[] {
  return tasks
    .filter((t) => t.assigneeId === personId)
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
