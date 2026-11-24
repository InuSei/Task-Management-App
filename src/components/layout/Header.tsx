import { Users } from 'lucide-react';
import type { ViewMode } from '@/domain/view';
import { ThemeCustomizer } from './ThemeCustomizer';
import { ViewSwitcher } from './ViewSwitcher';

interface HeaderProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
  onManageTeam: () => void;
}

export function Header({ view, onViewChange, onManageTeam }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <h1 className="text-lg font-semibold">Teampad</h1>
      <div className="flex items-center gap-2">
        <ViewSwitcher view={view} onChange={onViewChange} />
        <button
          type="button"
          onClick={onManageTeam}
          aria-label="Manage team"
          title="Manage team"
          className="rounded-md p-2 text-muted hover:bg-surface hover:text-fg"
        >
          <Users className="size-5" aria-hidden />
        </button>
        <ThemeCustomizer />
      </div>
    </header>
  );
}
