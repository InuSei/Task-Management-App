import type { Personnel } from '@/domain/personnel';
import type { Task } from '@/domain/task';
import { dueDateKey, formatDateKey } from '@/domain/taskGroups';
import { AssigneeSelect } from '@/components/personnel/AssigneeSelect';
import { PriorityBadge, UrgencyBadge } from './TaskBadges';

interface TaskListItemProps {
  task: Task;
  today: string;
  people: readonly Personnel[];
  onAssign: (task: Task, assigneeId: string | null) => void;
  onToggleDone: (task: Task) => void;
  onOpen: (id: string) => void;
}

export function TaskListItem({ task, today, people, onAssign, onToggleDone, onOpen }: TaskListItemProps) {
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
      <AssigneeSelect
        people={people}
        value={task.assigneeId}
        onChange={(assigneeId) => onAssign(task, assigneeId)}
        ariaLabel={`Assignee for "${task.title}"`}
        // Unassigned stays highlighted so nothing gets lost before allocation (spec §8.3.2).
        className={`w-32 shrink-0 truncate rounded-md border border-line bg-canvas px-1.5 py-1 text-xs ${
          people.some((p) => p.id === task.assigneeId) ? '' : 'text-warning'
        }`}
      />
    </li>
  );
}
