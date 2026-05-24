// bin-result-screen.jsx — fullscreen colored verdict

const { useState: useS_rs, useEffect: useE_rs, useMemo: useM_rs } = React;

async function askClaude(query, region) {
  const regionHints = {
    NZ: 'New Zealand: nationwide 4-bin system since Feb 2024. Yellow=recycling (plastics 1/2/5 only, paper, card, metal, drink cartons), Green=food+garden, Red=general, separate Glass crate. Soft plastics go to supermarket bins (Countdown/New World). E-waste: TechCollect, Mitre 10, Bunnings. Vapes: Switch-It scheme. Phones: RE:MOBILE. Paint: Resene PaintWise.',
    UK: 'UK: 3-stream (recycling, food waste, general) with separate glass kerbside or bottle banks. Rules vary by council.',
    US: 'US: single-stream recycling dominates. Composting + glass vary by city.',
    AU: 'Australia: yellow recycling, green organics, red general. Container deposit schemes (10c per bottle/can).',
    EU: 'EU: separate collection for paper, plastic, metal, glass, bio-waste. Textile collection mandatory from 2025.',
    CA: 'Canada: province-by-province. Blue box recyclables, green organics in many cities.',
  };
  const prompt = `You are a recycling-advice helper for ${region}. ${regionHints[region] || ''}
The user wants to throw away: "${query}".
Reply with JSON ONLY, no prose, in this exact shape:
{"bin":"<one of: recycling,compost,general,glass,ewaste,hazardous,textiles,special>","name":"<item name capitalised>","tip":"<one short sentence of advice, region-specific>"}
Choose the single best bin for ${region}. Keep the tip under 25 words. Be confident.`;
  try {
    const raw = await window.claude.complete(prompt);
    // Try to extract JSON
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const obj = JSON.parse(m[0]);
    if (!obj.bin || !BINS[obj.bin]) return null;
    return {
      id: 'ai_' + Date.now().toString(36),
      name: obj.name || query,
      bin: obj.bin,
      tip: obj.tip || '',
      aiGenerated: true,
    };
  } catch { return null; }
}

