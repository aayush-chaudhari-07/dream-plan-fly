#!/usr/bin/env node

/**
 * SmartTrip Brand Asset & Favicon Generator
 *
 * Generates all modern favicon, apple-touch, PWA, and OpenGraph assets
 * from public/favicon.svg using Sharp.
 */

import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const ROOT_DIR = process.cwd();
const PUBLIC_DIR = path.resolve(ROOT_DIR, "public");
const SVG_PATH = path.resolve(PUBLIC_DIR, "favicon.svg");

if (!fs.existsSync(SVG_PATH)) {
  console.error(`❌ Source SVG not found at ${SVG_PATH}`);
  process.exit(1);
}

const svgBuffer = fs.readFileSync(SVG_PATH);

/**
 * Builds a multi-resolution .ico file from PNG buffers (PNG-encoded ICO format)
 * Supported across all modern browsers and operating systems.
 */
function createIco(pngBuffers, sizes) {
  const numImages = pngBuffers.length;
  const headerSize = 6;
  const dirEntrySize = 16;
  const firstImageOffset = headerSize + numImages * dirEntrySize;

  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type (1 = ICO)
  header.writeUInt16LE(numImages, 4); // Number of images

  const entries = [];
  let currentOffset = firstImageOffset;

  for (let i = 0; i < numImages; i++) {
    const size = sizes[i];
    const buf = pngBuffers[i];
    const entry = Buffer.alloc(dirEntrySize);

    entry.writeUInt8(size >= 256 ? 0 : size, 0); // Width
    entry.writeUInt8(size >= 256 ? 0 : size, 1); // Height
    entry.writeUInt8(0, 2); // Colors (0 = no palette)
    entry.writeUInt8(0, 3); // Reserved
    entry.writeUInt16LE(1, 4); // Color planes
    entry.writeUInt16LE(32, 6); // Bits per pixel
    entry.writeUInt32LE(buf.length, 8); // Image size in bytes
    entry.writeUInt32LE(currentOffset, 12); // File offset

    entries.push(entry);
    currentOffset += buf.length;
  }

  return Buffer.concat([header, ...entries, ...pngBuffers]);
}

