# oxbowui-mcp

Model Context Protocol server for Oxbow UI blocks.

## Install

```bash
npm install -g oxbowui-mcp
```

Or run with npx:

```bash
npx oxbowui-mcp
```

## Cursor config

Create `.cursor/mcp.json` in your project:

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

## Tools

- `list_components`
- `search_components`
- `get_component`
- `add_component`
