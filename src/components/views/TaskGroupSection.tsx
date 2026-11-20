import type { ReactNode } from 'react';
import { ChevronRight } from 'lucide-react';

interface TaskGroupSectionProps {
  label: string;
  count: number;
  children: ReactNode;
}

export function TaskGroupSection({ label, count, children }: TaskGroupSectionProps) {
  return (
    <details open className="group">
      <summary className="flex cursor-pointer list-none items-center gap-2 py-1 text-sm font-semibold">
        <ChevronRight className="size-4 transition-transform group-open:rotate-90" aria-hidden />
        {label}
        <span className="font-normal text-muted">{count}</span>
      </summary>
      <ul className="mt-1">{children}</ul>
    </details>
  );
}
