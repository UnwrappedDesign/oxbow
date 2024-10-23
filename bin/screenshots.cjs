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

  await page.setViewport({ width: 1280, height: 720 });

  for (const file of astroFiles) {
    const path = `iframe/${dir}/${file}`;

    await page.goto(`http://localhost:4321/${path}`, {
      waitUntil: 'networkidle2',
    });

    const filename = file
      .replace(/\//g, '_')
      .replace('.astro', '');


    console.log(filename);

    await page.screenshot({
      path: `${outputDir}/${filename}.png`,
      fullPage: true
    });
  }
  await browser.close();
}());
