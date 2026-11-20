'use client';

import { useCallback, useEffect, useState } from 'react';
import { applyPatch, createTask, type NewTaskInput, type Task, type TaskPatch } from '@/domain/task';
import { taskRepository } from '@/repositories/provider';
import type { TaskRepository } from '@/repositories/taskRepository';

const nextOrder = (tasks: readonly Task[]) => tasks.reduce((max, t) => Math.max(max, t.order), 0) + 1;

/** Task state with optimistic updates; on a failed write, state is reloaded from the repository. */
export function useTasks(repo: TaskRepository = taskRepository) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setTasks(await repo.list());
    setLoaded(true);
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const run = useCallback(
    (optimistic: (prev: Task[]) => Task[], persist: () => Promise<void>) => {
      setTasks(optimistic);
      persist().catch((error: unknown) => {
        console.error('[useTasks] Failed to save change; reloading.', error);
        void refresh();
      });
    },
    [refresh],
  );

  const addTask = useCallback(
    (input: NewTaskInput) => {
      const task = createTask(input, nextOrder(tasks));
      run((prev) => [...prev, task], () => repo.create(task));
    },
    [tasks, run, repo],
  );

  const updateTask = useCallback(
    (id: string, patch: TaskPatch) => {
      const current = tasks.find((t) => t.id === id);
      if (!current) return;
      const next = applyPatch(current, patch);
      run((prev) => prev.map((t) => (t.id === id ? next : t)), () => repo.update(next));
    },
    [tasks, run, repo],
  );

  const deleteTask = useCallback(
    (id: string) => run((prev) => prev.filter((t) => t.id !== id), () => repo.remove(id)),
    [run, repo],
  );

  return { tasks, loaded, addTask, updateTask, deleteTask };
}
