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
      // Wait for fonts to load
      await page.evaluateHandle("document.fonts.ready");

      // After navigation, aggressively force light mode in the document itself.
      await page.addStyleTag({
        content: `:root{color-scheme: light !important}
          html,body{background:#fff !important}
          /* Force proper font rendering */
          * { -webkit-font-smoothing: antialiased !important; -moz-osx-font-smoothing: grayscale !important; }
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

      // Wait for images to load
      await page.evaluate(async () => {
        const images = Array.from(document.images);
        await Promise.all(
          images.map((img) => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.addEventListener("load", resolve);
              img.addEventListener("error", resolve); // resolve even on error to continue
              setTimeout(resolve, 2000); // timeout after 2s
            });
          }),
        );
      });

      // Give the page more time to reflow and render properly
      await new Promise((r) => setTimeout(r, 500));
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
