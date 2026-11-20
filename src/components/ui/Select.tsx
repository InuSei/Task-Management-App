import { inputClass } from './Field';

interface SelectProps<T extends string> {
  value: T;
  options: readonly T[];
  labels: Record<T, string>;
  onChange: (value: T) => void;
  ariaLabel?: string;
  className?: string;
}

export function Select<T extends string>({
  value,
  options,
  labels,
  onChange,
  ariaLabel,
  className = inputClass,
}: SelectProps<T>) {
  return (
    <select
      aria-label={ariaLabel}
      value={value}
      // Safe: the browser can only report one of the <option> values rendered from `options`.
      onChange={(e) => onChange(e.target.value as T)}
      className={className}
    >
      {options.map((option) => (
        <option key={option} value={option}>
          {labels[option]}
        </option>
      ))}
    </select>
  );
}
