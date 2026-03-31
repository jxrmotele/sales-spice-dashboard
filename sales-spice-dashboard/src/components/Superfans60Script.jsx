import { useState } from 'react'
import { T } from '../theme'
import { applyOfferDetails } from '../utils/launchBuilder'

// Superfans 60 Script Framework — shown inside task 3-2 "Prepare your live event content"
// Full 14-section outline with timings, what to do, and the common mistake for each section.
// When offerDetails is present, a "Your Script" view generates a personalised script doc.

export const SUPERFANS60_SECTIONS = [
  {
    number: 1,
    name: 'Hook',
    timing: '1 min',
    what: 'Open with a bold, surprising, or counterintuitive statement that creates an open loop. Your job in the first 60 seconds is to earn the right to their attention.',
    formula: '"What if everything you\'ve been taught about [topic] is wrong?"\n"In the next 60 minutes I\'m going to show you [specific result]."\n"The #1 reason people fail at [topic] has nothing to do with [what they think it is]."',
    mistake: 'Stalling, chatting, or waiting for the room to fill. Start strong immediately.',
    scriptTemplate: `What if I told you that the reason {{idealClient}} struggle with {{feltProblem}} has nothing to do with what they think it is?

In the next 60 minutes, I'm going to show you exactly how to {{transformation}} — even if you've tried other approaches and nothing has worked.

My name is {{yourName}}, and by the end of this training you'll have a clear path forward.

Stay until the very end — I have something special for everyone who stays live.`,
  },
  {
    number: 2,
    name: 'Symptom',
    timing: '1 min',
    what: '"You\'re here because…" Name 2–3 escalating pain points your audience is experiencing. Go specific. The goal is to make them feel seen — like you wrote this event just for them.',
    formula: 'Pain point 1 → Pain point 2 → Pain point 3 (each one a little deeper and more specific than the last)',
    mistake: 'Being vague or too big-picture. The more specific you are, the more they trust you understand them.',
    scriptTemplate: `You're here because {{feltProblem}}.

And I know that's causing {{emotionalConsequence}}.

Maybe you've tried doing more — more content, more strategies, more advice. And yet here you are, still dealing with the same problem.

You're not lazy. You're not doing it wrong. You just haven't had the right approach yet. That's what today is about.`,
  },
  {
    number: 3,
    name: 'Tease',
    timing: '1 min',
    what: '"Before we dive in… if you stay until the end, I\'m going to give you [bonus thing]." Create a reason for people to stay live. Reference this at the beginning, the middle, and the end.',
    formula: 'A Q&A, a private audit, a resource, or early access — something only available to live attendees.',
    mistake: 'Mentioning it once and forgetting. You need to remind them throughout or it loses its power.',
    scriptTemplate: `Before we dive in — if you stay until the very end of today's training, I have something special just for live attendees.

[Describe your live-only bonus here — an audit, a personalised resource, early access, or a live Q&A. Make it something genuinely valuable that you only give to people who show up.]

I'll remind you about it at the halfway mark. But stay right until the end to claim it.`,
  },
  {
    number: 4,
    name: 'Promise',
    timing: '1 min',
    what: '"By the end of this training you\'ll have…" Paint the transformation they\'ll experience just from watching — even before they buy anything. Make it specific and exciting.',
    formula: '"You\'ll leave today with [specific result], [specific insight], and [specific next step]."\nBe genuinely enthusiastic about what you\'re about to teach.',
    mistake: 'Not being excited enough. Your energy about the content sets the tone for everything that follows.',
    scriptTemplate: `By the end of this training, you're going to have:
→ A clear understanding of why {{feltProblem}} has been happening and what's really causing it
→ The specific approach that helps {{idealClient}} {{transformation}}
→ Your next concrete action step — something you can implement today

Even if you've been stuck for a long time. Even if you've tried other things. What I'm sharing today is different — because we're finally solving the real problem.`,
  },
  {
    number: 5,
    name: 'Position',
    timing: '2–3 min',
    what: '"I used to…" Tell your expertise arc. Show that you\'ve been where they are, tried the common approach, found it didn\'t work, discovered a new way, and here\'s where you are now.',
    formula: 'I was where you are → I tried [common solution] → It didn\'t work → I discovered [your approach] → Here\'s what changed',
    mistake: 'Making it about you rather than them. They need to see themselves in your struggle — so they believe the transformation is possible for them.',
    scriptTemplate: `I used to be exactly where you are.

I was {{beforeState}}. I tried everything people recommended — [the common approaches your audience tries]. I followed all the advice. Nothing worked.

Then I discovered {{methodName}} — {{methodHow}}.

And everything changed. I went from {{beforeState}} to {{transformation}}. And since then, I've helped {{idealClient}} do the same — including {{socialProofPerson}} who {{socialProofResult}}.

That's why I created {{offerName}}, and why I'm sharing all of this today.`,
  },
  {
    number: 6,
    name: 'Shift',
    timing: '2 min',
    what: '"You think your problem has been THIS… it\'s really THIS." Identify and overcome the single biggest belief blocking your audience from saying yes to your solution.',
    formula: '"Most people think they need [X]. What they actually need is [Y]. Here\'s why…"',
    mistake: 'Trying to shift too many beliefs at once. Pick the ONE main objection and address it fully. More shifts = diluted impact.',
    scriptTemplate: `Here's what most people think their problem is: {{feltProblem}}.

So they try to fix that directly. They work harder, try different tactics, look for the missing strategy.

But here's the truth: {{rootCause}}.

{{reframe}}

That's why everything else hasn't worked — you've been solving the wrong problem. The moment you address the real cause, everything gets easier.`,
  },
  {
    number: 7,
    name: '3 Strategies',
    timing: '20 min',
    what: '"Now I\'m going to share the 3 strategies / steps / secrets to [TRANSFORMATION]."\n\nFor each strategy (5–10 min max):\n→ Introduce the strategy\n→ Why similar approaches haven\'t worked\n→ What really works and why\n→ The before state vs. after state\n→ A client story that proves it\n→ A testimonial if you have one\n→ Bridge back to how your offer covers this\n\n⚠ GET TO THE OFFER BEFORE 45 MINUTES.',
    formula: 'Strategy 1: [Foundation / Problem awareness]\nStrategy 2: [The method / Framework]\nStrategy 3: [The result / Advanced application]',
    mistake: 'Overteaching — giving so much value they feel they don\'t need the offer. And forgetting to bridge each strategy back to the programme. Every strategy should make the offer feel more necessary, not less.',
    scriptTemplate: `Now I'm going to share the 3 strategies that help {{idealClient}} go from {{beforeState}} to {{transformation}}.

⚠ REMINDER: Get to the offer before 45 minutes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRATEGY 1: [Name your first strategy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Why the common approach fails here: [your insight]
→ What actually works: [your method for this step]
→ Client story: [who, what changed, what it unlocked]
→ Bridge: "Inside {{offerName}}, this is exactly what we cover in [module/session]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRATEGY 2: [Name your second strategy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Why the common approach fails here: [your insight]
→ What actually works: [your method for this step]
→ Client story: [who, what changed, what it unlocked]
→ Bridge: "{{offerName}} handles this by [how]"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
STRATEGY 3: [Name your third strategy]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
→ Why the common approach fails here: [your insight]
→ What actually works: [your method for this step]
→ Client story: [who, what changed, what it unlocked]
→ Bridge: "By the end of {{offerName}}, you'll have [result from this strategy]"`,
  },
  {
    number: 8,
    name: 'Lock-In',
    timing: '1 min',
    what: '"So can you see how…" Summarise what you\'ve just covered. Make them feel the weight of what they\'ve learned. Get chat reactions — ask a yes/no question to get them engaged before you pivot to the offer.',
    formula: '"So we\'ve covered [strategy 1], [strategy 2], and [strategy 3]. Can you see how, if you applied these, you\'d [result]? Drop a ✅ in the chat if this is landing."',
    mistake: 'Skipping this and going straight to the offer. The Lock-In creates the psychological moment of "I need this" before you introduce the solution.',
    scriptTemplate: `So — can you see how those three strategies work together?

Strategy 1 gives you [result].
Strategy 2 gives you [result].
Strategy 3 gives you [result].

When you put all three together, you have a clear path from {{beforeState}} to {{transformation}}.

Drop a ✅ in the chat if this is landing for you. I love seeing your responses come in.`,
  },
  {
    number: 9,
    name: 'Bridge',
    timing: '30 sec',
    what: '"How many of you would like to [hear about how you can get this result for yourself]?" Get explicit consent before you pitch. This reframes what follows as something they asked for — not something being done to them.',
    formula: '"I want to share something with you — is that okay?" or "For those of you who want to take this further, I have something for you."',
    mistake: 'Skipping it entirely. Apologising for the pitch. Or worse — telling people "you can leave if you\'re not interested." Never give permission to leave.',
    scriptTemplate: `I want to share something with you — is that okay?

For those of you who are thinking "I want to actually implement this" — I've created something that walks you through this exact process step by step, with full support.

Drop a YES in the chat if you want to hear more.`,
  },
  {
    number: 10,
    name: 'Offer',
    timing: '2–3 min',
    what: '"I want to introduce you to…" Reveal the offer. Anchor it firmly to the transformation — not the features. Do NOT reveal the price yet. Your job here is to build perceived value before any numbers appear.',
    formula: '"[Offer name] is [what it is] for [who it\'s for], so that they can [transformation] without [objection]."',
    mistake: 'Going straight to the curriculum or feature list. Lead with the result, then show how the features deliver it.',
    scriptTemplate: `I want to introduce you to {{offerName}}.

{{offerName}} is a {{deliveryFormat}} for {{idealClient}} who are ready to go from {{beforeState}} to {{transformation}}.

This isn't about more information. It's about having the right structure, the right support, and the right strategy — so you can finally {{transformation}}, so that {{lifeBizImpact}}.

[Do NOT reveal the price yet — build value first. Show them what's inside.]`,
  },
  {
    number: 11,
    name: 'Stack',
    timing: '5–8 min',
    what: '"Here\'s everything you\'re going to get…" Walk through each component slide by slide. Let your audience mentally add up the value. Show that you\'ve over-invested in making results frictionless — so the price feels like a fraction of what they\'re getting.',
    formula: 'Component → What it is → Why it matters → Standalone value\n(Then add them up before revealing the actual investment)',
    mistake: 'Rushing the stack, or putting everything on 1–3 slides. Each component deserves its own moment. And revealing the price before the full stack is complete kills the perceived value.',
    scriptTemplate: `Here's everything you get inside {{offerName}}:

{{deliverables}}

[Walk through each component on its own slide:
  → What it is
  → Why it matters for getting to {{transformation}}
  → Its standalone value]

BONUS: {{bonusName}}
{{bonusBenefit}}

[Add up all the components before revealing the price. Let them feel the total value.]`,
  },
  {
    number: 12,
    name: 'Bonuses',
    timing: '2–3 min',
    what: '"There\'s one more thing…" Reveal a bonus exclusive to live attendees — this rewards those who showed up. Then 1–2 additional bonuses for people who join within 48 hours. Bonuses should overcome a specific objection or accelerate a specific result.',
    formula: 'Live bonus: [Something that rewards attending today]\n48-hour bonus 1: [Overcomes main objection]\n48-hour bonus 2: [Accelerates a specific result]',
    mistake: 'Bonuses that feel random or padded. Every bonus should make someone think "oh, that\'s exactly what I was worried about."',
    scriptTemplate: `There's one more thing.

Because you showed up live today, you're getting [LIVE BONUS] — available only to people in this room right now. Not the replay. Right now.

And for anyone who joins {{offerName}} within the next 48 hours:

→ {{bonusName}}: {{bonusBenefit}}
→ [Add a second bonus that overcomes another common objection]

These bonuses are not available after [48-hour deadline]. If you know you want {{transformation}} — now is the moment.`,
  },
  {
    number: 13,
    name: 'Close',
    timing: '2 min',
    what: 'Your direct call to action. State the price, the payment options, and the deadline clearly. Real urgency only — cohort start date, limited spots, founding price ending, or bonus deadline. Make the cost of waiting feel real.',
    formula: '"[Offer name] is [price] or [payment plan]. When you join before [deadline] you also get [bonus]. Here\'s the link: [URL]."',
    mistake: 'Just ending the event without a proper close. Or manufactured urgency that people see through. Real deadlines convert. Fake ones destroy trust.',
    scriptTemplate: `{{offerName}} is {{price}}.
Payment plan available: {{paymentPlan}}

When you join before {{urgencyDate}}, you also get everything we just covered in the bonus stack.

After {{urgencyDate}}: {{urgencyConsequence}}.

Here's your link: {{salesPageUrl}}

[Say the URL out loud. Drop it in chat. Make it impossible to miss.]

If {{transformation}} is something you genuinely want — and you know you'd regret not trying — this is your moment.`,
  },
  {
    number: 14,
    name: 'FAQs',
    timing: '5–10 min',
    what: '"I know you have questions…" Frame every objection as a question someone genuinely asked. Answer them positively — showing how the programme handles each concern, not just dismissing it. Use the WWWWWH structure: Who, What, When, Where, Why, How.',
    formula: 'Q: [Reframe the objection as a genuine question]\nA: [Positive, specific answer that addresses the concern and reinforces the value]',
    mistake: 'Answering FAQs in a way that reinforces the objection. "I know it\'s a big investment, but…" — you\'ve just made the price feel bigger. Lead every answer with the positive.',
    scriptTemplate: `Let me answer the questions I know you have.

Q: Is {{offerName}} right for me?
A: {{offerName}} is for {{idealClient}} who want to {{transformation}}. If that's you — this is for you.

Q: What does it include?
A: {{deliverables}}

Q: Is there a payment plan?
A: Yes — {{paymentPlan}}

Q: What if I can't make all the live sessions?
A: [Your answer — lead with the positive]

Q: [Your most common objection, framed as a question]
A: [Lead with the positive. Show how {{offerName}} handles this — don't apologise for it.]

Final word: {{testimonial}}

The link is {{salesPageUrl}}. Doors close {{urgencyDate}}.`,
  },
]

