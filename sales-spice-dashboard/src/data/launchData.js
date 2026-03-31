// Placeholder data — this will be replaced with real client data later.
// Today is treated as March 22, 2026 so the guided view has tasks to show.

export const launchData = {
  client: {
    name: 'Emma Thompson',
    offer: '[Your Offer Name]',
    price: '[Your Price]',
    liveEventTitle: '[Your Live Event Title]',
    leadMagnet: '[Your Lead Magnet Name]',
    launchName: 'Spring Launch 2026',
    launchStart: '2026-04-01',
    cartOpen: '2026-04-22',
    cartClose: '2026-04-29',
  },
  phases: [
    {
      id: 1,
      name: 'Offer & Positioning',
      tagline: 'Build and validate your offer before launch',
      color: '#ec518c',
      tasks: [
        {
          id: '1-1',
          name: 'Define your core offer',
          description:
            'Write out your offer in full: what it is, who it\'s for, what they get, and the transformation they\'ll experience. Be specific about deliverables, timeline, and what makes it different.',
          dueDate: '2026-03-15',
          status: 'complete',
          notes: 'Done! Six-week group coaching programme, £1,497.',
        },
        {
          id: '1-2',
          name: 'Validate with your audience',
          description:
            'Poll your existing audience or run a small validation exercise. Ask 5–10 ideal clients whether this offer solves a real problem they have right now. Listen more than you pitch.',
          dueDate: '2026-03-17',
          status: 'complete',
          notes: 'Messaged 8 people in DMs — 7 said yes, they\'d be interested!',
        },
        {
          id: '1-3',
          name: 'Nail your positioning statement',
          description:
            'Complete this sentence: "I help [who] achieve [outcome] without [objection] in [timeframe]." This becomes the foundation of all your launch copy, so get it sharp before you write anything else.',
          dueDate: '2026-03-22',
          status: 'in-progress',
          notes: '',
        },
        {
          id: '1-4',
          name: 'Write your sales page',
          description:
            'Using your positioning statement and offer details, write the full sales page. Cover: headline, problem, solution, what\'s included, who it\'s for, FAQs, testimonials, and a clear buy button.',
          dueDate: '2026-03-24',
          status: 'not-started',
          notes: '',
        },
        {
          id: '1-5',
          name: 'Set your pricing and payment options',
          description:
            'Finalise your price point for [Your Offer Name]. Consider whether a payment plan increases accessibility. Set up your checkout links in your payment processor and test every one.',
          dueDate: '2026-03-25',
          status: 'not-started',
          notes: '',
        },
      ],
    },
    {
      id: 2,
      name: 'Audience Growth & Warm-Up',
      tagline: 'Lead magnet, list growth, and nurture content',
      color: '#f07aaa',
      tasks: [
        {
          id: '2-1',
          name: 'Create your lead magnet',
          description:
            'Build [Your Lead Magnet Name]. It should solve one specific, pressing problem for your ideal client and act as a natural entry point into your paid offer. Keep it focused — one outcome, delivered well.',
          dueDate: '2026-03-18',
          status: 'complete',
          notes: '',
        },
        {
          id: '2-2',
          name: 'Set up your opt-in page',
          description:
            'Create the landing page for [Your Lead Magnet Name]. You need: a clear headline, 3–5 bullet points on what they\'ll get, a simple opt-in form, and a confirmation email that delivers the freebie.',
          dueDate: '2026-03-22',
          status: 'in-progress',
          notes: 'Page is live, need to fix the confirmation email.',
        },
        {
          id: '2-3',
          name: 'Plan your warm-up content',
          description:
            'Map out 3 weeks of content (social + email) that educates your audience on the problem your offer solves. Build desire, address objections, and share stories — all without pitching.',
          dueDate: '2026-03-26',
          status: 'not-started',
          notes: '',
        },
        {
          id: '2-4',
          name: 'Write your nurture email sequence',
          description:
            'Write a 5-email welcome sequence for new subscribers. Email 1: deliver the freebie. Emails 2–5: build trust, share client stories, address the top 3 objections, and make them excited for what\'s coming.',
          dueDate: '2026-03-28',
          status: 'not-started',
          notes: '',
        },
        {
          id: '2-5',
          name: 'Run your list growth sprint',
          description:
            'Three-week push to grow your list. Post daily about [Your Lead Magnet Name]. Collaborate with 2–3 peers for cross-promotion. Consider a small paid ads budget to amplify what\'s already working.',
          dueDate: '2026-04-14',
          status: 'not-started',
          notes: '',
        },
      ],
    },
    {
      id: 3,
      name: 'Launch Go Time',
      tagline: 'Pre-launch, live event, cart open and close',
      color: '#c93070',
      tasks: [
        {
          id: '3-1',
          name: 'Promote your live event',
          description:
            'Start promoting [Your Live Event Title] across all channels. Email your list, post on social daily, and consider a small ad spend to drive registrations. Give people a reason to show up live.',
          dueDate: '2026-04-08',
          status: 'not-started',
          notes: '',
        },
        {
          id: '3-2',
          name: 'Prepare your live event content',
          description:
            'Build the slides and plan the flow for [Your Live Event Title]. Teach one big, transformative idea. Make a clear, confident offer at the end. Prepare your Q&A. Practise out loud at least twice.',
          dueDate: '2026-04-19',
          status: 'not-started',
          notes: '',
        },
        {
          id: '3-3',
          name: 'Write your cart open email sequence',
          description:
            'Write and schedule your 5-email cart open sequence. Day 1: announcement. Day 3: client success story. Day 5: FAQ deep-dive. Day 6: urgency (spots filling). Day 7: final call with hard deadline.',
          dueDate: '2026-04-20',
          status: 'not-started',
          notes: '',
        },
        {
          id: '3-4',
          name: 'Host your live event',
          description:
            'Deliver [Your Live Event Title]. Show up energetically, teach your very best content, and make a clear and confident offer at the end. Follow up with the replay within 24 hours.',
          dueDate: '2026-04-22',
          status: 'not-started',
          notes: '',
        },
        {
          id: '3-5',
          name: 'Post daily while cart is open',
          description:
            'Show up every single day while the cart is open. Mix content types: client wins, FAQ responses, behind-the-scenes, direct offer posts. Engagement and visibility are everything during this window.',
          dueDate: '2026-04-28',
          status: 'not-started',
          notes: '',
        },
        {
          id: '3-6',
          name: 'Send your cart close sequence',
          description:
            'Final 48 hours: send a "closing soon" email, a "last chance" email, and a "doors closed" email. Be direct and warm about the deadline. Deadlines are a gift — they help people decide.',
          dueDate: '2026-04-29',
          status: 'not-started',
          notes: '',
        },
      ],
    },
    {
      id: 4,
      name: 'Delivery',
      tagline: 'Onboarding, curriculum, and early client results',
      color: '#a82060',
      tasks: [
        {
          id: '4-1',
          name: 'Send welcome emails to new clients',
          description:
            'Within 24 hours of cart close, send every new client a warm welcome email. Include what happens next, how to access the programme, and how genuinely excited you are to work with them.',
          dueDate: '2026-04-30',
          status: 'not-started',
          notes: '',
        },
        {
          id: '4-2',
          name: 'Prepare your client portal',
          description:
            'Ensure all course materials, resources, and community access are ready before your first client logs in. Test every link. Check every download. No broken experiences on day one.',
          dueDate: '2026-04-30',
          status: 'not-started',
          notes: '',
        },
        {
          id: '4-3',
          name: 'Host your onboarding call',
          description:
            'Run your kick-off session with all new clients. Set expectations, answer questions, and start building the group dynamic. Record it for anyone who can\'t attend live.',
          dueDate: '2026-05-04',
          status: 'not-started',
          notes: '',
        },
        {
          id: '4-4',
          name: 'Collect early wins and testimonials',
          description:
            'At the two-week mark, actively ask clients for their early wins and honest feedback. These become the social proof for your next launch. Collect as you go — don\'t wait until the end.',
          dueDate: '2026-05-15',
          status: 'not-started',
          notes: '',
        },
      ],
    },
    {
      id: 5,
      name: 'Debrief & Double',
      tagline: 'Review your data, find growth levers, plan the next launch',
      color: '#700201',
      tasks: [
        {
          id: '5-1',
          name: 'Pull your launch numbers',
          description:
            'Compile all your launch metrics: leads generated, live event attendance, sales page views, conversion rate, total revenue, and ad spend if applicable. Get it all in one place.',
          dueDate: '2026-05-05',
          status: 'not-started',
          notes: '',
        },
        {
          id: '5-2',
          name: 'Run your debrief session',
          description:
            'Block 90 minutes for a solo debrief (or bring your coach). Review: what worked, what didn\'t, what surprised you, and what you\'d do differently. Write it all down — your future self will thank you.',
          dueDate: '2026-05-10',
          status: 'not-started',
          notes: '',
        },
        {
          id: '5-3',
          name: 'Identify your 3 growth levers',
          description:
            'Based on your debrief, identify the 3 specific things that, if improved, would have the biggest impact on your next launch results. These become your focus areas — not everything, just these three.',
          dueDate: '2026-05-12',
          status: 'not-started',
          notes: '',
        },
        {
          id: '5-4',
          name: 'Set your next launch date',
          description:
            'While the experience is fresh and momentum is high, set the date for your next launch. Block it in your calendar now. Don\'t let too much time pass. The next one will be easier than this one.',
          dueDate: '2026-05-15',
          status: 'not-started',
          notes: '',
        },
      ],
    },
  ],
}
