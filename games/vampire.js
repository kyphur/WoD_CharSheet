/*
  Vampire: the Masquerade (Revised).

  Where the data comes from:
  - Clan Merits and Flaws: Lore of the Clans (LotC) and the Revised clanbooks for
    Brujah, Assamite, Tremere and Giovanni (CB). Where both list one, the Revised
    clanbook's cost is used.
  - Assamite castes and their Disciplines: Clanbook: Assamite (Revised).
  - Ability and Background names: checked against the sample characters in the
    Revised clanbooks.
  - NOT in the owner's books (the core rulebook is missing), so taken from the
    standard Revised rules: clan Disciplines, creation points (7/5/3, 13/9/5,
    3 Disciplines, 5 Backgrounds, 7 Virtues, 15 freebies), freebie and experience
    costs, the Generation table, and the short clan weakness summaries.
*/
(function () {
  const R = WOD.random;
  const F = WOD.fera;

  const ABILITIES = {
    Talents: ["Alertness", "Athletics", "Brawl", "Dodge", "Empathy", "Expression", "Intimidation", "Leadership", "Streetwise", "Subterfuge"],
    Skills: ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Melee", "Performance", "Security", "Stealth", "Survival"],
    Knowledges: ["Academics", "Computer", "Finance", "Investigation", "Law", "Linguistics", "Medicine", "Occult", "Politics", "Science"],
  };
  const BACKGROUNDS = ["Allies", "Contacts", "Fame", "Generation", "Herd", "Influence", "Mentor", "Resources", "Retainers", "Status"];
  const DISCIPLINES = ["Animalism", "Assamite Sorcery", "Auspex", "Celerity", "Chimerstry", "Dementation", "Dominate", "Fortitude", "Necromancy", "Obfuscate", "Obtenebration", "Potence", "Presence", "Protean", "Quietus", "Serpentis", "Thaumaturgy", "Vicissitude"];
  const COMMON = ["Animalism", "Auspex", "Celerity", "Dominate", "Fortitude", "Obfuscate", "Potence", "Presence"];
  const VIRTUES = ["Conscience", "Self-Control", "Courage"];
  const SECTS = ["Camarilla", "Sabbat", "Anarch", "Independent"];

  // sect: likely sects with weights. weakness: a short summary in our own words.
  const CLANS = {
    "Assamite (Warrior)": { disc: ["Celerity", "Obfuscate", "Quietus"], sect: { Independent: 8, Sabbat: 1 }, weakness: "Drinking another Kindred's blood harms them instead of feeding them (the Tremere curse)." },
    "Assamite (Sorcerer)": { disc: ["Assamite Sorcery", "Obfuscate", "Quietus"], sect: { Independent: 8, Sabbat: 1 }, weakness: "Drinking another Kindred's blood harms them instead of feeding them (the Tremere curse)." },
    "Assamite (Vizier)": { disc: ["Auspex", "Celerity", "Quietus"], sect: { Independent: 8, Sabbat: 1 }, weakness: "Drinking another Kindred's blood harms them instead of feeding them (the Tremere curse)." },
    Brujah: { disc: ["Celerity", "Potence", "Presence"], sect: { Camarilla: 5, Anarch: 4, Sabbat: 1 }, weakness: "Quick to fury: rolls to resist frenzy are 2 harder." },
    "Followers of Set": { disc: ["Obfuscate", "Presence", "Serpentis"], sect: { Independent: 9, Sabbat: 1 }, weakness: "Bright light hurts them: extra damage from sunlight and penalties in bright light." },
    Gangrel: { disc: ["Animalism", "Fortitude", "Protean"], sect: { Independent: 5, Camarilla: 3, Anarch: 2, Sabbat: 1 }, weakness: "Frenzy can leave a lasting animal feature behind." },
    Giovanni: { disc: ["Dominate", "Necromancy", "Potence"], sect: { Independent: 1 }, weakness: "Their Kiss brings pain instead of pleasure, and feeding on mortals does double damage." },
    Lasombra: { disc: ["Dominate", "Obtenebration", "Potence"], sect: { Sabbat: 8, Independent: 1, Camarilla: 1 }, weakness: "They cast no reflection." },
    Malkavian: { disc: ["Auspex", "Dementation", "Obfuscate"], sect: { Camarilla: 6, Sabbat: 2, Anarch: 1 }, weakness: "Every Malkavian has at least one permanent derangement." },
    Nosferatu: { disc: ["Animalism", "Obfuscate", "Potence"], sect: { Camarilla: 6, Sabbat: 2, Anarch: 1 }, weakness: "Hideously deformed: Appearance is 0 and can never be raised." },
    Ravnos: { disc: ["Animalism", "Chimerstry", "Fortitude"], sect: { Independent: 8, Anarch: 1 }, weakness: "Each has a vice (lying, cheating, stealing...) they must roll Self-Control to resist." },
    Toreador: { disc: ["Auspex", "Celerity", "Presence"], sect: { Camarilla: 7, Anarch: 1, Sabbat: 1 }, weakness: "Beauty can entrance them, leaving them transfixed." },
    Tremere: { disc: ["Auspex", "Dominate", "Thaumaturgy"], sect: { Camarilla: 9, Sabbat: 1 }, weakness: "Already partly blood bound to the clan's elders, which keeps them loyal." },
    Tzimisce: { disc: ["Animalism", "Auspex", "Vicissitude"], sect: { Sabbat: 9, Independent: 1 }, weakness: "Must rest with two handfuls of earth from a place important to them in life, or lose dice." },
    Ventrue: { disc: ["Dominate", "Fortitude", "Presence"], sect: { Camarilla: 9, Sabbat: 1 }, weakness: "Can feed only on one particular kind of mortal." },
    Caitiff: { disc: [], sect: { Camarilla: 3, Anarch: 5, Independent: 1 }, weakness: "No clan weakness, but no clan either: most Kindred look down on them." },
  };
  // Blood magic: what the first path usually is.
  const PATHS = {
    Thaumaturgy: "Thaumaturgy: most Tremere start with the Path of Blood as their primary path (rating = Thaumaturgy) and one Level 1 ritual.",
    Necromancy: "Necromancy: the Sepulchre Path is the usual first path (rating = Necromancy), plus one Level 1 ritual.",
    "Assamite Sorcery": "Assamite Sorcery: pick a primary path (rating = Assamite Sorcery) and one Level 1 ritual.",
  };
  // Generation -> [blood pool maximum, blood per turn, highest Trait].
  const GENERATION = { 13: [10, 1, 5], 12: [11, 1, 5], 11: [12, 1, 5], 10: [13, 1, 5], 9: [14, 2, 5], 8: [15, 3, 5], 7: [20, 4, 6], 6: [30, 6, 7], 5: [40, 8, 8], 4: [50, 10, 9] };
  const ordinal = (n) => `${n}${n % 100 >= 11 && n % 100 <= 13 ? "th" : ["th", "st", "nd", "rd"][n % 10] || "th"}`;

  const BOOKS = { LotC: "Lore of the Clans", CB: "the Revised clanbook for that clan" };
  const MF = {
    merits: [
      ["Sectarian Ally", 1, "LotC", "Assamite"],
      ["Thousand Meter Killer", 1, "LotC", "Assamite"],
      ["Fury’s Focus", 3, "LotC", "Brujah"],
      ["Compassionate", 4, "CB", "Brujah"],
      ["Dynamic Personality", 5, "CB", "Brujah"],
      ["Personal Masquerade", 3, "LotC", "Caitiff"],
      ["Drug Resistance", 2, "LotC", "Followers of Set"],
      ["Addictive Blood", 3, "LotC", "Followers of Set"],
      ["Setite Initiate", 5, "LotC", "Followers of Set"],
      ["Hive-Minded", "1-2", "LotC", "Gangrel"],
      ["Skald", 2, "LotC", "Gangrel"],
      ["Lesser Mark of the Beast", 4, "LotC", "Gangrel"],
      ["Totemic Change", 5, "LotC", "Gangrel"],
      ["Cannibal", 1, "LotC", "Giovanni"],
      ["Consanguineous Resistance", 1, "CB", "Giovanni"],
      ["Mortuario", "2-4", "LotC", "Giovanni"],
      ["Proxy Kissed", 4, "CB", "Giovanni"],
      ["Sanguine Incongruity", 5, "CB", "Giovanni"],
      ["Eyes of Shadow", "1-4", "LotC", "Lasombra"],
      ["Court Favorite", "1-5", "LotC", "Lasombra"],
      ["Bigger Boys Came", 2, "LotC", "Lasombra"],
      ["Call of the Sea", 2, "LotC", "Lasombra"],
      ["Controllable Night Sight", 2, "LotC", "Lasombra"],
      ["Secret Stash", "2-5", "LotC", "Lasombra"],
      ["Aura of Command", 3, "LotC", "Lasombra"],
      ["King or Queen of Shadow", 4, "LotC", "Lasombra"],
      ["Long-Term Planning", 4, "LotC", "Lasombra"],
      ["Instrument of God", 5, "LotC", "Lasombra"],
      ["Distracting Aura", 2, "LotC", "Malkavian"],
      ["Prophetic Dreams", 2, "LotC", "Malkavian"],
      ["Cold Read", 3, "LotC", "Malkavian"],
      ["Foul Blood", 1, "LotC", "Nosferatu"],
      ["Lizard Limbs", 1, "LotC", "Nosferatu"],
      ["Long Fingers", 1, "LotC", "Nosferatu"],
      ["Monstrous Maw", 1, "LotC", "Nosferatu"],
      ["Piscine", 1, "LotC", "Nosferatu"],
      ["Slimy", 1, "LotC", "Nosferatu"],
      ["Spawning Pool", "1-3", "LotC", "Nosferatu"],
      ["Tunnel Rat", "1-5", "LotC", "Nosferatu"],
      ["Sleep Unseen", 2, "LotC", "Nosferatu"],
      ["Tough Hide", 2, "LotC", "Nosferatu"],
      ["False Reflection", 3, "LotC", "Nosferatu"],
      ["Patagia", 4, "LotC", "Nosferatu"],
      ["Rugged Bad Looks", 5, "LotC", "Nosferatu"],
      ["Antitoxin Blood", 1, "LotC", "Ravnos"],
      ["Brahmin", 1, "LotC", "Ravnos"],
      ["Kshatriya", 1, "LotC", "Ravnos"],
      ["Legerdemain", 1, "LotC", "Ravnos"],
      ["Mute Devotion", 1, "LotC", "Ravnos"],
      ["Vaishya", 1, "LotC", "Ravnos"],
      ["Critters", 2, "LotC", "Ravnos"],
      ["Heart of Needles", 3, "LotC", "Ravnos"],
      ["Indelible", "1-2", "LotC", "Toreador"],
      ["Impressive Restraint", 2, "LotC", "Toreador"],
      ["Master of the Masquerade", 2, "LotC", "Toreador"],
      ["Slowed Degeneration", 5, "LotC", "Toreador"],
      ["Secret Society Member", 1, "LotC", "Tremere"],
      ["Keys to the Library", "1-5", "LotC", "Tremere"],
      ["Attuned Taste", 2, "CB", "Tremere"],
      ["Outside Haven", 2, "LotC", "Tremere"],
      ["Unmarked Antitribu", "2-5", "LotC", "Tremere"],
      ["Embraced Without the Cup", 3, "CB", "Tremere"],
      ["Quartermaster", 3, "LotC", "Tremere"],
      ["Bioluminescence", 1, "LotC", "Tzimisce"],
      ["Pain Tolerance", 2, "LotC", "Tzimisce"],
      ["Dracon’s Temperament", 3, "LotC", "Tzimisce"],
      ["Haven Affinity", 3, "LotC", "Tzimisce"],
      ["Revenant Disciplines", 3, "LotC", "Tzimisce"],
      ["Promethean Clay", 5, "LotC", "Tzimisce"],
      ["Connoisseur", 2, "LotC", "Ventrue"],
    ],
    flaws: [
      ["Outcast", 2, "LotC", "Assamite"],
      ["Broken Antitribu", 3, "LotC", "Assamite"],
      ["Multiple Curses", 3, "LotC", "Assamite"],
      ["Un-Broken", 3, "CB", "Assamite"],
      ["Magical Addict", "3-5", "CB", "Assamite"],
      ["Obvious Predator", 2, "CB", "Brujah"],
      ["Uncontrollable", 5, "CB", "Brujah"],
      ["Clan Weakness", 2, "LotC", "Caitiff"],
      ["Fangless", 2, "LotC", "Caitiff"],
      ["Ignorance", 2, "LotC", "Caitiff"],
      ["Bulimia", 4, "LotC", "Caitiff"],
      ["Scales", "1-3", "LotC", "Followers of Set"],
      ["Forked Tongue", 2, "LotC", "Followers of Set"],
      ["Venomous Bite", 2, "LotC", "Followers of Set"],
      ["Heartless", 4, "LotC", "Followers of Set"],
      ["Aura of the Typhon", 5, "LotC", "Followers of Set"],
      ["Member of the Pack", 2, "LotC", "Gangrel"],
      ["Rat in a Cage", 2, "LotC", "Gangrel"],
      ["Inbred", "1-5", "LotC", "Giovanni"],
      ["Shadow Walker", 6, "CB", "Giovanni"],
      ["Uncontrollable Night Sight", 2, "LotC", "Lasombra"],
      ["Insubordinate", 3, "LotC", "Lasombra"],
      ["Unproven", 3, "LotC", "Lasombra"],
      ["Paper Trail", 2, "LotC", "Malkavian"],
      ["Stigmata", "2-4", "LotC", "Malkavian"],
      ["Infectious", 3, "LotC", "Malkavian"],
      ["Overstimulated", 3, "LotC", "Malkavian"],
      ["Dead Inside", 4, "LotC", "Malkavian"],
      ["Stench", 1, "LotC", "Nosferatu"],
      ["Dangerous Secret", "1-5", "LotC", "Nosferatu"],
      ["Anosmia", 2, "LotC", "Nosferatu"],
      ["Parasitic Infestation", 2, "LotC", "Nosferatu"],
      ["Bestial", 3, "LotC", "Nosferatu"],
      ["Enemy Brood", 3, "LotC", "Nosferatu"],
      ["Putrescent", 4, "LotC", "Nosferatu"],
      ["Contagious", 5, "LotC", "Nosferatu"],
      ["Incoherent", 5, "LotC", "Nosferatu"],
      ["Chandala", 1, "LotC", "Ravnos"],
      ["Flawed Reality", 2, "LotC", "Ravnos"],
      ["Oathbreaker", 2, "LotC", "Ravnos"],
      ["Lost Svadharma", 3, "LotC", "Ravnos"],
      ["Tortured Artist", 1, "LotC", "Toreador"],
      ["Private Life", 3, "LotC", "Toreador"],
      ["Arcane Curse", "1-5", "LotC", "Tremere"],
      ["Cloistered", 2, "LotC", "Tremere"],
      ["Betrayer’s Mark", 3, "LotC", "Tremere"],
      ["Bound to the Clan", 3, "LotC", "Tremere"],
      ["Bound to the Council", 3, "CB", "Tremere"],
      ["Double Betrayer", 4, "CB", "Tremere"],
      ["Mage Blood", 5, "LotC", "Tremere"],
      ["Thaumaturgically Inept", 5, "CB", "Tremere"],
      ["Unblinking", 1, "LotC", "Tzimisce"],
      ["Ancestral Soil Dependence", 2, "LotC", "Tzimisce"],
      ["Faceless", 3, "LotC", "Tzimisce"],
      ["Privacy Obsession", 3, "LotC", "Tzimisce"],
      ["Revenant Weakness", 3, "LotC", "Tzimisce"],
      ["Consumption", 5, "LotC", "Tzimisce"],
      ["Uncommon Vitae Preference", 2, "LotC", "Ventrue"],
    ],
  };

  const NAMES = {
    female: ["Adele", "Beatrix", "Celeste", "Delia", "Evangeline", "Fiona", "Genevieve", "Helena", "Isadora", "Josephine", "Lucinda", "Mara", "Nadia", "Octavia", "Rosalind", "Serena", "Valeria", "Vivian"],
    male: ["Adrian", "Bastian", "Cassius", "Damien", "Elias", "Felix", "Gideon", "Hector", "Julian", "Lucius", "Marcus", "Nathaniel", "Owen", "Rafael", "Silas", "Tobias", "Victor", "Xavier"],
    last: ["Ashford", "Blackwood", "Carrow", "Delacroix", "Everett", "Fairchild", "Grimaldi", "Hale", "Ivanov", "Kessler", "Lockhart", "Marlowe", "Navarro", "Okonkwo", "Prescott", "Quinlan", "Rourke", "Sinclair", "Thorne", "Vance", "Whitlock"],
  };
  const CONCEPTS = ["Artist", "Bodyguard", "Club kid", "Con artist", "Criminal", "Drifter", "Detective", "Entertainer", "Journalist", "Occultist", "Politician", "Professional", "Punk", "Socialite", "Soldier", "Student", "Street preacher", "Worker"];

  const COSTS = { Attribute: 5, Ability: 2, Discipline: 7, Background: 1, Virtue: 2, Humanity: 1, Willpower: 1 };
  const COST_TEXT = "Costs: Attribute 5 · Ability 2 · Discipline 7 · Background 1 · Virtue 2 · Humanity 1 · Willpower 1 · Merits cost their points · Flaws give up to 7.";
  const XP_TEXT = "Attribute = current × 4, Ability = current × 2 (new: 3), clan Discipline = current × 5, other Discipline = current × 7 (Caitiff: × 6), new Discipline = 10, Virtue = current × 2, Humanity = current × 2, Willpower = current, Background = current × 3 (new: 3, with the Storyteller's OK).";

  window.VAMPIRE_DATA = { ABILITIES, BACKGROUNDS, DISCIPLINES, CLANS, GENERATION, MF };

  const sum = (obj, keys) => keys.reduce((s, k) => s + (obj[k] || 0), 0);
  const mfLists = (clan) => {
    const base = clan.startsWith("Assamite") ? "Assamite" : clan;
    const mine = (x) => x[3] === base;
    // x[3] (the clan) also tells the "+ Add" box to group them as "<clan> only".
    return { merits: MF.merits, flaws: MF.flaws, rollMerits: MF.merits.filter(mine), rollFlaws: MF.flaws.filter(mine), own: base };
  };

  function generate(opts) {
    const freebieTotal = Number.isFinite(opts.freebies) ? opts.freebies : 15;
    const clan = opts.clan || R.weighted(Object.fromEntries(Object.keys(CLANS).map((k) => [k, k === "Caitiff" ? 1 : k.startsWith("Assamite") ? 1 : 3])));
    const k = CLANS[clan];
    const sect = opts.sect || R.weighted(k.sect);
    const gender = F.pickGender(opts);
    const caitiff = clan === "Caitiff";
    const notes = [];
    if (!k.sect[sect]) notes.push(`${clan} in the ${sect} is unusual.`);

    // Attributes 7/5/3. Nosferatu have Appearance 0: its dots go to Charisma/Manipulation.
    const { attrs, priority: attrPriority } = F.attributes();
    if (clan === "Nosferatu") {
      let spare = attrs.Appearance - 1;
      attrs.Appearance = 0;
      for (; spare > 0; spare--) {
        const open = ["Charisma", "Manipulation"].filter((n) => attrs[n] < 5);
        if (!open.length) break;
        attrs[R.pick(open)]++;
      }
    }
    const { abil, priority: abilPriority } = F.abilities([], ABILITIES);

    // Backgrounds 5 (Generation chosen up front takes its dots first).
    const wantGen = Number(opts.generation) || 0;
    const genDots = wantGen ? Math.min(5, 13 - wantGen) : R.chance(0.25) ? R.int(1, 2) : 0;
    const { bg } = F.backgrounds(BACKGROUNDS, ["Generation"]);
    for (let d = 0; d < genDots; d++) {
      const from = R.pick(BACKGROUNDS.filter((n) => n !== "Generation" && bg[n] > 0));
      if (!from) break;
      bg[from]--;
      bg.Generation++;
    }

    // Disciplines: 3 dots among the clan's (Caitiff: any common ones).
    const discList = caitiff ? R.shuffle(COMMON).slice(0, R.int(1, 3)) : k.disc.slice();
    const disc = Object.fromEntries(discList.map((d) => [d, 0]));
    R.distribute(disc, discList, 3, 3);

    // Virtues: each starts at 1, plus 7 dots.
    const virt = { Conscience: 1, "Self-Control": 1, Courage: 1 };
    R.distribute(virt, VIRTUES, 7, 5);

    // Merits & Flaws from the clan's own list (fixed costs only when rolling).
    const mfData = mfLists(clan);
    const mf = F.meritsFlaws({ merits: mfData.rollMerits, flaws: mfData.rollFlaws }, freebieTotal, () => true, opts.meritsFlaws !== "No" && freebieTotal > 0);

    // Freebies.
    const adv = { Humanity: virt.Conscience + virt["Self-Control"], Willpower: virt.Courage };
    const spent = [];
    let left = mf.freebies;
    const canBuy = {
      Attribute: () => Object.keys(attrs).filter((n) => attrs[n] < 5 && !(clan === "Nosferatu" && n === "Appearance")),
      Ability: () => Object.keys(abil).filter((n) => abil[n] < 5),
      Discipline: () => Object.keys(disc).filter((n) => disc[n] < 5),
      Background: () => BACKGROUNDS.filter((n) => bg[n] < 5 && n !== "Generation"),
      Virtue: () => VIRTUES.filter((n) => virt[n] < 5),
      Humanity: () => (adv.Humanity < 10 ? ["Humanity"] : []),
      Willpower: () => (adv.Willpower < 10 ? ["Willpower"] : []),
    };
    const weights = { Ability: 4, Background: 3, Attribute: 2, Discipline: 1, Willpower: 2, Humanity: 1, Virtue: 1 };
    while (left > 0) {
      const w = {};
      for (const [kind, x] of Object.entries(weights)) if (COSTS[kind] <= left && canBuy[kind]().length) w[kind] = x;
      if (!Object.keys(w).length) break;
      const kind = R.weighted(w);
      const name = R.pick(canBuy[kind]());
      if (kind === "Attribute") attrs[name]++;
      else if (kind === "Ability") abil[name]++;
      else if (kind === "Discipline") disc[name]++;
      else if (kind === "Background") bg[name]++;
      else if (kind === "Virtue") {
        // Humanity and Willpower are worked out from the Virtues, so they rise with them.
        virt[name]++;
        if (name === "Courage") adv.Willpower = Math.min(10, adv.Willpower + 1);
        else adv.Humanity = Math.min(10, adv.Humanity + 1);
      }
      else adv[kind]++;
      left -= COSTS[kind];
      const row = spent.find((x) => x.name === name);
      if (row) { row.n++; row.cost += COSTS[kind]; } else spent.push({ name, n: 1, cost: COSTS[kind] });
    }
    if (left > 0) notes.push(`${F.pts(left)} of freebie points left over: everything that could be raised is already at maximum.`);

    const name = `${F.firstName(NAMES, gender)} ${R.pick(NAMES.last)}`;
    const toItems = (obj, keys, max) => keys.map((n) => [n, obj[n], max]);
    const flawPts = mf.flaws.reduce((s, f) => s + f[1], 0);
    const meritPts = mf.merits.reduce((s, m) => s + m[1], 0);
    let freebieText = String(freebieTotal);
    if (flawPts) freebieText += ` + ${F.pts(flawPts)} from Flaws`;
    if (meritPts) freebieText += ` − ${F.pts(meritPts)} on Merits`;

    const c = {
      game: "Vampire: the Masquerade",
      name,
      header: [
        ["Name", name], ["Player", ""], ["Chronicle", ""],
        ["Nature", R.pick(F.ARCHETYPES)], ["Demeanor", R.pick(F.ARCHETYPES)], ["Concept", R.pick(CONCEPTS)],
        ["Clan", clan], ["Generation", ""], ["Sire", ""],
        ["Gender", gender], ["Sect", sect], ["Haven", ""],
      ],
      sections: [
        { title: "Attributes", columns: Object.keys(F.ATTRIBUTES).map((cat) => ({ title: `${cat} (${attrPriority[cat]})`, items: toItems(attrs, F.ATTRIBUTES[cat], 5) })) },
        {
          title: "Abilities",
          columns: Object.keys(ABILITIES).map((cat) => ({
            title: `${cat} (${abilPriority[cat]})`,
            items: toItems(abil, ABILITIES[cat], 5),
            allowCustom: true,
            addLabel: `Add ${cat.replace(/s$/, "").toLowerCase()}`,
            customPrompt: `Name of the new ${cat.replace(/s$/, "").toLowerCase()}:`,
          })),
        },
        {
          title: "Advantages",
          columns: [
            { title: "Disciplines", items: Object.keys(disc).map((n) => [n, disc[n], 5]), removable: true, addOptions: DISCIPLINES, allowCustom: true, addLabel: "Add Discipline", customPrompt: "Name of the Discipline:" },
            { title: "Backgrounds", items: BACKGROUNDS.filter((n) => bg[n] > 0).map((n) => [n, bg[n], 5]), removable: true, addOptions: BACKGROUNDS, allowCustom: true, addLabel: "Add background", customPrompt: "Name of the background:" },
            { title: "Virtues", items: toItems(virt, VIRTUES, 5) },
          ],
        },
        {
          title: "Merits & Flaws",
          columns: [
            { title: "Merits", list: mf.merits.map(F.mfLabel), listOptions: F.groupByCost(mfData.merits, mfData.own), allowCustom: true, addLabel: "Add Merit", customPrompt: "Merit name and cost, e.g. Iron Will (5 pts):" },
            { title: "Flaws", list: mf.flaws.map(F.mfLabel), listOptions: F.groupByCost(mfData.flaws, mfData.own), allowCustom: true, addLabel: "Add Flaw", customPrompt: "Flaw name and value, e.g. Nightmares (1 pt):" },
          ],
        },
        {
          title: "Humanity, Willpower & Blood Pool",
          columns: [
            { title: "Humanity", items: [["Rating", adv.Humanity, 10]] },
            { title: "Willpower", items: [["Permanent", adv.Willpower, 10]], boxes: 10 },
            { title: "Blood Pool", boxes: 10, text: "" },
          ],
        },
      ],
      table: null,
      panel: { title: "Clan & Blood", lines: [] },
      health: F.HEALTH,
      extras: [],
      freebies: { total: freebieText, spent: spent.map((x) => `${x.name} +${x.n} (${F.pts(x.cost)})`) },
      notes,
      sources: [...new Set([...mf.merits, ...mf.flaws].map((x) => x[2]))].map((b) => `${b} = ${BOOKS[b]}`),
      choices: { clan, sect, gender },
      choiceFields: { clan: "Clan", sect: "Sect", gender: "Gender" },
      build: {
        rank: 1, avoid: [], noBg: [], bgStart: {}, bgFree: 5, freeAbil: {}, keepGifts: [], giftHint: "", ownSources: [],
        costs: COSTS,
        advKinds: ["Humanity", "Willpower"],
        choiceAdv: [], // Humanity and Willpower come from Virtues, not from clan or sect
        pools: [
          { title: "Disciplines", column: "Disciplines", kind: "Discipline", size: 3, startAll: 0, fillCap: 3, allowed: caitiff ? null : k.disc, hint: caitiff ? "Three dots in any Disciplines (Caitiff have no clan Disciplines)." : `Three dots among your clan Disciplines: ${k.disc.join(", ")}.` },
          { title: "Virtues", column: "Virtues", kind: "Virtue", size: 7, startAll: 1, fillCap: 5, hint: "Each Virtue starts at 1. Humanity = Conscience + Self-Control; Willpower = Courage." },
        ],
        attrStart: clan === "Nosferatu" ? { Appearance: 0 } : {},
        attrMax: clan === "Nosferatu" ? { Appearance: 0 } : {},
        clanDisciplines: k.disc,
        caitiff,
        costText: COST_TEXT,
        xpText: XP_TEXT,
      },
    };
    recompute(c);
    return c;
  }

  // Keep Generation, blood pool and clan notes in step with the sheet. While a player
  // builds the character, Humanity and Willpower follow the Virtues (plus anything bought).
  function recompute(c) {
    const cols = c.sections.flatMap((s) => s.columns);
    const col = (t) => cols.find((x) => x.title === t);
    const genDots = (col("Backgrounds").items.find((x) => x[0] === "Generation") || [0, 0])[1];
    const gen = Math.max(4, 13 - genDots);
    const [pool, perTurn, maxTrait] = GENERATION[gen];
    c.header.find((h) => h[0] === "Generation")[1] = `${ordinal(gen)}`;
    const blood = col("Blood Pool");
    blood.boxes = pool;
    blood.text = `Up to ${pool}, ${perTurn} per turn`;

    if (c.stage === "build") {
      const v = Object.fromEntries(col("Virtues").items.map((x) => [x[0], x[1]]));
      const base = { Humanity: (v.Conscience || 0) + (v["Self-Control"] || 0), Willpower: v.Courage || 0 };
      for (const kind of ["Humanity", "Willpower"]) {
        const it = col(kind).items[0];
        const old = c.build.adv[kind] ?? base[kind];
        it[1] = Math.max(0, Math.min(10, it[1] - old + base[kind]));
        c.build.adv[kind] = base[kind];
      }
    }

    const clan = (c.choices && c.choices.clan) || c.header.find((h) => h[0] === "Clan")[1];
    const k = CLANS[clan] || CLANS.Caitiff;
    // Nosferatu Appearance is always 0; anyone else starts at 1 at least.
    const app = c.sections[0].columns.flatMap((x) => x.items).find((x) => x[0] === "Appearance");
    if (clan === "Nosferatu") app[1] = 0;
    else if (app[1] === 0) app[1] = 1;
    const discs = col("Disciplines").items.map((x) => x[0]);
    c.panel.lines = [
      ["Clan weakness (summary)", k.weakness],
      ["Clan Disciplines", k.disc.length ? k.disc.join(", ") : "none (Caitiff)"],
      ["Generation", `${ordinal(gen)}: blood pool ${pool}, ${perTurn} per turn, Traits up to ${maxTrait}`],
      ["Starting blood", "roll one die for the blood in the body at the start of play"],
      ...Object.keys(PATHS).filter((d) => discs.includes(d)).map((d) => ["Blood magic", PATHS[d]]),
    ];
  }

  WOD.registerGame({
    id: "vampire",
    label: "Vampire: the Masquerade",
    options: [
      { id: "clan", label: "Clan", choices: Object.keys(CLANS) },
      { id: "sect", label: "Sect", choices: SECTS },
      { id: "gender", label: "Gender", choices: ["Female", "Male"] },
      { id: "generation", label: "Generation", choices: [13, 12, 11, 10, 9, 8], npcOnly: true },
      { id: "freebies", label: "Freebie points", type: "number", min: 0, max: 500, default: 15 },
      { id: "meritsFlaws", label: "Merits & Flaws", choices: ["Random", "No"], default: "Random", random: false },
    ],
    generate,
    recompute,
  });
})();
