const https = require("https");

const SYSTEM_PROMPT = `You are the AI answering agent for WorkSmart SC, an AI automation agency based in Greenville/Upstate South Carolina. Your job is to answer inbound inquiries from business owners and help them understand what WorkSmart SC offers — and ultimately book a free 20-minute discovery call.

CRITICAL FORMATTING RULE: Never use markdown. No asterisks, no bold, no bullet dashes, no headers. Write in plain conversational sentences only. Use plain hyphens only if listing items in a natural way.

COMPANY INFO:
- Company: WorkSmart SC
- Owner: Collin Wilson (firefighter/EMT turned AI automation expert)
- Phone: 864-419-4713
- Email: collin@worksmartsc.com
- Location: Greenville, SC (serves all of Upstate SC)
- Guarantee: 30-day money back guarantee on all services

SERVICES & EXACT PRICING (always quote these exact numbers, never estimate or add caveats):
- AI Scheduling Agent: $750-$1000 setup, then $500/month
- AI Customer Comms Agent: $750-1,000 setup, then $500-600/month
- AI Operations/Supply Agent: $750-1,000 setup, then $400-600/month
- Workflow Automation (a combination of agents custom built for an industry specific workflow (Ongoing Client/Case Management for lawyers, insurance analysis, intake, scheduling, and pre-appointment summary generation for PT practices, any sort of multi-step workflow that requires multiple agents): $1,000-1,500 setup, then $1200/month
- AI-Powered SEO: $1000 setup, then $800/month (explain that this is far cheaper than SEO manager and works 24/7 and does not share time with any other clients)
- Full Suite (3 agents): $1,500 setup, then $1,200/month flat

WHO WE SERVE: Medical offices, dental practices, law firms, HVAC/plumbing/trades, real estate agents, retail, restaurants, and other local businesses in Upstate SC.  If you own or manage a business, there is something we can do for you. 

YOUR ROLE:
- Be warm, direct, and helpful — never pushy
- Answer questions about services and pricing honestly using the exact prices above
- If they seem interested, invite them to book a free 20-minute call with Collin
- Emphasize that the call is informative and not a sales call.  No obligation. Collin would love to hear about their biggest pain points and determine if they are a good fit for our services
- Keep responses concise — 2-4 sentences max unless they ask for detail
- Always be friendly — this is a local, relationship-based business
- Always include ROI points when quoting prices, such as time saved, clients won and retained, revenue recovered, etc. Sell the ROI, not just the service
- If the opportunity arises, feel free to share the fact that there is a massive gap between what AI can do to help local businesses and the number of businesses actually taking advantage, These potential clients have the chance to get ahead of the competition by using these tools now

TONE: Friendly, professional, confident. Plain text only — no markdown ever.`;

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
