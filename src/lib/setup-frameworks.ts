// Field definitions for the Offer Clarity Template (OCT) and Messaging Codex
// Ported from the Vite prototype's setupFrameworks.js

export type FieldDef = {
  key: string
  label: string
  placeholder: string
  hint: string
  required?: boolean
  textarea?: boolean
}

export type OCTSection = {
  number: number
  title: string
  context: string
  templateText: string
  fields: FieldDef[]
}

export type MessagingSection = {
  title: string
  subtitle: string
  fields: (FieldDef & { description: string })[]
}

// ─── Offer Clarity Template ───────────────────────────────────────────────────

export const OCT_ESSENTIALS: FieldDef[] = [
  { key: 'yourName', label: 'Your name', placeholder: 'e.g. Sarah Mitchell', hint: 'How you sign off your emails', required: true },
  { key: 'businessName', label: 'Business name', placeholder: 'e.g. The Sales Spice Co.', hint: 'Your brand or trading name' },
  { key: 'offerName', label: 'Programme name', placeholder: 'e.g. Magnetic Offers', hint: 'The name of the offer you\'re launching', required: true },
  { key: 'price', label: 'Investment', placeholder: 'e.g. £997', hint: 'The full price of your offer' },
  { key: 'paymentPlan', label: 'Payment plan', placeholder: 'e.g. or 3 payments of £349', hint: 'Leave blank if you\'re not offering one' },
]

