const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

(async function () {
  const dir = "src/components/oxbow";
  const outputDir = "src/screenshots";

  // create the screenshots directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = await fs.promises.readdir(path.join(__dirname, `../${dir}`), {
    recursive: true,
  });
  const astroFiles = files.filter((file) => file.endsWith(".astro"));

  const browser = await puppeteer.launch();
  const concurrency = 4; // Number of parallel pages
  // small sleep helper — some puppeteer versions don't expose page.waitForTimeout
  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  // Helper to process a single file with minimal steps
  async function processFile(file) {
    const page = await browser.newPage();
    const filePath = `iframe/${dir}/${file}`;
    const url = `http://localhost:4321/${filePath}?mode=light`;
    // Initial viewport width; height will be adjusted to content
    await page.setViewport({ width: 1280, height: 800 });
    // Navigate and wait for the page to fully load
    // Use multiple wait conditions (some pages trigger client-side navigation)
    try {
      await page.goto(url, { waitUntil: ["domcontentloaded", "networkidle0"] });
    } catch (gotoErr) {
      // fallback to single wait if the above fails for some pages
      console.warn(
        `Primary navigation to ${url} failed, retrying with fallback wait:`,
        gotoErr.message || gotoErr,
      );
      try {
        await page.goto(url, { waitUntil: "networkidle0" });
      } catch (e) {
        console.warn(`Initial navigation to ${url} failed:`, e.message || e);
      }
    }

    // Small pause to let any client-side routing or lazy loading hooks settle
    await sleep(300);

    // Helper: scroll the page gradually to trigger lazy-loaded images and intersections
    async function autoScroll(page) {
      await page.evaluate(async () => {
        await new Promise((resolve) => {
          const distance = Math.floor(window.innerHeight * 0.9);
          const delay = 120;
          let totalHeight = 0;
          const timer = setInterval(() => {
            window.scrollBy(0, distance);
            totalHeight += distance;
            // stop when we've hit the bottom
            if (
              totalHeight >=
              document.body.scrollHeight - window.innerHeight
            ) {
              clearInterval(timer);
              // give any lazy-loaders a moment
              setTimeout(resolve, 250);
            }
          }, delay);
        });
      });
    }

    // Run the autoscroll to ensure images loading via IntersectionObserver kick in
    try {
      await autoScroll(page);
    } catch (err) {
      console.warn("Auto-scroll failed:", err.message || err);
    }

    // After scrolling, wait briefly and wait for visible images to load (with a timeout)
    await sleep(250);
    try {
      await page
        .evaluate(() => {
          const imgs = Array.from(document.images || []);
          return Promise.all(
            imgs.map((img) => {
              if (img.complete) return Promise.resolve();
              return new Promise((res) =>
                img.addEventListener("load", res, { once: true }),
              );
            }),
          );
        })
        .catch(() => {});
    } catch {
      // ignore image wait failures
    }

    // Measure full page height for complete screenshot with retries (some pages navigate)
    let contentHeight = 800;
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        contentHeight = await page.evaluate(() =>
          Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight || 0,
          ),
        );
        break;
      } catch (err) {
        // If the execution context was destroyed, the page likely navigated — wait and retry
        console.warn(
          `Unable to measure content height (attempt ${attempt}):`,
          err.message || err,
        );
        await sleep(200 * attempt);
      }
    }

    // Cap extremely tall pages to avoid huge screenshots (and optionally tile later)
    const MAX_HEIGHT = 16000; // adjust as needed
    const capped = contentHeight > MAX_HEIGHT;
    if (capped) {
      console.warn(
        `Content height ${contentHeight} exceeds cap ${MAX_HEIGHT}, capping for screenshot.`,
      );
      contentHeight = Math.min(contentHeight, MAX_HEIGHT);
    }

    await page.setViewport({ width: 1280, height: contentHeight });
    const filename = file.replace(/\//g, "_").replace(".astro", "");
    console.log(`Taking screenshot of: ${filename}`);
    // If we capped the height, take a screenshot of the viewport (which we set to the capped height).
    // Otherwise use fullPage to capture the full document.
    const screenshotOptions = {
      path: `${outputDir}/${filename}.png`,
      fullPage: !capped,
    };
    await page.screenshot(screenshotOptions);
    await page.close();
  }

  // Batch files for parallel processing
  async function processInBatches(files, batchSize) {
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      await Promise.all(
        batch.map((file) =>
          processFile(file).catch((err) =>
            console.error(`Error processing ${file}:`, err),
          ),
        ),
      );
    }
  }

  await processInBatches(astroFiles, concurrency);
  await browser.close();
})();
