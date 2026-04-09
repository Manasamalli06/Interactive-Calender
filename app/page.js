'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'

// ─── Constants ─────────────────────────────────────────────────────────────────
const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]
const DAY_HEADERS = ['MON','TUE','WED','THU','FRI','SAT','SUN']

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1455659817273-f96807779a8a?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1457269449834-928af64c684d?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1416339684178-3a239570f315?w=1400&h=600&fit=crop&crop=center',
  'https://images.unsplash.com/photo-1482442120256-9c03866de390?w=1400&h=600&fit=crop&crop=center',
]

const EDITORS_NOTES = [
  'A new year unfolds — clarity begins in the blank page. Set your vision, then your actions.',
  'February invites depth. The quietest month rewards the most attentive observer.',
  'March arrives with momentum. Let the thaw inform your creative process.',
  'The transition into warmer light brings a fresh perspective. Focus on renewal — not just what is budding, but the space to grow.',
  'May is permission to bloom. Every project deserves sunlight this month.',
  'June sharpens contrast. Notice what the longer days reveal that was hidden before.',
  'Midsummer is the time of abundance. Curate ruthlessly — not everything deserves space.',
  'August carries weight. The year is more than half-written; revise with intention.',
  'Autumn begins its edit. Let go of what no longer serves the narrative.',
  'October is the dramatic arc. Lean into transitions, not away from them.',
  'The transition into colder light brings new perspective. Focus on the architecture of time.',
  'December: the year becomes a page to turn. What story did you choose to tell?'
]

const FOCUS_WORDS = [
  'Intention','Depth','Momentum','Clarity','Growth','Discovery',
  'Abundance','Revision','Release','Transition','Architecture','Reflection'
]

// ─── Utility functions ─────────────────────────────────────────────────────────
function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
function getStartDay(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }
function sameDay(a, b) { return a && b && a.toDateString() === b.toDateString() }
function fmtDate(d) { return d ? `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}, ${d.getFullYear()}` : '' }
function fmtShort(d) { return d ? `${MONTH_NAMES[d.getMonth()].slice(0,3)} ${d.getDate()}` : '' }
function daysBetween(a, b) { return a && b ? Math.round(Math.abs(b - a) / 86400000) + 1 : 0 }

// ─── SVG Icon components ───────────────────────────────────────────────────────
const Icon = {
  Grid: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
  Clipboard: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>,
  Star: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Book: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>,
  Plus: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  ChevL: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>,
  ChevR: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
  Cal: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>,
  Trash: () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>,
  CirclePlus: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>,
  StarFill: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: <Icon.Grid /> },
  { id: 'planning', label: 'Planning', icon: <Icon.Clipboard /> },
  { id: 'mood', label: 'Mood', icon: <Icon.Star /> },
  { id: 'reflections', label: 'Reflections', icon: <Icon.Book /> },
]

