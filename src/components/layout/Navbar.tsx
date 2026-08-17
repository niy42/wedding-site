import { useEffect, useState } from "react";
import { Container } from "@/components/ui/Container";
import { THEME_ID, weddingDetails } from "@/lib/wedding-content";
import { cn } from "@/lib/cn";

const links = [
  { href: "#our-story", label: "Our Story" },
  { href: "#details", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#rsvp", label: "RSVP" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 24);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "fixed inset-x-0 top-0 z-40 transition-colors duration-500 ease-[var(--ease-editorial)]",
          scrolled ? "bg-bg-elevated/90 backdrop-blur border-b border-border-subtle" : "bg-transparent"
        )}
      >
        <Container className="flex h-20 items-center justify-between">
          <a href="#top" className="font-display text-lg italic text-fg">
            {weddingDetails.partnerOneName} &amp; {weddingDetails.partnerTwoName}
          </a>

          <nav className="hidden items-center gap-10 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-xs uppercase tracking-[0.18em] text-fg-muted transition-colors hover:text-accent-soft"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:block">
            <a
              href="#gift"
              className="inline-flex items-center border border-accent/50 px-6 py-2.5 text-xs uppercase tracking-[0.18em] text-accent-soft transition-colors hover:bg-accent hover:text-bg"
            >
              Gift Us
            </a>
          </div>

          <button
            type="button"
            className="z-50 p-2 text-fg md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="flex flex-col gap-1.5">
              <span
                className={cn(
                  "block h-px w-6 bg-fg transition-transform duration-300",
                  open && "translate-y-[3.5px] rotate-45"
                )}
              />
              <span
                className={cn(
                  "block h-px w-6 bg-fg transition-transform duration-300",
                  open && "-translate-y-[3.5px] -rotate-45"
                )}
              />
            </span>
          </button>
        </Container>
      </header>

      {/* Full-screen mobile overlay */}
      <div
        className={cn(
          "fixed inset-0 z-30 flex flex-col items-center justify-center gap-10 bg-bg text-center transition-opacity duration-400 ease-[var(--ease-editorial)] md:hidden",
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        )}
      >
        <span className="eyebrow">{THEME_ID}</span>
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            onClick={() => setOpen(false)}
            className="font-display text-3xl italic text-fg"
          >
            {link.label}
          </a>
        ))}
        <a
          href="#gift"
          onClick={() => setOpen(false)}
          className="mt-4 border border-accent/50 px-8 py-3 text-xs uppercase tracking-[0.18em] text-accent-soft"
        >
          Gift Us
        </a>
      </div>
    </>
  );
}
