// Arena Launch Template
// Full conversion event launch — lead magnet, audience growth, live event, cart open/close.
// All task dates are relative: they calculate automatically from the client's key dates.

export const arenaTemplate = {
  id: 'arena',
  name: 'Arena Launch',
  tagline: 'Full conversion event launch',
  description:
    'The full launch framework: build your audience with a lead magnet, warm them up with content, run a live conversion event, then open and close cart. Best for launching to a cold or growing audience.',
  color: '#f472b6',
  keyDateLabels: {
    launchStart: {
      label: 'Launch Start',
      description:
        'The day your lead magnet goes live and you start actively growing your audience.',
    },
    cartOpen: {
      label: 'Cart Open / Live Event',
      description:
        'The day you host your live conversion event and open the cart immediately after.',
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
      tagline: 'Build and validate your offer before launch',
      color: '#f472b6',
      tasks: [
        {
          id: '1-1',
          name: 'Define your core offer',
          description:
            'Write out your offer in full: what it is, who it\'s for, what they get, and the transformation they\'ll experience. Be specific about deliverables, timeline, and what makes it different.',
          relativeTo: 'launchStart',
          offsetDays: -35,
        },
        {
          id: '1-2',
          name: 'Validate with your audience',
          description:
            'Poll your existing audience or run a small validation exercise. Ask 5–10 ideal clients whether this offer solves a real problem they have right now. Listen more than you pitch.',
          relativeTo: 'launchStart',
          offsetDays: -28,
        },
        {
          id: '1-3',
          name: 'Nail your positioning statement',
          description:
            'Complete this sentence: "I help {{idealClient}} achieve {{transformation}} without {{objection}} in {{timeframe}}." This becomes the foundation of all your launch copy.',
          relativeTo: 'launchStart',
          offsetDays: -21,
        },
        {
          id: '1-4',
          name: 'Write your sales page',
          salesPageBuilder: true,
          description:
            'Using your positioning statement and offer details, write the full sales page. Cover: headline, problem, solution, what\'s included, who it\'s for, FAQs, testimonials, and a clear buy button.',
          relativeTo: 'launchStart',
          offsetDays: -21,
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
                    '{{offerName}} is a {{timeframe}} programme for {{idealClient}} who are ready to stop [the problem] and start {{transformation}}.',
                },
                {
                  label: 'The problem section',
                  content:
                    'You know exactly what you want. You want to {{transformation}}. But right now, [describe the stuck state — what\'s in their way]. Sound familiar?\n\nYou\'re not missing talent or effort. You\'re missing [the thing your programme provides].',
                },
                {
                  label: 'The solution section',
                  content:
                    '{{offerName}} is the {{timeframe}} programme that gives {{idealClient}} a clear, supported path to {{transformation}}.\n\nInside, you\'ll get:\n→ [Module/session 1]\n→ [Module/session 2]\n→ [Module/session 3]\n→ [Support structure]\n→ [Bonus]',
                },
                {
                  label: 'Investment',
                  content:
                    '{{offerName}} is {{price}}.\n\nPayment plan available: {{paymentPlan}}\n\n[Add your checkout link here]',
                },
                {
                  label: 'About {{yourName}}',
                  content:
                    "I'm {{yourName}}, founder of {{businessName}}.\n\nI help {{idealClient}} {{transformation}} in {{timeframe}}.\n\n[2–3 sentences about your story and why you're the right person to teach this]",
                },
                {
                  label: 'Client result',
                  content: '{{testimonial}}',
                },
                {
                  label: 'FAQ',
                  content:
                    'Q: When does it start?\nA: [Answer]\n\nQ: Is there a payment plan?\nA: Yes — {{paymentPlan}}\n\nQ: What if I can\'t make the live sessions?\nA: [Answer]\n\nQ: [Your most common question]\nA: [Answer]',
                },
              ],
            },
          },
        },
        {
          id: '1-5',
          name: 'Set your pricing and payment options',
          description:
            'Finalise your price point for {{offerName}}. Set up your checkout links and test every one. Consider whether a payment plan increases accessibility without devaluing the offer.',
          relativeTo: 'launchStart',
          offsetDays: -21,
        },
      ],
    },

    // ─── PHASE 2: AUDIENCE GROWTH & WARM-UP ─────────────────────────────────────
    {
      id: 2,
      name: 'Audience Growth & Warm-Up',
      tagline: 'Lead magnet, list growth, and nurture content',
      color: '#60a5fa',
      tasks: [
        {
          id: '2-1',
          name: 'Create your lead magnet',
          description:
            '{{leadMagnet}} should solve one specific, pressing problem for your ideal client and act as a natural entry point into {{offerName}}. Keep it focused — one outcome, delivered well. Choose your format below and follow the outline.',
          relativeTo: 'launchStart',
          offsetDays: -21,
          leadMagnetPicker: true,
        },
        {
          id: '2-2',
          name: 'Set up your opt-in page',
          description:
            'Create the landing page for {{leadMagnet}}. You need: a clear headline, 3–5 bullet points on what they\'ll get, a simple opt-in form, and a confirmation email that delivers the freebie.',
          relativeTo: 'launchStart',
          offsetDays: -14,
          contentTemplate: {
            salesPage: {
              title: 'Opt-In Page Copy — {{leadMagnet}}',
              sections: [
                {
                  label: 'Headline',
                  content: 'Free: {{leadMagnet}}',
                },
                {
                  label: 'Sub-headline',
                  content:
                    'For {{idealClient}} who want to {{transformation}} — without [the common struggle].',
                },
                {
                  label: 'Bullet points (what they get)',
                  content:
                    '→ [Specific thing they\'ll learn or get]\n→ [Specific thing they\'ll learn or get]\n→ [Specific outcome they\'ll have after]',
                },
                {
                  label: 'Button text',
                  content: 'Yes — send me {{leadMagnet}}',
                },
                {
                  label: 'Confirmation email subject',
                  content: 'Here\'s your {{leadMagnet}}',
                },
                {
                  label: 'Confirmation email body',
                  content:
                    "Hey,\n\nHere it is — {{leadMagnet}}.\n\n[Download link or access instructions]\n\nI hope it gives you exactly what you need. If you have questions, hit reply.\n\nStay tuned — I have something bigger coming very soon that I think you're going to love.\n\n{{yourName}}",
                },
              ],
            },
          },
        },
        {
          id: '2-3',
          name: 'Plan your warm-up content',
          description:
            'Map out 3 weeks of content (social + email) that educates your audience on the problem your offer solves. Build desire, address objections, and share stories — all without pitching.',
          relativeTo: 'launchStart',
          offsetDays: -14,
        },
        {
          id: '2-4',
          sequence: 'waitlist-nurture',
          name: 'Write your nurture email sequence',
          description:
            'Write a 5-email welcome sequence for new subscribers. Email 1: deliver the freebie. Emails 2–5: build trust, share client stories, address the top objections, and build excitement for what\'s coming.',
          relativeTo: 'launchStart',
          offsetDays: -10,
        },
        {
          id: '2-5',
          name: 'Run your list growth sprint',
          description:
            'Three-week push to grow your list. Post daily about {{leadMagnet}}. Collaborate with 2–3 peers for cross-promotion. Consider a small paid ads budget to amplify what\'s already working.',
          relativeTo: 'cartOpen',
          offsetDays: -21,
        },

        // ── Webinar-Drive Sequence (14 emails) ──────────────────────────────────

        {
          id: '2-6',
          sequence: 'webinar-drive',
          name: 'Announcement — registration is open',
          description:
            'First email in the webinar-drive sequence. Announce that registration for {{liveEventTitle}} is now open. Create curiosity around the core teaching, communicate who it is for, and give them a clear CTA to register.',
          relativeTo: 'cartOpen',
          offsetDays: -14,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'You\'re invited — {{liveEventTitle}} (free, live training)',
              body: `Hey {{firstName}},

I have something I've been working on for a while — and I'm finally ready to share it with you.

On [date] at [time], I'm hosting a free live training called {{liveEventTitle}}.

This is for {{idealClient}} who are done spinning their wheels and are ready to {{transformation}}. In 60 minutes I'm going to walk you through exactly how to do that — no fluff, no theory, just the framework I use with my clients every single day.

Here's what you'll learn:
→ [Key teaching point 1]
→ [Key teaching point 2]
→ [Key teaching point 3]

It's completely free. All you need to do is grab your spot.

→ Register here: [registration link]

I'll send you the details once you're in. Can't wait to see you there.

{{yourName}}`,
            },
          },
        },

        {
          id: '2-7',
          sequence: 'webinar-drive',
          name: 'What you\'ll learn email',
          description:
            'Go deeper on the content of {{liveEventTitle}}. Break down the 3 core things they will walk away with. Make the value of attending feel concrete and specific so they can picture the transformation.',
          relativeTo: 'cartOpen',
          offsetDays: -12,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Here\'s exactly what we\'re covering at {{liveEventTitle}}',
              body: `Hey {{firstName}},

In case you missed my last email — I'm hosting a free live training called {{liveEventTitle}} on [date] at [time].

I want to tell you exactly what we're covering so you know this is worth your time.

Inside {{liveEventTitle}}, I'm going to walk you through:

→ [Teaching point 1 — be specific about the insight or shift]
→ [Teaching point 2 — be specific about the insight or shift]
→ [Teaching point 3 — be specific about the insight or shift]

By the end of the training, you'll have [specific tangible outcome]. Not a vague "mindset shift" — an actual thing you can implement the same day.

If {{transformation}} is something you want, you don't want to miss this.

→ Grab your free spot: [registration link]

See you there.

{{yourName}}`,
            },
          },
        },

        {
          id: '2-8',
          sequence: 'webinar-drive',
          name: 'Who this is for email',
          description:
            'Make it crystal clear who {{liveEventTitle}} is designed for. Use "this is for you if..." and "this is NOT for you if..." framing to qualify your audience and make the right people feel seen.',
          relativeTo: 'cartOpen',
          offsetDays: -11,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Is {{liveEventTitle}} right for you? (read this)',
              body: `Hey {{firstName}},

I'm getting a lot of questions about {{liveEventTitle}}, so I wanted to answer the biggest one: is this for me?

Here's an honest answer.

{{liveEventTitle}} is for you if:
✓ You're a {{idealClient}} who wants to {{transformation}}
✓ You've tried [common approach] and it hasn't worked
✓ You're ready to commit to doing this differently
✓ You want a clear, actionable framework — not more inspiration

{{liveEventTitle}} is NOT for you if:
✗ You're looking for a magic bullet with zero effort
✗ You're not yet at [minimum qualifier — e.g., running a business, in this industry]
✗ You want to wait until conditions are perfect

If you saw yourself in that first list — I made this for you.

→ Register free: [registration link]

[date] at [time]. I'll see you there.

{{yourName}}`,
            },
          },
        },

        {
          id: '2-9',
          sequence: 'webinar-drive',
          name: 'The problem email',
          description:
            'Agitate the core problem your {{idealClient}} is experiencing. Name the frustration, the cost of staying stuck, and the moment they\'ll recognise themselves in. Then position {{liveEventTitle}} as the solution.',
          relativeTo: 'cartOpen',
          offsetDays: -10,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'The real reason {{idealClient}} stay stuck (and how to fix it)',
              body: `Hey {{firstName}},

Can I be honest with you about something?

Most {{idealClient}} aren't stuck because they lack talent or ideas. They're stuck because [name the core problem — the thing that's actually in their way].

And the frustrating part? The harder they try using [the common approach that doesn't work], the more exhausted and discouraged they become. You start to wonder if the problem is you.

It's not you. It's the approach.

Here's what I've found working with my clients: [one-sentence diagnosis of the real issue — the insight that changes everything].

That's exactly what I'm covering in {{liveEventTitle}} — a free live training on [date] at [time].

I'm going to show you how to [core transformation promised by the training] so that you can finally {{transformation}}.

If you haven't grabbed your spot yet, there's still time.

→ Register here: [registration link]

{{yourName}}`,
            },
          },
        },

        {
          id: '2-10',
          sequence: 'webinar-drive',
          name: 'Social proof / results email',
          description:
            'Share a client story or result that demonstrates the transformation {{liveEventTitle}} teaches. Make the result specific and relatable. Use this to build belief that the outcome is achievable.',
          relativeTo: 'cartOpen',
          offsetDays: -9,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'What happened when [client first name] did this...',
              body: `Hey {{firstName}},

I want to tell you about [client first name].

When [client first name] came to me, [describe where they were — the specific struggle in their own words or close to it]. They'd been [doing the thing that wasn't working] for [timeframe] and were starting to lose faith that [the outcome they wanted] was even possible for them.

Here's what changed: [describe the core shift or turning point — what they did differently].

Within [timeframe], [describe the specific result — numbers, milestones, or a meaningful qualitative shift].

In their own words: "[client testimonial quote]"

This is exactly the kind of shift I'm going to show you how to make at {{liveEventTitle}} — my free live training happening on [date] at [time].

If you haven't registered yet, here's your link:

→ [registration link]

Spots are filling up — I'd love to see you there.

{{yourName}}`,
            },
          },
        },

        {
          id: '2-11',
          sequence: 'webinar-drive',
          name: 'Urgency — seats filling email',
          description:
            'Create genuine urgency around registering for {{liveEventTitle}}. Mention that spots are limited or that the live training is happening soon. Give a secondary reason to register now rather than later.',
          relativeTo: 'cartOpen',
          offsetDays: -8,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Seats are filling up for {{liveEventTitle}}',
              body: `Hey {{firstName}},

Quick note — {{liveEventTitle}} is filling up.

[Number] people have already registered for the free live training happening on [date] at [time], and I want to make sure you have a spot before it's gone.

Here's your link: [registration link]

A reminder of what we're covering:
→ [Key teaching point 1]
→ [Key teaching point 2]
→ [Key teaching point 3]

Plus: I'm going to share something at the end of the training that I've only ever shared with my paying clients. If you've been wondering how to [common question your audience has], you'll want to stay until the very end.

This training is free. It's live. And it's not being recorded for general release.

→ Save your spot now: [registration link]

See you [day of week].

{{yourName}}`,
            },
          },
        },

        {
          id: '2-12',
          sequence: 'webinar-drive',
          name: 'FAQ email',
          description:
            'Answer the most common questions about {{liveEventTitle}} — what it covers, who it\'s for, whether there\'s a replay, what the time commitment is, and what happens after. Lower any remaining barriers to registration.',
          relativeTo: 'cartOpen',
          offsetDays: -7,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Your questions about {{liveEventTitle}}, answered',
              body: `Hey {{firstName}},

I've been getting great questions about {{liveEventTitle}}, so I wanted to answer the most common ones in one place.

Q: When is it and how long does it go?
A: [Date] at [time] — it runs approximately 60–75 minutes, including Q&A.

Q: Is it really free?
A: Yes, completely free. No credit card, no catch. Just register and show up.

Q: Will there be a replay?
A: I'll be sharing a limited replay window for registered attendees only. But the live experience is better — you'll be able to ask questions in real time.

Q: What if I'm not a [specific qualifier — e.g., a coach, an online business owner, etc.]?
A: This training is specifically designed for {{idealClient}}. If that's you, you're in the right place.

Q: What happens after the training?
A: I'll share some resources at the end. No pressure, no hard sell — just the next step for people who want to go deeper.

Haven't grabbed your spot yet?

→ Register here: [registration link]

See you [day of week] at [time].

{{yourName}}`,
            },
          },
        },

        {
          id: '2-13',
          sequence: 'webinar-drive',
          name: 'Reminder — 3 days before webinar',
          description:
            'Send a 3-day reminder to everyone who is registered and everyone who hasn\'t registered yet. Re-state the core promise of {{liveEventTitle}} and give them the date, time, and link to add to calendar.',
          relativeTo: 'cartOpen',
          offsetDays: -3,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: '3 days until {{liveEventTitle}} — are you in?',
              body: `Hey {{firstName}},

Just a quick reminder — {{liveEventTitle}} is happening in 3 days.

[Date] | [Time] | Free to attend live

If you've already registered, make sure you've got it in your calendar. The link to join will be in your confirmation email — if you can't find it, just hit reply and I'll resend it.

If you haven't registered yet — here's your link:

→ [registration link]

This is going to be one of my best trainings yet. I'm sharing [specific thing you're excited to teach] that I've never walked through publicly before.

I want to see your name on the attendee list.

{{yourName}}

P.S. This training is live only. If you want the content, you need to be there. Block the time now.`,
            },
          },
        },

        {
          id: '2-14',
          sequence: 'webinar-drive',
          name: 'Reminder — 1 day before webinar',
          description:
            'Send the 24-hour reminder to all registrants. Short, punchy, and specific. Remind them of the exact time, what they\'ll get, and where to find their join link. Create anticipation.',
          relativeTo: 'cartOpen',
          offsetDays: -1,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Tomorrow — {{liveEventTitle}} (your link inside)',
              body: `Hey {{firstName}},

{{liveEventTitle}} is tomorrow.

[Date] | [Time] | [Timezone]

Your join link: [join link]
(Add it to your calendar now so you don't forget.)

Here's what we're covering:
→ [Teaching point 1]
→ [Teaching point 2]
→ [Teaching point 3]

Show up live if you can — the live experience is completely different from a replay. Ask questions, get personalised answers, be part of the room.

I'll see you tomorrow at [time].

{{yourName}}

P.S. I'm sharing something at the end of the training that I've only shared with private clients. Stay until the end.`,
            },
          },
        },

        {
          id: '2-15',
          sequence: 'webinar-drive',
          name: 'Morning of webinar email',
          description:
            'Send a morning-of email to get registrants excited and ensure they have their join link. Keep it short and energising. Build anticipation for what\'s happening today.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Today is the day — {{liveEventTitle}} 🎙️',
              body: `Hey {{firstName}},

Today's the day.

{{liveEventTitle}} is happening tonight at [time] and I am so ready for this one.

Your join link: [join link]

A heads-up on what to expect:

I'm going to teach you [core teaching point] — something that has helped my clients [specific outcome]. Then I'll walk you through exactly how to apply it to your own situation.

If you only have one hour to invest in your [goal area] this week, make it this one.

I'll see you at [time].

{{yourName}}

P.S. Got a question you want me to answer live? Hit reply and send it over — I'll do my best to cover it during Q&A.`,
            },
          },
        },

        {
          id: '2-16',
          sequence: 'webinar-drive',
          name: 'Starting soon — 1 hour before',
          description:
            'Send a final reminder one hour before {{liveEventTitle}} goes live. Ultra-short. Just the join link, the time, and a single sentence of excitement. Make it easy to click straight through.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'We\'re live in 1 hour — your link is here',
              body: `Hey {{firstName}},

One hour from now, {{liveEventTitle}} starts.

→ Join here: [join link]
→ Time: [time] [timezone]

See you in the room.

{{yourName}}`,
            },
          },
        },

        {
          id: '2-17',
          sequence: 'webinar-drive',
          name: 'Webinar is live now email',
          description:
            'Send a "we\'re live right now" email to catch late arrivals and anyone who forgot. Include the direct join link and a one-line hook about what\'s happening inside the training right now.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'We\'re live RIGHT NOW — jump in',
              body: `Hey {{firstName}},

We are LIVE right now.

{{liveEventTitle}} has started and there's still time to join us.

→ Jump in here: [join link]

I'm walking through [what you're covering at this moment in the training]. It's not too late to catch the rest.

→ [join link]

{{yourName}}`,
            },
          },
        },

        {
          id: '2-18',
          sequence: 'webinar-drive',
          name: 'Missed it — replay email',
          description:
            'Send the replay email the day after {{liveEventTitle}} to everyone who registered but didn\'t attend. Share a teaser of what was covered, provide the replay link, and set a clear deadline for when it comes down.',
          relativeTo: 'cartOpen',
          offsetDays: 1,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'You missed it — but here\'s the replay (for now)',
              body: `Hey {{firstName}},

Yesterday's {{liveEventTitle}} was one for the books.

We had [number] people join live, and the conversation in the chat was electric. But I know life gets in the way — so I'm sharing the replay with you for a limited time.

Here's what we covered:
→ [Key teaching point 1 — be specific about the insight]
→ [Key teaching point 2 — be specific about the insight]
→ [Key teaching point 3 — be specific about the insight]

Plus at the end I shared [description of the offer reveal or exclusive content] that generated a lot of questions in the room.

→ Watch the replay here: [replay link]

This replay will only be available until [replay deadline date and time]. After that, it comes down.

Watch it while you can.

{{yourName}}

P.S. If you have questions after watching, hit reply. I'm reading every response.`,
            },
          },
        },

        {
          id: '2-19',
          sequence: 'webinar-drive',
          name: 'Last chance to watch replay',
          description:
            'Send a final warning that the {{liveEventTitle}} replay is coming down. Create urgency with a clear deadline. For people on the fence, remind them of the single most compelling thing from the training.',
          relativeTo: 'cartOpen',
          offsetDays: 2,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Replay comes down tonight — last chance to watch',
              body: `Hey {{firstName}},

Just a heads-up — the replay of {{liveEventTitle}} comes down tonight at [time].

If you've been meaning to watch it, now is the time.

→ Watch before it's gone: [replay link]

Here's why this one is worth your hour: I covered [the most impactful teaching moment — name it specifically]. It's the thing that {{idealClient}} almost always miss, and once you see it, you can't unsee it.

After tonight, this training won't be available publicly.

→ [replay link]

I'll see you on the other side.

{{yourName}}

P.S. I also shared some information at the end of the training about how to work with me directly. If you're curious, watch through to the end before the replay comes down.`,
            },
          },
        },
      ],
    },

    // ─── PHASE 3: LAUNCH GO TIME ─────────────────────────────────────────────────
    {
      id: 3,
      name: 'Launch Go Time',
      tagline: 'Live event, cart open and close',
      color: '#a78bfa',
      tasks: [
        {
          id: '3-1',
          sequence: 'webinar-drive',
          name: 'Promote your live event',
          description:
            'Start promoting {{liveEventTitle}} across all channels. Email your list, post on social daily, and consider a small ad spend to drive registrations. Give people a compelling reason to show up live.',
          relativeTo: 'cartOpen',
          offsetDays: -14,
          contentTemplate: {
            email: {
              subject: 'You\'re invited — {{liveEventTitle}}',
              body: `Hey,

I'm hosting a live event and I want you there.

{{liveEventTitle}} — [date and time]

In this free training, I'm going to show {{idealClient}} exactly how to {{transformation}}.

You'll leave with:
→ [Specific takeaway 1]
→ [Specific takeaway 2]
→ [Specific takeaway 3]

Plus I'll be sharing something exciting at the end for people who are ready to take action.

Save your spot → [registration link]

See you there.

{{yourName}}`,
            },
            social: {
              copy: `Free live training: {{liveEventTitle}} 🎙️

[Date + time]

For {{idealClient}} who want to {{transformation}}.

You'll learn:
→ [Takeaway 1]
→ [Takeaway 2]
→ [Takeaway 3]

Free to join → link in bio.`,
            },
          },
        },
        {
          id: '3-2',
          name: 'Prepare your live event content',
          description:
            'Build the slides and plan the flow for {{liveEventTitle}}. Teach one big, transformative idea. Make a clear, confident offer at the end. Practise out loud at least twice. Use the Superfans 60 framework below as your script guide.',
          relativeTo: 'cartOpen',
          offsetDays: -3,
          superfans60Script: true,
        },
        {
          id: '3-4',
          name: 'Host your live event',
          description:
            'Deliver {{liveEventTitle}}. Show up energetically, teach your very best content, and make a clear and confident offer at the end. Follow up with the replay link within 24 hours.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
        },
        {
          id: '3-5',
          name: 'Post daily while cart is open',
          description:
            'Show up every single day while the cart is open. Mix content types: client wins, FAQ responses, behind-the-scenes, direct offer posts. Visibility is everything during this window.',
          relativeTo: 'cartClose',
          offsetDays: -1,
        },

        // ── Cart-Open Sequence (14 emails) ──────────────────────────────────────

        {
          id: '3-6',
          sequence: 'cart-open',
          name: 'Doors open announcement',
          description:
            'The first email of the cart-open sequence. Announce that {{offerName}} is now open. Keep energy high, remind people of what was shared at the live event, and give them a direct link to enrol.',
          relativeTo: 'cartOpen',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: '{{offerName}} is open — enrolment closes {{cartClose}}',
              body: `Hey {{firstName}},

It's happening.

{{offerName}} is officially open.

If you were at {{liveEventTitle}}, you know exactly what this is about. You saw the framework, you asked the questions, and you know whether this is the next right move for you.

If you missed it — here's the short version: {{offerName}} is [one-sentence description of what the offer is]. It's designed specifically for {{idealClient}} who want to {{transformation}} in {{timeframe}}, without [common objection or obstacle].

Enrolment is open until {{cartClose}}.

→ Grab your spot: {{salesPageUrl}}

Questions before you join? Hit reply — I'm reading everything.

So excited to welcome you in.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-7',
          sequence: 'cart-open',
          name: 'What\'s inside the offer',
          description:
            'Give a detailed breakdown of what\'s inside {{offerName}}. Walk through the modules, the support structure, the bonuses, and the community. Help people visualise themselves inside the programme.',
          relativeTo: 'cartOpen',
          offsetDays: 1,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'What\'s inside {{offerName}} (everything you get)',
              body: `Hey {{firstName}},

I want to give you a full picture of what's waiting for you inside {{offerName}}.

Here's everything you get when you join:

→ [Module or component 1 — name and one-sentence description]
→ [Module or component 2 — name and one-sentence description]
→ [Module or component 3 — name and one-sentence description]
→ [Support structure — e.g., weekly live calls, Slack community, Voxer access]
→ [Bonus 1 — name and value]
→ [Bonus 2 — name and value]

The total value of everything inside is [total value]. Your investment is {{price}}.

Payment plan available: {{paymentPlan}}

I designed {{offerName}} to be the programme I wished I'd had when I was trying to {{transformation}}. Everything inside it exists because I know from working with {{idealClient}} that this is exactly what you need — and nothing you don't.

→ See the full details: {{salesPageUrl}}

Enrolment closes {{cartClose}}.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-8',
          sequence: 'cart-open',
          name: 'Who this is for',
          description:
            'Be specific about who {{offerName}} was built for and who it isn\'t right for. Use clear "this is for you if..." language to help the right people self-select in and avoid buyer\'s remorse.',
          relativeTo: 'cartOpen',
          offsetDays: 2,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Is {{offerName}} right for you? (honest answer inside)',
              body: `Hey {{firstName}},

I want to be really straight with you about who {{offerName}} is built for — because I'd rather you make the right decision than the fast one.

{{offerName}} is for you if:
✓ You are {{idealClient}} who genuinely wants to {{transformation}}
✓ You're willing to [what they need to commit to — time, effort, openness]
✓ You've already tried [common approach that didn't work] and you're ready for something different
✓ You want [the specific outcome the programme delivers] within {{timeframe}}

{{offerName}} is NOT for you if:
✗ You're looking for a done-for-you solution with zero input on your part
✗ You're not yet at [minimum entry point — e.g., running a business, in a specific life situation]
✗ You want results without doing the work

If you read that first list and thought "yes, that's exactly me" — this is your invitation.

→ Join {{offerName}}: {{salesPageUrl}}

Enrolment closes {{cartClose}}.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-9',
          sequence: 'cart-open',
          name: 'The transformation story',
          description:
            'Share a detailed before-and-after client story that demonstrates the full transformation {{offerName}} delivers. Make it personal, specific, and emotionally resonant. Let the result speak for itself.',
          relativeTo: 'cartOpen',
          offsetDays: 3,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'From [stuck state] to [result] — [client first name]\'s story',
              body: `Hey {{firstName}},

I want to tell you about [client first name].

When [client first name] first came to me, [paint the before picture — what their situation was, how they were feeling, what they'd already tried]. They'd been [specific struggle] for [timeframe] and were starting to wonder if [their goal] was even possible.

The shift happened when [describe the turning point — what changed when they started using your framework or approach].

Within [timeframe], here's what happened:
→ [Specific result 1]
→ [Specific result 2]
→ [Specific result 3]

In [client first name]'s words: "[direct quote from the client about their experience or result]"

This is the transformation {{offerName}} is built to deliver. Not for a select few — for anyone who is a {{idealClient}} and is willing to do the work.

If you want this for yourself, enrolment closes {{cartClose}}.

→ {{salesPageUrl}}

{{yourName}}

P.S. [Client first name] said I could share their story. They want you to know it's possible for you too.`,
            },
          },
        },

        {
          id: '3-10',
          sequence: 'cart-open',
          name: 'Objection — "I don\'t have time"',
          description:
            'Address the most common time-based objection head-on. Reframe the time investment, explain how {{offerName}} is structured around busy schedules, and make the case that the cost of staying stuck is greater than the cost of the programme.',
          relativeTo: 'cartOpen',
          offsetDays: 4,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: '"I don\'t have time" — let\'s talk about that',
              body: `Hey {{firstName}},

"I'd love to join, but I just don't have time right now."

I hear this a lot. And I understand it — you're busy. So am I. So is every single person who has gone through {{offerName}} and come out the other side with [the result].

Here's the honest truth: you will never have more time. You just get to choose what to do with the time you have.

{{offerName}} is designed for {{idealClient}} with full lives. Here's what the time commitment actually looks like:
→ [Amount of time per week] for [core programme activity]
→ [Amount of time per week] for [implementation or practice]
→ [Optional: time for live calls, if applicable]

That's [total time per week]. In exchange for [the transformation they're getting].

Now let me ask you this: how much time are you currently spending trying to [DIY version of what the programme teaches], getting inconsistent results? How much time will you spend on this problem 6 months from now if nothing changes?

The investment isn't really in the programme. It's in getting the problem solved so it stops costing you time indefinitely.

→ {{salesPageUrl}}

Enrolment closes {{cartClose}}.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-11',
          sequence: 'cart-open',
          name: 'Objection — value reframe on price',
          description:
            'Address the price objection by reframing the cost of {{offerName}} against the cost of staying stuck, the DIY alternative, or the value of the outcome. Make the ROI feel obvious.',
          relativeTo: 'cartOpen',
          offsetDays: 5,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Is {{offerName}} worth {{price}}? (an honest breakdown)',
              body: `Hey {{firstName}},

I want to talk about money for a second.

{{offerName}} is {{price}}. And I know that's not nothing. So let me give you an honest breakdown of what that actually means.

When you join {{offerName}}, you're getting:
→ [Programme component 1] — valued at [£/$ value]
→ [Programme component 2] — valued at [£/$ value]
→ [Programme component 3] — valued at [£/$ value]
→ [Bonus 1] — valued at [£/$ value]
→ [Bonus 2] — valued at [£/$ value]

Total value: [total value]. Your investment: {{price}}.

But here's the calculation that matters more to me:

What is {{transformation}} worth to you? If you could have [specific outcome] in {{timeframe}}, how would that change your [business / income / life / relationships — whatever is most relevant]?

For most of my clients, getting this handled is worth far more than {{price}}. Some have [specific quantifiable return — e.g., made back their investment within 30 days, landed a client that paid for it, saved X hours per week].

And for those who need it: a payment plan is available at {{paymentPlan}}.

→ See the full details: {{salesPageUrl}}

Enrolment closes {{cartClose}}.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-12',
          sequence: 'cart-open',
          name: 'Social proof heavy email',
          description:
            'Send a roundup of client results, testimonials, and wins from people who have been through {{offerName}} or worked with you. Let the social proof do the heavy lifting. More voices, more belief.',
          relativeTo: 'cartOpen',
          offsetDays: 6,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'What people are saying about {{offerName}}',
              body: `Hey {{firstName}},

I'll let my clients do the talking today.

"[Testimonial quote from client 1 — specific result or experience]"
— [Client 1 name, title or descriptor]

"[Testimonial quote from client 2 — specific result or experience]"
— [Client 2 name, title or descriptor]

"[Testimonial quote from client 3 — specific result or experience]"
— [Client 3 name, title or descriptor]

These are real people. {{idealClient}}, just like you, who decided to stop waiting and start {{transformation}}.

They didn't have it all figured out before they joined. They had the same doubts, the same busy schedule, the same questions you might have right now. What they had was a decision.

If you're ready to make the same one — enrolment is open until {{cartClose}}.

→ {{salesPageUrl}}

{{yourName}}

P.S. I'm so proud of every single one of these humans. The results they've created are completely their own — I just gave them the framework.`,
            },
          },
        },

        {
          id: '3-13',
          sequence: 'cart-open',
          name: 'Midpoint urgency email',
          description:
            'At the halfway point of your cart-open window, send an urgency email. Note how many spots have been claimed (if capped), how much time is left, and remind them what they\'re saying yes to.',
          relativeTo: 'cartOpen',
          offsetDays: 7,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Halfway through — [X] spots left in {{offerName}}',
              body: `Hey {{firstName}},

We're halfway through the enrolment window for {{offerName}}.

[If capped: [X] spots have already been claimed. [Y] remain.]

I want to check in with you: what's holding you back?

If it's a question about whether this is right for you — hit reply. I'll give you a straight answer.

If it's logistics — payment, timing, what to expect — the answers are all on the sales page, and I'm also happy to answer directly.

If it's fear — I get it. Investing in yourself isn't always easy, even when you know it's the right move. But I'll tell you what I tell everyone who asks: the only thing worse than the discomfort of the investment is the discomfort of staying exactly where you are.

Enrolment closes {{cartClose}}.

→ {{salesPageUrl}}

{{yourName}}

P.S. If you've been sitting on this, now is the time to move. Things don't magically change if we keep doing what we've always done.`,
            },
          },
        },

        {
          id: '3-14',
          sequence: 'cart-open',
          name: 'The bonus stack email',
          description:
            'Highlight the bonuses included in {{offerName}} and make them feel irresistible. Give each bonus a clear name, describe what it is and why it matters, and show the compounded value of the full package.',
          relativeTo: 'cartOpen',
          offsetDays: 8,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'The bonuses inside {{offerName}} (these are good)',
              body: `Hey {{firstName}},

I want to make sure you know about everything that's inside {{offerName}} — because the bonuses alone are worth paying attention to.

When you join before {{cartClose}}, you also get:

BONUS 1: [Bonus name]
[2–3 sentences describing what this bonus is, what problem it solves, and why it matters to your client]
Value: [£/$ value]

BONUS 2: [Bonus name]
[2–3 sentences describing what this bonus is, what problem it solves, and why it matters to your client]
Value: [£/$ value]

BONUS 3: [Bonus name — if applicable]
[2–3 sentences describing what this bonus is, what problem it solves, and why it matters to your client]
Value: [£/$ value]

These bonuses aren't just nice-to-haves. They're things I've added specifically because I know they're the missing pieces for {{idealClient}} who want to get to {{transformation}} faster.

Total value of the bonuses alone: [combined bonus value].

Your investment for the full programme including all bonuses: {{price}} (or {{paymentPlan}}).

→ {{salesPageUrl}}

Enrolment closes {{cartClose}}.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-15',
          sequence: 'cart-open',
          name: 'FAQ email',
          description:
            'Address the most frequently asked questions about {{offerName}} — how it works, the time commitment, what happens if they can\'t attend live sessions, refund policy, and what makes it different. Give honest, thorough answers.',
          relativeTo: 'cartOpen',
          offsetDays: 9,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Your {{offerName}} questions, answered honestly',
              body: `Hey {{firstName}},

Enrolment for {{offerName}} closes {{cartClose}} — so if you've been sitting on questions, now's the time to get them answered.

Here are the most common ones I've been getting:

Q: How much time do I need each week?
A: [Honest, specific answer — e.g., "About X hours a week, made up of Y and Z."]

Q: What if I can't attend the live sessions?
A: [Answer about replays, recordings, flexibility]

Q: I've tried [similar thing] before and it didn't work. Why will this be different?
A: [Your specific differentiator — methodology, support structure, your unique approach]

Q: Is there a payment plan?
A: Yes — {{paymentPlan}}. You get access to everything from day one.

Q: What's the refund policy?
A: [Your honest refund or guarantee policy]

Q: When does it start and how long does it run?
A: [Start date] — the programme runs for {{timeframe}}.

Still have a question that's not on here? Hit reply and ask me directly. I'll get back to you before the cart closes.

→ {{salesPageUrl}}

{{yourName}}`,
            },
          },
        },

        {
          id: '3-16',
          sequence: 'cart-open',
          name: '48 hours left email',
          description:
            'Send a 48-hour warning that enrolment for {{offerName}} closes in two days. Remind them of what they\'re getting, create genuine urgency without being pushy, and make the path to joining easy.',
          relativeTo: 'cartClose',
          offsetDays: -2,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: '48 hours left — {{offerName}} closes {{cartClose}}',
              body: `Hey {{firstName}},

Heads up: {{offerName}} closes in 48 hours.

If you've been thinking about it — now is the time to make a decision, one way or the other.

Here's what happens when you say yes:

→ You get immediate access to [first module or welcome material]
→ Your account is set up and you're inside [community/portal] within [timeframe]
→ [First live session or milestone] happens on [date]
→ In {{timeframe}}, you've made the moves to {{transformation}}

Here's what happens if you wait:

The cart closes {{cartClose}} and the founding member pricing goes away. The next time this opens, the price will be higher and the bonuses may not be the same.

I'm not trying to pressure you. I'm giving you the honest picture.

→ Join {{offerName}}: {{salesPageUrl}}

If you have any last questions before you decide, hit reply right now.

{{yourName}}`,
            },
          },
        },

        {
          id: '3-17',
          sequence: 'cart-open',
          name: 'Tomorrow is the last day',
          description:
            'Send a clear, direct "last day tomorrow" warning email. Give them one final night to think about it and make it easy to join first thing in the morning. Include the link prominently.',
          relativeTo: 'cartClose',
          offsetDays: -1,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Tomorrow is the last day to join {{offerName}}',
              body: `Hey {{firstName}},

Tomorrow is the last day.

{{offerName}} closes {{cartClose}} at [time], and I mean it — the cart closes, the page comes down, and enrolment ends.

I know some of you have been back and forth on this. I know you've read the emails, visited the page, and maybe even started filling in your details. If that's you — this is the nudge.

Here's what I know about the people who join:
They're not the ones who have it all figured out. They're the ones who decide to stop waiting for perfect conditions and bet on themselves.

That can be you.

→ Last chance to join: {{salesPageUrl}}

If you have a question that's been stopping you from hitting the button — reply to this email right now. I'll respond tonight.

{{yourName}}

P.S. The payment plan is {{paymentPlan}}. If price has been the thing, that's your answer.`,
            },
          },
        },

        {
          id: '3-18',
          sequence: 'cart-open',
          name: 'Last day morning email',
          description:
            'Send the final morning email on the day the cart closes. Short, warm, and clear. Tell them exactly when the cart closes, remind them what\'s at stake, and make the link front and centre.',
          relativeTo: 'cartClose',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Today is the last day — {{offerName}} closes tonight',
              body: `Hey {{firstName}},

Today is the last day to join {{offerName}}.

The cart closes tonight at [closing time] [timezone], and after that, this founding member pricing is gone for good.

I want to say this simply: if {{transformation}} is something you genuinely want — and you've been reading these emails, watching the training, and sitting on the fence — today is your moment.

Not because I'm trying to pressure you. Because deadlines are the thing that turn "I'll do it someday" into something that actually happens.

→ {{salesPageUrl}}

Tonight at [closing time], the door closes.

I hope I see your name inside.

{{yourName}}

P.S. Questions? Reply to this email. I'm checking it all day.`,
            },
          },
        },

        {
          id: '3-19',
          sequence: 'cart-open',
          name: 'Final hours — doors closing tonight',
          description:
            'The last email of the launch. Send it 2–3 hours before the cart closes. Ultra-direct. The final call. No filler, no fluff — just the link, the deadline, and a genuine goodbye to anyone not joining this round.',
          relativeTo: 'cartClose',
          offsetDays: 0,
          status: 'not-started',
          contentTemplate: {
            email: {
              subject: 'Closing in a few hours — this is the last email',
              body: `Hey {{firstName}},

This is the last email.

{{offerName}} closes tonight at [closing time]. A few hours from now, the cart is done.

If you're in — go here: {{salesPageUrl}}

If you're not — that's okay. I hope something I shared over the past few weeks was useful to you. I'll keep showing up in your inbox with good stuff regardless.

For everyone who did join: I cannot wait to work with you. I'll be in touch within 24 hours with your welcome email and everything you need to get started.

See you on the other side.

{{yourName}}`,
            },
          },
        },
      ],
    },

    // ─── PHASE 4: DELIVERY ───────────────────────────────────────────────────────
    {
      id: 4,
      name: 'Delivery',
      tagline: 'Onboarding, curriculum, and early client results',
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
            'Ensure all course materials, resources, and community access are ready before your first client logs in. Test every link and check every download. No broken experiences on day one.',
          relativeTo: 'cartClose',
          offsetDays: 1,
        },
        {
          id: '4-3',
          name: 'Host your onboarding call',
          description:
            'Run your kick-off session with all new clients. Set expectations, answer questions, and start building the group dynamic. Record it for anyone who can\'t attend live.',
          relativeTo: 'cartClose',
          offsetDays: 5,
        },
        {
          id: '4-4',
          name: 'Collect early wins and testimonials',
          description:
            'At the two-week mark, actively ask clients for early wins and honest feedback. Don\'t wait until the end — collect as you go.',
          relativeTo: 'cartClose',
          offsetDays: 14,
        },
      ],
    },

    // ─── PHASE 5: DEBRIEF & DOUBLE ───────────────────────────────────────────────
    {
      id: 5,
      name: 'Debrief & Double',
      tagline: 'Review your data, find growth levers, plan the next launch',
      color: '#f472b6',
      tasks: [
        {
          id: '5-1',
          name: 'Pull your launch numbers',
          description:
            'Compile all your launch metrics: leads generated, live event attendance, sales page views, conversion rate, total revenue, and ad spend. Get it all in one place.',
          relativeTo: 'cartClose',
          offsetDays: 7,
        },
        {
          id: '5-2',
          name: 'Run your debrief session',
          description:
            'Block 90 minutes for a solo debrief. Review: what worked, what didn\'t, what surprised you, and what you\'d do differently. Write it all down while it\'s fresh.',
          relativeTo: 'cartClose',
          offsetDays: 14,
        },
        {
          id: '5-3',
          name: 'Identify your 3 growth levers',
          description:
            'From your debrief, identify the 3 specific things that, if improved, would have the biggest impact on your next launch results. These become your focus areas — not everything, just these three.',
          relativeTo: 'cartClose',
          offsetDays: 16,
        },
        {
          id: '5-4',
          name: 'Set your next launch date',
          description:
            'While momentum is high, set the date for your next launch. Block it in your calendar now. The next one will be easier than this one.',
          relativeTo: 'cartClose',
          offsetDays: 21,
        },
      ],
    },
  ],
}
