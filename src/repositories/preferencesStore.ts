import { DEFAULT_THEME, isThemeConfig, THEME_STORAGE_KEY, type ThemeConfig } from '@/domain/theme';
import { DEFAULT_VIEW, isViewMode, VIEW_STORAGE_KEY, type ViewMode } from '@/domain/view';
import { DEFAULT_WEEKS, isWeekContext, WEEKS_STORAGE_KEY, type WeekContext } from '@/domain/week';
import {
  DEFAULT_DEPARTMENT_COLORS, DEPARTMENT_COLORS_STORAGE_KEY, isDepartmentColors, type DepartmentColors,
} from '@/domain/roleColor';

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
export const loadWeeks = (): WeekContext => read(WEEKS_STORAGE_KEY, isWeekContext, DEFAULT_WEEKS);
export const saveWeeks = (weeks: WeekContext): void => write(WEEKS_STORAGE_KEY, weeks);
export const loadDepartmentColors = (): DepartmentColors =>
  read(DEPARTMENT_COLORS_STORAGE_KEY, isDepartmentColors, DEFAULT_DEPARTMENT_COLORS);
export const saveDepartmentColors = (colors: DepartmentColors): void => write(DEPARTMENT_COLORS_STORAGE_KEY, colors);
