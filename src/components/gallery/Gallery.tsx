import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Lightbox } from "./Lightbox";
import { galleryImages } from "@/lib/wedding-content";

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="gallery" tone="ivory">
      <Container>
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">Gallery</span>
          <Heading level="h2" className="mt-3">
            Moments so far
          </Heading>
        </div>

        <div className="mt-10 columns-2 gap-3 sm:columns-3 sm:gap-4">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="mb-3 block w-full break-inside-avoid overflow-hidden rounded-[var(--radius-md)] sm:mb-4"
              aria-label={`Open photo ${index + 1} in full view`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width={image.width}
                height={image.height}
                className="w-full object-cover transition-transform duration-500 ease-[var(--ease-editorial)] hover:scale-[1.03]"
              />
            </button>
          ))}
        </div>
      </Container>

      {activeIndex !== null && (
        <Lightbox
          images={galleryImages}
          activeIndex={activeIndex}
          onClose={() => setActiveIndex(null)}
          onNavigate={setActiveIndex}
        />
      )}
    </Section>
  );
}
