import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

/* Pills. The reference's button: fully rounded, bold sans, generous padding,
   a solid brand fill or a hairline outline, and a quiet darkening on hover. */
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-sans font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--paper)] focus-visible:ring-[var(--ring)] disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-[var(--brand)] text-[var(--frat-cream)] hover:bg-[#08300a]",
        accent: "bg-[var(--brand)] text-[var(--frat-cream)] hover:bg-[#08300a]",
        gold: "bg-[var(--frat-gold)] text-[#1a1305] hover:bg-[var(--frat-gold-light)]",
        outline: "border border-[var(--fg)]/80 text-[var(--fg)] hover:bg-[var(--fg)]/5",
        white: "bg-[var(--paper)] text-[var(--fg)] hover:bg-white",
        "outline-light": "border border-[var(--frat-cream)]/70 text-[var(--frat-cream)] hover:bg-[var(--frat-cream)]/10",
        ghost: "text-[var(--fg)]/80 hover:text-[var(--fg)]",
        link: "underline underline-offset-4 text-[var(--brand)] hover:text-[var(--fg)]",
      },
      size: {
        default: "h-12 px-7 text-[15px]",
        sm: "h-10 px-5 text-[14px]",
        lg: "h-14 px-9 text-[16px]",
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
