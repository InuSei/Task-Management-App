'use client';

import { useEffect, useRef, type MouseEvent, type SyntheticEvent } from 'react';
import type { Task, TaskPatch } from '@/domain/task';
import { TaskEditForm } from './TaskEditForm';

interface TaskDrawerProps {
  task: Task | null;
  onClose: () => void;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onDelete: (id: string) => void;
}

/** Slide-over built on <dialog> for native focus trapping, Escape handling and top-layer stacking. */
export function TaskDrawer({ task, onClose, onUpdate, onDelete }: TaskDrawerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (task && !dialog.open) dialog.showModal();
    if (!task && dialog.open) dialog.close();
  }, [task]);

  // Blur first so the focused field's onBlur auto-save runs before the drawer closes.
  function requestClose() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    dialogRef.current?.close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-label="Task details"
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md border-l border-line bg-surface p-0 text-fg backdrop:bg-black/50"
    >
      {task && (
        <TaskEditForm
          key={task.id}
          task={task}
          onUpdate={(patch) => onUpdate(task.id, patch)}
          onDelete={() => onDelete(task.id)}
          onClose={requestClose}
        />
      )}
    </dialog>
  );
}
