'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_WEEKS, type WeekContext } from '@/domain/week';
import { loadWeeks, saveWeeks } from '@/repositories/preferencesStore';

/** Week labels and the active week, persisted across visits. */
export function useWeeks() {
  const [weeks, setWeeksState] = useState<WeekContext>(DEFAULT_WEEKS);

  useEffect(() => setWeeksState(loadWeeks()), []);

  const setWeeks = useCallback((next: WeekContext) => {
    saveWeeks(next);
    setWeeksState(next);
  }, []);

  return [weeks, setWeeks] as const;
}
