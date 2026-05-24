import { useState, useEffect, useMemo, useRef } from "react";

// ── Font injection ────────────────────────────────────────────
const FONT_LINK = "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500;600&display=swap";

// ── Bin definitions ───────────────────────────────────────────
const BINS = {
  recycling: { id:'recycling', label:'Recycling', color:'#1E5DDB', fg:'#FFFFFF', short:'Recyclable', blurb:'Paper, card, rigid plastic, metal, drink cartons.', nzColor:'#E8B500', nzLabel:'Yellow bin' },
  compost:   { id:'compost',   label:'Food + Garden', color:'#2D7A3A', fg:'#FFFFFF', short:'Compost', blurb:'Food scraps, peels, paper towels, garden waste.', nzColor:'#2D7A3A', nzLabel:'Green bin' },
  general:   { id:'general',   label:'Landfill', color:'#3F3D38', fg:'#F5F1E8', short:'General waste', blurb:'Anything not recyclable, compostable or hazardous.', nzColor:'#A8261F', nzLabel:'Red bin' },
  glass:     { id:'glass',     label:'Glass', color:'#A8741F', fg:'#FFFFFF', short:'Glass bottles + jars', blurb:'Bottle banks or kerbside glass — rinsed.', nzColor:'#5BA7C7', nzLabel:'Glass crate' },
  ewaste:    { id:'ewaste',    label:'E-waste', color:'#6D3FB8', fg:'#FFFFFF', short:'Electronics + batteries', blurb:'NEVER in regular bins. Special take-back required.' },
  hazardous: { id:'hazardous', label:'Hazardous', color:'#C7261F', fg:'#FFFFFF', short:'Hazardous waste', blurb:'Paint, chemicals, solvents, light bulbs. Council site only.' },
  textiles:  { id:'textiles',  label:'Textiles', color:'#B83768', fg:'#FFFFFF', short:'Clothes + fabric', blurb:'Donate good condition. Otherwise textile bank.' },
  special:   { id:'special',   label:'Donate / Special', color:'#1F8580', fg:'#FFFFFF', short:'Take-back or donate', blurb:'Bulk, furniture, working items. Not for the kerb.' },
};
const BIN_ORDER = ['recycling','compost','general','glass','ewaste','hazardous','textiles','special'];

const REGION_NOTES = {
  NZ: 'New Zealand standardised on 4 kerbside bins in Feb 2024: red (general), yellow (recycling — plastics 1/2/5 only), green (food + garden), glass crate. Soft plastics go to supermarket bins; e-waste to TechCollect, Mitre 10 or Bunnings.',
  UK: 'Most UK councils run a 3-stream system (recycling, food waste, general) with separate glass kerbside or bottle banks. Rules vary by council.',
  US: 'Single-stream recycling dominates. Composting + glass vary city by city — check your local utility website.',
  AU: 'Three-bin systems are widespread (yellow recycling, green organics, red general). Container deposit schemes pay for bottles + cans.',
  EU: 'EU directive pushes separate collection for paper, plastic, metal, glass, bio-waste. Strong textile collection rules from 2025.',
  CA: 'Province-by-province. Blue box for recyclables; green for organics in many cities. Returnable bottle deposits in some provinces.',
};

