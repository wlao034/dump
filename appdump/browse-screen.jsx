// browse-screen.jsx — pick a recipe

const { useState: useS_b, useMemo: useM_b } = React;

function DotDifficulty({ level, accent }) {
  return (
    <span style={{ display: 'inline-flex', gap: 3, alignItems: 'center' }}>
      {[1,2,3].map(i => (
        <span key={i} style={{
          width: 5, height: 5, borderRadius: 5,
          background: i <= level ? accent : 'var(--line)',
        }}/>
      ))}
    </span>
  );
}

function RecipeCard({ recipe, accent, onTap }) {
  const meta = DIFFICULTY_META[recipe.difficulty];
  const cuisineLabel = CUISINES[recipe.cuisine]?.label;
  return (
    <button onClick={onTap} style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 18, padding: '16px 18px', textAlign: 'left',
      cursor: 'pointer', fontFamily: 'inherit', width: '100%',
      display: 'flex', gap: 14, alignItems: 'stretch',
      position: 'relative',
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: 12, flexShrink: 0,
        background: `repeating-linear-gradient(135deg, var(--line) 0 6px, transparent 6px 12px), var(--bg)`,
        border: '1px solid var(--line)',
        display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-start',
        padding: 4,
        fontFamily: 'ui-monospace, SFMono-Regular, monospace',
        fontSize: 8, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5,
      }}>photo</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: '"Instrument Serif", serif', fontSize: 22, lineHeight: 1.1,
            color: 'var(--ink)',
          }}>{recipe.name}</span>
        </div>
        <div style={{
          fontSize: 14, color: 'var(--muted)', marginTop: 3, lineHeight: 1.35,
          fontStyle: 'italic', fontFamily: '"Instrument Serif", serif',
        }}>{recipe.blurb}</div>
        <div style={{
          display: 'flex', gap: 8, alignItems: 'center',
          marginTop: 8, fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap',
        }}>
          {recipe.community && (
            <span style={{
              padding: '2px 7px', borderRadius: 4, background: accent, color: '#fff',
              fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
            }}>Community</span>
          )}
          <span style={{
            padding: '2px 7px', borderRadius: 4, border: '1px solid var(--line)',
            fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500,
            color: 'var(--ink)',
          }}>{cuisineLabel}</span>
          <span style={{ display: 'inline-flex', gap: 5, alignItems: 'center' }}>
            <DotDifficulty level={meta.dots} accent={accent}/>
            {meta.label}
          </span>
          <span style={{ width: 3, height: 3, borderRadius: 3, background: 'var(--line)' }}/>
          <span style={{ fontVariantNumeric: 'tabular-nums' }}>{recipe.totalMinutes} min</span>
        </div>
        {recipe.community && recipe.author && (
          <div style={{
            fontSize: 11, color: 'var(--muted)', marginTop: 6,
            fontStyle: 'italic',
          }}>shared by {recipe.author}</div>
        )}
      </div>
    </button>
  );
}

