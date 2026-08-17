import { Container } from "@/components/ui/Container";
import { Countdown } from "./Countdown";
import { THEME_ID, weddingDetails } from "@/lib/wedding-content";

export function Hero() {
  const date = new Date(weddingDetails.weddingDateISO);
  const formatted = date.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section id="top" className="relative min-h-100svh overflow-hidden bg-bg text-fg">
      <img
        src="https://picsum.photos/seed/jossyandrew-hero/1800/2400"
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover opacity-[0.38] animate-[hero-reveal_1.6s_var(--ease-editorial)_forwards]"
        loading="eager"
      />
      {/* Deep tonal overlay — cinematic, not a flat scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-bg/30" />
      <div className="absolute inset-0 bg-linear-to-b from-bg/50 via-transparent to-transparent" />

      <Container className="relative flex min-h-svh flex-col justify-end gap-10 pb-14 pt-24 sm:gap-12 sm:pb-20 sm:pt-28">
        <div>
          <p className="eyebrow opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_0.3s_forwards]">
            {THEME_ID}
          </p>
          <h1 className="mt-5 font-display text-7xl leading-[0.95] text-balance opacity-0 sm:text-[8.5rem] animate-[fade-up_1s_var(--ease-editorial)_0.5s_forwards]">
            {weddingDetails.partnerOneName}
            <span className="italic text-accent-soft"> &amp; </span>
            <br className="hidden sm:block" />
            {weddingDetails.partnerTwoName}
          </h1>
          <p className="mt-6 max-w-md text-base text-fg-muted opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_0.8s_forwards] sm:text-lg">
            {formatted}
          </p>
        </div>

        <div className="opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_1.05s_forwards]">
          <Countdown targetISO={weddingDetails.weddingDateISO} />
        </div>

        <div className="flex flex-col gap-4 opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_1.3s_forwards] sm:flex-row">
          <a
            href="#rsvp"
            className="inline-flex items-center justify-center bg-accent px-9 py-4 text-xs uppercase tracking-[0.2em] text-bg transition-colors hover:bg-accent-soft"
          >
            RSVP
          </a>
          <a
            href="#gift"
            className="inline-flex items-center justify-center border border-fg/25 px-9 py-4 text-xs uppercase tracking-[0.2em] text-fg transition-colors hover:border-accent hover:text-accent-soft"
          >
            Send a Gift
          </a>
        </div>
      </Container>
    </section>
  );
}
