import { PRIORITY_LABELS, type Task } from '@/domain/task';
import { getUrgency } from '@/domain/taskGroups';
import { Badge } from '@/components/ui/Badge';

export function UrgencyBadge({ task, today }: { task: Task; today: string }) {
  const urgency = getUrgency(task, today);
  if (urgency === 'overdue') return <Badge tone="danger">Overdue</Badge>;
  if (urgency === 'today') return <Badge tone="warning">Today</Badge>;
  return null;
}

export function PriorityBadge({ task }: { task: Task }) {
  return (
    <Badge tone={task.priority === 'high' ? 'accent' : 'neutral'}>
      {PRIORITY_LABELS[task.priority]}
    </Badge>
  );
}
