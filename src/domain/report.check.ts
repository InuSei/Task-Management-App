// Self-check for the weekly report. Run: npm run check
import assert from 'node:assert/strict';
import { createPersonnel } from './personnel.ts';
import { applyPatch, createTask } from './task.ts';
import { buildWeeklyReport, NO_DEPARTMENT, sectionOf } from './report.ts';

const today = '2026-11-20';
const ana = createPersonnel({ name: 'Ana', department: 'IT' });
const ben = createPersonnel({ name: 'Ben', department: 'Ops' });
const cy = createPersonnel({ name: 'Cy', department: '' });
const make = (title: string, assigneeId: string | null, weekLabel = 'Week 1', dueDate: string | null = null) =>
  createTask({ title, priority: 'medium', dueDate, assigneeId, weekLabel }, 0);

const done = applyPatch(make('done', ana.id), { status: 'done', blocker: 'old blocker' });
const blocked = applyPatch(make('blocked', ana.id), { status: 'in_progress', blocker: 'waiting on vendor' });
const working = applyPatch(make('working', ben.id, 'Week 1', '2026-11-18'), { status: 'in_progress', collaboratorIds: [ana.id] });
const notStarted = make('todo', cy.id);
const orphan = make('orphan', 'removed-person');
const nobody = make('nobody', null);
const otherWeek = make('other week', ana.id, 'Week 2');

// Sections: done beats a stale blocker; blocker beats in-progress
assert.equal(sectionOf(done), 'done');
assert.equal(sectionOf(blocked), 'blocked');
assert.equal(sectionOf(working), 'inProgress');
assert.equal(sectionOf(notStarted), 'todo');

const report = buildWeeklyReport([done, blocked, working, notStarted, orphan, nobody, otherWeek], [ana, ben, cy], 'Week 1', today);

// Only the chosen week; departments sorted, people without one last
assert.deepEqual(report.departments.map((d) => d.department), ['IT', 'Ops', NO_DEPARTMENT]);
assert.deepEqual(report.counts, { done: 1, blocked: 1, inProgress: 1, todo: 3, overdue: 1 });
assert.equal(report.progress, 17); // 1 of 6

// Ana: own tasks plus the one she collaborates on
const anaReport = report.departments[0]!.people[0]!;
assert.deepEqual(anaReport.sections.done, [done]);
assert.deepEqual(anaReport.sections.blocked, [blocked]);
assert.deepEqual(anaReport.sections.inProgress, [working]);
assert.equal(anaReport.progress, 33);
assert.equal(report.departments[0]!.progress, 33);

// Tasks without a current owner still appear
assert.deepEqual(report.unassigned, [orphan, nobody]);

// Empty week: no division by zero
const empty = buildWeeklyReport([], [], 'Week 1', today);
assert.deepEqual(empty.departments, []);
assert.equal(empty.progress, 0);

console.log('report checks passed');
