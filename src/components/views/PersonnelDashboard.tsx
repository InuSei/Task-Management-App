'use client';

import { useState } from 'react';
import { tasksForPerson } from '@/domain/dashboard';
import type { Personnel } from '@/domain/personnel';
import type { Task, TaskPatch } from '@/domain/task';
import { toDateKey } from '@/domain/taskGroups';
import type { WeekContext } from '@/domain/week';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { PersonnelCard } from '@/components/dashboard/PersonnelCard';
import { PersonnelDetail } from '@/components/dashboard/PersonnelDetail';
import { NoTeamPrompt } from '@/components/personnel/NoTeamPrompt';

interface PersonnelDashboardProps {
  people: readonly Personnel[];
  tasks: readonly Task[];
  weeks: WeekContext;
  onWeeksChange: (weeks: WeekContext) => void;
  onRenameWeek: (label: string) => boolean;
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpenTask: (id: string) => void;
  onManageTeam: () => void;
}

/** Read-friendly per-person progress for the active week. */
export function PersonnelDashboard({ people, tasks, weeks, onUpdate, onOpenTask, onManageTeam, ...header }: PersonnelDashboardProps) {
  const [openId, setOpenId] = useState<string | null>(null);
  const today = toDateKey(new Date());
  const weekTasks = tasks.filter((t) => t.weekLabel === weeks.activeWeekLabel);
  const open = people.find((p) => p.id === openId) ?? null;

  return (
    <div className="space-y-4">
      <DashboardHeader today={today} weeks={weeks} {...header} />
      {people.length === 0 ? (
        <NoTeamPrompt onManageTeam={onManageTeam} />
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {people.map((person) => (
            <PersonnelCard
              key={person.id}
              person={person}
              tasks={tasksForPerson(weekTasks, person.id)}
              today={today}
              onOpenPerson={() => setOpenId(person.id)}
              onOpenTask={onOpenTask}
            />
          ))}
        </ul>
      )}
      <PersonnelDetail
        person={open}
        tasks={open ? tasksForPerson(weekTasks, open.id) : []}
        today={today}
        onUpdate={onUpdate}
        onOpenTask={onOpenTask}
        onClose={() => setOpenId(null)}
      />
    </div>
  );
}
