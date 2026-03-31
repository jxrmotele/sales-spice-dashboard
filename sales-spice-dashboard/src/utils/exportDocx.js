// exportDocx.js
// Generates a branded .docx Word document containing all launch content.
// Uses the `docx` package (browser-compatible via Vite/ESM).

import { Document, Packer, Paragraph, TextRun, HeadingLevel } from 'docx'
import { applyOfferDetails, applyOfferDetailsToTemplate } from './launchBuilder'
import { SALES_PAGE_SECTIONS } from '../components/SalesPageBuilder'
import { SUPERFANS60_SECTIONS } from '../components/Superfans60Script'

// ─── helpers ──────────────────────────────────────────────────────────────────

function fill(template, od) {
  if (!od || !template) return template || ''
  return applyOfferDetails(template, od)
}

function h1(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_1, spacing: { before: 400, after: 200 } })
}

function h2(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_2, spacing: { before: 300, after: 150 } })
}

function h3(text) {
  return new Paragraph({ text, heading: HeadingLevel.HEADING_3, spacing: { before: 200, after: 100 } })
}

function body(text) {
  if (!text) return []
  return text.split('\n').map(
    (line) =>
      new Paragraph({
        children: [new TextRun({ text: line || ' ', font: 'Calibri', size: 22 })],
        spacing: { after: 60 },
      })
  )
}

function label(text) {
  return new Paragraph({
    children: [new TextRun({ text, bold: true, font: 'Calibri', size: 22 })],
    spacing: { before: 160, after: 60 },
  })
}

function rule() {
  return new Paragraph({
    children: [new TextRun({ text: '─'.repeat(60), font: 'Courier New', size: 18, color: 'AAAAAA' })],
    spacing: { before: 100, after: 100 },
  })
}

function pageBreak() {
  return new Paragraph({ pageBreakBefore: true })
}

// ─── section builders ─────────────────────────────────────────────────────────

function buildCover(launch) {
  const date = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  return [
    new Paragraph({
      children: [new TextRun({ text: 'Sales Spice', bold: true, font: 'Calibri', size: 64, color: '700201' })],
      spacing: { before: 400, after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: 'Launch Content Pack', font: 'Calibri', size: 40, color: 'EC518C' })],
      spacing: { after: 400 },
    }),
    new Paragraph({
      children: [new TextRun({ text: launch.client?.launchName || 'Launch Content', bold: true, font: 'Calibri', size: 36 })],
      spacing: { after: 120 },
    }),
    new Paragraph({
      children: [new TextRun({ text: launch.client?.name || '', font: 'Calibri', size: 28 })],
      spacing: { after: 80 },
    }),
    new Paragraph({
      children: [new TextRun({ text: `Generated ${date}`, font: 'Calibri', size: 22, color: '888888' })],
      spacing: { after: 80 },
    }),
  ]
}

function buildOfferSummary(offerDetails) {
  const od = offerDetails || {}
  const fields = [
    ['Name', od.yourName],
    ['Business', od.businessName],
    ['Programme', od.offerName],
    ['Ideal client', od.idealClient],
    ['Transformation', od.transformation],
    ['Before state', od.beforeState],
    ['Delivery format', od.deliveryFormat],
    ['Timeframe', od.timeframe],
    ['Investment', od.price],
    ['Payment plan', od.paymentPlan],
    ['Method name', od.methodName],
    ['Live event', od.liveEventTitle],
    ['Lead magnet', od.leadMagnet],
    ['Sales page URL', od.salesPageUrl],
  ].filter(([, v]) => v && v.trim())

  if (fields.length === 0) return []

  return [
    pageBreak(),
    h1('Offer Summary'),
    rule(),
    ...fields.flatMap(([k, v]) => [label(k), ...body(v)]),
  ]
}

function buildSalesPage(offerDetails) {
  const od = offerDetails || {}
  return [
    pageBreak(),
    h1('Sales Page Copy'),
    rule(),
    ...SALES_PAGE_SECTIONS.flatMap((s) => [
      h2(`${s.number}. ${s.name}`),
      ...body(fill(s.template, od)),
    ]),
  ]
}

function buildTaskContent(phases, offerDetails) {
  const od = offerDetails || {}
  const blocks = []

  phases.forEach((phase) => {
    phase.tasks.forEach((task) => {
      if (!task.contentTemplate) return
      const content = applyOfferDetailsToTemplate(task.contentTemplate, od)
      if (!content) return

      blocks.push(h2(task.name))

      if (content.email) {
        blocks.push(h3('Email'))
        blocks.push(label(`Subject: ${content.email.subject}`))
        blocks.push(...body(content.email.body))
      }
      if (content.social) {
        blocks.push(h3('Social Post'))
        blocks.push(...body(content.social.copy))
      }
      if (content.salesPage) {
        blocks.push(h3('Page Copy'))
        content.salesPage.sections.forEach((sec) => {
          blocks.push(label(sec.label))
          blocks.push(...body(sec.content))
        })
      }
      blocks.push(rule())
    })
  })

  if (blocks.length === 0) return []
  return [pageBreak(), h1('Task Content'), rule(), ...blocks]
}

function buildSuperfansScript(offerDetails) {
  const od = offerDetails || {}
  return [
    pageBreak(),
    h1('Superfans 60 — Live Event Script'),
    rule(),
    ...SUPERFANS60_SECTIONS.flatMap((s) => [
      h2(`${s.number}. ${s.name} (${s.timing})`),
      ...body(fill(s.scriptTemplate, od)),
    ]),
  ]
}

// ─── main export ──────────────────────────────────────────────────────────────

/**
 * Build and download a .docx content pack for the given launch.
 * Returns a Promise that resolves when the download is triggered.
 */
export async function generateContentDoc(launch, phases) {
  const od = launch?.offerDetails || {}
  const isArena = launch?.templateId === 'arena'

  const children = [
    ...buildCover(launch),
    ...buildOfferSummary(od),
    ...buildSalesPage(od),
    ...buildTaskContent(phases, od),
    ...(isArena ? buildSuperfansScript(od) : []),
  ]

  const doc = new Document({
    creator: 'Sales Spice Dashboard',
    title: launch?.client?.launchName || 'Launch Content',
    sections: [{ children }],
  })

  const blob = await Packer.toBlob(doc)

  const clientSlug = (od.yourName || 'launch').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
  const filename = `${clientSlug}-launch-content.docx`

  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
