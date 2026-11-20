'use client';

import type { Personnel } from '@/domain/personnel';
import type { Task, TaskPatch } from '@/domain/task';
import { SlideOver } from '@/components/ui/SlideOver';
import { TaskEditForm } from './TaskEditForm';

interface TaskDrawerProps {
  task: Task | null;
  people: readonly Personnel[];
  weeks: readonly string[];
  onClose: () => void;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onDelete: (id: string) => void;
}

export function TaskDrawer({ task, people, weeks, onClose, onUpdate, onDelete }: TaskDrawerProps) {
  return (
    <SlideOver open={task !== null} label="Task details" onClose={onClose}>
      {(close) =>
        task && (
          <TaskEditForm
            key={task.id}
            task={task}
            people={people}
            weeks={weeks}
            onUpdate={(patch) => onUpdate(task.id, patch)}
            onDelete={() => onDelete(task.id)}
            onClose={close}
          />
        )
      }
    </SlideOver>
  );
}
