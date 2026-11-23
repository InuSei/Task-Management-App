import { Circle, CircleCheck, CircleDot, type LucideIcon } from 'lucide-react';
import { STATUS_LABELS, type TaskStatus } from '@/domain/task';

const ICONS: Record<TaskStatus, { Icon: LucideIcon; className: string }> = {
  todo: { Icon: Circle, className: 'text-muted' },
  in_progress: { Icon: CircleDot, className: 'text-accent' },
  done: { Icon: CircleCheck, className: 'text-success' },
};

export function TaskStatusIcon({ status }: { status: TaskStatus }) {
  const { Icon, className } = ICONS[status];
  return <Icon role="img" aria-label={STATUS_LABELS[status]} className={`size-4 shrink-0 ${className}`} />;
}
