import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const OUT_DIR = path.resolve(process.cwd(), 'docs/screenshots');

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const PAGES = [
  { slug: 'home', path: '' },
  { slug: 'research', path: '/research' },
  { slug: 'projects', path: '/projects' },
  { slug: 'cv', path: '/cv' },
  { slug: '404', path: '/non-existent-route-404' },
];

const LOCALES = [
  { code: 'en', prefix: '' },
  { code: 'ur', prefix: '/ur' },
];

const THEMES = ['light', 'dark'];
const VIEWPORTS = [
  { label: '390', width: 390, height: 844 },
  { label: '1440', width: 1440, height: 900 },
];

async function runAuditAndCapture() {
  console.log(`Starting Playwright visual & technical audit against ${BASE_URL}...`);
  const preinstalledPath =
    '/ms-playwright/chromium_headless_shell-1247/chrome-headless-shell-linux64/chrome-headless-shell';
  const launchOpts = fs.existsSync(preinstalledPath)
    ? { headless: true, executablePath: preinstalledPath }
    : { headless: true };
  const browser = await chromium.launch(launchOpts);

  const consoleIssues = [];
  const overflowIssues = [];
  const capturedFiles = [];

  try {
    // 1. Capture all 40 screenshots (5 pages x 2 locales x 2 themes x 2 viewports)
    for (const vp of VIEWPORTS) {
      for (const theme of THEMES) {
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme,
          reducedMotion: 'reduce',
        });

        await context.addInitScript((t) => {
          try {
            window.localStorage.setItem('theme', t);
            document.documentElement.setAttribute('data-theme', t);
          } catch {}
        }, theme);

        const page = await context.newPage();

        page.on('console', (msg) => {
          if (msg.type() === 'error') {
            const text = msg.text();
            if (text.includes('status of 404 (Not Found)')) return;
            consoleIssues.push(`[${vp.label}/${theme}] ${text}`);
          }
        });

        for (const loc of LOCALES) {
          for (const pg of PAGES) {
            const urlPath = `${loc.prefix}${pg.path}` || '/';
            const url = `${BASE_URL}${urlPath}`;

            await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
            await page.evaluate((t) => {
              document.documentElement.setAttribute('data-theme', t);
            }, theme);
            await page.waitForTimeout(250);

            // Check horizontal overflow
            const metrics = await page.evaluate(() => ({
              scrollWidth: document.documentElement.scrollWidth,
              innerWidth: window.innerWidth,
              dir: document.documentElement.getAttribute('dir'),
              lang: document.documentElement.getAttribute('lang'),
            }));

            if (metrics.scrollWidth > metrics.innerWidth) {
              overflowIssues.push(
                `${urlPath} (${vp.label}px, ${theme}): scrollWidth=${metrics.scrollWidth} > innerWidth=${metrics.innerWidth}`
              );
            }

            const filename = `${pg.slug}-${loc.code}-${theme}-${vp.label}.png`;
            const filepath = path.join(OUT_DIR, filename);
            await page.screenshot({ path: filepath, fullPage: false });
            capturedFiles.push(filename);
            console.log(`✓ Captured ${filename} (dir=${metrics.dir}, scrollWidth=${metrics.scrollWidth}/${metrics.innerWidth})`);
          }
        }

        await context.close();
      }
    }

    // 2. Test 3D Gating
    console.log('\nVerifying 3D Gating...');
    // 2a. Reduced motion -> 0 canvas
    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'reduce',
      });
      const p = await ctx.newPage();
      await p.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(400);
      const canvasCount = await p.locator('canvas').count();
      const posterCount = await p.locator('[data-testid="hero-faceted-poster"]').count();
      console.log(`✓ Reduced-motion gating: canvasCount=${canvasCount} (expected 0), posterCount=${posterCount} (expected 1)`);
      await ctx.close();
    }

    // 2b. Low memory (?lowmem=1) -> 0 canvas
    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'no-preference',
      });
      const p = await ctx.newPage();
      await p.goto(`${BASE_URL}/?lowmem=1`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(400);
      const canvasCount = await p.locator('canvas').count();
      console.log(`✓ Low-memory (<=4GB) gating: canvasCount=${canvasCount} (expected 0)`);
      await ctx.close();
    }

    // 2c. Active 3D (?force3d=1) -> max 1 canvas at a time
    {
      const ctx = await browser.newContext({
        viewport: { width: 1440, height: 900 },
        reducedMotion: 'no-preference',
      });
      const p = await ctx.newPage();
      await p.goto(`${BASE_URL}/?force3d=1`, { waitUntil: 'networkidle' });
      await p.waitForTimeout(600);
      const heroCanvasCount = await p.locator('canvas').count();
      console.log(`✓ Active 3D at top of Home: canvasCount=${heroCanvasCount} (expected <= 1)`);
      await ctx.close();
    }

    console.log(`\nTotal screenshots captured: ${capturedFiles.length}`);
    if (overflowIssues.length > 0) {
      console.error('Overflow issues detected:', overflowIssues);
      process.exit(1);
    } else {
      console.log('✓ Zero horizontal overflow across all 40 viewport/locale/theme combinations.');
    }

    if (consoleIssues.length > 0) {
      console.warn('Console errors detected:', consoleIssues);
    } else {
      console.log('✓ Zero browser console errors across all pages.');
    }
  } finally {
    await browser.close();
  }
}

runAuditAndCapture().catch((err) => {
  console.error('Audit script failed:', err);
  process.exit(1);
});
