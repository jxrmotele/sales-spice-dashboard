import DEFAULT_IDEAS_BANK from '../data/ideasBank'

// ─── Ideas Bank (localStorage) ────────────────────────────────────────────────
const IDEAS_BANK_KEY = 'salesSpice_ideasBank'

export function loadIdeasBank() {
  try {
    const saved = localStorage.getItem(IDEAS_BANK_KEY)
    return saved !== null ? saved : DEFAULT_IDEAS_BANK
  } catch {
    return DEFAULT_IDEAS_BANK
  }
}

export function saveIdeasBank(text) {
  try {
    localStorage.setItem(IDEAS_BANK_KEY, text)
  } catch {
    // ignore
  }
}

// ─── Sequence-type brief ──────────────────────────────────────────────────────

const SEQUENCE_BRIEFS = {
  'waitlist-drive': `EMAIL TYPE: DRIVE TO WAITLIST
Goal: get them onto the waitlist. Structure: open mid-scene with a specific situation your ideal client recognises → name the problem/tension → soft tease of what's coming (don't over-reveal) → single clear CTA to join the waitlist.
Tone: intimate, like a message from a friend who knows exactly where they're stuck. Build intrigue, not hype.
Subject line: curiosity-based or tension-naming. Not "Join my waitlist!" — something they can't not click.`,

  'nurture': `EMAIL TYPE: NURTURE + SELL
Goal: earn trust by teaching something genuinely useful, then let the offer be the natural next step.
Structure: open with a specific, relatable moment or situation → deliver a real insight or reframe (something they can use today) → connect what you just taught to what the offer solves → soft CTA.
Rule: the pitch is one paragraph max. The value is the point. Don't pitch until you've given something real.`,

  'webinar-drive': `EMAIL TYPE: WEBINAR / LIVE EVENT INVITE
Goal: get them registered. Lead with what they'll be ABLE TO DO after attending — not just a list of topics.
Structure: name the problem they're sitting with → position the live session as the moment things shift → 3-4 specific outcomes they'll leave with → urgency (date/time/limited seats if true) → clear registration CTA.
Subject line: outcome-focused or FOMO-activating. E.g. "I'm showing exactly how I [result] — join me [day]"`,

  'cart-open': `EMAIL TYPE: CART OPEN / SALES EMAIL
Goal: convert fence-sitters. They know about the offer. This email makes them act.
Structure: lead with a transformation or client result (specific, not vague) → remind them what changes when they say yes → address the #1 objection head-on in 2 sentences → state price clearly → single CTA.
Urgency: real only — if there's a deadline or limited spots, use it. If not, let the transformation be the urgency.
Tone: confident and warm. Not pushy. Like someone who knows this will help them and genuinely wants them in.`,

  'onboarding': `EMAIL TYPE: CLIENT ONBOARDING
Goal: make a new buyer feel brilliant about their decision and clear on their next step.
Structure: celebrate their decision (specific, not gushing) → set expectations for what happens next → give them their one first action → warm close.
Tone: personal, excited but grounded. Make them feel like they've just joined something special.`,
}

function getSequenceBrief(task) {
  if (task.sequence && SEQUENCE_BRIEFS[task.sequence]) {
    return SEQUENCE_BRIEFS[task.sequence]
  }
  // Fallback: detect from task name keywords
  const name = (task.name || '').toLowerCase()
  if (name.includes('waitlist') || name.includes('drive')) return SEQUENCE_BRIEFS['waitlist-drive']
  if (name.includes('cart open') || name.includes('doors open') || name.includes('cart close') || name.includes('last chance')) return SEQUENCE_BRIEFS['cart-open']
  if (name.includes('webinar') || name.includes('live event') || name.includes('invite')) return SEQUENCE_BRIEFS['webinar-drive']
  if (name.includes('onboard') || name.includes('welcome')) return SEQUENCE_BRIEFS['onboarding']
  return `EMAIL TYPE: LAUNCH EMAIL
Write the most compelling version of this email based on the task name and goal. Use the offer details and messaging codex to make it feel completely specific to this person and this launch.`
}

