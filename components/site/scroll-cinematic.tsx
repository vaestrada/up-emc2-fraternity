"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { Container } from "@/components/site/container";

/**
 * Scroll-scrubbed cinematic video: a pinned track maps scroll progress (0..1)
 * onto video.currentTime, eased via rAF so a flicked wheel doesn't thrash the
 * decoder. Same technique as CONSTRUX's build-timeline video (see
 * construx-site/assets/js/main.js), reimplemented for React. Generic so it
 * can back more than one page's hero sequence.
 */
export function ScrollCinematic({
  src,
  poster,
  eyebrow,
  title,
  description,
  heightVh = 420,
}: {
  src: string;
  poster: string;
  eyebrow: string;
  title: React.ReactNode;
  description: string;
  heightVh?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const reduceMotion = useReducedMotion();
  const [shouldLoad, setShouldLoad] = useState(false);

  // Don't start fetching (often multi-MB) video until the track is actually
  // getting close — otherwise every page using this component eagerly
  // downloads its full video on load, regardless of scroll position.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px 0px" }
    );
    observer.observe(track);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    const video = videoRef.current;
    if (!track || !video) return;

    let videoReady = isFinite(video.duration) && video.duration > 0;
    const markReady = () => {
      videoReady = isFinite(video.duration) && video.duration > 0;
    };
    video.addEventListener("loadedmetadata", markReady);
    video.addEventListener("durationchange", markReady);
    if (video.readyState >= 1) markReady();

    // Safari/iOS refuses to seek a video that has never played.
    const unlock = () => {
      const attempt = video.play();
      if (attempt && typeof attempt.then === "function") {
        attempt.then(() => video.pause()).catch(() => {});
      }
    };
    window.addEventListener("touchstart", unlock, { once: true, passive: true });
    window.addEventListener("click", unlock, { once: true });

    let targetProgress = 0;
    let easedProgress = 0;
    let raf = 0;

    const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

    const measure = () => {
      const rect = track.getBoundingClientRect();
      const scrollable = rect.height - window.innerHeight;
      targetProgress = scrollable <= 0 ? 0 : clamp(-rect.top / scrollable, 0, 1);
    };

    const applyProgress = (p: number) => {
      if (!videoReady) return;
      const t = p * (video.duration - 0.05);
      if (!video.seeking && Math.abs(video.currentTime - t) > 0.02) {
        try {
          video.currentTime = t;
        } catch {
          // not seekable yet
        }
      }
    };

    const render = () => {
      easedProgress += (targetProgress - easedProgress) * (reduceMotion ? 1 : 0.12);
      if (Math.abs(targetProgress - easedProgress) < 0.0002) easedProgress = targetProgress;
      applyProgress(easedProgress);
      raf = requestAnimationFrame(render);
    };

    const onVisibility = () => {
      if (!document.hidden) {
        measure();
        easedProgress = targetProgress;
        applyProgress(easedProgress);
      }
    };

    window.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    document.addEventListener("visibilitychange", onVisibility);

    measure();
    applyProgress(0);
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("click", unlock);
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("loadedmetadata", markReady);
      video.removeEventListener("durationchange", markReady);
    };
  }, [reduceMotion]);

  return (
    <section ref={trackRef} className="relative" style={{ height: `${heightVh}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden bg-[var(--ink)]">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover opacity-70"
          src={shouldLoad ? src : undefined}
          poster={poster}
          muted
          playsInline
          preload={shouldLoad ? "auto" : "none"}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--ink)] via-transparent to-[var(--ink)]/40" />
        <Container className="relative text-center">
          <p className="font-mono text-[11px] tracking-[0.4em] text-[var(--frat-gold)] uppercase">{eyebrow}</p>
          <h2 className="mt-6 font-display text-4xl leading-tight text-[var(--frat-cream)] md:text-6xl">{title}</h2>
          <p className="mx-auto mt-6 max-w-xl text-sm leading-relaxed text-[var(--frat-cream)]/60">{description}</p>
        </Container>
      </div>
    </section>
  );
}
