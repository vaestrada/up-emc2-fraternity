import { cn } from "@/lib/utils";

export function Marquee({
  items,
  className,
}: {
  items: string[];
  className?: string;
}) {
  const strip = (
    <>
      {items.map((item, i) => (
        <span key={i} className="flex shrink-0 items-center gap-10">
          <span>{item}</span>
          <span aria-hidden className="text-[var(--frat-gold)]">
            ✦
          </span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className={cn(
        "relative flex overflow-hidden border-y border-[var(--hairline)] py-5",
        className
      )}
    >
      <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10 whitespace-nowrap">
        {strip}
        <span aria-hidden className="flex shrink-0 items-center gap-10">
          {strip}
        </span>
      </div>
    </div>
  );
}
