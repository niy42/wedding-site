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
        "grid items-center gap-10 py-16 transition-all duration-900 ease-editorial sm:grid-cols-[1.1fr_0.9fr] sm:gap-16",
        visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      )}
    >
      <div className={cn("overflow-hidden", reversed && "sm:order-2")}>
        <img
          src={milestone.imageUrl}
          alt=""
          loading="lazy"
          className="aspect-4/5 w-full object-cover transition-transform duration-1200 ease-editorial hover:scale-105"
        />
      </div>
      <div className={cn(reversed && "sm:order-1")}>
        <span className="font-display text-base italic text-accent-soft">{milestone.year}</span>
        <h3 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">{milestone.title}</h3>
        <p className="mt-5 max-w-sm leading-relaxed text-fg-muted">{milestone.body}</p>
      </div>
    </div>
  );
}

export function OurStory() {
  return (
    <Section id="our-story" tone="elevated">
      <Container>
        <div className="max-w-xl">
          <span className="eyebrow">Our Story</span>
          <Heading level="h2" className="mt-4">
            Every thread led here
          </Heading>
        </div>

        <div className="thread mt-6 pl-8 sm:pl-14">
          {storyMilestones.map((milestone, i) => (
            <Milestone key={milestone.id} milestone={milestone} index={i} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
