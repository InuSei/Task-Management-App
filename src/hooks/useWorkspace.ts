'use client';

import type { TaskPatch } from '@/domain/task';
import { renameWeek } from '@/domain/week';
import { usePersonnel } from './usePersonnel';
import { useTasks } from './useTasks';
import { useWeeks } from './useWeeks';

/** Tasks, personnel and weeks, plus the rules that span them. */
export function useWorkspace() {
  const { tasks, loaded: tasksLoaded, failed: tasksFailed, addTask, updateTask: patchTask, deleteTask } = useTasks();
  const { people, loaded: peopleLoaded, failed: peopleFailed, addPerson, updatePerson, removePerson } = usePersonnel();
  const { weeks, setWeeks, failed: weeksFailed } = useWeeks();

  // Allocating a task with no week puts it in the active week (spec §8.2).
  function updateTask(id: string, patch: TaskPatch) {
    const task = tasks.find((t) => t.id === id);
    const needsWeek = patch.assigneeId && !task?.weekLabel && patch.weekLabel === undefined;
    patchTask(id, needsWeek ? { ...patch, weekLabel: weeks.activeWeekLabel } : patch);
  }

  // Removing a person unassigns their tasks rather than deleting them (spec §8.4).
  function removePersonAndUnassign(id: string) {
    for (const task of tasks) if (task.assigneeId === id) patchTask(task.id, { assigneeId: null });
    removePerson(id);
  }

  /** Renames the active week and relabels its tasks; false when the label is empty or taken. */
  function renameActiveWeek(label: string): boolean {
    const from = weeks.activeWeekLabel;
    const next = renameWeek(weeks, from, label);
    if (!next) return false;
    const to = next.activeWeekLabel;
    if (to !== from) for (const task of tasks) if (task.weekLabel === from) patchTask(task.id, { weekLabel: to });
    setWeeks(next);
    return true;
  }

  return {
    loaded: tasksLoaded && peopleLoaded,
    loadFailed: tasksFailed || peopleFailed || weeksFailed,
    tasks, addTask, updateTask, deleteTask,
    people, addPerson, updatePerson, removePerson: removePersonAndUnassign,
    weeks, setWeeks, renameActiveWeek,
  };
}
