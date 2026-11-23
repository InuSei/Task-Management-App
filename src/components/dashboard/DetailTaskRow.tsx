import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskPatch } from '@/domain/task';
import { dueDateKey, formatDateKey } from '@/domain/taskGroups';
import { Select } from '@/components/ui/Select';
import { PriorityBadge, UrgencyBadge } from '@/components/tasks/TaskBadges';
import { TaskStatusIcon } from './TaskStatusIcon';

interface DetailTaskRowProps {
  task: Task;
  today: string;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpen: (id: string) => void;
}

export function DetailTaskRow({ task, today, onUpdate, onOpen }: DetailTaskRowProps) {
  const due = dueDateKey(task.dueDate);

  return (
    <li className="space-y-2 py-3">
      <div className="flex items-center gap-2">
        <TaskStatusIcon status={task.status} />
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          aria-haspopup="dialog"
          title="Open task details"
          className={`min-w-0 flex-1 break-words text-left font-medium hover:text-accent hover:underline ${
            task.status === 'done' ? 'text-muted line-through' : ''
          }`}
        >
          {task.title}
        </button>
        <UrgencyBadge task={task} today={today} />
        <PriorityBadge task={task} />
      </div>
      <div className="flex items-center gap-3 text-xs text-muted">
        <Select
          ariaLabel={`Status of "${task.title}"`}
          value={task.status}
          options={TASK_STATUSES}
          labels={STATUS_LABELS}
          onChange={(status) => onUpdate(task.id, { status })}
          className="rounded-md border border-line bg-canvas px-2 py-1 text-xs text-fg"
        />
        <span>{due ? `Due ${formatDateKey(due, { weekday: 'short', month: 'short', day: 'numeric' })}` : 'No deadline'}</span>
      </div>
      {task.description && <p className="whitespace-pre-wrap break-words text-sm text-muted">{task.description}</p>}
    </li>
  );
}
