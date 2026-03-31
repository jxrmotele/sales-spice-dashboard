import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getRequiredSession } from "@/lib/auth-helpers";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(request: NextRequest) {
  try {
    await getRequiredSession();
    const { offerDetails } = await request.json();

    const od = offerDetails || {};

    const prompt = `You are an expert marketing copywriter helping a coach or consultant create their Messaging Codex — the persuasive copy elements that will power all their launch content.

Based on the following offer details, write all 13 messaging codex elements. Be specific, punchy, and in the voice of someone who has deep expertise and genuine care for their clients. Use second-person ("you", "your") when writing to the audience.

OFFER DETAILS:
- Name: ${od.yourName || "[not provided]"}
- Offer name: ${od.offerName || "[not provided]"}
- Ideal client: ${od.idealClient || "[not provided]"}
- Their situation: ${od.specificSituation || "[not provided]"}
- The felt problem: ${od.feltProblem || "[not provided]"}
- Emotional consequence: ${od.emotionalConsequence || "[not provided]"}
- Root cause: ${od.rootCause || "[not provided]"}
- Method name: ${od.methodName || "[not provided]"}
- How it works: ${od.methodHow || "[not provided]"}
- Before state: ${od.beforeState || "[not provided]"}
- Transformation: ${od.transformation || "[not provided]"}
- Life/biz impact: ${od.lifeBizImpact || "[not provided]"}
- Delivery format: ${od.deliveryFormat || "[not provided]"}
- Timeframe: ${od.timeframe || "[not provided]"}
- Price: ${od.price || "[not provided]"}
- Social proof person: ${od.socialProofPerson || "[not provided]"}
- Social proof result: ${od.socialProofResult || "[not provided]"}
- Urgency date: ${od.urgencyDate || "[not provided]"}
- Urgency consequence: ${od.urgencyConsequence || "[not provided]"}

Write the following 13 elements and return them as a JSON object with exactly these keys:
- headline: One powerful promise headline (20 words max)
- hook: A bold, surprising or counterintuitive statement that creates an open loop (2-3 sentences)
- problem: The core problem stated clearly in the audience's language (2-3 sentences)
- agitation: Deepen the pain — consequences of staying stuck (2-3 sentences)
- reframe: The belief shift — the real problem and why there's a way out (2-3 sentences)
- mechanism: What makes this approach uniquely effective (2-3 sentences)
- whoFor: One powerful line calling in the ideal client (1 sentence)
- whoNotFor: Who this is NOT for — honest and specific (1-2 sentences)
- features: Punchy highlights reel of what's inside (1-2 sentences)
- proof: A specific proof point with numbers or concrete results (1-2 sentences)
- priceValue: Investment framed against transformation (1-2 sentences)
- urgencyScarcity: Real urgency — deadline, spots, or founding price (1-2 sentences)
- close: Warm, direct final word to the person on the fence (2-3 sentences)

Return ONLY valid JSON. No markdown, no explanation, no wrapping text.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 2048,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    const generated = JSON.parse(text.text);
    return NextResponse.json(generated);
  } catch (err) {
    console.error("generate-codex error:", err);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
