// cook-step-screen.jsx — step-by-step cook view with timer + help

const { useState: useS_c, useEffect: useE_c, useRef: useR_c } = React;

function HelpSheet({ open, recipe, step, onClose }) {
  const [q, setQ] = useS_c('');
  const [a, setA] = useS_c('');
  const [loading, setLoading] = useS_c(false);

  const ask = async (text) => {
    if (!text.trim()) return;
    setLoading(true); setA('');
    try {
      const prompt = `You are a kind cooking coach speaking to a complete beginner who is mid-recipe. They are making "${recipe.name}". The current step is: "${step.title}: ${step.body}". They ask: "${text}". Give a short, reassuring, plain-language answer in 2-3 sentences. No lists. No emoji.`;
      const reply = await window.claude.complete(prompt);
      setA(reply);
    } catch (e) {
      setA('Sorry — couldn\u2019t reach the kitchen brain. Try again in a moment.');
    } finally { setLoading(false); }
  };

  if (!open) return null;
  return (
    <div onClick={onClose} style={{
      position: 'absolute', inset: 0, zIndex: 40,
      background: 'rgba(15,10,5,0.4)',
      display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
      animation: 'fadeIn 200ms',
    }}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--bg)', borderRadius: '24px 24px 0 0',
        padding: '12px 24px 28px',
        maxHeight: '78%', overflowY: 'auto',
        animation: 'slideUp 320ms cubic-bezier(.2,.8,.2,1)',
      }}>
        <div style={{ width: 36, height: 4, background: 'var(--line)', borderRadius: 2, margin: '0 auto 14px' }}/>
        <div style={{
          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)',
        }}>Stuck? Ask the kitchen</div>
        <h3 style={{
          margin: '4px 0 14px', fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 26, lineHeight: 1.1,
        }}>What\u2019s on your mind?</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            'How do I know it\u2019s done?',
            'I think I burned it — what now?',
            'Can I substitute the butter?',
            'Is the heat too high?',
          ].map((t, i) => (
            <button key={i} onClick={() => { setQ(t); ask(t); }} style={{
              padding: '10px 14px', borderRadius: 12, textAlign: 'left',
              background: 'var(--card)', border: '1px solid var(--line)',
              fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
              color: 'var(--ink)',
            }}>{t}</button>
          ))}
        </div>

        <div style={{ marginTop: 14, display: 'flex', gap: 8 }}>
          <input value={q} onChange={e => setQ(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && ask(q)}
            placeholder="Or type your own question…"
            style={{
              flex: 1, padding: '12px 14px', borderRadius: 12,
              border: '1px solid var(--line)', background: 'var(--card)',
              fontFamily: 'inherit', fontSize: 13, color: 'var(--ink)',
              outline: 'none',
            }}/>
          <button onClick={() => ask(q)} disabled={loading || !q.trim()} style={{
            padding: '0 16px', borderRadius: 12, background: 'var(--ink)', color: 'var(--bg)',
            border: 'none', fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
            opacity: loading || !q.trim() ? 0.4 : 1,
          }}>Ask</button>
        </div>

        {(loading || a) && (
          <div style={{
            marginTop: 16, padding: 16, borderRadius: 14,
            background: 'var(--card)', border: '1px solid var(--line)',
            fontSize: 14, lineHeight: 1.5, color: 'var(--ink)',
            minHeight: 60,
          }}>
            {loading
              ? <span style={{ color: 'var(--muted)', fontStyle: 'italic' }}>thinking…</span>
              : a}
          </div>
        )}
      </div>
    </div>
  );
}

function StepProgress({ steps, currentIdx, accent }) {
  return (
    <div style={{ display: 'flex', gap: 4, padding: '0 24px', marginTop: 8 }}>
      {steps.map((s, i) => (
        <div key={i} style={{
          flex: 1, height: 3, borderRadius: 2,
          background: i < currentIdx ? '#2B5F3B'
                    : i === currentIdx ? accent
                    : 'var(--line)',
        }}/>
      ))}
    </div>
  );
}

function HeatPill({ heat }) {
  const m = {
    low:        { label: 'Low',         color: '#3B7C5F' },
    medium:     { label: 'Medium',      color: '#A8623B' },
    'med-high': { label: 'Medium-high', color: '#C04A1F' },
    high:       { label: 'High',        color: '#7C2230' },
  }[heat];
  if (!m) return null;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6,
      padding: '4px 10px', borderRadius: 999,
      background: m.color, color: '#fff',
      fontSize: 11, fontWeight: 500, letterSpacing: 0.3,
    }}>
      <svg width="10" height="10" viewBox="0 0 14 14">
        <path d="M7 1c1 2 3 3 3 6a3 3 0 11-6 0c0-1 .5-2 1-2.5C5.5 5.5 7 3.5 7 1z"
          fill="currentColor"/>
      </svg>
      {m.label} heat
    </span>
  );
}

