import type { LucideIcon } from 'lucide-react';

export interface SegmentOption<T extends string | number> {
  value: T;
  label: string;
  Icon?: LucideIcon;
}

interface SegmentedControlProps<T extends string | number> {
  label: string;
  value: T;
  options: readonly SegmentOption<T>[];
  onChange: (value: T) => void;
}

/** Toggle-button group; the active segment uses the accent colour. */
export function SegmentedControl<T extends string | number>({
  label,
  value,
  options,
  onChange,
}: SegmentedControlProps<T>) {
  return (
    <div role="group" aria-label={label} className="flex rounded-lg border border-line p-0.5">
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-sm ${
            value === option.value ? 'bg-accent text-on-accent' : 'text-muted hover:text-fg'
          }`}
        >
          {option.Icon && <option.Icon className="size-4" aria-hidden />}
          {option.label}
        </button>
      ))}
    </div>
  );
}
