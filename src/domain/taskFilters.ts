import { PRIORITY_LABELS, type Task, type TaskPriority } from './task.ts';

export type PriorityFilter = TaskPriority | 'all';

export interface TaskFilters {
  priority: PriorityFilter;
  query: string;
}

export const DEFAULT_FILTERS: TaskFilters = { priority: 'all', query: '' };
export const PRIORITY_FILTERS: readonly PriorityFilter[] = ['all', 'high', 'medium', 'low'];
export const PRIORITY_FILTER_LABELS: Record<PriorityFilter, string> = { all: 'All', ...PRIORITY_LABELS };

export function filterTasks(tasks: readonly Task[], { priority, query }: TaskFilters): Task[] {
  const needle = query.trim().toLowerCase();
  return tasks.filter(
    (task) =>
      (priority === 'all' || task.priority === priority) &&
      (needle === '' ||
        task.title.toLowerCase().includes(needle) ||
        (task.description ?? '').toLowerCase().includes(needle)),
  );
}
