// Kept free of runtime imports so `npm run check` can execute it directly with Node.
export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  order: number;
  createdAt: string;
  updatedAt: string;
  assigneeId?: string | null;
  weekLabel?: string;
}

export interface NewTaskInput {
  title: string;
  priority: TaskPriority;
  dueDate: string | null;
  assigneeId: string | null;
  weekLabel: string;
}

export type TaskPatch = Partial<
  Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'dueDate' | 'order' | 'assigneeId' | 'weekLabel'>
>;

export const TITLE_MAX_LENGTH = 140;
export const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in_progress', 'done'];
export const TASK_PRIORITIES: readonly TaskPriority[] = ['low', 'medium', 'high'];

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done',
};

export const PRIORITY_LABELS: Record<TaskPriority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

export function isValidTitle(title: string): boolean {
  const length = title.trim().length;
  return length > 0 && length <= TITLE_MAX_LENGTH;
}

function assertValidTitle(title: string): void {
  if (!isValidTitle(title)) throw new Error(`Task title must be 1–${TITLE_MAX_LENGTH} characters`);
}

export function createTask(input: NewTaskInput, order: number, now = new Date()): Task {
  assertValidTitle(input.title);
  const timestamp = now.toISOString();
  return {
    id: crypto.randomUUID(),
    title: input.title.trim(),
    status: 'todo',
    priority: input.priority,
    dueDate: input.dueDate,
    order,
    assigneeId: input.assigneeId,
    weekLabel: input.weekLabel,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

export function applyPatch(task: Task, patch: TaskPatch, now = new Date()): Task {
  if (patch.title !== undefined) assertValidTitle(patch.title);
  return {
    ...task,
    ...patch,
    ...(patch.title !== undefined && { title: patch.title.trim() }),
    updatedAt: now.toISOString(),
  };
}

const isOptionalString = (value: unknown): boolean =>
  value === undefined || value === null || typeof value === 'string';

export function isTask(value: unknown): value is Task {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === 'string' &&
    typeof v.title === 'string' &&
    isOptionalString(v.description) &&
    (TASK_STATUSES as readonly unknown[]).includes(v.status) &&
    (TASK_PRIORITIES as readonly unknown[]).includes(v.priority) &&
    isOptionalString(v.dueDate) &&
    typeof v.order === 'number' &&
    typeof v.createdAt === 'string' &&
    typeof v.updatedAt === 'string' &&
    isOptionalString(v.assigneeId) &&
    (v.weekLabel === undefined || typeof v.weekLabel === 'string')
  );
}
