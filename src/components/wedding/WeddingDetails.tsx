import { Clock, MapPin, Shirt } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { weddingDetails } from "@/lib/wedding-content";
import { ArrowUpRight } from "lucide-react";

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
    <div className="pt-6 border-border-subtle border-t">
      <span className="eyebrow">{label}</span>

      <div className="flex items-start gap-3 mt-4 text-fg-muted text-sm">
        <Clock
          size={15}
          className="mt-0.5 text-accent shrink-0"
          aria-hidden="true"
        />

        <div className="flex flex-col gap-2">
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
        <div className="flex sm:flex-row flex-col sm:justify-between sm:items-start gap-14">
          {/* Intro */}
          <div>
            <span className="eyebrow">The Details</span>

            <Heading level="h2" className="mt-4">
              Join us as we celebrate
            </Heading>

            <div className="flex items-start gap-3 mt-10 pt-8 border-border-subtle border-t text-fg-muted text-sm">
              <Shirt
                size={15}
                className="mt-0.5 text-accent shrink-0"
                aria-hidden="true"
              />

              <div>
                <p className="mb-1.5 eyebrow">Dress Code</p>
                <p className="leading-relaxed">{dressCode}</p>
              </div>
            </div>
          </div>

          {/* Event details */}
          <div className="flex flex-col justify-center items-start">
            {/* Shared venue */}
            <div className="pt-0 border-border-subtle border-t">
              <span className="eyebrow">Venue</span>

              <h3 className="mt-3 font-display text-xl sm:text-xl">
                {venue.name}
              </h3>

              <div className="flex items-start gap-3 mt-6 text-fg-muted text-sm">
                <MapPin
                  size={15}
                  className="mt-0.5 text-accent shrink-0"
                  aria-hidden="true"
                />

                <span className="leading-relaxed">{venue.address}</span>
              </div>

              {venue.mapUrl && (


                <a
                  href={venue.mapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 hover:opacity-70 mt-6 text-xs uppercase tracking-[0.15em] transition-opacity text-accent-soft"
                >
                  Get directions
                  <ArrowUpRight
                    size={14}
                    strokeWidth={1.8}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 duration-200"
                  />
                </a>
              )}
            </div>

            {/* Schedule */}
            <div className="gap-10 sm:gap-12 grid sm:grid-cols-1 mt-10">
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