async function generateAssets() {
  console.log("🎨 Generating SmartTrip brand icon set from public/favicon.svg...\n");

  // 1. Standard PNG favicons
  console.log("  → Rendering favicon-16x16.png");
  const p16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-16x16.png"), p16);

  console.log("  → Rendering favicon-32x32.png");
  const p32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon-32x32.png"), p32);

  console.log("  → Rendering favicon-48x48.png (for ICO)");
  const p48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // 2. Apple Touch Icon (180x180)
  console.log("  → Rendering apple-touch-icon.png (180x180)");
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join(PUBLIC_DIR, "apple-touch-icon.png"));

  // 3. PWA Icons (192x192 & 512x512)
  console.log("  → Rendering icon-192.png (192x192)");
  await sharp(svgBuffer).resize(192, 192).png().toFile(path.join(PUBLIC_DIR, "icon-192.png"));

  console.log("  → Rendering icon-512.png (512x512)");
  await sharp(svgBuffer).resize(512, 512).png().toFile(path.join(PUBLIC_DIR, "icon-512.png"));

  // 4. Maskable PWA Icon (512x512 with safe area margin)
  console.log("  → Rendering maskable-512.png (512x512 with safe padding)");
  const innerIcon = await sharp(svgBuffer).resize(410, 410).png().toBuffer();
  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: { r: 30, g: 58, b: 138, alpha: 1 }, // deep navy/blue background
    },
  })
    .composite([{ input: innerIcon, top: 51, left: 51 }])
    .png()
    .toFile(path.join(PUBLIC_DIR, "maskable-512.png"));

  // 5. Multi-resolution favicon.ico (16, 32, 48)
  console.log("  → Packaging multi-resolution favicon.ico (16, 32, 48)");
  const icoBuffer = createIco([p16, p32, p48], [16, 32, 48]);
  fs.writeFileSync(path.join(PUBLIC_DIR, "favicon.ico"), icoBuffer);

  // 6. OpenGraph / Twitter Social Share Preview Card (1200x630)
  console.log("  → Generating public/og-image.png (1200x630)");
  const ogSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#0a1027" />
        <stop offset="45%" stop-color="#14214d" />
        <stop offset="100%" stop-color="#1e3a8a" />
      </linearGradient>
      <linearGradient id="accent" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#818cf8" />
      </linearGradient>
      <linearGradient id="iconBg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#2563eb" />
        <stop offset="100%" stop-color="#0ea5e9" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="60" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- Deep Tech Gradient Canvas -->
    <rect width="1200" height="630" fill="url(#bg)" />

    <!-- Ambient Glow Orbs -->
    <circle cx="1000" cy="120" r="280" fill="#2563eb" opacity="0.22" filter="url(#glow)" />
    <circle cx="180" cy="520" r="220" fill="#0ea5e9" opacity="0.18" filter="url(#glow)" />

    <!-- Subtle Grid Pattern -->
    <g stroke="#ffffff" stroke-width="1" stroke-opacity="0.04">
      <line x1="0" y1="105" x2="1200" y2="105" />
      <line x1="0" y1="210" x2="1200" y2="210" />
      <line x1="0" y1="315" x2="1200" y2="315" />
      <line x1="0" y1="420" x2="1200" y2="420" />
      <line x1="0" y1="525" x2="1200" y2="525" />
      <line x1="200" y1="0" x2="200" y2="630" />
      <line x1="400" y1="0" x2="400" y2="630" />
      <line x1="600" y1="0" x2="600" y2="630" />
      <line x1="800" y1="0" x2="800" y2="630" />
      <line x1="1000" y1="0" x2="1000" y2="630" />
    </g>

    <!-- Content Group -->
    <g transform="translate(100, 110)">
      <!-- Brand Icon Mark (120x120) -->
      <g transform="translate(0, 10)">
        <rect width="120" height="120" rx="30" fill="url(#iconBg)" />
        <path d="M60 22 C43 22 30 35 30 52 C30 74 55 95 58 97 C59 98 61 98 62 97 C65 95 90 74 90 52 C90 35 77 22 60 22 Z" fill="#ffffff" fill-opacity="0.25" stroke="#ffffff" stroke-width="3" />
        <path d="M88 36 L40 55 C36 57 36 62 40 63 L55 67 L65 82 C67 85 71 85 72 81 L89 40 C90 37 87 34 88 36 Z" fill="#ffffff" stroke="#ffffff" stroke-width="2" />
        <path d="M88 36 L55 67" stroke="#2563eb" stroke-width="2" />
      </g>

      <!-- Typography -->
      <text x="156" y="70" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="64" fill="#ffffff" letter-spacing="-1">
        SmartTrip
      </text>
      <text x="158" y="112" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="24" fill="url(#accent)" letter-spacing="1">
        AI TRAVEL PLANNER &amp; DEMO BOOKING
      </text>

      <text x="0" y="240" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="68" fill="#ffffff" letter-spacing="-1.5">
        Plan Less. Travel More.
      </text>

      <text x="0" y="300" font-family="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" font-weight="400" font-size="26" fill="#94a3b8">
        Intelligent travel itineraries, realistic booking simulations &amp; live weather insights.
      </text>

      <!-- Feature Pill Badges -->
      <g transform="translate(0, 360)">
        <!-- Pill 1 -->
        <rect x="0" y="0" width="270" height="48" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="135" y="30" font-family="system-ui, sans-serif" font-weight="600" font-size="17" fill="#e2e8f0" text-anchor="middle">
          ⚡ Gemini 2.5 Flash AI
        </text>

        <!-- Pill 2 -->
        <rect x="290" y="0" width="260" height="48" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="420" y="30" font-family="system-ui, sans-serif" font-weight="600" font-size="17" fill="#e2e8f0" text-anchor="middle">
          🎫 Free Demo Bookings
        </text>

        <!-- Pill 3 -->
        <rect x="570" y="0" width="280" height="48" rx="24" fill="#ffffff" fill-opacity="0.08" stroke="#ffffff" stroke-opacity="0.15" />
        <text x="710" y="30" font-family="system-ui, sans-serif" font-weight="600" font-size="17" fill="#e2e8f0" text-anchor="middle">
          🌤️ Live Open-Meteo Weather
        </text>
      </g>
    </g>
  </svg>
  `;

  await sharp(Buffer.from(ogSvg)).png().toFile(path.join(PUBLIC_DIR, "og-image.png"));

  console.log("\n✅ All brand icon and OpenGraph assets generated successfully in public/!\n");
}

generateAssets().catch((err) => {
  console.error("❌ Failed to generate assets:", err);
  process.exit(1);
});
