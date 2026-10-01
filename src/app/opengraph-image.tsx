import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "Duchess — Hair, accessories, hair care and cosmetics";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage() {
  const [hairImage, cosmeticsImage] = await Promise.all([
    readFile(join(process.cwd(), "public/images/duchess-hair-hero.png")),
    readFile(join(process.cwd(), "public/images/duchess-cosmetics-hero.png")),
  ]);
  return new ImageResponse(
    <div style={{ display: "flex", width: "100%", height: "100%", background: "#321040", color: "#fff9f2" }}>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 600, height: "100%", padding: "58px 50px 52px 58px" }}>
        <div style={{ display: "flex", fontSize: 29, letterSpacing: "0.18em", textTransform: "uppercase", color: "#e7d4eb" }}>DUCHESS</div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 67, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.05em" }}>Your beauty.</div>
          <div style={{ display: "flex", fontSize: 67, fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.05em" }}>Your way.</div>
          <div style={{ display: "flex", marginTop: 26, fontSize: 25, lineHeight: 1.4, color: "#e7d4eb" }}>Hair, accessories, care & cosmetics.</div>
        </div>
        <div style={{ display: "flex", fontSize: 22, color: "#d9c2eb" }}>Discover the Duchess collection →</div>
      </div>
      <div style={{ display: "flex", width: 600, height: "100%" }}>
        {/* next/og renders these images into the social preview PNG. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${hairImage.toString("base64")}`} alt="" width="300" height="630" style={{ width: 300, height: 630, objectFit: "cover", objectPosition: "65% center" }} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={`data:image/png;base64,${cosmeticsImage.toString("base64")}`} alt="" width="300" height="630" style={{ width: 300, height: 630, objectFit: "cover", objectPosition: "center" }} />
      </div>
    </div>,
    size,
  );
}
