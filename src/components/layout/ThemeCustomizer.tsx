'use client';

import { useId } from 'react';
import { Moon, Palette, Sun } from 'lucide-react';
import { ACCENT_PRESETS, COLOR_MODES } from '@/domain/theme';
import { useTheme } from '@/hooks/useTheme';

const optionClass =
  'flex items-center justify-center gap-1.5 rounded-md border px-2 py-1.5 text-sm capitalize';

/** Native popover: light-dismiss, Escape and top-layer stacking come from the browser. */
export function ThemeCustomizer() {
  const [theme, setTheme] = useTheme();
  const popoverId = useId();

  return (
    <>
      <button
        type="button"
        popoverTarget={popoverId}
        aria-label="Customize theme"
        className="rounded-md p-2 text-muted hover:bg-surface hover:text-fg"
      >
        <Palette className="size-5" aria-hidden />
      </button>
      <div
        id={popoverId}
        popover="auto"
        className="fixed inset-auto top-14 right-4 m-0 w-64 rounded-lg border border-line bg-surface p-4 text-fg shadow-xl"
      >
        <p className="mb-2 text-sm text-muted">Mode</p>
        <div role="group" aria-label="Color mode" className="grid grid-cols-2 gap-2">
          {COLOR_MODES.map((mode) => (
            <button
              key={mode}
              type="button"
              aria-pressed={theme.mode === mode}
              onClick={() => setTheme({ ...theme, mode })}
              className={`${optionClass} ${theme.mode === mode ? 'border-accent text-accent' : 'border-line'}`}
            >
              {mode === 'dark' ? <Moon className="size-4" aria-hidden /> : <Sun className="size-4" aria-hidden />}
              {mode}
            </button>
          ))}
        </div>
        <p className="mt-4 mb-2 text-sm text-muted">Accent</p>
        <div role="group" aria-label="Accent color" className="flex gap-2">
          {ACCENT_PRESETS.map((accent) => (
            // data-accent scopes the CSS variables to this swatch, so it shows its own colour.
            <button
              key={accent}
              type="button"
              data-accent={accent}
              aria-label={accent}
              aria-pressed={theme.accent === accent}
              title={accent}
              onClick={() => setTheme({ ...theme, accent })}
              className="size-8 rounded-full bg-accent ring-offset-2 ring-offset-surface aria-pressed:ring-2 aria-pressed:ring-fg"
            />
          ))}
        </div>
      </div>
    </>
  );
}
