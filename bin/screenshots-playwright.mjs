import fs from "node:fs";
import path from "node:path";
import { chromium } from "playwright";

const COMPONENTS_DIR = "src/components/oxbow";
const OUTPUT_DIR = "src/screenshots";
const BASE_URL = (process.env.SCREENSHOTS_BASE_URL || "http://127.0.0.1:4321").replace(
  /\/$/,
  "",
);
const CONCURRENCY = Number(process.env.SCREENSHOTS_CONCURRENCY || 4);
const NAV_TIMEOUT_MS = Number(process.env.SCREENSHOTS_NAV_TIMEOUT_MS || 30000);
const SERVER_TIMEOUT_MS = Number(process.env.SCREENSHOTS_SERVER_TIMEOUT_MS || 60000);

async function waitForServerReady(url, timeoutMs) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const response = await fetch(url);
      if (response.ok) return;
    } catch {}
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  throw new Error(`Timed out waiting for server at ${url}`);
}

function listAstroFiles() {
  return fs
    .readdirSync(COMPONENTS_DIR, { recursive: true })
    .filter((entry) => entry.endsWith(".astro"));
}

function screenshotName(file) {
  return file.replaceAll("/", "_").replace(/\.astro$/, "");
}

function componentPath(file) {
  return file.replace(/\.astro$/, "");
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const images = Array.from(document.images);
    await Promise.all(
      images.map((img) => {
        if (img.complete) return Promise.resolve();
        return new Promise((resolve) => {
          img.addEventListener("load", resolve, { once: true });
          img.addEventListener("error", resolve, { once: true });
          setTimeout(resolve, 2000);
        });
      }),
    );
  });
}

async function captureOne(browser, file) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const url = new URL(`/iframe/${componentPath(file)}?mode=light`, `${BASE_URL}/`).toString();

  try {
    const response = await page.goto(url, {
      waitUntil: "networkidle",
      timeout: NAV_TIMEOUT_MS,
    });

    const status = response?.status() ?? 0;
    if (status < 200 || status >= 300) {
      console.warn(`[skip:${status}] ${file} -> ${url}`);
      return;
    }

    await page.emulateMedia({ colorScheme: "light", reducedMotion: "reduce" });
    await page.evaluate(() => {
      localStorage.setItem("oxbow-playground-mode", "light");
    });
    await page.addStyleTag({
      content: `
        :root { color-scheme: light !important; }
        html, body { background: #fff !important; }
        * { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
      `,
    });

    await page.evaluate(async () => {
      if (document.fonts?.ready) await document.fonts.ready;
    });
    await waitForImages(page);
    await page.waitForTimeout(300);

    const contentHeight = await page.evaluate(() => document.body.scrollHeight || 720);
    await page.setViewportSize({ width: 1280, height: Math.max(720, contentHeight) });

    const outputFile = path.join(OUTPUT_DIR, `${screenshotName(file)}.png`);
    await page.screenshot({ path: outputFile, fullPage: true });
    console.log(`[ok] ${outputFile}`);
  } catch (error) {
    console.error(`[error] ${file}: ${error.message}`);
  } finally {
    await page.close();
  }
}

async function processInBatches(browser, files, batchSize) {
  for (let i = 0; i < files.length; i += batchSize) {
    const batch = files.slice(i, i + batchSize);
    await Promise.all(batch.map((file) => captureOne(browser, file)));
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  await waitForServerReady(BASE_URL, SERVER_TIMEOUT_MS);

  const files = listAstroFiles();
  const browser = await chromium.launch();
  try {
    await processInBatches(browser, files, CONCURRENCY);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
