import fs from "fs";
import path from "path";

export function getComponentCount() {
  const dir = path.resolve(process.cwd(), "src/components/oxbow");
  let count = 0;
  function walk(d) {
    const files = fs.readdirSync(d);
    for (const file of files) {
      const full = path.join(d, file);
      if (fs.statSync(full).isDirectory()) {
        walk(full);
      } else if (file.endsWith(".astro")) {
        count++;
      }
    }
  }
  walk(dir);
  return count;
}