// ─── Prompt builder ───────────────────────────────────────────────────────────

function buildUserPrompt({ phase, task, offerDetails, ideasBank }) {
  const od = offerDetails || {}

  const sequenceBrief = getSequenceBrief(task)

  const contextSection = [
    sequenceBrief,
    ``,
    `Phase: ${phase.name}`,
    `Task: ${task.name}`,
    task.description ? `Task goal: ${task.description}` : null,
  ]
    .filter((l) => l !== null)
    .join('\n')

  const offerFields = [
    ['Your name', od.yourName],
    ['Business', od.businessName],
    ['Offer name', od.offerName],
    ['Ideal client', od.idealClient],
    ['Their transformation', od.transformation],
    ['Before state', od.beforeState],
    ['Main objection', od.objection],
    ['Live event title', od.liveEventTitle],
    ['Price', od.price],
    ['Delivery format', od.deliveryFormat],
    ['Timeframe', od.timeframe],
    ['Felt problem', od.feltProblem],
    ['Root cause', od.rootCause],
    ['Method name', od.methodName],
    ['Life/biz impact', od.lifeBizImpact],
    ['Bonus', od.bonusName],
    ['Urgency', od.urgencyDate ? `${od.urgencyDate}${od.urgencyConsequence ? ` — ${od.urgencyConsequence}` : ''}` : null],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const codexPairs = [
    ['Headline', od.headline],
    ['Hook', od.hook],
    ['Problem framing', od.problem],
    ['Agitation', od.agitation],
    ['Reframe', od.reframe],
    ['Mechanism (why it works)', od.mechanism],
    ['Who it\'s for', od.whoFor],
    ['Social proof', od.proof],
    ['Price / value framing', od.priceValue],
    ['Urgency framing', od.urgencyScarcity],
    ['Closing line', od.close],
  ].filter(([, v]) => v && String(v).trim())

  const codexSection = codexPairs.length
    ? `\n\nMessaging Codex — use this exact language and emotional framing. Weave naturally, don't copy verbatim:\n${codexPairs.map(([k, v]) => `${k}: ${v}`).join('\n')}`
    : ''

  const ideasSection =
    ideasBank?.trim()
      ? `\n\nIdeas bank — draw from these where relevant, ignore the rest:\n${ideasBank.trim()}`
      : ''

  const socialGuidance = `\n\nSocial post guidance:
Hook formulas (pick the one that fits, don't use all): "I used to [X]. Now I [Y]. The difference:" / "The [counterintuitive truth] about [topic]:" / "Nobody talks about [specific thing] when [situation]." / "Here's what [result] actually looks like:" / "[Specific situation]? This is why:"
Post types (vary): story beat (open mid-scene), insight/reframe (teach one thing), result post (specific outcome), problem naming (make them feel seen), direct CTA (cart open only).
First line must be a standalone scroll-stopper. End with a soft CTA, a reflective question, or "save this" — never just "link in bio".`

  return `${contextSection}\n\nOffer details:\n${offerFields}${codexSection}${ideasSection}${socialGuidance}\n\nReturn ONLY this JSON (no markdown, no explanation):\n{"email":{"subject":"...","body":"..."},"social":{"copy":"..."}}`
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function generateTaskContent({ phase, task, offerDetails }) {
  const ideasBank = loadIdeasBank()
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.')
  }

  const name = offerDetails?.yourName || 'the coach'

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
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        temperature: 0.7,
        system: `You are three experts writing as one:
1. A launch strategist who knows exactly what a subscriber needs to feel and believe at each stage of a launch to move them forward
2. A conversion copywriter who writes email subject lines people can't ignore and email bodies that don't feel like sales copy — think Joanna Wiebe meets someone who actually runs launches
3. A viral content coach who knows how to open a social post so the first line stops the scroll, and how to close it so people save and share

You are writing for ${name}'s business. Write in first person as ${name}. The ideal client should read this and think "she's writing directly to me."

Hard rules — break any of these and the copy fails:
- Never open an email with pleasantries or "I wanted to share" — start mid-thought, mid-scene, or mid-tension
- Banned phrases: "I'm so excited to share", "game-changing", "transform your life", "are you ready to...", "I wanted to reach out", "thrilled to announce", "life-changing journey"
- Email subject lines: must be curiosity-driven or tension-naming — never descriptive or announcement-style
- Social posts: the first line must be a scroll-stopper — an open loop, a counterintuitive statement, or a specific situation that creates instant recognition
- Every word earns its place. Cut anything that doesn't do work.

CRITICAL OUTPUT RULE: Return exactly one email and one social post. Always valid JSON, this exact structure, no extras:
{"email":{"subject":"...","body":"..."},"social":{"copy":"..."}}
No markdown fences. No explanation. Nothing else.`,
        messages: [
          {
            role: 'user',
            content: buildUserPrompt({ phase, task, offerDetails, ideasBank }),
          },
        ],
      }),
    })
  } catch (networkErr) {
    throw new Error('Network error — check your internet connection and try again.')
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const raw = data?.content?.[0]?.text

  if (!raw) throw new Error('No content returned from Claude.')

  // Strip markdown fences defensively, then extract first {...} block
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const match = cleaned.match(/\{[\s\S]*\}/)
  if (!match) throw new Error('Claude returned invalid JSON. Try regenerating.')

  let parsed
  try {
    parsed = JSON.parse(match[0])
  } catch {
    throw new Error('Claude returned invalid JSON. Try regenerating.')
  }

  if (!parsed?.email?.subject || !parsed?.email?.body || !parsed?.social?.copy) {
    throw new Error('Claude response was missing fields. Try regenerating.')
  }

  return parsed // { email: { subject, body }, social: { copy } }
}

