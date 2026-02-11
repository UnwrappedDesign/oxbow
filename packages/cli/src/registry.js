import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PACKAGED_REGISTRY_DIR = path.resolve(__dirname, "..", "registry");
const REGISTRY_PATH = process.env.OXBOW_REGISTRY_PATH || PACKAGED_REGISTRY_DIR;

export async function getRegistryIndex() {
  const indexPath = path.join(REGISTRY_PATH, "index.json");
  const raw = await fs.readFile(indexPath, "utf8");
  return JSON.parse(raw);
}

export async function getComponent(name) {
  const componentPath = path.join(REGISTRY_PATH, `${name}.json`);
  const raw = await fs.readFile(componentPath, "utf8");
  return JSON.parse(raw);
}

function normalizeInput(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

export function resolveComponentName(index, args) {
  if (args.length === 0) return null;

  const byName = new Map();
  const byAlias = new Map();

  for (const component of index.components) {
    byName.set(normalizeInput(component.name), component.name);
    for (const alias of component.aliases || []) {
      const normalizedAlias = normalizeInput(alias);
      if (!byAlias.has(normalizedAlias)) {
        byAlias.set(normalizedAlias, component.name);
      }
    }
  }

  const joined = normalizeInput(args.join(" "));
  if (byName.has(joined)) return byName.get(joined);
  if (byAlias.has(joined)) return byAlias.get(joined);

  if (args.length >= 2) {
    const maybeVariant = Number(args[args.length - 1]);
    if (Number.isInteger(maybeVariant)) {
      const label = normalizeInput(args.slice(0, -1).join(" "));
      const composed = normalizeInput(`${label} ${maybeVariant}`);
      if (byAlias.has(composed)) return byAlias.get(composed);
    }
  }

  return null;
}

