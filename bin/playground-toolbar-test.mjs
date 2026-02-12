/**
 * Playground toolbar interaction test
 * Navigates to /playground/marketing/bento-grids/01, exercises toolbar,
 * collects console errors and network failures, reports which interaction fails first.
 */
import { chromium } from "playwright";

const BASE_URL = "http://localhost:4321";
const TEST_URL = `${BASE_URL}/playground/marketing/bento-grids/01`;

const consoleLogs = [];
const consoleErrors = [];
const networkFailures = [];

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
  const page = await context.newPage();

  // Collect console messages
  page.on("console", (msg) => {
    const type = msg.type();
    const text = msg.text();
    const location = msg.location();
    const entry = {
      type,
      text,
      url: location?.url || "",
      line: location?.lineNumber || 0,
      col: location?.columnNumber || 0,
    };
    if (type === "error") {
      consoleErrors.push(entry);
    }
    consoleLogs.push(entry);
  });

  // Collect failed network requests
  page.on("requestfailed", (request) => {
    networkFailures.push({
      url: request.url(),
      failure: request.failure()?.errorText || "unknown",
    });
  });

  const failedInteractions = [];
  let firstFailure = null;

  const byTooltip = (text) =>
    page.locator("div.group").filter({ has: page.getByText(text, { exact: true }) }).locator("button").first();

  const tryClick = async (name, locatorOrSelector) => {
    try {
      const loc =
        typeof locatorOrSelector === "string"
          ? page.locator(locatorOrSelector)
          : locatorOrSelector;
      await loc.waitFor({ state: "visible", timeout: 3000 });
      await loc.click({ timeout: 2000 });
      await page.waitForTimeout(200);
      return { name, success: true };
    } catch (err) {
      if (!firstFailure) firstFailure = name;
      failedInteractions.push({ name, error: err.message });
      return { name, success: false, error: err.message };
    }
  };

  try {
    console.log("Navigating to", TEST_URL);
    const response = await page.goto(TEST_URL, {
      waitUntil: "networkidle",
      timeout: 15000,
    });
    if (!response?.ok()) {
      console.error("Page failed to load:", response?.status());
      process.exitCode = 1;
      return;
    }

    // Wait for React hydration (PlaygroundIsland)
    await page.waitForSelector("#playground-host-1, [id^=playground-host]", {
      timeout: 5000,
    });
    await page.waitForTimeout(500);

    // 1. Preview/Code toggle - click Code tab
    console.log("\n1. Clicking Code tab (preview/code toggle)...");
    await tryClick("Code tab", byTooltip("Code"));
    await page.waitForTimeout(300);
    const codePaneVisible = await page.isVisible(".code-pane");
    if (!codePaneVisible && !firstFailure) {
      firstFailure = "Code tab";
      failedInteractions.push({
        name: "Code tab",
        error: "Code pane did not become visible after click (hydration may have failed)",
      });
    }

    // 2. Click Preview tab to go back
    console.log("2. Clicking Preview tab...");
    await tryClick("Preview tab", byTooltip("Preview"));
    await page.waitForTimeout(300);

    // 3. Viewport buttons (mobile, tablet, desktop)
    console.log("3. Viewport buttons...");
    await tryClick("Mobile viewport", byTooltip("Mobile view"));
    await tryClick("Tablet viewport", byTooltip("Tablet view"));
    await tryClick("Desktop viewport", byTooltip("Desktop view"));

    // 4. Light/Dark buttons
    console.log("4. Light/Dark mode buttons...");
    await tryClick("Light mode", byTooltip("Light mode"));
    await tryClick("Dark mode", byTooltip("Dark mode"));

    // 5. Copy/Open buttons
    console.log("5. Copy/Open buttons...");
    await tryClick("Copy code", byTooltip("Copy code"));
    await tryClick("Download", byTooltip("Download code"));
    await tryClick("Open in new window", byTooltip("Open in new window"));

    // 6. Category/Block/Number dropdowns (right side nav)
    console.log("6. Nav dropdowns...");
    await tryClick("Category dropdown", page.getByRole("button", { name: /Marketing/i }));
    await page.waitForTimeout(300);
    await tryClick("Block dropdown", page.getByRole("button", { name: /Bento Grids/i }));
    await page.waitForTimeout(300);
    await tryClick("Block number dropdown", page.locator('button').filter({ hasText: /#\s*\d+/ }));

    // 7. Click inside iframe (component controls)
    console.log("7. Click inside iframe...");
    const iframe = await page.$('iframe[id^="iframe-"]');
    if (iframe) {
      const frame = await iframe.contentFrame();
      if (frame) {
        try {
          const btn = frame.locator('button:has-text("Try it now")');
          await btn.waitFor({ state: "visible", timeout: 2000 });
          await btn.click();
        } catch (e) {
          if (!firstFailure) firstFailure = "iframe click";
          failedInteractions.push({ name: "iframe click", error: e.message });
        }
      }
    }

    // Ensure we're on preview tab for iframe visibility
    await tryClick("Preview tab again", byTooltip("Preview"));
  } catch (err) {
    console.error("Test error:", err.message);
  } finally {
    await browser.close();
  }

  // --- Report ---
  console.log("\n" + "=".repeat(60));
  console.log("PLAYGROUND TOOLBAR TEST REPORT");
  console.log("=".repeat(60));

  console.log("\n## Console errors (exact: message + url + line)");
  if (consoleErrors.length === 0) {
    console.log("(none)");
  } else {
    consoleErrors.forEach((e, i) => {
      console.log(
        `  ${i + 1}. ${e.text}\n     ${e.url || "inline"}:${e.line}:${e.col}`
      );
    });
  }

  console.log("\n## Network failures");
  if (networkFailures.length === 0) {
    console.log("(none)");
  } else {
    networkFailures.forEach((f, i) => {
      console.log(`  ${i + 1}. ${f.url}\n     ${f.failure}`);
    });
  }

  console.log("\n## Failed interactions (first failure wins)");
  if (failedInteractions.length === 0) {
    console.log("(none - all clicks succeeded)");
  } else {
    console.log(`  First failure: ${firstFailure || "unknown"}`);
    failedInteractions.forEach((f) => {
      console.log(`  - ${f.name}: ${f.error}`);
    });
  }

  console.log("\n## Toolbar elements tested");
  console.log(
    "  - preview/code toggle, viewport (mobile/tablet/desktop),"
  );
  console.log("  - light/dark, copy/download/open, nav dropdowns (cat/block/#),");
  console.log("  - iframe component controls (Try it now)");
}

main().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
