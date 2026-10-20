# OC Maker MCP

Use [OC Maker](https://ocmaker.art), an AI image studio for anime and illustration, from Claude, Cursor and other
[MCP](https://modelcontextprotocol.io) clients. Generate images from text, edit or restyle existing images, upscale
them and remove backgrounds, using the same credits as the OC Maker website.

This repository contains the public documentation and examples for the hosted server. The server itself runs at
OC Maker; there is nothing to install or self-host.

- Server URL: `https://ocmaker.art/api/mcp/` (keep the trailing slash)
- Transport: Streamable HTTP
- Authentication: personal API key, sent as `Authorization: Bearer <key>`
- Full guide: <https://ocmaker.art/docs/mcp/>

## Get an API key

1. Sign in at <https://ocmaker.art> and verify your email.
2. Open **Settings → API Keys** (<https://ocmaker.art/settings/api-keys>), name the key and click **Create key**.
3. Copy the key (it starts with `ocm_`). It is shown only once; if you lose it, revoke it and create a new one.

Keep the key private: anyone who has it can spend your credits. You can have several keys and revoke any of them at
any time.

## Connect a client

Replace `YOUR_API_KEY` with your key.

**Claude Code**

```bash
claude mcp add --transport http ocmaker https://ocmaker.art/api/mcp/ \
  --header "Authorization: Bearer YOUR_API_KEY"
```

**Cursor**: add to `~/.cursor/mcp.json` (see [`examples/cursor-mcp.json`](examples/cursor-mcp.json)).

**Claude Desktop**: uses the `mcp-remote` bridge (see
[`examples/claude-desktop-config.json`](examples/claude-desktop-config.json)).

Any other client that supports remote MCP over Streamable HTTP with custom headers works the same way.
Clients that only offer an OAuth sign-in button are not supported yet.

## Tools

| Tool | What it does | Credits |
| --- | --- | --- |
| `upload_image` | Upload an image (JPEG, PNG or WebP, up to 10 MB) and get a URL other tools can use | Free |
| `generate_image` | Create an image from text, or edit and restyle images you provide | By model and resolution |
| `remove_background` | Remove the background and return a transparent PNG | Fixed |
| `upscale_image` | Make an image sharper and higher resolution | Fixed |
| `get_task` | Check a running task and get the finished image URLs | Free |
| `get_balance` | Show the remaining credits on the account | Free |

Image tasks are asynchronous: the create tools return a `task_id`, then poll `get_task` (at least 3 seconds apart)
until the status is `success` or `failed`. Failed tasks are refunded automatically. The create tools accept an optional
`idempotency_key`; retrying the same request with the same key is not charged twice.

Image inputs must be URLs returned by `upload_image` or by an earlier OC Maker task; arbitrary external links are
rejected.

## Example prompts

- "How many OC Maker credits do I have left?"
- "Generate a watercolor fox in a snowy forest, 3:2."
- "Take this photo, remove the background, then upscale it." (attach the image)

## Try it from a script

[`examples/call-tool.mjs`](examples/call-tool.mjs) connects with the official MCP SDK and calls a tool:

```bash
npm install @modelcontextprotocol/sdk
OCMAKER_API_KEY=ocm_... node examples/call-tool.mjs get_balance
```

## Credits, limits and support

- Calls use the credit balance of the account that owns the key. Buy credits or subscribe at
  <https://ocmaker.art/pricing>.
- Each key can make up to 60 calls per minute, including status checks.
- Some models and resolutions unlock after the first purchase, the same as on the website.
- Questions or problems: see the support link in the footer of <https://ocmaker.art>.

## License

The documentation and examples in this repository are released under the MIT License. See [LICENSE](LICENSE).
Use of the hosted service is subject to the [OC Maker terms](https://ocmaker.art/terms/).
