// Alpha Launch Template
// Sell to a warm waitlist — 4 weeks of daily content driving sign-ups, then selling.
// All task dates are relative: they calculate automatically from the client's key dates.

export const alphaTemplate = {
  id: 'alpha',
  name: 'Alpha Launch',
  tagline: 'Sell to a warm waitlist',
  description:
    'A focused 4-week launch for selling directly to an audience you\'ve already built. No live event required — just clear messaging, warm content, and a waitlist ready to buy.',
  color: '#f472b6',
  keyDateLabels: {
    launchStart: {
      label: 'Content Kick-Off',
      description: 'The day your first email and social post goes out — Day 1 of building your waitlist.',
    },
    cartOpen: {
      label: 'Cart Open',
      description: 'When you open the doors and start selling directly to your waitlist.',
    },
    cartClose: {
      label: 'Cart Close',
      description: 'Your hard deadline — when enrolment closes.',
    },
  },
  phases: [
    // ─── PHASE 1: OFFER & POSITIONING ───────────────────────────────────────────
    {
      id: 1,
      name: 'Offer & Positioning',
      tagline: 'Get crystal clear on what you\'re selling and who it\'s for',
      color: '#f472b6',
      tasks: [
        {
          id: '1-1',
          name: 'Complete your offer clarity template',
          description:
            'Work through the offer clarity template to define exactly what you\'re selling, who it\'s for, and why they should buy it now. Get every element of your offer on paper before you write a word of copy.',
          relativeTo: 'launchStart',
          offsetDays: -14,
        },
        {
          id: '1-2',
          name: 'Build your simple sales page',
          salesPageBuilder: true,
          description:
            'Turn your offer clarity output into a clean, simple sales page. Headline, the transformation, what\'s included, investment, and a buy button. Nothing more.',
          relativeTo: 'launchStart',
          offsetDays: -10,
          contentTemplate: {
            salesPage: {
              title: '{{offerName}} — Sales Page Copy',
              sections: [
                {
                  label: 'Headline',
                  content: '{{transformation}} — even if {{objection}}',
                },
                {
                  label: 'Sub-headline',
                  content:
                    '{{offerName}} is a {{timeframe}} programme for {{idealClient}} who are done waiting and ready to {{transformation}}.',
                },
                {
                  label: 'The promise',
                  content:
                    'In {{timeframe}}, you will:\n\n→ [Outcome 1 — add your own]\n→ [Outcome 2 — add your own]\n→ [Outcome 3 — add your own]\n\nAll with the direct support of {{yourName}}.',
                },
                {
                  label: "What's inside",
                  content:
                    '[Module or session 1 — name and one-line description]\n[Module or session 2 — name and one-line description]\n[Module or session 3 — name and one-line description]\n[Bonus or added extra if applicable]',
                },
                {
                  label: 'Investment',
                  content:
                    '{{offerName}} is {{price}}.\n\nPayment plan: {{paymentPlan}}\n\n[Add your checkout link here]',
                },
                {
                  label: 'About {{yourName}}',
                  content:
                    "I'm {{yourName}}, founder of {{businessName}}.\n\nI help {{idealClient}} {{transformation}} in {{timeframe}}.\n\n[2–3 sentences about your background and why you're the right person to help them]",
                },
                {
                  label: 'A client result',
                  content: '{{testimonial}}',
                },
              ],
            },
          },
        },
        {
          id: '1-3',
          name: 'Set your pricing and payment options',
          description:
            'Finalise your investment for {{offerName}}. Set up your checkout link and test the full payment flow end-to-end. Check both the full pay and payment plan options before you go live.',
          relativeTo: 'launchStart',
          offsetDays: -10,
        },
        {
          id: '1-4',
          name: 'Set up your waitlist page',
          description:
            'A simple opt-in page. Headline, 2–3 bullet points on what\'s coming, and a form. Keep it fast and friction-free.',
          relativeTo: 'launchStart',
          offsetDays: -7,
          contentTemplate: {
            salesPage: {
              title: 'Waitlist Page Copy',
              sections: [
                {
                  label: 'Headline',
                  content: '{{offerName}} is coming — be the first to know',
                },
                {
                  label: 'Sub-headline',
                  content:
                    'A {{timeframe}} programme for {{idealClient}} who want to {{transformation}}.',
                },
                {
                  label: 'Waitlist benefits',
                  content:
                    '→ First to know when doors open\n→ Founding member pricing — the lowest this will ever be\n→ Limited spaces',
                },
                {
                  label: 'Button text',
                  content: 'Add me to the waitlist',
                },
                {
                  label: 'Confirmation email subject',
                  content: "You're on the {{offerName}} waitlist",
                },
                {
                  label: 'Confirmation email body',
                  content:
                    "Hey,\n\nYou're in. You'll be the first to know when {{offerName}} doors open.\n\nAs a waitlist member you get founding member pricing — the lowest this programme will ever be.\n\nI'll be in touch very soon.\n\n{{yourName}}",
                },
              ],
            },
          },
        },
      ],
    },

    // ─── PHASE 2: BUILD YOUR WAITLIST (14 days) ─────────────────────────────────
    {
      id: 2,
      name: 'Build Your Waitlist',
      tagline: '14 days of content driving your audience to join your waitlist',
      color: '#60a5fa',
      tasks: [
        {
          id: '2-1',
          sequence: 'waitlist-drive',
          name: 'Day 1 — The big announcement',
          description:
            'You go public today. First email and post announcing that something is coming. CTA: join the waitlist.',
          relativeTo: 'launchStart',
          offsetDays: 0,
          contentTemplate: {
            email: {
              subject: "Something I've been building just for you",
              body: `Hey,

I've been quietly working on something and today I'm finally ready to tell you about it.

{{offerName}} is a {{timeframe}} programme for {{idealClient}} who want to {{transformation}}.

I'm opening a small waitlist for the founding round — the first people to work with me on this.

Being on the waitlist means you'll hear first when doors open, and you'll get founding member pricing. It's the lowest this will ever be.

If that sounds like you → {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `Something I've been building is almost ready. 🌶️

{{offerName}} — a {{timeframe}} programme for {{idealClient}} who want to {{transformation}}.

The waitlist is open. Founding members get first access and the best rate.

→ Link in bio if you're curious.`,
            },
          },
        },
        {
          id: '2-2',
          sequence: 'waitlist-drive',
          name: 'Day 2 — Who this is for',
          description:
            'Get specific about your ideal client. Paint a clear picture of exactly who this is for and who it\'s not for. Resonance over reach.',
          relativeTo: 'launchStart',
          offsetDays: 1,
          contentTemplate: {
            email: {
              subject: 'Is this you?',
              body: `Hey,

Quick one today. I want to be really specific about who {{offerName}} is for.

This is for you if:
→ You're {{idealClient}}
→ You want to {{transformation}} in {{timeframe}}
→ You've been putting this off because {{objection}}
→ You're ready for support, not just more information

It's probably not for you if you're looking for a quick fix or not ready to commit for {{timeframe}}.

If the first list felt like a mirror — the waitlist is open.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `{{offerName}} is for {{idealClient}} who want to {{transformation}}.

Not everyone. The people who say "this is literally describing me right now."

Is that you? → Waitlist link in bio.`,
            },
          },
        },
        {
          id: '2-3',
          sequence: 'waitlist-drive',
          name: 'Day 3 — The problem you solve',
          description:
            'Name the pain. Describe the specific problem your ideal client is stuck in before they work with you. Make them feel seen.',
          relativeTo: 'launchStart',
          offsetDays: 2,
          contentTemplate: {
            email: {
              subject: "The real reason this isn't working yet",
              body: `Hey,

Here's something I see all the time with {{idealClient}}.

They're doing the work. They're showing up. But they're still not {{transformation}}.

The reason usually isn't what they think.

It's not lack of effort. It's not the wrong niche. It's not bad timing.

It's [the real reason — the thing you help them fix].

That's exactly what {{offerName}} is built to change.

Still not on the waitlist? → {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `The reason most {{idealClient}} don't {{transformation}} isn't effort.

It's [the real reason — one sentence].

{{offerName}} is built to fix that.

Waitlist is open. → Link in bio.`,
            },
          },
        },
        {
          id: '2-4',
          sequence: 'waitlist-drive',
          name: 'Day 4 — Your story',
          description:
            'Share why you built this. Personal story builds trust. Keep it real and specific — one moment of clarity, not your whole journey.',
          relativeTo: 'launchStart',
          offsetDays: 3,
          contentTemplate: {
            email: {
              subject: 'Why I built {{offerName}}',
              body: `Hey,

I want to tell you why I built {{offerName}}.

[Your story — 3–4 sentences. What did you struggle with? What changed? What made you decide to create this?]

I've since helped {{idealClient}} {{transformation}}, and I built this programme so more people could access that path without having to figure it out alone.

The waitlist is open for the founding round.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `I built {{offerName}} because [one sentence version of your story].

Now I help {{idealClient}} {{transformation}} in {{timeframe}}.

Founding round waitlist is open. → Link in bio.`,
            },
          },
        },
        {
          id: '2-5',
          sequence: 'waitlist-drive',
          name: 'Day 5 — Client result',
          description:
            'Share a specific result from someone you\'ve worked with. One real story beats twenty testimonials. Use their words where you can.',
          relativeTo: 'launchStart',
          offsetDays: 4,
          contentTemplate: {
            email: {
              subject: "What happened when [their name] did this work",
              body: `Hey,

I want to share something.

{{testimonial}}

[Expand this — 2–3 sentences. What were they struggling with before? What did they do? What changed?]

This is the kind of result {{offerName}} is designed to create.

The waitlist is still open → {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `{{testimonial}}

This is what changes when {{idealClient}} get the right support.

{{offerName}} founding round waitlist is open. → Link in bio.`,
            },
          },
        },
        {
          id: '2-6',
          sequence: 'waitlist-drive',
          name: "Day 6 — What's inside",
          description:
            'Give a sneak peek at the programme. What will they actually do and get? This is the curiosity post.',
          relativeTo: 'launchStart',
          offsetDays: 5,
          contentTemplate: {
            email: {
              subject: 'A look inside {{offerName}}',
              body: `Hey,

A few people have asked what's actually inside {{offerName}}, so here's a look.

Over {{timeframe}}, we'll cover:

→ [Week/module 1 — name and one line]
→ [Week/module 2 — name and one line]
→ [Week/module 3 — name and one line]
→ [Week/module 4 — name and one line]

Plus you'll get [support structure — calls, community, access to you, etc.]

The investment is {{price}}, with a payment plan: {{paymentPlan}}.

Doors open to the waitlist first.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `A look inside {{offerName}}:

→ [Week 1]
→ [Week 2]
→ [Week 3]
→ [Week 4]

{{timeframe}}. {{price}} / {{paymentPlan}}.

Waitlist gets first access. → Link in bio.`,
            },
          },
        },
        {
          id: '2-7',
          sequence: 'waitlist-drive',
          name: 'Day 7 — Week 1 reminder',
          description:
            'End of week one. Remind people the waitlist is open and spell out what founding member status actually means.',
          relativeTo: 'launchStart',
          offsetDays: 6,
          contentTemplate: {
            email: {
              subject: 'One week in — are you on the waitlist?',
              body: `Hey,

We're one week into the {{offerName}} build-up and I want to check in.

If you've been thinking about it — the waitlist is still open.

What founding members get that nobody else will:
→ First access when doors open
→ {{price}} — the lowest this investment will ever be
→ [Any founding member bonus or added extra]
→ A chance to work with me in the most intimate version of this programme

This won't come around again.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `One week in. {{offerName}} waitlist is still open.

Founding members get first access + the lowest price this will ever be.

If you've been thinking about it — now is the time. → Link in bio.`,
            },
          },
        },
        {
          id: '2-8',
          sequence: 'waitlist-drive',
          name: 'Day 8 — The transformation',
          description:
            'Before and after. Paint a vivid picture of life before and after working with you. Transformation content is some of the most compelling copy you can write.',
          relativeTo: 'launchStart',
          offsetDays: 7,
          contentTemplate: {
            email: {
              subject: 'The before and after',
              body: `Hey,

Let me paint a picture.

Before {{offerName}}: you're {{idealClient}}, you want to {{transformation}}, but [the frustrating stuck state they're in right now].

After {{timeframe}} inside {{offerName}}: [the after — specific, vivid, what life looks like on the other side].

{{testimonial}}

This is what's available on the other side of saying yes.

The waitlist closes in a few days — founding member pricing ends when it does.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `Before {{offerName}}: {{idealClient}} stuck in [the before state].

After {{timeframe}}: [the after — the transformation].

That's what this is about.

Waitlist is closing soon. → Link in bio.`,
            },
          },
        },
        {
          id: '2-9',
          sequence: 'waitlist-drive',
          name: 'Day 9 — Handle the main objection',
          description:
            'Name the number one reason people hesitate and address it directly. Don\'t dance around it — engage with it honestly. This is the most important email of the waitlist phase.',
          relativeTo: 'launchStart',
          offsetDays: 8,
          contentTemplate: {
            email: {
              subject: '"But {{objection}}"',
              body: `Hey,

The most common thing I hear from {{idealClient}} who want to join {{offerName}} is:

"{{objection}}"

I want to address this head on.

[3–5 honest sentences. Don't dismiss it — respect it and respond. Show you've thought about it and explain why it isn't the blocker they think it is.]

The people who get the most from {{offerName}} are usually the ones who started with this exact hesitation.

Waitlist closes soon.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `Thinking about {{offerName}} but held back by "{{objection}}"?

[One-line, honest, direct response.]

I say this with kindness: that thing you're telling yourself might be the exact reason you need this.

→ Waitlist link in bio. Closing soon.`,
            },
          },
        },
        {
          id: '2-10',
          sequence: 'waitlist-drive',
          name: 'Day 10 — How it works',
          description:
            'A practical breakdown of the programme. How does it actually work? Remove the mystery.',
          relativeTo: 'launchStart',
          offsetDays: 9,
          contentTemplate: {
            email: {
              subject: 'Exactly how {{offerName}} works',
              body: `Hey,

I've had a few questions about the format of {{offerName}}, so here's the full breakdown.

→ {{timeframe}} programme
→ [Format — e.g. weekly group calls / self-paced modules / live sessions]
→ [Community / group access details]
→ [Any 1:1 or async support]
→ [Access details — how long, how they log in, etc.]

The investment is {{price}}. Payment plan: {{paymentPlan}}.

Doors open to the waitlist in a few days.

Any questions? Hit reply.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `How {{offerName}} works:

→ {{timeframe}}
→ [Format]
→ [Community]
→ [Support]

{{price}} / {{paymentPlan}}

Founding spots are limited. Waitlist closes soon. → Link in bio.`,
            },
          },
        },
        {
          id: '2-11',
          sequence: 'waitlist-drive',
          name: 'Day 11 — Another win',
          description:
            'A second client story or result. Fresh proof, fresh voice. If you have one testimonial, expand the story differently this time.',
          relativeTo: 'launchStart',
          offsetDays: 10,
          contentTemplate: {
            email: {
              subject: 'Another one worth sharing',
              body: `Hey,

I want to share another win from someone who's done this work.

{{testimonial}}

[Expand this — what were they working on? What shifted? What did they say when it clicked?]

I'm sharing this because I want you to see what's possible when {{idealClient}} have the right support.

{{offerName}} is how I help people get there.

Waitlist closes in 3 days.

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `"{{testimonial}}"

This is what happens when {{idealClient}} stop doing it alone.

{{offerName}} waitlist closes in 3 days. → Link in bio.`,
            },
          },
        },
        {
          id: '2-12',
          sequence: 'waitlist-drive',
          name: 'Day 12 — Waitlist closing soon',
          description:
            'Urgency begins. The waitlist closes in 2 days. Be direct about what changes — the founding rate disappears.',
          relativeTo: 'launchStart',
          offsetDays: 11,
          contentTemplate: {
            email: {
              subject: 'The waitlist closes in 2 days',
              body: `Hey,

Just a heads up — the {{offerName}} waitlist closes in 2 days.

After that, founding member pricing — {{price}} — is gone.

If you've been sitting on the fence, this is your prompt.

Being on the list means:
→ First to know when doors open
→ {{price}} founding rate (goes up after this round)
→ A limited founding round with more of my attention

→ {{waitlistUrl}}

{{yourName}}`,
            },
            social: {
              copy: `{{offerName}} waitlist closes in 2 days.

After that — standard pricing when doors open.

Founding member rate is only for the waitlist. → Link in bio.`,
            },
          },
        },
        {
          id: '2-13',
          sequence: 'waitlist-drive',
          name: 'Day 13 — Last 24 hours',
          description:
            'Last day of the waitlist. One email, one post. Clear, warm, direct. No hype — just genuine urgency.',
          relativeTo: 'launchStart',
          offsetDays: 12,
          contentTemplate: {
            email: {
              subject: 'Last chance — waitlist closes tonight',
              body: `Hey,

Tonight at midnight, the {{offerName}} waitlist closes.

This is the last email before it does.

If {{transformation}} is something you want for yourself — and you've been on the fence — this is your moment.

The founding round is the most intimate, most affordable version of {{offerName}} I'll ever run.

→ {{waitlistUrl}}

Whatever you decide, I'm glad you've been here.

{{yourName}}`,
            },
            social: {
              copy: `Last call.

{{offerName}} waitlist closes tonight.

Founding member pricing. Limited spaces.

→ Last chance. Link in bio.`,
            },
          },
        },
        {
          id: '2-14',
          sequence: 'waitlist-drive',
          name: 'Day 14 — Waitlist closed, doors opening',
          description:
            'The waitlist is closed. Announce it to your full audience — and let them know doors are opening soon.',
          relativeTo: 'launchStart',
          offsetDays: 13,
          contentTemplate: {
            email: {
              subject: 'Waitlist is closed — doors open soon',
              body: `Hey,

The {{offerName}} waitlist is now closed.

If you're on it — doors open very soon. Watch your inbox.

If you missed the waitlist, {{offerName}} will still be available when doors open — just at the standard rate.

Either way, keep an eye out this week. Something good is coming.

{{yourName}}`,
            },
            social: {
              copy: `The {{offerName}} waitlist is closed.

Doors open soon.

If you're on the list — watch your inbox. It's happening.`,
            },
          },
        },
      ],
    },

    // ─── PHASE 3: NURTURE & SELL (14 days) ──────────────────────────────────────
    {
      id: 3,
      name: 'Nurture & Sell',
      tagline: '14 days of content to nurture your waitlist and close the sale',
      color: '#a78bfa',
      tasks: [
        {
          id: '3-1',
          sequence: 'cart-open',
          name: 'Day 1 — Doors open',
          description:
            'Cart is open. This is your announcement email and post. Warm, clear, and direct. This is the moment you\'ve been building to.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
          contentTemplate: {
            email: {
              subject: '{{offerName}} is open',
              body: `Hey,

This is it.

{{offerName}} is officially open.

{{timeframe}}. For {{idealClient}}. To {{transformation}}.

The investment is {{price}} (or {{paymentPlan}}).

Founding member spots are limited and the founding rate ends when they're filled.

→ {{salesPageUrl}}

I'm so excited for this round.

{{yourName}}`,
            },
            social: {
              copy: `{{offerName}} is open. 🌶️

A {{timeframe}} programme for {{idealClient}} ready to {{transformation}}.

{{price}} / {{paymentPlan}}

Founding spots are limited. → Link in bio.`,
            },
          },
        },
        {
          id: '3-2',
          sequence: 'cart-open',
          name: "Day 2 — Who it's for",
          description:
            'Revisit the ideal client picture now that doors are open. Help the right person self-identify.',
          relativeTo: 'cartOpen',
          offsetDays: 1,
          contentTemplate: {
            email: {
              subject: 'This is for you if…',
              body: `Hey,

Now that doors are open, I want to be specific about who {{offerName}} is really for.

This is for you if:
→ You're {{idealClient}}
→ You want to {{transformation}} in {{timeframe}}
→ You're ready to invest in doing this properly
→ You want structured support, not just more content to consume

This isn't for you if you're looking for a shortcut or not ready to commit for {{timeframe}}.

If the first list sounds like you — doors are open.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `{{offerName}} is for {{idealClient}} ready to {{transformation}} in {{timeframe}}.

Not everyone. The right people.

If that's you → link in bio.`,
            },
          },
        },
        {
          id: '3-3',
          sequence: 'cart-open',
          name: "Day 3 — What's included",
          description:
            'A full breakdown of what they get. Be specific — clients buy outcomes but they need to understand the deliverables to say yes.',
          relativeTo: 'cartOpen',
          offsetDays: 2,
          contentTemplate: {
            email: {
              subject: 'Everything you get inside {{offerName}}',
              body: `Hey,

Let me tell you exactly what you get inside {{offerName}}.

→ [Deliverable 1 — name and one-line description]
→ [Deliverable 2 — name and one-line description]
→ [Deliverable 3 — name and one-line description]
→ [Support structure — how they work with you]
→ [Bonus or added extra if applicable]

All for {{price}} (or {{paymentPlan}}).

This is the founding round — the most hands-on, most affordable version of this programme I'll run.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `Inside {{offerName}}:

→ [Deliverable 1]
→ [Deliverable 2]
→ [Deliverable 3]
→ [Support]

{{price}} / {{paymentPlan}}

Founding round. This rate won't come back. → Link in bio.`,
            },
          },
        },
        {
          id: '3-4',
          sequence: 'cart-open',
          name: 'Day 4 — Client story',
          description:
            'Your best testimonial as a full story. Before, what they did, specific outcome. This is trust-building content.',
          relativeTo: 'cartOpen',
          offsetDays: 3,
          contentTemplate: {
            email: {
              subject: 'What happened when [name] did this work',
              body: `Hey,

I want to share a story.

{{testimonial}}

[Tell the fuller version — 3–5 sentences. What was the before? What did they do? What specifically changed?]

This is the kind of result {{offerName}} is designed to create.

Doors are open — founding spots are limited.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `{{testimonial}}

This is what {{offerName}} is designed to do.

Doors are open. → Link in bio.`,
            },
          },
        },
        {
          id: '3-5',
          sequence: 'cart-open',
          name: 'Day 5 — Objection busting',
          description:
            'Revisit the main objection with fresh framing now that cart is open. People are closer to a decision — this content clears the final obstacle.',
          relativeTo: 'cartOpen',
          offsetDays: 4,
          contentTemplate: {
            email: {
              subject: 'The honest answer to "{{objection}}"',
              body: `Hey,

I want to address the thing I hear most.

"{{objection}}"

Here's my honest answer:

[3–5 sentences. Be real. Acknowledge the concern, then reframe it. Show you understand why they're holding back and explain why it doesn't have to stop them.]

If this is the thing between you and {{transformation}}, hit reply. Let's talk it through.

Doors are open.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `"{{objection}}"

If this is what's stopping you from joining {{offerName}}, I want to talk about it.

[One direct, honest response.]

DM me or hit reply. → Link in bio.`,
            },
          },
        },
        {
          id: '3-6',
          sequence: 'cart-open',
          name: 'Day 6 — FAQ',
          description:
            'Answer the top 4–5 questions you\'ve received since doors opened. This email removes friction for almost-buyers.',
          relativeTo: 'cartOpen',
          offsetDays: 5,
          contentTemplate: {
            email: {
              subject: 'Your questions about {{offerName}}, answered',
              body: `Hey,

I've had some great questions come in since doors opened. Here are the most common:

Q: When does it start?
A: [Answer]

Q: What if I can't make the live sessions?
A: [Answer]

Q: Is there a payment plan?
A: Yes — {{paymentPlan}}.

Q: How much time do I need each week?
A: [Answer]

Q: [Your most-asked question]
A: [Answer]

Any other questions? Hit reply — I read every one.

→ {{salesPageUrl}} — doors close [cart close date].

{{yourName}}`,
            },
            social: {
              copy: `FAQ: {{offerName}}

Q: Is there a payment plan?
A: Yes — {{paymentPlan}}.

Q: When does it start?
A: [Answer]

Q: [Your most common question]
A: [Answer]

More questions? DM me. → Link in bio.`,
            },
          },
        },
        {
          id: '3-7',
          sequence: 'cart-open',
          name: 'Day 7 — Halfway urgency',
          description:
            'One week in. Name how many spots are left or days remaining. First real urgency moment.',
          relativeTo: 'cartOpen',
          offsetDays: 6,
          contentTemplate: {
            email: {
              subject: "Halfway — and I want to be straight with you",
              body: `Hey,

We're one week into {{offerName}} being open.

I want to be straight with you.

[Number] of the founding member spots have already been taken. Once they're gone, that's it for this round.

If you've been thinking about it — this is the point where thinking becomes a decision.

I want this programme to be genuinely life-changing for everyone inside. I can only give that level of attention to a small group.

→ {{salesPageUrl}}

Questions? Hit reply.

{{yourName}}`,
            },
            social: {
              copy: `Halfway through the {{offerName}} window.

[X] founding spots left.

If you've been thinking — this is the moment decisions get made. → Link in bio.`,
            },
          },
        },
        {
          id: '3-8',
          sequence: 'cart-open',
          name: 'Day 8 — Days remaining',
          description: 'Simple countdown. Name how many days are left. Clean and direct.',
          relativeTo: 'cartOpen',
          offsetDays: 7,
          contentTemplate: {
            email: {
              subject: '[X] days left to join {{offerName}}',
              body: `Hey,

[X] days left until {{offerName}} closes.

If {{transformation}} is on your list for this year — this is your window.

What you get:
→ {{timeframe}} of focused work
→ [Key deliverable]
→ [Key support]
→ Founding member rate: {{price}} / {{paymentPlan}}

After [close date], this version of the programme is done.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `[X] days.

{{offerName}} closes [close date].

{{price}} / {{paymentPlan}}

→ Link in bio.`,
            },
          },
        },
        {
          id: '3-9',
          sequence: 'cart-open',
          name: 'Day 9 — Another testimonial',
          description:
            'A different testimonial or result than day 4. Fresh proof, fresh voice.',
          relativeTo: 'cartOpen',
          offsetDays: 8,
          contentTemplate: {
            email: {
              subject: 'Another win worth sharing',
              body: `Hey,

I keep coming back to this one.

{{testimonial}}

[3–4 sentences on this result. What's the takeaway? How does it connect to what they could achieve?]

[X] days left on {{offerName}}.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `"{{testimonial}}"

This is what's possible.

{{offerName}} closes in [X] days. → Link in bio.`,
            },
          },
        },
        {
          id: '3-10',
          sequence: 'cart-open',
          name: 'Day 10 — What happens when you join',
          description:
            'Walk them through the exact steps from clicking buy to starting. Reduce friction by making the process feel simple.',
          relativeTo: 'cartOpen',
          offsetDays: 9,
          contentTemplate: {
            email: {
              subject: "Here's exactly what happens when you join",
              body: `Hey,

I want to walk you through what happens the moment you join {{offerName}}.

Step 1: You complete checkout at {{salesPageUrl}}
Step 2: You get a welcome email from me within [timeframe] with everything you need
Step 3: [What's next — portal access, community invite, onboarding call, etc.]
Step 4: We start on [start date]

That's it. Simple. Supported. Structured.

[X] days left.

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `What happens when you join {{offerName}}:

1. Checkout done
2. Welcome email from {{yourName}}
3. [Next step]
4. We start [date]

Simple. → [X] days left. Link in bio.`,
            },
          },
        },
        {
          id: '3-11',
          sequence: 'cart-open',
          name: 'Day 11 — Last questions',
          description:
            'Open invitation to ask anything before doors close. Lowers the barrier for almost-buyers who just need a conversation.',
          relativeTo: 'cartOpen',
          offsetDays: 10,
          contentTemplate: {
            email: {
              subject: 'Ask me anything before doors close',
              body: `Hey,

3 days left on {{offerName}}.

If you have a question — now is the time to ask it.

Hit reply and I'll come back to you within a few hours. No question is too small or too obvious.

The things I hear most:
→ "Is this right for me?" — if you're {{idealClient}} who wants to {{transformation}}, the answer is almost certainly yes
→ "Can I afford it?" — {{price}} / {{paymentPlan}}. If the investment is a stretch, hit reply and we'll talk
→ "Is it worth it?" — {{testimonial}}

→ {{salesPageUrl}}

{{yourName}}`,
            },
            social: {
              copy: `3 days left on {{offerName}}.

Got a question? DM me or hit reply — I'll answer today.

No question is too small. → Link in bio.`,
            },
          },
        },
        {
          id: '3-12',
          sequence: 'cart-open',
          name: 'Day 12 — 48 hours',
          description:
            '48 hours left. Short, direct, warm. This is the moment of reckoning for fence-sitters.',
          relativeTo: 'cartOpen',
          offsetDays: 11,
          contentTemplate: {
            email: {
              subject: '48 hours',
              body: `Hey,

48 hours.

{{offerName}} closes in 2 days.

If {{transformation}} is what you want, and you know you'd look back and wish you'd said yes — this is the moment.

→ {{salesPageUrl}}

See you inside.

{{yourName}}`,
            },
            social: {
              copy: `48 hours.

{{offerName}} closes [date].

This is the one where you decide. → Link in bio.`,
            },
          },
        },
        {
          id: '3-13',
          sequence: 'cart-open',
          name: 'Day 13 — Last 24 hours',
          description:
            'Tomorrow the doors close. One warm, direct email. No gimmicks — just the truth about what\'s available and for how long.',
          relativeTo: 'cartOpen',
          offsetDays: 12,
          contentTemplate: {
            email: {
              subject: '{{offerName}} closes tomorrow',
              body: `Hey,

Tomorrow at [time], {{offerName}} closes.

This is the last email before it does.

If you've been on the fence — I want to say one thing.

The people who say yes are not the ones who are 100% ready. They're the ones who decide that {{transformation}} matters more than the uncertainty.

If that's you — the door is open until tomorrow.

→ {{salesPageUrl}}

Whatever you decide, thank you for being here.

{{yourName}}`,
            },
            social: {
              copy: `{{offerName}} closes tomorrow.

Last chance for founding member pricing. Last chance for this round.

→ Link in bio. Tomorrow is the last day.`,
            },
          },
        },
        {
          id: '3-14',
          sequence: 'cart-open',
          name: 'Day 14 — Doors close today',
          description: 'The final day. One email, one post. Warm but firm. This is the last call.',
          relativeTo: 'cartOpen',
          offsetDays: 13,
          contentTemplate: {
            email: {
              subject: 'Last call — {{offerName}} closes tonight',
              body: `Hey,

Tonight at [time], {{offerName}} closes.

Last email. Last chance.

If you want {{transformation}} and you've been waiting for the right moment — this is it.

→ {{salesPageUrl}}

Thank you for your time and attention. It genuinely means a lot.

{{yourName}}`,
            },
            social: {
              copy: `Tonight.

{{offerName}} closes tonight at [time].

Last post. Last chance.

→ Link in bio if you're ready.`,
            },
          },
        },
      ],
    },

    // ─── PHASE 4: DELIVERY ───────────────────────────────────────────────────────
    {
      id: 4,
      name: 'Delivery',
      tagline: 'Onboarding, programme delivery, and early client results',
      color: '#34d399',
      tasks: [
        {
          id: '4-1',
          sequence: 'onboarding',
          name: 'Send welcome emails to new clients',
          description:
            'Within 24 hours of cart close, send every new client a warm welcome email. Include what happens next, how to access the programme, and how genuinely excited you are to work with them.',
          relativeTo: 'cartClose',
          offsetDays: 1,
        },
        {
          id: '4-2',
          name: 'Prepare your client portal',
          description:
            'Ensure all content, resources, and community access are ready before your first client logs in. Test every link and download. No broken experiences on day one.',
          relativeTo: 'cartClose',
          offsetDays: 1,
        },
        {
          id: '4-3',
          name: 'Host your onboarding call',
          description:
            'Run a kick-off session with all new clients. Set expectations, answer questions, and build the group dynamic early. Record it for anyone who can\'t attend live.',
          relativeTo: 'cartClose',
          offsetDays: 5,
        },
        {
          id: '4-4',
          name: 'Collect early wins and testimonials',
          description:
            'At the two-week mark, actively ask clients for early wins and honest feedback. Don\'t wait until the end — the best testimonials come from specific moments during the programme.',
          relativeTo: 'cartClose',
          offsetDays: 14,
        },
      ],
    },

    // ─── PHASE 5: DEBRIEF & DOUBLE ───────────────────────────────────────────────
    {
      id: 5,
      name: 'Debrief & Double',
      tagline: 'Review your data, find your growth levers, plan the next launch',
      color: '#f472b6',
      tasks: [
        {
          id: '5-1',
          name: 'Pull your launch numbers',
          description:
            'Compile all your launch metrics: waitlist size, conversion rate, total sales, revenue, and any ad spend. Get everything in one place before you debrief.',
          relativeTo: 'cartClose',
          offsetDays: 7,
        },
        {
          id: '5-2',
          name: 'Run your debrief session',
          description:
            'Block 90 minutes for a solo debrief. What worked? What didn\'t? What surprised you? What would you do differently? Write it all down while it\'s fresh.',
          relativeTo: 'cartClose',
          offsetDays: 14,
        },
        {
          id: '5-3',
          name: 'Identify your 3 growth levers',
          description:
            'From your debrief, identify the 3 specific things that, if improved, would most impact your next launch. Not everything — just these three.',
          relativeTo: 'cartClose',
          offsetDays: 16,
        },
        {
          id: '5-4',
          name: 'Set your next launch date',
          description:
            'While momentum is high, set the date for your next launch. Block it now. The next one will be easier, faster, and more profitable than this one.',
          relativeTo: 'cartClose',
          offsetDays: 21,
        },
      ],
    },
  ],
}
