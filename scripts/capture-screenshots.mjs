import { chromium } from 'playwright';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const SITES = [
  {
    slug: 'capital-import-export',
    name: 'Capital Import Export',
    url: 'https://www.capitalimpoexpo.com',
  },
  {
    slug: 'swift-bulk-traders',
    name: 'Swift Bulk Traders',
    url: 'https://swiftbulktraders.com',
  },
];

const outputDir = path.resolve(process.cwd(), 'public/projects');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function captureSite(browser, site) {
  console.log(`\nCapturing screenshots for ${site.name} (${site.url})...`);

  // 1. Desktop Viewport (1440x900)
  const desktopContext = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    userAgent:
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  });
  const desktopPage = await desktopContext.newPage();

  let desktopRawBuffer = null;
  try {
    console.log(`Navigating desktop: ${site.url}...`);
    await desktopPage.goto(site.url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await desktopPage.waitForTimeout(1500);
    desktopRawBuffer = await desktopPage.screenshot({ type: 'png' });
  } catch (err) {
    console.warn(`Desktop direct networkidle failed (${err.message}). Trying domcontentloaded...`);
    try {
      await desktopPage.goto(site.url, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      await desktopPage.waitForTimeout(3000);
      desktopRawBuffer = await desktopPage.screenshot({ type: 'png' });
    } catch (fallbackErr) {
      console.error(`Desktop capture failed for ${site.name}:`, fallbackErr.message);
    }
  } finally {
    await desktopContext.close();
  }

  // 2. Mobile Viewport (390x844)
  const mobileContext = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
    userAgent:
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
  });
  const mobilePage = await mobileContext.newPage();

  let mobileRawBuffer = null;
  try {
    console.log(`Navigating mobile: ${site.url}...`);
    await mobilePage.goto(site.url, {
      waitUntil: 'networkidle',
      timeout: 30000,
    });
    await mobilePage.waitForTimeout(1500);
    mobileRawBuffer = await mobilePage.screenshot({ type: 'png' });
  } catch (err) {
    console.warn(`Mobile direct networkidle failed (${err.message}). Trying domcontentloaded...`);
    try {
      await mobilePage.goto(site.url, {
        waitUntil: 'domcontentloaded',
        timeout: 25000,
      });
      await mobilePage.waitForTimeout(3000);
      mobileRawBuffer = await mobilePage.screenshot({ type: 'png' });
    } catch (fallbackErr) {
      console.error(`Mobile capture failed for ${site.name}:`, fallbackErr.message);
    }
  } finally {
    await mobileContext.close();
  }

  // If live fetch completely failed (e.g. offline or DNS down), generate a clean branded representation
  if (!desktopRawBuffer) {
    console.log(`Generating fallback snapshot for ${site.slug} desktop...`);
    desktopRawBuffer = await sharp({
      create: {
        width: 1440,
        height: 900,
        channels: 4,
        background: { r: 250, g: 250, b: 247, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(`
            <svg width="1440" height="900" xmlns="http://www.w3.org/2000/svg">
              <rect width="1440" height="60" fill="#141414"/>
              <text x="40" y="38" fill="#FFFFFF" font-family="sans-serif" font-size="20" font-weight="bold">${site.name}</text>
              <rect x="40" y="100" width="1360" height="400" fill="#FFFFFF" stroke="#E4E3DE" stroke-width="2" rx="6"/>
              <text x="80" y="220" fill="#141414" font-family="sans-serif" font-size="36" font-weight="bold">${site.name}</text>
              <text x="80" y="270" fill="#5C5C58" font-family="sans-serif" font-size="20">Built &amp; maintained by Obaidullah Miakhil</text>
              <rect x="80" y="320" width="160" height="44" fill="#1E4BD2" rx="6"/>
              <text x="110" y="348" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">Visit Website</text>
            </svg>
          `),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
  }

  if (!mobileRawBuffer) {
    console.log(`Generating fallback snapshot for ${site.slug} mobile...`);
    mobileRawBuffer = await sharp({
      create: {
        width: 390,
        height: 844,
        channels: 4,
        background: { r: 250, g: 250, b: 247, alpha: 1 },
      },
    })
      .composite([
        {
          input: Buffer.from(`
            <svg width="390" height="844" xmlns="http://www.w3.org/2000/svg">
              <rect width="390" height="54" fill="#141414"/>
              <text x="20" y="34" fill="#FFFFFF" font-family="sans-serif" font-size="16" font-weight="bold">${site.name}</text>
              <rect x="20" y="80" width="350" height="300" fill="#FFFFFF" stroke="#E4E3DE" stroke-width="2" rx="6"/>
              <text x="36" y="160" fill="#141414" font-family="sans-serif" font-size="22" font-weight="bold">${site.name}</text>
              <text x="36" y="200" fill="#5C5C58" font-family="sans-serif" font-size="14">Built by Obaidullah Miakhil</text>
              <rect x="36" y="240" width="140" height="40" fill="#1E4BD2" rx="6"/>
              <text x="56" y="265" fill="#FFFFFF" font-family="sans-serif" font-size="14" font-weight="bold">Visit Website</text>
            </svg>
          `),
          top: 0,
          left: 0,
        },
      ])
      .png()
      .toBuffer();
  }

  // Save WebP & AVIF versions
  const desktopWebp = path.join(outputDir, `${site.slug}-desktop.webp`);
  const desktopAvif = path.join(outputDir, `${site.slug}-desktop.avif`);
  const mobileWebp = path.join(outputDir, `${site.slug}-mobile.webp`);
  const mobileAvif = path.join(outputDir, `${site.slug}-mobile.avif`);

  await sharp(desktopRawBuffer)
    .webp({ quality: 80 })
    .toFile(desktopWebp);

  await sharp(desktopRawBuffer)
    .avif({ quality: 80 })
    .toFile(desktopAvif);

  await sharp(mobileRawBuffer)
    .webp({ quality: 80 })
    .toFile(mobileWebp);

  await sharp(mobileRawBuffer)
    .avif({ quality: 80 })
    .toFile(mobileAvif);

  console.log(`✓ Saved WebP and AVIF for ${site.slug} (desktop & mobile)`);
}

async function main() {
  console.log('Launching Playwright Chromium browser...');
  const preinstalledPath =
    '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';
  const browser = await chromium.launch(
    fs.existsSync(preinstalledPath)
      ? { headless: true, executablePath: preinstalledPath }
      : { headless: true }
  );

  try {
    for (const site of SITES) {
      await captureSite(browser, site);
    }
    console.log('\nAll project screenshots generated successfully.');
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error('Fatal error during screenshot capture:', err);
  process.exit(1);
});
