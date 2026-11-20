import { DEFAULT_THEME, isThemeConfig, THEME_STORAGE_KEY, type ThemeConfig } from '@/domain/theme';
import { DEFAULT_VIEW, isViewMode, VIEW_STORAGE_KEY, type ViewMode } from '@/domain/view';

function read<T>(key: string, isValid: (value: unknown) => value is T, fallback: T): T {
  const raw = localStorage.getItem(key);
  if (raw === null) return fallback;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (isValid(parsed)) return parsed;
  } catch {
    // fall through to warning
  }
  console.warn(`[preferencesStore] Ignoring invalid value in "${key}".`);
  return fallback;
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`[preferencesStore] Could not save "${key}".`, error);
  }
}

export const loadTheme = (): ThemeConfig => read(THEME_STORAGE_KEY, isThemeConfig, DEFAULT_THEME);
export const saveTheme = (theme: ThemeConfig): void => write(THEME_STORAGE_KEY, theme);
export const loadViewMode = (): ViewMode => read(VIEW_STORAGE_KEY, isViewMode, DEFAULT_VIEW);
export const saveViewMode = (view: ViewMode): void => write(VIEW_STORAGE_KEY, view);
