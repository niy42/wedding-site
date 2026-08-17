import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Lightbox } from "./Lightbox";
import { galleryImages } from "@/lib/wedding-content";

export function Gallery() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <Section id="gallery" tone="elevated">
      <Container>
        <div className="max-w-xl">
          <span className="eyebrow">Gallery</span>
          <Heading level="h2" className="mt-4">
            Moments so far
          </Heading>
        </div>

        <div className="mt-12 columns-2 gap-2 sm:columns-3 sm:gap-3">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group relative mb-2 block w-full break-inside-avoid overflow-hidden sm:mb-3"
              aria-label={`Open photo ${index + 1} in full view`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width={image.width}
                height={image.height}
                className="w-full object-cover opacity-90 grayscale-[15%] transition-all duration-700 ease-[var(--ease-editorial)] group-hover:scale-[1.04] group-hover:opacity-100 group-hover:grayscale-0"
              />
              <div className="pointer-events-none absolute inset-0 bg-bg/10 transition-opacity duration-500 group-hover:opacity-0" />
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
