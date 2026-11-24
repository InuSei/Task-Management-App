import type { Personnel } from '@/domain/personnel';
import type { Task, TaskPatch } from '@/domain/task';
import type { ViewMode } from '@/domain/view';
import { ListView } from './ListView';
import { TimelineMonitor } from './TimelineMonitor';

interface WorkspaceViewProps {
  view: Exclude<ViewMode, 'dashboard' | 'report'>;
  totalCount: number;
  tasks: readonly Task[];
  people: readonly Personnel[];
  onUpdate: (id: string, patch: TaskPatch) => void;
  onOpen: (id: string) => void;
  onResetFilters: () => void;
}

/** Distinguishes an empty workspace from an over-filtered one (spec §5), then renders the active view. */
export function WorkspaceView({ view, totalCount, tasks, people, onUpdate, onOpen, onResetFilters }: WorkspaceViewProps) {
  if (totalCount === 0) {
    return (
      <p className="py-16 text-center text-muted">
        No tasks yet. Type in the bar above and press Enter to add your first one.
      </p>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-muted">
        <p>No tasks match your filters</p>
        <button
          type="button"
          onClick={onResetFilters}
          className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-on-accent hover:bg-accent-hover"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  switch (view) {
    case 'list':
      return <ListView tasks={tasks} people={people} onUpdate={onUpdate} onOpen={onOpen} />;
    case 'timeline':
      return <TimelineMonitor tasks={tasks} onOpen={onOpen} />;
  }
}
