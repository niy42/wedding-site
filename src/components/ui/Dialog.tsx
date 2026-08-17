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
      className="fixed m-auto w-[min(560px,92vw)] max-h-[85vh] overflow-y-auto rounded-[var(--radius-lg)] border border-border bg-bg-elevated p-0 text-fg backdrop:bg-bg/85 open:animate-[fade-in_220ms_ease-out]"
    >
      <div className="flex items-center justify-between border-b border-border-subtle px-7 py-5">
        <h2 id="dialog-title" className="font-display text-xl">
          {title}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close dialog"
          className="rounded-full p-1.5 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
        >
          <X size={18} />
        </button>
      </div>
      <div className="px-7 py-7">{children}</div>
    </dialog>
  );
}