const ITEMS = [
  { id:'newspaper',    name:'Newspaper',               aliases:['paper','news'],                       bin:'recycling', tip:'Loose or in the recycling bag. Don\'t bundle in plastic.',        regions:{NZ:{tip:'Yellow bin, loose. Junk mail too. No shredded paper.'}} },
  { id:'cardboard',   name:'Cardboard box',             aliases:['amazon box','carton','delivery'],     bin:'recycling', tip:'Flatten it. Remove tape if you can.',                           regions:{NZ:{tip:'Flatten + into the yellow bin. Big stuff → transfer station.'}} },
  { id:'pizzabox',    name:'Pizza box',                 aliases:['takeaway box','greasy box'],          bin:'recycling', tip:'Tear off clean lid for recycling. Greasy base → compost or landfill.',  conditions:[{test:'Greasy or cheesy',bin:'compost',tip:'Food-soaked paper can\'t be recycled. Compost or general bin.'}], regions:{NZ:{tip:'Clean lid → yellow bin. Greasy base → green bin, or red if no green.',conditions:[{test:'Greasy or cheesy',bin:'compost',tip:'Green bin if you have one; otherwise red bin.'}]}} },
  { id:'paperbag',    name:'Paper bag',                 aliases:['kraft bag'],                         bin:'recycling', tip:'Bag-in-bag is fine. Remove plastic handles.' },
  { id:'magazine',    name:'Magazine',                  aliases:['glossy magazine'],                   bin:'recycling', tip:'Glossy paper recycles fine. Remove plastic wrap.' },
  { id:'receipt',     name:'Receipt',                   aliases:['thermal paper','till slip'],          bin:'general',   tip:'Thermal receipts contain BPA — they contaminate paper recycling.' },
  { id:'paperplate',  name:'Paper plate',               aliases:['party plate'],                       bin:'general',   tip:'Food-soiled paper → compost if you have it; otherwise landfill.', regions:{NZ:{bin:'compost',tip:'Green bin if you have one. Otherwise red.'}} },
  { id:'tissue',      name:'Tissue / napkin',           aliases:['kitchen towel','paper towel'],       bin:'compost',   tip:'Soft used paper composts well. Definitely not recycling.',        regions:{NZ:{tip:'Green bin — even slightly food-soiled paper towel is fine.'}} },
  { id:'pet-bottle',  name:'Plastic drinks bottle',     aliases:['water bottle','coke bottle','PET'],  bin:'recycling', tip:'Rinse it. Replace the cap.',                                      regions:{NZ:{tip:'Yellow bin. Cap on. Plastic 1 (PET) is the most recyclable.'}} },
  { id:'shampoo',     name:'Shampoo bottle',            aliases:['bathroom bottle','plastic 2','HDPE'],bin:'recycling', tip:'Rinse well. Pumps usually go to general waste.',                  regions:{NZ:{tip:'Yellow bin if plastic 2. Pump heads → red bin.'}} },
  { id:'yogurtpot',   name:'Yogurt pot',                aliases:['margarine tub','tub','plastic 5'],   bin:'recycling', tip:'Rinse. Peel off the foil top — that goes in general.',             regions:{NZ:{tip:'Plastic 5 (PP) is accepted — yellow bin. Foil top → red bin.'}} },
  { id:'mixed-plastic',name:'Plastic 3, 4, 6 or 7',    aliases:['PVC','LDPE','polystyrene','PS'],     bin:'general',   tip:'Not recyclable in most regions.',                                  regions:{NZ:{tip:'NZ accepts ONLY plastics 1, 2, and 5. Everything else → red bin.'}} },
  { id:'pp-bag',      name:'Plastic carrier bag',       aliases:['shopping bag','shopper'],            bin:'special',   tip:'Soft plastics — take to supermarket collection bin, not kerbside.', regions:{NZ:{tip:'Soft Plastic Recycling Scheme — bin at Countdown, New World. NOT kerbside.'}} },
  { id:'cling',       name:'Cling film',                aliases:['plastic wrap','glad wrap','saran'],  bin:'general',   tip:'Not currently recyclable in most kerbside schemes.',               regions:{NZ:{bin:'special',tip:'Clean cling film can go to supermarket Soft Plastic bin. Greasy → red bin.'}} },
  { id:'softplastic', name:'Soft plastic wrap',         aliases:['plastic wrapper','pasta bag'],       bin:'special',   tip:'Goes to supermarket soft-plastic collection — NOT kerbside.',      regions:{NZ:{tip:'Soft Plastic Recycling Scheme bins: Countdown, New World, Pak\'nSave.'}} },
  { id:'crisp-bag',   name:'Crisp / chip packet',       aliases:['snack wrapper','chippie bag'],       bin:'general',   tip:'Metallised film. Some supermarkets take them.',                    regions:{NZ:{tip:'Foil-lined chip packets → red bin. Not accepted by the soft plastic scheme.'}} },
  { id:'straw',       name:'Plastic straw',             aliases:['drinking straw'],                    bin:'general',   tip:'Too small to sort. Switch to paper or metal.' },
  { id:'bubblewrap',  name:'Bubble wrap',               aliases:['packaging'],                         bin:'special',   tip:'Soft plastic — supermarket bag-recycling point. NOT the kerb.',   regions:{NZ:{tip:'Soft Plastic Recycling Scheme bin at the supermarket.'}} },
  { id:'pp-cutlery',  name:'Plastic cutlery',           aliases:['plastic fork','plastic spoon'],      bin:'general',   tip:'Wash + reuse if you can. Recyclers can\'t sort them.' },
  { id:'plantpot',    name:'Plastic plant pot',         aliases:['nursery pot','seedling pot'],        bin:'general',   tip:'Even if plastic 5, contaminated with soil — sorters reject.',      regions:{NZ:{tip:'Most garden centres + Mitre 10 take clean pots back. Otherwise red bin.'}} },
  { id:'compostable', name:'Compostable plastic / PLA', aliases:['biodegradable plastic','PLA cup'],   bin:'general',   tip:'Only breaks down in industrial composters.',                       regions:{NZ:{tip:'NZ kerbside green bins do NOT accept PLA. Red bin only.'}} },
  { id:'tincan',      name:'Tin can',                   aliases:['food tin','soup can','baked beans'], bin:'recycling', tip:'Rinse it. Lid back inside the can if loose.',                      regions:{NZ:{tip:'Yellow bin, rinsed. Tuck loose lid inside.'}} },
  { id:'alucan',      name:'Aluminium drink can',       aliases:['coke can','beer can','soda can'],    bin:'recycling', tip:'Empty + lightly crush. One of the most valuable recyclables.',     regions:{NZ:{tip:'Yellow bin. NZ container return scheme from 2025 may pay 10c per can.'}} },
  { id:'foil',        name:'Aluminium foil',            aliases:['tin foil','silver foil'],            bin:'recycling', tip:'Scrunch into a ball the size of an apple.' },
  { id:'foiltray',    name:'Foil takeaway tray',        aliases:['curry tray','indian tray'],          bin:'recycling', tip:'Rinse first. Scrunch with foil to make a bigger ball.' },
  { id:'aerosol',     name:'Aerosol can',               aliases:['deodorant','spray can'],             bin:'recycling', tip:'Must be COMPLETELY empty. Don\'t puncture or crush.', conditions:[{test:'Still has contents',bin:'hazardous',tip:'Pressurised + contents = hazardous. Drop at council site.'}], regions:{NZ:{tip:'Yellow bin if empty.',conditions:[{test:'Still has contents',bin:'hazardous',tip:'Hazardous waste drop-off at your nearest transfer station.'}]}} },
  { id:'winebottle',  name:'Wine bottle',               aliases:['glass bottle'],                      bin:'glass',     tip:'Rinse. Lids off — they go in metal recycling.',                   regions:{NZ:{tip:'Glass crate ONLY — never yellow bin. No broken glass in the crate.'}} },
  { id:'jamjar',      name:'Jam jar',                   aliases:['glass jar','sauce jar'],             bin:'glass',     tip:'Rinse hot. Lid separately to metals.',                             regions:{NZ:{tip:'Glass crate. Lid separately in yellow bin (steel).'}} },
  { id:'lightbulb',   name:'Light bulb',                aliases:['LED bulb','halogen bulb','CFL'],     bin:'ewaste',    tip:'Not glass recycling — has electronics. Council site or supermarket bin.', conditions:[{test:'Old incandescent only',bin:'general',tip:'Pre-2010 incandescent (no electronics) → wrap and bin general.'}], regions:{NZ:{tip:'TechCollect, Mitre 10 or Bunnings accept LEDs + CFLs. NEVER glass crate.'}} },
  { id:'pyrex',       name:'Pyrex / ovenware',          aliases:['oven glass','baking dish'],          bin:'general',   tip:'NOT glass recycling — different melt temperature contaminates the stream.', regions:{NZ:{tip:'Red bin. Pyrex and window glass ruin glass-crate batches.'}} },
  { id:'brokenglass', name:'Broken glass',              aliases:['shattered','smashed glass'],         bin:'general',   tip:'Wrap in newspaper. Hazard to bin collectors.',                     regions:{NZ:{tip:'Wrap in paper, into the red bin. Never the glass crate.'}} },
  { id:'foodscraps',  name:'Food scraps',               aliases:['leftovers','plate scrapings'],       bin:'compost',   tip:'Most councils now collect food waste. Caddy + liner.',              regions:{NZ:{tip:'Green bin where available (Auckland, Christchurch, Hamilton + growing).'}} },
  { id:'banana',      name:'Banana peel',               aliases:['fruit peel','peelings'],             bin:'compost',   tip:'Goes into the food caddy.' },
  { id:'coffee',      name:'Coffee grounds',            aliases:['used coffee','coffee pod'],          bin:'compost',   tip:'Grounds compost beautifully. Pods need their own pod-recycling.', conditions:[{test:'Aluminium pod (Nespresso)',bin:'special',tip:'Nespresso has a free return-by-post scheme.'}], regions:{NZ:{tip:'Grounds → green bin or backyard compost.',conditions:[{test:'Aluminium pod (Nespresso)',bin:'special',tip:'Nespresso NZ has a free recycling bag — order online.'}]}} },
  { id:'teabag',      name:'Tea bag',                   aliases:['used teabag'],                       bin:'compost',   tip:'Most teabags compost. Some have plastic — check the box.' },
  { id:'eggshell',    name:'Eggshell',                  aliases:['egg shell','shells'],                bin:'compost',   tip:'Crush them up — they break down faster.' },
  { id:'gardenwaste', name:'Garden waste',              aliases:['grass clippings','leaves'],          bin:'compost',   tip:'Brown bin if you have one. Otherwise bag for the tip.',            regions:{NZ:{tip:'Green bin where collected. Otherwise transfer station.'}} },
  { id:'aabattery',   name:'AA / AAA battery',          aliases:['battery','duracell'],                bin:'ewaste',    tip:'Supermarket battery box, or council site. NEVER kerbside — fire risk.', regions:{NZ:{tip:'Free at Mitre 10, Bunnings, many libraries. FIRE RISK in red bin.'}} },
  { id:'phone',       name:'Old phone',                 aliases:['mobile','smartphone','iphone'],      bin:'ewaste',    tip:'Network shops + supermarkets take them. Wipe your data first.',   regions:{NZ:{tip:'RE:MOBILE programme — free at most phone stores.'}} },
  { id:'cable',       name:'USB cable / charger',       aliases:['phone cable','plug'],                bin:'ewaste',    tip:'Bag of cables → council site WEEE point.',                         regions:{NZ:{tip:'TechCollect drop-off or Mitre 10 / Bunnings e-waste bin. Free.'}} },
  { id:'laptop',      name:'Laptop',                    aliases:['computer','macbook'],                bin:'ewaste',    tip:'Manufacturer take-back, council site, or donate working units.',   regions:{NZ:{tip:'TechCollect (free for households), or Sustainability Trust.'}} },
  { id:'vape',        name:'Disposable vape',           aliases:['vape','elf bar','e-cig'],            bin:'ewaste',    tip:'Contains a lithium battery. Vape shops are legally required to take them.', regions:{NZ:{tip:'Switch-It NZ vape recycling — free at participating vape stores, Mitre 10.'}} },
  { id:'eppcollect',  name:'Old TV / monitor',          aliases:['television','LCD','CRT'],            bin:'ewaste',    tip:'Council e-waste drop-off. Often a small fee.',                     regions:{NZ:{tip:'TechCollect (free at Noel Leeming, JB Hi-Fi drop-off).'}} },
  { id:'paint',       name:'Paint tin',                 aliases:['emulsion','gloss','paint can','resene'], bin:'hazardous', tip:'Liquid paint = hazardous. Dried-out tin → metal recycling.',  regions:{NZ:{tip:'Resene PaintWise: free recycling at Resene ColorShops.'}} },
  { id:'medicine',    name:'Old medicine',              aliases:['pills','prescription','tablets'],    bin:'special',   tip:'Take to any pharmacy — they take it back for safe destruction.',   regions:{NZ:{tip:'Any NZ pharmacy will take expired/unused medicines for free.'}} },
  { id:'oil',         name:'Cooking oil',               aliases:['frying oil','used oil'],             bin:'hazardous', tip:'Don\'t pour down the sink — it clogs drains. Council site.', conditions:[{test:'Tiny amount',bin:'general',tip:'A spoonful soaked into kitchen roll is OK in general waste.'}], regions:{NZ:{tip:'Bottle it up, drop at the transfer station.'}} },
  { id:'motoroil',    name:'Motor oil',                 aliases:['engine oil','car oil','sump oil'],   bin:'hazardous', tip:'Always to a hazardous-waste site or oil recycler.',               regions:{NZ:{tip:'Mitre 10 / Repco / Supercheap Auto accept used motor oil.'}} },
  { id:'syringe',     name:'Needle / syringe',          aliases:['sharps'],                            bin:'special',   tip:'Sharps bin only. Pharmacy or GP supply them. Never bin loose.' },
  { id:'tshirt',      name:'Old t-shirt',               aliases:['clothes','jumper','jeans'],          bin:'textiles',  tip:'Wearable → charity shop. Worn-out → textile bank.',               regions:{NZ:{tip:'Wearable → Hospice Shop, Salvation Army, SaveMart. Threadbare → red bin.'}} },
  { id:'shoes',       name:'Shoes',                     aliases:['trainers','boots'],                  bin:'textiles',  tip:'Tie pairs together so they stay together at sorting.',             regions:{NZ:{tip:'Tie pairs together. Charity shops or Shoes For Planet Earth.'}} },
  { id:'mattress',    name:'Mattress',                  aliases:['bed'],                               bin:'special',   tip:'Council bulky collection, retailer take-back, or specialist recyclers.', regions:{NZ:{tip:'Sustainability Trust + Mattress Recyclers NZ ($30-50 fee).'}} },
  { id:'furniture',   name:'Furniture',                 aliases:['sofa','chair','table'],              bin:'special',   tip:'Working condition → donate. Otherwise bulky collection.',          regions:{NZ:{tip:'Habitat for Humanity ReStore, Trade Me free section, kerbside inorganic.'}} },
  { id:'tetra',       name:'Drinks carton',             aliases:['tetra pak','juice carton','milk carton'], bin:'recycling', tip:'Mixed-material but most kerbside schemes accept them. Rinse + flatten.', regions:{NZ:{tip:'Yellow bin, rinsed + flattened. Tetra Pak NZ partners with most councils.'}} },
  { id:'coffeecup',   name:'Coffee cup',                aliases:['takeaway cup','starbucks cup','flat white cup'], bin:'special', tip:'Plastic-lined paper. Costa, Starbucks, McDonald\'s have in-store collection bins.', regions:{NZ:{bin:'general',tip:'Red bin in NZ — no national scheme. Get a Keep Cup instead.'}} },
  { id:'cd',          name:'CD / DVD',                  aliases:['disc','cdrom'],                      bin:'general',   tip:'No kerbside option. Charity shops sometimes resell.' },
  { id:'cigarette',   name:'Cigarette butt',            aliases:['fag end','cig'],                     bin:'general',   tip:'Filters are plastic. Definitely not compost.' },
  { id:'nappy',       name:'Nappy / diaper',            aliases:['diaper','huggies'],                  bin:'general',   tip:'No recycling stream exists yet. Bag separately for hygiene.',      regions:{NZ:{tip:'Red bin only. Cloth nappies are the eco play.'}} },
  { id:'polystyrene', name:'Polystyrene',               aliases:['styrofoam','expanded polystyrene','EPS'], bin:'general', tip:'Not recyclable kerbside in most areas.',                       regions:{NZ:{tip:'Red bin. Some councils + Expol have drop-off points for clean EPS.'}} },
  { id:'takeaway',    name:'Takeaway container',        aliases:['fish & chip box','PP container'],    bin:'recycling', tip:'Plastic 5 (PP) usually recyclable. Rinse first.',                  regions:{NZ:{tip:'Yellow bin if plastic 5 (PP). Rinse. Polystyrene takeaway boxes → red bin.'}} },
  { id:'inorganic',   name:'Old appliance',             aliases:['toaster','kettle','vacuum'],         bin:'ewaste',    tip:'Anything with a plug or battery is e-waste.',                      regions:{NZ:{tip:'TechCollect or council inorganic collection. Mitre 10 + Bunnings take small appliances.'}} },
  { id:'gascanister', name:'Gas canister',              aliases:['camping gas','butane','LPG bottle'], bin:'hazardous', tip:'Pressurised. Never kerbside. Always to a hazardous facility.',     regions:{NZ:{tip:'Transfer station hazardous bay. Many camping stores take small canisters back.'}} },
];

