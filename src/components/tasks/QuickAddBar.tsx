'use client';

import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';
import { Plus } from 'lucide-react';
import {
  isValidTitle,
  PRIORITY_LABELS,
  TASK_PRIORITIES,
  TITLE_MAX_LENGTH,
  type NewTaskInput,
  type TaskPriority,
} from '@/domain/task';
import { Select } from '@/components/ui/Select';

const controlClass = 'rounded-md border border-line bg-canvas px-2 py-1.5 text-sm';

export function QuickAddBar({ onAdd }: { onAdd: (input: NewTaskInput) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const length = title.trim().length;
  const tooLong = length > TITLE_MAX_LENGTH;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidTitle(title)) return;
    onAdd({ title, priority, dueDate: dueDate || null });
    setTitle('');
    setDueDate(''); // priority stays sticky for rapid entry; deadline resets
    inputRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Escape') setTitle('');
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-line bg-canvas/90 p-3 backdrop-blur"
    >
      <input
        ref={inputRef}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Add a task..."
        aria-label="Task title"
        aria-invalid={tooLong}
        autoFocus
        className={`min-w-48 flex-1 ${controlClass} ${tooLong ? 'border-red-500' : ''}`}
      />
      {tooLong && (
        <span role="status" className="text-xs text-red-500">
          {length}/{TITLE_MAX_LENGTH}
        </span>
      )}
      <Select
        ariaLabel="Priority"
        value={priority}
        options={TASK_PRIORITIES}
        labels={PRIORITY_LABELS}
        onChange={setPriority}
        className={controlClass}
      />
      <input
        type="date"
        aria-label="Deadline"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className={controlClass}
      />
      <button
        type="submit"
        disabled={!isValidTitle(title)}
        className="flex items-center gap-1 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50"
      >
        <Plus className="size-4" aria-hidden /> Add
      </button>
    </form>
  );
}
