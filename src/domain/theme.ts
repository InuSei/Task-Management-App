export type ColorMode = 'dark' | 'light';
export type AccentPreset = 'indigo' | 'emerald' | 'amber' | 'rose' | 'cyan';

export interface ThemeConfig {
  mode: ColorMode;
  accent: AccentPreset;
}

export const COLOR_MODES: readonly ColorMode[] = ['dark', 'light'];
// Colour values for each preset live in globals.css ([data-accent=…]) so they apply before hydration.
export const ACCENT_PRESETS: readonly AccentPreset[] = ['indigo', 'emerald', 'amber', 'rose', 'cyan'];

export const DEFAULT_THEME: ThemeConfig = { mode: 'dark', accent: 'indigo' };
export const THEME_STORAGE_KEY = 'ptm:theme';

export function isThemeConfig(value: unknown): value is ThemeConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (COLOR_MODES as readonly unknown[]).includes(v.mode) &&
    (ACCENT_PRESETS as readonly unknown[]).includes(v.accent)
  );
}
