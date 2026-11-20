import { TASK_STATUSES, type Task, type TaskPatch, type TaskStatus } from './task.ts';

export type MoveDirection = 'left' | 'right' | 'up' | 'down';
export type BoardColumns = Record<TaskStatus, Task[]>;

export function groupByStatus(tasks: readonly Task[]): BoardColumns {
  const columns: BoardColumns = { todo: [], in_progress: [], done: [] };
  for (const task of tasks) columns[task.status].push(task);
  for (const column of Object.values(columns)) column.sort((a, b) => a.order - b.order);
  return columns;
}

// shortcut: midpoint ordering loses float precision after ~50 repeated inserts at one spot;
// renumber the column if that ever matters.
function orderAt(column: readonly Task[], index: number): number {
  const before = column[index - 1]?.order;
  const after = column[index]?.order;
  if (before !== undefined && after !== undefined) return (before + after) / 2;
  if (before !== undefined) return before + 1;
  if (after !== undefined) return after - 1;
  return 1;
}

/** Patch that places a task at `index` of `status`, where `index` ignores the task itself. */
export function placeTask(
  columns: BoardColumns,
  taskId: string,
  status: TaskStatus,
  index: number,
): TaskPatch {
  const others = columns[status].filter((t) => t.id !== taskId);
  return { status, order: orderAt(others, index) };
}

/** Patch for a keyboard move, or null when the move would leave the board. */
export function moveTask(columns: BoardColumns, task: Task, direction: MoveDirection): TaskPatch | null {
  if (direction === 'left' || direction === 'right') {
    const target = TASK_STATUSES[TASK_STATUSES.indexOf(task.status) + (direction === 'left' ? -1 : 1)];
    return target ? placeTask(columns, task.id, target, columns[target].length) : null;
  }
  const column = columns[task.status];
  const index = column.findIndex((t) => t.id === task.id) + (direction === 'up' ? -1 : 1);
  return index < 0 || index >= column.length ? null : placeTask(columns, task.id, task.status, index);
}
