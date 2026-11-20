import { Search } from 'lucide-react';
import { PRIORITY_FILTER_LABELS, PRIORITY_FILTERS, type TaskFilters } from '@/domain/taskFilters';
import { inputClass } from '@/components/ui/Field';
import { Select } from '@/components/ui/Select';

interface FilterBarProps {
  filters: TaskFilters;
  onChange: (filters: TaskFilters) => void;
}

export function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pt-3">
      <div className="relative min-w-48 flex-1">
        <Search
          className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 text-muted"
          aria-hidden
        />
        <input
          type="search"
          value={filters.query}
          onChange={(e) => onChange({ ...filters, query: e.target.value })}
          placeholder="Search tasks..."
          aria-label="Search tasks"
          className={`${inputClass} pl-8`}
        />
      </div>
      <Select
        ariaLabel="Filter by priority"
        value={filters.priority}
        options={PRIORITY_FILTERS}
        labels={PRIORITY_FILTER_LABELS}
        onChange={(priority) => onChange({ ...filters, priority })}
        className="rounded-md border border-line bg-canvas px-2 py-1.5 text-sm"
      />
    </div>
  );
}
