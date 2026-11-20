import type { Task, TaskPatch } from '@/domain/task';
import { groupTasks, TASK_GROUPS, toDateKey } from '@/domain/taskGroups';
import { TaskListItem } from '@/components/tasks/TaskListItem';
import { TaskGroupSection } from './TaskGroupSection';

interface ListViewProps {
  tasks: readonly Task[];
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpen: (id: string) => void;
}

export function ListView({ tasks, onUpdate, onOpen }: ListViewProps) {
  const today = toDateKey(new Date());
  const groups = groupTasks(tasks, today);
  const toggleDone = (task: Task) =>
    onUpdate(task.id, { status: task.status === 'done' ? 'todo' : 'done' });

  return (
    <div className="space-y-4">
      {TASK_GROUPS.filter(({ id }) => groups[id].length > 0).map(({ id, label }) => (
        <TaskGroupSection key={id} label={label} count={groups[id].length}>
          {groups[id].map((task) => (
            <TaskListItem
              key={task.id}
              task={task}
              today={today}
              onToggleDone={toggleDone}
              onOpen={onOpen}
            />
          ))}
        </TaskGroupSection>
      ))}
    </div>
  );
}
