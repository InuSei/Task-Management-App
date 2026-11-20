// A mode is a full-page theme: background, surfaces, borders and text (values in globals.css).
export type ColorMode = 'dark' | 'dusk' | 'moss' | 'light' | 'mist';
export type AccentPreset = 'clay' | 'slate' | 'sage' | 'ochre' | 'plum';

export interface ThemeConfig {
  mode: ColorMode;
  accent: AccentPreset;
}

export const COLOR_MODES: readonly ColorMode[] = ['dark', 'dusk', 'moss', 'light', 'mist'];
// Colour values for each preset live in globals.css ([data-accent=…]) so they apply before hydration.
export const ACCENT_PRESETS: readonly AccentPreset[] = ['clay', 'slate', 'sage', 'ochre', 'plum'];

export const MODE_LABELS: Record<ColorMode, string> = {
  dark: 'Graphite',
  dusk: 'Dusk',
  moss: 'Moss',
  light: 'Paper',
  mist: 'Mist',
};

/** Accent applied when a theme is picked; the user can still change it afterwards. */
export const MODE_ACCENTS: Record<ColorMode, AccentPreset> = {
  dark: 'clay',
  dusk: 'slate',
  moss: 'sage',
  light: 'clay',
  mist: 'plum',
};

export const DEFAULT_THEME: ThemeConfig = { mode: 'dark', accent: 'clay' };
export const THEME_STORAGE_KEY = 'ptm:theme';

export function isThemeConfig(value: unknown): value is ThemeConfig {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    (COLOR_MODES as readonly unknown[]).includes(v.mode) &&
    (ACCENT_PRESETS as readonly unknown[]).includes(v.accent)
  );
}
