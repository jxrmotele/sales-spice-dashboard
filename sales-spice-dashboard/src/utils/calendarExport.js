// ─── Calendar Export Utilities ────────────────────────────────────────────────

function toDateStamp(dateStr) {
  // Returns YYYYMMDD for ICS
  const d = new Date(dateStr)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}${m}${day}`
}

function toGCalDate(dateStr) {
  // Returns YYYYMMDD for Google Calendar URL
  return toDateStamp(dateStr)
}

function sanitize(str) {
  if (!str) return ''
  return String(str)
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

// ─── ICS download ─────────────────────────────────────────────────────────────

export function downloadICS(tasks, client) {
  const dated = tasks.filter((t) => t.dueDate)

  if (!dated.length) {
    alert('No tasks with due dates to export.')
    return
  }

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Get Volume//Launch Dashboard//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
  ]

  dated.forEach((task) => {
    const start = toDateStamp(task.dueDate)
    // End date = next day (DTEND is exclusive in ICS all-day events)
    const endDate = new Date(task.dueDate)
    endDate.setDate(endDate.getDate() + 1)
    const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`

    const summary = sanitize(`${task.name}${client?.launchName ? ` — ${client.launchName}` : ''}`)
    const description = sanitize(task.description || '')

    lines.push('BEGIN:VEVENT')
    lines.push(`DTSTART;VALUE=DATE:${start}`)
    lines.push(`DTEND;VALUE=DATE:${end}`)
    lines.push(`SUMMARY:${summary}`)
    if (description) lines.push(`DESCRIPTION:${description}`)
    lines.push(`UID:${task.id}-${start}@getvolume`)
    lines.push('END:VEVENT')
  })

  lines.push('END:VCALENDAR')

  const content = lines.join('\r\n')
  const blob = new Blob([content], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${(client?.launchName || 'launch').replace(/[^a-z0-9]/gi, '-').toLowerCase()}-tasks.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// ─── Google Calendar export ───────────────────────────────────────────────────
// Google Calendar doesn't support importing multiple events via a single URL,
// so we open one URL per task in batch — or, for large sets, we build a single
// "first task" link as a representative entry with instructions.
// For practical UX: open a Google Calendar URL for the first dated task,
// and fall back to an ICS download for the full set.

export function exportToGoogleCal(tasks, client) {
  const dated = tasks.filter((t) => t.dueDate)

  if (!dated.length) {
    alert('No tasks with due dates to export.')
    return
  }

  // Open the first event as a quick-add URL so the user sees how it works,
  // then auto-download the full ICS so they can import everything at once.
  const first = dated[0]
  const start = toGCalDate(first.dueDate)
  const endDate = new Date(first.dueDate)
  endDate.setDate(endDate.getDate() + 1)
  const end = `${endDate.getFullYear()}${String(endDate.getMonth() + 1).padStart(2, '0')}${String(endDate.getDate()).padStart(2, '0')}`

  const title = encodeURIComponent(`${first.name}${client?.launchName ? ` — ${client.launchName}` : ''}`)
  const details = encodeURIComponent(first.description || '')

  const url = `https://calendar.google.com/calendar/r/eventedit?text=${title}&dates=${start}/${end}&details=${details}`
  window.open(url, '_blank')

  // Also trigger the full ICS download so they can import all tasks
  downloadICS(dated, client)
}
