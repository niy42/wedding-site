import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatMoney, progressPercent } from "@/lib/currency";
import type { GiftCategory } from "@/types";

interface GiftCategoryCardProps {
  category: GiftCategory;
  onSelect: (category: GiftCategory) => void;
}

export function GiftCategoryCard({ category, onSelect }: GiftCategoryCardProps) {
  const percent = category.target ? progressPercent(category.raised, category.target) : null;

  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className="group flex flex-col items-start overflow-hidden border border-border-subtle text-left transition-colors hover:border-accent/40"
    >
      <div className="w-full overflow-hidden">
        <img
          src={category.imageUrl}
          alt=""
          loading="lazy"
          className="aspect-[4/3] w-full object-cover opacity-90 transition-all duration-700 ease-[var(--ease-editorial)] group-hover:scale-105 group-hover:opacity-100"
        />
      </div>
      <div className="flex w-full flex-1 flex-col p-7">
        <h3 className="font-display text-2xl">{category.title}</h3>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-fg-muted">{category.description}</p>

        <div className="mt-7">
          {percent !== null ? (
            <>
              <ProgressBar percent={percent} label={`${category.title} progress`} />
              <div className="mt-3 flex items-baseline justify-between text-xs text-fg-faint">
                <span>{formatMoney(category.raised)} raised</span>
                <span className="text-accent-soft">{percent}%</span>
              </div>
            </>
          ) : (
            <p className="text-xs text-fg-faint">{formatMoney(category.raised)} raised so far</p>
          )}
        </div>

        <span className="mt-6 text-xs uppercase tracking-[0.18em] text-accent-soft transition-colors group-hover:text-accent">
          Give to this →
        </span>
      </div>
    </button>
  );
}