// ── Helpers ───────────────────────────────────────────────────
function resolveForRegion(item, region) {
  if (!item?.regions?.[region]) return item;
  const r = item.regions[region];
  return { ...item, bin: r.bin || item.bin, tip: r.tip || item.tip, conditions: r.conditions || item.conditions };
}

function findItem(query, region) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return null;
  let hit = ITEMS.find(i => i.name.toLowerCase() === q);
  if (!hit) hit = ITEMS.find(i => i.aliases?.some(a => a.toLowerCase() === q));
  if (!hit) hit = ITEMS.find(i => i.name.toLowerCase().includes(q) || q.includes(i.name.toLowerCase()));
  if (!hit) hit = ITEMS.find(i => i.aliases?.some(a => a.toLowerCase().includes(q) || q.includes(a.toLowerCase())));
  return hit ? resolveForRegion(hit, region) : null;
}

function searchItems(query, region, limit = 6) {
  const q = (query || '').trim().toLowerCase();
  if (!q) return [];
  const scored = ITEMS.map(i => {
    let s = 0;
    if (i.name.toLowerCase().startsWith(q)) s += 5;
    else if (i.name.toLowerCase().includes(q)) s += 3;
    if (i.aliases?.some(a => a.toLowerCase().startsWith(q))) s += 4;
    else if (i.aliases?.some(a => a.toLowerCase().includes(q))) s += 2;
    return { item: i, score: s };
  }).filter(x => x.score > 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => resolveForRegion(x.item, region));
}