export const OCT_SECTIONS: OCTSection[] = [
  {
    number: 1,
    title: 'Who it\'s for',
    context: 'Get specific. The more clearly you name your person and their exact situation, the more they\'ll recognise themselves — and the easier everything else becomes.',
    templateText: 'I help {{idealClient}} who are {{specificSituation}}.',
    fields: [
      { key: 'idealClient', label: 'Specific person', placeholder: 'e.g. female coaches, early-stage consultants, mums returning to business', hint: 'Describe the person, not just their job title', required: true, textarea: false },
      { key: 'specificSituation', label: 'Their current situation or stage', placeholder: 'e.g. who are stuck at 3k months and ready to scale', hint: 'Where are they right now? What stage are they at?', textarea: true },
    ],
  },
  {
    number: 2,
    title: 'The felt problem',
    context: 'Pain creates urgency. Name the problem in their language — the way they\'d say it to a friend, not the way an expert would describe it. Then go deeper to what it\'s actually costing them.',
    templateText: 'They\'re struggling with {{feltProblem}} and it\'s causing {{emotionalConsequence}}.',
    fields: [
      { key: 'feltProblem', label: 'The problem (in their words)', placeholder: 'e.g. they can\'t seem to get consistent clients no matter what they try', hint: 'How would they describe this to a friend? Use their language.', textarea: true },
      { key: 'emotionalConsequence', label: 'What it\'s causing them', placeholder: 'e.g. exhaustion, self-doubt, nearly giving up on the whole thing', hint: 'The emotional or practical cost of staying stuck', textarea: false },
    ],
  },
  {
    number: 3,
    title: 'The root cause',
    context: 'This is your diagnosis — what most people miss or get wrong. Your expertise is in seeing the real reason they\'re stuck, even when they can\'t see it themselves.',
    templateText: 'The real reason this is happening is {{rootCause}}.',
    fields: [
      { key: 'rootCause', label: 'The real reason (your diagnosis)', placeholder: 'e.g. they\'re selling features not transformations, so nothing they put out creates desire', hint: 'What do most people get wrong? What\'s the thing they can\'t see?', textarea: true },
    ],
  },
  {
    number: 4,
    title: 'The method',
    context: 'Name your approach. A named framework or process makes your method feel distinct, proprietary, and trustworthy — even if the principles aren\'t brand new.',
    templateText: 'I solve this using {{methodName}}, which works by {{methodHow}}.',
    fields: [
      { key: 'methodName', label: 'Your framework or process name', placeholder: 'e.g. The Magnetic Offers Method, The Arena Framework', hint: 'Give it a name — it doesn\'t need to be complicated', textarea: false },
      { key: 'methodHow', label: 'How it works (brief)', placeholder: 'e.g. by building desire and positioning before the launch even starts', hint: 'One or two sentences on what makes your approach different', textarea: true },
    ],
  },
  {
    number: 5,
    title: 'The transformation',
    context: 'The before and after. Be specific — vague transformations don\'t convert. The \'so that\' is where the real desire lives. Go one level deeper than the obvious result.',
    templateText: 'By the end, they go from {{beforeState}} to {{transformation}} — so that {{lifeBizImpact}}.',
    fields: [
      { key: 'beforeState', label: 'Where they are now (specific)', placeholder: 'e.g. guessing at content, posting and hoping, watching their peers sell out while they stay stuck', hint: 'Paint the specific before — make it recognisable', textarea: true },
      { key: 'transformation', label: 'Where they\'ll be (specific)', placeholder: 'e.g. launching with a full waitlist, a clear plan, and the confidence that their messaging actually converts', hint: 'The specific, tangible after state', required: true, textarea: true },
      { key: 'lifeBizImpact', label: 'The deeper life or business impact', placeholder: 'e.g. they finally feel like the expert they are — and their bank account agrees', hint: 'One level deeper than the obvious result. What does this unlock?', textarea: false },
    ],
  },
  {
    number: 6,
    title: 'Delivery',
    context: 'How the work actually happens. Be clear and concrete — \'a 6-week group programme\' lands better than \'an experience\'.',
    templateText: 'This is delivered as {{deliveryFormat}} over {{timeframe}}.',
    fields: [
      { key: 'deliveryFormat', label: 'Delivery format', placeholder: 'e.g. 8-week live group programme, 1:1 intensive, self-paced course with live Q&A calls', hint: 'How is this delivered?', textarea: false },
      { key: 'timeframe', label: 'Timeframe', placeholder: 'e.g. 6 weeks, 90 days, 3 months', hint: 'How long does it run?', textarea: false },
    ],
  },
  {
    number: 7,
    title: 'What\'s included',
    context: 'List your core components clearly. Connect each one back to the transformation where you can.',
    templateText: 'Inside you get: {{deliverables}}.',
    fields: [
      { key: 'deliverables', label: 'Core deliverables', placeholder: 'e.g. 8 live group calls, Voxer support, done-for-you launch template pack, lifetime access', hint: 'List the core components. One per line works well.', textarea: true },
    ],
  },
  {
    number: 8,
    title: 'Bonuses',
    context: 'Bonuses should overcome a specific objection or accelerate a specific result — not just add bulk.',
    templateText: 'You also get {{bonusName}}, which helps you {{bonusBenefit}}.',
    fields: [
      { key: 'bonusName', label: 'Bonus name', placeholder: 'e.g. The Objection Buster Vault, Done-For-You Sales Page Template', hint: 'Give it a name that communicates the result', textarea: false },
      { key: 'bonusBenefit', label: 'What it helps them with', placeholder: 'e.g. handle the most common reasons people don\'t buy', hint: 'What specific objection does it overcome or result does it accelerate?', textarea: false },
    ],
  },
  {
    number: 9,
    title: 'Price & value',
    context: 'The investment lands differently when it\'s framed against the transformation. Don\'t just state the number — anchor it to what they\'re getting.',
    templateText: 'Investment: {{price}} — {{valueJustification}}.',
    fields: [
      { key: 'valueJustification', label: 'One-line value justification', placeholder: 'e.g. less than the cost of one missed launch, and you\'ll have a framework that works every time', hint: 'Anchor the price to the transformation — not to competing programmes', textarea: false },
    ],
  },
  {
    number: 10,
    title: 'Social proof',
    context: 'Specificity builds trust. The more relatable and specific, the better.',
    templateText: 'People like {{socialProofPerson}} have used this to {{socialProofResult}}.',
    fields: [
      { key: 'socialProofPerson', label: 'Who got results (relatable description)', placeholder: 'e.g. coaches with under 1,000 followers, women who\'d never launched before', hint: 'Make them recognisable to your ideal client — not aspirational, relatable', textarea: false },
      { key: 'socialProofResult', label: 'What they achieved', placeholder: 'e.g. sell out their first group programme in 48 hours, hit a £5k month for the first time', hint: 'Specific results — numbers where you have them', textarea: true },
      { key: 'testimonial', label: 'A client quote (optional)', placeholder: 'e.g. "Working with Sarah completely changed how I approach selling. I made £3k in my first launch." — Emma, life coach', hint: 'A real quote used in emails and copy. Include name and who they are.', textarea: true },
    ],
  },
  {
    number: 11,
    title: 'Urgency',
    context: 'Real urgency converts. Make it genuine — a deadline, a cohort size, a founding price.',
    templateText: 'This is open until {{urgencyDate}} — after that, {{urgencyConsequence}}.',
    fields: [
      { key: 'urgencyDate', label: 'Closing date or deadline', placeholder: 'e.g. Sunday 28th April at midnight, 8 spots only, founding price ends Friday', hint: 'When does the offer close or the price change?', textarea: false },
      { key: 'urgencyConsequence', label: 'What happens if they miss it', placeholder: 'e.g. doors close and the next intake isn\'t until September, price goes up to £1,497', hint: 'Make it real — what are they actually missing?', textarea: false },
    ],
  },
  {
    number: 12,
    title: 'The next step',
    context: 'One clear action. Don\'t give options — tell them exactly what to do next.',
    templateText: 'To get started: {{ctaText}} → {{salesPageUrl}}',
    fields: [
      { key: 'ctaText', label: 'Your call to action', placeholder: 'e.g. Click the link to join before midnight Sunday', hint: 'One action only. Make it feel easy and exciting.', textarea: false },
      { key: 'waitlistUrl', label: 'Waitlist page URL', placeholder: 'e.g. yourwebsite.com/waitlist', hint: 'Where people join your waitlist (Alpha only)', textarea: false },
      { key: 'salesPageUrl', label: 'Sales page URL', placeholder: 'e.g. yourwebsite.com/magneticoffers', hint: 'Where people go to buy', textarea: false },
    ],
  },
]

