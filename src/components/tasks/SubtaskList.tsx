'use client';

import { useState, type KeyboardEvent } from 'react';
import { ListChecks, X } from 'lucide-react';
import { isValidTitle, newSubtask, type Subtask } from '@/domain/task';
import { inputClass } from '@/components/ui/Field';

interface SubtaskListProps {
  subtasks: readonly Subtask[] | undefined;
  onChange: (subtasks: Subtask[]) => void;
}

// The panel is a <form>: Enter here must not submit (and close) it.
function blurOnEnter(e: KeyboardEvent<HTMLInputElement>) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  e.currentTarget.blur();
}

/** Checklist editor for the task panel: add, tick, rename (on blur) and remove sub-tasks. */
export function SubtaskList({ subtasks = [], onChange }: SubtaskListProps) {
  const [draft, setDraft] = useState('');
  const done = subtasks.filter((s) => s.done).length;
  const update = (id: string, patch: Partial<Subtask>) =>
    onChange(subtasks.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  function add() {
    if (!isValidTitle(draft)) return;
    onChange([...subtasks, newSubtask(draft)]);
    setDraft('');
  }

  return (
    <fieldset className="flex flex-col gap-1 text-sm">
      <legend className="mb-1 flex items-center gap-1.5 text-muted">
        <ListChecks className="size-4" aria-hidden /> Sub-tasks
        {subtasks.length > 0 && <span>({done}/{subtasks.length})</span>}
      </legend>
      {subtasks.length > 0 && (
        <ul className="space-y-1">
          {subtasks.map((s) => (
            <SubtaskRow
              key={s.id}
              subtask={s}
              onToggle={() => update(s.id, { done: !s.done })}
              onRename={(title) => update(s.id, { title: title.trim() })}
              onRemove={() => onChange(subtasks.filter((x) => x.id !== s.id))}
            />
          ))}
        </ul>
      )}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key !== 'Enter') return;
          e.preventDefault();
          add();
        }}
        onBlur={add}
        placeholder="Add a sub-task and press Enter"
        aria-label="New sub-task"
        className={inputClass}
      />
    </fieldset>
  );
}

interface SubtaskRowProps {
  subtask: Subtask;
  onToggle: () => void;
  onRename: (title: string) => void;
  onRemove: () => void;
}

function SubtaskRow({ subtask, onToggle, onRename, onRemove }: SubtaskRowProps) {
  const [title, setTitle] = useState(subtask.title);

  function commit() {
    if (!isValidTitle(title)) return setTitle(subtask.title); // invalid edit: revert
    if (title.trim() !== subtask.title) onRename(title);
  }

  return (
    <li className="flex items-center gap-2">
      <input
        type="checkbox"
        checked={subtask.done}
        onChange={onToggle}
        aria-label={`Done: ${subtask.title}`}
        className="size-4 shrink-0 accent-accent"
      />
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={commit}
        onKeyDown={blurOnEnter}
        aria-label="Sub-task title"
        className={`min-w-0 flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 hover:border-line focus:border-line ${
          subtask.done ? 'text-muted line-through' : ''
        }`}
      />
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove sub-task: ${subtask.title}`}
        title="Remove sub-task"
        className="rounded p-1 text-muted hover:bg-danger/10 hover:text-danger"
      >
        <X className="size-4" aria-hidden />
      </button>
    </li>
  );
}