// ─── Shared API helper (returns plain text) ───────────────────────────────────

async function callClaudeText(systemPrompt, userPrompt, maxTokens = 2000) {
  const apiKey = import.meta.env.VITE_ANTHROPIC_API_KEY
  if (!apiKey) {
    throw new Error('VITE_ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server.')
  }

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
        model: 'claude-sonnet-4-5',
        max_tokens: maxTokens,
        temperature: 0.7,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    })
  } catch {
    throw new Error('Network error — check your internet connection and try again.')
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err?.error?.message || `API error ${response.status}`)
  }

  const data = await response.json()
  const text = data?.content?.[0]?.text
  if (!text) throw new Error('No content returned from Claude.')
  return text.trim()
}

// ─── Offer details → formatted string ────────────────────────────────────────

function buildOfferContext(offerDetails) {
  const od = offerDetails || {}
  return [
    od.yourName       && `Name: ${od.yourName}`,
    od.businessName   && `Business: ${od.businessName}`,
    od.offerName      && `Offer: ${od.offerName}`,
    od.idealClient    && `Ideal client: ${od.idealClient}`,
    od.transformation && `Transformation: ${od.transformation}`,
    od.beforeState    && `Before state: ${od.beforeState}`,
    od.feltProblem    && `Felt problem: ${od.feltProblem}`,
    od.rootCause      && `Root cause: ${od.rootCause}`,
    od.objection      && `Main objection: ${od.objection}`,
    od.methodName     && `Method: ${od.methodName}`,
    od.mechanism      && `Mechanism: ${od.mechanism}`,
    od.liveEventTitle && `Live event: ${od.liveEventTitle}`,
    od.price          && `Price: ${od.price}`,
    od.deliveryFormat && `Delivery: ${od.deliveryFormat}`,
    od.timeframe      && `Timeframe: ${od.timeframe}`,
    od.lifeBizImpact  && `Life/biz impact: ${od.lifeBizImpact}`,
    od.bonusName      && `Bonus: ${od.bonusName}`,
    od.headline       && `Headline: ${od.headline}`,
    od.hook           && `Hook: ${od.hook}`,
    od.problem        && `Problem framing: ${od.problem}`,
    od.agitation      && `Agitation: ${od.agitation}`,
    od.reframe        && `Reframe: ${od.reframe}`,
    od.proof          && `Social proof: ${od.proof}`,
    od.priceValue     && `Price/value framing: ${od.priceValue}`,
    od.urgencyScarcity && `Urgency/scarcity: ${od.urgencyScarcity}`,
    od.close          && `Closing line: ${od.close}`,
  ].filter(Boolean).join('\n')
}

