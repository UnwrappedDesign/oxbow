const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async function() {
  const dir = "src/components/oxbow";
  const outputDir = "src/screenshots";

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = await fs.promises.readdir(path.join(__dirname, `../${dir}`), { recursive: true });
  const astroFiles = files.filter(file => file.endsWith('.astro'));

  const browser = await puppeteer.launch({
    // Use the new headless mode (still headless, but with full GPU/text AA support)
    headless: 'new',
    args: [
      '--force-device-scale-factor=2',    // double CSS→physical pixels
      '--high-dpi-support=1',
      '--enable-gpu-rasterization',      // turn GPU rasterization back on
      '--enable-font-antialiasing',      // ensure subpixel AA on text
    ],
    defaultViewport: {
      width: 1280,
      height: 720,
      deviceScaleFactor: 2               // match the force-device-scale-factor
    }
  });

  const page = await browser.newPage();
  // (reapply just to be safe)
  await page.setViewport({ width: 1280, height: 720, deviceScaleFactor: 2 });

  for (const file of astroFiles) {
    const filePath = `iframe/${dir}/${file}`;
    await page.goto(`http://localhost:4321/${filePath}`, { waitUntil: 'networkidle2' });

    // grab full-content height
    const contentHeight = await page.evaluate(() => document.body.scrollHeight);

    await page.setViewport({
      width: 1280,
      height: contentHeight,
      deviceScaleFactor: 2
    });

    const filename = file.replace(/\//g, '_').replace('.astro', '');
    console.log(`Taking screenshot of: ${filename}`);

    await page.screenshot({
      path: `${outputDir}/${filename}.png`,
      fullPage: true
    });
  }

  await browser.close();
})();