// ── KEY FIX: region-aware color helper ───────────────────────
// Recycling = BLUE globally, but YELLOW in NZ. Same fix applies to any bin with nzColor.
function getBinColor(key, region) {
  const b = BINS[key];
  if (!b) return '#888';
  return (region === 'NZ' && b.nzColor) ? b.nzColor : b.color;
}
// Foreground text for NZ yellow/glass bins needs to be dark
function getBinFg(key, region) {
  const b = BINS[key];
  if (!b) return '#fff';
  if (region === 'NZ' && (key === 'recycling' || key === 'glass')) return '#1a1410';
  return b.fg;
}

// ── BinChip ───────────────────────────────────────────────────
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
    <span style={{ display:'inline-flex', alignItems:'center', gap:6, padding:pad, borderRadius:4, background:color, color:fg, fontSize:fs, fontWeight:600, letterSpacing:0.4, textTransform:'uppercase', fontFamily:'"Geist Mono",ui-monospace,monospace' }}>
      <span style={{ width:6, height:6, borderRadius:1, background:fg, opacity:0.7 }}/>
      {label}
    </span>
  );
}

// ── AI fallback ───────────────────────────────────────────────
async function askClaude(query, region) {
  const regionHints = {
    NZ: 'New Zealand: 4-bin system. Yellow=recycling (plastics 1/2/5, paper, card, metal, drink cartons), Green=food+garden, Red=general, Glass crate. Soft plastics→supermarket bins.',
    UK: 'UK: 3-stream (recycling, food waste, general). Rules vary by council.',
    US: 'US: single-stream recycling. Composting + glass vary by city.',
    AU: 'Australia: yellow recycling, green organics, red general. Container deposit schemes.',
    EU: 'EU: separate paper, plastic, metal, glass, bio-waste collection.',
    CA: 'Canada: blue box recyclables, green organics in many cities.',
  };
  const prompt = `You are a recycling-advice helper for ${region}. ${regionHints[region] || ''}
The user wants to throw away: "${query}".
Reply with JSON ONLY, no prose, in this exact shape:
{"bin":"<one of: recycling,compost,general,glass,ewaste,hazardous,textiles,special>","name":"<item name capitalised>","tip":"<one short sentence of advice, region-specific, under 25 words>"}
Choose the single best bin for ${region}. Be confident.`;
  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ model: 'claude-sonnet-4-20250514', max_tokens: 1000, messages: [{ role: 'user', content: prompt }] }),
    });
    const data = await res.json();
    const raw = data.content?.[0]?.text || '';
    const m = raw.match(/\{[\s\S]*\}/);
    if (!m) return null;
    const obj = JSON.parse(m[0]);
    if (!obj.bin || !BINS[obj.bin]) return null;
    return { id: 'ai_' + Date.now().toString(36), name: obj.name || query, bin: obj.bin, tip: obj.tip || '', aiGenerated: true };
  } catch { return null; }
}

