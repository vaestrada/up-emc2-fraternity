import { cn } from "@/lib/utils";

/* The one way a section announces itself: small Roman capitals in gold with
   a short rule beneath. Used once per section, never on captions or buttons. */
export function SectionLabel({
  children,
  className,
  rule = true,
}: {
  children: React.ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <p className="label">{children}</p>
      {rule ? <span aria-hidden className="rule" /> : null}
    </div>
  );
}
