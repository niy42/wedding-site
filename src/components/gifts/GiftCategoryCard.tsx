import { Card } from "@/components/ui/Card";
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
    <Card className="flex flex-col overflow-hidden p-0">
      <img
        src={category.imageUrl}
        alt=""
        loading="lazy"
        className="aspect-[4/3] w-full object-cover"
      />
      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-xl">{category.title}</h3>
        <p className="mt-2 flex-1 text-sm text-charcoal/70">{category.description}</p>

        <div className="mt-5">
          {percent !== null ? (
            <>
              <ProgressBar percent={percent} label={`${category.title} progress`} />
              <div className="mt-2 flex items-baseline justify-between text-xs text-sage">
                <span>{formatMoney(category.raised)} raised</span>
                {category.target && <span>of {formatMoney(category.target)}</span>}
              </div>
            </>
          ) : (
            <p className="text-xs text-sage">{formatMoney(category.raised)} raised so far</p>
          )}
        </div>

        <button
          type="button"
          onClick={() => onSelect(category)}
          className="mt-5 inline-flex items-center justify-center rounded-[var(--radius-sm)] border border-ink/20 px-5 py-2.5 text-sm font-medium transition-colors hover:border-clay hover:text-clay"
        >
          Give to this
        </button>
      </div>
    </Card>
  );
}
