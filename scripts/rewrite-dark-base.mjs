#!/usr/bin/env node
/**
 * Rewrite script: remove dark: prefixes and replace base-* with semantic tokens
 * Scope: src (astro, tsx, ts, css)
 */

import { readFileSync, writeFileSync } from "fs";
import { join } from "path";
import { readdirSync, statSync } from "fs";

function* walkDir(dir, exts) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      if (name !== "node_modules" && name !== ".git") {
        yield* walkDir(full, exts);
      }
    } else if (exts.some((e) => name.endsWith(e))) {
      yield full;
    }
  }
}

function rewrite(content) {
  let out = content;

  // 1. Remove dark: prefix - only when followed by a Tailwind-like utility
  // Skip: string literals (g1 is quote), regex (g1 starts with /), object keys (dark: )
  out = out.replace(/dark:(\S+)/g, (full, g1) => {
    if (g1 === '"' || g1 === "'" || g1.startsWith("/")) return full;
    return g1;
  });

  // 2. Replace base-* utility classes with semantic tokens
  // text-base-*
  out = out.replace(/\btext-base-(900|950|100|200|50)\b/g, "text-foreground");
  out = out.replace(
    /\btext-base-(300|400|500|600|700)\b/g,
    "text-muted-foreground",
  );

  // bg-base-*
  out = out.replace(/\bbg-base-(950|900|800)\b/g, "bg-background");
  out = out.replace(
    /\bbg-base-(700|600|500|400|300|200|100|50|25)(\/[0-9]+)?\b/g,
    "bg-muted$2",
  );

  // border-base-*, ring-base-*, outline-base-*, divide-base-*
  out = out.replace(/\bborder-base-[0-9]+\b/g, "border-border");
  out = out.replace(/\bring-base-[0-9]+\b/g, "ring-border");
  out = out.replace(/\boutline-base-[0-9]+\b/g, "outline-border");
  out = out.replace(/\bdivide-base-[0-9]+\b/g, "divide-border");

  // focus:outline-base-*, focus:ring-offset-base-* etc
  out = out.replace(/\bfocus:outline-base-[0-9]+\b/g, "focus:outline-border");
  out = out.replace(
    /\bfocus:ring-offset-base-[0-9]+\b/g,
    "focus:ring-offset-background",
  );
  out = out.replace(
    /\bplaceholder-base-[0-9]+\b/g,
    "placeholder-muted-foreground",
  );

  // !outline-base-* (important modifier)
  out = out.replace(/\b!outline-base-[0-9]+\b/g, "!outline-border");

  // dark: variants of base-* - strip dark: and apply same mapping (dark: already removed above, but some may remain if in different pass order)
  // Actually dark: is removed first, so we'd have e.g. bg-base-800 from "dark:bg-base-800" -> then we map bg-base-800 to bg-background
  // So the order is correct: first remove dark:, then replace base-*

  // 3. Replace text-accent-600, text-accent-400, text-accent-200, etc. with text-accent
  out = out.replace(/\btext-accent-[0-9]+\b/g, "text-accent");

  return out;
}

const srcDir = join(process.cwd(), "src");
const exts = [".astro", ".tsx", ".ts", ".css"];
const exclude = ["Playground.astro"]; // Contains dark: in string literals and regex
const files = [...walkDir(srcDir, exts)].filter(
  (f) => !exclude.some((e) => f.endsWith(e)),
);

let changed = 0;
for (const file of files) {
  const content = readFileSync(file, "utf8");
  const next = rewrite(content);
  if (content !== next) {
    writeFileSync(file, next);
    changed++;
    console.log("Updated:", file);
  }
}

console.log(`\nDone. ${changed} files changed.`);
