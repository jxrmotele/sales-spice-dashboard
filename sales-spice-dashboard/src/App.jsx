import { useState, useEffect } from 'react'
import Header from './components/Header'
import DashboardView from './components/DashboardView'
import CalendarView from './components/CalendarView'
import GuidedView from './components/GuidedView'
import MetricsView from './components/MetricsView'
import AssetsView from './components/AssetsView'
import LaunchContentView from './components/LaunchContentView'
import ProgressSummary from './components/ProgressSummary'
import IdeasBankModal from './components/IdeasBankModal'
import SetupScreen from './components/SetupScreen'
import ClientPicker from './components/ClientPicker'
import ExportButton from './components/ExportButton'
import { buildLaunch } from './utils/launchBuilder'
import { alphaTemplate } from './data/templates/alphaTemplate'
import { arenaTemplate } from './data/templates/arenaTemplate'

const TEMPLATES = { alpha: alphaTemplate, arena: arenaTemplate }

// Build a flat lookup of current template tasks by id, so flags added after a
// client's launch was built (e.g. leadMagnetPicker, superfans60Script) still
// appear for existing dashboards.
function currentTemplateTasks(templateId) {
  const tpl = TEMPLATES[templateId]
  if (!tpl) return {}
  const map = {}
  tpl.phases.forEach((phase) => phase.tasks.forEach((t) => { map[t.id] = t }))
  return map
}

// ─── storage helpers ──────────────────────────────────────────────────────────

const CLIENTS_KEY = 'salesSpice_clients'

function storageKey(clientId) {
  return `salesSpice_v1_${clientId}`
}

function loadClients() {
  try {
    return JSON.parse(localStorage.getItem(CLIENTS_KEY)) || []
  } catch {
    return []
  }
}

function saveClients(clients) {
  localStorage.setItem(CLIENTS_KEY, JSON.stringify(clients))
}

