import type { Task } from './task';

export type Urgency = 'overdue' | 'today' | 'none';
export type TaskGroupId = 'overdue' | 'today' | 'upcoming' | 'noDeadline' | 'completed';

export const TASK_GROUPS: readonly { id: TaskGroupId; label: string }[] = [
  { id: 'overdue', label: 'Overdue' },
  { id: 'today', label: 'Today' },
  { id: 'upcoming', label: 'Upcoming' },
  { id: 'noDeadline', label: 'No Deadline' },
  { id: 'completed', label: 'Completed' },
];

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Local-time YYYY-MM-DD, so "today" matches the user's calendar, not UTC. */
export function toDateKey(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Normalises a dueDate (date-only or full timestamp) to a local date key. */
export function dueDateKey(dueDate: string | null | undefined): string | null {
  if (!dueDate) return null;
  if (DATE_ONLY.test(dueDate)) return dueDate;
  const parsed = new Date(dueDate);
  return Number.isNaN(parsed.getTime()) ? null : toDateKey(parsed);
}

function parseDateKey(key: string): Date {
  const [year, month, day] = key.split('-').map(Number);
  return new Date(year ?? 0, (month ?? 1) - 1, day ?? 1);
}

/** Calendar-day arithmetic on date keys (DST-safe: works on local date parts, not milliseconds). */
export function addDays(key: string, days: number): string {
  const date = parseDateKey(key);
  date.setDate(date.getDate() + days);
  return toDateKey(date);
}

export function formatDateKey(
  key: string,
  options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' },
): string {
  return parseDateKey(key).toLocaleDateString(undefined, options);
}

export function getUrgency(task: Task, today: string): Urgency {
  const due = dueDateKey(task.dueDate);
  if (task.status === 'done' || due === null) return 'none';
  if (due < today) return 'overdue';
  return due === today ? 'today' : 'none';
}

export function isOverdue(task: Task, today: string): boolean {
  return getUrgency(task, today) === 'overdue';
}

function groupOf(task: Task, today: string): TaskGroupId {
  if (task.status === 'done') return 'completed';
  const due = dueDateKey(task.dueDate);
  if (due === null) return 'noDeadline';
  if (due < today) return 'overdue';
  return due === today ? 'today' : 'upcoming';
}

function byDueThenOrder(a: Task, b: Task): number {
  const dueA = dueDateKey(a.dueDate) ?? '';
  const dueB = dueDateKey(b.dueDate) ?? '';
  return dueA.localeCompare(dueB) || a.order - b.order;
}

export function groupTasks(tasks: readonly Task[], today: string): Record<TaskGroupId, Task[]> {
  const groups: Record<TaskGroupId, Task[]> = {
    overdue: [],
    today: [],
    upcoming: [],
    noDeadline: [],
    completed: [],
  };
  for (const task of tasks) groups[groupOf(task, today)].push(task);
  for (const list of Object.values(groups)) list.sort(byDueThenOrder);
  return groups;
}
