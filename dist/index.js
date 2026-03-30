#!/usr/bin/env node
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import { readFileSync } from 'fs';
import { basename, extname } from 'path';
function mimeFromPath(p) {
    switch (extname(p).toLowerCase()) {
        case '.png': return 'image/png';
        case '.jpg':
        case '.jpeg': return 'image/jpeg';
        case '.webp': return 'image/webp';
        case '.gif': return 'image/gif';
        case '.svg': return 'image/svg+xml';
        default: return 'application/octet-stream';
    }
}
const API_BASE = process.env.VECTOSOLVE_BASE_URL || 'https://vectosolve.com/api/v1';
const API_KEY = process.env.VECTOSOLVE_API_KEY || '';
// ── Helpers ──
async function apiFormData(endpoint, input) {
    const form = new FormData();
    if (input.file_path) {
        const buf = readFileSync(input.file_path);
        const blob = new Blob([buf], { type: mimeFromPath(input.file_path) });
        form.append('file', blob, basename(input.file_path));
    }
    else if (input.image_url) {
        form.append('image_url', input.image_url);
    }
    else {
        throw new Error('Provide either file_path or image_url');
    }
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${API_KEY}` },
        body: form,
    });
    return (await res.json());
}
async function apiJson(endpoint, body) {
    const res = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    return (await res.json());
}
// ── MCP Server ──
const server = new McpServer({
    name: 'vectosolve',
    version: '1.0.3',
});
// Tool: vectorize
server.tool('vectorize', 'Convert a raster image (PNG, JPG, WebP) to clean SVG vector format using AI. Costs $0.20 per image.', {
    file_path: z.string().optional().describe('Local file path to the image'),
    image_url: z.string().url().optional().describe('Public URL of the image'),
}, async ({ file_path, image_url }) => {
    if (!API_KEY)
        return { content: [{ type: 'text', text: 'Error: VECTOSOLVE_API_KEY not set. Get one at https://vectosolve.com/developers' }] };
    const result = await apiFormData('/vectorize', { file_path, image_url });
    if (!result.success) {
        return { content: [{ type: 'text', text: `Error: ${result.error || 'Unknown error'}` }] };
    }
    const data = result.data;
    const credits = result.credits;
    return {
        content: [
            { type: 'text', text: `SVG generated in ${data.processing_time_ms}ms (${credits.used} credits used, ${credits.remaining} remaining)` },
            { type: 'text', text: data.svg },
        ],
    };
});
// Tool: remove_bg
server.tool('remove_background', 'Remove the background from an image using AI. Returns a transparent PNG. Costs $0.07 per image.', {
    file_path: z.string().optional().describe('Local file path to the image'),
    image_url: z.string().url().optional().describe('Public URL of the image'),
}, async ({ file_path, image_url }) => {
    if (!API_KEY)
        return { content: [{ type: 'text', text: 'Error: VECTOSOLVE_API_KEY not set.' }] };
    const result = await apiFormData('/remove-bg', { file_path, image_url });
    if (!result.success) {
        return { content: [{ type: 'text', text: `Error: ${result.error || 'Unknown error'}` }] };
    }
    const data = result.data;
    const credits = result.credits;
    return {
        content: [
            { type: 'text', text: `Background removed in ${data.processing_time_ms}ms (${credits.used} credits, ${credits.remaining} remaining)\nResult: ${data.image_url}` },
        ],
    };
});
// Tool: upscale
server.tool('upscale', 'Upscale an image to higher resolution using AI. Costs $0.15 per image.', {
    file_path: z.string().optional().describe('Local file path to the image'),
    image_url: z.string().url().optional().describe('Public URL of the image'),
}, async ({ file_path, image_url }) => {
    if (!API_KEY)
        return { content: [{ type: 'text', text: 'Error: VECTOSOLVE_API_KEY not set.' }] };
    const result = await apiFormData('/upscale', { file_path, image_url });
    if (!result.success) {
        return { content: [{ type: 'text', text: `Error: ${result.error || 'Unknown error'}` }] };
    }
    const data = result.data;
    const credits = result.credits;
    return {
        content: [
            { type: 'text', text: `Image upscaled in ${data.processing_time_ms}ms (${credits.used} credits, ${credits.remaining} remaining)\nResult: ${data.image_url}` },
        ],
    };
});
// Tool: generate_logo
server.tool('generate_logo', 'Generate an SVG logo from a text description using AI. Costs $0.25 per logo.', {
    prompt: z.string().min(3).describe('Text description of the logo to generate'),
    style: z
        .enum([
        'vector_illustration',
        'vector_illustration/line_art',
        'vector_illustration/engraving',
        'vector_illustration/linocut',
        'icon',
        'pixel_art',
        'hand_drawn',
        'bw',
    ])
        .optional()
        .describe('Logo style (default: vector_illustration)'),
    colors: z
        .array(z.object({ r: z.number(), g: z.number(), b: z.number() }))
        .max(5)
        .optional()
        .describe('Brand colors as RGB objects, e.g. [{"r":28,"g":183,"b":33}, {"r":0,"g":144,"b":255}]'),
    num_variants: z.union([z.literal(1), z.literal(2), z.literal(4)]).optional().describe('Number of logo variants (1, 2, or 4)'),
}, async ({ prompt, style, colors, num_variants }) => {
    if (!API_KEY)
        return { content: [{ type: 'text', text: 'Error: VECTOSOLVE_API_KEY not set.' }] };
    const body = { prompt };
    if (style)
        body.style = style;
    if (colors)
        body.colors = colors;
    if (num_variants)
        body.numVariants = num_variants;
    const result = await apiJson('/generate-logo', body);
    if (!result.success) {
        return { content: [{ type: 'text', text: `Error: ${result.error || 'Unknown error'}` }] };
    }
    const logos = result.logos || [];
    const credits = result.credits;
    const content = [
        { type: 'text', text: `${logos.length} logo(s) generated ($${credits.cost} used, $${credits.remaining.toFixed(2)} remaining)` },
    ];
    for (let i = 0; i < logos.length; i++) {
        content.push({ type: 'text', text: `--- Logo ${i + 1} ---\nSVG URL: ${logos[i].url}` });
    }
    return { content };
});
// ── Start ──
async function main() {
    if (!API_KEY) {
        process.stderr.write('Warning: VECTOSOLVE_API_KEY not set. Set it via environment variable or MCP client config.\n' +
            'Get your API key at https://vectosolve.com/developers\n');
    }
    const transport = new StdioServerTransport();
    await server.connect(transport);
}
main().catch((err) => {
    process.stderr.write(`VectoSolve MCP server error: ${err}\n`);
    process.exit(1);
});
