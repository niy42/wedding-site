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
    <Section id="gift" tone="parchment">
      <Container>
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">Gift Us</span>
          <Heading level="h2" className="mt-3 italic">
            Be part of our journey
          </Heading>
          <p className="mt-4 text-charcoal/70">
            Your presence is truly the gift — but if you'd like to bless our new chapter, here
            are a few ways to be part of the journey. Every gift is entirely voluntary and
            deeply appreciated.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {giftCategories.map((category) => (
            <GiftCategoryCard key={category.id} category={category} onSelect={setSelected} />
          ))}
        </div>
      </Container>

      <ContributionFlow category={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
