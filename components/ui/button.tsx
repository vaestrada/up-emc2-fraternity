import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Rectangular, tracked small capitals in the sans, no radius, no lift on
   hover: a colour change and nothing else. The accent is the one solid gold
   element permitted per view. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2.5 whitespace-nowrap font-sans font-medium uppercase tracking-[0.14em] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--canvas)] focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--frat-gold)] text-[#1a1305] hover:bg-[var(--frat-gold-light)]",
        accent: "bg-[var(--frat-gold)] text-[#1a1305] hover:bg-[var(--frat-gold-light)]",
        outline:
          "border border-[var(--frat-cream)]/30 text-[var(--frat-cream)] hover:border-[var(--frat-cream)]/70",
        ghost: "text-[var(--frat-cream)]/80 hover:text-[var(--frat-cream)]",
        link: "underline underline-offset-4 text-[var(--frat-gold-light)] hover:text-[var(--frat-cream)]",
      },
      size: {
        default: "h-12 px-7 text-[12px]",
        sm: "h-10 px-5 text-[11px]",
        lg: "h-13 px-8 text-[12px]",
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
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
