// bin-app.jsx — root for DUMP?

const { useState: useS_ap, useEffect: useE_ap } = React;

const PALETTES_BIN = {
  paper:    { bg: '#F5F1E8', card: '#FFFFFF', ink: '#141210', muted: '#6E6962', line: '#E3DCCB' },
  cool:     { bg: '#EEEDE8', card: '#FFFFFF', ink: '#101418', muted: '#65696D', line: '#DDDDD8' },
  dark:     { bg: '#161413', card: '#221E1B', ink: '#F2EDE4', muted: '#9A9088', line: '#332C28' },
};

const TWEAK_DEFAULTS_BIN = /*EDITMODE-BEGIN*/{
  "accent": "#1E5DDB",
  "paletteKey": "paper",
  "compostBin": true,
  "glassBin": true
}/*EDITMODE-END*/;

const LS_KEY_BIN = 'dumpit.v1';

function loadState() {
  try { return JSON.parse(localStorage.getItem(LS_KEY_BIN) || '{}'); } catch { return {}; }
}
function saveState(s) {
  try { localStorage.setItem(LS_KEY_BIN, JSON.stringify(s)); } catch {}
}

function BinApp() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS_BIN);
  const palette = PALETTES_BIN[tw.paletteKey] || PALETTES_BIN.paper;
  const accent = tw.accent || '#1E5DDB';

  const initial = loadState();
  const [region, setRegion] = useS_ap(initial.region || 'NZ');
  const [recent, setRecent] = useS_ap(initial.recent || []);
  const [view, setView] = useS_ap('decide'); // decide | result | browse | region
  const [current, setCurrent] = useS_ap(null);

  useE_ap(() => { saveState({ region, recent }); }, [region, recent]);

  const decide = (payload) => { setCurrent(payload); setView('result'); };
  const rememberDecision = (entry) => {
    setRecent(prev => {
      // remove dupes by query
      const filtered = prev.filter(r => r.query.toLowerCase() !== entry.query.toLowerCase());
      return [entry, ...filtered].slice(0, 10);
    });
  };

  const themeVars = {
    '--bg': palette.bg,
    '--card': palette.card,
    '--ink': palette.ink,
    '--muted': palette.muted,
    '--line': palette.line,
    '--accent': accent,
  };

  return (
    <div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(1100px 600px at 50% 0%, #EAE6DA 0%, #C8C0A8 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={themeVars}>
          <IOSDevice width={402} height={874}>
            {view === 'decide' && (
              <DecideScreen accent={accent} region={region} recent={recent}
                onDecide={decide}
                onBrowse={() => setView('browse')}
                onChangeRegion={() => setView('region')}/>
            )}
            {view === 'result' && current && (
              <ResultScreen initial={current} region={region} accent={accent}
                onBack={() => setView('decide')}
                onRemember={rememberDecision}
                onCorrect={(query, bin) => {/* could persist user corrections */}}/>
            )}
            {view === 'browse' && (
              <BrowseBinsScreen accent={accent} region={region}
                onBack={() => setView('decide')}
                onPickItem={(it) => decide({ query: it.name, item: it })}/>
            )}
            {view === 'region' && (
              <RegionScreen region={region}
                onPick={(r) => { setRegion(r); setView('decide'); }}
                onCancel={() => setView('decide')}/>
            )}
          </IOSDevice>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Look">
          <TweakColor label="Accent" value={tw.accent}
            onChange={(v) => setTweak('accent', v)}
            options={['#1E5DDB', '#2D7A3A', '#C7261F', '#A8741F', '#6D3FB8']}/>
          <TweakRadio label="Palette" value={tw.paletteKey}
            onChange={(v) => setTweak('paletteKey', v)}
            options={[
              { value: 'paper', label: 'Paper' },
              { value: 'cool',  label: 'Cool' },
              { value: 'dark',  label: 'Dark' },
            ]}/>
        </TweakSection>
        <TweakSection label="My bins">
          <TweakToggle label="I have a food caddy" value={tw.compostBin}
            onChange={(v) => setTweak('compostBin', v)}/>
          <TweakToggle label="I sort glass separately" value={tw.glassBin}
            onChange={(v) => setTweak('glassBin', v)}/>
        </TweakSection>
        <TweakSection label="Data">
          <TweakButton label="Clear recent history" secondary
            onClick={() => setRecent([])}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<BinApp/>);
