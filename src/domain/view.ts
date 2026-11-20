export type ViewMode = 'list' | 'board' | 'timeline';

export const VIEW_MODES: readonly ViewMode[] = ['list', 'board', 'timeline'];
export const DEFAULT_VIEW: ViewMode = 'list';
export const VIEW_STORAGE_KEY = 'ptm:view';

export function isViewMode(value: unknown): value is ViewMode {
  return (VIEW_MODES as readonly unknown[]).includes(value);
}
