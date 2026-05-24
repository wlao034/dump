// app.jsx — root: navigation, tweaks, community state

const { useState, useEffect, useMemo, useRef } = React;

const ACCENTS_RAW = ['#C04A1F', '#D38B1B', '#2B5F3B', '#7C2230', '#1E2A4A'];

const PALETTES = {
  cream:    { bg: '#F6F1E8', card: '#FFFFFF', ink: '#1A1410', muted: '#6B5F52', line: '#E8DFD0' },
  sand:     { bg: '#EDE6D8', card: '#F8F3E7', ink: '#211810', muted: '#776854', line: '#DACDB4' },
  paper:    { bg: '#FAF8F2', card: '#FFFFFF', ink: '#0F0E0C', muted: '#7A746A', line: '#ECE6DA' },
  charcoal: { bg: '#161413', card: '#221E1B', ink: '#F2EDE4', muted: '#9A9088', line: '#332C28' },
};

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#C04A1F",
  "paletteKey": "cream",
  "level": "beginner",
  "fontScale": 1
}/*EDITMODE-END*/;

const LS_KEY = 'cook-coach.community.v1';

function loadCommunity() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch { return null; }
}
function saveCommunity(arr) {
  try { localStorage.setItem(LS_KEY, JSON.stringify(arr)); } catch {}
}

function App() {
  const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const accent = tw.accent || '#C04A1F';
  const palette = PALETTES[tw.paletteKey] || PALETTES.cream;

  // User-submitted recipes (hydrated from localStorage, seeded if empty)
  const [community, setCommunity] = useState(() => {
    const saved = loadCommunity();
    return saved ?? (window.SEEDED_COMMUNITY || []);
  });
  useEffect(() => { saveCommunity(community); }, [community]);

  // Merge static recipes + community ones
  const allRecipes = useMemo(
    () => [...(window.RECIPES || []), ...community],
    [community]
  );

  const [view, setView] = useState('browse');         // browse | recipe | cook | done | add | edit
  const [recipeId, setRecipeId] = useState(null);
  const recipe = allRecipes.find(r => r.id === recipeId) || null;

  const themeVars = {
    '--bg': palette.bg,
    '--card': palette.card,
    '--ink': palette.ink,
    '--muted': palette.muted,
    '--line': palette.line,
    '--accent': accent,
    fontSize: 16 * (tw.fontScale || 1),
  };

  const pick = (r) => { setRecipeId(r.id); setView('recipe'); };
  const start = () => setView('cook');
  const done = () => setView('done');
  const home = () => { setView('browse'); setRecipeId(null); };
  const again = () => setView('cook');

  // Community CRUD
  const upsertCommunity = (rec) => {
    setCommunity(prev => {
      const idx = prev.findIndex(r => r.id === rec.id);
      if (idx >= 0) {
        const next = prev.slice(); next[idx] = rec; return next;
      }
      return [rec, ...prev];
    });
    setRecipeId(rec.id);
    setView('recipe');
  };
  const removeCommunity = (id) => {
    setCommunity(prev => prev.filter(r => r.id !== id));
    home();
  };

  return (
    <div>
      <style>{`
        @keyframes slideUp { from { transform: translateY(40px); opacity: 0.6 } to { transform: translateY(0); opacity: 1 } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
      <div style={{
        minHeight: '100vh',
        background: 'radial-gradient(1200px 600px at 50% 0%, #ede5d4 0%, #d9ceb6 100%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 20px',
      }}>
        <div style={themeVars}>
          <IOSDevice width={402} height={874}>
            {view === 'browse' && (
              <BrowseScreen recipes={allRecipes} onPick={pick} accent={accent} level={tw.level}
                onAdd={() => { setRecipeId(null); setView('add'); }}/>
            )}
            {view === 'recipe' && recipe && (
              <RecipeScreen recipe={recipe} accent={accent}
                onBack={home} onStart={start}
                onEdit={recipe.community ? () => setView('edit') : null}/>
            )}
            {view === 'cook' && recipe && (
              <CookStepScreen recipe={recipe} accent={accent}
                onExit={() => setView('recipe')} onDone={done}/>
            )}
            {view === 'done' && recipe && (
              <DoneScreen recipe={recipe} accent={accent}
                onAgain={again} onHome={home}/>
            )}
            {view === 'add' && (
              <AddRecipeScreen accent={accent}
                onCancel={home}
                onPublish={upsertCommunity}/>
            )}
            {view === 'edit' && recipe && (
              <AddRecipeScreen accent={accent} editing={recipe}
                onCancel={() => setView('recipe')}
                onPublish={upsertCommunity}
                onDelete={() => removeCommunity(recipe.id)}/>
            )}
          </IOSDevice>
        </div>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="Comfort">
          <TweakRadio label="My cooking level" value={tw.level}
            onChange={(v) => setTweak('level', v)}
            options={[
              { value: 'beginner', label: 'New' },
              { value: 'curious',  label: 'Some' },
              { value: 'confident',label: 'Confident' },
            ]}/>
          <TweakSlider label="Text size" value={tw.fontScale}
            onChange={(v) => setTweak('fontScale', v)}
            min={0.9} max={1.3} step={0.05}/>
        </TweakSection>
        <TweakSection label="Look">
          <TweakColor label="Accent" value={tw.accent}
            onChange={(v) => setTweak('accent', v)}
            options={ACCENTS_RAW}/>
          <TweakRadio label="Palette" value={tw.paletteKey}
            onChange={(v) => setTweak('paletteKey', v)}
            options={[
              { value: 'cream',   label: 'Cream' },
              { value: 'sand',    label: 'Sand' },
              { value: 'paper',   label: 'Paper' },
              { value: 'charcoal',label: 'Dark' },
            ]}/>
        </TweakSection>
        <TweakSection label="Community">
          <TweakButton label="Reset community recipes" secondary
            onClick={() => { setCommunity(window.SEEDED_COMMUNITY || []); }}/>
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
