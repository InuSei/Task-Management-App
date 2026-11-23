'use client';

import { useState } from 'react';
import { Pencil, Plus } from 'lucide-react';
import { formatDateKey } from '@/domain/taskGroups';
import { addWeek, selectWeek, type WeekContext } from '@/domain/week';
import { WeekSelect } from '@/components/personnel/WeekSelect';
import { WeekRenameForm } from './WeekRenameForm';

interface DashboardHeaderProps {
  today: string;
  weeks: WeekContext;
  onWeeksChange: (weeks: WeekContext) => void;
  onRenameWeek: (label: string) => boolean;
}

const iconButton = 'rounded-md border border-line p-1.5 text-muted hover:bg-line hover:text-fg';

export function DashboardHeader({ today, weeks, onWeeksChange, onRenameWeek }: DashboardHeaderProps) {
  const [renaming, setRenaming] = useState(false);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
      <div>
        <p className="text-xs tracking-wide text-muted uppercase">Today</p>
        <p className="text-lg font-semibold">
          {formatDateKey(today, { weekday: 'long', month: 'short', day: 'numeric' })}
        </p>
      </div>
      {renaming ? (
        <WeekRenameForm initial={weeks.activeWeekLabel} onRename={onRenameWeek} onDone={() => setRenaming(false)} />
      ) : (
        <div className="flex items-center gap-2">
          <WeekSelect
            ariaLabel="Active week"
            weeks={weeks.availableWeeks}
            value={weeks.activeWeekLabel}
            onChange={(week) => onWeeksChange(selectWeek(weeks, week))}
            className="rounded-md border border-line bg-canvas px-2 py-1.5 text-sm font-medium"
          />
          <button type="button" onClick={() => setRenaming(true)} aria-label="Rename week" title="Rename week" className={iconButton}>
            <Pencil className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => onWeeksChange(addWeek(weeks))}
            aria-label="Add week"
            title="Add week"
            className={iconButton}
          >
            <Plus className="size-4" aria-hidden />
          </button>
        </div>
      )}
    </div>
  );
}
