// bin-data.jsx — bin definitions + items dictionary
// Region-aware: items can have `regions.{REGION}` overrides.

const BINS = {
  recycling: {
    id: 'recycling', label: 'Recycling',
    color: '#1E5DDB', fg: '#FFFFFF',
    short: 'Recyclable',
    blurb: 'Paper, card, rigid plastic, metal, drink cartons.',
    nzColor: '#E8B500', nzLabel: 'Yellow bin',
  },
  compost: {
    id: 'compost', label: 'Food + Garden',
    color: '#2D7A3A', fg: '#FFFFFF',
    short: 'Compost',
    blurb: 'Food scraps, peels, paper towels, garden waste.',
    nzColor: '#2D7A3A', nzLabel: 'Green bin',
  },
  general: {
    id: 'general', label: 'Landfill',
    color: '#3F3D38', fg: '#F5F1E8',
    short: 'General waste',
    blurb: 'Anything not recyclable, compostable or hazardous.',
    nzColor: '#A8261F', nzLabel: 'Red bin',
  },
  glass: {
    id: 'glass', label: 'Glass',
    color: '#A8741F', fg: '#FFFFFF',
    short: 'Glass bottles + jars',
    blurb: 'Bottle banks or kerbside glass — rinsed.',
    nzColor: '#5BA7C7', nzLabel: 'Glass crate',
  },
  ewaste: {
    id: 'ewaste', label: 'E-waste',
    color: '#6D3FB8', fg: '#FFFFFF',
    short: 'Electronics + batteries',
    blurb: 'NEVER in regular bins. Special take-back required.',
  },
  hazardous: {
    id: 'hazardous', label: 'Hazardous',
    color: '#C7261F', fg: '#FFFFFF',
    short: 'Hazardous waste',
    blurb: 'Paint, chemicals, solvents, light bulbs. Council site only.',
  },
  textiles: {
    id: 'textiles', label: 'Textiles',
    color: '#B83768', fg: '#FFFFFF',
    short: 'Clothes + fabric',
    blurb: 'Donate good condition. Otherwise textile bank.',
  },
  special: {
    id: 'special', label: 'Donate / Special',
    color: '#1F8580', fg: '#FFFFFF',
    short: 'Take-back or donate',
    blurb: 'Bulk, furniture, working items. Not for the kerb.',
  },
};

const BIN_ORDER = ['recycling', 'compost', 'general', 'glass', 'ewaste', 'hazardous', 'textiles', 'special'];

// Region-specific overall notes shown in browse
const REGION_NOTES = {
  NZ: 'New Zealand standardised on 4 kerbside bins in Feb 2024: red (general), yellow (recycling — plastics 1/2/5 only), green (food + garden), glass crate. Soft plastics go to supermarket bins; e-waste to TechCollect, Mitre 10 or Bunnings.',
  UK: 'Most UK councils run a 3-stream system (recycling, food waste, general) with separate glass kerbside or bottle banks. Rules vary by council.',
  US: 'Single-stream recycling dominates. Composting + glass vary city by city — check your local utility website.',
  AU: 'Three-bin systems are widespread (yellow recycling, green organics, red general). Container deposit schemes pay for bottles + cans.',
  EU: 'EU directive pushes separate collection for paper, plastic, metal, glass, bio-waste. Strong textile collection rules from 2025.',
  CA: 'Province-by-province. Blue box for recyclables; green for organics in many cities. Returnable bottle deposits in some provinces.',
};

