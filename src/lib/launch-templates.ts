// Launch template definitions for Arena and Alpha launches
// Ported from the Vite prototype's template files

export type LaunchTask = {
  id: string
  name: string
  description: string
  relativeTo: "launchStart" | "cartOpen" | "cartClose"
  offsetDays: number
  sequence?: string   // 'waitlist-drive' | 'webinar-drive' | 'cart-open' | 'waitlist-nurture' | 'onboarding'
  leadMagnetPicker?: boolean
  salesPageBuilder?: boolean
  superfans60Script?: boolean
}

export type LaunchPhase = {
  id: number
  name: string
  tagline: string
  color: string
  tasks: LaunchTask[]
}

export type LaunchTemplate = {
  id: string
  name: string
  tagline: string
  description: string
  color: string
  keyDateLabels: Record<string, { label: string; description: string }>
  phases: LaunchPhase[]
}

// ─── Arena Launch Template ────────────────────────────────────────────────────

export const arenaTemplate: LaunchTemplate = {
  id: "arena",
  name: "Arena Launch",
  tagline: "Full conversion event launch",
  description:
    "The full launch framework: build your audience with a lead magnet, warm them up with content, run a live conversion event, then open and close cart. Best for launching to a cold or growing audience.",
  color: "#f472b6",
  keyDateLabels: {
    launchStart: { label: "Launch Start", description: "The day your lead magnet goes live and you start actively growing your audience." },
    cartOpen: { label: "Cart Open / Live Event", description: "The day you host your live conversion event and open the cart immediately after." },
    cartClose: { label: "Cart Close", description: "Your hard deadline — when enrolment closes." },
  },
  phases: [
    {
      id: 1,
      name: "Offer & Positioning",
      tagline: "Build and validate your offer before launch",
      color: "#f472b6",
      tasks: [
        { id: "1-1", name: "Define your core offer", description: "Write out your offer in full: what it is, who it's for, what they get, and the transformation they'll experience. Be specific about deliverables, timeline, and what makes it different.", relativeTo: "launchStart", offsetDays: -35 },
        { id: "1-2", name: "Validate with your audience", description: "Poll your existing audience or run a small validation exercise. Ask 5–10 ideal clients whether this offer solves a real problem they have right now. Listen more than you pitch.", relativeTo: "launchStart", offsetDays: -28 },
        { id: "1-3", name: "Nail your positioning statement", description: "Complete this sentence: \"I help {{idealClient}} achieve {{transformation}} without {{mainObjection}} in {{timeframe}}.\" This becomes the foundation of all your launch copy.", relativeTo: "launchStart", offsetDays: -21 },
        { id: "1-4", name: "Write your sales page", description: "Using your positioning statement and offer details, write the full sales page. Cover: headline, problem, solution, what's included, who it's for, FAQs, testimonials, and a clear buy button.", relativeTo: "launchStart", offsetDays: -21, salesPageBuilder: true },
        { id: "1-5", name: "Set your pricing and payment options", description: "Finalise your price point. Set up your checkout links and test every one. Consider whether a payment plan increases accessibility without devaluing the offer.", relativeTo: "launchStart", offsetDays: -21 },
      ],
    },
    {
      id: 2,
      name: "Audience Growth & Warm-Up",
      tagline: "Lead magnet, list growth, and nurture content",
      color: "#60a5fa",
      tasks: [
        { id: "2-1", name: "Create your lead magnet", description: "Your lead magnet should solve one specific, pressing problem for your ideal client and act as a natural entry point into your offer. Keep it focused — one outcome, delivered well. Choose your format below and follow the outline.", relativeTo: "launchStart", offsetDays: -21, leadMagnetPicker: true },
        { id: "2-2", name: "Set up your opt-in page", description: "Create the landing page for your lead magnet. You need: a clear headline, 3–5 bullet points on what they'll get, a simple opt-in form, and a confirmation email that delivers the freebie.", relativeTo: "launchStart", offsetDays: -14 },
        { id: "2-3", name: "Plan your warm-up content", description: "Map out 3 weeks of content (social + email) that educates your audience on the problem your offer solves. Build desire, address objections, and share stories — all without pitching.", relativeTo: "launchStart", offsetDays: -14 },
        { id: "2-4", name: "Write your nurture email sequence", description: "Write a 5-email welcome sequence for new subscribers. Email 1: deliver the freebie. Emails 2–5: build trust, share client stories, address the top objections, and build excitement for what's coming.", relativeTo: "launchStart", offsetDays: -10, sequence: "waitlist-nurture" },
        { id: "2-5", name: "Run your list growth sprint", description: "Three-week push to grow your list. Post daily about your lead magnet. Collaborate with 2–3 peers for cross-promotion. Consider a small paid ads budget to amplify what's already working.", relativeTo: "cartOpen", offsetDays: -21 },
        { id: "2-6", name: "Announcement — registration is open", description: "First webinar-drive email. Announce that registration for your live event is now open. Create curiosity around the core teaching, communicate who it is for, and give them a clear CTA to register.", relativeTo: "cartOpen", offsetDays: -14, sequence: "webinar-drive" },
        { id: "2-7", name: "What you'll learn email", description: "Go deeper on the content of your live event. Break down the 3 core things they will walk away with. Make the value of attending feel concrete and specific.", relativeTo: "cartOpen", offsetDays: -12, sequence: "webinar-drive" },
        { id: "2-8", name: "Who this is for email", description: "Make it crystal clear who the live event is designed for. Use \"this is for you if...\" and \"this is NOT for you if...\" framing.", relativeTo: "cartOpen", offsetDays: -11, sequence: "webinar-drive" },
        { id: "2-9", name: "The problem email", description: "Write about the core problem your audience faces. Agitate it. Show empathy. Then tease the solution they'll get from attending.", relativeTo: "cartOpen", offsetDays: -10, sequence: "webinar-drive" },
        { id: "2-10", name: "Social proof / results email", description: "Share a specific client story or result. Be concrete — numbers, timeframes, before and after. Make it relatable, not aspirational.", relativeTo: "cartOpen", offsetDays: -9, sequence: "webinar-drive" },
        { id: "2-11", name: "Urgency — seats filling email", description: "Seats are limited. Create real urgency around limited spots or registration closing. Include a clear CTA.", relativeTo: "cartOpen", offsetDays: -8, sequence: "webinar-drive" },
        { id: "2-12", name: "FAQ email", description: "Address the top 3–5 questions you get about your live event. Frame each as an opportunity to reinforce the value of attending.", relativeTo: "cartOpen", offsetDays: -7, sequence: "webinar-drive" },
        { id: "2-13", name: "Reminder — 3 days before webinar", description: "Three-day countdown reminder. Short, punchy, direct. Remind them what they'll learn and why they can't miss it.", relativeTo: "cartOpen", offsetDays: -3, sequence: "webinar-drive" },
        { id: "2-14", name: "Reminder — 1 day before webinar", description: "Tomorrow email. Build anticipation. Remind them of the time and how to join. Short and energetic.", relativeTo: "cartOpen", offsetDays: -1, sequence: "webinar-drive" },
        { id: "2-15", name: "Morning of webinar email", description: "Day-of email sent in the morning. Final reminder of the time, how to join, and what they'll get. Keep it short and exciting.", relativeTo: "cartOpen", offsetDays: 0, sequence: "webinar-drive" },
        { id: "2-16", name: "Starting soon — 1 hour before", description: "1-hour reminder. Ultra short. Time, link, and that's it. High urgency.", relativeTo: "cartOpen", offsetDays: 0, sequence: "webinar-drive" },
        { id: "2-17", name: "Webinar is live now email", description: "We're live! Short email with the direct join link. For people who registered but haven't joined yet.", relativeTo: "cartOpen", offsetDays: 0, sequence: "webinar-drive" },
        { id: "2-18", name: "Missed it — replay email", description: "For people who couldn't make it live. Share the replay link with a deadline. Tease that the offer is now open.", relativeTo: "cartOpen", offsetDays: 1, sequence: "webinar-drive" },
        { id: "2-19", name: "Last chance to watch replay", description: "Final replay reminder before it comes down. Create urgency and remind them the offer won't be available much longer.", relativeTo: "cartOpen", offsetDays: 2, sequence: "webinar-drive" },
      ],
    },
    {
      id: 3,
      name: "Launch Go Time",
      tagline: "Live event, cart open, and cart close",
      color: "#34d399",
      tasks: [
        { id: "3-1", name: "Promote your live event", description: "Daily promotion of your live event across all channels for the 2 weeks before it happens. Show up, share BTS, create curiosity.", relativeTo: "cartOpen", offsetDays: -14, sequence: "webinar-drive" },
        { id: "3-2", name: "Prepare your live event content", description: "Build your Superfans 60 presentation. Follow the exact script framework below — each section has a specific job. Practise until you can deliver it with confidence without reading from notes.", relativeTo: "cartOpen", offsetDays: -3, superfans60Script: true },
        { id: "3-4", name: "Host your live event", description: "Deliver your Superfans 60 event. Show up energetically, follow the framework, and open the cart live during the presentation.", relativeTo: "cartOpen", offsetDays: 0 },
        { id: "3-5", name: "Post daily while cart is open", description: "Show up on social every single day the cart is open. Share testimonials, handle objections, create urgency. Never leave a day empty.", relativeTo: "cartClose", offsetDays: -1 },
        { id: "3-6", name: "Doors open announcement", description: "Cart open announcement email. Announce the offer, share your excitement, and give them everything they need to join right now.", relativeTo: "cartOpen", offsetDays: 0, sequence: "cart-open" },
        { id: "3-7", name: "What's inside the offer", description: "Deep dive on deliverables. Walk through each component and connect it back to the transformation. Make the value feel real and specific.", relativeTo: "cartOpen", offsetDays: 1, sequence: "cart-open" },
        { id: "3-8", name: "Who this is for", description: "Clear qualification email. Who is this programme designed for? Use their language. Make the right people feel seen and called in.", relativeTo: "cartOpen", offsetDays: 2, sequence: "cart-open" },
        { id: "3-9", name: "The transformation story", description: "Share a specific before-and-after. A client story or your own. Make the transformation feel real, achievable, and desirable.", relativeTo: "cartOpen", offsetDays: 3, sequence: "cart-open" },
        { id: "3-10", name: "Objection — \"I don't have time\"", description: "Handle the time objection head on. Reframe the cost of NOT doing this, and show how the programme works for busy people.", relativeTo: "cartOpen", offsetDays: 4, sequence: "cart-open" },
        { id: "3-11", name: "Objection — value reframe on price", description: "Handle the investment objection. Frame the price against the transformation, the cost of staying stuck, and the support they'll receive.", relativeTo: "cartOpen", offsetDays: 5, sequence: "cart-open" },
        { id: "3-12", name: "Social proof heavy email", description: "Stack multiple specific results or quotes. Different types of people getting different types of results — make it feel broadly achievable.", relativeTo: "cartOpen", offsetDays: 6, sequence: "cart-open" },
        { id: "3-13", name: "Midpoint urgency email", description: "Halfway through the open cart period — create a checkpoint urgency moment. Remind them of what they get, what's at stake, and that the window is closing.", relativeTo: "cartOpen", offsetDays: 7, sequence: "cart-open" },
        { id: "3-14", name: "The bonus stack email", description: "Remind them everything that's included — core programme plus all bonuses. Build the perceived value stack and show how over-invested you are in their success.", relativeTo: "cartOpen", offsetDays: 8, sequence: "cart-open" },
        { id: "3-15", name: "FAQ email", description: "Address the most common questions you get when people are on the fence. Frame each question positively — they're not objections, they're things people ask because they're interested.", relativeTo: "cartOpen", offsetDays: 9, sequence: "cart-open" },
        { id: "3-16", name: "48 hours left email", description: "Two days left. Real deadline, real consequence. Make the urgency feel genuine and the CTA feel urgent and low-friction.", relativeTo: "cartClose", offsetDays: -2, sequence: "cart-open" },
        { id: "3-17", name: "Tomorrow is the last day", description: "One day left. Warm and urgent. This is the final full day to join — make them feel the moment without being pushy.", relativeTo: "cartClose", offsetDays: -1, sequence: "cart-open" },
        { id: "3-18", name: "Last day morning email", description: "Morning of close. Cheerful, warm, direct. Doors close tonight — here's the link. See you inside.", relativeTo: "cartClose", offsetDays: 0, sequence: "cart-open" },
        { id: "3-19", name: "Final hours — doors closing tonight", description: "Final send, 2–3 hours before close. Ultra-short. The link. The time. The consequence. Nothing else.", relativeTo: "cartClose", offsetDays: 0, sequence: "cart-open" },
      ],
    },
    {
      id: 4,
      name: "Delivery",
      tagline: "Onboard your clients and deliver the experience",
      color: "#a78bfa",
      tasks: [
        { id: "4-1", name: "Send welcome emails to new clients", description: "Welcome email immediately after purchase. Confirm they're in, give them everything they need to get started, and set the tone for the experience they're about to have.", relativeTo: "cartClose", offsetDays: 1, sequence: "onboarding" },
        { id: "4-2", name: "Prepare your client portal", description: "Set up the member area, course platform, or Notion doc with everything they'll need. Test access from a fresh browser. Don't let your first experience be a login problem.", relativeTo: "cartClose", offsetDays: 1 },
        { id: "4-3", name: "Host your onboarding call", description: "Welcome call with your new cohort. Introduce yourself properly, share the plan, answer questions, and get everyone excited for what's ahead.", relativeTo: "cartClose", offsetDays: 5 },
        { id: "4-4", name: "Collect early wins and testimonials", description: "After 2 weeks of delivery, actively ask for early wins, screenshots, and quotes. These become the social proof for your next launch.", relativeTo: "cartClose", offsetDays: 14 },
      ],
    },
    {
      id: 5,
      name: "Debrief & Double",
      tagline: "Reflect, review, and plan your next launch",
      color: "#fb923c",
      tasks: [
        { id: "5-1", name: "Pull your launch numbers", description: "Revenue, conversion rate, list growth, show-up rate, close rate. Every number. Build a habit of measuring — you can only improve what you track.", relativeTo: "cartClose", offsetDays: 7 },
        { id: "5-2", name: "Run your debrief session", description: "What worked? What didn't? What felt hard vs easy? What would you do differently? Write it down. This is the most valuable 90 minutes you'll spend post-launch.", relativeTo: "cartClose", offsetDays: 14 },
        { id: "5-3", name: "Identify your 3 growth levers", description: "Based on the numbers and debrief: what are the 3 things that — if improved — would have the biggest impact on your next launch? Those become your focus.", relativeTo: "cartClose", offsetDays: 16 },
        { id: "5-4", name: "Set your next launch date", description: "Your next launch is built on this one. Set the date now. Block it in the calendar. Tell your audience. Momentum is the compound interest of launching.", relativeTo: "cartClose", offsetDays: 21 },
      ],
    },
  ],
}

