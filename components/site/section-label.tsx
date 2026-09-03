import { cn } from "@/lib/utils";

/* The one way a section announces itself: a short gold dash and small bold
   capitals. `rule` is kept for call-site compatibility; the dash is the rule. */
export function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
  rule?: boolean;
}) {
  return <p className={cn("label", className)}>{children}</p>;
}
