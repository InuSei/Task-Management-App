import type { ReactNode } from 'react';
import type { Task } from '@/domain/task';
import { dueDateKey, formatDateKey } from '@/domain/taskGroups';

export type BucketTone = 'neutral' | 'warning' | 'danger';

const BORDER: Record<BucketTone, string> = {
  neutral: 'border-line',
  warning: 'border-amber-500',
  danger: 'border-red-500',
};

const HEADING: Record<BucketTone, string> = {
  neutral: '',
  warning: 'text-amber-500',
  danger: 'text-red-500',
};

interface TimelineBucketProps {
  title: ReactNode;
  subtitle?: string;
  label: string;
  tone: BucketTone;
  tasks: readonly Task[];
  emptyText?: string;
  showDueDate?: boolean;
  onOpen: (id: string) => void;
}

export function TimelineBucket({
  title, subtitle, label, tone, tasks, emptyText = '—', showDueDate = false, onOpen,
}: TimelineBucketProps) {
  return (
    <section
      aria-label={`${label}, ${tasks.length} tasks`}
      className={`flex w-40 shrink-0 flex-col rounded-xl border bg-surface p-3 ${BORDER[tone]}`}
    >
      <h2 className={`flex items-center gap-1.5 text-sm font-semibold ${HEADING[tone]}`}>
        {title}
        <span className="font-normal text-muted">{tasks.length}</span>
      </h2>
      {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
      {tasks.length === 0 && <p className="mt-2 text-xs text-muted">{emptyText}</p>}
      <ul className="mt-2 flex flex-col gap-1.5">
        {tasks.map((task) => {
          const due = dueDateKey(task.dueDate);
          return (
            <li key={task.id}>
              <button
                type="button"
                onClick={() => onOpen(task.id)}
                title={task.title}
                className={`w-full rounded-md bg-canvas px-2 py-1.5 text-left text-xs hover:bg-line ${
                  task.status === 'done' ? 'text-muted line-through' : ''
                }`}
              >
                <span className="block truncate">{task.title}</span>
                {showDueDate && due && <span className="text-red-500">Due {formatDateKey(due)}</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
