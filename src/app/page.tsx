'use client';

import { useState } from 'react';
import { DEFAULT_FILTERS, filterTasks } from '@/domain/taskFilters';
import { useViewMode } from '@/hooks/useViewMode';
import { useWorkspace } from '@/hooks/useWorkspace';
import { Header } from '@/components/layout/Header';
import { NoTeamPrompt } from '@/components/personnel/NoTeamPrompt';
import { TeamDialog } from '@/components/personnel/TeamDialog';
import { FilterBar } from '@/components/tasks/FilterBar';
import { QuickAddBar } from '@/components/tasks/QuickAddBar';
import { TaskDrawer } from '@/components/tasks/TaskDrawer';
import { PersonnelDashboard } from '@/components/views/PersonnelDashboard';
import { WeeklyReport } from '@/components/views/WeeklyReport';
import { WorkspaceView } from '@/components/views/WorkspaceView';

export default function WorkspacePage() {
  const ws = useWorkspace();
  const [view, setView] = useViewMode();
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [teamOpen, setTeamOpen] = useState(false);
  const selected = ws.tasks.find((t) => t.id === selectedId) ?? null;
  const visible = filterTasks(ws.tasks, filters);
  const openTeam = () => setTeamOpen(true);

  function handleDelete(id: string) {
    ws.deleteTask(id);
    setSelectedId(null);
  }

  return (
    <main className="mx-auto min-h-dvh max-w-5xl">
      <Header view={view} onViewChange={setView} onManageTeam={openTeam} />
      {/* The report always covers every task in the week, so filters would only mislead there. */}
      {view !== 'report' && (
        <>
          <QuickAddBar people={ws.people} weeks={ws.weeks} onAdd={ws.addTask} />
          <FilterBar filters={filters} onChange={setFilters} />
        </>
      )}
      {ws.loadFailed && (
        <p role="alert" className="m-4 rounded-xl border border-danger/40 bg-danger/10 p-4 text-sm text-danger">
          Couldn&apos;t reach the shared database, so changes may not be saved. Check the server&apos;s MongoDB
          settings, then reload the page.
        </p>
      )}
      {ws.loaded && !ws.loadFailed && (
        <div className="space-y-4 p-4">
          {view === 'report' ? (
            <WeeklyReport people={ws.people} tasks={ws.tasks} weeks={ws.weeks} departmentColors={ws.departmentColors} />
          ) : view === 'dashboard' ? (
            <PersonnelDashboard
              people={ws.people}
              tasks={visible}
              weeks={ws.weeks}
              departmentColors={ws.departmentColors}
              onWeeksChange={ws.setWeeks}
              onRenameWeek={ws.renameActiveWeek}
              onUpdate={ws.updateTask}
              onOpenTask={setSelectedId}
              onManageTeam={openTeam}
            />
          ) : (
            <>
              {ws.people.length === 0 && <NoTeamPrompt onManageTeam={openTeam} />}
              <WorkspaceView
                view={view}
                totalCount={ws.tasks.length}
                tasks={visible}
                people={ws.people}
                onUpdate={ws.updateTask}
                onOpen={setSelectedId}
                onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              />
            </>
          )}
        </div>
      )}
      <TaskDrawer
        task={selected}
        people={ws.people}
        weeks={ws.weeks.availableWeeks}
        onClose={() => setSelectedId(null)}
        onUpdate={ws.updateTask}
        onDelete={handleDelete}
      />
      <TeamDialog
        open={teamOpen}
        people={ws.people}
        colors={ws.departmentColors}
        onColorsChange={ws.setDepartmentColors}
        onClose={() => setTeamOpen(false)}
        onAdd={ws.addPerson}
        onUpdate={ws.updatePerson}
        onRemove={ws.removePerson}
      />
    </main>
  );
}
