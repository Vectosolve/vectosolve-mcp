# @vectosolve/mcp

[VectoSolve](https://vectosolve.com) MCP Server — use AI image tools (vectorize, remove background, upscale, generate logos) directly from Claude Code, Cursor, Windsurf, and other MCP-compatible clients.

## Quick Setup

Add to your MCP client config (e.g. `.mcp.json` or Claude Code settings):

```json
{
  "mcpServers": {
    "vectosolve": {
      "command": "npx",
      "args": ["@vectosolve/mcp"],
      "env": {
        "VECTOSOLVE_API_KEY": "vs_xxx"
      }
    }
  }
}
```

Get your API key at [vectosolve.com/developers](https://vectosolve.com/developers).

## Available Tools

### `vectorize`

Convert a raster image (PNG, JPG, WebP) to clean SVG vector format.

```
"Vectorize this image" + attach file
"Convert https://example.com/photo.png to SVG"
```

**Cost:** $0.20 per image

### `remove_background`

Remove the background from an image. Returns a transparent PNG.

```
"Remove the background from this product photo"
```

**Cost:** $0.07 per image

### `upscale`

Upscale an image to higher resolution using AI.

```
"Upscale this low-res icon"
```

**Cost:** $0.15 per image

### `generate_logo`

Generate SVG logos from a text description.

```
"Generate a modern tech startup logo with blue and green colors"
"Create 4 icon-style logo variants for a coffee shop"
```

**Parameters:**
- `prompt` — Text description of the logo
- `style` — `vector_illustration`, `icon`, `line_art`, `engraving`, `line_circuit`, `linocut`
- `model` — `v3` (best quality) or `v2`
- `colors` — Brand colors as hex array, e.g. `["#0090ff", "#1cb721"]`
- `num_variants` — 1, 2, or 4

**Cost:** $0.40 (v3) or $0.25 (v2) per logo

## Input Methods

All image tools accept:
- **`file_path`** — Local file path (e.g. `./photo.png`)
- **`image_url`** — Public URL (e.g. `https://example.com/image.png`)

## Pricing

Every tool call uses credits from your [VectoSolve](https://vectosolve.com) account. The response includes credit usage and remaining balance.

Purchase credits or subscribe at [vectosolve.com/pricing](https://vectosolve.com/pricing).

## Links

- [VectoSolve Website](https://vectosolve.com)
- [API Documentation](https://vectosolve.com/developers)
- [Pricing](https://vectosolve.com/pricing)
- [TypeScript SDK](https://www.npmjs.com/package/@vectosolve/sdk)
- [CLI Tool](https://www.npmjs.com/package/vectosolve)

## License

MIT
