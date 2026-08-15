import { useEffect, useRef } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    if (!open && el.open) el.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      aria-labelledby="dialog-title"
      className="w-[min(560px,92vw)] rounded-[var(--radius-lg)] border border-ink/10 bg-ivory p-0 backdrop:bg-ink/60 open:animate-[fade-in_180ms_ease-out]"
    >
      <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4">
        <h2 id="dialog-title" className="font-display text-lg">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-full p-1.5 text-ink/60 hover:bg-ink/5 hover:text-ink"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-6 py-6">{children}</div>
    </dialog>
  );
}
