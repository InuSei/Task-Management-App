'use client';

import { useState } from 'react';
import { DEFAULT_FILTERS, filterTasks } from '@/domain/taskFilters';
import { useTasks } from '@/hooks/useTasks';
import { useViewMode } from '@/hooks/useViewMode';
import { Header } from '@/components/layout/Header';
import { FilterBar } from '@/components/tasks/FilterBar';
import { QuickAddBar } from '@/components/tasks/QuickAddBar';
import { TaskDrawer } from '@/components/tasks/TaskDrawer';
import { WorkspaceView } from '@/components/views/WorkspaceView';

export default function WorkspacePage() {
  const { tasks, loaded, addTask, updateTask, deleteTask } = useTasks();
  const [view, setView] = useViewMode();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = tasks.find((t) => t.id === selectedId) ?? null;

  function handleDelete(id: string) {
    deleteTask(id);
    setSelectedId(null);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-5xl">
      <Header view={view} onViewChange={setView} />
      <QuickAddBar onAdd={addTask} />
      <FilterBar filters={filters} onChange={setFilters} />
      <div className="p-4">
        {loaded && (
          <WorkspaceView
            view={view}
            totalCount={tasks.length}
            tasks={filterTasks(tasks, filters)}
            onUpdate={updateTask}
            onOpen={setSelectedId}
            onResetFilters={() => setFilters(DEFAULT_FILTERS)}
          />
        )}
      </div>
      <TaskDrawer
        task={selected}
        onClose={() => setSelectedId(null)}
        onUpdate={updateTask}
        onDelete={handleDelete}
      />
    </main>
  );
}
