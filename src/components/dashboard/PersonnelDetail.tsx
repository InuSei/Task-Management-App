'use client';

import { progressPercent } from '@/domain/dashboard';
import type { Personnel } from '@/domain/personnel';
import type { Task, TaskPatch } from '@/domain/task';
import { PanelHeader } from '@/components/ui/PanelHeader';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { SlideOver } from '@/components/ui/SlideOver';
import { DetailTaskRow } from './DetailTaskRow';

interface PersonnelDetailProps {
  person: Personnel | null;
  tasks: readonly Task[];
  today: string;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpenTask: (id: string) => void;
  onClose: () => void;
}

/** Every task assigned to one person for the active week, with quick status changes. */
export function PersonnelDetail({ person, tasks, today, onUpdate, onOpenTask, onClose }: PersonnelDetailProps) {
  return (
    <SlideOver open={person !== null} label={`${person?.name ?? 'Personnel'} tasks`} onClose={onClose}>
      {(close) =>
        person && (
          <div className="flex h-full flex-col gap-4 overflow-y-auto p-5">
            <PanelHeader title={person.name} onClose={close} />
            {person.department && <p className="-mt-3 text-sm text-muted">{person.department}</p>}
            <ProgressBar value={progressPercent(tasks)} label={`${person.name} progress`} />
            {tasks.length === 0 ? (
              <p className="text-sm text-muted">No tasks assigned this week.</p>
            ) : (
              <ul className="divide-y divide-line">
                {tasks.map((task) => (
                  <DetailTaskRow key={task.id} task={task} today={today} onUpdate={onUpdate} onOpen={onOpenTask} />
                ))}
              </ul>
            )}
          </div>
        )
      }
    </SlideOver>
  );
}