function BrowseScreen({ recipes, onPick, accent, level, onAdd }) {
  const [cuisine, setCuisine] = useS_b('all');
  const [diff, setDiff] = useS_b('all');

  const filtered = useM_b(() => {
    let r = recipes;
    if (cuisine === 'community')   r = r.filter(x => x.community);
    else if (cuisine !== 'all')    r = r.filter(x => x.cuisine === cuisine);
    if (diff !== 'all')            r = r.filter(x => x.difficulty === diff);
    return r;
  }, [recipes, cuisine, diff]);

  // group by cuisine ONLY when "all" selected
  const grouped = useM_b(() => {
    if (cuisine !== 'all') return null;
    const groups = {};
    filtered.forEach(r => {
      const c = r.cuisine;
      if (!groups[c]) groups[c] = [];
      groups[c].push(r);
    });
    return Object.keys(groups)
      .sort((a, b) => (CUISINES[a]?.order ?? 99) - (CUISINES[b]?.order ?? 99))
      .map(k => ({ key: k, label: CUISINES[k]?.label ?? k, items: groups[k] }));
  }, [filtered, cuisine]);

  const communityCount = recipes.filter(r => r.community).length;

  const greet = level === 'beginner'
    ? "Let's cook something good"
    : level === 'curious'
      ? "What are you in the mood for?"
      : "Pick tonight's dinner";

  const cuisineOpts = [
    { v: 'all',       label: 'All' },
    { v: 'community', label: `Community · ${communityCount}` },
    ...Object.entries(CUISINES)
      .sort((a, b) => a[1].order - b[1].order)
      .map(([k, m]) => ({ v: k, label: m.label })),
  ];

  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      position: 'relative',
    }}>
      {/* header */}
      <div style={{ padding: '60px 24px 0' }}>
        <div style={{
          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)',
          marginBottom: 6,
        }}>Kitchen, Tuesday</div>
        <h1 style={{
          margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 36, lineHeight: 1.05, letterSpacing: -0.3,
        }}>{greet}</h1>
        <p style={{
          margin: '8px 0 0', fontSize: 14, color: 'var(--muted)', lineHeight: 1.4,
        }}>One recipe at a time. We'll walk through every step — no skipping ahead, no panic.</p>
      </div>

      {/* cuisine pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '18px 24px 0', overflowX: 'auto',
      }}>
        {cuisineOpts.map(f => {
          const active = cuisine === f.v;
          const isCommunity = f.v === 'community';
          return (
            <button key={f.v} onClick={() => setCuisine(f.v)} style={{
              flexShrink: 0, padding: '8px 14px', borderRadius: 999,
              border: '1px solid ' + (active ? 'transparent' : 'var(--line)'),
              background: active
                ? (isCommunity ? accent : 'var(--ink)')
                : 'transparent',
              color: active ? '#fff' : 'var(--ink)',
              fontSize: 12, fontFamily: 'inherit', cursor: 'pointer',
              fontWeight: 500,
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* difficulty pills */}
      <div style={{
        display: 'flex', gap: 6, padding: '10px 24px 0', overflowX: 'auto',
      }}>
        {[
          { v: 'all',    label: 'Any level' },
          { v: 'easy',   label: 'Easy' },
          { v: 'medium', label: 'A bit harder' },
          { v: 'hard',   label: 'Step it up' },
        ].map(f => {
          const active = diff === f.v;
          return (
            <button key={f.v} onClick={() => setDiff(f.v)} style={{
              flexShrink: 0, padding: '6px 12px', borderRadius: 999,
              border: '1px solid var(--line)',
              background: active ? 'var(--card)' : 'transparent',
              color: active ? 'var(--ink)' : 'var(--muted)',
              fontSize: 11, fontFamily: 'inherit', cursor: 'pointer',
              fontWeight: 500,
            }}>{f.label}</button>
          );
        })}
      </div>

      {/* community CTA — visible when in community tab */}
      {cuisine === 'community' && (
        <div style={{ padding: '14px 24px 0' }}>
          <button onClick={onAdd} style={{
            width: '100%', padding: '14px 16px', borderRadius: 14,
            background: 'transparent', border: '1px dashed ' + accent,
            color: accent, fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
              <span style={{
                width: 22, height: 22, borderRadius: 11, background: accent, color: '#fff',
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 15, lineHeight: 1, paddingBottom: 1,
              }}>+</span>
              Share your own recipe
            </span>
            <span style={{ fontSize: 11, opacity: 0.7, fontStyle: 'italic' }}>walk us through it</span>
          </button>
        </div>
      )}

      {/* list */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '14px 24px 100px',
        display: 'flex', flexDirection: 'column', gap: 18,
      }}>
        {grouped ? grouped.map(g => (
          <div key={g.key}>
            <div style={{
              fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
              color: 'var(--muted)', marginBottom: 8,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            }}>
              <span>{g.label}</span>
              <span style={{ fontVariantNumeric: 'tabular-nums' }}>{g.items.length}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {g.items.map(r => (
                <RecipeCard key={r.id} recipe={r} accent={accent} onTap={() => onPick(r)}/>
              ))}
            </div>
          </div>
        )) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.map(r => (
              <RecipeCard key={r.id} recipe={r} accent={accent} onTap={() => onPick(r)}/>
            ))}
          </div>
        )}

        {filtered.length === 0 && (
          <div style={{
            padding: 40, textAlign: 'center', color: 'var(--muted)',
            fontStyle: 'italic', fontFamily: '"Instrument Serif", serif', fontSize: 18,
          }}>Nothing here yet. Try another filter — or share one of your own.</div>
        )}
      </div>

      {/* FAB — always present */}
      <button onClick={onAdd} aria-label="Share a recipe" style={{
        position: 'absolute', right: 20, bottom: 24,
        width: 56, height: 56, borderRadius: 28,
        background: accent, color: '#fff', border: 'none', cursor: 'pointer',
        boxShadow: '0 8px 22px rgba(192,74,31,0.40), 0 0 0 1px rgba(0,0,0,0.04)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 0, fontSize: 28, lineHeight: 1, fontWeight: 300,
        zIndex: 5,
      }}>
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M9 2v14M2 9h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}

Object.assign(window, { BrowseScreen, RecipeCard, DotDifficulty });
