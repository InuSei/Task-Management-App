import { X } from 'lucide-react';

export function PanelHeader({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <header className="flex items-center justify-between gap-2">
      <h2 className="truncate text-lg font-semibold">{title}</h2>
      <button type="button" onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-line">
        <X className="size-5" aria-hidden />
      </button>
    </header>
  );
}
