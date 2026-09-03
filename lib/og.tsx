import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

let fontsPromise: Promise<{ cinzel: ArrayBuffer; cormorant: ArrayBuffer; cormorantItalic: ArrayBuffer }> | null = null;

function loadFonts() {
  if (!fontsPromise) {
    const dir = join(process.cwd(), "app/opengraph-fonts");
    fontsPromise = Promise.all([
      readFile(join(dir, "Cinzel-Bold.ttf")),
      readFile(join(dir, "Cormorant-SemiBold.ttf")),
      readFile(join(dir, "Cormorant-Italic.ttf")),
    ]).then(([cinzel, cormorant, cormorantItalic]) => ({
      cinzel: cinzel.buffer.slice(cinzel.byteOffset, cinzel.byteOffset + cinzel.byteLength) as ArrayBuffer,
      cormorant: cormorant.buffer.slice(cormorant.byteOffset, cormorant.byteOffset + cormorant.byteLength) as ArrayBuffer,
      cormorantItalic: cormorantItalic.buffer.slice(
        cormorantItalic.byteOffset,
        cormorantItalic.byteOffset + cormorantItalic.byteLength
      ) as ArrayBuffer,
    }));
  }
  return fontsPromise;
}

export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [{ cinzel, cormorant, cormorantItalic }, markData] = await Promise.all([
    loadFonts(),
    readFile(join(process.cwd(), "public/logo/emc2-mark.png")),
  ]);
  const markSrc = `data:image/png;base64,${markData.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#04150a",
          backgroundImage: "linear-gradient(135deg, #071e0c 0%, #04150a 60%)",
          padding: "72px 80px",
          fontFamily: "Cormorant",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={markSrc} width={72} height={72} alt="" />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Cormorant",
                fontSize: 22,
                letterSpacing: 6,
                color: "#c38f0e",
                textTransform: "uppercase",
              }}
            >
              EMC&sup2; Fraternity
            </div>
            <div
              style={{
                fontFamily: "Cormorant",
                fontSize: 16,
                letterSpacing: 4,
                color: "rgba(242,236,220,0.55)",
                textTransform: "uppercase",
                marginTop: 4,
              }}
            >
              University of the Philippines &middot; Est. 1969
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", maxWidth: 980 }}>
          <div
            style={{
              fontFamily: "Cormorant",
              fontStyle: "italic",
              fontSize: 26,
              letterSpacing: 3,
              color: "#e3b94a",
              marginBottom: 18,
            }}
          >
            {eyebrow}
          </div>
          <div
            style={{
              fontFamily: "Cinzel",
              fontSize: 76,
              lineHeight: 1.08,
              color: "#f2ecdc",
            }}
          >
            {title}
          </div>
          <div style={{ display: "flex", width: 140, height: 3, backgroundColor: "#c38f0e", marginTop: 36 }} />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontFamily: "Cormorant",
            fontSize: 16,
            letterSpacing: 3,
            color: "rgba(242,236,220,0.5)",
            textTransform: "uppercase",
          }}
        >
          <div style={{ display: "flex" }}>Equality &middot; Service &middot; Brotherhood</div>
          <div style={{ display: "flex" }}>up-emc2-fraternity.vercel.app</div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Cinzel", data: cinzel, weight: 700, style: "normal" },
        { name: "Cormorant", data: cormorant, weight: 600, style: "normal" },
        { name: "Cormorant", data: cormorantItalic, weight: 500, style: "italic" },
      ],
    }
  );
}
