import { Select } from '@/components/ui/Select';

interface WeekSelectProps {
  weeks: readonly string[];
  /** '' means the task has no week yet. */
  value: string;
  onChange: (week: string) => void;
  ariaLabel?: string;
  className?: string;
}

export function WeekSelect({ weeks, value, onChange, ariaLabel = 'Week', className }: WeekSelectProps) {
  // Keep a value that isn't in the list (no week yet) selectable so the control never lies.
  const options = weeks.includes(value) ? weeks : [value, ...weeks];
  const labels: Record<string, string> = {};
  for (const week of options) labels[week] = week || 'No week';

  return (
    <Select
      ariaLabel={ariaLabel}
      value={value}
      options={options}
      labels={labels}
      onChange={onChange}
      className={className}
    />
  );
}
