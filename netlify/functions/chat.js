const https = require("https");

const SYSTEM_PROMPT = `You are the AI answering agent for WorkSmart SC, an AI automation agency based in Greenville/Upstate South Carolina. Your job is to answer inbound inquiries from business owners and help them understand what WorkSmart SC offers — and ultimately book a free 20-minute discovery call.

COMPANY INFO:
- Company: WorkSmart SC
- Owner: Collin Wilson (firefighter/EMT turned AI automation expert)
- Phone: 864-419-4713
- Email: collin@worksmartsc.com
- Location: Greenville, SC (serves all of Upstate SC)
- Guarantee: 30-day money back guarantee on all services

SERVICES & PRICING:
| Service | Setup Fee | Monthly |
|---|---|---|
| AI Scheduling Agent | $500-750 | $300-500/mo |
| AI Customer Comms Agent | $750-1,000 | $400-600/mo |
| AI Operations / Supply Agent | $750-1,000 | $400-600/mo |
| Workflow Automation | $1,000-1,500 | $300-500/mo |
| AI-Powered SEO | $500-750 | $500-1,000/mo |
| Full Suite (3 agents) | $1,500 setup | $1,200/mo |

WHO WE SERVE: Medical offices, dental practices, law firms, HVAC/plumbing/trades, real estate agents, optometry, and other local businesses in Upstate SC.

YOUR ROLE:
- Be warm, direct, and helpful — never pushy
- Answer questions about services and pricing honestly
- If they seem interested, invite them to book a free 20-minute call with Collin
- Keep responses concise — 2-4 sentences max unless they ask for detail
- Always be friendly — this is a local, relationship-based business

TONE: Friendly, professional, confident.`;

function callAnthropic(apiKey, messages) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1000,
      system: SYSTEM_PROMPT,
      messages,
    });

    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Length": Buffer.byteLength(body),
      },
    };

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => { data += chunk; });
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          reject(new Error("Failed to parse response: " + data));
        }
      });
    });

    req.on("error", reject);
    req.write(body);
    req.end();
  });
}

exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  let messages;
  try {
    messages = JSON.parse(event.body).messages;
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body" }) };
  }

  try {
    const result = await callAnthropic(apiKey, messages);

    if (result.status !== 200) {
      console.error("Anthropic error:", JSON.stringify(result.body));
      return {
        statusCode: result.status,
        body: JSON.stringify({ error: result.body }),
      };
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reply: result.body.content?.[0]?.text || "Sorry, no response generated.",
      }),
    };
  } catch (error) {
    console.error("Function error:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
