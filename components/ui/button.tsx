import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Engraved-plaque buttons: rectangular, tracked uppercase, no pill radii.
// Timing curve matches the rest of the site's motion (framer-motion Reveal /
// the roadmap mockups) so a CSS-only Link-as-button and a JS-animated
// component never feel like they belong to different products.
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-3 whitespace-nowrap font-mono font-semibold uppercase tracking-[0.25em] transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50 disabled:active:scale-100",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--frat-gold)] text-[#1a1305] hover:bg-[var(--frat-gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(195,143,14,0.5)]",
        accent:
          "bg-[var(--frat-gold)] text-[#1a1305] hover:bg-[var(--frat-gold-light)] hover:-translate-y-0.5 hover:shadow-[0_8px_24px_-8px_rgba(195,143,14,0.5)]",
        outline:
          "border border-[var(--frat-gold)]/40 text-[var(--frat-cream)] hover:border-[var(--frat-gold)] hover:text-[var(--frat-gold-light)] hover:-translate-y-0.5",
        ghost: "text-[var(--frat-cream)]/80 hover:bg-white/5",
        link: "underline-offset-4 hover:underline text-[var(--frat-gold-light)]",
      },
      size: {
        default: "h-12 px-8 text-xs",
        sm: "h-10 px-6 text-[10px]",
        lg: "h-14 px-10 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
