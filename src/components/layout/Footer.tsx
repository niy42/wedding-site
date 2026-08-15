import { Container } from "@/components/ui/Container";
import { weddingDetails } from "@/lib/wedding-content";

export function Footer() {
  const date = new Date(weddingDetails.weddingDateISO);
  const formatted = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <footer className="bg-ink py-14 text-ivory">
      <Container className="flex flex-col items-center gap-3 text-center">
        <p className="font-display text-2xl italic">
          {weddingDetails.partnerOneName} &amp; {weddingDetails.partnerTwoName}
        </p>
        <p className="text-sm text-ivory/70">{formatted}</p>
        <p className="mt-6 text-xs text-ivory/40">
          With love and gratitude to everyone joining our journey.
        </p>
      </Container>
    </footer>
  );
}
