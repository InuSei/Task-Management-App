import { Check } from 'lucide-react';
import type { Personnel } from '@/domain/personnel';

interface CollaboratorPickerProps {
  people: readonly Personnel[];
  assigneeId: string | null | undefined;
  value: readonly string[] | undefined;
  onChange: (collaboratorIds: string[]) => void;
}

/** Toggle chips for everyone except the assignee; picked people see the task on their dashboard. */
export function CollaboratorPicker({ people, assigneeId, value = [], onChange }: CollaboratorPickerProps) {
  const candidates = people.filter((p) => p.id !== assigneeId);
  // Drop ids of removed people or of whoever became the assignee, so saves stay clean.
  const current = value.filter((id) => candidates.some((p) => p.id === id));

  return (
    <fieldset className="flex flex-col gap-1 text-sm">
      <legend className="mb-1 text-muted">Collaborators</legend>
      {candidates.length === 0 ? (
        <p className="text-xs text-muted">Add more team members to share this task.</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {candidates.map((person) => {
            const on = current.includes(person.id);
            return (
              <button
                key={person.id}
                type="button"
                aria-pressed={on}
                onClick={() => onChange(on ? current.filter((id) => id !== person.id) : [...current, person.id])}
                className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs ${
                  on ? 'border-accent bg-accent/12 text-accent' : 'border-line text-muted hover:text-fg'
                }`}
              >
                {on && <Check className="size-3" aria-hidden />}
                {person.name}
              </button>
            );
          })}
        </div>
      )}
    </fieldset>
  );
}
