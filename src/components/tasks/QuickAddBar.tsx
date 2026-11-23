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
import type { Personnel } from '@/domain/personnel';
import type { WeekContext } from '@/domain/week';
import { Select } from '@/components/ui/Select';
import { AssigneeSelect } from '@/components/personnel/AssigneeSelect';
import { WeekSelect } from '@/components/personnel/WeekSelect';

const controlClass = 'rounded-md border border-line bg-canvas px-2 py-1.5 text-sm';

interface QuickAddBarProps {
  people: readonly Personnel[];
  weeks: WeekContext;
  onAdd: (input: NewTaskInput) => void;
}

export function QuickAddBar({ people, weeks, onAdd }: QuickAddBarProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [dueDate, setDueDate] = useState('');
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [pickedWeek, setPickedWeek] = useState<string | null>(null);
  // Follows the active week until the user picks one; falls back if that week is renamed away.
  const weekLabel = pickedWeek && weeks.availableWeeks.includes(pickedWeek) ? pickedWeek : weeks.activeWeekLabel;
  const length = title.trim().length;
  const tooLong = length > TITLE_MAX_LENGTH;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidTitle(title)) return;
    const assignee = people.some((p) => p.id === assigneeId) ? assigneeId : null;
    onAdd({ title, priority, dueDate: dueDate || null, assigneeId: assignee, weekLabel });
    setTitle('');
    setDueDate(''); // priority, assignee and week stay sticky for rapid allocation; deadline resets
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
        className={`min-w-48 flex-1 ${controlClass} ${tooLong ? 'border-danger' : ''}`}
      />
      {tooLong && (
        <span role="status" className="text-xs text-danger">
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
      <AssigneeSelect people={people} value={assigneeId} onChange={setAssigneeId} className={controlClass} />
      <WeekSelect weeks={weeks.availableWeeks} value={weekLabel} onChange={setPickedWeek} className={controlClass} />
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
