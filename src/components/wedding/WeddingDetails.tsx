import { MapPin, Clock, Shirt } from "lucide-react";
import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Card } from "@/components/ui/Card";
import { weddingDetails } from "@/lib/wedding-content";
import type { EventDetails } from "@/types";

function EventCard({ event }: { event: EventDetails }) {
  const time = new Date(event.startTimeISO).toLocaleTimeString("en-GB", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card>
      <span className="text-xs uppercase tracking-[0.2em] text-gold">{event.label}</span>
      <h3 className="mt-2 font-display text-2xl">{event.venueName}</h3>

      <div className="mt-5 flex flex-col gap-3 text-sm text-charcoal/75">
        <div className="flex items-start gap-2.5">
          <Clock size={16} className="mt-0.5 shrink-0 text-sage" />
          <span>{time}</span>
        </div>
        <div className="flex items-start gap-2.5">
          <MapPin size={16} className="mt-0.5 shrink-0 text-sage" />
          <span>{event.address}</span>
        </div>
      </div>

      {event.mapUrl && (
        <a
          href={event.mapUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-5 inline-block text-sm font-medium text-clay hover:underline"
        >
          Get directions →
        </a>
      )}
    </Card>
  );
}

export function WeddingDetails() {
  return (
    <Section id="details" tone="parchment">
      <Container>
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">The Details</span>
          <Heading level="h2" className="mt-3">
            Join us as we celebrate
          </Heading>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2">
          <EventCard event={weddingDetails.ceremony} />
          <EventCard event={weddingDetails.reception} />
        </div>

        <Card className="mt-6 flex items-start gap-3">
          <Shirt size={18} className="mt-0.5 shrink-0 text-sage" />
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-gold">Dress Code</p>
            <p className="mt-1 text-charcoal/80">{weddingDetails.dressCode}</p>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
