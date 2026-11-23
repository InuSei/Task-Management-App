'use client';

import { useCallback, useEffect, useState } from 'react';
import type { SettingRepository } from '@/repositories/settingRepository';

/** A shared settings value; saves optimistically and reloads if a save fails. */
export function useSharedSetting<T>(repo: SettingRepository<T>, fallback: T) {
  const [value, setValueState] = useState<T>(fallback);
  const [failed, setFailed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      setValueState(await repo.load());
      setFailed(false);
    } catch (error) {
      console.error('[useSharedSetting] Failed to load.', error);
      setFailed(true);
    }
  }, [repo]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const setValue = useCallback(
    (next: T) => {
      setValueState(next);
      repo.save(next).catch((error: unknown) => {
        console.error('[useSharedSetting] Failed to save; reloading.', error);
        void refresh();
      });
    },
    [repo, refresh],
  );

  return { value, setValue, failed };
}