function ResultScreen({ initial, region, accent, onBack, onRemember, onCorrect }) {
  // initial: { query, item }
  const [item, setItem] = useS_rs(initial.item);
  const [pickedBin, setPickedBin] = useS_rs(initial.item?.bin || null);
  const [loading, setLoading] = useS_rs(!initial.item);
  const [aiFailed, setAiFailed] = useS_rs(false);
  const [override, setOverride] = useS_rs(false);
  const [revealed, setRevealed] = useS_rs(false);

  // Fetch AI if no match
  useE_rs(() => {
    let cancelled = false;
    if (!initial.item && initial.query) {
      askClaude(initial.query, region).then(res => {
        if (cancelled) return;
        if (res) { setItem(res); setPickedBin(res.bin); }
        else { setAiFailed(true); setPickedBin('general'); setItem({ name: initial.query, bin: 'general', tip: 'When in doubt, general waste is safest.' }); }
        setLoading(false);
      });
    }
  }, []);

  useE_rs(() => {
    if (!loading) {
      const t = setTimeout(() => setRevealed(true), 30);
      return () => clearTimeout(t);
    }
  }, [loading]);

  useE_rs(() => {
    if (!loading && item && pickedBin) onRemember({ query: initial.query, item, bin: pickedBin });
  }, [loading]);

  const bin = pickedBin ? BINS[pickedBin] : null;
  const activeCondition = useM_rs(() => {
    if (!item?.conditions) return null;
    return item.conditions.find(c => c.bin === pickedBin && pickedBin !== item.bin);
  }, [item, pickedBin]);

  if (loading) {
    return (
      <div style={{
        height: '100%', background: 'var(--bg)', color: 'var(--ink)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '40px 24px', fontFamily: '"Geist", system-ui, sans-serif',
      }}>
        <div style={{
          fontFamily: '"Geist Mono", monospace', fontSize: 11,
          letterSpacing: 1.5, textTransform: 'uppercase', color: 'var(--muted)',
          marginBottom: 14,
        }}>Asking the AI…</div>
        <div style={{
          fontFamily: '"Space Grotesk", system-ui, sans-serif',
          fontSize: 32, fontWeight: 600, lineHeight: 1.1, textAlign: 'center',
          letterSpacing: -1,
        }}>"{initial.query}"</div>
        <div style={{
          marginTop: 24, display: 'flex', gap: 8,
        }}>
          {BIN_ORDER.slice(0, 8).map((k, i) => (
            <div key={k} style={{
              width: 6, height: 24, borderRadius: 1, background: BINS[k].color,
              animation: `binPulse 1.2s ${i * 0.1}s infinite ease-in-out`,
            }}/>
          ))}
        </div>
        <style>{`@keyframes binPulse { 0%, 100% { opacity: 0.3 } 50% { opacity: 1 } }`}</style>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%', position: 'relative',
      background: 'var(--bg)', overflow: 'hidden',
      fontFamily: '"Geist", system-ui, sans-serif',
    }}>
      {/* big colored panel that floods up from below */}
      <div style={{
        position: 'absolute', left: 0, right: 0, bottom: 0,
        height: revealed ? '100%' : '0%',
        background: bin?.color || '#333',
        transition: 'height 600ms cubic-bezier(.2,.8,.2,1)',
      }}/>

      {/* content */}
      <div style={{
        position: 'relative', height: '100%',
        display: 'flex', flexDirection: 'column',
        padding: '54px 24px 30px',
        color: bin?.fg || '#fff',
        opacity: revealed ? 1 : 0,
        transition: 'opacity 400ms 300ms',
      }}>
        {/* top bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button onClick={onBack} style={{
            padding: '8px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)',
            color: 'inherit', fontFamily: 'inherit', fontSize: 12,
            cursor: 'pointer', backdropFilter: 'blur(8px)',
          }}>← Back</button>
          {item?.aiGenerated && (
            <span style={{
              padding: '4px 10px', borderRadius: 4,
              background: 'rgba(255,255,255,0.18)',
              fontFamily: '"Geist Mono", monospace',
              fontSize: 9, letterSpacing: 1.2, textTransform: 'uppercase', fontWeight: 600,
            }}>AI guess</span>
          )}
        </div>

        {/* the verdict */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{
            fontFamily: '"Geist Mono", monospace',
            fontSize: 11, letterSpacing: 2, textTransform: 'uppercase',
            opacity: 0.7, marginBottom: 10,
          }}>For your "{item?.name || initial.query}"</div>

          <div style={{
            fontFamily: '"Space Grotesk", system-ui, sans-serif',
            fontWeight: 700, fontSize: 78, lineHeight: 0.92,
            letterSpacing: -3, marginBottom: 4,
          }}>{region === 'NZ' && bin?.nzLabel ? bin.nzLabel : bin?.label}</div>
          {region === 'NZ' && bin?.nzLabel && (
            <div style={{
              fontFamily: '"Geist Mono", monospace',
              fontSize: 11, letterSpacing: 1.5, textTransform: 'uppercase',
              opacity: 0.65, marginTop: 2, marginBottom: 6,
            }}>aka {bin.label}</div>
          )}

          <div style={{
            fontSize: 16, lineHeight: 1.4, marginTop: 14, opacity: 0.92,
            maxWidth: 320,
          }}>{activeCondition ? activeCondition.tip : (item?.tip || bin?.blurb)}</div>

          {item?.conditions && item.conditions.length > 0 && (
            <div style={{ marginTop: 30 }}>
              <div style={{
                fontFamily: '"Geist Mono", monospace',
                fontSize: 10, letterSpacing: 1.5, textTransform: 'uppercase',
                opacity: 0.7, marginBottom: 10,
              }}>Unless…</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {[{ test: 'Default', bin: item.bin, tip: item.tip }, ...item.conditions].map((c, idx) => {
                  const active = c.bin === pickedBin;
                  return (
                    <button key={idx} onClick={() => setPickedBin(c.bin)} style={{
                      padding: '12px 14px', borderRadius: 10, textAlign: 'left',
                      background: active ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.06)',
                      border: '1px solid ' + (active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)'),
                      color: 'inherit', fontFamily: 'inherit', fontSize: 13,
                      cursor: 'pointer',
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    }}>
                      <span>{c.test}</span>
                      <span style={{
                        padding: '2px 8px', borderRadius: 4,
                        background: BINS[c.bin].color, color: BINS[c.bin].fg,
                        fontFamily: '"Geist Mono", monospace', fontSize: 9,
                        letterSpacing: 0.8, textTransform: 'uppercase', fontWeight: 600,
                      }}>{BINS[c.bin].short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* bottom actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <button onClick={() => setOverride(o => !o)} style={{
            padding: '12px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,0.15)',
            border: '1px solid rgba(255,255,255,0.25)', color: 'inherit',
            fontFamily: 'inherit', fontSize: 13, cursor: 'pointer',
            backdropFilter: 'blur(8px)',
          }}>
            {override ? 'Cancel' : 'Wrong bin? Override'}
          </button>

          {override && (
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
              animation: 'fadeIn 200ms',
            }}>
              {BIN_ORDER.map(k => {
                const b = BINS[k];
                const active = k === pickedBin;
                return (
                  <button key={k} onClick={() => { setPickedBin(k); setOverride(false); onCorrect && onCorrect(initial.query, k); }}
                    style={{
                      padding: '10px 6px', borderRadius: 8, border: 'none',
                      background: active ? b.fg : 'rgba(255,255,255,0.15)',
                      color: active ? b.color : 'inherit',
                      fontFamily: '"Geist Mono", monospace', fontSize: 9,
                      letterSpacing: 0.6, textTransform: 'uppercase', fontWeight: 600,
                      cursor: 'pointer',
                    }}>
                    <div style={{ width: 14, height: 6, background: b.color, borderRadius: 1, margin: '0 auto 4px' }}/>
                    {b.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          )}

          <button onClick={onBack} style={{
            padding: '14px 16px', borderRadius: 10,
            background: bin?.fg, color: bin?.color,
            border: 'none', fontFamily: 'inherit', fontSize: 14, fontWeight: 600,
            cursor: 'pointer',
          }}>Dump another</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ResultScreen });
