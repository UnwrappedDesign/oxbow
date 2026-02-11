#!/usr/bin/env node
const fs = require("node:fs/promises");
const path = require("node:path");

const ROOT = path.resolve(__dirname, "..");
const COMPONENTS_ROOT = path.join(ROOT, "src", "components", "oxbow");
const OUTPUT_DIRS = [
  path.join(ROOT, "public", "registry"),
  path.join(ROOT, "packages", "cli", "registry"),
  path.join(ROOT, "packages", "mcp", "registry"),
];

const VERSION = "0.0.1";

function toPosix(p) {
  return p.split(path.sep).join("/");
}

function normalizeSlug(value) {
  return value
    .toLowerCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function singularize(word) {
  if (word.endsWith("ies")) return `${word.slice(0, -3)}y`;
  if (word.endsWith("heros")) return "hero";
  if (word.endsWith("heroes")) return "hero";
  if (word.endsWith("ses")) return word.slice(0, -2);
  if (word.endsWith("s")) return word.slice(0, -1);
  return word;
}

function buildAliases(category, section, variant) {
  const aliases = new Set();
  const sectionSlug = normalizeSlug(section);
  const sectionWords = sectionSlug.replace(/-/g, " ");
  const sectionSingular = singularize(sectionSlug);
  const singularWords = sectionSingular.replace(/-/g, " ");
  const twoDigit = String(variant).padStart(2, "0");

  const seeds = new Set([
    sectionSlug,
    sectionWords,
    sectionSingular,
    singularWords,
  ]);

  if (sectionSlug.includes("hero") || sectionSlug.includes("heros")) {
    seeds.add("hero");
    seeds.add("heroes");
  }

  if (category === "marketing" && sectionSlug.includes("creative-heros")) {
    seeds.add("creative-hero");
    seeds.add("creative hero");
  }

  for (const seed of seeds) {
    if (!seed) continue;
    aliases.add(seed);
    aliases.add(`${seed} ${variant}`);
    aliases.add(`${seed}-${variant}`);
    aliases.add(`${seed}-${twoDigit}`);
  }

  const normalized = new Set(
    [...aliases].map((item) => normalizeSlug(item).replace(/-/g, " "))
  );
  return [...normalized];
}

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const results = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...(await walk(fullPath)));
    } else if (entry.isFile() && entry.name.endsWith(".astro")) {
      results.push(fullPath);
    }
  }

  return results;
}

function extractDescription(content, fallback) {
  const match = content.match(/export const description = "([^"]+)"/);
  return match?.[1]?.trim() || fallback;
}

async function buildRegistry() {
  const files = await walk(COMPONENTS_ROOT);
  const components = [];

  for (const filePath of files) {
    const content = await fs.readFile(filePath, "utf8");
    const relativePath = toPosix(path.relative(COMPONENTS_ROOT, filePath));
    const segments = relativePath.split("/");
    const fileName = segments[segments.length - 1];
    const baseName = fileName.replace(/\.astro$/, "");
    const isNumericVariant = /^\d+$/.test(baseName);

    const category = normalizeSlug(segments[0] || "misc");
    const section = normalizeSlug(segments[1] || "general");
    const variant = isNumericVariant ? Number(baseName) : null;
    const canonicalName = isNumericVariant
      ? `${section}-${String(variant).padStart(2, "0")}`
      : normalizeSlug(segments.join("-").replace(/\.astro$/, ""));
    const fallbackDescription = `${section} block ${baseName}`;
    const description = extractDescription(content, fallbackDescription);

    const aliases = variant
      ? buildAliases(category, section, variant)
      : [canonicalName];

    const component = {
      name: canonicalName,
      type: "component",
      description,
      category,
      section,
      variant,
      aliases,
      files: [
        {
          name: fileName,
          path: `oxbow/${relativePath}`,
          content,
        },
      ],
      dependencies: [],
      devDependencies: [],
      registryDependencies: [],
    };

    components.push(component);
  }

  components.sort((a, b) => a.name.localeCompare(b.name));

  const index = {
    name: "oxbow",
    version: VERSION,
    components: components.map((component) => ({
      name: component.name,
      description: component.description,
      category: component.category,
      section: component.section,
      variant: component.variant,
      aliases: component.aliases,
    })),
  };

  for (const outputDir of OUTPUT_DIRS) {
    await fs.rm(outputDir, { recursive: true, force: true });
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(
      path.join(outputDir, "index.json"),
      `${JSON.stringify(index, null, 2)}\n`,
      "utf8"
    );

    for (const component of components) {
      const filePath = path.join(outputDir, `${component.name}.json`);
      await fs.writeFile(filePath, `${JSON.stringify(component, null, 2)}\n`, "utf8");
    }
  }

  console.log(
    `Built ${components.length} components in ${OUTPUT_DIRS.length} registry locations.`
  );
}

buildRegistry().catch((error) => {
  console.error("Failed to build registry:", error);
  process.exit(1);
});
