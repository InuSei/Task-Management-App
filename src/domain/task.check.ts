// Self-check for domain logic. Run: npm run check
import assert from 'node:assert/strict';
import { applyPatch, createTask, isBlocked, isTask, isValidTitle, newSubtask, subtaskCount } from './task.ts';
import { addDays, dueDateKey, getUrgency, groupTasks } from './taskGroups.ts';
import { buildTimeline } from './timeline.ts';
import { filterTasks } from './taskFilters.ts';

const today = '2026-11-19';
const make = (title: string, dueDate: string | null) =>
  createTask({ title, priority: 'medium', dueDate, assigneeId: null, weekLabel: 'Week 1' }, 0);

// Title validation
assert.equal(isValidTitle('   '), false);
assert.equal(isValidTitle('a'.repeat(140)), true);
assert.equal(isValidTitle('a'.repeat(141)), false);
assert.throws(() => make('  ', null));
assert.equal(make('  trimmed  ', null).title, 'trimmed');

// Grouping
const overdue = make('overdue', '2026-11-18');
const dueToday = make('today', today);
const upcoming = make('upcoming', '2026-11-25');
const noDate = make('none', null);
const doneOverdue = applyPatch(make('done', '2026-11-01'), { status: 'done' });
const groups = groupTasks([overdue, dueToday, upcoming, noDate, doneOverdue], today);
assert.deepEqual(groups.overdue, [overdue]);
assert.deepEqual(groups.today, [dueToday]);
assert.deepEqual(groups.upcoming, [upcoming]);
assert.deepEqual(groups.noDeadline, [noDate]);
assert.deepEqual(groups.completed, [doneOverdue]);

// Urgency: marking an overdue task done clears the warning
assert.equal(getUrgency(overdue, today), 'overdue');
assert.equal(getUrgency(dueToday, today), 'today');
assert.equal(getUrgency(doneOverdue, today), 'none');

// Due date normalisation
assert.equal(dueDateKey('2026-11-19'), '2026-11-19');
assert.equal(dueDateKey('not a date'), null);
assert.equal(dueDateKey(new Date(2026, 10, 19, 23, 30).toISOString()), '2026-11-19');

// Storage guard
assert.equal(isTask(overdue), true);
assert.equal(isTask({ ...overdue, status: 'bogus' }), false);
assert.equal(isTask(null), false);
assert.equal(isTask({ ...overdue, blocker: 'Waiting on vendor' }), true);
assert.equal(isTask({ ...overdue, blocker: 42 }), false);

// Blockers: only open tasks with real text count as blocked
assert.equal(isBlocked(overdue), false);
assert.equal(isBlocked(applyPatch(overdue, { blocker: '  ' })), false);
assert.equal(isBlocked(applyPatch(overdue, { blocker: 'Waiting on vendor' })), true);
assert.equal(isBlocked(applyPatch(overdue, { blocker: 'Waiting on vendor', status: 'done' })), false);

// Filters
const high = applyPatch(make('Ship release', null), { priority: 'high', description: 'notes about QA' });
assert.deepEqual(filterTasks([high, noDate], { priority: 'high', query: '' }), [high]);
assert.deepEqual(filterTasks([high, noDate], { priority: 'all', query: '  qa ' }), [high]);
assert.deepEqual(filterTasks([high, noDate], { priority: 'low', query: '' }), []);

// Date arithmetic across month/year boundaries
assert.equal(addDays('2026-12-30', 3), '2027-01-02');
assert.equal(addDays('2026-03-28', 2), '2026-03-30'); // spans EU DST change

// Timeline: overdue bucket excludes done tasks; tasks past the window are dropped
const later = make('later', '2026-12-25');
const timeline = buildTimeline([overdue, dueToday, upcoming, noDate, doneOverdue, later], today, 7);
assert.deepEqual(timeline.overdue, [overdue]);
assert.equal(timeline.days.length, 7);
assert.deepEqual(timeline.days[0], { key: today, tasks: [dueToday] });
assert.deepEqual(timeline.days[6]?.tasks, [upcoming]); // 2026-11-25
assert.equal(timeline.days.flatMap((d) => d.tasks).length, 2);

console.log('domain checks passed');

// Sub-tasks: optional, validated, counted
{
  const parent = make('parent', null);
  assert.equal(subtaskCount(parent), null);
  assert.throws(() => newSubtask('  '));
  const a = newSubtask('  first  ');
  assert.equal(a.title, 'first');
  const withSubs = applyPatch(parent, { subtasks: [{ ...a, done: true }, newSubtask('second')] });
  assert.equal(subtaskCount(withSubs), '1/2');
  assert.equal(isTask(withSubs), true);
  assert.equal(isTask({ ...withSubs, subtasks: [{ id: 'x', title: '', done: false }] }), false);
  assert.equal(isTask({ ...withSubs, subtasks: [{ id: 'x', title: 'ok', done: 'yes' }] }), false);
  assert.equal(isTask({ ...withSubs, subtasks: 'nope' }), false);
  console.log('subtask checks passed');
}
