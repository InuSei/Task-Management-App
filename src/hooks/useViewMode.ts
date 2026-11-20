'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_VIEW, type ViewMode } from '@/domain/view';
import { loadViewMode, saveViewMode } from '@/repositories/preferencesStore';

/** Last-selected workspace view, persisted across visits. */
export function useViewMode() {
  const [view, setViewState] = useState<ViewMode>(DEFAULT_VIEW);

  useEffect(() => setViewState(loadViewMode()), []);

  const setView = useCallback((next: ViewMode) => {
    saveViewMode(next);
    setViewState(next);
  }, []);

  return [view, setView] as const;
}
