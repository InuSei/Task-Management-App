'use client';

import { useState } from 'react';
import { Download, Users } from 'lucide-react';
import { isCollaborator } from '@/domain/dashboard';
import type { Personnel } from '@/domain/personnel';
import { buildWeeklyReport, NO_DEPARTMENT, REPORT_SECTIONS } from '@/domain/report';
import type { DepartmentColors } from '@/domain/roleColor';
import type { Task } from '@/domain/task';
import { dueDateKey, formatDateKey, isOverdue, toDateKey } from '@/domain/taskGroups';
import type { WeekContext } from '@/domain/week';
import { TaskStatusIcon } from '@/components/dashboard/TaskStatusIcon';
import { WeekSelect } from '@/components/personnel/WeekSelect';
import { RoleBadge } from '@/components/personnel/RoleBadge';

interface WeeklyReportProps {
  people: readonly Personnel[];
  tasks: readonly Task[];
  weeks: WeekContext;
  departmentColors: DepartmentColors;
}

/** Read-only weekly summary for HR; Download PDF builds the file directly. */
export function WeeklyReport({ people, tasks, weeks, departmentColors }: WeeklyReportProps) {
  // Local choice: picking a week here must not change the team's shared active week.
  const [week, setWeek] = useState(weeks.activeWeekLabel);
  const today = toDateKey(new Date());
  const report = buildWeeklyReport(tasks, people, week, today);
  const { counts } = report;
  const empty = counts.done + counts.blocked + counts.inProgress + counts.todo === 0;

  return (
    <article className="space-y-4">
      <header className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-surface p-4">
        <div>
          <h2 className="text-lg font-semibold">Weekly report · {week}</h2>
          <p className="text-xs text-muted">
            Generated {formatDateKey(today, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <WeekSelect
            ariaLabel="Report week"
            weeks={weeks.availableWeeks}
            value={week}
            onChange={setWeek}
            className="rounded-md border border-line bg-canvas px-2 py-1.5 text-sm font-medium"
          />
          <button
            type="button"
            disabled={empty}
            // Loaded on click so the PDF library stays out of the page bundle.
            onClick={() => import('./reportPdf').then((m) => m.downloadReportPdf(report, week, today))}
            className="flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover disabled:opacity-50"
          >
            <Download className="size-4" aria-hidden />
            Download PDF
          </button>
        </div>
      </header>

      {empty ? (
        <p className="py-16 text-center text-muted">No tasks in {week}.</p>
      ) : (
        <>
          <dl className="grid grid-cols-3 gap-3 rounded-xl border border-line bg-surface p-4 text-center sm:grid-cols-6">
            <Stat label="Progress" value={`${report.progress}%`} />
            <Stat label="Done" value={counts.done} />
            <Stat label="In progress" value={counts.inProgress} />
            <Stat label="Not started" value={counts.todo} />
            <Stat label="Blocked" value={counts.blocked} danger={counts.blocked > 0} />
            <Stat label="Overdue" value={counts.overdue} danger={counts.overdue > 0} />
          </dl>

          {report.departments.map((dept) => (
            <section key={dept.department} className="space-y-3 rounded-xl border border-line bg-surface p-4">
              <h3 className="flex items-center justify-between gap-2 font-semibold">
                {dept.department === NO_DEPARTMENT ? (
                  <span className="text-muted">{NO_DEPARTMENT}</span>
                ) : (
                  <RoleBadge department={dept.department} colors={departmentColors} />
                )}
                <span className="text-sm text-muted">{dept.progress}% done</span>
              </h3>
              {dept.people.map(({ person, sections, progress }) => (
                <div key={person.id} className="border-t border-line pt-3">
                  <p className="flex justify-between gap-2 font-medium">
                    {person.name}
                    <span className="text-sm text-muted">{progress}%</span>
                  </p>
                  {REPORT_SECTIONS.every(({ id }) => sections[id].length === 0) ? (
                    <p className="text-sm text-muted">No tasks this week</p>
                  ) : (
                    REPORT_SECTIONS.map(({ id, label }) =>
                      sections[id].length === 0 ? null : (
                        <div key={id} className="mt-2">
                          <p className={`text-xs tracking-wide uppercase ${id === 'blocked' ? 'text-danger' : 'text-muted'}`}>
                            {label} ({sections[id].length})
                          </p>
                          <ul>
                            {sections[id].map((task) => (
                              <ReportTaskRow key={task.id} task={task} today={today} collaborating={isCollaborator(task, person.id)} />
                            ))}
                          </ul>
                        </div>
                      ),
                    )
                  )}
                </div>
              ))}
            </section>
          ))}

          {report.unassigned.length > 0 && (
            <section className="space-y-2 rounded-xl border border-line bg-surface p-4">
              <h3 className="font-semibold">Unassigned ({report.unassigned.length})</h3>
              <ul>
                {report.unassigned.map((task) => (
                  <ReportTaskRow key={task.id} task={task} today={today} collaborating={false} />
                ))}
              </ul>
            </section>
          )}
        </>
      )}
    </article>
  );
}

function Stat({ label, value, danger = false }: { label: string; value: string | number; danger?: boolean }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className={`text-xl font-semibold ${danger ? 'text-danger' : ''}`}>{value}</dd>
    </div>
  );
}

function ReportTaskRow({ task, today, collaborating }: { task: Task; today: string; collaborating: boolean }) {
  const due = dueDateKey(task.dueDate);
  const overdue = isOverdue(task, today);
  return (
    <li className="py-1 text-sm">
      <div className="flex items-center gap-2">
        <TaskStatusIcon status={task.status} />
        <span className="min-w-0 flex-1 break-words">{task.title}</span>
        {collaborating && <Users role="img" aria-label="Collaborating" className="size-3.5 shrink-0 text-muted" />}
        {due && (
          <span className={`shrink-0 text-xs ${overdue ? 'font-medium text-danger' : 'text-muted'}`}>
            {overdue ? 'Overdue · ' : 'Due '}
            {formatDateKey(due)}
          </span>
        )}
      </div>
      {task.status !== 'done' && task.blocker?.trim() && (
        <p className="ml-6 text-xs whitespace-pre-line text-danger">Blocker: {task.blocker}</p>
      )}
    </li>
  );
}