// ─── Lead Magnet Outline Generator ────────────────────────────────────────────

const LEAD_MAGNET_PROMPTS = {
  training: (od) => `Generate a complete, ready-to-deliver free training outline for ${od.yourName || 'the coach'}.

Offer details:
${buildOfferContext(od)}

Create a structured 45-60 minute free training outline that:
- Has a compelling title (not just "Free Training")
- Opens with a strong hook that calls out the ideal client's problem
- Walks through 3-4 teaching sections that provide real value
- Each section has a clear title, 3-5 key teaching points, and a practical takeaway
- Naturally bridges to the paid offer without feeling like a hard sell
- Ends with a strong call to action

Format this as a complete document the coach can copy, print, and use immediately. Use headers, bullet points, and clear section breaks. Write the actual content (not just instructions for what to write).`,

  playbook: (od) => `Generate a complete, ready-to-publish lead magnet playbook for ${od.yourName || 'the coach'}.

Offer details:
${buildOfferContext(od)}

Create a detailed step-by-step playbook that:
- Has a compelling title (e.g. "The [X]-Step [Result] Playbook")
- Covers 5-7 clear action steps from ${od.beforeState || 'where they are'} to ${od.transformation || 'their goal'}
- Each step has a title, explanation (2-3 sentences), and a concrete action the reader takes
- Includes "Quick Win" callouts — things they can implement in under 30 minutes
- Ends with what to do next (bridge to the paid offer)

Format this as a complete document with clear numbered steps and subheadings. Write the actual content the reader receives — not placeholder text or instructions.`,

  podcast: (od) => `Generate a complete private podcast episode script for ${od.yourName || 'the coach'} to record and deliver as a lead magnet.

Offer details:
${buildOfferContext(od)}

Create a scripted 20-25 minute audio episode that:
- Has a compelling episode title
- Opens with a warm intro that positions ${od.yourName || 'the host'} as the guide
- Covers 3 teaching segments with clear transitions between them
- Each segment has 2-3 key points spoken conversationally (write it how someone talks, not how they write)
- Includes a "pause and reflect" moment for the listener
- Closes with a natural transition to the paid offer

Format this as a spoken word script the coach can read directly into a microphone. Include stage directions like [pause] and [warm tone] where helpful. Write every word they should say.`,
}

export async function generateLeadMagnet(type, offerDetails) {
  const od = offerDetails || {}
  const promptFn = LEAD_MAGNET_PROMPTS[type]
  if (!promptFn) throw new Error(`Unknown lead magnet type: ${type}`)

  const system = `You are a content strategist and launch copywriter who specialises in free resources that build trust and convert. You write lead magnets that are genuinely useful — not watered-down teasers, but real content that makes the reader think "if the free stuff is this good, the paid thing must be incredible."

Write in the voice of ${od.yourName || 'the business owner'} — warm, direct, specific. Every section should feel finished and ready to deliver. No filler, no vague promises, no "you'll discover..." without then actually delivering the discovery.

Hard rules:
- No "game-changing", "transform your life", "unlock your potential"
- Write actual content, not instructions for content
- Every teaching point must be specific enough to be immediately actionable
- The bridge to the paid offer should feel earned, not bolted on`

  return callClaudeText(system, promptFn(od), 2500)
}

// ─── Sales Page Generator ─────────────────────────────────────────────────────

