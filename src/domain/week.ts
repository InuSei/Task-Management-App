export interface WeekContext {
  activeWeekLabel: string;
  availableWeeks: string[];
}

export const DEFAULT_WEEKS: WeekContext = { activeWeekLabel: 'Week 1', availableWeeks: ['Week 1'] };
export const WEEKS_STORAGE_KEY = 'ptm:weeks';

export const selectWeek = (ctx: WeekContext, label: string): WeekContext => ({ ...ctx, activeWeekLabel: label });

/** Appends the next free "Week N" label and makes it active. */
export function addWeek(ctx: WeekContext): WeekContext {
  let n = ctx.availableWeeks.length + 1;
  while (ctx.availableWeeks.includes(`Week ${n}`)) n++;
  const label = `Week ${n}`;
  return { activeWeekLabel: label, availableWeeks: [...ctx.availableWeeks, label] };
}

/** Renamed context, or null when the new label is empty or already taken. */
export function renameWeek(ctx: WeekContext, from: string, to: string): WeekContext | null {
  const label = to.trim();
  if (!label || (label !== from && ctx.availableWeeks.includes(label))) return null;
  return {
    activeWeekLabel: ctx.activeWeekLabel === from ? label : ctx.activeWeekLabel,
    availableWeeks: ctx.availableWeeks.map((w) => (w === from ? label : w)),
  };
}

export function isWeekContext(value: unknown): value is WeekContext {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.availableWeeks) &&
    v.availableWeeks.every((w) => typeof w === 'string') &&
    typeof v.activeWeekLabel === 'string' &&
    v.availableWeeks.includes(v.activeWeekLabel)
  );
}
