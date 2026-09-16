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

        <div className="gap-2 sm:gap-3 columns-2 sm:columns-3 mt-12">
          {galleryImages.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group block relative mb-2 sm:mb-3 w-full overflow-hidden break-inside-avoid"
              aria-label={`Open photo ${index + 1} in full view`}
            >
              <img
                src={image.src}
                alt={image.alt}
                loading="lazy"
                width={image.width}
                height={image.height}
                className="opacity-90 group-hover:opacity-100 group-hover:grayscale-0 w-full object-cover group-hover:scale-[1.04] transition-all duration-700 ease-editorial grayscale15"
              />
              <div className="absolute inset-0 bg-bg/10 group-hover:opacity-0 transition-opacity duration-500 pointer-events-none" />
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
