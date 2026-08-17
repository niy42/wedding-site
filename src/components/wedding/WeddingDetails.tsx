import { Clock, MapPin, Shirt } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { weddingDetails } from "@/lib/wedding-content";

function formatTime(timeISO: string) {
  return new Date(timeISO).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function EventBlock({
  label,
  time,
  description,
}: {
  label: string;
  time: string;
  description?: string;
}) {
  return (
    <div className="border-t border-border-subtle pt-6">
      <span className="eyebrow">{label}</span>

      <div className="mt-4 flex items-start gap-3 text-sm text-fg-muted">
        <Clock
          size={15}
          className="mt-0.5 shrink-0 text-accent"
          aria-hidden="true"
        />

        <div>
          <p className="text-fg">{time}</p>

          {description && (
            <p className="mt-1 leading-relaxed">{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function WeddingDetails() {
  const { venue, ceremony, dressCode } = weddingDetails;

  return (
    <Section id="details" tone="base">
      <Container>
        <div className="flex flex-col gap-14 sm:flex-row sm:items-start sm:justify-between">
          {/* Intro */}
          <div>
            <span className="eyebrow">The Details</span>

            <Heading level="h2" className="mt-4">
              Join us as we celebrate
            </Heading>

            <div className="mt-10 flex items-start gap-3 border-t border-border-subtle pt-8 text-sm text-fg-muted">
              <Shirt
                size={15}
                className="mt-0.5 shrink-0 text-accent"
                aria-hidden="true"
              />

              <div>
                <p className="eyebrow mb-1.5">Dress Code</p>
                <p className="leading-relaxed">{dressCode}</p>
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="flex flex-col items-start justify-center">
            {/* Shared venue */}
            <div className="border-t border-border-subtle pt-0">
              <span className="eyebrow">Venue</span>

              <h3 className="mt-3 font-display text-3xl sm:text-4xl">
                {venue.name}
              </h3>

              <div className="mt-6 flex items-start gap-3 text-sm text-fg-muted">
                <MapPin
                  size={15}
                  className="mt-0.5 shrink-0 text-accent"
                  aria-hidden="true"
                />

                <span className="leading-relaxed">{venue.address}</span>
              </div>

              {venue.mapUrl && (
                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-block text-xs uppercase tracking-[0.15em] text-accent-soft transition-opacity hover:opacity-70"
                >
                  Get directions →
                </a>
              )}
            </div>

            {/* Schedule */}
            <div className="mt-10 grid gap-10 sm:grid-cols-1 sm:gap-12">
              <EventBlock
                label={ceremony.label}
                time={`From ${formatTime(ceremony.startTimeISO)} am`}
                description={ceremony.officiatedBy}
              />

              {/* <EventBlock
                label={reception.label}
                time={formatTime(reception.startTimeISO)}
              /> */}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}