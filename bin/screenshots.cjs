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

  // Helper to process a single file
  async function processFile(file) {
    const page = await browser.newPage();
    // Ensure a light theme from the very first script
    await page.evaluateOnNewDocument(() => {
      try {
        // Persist any app-specific preference the previews might read
        localStorage.setItem("oxbow-playground-mode", "light");
      } catch {}
      try {
        // Force matchMedia to resolve light for color scheme
        const mq = window.matchMedia;
        window.matchMedia = (query) => {
          if (
            typeof query === "string" &&
            /prefers-color-scheme\s*:\s*dark/i.test(query)
          ) {
            return {
              matches: false,
              media: query,
              addListener() {},
              removeListener() {},
              addEventListener() {},
              removeEventListener() {},
              onchange: null,
              dispatchEvent() {
                return false;
              },
            };
          }
          if (
            typeof query === "string" &&
            /prefers-color-scheme\s*:\s*light/i.test(query)
          ) {
            return {
              matches: true,
              media: query,
              addListener() {},
              removeListener() {},
              addEventListener() {},
              removeEventListener() {},
              onchange: null,
              dispatchEvent() {
                return false;
              },
            };
          }
          return mq.call(window, query);
        };
      } catch {}
    });
    await page.emulateMediaFeatures([
      { name: "prefers-color-scheme", value: "light" },
      { name: "color-gamut", value: "srgb" },
    ]);
    await page.setViewport({ width: 1280, height: 720 });

    const filePath = `iframe/${dir}/${file}`;
    const url = `http://localhost:4321/${filePath}?mode=light`;

    await page.goto("about:blank");
    await page.evaluate(() => {
      try {
        localStorage.setItem("oxbow-playground-mode", "light");
      } catch {}
    });

    await page.goto(url, {
      waitUntil: "networkidle2",
    });

    try {
      // After navigation, aggressively force light mode in the document itself.
      // Some previews include a nested `.dark` scope for demonstration; strip it.
      await page.addStyleTag({
        content: `:root{color-scheme: light !important}
          html,body{background:#fff !important}
          /* Neutralize hard-coded dark tokens often used in demos */
          .bg-black, .bg-zinc-950, .bg-zinc-900, .bg-neutral-950, .bg-neutral-900, .bg-slate-950, .bg-slate-900 { background-color: #fff !important; }
          .text-white { color: #0a0a0a !important; }
          .ring-zinc-900, .ring-zinc-800 { --tw-ring-color: rgba(0,0,0,0.10) !important; }
        `,
      });
      await page.evaluate(() => {
        try {
          const d = document;
          const html = d.documentElement;
          const body = d.body;
          html?.classList?.remove("dark");
          body?.classList?.remove("dark");
          if (html?.getAttribute) html.removeAttribute("data-theme");
          if (body?.getAttribute) body.removeAttribute("data-theme");
          // Remove any nested `.dark` scope elements used to demo dark variants
          d.querySelectorAll(".dark").forEach((el) => {
            try {
              el.classList.remove("dark");
            } catch {}
          });
          // Normalize any explicit dark data-theme attributes
          d.querySelectorAll('[data-theme="dark"]').forEach((el) => {
            try {
              el.removeAttribute("data-theme");
            } catch {}
          });
        } catch {}
      });
      // Give the page a brief moment to reflow after class/attr changes
      await new Promise((r) => setTimeout(r, 50));
    } catch (error) {
      console.log(
        `Failed to apply light mode styles for ${file}: ${error.message}`,
      );
    }

    try {
      const contentHeight = await page.evaluate(() => {
        return document.body.scrollHeight;
      });
      await page.setViewport({ width: 1280, height: contentHeight });

      const filename = file.replace(/\//g, "_").replace(".astro", "");
      console.log(`Taking screenshot of: ${filename}`);
      await page.screenshot({
        path: `${outputDir}/${filename}.png`,
        fullPage: true,
      });
    } catch (error) {
      console.log(`Failed to take screenshot for ${file}: ${error.message}`);
    }
    await page.close();
  }

  // Batch files for parallel processing
  async function processInBatches(files, batchSize) {
    for (let i = 0; i < files.length; i += batchSize) {
      const batch = files.slice(i, i + batchSize);
      const results = await Promise.allSettled(batch.map(processFile));
      results.forEach((result, index) => {
        if (result.status === "rejected") {
          console.log(
            `Batch ${Math.floor(i / batchSize) + 1}, file ${index}: ${result.reason}`,
          );
        }
      });
    }
  }

  await processInBatches(astroFiles, concurrency);
  await browser.close();
})();
