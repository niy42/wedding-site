import { Container } from "@/components/ui/Container";
import { TradHeroImage } from "@/assets";
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
    <section id="top" className="relative bg-bg min-h-100svh overflow-hidden text-fg">
      <img
        src={TradHeroImage}
        alt=""
        aria-hidden
        className="absolute inset-0 opacity-[0.38] w-full h-full object-cover animate-[hero-reveal_1.6s_var(--ease-editorial)_forwards]"
        loading="eager"
      />
      {/* Deep tonal overlay — cinematic, not a flat scrim */}
      <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/60 to-bg/30" />
      <div className="absolute inset-0 bg-linear-to-b from-bg/50 via-transparent to-transparent" />

      <Container className="relative flex flex-col justify-end gap-10 sm:gap-12 pt-24 sm:pt-28 pb-14 sm:pb-20 min-h-svh">
        <div>
          <p className="opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_0.3s_forwards] eyebrow">
            {THEME_ID}
          </p>
          <h1 className="opacity-0 mt-5 font-display sm:text-[8.5rem] text-7xl text-balance leading-[0.95] animate-[fade-up_1s_var(--ease-editorial)_0.5s_forwards]">
            {weddingDetails.partnerOneName}
            <span className="italic text-accent-soft"> &amp; </span>
            <br className="hidden sm:block" />
            {weddingDetails.partnerTwoName}
          </h1>
          <p className="opacity-0 mt-6 max-w-md text-fg-muted text-base sm:text-lg animate-[fade-up_0.9s_var(--ease-editorial)_0.8s_forwards]">
            {formatted}
          </p>
        </div>

        <div className="opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_1.05s_forwards]">
          <Countdown targetISO={weddingDetails.weddingDateISO} />
        </div>

        <div className="flex sm:flex-row flex-col gap-4 opacity-0 animate-[fade-up_0.9s_var(--ease-editorial)_1.3s_forwards]">
          <a
            href="#rsvp"
            className="inline-flex justify-center items-center bg-accent px-9 py-4 text-bg text-xs uppercase tracking-[0.2em] transition-colors hover:bg-accent-soft"
          >
            RSVP
          </a>
          <a
            href="#gift"
            className="inline-flex justify-center items-center px-9 py-4 border border-fg/25 hover:border-accent text-fg text-xs uppercase tracking-[0.2em] transition-colors hover:text-accent-soft"
          >
            Send a Gift
          </a>
        </div>
      </Container>
    </section>
  );
}