// ── IOSDevice frame ───────────────────────────────────────────
function IOSDevice({ children }) {
  const W = 390, H = 844;
  return (
    <div style={{ width:W, height:H, borderRadius:46, overflow:'hidden', position:'relative', background:'#F2F2F7', boxShadow:'0 40px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.14)' }}>
      {/* dynamic island */}
      <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)', width:124, height:36, borderRadius:22, background:'#000', zIndex:50 }}/>
      {/* content fills full height */}
      <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
        <div style={{ flex:1, overflow:'auto', scrollbarWidth:'none' }}>{children}</div>
      </div>
      {/* home indicator */}
      <div style={{ position:'absolute', bottom:0, left:0, right:0, zIndex:60, height:32, display:'flex', justifyContent:'center', alignItems:'flex-end', paddingBottom:8, pointerEvents:'none' }}>
        <div style={{ width:132, height:5, borderRadius:100, background:'rgba(0,0,0,0.22)' }}/>
      </div>
    </div>
  );
}

// ── DecideScreen ──────────────────────────────────────────────
const QUICK_PICKS = ['pizzabox','aabattery','yogurtpot','coffeecup','tetra','aerosol','vape','paint'];

function DecideScreen({ region, recent, onDecide, onBrowse, onChangeRegion }) {
  const [query, setQuery] = useState('');
  const suggestions = useMemo(() => searchItems(query, region, 6), [query, region]);
  const quickPicks = useMemo(() => QUICK_PICKS.map(id => ITEMS.find(i => i.id === id)).filter(Boolean).map(it => resolveForRegion(it, region)), [region]);

  const submit = (text) => {
    const q = text || query;
    if (!q.trim()) return;
    onDecide({ query: q, item: findItem(q, region) });
    setQuery('');
  };

  return (
    <div style={{ height:'100%', background:'#F5F1E8', color:'#141210', display:'flex', flexDirection:'column', fontFamily:'"Geist",-apple-system,system-ui,sans-serif', position:'relative' }}>
      {/* header */}
      <div style={{ padding:'54px 24px 0', display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
        <div>
          <h1 style={{ margin:0, fontFamily:'"Space Grotesk",system-ui,sans-serif', fontWeight:700, fontSize:54, lineHeight:0.95, letterSpacing:-2 }}>
            DUMP<span style={{ color:'#1E5DDB' }}>?</span>
          </h1>
          <div style={{ marginTop:6, fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962', fontFamily:'"Geist Mono",ui-monospace,monospace' }}>Which bin does it go in?</div>
        </div>
        <button onClick={onChangeRegion} style={{ padding:'8px 12px', borderRadius:999, border:'1px solid #E3DCCB', background:'transparent', fontFamily:'"Geist Mono",ui-monospace,monospace', fontSize:11, color:'#141210', cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6, textTransform:'uppercase', letterSpacing:0.8 }}>
          <span style={{ width:6, height:6, borderRadius:6, background:'#2D7A3A' }}/>{region}
        </button>
      </div>

      {/* search box */}
      <div style={{ padding:'26px 20px 0' }}>
        <div style={{ background:'#FFFFFF', border:'2px solid #141210', borderRadius:14, padding:4, display:'flex', alignItems:'center', gap:4, boxShadow:'4px 4px 0 #141210' }}>
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === 'Enter' && submit()} placeholder="Type an item — pizza box, vape, foil…"
            style={{ flex:1, padding:'14px 14px', border:'none', outline:'none', background:'transparent', fontFamily:'inherit', fontSize:15, color:'#141210' }}/>
          <button onClick={() => submit()} disabled={!query.trim()} style={{ padding:'14px 18px', borderRadius:10, border:'none', background:query.trim() ? '#141210' : '#E3DCCB', color:query.trim() ? '#F5F1E8' : '#6E6962', cursor:query.trim() ? 'pointer' : 'default', fontFamily:'"Geist Mono",ui-monospace,monospace', fontSize:11, fontWeight:600, letterSpacing:1, textTransform:'uppercase' }}>Dump it</button>
        </div>

        {query.trim() && suggestions.length > 0 && (
          <div style={{ marginTop:8, background:'#FFFFFF', border:'1px solid #E3DCCB', borderRadius:12, overflow:'hidden' }}>
            {suggestions.map((s, i) => (
              <button key={s.id} onClick={() => { setQuery(''); onDecide({ query: s.name, item: s }); }}
                style={{ width:'100%', display:'flex', alignItems:'center', gap:10, padding:'12px 14px', border:'none', background:'transparent', borderTop:i ? '1px solid #E3DCCB' : 'none', textAlign:'left', cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ flex:1, fontSize:14, color:'#141210' }}>{s.name}</span>
                <BinChip bin={s.bin} region={region}/>
              </button>
            ))}
          </div>
        )}
        {query.trim() && suggestions.length === 0 && (
          <div style={{ marginTop:8, padding:'12px 14px', borderRadius:12, border:'1px dashed #E3DCCB', background:'#FFFFFF', fontSize:13, color:'#6E6962', lineHeight:1.4 }}>
            Not in our list. Tap <strong style={{ color:'#141210' }}>Dump it</strong> and we'll ask the AI.
          </div>
        )}
      </div>

      {/* quick picks */}
      <div style={{ padding:'20px 24px 0' }}>
        <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962', marginBottom:10, fontFamily:'"Geist Mono",ui-monospace,monospace' }}>Common confusions</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {quickPicks.map(it => (
            <button key={it.id} onClick={() => onDecide({ query: it.name, item: it })} style={{ padding:'8px 12px', borderRadius:999, border:'1px solid #E3DCCB', background:'#FFFFFF', fontFamily:'inherit', fontSize:12, color:'#141210', cursor:'pointer' }}>{it.name}</button>
          ))}
        </div>
      </div>

      {/* recent */}
      {recent.length > 0 && (
        <div style={{ padding:'24px 24px 0' }}>
          <div style={{ fontSize:10, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962', marginBottom:10, fontFamily:'"Geist Mono",ui-monospace,monospace' }}>Recently dumped</div>
          <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
            {recent.slice(0, 5).map((r, i) => (
              <button key={i} onClick={() => onDecide(r)} style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'12px 14px', borderRadius:12, background:'#FFFFFF', border:'1px solid #E3DCCB', textAlign:'left', cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ fontSize:14, color:'#141210' }}>{r.query}</span>
                <BinChip bin={r.bin || r.item?.bin || 'general'} region={region}/>
              </button>
            ))}
          </div>
        </div>
      )}

      <div style={{ flex:1 }}/>

      {/* browse button */}
      <div style={{ padding:'12px 20px 36px', background:'linear-gradient(to top, #F5F1E8 60%, rgba(245,241,232,0))' }}>
        <button onClick={onBrowse} style={{ width:'100%', padding:'14px 16px', borderRadius:14, background:'transparent', border:'1px solid #141210', color:'#141210', fontFamily:'inherit', fontSize:14, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:10 }}>
            <span style={{ display:'inline-flex', gap:2 }}>
              {BIN_ORDER.slice(0, 4).map(k => (
                <span key={k} style={{ width:4, height:14, borderRadius:1, background: getBinColor(k, region) }}/>
              ))}
            </span>
            Browse all bins
          </span>
          <span style={{ fontFamily:'"Geist Mono",ui-monospace,monospace', fontSize:11, color:'#6E6962', letterSpacing:1 }}>{ITEMS.length} items</span>
        </button>
      </div>
    </div>
  );
}

