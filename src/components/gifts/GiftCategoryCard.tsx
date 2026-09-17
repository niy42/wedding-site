import { ProgressBar } from "@/components/ui/ProgressBar";
import { formatMoney, progressPercent } from "@/lib/currency";
import type { GiftCategory } from "@/types";
import { ArrowRight } from "lucide-react";

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
      className="group flex flex-col items-start border border-border-subtle hover:border-accent/40 overflow-hidden text-left transition-colors cursor-pointer"
    >
      <div className="w-full overflow-hidden">
        <img
          src={category.imageUrl}
          alt=""
          loading="lazy"
          className="opacity-90 group-hover:opacity-100 w-full object-cover aspect-4/3 group-hover:scale-105 transition-all duration-700 ease-editorial"
        />
      </div>
      <div className="flex flex-col flex-1 p-7 w-full">
        <h3 className="font-display text-2xl">{category.title}</h3>
        <p className="flex-1 mt-3 text-fg-muted text-sm leading-relaxed">{category.description}</p>

        <div className="mt-7">
          {percent !== null ? (
            <>
              <ProgressBar percent={percent} label={`${category.title} progress`} />
              <div className="flex justify-between items-baseline mt-3 text-fg-faint text-xs">
                <span>{formatMoney(category.raised)} raised</span>
                <span className="text-accent-soft">{percent}%</span>
              </div>
            </>
          ) : (
            <p className="text-fg-faint text-xs">{formatMoney(category.raised)} raised so far</p>
          )}
        </div>

        <span className="inline-flex items-center gap-2 mt-6 group-hover:text-accent text-xs uppercase tracking-[0.18em] transition-colors text-accent-soft">
          Give to this
          <ArrowRight
            size={15}
            strokeWidth={1.5}
            className="transition-transform group-hover:translate-x-1 duration-300"
          />
        </span>
      </div>
    </button>
  );
}
