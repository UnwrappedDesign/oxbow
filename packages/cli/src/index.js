#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { getRegistryIndex, getComponent, resolveComponentName } from "./registry.js";

function printHelp() {
  console.log(`
oxbow - UI blocks for Astro

Commands:
  oxbow list [--json]
  oxbow add <name|alias> [variant] [--cwd <path>] [--yes]
  oxbow add --all [--cwd <path>] [--yes]

Examples:
  npx oxbow list
  npx oxbow add hero 1
  npx oxbow add pricing 3
  npx oxbow add marketing-heros-01
`);
}

function parseFlags(args) {
  const flags = { yes: false, all: false, cwd: process.cwd(), json: false };
  const positionals = [];

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (token === "--yes" || token === "-y") {
      flags.yes = true;
      continue;
    }
    if (token === "--all" || token === "-a") {
      flags.all = true;
      continue;
    }
    if (token === "--json") {
      flags.json = true;
      continue;
    }
    if (token === "--cwd") {
      flags.cwd = path.resolve(args[i + 1] || process.cwd());
      i += 1;
      continue;
    }
    positionals.push(token);
  }

  return { flags, positionals };
}

async function listCommand(args) {
  const { flags } = parseFlags(args);
  const index = await getRegistryIndex();

  if (flags.json) {
    console.log(JSON.stringify(index.components, null, 2));
    return;
  }

  const grouped = new Map();
  for (const component of index.components) {
    if (!grouped.has(component.section)) grouped.set(component.section, []);
    grouped.get(component.section).push(component);
  }

  console.log(`\nOxbow components (${index.components.length})\n`);
  for (const [section, components] of [...grouped.entries()].sort()) {
    console.log(`${section}:`);
    for (const item of components.sort((a, b) => a.name.localeCompare(b.name))) {
      const variantLabel = item.variant ? ` #${item.variant}` : "";
      console.log(`  - ${item.name}${variantLabel}  (${item.description})`);
    }
    console.log("");
  }
}

async function addComponentToProject(componentName, cwd, overwrite) {
  const component = await getComponent(componentName);
  const results = { written: [], skipped: [] };

  for (const file of component.files) {
    const targetPath = path.join(cwd, "src", "components", file.path);
    let exists = false;
    try {
      await fs.access(targetPath);
      exists = true;
    } catch {
      exists = false;
    }

    if (exists && !overwrite) {
      results.skipped.push(targetPath);
      continue;
    }

    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, file.content, "utf8");
    results.written.push(targetPath);
  }

  return results;
}

async function addCommand(args) {
  const { flags, positionals } = parseFlags(args);
  const index = await getRegistryIndex();
  const cwd = flags.cwd;

  const targetComponents = [];
  if (flags.all) {
    targetComponents.push(...index.components.map((component) => component.name));
  } else {
    const resolved = resolveComponentName(index, positionals);
    if (!resolved) {
      throw new Error(
        `Component not found for input "${positionals.join(" ")}". Try "npx oxbow list".`
      );
    }
    targetComponents.push(resolved);
  }

  const allWritten = [];
  const allSkipped = [];

  for (const componentName of targetComponents) {
    const outcome = await addComponentToProject(componentName, cwd, flags.yes);
    allWritten.push(...outcome.written);
    allSkipped.push(...outcome.skipped);
    console.log(`added ${componentName}`);
  }

  console.log(`\ncreated ${allWritten.length} file(s)`);
  if (allSkipped.length > 0) {
    console.log(`skipped ${allSkipped.length} existing file(s). Use --yes to overwrite.`);
  }
}

async function main() {
  const [, , command, ...rest] = process.argv;
  if (!command || command === "--help" || command === "-h") {
    printHelp();
    return;
  }

  if (command === "list") {
    await listCommand(rest);
    return;
  }

  if (command === "add") {
    await addCommand(rest);
    return;
  }

  printHelp();
  process.exitCode = 1;
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});

