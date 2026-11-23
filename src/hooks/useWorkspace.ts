'use client';

import type { TaskPatch } from '@/domain/task';
import { DEFAULT_DEPARTMENT_COLORS } from '@/domain/roleColor';
import { DEFAULT_WEEKS, renameWeek } from '@/domain/week';
import { departmentColorRepository, weekRepository } from '@/repositories/provider';
import { usePersonnel } from './usePersonnel';
import { useTasks } from './useTasks';
import { useSharedSetting } from './useSharedSetting';

/** Tasks, personnel and weeks, plus the rules that span them. */
export function useWorkspace() {
  const { tasks, loaded: tasksLoaded, failed: tasksFailed, addTask, updateTask: patchTask, deleteTask } = useTasks();
  const { people, loaded: peopleLoaded, failed: peopleFailed, addPerson, updatePerson, removePerson } = usePersonnel();
  const { value: weeks, setValue: setWeeks, failed: weeksFailed } = useSharedSetting(weekRepository, DEFAULT_WEEKS);
  const {
    value: departmentColors, setValue: setDepartmentColors, failed: colorsFailed,
  } = useSharedSetting(departmentColorRepository, DEFAULT_DEPARTMENT_COLORS);

  // Allocating a task with no week puts it in the active week (spec §8.2).
  function updateTask(id: string, patch: TaskPatch) {
    const task = tasks.find((t) => t.id === id);
    const allocating = Boolean(patch.assigneeId) || (patch.collaboratorIds?.length ?? 0) > 0;
    const needsWeek = allocating && !task?.weekLabel && patch.weekLabel === undefined;
    patchTask(id, needsWeek ? { ...patch, weekLabel: weeks.activeWeekLabel } : patch);
  }

  // Removing a person unassigns their tasks rather than deleting them (spec §8.4), and drops them as a collaborator.
  function removePersonAndUnassign(id: string) {
    for (const task of tasks) {
      const collaborating = task.collaboratorIds?.includes(id) ?? false;
      if (task.assigneeId !== id && !collaborating) continue;
      patchTask(task.id, {
        ...(task.assigneeId === id && { assigneeId: null }),
        ...(collaborating && { collaboratorIds: task.collaboratorIds?.filter((c) => c !== id) }),
      });
    }
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
    loadFailed: tasksFailed || peopleFailed || weeksFailed || colorsFailed,
    tasks, addTask, updateTask, deleteTask,
    people, addPerson, updatePerson, removePerson: removePersonAndUnassign,
    weeks, setWeeks, renameActiveWeek,
    departmentColors, setDepartmentColors,
  };
}
