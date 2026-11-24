import { progressPercent, tasksForPerson } from './dashboard.ts';
import { departmentsOf, type Personnel } from './personnel.ts';
import { isBlocked, type Task } from './task.ts';
import { isOverdue } from './taskGroups.ts';

export type ReportSection = 'done' | 'blocked' | 'inProgress' | 'todo';

export const REPORT_SECTIONS: readonly { id: ReportSection; label: string }[] = [
  { id: 'done', label: 'Done' },
  { id: 'blocked', label: 'Blocked' },
  { id: 'inProgress', label: 'In progress' },
  { id: 'todo', label: 'Not started' },
];

export const NO_DEPARTMENT = 'No department';

export interface PersonReport {
  person: Personnel;
  sections: Record<ReportSection, Task[]>;
  progress: number;
}

export interface DepartmentReport {
  department: string;
  people: PersonReport[];
  progress: number;
}

export interface WeeklyReport {
  departments: DepartmentReport[];
  /** No owner, or the owner was removed from the team; listed so nothing drops out of the report. */
  unassigned: Task[];
  counts: Record<ReportSection | 'overdue', number>;
  progress: number;
}

/** Each task lands in exactly one section; a blocker only counts while the task is unfinished. */
export function sectionOf(task: Task): ReportSection {
  if (task.status === 'done') return 'done';
  if (isBlocked(task)) return 'blocked';
  return task.status === 'in_progress' ? 'inProgress' : 'todo';
}

function bySection(tasks: readonly Task[]): Record<ReportSection, Task[]> {
  const sections: Record<ReportSection, Task[]> = { done: [], blocked: [], inProgress: [], todo: [] };
  for (const task of tasks) sections[sectionOf(task)].push(task);
  return sections;
}

/** Everything done, blocked and pending in one week, grouped by department then person. */
export function buildWeeklyReport(
  tasks: readonly Task[],
  people: readonly Personnel[],
  weekLabel: string,
  today: string,
): WeeklyReport {
  const weekTasks = tasks.filter((t) => t.weekLabel === weekLabel);
  const teamIds = new Set(people.map((p) => p.id));
  const departments = departmentsOf(people);
  if (people.some((p) => !p.department)) departments.push(NO_DEPARTMENT);

  const sections = bySection(weekTasks);
  return {
    departments: departments.map((department) => {
      const members = people.filter((p) => (p.department || NO_DEPARTMENT) === department);
      const memberIds = new Set(members.map((m) => m.id));
      const reports = members.map((person) => {
        const own = tasksForPerson(weekTasks, person.id);
        return { person, sections: bySection(own), progress: progressPercent(own) };
      });
      const shared = weekTasks.filter(
        (t) => memberIds.has(t.assigneeId ?? '') || (t.collaboratorIds ?? []).some((id) => memberIds.has(id)),
      );
      return { department, people: reports, progress: progressPercent(shared) };
    }),
    unassigned: weekTasks.filter((t) => !t.assigneeId || !teamIds.has(t.assigneeId)),
    counts: {
      done: sections.done.length,
      blocked: sections.blocked.length,
      inProgress: sections.inProgress.length,
      todo: sections.todo.length,
      overdue: weekTasks.filter((t) => isOverdue(t, today)).length,
    },
    progress: progressPercent(weekTasks),
  };
}
