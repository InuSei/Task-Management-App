import type { ReactNode } from 'react';

export type BadgeTone = 'neutral' | 'accent' | 'warning' | 'danger';

const TONES: Record<BadgeTone, string> = {
  neutral: 'bg-line text-muted',
  accent: 'bg-accent/15 text-accent',
  warning: 'bg-amber-500/15 text-amber-500',
  danger: 'bg-red-500/15 text-red-500',
};

export function Badge({ tone = 'neutral', children }: { tone?: BadgeTone; children: ReactNode }) {
  return (
    <span className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
