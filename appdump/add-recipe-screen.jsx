// add-recipe-screen.jsx — community submission wizard

const { useState: useS_a, useMemo: useM_a, useRef: useR_a } = React;

// ─────────────────────────────────────────────────────────────────
// Small form primitives — visual match to the rest of the app
// ─────────────────────────────────────────────────────────────────
function FieldLabel({ children, hint, required }) {
  return (
    <div style={{ marginBottom: 6 }}>
      <span style={{
        fontSize: 11, letterSpacing: 1, textTransform: 'uppercase',
        color: 'var(--muted)', fontWeight: 500,
      }}>{children}{required && <span style={{ color: 'var(--accent)' }}>*</span>}</span>
      {hint && <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 8, fontStyle: 'italic' }}>{hint}</span>}
    </div>
  );
}

function TextField({ value, onChange, placeholder, multiline, rows = 3 }) {
  const common = {
    width: '100%', padding: '10px 12px', borderRadius: 10,
    border: '1px solid var(--line)', background: 'var(--card)',
    color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14,
    outline: 'none', boxSizing: 'border-box',
  };
  if (multiline) {
    return <textarea value={value} onChange={e => onChange(e.target.value)}
      placeholder={placeholder} rows={rows} style={{ ...common, resize: 'vertical', lineHeight: 1.4 }}/>;
  }
  return <input type="text" value={value} onChange={e => onChange(e.target.value)}
    placeholder={placeholder} style={common}/>;
}

function NumberField({ value, onChange, placeholder, suffix }) {
  return (
    <div style={{ position: 'relative' }}>
      <input type="number" value={value === 0 ? '' : value}
        onChange={e => onChange(e.target.value === '' ? '' : Number(e.target.value))}
        placeholder={placeholder} style={{
          width: '100%', padding: '10px 12px', paddingRight: suffix ? 56 : 12,
          borderRadius: 10, border: '1px solid var(--line)', background: 'var(--card)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14,
          outline: 'none', boxSizing: 'border-box',
          fontVariantNumeric: 'tabular-nums',
        }}/>
      {suffix && (
        <span style={{
          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
          fontSize: 12, color: 'var(--muted)',
        }}>{suffix}</span>
      )}
    </div>
  );
}

function ChipChoice({ value, onChange, options }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
      {options.map(o => {
        const active = value === o.value;
        return (
          <button key={o.value} type="button" onClick={() => onChange(o.value)} style={{
            padding: '8px 14px', borderRadius: 999,
            border: '1px solid ' + (active ? 'transparent' : 'var(--line)'),
            background: active ? 'var(--ink)' : 'transparent',
            color: active ? 'var(--bg)' : 'var(--ink)',
            fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
            cursor: 'pointer',
          }}>{o.label}</button>
        );
      })}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Wizard steps
// ─────────────────────────────────────────────────────────────────
function BasicsStep({ draft, set }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div>
        <FieldLabel required>Dish name</FieldLabel>
        <TextField value={draft.name} onChange={v => set({ name: v })}
          placeholder="Spicy peanut noodles"/>
      </div>
      <div>
        <FieldLabel hint="A short, evocative line">One-liner</FieldLabel>
        <TextField value={draft.blurb} onChange={v => set({ blurb: v })}
          placeholder="Crunchy, gingery, ten minutes flat."/>
      </div>
      <div>
        <FieldLabel>Your name</FieldLabel>
        <TextField value={draft.author} onChange={v => set({ author: v })}
          placeholder="Alex"/>
      </div>
      <div>
        <FieldLabel required>Cuisine</FieldLabel>
        <ChipChoice value={draft.cuisine} onChange={v => set({ cuisine: v })}
          options={Object.entries(CUISINES)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([k, m]) => ({ value: k, label: m.label }))}/>
      </div>
      <div>
        <FieldLabel required>How hard is it?</FieldLabel>
        <ChipChoice value={draft.difficulty} onChange={v => set({ difficulty: v })}
          options={[
            { value: 'easy',   label: 'Easy' },
            { value: 'medium', label: 'A bit harder' },
            { value: 'hard',   label: 'Step it up' },
          ]}/>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        <div>
          <FieldLabel>Serves</FieldLabel>
          <NumberField value={draft.serves} onChange={v => set({ serves: v })}
            placeholder="2"/>
        </div>
        <div>
          <FieldLabel>Total time</FieldLabel>
          <NumberField value={draft.totalMinutes} onChange={v => set({ totalMinutes: v })}
            placeholder="20" suffix="min"/>
        </div>
        <div>
          <FieldLabel>Active</FieldLabel>
          <NumberField value={draft.activeMinutes} onChange={v => set({ activeMinutes: v })}
            placeholder="15" suffix="min"/>
        </div>
      </div>
    </div>
  );
}