function loadClientData(clientId) {
  try {
    const raw = localStorage.getItem(storageKey(clientId))
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function saveClientData(clientId, data) {
  localStorage.setItem(storageKey(clientId), JSON.stringify(data))
}

function deleteClientData(clientId) {
  localStorage.removeItem(storageKey(clientId))
  localStorage.removeItem(`salesSpice_metrics_v1_${clientId}`)
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
}

function initTasks(phases) {
  return phases.flatMap((phase) => phase.tasks.map((task) => ({ ...task })))
}

// ─── app ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [activeClientId, setActiveClientId] = useState(null)
  const [clients, setClients] = useState(loadClients)
  const [launch, setLaunch] = useState(null)
  const [page, setPage] = useState('dashboard')                  // 'dashboard' | 'launch' | 'report' | 'assets' | 'content'
  const [launchSubView, setLaunchSubView] = useState('calendar') // 'calendar' | 'guided'
  const [calendarMode, setCalendarMode] = useState('90day')      // '90day' | '30day' | '7day'
  const [tasks, setTasks] = useState([])
  const [editingOfferDetails, setEditingOfferDetails] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [showIdeasBank, setShowIdeasBank] = useState(false)

  // Load client data when activeClientId changes
  useEffect(() => {
    if (!activeClientId) return
    const data = loadClientData(activeClientId)
    if (data) {
      setLaunch(data.launch)
      setTasks(data.tasks)
      // Migrate old `view` field to new state shape; always open on dashboard
      setPage('dashboard')
      setLaunchSubView(data.launchSubView || 'calendar')
      setCalendarMode(data.calendarMode || '90day')
    } else {
      setLaunch(null)
      setTasks([])
      setPage('dashboard')
      setLaunchSubView('calendar')
      setCalendarMode('90day')
    }
  }, [activeClientId])

  // Save client data whenever it changes
  useEffect(() => {
    if (!activeClientId || !launch) return
    saveClientData(activeClientId, { launch, tasks, page, launchSubView, calendarMode })

    // Keep the clients index up to date with latest progress
    setClients((prev) => {
      const completed = tasks.filter((t) => t.status === 'complete').length
      const updated = prev.map((c) =>
        c.id === activeClientId
          ? { ...c, completedTasks: completed, totalTasks: tasks.length }
          : c
      )
      saveClients(updated)
      return updated
    })
  }, [launch, tasks, page, launchSubView, calendarMode, activeClientId])

  function handleSetupComplete(template, offerDetails, keyDates, isEditMode) {
    if (isEditMode) {
      // Edit mode: only update offerDetails, preserve task progress
      setLaunch((prev) => ({ ...prev, offerDetails }))
      setEditingOfferDetails(false)
      return
    }

    const built = buildLaunch(template, offerDetails, keyDates)
    const newTasks = initTasks(built.phases)
    setLaunch(built)
    setTasks(newTasks)
    setPage('dashboard')
    setLaunchSubView('calendar')
    setCalendarMode('90day')

    // Register this client in the index with their details
    setClients((prev) => {
      const updated = prev.map((c) =>
        c.id === activeClientId
          ? {
              ...c,
              name: offerDetails.yourName,
              launchName: built.client.launchName,
              templateName: built.templateName,
              completedTasks: 0,
              totalTasks: newTasks.length,
            }
          : c
      )
      saveClients(updated)
      return updated
    })
  }

  function handleEditOfferDetails() {
    setEditingOfferDetails(true)
  }

  function updateTask(taskId, updates) {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, ...updates } : t))
    )
  }

  function handleNewClient() {
    const id = generateId()
    const newClient = {
      id,
      name: 'New client',
      launchName: '',
      templateName: '',
      completedTasks: 0,
      totalTasks: 0,
    }
    setClients((prev) => {
      const updated = [...prev, newClient]
      saveClients(updated)
      return updated
    })
    setActiveClientId(id)
  }

  function handleSwitchClients() {
    setActiveClientId(null)
    setLaunch(null)
    setTasks([])
    setPage('dashboard')
    setLaunchSubView('calendar')
    setCalendarMode('90day')
  }

  function handleDeleteClient(id) {
    deleteClientData(id)
    setClients((prev) => {
      const updated = prev.filter((c) => c.id !== id)
      saveClients(updated)
      return updated
    })
    if (activeClientId === id) {
      setActiveClientId(null)
      setLaunch(null)
      setTasks([])
    }
  }

  function handleResetLaunch() {
    if (window.confirm('Reset this launch plan? All progress will be cleared.')) {
      deleteClientData(activeClientId)
      setLaunch(null)
      setTasks([])
      setPage('dashboard')
      setLaunchSubView('calendar')
      setCalendarMode('90day')
    }
  }

  // ── render ──────────────────────────────────────────────────────────────────

  // No client selected → if only one client exists, auto-load them; otherwise show picker
  if (!activeClientId) {
    return (
      <ClientPicker
        clients={clients}
        onSelect={setActiveClientId}
        onNew={handleNewClient}
        onDelete={handleDeleteClient}
      />
    )
  }

  // Client selected but not yet set up → show setup
  if (!launch || editingOfferDetails) {
    return (
      <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <SetupScreen
          onComplete={handleSetupComplete}
          onBack={editingOfferDetails ? () => setEditingOfferDetails(false) : handleSwitchClients}
          initialStep={editingOfferDetails ? 2 : undefined}
          initialValues={editingOfferDetails ? launch?.offerDetails : undefined}
          initialTemplateId={editingOfferDetails ? launch?.templateId : undefined}
        />
      </div>
    )
  }

  // Rebuild phases with live task state merged back in.
  // currentTpl provides flags added to the template after this launch was built
  // (leadMagnetPicker, superfans60Script, etc.) so they always appear.
  const currentTpl = currentTemplateTasks(launch.templateId)
  const livePhases = launch.phases.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((t) => {
      const live = tasks.find((x) => x.id === t.id)
      const tplFlags = currentTpl[t.id] || {}
      return live ? { ...tplFlags, ...t, ...live } : { ...tplFlags, ...t }
    }),
  }))

  return (
    <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Header
        client={launch.client}
        page={page}
        onPageChange={setPage}
        launchSubView={launchSubView}
        onLaunchSubViewChange={setLaunchSubView}
        calendarMode={calendarMode}
        onCalendarModeChange={setCalendarMode}
        onSwitchClients={handleSwitchClients}
        onReset={handleResetLaunch}
        exportButton={<ExportButton launch={launch} phases={livePhases} />}
        onShowSummary={() => setShowSummary(true)}
        onShowIdeasBank={() => setShowIdeasBank(true)}
      />
      {page === 'dashboard' && (
        <DashboardView client={launch.client} onNavigate={setPage} />
      )}
      {page === 'launch' && launchSubView === 'calendar' && (
        <CalendarView
          phases={livePhases}
          tasks={tasks}
          client={launch.client}
          offerDetails={launch.offerDetails}
          templateId={launch.templateId}
          calendarMode={calendarMode}
          onUpdateTask={updateTask}
          onEditOfferDetails={handleEditOfferDetails}
        />
      )}
      {page === 'launch' && launchSubView === 'guided' && (
        <GuidedView
          phases={livePhases}
          tasks={tasks}
          client={launch.client}
          offerDetails={launch.offerDetails}
          onUpdateTask={updateTask}
        />
      )}
      {page === 'report' && <MetricsView clientId={activeClientId} />}
      {page === 'assets' && (
        <AssetsView
          offerDetails={launch.offerDetails}
          phases={livePhases}
          tasks={tasks}
          client={launch.client}
          onUpdateTask={updateTask}
        />
      )}
      {page === 'content' && (
        <LaunchContentView
          phases={livePhases}
          tasks={tasks}
          offerDetails={launch.offerDetails}
          client={launch.client}
          clientId={activeClientId}
          onUpdateTask={updateTask}
        />
      )}
      {showSummary && (
        <ProgressSummary
          launch={launch}
          phases={livePhases}
          tasks={tasks}
          clientId={activeClientId}
          onClose={() => setShowSummary(false)}
        />
      )}
      {showIdeasBank && (
        <IdeasBankModal onClose={() => setShowIdeasBank(false)} />
      )}
    </div>
  )
}
