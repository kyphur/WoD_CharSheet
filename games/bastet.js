/*
  Bastet (werecats) for Werewolf: the Apocalypse.

  SOURCE: Breedbook: Bastet ("Core" for this game). Character creation p. 90-91,
  Rank p. 89, tribe form tables in Chapter Two, Gifts in Chapter Four.
  Merits & Flaws: the Werewolf lists (Players Guide to Garou / Werewolf Players Guide),
  minus the ones the Bastet book calls inappropriate for werecats (p. 79).
*/
(function () {
  const R = WOD.random;
  const F = WOD.fera;
  const G = F.G;

  const BOOKS = { Core: "Breedbook: Bastet", PGG: "Players Guide to Garou (Revised)", WPG: "Werewolf Players Guide (2nd ed.)" };

  // Form modifiers by tribe. Where the book prints an unsigned "0" for Appearance in
  // Crinos/Chatro, the form's Appearance becomes 0 (like a Garou Crinos).
  const forms = (sokto, crinos, chatro, feline) =>
    [["Homid", {}], ["Sokto", sokto], ["Crinos", crinos], ["Chatro", chatro], ["Feline", feline]].map(([name, m]) => {
      const mods = { ...m };
      const zero = [];
      if (mods.Appearance === "zero") { delete mods.Appearance; zero.push("Appearance"); }
      return { name, mods, zero };
    });
  const S = (Str, Dex, Sta, Man, App) => ({ Strength: Str, Dexterity: Dex, Stamina: Sta, Manipulation: Man, ...(App === undefined ? {} : { Appearance: App }) });
  const Z = "zero";

  const DATA = {
    books: BOOKS,

    breeds: {
      Homid: { gnosis: 2, gifts: G({ 1: ["Cat Claws", "Sweet Hunter's Smile"], 2: ["Eavesdropper's Ear", "Jam Technology"], 3: ["Babel's Cure", "Craft of the Maker"], 4: ["Monkey's Uncle", "What's the Password?"], 5: ["Black Friday", "Deny the Hungry"] }) },
      Metis: { gnosis: 4, gifts: G({ 1: ["Create Element", "Sense Primal Nature"], 2: ["Blinding Moonbeam Gaze", "Whisker Sight"], 3: ["Fist of Cahlash", "Spirit-Touch"], 4: ["Moon's Gateway", "Redeem the Waste"], 5: ["Moon Sense", "Wrath of Nala"] }) },
      Feline: { gnosis: 6, gifts: G({ 1: ["Kitten's Cry", "Mark as Mine"], 2: ["Killer's Leap", "Perfect Cover"], 3: ["Underbelly", "Whisker Sight"], 4: ["Ghosts at Play", "Hand of Will"], 5: ["Judgment of Pestilence", "Revolt of the Land"] }) },
    },

    pryio: {
      Daylight: "open and honest; tackles things head-on",
      Twilight: "sees many shades; prefers complex, artistic pursuits",
      Night: "private; angry when someone intrudes",
    },

    general: G({
      1: ["Banish Sickness", "Catfeet", "Command Attention", "Dowsing", "Lick Wounds", "Open Seal", "Pathfinder's Pride", "Razor Claws", "Sense the Truth", "Sense Unmaker's Hand", "Silent Stalking", "Spirits' Sight", "Treeclimber"],
      2: ["Call Spirits", "Cat Sight", "Eerie Eyes", "First Slash", "Night Terror", "Night's Passage", "Sense of the Prey", "Sense Silver", "Shriek", "Summon Water", "Swipe", "Touch the Mind"],
      3: ["Call the Pride", "Caper", "Cat Fear", "Cheshire Prank", "Command the Prey", "Farsight", "Freyja's Blessing", "Gift of Rage", "Ignore Pain", "Impala's Flight", "Purr", "Righteous Gaze"],
      4: ["Attunement", "Clawstorm", "Fortuna", "Spirit Claws", "Spitfire", "Walking Between Worlds", "Wolf's Terror"],
      5: ["Future Warning", "Jump to the Moon", "Perfect Passage", "Soothe/Summon Storm", "Withering Stare"],
    }),

    tribes: {
      Bagheera: { animal: "panther/leopard", rage: 2, willpower: 4, forms: forms(S(1, 1, 2, -1, -1), S(3, 3, 3, -3, Z), S(2, 3, 3, -3, -2), S(1, 3, 2, -3)),
        gifts: G({ 1: ["Humbaba's Escape", "Treeclimber"], 2: ["Lawgiver's Legacy", "Ojas Surge"], 3: ["Cobra's Dance", "Traveler's Tongues"], 4: ["Potter's Clay", "The Paradox of Time"], 5: ["Part the Curtain", "Shiva's Might"] }) },
      Balam: { animal: "jaguar", rage: 4, willpower: 3, forms: forms(S(2, 1, 2, -1, -1), S(3, 3, 3, -4, Z), S(3, 2, 3, -4, Z), S(2, 3, 2, -3)),
        gifts: G({ 1: ["Hunter's Mists", "Storm of Pests"], 2: ["Ancestral Wings", "Smoking Mirror"], 3: ["Touch of the Tree-Frog", "Wandering Forest"], 4: ["Jungle's Vengeance", "Vision Cloud"], 5: ["Feed the Gods", "Heal the Wounded Land"] }) },
      Bubasti: { animal: "mystic Egyptian cat", rage: 1, willpower: 5, forms: forms(S(0, 1, 0, 0, 1), S(1, 3, 1, -2, -3), S(2, 4, 1, -2, Z), S(-1, 4, 1, 0)),
        gifts: G({ 1: ["Alms to the Poor", "Scholar's Friend"], 2: ["Mousemaze", "Spirit Ward"], 3: ["Banish Cahlash's Brood", "The Many Tongues of Ptah"], 4: ["Shadowplay", "The Scarab's Flight"], 5: ["Deny the Hungry", "Spirit Wall"], 6: ["The Fleeing Scarab"] }) },
      Ceilican: { animal: "faerie cat", rage: 3, willpower: 3, forms: forms(S(0, 2, 1, 0, 1), S(1, 3, 1, 0, -2), S(0, 4, 1, -2, -2), S(-1, 4, 0, -2)),
        note: "Ceilican change Pryio unpredictably.",
        gifts: G({ 1: ["Mother's Blessing/Curse", "Satyr's Wisdom"], 2: ["Banish Burning", "Sorcerer's Blade"], 3: ["Data Flow", "Phantasm"], 4: ["Monkey's Uncle", "Small Cousin"], 5: ["Chariot of Lions", "The Madness of Crowds"] }) },
      Khan: { animal: "tiger", rage: 5, willpower: 2, forms: forms(S(2, 1, 2, -1, -1), S(3, 2, 3, -3, Z), S(4, 2, 3, -3, Z), S(2, 2, 3, -3)),
        gifts: G({ 1: ["Rhino's Favor", "Skin of Jade"], 2: ["Heart of Fury", "Ricepaper Walk"], 3: ["Maker's Charm", "Paws of the Raging Spirit Tiger"], 4: ["Asuras' Bane", "Dragonroar"], 5: ["Call to Battle", "Thousand-Thunder Strike"] }) },
      Pumonca: { animal: "cougar", rage: 3, willpower: 4, forms: forms(S(1, 2, 2, -1, 0), S(3, 3, 4, -3, Z), S(3, 3, 3, -3, Z), S(2, 3, 3, 0)),
        gifts: G({ 1: ["Mockingbird's Mirror", "Wanderer's Boon"], 2: ["Raincalling", "Stonework"], 3: ["Bayou Shambler", "Thunderbolt"], 4: ["Element-Folk Favor", "The Hungry Earth"], 5: ["Earthspeaking", "Thunderbird's Cry"], 6: ["Earthquake"] }) },
      Qualmi: { animal: "lynx", rage: 2, willpower: 5, forms: forms(S(0, 2, 0, 0, 1), S(1, 3, 1, -2, Z), S(1, 4, 1, -2, Z), S(0, 4, 0, -2)),
        gifts: G({ 1: ["Breakfast of Stones", "Turned Fur"], 2: ["No Hidden Thing", "Wind from the West"], 3: ["Drop of Sea", "Nighttime Web"], 4: ["Dancing on Air", "Still Breeze Blowing"], 5: ["Call Down the Stars", "Water's Vision"] }) },
      Simba: { animal: "lion", rage: 5, willpower: 2, forms: forms(S(2, 1, 2, -1, 1), S(3, 2, 3, -2, Z), S(3, 2, 3, -2, Z), S(3, 3, 2, -1)),
        gifts: G({ 1: ["Majesty", "Submit"], 2: ["Armor of Kings", "Rallying Challenge"], 3: ["Fireroar", "Shadow the Moon's Light"], 4: ["King of Beasts", "The Bountiful Dominion"], 5: ["Command the Multitude", "Rising Sun"], 6: ["Royal Privilege"] }) },
      Swara: { animal: "cheetah", rage: 2, willpower: 4, forms: forms(S(1, 2, 1, -1, 0), S(2, 4, 3, -3, Z), S(2, 4, 3, -3, Z), S(1, 4, 2, -3)),
        gifts: G({ 1: ["Diamond Claws", "Impala's Flight"], 2: ["Walking Between Worlds", "Weight of a Heart"], 3: ["Clearwater Passage", "Dance of the Chaya"], 4: ["Ghost Caress", "Judgment of Pestilence"], 5: ["All Beasts Under the Sun", "River of Blood"] }) },
    },

    // Total permanent Renown needed for each Rank (p. 89), any mix of the three.
    renownByRank: [3, 10, 15, 20, 25],
    rankTitles: ["Tekhmet", "Aka", "Tilau", "Ilani", "Bon Bhat"],
    renownNames: ["Cleverness", "Ferocity", "Honor"],

    backgrounds: ["Allies", "Contacts", "Den-Realm", "Jamak", "Kinfolk", "Mentor", "Pure Breed", "Resources", "Rites", "Secrets", "Trinket"],
    felineAvoids: ["Computer", "Drive", "Firearms", "Law", "Politics", "Science", "Etiquette"],

    // Garou Merits & Flaws the Bastet book calls inappropriate (p. 79), plus wolf-only ones.
    forbidden: ["Ancestor Ally", "Insane Past Life", "Insane Ancestor", "Slip Sideways", "Pack Mentality", "Wolf Years", "Wolf Sight", "Fair Glabro", "Metis Child", "Foe from the Past"],

    metisDeformities: ["Albinism", "Blind in one eye", "Cleft palate", "Deaf", "Hairless patches", "Hunchback", "Lame leg", "Missing tail", "Mute", "Seizures", "Sickly", "Strange odor", "Twisted limb", "Withered arm"],

    concepts: ["Artist", "Loner", "Native hunter", "Professional", "Scholar", "Searcher", "Sneak", "Thrill-seeker", "Vagabond", "Warrior"],
    felineConcepts: ["Escaped zoo cat", "Jungle hunter", "Mountain loner", "Riddling wanderer", "Territorial queen", "Restless young cat"],
    names: {
      female: ["Amara", "Chandra", "Esme", "Ines", "Leila", "Marisol", "Priya", "Selene", "Yara", "Zuri"],
      male: ["Bastien", "Dario", "Farid", "Jahi", "Kiran", "Nkosi", "Omar", "Rafael", "Tariq"],
      last: ["Abara", "Bose", "Castillo", "Darius", "Ekwueme", "Farouk", "Ghosh", "Herrera", "Iyer", "Kamara", "Lopez", "Mbeki", "Nair", "Okoro", "Quispe", "Rahman", "Silva", "Tembo"],
      feline: ["Amber-Eyes", "Quiet-Paw", "Night-Stalker", "Sun-on-Stone", "Tall-Grass", "Silent-Leap", "Moon-Whisker", "Dust-Walker", "Shadow-Tail", "River-Crosser"],
    },
  };
  // Extra Gifts listed in the Players Guide to the Changing Breeds (Revised) that the breedbook lacks.
  BOOKS.PGCB = "Players Guide to the Changing Breeds";
  const pgcb = {
    Homid: { 5: ["Madness"] },
    Feline: { 1: ["Heightened Senses", "Pounce"], 4: ["Beast Life"] },
    Bagheera: { 3: ["Eye of the Cobra"] },
    Balam: { 2: ["Perfect Cover", "Terrors"] },
    Bubasti: { 5: ["Shadow Brethren"] },
    Khan: { 1: ["Razor Claws"], 2: ["Snarl of the Predator"] },
    Pumonca: { 2: ["Speak With Wind Spirits", "Spirit of the Fish"], 4: ["Call Elemental"] },
    Qualmi: { 3: ["Wisdom of the Ancient Ways"], 4: ["Chill of Early Frost"] },
    Simba: { 5: ["Obedience"] },
    Swara: { 2: ["Sense the Unnatural"], 4: ["Speed Beyond Thought"] },
  };
  for (const [name, byLevel] of Object.entries(pgcb)) (DATA.breeds[name] || DATA.tribes[name]).gifts.extra.PGCB = byLevel;

  window.BASTET_DATA = DATA;

  const physSoc = ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance"];

  function mfLists() {
    const W = window.WEREWOLF_DATA;
    const ok = (x) => !x[3] && !DATA.forbidden.includes(x[0]);
    return { merits: W.merits.filter(ok), flaws: W.flaws.filter(ok), randomSkip: W.randomSkip, lupusSkip: W.lupusSkip };
  }

  function generate(opts) {
    const rank = Math.min(5, Math.max(1, Number(opts.rank) || 1));
    const freebieTotal = Number.isFinite(opts.freebies) ? opts.freebies : 15;
    const coreOnly = opts.books === "Core book only";

    const breed = opts.breed || R.pick(Object.keys(DATA.breeds));
    const pryio = opts.pryio || R.pick(Object.keys(DATA.pryio));
    const tribe = opts.tribe || R.pick(Object.keys(DATA.tribes));
    const b = DATA.breeds[breed];
    const t = DATA.tribes[tribe];
    const notes = t.note ? [t.note] : [];
    const gender = F.pickGender(opts);

    const { attrs, priority: attrPriority } = F.attributes();
    const { abil, priority: abilPriority, ok: abilityOk } = F.abilities(breed === "Feline" ? DATA.felineAvoids : []);
    const { bg, allowed: bgAllowed } = F.backgrounds(DATA.backgrounds, breed === "Feline" ? ["Resources"] : []);

    // Three Level 1 Gifts from General, Breed and Tribe "in any combination" (p. 90);
    // then one Gift of each new level for every Rank above 1.
    const picker = F.giftPicker([[DATA.general, "General"], [b.gifts, breed], [t.gifts, tribe]], coreOnly);
    for (let i = 0; i < 3; i++) picker.take(1, null);
    for (let lvl = 2; lvl <= rank; lvl++) picker.take(lvl, null);

    const adv = { Rage: t.rage, Gnosis: b.gnosis, Willpower: t.willpower };
    const renown = F.renown(DATA.renownNames, DATA.renownByRank[rank - 1]);

    const mfData = mfLists();
    const rollable = (mf) =>
      !mfData.randomSkip.includes(mf[0]) &&
      !(breed === "Feline" && mfData.lupusSkip.includes(mf[0])) &&
      (!coreOnly || mf[2] === "Core");
    const mf = F.meritsFlaws(mfData, freebieTotal, rollable, opts.meritsFlaws !== "No");
    const fr = F.spendFreebies({ attrs, abil, abilityOk, bg, bgAllowed, adv, picker }, mf.freebies);

    const name = breed === "Feline" ? R.pick(DATA.names.feline) : `${F.firstName(DATA.names, gender)} ${R.pick(DATA.names.last)}`;
    const extras = [];
    if (breed === "Metis") extras.push({ title: "Metis Deformity", text: R.pick(DATA.metisDeformities) });
    extras.push({ title: `Pryio: ${pryio}`, text: DATA.pryio[pryio] });

    const others = [
      ...Object.entries(DATA.breeds).filter(([n]) => n !== breed).map(([n, v]) => [`${n} (other breed)`, n, v.gifts]),
      ...Object.entries(DATA.tribes).filter(([n]) => n !== tribe).map(([n, v]) => [`${n} (other tribe)`, n, v.gifts]),
    ];

    return F.sheet({
      game: "Bastet",
      name,
      header: [
        ["Name", name], ["Player", ""], ["Chronicle", ""],
        ["Breed", breed], ["Pryio", pryio], ["Tribe", `${tribe} (${t.animal})`],
        ["Nature", R.pick(F.ARCHETYPES)], ["Demeanor", R.pick(F.ARCHETYPES)], ["Concept", breed === "Feline" ? R.pick(DATA.felineConcepts) : R.pick(DATA.concepts)],
        ["Gender", gender], ["Rank", `${rank} (${DATA.rankTitles[rank - 1]})`], ["Pride", ""],
        ["Taghairm", ""], ["Den-Realm", ""], ["Jamak", ""],
      ],
      attrs, attrPriority, abil, abilPriority,
      bg, bgList: DATA.backgrounds,
      gifts: picker.gifts,
      giftOptions: F.giftOptions([[`General`, "General", DATA.general], [`${breed} (breed)`, breed, b.gifts], [`${tribe} (tribe)`, tribe, t.gifts]], others),
      rank, renown,
      merits: mf.merits, flaws: mf.flaws, mfData, mfOwn: tribe,
      adv,
      formColumns: ["Form", ...physSoc],
      formRows: F.formRows(t.forms, attrs, physSoc),
      extras, notes,
      freebieTotal, spent: fr.spent, leftover: fr.left,
      books: BOOKS,
      tribe,
      build: {
        avoid: breed === "Feline" ? DATA.felineAvoids : [],
        noBg: breed === "Feline" ? ["Resources"] : [],
        giftHint: `Three Level 1 Gifts in any mix from the General, ${breed} (breed) and ${tribe} (tribe) lists${rank > 1 ? `, plus one Gift of each Level from 2 to ${rank}` : ""}.`,
      },
    });
  }

  function recompute(c) {
    const tribe = Object.keys(DATA.tribes).find((t) => c.header.find((h) => h[0] === "Tribe")[1].startsWith(t));
    c.table.rows = F.formRows(DATA.tribes[tribe || "Bagheera"].forms, F.attrsFromSheet(c), physSoc);
  }

  WOD.registerGame({
    id: "bastet",
    label: "Bastet (werecats)",
    options: [
      { id: "breed", label: "Breed", choices: Object.keys(DATA.breeds) },
      { id: "pryio", label: "Pryio", choices: Object.keys(DATA.pryio) },
      { id: "tribe", label: "Tribe", choices: Object.keys(DATA.tribes) },
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
