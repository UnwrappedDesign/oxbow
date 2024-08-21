const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async function() {
  const dir = "src/components/windstatic/marketing";

  // create the screenshots directory if it doesn't exist
  if (!fs.existsSync('screenshots')) {
    fs.mkdirSync('screenshots');
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

    const filename = file.replace('/', '_');

    await page.screenshot({
      path: `screenshots/${filename}.png`,
      fullPage: true
    });
  }
  await browser.close();
}());
