"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export type GalleryPhoto = {
  src: string;
  alt: string;
  caption: string;
};

export function PhotoGallery({ photos }: { photos: GalleryPhoto[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  const close = useCallback(() => {
    setOpenIndex(null);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (openIndex === null) return;
    closeRef.current?.focus();

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length));
      if (e.key === "ArrowLeft") setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openIndex, photos.length, close]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4">
        {photos.map((photo, i) => (
          <button
            key={photo.src}
            ref={i === 0 ? triggerRef : undefined}
            type="button"
            onClick={(e) => {
              triggerRef.current = e.currentTarget;
              setOpenIndex(i);
            }}
            className="group relative aspect-square overflow-hidden border border-[var(--hairline)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)]"
          >
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              className="object-cover"
              sizes="(min-width: 768px) 30vw, 45vw"
            />
          </button>
        ))}
      </div>

      {openIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={photos[openIndex].caption}
          className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--tint)]/95 p-6 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <button
            ref={closeRef}
            type="button"
            onClick={close}
            aria-label="Close"
            className="absolute top-6 right-6 text-[var(--fg)]/70 transition-colors hover:text-[var(--brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)]"
          >
            <X className="h-7 w-7" strokeWidth={1.5} />
          </button>

          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i - 1 + photos.length) % photos.length))}
            aria-label="Previous photo"
            className="absolute left-4 text-[var(--fg)]/70 transition-colors hover:text-[var(--brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)] md:left-8"
          >
            <ChevronLeft className="h-9 w-9" strokeWidth={1.25} />
          </button>
          <button
            type="button"
            onClick={() => setOpenIndex((i) => (i === null ? i : (i + 1) % photos.length))}
            aria-label="Next photo"
            className="absolute right-4 text-[var(--fg)]/70 transition-colors hover:text-[var(--brand)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--frat-gold-light)] md:right-8"
          >
            <ChevronRight className="h-9 w-9" strokeWidth={1.25} />
          </button>

          <div className="flex max-h-[85vh] max-w-3xl flex-col items-center">
            <div className="relative aspect-[3/2] w-full">
              <Image
                src={photos[openIndex].src}
                alt={photos[openIndex].alt}
                fill
                className="object-contain"
                sizes="90vw"
                priority
              />
            </div>
            <p className="caption mt-5 text-center">
              {photos[openIndex].caption}
            </p>
          </div>
        </div>
      ) : null}
    </>
  );
}
