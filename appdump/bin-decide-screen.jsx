// bin-decide-screen.jsx — home: input + chips + recent + browse

const { useState: useS_d, useMemo: useM_d, useEffect: useE_d, useRef: useR_d } = React;

// ─────────────────────────────────────────────────────────────
// BinChip — small colored pill used everywhere
// ─────────────────────────────────────────────────────────────
function BinChip({ bin, size = 'sm', region }) {
  const b = BINS[bin];
  if (!b) return null;
  const isNZ = region === 'NZ' && b.nzLabel;
  const color = isNZ && b.nzColor ? b.nzColor : b.color;
  const label = isNZ ? b.nzLabel : b.short;
  const fg = (isNZ && (bin === 'recycling' || bin === 'glass')) ? '#1a1410' : b.fg;
  const pad = size === 'lg' ? '6px 14px' : '4px 9px';
  const fs = size === 'lg' ? 12 : 10;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: pad, borderRadius: 4,
      background: color, color: fg,
      fontSize: fs, fontWeight: 600, letterSpacing: 0.4,
      textTransform: 'uppercase',
      fontFamily: '"Geist Mono", ui-monospace, monospace',
    }}>
      <span style={{
        width: 6, height: 6, borderRadius: 1, background: fg, opacity: 0.7,
      }}/>
      {label}
    </span>
  );
}

// ─────────────────────────────────────────────────────────────
// Suggested chips for empty-state quick taps
// ─────────────────────────────────────────────────────────────
const QUICK_PICKS = ['pizzabox', 'aabattery', 'yogurtpot', 'coffeecup', 'tetra', 'aerosol', 'vape', 'paint'];

