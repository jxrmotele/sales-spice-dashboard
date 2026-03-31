import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getRequiredSession } from "@/lib/auth-helpers";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const EMAIL_SEQUENCE_PROMPTS: Record<string, string> = {
  "waitlist-drive": `Write a 14-email waitlist-drive sequence. Each email should be clearly labelled "Email 1:", "Email 2:", etc. Day 1: big announcement. Day 2: who it's for. Day 3: the problem you solve. Day 4: your story. Day 5: client result. Day 6: what's inside. Day 7: week 1 reminder. Day 8: the transformation. Day 9: handle main objection. Day 10: how it works. Day 11: another win. Day 12: waitlist closing soon. Day 13: tomorrow. Day 14: cart opening tonight. Each email needs: Subject line, body (3–5 short paragraphs), and a CTA.`,

  "waitlist-nurture": `Write a 5-email nurture sequence for new subscribers. Each email clearly labelled "Email 1:", etc. Email 1: deliver the lead magnet + warm welcome. Email 2: share your story and expertise arc. Email 3: share a specific client result. Email 4: address the main objection they'll have before buying. Email 5: build excitement for what's coming next. Each email needs: Subject line, body, and a CTA.`,

  "webinar-drive": `Write a 14-email webinar-drive sequence to get registrations for the live event. Each email labelled "Email 1:", etc. Emails 1–2: announcement + what you'll learn. Emails 3–5: who it's for, the problem, social proof. Emails 6–7: urgency + FAQ. Emails 8–11: countdown reminders (3 days, 1 day, morning, starting soon). Emails 12–14: live now, missed it replay, last chance replay. Each email needs: Subject line, body, CTA.`,

  "cart-open": `Write a 14-email open-to-close cart sequence. Each email labelled "Email 1:", etc. Day 1: doors open announcement. Day 2: what's inside the offer. Day 3: who this is for. Day 4: the transformation story. Day 5: time objection. Day 6: price/value reframe. Day 7: social proof heavy. Day 8: midpoint urgency. Day 9: bonus stack. Day 10: FAQ. Day 11: 48 hours left. Day 12: tomorrow last day. Day 13: last day morning. Day 14: final hours (ultra short). Each email needs: Subject line, body, CTA.`,

  "onboarding": `Write a 3-email onboarding sequence for new clients after purchase. Email 1: immediate welcome — confirm they're in, what to do now, what to expect. Email 2: 24 hours later — introduce the community/portal, share an early win story. Email 3: 3 days in — check-in, remind them of the upcoming kickoff call, build excitement. Each email needs: Subject line, body, CTA.`,
};

const SOCIAL_BANK_PROMPTS: Record<string, string> = {
  "pre-launch": `Write 10 social media posts for the pre-launch period — before the lead magnet or waitlist goes live. Posts should build awareness, create desire, and position the problem. Mix formats: hook + value, question posts, personal story snippets, bold statements. Each post clearly labelled "Post 1:", etc. Keep each under 300 words. Include a 1-line caption hook for each.`,

  "driving": `Write 10 social media posts for the main driving period — when the lead magnet or waitlist is live. Posts should drive people to opt in. Mix: problem agitation, transformation painting, client stories, objection handling, behind-the-scenes, social proof. Each post labelled "Post 1:", etc. Include a hook and a CTA for each.`,

  "cart-period": `Write 10 social media posts for the open cart period. Heavy urgency, social proof, objection handling, and FAQs. Include: doors open posts, testimonials, FAQ posts, objection posts, 48-hours posts, last day posts. Each post labelled "Post 1:", etc. Include a hook and a clear CTA directing to the sales page.`,
};

const PODCAST_EPISODE_PROMPTS: Record<number, string> = {
  1: `Write a detailed script outline for Episode 1 of a 7-part private podcast series. This episode should: Call out the big problem clearly, help listeners identify they have this problem, explain WHY they're experiencing it (the root cause diagnosis), and end with a CTA to listen to the next episode. Include: episode title, hook, main body with clear sections, and a CTA.`,
  2: `Write a detailed script outline for Episode 2. This episode should: Paint a vivid picture of the future — what life looks like on the other side of the transformation. Make it specific and emotional. Contrast with where they are now. End with a CTA and tease episode 3.`,
  3: `Write a detailed script outline for Episode 3. This episode should: Show how your specific framework/skill is the BRIDGE between their current problem and the desired transformation. Introduce the methodology. Show why other approaches haven't worked. End with a CTA.`,
  4: `Write a detailed script outline for Episode 4. This episode should: Share client stories or your own transformation story. Be specific — before, the turning point, after. Make results feel real and achievable. End with a CTA.`,
  5: `Write a detailed script outline for Episode 5. This episode should: Introduce the offer. Walk through the 3–5 Core Converting Concepts — the key ideas that make your programme work. Start building desire for the offer. End with a CTA and tease that more details are coming.`,
  6: `Write a detailed script outline for Episode 6. This episode should: Walk through the tangible deliverables of the offer — what they get, why each element exists, how it connects to the transformation. Be specific. End with a CTA.`,
  7: `Write a detailed script outline for Episode 7. This episode should: Cover how you support clients inside the programme. Then give the explicit next step: join the waitlist, book a call, or go to the sales page. Create urgency. This is the sales episode — don't be shy. End with a strong CTA.`,
};

