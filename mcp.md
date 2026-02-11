# Oxbow MCP

MCP server package: `oxbowui-mcp`

This server lets AI tools browse and install Oxbow blocks directly into your project.

## Install

Run directly with `npx`:

```bash
npx oxbowui-mcp
```

Or install globally:

```bash
npm install -g oxbowui-mcp
```

## Cursor setup

Create (or update) `.cursor/mcp.json` in your project:

```json
{
  "mcpServers": {
    "oxbow": {
      "command": "npx",
      "args": ["oxbowui-mcp"]
    }
  }
}
```

Restart Cursor (or reload MCP servers) after saving.

## Available MCP tools

- `list_components` - list all available blocks
- `search_components` - search blocks by keyword/category
- `get_component` - show block details and source
- `add_component` - copy a block into your project

## Example prompts

- "List available Oxbow components."
- "Find hero sections."
- "Show me pricing 3."
- "Add hero 1 to my project."

## Notes

- Installed files are copied into `src/components/oxbow/...` in the target project.
- CLI package is also available as `oxbowui`:

```bash
npx oxbowui list
npx oxbowui add hero 1
```
