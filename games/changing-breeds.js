/*
  The other Changing Breeds: Ajaba, Ananasi, Corax, Gurahl, Kitsune, Nagah,
  Nuwisha, Ratkin, Rokea.

  SOURCE ("Core" for these games): Players Guide to the Changing Breeds (Revised),
  Chapter Two. The book is a scan; text came from OCR and every creation summary
  and form table was read from page images. Gift names come from OCR and may
  contain an occasional misread letter.

  The book gives each race's Renown categories but not how much Renown each
  Rank needs; where noted, the Garou "any mix" totals (3/7/13/19/25) are used.

  Each race is plain data handed to WOD.fera.simpleGame (see fera.js).
*/
(function () {
  const F = WOD.fera;
  const G = F.G;
  const W = window.WEREWOLF_DATA;
  const BOOKS = { Core: "Players Guide to the Changing Breeds", PGG: "Players Guide to Garou", WPG: "Werewolf Players Guide" };
  const copy = (set) => F.mergeSets(set); // core-only copy, so Garou data isn't changed
  const TOTALS = [3, 7, 13, 19, 25];
  const GENERIC_BG = ["Allies", "Ancestors", "Contacts", "Fetish", "Kinfolk", "Mentor", "Pure Breed", "Resources", "Rites", "Totem"];
  const NOT_WOLF = ["Wolf Sight", "Wolf Years", "Fair Glabro", "Pack Mentality", "Ancestor Ally", "Insane Ancestor", "Metis Child", "Sign of the Wolf", "Foe from the Past"];
  const LUPUS_AVOID = W.lupusAvoids;
  const people = {
    female: ["Ada", "Carmen", "Elena", "Grace", "Iris", "Kemi", "Maya", "Oona", "Paz", "Sana", "Vera"],
    male: ["Ben", "Dev", "Femi", "Hugo", "Jonah", "Luis", "Nico", "Rui", "Theo"],
    last: ["Abebe", "Brandt", "Castro", "Dube", "Ellison", "Fujita", "Grey", "Holm", "Ibarra", "Joshi", "Khan", "Laine", "Moss", "Ndiaye", "Ortiz", "Park", "Quinn", "Reed", "Sousa", "Vale"],
  };
  const CONCEPTS = ["Activist", "Artist", "Courier", "Drifter", "Ex-soldier", "Healer", "Investigator", "Mechanic", "Musician", "Scholar", "Street hustler", "Wilderness guide"];
  const form = (name, mods = {}, opts = {}) => ({ name, mods, zero: opts.zero || [], diff: opts.diff });
  const S = (Str, Dex, Sta, Man, App) => Object.fromEntries(Object.entries({ Strength: Str, Dexterity: Dex, Stamina: Sta, Manipulation: Man, Appearance: App }).filter(([, v]) => v !== undefined && v !== 0));

  // ---------------------------------------------------------------- Ajaba (werehyenas), p. 36-41
  F.simpleGame({
    id: "ajaba", label: "Ajaba (werehyenas)", game: "Ajaba", books: BOOKS, gender: true,
    breeds: {
      Homid: { gnosis: { Female: 1, Male: 3 }, start: ["Master of Fire", "Smell of Man"], gifts: copy(W.breeds.Homid.gifts) },
      Metis: { gnosis: 3, start: ["Primal Anger", "Sense Wyrm"], gifts: copy(W.breeds.Metis.gifts), deformity: true, note: "Ajaba metis are usually hermaphroditic and lack the gender-based Rage/Gnosis differences." },
      Hyaena: { gnosis: { Female: 3, Male: 5 }, start: ["Heightened Senses", "Sense Prey"], gifts: copy(W.breeds.Lupus.gifts), animal: true },
    },
    groupA: {
      label: "Aspect",
      choices: {
        Dawn: { rage: { Female: 5, Male: 3, Metis: 4 }, giftsBy: { Female: copy(W.auspices.Ahroun.gifts), Male: copy(W.auspices.Galliard.gifts) },
          startBy: { Female: ["Falling Touch", "Inspiration", "Razor Claws"], Male: ["Beast Speech", "Call of the Wyld", "Mindspeak"], Metis: ["Falling Touch", "Inspiration", "Razor Claws", "Beast Speech", "Call of the Wyld", "Mindspeak"] } },
        Dusk: { rage: { Female: 3, Male: 1, Metis: 2 }, giftsBy: { Female: copy(W.auspices.Ragabash.gifts), Male: copy(W.auspices.Theurge.gifts) },
          startBy: { Female: ["Blur of the Milky Eye", "Open Seal", "Scent of Running Water"], Male: ["Mother's Touch", "Sense Wyrm", "Spirit Speech"], Metis: ["Blur of the Milky Eye", "Open Seal", "Scent of Running Water", "Mother's Touch", "Sense Wyrm", "Spirit Speech"] } },
      },
    },
    general: G({ 1: ["Feral Grin", "Gift of Terror", "Primal Anger", "Sense Prey"], 2: ["Crushing Jaws", "Curse of Hatred", "Sense of the Prey"], 3: ["Clan Loyalty", "Laughter of the Soul"], 4: ["Culling the Weak", "Gnaw", "Gorge"], 5: ["Survivor"] }),
    startGifts: ["breed", "groupA", "general"],
    rage: "groupA", willpower: 3,
    renownNames: ["Ferocity", "Obligation", "Cunning"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: GENERIC_BG, mfForbidden: NOT_WOLF,
    formDiff: false,
    forms: () => [form("Homid"), form("Anthros", S(2, 0, 2, -1, -3)), form("Crinos", S(3, 1, 4, -2), { zero: ["Appearance"] }), form("Crocas", S(3, 2, 3, -2), { zero: ["Appearance"] }), form("Hyaenid", S(1, 2, 2, -2))],
    names: { ...people, animal: ["Laughs-at-Lions", "Bone-Cracker", "Night-Cackler", "Red-Jaw", "Dust-Runner", "Moon-Grinner"] },
    concepts: CONCEPTS, animalConcepts: ["Clan scout", "Savanna hunter", "Young matriarch", "Restless outcast"],
  });

  // ---------------------------------------------------------------- Ananasi (werespiders), p. 42-52
  F.simpleGame({
    id: "ananasi", label: "Ananasi (werespiders)", game: "Ananasi", books: BOOKS,
    note: "Ananasi have no Rage; they use a blood pool instead (spend blood to shift, act, heal and spin webs). Totem: Queen Ananasa.",
    breeds: {
      Homid: { gnosis: 1, willpower: 3 },
      Arachnid: { gnosis: 5, willpower: 4, animal: true },
    },
    groupA: {
      label: "Aspect",
      choices: {
        Myrmidon: { title: "Warrior", gifts: G({ 1: ["Illusion of Size", "Open Seal"], 2: ["Might of Ananasa"], 3: ["Scorpion Tail", "Weak Arm"], 4: ["Blood Hunt", "Drying Bite"], 5: ["Image of the Great Mother", "Thousand Hands"] }) },
        Viskr: { title: "Balancer", gifts: G({ 1: ["Curse of the Great Web", "Shroud"], 2: ["Mindspeak", "Minor Unweaving"], 3: ["Calcify", "Cocoon"], 4: ["Brethren Call"], 5: ["Shattering", "Web of Illusion"] }) },
        Wyrsta: { title: "Questioner", gifts: G({ 1: ["Alter Mood", "Beastmind"], 2: ["Blinding Spit", "Visceral Agony"], 3: ["Tick Body"], 4: ["Blades of the Mantis"], 5: ["Summon Net Spider"] }) },
      },
    },
    groupB: {
      label: "Faction",
      choices: {
        Tenere: { start: ["Groom", "Patience of Ananasa"], gifts: G({ 1: ["Groom", "Patience of Ananasa"], 2: ["Beneath Notice", "Breath of Ananasa"], 3: ["Mother's Look", "Reshape Object"], 4: ["Understanding the Tapestry", "Web Sheet"], 5: ["Spider on the Mirror", "Thieving Touch of Spiders"] }) },
        Hatar: { start: ["Blood of Pain", "Wyrmling Kinship"], gifts: G({ 1: ["Blood of Pain", "Wyrmling Kinship"], 2: ["Blood of Illusion", "Call of the Wyrm"], 3: ["Corrupt", "Pulse of the Invisible"], 4: ["Ill Wind", "Still Blood"], 5: ["Burning Blood", "Touch of the Unweaver"] }) },
        Kumoti: { start: ["Inspire", "Mother's Touch"], gifts: G({ 1: ["Inspire", "Mother's Touch"], 2: ["Arachnophobia", "Insight of the Mother"], 3: ["Alter Lilian", "Sense Motion"], 4: ["Mindblock", "Nature of the Beast"], 5: ["Assimilation", "Mass Confusion"] }) },
      },
    },
    general: G({ 1: ["Many Eyes", "Stolen Moments"], 2: ["Hand Fangs", "Replenishment of the Flesh"], 3: ["Blood Pump", "Part Webs"], 4: ["Entropic Bite", "Iron Web"], 5: ["Survivor"] }),
    startGifts: ["groupA", "groupB", "general"],
    rage: null, willpower: "breed",
    renownNames: ["Cunning", "Obedience", "Wisdom"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: ["Allies", "Contacts", "Fetish", "Kinfolk", "Mentor", "Resources", "Rites"], mfForbidden: NOT_WOLF,
    formDiff: true,
    forms: () => [form("Homid", {}, { diff: 6 }), form("Lilian", S(2, 3, 2, -1, -1), { diff: 6 }), form("Pithus", S(4, 1, 3, -3, -2), { diff: 7 }), form("Crawlerling", { Dexterity: 5 }, { zero: ["Strength", "Stamina", "Manipulation", "Appearance"], diff: 6 })],
    names: { ...people, animal: ["Silk-in-Shadow", "Eight-Eyes", "Patient-Weaver", "Black-Thread", "Still-Hunter"] },
    concepts: CONCEPTS, animalConcepts: ["Sylie keeper", "Web-weaver", "Patient hunter", "Queen's watcher"],
  });

  // ---------------------------------------------------------------- Corax (wereravens), p. 76-81
  const coraxGifts = () => G({ 1: ["Enemy Ways", "Morse", "Raven's Gleaning", "Voice of the Mimic", "Word Beyond"], 2: ["Razor Feathers", "Sky's Beneficence"], 3: ["Eyes of the Eagle", "Hummingbird Dart", "Mynah's Touch"], 4: ["Airt Sense", "Gauntlet Runner", "Helios' Child"], 5: ["Gift of Eyes", "Portents"] });
  F.simpleGame({
    id: "corax", label: "Corax (wereravens)", game: "Corax", books: BOOKS,
    note: "All Corax get \"Raven's Gifts\": +1 Subterfuge, Enigmas and Dodge. The book doesn't state how many starting Gifts; this uses three from the breed's starting list.",
    breeds: {
      Corvid: { start: ["Voice of the Mimic", "Enemy Ways", "Word Beyond", "Raven's Gleaning"], gifts: coraxGifts(), avoid: ["Computer", "Law", "Linguistics", "Medicine", "Politics", "Science"], extraAbil: { Talents: { Flight: 2 } }, animal: true },
      Homid: { start: ["Voice of the Mimic", "Enemy Ways", "Morse", "Word Beyond"], gifts: coraxGifts(), note: "Homid Corax can't take Flight except with freebie points." },
    },
    groupB: { label: "Group", choices: { Leshy: { note: "Leshy: Russian forest tricksters and spies." }, "Gulls of Battle": { note: "Gulls of Battle: Scandinavian, fond of Hugin and Munin." }, Tulugaq: { note: "Tulugaq: Corax of the Pure Lands, great tricksters." }, Unaffiliated: {} } },
    startGifts: ["breed", "breed", "breed"],
    rage: 1, gnosis: 6, willpower: 3,
    free: { Subterfuge: 1, Enigmas: 1, Dodge: 1 },
    renownNames: ["Glory", "Honor", "Wisdom"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: GENERIC_BG.filter((x) => x !== "Pure Breed"), mfForbidden: NOT_WOLF,
    formColumns: ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance", "Perception"],
    forms: () => [form("Homid"), form("Crinos", { Strength: 1, Dexterity: 1, Stamina: 1, Manipulation: -2, Appearance: -1, Perception: 3 }), form("Corvid", { Strength: -1, Dexterity: 1, Manipulation: -3, Perception: 3 })],
    names: { ...people, animal: ["Shiny-Seeker", "Talks-Too-Much", "Black-Wing", "Sees-Far", "Stormcrow's-Kin"] },
    concepts: ["Courier", "Gossip columnist", "Hacker", "Investigative reporter", "Pawnshop clerk", "Street performer", "Urban explorer"], animalConcepts: ["Messenger", "Scavenger", "Watcher on the wire"],
  });

  // ---------------------------------------------------------------- Gurahl (werebears), p. 86-96
  F.simpleGame({
    id: "gurahl", label: "Gurahl (werebears)", game: "Gurahl", books: BOOKS,
    note: "Gurahl move through all five auspices over their lives; most new Gurahl are Arcas.",
    breeds: {
      Homid: { gnosis: 4, rage: 3, start: ["Persuasion", "Ursa's Light"], noBg: ["Resources"],
        gifts: G({ 1: ["Persuasion", "Ursa's Light"], 2: ["Climate Control", "Dolorous Countenance"], 3: ["Sense Need", "Shape Matter"], 4: ["Spirit Shield"], 5: ["Fearless Unveiling"] }) },
      Ursine: { gnosis: 5, rage: 4, start: ["Heightened Senses", "Voice of Woe"], noBg: ["Resources"], avoid: LUPUS_AVOID, animal: true,
        gifts: G({ 1: ["Heightened Senses", "Voice of Woe"], 2: ["Burrow", "Weather Watch"], 3: ["Pull of the Chosen Land", "Shelter of the Earth"], 4: ["Gnaw", "Sweet Swarm of Vengeance"], 5: ["Call of the Cave Bear"] }) },
    },
    groupA: {
      label: "Auspice",
      choices: {
        Arcas: { title: "New Moon", gifts: G({ 1: ["Open Seal", "Walk Like a Man"], 2: ["Cajole", "Sense of the Prey"], 3: ["Safe Passage", "Trackless Waste"], 4: ["Favor of Ursa Minor"] }) },
        Uzmati: { title: "Full Moon", gifts: G({ 1: ["Slash of the Death Bear", "Ultimatum"], 2: ["Mangi's Strong Arms", "Threaten"], 3: ["Crush", "Silver Claws"], 4: ["Delay the Death Bear's Coming"], 5: ["Rage of the Mother Bear"] }) },
        Kojubat: { gifts: G({ 1: ["Beast Speech", "Stonesight"], 2: ["Eyes of the Soul", "Song of Terra"], 3: ["Mind Sight", "Mind to Mind"], 4: ["Probe Thoughts"], 5: ["Aversion Therapy"] }) },
        Kieh: { gifts: G({ 1: ["Diagnose", "Spirit Speech"], 2: ["Refresh", "Sense the Unnatural"], 3: ["Exorcism", "Name the Spirit"], 4: ["Spirit Healing"], 5: ["Image of the Sky Bear"] }) },
        Rishi: { gifts: G({ 1: ["Befriend", "Truth of Gaia"], 2: ["Compel Truth", "Presence of the Great Bear"], 3: ["Waken"], 4: ["Quell Mob Rage"], 5: ["Oath of the Great Bear"] }) },
      },
    },
    general: G({ 1: ["Fiddlefish", "Healing Tongue", "Ignore Wounds"], 2: ["Calm", "Survival of the Bear", "Treeshake"], 3: ["Dreams of the Buri-Jaan"], 4: ["Masking the Hunted"] }),
    startGifts: ["breed", "groupA", "general"],
    rage: "breed", willpower: 6,
    renownNames: ["Honor", "Succor", "Wisdom"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: [...GENERIC_BG, "Umbral Glade"], bgMin: { Mentor: 1 }, mfForbidden: NOT_WOLF,
    formDiff: true,
    forms: () => [form("Homid", {}, { diff: 6 }), form("Arthren", S(3, 0, 3, -2, -2), { diff: 7 }), form("Crinos", S(5, -1, 5, -3), { zero: ["Appearance"], diff: 6 }), form("Bjornen", S(4, -2, 4, -3), { diff: 7 }), form("Ursus", S(3, 0, 3, -3), { diff: 6 })],
    names: { ...people, animal: ["Honey-Finder", "Old-Grumble", "Stone-Paw", "River-Fisher", "Sleeps-Through-Winter"] },
    concepts: ["Doctor", "Forest ranger", "Herbalist", "Nurse", "Rural vet", "Social worker", "Wilderness guide"], animalConcepts: ["Mountain hermit", "Den mother", "Salmon fisher", "Wanderer of the woods"],
  });

  // ---------------------------------------------------------------- Kitsune (werefoxes), p. 97-113
  F.simpleGame({
    id: "kitsune", label: "Kitsune (werefoxes)", game: "Kitsune", books: BOOKS,
    note: "Kitsune don't cause the Delirium in Koto form. Koto Appearance is 0 to humans (unchanged to shen).",
    breeds: {
      Kojin: { gnosis: 3, start: ["Persuasion", "Seduction", "Smell of Man"],
        gifts: G({ 1: ["Persuasion", "Seduction", "Smell of Man"], 2: ["Jam Technology", "Silver Tongue", "Staredown"], 3: ["Disquiet", "Reshape Object", "Tongues"], 4: ["Forgetfulness", "Spirit Ward"], 5: ["Assimilation", "Call to Allies"] }) },
      Roko: { gnosis: 5, start: ["Burrow", "Cricket Leap", "Heightened Senses"], animal: true,
        gifts: G({ 1: ["Burrow", "Cricket Leap", "Heightened Senses"], 2: ["Scent of Sight", "Sense Imbalance", "Ten Chi"], 3: ["Blind", "Catfeet", "Name the Spirit"], 4: ["Forest Lord"], 5: ["Song of the Great Beast"] }) },
      Shinju: { gnosis: 4, start: ["Scent of the True Form", "Sense Wyrm", "Truth of Gaia"], note: "Shinju (metis) Kitsune have no deformities.",
        gifts: G({ 1: ["Flow of Aura", "Scent of the True Form", "Sense Wyrm", "Truth of Gaia"], 2: ["Call to Duty", "Imperial Authority", "Past Whispers"], 3: ["Distant Whispers", "Eyes of the Cat", "Wisdom of the Ancient Ways"], 4: ["Roll Over", "Scent of Beyond"], 5: ["Imperial Obligation", "Marionette"] }) },
    },
    groupA: {
      label: "Path",
      choices: {
        Kataribe: { title: "Clay; bards", rage: 2, start: ["Beast Speech", "Fable", "Truth of Gaia"], gifts: G({ 1: ["Beast Speech", "Fable", "Mindspeak", "Truth of Gaia"], 2: ["Centipede's Beckoning", "Distractions", "Lore", "Tongues"], 3: ["Seek", "Silence", "Uzume Sings"], 4: ["Kuei Dance", "Shadows by the Firelight"], 5: ["Fabric of the Mind"] }) },
        Gukutsushi: { title: "Fog; dreamweavers", rage: 2, start: ["Clear the Mind", "Mother's Touch", "Open Seal"], gifts: G({ 1: ["Blur of the Milky Eye", "Clear the Mind", "Mother's Touch", "Open Seal"], 2: ["Dreamspeak", "Fan-Shadow-Robe", "Silver Tongue", "Taking the Forgotten"], 3: ["Distant Whispers", "Ebisu's Fingers", "Shadow-Fan-Flowers"], 4: ["Moon-Fan-Face-Shadow", "Whelp Body"], 5: ["Madness", "Violation"] }) },
        Doshi: { title: "Lightning; sorcerers", rage: 3, start: ["Blessing the Blade", "Sense Magic", "Spirit Speech"], gifts: G({ 1: ["Blessing the Blade", "Breath of Yu-Chiang", "Sense Magic", "Sense Wyrm", "Spirit Speech"], 2: ["Blood Omen", "Command Spirit", "Name the Spirit", "Sight from Beyond"], 3: ["Exorcism", "Ghost Speech", "Pulse of the Invisible", "Spirit Ward", "Swarm of Servants"], 4: ["By the Light of the Moon", "Grasp the Beyond", "Spirit Drain"], 5: ["Feral Lobotomy", "Malleable Spirit", "Seal of Inari"] }) },
        Eji: { title: "Lava; warriors", rage: 4, start: ["Razor Claws", "Resist Pain", "Sense Hostility"], gifts: G({ 1: ["Falling Touch", "Razor Claws", "Resist Pain", "Sense Hostility"], 2: ["Bolt", "Enduring Warrior", "Sense of the Prey", "Spirit of the Fray"], 3: ["Call of the Dead", "Weak Arm"], 4: ["Elemental Meld", "Sorcerous Bite"], 5: ["Dragon Ally", "Fire Immunity"] }) },
      },
    },
    general: G({ 1: ["Chi Sense", "Ishin Denshin", "Scent of Running Water"], 2: ["Moon Dance", "Sense Magic", "Spirit Speech"], 3: ["Ghost Speech", "Puppeteer's Secret"], 4: ["Shadow-Fan-Flowers"], 5: ["Possession"] }),
    startGifts: ["general", "breed", "groupA"],
    rage: "groupA", willpower: 5,
    renownNames: ["Chie", "Toku", "Kagayaki"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: ["Ancestors", "Batsu", "Clan", "Fetish", "Go-en", "Resources", "Rites", "Sempai", "Totem"], mfForbidden: NOT_WOLF,
    formDiff: true,
    formColumns: ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance", "Perception"],
    forms: () => [form("Hitogata", {}, { diff: "" }), form("Sambuhenge", { Dexterity: 1, Stamina: 1, Manipulation: -1 }, { diff: 7 }), form("Koto", { Strength: 1, Dexterity: 2, Stamina: 2, Manipulation: -1, Perception: 1 }, { diff: 6 }), form("Juko", { Dexterity: 3, Stamina: 3, Manipulation: -2, Perception: 1 }, { diff: 7 }), form("Kyubi", { Dexterity: 4, Stamina: 2, Manipulation: -1, Perception: 2 }, { diff: 6 })],
    names: { female: ["Akiko", "Emi", "Kaori", "Lan", "Mei", "Yuki"], male: ["Daisuke", "Haruto", "Jin", "Ren", "Sora", "Wen"], last: ["Arai", "Chen", "Fujimoto", "Han", "Kimura", "Lee", "Mori", "Park", "Takeda", "Wang"], animal: ["Silver-Tail", "Moon-Whisker", "Red-Lantern", "Quick-Laugh", "Rice-Field-Dancer"] },
    concepts: ["Calligrapher", "Courtier", "Fortune teller", "Graduate student", "Musician", "Shop owner", "Shrine keeper"], animalConcepts: ["Curious wanderer", "Field fox", "Shrine fox"],
  });

  // ---------------------------------------------------------------- Nagah (wereserpents), p. 122-130
  F.simpleGame({
    id: "nagah", label: "Nagah (wereserpents)", game: "Nagah", books: BOOKS,
    note: "Nagah have no pack totems; nests share a spiritual bond. In any form but Balaram and Vasuki they carry three doses of venom.",
    breeds: {
      Balaram: { gnosis: 1, start: ["Persuasion", "Prehensile Body"], gifts: G({ 1: ["Persuasion", "Prehensile Body"], 2: ["Unexpected Venom"], 3: ["Fluid Grace"], 4: ["Spirit Ward"], 5: ["There Is No Body"] }) },
      Ahi: { gnosis: 3, start: ["Weaver Sense", "Wyld Sense", "Wyrm Sense"], gifts: G({ 1: ["Weaver Sense", "Wyld Sense", "Wyrm Sense"], 2: ["Indra's Cloak", "Venom Blood"], 3: ["Command Water Spirit"], 4: ["Whirlpool"] }), note: "Ahi (metis) Nagah are not deformed." },
      Vasuki: { gnosis: 5, start: ["River's Gift", "Treesnake's Blessing"], gifts: G({ 1: ["River's Gift", "Treesnake's Blessing"], 2: ["Lightning Strike"], 3: ["Sidewind"], 4: ["Belly Ride"] }), animal: true },
    },
    groupA: {
      label: "Auspice",
      choices: {
        Kamakshi: { title: "Spring", rage: 3, start: ["Ganga's Caress", "Resist Pain"], gifts: G({ 1: ["Ganga's Caress", "Resist Pain"], 2: ["Calm"], 3: ["Dazzle"], 4: ["Denial of Wellbeing"] }) },
        Kartikeya: { title: "Summer", rage: 4, start: ["Eyes of the War God", "Scent of the True Form"], gifts: G({ 1: ["Eyes of the War God", "Scent of the True Form"], 2: ["Forked Tongue", "Secret Serpent"], 3: ["Blood Running Hot"], 4: ["Veil of Maya"], 5: ["Madness"] }) },
        Kamsa: { title: "Autumn", rage: 3, start: ["Executioner's Edge", "Slayer's Eye"], gifts: G({ 1: ["Executioner's Edge", "Slayer's Eye"], 2: ["Forked Tongue", "Staredown"], 3: ["Eye of the Cobra"], 4: ["Doppelganger", "Open Wounds"], 5: ["Heartstrings"] }) },
        Kali: { title: "Winter", rage: 4, start: ["Guided Strike", "Iron Coils"], gifts: G({ 1: ["Guided Strike", "Iron Coils"], 2: ["Executioner's Gift"], 3: ["Destroying Blow", "Discern Weakness"], 4: ["Mindblock"], 5: ["Magistrate's Icy Judgment"] }) },
      },
    },
    general: G({ 1: ["Scent of Running Water", "Sense Wyrm", "Slayer's Eye"], 2: ["Sense of the Prey"], 3: ["Combat Healing"], 4: ["Swimming the Spirit River"], 5: ["Breath of the Dragon Lords"] }),
    startGifts: ["general", "breed", "groupA"],
    rage: "groupA", willpower: 4,
    renownNames: null, renownNote: "Nagah have no Renown categories; they advance in Rank by reporting to the Sesha.",
    backgrounds: GENERIC_BG.filter((x) => x !== "Totem"), mfForbidden: NOT_WOLF,
    formDiff: true,
    forms: () => [form("Balaram", {}, { diff: "" }), form("Silkaram", S(2, 0, 2, -2, -2), { diff: 7 }), form("Azhi Dahaka", S(3, 2, 3, -3), { zero: ["Appearance"], diff: 6 }), form("Kali Dahaka", S(2, 2, 2), { zero: ["Appearance", "Manipulation"], diff: 7 }), form("Vasuki", S(-1, 2, 1), { zero: ["Manipulation"], diff: 6 })],
    names: { female: ["Anjali", "Deepa", "Meera", "Priya", "Sita"], male: ["Arjun", "Kiran", "Nikhil", "Rohan", "Vikram"], last: ["Bhatt", "Desai", "Iyer", "Kapoor", "Menon", "Nair", "Rao", "Shah", "Varma"], animal: ["Coiled-Patience", "Cold-Eye", "Swift-Strike", "River-Shadow", "Hood-Raised"] },
    concepts: ["Antiquities dealer", "Detective", "Diplomat", "Judge", "Martial artist", "Physician"], animalConcepts: ["Temple serpent", "River hunter", "Silent watcher"],
  });

  // ---------------------------------------------------------------- Nuwisha (werecoyotes), p. 131-137
  const latraniGifts = copy(W.breeds.Lupus.gifts);
  latraniGifts.core[1] = [...latraniGifts.core[1], "Speed of Thought"];
  F.simpleGame({
    id: "nuwisha", label: "Nuwisha (werecoyotes)", game: "Nuwisha", books: BOOKS,
    note: "Nuwisha have no Rage and need a personal Totem (a face of Trickster). Gifts come from the Garou breed list, the Ragabash list and the Nuwisha list.",
    breeds: {
      Homid: { gnosis: 1, start: ["Persuasion", "Master of Fire", "Smell of Man"], gifts: copy(W.breeds.Homid.gifts) },
      Latrani: { gnosis: 5, start: ["Hare's Leap", "Heightened Senses", "Speed of Thought"], gifts: latraniGifts, avoid: LUPUS_AVOID, animal: true },
    },
    extraSource: [copy(W.auspices.Ragabash.gifts), "Ragabash"],
    general: G({ 1: ["Snake's Skin", "Spirit Speech", "Swollen Tongue"], 2: ["Odious Aroma", "Sheep's Clothing"], 3: ["Gift of Rage", "Happy Thoughts"], 4: ["Bridge Walker", "Trickster's Skin"], 5: ["Assimilation", "Coyote's Mask"] }),
    startGifts: ["breed", "extra", "general"],
    rage: null, willpower: 4,
    renownNames: ["Glory", "Humor", "Wisdom"], renownTotals: TOTALS,
    backgrounds: GENERIC_BG, bgMin: { Totem: 1 }, mfForbidden: NOT_WOLF,
    formDiff: true,
    forms: () => [form("Homid", {}, { diff: 6 }), form("Tsitsu", S(1, 1, 2, -1), { diff: 7 }), form("Manabozho", S(2, 3, 3, -2), { zero: ["Appearance"], diff: 6 }), form("Sendeh", S(2, 3, 3, -3), { diff: 7 }), form("Latrani", S(0, 3, 3, -3), { diff: 6 })],
    names: { ...people, animal: ["Steps-Lightly", "Grins-at-Trouble", "Dust-Devil", "Laughs-Last", "Stolen-Shoe"] },
    concepts: ["Class clown", "Con artist", "Drifter", "Prankster", "Stand-up comic", "Street magician"], animalConcepts: ["Desert trickster", "Trash-can raider", "Road wanderer"],
  });

  // ---------------------------------------------------------------- Ratkin (wererats), p. 138-148
  F.simpleGame({
    id: "ratkin", label: "Ratkin (wererats)", game: "Ratkin", books: BOOKS,
    breeds: {
      Homid: { gnosis: 1, start: ["Cooking", "Eau de Rat", "Persuasion"], gifts: G({ 1: ["Cooking", "Eau de Rat", "Persuasion"], 2: ["Instinct"], 3: ["Reshape Object"], 4: ["Body Wrack"] }) },
      Metis: { gnosis: 3, start: ["Cloak of Shadows", "Rat Mother's Touch", "Sense Wyrm"], gifts: G({ 1: ["Cloak of Shadows", "Rat Mother's Touch", "Sense Wyrm"], 2: ["Stink"], 3: ["Sliver Tooth"], 4: ["Whelp Body"] }), deformity: true },
      Rodens: { gnosis: 5, start: ["Absolute Balance", "Leap of the Kangaroo Rat", "Survival"], gifts: G({ 1: ["Absolute Balance", "Leap of the Kangaroo Rat", "Survival"], 2: ["Devour the Dead"], 3: ["Sliver Tooth"], 4: ["Mind of the Swarm"] }), animal: true },
    },
    groupA: {
      label: "Aspect",
      choices: {
        "Tunnel Runner": { rage: 1, start: ["Danger Sense", "Silent Running"], gifts: G({ 1: ["Danger Sense", "Silent Running"], 2: ["Urban Camouflage"], 4: ["Speak in Tongues"] }), noBg: ["Resources"],
          perk: ["Tunnel Runner", "Culturally Gifted (blend into a culture); Wanderlust Visions; Traveling Light (no Resources below Rank 3)."] },
        "Shadow Seer": { rage: 2, start: ["Rat Mother's Touch", "Sense Weaver"], gifts: G({ 1: ["Rat Mother's Touch", "Sense Weaver"], 2: ["Name the Spirit"], 3: ["Command Spirit"], 4: ["Pulse of the Invisible"] }), freeGifts: ["Spirit Speech"],
          perk: ["Shadow Seer", "Spirits Speak to Me (free Spirit Speech); Spirit Sight; Disconnection on botched Rage/Gnosis/Willpower rolls."] },
        "Knife-Skulker": { rage: 3, start: ["Sticky Paws", "Truth of Gaia"], gifts: G({ 1: ["Sticky Paws", "Truth of Gaia"], 2: ["Stalk"], 3: ["Doppelganger"], 4: ["Open Wounds"], 5: ["Geas"] }), bgBonus: { Contacts: 3 },
          perk: ["Knife-Skulker", "Contracts and Contacts (+3 Contacts); Sense of Justice; Assassin's Code."] },
        "Blade Slave": { rage: 4, start: ["Resist Pain", "Slicing Teeth"], gifts: G({ 1: ["Resist Pain", "Slicing Teeth"], 4: ["Persecution Complex"] }),
          perk: ["Blade Slave", "Pain Dagger rite; Buff and Tough (extra \"Tough\" health level above Bruised); Blood Lust (Rage difficulty always 5)."] },
      },
    },
    general: G({ 1: ["Cloak of Shadows", "Darksight"], 2: ["Crawling Chaos"], 3: ["Backbite"], 5: ["Riot"] }),
    startGifts: ["breed", "groupA", "general"],
    rage: "groupA", willpower: 3,
    renownNames: ["Infamy", "Obligation", "Cunning"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: GENERIC_BG.filter((x) => x !== "Pure Breed"), mfForbidden: NOT_WOLF,
    formColumns: ["Strength", "Dexterity", "Stamina", "Charisma", "Manipulation", "Appearance", "Perception"],
    forms: (sel) => [form("Homid"), form("Crinos", { Strength: sel.breed === "Metis" ? 2 : 1, Dexterity: 4, Stamina: sel.breed === "Metis" ? 1 : 2, Charisma: -2, Appearance: -1, Perception: 1 }), form("Rodens", { Strength: -1, Dexterity: 2, Stamina: 2, Perception: 3 })],
    names: { ...people, animal: ["Gnaws-Wires", "Quick-Whisker", "Sewer-King", "Scratch", "Nibbles-the-Bones"] },
    concepts: ["Anarchist", "Dumpster diver", "Hacker", "Line cook", "Squatter", "Subway busker"], animalConcepts: ["Swarm runner", "Tunnel scout", "Nest guardian"],
  });

  // ---------------------------------------------------------------- Rokea (weresharks), p. 149-158
  F.simpleGame({
    id: "rokea", label: "Rokea (weresharks)", game: "Rokea", books: BOOKS,
    note: "Chasmus and Squamus forms have no Dexterity on land; the table shows their in-water Dexterity. Glabrus is only known to Rokea who've spent time on land.",
    breeds: {
      Homid: { gnosis: 1 },
      Squamus: { gnosis: 5, avoid: LUPUS_AVOID, free: { "Primal-Urge": 1, Survival: 1 }, maxAppearance: 2, animal: true },
    },
    groupA: {
      label: "Auspice",
      choices: {
        Brightwater: { title: "sun or full moon; warriors", rage: 5, start: ["Eyes of the Wound", "Restraint"], gifts: G({ 1: ["Eyes of the Wound", "Restraint"], 2: ["Narke's Gift", "Undertow"], 3: ["Bends", "Strength of the Crashing Waves"], 4: ["No Walls"], 5: ["Blood of Darkness", "Pain of the Wound"] }) },
        Dimwater: { title: "clouded sun or waxing/waning moon; leaders", rage: 4, start: ["King Fish", "Sea's Voice"], gifts: G({ 1: ["King Fish", "Sea's Voice"], 2: ["Crushing Depths", "Spit Teeth"], 3: ["Drown", "Sea's Wisdom"], 4: ["Living Sea", "Quick Currents"], 5: ["Common Foe"] }) },
        Darkwater: { title: "eclipse or new moon; seekers", rage: 3, start: ["Blood of the Deeps", "Silent Sending"], gifts: G({ 1: ["Blood of the Deeps", "Silent Sending"], 2: ["Piercing Shriek"], 3: ["Scent of Blood", "Swim Through the School"], 4: ["Wave's Passage"], 5: ["Madness", "Oversea's Gift"] }) },
      },
    },
    general: G({ 1: ["Breach", "Killing Bite"], 2: ["Gulp", "Restless Waters"], 3: ["Gift the Ray", "Shark's Bones"], 4: ["Kun's Maw", "Relentless Hunt"], 5: ["Great Summons", "Ocean's Peace"] }),
    startGifts: ["general", "groupA"],
    rage: "groupA", willpower: 4,
    renownNames: ["Valor", "Harmony", "Innovation"], renownTotals: TOTALS, renownAssumed: true,
    backgrounds: GENERIC_BG.filter((x) => x !== "Pure Breed"), mfForbidden: NOT_WOLF,
    formDiff: true,
    forms: () => [form("Homid", {}, { diff: "" }), form("Glabrus", S(2, 0, 2, -2, -2), { diff: 9 }), form("Gladius", S(3, -1, 2, -4), { zero: ["Appearance"], diff: 6 }), form("Chasmus", S(4, 1, 3, -4), { diff: 7 }), form("Squamus", S(2, 3, 2, -4), { diff: 6 })],
    names: { ...people, animal: ["Cold-Water", "Red-Fin", "Deep-Hunger", "Wave-Breaker", "Silent-Teeth"] },
    concepts: ["Diver", "Fisher", "Lifeguard", "Marine biologist", "Sailor", "Surfer"], animalConcepts: ["Reef hunter", "Deep-water wanderer", "Slew leader"],
  });
})();