function DecideScreen({ accent, region, recent, onDecide, onBrowse, onChangeRegion }) {
  const [query, setQuery] = useS_d('');
  const inputRef = useR_d();

  const suggestions = useM_d(() => searchItems(query, region, 6), [query, region]);

  const submit = (text) => {
    const q = text || query;
    if (!q.trim()) return;
    const found = findItem(q, region);
    onDecide({ query: q, item: found });
    setQuery('');
  };

  const quickPicks = useM_d(() =>
    QUICK_PICKS.map(id => ITEMS.find(i => i.id === id))
      .filter(Boolean)
      .map(it => resolveForRegion(it, region)),
    [region]);

  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      position: 'relative',
    }}>
      {/* header */}
      <div style={{
        padding: '54px 24px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
      }}>
        <div>
          <h1 style={{
            margin: 0, fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700, fontSize: 56, lineHeight: 0.95, letterSpacing: -2,
          }}>DUMP<span style={{ color: accent }}>?</span></h1>
          <div style={{
            marginTop: 6, fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)', fontFamily: '"Geist Mono", ui-monospace, monospace',
          }}>Which bin does it go in?</div>
        </div>
        <button onClick={onChangeRegion} style={{
          padding: '8px 12px', borderRadius: 999,
          border: '1px solid var(--line)', background: 'transparent',
          fontFamily: '"Geist Mono", ui-monospace, monospace',
          fontSize: 11, color: 'var(--ink)', cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
          textTransform: 'uppercase', letterSpacing: 0.8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: 6, background: '#2D7A3A' }}/>
          {region}
        </button>
      </div>

      {/* input box */}
      <div style={{ padding: '28px 20px 0' }}>
        <div style={{
          background: 'var(--card)', border: '2px solid var(--ink)',
          borderRadius: 14, padding: 4,
          display: 'flex', alignItems: 'center', gap: 4,
          boxShadow: '4px 4px 0 var(--ink)',
        }}>
          <input ref={inputRef}
            value={query} onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submit()}
            placeholder="Type an item — pizza box, vape, foil…"
            style={{
              flex: 1, padding: '14px 14px', border: 'none', outline: 'none',
              background: 'transparent', fontFamily: 'inherit', fontSize: 15,
              color: 'var(--ink)',
            }}/>
          <button onClick={() => submit()} disabled={!query.trim()} style={{
            padding: '14px 18px', borderRadius: 10, border: 'none',
            background: query.trim() ? 'var(--ink)' : 'var(--line)',
            color: 'var(--bg)', cursor: query.trim() ? 'pointer' : 'default',
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            fontSize: 11, fontWeight: 600, letterSpacing: 1, textTransform: 'uppercase',
          }}>Dump it</button>
        </div>

        {/* live suggestions */}
        {query.trim() && suggestions.length > 0 && (
          <div style={{
            marginTop: 8, background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 12, overflow: 'hidden',
          }}>
            {suggestions.map((s, i) => (
              <button key={s.id} onClick={() => { setQuery(''); onDecide({ query: s.name, item: s }); }}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 10,
                  padding: '12px 14px', border: 'none', background: 'transparent',
                  borderTop: i ? '1px solid var(--line)' : 'none', textAlign: 'left',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>
                <span style={{ flex: 1, fontSize: 14, color: 'var(--ink)' }}>{s.name}</span>
                <BinChip bin={s.bin} region={region}/>
              </button>
            ))}
          </div>
        )}
        {query.trim() && suggestions.length === 0 && (
          <div style={{
            marginTop: 8, padding: '12px 14px', borderRadius: 12,
            border: '1px dashed var(--line)', background: 'var(--card)',
            fontSize: 13, color: 'var(--muted)', lineHeight: 1.4,
          }}>
            Not in our list. Tap <strong style={{ color: 'var(--ink)' }}>Dump it</strong> and we\u2019ll ask the AI.
          </div>
        )}
      </div>

      {/* quick picks */}
      <div style={{ padding: '20px 24px 0' }}>
        <div style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 10,
          fontFamily: '"Geist Mono", ui-monospace, monospace',
        }}>Common confusions</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {quickPicks.map(it => (
            <button key={it.id} onClick={() => onDecide({ query: it.name, item: it })} style={{
              padding: '8px 12px', borderRadius: 999,
              border: '1px solid var(--line)', background: 'var(--card)',
              fontFamily: 'inherit', fontSize: 12, color: 'var(--ink)',
              cursor: 'pointer',
            }}>{it.name}</button>
          ))}
        </div>
      </div>

      {/* recent decisions */}
      {recent.length > 0 && (
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{
            fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)', marginBottom: 10,
            fontFamily: '"Geist Mono", ui-monospace, monospace',
          }}>Recently dumped</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {recent.slice(0, 5).map((r, i) => (
              <button key={i} onClick={() => onDecide(r)} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 14px', borderRadius: 12,
                background: 'var(--card)', border: '1px solid var(--line)',
                textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
              }}>
                <span style={{ fontSize: 14, color: 'var(--ink)' }}>{r.query}</span>
                <BinChip bin={r.bin || (r.item && r.item.bin) || 'general'} region={region}/>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* spacer */}
      <div style={{ flex: 1 }}/>

      {/* browse bin */}
      <div style={{
        padding: '12px 20px 30px',
        background: 'linear-gradient(to top, var(--bg) 60%, rgba(0,0,0,0))',
      }}>
        <button onClick={onBrowse} style={{
          width: '100%', padding: '14px 16px', borderRadius: 14,
          background: 'transparent', border: '1px solid var(--ink)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              display: 'inline-flex', gap: 2,
            }}>
              {BIN_ORDER.slice(0, 4).map(k => (
                <span key={k} style={{
                  width: 4, height: 14, borderRadius: 1, background: BINS[k].color,
                }}/>
              ))}
            </span>
            Browse all bins
          </span>
          <span style={{
            fontFamily: '"Geist Mono", ui-monospace, monospace',
            fontSize: 11, color: 'var(--muted)', letterSpacing: 1,
          }}>{ITEMS.length} items</span>
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { DecideScreen, BinChip });