function IngredientsStep({ draft, set }) {
  const update = (idx, patch) => {
    const next = draft.ingredients.slice();
    next[idx] = { ...next[idx], ...patch };
    set({ ingredients: next });
  };
  const add = () => set({ ingredients: [...draft.ingredients, { what: '', qty: '' }] });
  const remove = (idx) => set({ ingredients: draft.ingredients.filter((_, i) => i !== idx) });

  return (
    <div>
      <FieldLabel hint="Everything you'll need on the counter">Ingredients</FieldLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {draft.ingredients.map((ing, i) => (
          <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <div style={{ flex: 2 }}>
              <TextField value={ing.what} onChange={v => update(i, { what: v })}
                placeholder="Soy sauce"/>
            </div>
            <div style={{ flex: 1 }}>
              <TextField value={ing.qty} onChange={v => update(i, { qty: v })}
                placeholder="2 tbsp"/>
            </div>
            <button type="button" onClick={() => remove(i)} style={{
              width: 32, height: 32, borderRadius: 16, flexShrink: 0,
              background: 'transparent', border: '1px solid var(--line)',
              color: 'var(--muted)', cursor: 'pointer', padding: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
            </button>
          </div>
        ))}
      </div>
      <button type="button" onClick={add} style={{
        marginTop: 10, padding: '10px 14px', borderRadius: 10,
        background: 'transparent', border: '1px dashed var(--line)',
        color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13,
        cursor: 'pointer', width: '100%',
      }}>+ Add ingredient</button>

      <div style={{ marginTop: 24 }}>
        <FieldLabel hint="Optional — pans, knives, blenders">Tools</FieldLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {(draft.tools || []).map((tool, i) => (
            <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <TextField value={tool} onChange={v => {
                  const next = draft.tools.slice(); next[i] = v; set({ tools: next });
                }} placeholder="Non-stick frying pan"/>
              </div>
              <button type="button" onClick={() => set({ tools: draft.tools.filter((_, j) => j !== i) })} style={{
                width: 32, height: 32, borderRadius: 16, flexShrink: 0,
                background: 'transparent', border: '1px solid var(--line)',
                color: 'var(--muted)', cursor: 'pointer', padding: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="10" height="10" viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => set({ tools: [...(draft.tools || []), ''] })} style={{
          marginTop: 10, padding: '10px 14px', borderRadius: 10,
          background: 'transparent', border: '1px dashed var(--line)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13,
          cursor: 'pointer', width: '100%',
        }}>+ Add tool</button>
      </div>
    </div>
  );
}

function StepEditor({ step, idx, onChange, onRemove, expanded, onToggle }) {
  const set = (patch) => onChange({ ...step, ...patch });
  return (
    <div style={{
      background: 'var(--card)', border: '1px solid var(--line)',
      borderRadius: 14, overflow: 'hidden',
    }}>
      <div onClick={onToggle} style={{
        padding: '12px 14px', display: 'flex', alignItems: 'center', gap: 10,
        cursor: 'pointer',
      }}>
        <div style={{
          width: 24, height: 24, borderRadius: 12, flexShrink: 0,
          background: 'var(--bg)', border: '1px solid var(--line)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 11, color: 'var(--muted)',
        }}>{idx + 1}</div>
        <span style={{ flex: 1, fontSize: 14, color: step.title ? 'var(--ink)' : 'var(--muted)' }}>
          {step.title || 'Untitled step'}
        </span>
        <span style={{ fontSize: 10, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.8 }}>
          {step.kind || 'active'}{step.kind === 'timed' && step.minutes ? ` · ${step.minutes}m` : ''}
        </span>
        <svg width="10" height="10" viewBox="0 0 10 10" style={{
          transform: expanded ? 'rotate(180deg)' : 'rotate(0)',
          transition: 'transform 200ms', color: 'var(--muted)',
        }}>
          <path d="M2 3l3 3 3-3" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      {expanded && (
        <div style={{ padding: '0 14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div>
            <FieldLabel required>What to do (short)</FieldLabel>
            <TextField value={step.title} onChange={v => set({ title: v })}
              placeholder="Crack the eggs"/>
          </div>
          <div>
            <FieldLabel hint="Full instruction in plain language">Details</FieldLabel>
            <TextField multiline rows={3} value={step.body} onChange={v => set({ body: v })}
              placeholder="Crack three eggs into a bowl. Whisk gently for 20 seconds…"/>
          </div>
          <div>
            <FieldLabel>Kind of step</FieldLabel>
            <ChipChoice value={step.kind} onChange={v => set({ kind: v })}
              options={[
                { value: 'active', label: 'Active' },
                { value: 'timed',  label: 'Timed' },
                { value: 'wait',   label: 'Wait / rest' },
                { value: 'heat',   label: 'Heat change' },
              ]}/>
          </div>

          {(step.kind === 'timed' || step.kind === 'wait') && (
            <div>
              <FieldLabel>Duration</FieldLabel>
              <NumberField value={step.minutes || ''}
                onChange={v => set({ minutes: v })}
                placeholder="5" suffix="min"/>
            </div>
          )}

          <div>
            <FieldLabel hint="Optional — only if stove/oven heat matters">Heat level</FieldLabel>
            <ChipChoice value={step.heat || ''} onChange={v => set({ heat: v === step.heat ? '' : v })}
              options={[
                { value: 'low',      label: 'Low' },
                { value: 'medium',   label: 'Med' },
                { value: 'med-high', label: 'Med-high' },
                { value: 'high',     label: 'High' },
              ]}/>
          </div>

          <div>
            <FieldLabel hint="Optional — a sensory check">Look for</FieldLabel>
            <TextField multiline rows={2} value={step.cue || ''} onChange={v => set({ cue: v })}
              placeholder="Bubbles form on top, edges set"/>
          </div>

          <div>
            <FieldLabel hint="Optional — reassurance or warning">Beginner tip</FieldLabel>
            <TextField multiline rows={2} value={step.tip || ''} onChange={v => set({ tip: v })}
              placeholder="Don't worry if it sticks — the heat needs a minute"/>
          </div>

          <button type="button" onClick={onRemove} style={{
            padding: '8px 12px', borderRadius: 999, background: 'transparent',
            border: '1px solid var(--line)', color: 'var(--muted)',
            fontFamily: 'inherit', fontSize: 12, cursor: 'pointer',
            alignSelf: 'flex-start',
          }}>Remove this step</button>
        </div>
      )}
    </div>
  );
}

function StepsStep({ draft, set }) {
  const [openIdx, setOpenIdx] = useS_a(0);
  const update = (idx, val) => {
    const next = draft.steps.slice(); next[idx] = val;
    set({ steps: next });
  };
  const add = () => {
    set({ steps: [...draft.steps, { title: '', body: '', kind: 'active' }] });
    setOpenIdx(draft.steps.length);
  };
  const remove = (idx) => {
    set({ steps: draft.steps.filter((_, i) => i !== idx) });
    if (openIdx >= idx) setOpenIdx(Math.max(0, openIdx - 1));
  };

  return (
    <div>
      <FieldLabel hint="One thing per step. Beginners love clarity.">Method</FieldLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {draft.steps.map((s, i) => (
          <StepEditor key={i} step={s} idx={i}
            onChange={(v) => update(i, v)}
            onRemove={() => remove(i)}
            expanded={openIdx === i}
            onToggle={() => setOpenIdx(openIdx === i ? -1 : i)}/>
        ))}
      </div>
      <button type="button" onClick={add} style={{
        marginTop: 10, padding: '12px 14px', borderRadius: 10,
        background: 'var(--ink)', border: 'none', color: 'var(--bg)',
        fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
        cursor: 'pointer', width: '100%',
      }}>+ Add step</button>
    </div>
  );
}

function ReviewStep({ draft, accent }) {
  const meta = DIFFICULTY_META[draft.difficulty];
  const cuisineLabel = CUISINES[draft.cuisine]?.label;
  return (
    <div>
      <div style={{
        background: 'var(--card)', border: '1px solid var(--line)',
        borderRadius: 18, padding: '20px 18px',
      }}>
        <div style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: accent, fontWeight: 600, marginBottom: 10,
        }}>From the community</div>
        <h2 style={{
          margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 30, lineHeight: 1.05,
        }}>{draft.name || 'Untitled dish'}</h2>
        <p style={{
          margin: '6px 0 0', fontSize: 14, color: 'var(--muted)',
          fontStyle: 'italic', fontFamily: '"Instrument Serif", serif', fontSize: 16,
        }}>{draft.blurb}</p>
        <div style={{
          display: 'flex', gap: 10, alignItems: 'center', marginTop: 10,
          fontSize: 11, color: 'var(--muted)', flexWrap: 'wrap',
        }}>
          {cuisineLabel && (
            <span style={{
              padding: '2px 7px', borderRadius: 4, border: '1px solid var(--line)',
              fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 500,
              color: 'var(--ink)',
            }}>{cuisineLabel}</span>
          )}
          {meta && <span>{meta.label}</span>}
          <span style={{ width: 3, height: 3, borderRadius: 3, background: 'var(--line)' }}/>
          <span>{draft.totalMinutes || 0} min</span>
          <span style={{ width: 3, height: 3, borderRadius: 3, background: 'var(--line)' }}/>
          <span>serves {draft.serves || 1}</span>
        </div>
        {draft.author && (
          <div style={{
            marginTop: 14, padding: '8px 0 0', borderTop: '1px dashed var(--line)',
            fontSize: 12, color: 'var(--muted)',
          }}>by {draft.author}</div>
        )}
      </div>

      <div style={{
        marginTop: 14, fontSize: 12, color: 'var(--muted)',
        display: 'flex', justifyContent: 'space-between',
      }}>
        <span>{draft.ingredients?.length || 0} ingredients</span>
        <span>{(draft.tools || []).length} tools</span>
        <span>{draft.steps?.length || 0} steps</span>
      </div>

      <div style={{
        marginTop: 22, padding: 12, borderRadius: 12,
        background: 'transparent', border: '1px dashed var(--line)',
        fontSize: 12, color: 'var(--muted)', lineHeight: 1.5,
      }}>
        Once you publish, this recipe shows up in <strong>Community</strong> for everyone in the app to cook. You can edit or remove it from your recipe page anytime.
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// Wizard shell
// ─────────────────────────────────────────────────────────────────
const BLANK_DRAFT = {
  name: '', blurb: '', author: '',
  cuisine: 'classics', difficulty: 'easy',
  serves: 2, totalMinutes: 20, activeMinutes: 15,
  ingredients: [{ what: '', qty: '' }],
  tools: [],
  steps: [{ title: '', body: '', kind: 'active' }],
};

const STEPS = [
  { id: 'basics',     label: 'Basics' },
  { id: 'ingredients',label: 'Ingredients' },
  { id: 'steps',      label: 'Method' },
  { id: 'review',     label: 'Review' },
];

function AddRecipeScreen({ accent, editing, onCancel, onPublish, onDelete }) {
  const [draft, setDraft] = useS_a(() => editing ? {
    ...BLANK_DRAFT, ...editing,
    ingredients: editing.ingredients?.length ? editing.ingredients : BLANK_DRAFT.ingredients,
    steps: editing.steps?.length ? editing.steps : BLANK_DRAFT.steps,
  } : BLANK_DRAFT);
  const [stepIdx, setStepIdx] = useS_a(0);
  const set = (patch) => setDraft(d => ({ ...d, ...patch }));

  const stepValid = useM_a(() => {
    if (stepIdx === 0) return !!draft.name && !!draft.cuisine && !!draft.difficulty;
    if (stepIdx === 1) return draft.ingredients.some(i => i.what.trim());
    if (stepIdx === 2) return draft.steps.some(s => s.title.trim());
    return true;
  }, [draft, stepIdx]);

  const publish = () => {
    const cleaned = {
      ...draft,
      id: editing?.id || 'user_' + Date.now().toString(36),
      community: true,
      ingredients: draft.ingredients.filter(i => i.what.trim()),
      tools: (draft.tools || []).filter(t => t.trim()),
      steps: draft.steps.filter(s => s.title.trim()).map(s => {
        const out = { title: s.title, body: s.body, kind: s.kind || 'active' };
        if (s.minutes) out.minutes = Number(s.minutes);
        if (s.heat) out.heat = s.heat;
        if (s.cue) out.cue = s.cue;
        if (s.tip) out.tip = s.tip;
        return out;
      }),
      totalMinutes: Number(draft.totalMinutes) || 0,
      activeMinutes: Number(draft.activeMinutes) || 0,
      serves: Number(draft.serves) || 1,
      tags: draft.tags || [],
      blurb: draft.blurb || 'A community favourite.',
    };
    onPublish(cleaned);
  };

  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      position: 'relative',
    }}>
      {/* header */}
      <div style={{
        padding: '54px 16px 0',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <button onClick={onCancel} style={{
          padding: '8px 12px', borderRadius: 999,
          background: 'transparent', border: '1px solid var(--line)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13,
          cursor: 'pointer',
        }}>Cancel</button>
        <div style={{
          fontSize: 12, color: 'var(--muted)', fontWeight: 500,
        }}>{editing ? 'Edit recipe' : 'Share a recipe'}</div>
        {editing ? (
          <button onClick={onDelete} style={{
            padding: '8px 12px', borderRadius: 999,
            background: 'transparent', border: '1px solid var(--line)',
            color: 'var(--accent)', fontFamily: 'inherit', fontSize: 13,
            cursor: 'pointer',
          }}>Delete</button>
        ) : <div style={{ width: 60 }}/>}
      </div>

      {/* step indicator */}
      <div style={{
        display: 'flex', gap: 4, padding: '14px 24px 0',
      }}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= stepIdx ? accent : 'var(--line)',
          }}/>
        ))}
      </div>

      {/* content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px 120px' }}>
        <div style={{
          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 4,
        }}>Step {stepIdx + 1} of {STEPS.length}</div>
        <h1 style={{
          margin: '0 0 18px', fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 32, lineHeight: 1,
        }}>
          {stepIdx === 0 ? 'Tell us about your dish'
           : stepIdx === 1 ? 'What goes in?'
           : stepIdx === 2 ? 'How do you make it?'
           : 'Look good?'}
        </h1>

        {stepIdx === 0 && <BasicsStep draft={draft} set={set}/>}
        {stepIdx === 1 && <IngredientsStep draft={draft} set={set}/>}
        {stepIdx === 2 && <StepsStep draft={draft} set={set}/>}
        {stepIdx === 3 && <ReviewStep draft={draft} accent={accent}/>}
      </div>

      {/* bottom nav */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 30px',
        background: 'linear-gradient(to top, var(--bg) 70%, rgba(0,0,0,0))',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button onClick={() => stepIdx > 0 ? setStepIdx(stepIdx - 1) : onCancel()} style={{
          flexShrink: 0, padding: '14px 18px', borderRadius: 999,
          background: 'transparent', border: '1px solid var(--line)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 14,
          cursor: 'pointer',
        }}>{stepIdx === 0 ? 'Cancel' : 'Back'}</button>

        {stepIdx < STEPS.length - 1 ? (
          <button onClick={() => setStepIdx(stepIdx + 1)} disabled={!stepValid} style={{
            flex: 1, padding: '14px 20px', borderRadius: 999,
            background: stepValid ? 'var(--ink)' : 'var(--line)',
            color: 'var(--bg)', border: 'none',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
            cursor: stepValid ? 'pointer' : 'default',
            opacity: stepValid ? 1 : 0.6,
          }}>Next: {STEPS[stepIdx + 1].label}</button>
        ) : (
          <button onClick={publish} style={{
            flex: 1, padding: '14px 20px', borderRadius: 999,
            background: accent, color: '#fff', border: 'none',
            fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
            cursor: 'pointer',
            boxShadow: '0 6px 18px rgba(192,74,31,0.30)',
          }}>{editing ? 'Save changes' : 'Publish recipe'}</button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { AddRecipeScreen });
