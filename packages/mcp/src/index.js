#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REGISTRY_DIR =
  process.env.OXBOW_REGISTRY_PATH || path.resolve(__dirname, "..", "registry");

function normalizeInput(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\s+/g, " ");
}

async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export async function getRegistryIndex() {
  return readJson(path.join(REGISTRY_DIR, "index.json"));
}

export async function getComponent(name) {
  return readJson(path.join(REGISTRY_DIR, `${name}.json`));
}

export function resolveComponentName(index, value) {
  const query = normalizeInput(value);
  for (const component of index.components) {
    if (normalizeInput(component.name) === query) return component.name;
    for (const alias of component.aliases || []) {
      if (normalizeInput(alias) === query) return component.name;
    }
  }
  return null;
}

export async function addComponentFiles(component, cwd) {
  const added = [];
  for (const file of component.files) {
    const targetPath = path.join(cwd, "src", "components", file.path);
    await fs.mkdir(path.dirname(targetPath), { recursive: true });
    await fs.writeFile(targetPath, file.content, "utf8");
    added.push(targetPath);
  }
  return added;
}

const server = new McpServer({
  name: "oxbow",
  version: "0.0.1",
});

server.tool("list_components", "List available Oxbow blocks", {}, async () => {
  const index = await getRegistryIndex();
  const text = index.components
    .map((component) => `- ${component.name}: ${component.description}`)
    .join("\n");

  return {
    content: [{ type: "text", text: `# Oxbow blocks\n\n${text}` }],
  };
});

server.tool(
  "search_components",
  "Search Oxbow blocks by text",
  {
    query: z.string().describe("Search text"),
  },
  async ({ query }) => {
    const index = await getRegistryIndex();
    const needle = normalizeInput(query);
    const results = index.components.filter((component) => {
      const haystack = [
        component.name,
        component.description,
        component.category,
        component.section,
        ...(component.aliases || []),
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });

    if (results.length === 0) {
      return { content: [{ type: "text", text: "No blocks found." }] };
    }

    return {
      content: [
        {
          type: "text",
          text: results.map((item) => `- ${item.name}: ${item.description}`).join("\n"),
        },
      ],
    };
  }
);

server.tool(
  "get_component",
  "Get details and source for an Oxbow block",
  {
    name: z.string().describe("Block name or alias (for example 'hero 1')"),
  },
  async ({ name }) => {
    const index = await getRegistryIndex();
    const resolved = resolveComponentName(index, name);
    if (!resolved) {
      return {
        content: [{ type: "text", text: `Block "${name}" not found.` }],
      };
    }

    const component = await getComponent(resolved);
    const files = component.files
      .map((file) => `## ${file.path}\n\n\`\`\`astro\n${file.content}\n\`\`\``)
      .join("\n\n");

    return {
      content: [
        {
          type: "text",
          text: `# ${component.name}\n\n${component.description}\n\n${files}`,
        },
      ],
    };
  }
);

server.tool(
  "add_component",
  "Copy an Oxbow block into a local project",
  {
    name: z.string().describe("Block name or alias (for example 'pricing 3')"),
    cwd: z.string().optional().describe("Project directory, defaults to process.cwd()"),
  },
  async ({ name, cwd }) => {
    const index = await getRegistryIndex();
    const resolved = resolveComponentName(index, name);
    if (!resolved) {
      return {
        content: [{ type: "text", text: `Block "${name}" not found.` }],
      };
    }

    const component = await getComponent(resolved);
    const targetDir = cwd ? path.resolve(cwd) : process.cwd();
    const files = await addComponentFiles(component, targetDir);

    return {
      content: [
        {
          type: "text",
          text: `Added ${component.name}\n\n${files.map((file) => `- ${file}`).join("\n")}`,
        },
      ],
    };
  }
);

export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

if (process.argv[1] && path.resolve(process.argv[1]) === __filename) {
  await startServer();
}

