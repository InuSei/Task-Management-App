import { ACCENT_PRESETS, COLOR_MODES, THEME_STORAGE_KEY } from '@/domain/theme';

// Inlined in <head> so a saved theme is applied before first paint (no flash).
// Plain ES5 string: it runs before any bundle loads. Invalid data keeps the server defaults.
export const themeInitScript = `(function(){try{
var t=JSON.parse(localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)})||'{}')||{};
var r=document.documentElement;
if(${JSON.stringify(COLOR_MODES)}.indexOf(t.mode)>-1)r.dataset.mode=t.mode;
if(${JSON.stringify(ACCENT_PRESETS)}.indexOf(t.accent)>-1)r.dataset.accent=t.accent;
}catch(e){}})();`;
