import { Container } from "@/components/ui/Container";
import { THEME_ID, weddingDetails } from "@/lib/wedding-content";

export function Footer() {
  const date = new Date(weddingDetails.weddingDateISO);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="bg-bg py-24 text-center text-fg">
      <Container className="flex flex-col items-center gap-4">
        <p className="font-display text-4xl italic sm:text-5xl">
          {weddingDetails.partnerOneName}
          <span className="text-accent-soft"> &amp; </span>
          {weddingDetails.partnerTwoName}
        </p>
        <span className="eyebrow">{THEME_ID}</span>
        <p className="mt-2 text-sm text-fg-muted">{formatted}</p>
        <p className="mt-10 text-xs text-fg-faint">
          With love and gratitude to everyone joining our journey.
        </p>
      </Container>
    </footer>
  );
}
