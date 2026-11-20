'use client';

import { useState } from 'react';
import { TriangleAlert } from 'lucide-react';
import type { Task } from '@/domain/task';
import { formatDateKey, toDateKey } from '@/domain/taskGroups';
import { buildTimeline } from '@/domain/timeline';
import { SegmentedControl, type SegmentOption } from '@/components/ui/SegmentedControl';
import { TimelineBucket } from './TimelineBucket';

const WINDOWS: readonly SegmentOption<number>[] = [
  { value: 7, label: '7 days' },
  { value: 14, label: '14 days' },
];

interface TimelineMonitorProps {
  tasks: readonly Task[];
  onOpen: (id: string) => void;
}

export function TimelineMonitor({ tasks, onOpen }: TimelineMonitorProps) {
  const [dayCount, setDayCount] = useState(7);
  const today = toDateKey(new Date());
  const { overdue, days } = buildTimeline(tasks, today, dayCount);

  return (
    <div className="space-y-3">
      <div className="flex justify-end">
        <SegmentedControl label="Timeline window" value={dayCount} options={WINDOWS} onChange={setDayCount} />
      </div>
      <div role="region" aria-label="Deadline timeline" tabIndex={0} className="flex gap-3 overflow-x-auto pb-2">
        <TimelineBucket
          title={<><TriangleAlert className="size-4" aria-hidden /> Overdue</>}
          label="Overdue"
          tone="danger"
          tasks={overdue}
          emptyText="Nothing overdue"
          showDueDate
          onOpen={onOpen}
        />
        {days.map(({ key, tasks: dayTasks }) => {
          const isToday = key === today;
          const weekday = formatDateKey(key, { weekday: 'short' });
          return (
            <TimelineBucket
              key={key}
              title={isToday ? 'Today' : weekday}
              subtitle={formatDateKey(key)}
              label={`${isToday ? 'Today' : weekday} ${formatDateKey(key)}`}
              tone={isToday ? 'warning' : 'neutral'}
              tasks={dayTasks}
              onOpen={onOpen}
            />
          );
        })}
      </div>
    </div>
  );
}
