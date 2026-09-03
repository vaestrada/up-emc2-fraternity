"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/* The seal on the homepage. The flat vector mark paints immediately; the
   metal one (three.js, loaded only in the browser and only where WebGL
   exists) fades in over it once its first frame is ready. If WebGL is
   missing, or the context is ever lost, the flat mark simply stays or
   returns. Nothing here can leave a blank space where the seal should be. */
const Seal3D = dynamic(() => import("@/components/site/seal-3d"), { ssr: false });

function hasWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export function Seal({ className }: { className?: string }) {
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const reduceMotion = useReducedMotion() ?? false;

  useEffect(() => {
    // Deferred a frame so the flat mark paints first and the WebGL probe
    // never blocks hydration.
    const id = requestAnimationFrame(() => setEnabled(hasWebGL()));
    return () => cancelAnimationFrame(id);
  }, []);

  const onReady = useCallback(() => setReady(true), []);
  const onLost = useCallback(() => {
    setReady(false);
    setEnabled(false);
  }, []);

  return (
    <div className={cn("relative", className)} aria-hidden="true">
      <Image
        src="/logo/emc2-mark.svg"
        alt=""
        width={114}
        height={114}
        priority
        unoptimized
        className={cn(
          "absolute inset-0 m-auto h-[70%] w-auto transition-opacity duration-1000",
          ready ? "opacity-0" : "opacity-100"
        )}
      />
      {enabled ? (
        <div className={cn("absolute inset-0 transition-opacity duration-1000", ready ? "opacity-100" : "opacity-0")}>
          <Seal3D onReady={onReady} onLost={onLost} reduceMotion={reduceMotion} />
        </div>
      ) : null}
    </div>
  );
}
