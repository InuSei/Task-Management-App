import type { DragEvent } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, type LucideIcon } from 'lucide-react';
import type { MoveDirection } from '@/domain/board';
import type { Task } from '@/domain/task';
import { PriorityBadge, UrgencyBadge } from './TaskBadges';

const MOVES: readonly { direction: MoveDirection; Icon: LucideIcon }[] = [
  { direction: 'left', Icon: ChevronLeft },
  { direction: 'up', Icon: ChevronUp },
  { direction: 'down', Icon: ChevronDown },
  { direction: 'right', Icon: ChevronRight },
];

interface TaskCardProps {
  task: Task;
  today: string;
  canMove: Record<MoveDirection, boolean>;
  onMove: (task: Task, direction: MoveDirection) => void;
  onOpen: (id: string) => void;
}

export function TaskCard({ task, today, canMove, onMove, onOpen }: TaskCardProps) {
  const done = task.status === 'done';

  function handleDragStart(event: DragEvent<HTMLLIElement>) {
    event.dataTransfer.setData('text/plain', task.id);
    event.dataTransfer.effectAllowed = 'move';
  }

  return (
    <li
      data-task-id={task.id}
      draggable
      onDragStart={handleDragStart}
      className="cursor-grab rounded-lg border border-line bg-canvas p-3 active:cursor-grabbing"
    >
      <button
        type="button"
        data-card-open
        onClick={() => onOpen(task.id)}
        title={task.title}
        className={`block w-full truncate text-left text-sm font-medium ${done ? 'text-muted line-through' : ''}`}
      >
        {task.title}
      </button>
      <div className="mt-2 flex items-center gap-1.5">
        <UrgencyBadge task={task} today={today} />
        <PriorityBadge task={task} />
        {/* Accessible alternative to drag-and-drop (spec §4.2). */}
        <span className="ml-auto flex">
          {MOVES.map(({ direction, Icon }) => (
            <button
              key={direction}
              type="button"
              data-move={direction}
              disabled={!canMove[direction]}
              onClick={() => onMove(task, direction)}
              aria-label={`Move "${task.title}" ${direction}`}
              className="rounded p-0.5 text-muted hover:bg-line hover:text-fg disabled:invisible"
            >
              <Icon className="size-4" aria-hidden />
            </button>
          ))}
        </span>
      </div>
    </li>
  );
}
