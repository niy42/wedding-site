import { useEffect, useState } from "react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { GiftCategoryCard } from "@/components/gifts/GiftCategoryCard";
import { ContributionFlow } from "@/features/contributions/ContributionFlow";
import { api, ApiError } from "@/services/api-client";
import type { GiftCategory } from "@/types";

export function GiftUs() {
  const [selected, setSelected] = useState<GiftCategory | null>(null);
  const [categories, setCategories] = useState<GiftCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    api.getGiftCategories()
      .then((data) => {
        if (active) setCategories(data);
      })
      .catch((err) => {
        if (active) {
          setError(
            err instanceof ApiError
              ? "We couldn't load the gift options right now. Please try again later."
              : "Something went wrong while loading the gift options.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

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

        {loading && (
          <p className="mt-14 text-sm text-fg-muted" role="status">
            Loading gift options…
          </p>
        )}

        {error && (
          <div className="mt-14 border border-border p-6" role="alert">
            <p className="text-sm text-fg-muted">{error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <p className="mt-14 text-sm text-fg-muted">
            Gift options are not available at the moment.
          </p>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => (
              <GiftCategoryCard key={category.id} category={category} onSelect={setSelected} />
            ))}
          </div>
        )}
      </Container>

      <ContributionFlow category={selected} onClose={() => setSelected(null)} />
    </Section>
  );
}