// ─── Alpha Launch Template ────────────────────────────────────────────────────

export const alphaTemplate: LaunchTemplate = {
  id: "alpha",
  name: "Alpha Launch",
  tagline: "Waitlist-first launch to a warm audience",
  description:
    "Build a waitlist, nurture with daily emails, and open the cart to your most engaged subscribers first. Best for first launches or when you already have an audience.",
  color: "#f59e0b",
  keyDateLabels: {
    launchStart: { label: "Waitlist Opens", description: "The day you announce your waitlist and start building your list." },
    cartOpen: { label: "Cart Open", description: "The day you open enrolment to your waitlist first." },
    cartClose: { label: "Cart Close", description: "Your hard deadline — when enrolment closes." },
  },
  phases: [
    {
      id: 1,
      name: "Offer & Positioning",
      tagline: "Build and validate your offer before launch",
      color: "#f59e0b",
      tasks: [
        { id: "1-1", name: "Complete your offer clarity template", description: "Work through all 12 sections of the Offer Clarity Template. Every piece of copy you write during this launch will draw from what you define here.", relativeTo: "launchStart", offsetDays: -14 },
        { id: "1-2", name: "Build your simple sales page", description: "One page, one offer, one CTA. Headline, problem, solution, what's inside, social proof, price, and buy button. Don't overthink it — done is better than perfect.", relativeTo: "launchStart", offsetDays: -10, salesPageBuilder: true },
        { id: "1-3", name: "Set your pricing and payment options", description: "Finalise your price point. Set up your checkout links and test every one.", relativeTo: "launchStart", offsetDays: -10 },
        { id: "1-4", name: "Set up your waitlist page", description: "Simple opt-in page: headline, 2–3 bullets on what they'll get from the offer, and a form. That's it. This is about capturing interest, not converting.", relativeTo: "launchStart", offsetDays: -7 },
      ],
    },
    {
      id: 2,
      name: "Build Your Waitlist",
      tagline: "14 days of daily emails to build your waitlist",
      color: "#60a5fa",
      tasks: [
        { id: "2-1", name: "Day 1 — The big announcement", description: "Your launch announcement email. Share what's coming, who it's for, and where to join the waitlist. Be specific about the transformation, not vague about the offer.", relativeTo: "launchStart", offsetDays: 0, sequence: "waitlist-drive" },
        { id: "2-2", name: "Day 2 — Who this is for", description: "Crystal clear qualification email. Who is this designed for? Use their own language. Make the right people feel seen.", relativeTo: "launchStart", offsetDays: 1, sequence: "waitlist-drive" },
        { id: "2-3", name: "Day 3 — The problem you solve", description: "Go deep on the core problem. Name it clearly. Agitate it. Show empathy. Tease that a solution is coming.", relativeTo: "launchStart", offsetDays: 2, sequence: "waitlist-drive" },
        { id: "2-4", name: "Day 4 — Your story", description: "Share your expertise arc: where you were, what you tried, what you discovered, where you are now. Make them see themselves in your struggle.", relativeTo: "launchStart", offsetDays: 3, sequence: "waitlist-drive" },
        { id: "2-5", name: "Day 5 — Client result", description: "One specific client story with a concrete result. Before, after, and what changed. Make it relatable.", relativeTo: "launchStart", offsetDays: 4, sequence: "waitlist-drive" },
        { id: "2-6", name: "Day 6 — What's inside", description: "Share a peek at the offer. What's included and why. Connect each component back to the transformation they want.", relativeTo: "launchStart", offsetDays: 5, sequence: "waitlist-drive" },
        { id: "2-7", name: "Day 7 — Week 1 reminder", description: "One week in. Recap the problem, tease the solution, and remind them to join the waitlist if they haven't.", relativeTo: "launchStart", offsetDays: 6, sequence: "waitlist-drive" },
        { id: "2-8", name: "Day 8 — The transformation", description: "Paint the full before and after in vivid detail. Make the after state feel specific, tangible, and real.", relativeTo: "launchStart", offsetDays: 7, sequence: "waitlist-drive" },
        { id: "2-9", name: "Day 9 — Handle the main objection", description: "Name the biggest reason people don't buy and address it directly. Reframe, don't dismiss. Show you understand the concern.", relativeTo: "launchStart", offsetDays: 8, sequence: "waitlist-drive" },
        { id: "2-10", name: "Day 10 — How it works", description: "Walk them through the delivery. What does the experience actually look like? What do they get, and when? Remove the mystery.", relativeTo: "launchStart", offsetDays: 9, sequence: "waitlist-drive" },
        { id: "2-11", name: "Day 11 — Another win", description: "Second client story. Different type of person, different type of result. Show breadth.", relativeTo: "launchStart", offsetDays: 10, sequence: "waitlist-drive" },
        { id: "2-12", name: "Day 12 — Waitlist closing soon", description: "Waitlist closes in 48 hours. Create urgency. Remind them what they'll miss if they don't join.", relativeTo: "launchStart", offsetDays: 11, sequence: "waitlist-drive" },
        { id: "2-13", name: "Day 13 — Tomorrow", description: "Last full day before cart opens. Short, warm, direct. Tomorrow is the day.", relativeTo: "launchStart", offsetDays: 12, sequence: "waitlist-drive" },
        { id: "2-14", name: "Day 14 — Cart opening tonight", description: "Final waitlist email. Cart opens later today. Exclusive waitlist access is available first. Here's exactly what to do when you get the email.", relativeTo: "cartOpen", offsetDays: 0, sequence: "waitlist-drive" },
      ],
    },
    {
      id: 3,
      name: "Open to Close Cart",
      tagline: "Enrolment window — open cart to your waitlist first",
      color: "#34d399",
      tasks: [
        { id: "3-1", name: "Doors open — waitlist first", description: "Cart is now open, exclusively to your waitlist. This is their moment. Make them feel special. Give them everything they need to join in this email.", relativeTo: "cartOpen", offsetDays: 0, sequence: "cart-open" },
        { id: "3-2", name: "What's inside", description: "Deep dive on deliverables. Walk through each component and connect it back to the transformation.", relativeTo: "cartOpen", offsetDays: 1, sequence: "cart-open" },
        { id: "3-3", name: "Who this is for", description: "Clear qualification. Make the right people feel called in.", relativeTo: "cartOpen", offsetDays: 2, sequence: "cart-open" },
        { id: "3-4", name: "The transformation story", description: "A specific before-and-after. Make the transformation feel real and achievable.", relativeTo: "cartOpen", offsetDays: 3, sequence: "cart-open" },
        { id: "3-5", name: "Handle main objection", description: "Take on the biggest objection head-on. Reframe the cost of staying stuck.", relativeTo: "cartOpen", offsetDays: 4, sequence: "cart-open" },
        { id: "3-6", name: "Social proof email", description: "Stack multiple results and quotes. Different people, different results.", relativeTo: "cartOpen", offsetDays: 5, sequence: "cart-open" },
        { id: "3-7", name: "48 hours left", description: "Real deadline, real consequence. Make the urgency feel genuine.", relativeTo: "cartClose", offsetDays: -2, sequence: "cart-open" },
        { id: "3-8", name: "Last day morning", description: "Morning of close. Warm and direct. Doors close tonight.", relativeTo: "cartClose", offsetDays: 0, sequence: "cart-open" },
        { id: "3-9", name: "Final hours", description: "Final send. Ultra-short. The link. The time. The consequence. Nothing else.", relativeTo: "cartClose", offsetDays: 0, sequence: "cart-open" },
      ],
    },
    {
      id: 4,
      name: "Delivery & Debrief",
      tagline: "Onboard clients and capture learnings",
      color: "#a78bfa",
      tasks: [
        { id: "4-1", name: "Send welcome emails", description: "Welcome email immediately after purchase. Confirm they're in, give them everything to get started.", relativeTo: "cartClose", offsetDays: 1, sequence: "onboarding" },
        { id: "4-2", name: "Collect early wins", description: "Ask for early wins and testimonials after 2 weeks. These feed your next launch.", relativeTo: "cartClose", offsetDays: 14 },
        { id: "4-3", name: "Pull your launch numbers", description: "Revenue, conversion rate, list growth. Every number. Build the habit.", relativeTo: "cartClose", offsetDays: 7 },
        { id: "4-4", name: "Set your next launch date", description: "Momentum is the compound interest of launching. Set the date now.", relativeTo: "cartClose", offsetDays: 21 },
      ],
    },
  ],
}

export const TEMPLATES: Record<string, LaunchTemplate> = {
  arena: arenaTemplate,
  alpha: alphaTemplate,
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function computeTaskDate(
  task: LaunchTask,
  keyDates: { launchStart?: string; cartOpen?: string; cartClose?: string }
): Date | null {
  const base = keyDates[task.relativeTo]
  if (!base) return null
  const d = new Date(base)
  d.setDate(d.getDate() + task.offsetDays)
  return d
}
