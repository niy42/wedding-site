import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import type { GalleryImage } from "@/types";

interface LightboxProps {
  images: GalleryImage[];
  activeIndex: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export function Lightbox({ images, activeIndex, onClose, onNavigate }: LightboxProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const image = images[activeIndex];

  useEffect(() => {
    closeRef.current?.focus();

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNavigate((activeIndex + 1) % images.length);
      if (e.key === "ArrowLeft") onNavigate((activeIndex - 1 + images.length) % images.length);
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeIndex, images.length, onClose, onNavigate]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Photo gallery"
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg/97 p-4"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-5 top-5 rounded-full p-2 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={() => onNavigate((activeIndex - 1 + images.length) % images.length)}
        aria-label="Previous photo"
        className="absolute left-3 rounded-full p-2 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg sm:left-8"
      >
        <ChevronLeft size={26} />
      </button>

      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[85vh] max-w-[90vw] object-contain"
      />

      <button
        type="button"
        onClick={() => onNavigate((activeIndex + 1) % images.length)}
        aria-label="Next photo"
        className="absolute right-3 rounded-full p-2 text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg sm:right-8"
      >
        <ChevronRight size={26} />
      </button>

      <p className="absolute bottom-6 text-xs uppercase tracking-[0.15em] text-fg-faint">
        {activeIndex + 1} / {images.length}
      </p>
    </div>
  );
}
