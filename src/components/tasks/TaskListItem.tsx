import type { Task } from '@/domain/task';
import { dueDateKey, formatDateKey } from '@/domain/taskGroups';
import { PriorityBadge, UrgencyBadge } from './TaskBadges';

interface TaskListItemProps {
  task: Task;
  today: string;
  onToggleDone: (task: Task) => void;
  onOpen: (id: string) => void;
}

export function TaskListItem({ task, today, onToggleDone, onOpen }: TaskListItemProps) {
  const done = task.status === 'done';
  const due = dueDateKey(task.dueDate);

  return (
    <li className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-surface">
      <input
        type="checkbox"
        checked={done}
        onChange={() => onToggleDone(task)}
        aria-label={`Mark "${task.title}" as ${done ? 'not done' : 'done'}`}
        className="size-4 shrink-0 accent-accent"
      />
      <button
        type="button"
        onClick={() => onOpen(task.id)}
        className={`min-w-0 flex-1 truncate text-left ${done ? 'text-muted line-through' : ''}`}
      >
        {task.title}
      </button>
      <UrgencyBadge task={task} today={today} />
      {due && <span className="shrink-0 text-xs text-muted">{formatDateKey(due)}</span>}
      <PriorityBadge task={task} />
    </li>
  );
}