export async function generateSalesPage(offerDetails) {
  const od = offerDetails || {}

  const system = `You are a senior conversion copywriter. You've written sales pages that have generated multiple six figures. You know that the best sales pages don't feel like sales pages — they feel like the reader finally found someone who understands them.

Write in first person as ${od.yourName || 'the coach'}. No corporate copy. No chest-beating. No listing features without saying what they mean for the reader.

Every section must pass the "so what?" test. If a sentence doesn't make the ideal client feel something or believe something, cut it.

Banned: "game-changing", "transform your life", "I'm so passionate about", "incredible journey", "you deserve", generic testimonial framing.

Required: specificity, voice, honesty. Write like a human who has genuinely helped people and wants to help more of them.`

  const userPrompt = `Write a complete, ready-to-publish sales page for this offer.

Offer details:
${buildOfferContext(od)}

Write the full sales page as one continuous document. Use headers to separate sections. Every section should be complete and ready to publish.

Section-specific guidance:
1. HEADLINE — Use a proven formula: "The [counterintuitive] way to [result]" / "[Result] without [the hard thing they expect]" / "How [ideal client description] [achieves result] in [timeframe] [without X]". Not just the offer name.
2. SUB-HEADLINE — One sentence: who it's specifically for and the primary outcome. Make it feel like the reader is being called by name.
3. THE PROBLEM — Don't name the problem abstractly. Name what it feels like at 11pm when they're lying awake. Use "you" sparingly but precisely. Make them feel seen before you offer anything.
4. THE REFRAME — This is the pivot. Shift blame from them to the approach they've been using. Show them the real problem isn't what they think — and because of that, there's a way out they haven't tried.
5. THE SOLUTION — Introduce with the METHOD NAME first, then the programme name. Explain the why-it-works mechanism in 2-3 sentences. What makes this different from everything else they've tried.
6. WHAT'S INSIDE — For each deliverable: [Feature name] — [What this means for them in practice, what changes]. Not a list of module titles.
7. WHO THIS IS FOR — 5-7 specific bullets. Not "coaches who want more clients" — "coaches who have posted consistently for 6 months and still wonder why launches feel flat."
8. SOCIAL PROOF — Mini case studies not quotes. Who they were before, what shifted, what their life/business looks like now. Specific numbers where possible. If no proof available, write [TESTIMONIAL: describe the type of result you'd want to show here].
9. THE INVESTMENT — Frame the price against the cost of NOT doing this first. Then state clearly: price, payment options, what's included. No apology for the price.
10. THE CLOSE — Talk to the one person who has read this far and is almost ready. Not the whole audience. Warm, direct, permission not pressure. Use the closing line from the Messaging Codex if provided.
11. FAQs — 4-5 real objections answered with empathy and evidence. Not "Is this right for me?" — name the real hesitations: money, time, whether it'll work for their specific situation.

Where specific information is missing, write the most compelling version possible from context — never leave a section as instructions only.`

  return callClaudeText(system, userPrompt, 4000)
}

// ─── Opt-In Page Copy Generator ───────────────────────────────────────────────

export async function generateOptInCopy(offerDetails) {
  const od = offerDetails || {}

  const system = `You are a conversion copywriter who specialises in opt-in pages. You know that most opt-in pages lose people in the first 3 seconds because the headline is too vague or the value isn't immediately obvious.

Write in the voice of ${od.yourName || 'the coach'}. Every line should make the ideal client think "yes, that's exactly what I need right now." Be specific — a vague promise is worse than no promise.

The goal is to get the click. Everything else is in service of that one action.`

  const userPrompt = `Write complete, ready-to-publish opt-in page copy for this lead magnet.

Offer details:
${buildOfferContext(od)}

Write every section fully:

1. HEADLINE — Specific promise. Not "Get my free guide" — "The exact [X] I used to [result] in [timeframe]" or "How to [result] without [the thing they dread]"
2. SUB-HEADLINE — One sentence: who this is for + what they'll be able to do after consuming it
3. WHAT YOU'LL GET — 5-7 bullets. Each bullet should name a specific outcome or insight, not a vague topic. Format: "The [specific thing] that [specific result]" not "Tips for improving your [X]"
4. WHO THIS IS FOR — 3 bullets that make the right person feel immediately called in. Specific situation, not demographic.
5. ABOUT ${od.yourName || '[Name]'} — 2-3 sentences. Lead with a result or credential that's relevant to THIS specific resource. Not a full bio.
6. CTA BUTTON — One line that completes "Yes, I want..." — specific to the transformation, not "Download now" or "Get access"
7. PRIVACY NOTE — One reassuring line. Short, warm, human.

No placeholders except in [brackets] where only the coach can fill in specific details.`

  return callClaudeText(system, userPrompt, 1500)
}
