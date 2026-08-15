import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { weddingDetails } from "@/lib/wedding-content";

const links = [
  { href: "#our-story", label: "Our Story" },
  { href: "#details", label: "Details" },
  { href: "#gallery", label: "Gallery" },
  { href: "#rsvp", label: "RSVP" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-parchment/90 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <a href="#top" className="font-display text-lg italic">
          {weddingDetails.partnerOneName} &amp; {weddingDetails.partnerTwoName}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-charcoal/80 transition-colors hover:text-clay"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#gift"
            className="inline-flex items-center rounded-[var(--radius-sm)] bg-ink px-5 py-2.5 text-sm font-medium text-ivory transition-colors hover:bg-ink-soft"
          >
            Gift Us
          </a>
        </div>

        <button
          type="button"
          className="p-2 md:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      {open && (
        <nav className="border-t border-ink/10 bg-parchment px-5 pb-6 pt-2 md:hidden">
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3 text-base"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li className="pt-2">
              <a
                href="#gift"
                onClick={() => setOpen(false)}
                className="block rounded-[var(--radius-sm)] bg-ink px-5 py-3 text-center text-sm text-ivory"
              >
                Gift Us
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
