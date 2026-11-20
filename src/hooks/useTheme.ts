'use client';

import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_THEME, type ThemeConfig } from '@/domain/theme';
import { loadTheme, saveTheme } from '@/repositories/preferencesStore';

/** Theme state. Colours come from CSS keyed on <html data-mode/data-accent>, so applying = setting those. */
export function useTheme() {
  const [theme, setThemeState] = useState<ThemeConfig>(DEFAULT_THEME);

  // The pre-paint script already applied the stored theme; this just syncs React state to it.
  useEffect(() => setThemeState(loadTheme()), []);

  const setTheme = useCallback((next: ThemeConfig) => {
    document.documentElement.dataset.mode = next.mode;
    document.documentElement.dataset.accent = next.accent;
    saveTheme(next);
    setThemeState(next);
  }, []);

  return [theme, setTheme] as const;
}
