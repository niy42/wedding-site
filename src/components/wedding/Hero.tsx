import { Container } from "@/components/ui/Container";
import { Countdown } from "./Countdown";
import { weddingDetails } from "@/lib/wedding-content";

export function Hero() {
  const date = new Date(weddingDetails.weddingDateISO);
  const formatted = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-ivory">
      <img
        src="https://picsum.photos/seed/wedding-hero/1800/2200"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-30"
        loading="eager"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/70 to-ink/20" />

      <Container className="relative flex min-h-[92vh] flex-col justify-end gap-10 py-16 sm:py-24">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-gold-bright">We're getting married</p>
          <h1 className="mt-4 font-display text-6xl leading-[0.98] text-balance sm:text-8xl">
            {weddingDetails.partnerOneName}
            <span className="italic text-gold-bright"> &amp; </span>
            {weddingDetails.partnerTwoName}
          </h1>
          <p className="mt-5 max-w-md text-base text-ivory/75 sm:text-lg">{formatted}</p>
        </div>

        <Countdown targetISO={weddingDetails.weddingDateISO} />

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] bg-ivory px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ivory/90"
          >
            RSVP
          </a>
          <a
            href="#gift"
            className="inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-ivory/40 px-7 py-3.5 text-sm font-medium text-ivory transition-colors hover:border-ivory"
          >
            Send a Gift
          </a>
        </div>
      </Container>
    </section>
  );
}
