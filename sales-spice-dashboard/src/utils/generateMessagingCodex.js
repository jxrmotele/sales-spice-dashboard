// ─── Messaging Codex Generator ────────────────────────────────────────────────
// Takes offer details from Step 2 and generates all 13 Messaging Codex fields
// using Claude. Returns a flat object keyed to the MESSAGING_CODEX_SECTIONS fields.

export async function generateMessagingCodex(offerDetails) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to .env.local and restart.')
  }

  const od = offerDetails || {}
  const name = od.yourName || 'the coach'

  const offerSummary = [
    ['Name', od.yourName],
    ['Offer name', od.offerName],
    ['Ideal client', od.idealClient],
    ['Transformation promised', od.transformation],
    ['Before state (where they start)', od.beforeState],
    ['Felt problem (in their words)', od.feltProblem],
    ['Root cause of the problem', od.rootCause],
    ['Method name', od.methodName],
    ['How the method works', od.methodHow],
    ['Delivery format', od.deliveryFormat],
    ['Timeframe', od.timeframe],
    ['Price', od.price],
    ['Payment plan', od.paymentPlan],
    ['Bonus', od.bonusName],
    ['Bonus benefit', od.bonusBenefit],
    ['Urgency date', od.urgencyDate],
    ['Urgency consequence', od.urgencyConsequence],
    ['Life / biz impact of transformation', od.lifeBizImpact],
    ['Main objection they have', od.objection],
    ['Specific situation they are in', od.specificSituation],
    ['Social proof person', od.socialProofPerson],
    ['Social proof result', od.socialProofResult],
    ['Testimonial', od.testimonial],
    ['Deliverables', od.deliverables],
    ['Sales page URL', od.salesPageUrl],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const systemPrompt = `You are an expert launch copywriter and messaging strategist. Your job is to write a Messaging Codex for a coach's launch — 13 persuasion elements that will be used to generate emails, social posts, sales pages, and live event scripts.

Write in first person as ${name}. Be specific, concrete, and emotionally resonant.

THE MOST IMPORTANT RULE — specificity over everything:
The difference between average codex entries and exceptional ones is specificity.
Average: "coaches who struggle with their messaging and don't know how to stand out"
Exceptional: "coaches who write three caption drafts, delete them all, and post nothing — because nothing sounds like them and everything sounds like everyone else"

Every entry should be specific enough that the ideal client reads it and thinks "how does she know?" — not "yes that applies to me I guess."

Name real moments, specific thoughts, exact feelings. Use the offer details to ground every entry in their actual situation.

Avoid:
- Generic coaching language ("transform your life", "game-changing", "I'm so excited", "unlock your potential")
- Vague problem descriptions ("struggling with X" without naming what that actually looks like)
- Clichéd hooks ("Are you tired of...", "What if I told you...")
- Anything that could apply to any coach, any offer, any client

Return ONLY valid JSON — no markdown fences, no explanation, nothing else.`

  const userPrompt = `Offer details:
${offerSummary}

Generate all 13 Messaging Codex fields. Each should be 1–3 sentences, written in first person as ${name}, specific to this exact offer.

Return ONLY this JSON:
{
  "headline": "The big promise in one line — the result, not the programme name",
  "hook": "A bold or counterintuitive statement that creates an open loop — challenges the belief holding them back",
  "problem": "The problem in their language — the experience they're living right now, not the abstract issue",
  "agitation": "What staying stuck is costing them — what's getting worse, what it's doing to their confidence/business/life",
  "reframe": "The shift — the real problem isn't what they think, and because of that there's a way out they haven't tried",
  "mechanism": "What makes this approach different — why it works when what they've tried before hasn't",
  "whoFor": "One line that makes the ideal client feel called in — specific enough to create instant recognition",
  "whoNotFor": "Who this is NOT for — honest, specific, trust-building",
  "features": "Punchy highlights reel of what's inside — 1–2 sentences for use in social and emails",
  "proof": "A specific, concrete result from a client — surprising or highly relatable, not vague",
  "priceValue": "Frame the investment against the transformation, not a price tag — what does it cost NOT to do this?",
  "urgencyScarcity": "Real urgency framing — deadline, limited spots, or founding price — make the cost of waiting real",
  "close": "Final word — warm, direct, permission not pressure — speak to the one person on the edge of yes"
}`

  let response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2500,
        temperature: 0.8,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch (networkErr) {
    throw new Error('Network error — check your connection and try again.')
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.content?.[0]?.text
  if (!raw) throw new Error('No content returned from Claude.')

  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Claude returned an unexpected format. Try again.')

  let parsed
  try {
    parsed = JSON.parse(match[0])
  } catch {
    throw new Error('Claude returned invalid JSON. Try again.')
  }

  return parsed
}