function BigTimer({ totalSec, remainingSec, accent, paused }) {
  const pct = totalSec > 0 ? (remainingSec / totalSec) : 0;
  const R = 78, C = 2 * Math.PI * R;
  const dash = C * pct;
  return (
    <div style={{ position: 'relative', width: 200, height: 200, margin: '0 auto' }}>
      <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="100" cy="100" r={R} stroke="var(--line)" strokeWidth="6" fill="none"/>
        <circle cx="100" cy="100" r={R} stroke={accent} strokeWidth="6" fill="none"
          strokeDasharray={`${dash} ${C}`} strokeLinecap="round"
          style={{ transition: 'stroke-dasharray 200ms linear' }}/>
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{
          fontFamily: '"Instrument Serif", serif', fontSize: 52,
          lineHeight: 1, fontVariantNumeric: 'tabular-nums',
          color: paused ? 'var(--muted)' : 'var(--ink)',
        }}>{fmtCountdown(remainingSec * 1000)}</div>
        <div style={{
          fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginTop: 4,
        }}>{paused ? 'paused' : 'remaining'}</div>
      </div>
    </div>
  );
}

function CookStepScreen({ recipe, accent, onExit, onDone }) {
  const [idx, setIdx] = useS_c(0);
  const [timerStartedAt, setTimerStartedAt] = useS_c(null);
  const [timerElapsed, setTimerElapsed] = useS_c(0);  // seconds
  const [paused, setPaused] = useS_c(false);
  const [help, setHelp] = useS_c(false);
  const [stepDone, setStepDone] = useS_c({}); // {idx: true}
  const rafRef = useR_c();
  const lastTickRef = useR_c(null);

  const step = recipe.steps[idx];
  const totalSec = step?.minutes ? Math.round(step.minutes * 60) : 0;
  const remainingSec = Math.max(0, totalSec - timerElapsed);
  const timed = step?.kind === 'timed' || step?.kind === 'wait';
  const expired = timed && timerStartedAt && remainingSec === 0;

  // run rAF for live timer
  useE_c(() => {
    if (!timerStartedAt || paused || !timed) {
      lastTickRef.current = null;
      return;
    }
    const tick = (t) => {
      if (lastTickRef.current == null) lastTickRef.current = t;
      const dt = (t - lastTickRef.current) / 1000;
      lastTickRef.current = t;
      setTimerElapsed(prev => Math.min(totalSec, prev + dt));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(rafRef.current); lastTickRef.current = null; };
  }, [timerStartedAt, paused, timed, totalSec]);

  // beep when expired
  useE_c(() => {
    if (!expired) return;
    try {
      const ac = new (window.AudioContext || window.webkitAudioContext)();
      const o = ac.createOscillator();
      const g = ac.createGain();
      o.connect(g); g.connect(ac.destination);
      o.frequency.value = 880; g.gain.value = 0.07;
      o.start(); o.stop(ac.currentTime + 0.18);
      setTimeout(() => { try { ac.close(); } catch {} }, 400);
    } catch {}
  }, [expired]);

  const goNext = () => {
    setStepDone(prev => ({ ...prev, [idx]: true }));
    if (idx >= recipe.steps.length - 1) { onDone(); return; }
    setIdx(idx + 1);
    setTimerStartedAt(null); setTimerElapsed(0); setPaused(false);
  };
  const goPrev = () => {
    if (idx === 0) return;
    setIdx(idx - 1);
    setTimerStartedAt(null); setTimerElapsed(0); setPaused(false);
  };
  const startTimer = () => {
    setTimerStartedAt(Date.now()); setTimerElapsed(0); setPaused(false);
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
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <button onClick={onExit} style={{
          padding: '8px 12px', borderRadius: 999,
          background: 'transparent', border: '1px solid var(--line)',
          color: 'var(--ink)', fontFamily: 'inherit', fontSize: 13,
          cursor: 'pointer',
        }}>Exit</button>
        <div style={{
          fontSize: 12, color: 'var(--muted)', textAlign: 'center',
          fontVariantNumeric: 'tabular-nums', letterSpacing: 0.3,
        }}>
          <div style={{ fontWeight: 500, color: 'var(--ink)' }}>{recipe.name}</div>
          <div>Step {idx + 1} of {recipe.steps.length}</div>
        </div>
        <button onClick={() => setHelp(true)} style={{
          padding: '8px 12px', borderRadius: 999,
          background: 'var(--ink)', border: 'none',
          color: 'var(--bg)', fontFamily: 'inherit', fontSize: 13,
          cursor: 'pointer', fontWeight: 500,
        }}>Help</button>
      </div>

      <StepProgress steps={recipe.steps} currentIdx={idx} accent={accent}/>

      {/* main content */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '24px 24px 160px',
        display: 'flex', flexDirection: 'column', gap: 16,
      }}>
        {/* kind + heat row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
            color: 'var(--muted)',
          }}>
            <StepKindIcon kind={step.kind}/>
            {step.kind === 'timed' ? 'Timed step'
             : step.kind === 'wait' ? 'Waiting'
             : step.kind === 'heat' ? 'Heat change'
             : 'Active step'}
          </span>
          {step.heat && <HeatPill heat={step.heat}/>}
        </div>

        {/* title */}
        <h2 style={{
          margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 38, lineHeight: 1.05, letterSpacing: -0.3,
        }}>{step.title}</h2>

        {/* body */}
        <p style={{
          margin: 0, fontSize: 17, lineHeight: 1.45,
          color: 'var(--ink)',
        }}>{step.body}</p>

        {/* timer */}
        {timed && (
          <div style={{
            background: 'var(--card)', border: '1px solid var(--line)',
            borderRadius: 20, padding: '24px 16px',
          }}>
            <BigTimer totalSec={totalSec} remainingSec={remainingSec} accent={accent} paused={paused}/>
            <div style={{
              display: 'flex', justifyContent: 'center', gap: 10,
              marginTop: 16,
            }}>
              {!timerStartedAt ? (
                <button onClick={startTimer} style={{
                  padding: '12px 28px', borderRadius: 999,
                  background: accent, color: '#fff', border: 'none',
                  fontFamily: 'inherit', fontSize: 14, fontWeight: 500,
                  cursor: 'pointer', boxShadow: '0 4px 14px rgba(192,74,31,0.25)',
                }}>Start timer · {fmtDuration(step.minutes)}</button>
              ) : (
                <React.Fragment>
                  <button onClick={() => setPaused(p => !p)} style={{
                    padding: '10px 18px', borderRadius: 999,
                    background: 'var(--ink)', color: 'var(--bg)', border: 'none',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer',
                  }}>{paused ? 'Resume' : 'Pause'}</button>
                  <button onClick={() => { setTimerStartedAt(null); setTimerElapsed(0); setPaused(false); }} style={{
                    padding: '10px 18px', borderRadius: 999,
                    background: 'transparent', color: 'var(--ink)',
                    border: '1px solid var(--line)',
                    fontFamily: 'inherit', fontSize: 13, fontWeight: 500,
                    cursor: 'pointer',
                  }}>Reset</button>
                </React.Fragment>
              )}
            </div>
            {expired && (
              <div style={{
                marginTop: 14, padding: '10px 14px', borderRadius: 12,
                background: accent, color: '#fff',
                fontSize: 13, textAlign: 'center', fontWeight: 500,
              }}>Time's up! Check the cue below before moving on.</div>
            )}
          </div>
        )}

        {/* cue card */}
        {step.cue && (
          <div style={{
            display: 'flex', gap: 10, padding: '14px 16px',
            border: '1px solid var(--line)', borderLeft: '3px solid ' + accent,
            background: 'var(--card)', borderRadius: 12,
          }}>
            <div style={{
              fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase',
              color: accent, fontWeight: 600, flexShrink: 0, paddingTop: 2,
            }}>Look for</div>
            <div style={{ fontSize: 14, lineHeight: 1.5, fontStyle: 'italic',
              fontFamily: '"Instrument Serif", serif', fontSize: 16,
            }}>
              {step.cue}
            </div>
          </div>
        )}

        {/* tip */}
        {step.tip && (
          <div style={{
            padding: '12px 16px', borderRadius: 12,
            background: 'rgba(255,255,255,0.0)',
            border: '1px dashed var(--line)',
            display: 'flex', gap: 10,
          }}>
            <span style={{
              fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase',
              color: 'var(--muted)', fontWeight: 600, flexShrink: 0, paddingTop: 2,
            }}>Tip</span>
            <span style={{ fontSize: 13, lineHeight: 1.5, color: 'var(--muted)' }}>
              {step.tip}
            </span>
          </div>
        )}

        {step.tool && (
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Tool: {step.tool}
          </div>
        )}

        {/* next-up peek */}
        {idx < recipe.steps.length - 1 && (
          <div style={{
            marginTop: 8, padding: '12px 14px',
            background: 'transparent', border: '1px solid var(--line)',
            borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10,
            opacity: 0.85,
          }}>
            <div style={{
              fontSize: 9, letterSpacing: 1.3, textTransform: 'uppercase',
              color: 'var(--muted)',
            }}>Next</div>
            <div style={{
              fontSize: 13, color: 'var(--ink)', fontWeight: 500, flex: 1,
            }}>{recipe.steps[idx + 1].title}</div>
            <StepKindIcon kind={recipe.steps[idx + 1].kind}/>
          </div>
        )}
      </div>

      {/* bottom controls */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0,
        padding: '14px 20px 30px',
        background: 'linear-gradient(to top, var(--bg) 65%, rgba(0,0,0,0))',
        display: 'flex', gap: 10, alignItems: 'center',
      }}>
        <button onClick={goPrev} disabled={idx === 0} style={{
          width: 52, height: 52, borderRadius: 26,
          background: 'var(--card)', border: '1px solid var(--line)',
          color: 'var(--ink)', cursor: idx === 0 ? 'default' : 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 0, opacity: idx === 0 ? 0.35 : 1,
        }}>
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <button onClick={goNext} style={{
          flex: 1, height: 52, borderRadius: 26,
          background: 'var(--ink)', color: 'var(--bg)',
          border: 'none', fontFamily: 'inherit', fontSize: 15, fontWeight: 500,
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          {idx === recipe.steps.length - 1 ? 'Finish' : 'Done, what\u2019s next'}
          <svg width="14" height="14" viewBox="0 0 14 14"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <HelpSheet open={help} recipe={recipe} step={step} onClose={() => setHelp(false)}/>
    </div>
  );
}

