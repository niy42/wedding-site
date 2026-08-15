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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/95 p-4"
    >
      <button
        ref={closeRef}
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute right-5 top-5 rounded-full p-2 text-ivory/80 hover:bg-ivory/10 hover:text-ivory"
      >
        <X size={22} />
      </button>

      <button
        type="button"
        onClick={() => onNavigate((activeIndex - 1 + images.length) % images.length)}
        aria-label="Previous photo"
        className="absolute left-3 rounded-full p-2 text-ivory/80 hover:bg-ivory/10 hover:text-ivory sm:left-8"
      >
        <ChevronLeft size={28} />
      </button>

      <img
        src={image.src}
        alt={image.alt}
        className="max-h-[85vh] max-w-[90vw] rounded-[var(--radius-md)] object-contain"
      />

      <button
        type="button"
        onClick={() => onNavigate((activeIndex + 1) % images.length)}
        aria-label="Next photo"
        className="absolute right-3 rounded-full p-2 text-ivory/80 hover:bg-ivory/10 hover:text-ivory sm:right-8"
      >
        <ChevronRight size={28} />
      </button>

      <p className="absolute bottom-5 text-xs text-ivory/50">
        {activeIndex + 1} / {images.length}
      </p>
    </div>
  );
}
