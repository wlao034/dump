// recipe-screen.jsx — recipe overview before cooking

const { useState: useS_r } = React;

function StepKindIcon({ kind, size = 12 }) {
  const c = {
    active: 'var(--ink)',
    timed:  'var(--accent)',
    wait:   '#9C9286',
    heat:   '#D97B3F',
  }[kind];
  if (kind === 'timed') return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="8" r="5" stroke={c} fill="none" strokeWidth="1.4"/>
      <path d="M7 5v3l2 1" stroke={c} fill="none" strokeWidth="1.4" strokeLinecap="round"/>
      <path d="M5 1h4" stroke={c} strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  );
  if (kind === 'heat') return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <path d="M7 1c1 2 3 3 3 6a3 3 0 11-6 0c0-1 .5-2 1-2.5C5.5 5.5 7 3.5 7 1z"
        fill="none" stroke={c} strokeWidth="1.4" strokeLinejoin="round"/>
    </svg>
  );
  if (kind === 'wait') return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="5.5" stroke={c} fill="none" strokeWidth="1.4"/>
      <circle cx="4.5" cy="7" r="0.9" fill={c}/>
      <circle cx="7" cy="7" r="0.9" fill={c}/>
      <circle cx="9.5" cy="7" r="0.9" fill={c}/>
    </svg>
  );
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" style={{ flexShrink: 0 }}>
      <path d="M3 7l3 3 5-6" stroke={c} fill="none" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function RecipeScreen({ recipe, accent, onBack, onStart, onEdit }) {
  const [tab, setTab] = useS_r('ingredients');
  const meta = DIFFICULTY_META[recipe.difficulty];

  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      position: 'relative',
    }}>
      {/* header w/ back */}
      <div style={{
        padding: '54px 16px 0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <button onClick={onBack} style={{
          padding: '8px 12px', borderRadius: 999, background: 'transparent',
          border: '1px solid var(--line)', color: 'var(--ink)',
          fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
          display: 'inline-flex', alignItems: 'center', gap: 6,
        }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><path d="M7 1L3 5l4 4" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Recipes
        </button>
        <button onClick={onEdit || (() => {})} style={{
          width: 36, height: 36, borderRadius: 18, background: 'transparent',
          border: '1px solid var(--line)', color: 'var(--ink)',
          cursor: onEdit ? 'pointer' : 'default',
          opacity: onEdit ? 1 : 0.4,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0,
        }}>
          {onEdit
            ? <svg width="14" height="14" viewBox="0 0 14 14"><path d="M1 13l3.5-1L13 4.5 9.5 1 1 9.5V13z" stroke="currentColor" strokeWidth="1.2" fill="none" strokeLinejoin="round"/></svg>
            : <svg width="14" height="14" viewBox="0 0 14 14"><path d="M3 1.5h8a1 1 0 011 1V13l-5-2.5L2 13V2.5a1 1 0 011-1z" stroke="currentColor" strokeWidth="1.2" fill="none"/></svg>
          }
        </button>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 140px' }}>
        {/* hero */}
        <div style={{
          height: 168, borderRadius: 18,
          background: `repeating-linear-gradient(135deg, var(--line) 0 8px, transparent 8px 16px), var(--bg)`,
          border: '1px solid var(--line)',
          display: 'flex', alignItems: 'flex-end', padding: 12,
          fontFamily: 'ui-monospace, SFMono-Regular, monospace',
          fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1,
          marginBottom: 18,
        }}>
          finished dish photo
        </div>

        <h2 style={{
          margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 34, lineHeight: 1.05, letterSpacing: -0.3,
        }}>{recipe.name}</h2>
        {recipe.community && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            marginTop: 6, fontSize: 11, color: 'var(--muted)',
          }}>
            <span style={{
              padding: '2px 7px', borderRadius: 4, background: accent, color: '#fff',
              fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
            }}>Community</span>
            {recipe.author && <span style={{ fontStyle: 'italic' }}>shared by {recipe.author}</span>}
          </div>
        )}
        <p style={{
          margin: '6px 0 0', fontSize: 15, color: 'var(--muted)',
          fontFamily: '"Instrument Serif", serif', fontStyle: 'italic', fontSize: 17,
        }}>{recipe.blurb}</p>

        {/* meta strip */}
        <div style={{
          display: 'flex', gap: 0, marginTop: 18,
          border: '1px solid var(--line)', borderRadius: 14, overflow: 'hidden',
          background: 'var(--card)',
        }}>
          {[
            { label: 'Total',   value: fmtDuration(recipe.totalMinutes) },
            { label: 'Active',  value: fmtDuration(recipe.activeMinutes) },
            { label: 'Serves',  value: recipe.serves },
            { label: 'Level',   value: meta.label, dots: meta.dots },
          ].map((m, i) => (
            <div key={i} style={{
              flex: 1, padding: '10px 8px', textAlign: 'center',
              borderLeft: i ? '1px solid var(--line)' : 'none',
            }}>
              <div style={{
                fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase',
                color: 'var(--muted)', marginBottom: 4,
              }}>{m.label}</div>
              <div style={{
                fontSize: 14, fontWeight: 500, lineHeight: 1.1,
                display: 'inline-flex', alignItems: 'center', gap: 5,
              }}>
                {m.value}
                {m.dots && <DotDifficulty level={m.dots} accent={accent}/>}
              </div>
            </div>
          ))}
        </div>

        {/* tabs */}
        <div style={{
          marginTop: 22, borderBottom: '1px solid var(--line)',
          display: 'flex', gap: 24,
        }}>
          {[
            { id: 'ingredients', label: 'You\u2019ll need' },
            { id: 'tools',       label: 'Tools' },
            { id: 'preview',     label: 'The plan' },
          ].map(t => {
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: '10px 0 12px', background: 'transparent', border: 'none',
                fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
                color: active ? 'var(--ink)' : 'var(--muted)',
                fontWeight: active ? 500 : 400,
                borderBottom: '2px solid ' + (active ? accent : 'transparent'),
                marginBottom: -1,
              }}>{t.label}</button>
            );
          })}
        </div>

        <div style={{ paddingTop: 16 }}>
          {tab === 'ingredients' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {recipe.ingredients.map((ing, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between',
                  padding: '11px 0', borderBottom: '1px dashed var(--line)',
                  fontSize: 14,
                }}>
                  <span>{ing.what}</span>
                  <span style={{ color: 'var(--muted)', fontVariantNumeric: 'tabular-nums' }}>
                    {ing.qty}
                  </span>
                </div>
              ))}
            </div>
          )}

          {tab === 'tools' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {recipe.tools.map((t, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  fontSize: 14,
                }}>
                  <span style={{
                    width: 6, height: 6, borderRadius: 6, background: 'var(--line)',
                  }}/>
                  {t}
                </div>
              ))}
              <div style={{
                marginTop: 10, padding: 12, borderRadius: 12,
                background: 'var(--card)', border: '1px solid var(--line)',
                fontSize: 12, color: 'var(--muted)', lineHeight: 1.5,
              }}>
                Don\u2019t have a stick blender? A regular blender works — just be careful with hot liquids and let things cool a bit first. Substitutes are usually fine.
              </div>
            </div>
          )}

          {tab === 'preview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {recipe.steps.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                  paddingBottom: 10, borderBottom: '1px dashed var(--line)',
                }}>
                  <div style={{
                    width: 22, height: 22, flexShrink: 0,
                    borderRadius: 11, background: 'var(--bg)',
                    border: '1px solid var(--line)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, color: 'var(--muted)',
                    fontVariantNumeric: 'tabular-nums',
                  }}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      display: 'flex', justifyContent: 'space-between', gap: 8,
                      alignItems: 'baseline',
                    }}>
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{s.title}</span>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', gap: 4,
                        fontSize: 11, color: 'var(--muted)',
                        fontVariantNumeric: 'tabular-nums',
                      }}>
                        <StepKindIcon kind={s.kind}/>
                        {s.minutes ? fmtDuration(s.minutes) : s.kind}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* bottom CTA */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '16px 24px 32px',
        background: 'linear-gradient(to top, var(--bg) 70%, rgba(0,0,0,0))',
      }}>
        <button onClick={onStart} style={{
          width: '100%', background: accent, color: '#fff',
          border: 'none', borderRadius: 999, padding: '18px 20px',
          fontFamily: 'inherit', fontSize: 16, fontWeight: 500, letterSpacing: 0.2,
          cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(192,74,31,0.30)',
        }}>
          Let\u2019s cook · {recipe.steps.length} steps
        </button>
      </div>
    </div>
  );
}

Object.assign(window, { RecipeScreen, StepKindIcon });
