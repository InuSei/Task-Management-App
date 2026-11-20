import { ChevronRight } from 'lucide-react';
import { progressPercent } from '@/domain/dashboard';
import type { Personnel } from '@/domain/personnel';
import type { Task } from '@/domain/task';
import { dueDateKey, formatDateKey, isOverdue } from '@/domain/taskGroups';
import { Badge } from '@/components/ui/Badge';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { TaskStatusIcon } from './TaskStatusIcon';

const PREVIEW_LIMIT = 3;

interface PersonnelCardProps {
  person: Personnel;
  tasks: readonly Task[];
  today: string;
  onOpenPerson: () => void;
  onOpenTask: (id: string) => void;
}

/** Header and "+X more" open the person's full list; each task opens its own detail. */
export function PersonnelCard({ person, tasks, today, onOpenPerson, onOpenTask }: PersonnelCardProps) {
  const hidden = tasks.length - PREVIEW_LIMIT;

  return (
    <li className="flex h-full flex-col gap-3 rounded-xl border border-line bg-surface p-4">
      <button
        type="button"
        onClick={onOpenPerson}
        aria-haspopup="dialog"
        title="View all tasks"
        className="group flex w-full items-center gap-2 text-left"
      >
        <h3 className="min-w-0 truncate font-semibold group-hover:text-accent">{person.name}</h3>
        <ChevronRight className="size-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
        {person.department && (
          <span className="ml-auto">
            <Badge tone="accent">{person.department}</Badge>
          </span>
        )}
      </button>
      {tasks.length === 0 ? (
        <p className="text-sm text-muted">No tasks this week</p>
      ) : (
        <ul className="-mx-1.5 space-y-0.5">
          {tasks.slice(0, PREVIEW_LIMIT).map((task) => {
            const due = dueDateKey(task.dueDate);
            return (
              <li key={task.id}>
                <button
                  type="button"
                  onClick={() => onOpenTask(task.id)}
                  aria-haspopup="dialog"
                  title={task.title}
                  className="flex w-full items-center gap-2 rounded-md px-1.5 py-1 text-left text-sm hover:bg-line"
                >
                  <TaskStatusIcon status={task.status} />
                  <span className={`min-w-0 flex-1 truncate ${task.status === 'done' ? 'text-muted line-through' : ''}`}>
                    {task.title}
                  </span>
                  {due && (
                    <span className={`shrink-0 text-xs ${isOverdue(task, today) ? 'text-danger' : 'text-muted'}`}>
                      {formatDateKey(due)}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
      {hidden > 0 && (
        <button type="button" onClick={onOpenPerson} className="self-start text-xs text-accent hover:underline">
          +{hidden} more {hidden === 1 ? 'task' : 'tasks'}
        </button>
      )}
      <div className="mt-auto">
        <ProgressBar value={progressPercent(tasks)} label={`${person.name} progress`} />
      </div>
    </li>
  );
}
