// Minimal example: connect to the hosted OC Maker MCP server and call one tool.
//
//   npm install @modelcontextprotocol/sdk
//   OCMAKER_API_KEY=ocm_... node call-tool.mjs get_balance
//   OCMAKER_API_KEY=ocm_... node call-tool.mjs generate_image '{"prompt":"a watercolor fox in a snowy forest"}'
//
// The API key is read from the environment on purpose: never hard-code it or commit it.
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const SERVER_URL = "https://ocmaker.art/api/mcp/";
const apiKey = process.env.OCMAKER_API_KEY;
if (!apiKey) {
  console.error("Set OCMAKER_API_KEY first (create one at https://ocmaker.art/settings/api-keys).");
  process.exit(1);
}

const [toolName = "get_balance", rawArgs = "{}"] = process.argv.slice(2);

const client = new Client({ name: "ocmaker-example", version: "1.0.0" });
await client.connect(
  new StreamableHTTPClientTransport(new URL(SERVER_URL), {
    requestInit: { headers: { Authorization: `Bearer ${apiKey}` } },
  }),
);

const result = await client.callTool({ name: toolName, arguments: JSON.parse(rawArgs) });
console.log(JSON.stringify(result.structuredContent ?? result.content, null, 2));

// Image tools start an asynchronous task. Poll get_task until it finishes (wait at least 3 seconds between polls).
const taskId = result.structuredContent?.task_id;
if (taskId) {
  for (;;) {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    const task = await client.callTool({ name: "get_task", arguments: { task_id: taskId } });
    const data = task.structuredContent ?? {};
    if (data.status !== "pending") {
      console.log(JSON.stringify(data, null, 2));
      break;
    }
  }
}

await client.close();
