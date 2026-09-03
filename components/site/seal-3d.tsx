"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

/* The fraternity's seal, in metal.

   The mark's own vector paths (public/logo/emc2-mark.svg, extracted from the
   2023 Illustrator master) are extruded into a solid: the green plate as
   enamel, every gold path as gilt standing proud of it, the outer gold gear
   as a rim. Lit by three.js's built-in RoomEnvironment (a procedural studio,
   nothing fetched). It turns slowly through a few degrees, tilts toward the
   pointer, and recedes as the page is scrolled. */

const GREEN = "#0c3e06"; // the mark's own fill, used to sort paths
const GOLD = "#c38f0e";
const ENAMEL = "#08300a"; // a shade under the flat green; it reads brighter once lit
const SVG_SIZE = 114; // the mark's viewBox
const SCALE = 6.1 / SVG_SIZE; // world units across
const EASE = (t: number) => 1 - Math.pow(1 - t, 4);

/* The studio: three.js's procedural RoomEnvironment, prefiltered once at
   context creation (see onCreated below), plus a warm key and a cool rim. */
function installEnvironment(state: { gl: THREE.WebGLRenderer; scene: THREE.Scene }) {
  const pmrem = new THREE.PMREMGenerator(state.gl);
  const env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  state.scene.environment = env;
  state.scene.environmentIntensity = 1.15;
  pmrem.dispose();
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.15} />
      {/* a warm key from upper left, a cool rim from the right */}
      <directionalLight position={[-5, 6, 8]} intensity={1.4} color="#ffe6b0" />
      <directionalLight position={[7, -2, 5]} intensity={0.6} color="#d6e6ff" />
    </>
  );
}

function Seal({ onReady, reduceMotion }: { onReady: () => void; reduceMotion: boolean }) {
  const data = useLoader(SVGLoader, "/logo/emc2-mark.svg");
  const group = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const start = useRef<number | null>(null);

  const meshes = useMemo(() => {
    const items: { geometry: THREE.ExtrudeGeometry; gold: boolean }[] = [];
    for (const path of data.paths) {
      const style = (path.userData?.style ?? {}) as { fill?: string };
      const gold = (style.fill ?? "").toLowerCase() !== GREEN;
      const shapes = SVGLoader.createShapes(path);
      if (shapes.length === 0) continue;
      const geometry = new THREE.ExtrudeGeometry(shapes, {
        depth: gold ? 9 : 6,
        bevelEnabled: true,
        bevelThickness: gold ? 0.6 : 1.2,
        bevelSize: gold ? 0.5 : 1,
        bevelSegments: gold ? 1 : 2,
        curveSegments: 8,
      });
      items.push({ geometry, gold });
    }
    return items;
  }, [data]);

  useEffect(() => {
    onReady();
    const onMove = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [onReady]);

  useFrame(({ clock }) => {
    const g = group.current;
    if (!g) return;
    if (start.current === null) start.current = clock.elapsedTime;
    const t = clock.elapsedTime - start.current;
    const scroll = window.scrollY;

    // entrance: from a little behind and turned away, into place
    const enter = reduceMotion ? 1 : EASE(Math.min(t / 1.8, 1));
    const idleTurn = reduceMotion ? 0 : Math.sin(t * 0.35) * 0.28;
    const targetY = idleTurn + pointer.current.x * 0.22 + (1 - enter) * -0.9;
    const targetX = pointer.current.y * -0.16 + (1 - enter) * 0.35 + scroll * 0.0009;

    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.position.x = 1.0;
    g.position.y = -scroll * 0.0035;
    g.position.z = (1 - enter) * -6 - scroll * 0.004;
  });

  return (
    <group ref={group}>
      {/* SVG space is y-down; centre the mark and flip it upright. */}
      <group scale={[SCALE, -SCALE, SCALE]} position={[(-SVG_SIZE / 2) * SCALE, (SVG_SIZE / 2) * SCALE, 0]}>
        {meshes.map(({ geometry, gold }, i) => (
          <mesh key={i} geometry={geometry}>
            {gold ? (
              <meshPhysicalMaterial color={GOLD} metalness={1} roughness={0.3} />
            ) : (
              <meshPhysicalMaterial color={ENAMEL} metalness={0.15} roughness={0.5} clearcoat={0.5} clearcoatRoughness={0.3} />
            )}
          </mesh>
        ))}
      </group>
    </group>
  );
}

export default function Seal3D({
  onReady,
  onLost,
  reduceMotion,
}: {
  onReady: () => void;
  onLost: () => void;
  reduceMotion: boolean;
}) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ fov: 32, position: [0, 0, 17], near: 0.1, far: 100 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent", width: "100%", height: "100%" }}
      onCreated={(state) => {
        installEnvironment(state);
        // If the GPU ever drops the context (memory pressure, a driver
        // reset, a software renderer giving up), hand the seal back to
        // the flat mark rather than leave a blank panel.
        state.gl.domElement.addEventListener("webglcontextlost", (e) => {
          e.preventDefault();
          onLost();
        });
      }}
    >
      <Lighting />
      <Seal onReady={onReady} reduceMotion={reduceMotion} />
    </Canvas>
  );
}
