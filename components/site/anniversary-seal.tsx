import { anniversary } from "@/lib/content";

/* The commemorative seal for the anniversary page.
 *
 * Arabic numerals, not Roman: the fraternity is an engineering and physical
 * sciences brotherhood, and "LVIII" read as antiquarian next to the modern
 * imagery around it. The surrounding dial stays — it is a protractor scale,
 * a drafting instrument, which is the ornament this institution has earned.
 *
 * Drawn rather than generated: image models garble letterforms, so a numeral
 * struck on a seal would come back merely resembling itself. DESIGN principle 2
 * makes the wordmark the monument, so it is set in the real display face rather
 * than an approximation of one.
 *
 * Costs about 2KB of markup, scales to any size, and recolours with the theme
 * tokens — none of which a raster asset would do.
 */

const TICKS = 72; // one every 5° — a protractor scale, not an ornament
const CENTER = 160;
const TICK_OUTER = 147;
const TICK_MINOR = 140;
const TICK_MAJOR = 133;

export function AnniversarySeal({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 320"
      className={className}
      role="img"
      aria-label={`Commemorative seal — the ${anniversary.ordinal} Anniversary, ${anniversary.year}`}
    >
      {/* Concentric rules — the engraved edge of a struck medal */}
      <circle cx={CENTER} cy={CENTER} r={155} fill="none" stroke="var(--frat-gold)" strokeWidth="1" opacity="0.55" />
      <circle cx={CENTER} cy={CENTER} r={150} fill="none" stroke="var(--frat-gold)" strokeWidth="0.5" opacity="0.35" />
      <circle cx={CENTER} cy={CENTER} r={118} fill="none" stroke="var(--frat-gold)" strokeWidth="0.5" opacity="0.3" />

      {/* Protractor scale */}
      <g stroke="var(--frat-gold)" strokeWidth="0.75">
        {Array.from({ length: TICKS }, (_, i) => {
          const angle = (i * 360) / TICKS;
          const major = i % 6 === 0; // every 30°
          const radians = ((angle - 90) * Math.PI) / 180;
          const inner = major ? TICK_MAJOR : TICK_MINOR;
          return (
            <line
              key={i}
              x1={CENTER + TICK_OUTER * Math.cos(radians)}
              y1={CENTER + TICK_OUTER * Math.sin(radians)}
              x2={CENTER + inner * Math.cos(radians)}
              y2={CENTER + inner * Math.sin(radians)}
              opacity={major ? 0.6 : 0.28}
            />
          );
        })}
      </g>

      {/* Year, above the numeral */}
      <text
        x={CENTER}
        y={112}
        textAnchor="middle"
        fill="var(--frat-gold)"
        opacity="0.75"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize="13"
        letterSpacing="6"
      >
        {anniversary.year}
      </text>

      {/* The numeral — the monument */}
      <text
        x={CENTER}
        y={205}
        textAnchor="middle"
        fill="var(--frat-gold-light)"
        fontFamily="var(--font-display), Georgia, serif"
        fontSize="104"
        fontWeight="600"
        letterSpacing="-2"
      >
        {anniversary.edition}
      </text>

      {/* Hairline rule under the numeral */}
      <line
        x1={CENTER - 46}
        y1={224}
        x2={CENTER + 46}
        y2={224}
        stroke="var(--frat-gold)"
        strokeWidth="0.75"
        opacity="0.5"
      />

      <text
        x={CENTER}
        y={247}
        textAnchor="middle"
        fill="var(--frat-cream)"
        opacity="0.62"
        fontFamily="var(--font-geist-mono), ui-monospace, monospace"
        fontSize="11"
        letterSpacing="5"
      >
        ANNIVERSARY
      </text>
    </svg>
  );
}
