'use client';

import { useId } from 'react';
import { Check, Palette } from 'lucide-react';
import { ACCENT_PRESETS, COLOR_MODES, MODE_ACCENTS, MODE_LABELS } from '@/domain/theme';
import { useTheme } from '@/hooks/useTheme';

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
        title="Theme"
        className="rounded-md p-2 text-muted hover:bg-surface hover:text-fg"
      >
        <Palette className="size-5" aria-hidden />
      </button>
      <div
        id={popoverId}
        popover="auto"
        className="fixed inset-auto top-14 right-4 m-0 w-72 rounded-lg border border-line bg-surface p-4 text-fg shadow-xl"
      >
        <p className="mb-2 text-sm text-muted">Theme</p>
        <div role="group" aria-label="Page theme" className="grid grid-cols-2 gap-2">
          {COLOR_MODES.map((mode) => (
            // data-mode/data-accent scope the CSS variables, so each swatch previews its own theme.
            <button
              key={mode}
              type="button"
              data-mode={mode}
              data-accent={MODE_ACCENTS[mode]}
              aria-pressed={theme.mode === mode}
              onClick={() => setTheme({ mode, accent: MODE_ACCENTS[mode] })}
              className="flex items-center gap-2 rounded-md border border-line bg-canvas p-2 text-left text-sm text-fg ring-offset-2 ring-offset-surface aria-pressed:ring-2 aria-pressed:ring-fg"
            >
              <span className="flex size-6 shrink-0 items-center justify-center rounded bg-surface ring-1 ring-line">
                <span className="size-2.5 rounded-full bg-accent" />
              </span>
              <span className="flex-1">{MODE_LABELS[mode]}</span>
              {theme.mode === mode && <Check className="size-4" aria-hidden />}
            </button>
          ))}
        </div>
        <p className="mt-4 mb-2 text-sm text-muted">Accent</p>
        <div role="group" aria-label="Accent color" className="flex gap-2">
          {ACCENT_PRESETS.map((accent) => (
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