// Arena-specific extras shown after section 6
export const OCT_ARENA_EXTRAS: FieldDef[] = [
  { key: 'leadMagnet', label: 'Lead magnet name', placeholder: 'e.g. The 5-Day Visibility Challenge, Free Your Niche Workshop', hint: 'The name of your free resource that builds your list' },
  { key: 'liveEventTitle', label: 'Live event title', placeholder: 'e.g. Sell Out Your Offer Masterclass, The Superfans 60 Workshop', hint: 'The name of your conversion event' },
]

// ─── Messaging Codex ──────────────────────────────────────────────────────────

export const MESSAGING_CODEX_SECTIONS: MessagingSection[] = [
  {
    title: 'Story & Problem',
    subtitle: 'The elements that hook your reader and make them feel seen',
    fields: [
      { key: 'headline', label: 'Headline', description: 'The big promise in one line. What\'s the result they\'re going to get from working with you? Lead with the destination.', placeholder: 'e.g. Sell out your programme without a huge audience', hint: '', textarea: false },
      { key: 'hook', label: 'Hook', description: 'A bold, surprising, or counterintuitive statement that creates an immediate open loop. It should challenge the belief that\'s been holding them back.', placeholder: 'e.g. The reason your launches feel hard has nothing to do with your audience size — it\'s your messaging', hint: '', textarea: true },
      { key: 'problem', label: 'Problem', description: 'State the problem clearly, in their language. Not the solution — the pain they\'re in right now.', placeholder: 'e.g. Most coaches are launching before their message is ready — and wondering why nothing is converting', hint: '', textarea: true },
      { key: 'agitation', label: 'Agitation', description: 'Deepen the pain. What\'s the consequence of staying stuck? What\'s getting worse? This is where you amplify the urgency to change.', placeholder: 'e.g. Which means they\'re burning through their audience\'s goodwill, losing confidence with every post that gets ignored', hint: '', textarea: true },
      { key: 'reframe', label: 'Reframe', description: 'Shift their belief. Show them the real problem isn\'t what they think — and that because of that, there\'s actually a way out they haven\'t tried yet.', placeholder: 'e.g. It\'s not a visibility problem. It\'s not an audience size problem. It\'s a messaging problem — and that\'s completely fixable.', hint: '', textarea: true },
    ],
  },
  {
    title: 'Solution & Fit',
    subtitle: 'The elements that make your offer feel like the obvious next step',
    fields: [
      { key: 'mechanism', label: 'Mechanism', description: 'What makes YOUR approach different? This isn\'t just \'what you do\' — it\'s the specific reason your method works when other things haven\'t.', placeholder: 'e.g. The Magnetic Offers Method works because it builds desire and positioning before the launch even starts', hint: '', textarea: true },
      { key: 'whoFor', label: 'Who it\'s for', description: 'One powerful line that makes your ideal client feel called in — and creates subtle urgency for anyone on the fence.', placeholder: 'e.g. For coaches who are done playing small and ready to launch with a plan that actually works', hint: '', textarea: false },
      { key: 'whoNotFor', label: 'Who it\'s NOT for', description: 'Counterintuitive but powerful — stating who this isn\'t for builds trust and actually makes the right people more certain. Be honest.', placeholder: 'e.g. Not for people looking for a quick fix, or who aren\'t ready to show up consistently during their launch', hint: '', textarea: true },
      { key: 'features', label: 'Features summary', description: 'A punchy overview of what\'s inside — used in social posts and emails. Not a full list, more of a highlights reel.', placeholder: 'e.g. 8 live sessions, Voxer support, launch templates, private community, done-for-you content plan', hint: '', textarea: true },
    ],
  },
  {
    title: 'Close',
    subtitle: 'The elements that convert readers into buyers',
    fields: [
      { key: 'proof', label: 'Proof', description: 'A punchy proof point — specific results, not vague claims. Lead with the most surprising or relatable result you have.', placeholder: 'e.g. My clients have gone from zero launches to £10k months using this exact framework', hint: '', textarea: true },
      { key: 'priceValue', label: 'Price & value statement', description: 'Frame the investment against the transformation, not against competing programmes. What does it cost them NOT to do this?', placeholder: 'e.g. For less than the cost of one missed launch, you get a complete system that works every single time', hint: '', textarea: true },
      { key: 'urgencyScarcity', label: 'Urgency & scarcity', description: 'Real urgency — not manufactured. A deadline, limited spots, founding price. Make the cost of waiting feel real.', placeholder: 'e.g. I\'m only taking 8 people this round so I can give everyone proper attention. Doors close Sunday at midnight.', hint: '', textarea: true },
      { key: 'close', label: 'Close', description: 'Your final word. This should feel warm, direct, and like permission — not pressure. Talk to the one person who\'s on the edge of saying yes.', placeholder: 'e.g. If you\'re reading this and something in you is saying yes — that\'s enough. Join us. I\'ll see you inside.', hint: '', textarea: true },
    ],
  },
]

export const REQUIRED_OFFER_FIELDS = ['yourName', 'offerName', 'idealClient', 'transformation']
