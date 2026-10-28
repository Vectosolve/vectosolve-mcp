# @vectosolve/mcp

[VectoSolve](https://vectosolve.com) MCP Server — use AI image tools (vectorize, remove background, upscale, generate logos) directly from Claude Code, Cursor, Windsurf, and other MCP-compatible clients.

## Hosted remote server (no API key)

VectoSolve also runs a public remote MCP server at `https://vectosolve.com/api/mcp` (Streamable HTTP, no sign-in, no API key). It exposes one read-only tool, `vectorize`: give it a public link to a PNG, JPG, WebP or GIF image and it returns a PNG preview and the complete file as SVG, DXF (R12, millimetres, for laser cutters, CNC routers and CAD) or EPS. Modes: `standard`, `laser`, `cricut`, `centerline`.

Add it as a custom connector in Claude, or in any client that supports remote servers:

```json
{
  "mcpServers": {
    "vectosolve": { "type": "http", "url": "https://vectosolve.com/api/mcp" }
  }
}
```

Documentation: [vectosolve.com/integrations/mcp](https://vectosolve.com/integrations/mcp). Official MCP Registry name: `io.github.Vectosolve/vectosolve`.

The npm package below is the local stdio server, which uses your own API key and adds background removal, upscaling and logo generation.

## Quick Setup

Add to your MCP client config (e.g. `.mcp.json` or Claude Code settings):

```json
{
  "mcpServers": {
    "vectosolve": {
      "command": "npx",
      "args": ["-y", "@vectosolve/mcp"],
      "env": {
        "VECTOSOLVE_API_KEY": "vs_xxx"
      }
    }
  }
}
```

Get your API key at [vectosolve.com/developers](https://vectosolve.com/developers).

## Available Tools

The server exposes **4 tools** over stdio:

| Tool | Parameters | Cost |
|------|-----------|------|
| `vectorize` | `file_path` \| `image_url` | 0.20 credits / image |
| `remove_background` | `file_path` \| `image_url` | $0.07 / image |
| `upscale` | `file_path` \| `image_url` | $0.15 / image |
| `generate_logo` | `prompt`, `style?`, `colors?`, `num_variants?` | $0.40 / variant |

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
"Create 4 line-art logo variants for a coffee shop"
```

**Parameters:**
- `prompt` — Text description of the logo (required, min 3 chars)
- `style` — `vector_illustration` (default), `vector_illustration/line_art`, `vector_illustration/engraving`, `vector_illustration/linocut`
- `colors` — Brand colors as RGB objects, e.g. `[{"r":0,"g":144,"b":255}, {"r":28,"g":183,"b":33}]` (max 5)
- `num_variants` — 1, 2, or 4 (each variant is billed)


**Cost:** $0.40 per logo variant

> Need `colors` / `palette` hard-caps, DXF/DST/PES exports, or `mode` (cricut/laser/embroidery)? Those live on the full REST API — call `POST https://vectosolve.com/api/v1/vectorize` directly. See [vectosolve.com/developers](https://vectosolve.com/developers).

## Input Methods

The image tools (`vectorize`, `remove_background`, `upscale`) accept:
- **`file_path`** — Local file path (e.g. `./photo.png`)
- **`image_url`** — Public URL (e.g. `https://example.com/image.png`)

Provide exactly one of the two. `generate_logo` takes a text `prompt` instead.

## Pricing

Every tool call uses credits from your [VectoSolve](https://vectosolve.com) account. The response includes credit usage and remaining balance.

Purchase credits or subscribe at [vectosolve.com/pricing](https://vectosolve.com/pricing).

## Registries

This server is listed on:

- [MCP Registry](https://registry.modelcontextprotocol.io) (official) — `io.github.Vectosolve/mcp`; hosted remote server: `io.github.Vectosolve/vectosolve`
- [Glama](https://glama.ai/mcp/servers)
- [Smithery](https://smithery.ai)

See [`PUBLISH-TO-REGISTRIES.md`](./PUBLISH-TO-REGISTRIES.md) for the publish/refresh runbook.

## Links

- [VectoSolve Website](https://vectosolve.com)
- [API Documentation](https://vectosolve.com/developers)
- [Pricing](https://vectosolve.com/pricing)
- [TypeScript SDK](https://www.npmjs.com/package/@vectosolve/sdk)
- [CLI Tool](https://www.npmjs.com/package/vectosolve)

## License

MIT
