// launchBuilder.js
// Builds a live launch object from a template + offer details + key dates.
// All task due dates are calculated relative to the client's key milestone dates.

/**
 * Replace {{placeholder}} variables in a string with values from offerDetails.
 * Any placeholder with no matching value is left as [fieldName] so it's obvious.
 */
export function applyOfferDetails(text, offerDetails) {
  if (!text || typeof text !== 'string') return text
  return text.replace(/\{\{(\w+)\}\}/g, (_, key) => {
    const val = offerDetails[key]
    return val && val.trim() !== '' ? val : `[${key.replace(/([A-Z])/g, ' $1').toLowerCase()}]`
  })
}

/**
 * Apply offer details to a contentTemplate object recursively.
 * Handles email, social, and salesPage content types.
 */
export function applyOfferDetailsToTemplate(contentTemplate, offerDetails) {
  if (!contentTemplate) return null

  const result = {}

  if (contentTemplate.email) {
    result.email = {
      subject: applyOfferDetails(contentTemplate.email.subject, offerDetails),
      body: applyOfferDetails(contentTemplate.email.body, offerDetails),
    }
  }

  if (contentTemplate.social) {
    result.social = {
      copy: applyOfferDetails(contentTemplate.social.copy, offerDetails),
    }
  }

  if (contentTemplate.salesPage) {
    result.salesPage = {
      title: applyOfferDetails(contentTemplate.salesPage.title, offerDetails),
      sections: contentTemplate.salesPage.sections.map((s) => ({
        label: applyOfferDetails(s.label, offerDetails),
        content: applyOfferDetails(s.content, offerDetails),
      })),
    }
  }

  return result
}

/**
 * Calculate a task's due date from a relative anchor + offset in days.
 * Returns a YYYY-MM-DD string using LOCAL date parts to avoid UTC/DST drift
 * (e.g. UK users in BST would otherwise get dates 1 day off around DST transitions).
 */
function calculateDate(relativeTo, offsetDays, keyDates) {
  const base = keyDates[relativeTo]
  if (!base) return null
  // Parse the base date as local midnight by splitting the YYYY-MM-DD string
  // directly, avoiding the UTC-midnight parse that new Date('YYYY-MM-DD') gives.
  const [y, m, day] = base.split('-').map(Number)
  const d = new Date(y, m - 1, day + offsetDays)
  const yy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yy}-${mm}-${dd}`
}

/**
 * Build a complete, ready-to-use launch object from a template.
 * All relative dates become real dates. Offer details are stored for
 * use by the personalise function throughout the dashboard.
 */
export function buildLaunch(template, offerDetails, keyDates) {
  const phases = template.phases.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((task) => ({
      ...task,
      dueDate: calculateDate(task.relativeTo, task.offsetDays, keyDates),
      status: 'not-started',
      notes: '',
    })),
  }))

  return {
    templateId: template.id,
    templateName: template.name,
    client: {
      name: offerDetails.yourName,
      launchName: `${offerDetails.offerName} Launch`,
      launchStart: keyDates.launchStart,
      cartOpen: keyDates.cartOpen,
      cartClose: keyDates.cartClose,
    },
    offerDetails,
    phases,
  }
}
