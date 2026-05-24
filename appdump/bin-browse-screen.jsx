// bin-browse-screen.jsx — view all bins + items, region picker

const { useState: useS_bb, useMemo: useM_bb } = React;

function BrowseBinsScreen({ accent, region, onBack, onPickItem }) {
  const [openBin, setOpenBin] = useS_bb(BIN_ORDER[0]);

  const byBin = useM_bb(() => {
    const out = {};
    BIN_ORDER.forEach(k => out[k] = []);
    ITEMS.forEach(i => {
      const resolved = resolveForRegion(i, region);
      if (out[resolved.bin]) out[resolved.bin].push(resolved);
    });
    return out;
  }, [region]);

  const open = BINS[openBin];

  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", system-ui, sans-serif',
    }}>
      <div style={{
        padding: '54px 16px 0',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          padding: '8px 12px', borderRadius: 999,
          background: 'transparent', border: '1px solid var(--line)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13,
          cursor: 'pointer',
        }}>← Done</button>
        <div style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 11,
          letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)',
        }}>Bin guide · {region}</div>
        <div style={{ width: 60 }}/>
      </div>

      {/* region note */}
      {REGION_NOTES[region] && (
        <div style={{
          margin: '12px 24px 0', padding: '12px 14px', borderRadius: 12,
          background: 'var(--card)', border: '1px solid var(--line)',
          fontSize: 12, color: 'var(--muted)', lineHeight: 1.5,
        }}>
          <span style={{
            fontFamily: '"Geist Mono", monospace', fontSize: 9,
            letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--ink)',
            fontWeight: 600, marginRight: 6,
          }}>{region} notes</span>
          {REGION_NOTES[region]}
        </div>
      )}

      {/* bins grid */}
      <div style={{ padding: '18px 20px 0' }}>
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 6,
        }}>
          {BIN_ORDER.map(k => {
            const b = BINS[k];
            const isOpen = openBin === k;
            return (
              <button key={k} onClick={() => setOpenBin(k)} style={{
                padding: '14px 14px', borderRadius: 10, textAlign: 'left',
                background: isOpen ? b.color : 'var(--card)',
                color: isOpen ? b.fg : 'var(--ink)',
                border: '1px solid ' + (isOpen ? b.color : 'var(--line)'),
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', flexDirection: 'column', gap: 8,
                minHeight: 78,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{
                    width: 12, height: 12, borderRadius: 2,
                    background: isOpen ? b.fg : b.color,
                  }}/>
                  <span style={{
                    fontFamily: '"Geist Mono", monospace', fontSize: 10,
                    fontWeight: 600, opacity: 0.7,
                  }}>{byBin[k].length}</span>
                </div>
                <div style={{
                  fontFamily: '"Space Grotesk", system-ui, sans-serif',
                  fontSize: 18, fontWeight: 600, lineHeight: 1.05, letterSpacing: -0.3,
                }}>{b.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* selected bin items */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: '20px 24px 40px',
      }}>
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 14,
        }}>
          <div style={{
            width: 6, alignSelf: 'stretch', borderRadius: 1, background: open.color,
          }}/>
          <div style={{ flex: 1 }}>
            <div style={{
              fontFamily: '"Space Grotesk", system-ui, sans-serif',
              fontSize: 26, fontWeight: 600, lineHeight: 1, letterSpacing: -0.5,
            }}>{open.label}</div>
            <p style={{
              margin: '6px 0 0', fontSize: 13, color: 'var(--muted)', lineHeight: 1.45,
            }}>{open.blurb}</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {byBin[openBin].map(it => (
            <button key={it.id} onClick={() => onPickItem(it)} style={{
              display: 'flex', alignItems: 'flex-start', gap: 10,
              padding: '12px 14px', borderRadius: 10,
              background: 'var(--card)', border: '1px solid var(--line)',
              textAlign: 'left', cursor: 'pointer', fontFamily: 'inherit',
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: 'var(--ink)', fontWeight: 500 }}>{it.name}</div>
                <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 3, lineHeight: 1.4 }}>{it.tip}</div>
              </div>
              {it.conditions && it.conditions.length > 0 && (
                <span style={{
                  flexShrink: 0, padding: '2px 7px', borderRadius: 4,
                  fontFamily: '"Geist Mono", monospace', fontSize: 9,
                  letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
                  background: 'var(--line)', color: 'var(--ink)',
                }}>{it.conditions.length + 1} cases</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const REGIONS = ['NZ', 'AU', 'UK', 'US', 'EU', 'CA'];

function RegionScreen({ region, onPick, onCancel }) {
  const regionFull = {
    NZ: 'New Zealand', AU: 'Australia', UK: 'United Kingdom',
    US: 'United States', EU: 'European Union', CA: 'Canada',
  };
  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", system-ui, sans-serif',
      padding: '54px 24px 30px',
    }}>
      <button onClick={onCancel} style={{
        alignSelf: 'flex-start',
        padding: '8px 12px', borderRadius: 999,
        background: 'transparent', border: '1px solid var(--line)',
        color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
      }}>← Back</button>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 11,
          letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)',
        }}>Set your region</div>
        <h1 style={{
          margin: '6px 0 18px',
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontWeight: 700, fontSize: 48, lineHeight: 0.95, letterSpacing: -1.5,
        }}>Where do you live?</h1>
        <p style={{
          margin: '0 0 24px', fontSize: 14, color: 'var(--muted)', lineHeight: 1.5,
        }}>Recycling rules vary a lot. We adjust advice to your area.</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => onPick(r)} style={{
              padding: '16px 18px', borderRadius: 12, textAlign: 'left',
              background: region === r ? 'var(--ink)' : 'var(--card)',
              color: region === r ? 'var(--bg)' : 'var(--ink)',
              border: '1px solid ' + (region === r ? 'var(--ink)' : 'var(--line)'),
              fontFamily: 'inherit', fontSize: 15, fontWeight: 500, cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span>{regionFull[r] || r}</span>
              <span style={{
                fontFamily: '"Geist Mono", monospace', fontSize: 11,
                letterSpacing: 1, opacity: 0.7,
              }}>{r}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { BrowseBinsScreen, RegionScreen, REGIONS });
