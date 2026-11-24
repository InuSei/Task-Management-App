import { OctagonAlert } from 'lucide-react';
import { isBlocked, STATUS_LABELS, subtaskCount, TASK_STATUSES, type Task, type TaskPatch } from '@/domain/task';
import { dueDateKey, formatDateKey } from '@/domain/taskGroups';
import { Badge } from '@/components/ui/Badge';
import { Select } from '@/components/ui/Select';
import { BlockedBadge, PriorityBadge, UrgencyBadge } from '@/components/tasks/TaskBadges';
import { TaskStatusIcon } from './TaskStatusIcon';

interface DetailTaskRowProps {
  task: Task;
  today: string;
  collaborating: boolean;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpen: (id: string) => void;
}

export function DetailTaskRow({ task, today, collaborating, onUpdate, onOpen }: DetailTaskRowProps) {
  const due = dueDateKey(task.dueDate);
  const count = subtaskCount(task);

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
        {count && <Badge>{count}</Badge>}
        {collaborating && <Badge>Collaborator</Badge>}
        <BlockedBadge task={task} />
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
      {task.subtasks && task.subtasks.length > 0 && (
        <ul className="ml-6 space-y-0.5">
          {task.subtasks.map((s) => (
            <li key={s.id}>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={s.done}
                  onChange={() =>
                    onUpdate(task.id, { subtasks: task.subtasks?.map((x) => (x.id === s.id ? { ...x, done: !x.done } : x)) })
                  }
                  className="size-4 shrink-0 accent-accent"
                />
                <span className={`break-words ${s.done ? 'text-muted line-through' : ''}`}>{s.title}</span>
              </label>
            </li>
          ))}
        </ul>
      )}
      {isBlocked(task) && (
        <p className="flex gap-2 rounded-md border border-danger/30 bg-danger/5 p-2 text-sm">
          <OctagonAlert className="mt-0.5 size-4 shrink-0 text-danger" aria-hidden />
          <span className="whitespace-pre-wrap break-words">
            <span className="font-medium text-danger">Blocker: </span>
            {task.blocker}
          </span>
        </p>
      )}
      {task.description && <p className="whitespace-pre-wrap break-words text-sm text-muted">{task.description}</p>}
    </li>
  );
}