const ITEMS = [
  // ── Paper + cardboard ─────────────────────────────────────
  { id: 'newspaper', name: 'Newspaper', aliases: ['paper','news'], bin: 'recycling',
    tip: 'Loose or in the recycling bag. Don\u2019t bundle in plastic.',
    regions: { NZ: { tip: 'Yellow bin, loose. Junk mail too. No shredded paper — it falls through sorting.' } } },

  { id: 'cardboard', name: 'Cardboard box', aliases: ['amazon box','carton','delivery'], bin: 'recycling',
    tip: 'Flatten it. Remove tape if you can. Big sheets go to the recycling centre.',
    regions: { NZ: { tip: 'Flatten + into the yellow bin. Big stuff → transfer station free for clean cardboard.' } } },

  { id: 'pizzabox', name: 'Pizza box', aliases: ['takeaway box','greasy box'], bin: 'recycling',
    tip: 'Tear off clean lid for recycling. Greasy base goes to compost or landfill.',
    conditions: [{ test: 'Greasy or cheesy', bin: 'compost', tip: 'Food-soaked paper can\u2019t be recycled. Compost or general bin.' }],
    regions: { NZ: { tip: 'Clean lid → yellow bin. Greasy base → green bin (food + garden), or red if no green.',
      conditions: [{ test: 'Greasy or cheesy', bin: 'compost', tip: 'Green bin if you have one; otherwise red bin.' }] } } },

  { id: 'paperbag', name: 'Paper bag', aliases: ['kraft bag'], bin: 'recycling',
    tip: 'Bag-in-bag is fine. Remove plastic handles.' },

  { id: 'magazine', name: 'Magazine', aliases: ['glossy magazine'], bin: 'recycling',
    tip: 'Glossy paper recycles fine. Remove plastic wrap.' },

  { id: 'receipt', name: 'Receipt', aliases: ['thermal paper','till slip'], bin: 'general',
    tip: 'Thermal receipts contain BPA — they contaminate paper recycling.' },

  { id: 'paperplate', name: 'Paper plate', aliases: ['party plate'], bin: 'general',
    tip: 'Food-soiled paper goes to compost if you have it; otherwise landfill.',
    regions: { NZ: { bin: 'compost', tip: 'Green bin if you have one. Otherwise red.' } } },

  { id: 'tissue', name: 'Tissue / napkin', aliases: ['kitchen towel','paper towel'], bin: 'compost',
    tip: 'Soft used paper composts well. Definitely not recycling.',
    regions: { NZ: { tip: 'Green bin — even slightly food-soiled paper towel is fine.' } } },

  // ── Plastic ──────────────────────────────────────────────
  { id: 'pet-bottle', name: 'Plastic drinks bottle', aliases: ['water bottle','coke bottle','PET','plastic 1'], bin: 'recycling',
    tip: 'Rinse it. Replace the cap. Most regions recycle it together.',
    regions: { NZ: { tip: 'Yellow bin. Cap on. Plastic 1 (PET) is the most recyclable.' } } },

  { id: 'shampoo', name: 'Shampoo bottle', aliases: ['bathroom bottle','plastic 2','HDPE'], bin: 'recycling',
    tip: 'Rinse well. Pumps usually go to general waste — too many parts.',
    regions: { NZ: { tip: 'Yellow bin if plastic 2. Pump heads → red bin (mixed parts).' } } },

  { id: 'yogurtpot', name: 'Yogurt pot', aliases: ['margarine tub','tub','plastic 5','PP'], bin: 'recycling',
    tip: 'Rinse. Peel off the foil top — that goes in general.',
    regions: { NZ: { tip: 'Plastic 5 (PP) is accepted — yellow bin. Rinse well. Foil top → red bin.' } } },

  { id: 'mixed-plastic', name: 'Plastic 3, 4, 6 or 7', aliases: ['PVC','LDPE','polystyrene','PS','other plastic'], bin: 'general',
    tip: 'Not recyclable in most regions.',
    regions: { NZ: { tip: 'Since 2022 NZ accepts ONLY plastics 1, 2, and 5. Everything else → red bin.' } } },

  { id: 'pp-bag', name: 'Plastic carrier bag', aliases: ['shopping bag','shopper'], bin: 'special',
    tip: 'Soft plastics — take to supermarket collection bin, not kerbside.',
    regions: { NZ: { tip: 'Soft Plastic Recycling Scheme — bin at Countdown, New World, The Warehouse. NOT kerbside.' } } },

  { id: 'cling', name: 'Cling film', aliases: ['plastic wrap','glad wrap','saran'], bin: 'general',
    tip: 'Not currently recyclable in most kerbside schemes.',
    regions: { NZ: { bin: 'special', tip: 'Clean cling film can go to supermarket Soft Plastic bin. Greasy/dirty → red bin.' } } },

  { id: 'softplastic', name: 'Soft plastic wrap', aliases: ['plastic wrapper','pasta bag','rice bag','soft plastic'], bin: 'special',
    tip: 'Goes to supermarket soft-plastic collection — NOT kerbside.',
    regions: { NZ: { tip: 'Soft Plastic Recycling Scheme bins: Countdown, New World, Pak\u2019nSave, The Warehouse.' } } },

  { id: 'crisp-bag', name: 'Crisp / chip packet', aliases: ['snack wrapper','chippie bag','bluebird'], bin: 'general',
    tip: 'Metallised film. Some supermarkets take them — check your local scheme.',
    regions: { NZ: { bin: 'general', tip: 'Foil-lined chip packets → red bin. Not accepted by the soft plastic scheme.' } } },

  { id: 'straw', name: 'Plastic straw', aliases: ['drinking straw'], bin: 'general',
    tip: 'Too small to sort. Switch to paper or metal.' },

  { id: 'bubblewrap', name: 'Bubble wrap', aliases: ['packaging'], bin: 'special',
    tip: 'Soft plastic — supermarket bag-recycling point. NOT the kerb.',
    regions: { NZ: { tip: 'Soft Plastic Recycling Scheme bin at the supermarket.' } } },

  { id: 'pp-cutlery', name: 'Plastic cutlery', aliases: ['plastic fork','plastic spoon'], bin: 'general',
    tip: 'Wash + reuse if you can. Recyclers can\u2019t sort them.' },

  { id: 'plantpot', name: 'Plastic plant pot', aliases: ['nursery pot','seedling pot'], bin: 'general',
    tip: 'Even if plastic 5, contaminated with soil — sorters reject.',
    regions: { NZ: { tip: 'Most garden centres + Mitre 10 take clean pots back for reuse. Otherwise red bin.' } } },

  { id: 'compostable', name: 'Compostable plastic / PLA', aliases: ['biodegradable plastic','PLA cup','eco cup'], bin: 'general',
    tip: 'Only breaks down in industrial composters — not home compost or kerbside.',
    regions: { NZ: { tip: 'Despite the name, NZ kerbside green bins do NOT accept PLA. Red bin only.' } } },

  // ── Metal ────────────────────────────────────────────────
  { id: 'tincan', name: 'Tin can', aliases: ['food tin','soup can','baked beans'], bin: 'recycling',
    tip: 'Rinse it. Lid back inside the can if loose.',
    regions: { NZ: { tip: 'Yellow bin, rinsed. Tuck loose lid inside to keep it from flying off in sorting.' } } },

  { id: 'alucan', name: 'Aluminium drink can', aliases: ['coke can','beer can','soda can','L&P can'], bin: 'recycling',
    tip: 'Empty + lightly crush. One of the most valuable recyclables.',
    regions: { NZ: { tip: 'Yellow bin. NZ container return scheme from 2025 may pay 10c per can — keep an eye out.' } } },

  { id: 'foil', name: 'Aluminium foil', aliases: ['tin foil','silver foil'], bin: 'recycling',
    tip: 'Scrunch into a ball the size of an apple — small bits get lost.' },

  { id: 'foiltray', name: 'Foil takeaway tray', aliases: ['curry tray','indian tray'], bin: 'recycling',
    tip: 'Rinse first. Scrunch with foil to make a bigger ball.' },

  { id: 'aerosol', name: 'Aerosol can', aliases: ['deodorant','spray can','air freshener'], bin: 'recycling',
    tip: 'Must be COMPLETELY empty. Don\u2019t puncture or crush.',
    conditions: [{ test: 'Still has contents', bin: 'hazardous', tip: 'Pressurised + contents = hazardous. Drop at council site.' }],
    regions: { NZ: { tip: 'Yellow bin if empty. Auckland accepts; check your council if elsewhere.',
      conditions: [{ test: 'Still has contents', bin: 'hazardous', tip: 'Hazardous waste drop-off at your nearest transfer station.' }] } } },

  // ── Glass ────────────────────────────────────────────────
  { id: 'winebottle', name: 'Wine bottle', aliases: ['glass bottle'], bin: 'glass',
    tip: 'Rinse. Lids off — they go in metal recycling.',
    regions: { NZ: { tip: 'Glass crate ONLY — never yellow bin. Lids off (yellow bin). No broken glass in the crate.' } } },

  { id: 'jamjar', name: 'Jam jar', aliases: ['glass jar','sauce jar','vegemite jar'], bin: 'glass',
    tip: 'Rinse hot. Lid separately to metals.',
    regions: { NZ: { tip: 'Glass crate. Lid separately in yellow bin (steel).' } } },

  { id: 'lightbulb', name: 'Light bulb', aliases: ['LED bulb','halogen bulb','CFL'], bin: 'ewaste',
    tip: 'Not glass recycling — has electronics. Council site or supermarket bin.',
    conditions: [{ test: 'Old incandescent only', bin: 'general', tip: 'Pre-2010 incandescent (no electronics) → wrap and bin general.' }],
    regions: { NZ: { tip: 'TechCollect, Mitre 10 or Bunnings accept LEDs + CFLs. NEVER glass crate (different glass type + electronics).' } } },

  { id: 'pyrex', name: 'Pyrex / ovenware', aliases: ['oven glass','baking dish'], bin: 'general',
    tip: 'NOT glass recycling — different melt temperature contaminates the stream.',
    regions: { NZ: { tip: 'Red bin. Pyrex and window glass melt differently — they ruin glass-crate batches.' } } },

  { id: 'brokenglass', name: 'Broken glass', aliases: ['shattered','smashed glass'], bin: 'general',
    tip: 'Wrap in newspaper. Hazard to bin collectors.',
    regions: { NZ: { tip: 'Wrap in paper, into the red bin. Never the glass crate — sorters do it by hand.' } } },

  // ── Food + organics ──────────────────────────────────────
  { id: 'foodscraps', name: 'Food scraps', aliases: ['leftovers','plate scrapings'], bin: 'compost',
    tip: 'Most councils now collect food waste. Caddy + liner.',
    regions: { NZ: { tip: 'Green bin where available (Auckland, Christchurch, Hamilton + growing). Compostable liner only.' } } },

  { id: 'banana', name: 'Banana peel', aliases: ['fruit peel','peelings'], bin: 'compost',
    tip: 'Goes into the food caddy.' },

  { id: 'coffee', name: 'Coffee grounds', aliases: ['used coffee','coffee pod'], bin: 'compost',
    tip: 'Grounds compost beautifully. Pods need their own pod-recycling.',
    conditions: [{ test: 'Aluminium pod (Nespresso)', bin: 'special', tip: 'Nespresso has a free return-by-post scheme — don\u2019t bin them.' }],
    regions: { NZ: { tip: 'Grounds → green bin or backyard compost. Bag from your café — they usually give them free.',
      conditions: [{ test: 'Aluminium pod (Nespresso)', bin: 'special', tip: 'Nespresso NZ has a free recycling bag — order online or drop at boutique.' }] } } },

  { id: 'teabag', name: 'Tea bag', aliases: ['used teabag'], bin: 'compost',
    tip: 'Most teabags compost. Some have plastic — check the box.' },

  { id: 'eggshell', name: 'Eggshell', aliases: ['egg shell','shells'], bin: 'compost',
    tip: 'Crush them up — they break down faster.' },

  { id: 'gardenwaste', name: 'Garden waste', aliases: ['grass clippings','leaves','prunings'], bin: 'compost',
    tip: 'Brown bin if you have one. Otherwise bag for the tip.',
    regions: { NZ: { tip: 'Green bin where collected. Otherwise transfer station — usually cheap or free for green waste.' } } },

  // ── E-waste + batteries ──────────────────────────────────
  { id: 'aabattery', name: 'AA / AAA battery', aliases: ['battery','duracell'], bin: 'ewaste',
    tip: 'Supermarket battery box, or council site. NEVER kerbside — fire risk.',
    regions: { NZ: { tip: 'Free at Mitre 10, Bunnings, many libraries. TechCollect events too. FIRE RISK in red bin.' } } },

  { id: 'phone', name: 'Old phone', aliases: ['mobile','smartphone','iphone'], bin: 'ewaste',
    tip: 'Network shops + supermarkets take them. Wipe your data first.',
    regions: { NZ: { tip: 'RE:MOBILE programme — free at most phone stores (Spark, 2degrees, One NZ). Data wiped, parts recycled.' } } },

  { id: 'cable', name: 'USB cable / charger', aliases: ['phone cable','plug'], bin: 'ewaste',
    tip: 'Bag of cables → council site WEEE point.',
    regions: { NZ: { tip: 'TechCollect drop-off or Mitre 10 / Bunnings e-waste bin. Free.' } } },

  { id: 'laptop', name: 'Laptop', aliases: ['computer','macbook'], bin: 'ewaste',
    tip: 'Manufacturer take-back, council site, or donate working units.',
    regions: { NZ: { tip: 'TechCollect (free for households), or Sustainability Trust, Remarkit. Donate if it still works.' } } },

  { id: 'vape', name: 'Disposable vape', aliases: ['vape','elf bar','e-cig','disposable vape'], bin: 'ewaste',
    tip: 'Contains a lithium battery. Vape shops are legally required to take them.',
    regions: { NZ: { tip: 'Switch-It NZ vape recycling — free at participating vape stores, Mitre 10, Cosmic. Lithium = fire risk.' } } },

  { id: 'eppcollect', name: 'Old TV / monitor', aliases: ['television','LCD','CRT'], bin: 'ewaste',
    tip: 'Council e-waste drop-off. Often a small fee.',
    regions: { NZ: { tip: 'TechCollect (free at Noel Leeming, JB Hi-Fi drop-off, or scheduled events). CRTs need special handling.' } } },

  // ── Hazardous ────────────────────────────────────────────
  { id: 'paint', name: 'Paint tin', aliases: ['emulsion','gloss','paint can','resene'], bin: 'hazardous',
    tip: 'Liquid paint = hazardous. Dried-out tin → metal recycling.',
    regions: { NZ: { tip: 'Resene PaintWise: free recycling at Resene ColorShops. Otherwise transfer station hazardous bay.' } } },

  { id: 'medicine', name: 'Old medicine', aliases: ['pills','prescription','tablets'], bin: 'special',
    tip: 'Take to any pharmacy — they take it back for safe destruction.',
    regions: { NZ: { tip: 'Any NZ pharmacy will take expired/unused medicines for free. Don\u2019t flush or bin them.' } } },

  { id: 'oil', name: 'Cooking oil', aliases: ['frying oil','used oil'], bin: 'hazardous',
    tip: 'Don\u2019t pour down the sink — it clogs drains. Council site has a tank.',
    conditions: [{ test: 'Tiny amount', bin: 'general', tip: 'A spoonful soaked into kitchen roll is OK in general waste.' }],
    regions: { NZ: { tip: 'Bottle it up, drop at the transfer station. Some councils refine it into biodiesel.' } } },

  { id: 'motoroil', name: 'Motor oil', aliases: ['engine oil','car oil','sump oil'], bin: 'hazardous',
    tip: 'Always to a hazardous-waste site or oil recycler.',
    regions: { NZ: { tip: 'Mitre 10 / Repco / Supercheap Auto accept used motor oil. Or transfer station.' } } },

  { id: 'syringe', name: 'Needle / syringe', aliases: ['sharps'], bin: 'special',
    tip: 'Sharps bin only. Pharmacy or GP supply them. Never bin loose.' },

  // ── Textiles + bulky ─────────────────────────────────────
  { id: 'tshirt', name: 'Old t-shirt', aliases: ['clothes','jumper','jeans'], bin: 'textiles',
    tip: 'Wearable → charity shop. Worn-out → textile bank for fibre recovery.',
    regions: { NZ: { tip: 'Wearable → Hospice Shop, Salvation Army, SaveMart. Threadbare → red bin (no NZ-wide textile scheme yet).' } } },

  { id: 'shoes', name: 'Shoes', aliases: ['trainers','boots'], bin: 'textiles',
    tip: 'Tie pairs together so they stay together at sorting.',
    regions: { NZ: { tip: 'Tie pairs together. Charity shops or Shoes For Planet Earth (running shoes).' } } },

  { id: 'mattress', name: 'Mattress', aliases: ['bed'], bin: 'special',
    tip: 'Council bulky collection, retailer take-back, or specialist recyclers.',
    regions: { NZ: { tip: 'Sustainability Trust + Mattress Recyclers NZ ($30-50 fee). Some retailers take old one on delivery.' } } },

  { id: 'furniture', name: 'Furniture', aliases: ['sofa','chair','table'], bin: 'special',
    tip: 'Working condition → donate. Otherwise bulky collection.',
    regions: { NZ: { tip: 'Habitat for Humanity ReStore, Trade Me free section, kerbside inorganic collection.' } } },

  // ── Composites + tricky ──────────────────────────────────
  { id: 'tetra', name: 'Drinks carton', aliases: ['tetra pak','juice carton','milk carton','liquid carton'], bin: 'recycling',
    tip: 'Mixed-material but most kerbside schemes accept them. Rinse + flatten.',
    regions: { NZ: { tip: 'Yellow bin, rinsed + flattened. Tetra Pak NZ partners with most councils.' } } },

  { id: 'coffeecup', name: 'Coffee cup', aliases: ['takeaway cup','starbucks cup','flat white cup'], bin: 'special',
    tip: 'Plastic-lined paper. Costa, Starbucks, McDonald\u2019s have in-store collection bins.',
    regions: { NZ: { bin: 'general', tip: 'Red bin in NZ — no national scheme. Better: get an Again Again or Keep Cup, ~80c off your coffee.' } } },

  { id: 'cd', name: 'CD / DVD', aliases: ['disc','cdrom'], bin: 'general',
    tip: 'No kerbside option. Charity shops sometimes resell.' },

  { id: 'cigarette', name: 'Cigarette butt', aliases: ['fag end','cig'], bin: 'general',
    tip: 'Filters are plastic. Definitely not compost.' },

  { id: 'nappy', name: 'Nappy / diaper', aliases: ['diaper','huggies'], bin: 'general',
    tip: 'No recycling stream exists yet. Bag separately for hygiene.',
    regions: { NZ: { tip: 'Red bin only. Cloth nappies are the eco play — Nature Baby has a hire scheme.' } } },

  { id: 'polystyrene', name: 'Polystyrene', aliases: ['styrofoam','expanded polystyrene','EPS','packaging foam'], bin: 'general',
    tip: 'Not recyclable kerbside in most areas.',
    regions: { NZ: { tip: 'Red bin. Some councils + Expol have drop-off points for clean EPS — check Recycle.kiwi.' } } },

  { id: 'takeaway', name: 'Takeaway container', aliases: ['fish & chip box','PP container','plastic 5 tub'], bin: 'recycling',
    tip: 'Plastic 5 (PP) usually recyclable. Rinse first.',
    regions: { NZ: { tip: 'Yellow bin if plastic 5 (PP). Rinse. Polystyrene takeaway boxes → red bin.' } } },

  { id: 'inorganic', name: 'Old appliance', aliases: ['toaster','kettle','vacuum'], bin: 'ewaste',
    tip: 'Anything with a plug or battery is e-waste.',
    regions: { NZ: { tip: 'TechCollect or council inorganic collection. Mitre 10 + Bunnings take small appliances.' } } },

  { id: 'gascanister', name: 'Gas canister', aliases: ['camping gas','butane','LPG bottle'], bin: 'hazardous',
    tip: 'Pressurised. Never kerbside. Always to a hazardous facility.',
    regions: { NZ: { tip: 'Transfer station hazardous bay. Many camping stores take small canisters back.' } } },
];

function resolveForRegion(item, region) {
  if (!item || !item.regions || !item.regions[region]) return item;
  const r = item.regions[region];
  return {
    ...item,
    bin: r.bin || item.bin,
    tip: r.tip || item.tip,
    conditions: r.conditions || item.conditions,
  };
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

Object.assign(window, { BINS, BIN_ORDER, ITEMS, REGION_NOTES, findItem, searchItems, resolveForRegion });
