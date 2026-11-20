import { CalendarDays, Columns3, List } from 'lucide-react';
import type { ViewMode } from '@/domain/view';
import { SegmentedControl, type SegmentOption } from '@/components/ui/SegmentedControl';

const OPTIONS: readonly SegmentOption<ViewMode>[] = [
  { value: 'list', label: 'List', Icon: List },
  { value: 'board', label: 'Board', Icon: Columns3 },
  { value: 'timeline', label: 'Timeline', Icon: CalendarDays },
];

interface ViewSwitcherProps {
  view: ViewMode;
  onChange: (view: ViewMode) => void;
}

export function ViewSwitcher({ view, onChange }: ViewSwitcherProps) {
  return <SegmentedControl label="View" value={view} options={OPTIONS} onChange={onChange} />;
}
