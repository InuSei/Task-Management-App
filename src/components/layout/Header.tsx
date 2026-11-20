import type { ViewMode } from '@/domain/view';
import { ThemeCustomizer } from './ThemeCustomizer';
import { ViewSwitcher } from './ViewSwitcher';

interface HeaderProps {
  view: ViewMode;
  onViewChange: (view: ViewMode) => void;
}

export function Header({ view, onViewChange }: HeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
      <h1 className="text-lg font-semibold">Tasks</h1>
      <div className="flex items-center gap-2">
        <ViewSwitcher view={view} onChange={onViewChange} />
        <ThemeCustomizer />
      </div>
    </header>
  );
}
