'use client'
import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
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

const SEASONAL_THEMES = [
  { primary: '#4A90E2', glow: 'rgba(74,144,226,0.2)', bg: '#f8fbff' }, // Jan (Softer Blue)
  { primary: '#ED64A6', glow: 'rgba(237,100,166,0.2)', bg: '#fffafb' }, // Feb (Softer Pink)
  { primary: '#48BB78', glow: 'rgba(72,187,120,0.2)', bg: '#f9fffb' }, // Mar (Fresh Green)
  { primary: '#63B3ED', glow: 'rgba(99,179,237,0.2)', bg: '#f7fcff' }, // Apr (Sky Blue)
  { primary: '#ECC94B', glow: 'rgba(236,201,75,0.2)', bg: '#fffdf5' }, // May (Golden)
  { primary: '#F6AD55', glow: 'rgba(246,173,85,0.2)', bg: '#fffbf5' }, // Jun (Warm Sun)
  { primary: '#4FD1C5', glow: 'rgba(79,209,197,0.2)', bg: '#f5fffe' }, // Jul (Teal/Ocean)
  { primary: '#9F7AEA', glow: 'rgba(159,122,234,0.2)', bg: '#fafbff' }, // Aug (Lavender)
  { primary: '#ED8936', glow: 'rgba(237,137,54,0.2)', bg: '#fffaf5' }, // Sep (Autumn)
  { primary: '#4A5568', glow: 'rgba(74,85,104,0.2)', bg: '#f7fafc' }, // Oct (Slate, not black)
  { primary: '#A0522D', glow: 'rgba(160,82,45,0.2)', bg: '#fffdfb' }, // Nov (Brown/Sienna)
  { primary: '#F56565', glow: 'rgba(245,101,101,0.2)', bg: '#fffafa' }  // Dec (Soft Red)
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
  CheckDouble: () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M7 13l3 3 7-7"/><path d="M2 11l3 3 7-7"/></svg>,
  StarFill: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  Edit: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  Close: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
  Settings: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
  Search: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  Download: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
  Moon: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>,
  Sun: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>,
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
  const [formTitle, setFormTitle] = useState('')
  const [formDate, setFormDate] = useState('')
  const [formText, setFormText] = useState('')
  const [activeNav, setActiveNav] = useState('planning')
  const [reflectionFilter, setReflectionFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [toast, setToast] = useState(null)
  const [editingMemoId, setEditingMemoId] = useState(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [glowIntensity, setGlowIntensity] = useState(0.4)
  const [userName, setUserName] = useState('Editor')
  const datePickerRef = useRef(null)

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

  const getMemosForMonth = useCallback((year, monthIndex) => {
    const key = `${year}-${monthIndex}`
    if (memos[key]) return memos[key]
    
    const mName = MONTH_NAMES[monthIndex]
    const mNum = (monthIndex + 1).toString().padStart(2, '0')
    return [
      { id: `def-${key}-1`, title: `${mName} Strategy`, date: `05/${mNum}/${year}`, text: `Monthly review & goal alignment session for ${mName}.` },
      { id: `def-${key}-2`, title: `${mName} Editorial Audit`, date: `15/${mNum}/${year}`, text: `Strategy retreat and audit for the ${mName} edition.` },
      { id: `def-${key}-3`, title: `${mName} Retrospective`, date: `22/${mNum}/${year}`, text: 'Team workshop and creative retro.' },
    ]
  }, [memos])

  const currentMemos = getMemosForMonth(viewYear, viewMonth)

  const allMemos = useMemo(() => {
    let all = []
    for(let i=0; i<12; i++) {
      all = [...all, ...getMemosForMonth(viewYear, i)]
    }
    return all
  }, [getMemosForMonth, viewYear])

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

  const isDatePassed = useCallback((dateStr) => {
    if (!dateStr || !today) return false
    const parts = dateStr.split('/')
    if (parts.length !== 3) return false
    const d = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]))
    // Set both to start of day for accurate comparison
    const compareDate = new Date(d.getFullYear(), d.getMonth(), d.getDate())
    const nowDate = new Date(today.getFullYear(), today.getMonth(), today.getDate())
    return compareDate < nowDate
  }, [today])

  useEffect(() => {
    if (!mounted || !today) return
    const keys = Object.keys(memos)
    let changed = false
    const nextMemos = { ...memos }

    keys.forEach(key => {
      const list = memos[key]
      const nextList = list.map(m => {
        if (!m.completed && !m.archived && isDatePassed(m.date)) {
          changed = true
          return { ...m, completed: true, autoCompleted: true }
        }
        return m
      })
      if (changed) nextMemos[key] = nextList
    })

    if (changed) {
      setMemos(nextMemos)
      try { localStorage.setItem('chronos-memos', JSON.stringify(nextMemos)) } catch (e) {}
    }
  }, [mounted, today, memos, isDatePassed])

  const openForm = useCallback(() => {
    const n = new Date()
    const dd = String(n.getDate()).padStart(2, '0')
    const mm = String(n.getMonth() + 1).padStart(2, '0')
    const yyyy = n.getFullYear()
    setFormDate(`${dd}/${mm}/${yyyy}`)
    setShowForm(true)
  }, [])

  const handleDatePickerChange = (e) => {
    const val = e.target.value // yyyy-mm-dd
    if (!val) return
    const [y, m, d] = val.split('-')
    setFormDate(`${d}/${m}/${y}`)
  }

  const openNativePicker = () => {
    if (datePickerRef.current) {
      if ('showPicker' in datePickerRef.current) {
        datePickerRef.current.showPicker()
      } else {
        datePickerRef.current.click()
      }
    }
  }

  const closeForm = useCallback(() => {
    setShowForm(false); setFormTitle(''); setFormDate(''); setFormText(''); setEditingMemoId(null)
  }, [])

  const startEdit = useCallback((memo) => {
    setFormTitle(memo.title || '')
    setFormDate(memo.date || memo.label || '')
    setFormText(memo.text || '')
    setEditingMemoId(memo.id)
    setShowForm(true)
  }, [])

  const toggleStar = useCallback((id) => {
    persist(memoKey, currentMemos.map(m => m.id === id ? { ...m, starred: !m.starred } : m))
  }, [memoKey, currentMemos, persist])

  const toggleComplete = useCallback((id) => {
    persist(memoKey, currentMemos.map(m => m.id === id ? { ...m, completed: !m.completed } : m))
    showToast('Entry status updated')
  }, [memoKey, currentMemos, persist, showToast])

  const toggleArchive = useCallback((id) => {
    persist(memoKey, currentMemos.map(m => m.id === id ? { ...m, archived: !m.archived } : m))
    showToast('Entry moved to archive')
  }, [memoKey, currentMemos, persist, showToast])

  const addMemo = useCallback(() => {
    if (!formText.trim()) return
    const title = formTitle.trim() || 'Untitled'
    const date = formDate.trim() || new Date().toLocaleDateString('en-GB')

    if (editingMemoId) {
      persist(memoKey, currentMemos.map(m => m.id === editingMemoId ? { ...m, title, date, text: formText.trim() } : m))
      showToast('✓ Entry updated')
    } else {
      persist(memoKey, [{ id: Date.now(), title, date, text: formText.trim(), starred: false, completed: false, archived: false }, ...currentMemos])
      showToast('✓ Entry saved successfully')
    }
    closeForm()
  }, [formText, formTitle, formDate, memoKey, currentMemos, editingMemoId, persist, closeForm, showToast])

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

  const exportData = useCallback(() => {
    const data = JSON.stringify(memos, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `editorial-roadmap-${viewYear}.json`
    a.click()
    showToast('Edition exported successfully')
  }, [memos, viewYear, showToast])

  const resetAll = useCallback(() => {
    if (confirm('Are you sure? This will delete all custom entries in this volume.')) {
      setMemos({})
      localStorage.removeItem('chronos-memos')
      showToast('System reset complete')
      setShowSettings(false)
    }
  }, [showToast])

  const filteredMemosList = useMemo(() => {
    // If searching, we look globally across the entire 12-month strategy
    const target = searchQuery.trim() ? allMemos : currentMemos
    if (!searchQuery.trim()) return target
    const q = searchQuery.toLowerCase()
    return target.filter(m => (
      m.title?.toLowerCase().includes(q) || 
      m.text?.toLowerCase().includes(q) || 
      m.date?.toLowerCase().includes(q)
    ))
  }, [searchQuery, allMemos, currentMemos])

  const filteredMemos = (unused_list) => {
    return filteredMemosList
  }

  if (!mounted) return null

  const theme = SEASONAL_THEMES[viewMonth]
  const isCurrentMonth = today ? (viewYear === today.getFullYear() && viewMonth === today.getMonth()) : true

  return (
    <div className={`app-shell ${darkMode ? 'dark-mode' : ''}`} style={{ 
      '--primary': theme.primary, 
      '--primary-glow': theme.glow, 
      '--primary-light': theme.bg,
      '--glow-opacity': glowIntensity
    }}>
      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="sidebar">
        <div className="sidebar-brand"><p className="vol">Interactive Calendar</p></div>
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
          <button className="create-btn" onClick={openForm}><Icon.Plus /> Create Entry</button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT AREA ══════════ */}
      <main className="main-content">
        
        {/* GLOBAL TOP HEADER */}
        <header className="global-top-header">
          <div className="header-identity">
            <h1 className="header-title">
              {activeNav === 'overview' ? 'Editorial Overview' : 
               activeNav === 'planning' ? `${MONTH_NAMES[viewMonth]} Planning` : 
               activeNav === 'mood' ? 'Visual Strategy' : 'Reflections & Journal'}
            </h1>
          </div>
          
          <div className="header-controls">
            <div className={`global-search-container ${isSearchOpen ? 'expanded' : ''}`}>
              {isSearchOpen ? (
                <div className="search-input-wrapper">
                  <Icon.Search />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Search entries..." 
                    value={searchQuery}
                    onBlur={() => { if(!searchQuery) setIsSearchOpen(false) }}
                    onChange={e => setSearchQuery(e.target.value)}
                  />
                  <button className="h-control-btn" onClick={() => { setSearchQuery(''); setIsSearchOpen(false) }}><Icon.Close /></button>
                </div>
              ) : (
                <button className="h-control-btn" onClick={() => setIsSearchOpen(true)} title="Search Strategy"><Icon.Search /></button>
              )}
            </div>

            <button className="h-control-btn" onClick={() => setShowSettings(true)} title="System Settings"><Icon.Settings /></button>

            <div className="header-nav">
              <button className="h-nav-btn" onClick={() => goMonth(-1)}><Icon.ChevL /></button>
              <button className="h-nav-pill" onClick={goToday}>Today</button>
              <button className="h-nav-btn" onClick={() => goMonth(1)}><Icon.ChevR /></button>
            </div>
          </div>
        </header>

        {/* VIEW: OVERVIEW (Yearly Summary) */}
        {activeNav === 'overview' && (
          <div className="view-container overview-view fade-in">
            <div className="view-header" style={{ marginBottom: '1.5rem' }}>
              <p className="view-subtitle">Full {viewYear} Volume Strategy</p>
            </div>
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
                  {filteredMemos(currentMemos).length === 0 && searchQuery && <p className="no-memos">No matches found.</p>}
                  {filteredMemos(currentMemos).map(memo => (
                    <div className={`memo-item ${memo.starred ? 'starred' : ''}`} key={memo.id}>
                      <div className="memo-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem' }}>
                        <div>
                          <span className="memo-date-label" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Icon.Cal /> {memo.date || memo.label}
                            {memo.starred && <span style={{ color: '#ECC94B', marginLeft: '4px' }}><Icon.StarFill /></span>}
                          </span>
                          <h4 className="memo-title">{memo.title || 'Untitled'}</h4>
                        </div>
                        <div className="memo-item-actions">
                          <button onClick={() => toggleStar(memo.id)} className={`action-circle ${memo.starred ? 'active' : ''}`} title="Important"><Icon.Star /></button>
                          <button onClick={() => toggleComplete(memo.id)} className={`action-circle ${memo.completed ? 'active-green' : ''}`} title="Completed"><Icon.CheckDouble /></button>
                          <button onClick={() => startEdit(memo)} className="action-circle"><Icon.Edit /></button>
                        </div>
                      </div>
                      <p className="memo-text">{memo.text}</p>
                      <div className="memo-footer" style={{ marginTop: '0.8rem', display: 'flex', gap: '1rem' }}>
                        <button className="memo-delete-btn" onClick={() => deleteMemo(memo.id)}><Icon.Trash /> Delete</button>
                      </div>
                    </div>
                  ))}
                  <button className="add-reflection-btn" onClick={openForm}><Icon.CirclePlus /> Add Reflection</button>
                </div>
              </aside>
            </div>
          </div>
        )}

        {/* VIEW: MOOD (Visual Strategy) */}
        {activeNav === 'mood' && (
          <div className="view-container mood-view fade-in">
            <div className="view-header" style={{ marginBottom: '1.5rem' }}>
              <p className="view-subtitle">{MONTH_NAMES[viewMonth]} Visual Direction</p>
            </div>
            <div className={`mood-board ${booms['mood'] ? 'booming' : ''}`} key={`mood-${viewMonth}`} onClick={() => triggerBoom('mood')}>
              <div className="mood-main-img">
                <div className="image-reveal-wrapper">
                  <Image src={HERO_IMAGES[viewMonth]} alt="Primary Mood" fill style={{ objectFit: 'cover' }} className="hero-img" />
                </div>
              </div>
              <div className="mood-color-palette">
                <div className="palette-strip" style={{ background: 'var(--primary)' }}><span>{SEASONAL_THEMES[viewMonth].primary}</span></div>
                <div className="palette-strip" style={{ background: SEASONAL_THEMES[viewMonth].bg }}><span style={{ color: 'var(--primary)' }}>{SEASONAL_THEMES[viewMonth].bg}</span></div>
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
            <div className="reflections-filter-bar">
              {[
                { id: 'all', label: 'All Tasks' },
                { id: 'important', label: 'Important' },
                { id: 'completed', label: 'Completed' },
                { id: 'archive', label: 'Archive' }
              ].map(f => (
                <button key={f.id} 
                  className={`filter-tab ${reflectionFilter === f.id ? 'active' : ''}`}
                  onClick={() => setReflectionFilter(f.id)}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="journal-layout">
              {(() => {
                let filtered = filteredMemos(currentMemos);
                if (reflectionFilter === 'important') filtered = filtered.filter(m => m.starred && !m.archived);
                else if (reflectionFilter === 'completed') filtered = filtered.filter(m => m.completed && !m.archived);
                else if (reflectionFilter === 'archive') filtered = filtered.filter(m => m.archived);
                else filtered = filtered.filter(m => !m.archived);

                if (filtered.length === 0) return (
                    <div className="empty-journal">
                      <p>{searchQuery ? 'No search results found.' : `No ${reflectionFilter} records yet.`}</p>
                      {reflectionFilter === 'all' && !searchQuery && <button onClick={openForm}>Start Entry</button>}
                    </div>
                  );

                  return filtered.map(memo => (
                    <article key={memo.id} className={`journal-entry ${memo.starred ? 'is-starred' : ''} ${memo.completed ? 'is-completed' : ''}`}>
                      <div className="journal-meta">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span className="journal-date" style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.7rem', color: memo.starred ? '#ECC94B' : 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>
                            <Icon.Cal /> {memo.date || memo.label} 
                            {memo.starred && ' • IMPORTANT'}
                            {memo.completed && ' • COMPLETED'}
                            {memo.archived && ' • ARCHIVED'}
                          </span>
                          <h3 style={{ fontFamily: 'var(--newsreader)', fontStyle: 'italic', fontSize: '1.4rem', textDecoration: memo.completed ? 'line-through' : 'none', opacity: memo.completed ? 0.6 : 1 }}>{memo.title || 'Untitled'}</h3>
                        </div>
                        <div className="journal-item-actions">
                          <button onClick={() => toggleStar(memo.id)} className={`action-circle ${memo.starred ? 'active' : ''}`} title="Mark Important"><Icon.Star /></button>
                          <button onClick={() => toggleComplete(memo.id)} className={`action-circle ${memo.completed ? 'active-green' : ''}`} title="Mark Complete"><Icon.CheckDouble /></button>
                          <button onClick={() => toggleArchive(memo.id)} className={`action-circle ${memo.archived ? 'active-blue' : ''}`} title="Archive Entry"><Icon.Clipboard /></button>
                          <div style={{ width: '1px', height: '20px', background: 'var(--border)', margin: '0 0.5rem' }} />
                          <button className="journal-edit" onClick={() => startEdit(memo)}>Edit</button>
                          <button className="journal-delete" onClick={() => deleteMemo(memo.id)}>Delete</button>
                        </div>
                      </div>
                      <div className="journal-body" style={{ opacity: memo.completed ? 0.6 : 1 }}>{memo.text}</div>
                    </article>
                  ))
                })()}
              </div>
          </div>
        )}

        <footer className="site-footer">
          <p className="footer-tag">© 2026 {activeNav.toUpperCase()} // STRATEGY VOLUME</p>
          <div className="footer-links">
            <span>Editor: {userName}</span>
            <span className="dot">•</span>
            <span>All rights reserved</span>
          </div>
        </footer>
      </main>

      {/* ══════════ MODAL ══════════ */}
      {showForm && (
        <div className="modal-backdrop" onClick={closeForm}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">{editingMemoId ? 'Edit Entry' : 'New Entry'}</h2>
              <button className="modal-close" onClick={closeForm}><Icon.Close /></button>
            </div>
            <p className="modal-subtitle">{editingMemoId ? 'Refine your thoughts' : `Add to ${MONTH_NAMES[viewMonth]} ${viewYear}`}</p>
            <div className="modal-form">
              <label className="modal-label">Title</label>
              <input className="modal-input" value={formTitle} onChange={e => setFormTitle(e.target.value)} autoFocus placeholder="Give your entry a title" />
              
              <label className="modal-label">Date (DD/MM/YYYY)</label>
              <div className="date-input-wrapper" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input className="modal-input" 
                  value={formDate} 
                  onChange={e => setFormDate(e.target.value)} 
                  placeholder="DD/MM/YYYY" 
                />
                
                {/* Hidden native date picker */}
                <input 
                  type="date" 
                  ref={datePickerRef}
                  onChange={handleDatePickerChange}
                  style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
                />

                <button 
                  type="button"
                  onClick={openNativePicker}
                  style={{ 
                    position: 'absolute', 
                    right: '10px', 
                    background: 'none', 
                    border: 'none', 
                    color: 'var(--primary)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    cursor: 'pointer',
                    padding: '8px',
                    borderRadius: '50%',
                    transition: 'background 0.2s'
                  }}
                  className="date-picker-trigger"
                >
                  <Icon.Cal />
                </button>
              </div>

              <label className="modal-label">Notes</label>
              <textarea className="modal-textarea" value={formText} onChange={e => setFormText(e.target.value)} placeholder="Write your thoughts here..." />
              
              <div className="modal-actions">
                <button className="btn-cancel" onClick={closeForm}>Cancel</button>
                <button className="btn-save" onClick={addMemo} disabled={!formText.trim()}>{editingMemoId ? 'Update Entry' : 'Save Entry'}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══════════ SYSTEM SETTINGS DRAWER ══════════ */}
      {showSettings && (
        <div className="settings-overlay fade-in" onClick={() => setShowSettings(false)}>
          <div className="settings-drawer slide-right" onClick={e => e.stopPropagation()}>
            <header className="settings-header">
              <div>
                <h2>System Dashboard</h2>
                <p>Volume {viewYear} Management</p>
              </div>
              <button className="close-drawer" onClick={() => setShowSettings(false)}><Icon.Close /></button>
            </header>

            <div className="settings-content">
              <section className="settings-section">
                <h3 className="section-label">Identity</h3>
                <div className="setting-control">
                  <label>Editor Name</label>
                  <input type="text" value={userName} onChange={e => setUserName(e.target.value)} placeholder="Enter name..." />
                </div>
                <div className="setting-control">
                  <label>Volume Year</label>
                  <div className="year-stepper">
                    <button onClick={() => setViewYear(y => y-1)}><Icon.ChevL /></button>
                    <span>{viewYear}</span>
                    <button onClick={() => setViewYear(y => y+1)}><Icon.ChevR /></button>
                  </div>
                </div>
              </section>

              <section className="settings-section">
                <h3 className="section-label">Appearance</h3>
                <div className="setting-row">
                  <span>Midnight Mode</span>
                  <button className={`toggle-switch ${darkMode ? 'on' : ''}`} onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? <Icon.Moon /> : <Icon.Sun />}
                  </button>
                </div>
                <div className="setting-control">
                  <label>Aura Intensity ({Math.round(glowIntensity * 100)}%)</label>
                  <input type="range" min="0" max="1" step="0.1" value={glowIntensity} onChange={e => setGlowIntensity(parseFloat(e.target.value))} />
                </div>
              </section>

              <section className="settings-section">
                <h3 className="section-label">Data Management</h3>
                <button className="settings-action-btn" onClick={exportData}>
                  <Icon.Download /> Export Strategy Library
                </button>
                <button className="settings-action-btn destructive" onClick={resetAll}>
                  <Icon.Trash /> Factory System Reset
                </button>
              </section>
            </div>

            <footer className="settings-footer">
              <p>Chronos Editorial Engine v4.0</p>
              <p className="legal">Premium Strategy Workspace</p>
            </footer>
          </div>
        </div>
      )}

      {toast && <div className="toast-notification">{toast}</div>}
    </div>
  )
}
