import { cn } from "@/lib/utils";

/* The fraternity's mark, a gear around a diamond, redrawn as an engineering
   line drawing that draws itself on load. Each path carries pathLength="1"
   so one CSS rule (stroke-dasharray: 1; stroke-dashoffset: 1 → 0) animates
   every stroke regardless of its real length; --d staggers them. A faint
   gold fill fades in once the lines are complete. Pure SVG and CSS: no
   JavaScript, and prefers-reduced-motion shows the finished drawing. */

const TEETH = 16;
const R_OUT = 100;
const R_IN = 84;

function polar(r: number, a: number) {
  return [Math.cos(a) * r, Math.sin(a) * r] as const;
}

function gearPath() {
  const step = (Math.PI * 2) / TEETH;
  const parts: string[] = [];
  for (let i = 0; i < TEETH; i++) {
    const a = i * step - Math.PI / 2;
    const [x0, y0] = polar(R_IN, a - step * 0.24);
    const [x1, y1] = polar(R_OUT, a - step * 0.14);
    const [x2, y2] = polar(R_OUT, a + step * 0.14);
    const [x3, y3] = polar(R_IN, a + step * 0.24);
    const [x4, y4] = polar(R_IN, a + step * (1 - 0.24));
    parts.push(
      `${i === 0 ? "M" : "L"}${x0.toFixed(2)} ${y0.toFixed(2)}`,
      `L${x1.toFixed(2)} ${y1.toFixed(2)}`,
      `L${x2.toFixed(2)} ${y2.toFixed(2)}`,
      `L${x3.toFixed(2)} ${y3.toFixed(2)}`,
      `A${R_IN} ${R_IN} 0 0 1 ${x4.toFixed(2)} ${y4.toFixed(2)}`
    );
  }
  return parts.join(" ") + " Z";
}

const GEAR = gearPath();
const stroke = "var(--frat-gold-light)";

export function SealDrawing({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-120 -120 240 240"
      className={cn("seal-drawing", className)}
      aria-hidden="true"
      focusable="false"
    >
      {/* gold ground that develops once the drawing is complete */}
      <g className="seal-fill" fill={stroke} fillOpacity="0.07">
        <path d={GEAR} />
      </g>

      <g fill="none" stroke={stroke} strokeWidth="1.1" strokeLinejoin="round" strokeLinecap="round">
        {/* construction circles, drawn first and lightest */}
        <circle r="112" pathLength={1} className="seal-stroke seal-construction" style={{ ["--d" as string]: "0s" }} />
        <circle r="70" pathLength={1} className="seal-stroke seal-construction" style={{ ["--d" as string]: "0.15s" }} />
        {/* centre lines */}
        <path d="M-116 0H116" pathLength={1} className="seal-stroke seal-construction" style={{ ["--d" as string]: "0.1s" }} />
        <path d="M0 -116V116" pathLength={1} className="seal-stroke seal-construction" style={{ ["--d" as string]: "0.2s" }} />

        {/* the gear */}
        <path d={GEAR} pathLength={1} className="seal-stroke" style={{ ["--d" as string]: "0.35s" }} />
        <circle r="62" pathLength={1} className="seal-stroke" style={{ ["--d" as string]: "0.9s" }} />

        {/* the diamond and its cross */}
        <path d="M0 -40L40 0L0 40L-40 0Z" pathLength={1} className="seal-stroke" style={{ ["--d" as string]: "1.25s" }} />
        <path d="M0 -22V22M-22 0H22" pathLength={1} className="seal-stroke" style={{ ["--d" as string]: "1.5s" }} />
      </g>

      <text
        y="90"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="3"
        fill={stroke}
        className="seal-text font-display"
      >
        1969
      </text>
    </svg>
  );
}