// ─── Main Component ────────────────────────────────────────────────────────────
export default function CalendarApp() {
  const [mounted, setMounted] = useState(false)
  const [clockStr, setClockStr] = useState('')
  const [dateStr, setDateStr] = useState('')
  const [today, setToday] = useState(null)

  const [viewYear, setViewYear] = useState(2026)
  const [viewMonth, setViewMonth] = useState(new Date().getMonth())

  const [rangeStart, setRangeStart] = useState(null)
  const [rangeEnd, setRangeEnd] = useState(null)
  const [hoverDate, setHoverDate] = useState(null)
  const [memos, setMemos] = useState({})
  const [showForm, setShowForm] = useState(false)
  const [formLabel, setFormLabel] = useState('')
  const [formText, setFormText] = useState('')
  const [activeNav, setActiveNav] = useState('planning')
  const [toast, setToast] = useState(null)

  useEffect(() => {
    const now = new Date()
    setToday(now)
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    setMounted(true)

    const tick = () => {
      const n = new Date()
      setToday(n)
      setClockStr(n.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true }))
      setDateStr(n.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const [booms, setBooms] = useState({})

  const triggerBoom = useCallback((id) => {
    setBooms(prev => ({ ...prev, [id]: true }))
    setTimeout(() => {
      setBooms(prev => ({ ...prev, [id]: false }))
    }, 600)
  }, [])

  useEffect(() => {
    try {
      const d = localStorage.getItem('chronos-memos')
      if (d) setMemos(JSON.parse(d))
    } catch (e) {}
  }, [])

  const memoKey = `${viewYear}-${viewMonth}`
  const defaultMemos = [
    { id: 1, label: `${MONTH_NAMES[viewMonth]} 5`, text: 'Monthly review & goal alignment session.' },
    { id: 2, label: `${MONTH_NAMES[viewMonth]} 12–18`, text: 'Strategy retreat and editorial audit. Finalize guidelines for the upcoming edition.' },
    { id: 3, label: `${MONTH_NAMES[viewMonth]} 22`, text: 'Team retrospective — asymmetrical thinking workshop.' },
  ]
  const currentMemos = memos[memoKey] ?? defaultMemos

  const persist = useCallback((key, list) => {
    setMemos(prev => {
      const next = { ...prev, [key]: list }
      try { localStorage.setItem('chronos-memos', JSON.stringify(next)) } catch (e) {}
      return next
    })
  }, [])

  const showToast = useCallback((msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }, [])

  const closeForm = useCallback(() => {
    setShowForm(false); setFormLabel(''); setFormText('')
  }, [])

  const addMemo = useCallback(() => {
    if (!formText.trim()) return
    const label = formLabel.trim() || `${MONTH_NAMES[viewMonth]} note`
    persist(memoKey, [{ id: Date.now(), label, text: formText.trim() }, ...currentMemos])
    closeForm()
    showToast('✓ Memo saved successfully')
  }, [formText, formLabel, viewMonth, memoKey, currentMemos, persist, closeForm, showToast])

  const deleteMemo = useCallback((id) => {
    persist(memoKey, currentMemos.filter(m => m.id !== id))
    showToast('Memo deleted')
  }, [memoKey, currentMemos, persist, showToast])

  const goMonth = useCallback((delta) => {
    setViewMonth(prev => {
      let m = prev + delta
      if (m < 0) { setViewYear(y => y - 1); return 11 }
      if (m > 11) { setViewYear(y => y + 1); return 0 }
      return m
    })
    setRangeStart(null); setRangeEnd(null)
  }, [])

  const goToday = useCallback(() => {
    if (!today) return
    setViewYear(today.getFullYear()); setViewMonth(today.getMonth())
    setRangeStart(null); setRangeEnd(null)
  }, [today])

  // Split view rendering
  if (!mounted) return null

  const isCurrentMonth = today ? (viewYear === today.getFullYear() && viewMonth === today.getMonth()) : true

  return (
    <div className="app-shell">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="sidebar">
        <div className="sidebar-brand"><p className="vol">Vol. {viewYear}</p></div>
        <nav className="sidebar-nav">
          {NAV_ITEMS.map(item => (
            <button key={item.id}
              className={`nav-item${activeNav === item.id ? ' active' : ''}`}
              onClick={() => setActiveNav(item.id)}
            >{item.icon}{item.label}</button>
          ))}
        </nav>
        <button className="nav-item" style={{ marginTop: 'auto', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 600 }}
          onClick={goToday} disabled={isCurrentMonth && activeNav === 'planning'}
        >
          <Icon.Cal /> {isCurrentMonth ? 'Active Month' : 'Return to Today'}
        </button>
        <div className="sidebar-footer">
          <button className="create-btn" onClick={() => setShowForm(true)}><Icon.Plus /> Create Entry</button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT AREA ══════════ */}
      <main className="main-content">
        
        {/* VIEW: OVERVIEW (Yearly Summary) */}
        {activeNav === 'overview' && (
          <div className="view-container overview-view fade-in">
            <header className="view-header">
              <h2 className="view-title">Editorial Overview</h2>
              <p className="view-subtitle">Full {viewYear} Volume Strategy</p>
            </header>
            <div className="overview-grid">
              {MONTH_NAMES.map((m, i) => (
                <div key={m} className={`overview-month-card ${viewMonth === i ? 'current' : ''} ${booms[`overview-${i}`] ? 'booming' : ''}`} 
                  onClick={(e) => { 
                    triggerBoom(`overview-${i}`);
                    setTimeout(() => { setViewMonth(i); setActiveNav('planning') }, 150);
                  }}>
                  <div className="month-card-img">
                    <Image src={HERO_IMAGES[i]} alt={m} fill style={{ objectFit: 'cover' }} sizes="300px" />
                    <div className="month-card-overlay"><span>{m.toUpperCase()}</span></div>
                  </div>
                  <div className="month-card-info">
                    <p className="month-card-name">{m}</p>
                    <p className="month-card-focus">{FOCUS_WORDS[i]}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VIEW: PLANNING (The Calendar) */}
        {activeNav === 'planning' && (
          <div className="view-container fade-in">
            <header className="view-header">
              <h2 className="view-title">Interactive Calendar</h2>
              <p className="view-subtitle">{MONTH_NAMES[viewMonth]} {viewYear} Planning & Scheduling</p>
            </header>

            <section className={`hero-section ${booms['hero'] ? 'booming' : ''}`} key={`hero-${viewMonth}`} onClick={() => triggerBoom('hero')}>
              <div className="image-reveal-wrapper">
                <Image src={HERO_IMAGES[viewMonth]} alt="Hero" fill style={{ objectFit: 'cover' }} priority sizes="80vw" className="hero-img" />
              </div>
              <div className="hero-overlay" /><div className="hero-content">
                <h1 className="hero-month">{MONTH_NAMES[viewMonth]}</h1>
                <p className="hero-year">{viewYear}</p>
                <p className="hero-clock">{clockStr}</p><p className="hero-date">{dateStr}</p>
              </div>
            </section>
            
            {rangeStart && (
              <div className="range-summary-bar">
                <div className="range-dates"><Icon.Cal />{rangeEnd ? <>{fmtShort(rangeStart)} → {fmtShort(rangeEnd)}</> : <>{fmtShort(rangeStart)} — selecting...</>}</div>
                {rangeEnd && <><span className="range-duration">{daysBetween(rangeStart, rangeEnd)} days</span><button className="range-clear-btn" onClick={() => { setRangeStart(null); setRangeEnd(null) }}>Clear ✕</button></>}
              </div>
            )}

            <div className="content-grid">
              <section className="calendar-section">
                <div className="calendar-header">
                  <span className="calendar-month-label">{MONTH_NAMES[viewMonth]} {viewYear}</span>
                  <div className="nav-arrows">
                    <button className="arrow-btn" onClick={() => goMonth(-1)}><Icon.ChevL /></button>
                    {!isCurrentMonth && <button className="arrow-btn today-pill" onClick={goToday}>Today</button>}
                    <button className="arrow-btn" onClick={() => goMonth(1)}><Icon.ChevR /></button>
                  </div>
                </div>
                <div className="calendar-grid">
                  {DAY_HEADERS.map(d => <div key={d} className="day-header">{d}</div>)}
                  {(() => {
                    const totalDays = getDaysInMonth(viewYear, viewMonth)
                    const startOffset = getStartDay(viewYear, viewMonth)
                    const prevDays = getDaysInMonth(viewMonth === 0 ? viewYear-1 : viewYear, viewMonth === 0 ? 11 : viewMonth-1)
                    const cells = []
                    for(let i=startOffset-1; i>=0; i--) cells.push({d:prevDays-i, c:false})
                    for(let d=1; d<=totalDays; d++) cells.push({d, c:true})
                    while(cells.length%7 !== 0) cells.push({d: (cells.length%7)+1, c:false})
                    
                    return cells.map((cell, i) => {
                      const dt = new Date(viewYear, viewMonth, cell.d)
                      const isToday = cell.c && today && sameDay(dt, today)
                      const isStart = cell.c && sameDay(dt, rangeStart)
                      const isEnd = cell.c && sameDay(dt, rangeEnd)
                      const effEnd = rangeEnd || (rangeStart && !rangeEnd && hoverDate ? hoverDate : null)
                      let inR = false
                      if (cell.c && rangeStart && effEnd) {
                        const lo = rangeStart < effEnd ? rangeStart : effEnd; const hi = rangeStart < effEnd ? effEnd : rangeStart
                        inR = dt > lo && dt < hi
                      }
                      return (
                        <div key={i} className={`day-cell ${cell.c?'current-month':''} ${isToday?'today':''} ${isStart?'range-start':''} ${isEnd?'range-end':''} ${inR?'in-range':''}`}
                          onClick={() => { if(cell.c) {
                            if(!rangeStart || rangeEnd) { setRangeStart(dt); setRangeEnd(null) }
                            else if(sameDay(dt, rangeStart)) setRangeStart(null)
                            else if(dt < rangeStart) { setRangeEnd(rangeStart); setRangeStart(dt) }
                            else setRangeEnd(dt)
                          }}}
                          onMouseEnter={() => { if(rangeStart && !rangeEnd && cell.c) setHoverDate(dt) }}
                          onMouseLeave={() => setHoverDate(null)}
                        ><span className="day-number">{cell.d}</span></div>
                      )
                    })
                  })()}
                </div>
              </section>

              <aside className="editorial-stack">
                <div className="card">
                  <h3 className="card-title">Editor&apos;s Note</h3>
                  <p className="editors-note-text">&ldquo;{EDITORS_NOTES[viewMonth]}&rdquo;</p>
                  <div className="focus-badge"><Icon.StarFill />Focus: {FOCUS_WORDS[viewMonth]}</div>
                </div>
                <div className="card memos-card">
                  <h3 className="card-title">Monthly Memos</h3>
                  {currentMemos.map(memo => (
                    <div className="memo-item" key={memo.id}>
                      <span className="memo-date-label">{memo.label}</span><p className="memo-text">{memo.text}</p>
                      <button className="memo-delete-btn" onClick={() => deleteMemo(memo.id)}><Icon.Trash /> Delete</button>
                    </div>
                  ))}
                  <button className="add-reflection-btn" onClick={() => setShowForm(true)}><Icon.CirclePlus /> Add Reflection</button>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* VIEW: MOOD (Visual Strategy) */}
        {activeNav === 'mood' && (
          <div className="view-container mood-view fade-in">
            <header className="view-header">
              <h1 className="mood-big-word">{FOCUS_WORDS[viewMonth]}</h1>
              <p className="view-subtitle">{MONTH_NAMES[viewMonth]} Visual Direction</p>
            </header>
            <div className={`mood-board ${booms['mood'] ? 'booming' : ''}`} key={`mood-${viewMonth}`} onClick={() => triggerBoom('mood')}>
              <div className="mood-main-img">
                <div className="image-reveal-wrapper">
                  <Image src={HERO_IMAGES[viewMonth]} alt="Primary Mood" fill style={{ objectFit: 'cover' }} className="hero-img" />
                </div>
              </div>
              <div className="mood-color-palette">
                <div className="palette-strip" style={{ background: 'var(--primary)' }}><span>#0052FF</span></div>
                <div className="palette-strip" style={{ background: '#F0F4FF' }}><span style={{ color: 'var(--primary)' }}>#F0F4FF</span></div>
                <div className="palette-strip" style={{ background: '#1A1A1A' }}><span>#1A1A1A</span></div>
              </div>
              <div className="mood-descriptors">
                <div className="descriptor-card"><h3>Typography</h3><p>Newsreader Italic & Manrope Bold</p></div>
                <div className="descriptor-card"><h3>Aesthetic</h3><p>Physical, Editorial, High-Contrast</p></div>
                <div className="descriptor-card"><h3>Note</h3><p>{EDITORS_NOTES[viewMonth]}</p></div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: REFLECTIONS (Journal) */}
        {activeNav === 'reflections' && (
          <div className="view-container reflections-view fade-in">
            <header className="view-header">
              <h2 className="view-title">{MONTH_NAMES[viewMonth]} Reflections</h2>
              <p className="view-subtitle">The Editorial Journal</p>
            </header>
            <div className="journal-layout">
              {currentMemos.length === 0 ? (
                <div className="empty-journal"><p>No reflections recorded for this edition yet.</p><button onClick={() => setShowForm(true)}>Start Entry</button></div>
              ) : (
                currentMemos.map(memo => (
                   <article key={memo.id} className="journal-entry">
                     <div className="journal-meta">
                       <span className="journal-date">{memo.label}</span>
                       <button className="journal-delete" onClick={() => deleteMemo(memo.id)}>Delete</button>
                     </div>
                     <div className="journal-body">{memo.text}</div>
                   </article>
                ))
              )}
            </div>
          </div>
        )}

      </main>

      {/* ══════════ MODAL ══════════ */}
      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Entry</h2>
              <button className="modal-close" onClick={closeForm}><Icon.Close /></button>
            </div>
            <p className="modal-subtitle">Add to {MONTH_NAMES[viewMonth]} {viewYear}</p>
            <div className="modal-form">
              <label className="modal-label">Date</label>
              <input className="modal-input" value={formLabel} onChange={e => setFormLabel(e.target.value)} autoFocus placeholder="e.g. October 15" />
              <label className="modal-label">Note</label>
              <textarea className="modal-textarea" value={formText} onChange={e => setFormText(e.target.value)} placeholder="Write here..." />
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeForm}>Cancel</button>
                <button className="btn-save" onClick={addMemo} disabled={!formText.trim()}>Save Entry</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  )
}
