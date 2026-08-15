import { Section } from "@/components/ui/Section";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { storyMilestones } from "@/lib/wedding-content";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { cn } from "@/lib/cn";

function Milestone({ milestone, index }: { milestone: (typeof storyMilestones)[number]; index: number }) {
  const { ref, visible } = useScrollReveal<HTMLDivElement>();
  const reversed = index % 2 === 1;

  return (
    <div
      ref={ref}
      className={cn(
        "grid items-center gap-8 py-14 transition-all duration-700 ease-[var(--ease-editorial)] sm:grid-cols-2 sm:gap-14",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      )}
    >
      <div className={cn("overflow-hidden rounded-[var(--radius-md)]", reversed && "sm:order-2")}>
        <img
          src={milestone.imageUrl}
          alt=""
          loading="lazy"
          className="aspect-[4/5] w-full object-cover"
        />
      </div>
      <div className={cn(reversed && "sm:order-1")}>
        <span className="font-display text-sm italic text-gold">{milestone.year}</span>
        <h3 className="mt-2 font-display text-2xl sm:text-3xl">{milestone.title}</h3>
        <p className="mt-4 text-charcoal/75 leading-relaxed">{milestone.body}</p>
      </div>
    </div>
  );
}

export function OurStory() {
  return (
    <Section id="our-story" tone="ivory">
      <Container>
        <div className="max-w-xl">
          <span className="text-xs uppercase tracking-[0.25em] text-gold">Our Story</span>
          <Heading level="h2" className="mt-3">
            Every thread led here
          </Heading>
        </div>

        <div className="thread mt-4 pl-8 sm:pl-12">
          {storyMilestones.map((milestone, i) => (
            <Milestone key={milestone.id} milestone={milestone} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
