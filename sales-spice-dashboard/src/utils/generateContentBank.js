import { loadIdeasBank } from './generateContent'

// ─── Storage ──────────────────────────────────────────────────────────────────

function bankStorageKey(clientId, bankKey) {
  return `salesSpice_contentBank_${clientId}_${bankKey}`
}

export function loadContentBank(clientId, bankKey) {
  try {
    const raw = localStorage.getItem(bankStorageKey(clientId, bankKey))
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveContentBank(clientId, bankKey, posts) {
  try {
    localStorage.setItem(bankStorageKey(clientId, bankKey), JSON.stringify(posts))
  } catch {}
}

// ─── Prompt ───────────────────────────────────────────────────────────────────

// ─── Phase-specific post type guidance ───────────────────────────────────────

function getPhasePostGuidance(bankLabel) {
  const label = (bankLabel || '').toLowerCase()
  if (label.includes('pre') || label.includes('pre-launch')) {
    return `PHASE: PRE-LAUNCH — building trust, no selling yet.
Prioritise: story posts, insight/reframe posts, problem naming posts.
Goal: make the ideal client feel seen and trust that you understand their world. No pitching, no teasing the offer yet.`
  }
  if (label.includes('driv') || label.includes('waitlist') || label.includes('nurture')) {
    return `PHASE: DRIVING PERIOD — making the offer visible, building desire.
Prioritise: insight posts, proof posts (client results), behind-the-scenes posts.
Start making the offer visible naturally. Share results, teach things that connect to the offer, bring them into your world.`
  }
  if (label.includes('cart') || label.includes('close') || label.includes('open')) {
    return `PHASE: CART OPEN / CLOSE — converting and creating urgency.
Prioritise: direct CTA posts, objection posts, proof posts.
Be direct about what's available. Urgency should be real (deadline, spots). Address hesitations openly.`
  }
  return `Write posts relevant to this launch phase. Mix post types for variety.`
}

function buildBankPrompt({ bankLabel, offerDetails, ideasBank, count }) {
  const od = offerDetails || {}

  const offerFields = [
    ['Your name', od.yourName],
    ['Business', od.businessName],
    ['Offer name', od.offerName],
    ['Ideal client', od.idealClient],
    ['Their transformation', od.transformation],
    ['Before state', od.beforeState],
    ['Main objection', od.objection],
    ['Felt problem', od.feltProblem],
    ['Price', od.price],
    ['Timeframe', od.timeframe],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n')

  const codexPairs = [
    ['Hook', od.hook],
    ['Problem framing', od.problem],
    ['Agitation', od.agitation],
    ['Reframe', od.reframe],
    ['Mechanism', od.mechanism],
    ['Social proof', od.proof],
    ['Closing line', od.close],
    ['Who it\'s for', od.whoFor],
  ].filter(([, v]) => v && String(v).trim())

  const codexSection = codexPairs.length
    ? `\n\nMessaging Codex — weave these angles naturally across the posts (don't use every element in every post):\n${codexPairs.map(([k, v]) => `${k}: ${v}`).join('\n')}`
    : ''

  const ideasSection = ideasBank?.trim()
    ? `\n\nIdeas bank — draw from these where relevant:\n${ideasBank.trim()}`
    : ''

  const phaseGuidance = getPhasePostGuidance(bankLabel)

  return `Generate ${count} social media posts for the "${bankLabel}" phase of a launch.

${phaseGuidance}

Offer details:
${offerFields}${codexSection}${ideasSection}

POST TYPES — write a deliberate mix across these (don't use the same type twice in a row):
1. STORY POST — open mid-scene with a specific moment or realisation. Before/after arc.
2. INSIGHT POST — one specific thing most people get wrong about [their situation] + the reframe. Teach something real.
3. PROOF POST — a client result told as a story, not a quote. Specific, vivid, human.
4. PROBLEM NAMING POST — describe exactly what it feels like to be the ideal client right now. No pitch. Just recognition.
5. OBJECTION POST — take the most common objection, name it openly ("I know what you're thinking..."), dissolve it.
6. BEHIND THE SCENES — what running this launch/programme actually looks like. Makes them feel like insiders.
7. DIRECT POST — short, confident, clear CTA. Only for cart open phase.

HOOK FORMULAS — vary these across posts (never use the same opener twice):
• "I used to [X]. Then I [Y]. The difference was:"
• "Most [ideal clients] [do X]. Here's why that keeps them stuck:"
• "Nobody tells you [specific thing] when you're [situation]."
• "This is what [transformation] actually looks like:"
• "The [counterintuitive thing] about [topic]:"
• "[Specific relatable scenario]? Here's what's actually going on:"

CLOSE each post with ONE of: a direct CTA (cart open only), a reflection question that creates recognition, or "save this for when you need it".

Hard rules: No "I'm so excited", no "game-changing", no countdown posts that are just pressure, no posts that are obviously written to sell. Write like a real person sharing something real.

Return ONLY a JSON array with exactly ${count} objects, no markdown, no explanation:
[{"id":"1","copy":"..."},{"id":"2","copy":"..."},...,{"id":"${count}","copy":"..."}]`
}

// ─── API call ─────────────────────────────────────────────────────────────────

export async function generateContentBank({ bankLabel, offerDetails, clientId, bankKey, count = 10 }) {
  const ideasBank = loadIdeasBank()
  const apiKey = localStorage.getItem('salesSpice_anthropicApiKey') || import.meta.env.VITE_ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new Error('No API key found. Please add your Anthropic API key on the home screen.')
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
        max_tokens: 3500,
        temperature: 0.8,
        system: `You are a viral content coach and launch copywriter. You write social posts that stop people mid-scroll, make them save the post, and make them feel genuinely understood by the person behind the account.

You know that most launch content fails because it sounds like launch content. Your posts sound like someone sharing something real — a lesson they learned hard, a result they saw that surprised them, a truth they've been sitting with.

Write in first person as ${offerDetails?.yourName || 'the coach'}. Each post should have a distinct voice and format. Never use the same opening structure twice across the batch.

Return ONLY a valid JSON array — no markdown fences, no explanation. Each element must have exactly "id" and "copy" fields.`,
        messages: [
          {
            role: 'user',
            content: buildBankPrompt({ bankLabel, offerDetails, ideasBank, count }),
          },
        ],
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
  const raw = data?.content?.[0]?.text
  if (!raw) throw new Error('No content returned from Claude.')

  // Strip markdown fences, extract first [...] block
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()
  const match = cleaned.match(/\[[\s\S]*\]/)
  if (!match) throw new Error('Claude returned invalid JSON. Try regenerating.')

  let parsed
  try {
    parsed = JSON.parse(match[0])
  } catch {
    throw new Error('Claude returned invalid JSON. Try regenerating.')
  }

  if (!Array.isArray(parsed)) throw new Error('Claude response was not an array. Try regenerating.')

  // Stamp with generatedAt and save
  const posts = parsed
    .filter((p) => p && typeof p.copy === 'string' && p.copy.trim())
    .map((p, i) => ({
      id: String(p.id || i + 1),
      copy: p.copy.trim(),
      generatedAt: new Date().toISOString(),
    }))

  saveContentBank(clientId, bankKey, posts)
  return posts
}
