import type { Personnel } from '@/domain/personnel';
import { Select } from '@/components/ui/Select';

const UNASSIGNED = '';

interface AssigneeSelectProps {
  people: readonly Personnel[];
  value: string | null | undefined;
  onChange: (assigneeId: string | null) => void;
  ariaLabel?: string;
  className?: string;
}

export function AssigneeSelect({ people, value, onChange, ariaLabel = 'Assignee', className }: AssigneeSelectProps) {
  const options = [UNASSIGNED, ...people.map((p) => p.id)];
  const labels: Record<string, string> = { [UNASSIGNED]: 'Unassigned' };
  for (const p of people) labels[p.id] = p.name;
  // An id with no matching person (e.g. removed elsewhere) reads as unassigned.
  const current = value && value in labels ? value : UNASSIGNED;

  return (
    <Select
      ariaLabel={ariaLabel}
      value={current}
      options={options}
      labels={labels}
      onChange={(id) => onChange(id || null)}
      className={className}
    />
  );
}
