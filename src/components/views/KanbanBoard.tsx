'use client';

import { useEffect, useRef } from 'react';
import { groupByStatus, moveTask, placeTask, type MoveDirection } from '@/domain/board';
import { STATUS_LABELS, TASK_STATUSES, type Task, type TaskPatch, type TaskStatus } from '@/domain/task';
import { toDateKey } from '@/domain/taskGroups';
import { TaskCard } from '@/components/tasks/TaskCard';
import { KanbanColumn } from './KanbanColumn';

interface KanbanBoardProps {
  tasks: readonly Task[];
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpen: (id: string) => void;
}

export function KanbanBoard({ tasks, onUpdate, onOpen }: KanbanBoardProps) {
  const columns = groupByStatus(tasks);
  const today = toDateKey(new Date());
  const lastMove = useRef<{ id: string; direction: MoveDirection } | null>(null);

  // A moved card re-renders elsewhere and loses focus; put focus back on it so keyboard moves can chain.
  useEffect(() => {
    if (!lastMove.current) return;
    const { id, direction } = lastMove.current;
    lastMove.current = null;
    const card = document.querySelector(`[data-task-id="${CSS.escape(id)}"]`);
    const sameButton = card?.querySelector<HTMLButtonElement>(`[data-move="${direction}"]:not(:disabled)`);
    (sameButton ?? card?.querySelector<HTMLButtonElement>('[data-card-open]'))?.focus();
  });

  function handleMove(task: Task, direction: MoveDirection) {
    const patch = moveTask(columns, task, direction);
    if (!patch) return;
    lastMove.current = { id: task.id, direction };
    onUpdate(task.id, patch);
  }

  function handleDrop(status: TaskStatus, taskId: string, index: number) {
    if (tasks.some((t) => t.id === taskId)) onUpdate(taskId, placeTask(columns, taskId, status, index));
  }

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {TASK_STATUSES.map((status, columnIndex) => (
        <KanbanColumn
          key={status}
          title={STATUS_LABELS[status]}
          count={columns[status].length}
          onDropTask={(taskId, index) => handleDrop(status, taskId, index)}
        >
          {columns[status].map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              today={today}
              onOpen={onOpen}
              onMove={handleMove}
              canMove={{
                left: columnIndex > 0,
                right: columnIndex < TASK_STATUSES.length - 1,
                up: index > 0,
                down: index < columns[status].length - 1,
              }}
            />
          ))}
        </KanbanColumn>
      ))}
    </div>
  );
}
