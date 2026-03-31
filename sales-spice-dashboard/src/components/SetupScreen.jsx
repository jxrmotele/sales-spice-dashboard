import { useState } from 'react'
import { alphaTemplate } from '../data/templates/alphaTemplate'
import { arenaTemplate } from '../data/templates/arenaTemplate'
import {
  OCT_ESSENTIALS,
  OCT_SECTIONS,
  OCT_ARENA_EXTRAS,
  MESSAGING_CODEX_SECTIONS,
} from '../data/setupFrameworks'
import { T, winCard, winTitleBar, PHASE_COLORS } from '../theme'
import { generateMessagingCodex } from '../utils/generateMessagingCodex'

const TEMPLATES = [alphaTemplate, arenaTemplate]
const REQUIRED_OFFER_FIELDS = ['yourName', 'offerName', 'idealClient', 'transformation']
const STEP_LABELS = ['Launch type', 'Offer Clarity', 'Your Messaging', 'Key dates']

export default function SetupScreen({ onComplete, onBack, initialStep, initialValues, initialTemplateId }) {
  const editMode = !!initialValues

  const [step, setStep] = useState(initialStep || 1)
  const [selectedTemplate, setSelectedTemplate] = useState(
    initialTemplateId ? TEMPLATES.find((t) => t.id === initialTemplateId) || null : null
  )
  const [offerDetails, setOfferDetails] = useState(initialValues || {})
  const [messagingCodex, setMessagingCodex] = useState(initialValues || {})
  const [keyDates, setKeyDates] = useState({
    launchStart: '',
    cartOpen: '',
    cartClose: '',
  })
  const [codexGenerating, setCodexGenerating] = useState(false)
  const [codexError, setCodexError] = useState(null)
  const [codexGenerated, setCodexGenerated] = useState(false)
  const [confirmRegen, setConfirmRegen] = useState(false)
  const [codexJustGenerated, setCodexJustGenerated] = useState(false)
  const [showErrorDetail, setShowErrorDetail] = useState(false)

  function goToStep(n) {
    setStep(n)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function handleTemplateSelect(template) {
    setSelectedTemplate(template)
    goToStep(2)
  }

  function handleBuild() {
    onComplete(selectedTemplate, { ...offerDetails, ...messagingCodex }, keyDates, editMode)
  }

  function updateOffer(key, value) {
    setOfferDetails((prev) => ({ ...prev, [key]: value }))
  }

  function updateMessaging(key, value) {
    setMessagingCodex((prev) => ({ ...prev, [key]: value }))
  }

  async function handleGenerateCodex() {
    setConfirmRegen(false)
    setCodexGenerating(true)
    setCodexError(null)
    setShowErrorDetail(false)
    try {
      const generated = await generateMessagingCodex(offerDetails)
      setMessagingCodex((prev) => ({ ...prev, ...generated }))
      setCodexGenerated(true)
      setCodexJustGenerated(true)
      setTimeout(() => setCodexJustGenerated(false), 5000)
    } catch (err) {
      setCodexError(err.message)
    } finally {
      setCodexGenerating(false)
    }
  }

  function handleRegenClick() {
    if (codexGenerated && !confirmRegen) {
      setConfirmRegen(true)
    } else {
      handleGenerateCodex()
    }
  }

  function daysBetween(a, b) {
    if (!a || !b) return null
    const [ay, am, ad] = a.split('-').map(Number)
    const [by, bm, bd] = b.split('-').map(Number)
    const da = new Date(ay, am - 1, ad)
    const db = new Date(by, bm - 1, bd)
    return Math.round((db - da) / 86400000)
  }

  const canProceedStep2 =
    offerDetails.yourName?.trim() &&
    offerDetails.offerName?.trim() &&
    offerDetails.idealClient?.trim() &&
    offerDetails.transformation?.trim()

  const allDatesFilled = keyDates.launchStart && keyDates.cartOpen && keyDates.cartClose
  const warmupDays = daysBetween(keyDates.launchStart, keyDates.cartOpen)
  const cartDays = daysBetween(keyDates.cartOpen, keyDates.cartClose)
  const cartOpenBeforeStart = allDatesFilled && warmupDays !== null && warmupDays <= 0
  const cartCloseBeforeOpen = allDatesFilled && cartDays !== null && cartDays <= 0
  const datesInOrder = !cartOpenBeforeStart && !cartCloseBeforeOpen
  const canBuild = allDatesFilled && datesInOrder

  return (
    <div style={styles.page}>
      <div style={styles.container}>

        {/* ── Wordmark ── */}
        <div style={styles.wordmarkRow}>
          {onBack && (
            <button style={styles.backLink} onClick={onBack}>{editMode ? '← Cancel' : '← Clients'}</button>
          )}
          <span style={styles.wordGet}>GET</span>
          <span style={styles.wordVolume}> VOLUME</span>
          <div style={styles.wordSub}>LAUNCH DASHBOARD</div>
        </div>

        {/* ── Step indicator ── */}
        <div style={styles.stepRow}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={styles.stepItem}>
              <div style={{
                ...styles.stepDot,
                background: s < step ? T.mint : s === step ? T.purple : T.light,
                border: `1px solid ${s < step ? T.mintDark : s === step ? T.purpleDark : T.light}`,
                boxShadow: s === step ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                color: s <= step ? T.indigo : T.muted,
              }}>
                {s < step ? '✓' : s}
              </div>
              <span style={{
                ...styles.stepLabel,
                color: s === step ? T.indigo : T.muted,
                fontWeight: s === step ? 700 : 400,
              }}>
                {STEP_LABELS[s - 1]}
              </span>
            </div>
          ))}
          <div style={styles.stepLine} />
        </div>

        {/* ── STEP 1: Choose template ── */}
        {step === 1 && (
          <div style={styles.stepContent}>
            <h1 style={styles.heading}>What type of launch are you running?</h1>
            <p style={styles.subheading}>
              Choose the framework that matches your strategy. You can run both types — just
              set up a new plan for each launch.
            </p>

            <div style={styles.templateGrid}>
              {TEMPLATES.map((t, i) => {
                const pc = PHASE_COLORS[i % PHASE_COLORS.length]
                return (
                  <button
                    key={t.id}
                    style={{ ...styles.templateCard, ...winCard(pc.color, pc.dark), borderRadius: 10 }}
                    onClick={() => handleTemplateSelect(t)}
                  >
                    <div style={{ ...winTitleBar(pc.color), marginBottom: 0 }}>
                      <span>{t.id === 'alpha' ? 'Alpha' : 'Arena'}</span>
                      <span style={{ opacity: 0.6, letterSpacing: 4 }}>_ □ ×</span>
                    </div>
                    <div style={styles.templateCardBody}>
                      <div style={styles.templateName}>{t.name}</div>
                      <div style={{ ...styles.templateTagline, color: pc.color }}>{t.tagline}</div>
                      <p style={styles.templateDesc}>{t.description}</p>

                      <div style={styles.templateFeatures}>
                        {t.id === 'alpha' ? (
                          <>
                            <div style={styles.feature}>→ Offer clarity + simple sales page</div>
                            <div style={styles.feature}>→ 14 days building your waitlist</div>
                            <div style={styles.feature}>→ 14 days nurturing and selling</div>
                            <div style={styles.feature}>→ Daily email + social generated for you</div>
                          </>
                        ) : (
                          <>
                            <div style={styles.feature}>→ Lead magnet + list growth sprint</div>
                            <div style={styles.feature}>→ Live conversion event</div>
                            <div style={styles.feature}>→ Cart open / cart close sequence</div>
                            <div style={styles.feature}>→ Key copy templates generated for you</div>
                          </>
                        )}
                      </div>

                      <div style={{
                        background: pc.color,
                        border: `1px solid ${pc.dark}`,
                        boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                        borderRadius: 8,
                        padding: '10px 20px',
                        color: T.indigo,
                        fontFamily: T.body,
                        fontSize: 13,
                        fontWeight: 700,
                        textAlign: 'center',
                        marginTop: 'auto',
                      }}>
                        Choose {t.name} →
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {/* ── STEP 2: Offer Clarity Template ── */}
        {step === 2 && (
          <div style={styles.stepContent}>
            <h1 style={styles.heading}>Build your Offer Clarity Template</h1>
            <p style={styles.subheading}>
              Work through each section to crystallise your offer. These answers feed directly
              into every task, email, and content template in your plan.
            </p>

            {/* Essentials block */}
            <div style={styles.octBlock}>
              <div style={styles.octBlockHeader}>
                <span style={styles.octNum}>★</span>
                <div>
                  <div style={styles.octTitle}>The basics</div>
                  <div style={styles.octContext}>Your name, offer name, and investment — the details that appear throughout your launch plan.</div>
                </div>
              </div>
              <div style={styles.formGrid}>
                {OCT_ESSENTIALS.map((field) => (
                  <OfferField
                    key={field.key}
                    field={field}
                    value={offerDetails[field.key] || ''}
                    onChange={(v) => updateOffer(field.key, v)}
                    isRequired={REQUIRED_OFFER_FIELDS.includes(field.key)}
                  />
                ))}
              </div>
            </div>

            {/* OCT Sections 1–12 */}
            {OCT_SECTIONS.map((section) => (
              <div key={section.number}>
                {selectedTemplate?.id === 'arena' && section.number === 7 && (
                  <div style={{ ...styles.octBlock, border: `1px solid ${T.blue}`, boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
                    <div style={styles.octBlockHeader}>
                      <span style={{ ...styles.octNum, background: T.blue }}>Arena</span>
                      <div>
                        <div style={styles.octTitle}>Lead magnet & live event</div>
                        <div style={styles.octContext}>
                          Your Arena launch uses a free resource to grow your list and a live event to convert.
                        </div>
                      </div>
                    </div>
                    <div style={styles.formGrid}>
                      {OCT_ARENA_EXTRAS.map((field) => (
                        <OfferField
                          key={field.key}
                          field={field}
                          value={offerDetails[field.key] || ''}
                          onChange={(v) => updateOffer(field.key, v)}
                          isRequired={false}
                          wide
                        />
                      ))}
                    </div>
                  </div>
                )}

                <div style={styles.octBlock}>
                  <div style={styles.octBlockHeader}>
                    <span style={styles.octNum}>{section.number}</span>
                    <div>
                      <div style={styles.octTitle}>{section.title}</div>
                      <div style={styles.octContext}>{section.context}</div>
                    </div>
                  </div>
                  <div style={styles.templatePreview}>
                    <span style={styles.previewLabel}>Template → </span>
                    {section.templateText}
                  </div>
                  <div style={styles.sectionFields}>
                    {section.fields.map((field) => (
                      <OfferField
                        key={field.key}
                        field={field}
                        value={offerDetails[field.key] || ''}
                        onChange={(v) => updateOffer(field.key, v)}
                        isRequired={REQUIRED_OFFER_FIELDS.includes(field.key)}
                        wide
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}

            <div style={styles.stepActions}>
              <button style={styles.backBtn} onClick={() => editMode ? onBack?.() : goToStep(1)}>← Back</button>
              <button
                style={{
                  ...styles.nextBtn,
                  opacity: canProceedStep2 ? 1 : 0.4,
                  cursor: canProceedStep2 ? 'pointer' : 'not-allowed',
                }}
                onClick={canProceedStep2 ? () => goToStep(3) : undefined}
              >
                Next: Your Messaging →
              </button>
            </div>
            {!canProceedStep2 && (
              <p style={styles.requiredNote}>
                * Your name, programme name, ideal client, and transformation are required.
              </p>
            )}
          </div>
        )}

        {/* ── STEP 3: Messaging Codex ── */}
        {step === 3 && (
          <div style={styles.stepContent}>
            <h1 style={styles.heading}>Your Messaging Codex</h1>
            <p style={styles.subheading}>
              The building blocks of every email and social post in your plan. Hit Generate — Claude writes all 13 fields from your offer details, then you edit anything that needs your voice.
            </p>

            {/* AI Generate banner */}
            <div style={{ ...winCard(T.purple, T.purpleDark), marginBottom: 28 }}>
              <div style={winTitleBar(T.purple)}>
                <span>✦ GENERATE WITH AI</span>
                <span style={{ opacity: 0.5, letterSpacing: 3 }}>_ □ ×</span>
              </div>
              <div style={{ padding: '16px 20px' }}>
                <p style={{ fontFamily: T.body, fontSize: 13, color: T.muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Claude will write all 13 messaging fields from your offer details — the hook, problem, agitation, reframe, mechanism, proof, and close. Everything feeds directly into your content generation.
                </p>

                {/* Success flash */}
                {codexJustGenerated && (
                  <div style={{ fontFamily: T.body, fontSize: 12, color: '#166534', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                    ✦ 13 fields generated — review below and edit anything that needs your voice.
                  </div>
                )}

                {/* Error state */}
                {codexError && !codexJustGenerated && (
                  <div style={{ fontFamily: T.body, fontSize: 12, color: '#b91c1c', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '8px 12px', marginBottom: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span>Something went wrong — please try again.</span>
                      <button
                        onClick={handleGenerateCodex}
                        style={{ background: 'none', border: '1px solid #fecaca', borderRadius: 6, padding: '2px 8px', fontSize: 11, cursor: 'pointer', color: '#b91c1c', fontFamily: T.body }}
                      >Retry ↻</button>
                      <button
                        onClick={() => setShowErrorDetail((v) => !v)}
                        style={{ background: 'none', border: 'none', fontSize: 11, cursor: 'pointer', color: '#b91c1c', fontFamily: T.body, textDecoration: 'underline' }}
                      >{showErrorDetail ? 'Hide details' : 'Details ▾'}</button>
                    </div>
                    {showErrorDetail && (
                      <div style={{ marginTop: 6, color: '#991b1b', fontFamily: 'monospace', fontSize: 11, whiteSpace: 'pre-wrap' }}>{codexError}</div>
                    )}
                  </div>
                )}

                {/* Confirm regen banner */}
                {confirmRegen ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, background: `${T.yellow}30`, border: `1px solid ${T.yellowDark}`, borderRadius: 8, padding: '10px 14px', marginBottom: 4 }}>
                    <span style={{ fontFamily: T.body, fontSize: 12, color: T.indigo, flex: 1 }}>
                      This will overwrite your edits — are you sure?
                    </span>
                    <button
                      onClick={handleGenerateCodex}
                      style={{ background: T.yellow, border: `1px solid ${T.yellowDark}`, borderRadius: 6, padding: '5px 12px', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: T.body, color: T.indigo }}
                    >Yes, regenerate</button>
                    <button
                      onClick={() => setConfirmRegen(false)}
                      style={{ background: 'none', border: '1px solid #D1D5DB', borderRadius: 6, padding: '5px 12px', fontSize: 12, cursor: 'pointer', fontFamily: T.body, color: T.muted }}
                    >Cancel</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <button
                      style={{
                        background: codexGenerating ? T.light : T.purple,
                        border: `1px solid ${T.purpleDark}`,
                        boxShadow: codexGenerating ? 'none' : '0 1px 2px rgba(0,0,0,0.06)',
                        borderRadius: 8,
                        color: T.indigo,
                        fontFamily: T.body,
                        fontWeight: 700,
                        fontSize: 13,
                        padding: '9px 20px',
                        cursor: codexGenerating ? 'not-allowed' : 'pointer',
                        opacity: codexGenerating ? 0.7 : 1,
                        transition: 'all 0.1s ease',
                      }}
                      onClick={handleRegenClick}
                      disabled={codexGenerating}
                    >
                      {codexGenerating
                        ? '✦ Generating...'
                        : codexGenerated
                        ? '✦ Regenerate'
                        : '✦ Generate all 13 fields'}
                    </button>
                    <span style={{ fontFamily: T.body, fontSize: 12, color: T.muted }}>
                      {codexGenerating ? 'This takes about 10 seconds…' : 'Takes ~10 seconds · edit freely after'}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {MESSAGING_CODEX_SECTIONS.map((section) => (
              !codexGenerated ? (
                /* Locked placeholder — shown before AI generates */
                <div key={section.title} style={styles.codexLockCard}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ ...styles.octTitle, marginBottom: 4 }}>{section.title}</div>
                      <div style={{ ...styles.octContext, marginBottom: 12 }}>{section.subtitle}</div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                        {section.fields.map((f) => (
                          <span key={f.key} style={styles.codexLockPill}>{f.label}</span>
                        ))}
                      </div>
                    </div>
                    <span style={{ fontSize: 18, opacity: 0.35 }}>🔒</span>
                  </div>
                </div>
              ) : (
                /* Unlocked editable fields — shown after generation */
                <div key={section.title} style={styles.octBlock}>
                  <div style={styles.octBlockHeader}>
                    <div>
                      <div style={styles.octTitle}>{section.title}</div>
                      <div style={styles.octContext}>{section.subtitle}</div>
                    </div>
                  </div>
                  <div style={styles.codexFields}>
                    {section.fields.map((field) => (
                      <div key={field.key} style={styles.codexField}>
                        <label style={styles.fieldLabel}>{field.label}</label>
                        <p style={styles.codexDesc}>{field.description}</p>
                        {field.textarea ? (
                          <textarea
                            style={{ ...styles.fieldInput, ...styles.fieldTextarea }}
                            placeholder={field.placeholder}
                            value={messagingCodex[field.key] || ''}
                            onChange={(e) => updateMessaging(field.key, e.target.value)}
                            rows={3}
                          />
                        ) : (
                          <input
                            style={styles.fieldInput}
                            type="text"
                            placeholder={field.placeholder}
                            value={messagingCodex[field.key] || ''}
                            onChange={(e) => updateMessaging(field.key, e.target.value)}
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            ))}

            <div style={styles.stepActions}>
              <button style={styles.backBtn} onClick={() => goToStep(2)}>← Back</button>
              {editMode ? (
                <button style={styles.buildBtn} onClick={handleBuild}>
                  Save changes ✦
                </button>
              ) : (
                <button style={styles.nextBtn} onClick={() => goToStep(4)}>
                  Next: Set your dates →
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── STEP 4: Key dates ── */}
        {step === 4 && selectedTemplate && (
          <div style={styles.stepContent}>
            <h1 style={styles.heading}>Set your key dates</h1>
            <p style={styles.subheading}>
              Every task in your plan will automatically get a due date based on these three milestones.
            </p>
            <p style={styles.dateGuidance}>
              Typical warm-up: 21–42 days · Typical cart window: 7–14 days
            </p>

            <div style={styles.datesGrid}>
              {Object.entries(selectedTemplate.keyDateLabels).map(([key, meta], i) => {
                const pc = PHASE_COLORS[i % PHASE_COLORS.length]
                const warning =
                  (key === 'cartOpen' && cartOpenBeforeStart)
                    ? '⚠ Cart open should come after launch start'
                    : (key === 'cartClose' && cartCloseBeforeOpen)
                    ? '⚠ Cart close should come after cart open'
                    : null
                return (
                  <div key={key} style={{ ...winCard(pc.color, pc.dark), overflow: 'visible' }}>
                    <div style={winTitleBar(pc.color)}>
                      <span>{meta.label}</span>
                      <span style={{ opacity: 0.5, letterSpacing: 3 }}>_ □ ×</span>
                    </div>
                    <div style={{ padding: '14px 16px' }}>
                      <p style={styles.dateHint}>{meta.description}</p>
                      <input
                        type="date"
                        style={{ ...styles.dateInput, borderColor: warning ? '#fca5a5' : undefined }}
                        value={keyDates[key]}
                        onChange={(e) => setKeyDates((prev) => ({ ...prev, [key]: e.target.value }))}
                      />
                      {warning && (
                        <p style={{ fontFamily: T.body, fontSize: 11, color: '#b91c1c', marginTop: 6, marginBottom: 0 }}>{warning}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Spread chips */}
            {allDatesFilled && (
              <div style={{ display: 'flex', gap: 12, marginTop: 16, marginBottom: 4 }}>
                <SpreadChip
                  label="Warm-up"
                  days={warmupDays}
                  min={14}
                  recommendedMin={21}
                  recommendedMax={42}
                />
                <SpreadChip
                  label="Cart window"
                  days={cartDays}
                  min={5}
                  recommendedMin={7}
                  recommendedMax={14}
                />
              </div>
            )}

            <div style={styles.stepActions}>
              <button style={styles.backBtn} onClick={() => goToStep(3)}>← Back</button>
              <button
                style={{
                  ...styles.buildBtn,
                  opacity: canBuild ? 1 : 0.4,
                  cursor: canBuild ? 'pointer' : 'not-allowed',
                }}
                onClick={canBuild ? handleBuild : undefined}
              >
                Build my launch plan ✦
              </button>
            </div>
            {!canBuild && (
              <p style={styles.requiredNote}>
                {!allDatesFilled
                  ? 'Set all three dates to continue.'
                  : 'Fix date order to continue.'}
              </p>
            )}
          </div>
        )}

      </div>
    </div>
  )
}

// ─── SpreadChip sub-component ───────────────────────────────────────────────

function SpreadChip({ label, days, min, recommendedMin, recommendedMax }) {
  if (days === null || days === undefined) return null
  const isNegative = days <= 0
  const isTooShort = days > 0 && days < min
  const isAmber = days >= min && days < recommendedMin
  const isGreen = days >= recommendedMin && days <= recommendedMax

  const bg = isNegative ? '#fef2f2'
    : isTooShort ? '#fef2f2'
    : isAmber ? '#fffbeb'
    : isGreen ? '#f0fdf4'
    : '#fffbeb'
  const color = isNegative || isTooShort ? '#b91c1c'
    : isAmber ? '#92400e'
    : isGreen ? '#166534'
    : '#92400e'
  const border = isNegative || isTooShort ? '#fecaca'
    : isAmber ? '#fde68a'
    : isGreen ? '#bbf7d0'
    : '#fde68a'

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      background: bg, border: `1px solid ${border}`, borderRadius: 20,
      padding: '4px 12px',
      fontFamily: T.body, fontSize: 12, color,
    }}>
      <span style={{ fontWeight: 600 }}>{label}:</span>
      <span style={{ fontWeight: 700 }}>{days} days</span>
      <span style={{ opacity: 0.65, fontSize: 11 }}>({recommendedMin}–{recommendedMax} typical)</span>
    </div>
  )
}

// ─── Offer field sub-component ──────────────────────────────────────────────

function OfferField({ field, value, onChange, isRequired, wide }) {
  return (
    <div style={{
      ...styles.formField,
      gridColumn: wide || field.wide ? 'span 2' : 'span 1',
    }}>
      <label style={styles.fieldLabel}>
        {field.label}
        {isRequired && <span style={styles.required}> *</span>}
      </label>
      {field.textarea ? (
        <textarea
          style={{ ...styles.fieldInput, ...styles.fieldTextarea }}
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
        />
      ) : (
        <input
          style={styles.fieldInput}
          type="text"
          placeholder={field.placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
      {field.hint && <div style={styles.fieldHint}>{field.hint}</div>}
    </div>
  )
}

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = {
  page: {
    minHeight: '100vh',
    background: T.pageBg,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingTop: 48,
    paddingBottom: 80,
  },
  container: {
    width: '100%',
    maxWidth: 860,
    padding: '0 24px',
  },
  wordmarkRow: {
    textAlign: 'center',
    marginBottom: 40,
    position: 'relative',
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    lineHeight: 1.8,
  },
  backLink: {
    position: 'absolute',
    left: 0,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    color: T.muted,
    fontSize: 12,
    fontFamily: T.body,
    fontWeight: 600,
    cursor: 'pointer',
    padding: 0,
  },
  wordGet: {
    color: T.pink,
    fontSize: 22,
  },
  wordVolume: {
    color: T.blue,
    fontSize: 22,
  },
  wordSub: {
    fontFamily: T.body,
    fontWeight: 700,
    fontSize: '10px',
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.purple,
    marginTop: 8,
  },

  // Step indicator
  stepRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    marginBottom: 48,
    position: 'relative',
  },
  stepItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
    zIndex: 1,
    padding: '0 20px',
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    transition: 'all 0.2s ease',
  },
  stepLabel: {
    fontFamily: T.body,
    fontSize: 11,
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
  },
  stepLine: {
    position: 'absolute',
    top: 16,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '65%',
    height: 2,
    background: T.light,
    zIndex: 0,
    borderTop: `2px dotted ${T.light}`,
  },
  stepContent: {},
  heading: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    color: T.indigo,
    marginBottom: 14,
    textAlign: 'center',
    lineHeight: 1.8,
  },
  subheading: {
    fontFamily: T.body,
    fontSize: 14,
    color: T.muted,
    lineHeight: 1.6,
    textAlign: 'center',
    maxWidth: 620,
    margin: '0 auto 40px',
  },

  // Template step
  templateGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
    gap: 24,
  },
  templateCard: {
    textAlign: 'left',
    cursor: 'pointer',
    fontFamily: T.body,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    padding: 0,
  },
  templateCardBody: {
    padding: '20px 22px 22px',
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    flex: 1,
  },
  templateName: {
    fontFamily: T.body,
    fontSize: 20,
    fontWeight: 800,
    color: T.indigo,
    marginBottom: 4,
  },
  templateTagline: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 10,
  },
  templateDesc: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.6,
    marginBottom: 18,
  },
  templateFeatures: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
    marginBottom: 20,
  },
  feature: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.indigo,
    fontWeight: 500,
  },

  // OCT blocks
  octBlock: {
    background: T.cardBg,
    borderRadius: 8,
    border: `1px solid ${T.light}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '20px 22px 18px',
    marginBottom: 16,
  },
  octBlockHeader: {
    display: 'flex',
    gap: 14,
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  octNum: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    borderRadius: 8,
    background: T.purple,
    border: `1px solid ${T.purpleDark}`,
    color: T.indigo,
    fontFamily: T.body,
    fontSize: '10px',
    fontWeight: 700,
    letterSpacing: '0.07em',
    textTransform: 'uppercase',
    flexShrink: 0,
    marginTop: 2,
  },
  octTitle: {
    fontFamily: T.body,
    fontSize: 15,
    fontWeight: 800,
    color: T.indigo,
    marginBottom: 4,
  },
  octContext: {
    fontFamily: T.body,
    fontSize: 13,
    color: T.muted,
    lineHeight: 1.6,
  },
  templatePreview: {
    background: T.pendingBg,
    borderRadius: 8,
    border: `1.5px dotted ${T.purple}`,
    padding: '10px 14px',
    fontSize: 13,
    fontFamily: T.body,
    color: T.indigo,
    lineHeight: 1.6,
    marginBottom: 16,
    fontStyle: 'italic',
    opacity: 0.9,
  },
  previewLabel: {
    fontStyle: 'normal',
    fontFamily: T.body,
    fontWeight: 700,
    color: T.purpleDark,
    fontSize: '10px',
    textTransform: 'uppercase',
    letterSpacing: '0.07em',
  },
  sectionFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  // Form grid
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '16px 20px',
  },
  formField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  fieldLabel: {
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 700,
    color: T.indigo,
  },
  required: { color: T.pinkDark },
  fieldInput: {
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    fontFamily: T.body,
    color: T.indigo,
    background: T.insetBg,
    outline: 'none',
    transition: 'border-color 0.15s ease',
    width: '100%',
    boxSizing: 'border-box',
  },
  fieldTextarea: {
    resize: 'vertical',
    lineHeight: 1.5,
  },
  fieldHint: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.4,
  },

  // Messaging Codex fields
  codexFields: {
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
  },
  codexField: {
    display: 'flex',
    flexDirection: 'column',
    gap: 5,
  },
  codexDesc: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.5,
    marginBottom: 4,
  },

  // Dates step
  datesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
    gap: 20,
    marginBottom: 36,
  },
  dateHint: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    lineHeight: 1.5,
    marginBottom: 10,
  },
  dateInput: {
    border: `1px solid ${T.light}`,
    borderRadius: 8,
    padding: '9px 12px',
    fontSize: 13,
    fontFamily: T.body,
    color: T.indigo,
    background: T.insetBg,
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    cursor: 'pointer',
  },

  // Nav buttons
  stepActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
    marginTop: 28,
  },
  backBtn: {
    background: 'none',
    border: 'none',
    color: T.muted,
    fontFamily: T.body,
    fontSize: 13,
    fontWeight: 600,
    cursor: 'pointer',
    padding: '10px 0',
  },
  nextBtn: {
    background: T.blue,
    color: T.indigo,
    border: `1px solid ${T.blueDark}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderRadius: 8,
    padding: '12px 24px',
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    transition: 'opacity 0.15s ease',
    cursor: 'pointer',
  },
  buildBtn: {
    background: T.pink,
    color: T.indigo,
    border: `1px solid ${T.pinkDark}`,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    borderRadius: 8,
    padding: '13px 28px',
    fontFamily: T.body,
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '0.02em',
    transition: 'opacity 0.15s ease',
    cursor: 'pointer',
  },
  requiredNote: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    textAlign: 'center',
    marginTop: 12,
  },

  // Messaging Codex locked state
  codexLockCard: {
    background: T.pageBg,
    border: `1px solid ${T.border}`,
    borderRadius: 10,
    padding: '18px 20px',
    marginBottom: 12,
    opacity: 0.65,
  },
  codexLockPill: {
    fontFamily: T.body,
    fontSize: 11,
    fontWeight: 600,
    color: T.muted,
    background: '#FFFFFF',
    border: `1px solid ${T.border}`,
    borderRadius: 20,
    padding: '3px 10px',
    letterSpacing: '0.03em',
  },

  // Date spread guidance
  dateGuidance: {
    fontFamily: T.body,
    fontSize: 12,
    color: T.muted,
    textAlign: 'center',
    marginTop: -28,
    marginBottom: 28,
    letterSpacing: '0.02em',
  },
}
