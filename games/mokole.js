/*
  Mokolé (weresaurians) for Werewolf: the Apocalypse.

  SOURCE: the Mokolé breedbook PDF in the owner's library ("Core" for this game):
  creation summary p. 47, breeds/auspices/streams Chapter "Noonday", forms and
  varna p. 38-39, Renown charts p. 44-45, Gifts "Evening: Dragon Eye",
  Merits & Flaws near the end of the book.
*/
(function () {
  const R = WOD.random;
  const F = WOD.fera;
  const G = F.G;

  const BOOKS = { Core: "Breedbook: Mokolé" };

  // Seven solar auspice Gift lists (headings name the matching seasonal auspices).
  const SUN_GIFTS = {
    Rising: G({ 1: ["Bellow", "Eye of the Raptor", "Master of Fire"], 2: ["Paint the Meadows", "Sense Silver"], 3: ["Call the Tides", "Combat Healing", "Dragon's Tongue", "Hot Ichor", "Lash of Ages", "Might of the Kings"], 4: ["Anger of the Wani", "Scream of Gaia"], 5: ["Jointsnake's Mojo", "Wall of Granite"] }),
    Noonday: G({ 1: ["Fangs of Judgment", "Gold Claws", "Persuasion", "Truth of Olodumare"], 2: ["Calm", "Strength of Purpose", "Tame Sunbeam"], 3: ["Clear Mind", "Dragon's Tongue", "Eye of the Cobra", "Weak Arm"], 4: ["Raptor's Gaze", "Strength of the Dominator"], 5: ["Geas", "Sleep of the Dragon", "Wisdom of the Sun"] }),
    Setting: G({ 1: ["Burrow", "Mother's Touch", "Resist Pain"], 2: ["Clap of Thunder", "Paint the Meadows", "Rage of the Nest Mother", "Warding Dance"], 3: ["Armor of the Tortoise", "Clarity", "Combat Healing", "Might of the Kings"], 4: ["Clenched Jaw", "Hand of the Earth Lords", "Hot Ichor"], 5: ["Fossilize", "Halo of the Sun"] }),
    Shrouded: G({ 1: ["Call the Rain", "Mother's Touch", "Sense Designer", "Sense Magic", "Spirit Speech"], 2: ["Become Log", "Breaking the Tomorrow Wall", "Command Spirit", "Dream the Matre's Mind", "Send the Dream", "Walking Between Worlds"], 3: ["Call Water Spirit", "Deeper Lungs", "Exorcism", "Open Sun Bridge", "Shadow Wings", "Umbral Shadow Wings"], 4: ["Grasp the Beyond", "Living Treasure", "Recapitulate", "Walk the Matre's Mind"], 5: ["Gorgon's Gaze", "Malleable Spirit"] }),
    Midnight: G({ 1: ["Brother's Scent", "Darksight", "Lambent Flame", "Sense Sun", "Spirits of Laughter"], 2: ["Breaking the Tomorrow Wall", "Dreamspeak", "Glib Tongue"], 3: ["Become Log", "Invisibility", "Open Sun Bridge"], 4: ["Fool's Luck", "Shadows by the Firelight"], 5: ["Sleep of the Dragon", "Steal Shape", "Take the True Form", "Thousand Forms"] }),
    Decorated: G({ 1: ["Cooking", "Mercy", "Mother's Touch", "Pack Tactics", "Persuasion", "Pilot Snake", "Wind Beneath my Wings"], 2: ["Call to Duty", "Command the Gathering", "Dragon Drill", "Walking Between Worlds"], 3: ["Long Running", "Reshape Object"], 4: ["Infest", "Shadows by the Firelight", "Strength of the Dominator"], 5: ["Calm the Flock", "Chaos Mechanics", "Obedience"] }),
    Eclipsed: G({ 1: ["Aura of Confidence", "Bellow", "Heightened Senses", "Lambent Flame"], 2: ["Awe", "Dazzle", "Walking Between Worlds"], 3: ["Dragon-King's Majesty", "Eye of the Cobra", "Hot Ichor", "Wrath of the Dragon"], 4: ["Mastery", "Sun Enfleshed"], 5: ["Army of the Ancestors", "Dream Semblance", "Halo of the Sun", "Stop Continental Drift"] }),
  };

  // Renown charts (p. 44): Glory/Honor/Wisdom per Rank, or a total for Shining.
  const chart = (g, h, w) => [[1, 1, 1], [g[0], h[0], w[0]], [g[1], h[1], w[1]], [g[2], h[2], w[2]], [g[3], h[3], w[3]]].map(([Glory, Honor, Wisdom]) => ({ Glory, Honor, Wisdom }));
  const CHARTS = {
    glory: chart([4, 6, 8, 10], [2, 3, 4, 5], [2, 3, 4, 5]),
    honor: chart([2, 3, 4, 5], [4, 6, 8, 10], [2, 3, 4, 5]),
    wisdom: chart([2, 3, 4, 5], [2, 3, 4, 5], [4, 6, 8, 10]),
    total: [3, 9, 14, 19, 24],
  };

  const DATA = {
    books: BOOKS,
    breeds: {
      Homid: { gnosis: 2 },
      Suchid: { gnosis: 4 },
    },
    // Solar auspices (Gumagan and Mokolé-mbembe).
    solar: {
      "Rising Sun": { title: "Striking", willpower: 3, gifts: "Rising", renown: "glory" },
      "Noonday Sun": { title: "Unshading", willpower: 5, gifts: "Noonday", renown: "honor" },
      "Setting Sun": { title: "Warding", willpower: 3, gifts: "Setting", renown: "glory" },
      "Shrouded Sun": { title: "Concealing", willpower: 4, gifts: "Shrouded", renown: "wisdom" },
      "Midnight Sun": { title: "Shining", willpower: 4, gifts: "Midnight", renown: "total" },
      "Decorated Sun": { title: "Gathering", willpower: 5, gifts: "Decorated", renown: "wisdom" },
      "Eclipsed Sun": { title: "Crowning", willpower: 5, gifts: "Eclipsed", renown: "honor" },
    },
    // Seasonal auspices. Renown follows the matching Garou auspice (p. 45).
    makara: {
      Hemanta: { title: "winter; tricksters", willpower: 2, gifts: "Midnight", garou: "Ragabash" },
      Zarad: { title: "autumn; mystics", willpower: 3, gifts: "Shrouded", garou: "Theurge" },
      Grisma: { title: "summer; judges", willpower: 4, gifts: "Decorated", garou: "Philodox" },
      Vasanta: { title: "spring; warriors", willpower: 5, gifts: "Rising", garou: "Ahroun" },
    },
    zhongLung: {
      "Tung Chun": { title: "spring; warriors and lovers", rage: 4, gifts: "Setting", garou: "Ahroun" },
      "Nam Hsia": { title: "summer; judges", rage: 3, gifts: "Noonday", garou: "Philodox" },
      "Sai Chau": { title: "autumn; seers and scholars", rage: 2, gifts: "Eclipsed", garou: "Theurge" },
      "Pei Tung": { title: "winter; jokers and tricksters", rage: 1, gifts: "Midnight", garou: "Ragabash" },
    },
    streams: {
      Gumagan: { place: "Australia", auspices: "solar", varna: ["Karna", "Ora"], gills: true,
        gifts: G({ 1: ["Songlines"], 2: ["Dreamwalk"], 3: ["Bunyip's Boom", "Landspeak"], 4: ["Nightmare Mnesis"], 5: ["Billabong Walk", "Bloody-Mindedness"] }) },
      Makara: { place: "India", auspices: "makara", varna: ["Gharial", "Makara", "Karna"],
        gifts: G({ 3: ["The Thousand Arrows"], 5: ["Great as a White Hill"] }) },
      "Mokolé-mbembe": { place: "Africa and the Americas", auspices: "solar", varna: ["Halpatee", "Piasa", "Champsa", "Syrta", "Unktehi"],
        gifts: G({ 3: ["Beak of the Finch", "Heat Wave"], 4: ["Walk into My Eyes"] }) },
      "Zhong Lung": { place: "East Asia", auspices: "zhongLung", varna: ["Makara", "Karna", "Ora"], willpower: 4,
        gifts: G({ 1: ["Chi'ih Ming", "Dragon Milk", "Shou"], 2: ["Clap of Thunder"], 3: ["Send the Dream", "The Dragon's Tongue"], 4: ["Anger of the Wani", "Harmony of the Soul", "Sleep of Hsi Wang Mu"], 5: ["A Thousand Secret Faces"] }) },
    },
    // Suchid form and Rage by varna (p. 38).
    varna: {
      Champsa: { animal: "Nile crocodile", rage: 3, mods: { Strength: 3, Dexterity: -2, Stamina: 3, Manipulation: -4 } },
      Gharial: { animal: "gavial", rage: 4, mods: { Strength: 1, Dexterity: -1, Stamina: 3, Manipulation: -4 } },
      Halpatee: { animal: "American alligator", rage: 4, mods: { Strength: 2, Dexterity: -1, Stamina: 3, Manipulation: -2 } },
      Karna: { animal: "saltwater crocodile", rage: 3, mods: { Strength: 3, Dexterity: -2, Stamina: 3, Manipulation: -4 } },
      Makara: { animal: "mugger crocodile / Chinese alligator", rage: 3, mods: { Strength: 1, Dexterity: 0, Stamina: 2, Manipulation: -3 } },
      Ora: { animal: "monitor lizard", rage: 5, mods: { Strength: 0, Dexterity: 0, Stamina: 2, Manipulation: -4 } },
      Piasa: { animal: "American crocodile", rage: 4, mods: { Strength: 2, Dexterity: -1, Stamina: 3, Manipulation: -2 } },
      Syrta: { animal: "caiman", rage: 4, mods: { Strength: 1, Dexterity: -1, Stamina: 3, Manipulation: -4 } },
      Unktehi: { animal: "Gila monster", rage: 5, mods: { Strength: -1, Dexterity: 0, Stamina: 1, Manipulation: -3 } },
    },
    archidMods: { Strength: 4, Dexterity: -1, Stamina: 4, Manipulation: -3 },
    // Archid Characteristics (p. 38-39). * = may be taken more than once.
    archid: ["Air Sacs", "Armored Scales*", "Back Sail", "Behemoth*", "Binocular Vision", "Bladed Tail", "Color Change*", "Constricting Coils", "Contact Venom", "Crop", "Deep Lung", "Dragon Mask", "Duck Bill", "Extra Limbs*", "Eye Cones", "Feathers", "Fiery Pearl", "Fins", "Fire Breath*", "Food Storage", "Fur", "Gecko Pads", "Gills", "Grasping Hands", "Hard Skull", "Hinged Jaw", "Hollow Bones", "Horn", "Huge Size", "Jacobson's Organ", "Long Neck", "Long Teeth", "Long Tongue", "Multiple Heads", "Neck Frill", "Nictating Membrane", "Poison Sacs*", "Predator's Roar", "Prehensile Tail", "Regeneration", "Resplendent Crest", "Royal Crest", "Sacral Plexus*", "Sickening Slime", "Snorkel", "Spitter", "Tail Club", "Tall*", "Terrible Claws", "Thorns", "Throat Sac and Wattles", "Tongue Flick", "Upright Walking", "Webbed Feet", "Wings"],

    general: G({
      1: ["Falling Touch", "Fatal Flaw", "Find Land", "Find Water", "Inspiration", "Razor Claws", "Scent of Sweet Nectar", "Sense Dissolver", "Sense Moon", "Sense Prey", "Shed", "Sight of the True Form", "Speed of Thought", "Tailbiter's Mumble", "Talk"],
      2: ["Axis Mundi", "Blessings of the Nest", "Reptoid Form", "Sense Gold", "Silver Claws", "Stinking Breath", "Tides of Lust", "Waxwork Monster"],
      3: ["Bark of the Mudpuppy", "Dragon's Breath", "Dragonfear", "Walking Between Worlds"],
      4: ["Attunement", "Cocoon", "Serenity", "View the Seed"],
      5: ["Grasp the Beyond", "Song of the Great Beast"],
    }),

    rankTitles: ["Hatchling", "Son/Daughter", "Brother/Sister", "Father/Mother", "Grandfather/Grandmother"],
    backgrounds: ["Allies", "Contacts", "Fetish", "Kinfolk", "Mentor", "Mnesis", "Resources", "Rites", "Totem", "Wallow"],
    // Suchid limits (breeds section).
    suchidAvoids: ["Drive", "Etiquette", "Firearms", "Computer", "Law", "Linguistics", "Medicine", "Politics", "Science"],
    suchidNoBackgrounds: ["Resources", "Allies", "Contacts"],

    // [name, cost, book, stream limit]
    merits: [
      ["Bird-spirit Companion", 1], ["Manshape", 1], ["Mnesis of the Lost Ones", 1], ["Terrible Footsteps", 1], ["Yathamaya", 1], ["Bite of the Monitor", "1-5"],
      ["Retain Eggs", 2], ["Retain Seed", 2], ["Temperature Control", 2], ["Farm Ties", 3], ["Sacred Crocodile", 3], ["Eidetic Memory", 5], ["Gold Tolerance", 5],
      ["Backwards Mnesis", 7], ["Color Change", 7], ["Silver Tolerance", 7], ["Step Sideways", 7], ["Veiled to Garou", 7],
      ["Song Owner", 1, "Core", "Gumagan"], ["High Caste", 1, "Core", "Makara"], ["Char", 3, "Core", "Makara"], ["Same-bito Kin", 1, "Core", "Zhong Lung"],
    ].map(([n, c, b = "Core", s]) => (s ? [n, c, b, s] : [n, c, b])),
    flaws: [
      ["Albino", 1], ["Deaf", 1], ["Diurnal", 1], ["Migratory Urges", 1], ["Molt", 1], ["Monogamous", 1], ["Scavenger", 1], ["Slime", 1], ["Small", 1], ["Speechless", 1],
      ["Bad Mnesis", "2-5"], ["Cold-blooded", 2], ["Dream Hunter", 2], ["Exclusive Herbivore", 2], ["Infamous Elder/Clutch", "2-4"], ["Insane Elder", 2], ["Stench", 2], ["Sterile/Barren", 2], ["Wall Eye", 2],
      ["Eyes of the Tyrant", 3], ["Fallen Elder/Clutch", "3-5"], ["Hunted", 3], ["Limbless", 4], ["Great Fossil Lizard", 5],
      ["Fear of Iron", 1, "Core", "Zhong Lung"], ["Fertile Essence", 1, "Core", "Zhong Lung"], ["Stone Blind", 2, "Core", "Zhong Lung"],
    ].map(([n, c, b = "Core", s]) => (s ? [n, c, b, s] : [n, c, b])),
    randomSkip: ["Retain Eggs", "Retain Seed", "Insane Elder"],

    names: {
      female: ["Adaeze", "Amaka", "Esi", "Ifeoma", "Lien", "Mei", "Nandi", "Yindi"],
      male: ["Bao", "Chidi", "Dinh", "Hiroshi", "Jarrah", "Kwame", "Obi", "Ravi", "Sanjay", "Tao", "Uzoma", "Wei"],
      last: ["Adeyemi", "Banerjee", "Chen", "Diallo", "Eze", "Huang", "Iyer", "Juma", "Kaur", "Liu", "Mensah", "Nguyen", "Obi", "Patel", "Rao", "Sato", "Tan", "Wong"],
      suchid: ["Old-Stone-Tooth", "Sun-on-the-Bank", "Deep-River-Waiting", "Mud-Sleeper", "Long-Smile", "Still-Water", "Basks-at-Noon", "Ancient-Eye", "Reed-Hider", "Slow-Thunder"],
    },
    concepts: ["Antiquarian", "Crocodile farmer", "Fisherman", "Folklorist", "Hermit", "Museum curator", "Park ranger", "Priest", "River guide", "Storyteller", "Swamp hunter", "Zoo keeper"],
    suchidConcepts: ["Old river lord", "Swamp hunter", "Wallow guardian", "Wanderer of the waters", "Young hatchling", "Basking dreamer"],
  };
  // Extra Gifts from the Players Guide to the Changing Breeds (Revised).
  BOOKS.PGCB = "Players Guide to the Changing Breeds";
  SUN_GIFTS.Noonday.extra.PGCB = { 4: ["Serenity"] };
  SUN_GIFTS.Midnight.extra.PGCB = { 3: ["Open Moon Bridge"] };
  SUN_GIFTS.Shrouded.extra.PGCB = { 1: ["Sense Dissolver"] };

  window.MOKOLE_DATA = DATA;

  const physSoc = ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance"];

  function auspiceTable(streamName) {
    const kind = DATA.streams[streamName].auspices;
    return DATA[kind];
  }

  function formsFor(varnaName) {
    return [
      { name: "Homid", mods: {} },
      { name: "Archid", mods: DATA.archidMods, zero: ["Appearance"] },
      { name: `Suchid (${varnaName})`, mods: DATA.varna[varnaName].mods },
    ];
  }

  function generate(opts) {
    const rank = Math.min(5, Math.max(1, Number(opts.rank) || 1));
    const freebieTotal = Number.isFinite(opts.freebies) ? opts.freebies : 15;

    const breed = opts.breed || R.pick(Object.keys(DATA.breeds));
    const streamName = opts.stream || R.pick(Object.keys(DATA.streams));
    const stream = DATA.streams[streamName];
    const table = auspiceTable(streamName);
    // The page's Auspice list mixes all three systems; use it only if it fits this stream.
    const auspice = opts.auspice && table[opts.auspice] ? opts.auspice : R.pick(Object.keys(table));
    const a = table[auspice];
    const varnaName = opts.varna || R.pick(stream.varna);
    const v = DATA.varna[varnaName];
    const notes = [];
    const gender = F.pickGender(opts);
    if (opts.auspice && !table[opts.auspice]) notes.push(`${opts.auspice} isn't a ${streamName} auspice, so ${auspice} was rolled instead.`);
    if (!stream.varna.includes(varnaName)) notes.push(`${varnaName} is uncommon among the ${streamName}.`);

    const { attrs, priority: attrPriority } = F.attributes();
    const { abil, priority: abilPriority, ok: abilityOk } = F.abilities(breed === "Suchid" ? DATA.suchidAvoids : []);
    const { bg, allowed: bgAllowed } = F.backgrounds(DATA.backgrounds, breed === "Suchid" ? DATA.suchidNoBackgrounds : []);

    // One auspice Gift and one general Gift; one more of each new level per Rank.
    const auspiceGifts = SUN_GIFTS[a.gifts];
    const picker = F.giftPicker([[auspiceGifts, auspice], [DATA.general, "General"], [stream.gifts, streamName]], opts.books === "Core book only");
    picker.take(1, auspice);
    picker.take(1, "General");
    for (let lvl = 2; lvl <= rank; lvl++) picker.take(lvl, null);

    // Rage by varna (by auspice for Zhong Lung); Willpower by auspice (4 for Zhong Lung).
    const adv = {
      Rage: stream.auspices === "zhongLung" ? a.rage : v.rage,
      Gnosis: DATA.breeds[breed].gnosis,
      Willpower: stream.willpower || a.willpower,
    };

    const need = a.garou ? window.WEREWOLF_DATA.renownByRank[a.garou][rank - 1] : (a.renown === "total" ? CHARTS.total[rank - 1] : CHARTS[a.renown][rank - 1]);
    const renown = F.renown(["Glory", "Honor", "Wisdom"], need);

    const rollable = (mf) => !DATA.randomSkip.includes(mf[0]) && (!mf[3] || mf[3] === streamName);
    const mf = F.meritsFlaws(DATA, freebieTotal, rollable, opts.meritsFlaws !== "No");
    const fr = F.spendFreebies({ attrs, abil, abilityOk, bg, bgAllowed, adv, picker }, mf.freebies);

    // Archid Characteristics: as many points as final Gnosis (Gumagan also have Gills).
    const chars = stream.gills ? ["Gills"] : [];
    for (let i = 0; i < adv.Gnosis; i++) {
      const pool = DATA.archid.filter((c) => c.endsWith("*") || !chars.includes(c));
      chars.push(R.pick(pool).replace("*", ""));
    }
    const charCounts = {};
    chars.forEach((c) => (charCounts[c] = (charCounts[c] || 0) + 1));
    const charList = Object.entries(charCounts).map(([c, n]) => (n > 1 ? `${c} ×${n}` : c));
    if (stream.gills) notes.push("All Gumagan have Gills for free.");

    const name = breed === "Suchid" ? R.pick(DATA.names.suchid) : `${F.firstName(DATA.names, gender)} ${R.pick(DATA.names.last)}`;
    const auspiceText = a.title ? `${auspice} (${a.title})` : auspice;

    const allAuspices = [
      ...Object.entries(DATA.solar).map(([n, x]) => [n, x.gifts]),
    ];
    const others = [
      ...allAuspices.filter(([n, key]) => key !== a.gifts).map(([n, key]) => [`${n} (other auspice)`, n, SUN_GIFTS[key]]),
      ...Object.entries(DATA.streams).filter(([n]) => n !== streamName).map(([n, s]) => [`${n} (other stream)`, n, s.gifts]),
    ];

    return F.sheet({
      game: "Mokolé",
      name,
      header: [
        ["Name", name], ["Player", ""], ["Chronicle", ""],
        ["Breed", breed], ["Auspice", auspiceText], ["Stream", `${streamName} (${stream.place})`],
        ["Nature", R.pick(F.ARCHETYPES)], ["Demeanor", R.pick(F.ARCHETYPES)], ["Concept", breed === "Suchid" ? R.pick(DATA.suchidConcepts) : R.pick(DATA.concepts)],
        ["Rank", `${rank} (${DATA.rankTitles[rank - 1]})`], ["Varna", `${varnaName} (${v.animal})`], ["Gender", gender],
        ["Clutch", ""], ["Totem", ""], ["Notes", ""],
      ],
      attrs, attrPriority, abil, abilPriority,
      bg, bgList: DATA.backgrounds,
      gifts: picker.gifts,
      giftOptions: F.giftOptions([[`${auspice} (auspice)`, auspice, auspiceGifts], ["General", "General", DATA.general], [`${streamName} (stream)`, streamName, stream.gifts]], others),
      rank, renown,
      extraColumns: [{
        title: "Archid Form",
        columns: [{
          title: `Archid Characteristics (points = Gnosis ${adv.Gnosis})`,
          list: charList,
          listOptions: [{ options: DATA.archid.map((c) => c.replace("*", "")) }],
          allowCustom: true,
          addLabel: "Add characteristic",
          customPrompt: "Archid characteristic:",
        }],
      }],
      merits: mf.merits, flaws: mf.flaws, mfData: DATA, mfOwn: streamName,
      adv,
      formColumns: ["Form", ...physSoc],
      formRows: F.formRows(formsFor(varnaName), attrs, physSoc),
      notes,
      freebieTotal, spent: fr.spent, leftover: fr.left,
      books: BOOKS,
      build: {
        avoid: breed === "Suchid" ? DATA.suchidAvoids : [],
        noBg: breed === "Suchid" ? DATA.suchidNoBackgrounds : [],
        giftHint: `One Level 1 Gift from your auspice (${auspice}) and one from the General list${rank > 1 ? `, plus one Gift of each Level from 2 to ${rank}` : ""}.`,
      },
    });
  }

  function recompute(c) {
    const varnaText = c.header.find((h) => h[0] === "Varna")[1];
    const varnaName = Object.keys(DATA.varna).find((n) => varnaText.startsWith(n)) || "Karna";
    c.table.rows = F.formRows(formsFor(varnaName), F.attrsFromSheet(c), physSoc);
  }

  WOD.registerGame({
    id: "mokole",
    label: "Mokolé (weresaurians)",
    options: [
      { id: "breed", label: "Breed", choices: Object.keys(DATA.breeds) },
      { id: "stream", label: "Stream", choices: Object.keys(DATA.streams) },
      { id: "auspice", label: "Auspice", choices: [...Object.keys(DATA.solar), ...Object.keys(DATA.makara), ...Object.keys(DATA.zhongLung)] },
      { id: "varna", label: "Varna", choices: Object.keys(DATA.varna) },
      { id: "gender", label: "Gender", choices: ["Female", "Male"] },
      { id: "rank", label: "Rank", choices: [1, 2, 3, 4, 5], default: 1, random: false },
      { id: "freebies", label: "Freebie points", type: "number", min: 0, max: 500, default: 15 },
      { id: "meritsFlaws", label: "Merits & Flaws", choices: ["Random", "No"], default: "Random", random: false },
      { id: "books", label: "Books", choices: ["All my books", "Core book only"], default: "All my books", random: false },
    ],
    generate,
    recompute,
  });
})();
