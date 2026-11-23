'use client';

import { useId, useState, type FormEvent } from 'react';
import { Check, X } from 'lucide-react';

interface WeekRenameFormProps {
  initial: string;
  /** Returns false when the label is empty or already taken. */
  onRename: (label: string) => boolean;
  onDone: () => void;
}

const iconButton = 'rounded-md border border-line p-1.5 text-muted hover:bg-line hover:text-fg';

/** Inline rename; avoids window.prompt, which some embedded browsers don't support. */
export function WeekRenameForm({ initial, onRename, onDone }: WeekRenameFormProps) {
  const [label, setLabel] = useState(initial);
  const [invalid, setInvalid] = useState(false);
  const errorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (onRename(label)) onDone();
    else setInvalid(true);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-center gap-2">
      <input
        autoFocus
        value={label}
        onChange={(e) => {
          setLabel(e.target.value);
          setInvalid(false);
        }}
        onKeyDown={(e) => e.key === 'Escape' && onDone()}
        aria-label="Week name"
        aria-invalid={invalid}
        aria-describedby={invalid ? errorId : undefined}
        className={`w-36 rounded-md border bg-canvas px-2 py-1.5 text-sm ${invalid ? 'border-danger' : 'border-line'}`}
      />
      <button type="submit" aria-label="Save week name" title="Save" className={iconButton}>
        <Check className="size-4" aria-hidden />
      </button>
      <button type="button" onClick={onDone} aria-label="Cancel rename" title="Cancel" className={iconButton}>
        <X className="size-4" aria-hidden />
      </button>
      {invalid && (
        <span id={errorId} role="alert" className="w-full text-right text-xs text-danger">
          Week names must be non-empty and unique.
        </span>
      )}
    </form>
  );
}
