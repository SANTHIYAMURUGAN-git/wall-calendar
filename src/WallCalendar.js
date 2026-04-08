import React, { useState, useMemo } from 'react';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
];

const DAY_NAMES = ['MON','TUE','WED','THU','FRI','SAT','SUN'];

const MONTH_IMAGES = [
  // January - snowy mountain climber (like your reference)
  'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80',
  // February - misty forest path
  'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800&q=80',
  // March - spring cherry blossoms
  'https://images.unsplash.com/photo-1522748906645-95d8adfd52c7?w=800&q=80',
  // April - green hills adventure
  'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
  // May - mountain sunrise hiker
  'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&q=80',
  // June - ocean cliff sunset
  'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80',
  // July - summer peak climber
  'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800&q=80',
  // August - rocky mountain trail
  'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80',
  // September - autumn forest hiker
  'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&q=80',
  // October - foggy mountain road
  'https://images.unsplash.com/photo-1476673160081-cf065607f449?w=800&q=80',
  // November - snowy pine forest
  'https://images.unsplash.com/photo-1491002052546-bf38f186af56?w=800&q=80',
  // December - winter mountain peak
  'https://images.unsplash.com/photo-1418985991508-e47386d96a71?w=800&q=80',
];

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
  const [hoverDay, setHoverDay] = useState(null);
  const [notes, setNotes] = useState({});
  const [noteInput, setNoteInput] = useState('');
  const [activeKey, setActiveKey] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [animDir, setAnimDir] = useState('next');

  const daysInMonth = useMemo(
    () => new Date(viewYear, viewMonth + 1, 0).getDate(),
    [viewYear, viewMonth]
  );

  // Calendar starts on Monday (0=Mon)
  const firstDayOfWeek = useMemo(() => {
    const day = new Date(viewYear, viewMonth, 1).getDay();
    return day === 0 ? 6 : day - 1;
  }, [viewYear, viewMonth]);

  function navigate(dir) {
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      if (dir === 'next') {
        if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); }
        else setViewMonth(m => m + 1);
      } else {
        if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); }
        else setViewMonth(m => m - 1);
      }
      setAnimating(false);
    }, 350);
    setRangeStart(null);
    setRangeEnd(null);
  }

  function handleDayClick(day) {
    const clicked = new Date(viewYear, viewMonth, day);
    if (!rangeStart || (rangeStart && rangeEnd)) {
      setRangeStart(clicked);
      setRangeEnd(null);
      const k = dateKey(viewYear, viewMonth, day);
      setActiveKey(k);
      setNoteInput(notes[k] || '');
    } else {
      if (clicked < rangeStart) {
        setRangeEnd(rangeStart);
        setRangeStart(clicked);
      } else {
        setRangeEnd(clicked);
      }
    }
  }

  function getDayState(day, colIndex) {
    const d = new Date(viewYear, viewMonth, day);
    const isSat = colIndex === 5;
    const isSun = colIndex === 6;
    const hoverDate = hoverDay ? new Date(viewYear, viewMonth, hoverDay) : null;
    const effectiveEnd = rangeEnd || hoverDate;
    const isStart = rangeStart && d.toDateString() === rangeStart.toDateString();
    const isEnd = rangeEnd && d.toDateString() === rangeEnd.toDateString();
    const inRange = rangeStart && effectiveEnd && d > rangeStart && d < effectiveEnd;
    const isToday = d.toDateString() === today.toDateString();
    const holidayKey = `${viewMonth + 1}-${day}`;
    const isHoliday = !!HOLIDAYS[holidayKey];
    const hasNote = !!notes[dateKey(viewYear, viewMonth, day)];
    return { isStart, isEnd, inRange, isToday, isHoliday, hasNote, isSat, isSun };
  }

  function saveNote() {
    if (!activeKey) return;
    setNotes(n => ({ ...n, [activeKey]: noteInput }));
  }

  function deleteNote(k) {
    setNotes(n => { const c = { ...n }; delete c[k]; return c; });
    if (activeKey === k) { setNoteInput(''); setActiveKey(null); }
  }

  // Build calendar grid — weeks as rows
  const calendarGrid = useMemo(() => {
    const cells = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);
    while (cells.length % 7 !== 0) cells.push(null);
    const weeks = [];
    for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
    return weeks;
  }, [firstDayOfWeek, daysInMonth]);

  const notesList = Object.entries(notes).filter(([, v]) => v);

  const BLUE = '#1a8fc1';
  const DARK_BLUE = '#0e6fa0';

  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      gap: '30px', width: '100%'
    }}>

      {/* ── CALENDAR CARD ── */}
      <div style={{
        width: '100%', maxWidth: '480px',
        background: '#ffffff',
        borderRadius: '4px',
        boxShadow: '0 30px 80px rgba(0,0,0,0.25)',
        overflow: 'hidden',
        position: 'relative',
      }}>

        {/* SPIRAL BINDING */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '22px',
          background: '#d0d5dd', zIndex: 20,
          display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: '10px',
        }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} style={{
              width: '16px', height: '16px', borderRadius: '50%',
              border: '2.5px solid #8a9ab0',
              background: '#ffffff',
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.2)',
            }} />
          ))}
        </div>

        {/* HERO IMAGE SECTION */}
        <div style={{ position: 'relative', height: '280px', marginTop: '22px', overflow: 'hidden' }}>
          <img
            src={MONTH_IMAGES[viewMonth]}
            alt={MONTH_NAMES[viewMonth]}
            style={{
              width: '100%', height: '100%', objectFit: 'cover', display: 'block',
              opacity: animating ? 0 : 1,
              transform: animating
                ? (animDir === 'next' ? 'translateX(-30px)' : 'translateX(30px)')
                : 'translateX(0)',
              transition: 'opacity 0.35s ease, transform 0.35s ease',
            }}
          />

          {/* Blue zigzag overlay at bottom of image — exactly like reference */}
          <svg
            viewBox="0 0 480 80"
            preserveAspectRatio="none"
            style={{
              position: 'absolute', bottom: 0, left: 0,
              width: '100%', height: '80px',
            }}
          >
            {/* Left solid blue triangle */}
            <polygon points="0,80 0,20 160,80" fill={BLUE} />
            {/* Right blue block with year/month — takes right 55% */}
            <polygon points="200,0 480,0 480,80 200,80" fill={BLUE} />
            {/* Zigzag cutout in between */}
            <polygon points="160,80 200,0 230,80" fill={BLUE} />
          </svg>

          {/* Year and Month text on blue area */}
          <div style={{
            position: 'absolute', bottom: '10px', right: '20px',
            textAlign: 'right', zIndex: 5,
          }}>
            <div style={{
              color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem',
              fontWeight: 400, letterSpacing: '0.1em'
            }}>
              {viewYear}
            </div>
            <div style={{
              color: '#ffffff', fontSize: '1.8rem',
              fontWeight: 800, letterSpacing: '0.12em',
              lineHeight: 1, textTransform: 'uppercase'
            }}>
              {MONTH_NAMES[viewMonth]}
            </div>
          </div>

          {/* Navigation arrows */}
          <button onClick={() => navigate('prev')} style={{
            position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', color: '#fff', cursor: 'pointer',
            fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}>‹</button>
          <button onClick={() => navigate('next')} style={{
            position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
            background: 'rgba(0,0,0,0.35)', border: 'none', borderRadius: '50%',
            width: '32px', height: '32px', color: '#fff', cursor: 'pointer',
            fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 10,
          }}>›</button>
        </div>

        {/* BOTTOM SECTION — Notes left, Calendar right */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '0',
          padding: '16px 16px 20px',
          opacity: animating ? 0 : 1,
          transition: 'opacity 0.35s ease',
        }}>

          {/* LEFT — Notes lines */}
          <div style={{ paddingRight: '12px', borderRight: '1px solid #e5e7eb' }}>
            <div style={{
              fontSize: '0.65rem', fontWeight: 700, color: '#9ca3af',
              letterSpacing: '0.1em', marginBottom: '10px', textTransform: 'uppercase'
            }}>
              Notes
            </div>
            {/* Lined note area */}
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} style={{
                borderBottom: '1px solid #d1d5db',
                height: '22px', marginBottom: '2px',
                position: 'relative',
              }}>
                {/* Show saved note text on lines */}
                {notesList[i] && (
                  <span style={{
                    fontSize: '0.55rem', color: '#374151',
                    position: 'absolute', bottom: '3px', left: '2px',
                    whiteSpace: 'nowrap', overflow: 'hidden',
                    maxWidth: '100%', textOverflow: 'ellipsis'
                  }}>
                    {notesList[i][1]}
                  </span>
                )}
              </div>
            ))}

            {/* Range info */}
            {rangeStart && (
              <div style={{
                marginTop: '8px', fontSize: '0.6rem', color: BLUE, fontWeight: 600
              }}>
                {rangeStart.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                {rangeEnd && ` → ${rangeEnd.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                {!rangeEnd && ' → pick end'}
              </div>
            )}
          </div>

          {/* RIGHT — Calendar Grid */}
          <div style={{ paddingLeft: '12px' }}>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '4px' }}>
              {DAY_NAMES.map((d, i) => (
                <div key={d} style={{
                  textAlign: 'center', fontSize: '0.55rem', fontWeight: 700,
                  color: i === 5 ? BLUE : i === 6 ? '#ef4444' : '#9ca3af',
                  padding: '2px 0', letterSpacing: '0.03em'
                }}>
                  {d}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {calendarGrid.map((week, wi) => (
              <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: '2px' }}>
                {week.map((day, ci) => {
                  if (!day) return <div key={`e-${wi}-${ci}`} style={{ padding: '4px 0' }} />;
                  const { isStart, isEnd, inRange, isToday, isHoliday, hasNote, isSat, isSun } = getDayState(day, ci);

                  let bgColor = 'transparent';
                  let color = isSun ? '#ef4444' : isSat ? BLUE : '#374151';
                  let fontWeight = 400;
                  let borderRadius = '4px';
                  let border = 'none';

                  if (isStart || isEnd) {
                    bgColor = BLUE;
                    color = '#ffffff';
                    fontWeight = 700;
                    borderRadius = '50%';
                  } else if (inRange) {
                    bgColor = '#dbeafe';
                    color = DARK_BLUE;
                    borderRadius = '0';
                  } else if (isToday) {
                    border = `2px solid ${BLUE}`;
                    color = BLUE;
                    fontWeight = 700;
                  }

                  // Dim prev/next month overflow days shown as null — only real days shown
                  const isCurrentMonthDay = true;

                  return (
                    <div
                      key={day}
                      onClick={() => handleDayClick(day)}
                      onMouseEnter={() => setHoverDay(day)}
                      onMouseLeave={() => setHoverDay(null)}
                      title={isHoliday ? HOLIDAYS[`${viewMonth + 1}-${day}`] : ''}
                      style={{
                        textAlign: 'center', padding: '4px 1px',
                        fontSize: '0.72rem', cursor: 'pointer',
                        background: bgColor, color, fontWeight, borderRadius, border,
                        position: 'relative',
                        transition: 'background 0.15s',
                        userSelect: 'none',
                      }}
                    >
                      {day}
                      {/* Holiday dot */}
                      {isHoliday && !isStart && !isEnd && (
                        <span style={{
                          position: 'absolute', bottom: '1px', left: '50%',
                          transform: 'translateX(-50%)',
                          width: '3px', height: '3px', borderRadius: '50%',
                          background: '#f59e0b', display: 'block'
                        }} />
                      )}
                      {/* Note dot */}
                      {hasNote && !isStart && !isEnd && (
                        <span style={{
                          position: 'absolute', top: '1px', right: '2px',
                          width: '3px', height: '3px', borderRadius: '50%',
                          background: '#10b981', display: 'block'
                        }} />
                      )}
                    </div>
                  );
                })}
              </div>
            ))}

            {/* Legend */}
            <div style={{
              display: 'flex', gap: '8px', marginTop: '8px',
              flexWrap: 'wrap', fontSize: '0.55rem', color: '#9ca3af'
            }}>
              <span>🟡 Holiday</span>
              <span>🟢 Note</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── NOTES PANEL (below card) ── */}
      <div style={{
        width: '100%', maxWidth: '480px',
        background: '#ffffff', borderRadius: '12px',
        padding: '20px', boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
      }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#374151', marginBottom: '14px' }}>
          📝 Add / Edit Notes
        </h3>

        <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '6px' }}>
          {activeKey ? `Note for: ${activeKey}` : 'Click any date on the calendar to add a note'}
        </div>

        <textarea
          value={noteInput}
          onChange={e => setNoteInput(e.target.value)}
          placeholder="Type your note here..."
          rows={3}
          style={{
            width: '100%', borderRadius: '8px',
            border: '1px solid #e5e7eb', padding: '10px',
            fontSize: '0.82rem', color: '#374151',
            resize: 'vertical', outline: 'none',
            fontFamily: 'inherit',
          }}
        />

        <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
          <button
            onClick={saveNote}
            style={{
              background: BLUE, color: '#fff', border: 'none',
              borderRadius: '8px', padding: '8px 20px',
              cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
            }}
          >
            Save Note
          </button>
          {activeKey && notes[activeKey] && (
            <button
              onClick={() => deleteNote(activeKey)}
              style={{
                background: '#fee2e2', color: '#ef4444', border: 'none',
                borderRadius: '8px', padding: '8px 16px',
                cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600,
              }}
            >
              Delete
            </button>
          )}
        </div>

        {/* All saved notes */}
        {notesList.length > 0 && (
          <div style={{ marginTop: '16px' }}>
            <div style={{
              fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af',
              letterSpacing: '0.08em', marginBottom: '8px', textTransform: 'uppercase'
            }}>
              Saved Notes
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {notesList.map(([k, v]) => (
                <div
                  key={k}
                  onClick={() => { setActiveKey(k); setNoteInput(v); }}
                  style={{
                    background: activeKey === k ? '#dbeafe' : '#f9fafb',
                    borderRadius: '8px', padding: '8px 12px',
                    cursor: 'pointer', display: 'flex',
                    justifyContent: 'space-between', alignItems: 'flex-start',
                    border: activeKey === k ? `1.5px solid ${BLUE}` : '1px solid #e5e7eb',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '0.65rem', color: BLUE, fontWeight: 700, marginBottom: '2px' }}>{k}</div>
                    <div style={{ fontSize: '0.8rem', color: '#374151' }}>{v}</div>
                  </div>
                  <button
                    onClick={e => { e.stopPropagation(); deleteNote(k); }}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#ef4444', fontSize: '1rem', lineHeight: 1, padding: '0 4px'
                    }}
                  >×</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile responsive styles */}
      <style>{`
        @media (max-width: 500px) {
          body { padding: 10px !important; }
        }
      `}</style>
    </div>
  );
}