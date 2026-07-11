import {
  Music,
  Calculator,
  Trophy,
  Users,
  BookOpen,
  Hammer,
  HeartHandshake,
  ShieldPlus,
  type LucideIcon,
} from "lucide-react";
import type { Project } from "@/lib/content";

const ICONS: Record<string, LucideIcon> = {
  "kalye-tunes": Music,
  mathrix: Calculator,
  kanalan: Trophy,
  pautakan: Users,
  "thinking-space-lounge": BookOpen,
  "thinking-space-alc": Hammer,
  "oplan-pag-ibig": HeartHandshake,
  "covid-19-relief": ShieldPlus,
};

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const Icon = ICONS[project.slug] ?? Users;

  return (
    <div className="group h-full bg-[var(--canvas)] p-8 transition-colors hover:bg-[var(--surface)]">
      <div className="flex items-start justify-between">
        <Icon
          className="h-8 w-8 text-[var(--frat-gold)] transition-transform duration-500 group-hover:scale-110"
          strokeWidth={1.25}
        />
        <span className="font-mono text-xs text-[var(--frat-gold)]">
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>
      <p className="mt-8 font-mono text-[10px] tracking-[0.25em] text-[var(--frat-cream)]/60 uppercase">
        {project.category}
      </p>
      <h3 className="mt-2 font-display text-xl leading-snug text-[var(--frat-cream)] transition-colors group-hover:text-[var(--frat-gold-light)]">
        {project.title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--frat-cream)]/70">
        {project.description}
      </p>
    </div>
  );
}
