// My Future Plan — Pathway generator
// Calls the Claude API securely (server-side) and returns a structured,
// document-ready "Beautiful Pathway" as JSON. The API key never reaches
// the browser. Set ANTHROPIC_API_KEY in the Netlify environment.

const MODEL = process.env.MFP_MODEL || "claude-sonnet-4-6";

const SYSTEM_PROMPT = `You are the quiet, wise voice behind "My Future Plan" — a tool that turns the
future a person is reaching for into a beautiful, motivating life pathway across
three horizons: 10 years, 5 years, and 1 year.

Your writing is warm, vivid, and grounded. You write to one human being, using
"you". You are specific and concrete, never generic or corporate. You avoid
buzzwords, hustle-culture clichés, and exclamation marks. You sound like a
trusted mentor who deeply believes in this person.

You ALWAYS reply with a single valid JSON object and nothing else — no prose,
no markdown fences. The JSON must match exactly this shape:

{
  "headline": "a short, personal title for their pathway (max 6 words)",
  "essence": "1-2 sentences naming who they are becoming",
  "quote": { "text": "a genuine, significant motivational quote that fits their journey", "author": "the real author, or 'Unknown' — never invent attributions" },
  "horizons": [
    { "span": "10-Year Horizon", "title": "evocative title for the decade", "vision": "one rich paragraph painting their life in 10 years", "markers": ["3 to 4 concrete signs this has come true"] },
    { "span": "5-Year Horizon", "title": "title", "vision": "one paragraph for the midpoint, building toward the 10-year vision", "markers": ["3 to 4 concrete milestones"] },
    { "span": "1-Year Horizon", "title": "title", "vision": "one paragraph for the year ahead, the foundation", "markers": ["3 to 4 concrete, achievable milestones for this year"] }
  ],
  "firstStep": "one specific action they can take within the next 7 days",
  "affirmation": "a short closing line (max 14 words) they could say to themselves"
}

Use real, verifiable quotes only. Keep every field tight and meaningful.`;

function buildUserPrompt({ name, future, situation, area }) {
  const who = name ? `Their name is ${name}.` : "They did not share their name.";
  const focus = area ? `The area of life they care most about right now: ${area}.` : "";
  return `${who}
${focus}

The future they want — the life they are reaching for:
"""${future}"""

Where they are today:
"""${situation || "They did not describe their current situation."}"""

Craft their Beautiful Pathway now. Address them directly as "you"${
    name ? `, and you may use their name "${name}" once or twice where it feels natural` : ""
  }. Return only the JSON object.`;
}

function clamp(str, max) {
  if (typeof str !== "string") return "";
  return str.length > max ? str.slice(0, max) : str;
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store",
  };

  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: "Method not allowed" }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Server is not configured yet. (Missing ANTHROPIC_API_KEY)" }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Invalid request." }) };
  }

  const future = clamp((payload.future || "").trim(), 2000);
  if (future.length < 4) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: "Tell us where you want to be first." }) };
  }

  const input = {
    name: clamp((payload.name || "").trim(), 80),
    future,
    situation: clamp((payload.situation || "").trim(), 2000),
    area: clamp((payload.area || "").trim(), 80),
  };

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 1800,
        temperature: 1,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: buildUserPrompt(input) }],
      }),
    });

    if (!res.ok) {
      const detail = await res.text();
      console.error("Anthropic API error", res.status, detail);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: "The pathway couldn't be crafted right now. Please try again in a moment." }),
      };
    }

    const data = await res.json();
    const text = (data.content || []).map((b) => b.text || "").join("").trim();

    let pathway;
    try {
      pathway = JSON.parse(text);
    } catch {
      const match = text.match(/\{[\s\S]*\}/);
      if (!match) throw new Error("No JSON in model response");
      pathway = JSON.parse(match[0]);
    }

    return { statusCode: 200, headers, body: JSON.stringify({ pathway }) };
  } catch (err) {
    console.error("generate-pathway failed", err);
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: "Something interrupted the magic. Please try again." }),
    };
  }
};
