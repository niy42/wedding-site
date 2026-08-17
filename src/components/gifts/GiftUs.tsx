import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { GiftCategoryCard } from "@/components/gifts/GiftCategoryCard";
import { ContributionFlow } from "@/features/contributions/ContributionFlow";
import { giftCategories } from "@/lib/wedding-content";
import type { GiftCategory } from "@/types";

export function GiftUs() {
  const [selected, setSelected] = useState<GiftCategory | null>(null);

  return (
    <Section id="gift" tone="plum">
      <Container>
        <div className="max-w-xl">
          <span className="eyebrow">Gift Us</span>
          <Heading level="h2" className="mt-4 italic">
            Bless our journey
          </Heading>
          <p className="mt-5 text-fg-muted">
            Your presence is truly the gift — but if you'd like to be part of our new chapter,
            here are a few ways to give. Every gift is entirely voluntary and deeply
            appreciated.
          </p>
        </div>

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {giftCategories.map((category) => (
            <GiftCategoryCard key={category.id} category={category} onSelect={setSelected} />
          ))}
        </div>
      </Container>

      <ContributionFlow category={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
