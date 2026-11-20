'use client';

import { useState, type DragEvent, type ReactNode } from 'react';

interface KanbanColumnProps {
  title: string;
  count: number;
  onDropTask: (taskId: string, index: number) => void;
  children: ReactNode;
}

/** Drop position = number of other cards whose vertical midpoint is above the pointer. */
function dropIndex(list: HTMLElement, clientY: number, draggedId: string): number {
  const cards = Array.from(list.querySelectorAll<HTMLElement>('[data-task-id]')).filter(
    (card) => card.dataset.taskId !== draggedId,
  );
  const index = cards.findIndex((card) => {
    const rect = card.getBoundingClientRect();
    return clientY < rect.top + rect.height / 2;
  });
  return index === -1 ? cards.length : index;
}

export function KanbanColumn({ title, count, onDropTask, children }: KanbanColumnProps) {
  const [isOver, setIsOver] = useState(false);

  function handleDragOver(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    setIsOver(true);
  }

  function handleDragLeave(event: DragEvent<HTMLElement>) {
    const next = event.relatedTarget;
    if (!(next instanceof Node) || !event.currentTarget.contains(next)) setIsOver(false);
  }

  function handleDrop(event: DragEvent<HTMLElement>) {
    event.preventDefault();
    setIsOver(false);
    const taskId = event.dataTransfer.getData('text/plain');
    const list = event.currentTarget.querySelector('ul');
    if (taskId && list) onDropTask(taskId, dropIndex(list, event.clientY, taskId));
  }

  return (
    <section
      aria-label={`${title} column`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex min-h-48 flex-col rounded-xl border bg-surface p-3 ${isOver ? 'border-accent' : 'border-line'}`}
    >
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
        {title}
        <span className="rounded-full bg-line px-2 text-xs font-normal text-muted">{count}</span>
      </h2>
      <ul className="flex flex-1 flex-col gap-2">{children}</ul>
    </section>
  );
}
