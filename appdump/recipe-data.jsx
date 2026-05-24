// recipe-data.jsx — individual beginner-friendly recipes

// Step kinds:
//   'active' — do this thing, tap when done
//   'timed'  — has a duration, big timer counts it down
//   'wait'   — passive (preheat, rest), timer + reassurance
//   'heat'   — change the heat / temperature, sensory cue
//
// Each step can carry:
//   title    — short imperative ('Crack the eggs')
//   body     — full instruction (1-3 sentences, friendly)
//   minutes  — duration if timed/wait
//   cue      — 'Look for…' — sensory check ('eggs no longer glossy')
//   tip      — beginner reassurance / common mistake
//   tool     — what utensil/pan
//   heat     — 'low' | 'medium' | 'med-high' | 'high' for stove steps

const CUISINES = {
  classics:    { label: 'Classics',    order: 0 },
  italian:     { label: 'Italian',     order: 1 },
  japanese:    { label: 'Japanese',    order: 2 },
  thai:        { label: 'Thai',        order: 3 },
  chinese:     { label: 'Chinese',     order: 4 },
  korean:      { label: 'Korean',      order: 5 },
  indian:      { label: 'Indian',      order: 6 },
  middle_east: { label: 'Middle East', order: 7 },
};

const RECIPES = [
  {
    id: 'eggs',
    name: 'Cheesy scrambled eggs',
    blurb: 'Soft, custardy. Done in five.',
    serves: 1,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 6,
    activeMinutes: 6,
    tags: ['breakfast', '5 ingredients'],
    ingredients: [
      { what: '3 eggs',                qty: '3' },
      { what: 'Butter',                qty: '1 tbsp' },
      { what: 'Grated cheddar',        qty: 'small handful' },
      { what: 'Salt + pepper',         qty: 'to taste' },
      { what: 'Buttered toast (opt.)', qty: '1 slice' },
    ],
    tools: ['Small non-stick pan', 'Rubber spatula', 'Bowl'],
    steps: [
      {
        title: 'Crack and whisk the eggs',
        body: 'Crack three eggs into a bowl. Whisk gently with a fork for about 20 seconds — just until the yolks and whites combine.',
        kind: 'active',
        tip: 'A shell drops in? Scoop it out with a bigger piece of shell — easier than chasing it with a spoon.',
      },
      {
        title: 'Melt the butter',
        body: 'Set a small non-stick pan on the stove. Add a tablespoon of butter and turn the heat to LOW.',
        kind: 'heat', heat: 'low',
        cue: 'Butter melts slowly and foams a little. No brown bits.',
        tip: 'Eggs get rubbery on high heat. Low is your friend here.',
      },
      {
        title: 'Pour in the eggs',
        body: 'Pour the eggs into the pan. Wait 20 seconds without touching.',
        kind: 'timed', minutes: 0.5,
        cue: 'Edges just starting to set.',
      },
      {
        title: 'Stir slowly, then pause',
        body: 'Drag the spatula gently across the pan, pushing eggs from edges to centre. Pause for a few seconds between passes.',
        kind: 'active',
        cue: 'Soft, glossy curds form. Still wet-looking on top.',
        tip: 'They keep cooking on the plate. Pull them off looking slightly underdone.',
      },
      {
        title: 'Add cheese, season',
        body: 'Sprinkle in the cheese and a small pinch of salt + pepper. Stir once.',
        kind: 'active',
      },
      {
        title: 'Slide onto your toast',
        body: 'Turn off the heat. Tip the pan and slide the eggs onto your buttered toast.',
        kind: 'active',
      },
    ],
  },

  {
    id: 'pasta',
    name: 'Spaghetti pomodoro',
    blurb: 'A clean tomato pasta. The everyday workhorse.',
    serves: 2,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 25,
    activeMinutes: 15,
    tags: ['dinner', 'pantry'],
    ingredients: [
      { what: 'Spaghetti',           qty: '200 g' },
      { what: 'Tinned tomatoes',     qty: '1 × 400 g' },
      { what: 'Garlic cloves',       qty: '3' },
      { what: 'Olive oil',           qty: '3 tbsp' },
      { what: 'Salt',                qty: 'a big pinch' },
      { what: 'Basil (optional)',    qty: 'a few leaves' },
      { what: 'Parmesan to finish',  qty: 'to grate' },
    ],
    tools: ['Big pot', 'Wide saucepan', 'Tongs or fork', 'Colander'],
    steps: [
      {
        title: 'Fill the big pot',
        body: 'Fill the largest pot you have about two-thirds with water. Put it on the stove on HIGH.',
        kind: 'heat', heat: 'high',
        tip: 'More water = pasta cooks evenly. Skimping is the most common beginner mistake.',
      },
      {
        title: 'Salt the water heavily',
        body: 'Once it starts steaming, add a big pinch of salt — about a tablespoon. The water should taste like the sea.',
        kind: 'active',
        cue: 'Bubbles climbing the sides of the pot.',
      },
      {
        title: 'Slice the garlic',
        body: 'Peel three garlic cloves and slice them thinly. Don\u2019t worry about being neat.',
        kind: 'active',
        tool: 'Cutting board + sharp knife',
      },
      {
        title: 'Warm the oil + garlic',
        body: 'In the wide saucepan, pour in the olive oil and the garlic. Turn heat to MEDIUM-LOW.',
        kind: 'heat', heat: 'low',
        cue: 'Garlic sizzles gently and turns pale gold. NOT brown.',
        tip: 'Brown garlic tastes bitter. If it browns, start over — it\u2019s only oil and a clove.',
      },
      {
        title: 'Add the tomatoes',
        body: 'Pour in the tin of tomatoes. Crush any whole ones with your spatula. Add a pinch of salt.',
        kind: 'active',
      },
      {
        title: 'Simmer the sauce',
        body: 'Lower the heat to MEDIUM-LOW so the sauce bubbles gently. Let it cook while you handle the pasta.',
        kind: 'timed', minutes: 12,
        heat: 'low',
        cue: 'Sauce thickens. Oil pools slightly on top.',
      },
      {
        title: 'Boil the spaghetti',
        body: 'When the water is at a full rolling boil, drop in the spaghetti. Stir once so it doesn\u2019t stick.',
        kind: 'timed', minutes: 9,
        cue: 'Pasta is al dente — tender with just a tiny bit of bite.',
        tip: 'Trust the timer. Pull out one strand near the end and bite it to check.',
      },
      {
        title: 'Save a cup of pasta water',
        body: 'Before draining, scoop out a mug of the cloudy pasta water. Set it aside.',
        kind: 'active',
        tip: 'This is liquid gold for loosening any pasta sauce.',
      },
      {
        title: 'Drain and toss',
        body: 'Drain the pasta. Tip it straight into the saucepan with the tomato sauce. Toss with tongs for 30 seconds, adding a splash of pasta water if it looks dry.',
        kind: 'active',
        cue: 'Sauce clings to the noodles, glossy.',
      },
      {
        title: 'Plate up',
        body: 'Pile onto plates. Tear over basil. Grate parmesan on top.',
        kind: 'active',
      },
    ],
  },

  {
    id: 'pancakes',
    name: 'Fluffy pancakes',
    blurb: 'Tall, golden, weekend pancakes.',
    serves: 2,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 20,
    activeMinutes: 18,
    tags: ['breakfast', 'sweet'],
    ingredients: [
      { what: 'Plain flour',     qty: '150 g (1 cup)' },
      { what: 'Baking powder',   qty: '2 tsp' },
      { what: 'Sugar',           qty: '1 tbsp' },
      { what: 'Salt',            qty: 'pinch' },
      { what: 'Milk',            qty: '200 ml' },
      { what: '1 egg',           qty: '1' },
      { what: 'Melted butter',   qty: '2 tbsp + more for pan' },
      { what: 'Maple syrup',     qty: 'to finish' },
    ],
    tools: ['Two bowls', 'Whisk', 'Non-stick frying pan', 'Spatula'],
    steps: [
      {
        title: 'Mix the dry ingredients',
        body: 'In a bowl, whisk together the flour, baking powder, sugar and pinch of salt.',
        kind: 'active',
      },
      {
        title: 'Mix the wet ingredients',
        body: 'In the second bowl, whisk the egg, then add the milk and melted butter and whisk again.',
        kind: 'active',
        tip: 'Melt butter in a mug in the microwave for 20 seconds. Easy.',
      },
      {
        title: 'Combine — gently',
        body: 'Pour the wet into the dry. Stir with the whisk just until it comes together. Stop while it\u2019s still lumpy.',
        kind: 'active',
        cue: 'Thick batter, visible lumps OK.',
        tip: 'Overmixing makes tough pancakes. Lumps mean tender pancakes.',
      },
      {
        title: 'Rest the batter',
        body: 'Let the batter sit while the pan heats — the baking powder activates.',
        kind: 'wait', minutes: 3,
      },
      {
        title: 'Heat the pan',
        body: 'Set the non-stick pan on MEDIUM heat. Drop in a small knob of butter.',
        kind: 'heat', heat: 'medium',
        cue: 'Butter sizzles when it touches the pan. A drop of water dances.',
      },
      {
        title: 'Cook the first pancake',
        body: 'Spoon in a small ladle of batter. Don\u2019t spread it — let it find its own shape.',
        kind: 'timed', minutes: 2,
        cue: 'Tiny bubbles appear on top. Edges look set.',
        tip: 'First pancake is always the test. If it burns, lower the heat.',
      },
      {
        title: 'Flip it',
        body: 'Slide the spatula underneath confidently. Flip. Cook the other side.',
        kind: 'timed', minutes: 1.5,
        cue: 'Golden brown, springs back when poked.',
      },
      {
        title: 'Keep going',
        body: 'Stack the pancake on a plate. Repeat with the rest of the batter, adding a little butter between each.',
        kind: 'active',
      },
      {
        title: 'Plate + syrup',
        body: 'Stack high. Drown in maple syrup. Eat warm.',
        kind: 'active',
      },
    ],
  },

  {
    id: 'chicken',
    name: 'Pan-seared chicken thighs',
    blurb: 'Crisp skin, juicy inside. The dish that builds confidence.',
    serves: 2,
    difficulty: 'medium',
    cuisine: 'classics',
    totalMinutes: 30,
    activeMinutes: 12,
    tags: ['dinner', 'one-pan'],
    ingredients: [
      { what: 'Chicken thighs, skin on, bone in', qty: '4' },
      { what: 'Salt',           qty: 'plenty' },
      { what: 'Black pepper',   qty: 'plenty' },
      { what: 'Olive oil',      qty: '1 tbsp' },
      { what: 'Lemon',          qty: '½' },
      { what: 'Thyme sprigs (opt.)', qty: '3' },
    ],
    tools: ['Cast-iron or heavy oven-safe pan', 'Tongs', 'Paper towels'],
    steps: [
      {
        title: 'Preheat your oven',
        body: 'Turn the oven on to 200°C / 400°F.',
        kind: 'wait', minutes: 8,
        cue: 'The oven beeps or its light goes out when ready.',
      },
      {
        title: 'Pat the chicken dry',
        body: 'Lay the thighs on paper towels and pat the skin completely dry on both sides.',
        kind: 'active',
        tip: 'Dry skin = crisp skin. This one step matters more than any seasoning.',
      },
      {
        title: 'Season hard',
        body: 'Sprinkle salt and pepper on both sides. Don\u2019t be shy — most beginners under-season.',
        kind: 'active',
      },
      {
        title: 'Heat the pan',
        body: 'Put the heavy pan on MEDIUM-HIGH heat. Add a tablespoon of oil.',
        kind: 'heat', heat: 'med-high',
        cue: 'Oil shimmers and moves quickly when you tilt the pan. Wisps of smoke = too hot.',
      },
      {
        title: 'Place skin-side down',
        body: 'Lay the thighs skin-side down in the pan. Press each one flat with the back of your tongs for a few seconds.',
        kind: 'active',
        tip: 'Hear that hiss? That\u2019s good. Silence means the pan isn\u2019t hot enough.',
      },
      {
        title: 'Don\u2019t touch — sear',
        body: 'Walk away. Resist the urge to move them. The skin needs to crisp.',
        kind: 'timed', minutes: 8,
        cue: 'Skin is deep golden brown and the chicken releases from the pan easily.',
        tip: 'If a thigh sticks, it\u2019s not ready. Give it another minute.',
      },
      {
        title: 'Flip + add aromatics',
        body: 'Flip each thigh. Squeeze in lemon juice and tuck the thyme sprigs in around them.',
        kind: 'active',
      },
      {
        title: 'Finish in the oven',
        body: 'Transfer the whole pan to the oven. Roast until cooked through.',
        kind: 'timed', minutes: 12,
        cue: 'Juices run clear when you cut into the thickest part. Internal temp 74°C / 165°F.',
      },
      {
        title: 'Rest before serving',
        body: 'Take the pan out (hot handle!). Let the chicken rest on a plate for a few minutes.',
        kind: 'wait', minutes: 4,
        tip: 'Resting keeps the juices inside instead of on the cutting board.',
      },
    ],
  },

  {
    id: 'soup',
    name: 'Tomato soup + grilled cheese',
    blurb: 'The pairing that fixes any bad day.',
    serves: 2,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 25,
    activeMinutes: 18,
    tags: ['comfort', 'lunch'],
    ingredients: [
      { what: 'Tinned tomatoes',  qty: '2 × 400 g' },
      { what: 'Onion, chopped',   qty: '1' },
      { what: 'Garlic',           qty: '2 cloves' },
      { what: 'Butter',           qty: '2 tbsp' },
      { what: 'Veg stock cube',   qty: '1' },
      { what: 'Cream (opt.)',     qty: 'a splash' },
      { what: 'Bread',            qty: '4 slices' },
      { what: 'Cheddar',          qty: 'a thick slab' },
    ],
    tools: ['Saucepan', 'Frying pan', 'Blender or stick blender'],
    steps: [
      {
        title: 'Sweat the onion',
        body: 'Melt one tablespoon of butter in the saucepan on MEDIUM heat. Add the chopped onion with a pinch of salt.',
        kind: 'timed', minutes: 6,
        heat: 'medium',
        cue: 'Onion soft and translucent. NOT browned.',
        tip: 'Soft, not coloured. That\u2019s the goal.',
      },
      {
        title: 'Add garlic',
        body: 'Stir in the chopped garlic for 30 seconds — just until fragrant.',
        kind: 'timed', minutes: 0.5,
      },
      {
        title: 'Tomatoes + stock',
        body: 'Pour in both tins of tomatoes. Crumble in the stock cube. Add a cup of water.',
        kind: 'active',
      },
      {
        title: 'Simmer',
        body: 'Bring to a gentle simmer. Lid off.',
        kind: 'timed', minutes: 10,
        cue: 'Bubbles around the edges. Sauce darker and richer.',
      },
      {
        title: 'Build the grilled cheese',
        body: 'Butter one side of each slice of bread. Sandwich the cheese between two slices, butter sides OUT.',
        kind: 'active',
      },
      {
        title: 'Grill the sandwich',
        body: 'Set the frying pan on MEDIUM-LOW. Lay the sandwich in. Press it down with the spatula.',
        kind: 'timed', minutes: 3,
        heat: 'low',
        cue: 'Bottom is deep golden. Cheese starting to melt.',
        tip: 'Low and slow gives time for cheese to melt before bread burns.',
      },
      {
        title: 'Flip it',
        body: 'Flip carefully. Press again. Cook the second side.',
        kind: 'timed', minutes: 3,
      },
      {
        title: 'Blitz the soup',
        body: 'Take soup off heat. Blend with a stick blender — or carefully in batches in a regular blender.',
        kind: 'active',
        tip: 'If using a jug blender, leave the lid cracked. Hot liquid + sealed lid = explosion. Trust.',
      },
      {
        title: 'Cream + serve',
        body: 'Stir in a splash of cream if you like. Ladle into bowls. Cut the grilled cheese on the diagonal. Dip.',
        kind: 'active',
      },
    ],
  },

  {
    id: 'stirfry',
    name: 'Garlic ginger noodles',
    blurb: 'Fifteen-minute weeknight stir-fry.',
    serves: 1,
    difficulty: 'medium',
    cuisine: 'classics',
    totalMinutes: 15,
    activeMinutes: 15,
    tags: ['dinner', 'fast'],
    ingredients: [
      { what: 'Egg noodles',       qty: '1 nest' },
      { what: 'Garlic',            qty: '3 cloves' },
      { what: 'Ginger',            qty: 'thumb-size piece' },
      { what: 'Spring onions',     qty: '3' },
      { what: 'Soy sauce',         qty: '2 tbsp' },
      { what: 'Sesame oil',        qty: '1 tsp' },
      { what: 'Neutral oil',       qty: '2 tbsp' },
      { what: 'Chilli flakes (opt.)', qty: 'pinch' },
    ],
    tools: ['Pot for noodles', 'Wok or wide frying pan', 'Microplane or grater'],
    steps: [
      {
        title: 'Prep first, cook later',
        body: 'Stir-fries are fast. Chop everything before you turn on a single burner. Grate the garlic and ginger; slice the spring onions.',
        kind: 'active',
        tip: 'This is the most important habit for stir-fries. The cooking part takes 4 minutes.',
      },
      {
        title: 'Boil noodles',
        body: 'Cook the noodles in salted boiling water per the packet (usually 3-4 min). Drain. Toss with a drizzle of sesame oil so they don\u2019t clump.',
        kind: 'timed', minutes: 4,
      },
      {
        title: 'Heat the wok',
        body: 'Put the wok on HIGH heat until it\u2019s very hot. Add the neutral oil and swirl.',
        kind: 'heat', heat: 'high',
        cue: 'Oil shimmers, almost smoking. This is when wok cooking works.',
      },
      {
        title: 'Aromatics, fast',
        body: 'Throw in the garlic, ginger, and white parts of the spring onion. Stir constantly.',
        kind: 'timed', minutes: 0.5,
        cue: 'Smells incredible. Don\u2019t let garlic burn.',
      },
      {
        title: 'Add the noodles + soy',
        body: 'Tip in the drained noodles. Pour soy sauce around the edge of the wok. Toss everything together.',
        kind: 'timed', minutes: 1.5,
      },
      {
        title: 'Finish + plate',
        body: 'Off heat. Drizzle with sesame oil. Top with green spring onion tops and chilli flakes. Eat right away.',
        kind: 'active',
      },
    ],
  },

  {
    id: 'cookies',
    name: 'Chocolate chip cookies',
    blurb: 'Crisp edges, chewy middles. Twelve cookies.',
    serves: 4,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 30,
    activeMinutes: 15,
    tags: ['sweet', 'bake'],
    ingredients: [
      { what: 'Butter, softened', qty: '120 g' },
      { what: 'Brown sugar',      qty: '100 g' },
      { what: 'White sugar',      qty: '50 g' },
      { what: '1 egg',            qty: '1' },
      { what: 'Vanilla extract',  qty: '1 tsp' },
      { what: 'Plain flour',      qty: '180 g' },
      { what: 'Baking soda',      qty: '½ tsp' },
      { what: 'Salt',             qty: 'pinch' },
      { what: 'Chocolate chips',  qty: '150 g' },
    ],
    tools: ['Bowl', 'Wooden spoon or mixer', 'Baking tray', 'Parchment paper'],
    steps: [
      {
        title: 'Preheat the oven',
        body: 'Set the oven to 180°C / 350°F. Line your tray with parchment.',
        kind: 'wait', minutes: 8,
      },
      {
        title: 'Cream butter + sugars',
        body: 'In the bowl, mix the softened butter with both sugars until smooth and a bit fluffy.',
        kind: 'active',
        cue: 'Pale, light, no lumps of butter.',
        tip: 'Butter too cold? Microwave for 8 seconds. Not 15. Not 20. Eight.',
      },
      {
        title: 'Add egg + vanilla',
        body: 'Crack in the egg. Add the vanilla. Stir until smooth.',
        kind: 'active',
      },
      {
        title: 'Fold in dry + chips',
        body: 'Add the flour, baking soda, salt, and chocolate chips. Stir just until you can\u2019t see any flour.',
        kind: 'active',
        tip: 'Mixing too much makes tough cookies. Stop when it just comes together.',
      },
      {
        title: 'Scoop and space',
        body: 'Spoon golf-ball-sized blobs onto the tray. Leave a good gap between them — they spread.',
        kind: 'active',
      },
      {
        title: 'Bake',
        body: 'Bake on the middle rack.',
        kind: 'timed', minutes: 11,
        cue: 'Edges golden. Middles look slightly underdone — that\u2019s perfect.',
        tip: 'They keep cooking on the hot tray. Underdone in the oven = chewy on the plate.',
      },
      {
        title: 'Cool on the tray',
        body: 'Take the tray out. Leave the cookies on it for a few minutes — they\u2019re too soft to move yet.',
        kind: 'wait', minutes: 4,
      },
      {
        title: 'Eat warm',
        body: 'Transfer to a rack or just eat one off the tray. (We won\u2019t tell.)',
        kind: 'active',
      },
    ],
  },

  {
    id: 'rice',
    name: 'Fluffy white rice',
    blurb: 'A skill, not a recipe. Get this right, eat well forever.',
    serves: 2,
    difficulty: 'easy',
    cuisine: 'classics',
    totalMinutes: 25,
    activeMinutes: 5,
    tags: ['side', 'fundamental'],
    ingredients: [
      { what: 'Long-grain or basmati rice', qty: '1 cup' },
      { what: 'Water',                       qty: '1½ cups' },
      { what: 'Salt',                        qty: '½ tsp' },
      { what: 'Butter (optional)',           qty: '1 tsp' },
    ],
    tools: ['Small saucepan with a tight-fitting lid', 'Fine sieve', 'Fork'],
    steps: [
      {
        title: 'Rinse the rice',
        body: 'Put the rice in the sieve. Run cold water through it, swishing with your fingers, until the water runs almost clear.',
        kind: 'active',
        cue: 'Cloudy water → clear-ish water. About 30 seconds of rinsing.',
        tip: 'This washes off extra starch — the difference between fluffy and gluey.',
      },
      {
        title: 'Combine in the pan',
        body: 'Tip the rice into the saucepan. Add the water, salt, and butter if using.',
        kind: 'active',
      },
      {
        title: 'Bring to a boil',
        body: 'Put the lid on. Turn the heat to HIGH and bring up to a boil.',
        kind: 'heat', heat: 'high',
        cue: 'You hear it bubbling hard. Steam puffing under the lid.',
      },
      {
        title: 'Drop heat, set timer',
        body: 'Now drop the heat to LOW. DON\u2019T LIFT THE LID. Set the timer.',
        kind: 'timed', minutes: 12,
        heat: 'low',
        tip: 'Every peek lets out steam. Trust the timer. The rice is fine.',
      },
      {
        title: 'Rest off the heat',
        body: 'Take the pan off the burner. Still don\u2019t lift the lid. Let it sit.',
        kind: 'wait', minutes: 8,
        cue: 'Final steam finishes cooking the grains.',
      },
      {
        title: 'Fluff with a fork',
        body: 'Lift the lid. Fluff gently with a fork to separate the grains. Serve.',
        kind: 'active',
        cue: 'Individual fluffy grains, no clumps.',
      },
    ],
  },
];

const DIFFICULTY_META = {
  easy:   { label: 'Easy',         dots: 1, blurb: 'Great first cook' },
  medium: { label: 'A bit harder', dots: 2, blurb: 'Once you\u2019ve got the basics' },
  hard:   { label: 'Step it up',   dots: 3, blurb: 'You\u2019re finding your feet' },
};

function fmtClock(ms) {
  const d = new Date(ms);
  const h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'pm' : 'am';
  const h12 = ((h + 11) % 12) + 1;
  return `${h12}:${m}${ampm}`;
}

function fmtCountdown(ms) {
  if (ms <= 0) return '0:00';
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${s.toString().padStart(2,'0')}`;
  return `${m}:${s.toString().padStart(2,'0')}`;
}

function fmtDuration(min) {
  if (min < 1) return Math.round(min * 60) + 's';
  if (min < 60) return Math.round(min) + ' min';
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return m ? `${h}h ${m}m` : `${h}h`;
}

Object.assign(window, { RECIPES, DIFFICULTY_META, CUISINES, fmtClock, fmtCountdown, fmtDuration });
