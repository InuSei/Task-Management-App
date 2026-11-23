'use client';

import { useCallback } from 'react';
import { applyPatch, createTask, type NewTaskInput, type Task, type TaskPatch } from '@/domain/task';
import { taskRepository } from '@/repositories/provider';
import type { TaskRepository } from '@/repositories/taskRepository';
import { useCollection } from './useCollection';

const nextOrder = (tasks: readonly Task[]) => tasks.reduce((max, t) => Math.max(max, t.order), 0) + 1;

export function useTasks(repo: TaskRepository = taskRepository) {
  const { items: tasks, loaded, create, update, remove } = useCollection(repo);

  const addTask = useCallback(
    (input: NewTaskInput) => create(createTask(input, nextOrder(tasks))),
    [tasks, create],
  );

  const updateTask = useCallback(
    (id: string, patch: TaskPatch) => {
      const current = tasks.find((t) => t.id === id);
      if (current) update(applyPatch(current, patch));
    },
    [tasks, update],
  );

  return { tasks, loaded, addTask, updateTask, deleteTask: remove };
}