function DoneScreen({ recipe, accent, onAgain, onHome }) {
  return (
    <div style={{
      height: '100%', background: 'var(--bg)', color: 'var(--ink)',
      display: 'flex', flexDirection: 'column',
      fontFamily: '"Geist", -apple-system, system-ui, sans-serif',
      padding: '54px 24px 32px',
    }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <div style={{
          fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
          color: 'var(--muted)', marginBottom: 10,
        }}>You did it</div>
        <h1 style={{
          margin: 0, fontFamily: '"Instrument Serif", serif', fontWeight: 400,
          fontSize: 56, lineHeight: 1, letterSpacing: -0.5,
        }}>Plate up.</h1>
        <p style={{
          margin: '14px 0 0', fontSize: 17, lineHeight: 1.45, color: 'var(--ink)',
          maxWidth: 320,
        }}>
          Your <em style={{ fontFamily: '"Instrument Serif", serif', fontSize: 19 }}>{recipe.name.toLowerCase()}</em> is ready.
          Eat it warm. Don\u2019t forget the photo.
        </p>

        <div style={{
          marginTop: 28, padding: 16, borderRadius: 16,
          background: 'var(--card)', border: '1px solid var(--line)',
        }}>
          <div style={{
            fontSize: 10, letterSpacing: 1.3, textTransform: 'uppercase',
            color: accent, fontWeight: 600, marginBottom: 8,
          }}>Tonight\u2019s lesson</div>
          <div style={{ fontSize: 14, lineHeight: 1.5 }}>
            Next time, try cooking it with someone watching. Teaching it locks it in. You\u2019ll be surprised how much you remember.
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={onAgain} style={{
          width: '100%', background: accent, color: '#fff', border: 'none',
          borderRadius: 999, padding: '16px 20px',
          fontFamily: 'inherit', fontSize: 15, fontWeight: 500, cursor: 'pointer',
          boxShadow: '0 6px 18px rgba(192,74,31,0.25)',
        }}>Cook this again</button>
        <button onClick={onHome} style={{
          width: '100%', background: 'transparent', color: 'var(--ink)',
          border: '1px solid var(--line)',
          borderRadius: 999, padding: '14px 20px',
          fontFamily: 'inherit', fontSize: 14, cursor: 'pointer',
        }}>Find another recipe</button>
      </div>
    </div>
  );
}

Object.assign(window, { CookStepScreen, DoneScreen, HelpSheet });
