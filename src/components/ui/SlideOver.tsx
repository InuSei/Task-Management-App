'use client';

import { useEffect, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';

interface SlideOverProps {
  open: boolean;
  label: string;
  onClose: () => void;
  /** Receives `close`, which blurs the focused field (running its onBlur save) before closing. */
  children: (close: () => void) => ReactNode;
}

/** Right-hand panel built on <dialog> for native focus trapping, Escape handling and top-layer stacking. */
export function SlideOver({ open, label, onClose, children }: SlideOverProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  function requestClose() {
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
    dialogRef.current?.close();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    if (event.target === event.currentTarget) requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onCancel={handleCancel}
      onClick={handleBackdropClick}
      aria-label={label}
      className="fixed inset-y-0 right-0 left-auto m-0 h-dvh max-h-none w-full max-w-md border-l border-line bg-surface p-0 text-fg backdrop:bg-black/40"
    >
      {open && children(requestClose)}
    </dialog>
  );
}
