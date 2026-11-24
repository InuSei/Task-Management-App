import { CalendarDays, FileText, LayoutDashboard, List } from 'lucide-react';
import type { ViewMode } from '@/domain/view';
import { SegmentedControl, type SegmentOption } from '@/components/ui/SegmentedControl';

const OPTIONS: readonly SegmentOption<ViewMode>[] = [
  { value: 'list', label: 'List', Icon: List },
  { value: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { value: 'timeline', label: 'Timeline', Icon: CalendarDays },
  { value: 'report', label: 'Report', Icon: FileText },
];

interface ViewSwitcherProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return <SegmentedControl label="View" value={view} options={OPTIONS} onChange={onChange} />;
}
