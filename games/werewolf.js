/*
  Werewolf: the Apocalypse (classic World of Darkness, Revised rules).

  All game data lives in the DATA object below, so lists can be fixed or
  extended without touching the generator logic.

  SOURCES (checked against the owner's PDFs, October 2026):
    Core = Werewolf: the Apocalypse, Revised Edition (2000)
    WPG  = Werewolf Players Guide (2nd edition, 1993)
    CoG  = Tribebook: Children of Gaia (Revised)
    GW   = Tribebook: Glass Walkers (2nd edition)
    PGG  = Players Guide to Garou (Revised) (scanned; read with OCR + page images)
    BG / GoF / SL = Bone Gnawers, Get of Fenris, Shadow Lords tribebooks (same)
*/
(function () {
  const R = WOD.random;

  const BOOKS = {
    Core: "Werewolf: the Apocalypse, Revised",
    WPG: "Werewolf Players Guide (2nd ed.)",
    CoG: "Tribebook: Children of Gaia (Revised)",
    GW: "Tribebook: Glass Walkers (2nd ed.)",
  };

  // Gift lists: core = { level: [names] }, extra = { book: { level: [names] } }
  const F = WOD.fera;
  const G = F.G;

  const DATA = {
    books: BOOKS,

    breeds: {
      Homid: {
        gnosis: 1,
        gifts: G(
          { 1: ["Master of Fire", "Persuasion", "Smell of Man"], 2: ["Jam Technology", "Staredown"], 3: ["Disquiet", "Reshape Object"], 4: ["Cocoon", "Spirit Ward"], 5: ["Assimilation", "Part the Veil"] },
          { WPG: { 3: ["Tongues"] } }
        ),
      },
      Metis: {
        gnosis: 3,
        gifts: G(
          { 1: ["Create Element", "Primal Anger", "Sense Wyrm"], 2: ["Burrow", "Curse of Hatred"], 3: ["Eyes of the Cat", "Mental Speech"], 4: ["Gift of the Porcupine", "Wither Limb"], 5: ["Madness", "Totem Gift"] },
          { WPG: { 1: ["Shed"], 3: ["Splintered Claw"] } }
        ),
      },
      Lupus: {
        gnosis: 5,
        gifts: G(
          { 1: ["Hare's Leap", "Heightened Senses", "Sense Prey"], 2: ["Scent of Sight", "Sense the Unnatural"], 3: ["Catfeet", "Name the Spirit"], 4: ["Beast Life", "Gnaw"], 5: ["Elemental Gift", "Song of the Great Beast"] },
          { WPG: { 3: ["Monkey Tail"], 4: ["Venom"] } }
        ),
      },
    },

    auspices: {
      Ragabash: {
        moon: "New Moon", rage: 1,
        gifts: G(
          { 1: ["Blur of the Milky Eye", "Open Seal", "Scent of Running Water"], 2: ["Blissful Ignorance", "Sense of the Prey", "Taking the Forgotten"], 3: ["Gremlins", "Open Moon Bridge"], 4: ["Luna's Blessing", "Whelp Body"], 5: ["Thieving Talons of the Magpie", "Thousand Forms"] },
          { WPG: { 2: ["Alter Scent", "Obscure the Truth"], 3: ["Fly Feet"] } }
        ),
      },
      Theurge: {
        moon: "Crescent Moon", rage: 2,
        gifts: G(
          { 1: ["Mother's Touch", "Sense Wyrm", "Spirit Speech"], 2: ["Command Spirit", "Name the Spirit", "Sight from Beyond"], 3: ["Exorcism", "Pulse of the Invisible"], 4: ["Grasp the Beyond", "Spirit Drain"], 5: ["Feral Lobotomy", "The Malleable Spirit"] },
          { WPG: { 2: ["Umbral Tether"], 3: ["Spirit Path", "Umbral Sight"], 4: ["Shadowplay"], 5: ["Spirit Vessel"] } }
        ),
      },
      Philodox: {
        moon: "Half Moon", rage: 3,
        gifts: G(
          { 1: ["Resist Pain", "Scent of the True Form", "Truth of Gaia"], 2: ["Call to Duty", "King of the Beasts", "Strength of Purpose"], 3: ["Weak Arm", "Wisdom of the Ancient Ways"], 4: ["Roll Over", "Scent of Beyond"], 5: ["Geas", "Wall of Granite"] },
          { WPG: { 3: ["Sense Balance"], 4: ["Take the True Form"] } }
        ),
      },
      Galliard: {
        moon: "Gibbous Moon", rage: 4,
        gifts: G(
          { 1: ["Beast Speech", "Call of the Wyld", "Mindspeak"], 2: ["Call of the Wyrm", "Distractions", "Dreamspeak"], 3: ["Eye of the Cobra", "Song of Rage"], 4: ["Bridge Walker", "Shadows by the Firelight"], 5: ["Fabric of the Mind", "Head Games"] },
          { WPG: { 2: ["Mimic"], 4: ["Song of the Siren"] } }
        ),
      },
      Ahroun: {
        moon: "Full Moon", rage: 5,
        gifts: G(
          { 1: ["Falling Touch", "Inspiration", "Razor Claws"], 2: ["Sense Silver", "Spirit of the Fray", "True Fear"], 3: ["Heart of Fury", "Silver Claws"], 4: ["Clenched Jaw", "Stoking Fury's Furnace"], 5: ["Kiss of Helios", "Strength of Will"] },
          { WPG: { 3: ["Combat Healing", "Shatter Bone"] } }
        ),
      },
    },

    // Minimum Renown for each Rank (1-5), Core p. 185. Ragabash: any combination.
    renownByRank: {
      Ragabash: [3, 7, 13, 19, 25],
      Theurge: [{ Wisdom: 3 }, { Glory: 1, Wisdom: 5 }, { Glory: 2, Honor: 1, Wisdom: 7 }, { Glory: 4, Honor: 2, Wisdom: 9 }, { Glory: 4, Honor: 9, Wisdom: 10 }],
      Philodox: [{ Honor: 3 }, { Glory: 1, Honor: 4, Wisdom: 1 }, { Glory: 2, Honor: 6, Wisdom: 2 }, { Glory: 3, Honor: 8, Wisdom: 4 }, { Glory: 4, Honor: 10, Wisdom: 9 }],
      Galliard: [{ Glory: 2, Wisdom: 1 }, { Glory: 4, Wisdom: 2 }, { Glory: 4, Honor: 2, Wisdom: 4 }, { Glory: 7, Honor: 2, Wisdom: 6 }, { Glory: 9, Honor: 5, Wisdom: 9 }],
      Ahroun: [{ Glory: 2, Honor: 1 }, { Glory: 4, Honor: 1, Wisdom: 1 }, { Glory: 6, Honor: 3, Wisdom: 1 }, { Glory: 9, Honor: 5, Wisdom: 2 }, { Glory: 10, Honor: 9, Wisdom: 4 }],
    },
    rankTitles: ["Cliath", "Fostern", "Adren", "Athro", "Elder"],

    // Willpower and Background limits: Core pp. 100-101 (Stargazers: Core appendix).
    // noBackgrounds: can't take at creation. minBackgrounds: must start with.
    tribes: {
      "Black Furies": {
        willpower: 3,
        note: "Black Furies are almost all female; the only males are metis.",
        gifts: G(
          { 1: ["Breath of the Wyld", "Heightened Senses", "Sense Wyrm"], 2: ["Curse of Aeolus", "Sense of the Prey"], 3: ["Coup de Grace", "Visceral Agony"], 4: ["Body Wrack", "Wasp Talons"], 5: ["Thousand Forms", "Wyld Warp"] },
          { WPG: { 2: ["Trail of Pain"], 3: ["Bacchantes' Rage", "Song of the Siren"], 5: ["Gorgon's Gaze"] } }
        ),
      },
      "Bone Gnawers": {
        willpower: 4,
        noBackgrounds: ["Ancestors", "Pure Breed", "Resources"],
        gifts: G(
          { 1: ["Cooking", "Resist Toxin", "Tagalong"], 2: ["Blissful Ignorance", "Odious Aroma"], 3: ["Friend in Need", "Reshape Object"], 4: ["Attunement", "Infest"], 5: ["Riot", "Survivor"] },
          { WPG: { 1: ["Cardboard Mansion"], 2: ["Trash Magnet"], 3: ["Beg", "Gift of the Termite"] } }
        ),
      },
      "Children of Gaia": {
        willpower: 4,
        gifts: G(
          { 1: ["Mercy", "Mother's Touch", "Resist Pain"], 2: ["Calm", "Luna's Armor"], 3: ["Dazzle", "Spirit Friend"], 4: ["Beast Life", "Strike the Air"], 5: ["Halo of the Sun", "The Living Wood"] },
          {
            WPG: { 3: ["Chant of Morpheus", "Guilt Trip"], 4: ["Unicorn's Grace"] },
            CoG: { 1: ["Jam Weapon", "Swallow Rage", "Water-Conning"], 2: ["Domestic Seeming", "Grandmother's Touch", "Mule's Bane"], 3: ["Lover's Touch", "Soothe the Savage Beast", "The Cleaving Hoof", "Words of the Alpha"], 4: ["Serpent-Driving", "Uncaught Since the Primal Morn"], 5: ["Trust of Gaia"] },
          }
        ),
      },
      Fianna: {
        willpower: 3,
        gifts: G(
          { 1: ["Faerie Light", "Persuasion", "Resist Toxin"], 2: ["Glib Tongue", "Howl of the Banshee"], 3: ["Faerie Kin"], 4: ["Balor's Gaze", "Phantasm"], 5: ["Call the Hunt", "Gift of the Spriggan"] },
          { WPG: { 2: ["Brew"], 3: ["Ley Lines", "Woadling"], 4: ["Song of the Dire"] } }
        ),
      },
      "Get of Fenris": {
        willpower: 3,
        noBackgrounds: ["Contacts"],
        gifts: G(
          { 1: ["Razor Claws", "Resist Pain", "Visage of Fenris"], 2: ["Halt the Coward's Flight", "Snarl of the Predator"], 3: ["Might of Thor", "Venom Blood"], 4: ["Hero's Stand", "Scream of Gaia"], 5: ["Fenris' Bite", "Horde of Valhalla"] },
          { WPG: { 2: ["Sense Guilt"], 3: ["Mark the Enemy"], 4: ["Berserker's Song"] } }
        ),
      },
      "Glass Walkers": {
        willpower: 3,
        noBackgrounds: ["Ancestors", "Mentor", "Pure Breed"],
        gifts: G(
          { 1: ["Control Simple Machine", "Diagnostics", "Trick Shot"], 2: ["Cybersenses", "Power Surge"], 3: ["Control Complex Machine", "Elemental Favor"], 4: ["Attunement", "Doppelganger"], 5: ["Chaos Mechanics", "Summon Net-Spider"] },
          {
            WPG: { 2: ["Heat Metal"], 3: ["Data Flow"] },
            GW: { 1: ["Agro Culture"], 2: ["Pennies From Heaven", "Steel Fur"], 4: ["Tech Speak", "Tractor Beam"], 5: ["Family Debt"] },
          }
        ),
      },
      "Red Talons": {
        willpower: 3,
        lupusOnly: true,
        noBackgrounds: ["Allies", "Contacts", "Resources"],
        note: "Red Talons' Kinfolk are wolves only.",
        gifts: G(
          { 1: ["Beast Speech", "Scent of Running Water", "Wolf at the Door"], 2: ["Beastmind", "Sense of the Prey"], 3: ["Elemental Favor", "Trackless Waste"], 4: ["Gorge", "Quicksand"], 5: ["Curse of Lycaon", "Gaia's Vengeance"] },
          { WPG: { 2: ["Cull the Herd", "Primal Instinct"], 4: ["Recycle"] } }
        ),
      },
      "Shadow Lords": {
        willpower: 3,
        noBackgrounds: ["Allies", "Mentor"],
        gifts: G(
          { 1: ["Aura of Confidence", "Fatal Flaw", "Seizing the Edge"], 2: ["Clap of Thunder", "Luna's Armor"], 3: ["Direct the Storm", "Paralyzing Stare"], 4: ["Open Wounds", "Strength of the Dominator"], 5: ["Obedience", "Shadow Pack"] },
          { WPG: { 3: ["Curse of Corruption", "Summon Stormcrow"] } }
        ),
      },
      "Silent Striders": {
        willpower: 3,
        noBackgrounds: ["Ancestors", "Resources"],
        gifts: G(
          { 1: ["Sense Wyrm", "Silence", "Speed of Thought"], 2: ["Blissful Ignorance", "Messenger's Fortitude"], 3: ["Adaptation", "Great Leap"], 4: ["Attunement", "Speed Beyond Thought"], 5: ["Gate of the Moon", "Reach the Umbra"] },
          { WPG: { 2: ["Summon Talisman"], 3: ["Long Running", "Tongues"], 4: ["Touch of Death"] } }
        ),
      },
      "Silver Fangs": {
        willpower: 3,
        minBackgrounds: { "Pure Breed": 3 },
        gifts: G(
          { 1: ["Falcon's Grasp", "Lambent Flame", "Sense Wyrm"], 2: ["Empathy", "Luna's Armor"], 3: ["Silver Claws", "Wrath of Gaia"], 4: ["Mastery", "Mindblock"], 5: ["Luna's Avenger", "Paws of the Newborn Cub"] },
          { WPG: { 2: ["Word of Honor"], 4: ["Ignore Death Blow"], 6: ["Renew the Cycle"] } }
        ),
      },
      Stargazers: {
        willpower: 5,
        noBackgrounds: ["Fetish", "Resources"],
        note: "In Revised the Stargazers have left the Garou Nation (Core appendix).",
        gifts: G(
          { 1: ["Balance", "Falling Touch", "Sense Wyrm"], 2: ["Inner Strength", "Surface Attunement"], 3: ["Clarity", "Merciful Blow"], 4: ["Preternatural Awareness", "Strike the Air"], 5: ["Circular Attack", "Wisdom of the Seer"] },
          { WPG: { 3: ["Conundrum"], 4: ["Avoid Fate"], 5: ["Directing the Soul"] } }
        ),
      },
      Uktena: {
        willpower: 3,
        gifts: G(
          { 1: ["Sense Magic", "Shroud", "Spirit Speech"], 2: ["Spirit of the Bird", "Spirit of the Fish"], 3: ["Banish Totem", "Invisibility"], 4: ["Call Elemental", "Hand of the Earth Lords"], 5: ["Fabric of the Mind", "Fetish Doll"] },
          { WPG: { 3: ["Scrying", "Secrets", "Umbral Sight"], 4: ["Pointing the Bone", "Sideways Attack"] } }
        ),
      },
      Wendigo: {
        willpower: 4,
        noBackgrounds: ["Contacts", "Resources"],
        gifts: G(
          { 1: ["Call the Breeze", "Camouflage", "Resist Pain"], 2: ["Cutting Wind", "Speak with Wind Spirits"], 3: ["Bloody Feast", "Wisdom of the Ancient Ways"], 4: ["Call the Cannibal Spirit", "Chill of Early Frost"], 5: ["Heart of Ice", "Invoke the Spirits of the Storm"] },
          { WPG: { 2: ["Fog", "Ghost Pack"], 4: ["Harano"] } }
        ),
      },
    },

    attributes: {
      Physical: ["Strength", "Dexterity", "Stamina"],
      Social: ["Charisma", "Manipulation", "Appearance"],
      Mental: ["Perception", "Intelligence", "Wits"],
    },

    // Revised character sheet (Core p. 98).
    abilities: {
      Talents: ["Alertness", "Athletics", "Brawl", "Dodge", "Empathy", "Expression", "Intimidation", "Primal-Urge", "Streetwise", "Subterfuge"],
      Skills: ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Leadership", "Melee", "Performance", "Stealth", "Survival"],
      Knowledges: ["Computer", "Enigmas", "Investigation", "Law", "Linguistics", "Medicine", "Occult", "Politics", "Rituals", "Science"],
    },

    // Human-world abilities a wolf-born character never starts with (house rule).
    lupusAvoids: ["Computer", "Drive", "Firearms", "Law", "Politics", "Science", "Etiquette"],

    backgrounds: ["Allies", "Ancestors", "Contacts", "Fetish", "Kinfolk", "Mentor", "Pure Breed", "Resources", "Rites", "Totem"],

    // [name, cost (number or "a-b" range), book, tribe limit (optional)]
    merits: [
      ["Code of Honor", 1, "WPG"], ["Berserker", 2, "WPG"],
      ["Common Sense", 1, "WPG"], ["Concentration", 1, "WPG"], ["Lightning Calculator", 1, "WPG"], ["Eidetic Memory", 2, "WPG"], ["Calm Heart", 3, "WPG"], ["Iron Will", 5, "WPG"], ["Self-Confident", 5, "WPG"],
      ["Animal Magnetism", 1, "WPG"], ["Computer Aptitude", 1, "WPG"], ["Expert Driver", 1, "WPG"], ["Mechanical Aptitude", 1, "WPG"], ["Ambidextrous", 2, "WPG"], ["Natural Linguist", 2, "WPG"], ["Daredevil", 3, "WPG"], ["Perfect Balance", 3, "WPG"], ["Jack-of-All-Trades", 5, "WPG"],
      ["Ancestor Ally", 1, "WPG"], ["True Love", 1, "WPG"], ["Moon-Bound", 2, "WPG"], ["Danger Sense", 3, "WPG"], ["Luck", 3, "WPG"], ["Natural Channel", 3, "WPG"], ["Supernatural Companion", 3, "WPG"], ["Charmed Existence", 5, "WPG"], ["Guardian Angel", 6, "WPG"], ["Immune to Wyrm Emanations", 6, "WPG"], ["Silver Tolerance", 7, "WPG"], ["True Faith", 7, "WPG"],
      ["Favor", "1-3", "WPG"], ["Local Ties", "1-3", "WPG"], ["Reputation", 2, "WPG"], ["Corporate CEO", 5, "WPG"],
      ["Double-Jointed", 1, "WPG"], ["Mixed Morph", 1, "WPG"], ["Bad Taste", 2, "WPG"], ["Fair Glabro", 2, "WPG"], ["Lack of Scent", 2, "WPG"], ["Longevity", 2, "WPG"], ["Huge Size", 4, "WPG"], ["Metamorph", 6, "WPG"],
      ["Distant Sire", 1, "CoG", "Children of Gaia"], ["Supporter", 2, "CoG", "Children of Gaia"],
      ["Machine Affinity", 4, "GW", "Glass Walkers"],
    ],
    flaws: [
      ["Dark Secret", 1, "WPG"], ["Intolerance", 1, "WPG"], ["Nightmares", 1, "WPG"], ["Overconfident", 1, "WPG"], ["Phobia", "1 or 3", "WPG"], ["Soft-Hearted", 1, "WPG"], ["Speech Impediment", 1, "WPG"],
      ["Curiosity", 2, "WPG"], ["Low Self-Image", 2, "WPG"], ["Pack Mentality", 2, "WPG"], ["Short Fuse", 2, "WPG"], ["Vengeance", 2, "WPG"], ["Deranged", 3, "WPG"], ["Driving Goal", 3, "WPG"], ["Hatred", 3, "WPG"], ["Territorial", 3, "WPG"],
      ["Amnesia", 2, "WPG"], ["Confused", 2, "WPG"], ["Weak-Willed", 2, "WPG"], ["Absent-Minded", 3, "WPG"],
      ["Color Blindness", 1, "WPG"], ["Bad Sight", 2, "WPG"], ["One Eye", 2, "WPG"], ["Deaf", 4, "WPG"], ["Blind", 6, "WPG"],
      ["Inept", 5, "WPG"], ["Uneducated", 5, "WPG"], ["Unskilled", 5, "WPG"],
      ["Insane Past Life", 1, "WPG"], ["Slip Sideways", 1, "WPG"], ["Mark of the Predator", 2, "WPG"], ["Sign of the Wolf", 2, "WPG"], ["Pierced Veil", 3, "WPG"], ["Dark Fate", 5, "WPG"], ["Taint of Corruption", 7, "WPG"],
      ["Banned Transformation", "1-6", "WPG"], ["Cursed", "1-5", "WPG"], ["Foe from the Past", "1-3", "WPG"], ["Forced Transformation", "1-4", "WPG"],
      ["Enemy", "1-5", "WPG"], ["Twisted Upbringing", 1, "WPG"], ["Persistent Parents", 2, "WPG"], ["Hunted", 3, "WPG"], ["Notoriety", 3, "WPG"], ["Ward", 3, "WPG"],
      ["Short", 1, "WPG"], ["Strict Carnivore", 1, "WPG"], ["Disfigured", 2, "WPG"], ["Deformity", 3, "WPG"], ["Lame", 3, "WPG"], ["Monstrous", 3, "WPG"], ["One Arm", 3, "WPG"], ["Mute", 4, "WPG"], ["Wolf Years", 5, "WPG"],
      ["Charach", 1, "CoG", "Children of Gaia"], ["Naive", 1, "CoG", "Children of Gaia"], ["Vegan", 1, "CoG", "Children of Gaia"], ["Docile", "1-3", "CoG", "Children of Gaia"], ["Burned Out", 3, "CoG", "Children of Gaia"], ["Ahimsa", 4, "CoG", "Children of Gaia"],
      ["Jinx", "3-4", "GW", "Glass Walkers"],
    ],
    maxFlawPoints: 7,
    // Not rolled at random: need a specific Background, or don't suit wolves.
    randomSkip: ["Insane Past Life", "Corporate CEO"],
    lupusSkip: ["Computer Aptitude", "Expert Driver", "Mechanical Aptitude", "Corporate CEO", "Persistent Parents", "Strict Carnivore", "Uneducated"],

    archetypes: ["Architect", "Autocrat", "Bon Vivant", "Bravo", "Caregiver", "Celebrant", "Competitor", "Conformist", "Conniver", "Curmudgeon", "Deviant", "Director", "Fanatic", "Gallant", "Judge", "Loner", "Martyr", "Masochist", "Monster", "Penitent", "Perfectionist", "Rebel", "Rogue", "Survivor", "Thrill-Seeker", "Traditionalist", "Visionary"],

    concepts: ["Activist", "Bartender", "Bike courier", "Drifter", "Ex-soldier", "Firefighter", "Forest ranger", "Gang member", "Graduate student", "Hunter-guide", "Investigative reporter", "Mechanic", "Musician", "Nurse", "Paramedic", "Park-dwelling loner", "Pastor", "Private investigator", "Street artist", "Tattoo artist", "Truck driver", "Wildlife biologist"],
    lupusConcepts: ["Pack scout", "Lone wanderer", "Den mother", "Mountain hunter", "City-edge scavenger", "Northern tracker", "Restless young wolf", "Old grey wolf"],

    metisDeformities: ["Albinism", "Animal eyes", "Cleft palate", "Hairless patches", "Hunchback", "Lame leg", "Missing fingers", "Mute", "Seizures", "Sickly", "Strange odor", "Twisted limb", "Withered arm", "Patches of fur"],

    // Change from Homid form. Appearance becomes 0 in Crinos.
    forms: [
      { name: "Homid", mods: {}, diff: 6 },
      { name: "Glabro", mods: { Strength: 2, Stamina: 2, Manipulation: -1, Appearance: -1 }, diff: 7 },
      { name: "Crinos", mods: { Strength: 4, Dexterity: 1, Stamina: 3, Manipulation: -3 }, zero: ["Appearance"], diff: 6 },
      { name: "Hispo", mods: { Strength: 3, Dexterity: 2, Stamina: 3, Manipulation: -3 }, diff: 7 },
      { name: "Lupus", mods: { Strength: 1, Dexterity: 2, Stamina: 2, Manipulation: -3 }, diff: 6 },
    ],

    healthLevels: [["Bruised", ""], ["Hurt", "-1"], ["Injured", "-1"], ["Wounded", "-2"], ["Mauled", "-2"], ["Crippled", "-5"], ["Incapacitated", ""]],

    names: {
      male: ["Alex", "Bram", "Eli", "Gabe", "Ivan", "Kai", "Marco", "Owen", "Quinn", "Sam", "Tomas", "Vic", "Yuri"],
      female: ["Ana", "Cass", "Dana", "Freya", "Hana", "Jess", "Lena", "Nadia", "Petra", "Rosa", "Una", "Willa", "Zoe"],
      last: ["Avery", "Becker", "Cruz", "Doyle", "Ellis", "Ferro", "Grant", "Haas", "Ivers", "Jansen", "Kowal", "Lund", "Moreau", "Novak", "Okafor", "Pryce", "Quist", "Reyes", "Sato", "Thorne", "Ulrich", "Vance", "Walsh", "Young"],
      deedStart: ["Runs", "Howls", "Walks", "Sings", "Hunts", "Sleeps", "Stands", "Watches", "Bites", "Dreams", "Laughs", "Speaks"],
      deedEnd: ["at-Moonrise", "in-the-Snow", "Through-Fire", "with-Ghosts", "Against-the-Wind", "in-Shadow", "Under-Stars", "Before-Dawn", "on-Broken-Glass", "Beside-the-River", "for-the-Lost", "Without-Fear"],
    },

    // Core p. 102.
    freebieCosts: { Attribute: 5, Ability: 2, Background: 1, Gift: 7, Rage: 1, Gnosis: 2, Willpower: 1 },
  };

  // ---- Supplements read with OCR (Players Guide to Garou, three tribebooks).
  Object.assign(BOOKS, {
    PGG: "Players Guide to Garou (Revised)",
    BG: "Tribebook: Bone Gnawers (Revised)",
    GoF: "Tribebook: Get of Fenris (Revised)",
    SL: "Tribebook: Shadow Lords",
  });
  const groupSet = (name) => (DATA.breeds[name] || DATA.auspices[name] || DATA.tribes[name]).gifts;
  const addGifts = (book, table) => {
    for (const [group, byLevel] of Object.entries(table)) groupSet(group).extra[book] = byLevel;
  };
  addGifts("PGG", {
    Homid: { 2: ["Divide"], 3: ["Tongues"], 5: ["Ubermensch"] },
    Metis: { 1: ["Shed"], 3: ["Shell"], 5: ["Umbral Body"] },
    Lupus: { 1: ["Prey Mind"], 3: ["Death Whispers"], 4: ["Venom"] },
    Ragabash: { 2: ["Alter Scent"], 3: ["Riddle"], 5: ["Blank"] },
    Theurge: { 1: ["Umbral Tether"], 2: ["Spirit Skin"], 3: ["Umbral Tracking"] },
    Philodox: { 1: ["Ma'at's Feather"], 3: ["Bonds that Tie Us"], 4: ["Take the True Form"] },
    Galliard: { 1: ["Memory Circle"], 2: ["Mimic"], 3: ["Sing the Spirits"] },
    Ahroun: { 1: ["Spur Claws"], 3: ["Combat Healing"], 5: ["Shared Strength"] },
    "Black Furies": { 1: ["Arion's Burden"], 2: ["Trail of Pain"], 4: ["Calm Before the Storm"] },
    "Bone Gnawers": { 1: ["Cardboard Mansion"], 2: ["Trash Magnet"], 4: ["Cliché Curse"] },
    "Children of Gaia": { 2: ["Stinging Blows"], 3: ["Pain Chain"], 4: ["Unicorn's Grace"] },
    Fianna: { 2: ["St. Herve's Folly"], 3: ["Ley Lines"], 4: ["Airitech's Daughters"] },
    "Get of Fenris": { 1: ["Sigurd's Stride"], 2: ["Berserker's Song"], 3: ["Alberich's Claws"] },
    "Glass Walkers": { 2: ["Garafena's Crown"], 3: ["Data Flow"], 5: ["Technotheocratic Apocalyptica"] },
    "Red Talons": { 2: ["Primal Instinct"], 3: ["Herding the Infant Ape"], 4: ["Form of Akhlut"] },
    "Shadow Lords": { 1: ["Rains of Mercy"], 3: ["Summon Stormcrow"], 4: ["Ubiquitous Presence"] },
    "Silent Striders": { 2: ["Summon Talisman"], 3: ["Death Track"], 4: ["Guiding Hand of Djeheuty"] },
    "Silver Fangs": { 3: ["Claim of Authority", "Dominance Blow"], 5: ["Ignore Death Blow"] },
    Uktena: { 2: ["Medicine Dreams"], 3: ["Scrying"], 4: ["Pointing the Bone"] },
    Wendigo: { 2: ["Ghost Pack"], 4: ["Curse of Harano"] },
  });
  addGifts("BG", {
    "Bone Gnawers": {
      1: ["Declamation", "Desperate Strength", "Kitchen Chemistry", "Smell of Success", "The Hungry Hound", "The Mark", "Urban Ward"],
      2: ["Dead End", "Hootenanny", "I Got a Rock", "On Patrol", "Road Ward", "Stone-Throwing Devil"],
      3: ["Cooter's Revenge", "Dumpster Diving", "Laugh of the Hyena", "Lucky Bastard", "Rant and Rave", "Streets Tell Stories"],
      4: ["Face in the Crowd", "Shadow of the Rat", "Trust Me"],
      5: ["Help Me", "Piping"],
    },
  });
  addGifts("GoF", {
    "Get of Fenris": { 1: ["Safe Haven", "Snow Running"], 2: ["Troll Skin", "Wearing the Bear Shirt"], 3: ["Loki's Touch"], 4: ["Glory-Scars"], 5: ["Strength of the Ancestors", "The Good Death"], 6: ["Call Great Fenris"] },
  });
  addGifts("SL", {
    "Shadow Lords": { 1: ["Perceptive Servant", "Purify Scent"], 2: ["Cold Voice of Reason", "Pure Identity"], 3: ["Dark Aerie", "Interrogator", "Raven's Wings"], 4: ["Seeds of Doubt"], 5: ["Mask Taint", "Purity of Blood"] },
  });
  // Where a newer book repeats a Gift, keep only the newest copy (Core > PGG > tribebooks > WPG).
  const order = ["PGG", "CoG", "GW", "BG", "GoF", "SL", "WPG"];
  for (const group of [...Object.values(DATA.breeds), ...Object.values(DATA.auspices), ...Object.values(DATA.tribes)]) {
    const seen = new Set(Object.values(group.gifts.core).flat());
    for (const book of order) {
      const byLevel = group.gifts.extra[book];
      if (!byLevel) continue;
      for (const lvl of Object.keys(byLevel)) {
        byLevel[lvl] = byLevel[lvl].filter((n) => !seen.has(n));
        byLevel[lvl].forEach((n) => seen.add(n));
        if (!byLevel[lvl].length) delete byLevel[lvl];
      }
    }
  }

  // Merits & Flaws: the Revised Players Guide to Garou list (Chapter Four) replaces
  // the 2nd-edition entries it covers; older WPG-only entries stay available.
  const pggMerits = [
    ["Double-Jointed", 1], ["Mixed Morph", "1 or 5"], ["Perfect Balance", 1], ["Wolf Sight", 1], ["Ambidextrous", 2], ["Fair Glabro", 2], ["Lack of Scent", 2], ["Daredevil", 3], ["Huge Size", 4], ["Metamorph", 7],
    ["Animal Magnetism", 1], ["Elder's Favor", "1-3"], ["Family Support", 1], ["Reputation", 2],
    ["Common Sense", 1], ["Concentration", 1], ["Berserker", 2], ["Code of Honor", 2], ["Eidetic Memory", 2], ["Calm Heart", 3], ["Iron Will", 3], ["Jack-of-All-Trades", 3],
    ["Ancestor Ally", 1], ["Moon-Bound", 2], ["Spirit Magnet", 2], ["Natural Channel", 3], ["Lucky", 4], ["True Love", 4], ["Immune to Wyrm Emanations", 6], ["True Faith", 7],
  ].map((m) => [...m, "PGG"]);
  const pggFlaws = [
    ["Animal Musk", 1], ["Hard of Hearing", 1], ["Monochrome Vision", 1], ["No Partial Transformation", 1], ["Short", 1], ["Strict Carnivore", 1], ["One Eye", 2], ["Bad Sight", 3], ["Deformity", 3], ["Lame", 3], ["Monstrous", 3], ["One Arm", 3], ["Deaf", 4], ["Mute", 4], ["Wolf Years", 5], ["Blind", 6],
    ["Dark Secret", 1], ["Twisted Upbringing", 1], ["Enemy", "1-5"], ["Persistent Parents", 2], ["Hunted", 3], ["Notoriety", 3], ["Metis Child", 4],
    ["Compulsion", 1], ["Nightmares", 1], ["Shy", 1], ["Soft-Hearted", 1], ["Speech Impediment", 1], ["Amnesia", 2], ["Pack Mentality", 2], ["Phobia", "2 or 3"], ["Short Fuse", 2], ["Vengeful", 2], ["Weak-Willed", 2], ["Deranged", 3], ["Hatred", 3], ["Territorial", 3], ["Ability Deficit", 5],
    ["Insane Ancestor", 1], ["Slip Sideways", 1], ["Mark of the Predator", 2], ["Sign of the Wolf", 2], ["Pierced Veil", 3], ["Banned Transformation", "1-6"], ["Cursed", "1-5"], ["Foe from the Past", "1-3"], ["Forced Transformation", "1-4"],
  ].map((f) => [...f, "PGG"]);
  // Older names the Revised book renamed or dropped in favor of Backgrounds.
  const replaced = new Set(["Luck", "Favor", "Vengeance", "Color Blindness", "Insane Past Life", "Corporate CEO"]);
  const pggNames = new Set([...pggMerits, ...pggFlaws].map((x) => x[0]));
  const keepOld = (x) => x[2] !== "WPG" || (!pggNames.has(x[0]) && !replaced.has(x[0]));
  DATA.merits = [
    ...pggMerits,
    ...DATA.merits.filter(keepOld),
    ["Struggling", 1, "BG", "Bone Gnawers"], ["Shame", 2, "BG", "Bone Gnawers"], ["Ratkin Buddies", 3, "BG", "Bone Gnawers"],
    ["Alcohol Tolerance", 1, "GoF", "Get of Fenris"], ["Gregarious", 2, "GoF", "Get of Fenris"],
    ["Political Mentor", 2, "SL", "Shadow Lords"], ["Diplomatic Immunity", 3, "SL", "Shadow Lords"],
  ];
  DATA.flaws = [
    ...pggFlaws,
    ...DATA.flaws.filter(keepOld),
    ["Anosmia", 1, "BG", "Bone Gnawers"], ["Lost Homid", 2, "BG", "Bone Gnawers"], ["Jackal's Blood", 5, "BG", "Bone Gnawers"],
    ["Wotan's Curse", 2, "GoF", "Get of Fenris"],
    ["Original Sin", 1, "SL", "Shadow Lords"],
  ];
  // Need a specific Background or breed, so not rolled at random.
  DATA.randomSkip.push("Insane Ancestor", "Ancestor Ally", "Lost Homid", "Metis Child");
  DATA.lupusSkip.push("Family Support", "Jack-of-All-Trades");

  window.WEREWOLF_DATA = DATA;

  const physSoc = ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance"];

  function makeName(breed, gender) {
    const deed = R.pick(DATA.names.deedStart) + "-" + R.pick(DATA.names.deedEnd);
    if (breed === "Lupus") return deed;
    const human = F.firstName(DATA.names, gender) + " " + R.pick(DATA.names.last);
    return R.chance(0.5) ? `${human} ("${deed}")` : human;
  }

  function generate(opts) {
    const rank = Math.min(5, Math.max(1, Number(opts.rank) || 1));
    const freebieTotal = Number.isFinite(opts.freebies) ? opts.freebies : 15;
    const coreOnly = opts.books === "Core book only";

    // Black Furies are female; their only males are metis.
    const wantGender = opts.gender === "Female" || opts.gender === "Male" ? opts.gender : null;
    const breed = opts.breed || (wantGender === "Male" && opts.tribe === "Black Furies" ? "Metis" : R.pick(Object.keys(DATA.breeds)));
    const auspice = opts.auspice || R.pick(Object.keys(DATA.auspices));
    let tribeChoices = Object.keys(DATA.tribes);
    if (breed !== "Lupus") tribeChoices = tribeChoices.filter((t) => !DATA.tribes[t].lupusOnly);
    if (wantGender === "Male" && breed !== "Metis") tribeChoices = tribeChoices.filter((t) => t !== "Black Furies");
    const tribe = opts.tribe || R.pick(tribeChoices);
    const gender = wantGender || (tribe === "Black Furies" && breed !== "Metis" ? "Female" : F.pickGender({}));

    const b = DATA.breeds[breed];
    const a = DATA.auspices[auspice];
    const t = DATA.tribes[tribe];
    const notes = [];
    if (tribe === "Red Talons" && breed !== "Lupus") notes.push("Red Talons are almost all Lupus (a few metis); this combination breaks that rule.");
    if (t.note) notes.push(t.note);
    if (tribe === "Black Furies" && gender === "Male" && breed !== "Metis") notes.push("A male Black Fury who isn't metis breaks the tribe's rule.");

    // Attributes 7/5/3, Abilities 13/9/5 (max 3), Backgrounds 5.
    const { attrs, priority: attrPriority } = F.attributes();
    const { abil, priority: abilPriority, ok: abilityOk } = F.abilities(breed === "Lupus" ? DATA.lupusAvoids : []);
    const notAllowed = [...(t.noBackgrounds || []), ...(breed === "Lupus" ? ["Resources"] : [])];
    const { bg, allowed: bgAllowed } = F.backgrounds(DATA.backgrounds, notAllowed, t.minBackgrounds || {});

    // Gifts: one Level 1 each from breed, auspice and tribe, then one of each new level per Rank.
    const picker = F.giftPicker([[b.gifts, breed], [a.gifts, auspice], [t.gifts, tribe]], coreOnly);
    [breed, auspice, tribe].forEach((s) => picker.take(1, s));
    for (let lvl = 2; lvl <= rank; lvl++) picker.take(lvl, null);

    const adv = { Rage: a.rage, Gnosis: b.gnosis, Willpower: t.willpower };
    const renown = F.renown(["Glory", "Honor", "Wisdom"], DATA.renownByRank[auspice][rank - 1]);

    const rollable = (mf) =>
      !DATA.randomSkip.includes(mf[0]) &&
      !(breed === "Lupus" && DATA.lupusSkip.includes(mf[0])) &&
      (!mf[3] || mf[3] === tribe) &&
      (!coreOnly || mf[2] === "Core");
    const mf = F.meritsFlaws(DATA, freebieTotal, rollable, opts.meritsFlaws !== "No");
    const fr = F.spendFreebies({ attrs, abil, abilityOk, bg, bgAllowed, adv, picker }, mf.freebies);

    const name = makeName(breed, gender);
    const extras = [];
    if (breed === "Metis") extras.push({ title: "Metis Deformity", text: R.pick(DATA.metisDeformities) });

    const others = [
      ...Object.entries(DATA.breeds).filter(([n]) => n !== breed).map(([n, v]) => [`${n} (other breed)`, n, v.gifts]),
      ...Object.entries(DATA.auspices).filter(([n]) => n !== auspice).map(([n, v]) => [`${n} (other auspice)`, n, v.gifts]),
      ...Object.entries(DATA.tribes).filter(([n]) => n !== tribe).map(([n, v]) => [`${n} (other tribe)`, n, v.gifts]),
    ];

    const c = F.sheet({
      game: "Werewolf: the Apocalypse",
      name,
      header: [
        ["Name", name], ["Player", ""], ["Chronicle", ""],
        ["Breed", breed], ["Auspice", `${auspice} (${a.moon})`], ["Tribe", tribe],
        ["Nature", R.pick(DATA.archetypes)], ["Demeanor", R.pick(DATA.archetypes)], ["Concept", breed === "Lupus" ? R.pick(DATA.lupusConcepts) : R.pick(DATA.concepts)],
        ["Gender", gender], ["Rank", `${rank} (${DATA.rankTitles[rank - 1]})`], ["Camp", ""],
        ["Pack", ""], ["Totem", ""], ["Sept", ""],
      ],
      attrs, attrPriority, abil, abilPriority,
      bg, bgList: DATA.backgrounds,
      gifts: picker.gifts,
      giftOptions: F.giftOptions([[`${breed} (breed)`, breed, b.gifts], [`${auspice} (auspice)`, auspice, a.gifts], [`${tribe} (tribe)`, tribe, t.gifts]], others),
      rank, renown,
      merits: mf.merits, flaws: mf.flaws, mfData: DATA, mfOwn: tribe,
      adv,
      formColumns: ["Form", ...physSoc, "Diff."],
      formRows: F.formRows(DATA.forms, attrs, physSoc),
      extras, notes,
      freebieTotal, spent: fr.spent, leftover: fr.left,
      books: BOOKS,
      build: {
        avoid: breed === "Lupus" ? DATA.lupusAvoids : [],
        noBg: notAllowed,
        bgMin: t.minBackgrounds, bgStart: t.minBackgrounds,
        giftHint: `One Level 1 Gift each from your breed (${breed}), auspice (${auspice}) and tribe (${tribe})${rank > 1 ? `, plus one Gift of each Level from 2 to ${rank}` : ""}.`,
      },
    });
    c.choices = { breed, auspice, tribe, gender, rank, books: opts.books };
    c.choiceFields = { breed: "Breed", auspice: "Auspice", tribe: "Tribe", gender: "Gender", rank: "Rank" };
    return c;
  }

  // Keep the Forms table in step with hand-edited Attributes.
  function recompute(c) {
    c.table.rows = F.formRows(DATA.forms, F.attrsFromSheet(c), physSoc);
  }

  WOD.registerGame({
    id: "werewolf",
    label: "Werewolf: the Apocalypse",
    options: [
      { id: "breed", label: "Breed", choices: Object.keys(DATA.breeds) },
      { id: "auspice", label: "Auspice", choices: Object.keys(DATA.auspices) },
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