function fill(template, od) {
  if (!od || Object.keys(od).filter((k) => od[k]).length === 0) return template
  return applyOfferDetails(template, od)
}

function hasData(od) {
  return od && Object.keys(od).some((k) => od[k] && od[k].trim && od[k].trim() !== '')
}

export default function Superfans60Script({ offerDetails }) {
  const [view, setView] = useState('framework') // 'framework' | 'script'
  const [expanded, setExpanded] = useState(null)
  const [allOpen, setAllOpen] = useState(false)
  const [copied, setCopied] = useState(false)

  const od = offerDetails || {}
  const canGenerate = hasData(od)

  function toggle(num) {
    if (allOpen) {
      setAllOpen(false)
      setExpanded(num)
    } else {
      setExpanded(expanded === num ? null : num)
    }
  }

  function toggleAll() {
    setAllOpen((v) => !v)
    setExpanded(null)
  }

  function buildFullScript() {
    return SUPERFANS60_SECTIONS.map((s) => {
      const filledScript = fill(s.scriptTemplate, od)
      return `━━━ ${s.number}. ${s.name.toUpperCase()} (${s.timing}) ━━━\n\n${filledScript}`
    }).join('\n\n\n')
  }

  function handleCopy() {
    navigator.clipboard.writeText(buildFullScript()).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <div>
          <div style={styles.headerLabel}>✦ Superfans 60 Script Framework</div>
          <div style={styles.headerSub}>
            {canGenerate ? 'Personalised for your offer · 14 sections' : '14 sections · click each to expand'}
          </div>
        </div>
        <div style={styles.headerRight}>
          {canGenerate && (
            <div style={styles.viewTabs}>
              <button
                style={{ ...styles.viewTab, ...(view === 'framework' ? styles.viewTabActive : {}) }}
                onClick={() => setView('framework')}
              >
                Framework
              </button>
              <button
                style={{ ...styles.viewTab, ...(view === 'script' ? styles.viewTabActive : {}) }}
                onClick={() => setView('script')}
              >
                Your Script
              </button>
            </div>
          )}
          {view === 'framework' && (
            <button style={styles.toggleAllBtn} onClick={toggleAll}>
              {allOpen ? 'Collapse all' : 'Expand all'}
            </button>
          )}
        </div>
      </div>

      {view === 'framework' && (
        <div style={styles.sections}>
          {SUPERFANS60_SECTIONS.map((s) => {
            const isOpen = allOpen || expanded === s.number
            return (
              <div key={s.number} style={styles.section}>
                <button
                  style={{ ...styles.sectionBtn, ...(isOpen ? styles.sectionBtnOpen : {}) }}
                  onClick={() => toggle(s.number)}
                >
                  <div style={styles.sectionLeft}>
                    <span style={{ ...styles.sectionNum, ...(isOpen ? styles.sectionNumOpen : {}) }}>
                      {s.number}
                    </span>
                    <div>
                      <span style={styles.sectionName}>{s.name}</span>
                      <span style={styles.sectionTiming}>{s.timing}</span>
                    </div>
                  </div>
                  <span style={styles.sectionArrow}>{isOpen ? '▲' : '▼'}</span>
                </button>

                {isOpen && (
                  <div style={styles.sectionBody}>
                    <p style={styles.sectionWhat}>{s.what}</p>
                    {s.formula && (
                      <div style={styles.formulaBlock}>
                        <div style={styles.formulaLabel}>Formula</div>
                        <pre style={styles.formulaText}>{s.formula}</pre>
                      </div>
                    )}
                    <div style={styles.mistakeBlock}>
                      <span style={styles.mistakeLabel}>⚠ Common mistake: </span>
                      <span style={styles.mistakeText}>{s.mistake}</span>
                    </div>
                    {canGenerate && (
                      <div style={styles.scriptSnippet}>
                        <div style={styles.scriptSnippetLabel}>✦ Your script for this section</div>
                        <pre style={styles.scriptSnippetText}>{fill(s.scriptTemplate, od)}</pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {view === 'script' && canGenerate && (
        <div style={styles.scriptView}>
          <div style={styles.scriptHeader}>
            <div style={styles.scriptHeaderText}>
              <div style={styles.scriptTitle}>Your Personalised {od.liveEventTitle || 'Live Event'} Script</div>
              <div style={styles.scriptSub}>Generated from your offer details · 14 sections · approx. 60 min</div>
            </div>
            <button style={styles.copyBtn} onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy full script'}
            </button>
          </div>
          <div style={styles.scriptDoc}>
            {SUPERFANS60_SECTIONS.map((s) => (
              <div key={s.number} style={styles.scriptSection}>
                <div style={styles.scriptSectionHeader}>
                  <span style={styles.scriptSectionNum}>{s.number}</span>
                  <span style={styles.scriptSectionName}>{s.name}</span>
                  <span style={styles.scriptSectionTiming}>{s.timing}</span>
                </div>
                <pre style={styles.scriptSectionText}>{fill(s.scriptTemplate, od)}</pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const styles = {
  wrapper: {
    marginBottom: 16,
    background: T.insetBg,
    border: `1px solid ${T.purple}`,
    boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 14px 8px',
    borderBottom: `1px dotted ${T.light}`,
    gap: 8,
    flexWrap: 'wrap',
  },
  headerLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
  },
  headerSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    marginTop: 4,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  viewTabs: {
    display: 'flex',
    background: T.light,
    borderRadius: 8,
    padding: 2,
    gap: 2,
  },
  viewTab: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.muted,
    background: 'transparent',
    border: 'none',
    borderRadius: 2,
    padding: '3px 10px',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
  },
  viewTabActive: {
    background: T.purple,
    color: '#fff',
  },
  toggleAllBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.purpleDark,
    background: T.light,
    border: 'none',
    borderRadius: 8,
    padding: '4px 12px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  sections: {
    display: 'flex',
    flexDirection: 'column',
  },
  section: {
    borderBottom: `1px solid ${T.light}`,
  },
  sectionBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '10px 14px',
    background: 'transparent',
    border: 'none',
    cursor: 'pointer',
    fontFamily: T.body,
    textAlign: 'left',
    transition: 'background 0.15s ease',
  },
  sectionBtnOpen: {
    background: '#fce7f3',
  },
  sectionLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  sectionNum: {
    width: 24,
    height: 24,
    borderRadius: '50%',
    background: T.light,
    color: T.muted,
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'all 0.15s ease',
  },
  sectionNumOpen: {
    background: T.pink,
    color: '#fff',
  },
  sectionName: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    marginRight: 8,
  },
  sectionTiming: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
    fontWeight: 500,
  },
  sectionArrow: {
    fontSize: 10,
    color: T.purpleDark,
    flexShrink: 0,
  },
  sectionBody: {
    padding: '12px 14px 14px 48px',
    background: T.cardBg,
  },
  sectionWhat: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap',
    marginBottom: 10,
  },
  formulaBlock: {
    background: T.insetBg,
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '8px 12px',
    marginBottom: 10,
  },
  formulaLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purpleDark,
    marginBottom: 4,
  },
  formulaText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.6,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  mistakeBlock: {
    fontFamily: T.body,
    fontSize: 12,
    lineHeight: 1.5,
    background: '#fef9c3',
    borderLeft: `3px solid ${T.yellow}`,
    borderRadius: '0 4px 4px 0',
    padding: '7px 10px',
    marginBottom: 10,
  },
  mistakeLabel: {
    fontWeight: 700,
    color: '#92400e',
  },
  mistakeText: {
    color: '#78350f',
  },
  scriptSnippet: {
    background: '#eff6ff',
    border: '1px solid #bfdbfe',
    borderRadius: 8,
    padding: '8px 12px',
    marginTop: 4,
  },
  scriptSnippetLabel: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.blueDark,
    marginBottom: 6,
  },
  scriptSnippetText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.65,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
  // Script view
  scriptView: {
    display: 'flex',
    flexDirection: 'column',
  },
  scriptHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: '12px 14px',
    borderBottom: `1px dotted ${T.light}`,
    gap: 12,
  },
  scriptHeaderText: {},
  scriptTitle: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
    marginBottom: 2,
  },
  scriptSub: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  copyBtn: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.purpleDark,
    background: T.light,
    border: 'none',
    borderRadius: 8,
    padding: '5px 14px',
    cursor: 'pointer',
    flexShrink: 0,
  },
  scriptDoc: {
    padding: '4px 0 8px',
  },
  scriptSection: {
    padding: '14px 14px 10px',
    borderBottom: `1px solid ${T.light}`,
  },
  scriptSectionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  scriptSectionNum: {
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: T.pink,
    color: '#fff',
    fontFamily: T.body,
    fontSize: 10,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  scriptSectionName: {
    fontFamily: T.body,
    fontSize: 12,
    fontWeight: 700,
    color: T.indigo,
  },
  scriptSectionTiming: {
    fontFamily: T.body,
    fontSize: 11,
    color: T.muted,
  },
  scriptSectionText: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.indigo,
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    margin: 0,
  },
}
