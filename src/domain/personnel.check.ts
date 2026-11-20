// Self-check for personnel, week and dashboard logic. Run: npm run check
import assert from 'node:assert/strict';
import { applyPatch, createTask, isTask } from './task.ts';
import { applyPersonnelPatch, createPersonnel, departmentsOf, isPersonnel, isValidName } from './personnel.ts';
import { addWeek, DEFAULT_WEEKS, isWeekContext, renameWeek } from './week.ts';
import { progressPercent, tasksForPerson } from './dashboard.ts';

// Personnel validation
assert.equal(isValidName('  '), false);
assert.equal(isValidName('a'.repeat(80)), true);
assert.equal(isValidName('a'.repeat(81)), false);
assert.throws(() => createPersonnel({ name: ' ', department: 'IT' }));
const ana = createPersonnel({ name: '  Ana ', department: ' IT ' });
assert.equal(ana.name, 'Ana');
assert.equal(ana.department, 'IT');
assert.equal(isPersonnel(ana), true);
assert.equal(isPersonnel({ ...ana, name: 1 }), false);
assert.throws(() => applyPersonnelPatch(ana, { name: '' }));
assert.equal(applyPersonnelPatch(ana, { department: ' Ops ' }).department, 'Ops');
const ben = createPersonnel({ name: 'Ben', department: 'Ops' });
const cy = createPersonnel({ name: 'Cy', department: '' });
assert.deepEqual(departmentsOf([ben, ana, cy, ben]), ['IT', 'Ops']);

// Task allocation fields + storage guard (legacy tasks without the new fields stay valid)
const make = (title: string, dueDate: string | null, assigneeId: string | null) =>
  createTask({ title, priority: 'medium', dueDate, assigneeId, weekLabel: 'Week 1' }, 0);
const t1 = make('later', '2026-12-01', ana.id);
const t2 = applyPatch(make('done', '2026-11-01', ana.id), { status: 'done' });
const t3 = make('soon', '2026-11-21', ana.id);
const t4 = make('undated', null, ana.id);
const other = make('other', null, ben.id);
assert.equal(t1.weekLabel, 'Week 1');
assert.equal(isTask(t1), true);
const { assigneeId: _a, weekLabel: _w, ...legacy } = t1;
assert.equal(isTask(legacy), true);
assert.equal(isTask({ ...t1, assigneeId: 5 }), false);

// Dashboard: open tasks by deadline, undated after dated, done last
assert.deepEqual(tasksForPerson([t2, t4, t1, other, t3], ana.id), [t3, t1, t4, t2]);
assert.deepEqual(tasksForPerson([t1], cy.id), []);

// Progress: 0% with no tasks (no division by zero), rounded otherwise
assert.equal(progressPercent([]), 0);
assert.equal(progressPercent([t1, t2, t3]), 33);
assert.equal(progressPercent([t2]), 100);

// Weeks
const two = addWeek(DEFAULT_WEEKS);
assert.deepEqual(two, { activeWeekLabel: 'Week 2', availableWeeks: ['Week 1', 'Week 2'] });
assert.equal(addWeek({ activeWeekLabel: 'Week 2', availableWeeks: ['Week 2'] }).activeWeekLabel, 'Week 3');
assert.deepEqual(renameWeek(two, 'Week 2', ' Sprint A '), {
  activeWeekLabel: 'Sprint A',
  availableWeeks: ['Week 1', 'Sprint A'],
});
assert.equal(renameWeek(two, 'Week 2', 'Week 1'), null); // duplicate
assert.equal(renameWeek(two, 'Week 2', '  '), null); // empty
assert.deepEqual(renameWeek(two, 'Week 2', 'Week 2'), two); // unchanged is fine
assert.equal(isWeekContext(two), true);
assert.equal(isWeekContext({ activeWeekLabel: 'Week 9', availableWeeks: ['Week 1'] }), false);

console.log('personnel checks passed');
