const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async function() {
  const dir = "src/components/oxbow";
  const outputDir = "src/screenshots";

  // create the screenshots directory if it doesn't exist
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const files = await fs.promises.readdir(path.join(__dirname, `../${dir}`), {recursive: true});
  const astroFiles = files.filter(file => file.endsWith('.astro'));

  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setViewport({ width: 1280, height: 720 }); // Set width but keep dynamic height

  for (const file of astroFiles) {
    const filePath = `iframe/${dir}/${file}`;

    await page.goto(`http://localhost:4321/${filePath}`, {
      waitUntil: 'networkidle2',
    });

    // Get the content height dynamically
    const contentHeight = await page.evaluate(() => {
      return document.body.scrollHeight;
    });

    // Set the viewport height dynamically based on content height
    await page.setViewport({ width: 1280, height: contentHeight });

    const filename = file
      .replace(/\//g, '_')
      .replace('.astro', '');

    console.log(`Taking screenshot of: ${filename}`);

    // Take screenshot with dynamic height
    await page.screenshot({
      path: `${outputDir}/${filename}.png`,
      fullPage: true
    });
  }

  await browser.close();
}());
