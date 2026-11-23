'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_WEEKS, type WeekContext } from '@/domain/week';
import { weekRepository } from '@/repositories/provider';
import type { WeekRepository } from '@/repositories/weekRepository';

/** Shared week labels and the active week; saves optimistically and reloads if a save fails. */
export function useWeeks(repo: WeekRepository = weekRepository) {
  const [weeks, setWeeksState] = useState<WeekContext>(DEFAULT_WEEKS);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setWeeksState(await repo.load());
      setFailed(false);
    } catch (error) {
      console.error('[useWeeks] Failed to load weeks.', error);
      setFailed(true);
    }
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setWeeks = useCallback(
    (next: WeekContext) => {
      setWeeksState(next);
      repo.save(next).catch((error: unknown) => {
        console.error('[useWeeks] Failed to save weeks; reloading.', error);
        void refresh();
      });
    },
    [repo, refresh],
  );

  return { weeks, setWeeks, failed };
}
