'use client';

import { useId, useState } from 'react';
import { OctagonAlert } from 'lucide-react';
import { inputClass } from '@/components/ui/Field';

interface BlockerFieldProps {
  blocker: string | undefined;
  onSave: (blocker: string | undefined) => void;
}

/** Free-text reason the task is stuck. Saves on blur; clearing it unblocks the task. */
export function BlockerField({ blocker, onSave }: BlockerFieldProps) {
  const [text, setText] = useState(blocker ?? '');
  const hintId = useId();
  const active = text.trim().length > 0;

  function commit() {
    const next = text.trim() || undefined;
    if (next !== (blocker?.trim() || undefined)) onSave(next);
  }

  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className={`flex items-center gap-1.5 ${active ? 'text-danger' : 'text-muted'}`}>
        <OctagonAlert className="size-4" aria-hidden /> Blocker
      </span>
      <textarea
        rows={3}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={commit}
        placeholder="What's stopping this task, and what caused it?"
        aria-describedby={hintId}
        className={`${inputClass} resize-y ${active ? 'border-danger/50 bg-danger/5' : ''}`}
      />
      <span id={hintId} className="text-xs text-muted">
        Shown on the dashboard. Clear it once the task is unblocked.
      </span>
    </label>
  );
}