// ── ResultScreen ──────────────────────────────────────────────
function ResultScreen({ initial, region, onBack, onRemember }) {
  const [item, setItem] = useState(initial.item);
  const [pickedBin, setPickedBin] = useState(initial.item?.bin || null);
  const [loading, setLoading] = useState(!initial.item);
  const [aiFailed, setAiFailed] = useState(false);
  const [override, setOverride] = useState(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (!initial.item && initial.query) {
      askClaude(initial.query, region).then(res => {
        if (cancelled) return;
        if (res) { setItem(res); setPickedBin(res.bin); }
        else { setAiFailed(true); setPickedBin('general'); setItem({ name: initial.query, bin: 'general', tip: 'When in doubt, general waste is safest.' }); }
        setLoading(false);
      });
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!loading) { const t = setTimeout(() => setRevealed(true), 30); return () => clearTimeout(t); }
  }, [loading]);

  useEffect(() => {
    if (!loading && item && pickedBin) onRemember({ query: initial.query, item, bin: pickedBin });
  }, [loading]);

  const bin = pickedBin ? BINS[pickedBin] : null;
  const activeCondition = useMemo(() => item?.conditions?.find(c => c.bin === pickedBin && pickedBin !== item.bin), [item, pickedBin]);

  // ── Region-aware display values ───────────────────────────
  const displayColor = bin ? getBinColor(pickedBin, region) : '#333';
  const displayFg = bin ? getBinFg(pickedBin, region) : '#fff';
  const displayLabel = (region === 'NZ' && bin?.nzLabel) ? bin.nzLabel : bin?.label;

  if (loading) {
    return (
      <div style={{ height:'100%', background:'#F5F1E8', color:'#141210', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'40px 24px', fontFamily:'"Geist",system-ui,sans-serif' }}>
        <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962', marginBottom:14 }}>Asking the AI…</div>
        <div style={{ fontFamily:'"Space Grotesk",system-ui,sans-serif', fontSize:30, fontWeight:600, lineHeight:1.1, textAlign:'center', letterSpacing:-1 }}>"{initial.query}"</div>
        <div style={{ marginTop:24, display:'flex', gap:8 }}>
          {BIN_ORDER.map((k, i) => (
            <div key={k} style={{ width:6, height:24, borderRadius:1, background: getBinColor(k, region), animation:`binPulse 1.2s ${i*0.1}s infinite ease-in-out` }}/>
          ))}
        </div>
        <style>{`@keyframes binPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
      </div>
    );
  }

  return (
    <div style={{ height:'100%', position:'relative', background:'#F5F1E8', overflow:'hidden', fontFamily:'"Geist",system-ui,sans-serif' }}>
      {/* animated color panel */}
      <div style={{ position:'absolute', left:0, right:0, bottom:0, height:revealed ? '100%' : '0%', background:displayColor, transition:'height 600ms cubic-bezier(.2,.8,.2,1)' }}/>

      <div style={{ position:'relative', height:'100%', display:'flex', flexDirection:'column', padding:'54px 24px 36px', color:displayFg, opacity:revealed ? 1 : 0, transition:'opacity 400ms 300ms' }}>
        {/* top bar */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <button onClick={onBack} style={{ padding:'8px 12px', borderRadius:999, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'inherit', fontFamily:'inherit', fontSize:12, cursor:'pointer' }}>← Back</button>
          {item?.aiGenerated && (
            <span style={{ padding:'4px 10px', borderRadius:4, background:'rgba(255,255,255,0.18)', fontFamily:'"Geist Mono",monospace', fontSize:9, letterSpacing:1.2, textTransform:'uppercase', fontWeight:600 }}>AI guess</span>
          )}
        </div>

        {/* verdict */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
          <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:2, textTransform:'uppercase', opacity:0.7, marginBottom:10 }}>For your "{item?.name || initial.query}"</div>
          <div style={{ fontFamily:'"Space Grotesk",system-ui,sans-serif', fontWeight:700, fontSize:68, lineHeight:0.9, letterSpacing:-3, marginBottom:4 }}>{displayLabel}</div>
          {region === 'NZ' && bin?.nzLabel && (
            <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', opacity:0.65, marginTop:4, marginBottom:6 }}>aka {bin.label}</div>
          )}
          <div style={{ fontSize:15, lineHeight:1.4, marginTop:14, opacity:0.92, maxWidth:300 }}>{activeCondition ? activeCondition.tip : (item?.tip || bin?.blurb)}</div>

          {item?.conditions?.length > 0 && (
            <div style={{ marginTop:28 }}>
              <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:10, letterSpacing:1.5, textTransform:'uppercase', opacity:0.7, marginBottom:10 }}>Unless…</div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                {[{ test:'Default', bin:item.bin, tip:item.tip }, ...item.conditions].map((c, idx) => {
                  const active = c.bin === pickedBin;
                  return (
                    <button key={idx} onClick={() => setPickedBin(c.bin)} style={{ padding:'12px 14px', borderRadius:10, textAlign:'left', background:active ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.06)', border:'1px solid '+(active ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.18)'), color:'inherit', fontFamily:'inherit', fontSize:13, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                      <span>{c.test}</span>
                      <span style={{ padding:'2px 8px', borderRadius:4, background:BINS[c.bin].color, color:BINS[c.bin].fg, fontFamily:'"Geist Mono",monospace', fontSize:9, letterSpacing:0.8, textTransform:'uppercase', fontWeight:600 }}>{BINS[c.bin].short}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* actions */}
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <button onClick={() => setOverride(o => !o)} style={{ padding:'12px 14px', borderRadius:10, background:'rgba(255,255,255,0.15)', border:'1px solid rgba(255,255,255,0.25)', color:'inherit', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>
            {override ? 'Cancel' : 'Wrong bin? Override'}
          </button>
          {override && (
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4 }}>
              {BIN_ORDER.map(k => {
                const b = BINS[k];
                const active = k === pickedBin;
                return (
                  <button key={k} onClick={() => { setPickedBin(k); setOverride(false); }}
                    style={{ padding:'10px 6px', borderRadius:8, border:'none', background:active ? displayFg : 'rgba(255,255,255,0.15)', color:active ? displayColor : 'inherit', fontFamily:'"Geist Mono",monospace', fontSize:9, letterSpacing:0.6, textTransform:'uppercase', fontWeight:600, cursor:'pointer' }}>
                    <div style={{ width:14, height:6, background:getBinColor(k, region), borderRadius:1, margin:'0 auto 4px' }}/>
                    {b.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          )}
          <button onClick={onBack} style={{ padding:'14px 16px', borderRadius:10, background:displayFg, color:displayColor, border:'none', fontFamily:'inherit', fontSize:14, fontWeight:600, cursor:'pointer' }}>Dump another</button>
        </div>
      </div>
    </div>
  );
}

// ── BrowseBinsScreen ──────────────────────────────────────────
function BrowseBinsScreen({ region, onBack, onPickItem }) {
  const [openBin, setOpenBin] = useState(BIN_ORDER[0]);

  const byBin = useMemo(() => {
    const out = {};
    BIN_ORDER.forEach(k => out[k] = []);
    ITEMS.forEach(i => { const resolved = resolveForRegion(i, region); if (out[resolved.bin]) out[resolved.bin].push(resolved); });
    return out;
  }, [region]);

  const open = BINS[openBin];
  const openColor = getBinColor(openBin, region);
  const openFg = getBinFg(openBin, region);

  return (
    <div style={{ height:'100%', background:'#F5F1E8', color:'#141210', display:'flex', flexDirection:'column', fontFamily:'"Geist",system-ui,sans-serif' }}>
      <div style={{ padding:'54px 16px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={onBack} style={{ padding:'8px 12px', borderRadius:999, background:'transparent', border:'1px solid #E3DCCB', color:'#141210', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>← Done</button>
        <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962' }}>Bin guide · {region}</div>
        <div style={{ width:60 }}/>
      </div>

      {REGION_NOTES[region] && (
        <div style={{ margin:'12px 24px 0', padding:'12px 14px', borderRadius:12, background:'#FFFFFF', border:'1px solid #E3DCCB', fontSize:12, color:'#6E6962', lineHeight:1.5 }}>
          <span style={{ fontFamily:'"Geist Mono",monospace', fontSize:9, letterSpacing:1.5, textTransform:'uppercase', color:'#141210', fontWeight:600, marginRight:6 }}>{region} notes</span>
          {REGION_NOTES[region]}
        </div>
      )}

      {/* bins grid — uses getBinColor so recycling shows yellow in NZ */}
      <div style={{ padding:'18px 20px 0' }}>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:6 }}>
          {BIN_ORDER.map(k => {
            const b = BINS[k];
            const isOpen = openBin === k;
            const col = getBinColor(k, region);
            const fg = getBinFg(k, region);
            return (
              <button key={k} onClick={() => setOpenBin(k)} style={{ padding:'14px 14px', borderRadius:10, textAlign:'left', background:isOpen ? col : '#FFFFFF', color:isOpen ? fg : '#141210', border:'1px solid '+(isOpen ? col : '#E3DCCB'), cursor:'pointer', fontFamily:'inherit', display:'flex', flexDirection:'column', gap:8, minHeight:78 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                  <span style={{ width:12, height:12, borderRadius:2, background:isOpen ? fg : col }}/>
                  <span style={{ fontFamily:'"Geist Mono",monospace', fontSize:10, fontWeight:600, opacity:0.7 }}>{byBin[k].length}</span>
                </div>
                <div style={{ fontFamily:'"Space Grotesk",system-ui,sans-serif', fontSize:17, fontWeight:600, lineHeight:1.05, letterSpacing:-0.3 }}>{b.label}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* selected bin items */}
      <div style={{ flex:1, overflowY:'auto', padding:'20px 24px 40px' }}>
        <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:14 }}>
          <div style={{ width:6, alignSelf:'stretch', borderRadius:1, background:openColor }}/>
          <div style={{ flex:1 }}>
            <div style={{ fontFamily:'"Space Grotesk",system-ui,sans-serif', fontSize:24, fontWeight:600, lineHeight:1, letterSpacing:-0.5 }}>{open.label}</div>
            <p style={{ margin:'6px 0 0', fontSize:13, color:'#6E6962', lineHeight:1.45 }}>{open.blurb}</p>
          </div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
          {byBin[openBin].map(it => (
            <button key={it.id} onClick={() => onPickItem(it)} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'12px 14px', borderRadius:10, background:'#FFFFFF', border:'1px solid #E3DCCB', textAlign:'left', cursor:'pointer', fontFamily:'inherit' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, color:'#141210', fontWeight:500 }}>{it.name}</div>
                <div style={{ fontSize:12, color:'#6E6962', marginTop:3, lineHeight:1.4 }}>{it.tip}</div>
              </div>
              {it.conditions?.length > 0 && (
                <span style={{ flexShrink:0, padding:'2px 7px', borderRadius:4, fontFamily:'"Geist Mono",monospace', fontSize:9, letterSpacing:0.8, textTransform:'uppercase', fontWeight:600, background:'#E3DCCB', color:'#141210' }}>{it.conditions.length+1} cases</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── RegionScreen ──────────────────────────────────────────────
const REGIONS = ['NZ','AU','UK','US','EU','CA'];
const REGION_FULL = { NZ:'New Zealand', AU:'Australia', UK:'United Kingdom', US:'United States', EU:'European Union', CA:'Canada' };

function RegionScreen({ region, onPick, onCancel }) {
  return (
    <div style={{ height:'100%', background:'#F5F1E8', color:'#141210', display:'flex', flexDirection:'column', fontFamily:'"Geist",system-ui,sans-serif', padding:'54px 24px 30px' }}>
      <button onClick={onCancel} style={{ alignSelf:'flex-start', padding:'8px 12px', borderRadius:999, background:'transparent', border:'1px solid #E3DCCB', color:'#141210', fontFamily:'inherit', fontSize:13, cursor:'pointer' }}>← Back</button>
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center' }}>
        <div style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:1.5, textTransform:'uppercase', color:'#6E6962' }}>Set your region</div>
        <h1 style={{ margin:'6px 0 18px', fontFamily:'"Space Grotesk",system-ui,sans-serif', fontWeight:700, fontSize:44, lineHeight:0.95, letterSpacing:-1.5 }}>Where do you live?</h1>
        <p style={{ margin:'0 0 24px', fontSize:14, color:'#6E6962', lineHeight:1.5 }}>Recycling rules vary a lot. We adjust advice to your area.</p>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {REGIONS.map(r => (
            <button key={r} onClick={() => onPick(r)} style={{ padding:'16px 18px', borderRadius:12, textAlign:'left', background:region === r ? '#141210' : '#FFFFFF', color:region === r ? '#F5F1E8' : '#141210', border:'1px solid '+(region === r ? '#141210' : '#E3DCCB'), fontFamily:'inherit', fontSize:15, fontWeight:500, cursor:'pointer', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span>{REGION_FULL[r]}</span>
              <span style={{ fontFamily:'"Geist Mono",monospace', fontSize:11, letterSpacing:1, opacity:0.7 }}>{r}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── App root ──────────────────────────────────────────────────
export default function App() {
  const [region, setRegion] = useState('NZ');
  const [recent, setRecent] = useState([]);
  const [view, setView] = useState('decide');
  const [current, setCurrent] = useState(null);

  // Inject Google Fonts
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet'; link.href = FONT_LINK;
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  const decide = (payload) => { setCurrent(payload); setView('result'); };
  const rememberDecision = (entry) => setRecent(prev => {
    const filtered = prev.filter(r => r.query.toLowerCase() !== entry.query.toLowerCase());
    return [entry, ...filtered].slice(0, 10);
  });

  return (
    <div style={{ minHeight:'100vh', background:'radial-gradient(1100px 600px at 50% 0%, #EAE6DA 0%, #C8C0A8 100%)', display:'flex', alignItems:'center', justifyContent:'center', padding:'40px 20px' }}>
      <IOSDevice>
        {view === 'decide' && (
          <DecideScreen region={region} recent={recent} onDecide={decide} onBrowse={() => setView('browse')} onChangeRegion={() => setView('region')}/>
        )}
        {view === 'result' && current && (
          <ResultScreen initial={current} region={region} onBack={() => setView('decide')} onRemember={rememberDecision}/>
        )}
        {view === 'browse' && (
          <BrowseBinsScreen region={region} onBack={() => setView('decide')} onPickItem={it => decide({ query: it.name, item: it })}/>
        )}
        {view === 'region' && (
          <RegionScreen region={region} onPick={r => { setRegion(r); setView('decide'); }} onCancel={() => setView('decide')}/>
        )}
      </IOSDevice>
    </div>
  );
}