function buildContext(od: Record<string, string>): string {
  return `
OFFER DETAILS:
- Coach/founder: ${od.yourName || "Not provided"}
- Business: ${od.businessName || "Not provided"}
- Offer name: ${od.offerName || "Not provided"}
- Ideal client: ${od.idealClient || "Not provided"}
- Their situation: ${od.specificSituation || "Not provided"}
- The felt problem: ${od.feltProblem || "Not provided"}
- Emotional consequence: ${od.emotionalConsequence || "Not provided"}
- Root cause: ${od.rootCause || "Not provided"}
- Method name: ${od.methodName || "Not provided"}
- How it works: ${od.methodHow || "Not provided"}
- Before state: ${od.beforeState || "Not provided"}
- Transformation: ${od.transformation || "Not provided"}
- Life/biz impact: ${od.lifeBizImpact || "Not provided"}
- Delivery: ${od.deliveryFormat || "Not provided"} over ${od.timeframe || "not provided"}
- Deliverables: ${od.deliverables || "Not provided"}
- Bonus: ${od.bonusName || "Not provided"} — ${od.bonusBenefit || "not provided"}
- Price: ${od.price || "Not provided"}
- Payment plan: ${od.paymentPlan || "None"}
- Value justification: ${od.valueJustification || "Not provided"}
- Social proof person: ${od.socialProofPerson || "Not provided"}
- Social proof result: ${od.socialProofResult || "Not provided"}
- Testimonial: ${od.testimonial || "Not provided"}
- Urgency date: ${od.urgencyDate || "Not provided"}
- Urgency consequence: ${od.urgencyConsequence || "Not provided"}
- CTA: ${od.ctaText || "Not provided"}
- Sales page URL: ${od.salesPageUrl || "Not provided"}
- Lead magnet: ${od.leadMagnet || "Not provided"}
- Live event title: ${od.liveEventTitle || "Not provided"}

MESSAGING:
- Headline: ${od.headline || "Not provided"}
- Hook: ${od.hook || "Not provided"}
- Reframe: ${od.reframe || "Not provided"}
- Mechanism: ${od.mechanism || "Not provided"}
- Who it's for: ${od.whoFor || "Not provided"}
- Who it's NOT for: ${od.whoNotFor || "Not provided"}
- Proof: ${od.proof || "Not provided"}
- Price/value: ${od.priceValue || "Not provided"}
- Urgency/scarcity: ${od.urgencyScarcity || "Not provided"}
- Close: ${od.close || "Not provided"}
`.trim();
}

export async function POST(request: NextRequest) {
  try {
    await getRequiredSession();
    const { contentType, contentKey, offerDetails, templateId } = await request.json();
    const od = offerDetails || {};

    let taskPrompt = "";

    if (contentType === "email") {
      taskPrompt = EMAIL_SEQUENCE_PROMPTS[contentKey] || `Write a professional email sequence for: ${contentKey}`;
    } else if (contentType === "social") {
      taskPrompt = SOCIAL_BANK_PROMPTS[contentKey] || `Write social media posts for: ${contentKey}`;
    } else if (contentType === "sales-page") {
      taskPrompt = `Write a complete, compelling sales page for the offer. Include all sections: attention-grabbing headline, problem section (agitate the pain), reframe/mechanism, what's included (deliverables), who it's for, social proof/testimonials, investment with value justification, FAQ (5 common objections as questions), and a strong CTA. Use persuasive copywriting — not hype, but genuine conviction. Sign off as ${od.yourName || "the coach"}.`;
    } else if (contentType === "podcast") {
      const epNum = parseInt(contentKey.replace("episode-", ""));
      taskPrompt = PODCAST_EPISODE_PROMPTS[epNum] || `Write a private podcast episode script for episode ${epNum}.`;
    }

    const systemPrompt = `You are an expert launch copywriter who specialises in helping coaches and consultants create content that converts. You write in a warm, direct, human voice — not corporate, not hyped. You use the specific details from the offer to make the copy feel personal and relevant. Always use the coach/founder's name when signing off. When the sales page URL is provided, include it as the CTA link.`;

    const userPrompt = `${buildContext(od)}

TASK:
${taskPrompt}

Write the content now. Be specific — use the actual names, numbers, and phrases from the offer details above. Don't use generic placeholders like "[your name]" — use the actual values. If a value isn't provided, write something plausible that fits the context.`;

    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4096,
      messages: [{ role: "user", content: userPrompt }],
      system: systemPrompt,
    });

    const text = response.content.find((b) => b.type === "text");
    if (!text || text.type !== "text") {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    return NextResponse.json({ content: text.text });
  } catch (err) {
    console.error("generate-content error:", err);
    return NextResponse.json({ error: "Failed to generate" }, { status: 500 });
  }
}
