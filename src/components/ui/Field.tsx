import type { ReactNode } from 'react';

export const inputClass = 'w-full rounded-md border border-line bg-canvas px-2 py-1.5 text-sm';

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1 text-sm">
      <span className="text-muted">{label}</span>
      {children}
    </label>
  );
}
