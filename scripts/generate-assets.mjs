/**
 * generate-assets.mjs — Génération des assets de marque (one-shot)
 *
 * Produit à partir du logo :
 *   - public/images/og-image.jpg   (1200×630, aperçu Facebook/LinkedIn/Twitter)
 *   - public/favicon-32.png
 *   - public/favicon-192.png
 *   - public/apple-touch-icon.png  (180×180, fond plein)
 *   - public/favicon.ico           (16/32/48)
 *
 * Les fichiers générés sont committés — ce script ne roule pas au build,
 * seulement quand le branding change : `npm run generate-assets`
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import pngToIco from 'png-to-ico';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const LOGO = path.join(PUBLIC, 'images', 'logo-fuser-sans-backk.png');

async function generateFavicons() {
  await sharp(LOGO).resize(32, 32).png().toFile(path.join(PUBLIC, 'favicon-32.png'));
  await sharp(LOGO).resize(192, 192).png().toFile(path.join(PUBLIC, 'favicon-192.png'));

  // Apple touch icon : fond plein (iOS n'aime pas la transparence) + marge
  await sharp(LOGO)
    .resize(140, 140)
    .flatten({ background: '#050a15' })
    .extend({ top: 20, bottom: 20, left: 20, right: 20, background: '#050a15' })
    .png()
    .toFile(path.join(PUBLIC, 'apple-touch-icon.png'));

  // favicon.ico multi-tailles
  const sizes = await Promise.all(
    [16, 32, 48].map((size) => sharp(LOGO).resize(size, size).png().toBuffer())
  );
  const ico = await pngToIco(sizes);
  fs.writeFileSync(path.join(PUBLIC, 'favicon.ico'), ico);
  console.log('✅ Favicons générés (ico, 32, 192, apple-touch-icon)');
}

async function generateOgImage() {
  const logoBase64 = fs.readFileSync(LOGO).toString('base64');

  const svg = `
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <radialGradient id="glow" cx="50%" cy="38%" r="65%">
      <stop offset="0%" stop-color="#0e2a4a"/>
      <stop offset="55%" stop-color="#081326"/>
      <stop offset="100%" stop-color="#050a15"/>
    </radialGradient>
    <radialGradient id="cyanGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#00d2ff" stop-opacity="0.35"/>
      <stop offset="100%" stop-color="#00d2ff" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#glow)"/>
  <ellipse cx="600" cy="200" rx="420" ry="240" fill="url(#cyanGlow)"/>

  <!-- Étoiles -->
  <circle cx="110" cy="90" r="2" fill="#ffffff" opacity="0.5"/>
  <circle cx="240" cy="500" r="1.5" fill="#ffffff" opacity="0.35"/>
  <circle cx="350" cy="160" r="1.5" fill="#ffffff" opacity="0.4"/>
  <circle cx="490" cy="560" r="2" fill="#ffffff" opacity="0.3"/>
  <circle cx="860" cy="120" r="2" fill="#ffffff" opacity="0.45"/>
  <circle cx="960" cy="480" r="1.5" fill="#ffffff" opacity="0.35"/>
  <circle cx="1080" cy="230" r="2" fill="#00d2ff" opacity="0.6"/>
  <circle cx="160" cy="320" r="1.5" fill="#00d2ff" opacity="0.5"/>
  <circle cx="1040" cy="560" r="1.5" fill="#ffffff" opacity="0.4"/>
  <circle cx="700" cy="70" r="1.5" fill="#ffffff" opacity="0.4"/>

  <!-- Logo -->
  <image href="data:image/png;base64,${logoBase64}" x="510" y="60" width="180" height="180"/>

  <!-- Texte -->
  <text x="600" y="365" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="96" font-weight="900" fill="#ffffff" letter-spacing="8">PROPULSITE</text>
  <rect x="450" y="400" width="300" height="4" rx="2" fill="#00d2ff"/>
  <text x="600" y="465" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="34" font-weight="700" fill="#00d2ff" letter-spacing="2">AGENCE MARKETING POUR LA CONSTRUCTION</text>
  <text x="600" y="530" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="26" fill="#8fa3bd">Google Ads &#183; SEO local &#183; Conception web &#183; R&#233;seaux sociaux</text>
  <text x="600" y="590" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="24" font-weight="700" fill="#ffffff" opacity="0.85">propulsite.ca</text>
</svg>`;

  await sharp(Buffer.from(svg))
    .jpeg({ quality: 88 })
    .toFile(path.join(PUBLIC, 'images', 'og-image.jpg'));
  console.log('✅ og-image.jpg généré (1200×630)');
}

await generateFavicons();
await generateOgImage();
