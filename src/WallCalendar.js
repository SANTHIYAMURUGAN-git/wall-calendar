import React, { useState, useMemo } from 'react';

// Simple SVG icon components — no external dependency needed
const ChevronLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const ChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const StickyNote = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15.5 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.5L15.5 3z"/>
    <polyline points="15 3 15 9 21 9"/>
  </svg>
);
const XIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const Sun = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const Moon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MONTH_IMAGES = [
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1490750967868-88df5691cc8a?w=800&q=80',
  'https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=800&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
  'https://images.unsplash.com/photo-1473496169904-658ba7574b0d?w=800&q=80',
  'https://images.unsplash.com/photo-1504701954957-2010ec3bcec1?w=800&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=800&q=80',
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
  'https://images.unsplash.com/photo-1467810563316-b5476525c0f9?w=800&q=80',
];

const MONTH_NAMES = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

const DAY_NAMES = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const HOLIDAYS = {
  '1-1': "New Year's Day",
  '1-26': 'Republic Day',
  '8-15': 'Independence Day',
  '10-2': 'Gandhi Jayanti',
  '12-25': 'Christmas',
};

function dateKey(y, m, d) {
  return `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
}

export default function WallCalendar() {
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [rangeStart, setRangeStart] = useState(null);
  const [rangeEnd, setRangeEnd] = useState(null);
  const [hoverDate, setHoverDate] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [activeNoteKey, setActiveNoteKey] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotePanel, setShowNotePanel] = useState(false);
  const [flip, setFlip] = useState(false);
  const [animDir, setAnimDir] = useState('next');

  const daysInMonth = useMemo(() => new Date(viewYear, viewMonth + 1, 0).getDate(), [viewYear, viewMonth]);
  const firstDay = useMemo(() => new Date(viewYear, viewMonth, 1).getDay(), [viewYear, viewMonth]);

  function navigate(dir) {
    setAnimDir(dir);
    setFlip(true);
    setTimeout(() => {
      if (dir === 'next') {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
      } else {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
      }
      setFlip(false);
    }, 300);
  }

  function handleDayClick(day) {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clicked);
      setRangeEnd(null);
      const k = dateKey(viewYear, viewMonth, day);
      setActiveNoteKey(k);
      setNoteInput(notes[k] || '');
      setShowNotePanel(true);
    } else {
      if (clicked < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(clicked);
      } else {
        setRangeEnd(clicked);
      }
      setShowNotePanel(true);
    }
  }

  function getDayState(day) {
    const d = new Date(viewYear, viewMonth, day);
    const hover = hoverDate ? new Date(viewYear, viewMonth, hoverDate) : null;
    const end = rangeEnd || hover;
    const isStart = rangeStart && d.toDateString() === rangeStart.toDateString();
    const isEnd = rangeEnd && d.toDateString() === rangeEnd.toDateString();
    const isHover = hover && !rangeEnd && rangeStart && d.toDateString() === hover.toDateString();
    const inRange = rangeStart && end && d > rangeStart && d < end;
    const isToday = d.toDateString() === today.toDateString();
    const hKey = `${viewMonth + 1}-${day}`;
    const isHoliday = !!HOLIDAYS[hKey];
    const hasNote = !!notes[dateKey(viewYear, viewMonth, day)];
    return { isStart, isEnd, isHover, inRange, isToday, isHoliday, hasNote };
  }

  function saveNote() {
    if (!activeNoteKey) return;
    setNotes(n => ({ ...n, [activeNoteKey]: noteInput }));
  }

  function deleteNote(k) {
    setNotes(n => { const c = { ...n }; delete c[k]; return c; });
    if (activeNoteKey === k) { setNoteInput(''); setActiveNoteKey(null); }
  }

  const bg = darkMode ? '#1a1a2e' : '#f0f4f8';
  const card = darkMode ? '#16213e' : '#ffffff';
  const text = darkMode ? '#e0e0e0' : '#1a1a2e';
  const sub = darkMode ? '#8892b0' : '#64748b';
  const accent = '#2563eb';
  const rangeColor = darkMode ? '#1e3a5f' : '#dbeafe';
  const borderColor = darkMode ? '#2a2a4a' : '#e2e8f0';

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const notesList = Object.entries(notes).filter(([, v]) => v);

  return (
    <div style={{ minHeight: '100vh', background: bg, display: 'flex', alignItems: 'center',
      justifyContent: 'center', padding: '20px', transition: 'background 0.3s' }}>

      <div style={{ width: '100%', maxWidth: '900px' }}>

        {/* Top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h1 style={{ color: text, fontSize: '1.4rem', fontWeight: 700, letterSpacing: '0.05em' }}>
            📅 Wall Calendar
          </h1>
          <button onClick={() => setDarkMode(d => !d)} style={{ background: 'none', border: `1px solid ${borderColor}`,
            borderRadius: '8px', padding: '6px 12px', cursor: 'pointer', color: text, display: 'flex',
            alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
            {darkMode ? <Sun /> : <Moon />}
            {darkMode ? 'Light' : 'Dark'}
          </button>
        </div>

        {/* Main card */}
        <div style={{ background: card, borderRadius: '20px', overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: `1px solid ${borderColor}`,
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          transition: 'background 0.3s' }}>

          {/* LEFT: Hero image + month label */}
          <div style={{ position: 'relative', minHeight: '300px', overflow: 'hidden' }}>
            {/* Spiral binding */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '18px',
              background: darkMode ? '#2a2a4a' : '#cbd5e1', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              {Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ width: '14px', height: '14px', borderRadius: '50%',
                  border: `2px solid ${darkMode ? '#4a5568' : '#94a3b8'}`,
                  background: darkMode ? '#1a1a2e' : '#f8fafc' }} />
              ))}
            </div>

            <img
              src={MONTH_IMAGES[viewMonth]}
              alt={MONTH_NAMES[viewMonth]}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                filter: darkMode ? 'brightness(0.7)' : 'none',
                transform: flip ? (animDir === 'next' ? 'translateX(-20px)' : 'translateX(20px)') : 'translateX(0)',
                opacity: flip ? 0 : 1,
                transition: 'transform 0.3s ease, opacity 0.3s ease' }}
            />

            {/* Month overlay */}
            <div style={{ position: 'absolute', bottom: 0, right: 0, padding: '16px 20px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              borderTopLeftRadius: '16px', textAlign: 'right' }}>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem', fontWeight: 500 }}>
                {viewYear}
              </div>
              <div style={{ color: '#ffffff', fontSize: '1.5rem', fontWeight: 800, letterSpacing: '0.1em' }}>
                {MONTH_NAMES[viewMonth].toUpperCase()}
              </div>
            </div>
          </div>

          {/* RIGHT: Calendar grid */}
          <div style={{ padding: '28px 20px 20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

            {/* Nav */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <button onClick={() => navigate('prev')} style={{ background: 'none', border: `1px solid ${borderColor}`,
                borderRadius: '8px', padding: '6px', cursor: 'pointer', color: text, display: 'flex' }}>
                <ChevronLeft />
              </button>
              <span style={{ color: text, fontWeight: 700, fontSize: '1rem' }}>
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button onClick={() => navigate('next')} style={{ background: 'none', border: `1px solid ${borderColor}`,
                borderRadius: '8px', padding: '6px', cursor: 'pointer', color: text, display: 'flex' }}>
                <ChevronRight />
              </button>
            </div>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
              {DAY_NAMES.map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700,
                  color: d === 'Sun' ? '#ef4444' : d === 'Sat' ? accent : sub,
                  padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px',
              opacity: flip ? 0 : 1,
              transform: flip ? (animDir === 'next' ? 'translateY(10px)' : 'translateY(-10px)') : 'translateY(0)',
              transition: 'opacity 0.3s, transform 0.3s' }}>
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`e-${i}`} />;
                const { isStart, isEnd, isHover, inRange, isToday, isHoliday, hasNote } = getDayState(day);
                const isSun = (i % 7 === 0);
                const isSat = (i % 7 === 6);
                let bg2 = 'transparent';
                let col = isSun ? '#ef4444' : isSat ? accent : text;
                let fw = 400;
                let radius = '8px';
                if (isStart || isEnd) { bg2 = accent; col = '#fff'; fw = 700; radius = '50%'; }
                else if (isHover) { bg2 = darkMode ? '#2a4a7f' : '#bfdbfe'; col = accent; radius = '50%'; }
                else if (inRange) { bg2 = rangeColor; radius = '0'; }
                else if (isToday) { col = accent; fw = 700; }

                return (
                  <div key={day} onClick={() => handleDayClick(day)}
                    onMouseEnter={() => setHoverDate(day)}
                    onMouseLeave={() => setHoverDate(null)}
                    title={isHoliday ? HOLIDAYS[`${viewMonth + 1}-${day}`] : ''}
                    style={{ position: 'relative', textAlign: 'center', padding: '6px 2px',
                      background: bg2, borderRadius: radius, cursor: 'pointer', color: col,
                      fontWeight: fw, fontSize: '0.82rem', transition: 'background 0.15s, transform 0.1s' }}
                    onMouseDown={e => e.currentTarget.style.transform = 'scale(0.9)'}
                    onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
                  >
                    {day}
                    {isToday && !isStart && !isEnd && (
                      <div style={{ position: 'absolute', bottom: '2px', left: '50%',
                        transform: 'translateX(-50%)', width: '4px', height: '4px',
                        borderRadius: '50%', background: accent }} />
                    )}
                    {isHoliday && (
                      <div style={{ position: 'absolute', top: '1px', right: '2px',
                        width: '4px', height: '4px', borderRadius: '50%', background: '#f59e0b' }} />
                    )}
                    {hasNote && (
                      <div style={{ position: 'absolute', top: '1px', left: '2px',
                        width: '4px', height: '4px', borderRadius: '50%', background: '#10b981' }} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.7rem', color: sub }}>
              <span>🔵 Today</span>
              <span>🟡 Holiday</span>
              <span>🟢 Has note</span>
              {rangeStart && (
                <span style={{ color: accent }}>
                  📅 {rangeStart.toLocaleDateString()}
                  {rangeEnd ? ` → ${rangeEnd.toLocaleDateString()}` : ' (pick end)'}
                </span>
              )}
            </div>

            {/* Notes toggle */}
            <button onClick={() => setShowNotePanel(p => !p)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', background: 'none',
                border: `1px solid ${borderColor}`, borderRadius: '10px', padding: '8px 14px',
                cursor: 'pointer', color: text, fontSize: '0.85rem', width: '100%',
                justifyContent: 'center' }}>
              <StickyNote />
              {showNotePanel ? 'Hide Notes' : 'Show Notes'}
            </button>
          </div>
        </div>

        {/* Notes panel */}
        {showNotePanel && (
          <div style={{ marginTop: '16px', background: card, borderRadius: '16px',
            padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
            border: `1px solid ${borderColor}`, transition: 'background 0.3s' }}>

            <h3 style={{ color: text, marginBottom: '14px', fontSize: '1rem', fontWeight: 700 }}>
              📝 Notes
            </h3>

            {/* Note input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '0.78rem', color: sub, marginBottom: '6px' }}>
                {activeNoteKey ? `Note for: ${activeNoteKey}` : 'Click a date to add a note'}
              </div>
              <textarea
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                placeholder="Type your note here..."
                rows={3}
                style={{ width: '100%', borderRadius: '10px', border: `1px solid ${borderColor}`,
                  padding: '10px', fontSize: '0.85rem', background: darkMode ? '#0f3460' : '#f8fafc',
                  color: text, resize: 'vertical', outline: 'none' }}
              />
              <button onClick={saveNote}
                style={{ marginTop: '8px', background: accent, color: '#fff', border: 'none',
                  borderRadius: '8px', padding: '8px 20px', cursor: 'pointer', fontSize: '0.85rem',
                  fontWeight: 600 }}>
                Save Note
              </button>
            </div>

            {/* Saved notes list */}
            {notesList.length > 0 && (
              <div>
                <div style={{ fontSize: '0.78rem', color: sub, marginBottom: '8px', fontWeight: 600 }}>
                  SAVED NOTES
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {notesList.map(([k, v]) => (
                    <div key={k} onClick={() => { setActiveNoteKey(k); setNoteInput(v); }}
                      style={{ background: darkMode ? '#0f3460' : '#f1f5f9', borderRadius: '10px',
                        padding: '10px 14px', cursor: 'pointer', display: 'flex',
                        justifyContent: 'space-between', alignItems: 'flex-start',
                        border: activeNoteKey === k ? `2px solid ${accent}` : `1px solid ${borderColor}` }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: accent, fontWeight: 700, marginBottom: '2px' }}>{k}</div>
                        <div style={{ fontSize: '0.82rem', color: text }}>{v}</div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); deleteNote(k); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', padding: '2px' }}>
                        <XIcon />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}