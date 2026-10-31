/*
  Shared building blocks for the shapeshifter games (Werewolf, Bastet, Mokole...).
  Each game file keeps its own data and decides how to combine these steps.
*/
WOD.fera = (function () {
  const R = WOD.random;

  const ATTRIBUTES = {
    Physical: ["Strength", "Dexterity", "Stamina"],
    Social: ["Charisma", "Manipulation", "Appearance"],
    Mental: ["Perception", "Intelligence", "Wits"],
  };
  const ABILITIES = {
    Talents: ["Alertness", "Athletics", "Brawl", "Dodge", "Empathy", "Expression", "Intimidation", "Primal-Urge", "Streetwise", "Subterfuge"],
    Skills: ["Animal Ken", "Crafts", "Drive", "Etiquette", "Firearms", "Leadership", "Melee", "Performance", "Stealth", "Survival"],
    Knowledges: ["Computer", "Enigmas", "Investigation", "Law", "Linguistics", "Medicine", "Occult", "Politics", "Rituals", "Science"],
  };
  const ARCHETYPES = ["Architect", "Autocrat", "Bon Vivant", "Bravo", "Caregiver", "Celebrant", "Competitor", "Conformist", "Conniver", "Curmudgeon", "Deviant", "Director", "Fanatic", "Gallant", "Judge", "Loner", "Martyr", "Masochist", "Monster", "Penitent", "Perfectionist", "Rebel", "Rogue", "Survivor", "Thrill-Seeker", "Traditionalist", "Visionary"];
  const HEALTH = [["Bruised", ""], ["Hurt", "-1"], ["Injured", "-1"], ["Wounded", "-2"], ["Mauled", "-2"], ["Crippled", "-5"], ["Incapacitated", ""]];
  const COSTS = { Attribute: 5, Ability: 2, Background: 1, Gift: 7, Rage: 1, Gnosis: 2, Willpower: 1 };
  const PRIORITY = ["Primary", "Secondary", "Tertiary"];

  const pts = (n) => `${n} pt${n === 1 ? "" : "s"}`;

  // ---- Gifts. A gift set is { core: { level: [names] }, extra: { book: { level: [names] } } }.
  const G = (core, extra = {}) => ({ core, extra });

  function giftEntries(set, coreOnly) {
    const out = [];
    if (!set) return out;
    for (const [lvl, names] of Object.entries(set.core || {})) for (const n of names) out.push({ name: n, level: Number(lvl), book: "Core" });
    if (!coreOnly) {
      for (const [book, byLevel] of Object.entries(set.extra || {})) {
        for (const [lvl, names] of Object.entries(byLevel)) for (const n of names) out.push({ name: n, level: Number(lvl), book });
      }
    }
    return out;
  }

  const giftLabel = (g) => `${g.name} (${g.source}, L${g.level}${g.book === "Core" ? "" : ", " + g.book})`;
  const mfLabel = ([name, cost, book]) => `${name} (${pts(cost)}${book === "Core" ? "" : ", " + book})`;

  // sources: [[giftSet, sourceLabel], ...]; returns a helper to draw Gifts without repeats.
  function giftPicker(sources, coreOnly) {
    const gifts = [];
    const available = (level) =>
      sources.flatMap(([set, source]) => giftEntries(set, coreOnly).filter((g) => g.level === level).map((g) => ({ ...g, source })))
        .filter((g) => !gifts.some((x) => x.name === g.name));
    return {
      gifts,
      available,
      // Take one Gift of `level` from one specific source (or any source if null).
      take(level, onlySource) {
        const pool = available(level).filter((g) => !onlySource || g.source === onlySource);
        if (!pool.length) return null;
        const g = R.pick(pool);
        gifts.push(g);
        return g;
      },
    };
  }

  // "+ Add Gift" choices: the character's own sources first, then everything else.
  function giftOptions(own, others) {
    const groups = [];
    const seen = new Set();
    const add = (title, source, set, isOwn) => {
      const options = giftEntries(set, false)
        .sort((x, y) => x.level - y.level || x.name.localeCompare(y.name))
        .map((g) => giftLabel({ ...g, source }))
        .filter((l) => !seen.has(l) && seen.add(l));
      if (options.length) groups.push({ group: title, options, own: isOwn, source });
    };
    for (const [title, source, set] of own) add(title, source, set, true);
    for (const [title, source, set] of others) add(title, source, set, false);
    return groups;
  }

  // ---- Gender and names. names = { female: [...], male: [...], last: [...] }
  const pickGender = (opts) => (opts.gender === "Female" || opts.gender === "Male" ? opts.gender : R.pick(["Female", "Male"]));
  const firstName = (names, gender) => R.pick(names[gender.toLowerCase()] || [...(names.female || []), ...(names.male || [])]);

  // ---- Core traits.
  function attributes() {
    const attrs = {};
    const priority = {};
    R.shuffle(Object.keys(ATTRIBUTES)).forEach((cat, i) => {
      priority[cat] = PRIORITY[i];
      ATTRIBUTES[cat].forEach((n) => (attrs[n] = 1));
      R.distribute(attrs, ATTRIBUTES[cat], [7, 5, 3][i], 5);
    });
    return { attrs, priority };
  }

  function abilities(avoid = [], LIST = ABILITIES) {
    const abil = {};
    const priority = {};
    const ok = (n) => !avoid.includes(n);
    // Pick an order where every category has room for its points (max 3 each);
    // a wolf- or reptile-born character can't put 13 points into four Knowledges.
    const room = (cat) => LIST[cat].filter(ok).length * 3;
    let order;
    for (let tries = 0; tries < 50; tries++) {
      order = R.shuffle(Object.keys(LIST));
      if (order.every((cat, i) => room(cat) >= [13, 9, 5][i])) break;
    }
    order.forEach((cat, i) => {
      const p = [13, 9, 5][i];
      priority[cat] = PRIORITY[i];
      LIST[cat].forEach((n) => (abil[n] = 0));
      const allowed = LIST[cat].filter(ok);
      // Focus points on a handful of abilities so characters feel specialized.
      const size = Math.min(allowed.length, Math.max(Math.ceil(p / 3), Math.ceil(p / 2) + 1));
      R.distribute(abil, R.shuffle(allowed).slice(0, size), p, 3);
    });
    return { abil, priority, ok };
  }

  function backgrounds(list, notAllowed = [], mins = {}) {
    const bg = {};
    list.forEach((n) => (bg[n] = 0));
    let points = 5;
    for (const [n, min] of Object.entries(mins)) {
      bg[n] = min;
      points -= min;
    }
    const allowed = list.filter((n) => !notAllowed.includes(n));
    const focus = R.shuffle(allowed).slice(0, R.int(2, 3));
    Object.keys(mins).forEach((n) => focus.includes(n) || focus.push(n));
    R.distribute(bg, focus, points, 5);
    return { bg, allowed };
  }

  function renown(names, need) {
    const r = {};
    names.forEach((n) => (r[n] = 0));
    if (typeof need === "number") R.distribute(r, names, need, 10);
    else Object.assign(r, need);
    return r;
  }

  // Random Merit and/or Flaw. Flaws add freebie points (max 4 at random), Merits cost them.
  function meritsFlaws(data, freebies, rollable, enabled) {
    const merits = [];
    const flaws = [];
    if (enabled) {
      if (R.chance(0.5)) {
        const f = R.pick(data.flaws.filter((x) => typeof x[1] === "number" && x[1] <= 4 && rollable(x)));
        if (f) { flaws.push(f); freebies += f[1]; }
      }
      if (R.chance(0.5)) {
        const m = R.pick(data.merits.filter((x) => typeof x[1] === "number" && x[1] <= Math.min(freebies, 4) && rollable(x)));
        if (m) { merits.push(m); freebies -= m[1]; }
      }
    }
    return { merits, flaws, freebies };
  }

  // Spend freebie points at random. s = { attrs, abil, abilityOk, bg, bgAllowed, adv, picker }
  function spendFreebies(s, points) {
    let left = points;
    const spent = [];
    const canBuy = {
      Attribute: () => Object.keys(s.attrs).filter((k) => s.attrs[k] < 5),
      Ability: () => Object.keys(s.abil).filter((k) => s.abil[k] < 5 && s.abilityOk(k)),
      Background: () => s.bgAllowed.filter((k) => s.bg[k] < 5),
      Gift: () => s.picker.available(1),
      Rage: () => ("Rage" in s.adv && s.adv.Rage < 10 ? ["Rage"] : []),
      Gnosis: () => (s.adv.Gnosis < 10 ? ["Gnosis"] : []),
      Willpower: () => (s.adv.Willpower < 10 ? ["Willpower"] : []),
    };
    const baseWeights = { Ability: 4, Background: 3, Attribute: 2, Rage: 2, Gnosis: 2, Willpower: 2, Gift: 1 };
    while (left > 0) {
      const weights = {};
      for (const [k, w] of Object.entries(baseWeights)) if (COSTS[k] <= left && canBuy[k]().length) weights[k] = w;
      if (!Object.keys(weights).length) break;
      const kind = R.weighted(weights);
      let what;
      if (kind === "Attribute") {
        what = R.pick(canBuy.Attribute());
        s.attrs[what]++;
      } else if (kind === "Ability") {
        const owned = canBuy.Ability().filter((k) => s.abil[k] > 0);
        what = R.pick(owned.length && R.chance(0.7) ? owned : canBuy.Ability());
        s.abil[what]++;
      } else if (kind === "Background") {
        const owned = canBuy.Background().filter((k) => s.bg[k] > 0);
        what = R.pick(owned.length && R.chance(0.7) ? owned : canBuy.Background());
        s.bg[what]++;
      } else if (kind === "Gift") {
        const g = R.pick(canBuy.Gift());
        s.picker.gifts.push(g);
        what = `Gift: ${g.name}`;
      } else {
        s.adv[kind]++;
        what = kind;
      }
      left -= COSTS[kind];
      spent.push({ what, cost: COSTS[kind] });
    }
    // Combine repeats, e.g. "Contacts +2 (2 pts)".
    const rows = [];
    for (const x of spent) {
      const row = rows.find((r) => r.what === x.what);
      if (row) { row.n++; row.cost += x.cost; } else rows.push({ ...x, n: 1 });
    }
    return {
      left,
      spent: rows.map((x) => (x.what.startsWith("Gift: ") ? `${x.what} (${pts(x.cost)})` : `${x.what} +${x.n} (${pts(x.cost)})`)),
    };
  }

  // forms: [{ name, mods: { Trait: n }, zero: [traits set to 0], diff }]
  function formRows(forms, attrs, cols) {
    return forms.map((f) => {
      const row = { Form: f.name };
      cols.forEach((s) => {
        let v = (attrs[s] || 0) + ((f.mods || {})[s] || 0);
        if ((f.zero || []).includes(s)) v = 0;
        row[s] = Math.max(0, v);
      });
      if (f.diff !== undefined) row["Diff."] = f.diff;
      return row;
    });
  }

  function attrsFromSheet(c) {
    const attrs = {};
    const sec = c.sections.find((s) => s.title === "Attributes");
    for (const col of sec.columns) for (const [n, v] of col.items) attrs[n] = v;
    return attrs;
  }

  function groupByCost(list, own) {
    const groups = {};
    for (const mf of list) {
      const key = mf[3] ? `${mf[3]} only` : pts(mf[1]);
      (groups[key] = groups[key] || []).push(mfLabel(mf));
    }
    return Object.entries(groups)
      .sort(([a], [b]) => (a.endsWith("only") - b.endsWith("only")) || (b.startsWith(own) - a.startsWith(own)) || a.localeCompare(b, undefined, { numeric: true }))
      .map(([group, options]) => ({ group, options }));
  }

  // Assemble the standard sheet. p holds everything the game decided.
  function sheet(p) {
    const toItems = (obj, keys, max) => keys.map((k) => [k, obj[k], max]);
    let freebieText = String(p.freebieTotal);
    const flawPts = p.flaws.reduce((s, f) => s + f[1], 0);
    const meritPts = p.merits.reduce((s, m) => s + m[1], 0);
    if (flawPts) freebieText += ` + ${pts(flawPts)} from Flaws`;
    if (meritPts) freebieText += ` − ${pts(meritPts)} on Merits`;
    const notes = [...(p.notes || [])];
    if (p.leftover > 0) notes.push(`${pts(p.leftover)} of freebie points left over: everything that could be raised is already at maximum.`);
    const used = new Set([...p.gifts.map((g) => g.book), ...p.merits.map((m) => m[2]), ...p.flaws.map((f) => f[2])]);
    used.delete("Core");

    const sections = [
      { title: "Attributes", columns: Object.keys(ATTRIBUTES).map((cat) => ({ title: `${cat} (${p.attrPriority[cat]})`, items: toItems(p.attrs, ATTRIBUTES[cat], 5) })) },
      {
        title: "Abilities",
        columns: Object.keys(ABILITIES).map((cat) => ({
          title: `${cat} (${p.abilPriority[cat]})`,
          items: [...toItems(p.abil, ABILITIES[cat], 5), ...Object.entries((p.extraAbil || {})[cat] || {}).map(([n, v]) => [n, v, 5])],
          allowCustom: true,
          addLabel: `Add ${cat.replace(/s$/, "").toLowerCase()}`,
          customPrompt: `Name of the new ${cat.replace(/s$/, "").toLowerCase()}:`,
        })),
      },
      {
        title: "Advantages",
        columns: [
          { title: "Backgrounds", items: p.bgList.filter((n) => p.bg[n] > 0).map((n) => [n, p.bg[n], 5]), removable: true, addOptions: p.bgList, allowCustom: true, addLabel: "Add background", customPrompt: "Name of the background:" },
          { title: "Gifts", list: p.gifts.sort((x, y) => x.level - y.level).map(giftLabel), listOptions: p.giftOptions, allowCustom: true, addLabel: "Add Gift", customPrompt: "Gift name, and its source and level if you like:" },
          { title: `Renown — Rank ${p.rank}`, items: toItems(p.renown, Object.keys(p.renown), 10) },
        ],
      },
    ];
    if (p.extraColumns) sections.push(...p.extraColumns);
    sections.push(
      {
        title: "Merits & Flaws",
        columns: [
          { title: "Merits", list: p.merits.map(mfLabel), listOptions: groupByCost(p.mfData.merits, p.mfOwn), allowCustom: true, addLabel: "Add Merit", customPrompt: "Merit name and cost, e.g. Iron Will (5 pts):" },
          { title: "Flaws", list: p.flaws.map(mfLabel), listOptions: groupByCost(p.mfData.flaws, p.mfOwn), allowCustom: true, addLabel: "Add Flaw", customPrompt: "Flaw name and value, e.g. Phobia (1 pt):" },
        ],
      },
      {
        title: Object.keys(p.adv).join(", ").replace(/, ([^,]*)$/, " & $1"),
        columns: Object.keys(p.adv).map((k) => ({ title: k, items: [["Permanent", p.adv[k], 10]], boxes: 10 })),
      }
    );

    // What a player-built character starts from (see blank() and budget() below).
    const b = p.build || {};
    const build = {
      rank: p.rank,
      avoid: b.avoid || [],
      noBg: b.noBg || [],
      bgStart: b.bgStart || {},
      bgFree: 5 - Object.values(b.bgMin || {}).reduce((s, x) => s + x, 0),
      freeAbil: b.freeAbil || {},
      keepGifts: b.keepGifts || [],
      giftHint: b.giftHint || "",
      maxAppearance: b.maxAppearance || 0,
      ownSources: p.giftOptions.filter((g) => g.own).map((g) => g.source),
    };

    return {
      game: p.game,
      name: p.name,
      header: p.header,
      sections,
      table: { title: "Forms", columns: p.formColumns, rows: p.formRows },
      health: HEALTH,
      extras: p.extras || [],
      freebies: { total: freebieText, spent: p.spent },
      notes,
      sources: [...used].map((k) => `${k} = ${p.books[k] || k}`),
      build,
    };
  }

  // ---------------------------------------------------------------------------
  // Player characters, for any game. A game makes a character with 0 freebies and
  // no Merits or Flaws; blank() then clears the random choices so the player picks
  // everything, and budget() counts what they have spent against the creation rules.
  // c.build is plain data (it is saved with the character):
  //   costs       freebie cost of each kind (Attribute, Ability, Background, Gift, Rage, Discipline...)
  //   advKinds    single-rating columns with a starting value (Rage, Gnosis, Willpower / Humanity...)
  //   adv         those starting values
  //   pools       extra point pools: [{ title, column, kind, size, startAll, start: {name: n}, fillCap, hint }]
  //   attrStart   Attributes that don't start at 1;  attrMax  Attributes with a lower limit
  //   avoid, noBg, bgStart, bgFree, freeAbil, rank, and for Gifts: keepGifts, giftAllowance, giftHint, ownSources
  //   costText, xpText   explanations shown to the player
  const DEFAULT_ADV = ["Rage", "Gnosis", "Willpower"];
  const DEFAULT_COST_TEXT = "Costs: Attribute 5 · Ability 2 · Background 1 · Gift 7 · Rage 1 · Gnosis 2 · Willpower 1 · Merits cost their points · Flaws give up to 7.";
  const secBy = (c, title) => c.sections.find((s) => s.title === title);
  const colBy = (c, title) => c.sections.flatMap((s) => s.columns).find((col) => col.title === title);
  const advKinds = (c) => c.build.advKinds || DEFAULT_ADV;
  const advCols = (c) => c.sections.flatMap((s) => s.columns).filter((col) => advKinds(c).includes(col.title) && col.items);
  const costsOf = (c) => c.build.costs || COSTS;
  const attrStart = (b, n) => (b.attrStart || {})[n] ?? 1;
  const attrMax = (b, n) => (b.attrMax || {})[n] ?? (n === "Appearance" && b.maxAppearance ? b.maxAppearance : 5);
  const poolStart = (p, n) => (p.start || {})[n] ?? p.startAll ?? 0;
  const costOf = (label) => Number((String(label).match(/\((\d+) pts?\b/) || [0, 0])[1]);
  const giftLevel = (label) => Number((String(label).match(/, L(\d)/) || [0, 1])[1]);
  const giftSource = (label) => (String(label).match(/\(([^,()]+), L\d/) || [0, ""])[1];

  function blank(c, freebies) {
    const b = c.build;
    c.mode = "pc";
    c.stage = "build";
    b.freebies = freebies;
    b.adv = Object.fromEntries(advCols(c).map((col) => [col.title, col.items[0][1]]));
    for (const col of secBy(c, "Attributes").columns) col.items.forEach((it) => (it[1] = attrStart(b, it[0])));
    for (const col of secBy(c, "Abilities").columns) col.items.forEach((it) => (it[1] = b.freeAbil[it[0]] || 0));
    colBy(c, "Backgrounds").items = Object.entries(b.bgStart).filter(([, v]) => v > 0).map(([n, v]) => [n, v, 5]);
    for (const p of b.pools || []) colBy(c, p.column).items.forEach((it) => (it[1] = poolStart(p, it[0])));
    const gifts = colBy(c, "Gifts");
    if (gifts) {
      const kept = gifts.list.filter((l) => b.keepGifts.some((n) => l.startsWith(n + " (")));
      b.giftAllowance = gifts.list.length - kept.length;
      gifts.list = kept;
    }
    colBy(c, "Merits").list = [];
    colBy(c, "Flaws").list = [];
    for (const h of c.header) {
      if (["Name", "Concept"].includes(h[0])) h[1] = "";
      if (["Nature", "Demeanor"].includes(h[0])) { h[1] = ""; h[2] = ARCHETYPES; }
    }
    c.name = "";
    c.freebies = null;
    c.notes = c.notes.filter((n) => !n.includes("left over"));
    c.sources = [];
    c.edited = false;
    return c;
  }

  // Match the categories to the priority pools: the most-spent category gets the biggest pool.
  function fitPools(spent, pools) {
    const order = spent.map((s, i) => i).sort((x, y) => spent[y] - spent[x] || x - y);
    const pool = [];
    order.forEach((ci, rank) => (pool[ci] = { size: pools[rank], priority: PRIORITY[rank] }));
    const over = spent.reduce((s, x, i) => s + Math.max(0, x - pool[i].size), 0);
    return { pool, over };
  }

  // Counts points against the creation rules. Returns rows for the points box and
  // updates the Primary/Secondary/Tertiary labels to match how points were spent.
  function budget(c) {
    const b = c.build;
    const C = costsOf(c);
    const rows = [];
    const warnings = [];
    const freebieUse = [];
    const charge = (what, dots, each) => dots > 0 && freebieUse.push({ what: `${what} +${dots}`, cost: dots * each });
    const relabel = (col, pr) => (col.title = `${col.title.split(" (")[0]} (${pr})`);

    // Attributes: 7/5/3 dots above their starting value (normally 1).
    const aCols = secBy(c, "Attributes").columns;
    const aSpent = aCols.map((col) => col.items.reduce((s, [n, v]) => s + Math.max(0, v - attrStart(b, n)), 0));
    const aFit = fitPools(aSpent, [7, 5, 3]);
    aCols.forEach((col, i) => relabel(col, aFit.pool[i].priority));
    rows.push({ title: "Attributes", parts: aCols.map((col, i) => ({ name: col.title.split(" (")[0], have: aSpent[i], of: aFit.pool[i].size })) });
    charge("Attributes", aFit.over, C.Attribute);
    for (const [n, v] of aCols.flatMap((col) => col.items)) if (v > attrMax(b, n)) warnings.push(`${n} can't start above ${attrMax(b, n)} for this character.`);

    // Abilities: 13/9/5, no higher than 3 before freebies.
    const abCols = secBy(c, "Abilities").columns;
    let above3 = 0;
    const abSpent = abCols.map((col) =>
      col.items.reduce((s, [n, v]) => {
        const start = b.freeAbil[n] || 0;
        const cap = Math.max(3, start);
        above3 += Math.max(0, v - cap);
        if (v > start && b.avoid.includes(n)) warnings.push(`${n}: this character can't start with it.`);
        return s + Math.max(0, Math.min(v, cap) - start);
      }, 0)
    );
    const abFit = fitPools(abSpent, [13, 9, 5]);
    abCols.forEach((col, i) => relabel(col, abFit.pool[i].priority));
    rows.push({ title: "Abilities", parts: abCols.map((col, i) => ({ name: col.title.split(" (")[0], have: abSpent[i], of: abFit.pool[i].size })) });
    charge("Abilities", abFit.over + above3, C.Ability);
    if (above3) warnings.push(`Abilities above 3 are paid with freebie points (${above3} dot${above3 === 1 ? "" : "s"}).`);

    // Backgrounds: 5 dots (some groups start with extra dots already filled in).
    const bgItems = colBy(c, "Backgrounds").items;
    const bgSpent = bgItems.reduce((s, [n, v]) => s + Math.max(0, v - (b.bgStart[n] || 0)), 0);
    rows.push({ title: "Backgrounds", parts: [{ name: "Dots", have: bgSpent, of: b.bgFree }] });
    charge("Backgrounds", Math.max(0, bgSpent - b.bgFree), C.Background);
    for (const [n, v] of bgItems) if (v > 0 && b.noBg.includes(n)) warnings.push(`${n}: not allowed for this character.`);
    for (const [n, v] of Object.entries(b.bgStart)) if ((bgItems.find((it) => it[0] === n) || [0, 0])[1] < v) warnings.push(`${n} should be at least ${v}.`);

    // Other pools (Disciplines, Virtues...).
    for (const p of b.pools || []) {
      const items = colBy(c, p.column).items;
      const spent = items.reduce((s, [n, v]) => s + Math.max(0, v - poolStart(p, n)), 0);
      rows.push({ title: p.title, parts: [{ name: "Dots", have: Math.min(spent, p.size), of: p.size }], hint: p.hint });
      charge(p.title, Math.max(0, spent - p.size), C[p.kind]);
      for (const [n, v] of items) if (v < poolStart(p, n)) warnings.push(`${n} starts at ${poolStart(p, n)}; it can't go lower.`);
    }

    // Gifts.
    const gCol = colBy(c, "Gifts");
    if (gCol) {
      const gifts = gCol.list;
      const chosen = gifts.length - b.keepGifts.length;
      rows.push({ title: "Gifts", parts: [{ name: "Chosen", have: Math.min(chosen, b.giftAllowance), of: b.giftAllowance }], hint: b.giftHint });
      if (chosen > b.giftAllowance) freebieUse.push({ what: `Extra Gifts ×${chosen - b.giftAllowance}`, cost: (chosen - b.giftAllowance) * C.Gift });
      for (const g of gifts) {
        if (giftLevel(g) > b.rank) warnings.push(`${g.split(" (")[0]} is Level ${giftLevel(g)}, above Rank ${b.rank}.`);
        const src = giftSource(g);
        if (src && b.ownSources.length && !b.ownSources.includes(src)) warnings.push(`${g.split(" (")[0]} comes from ${src}, not one of this character's own Gift lists.`);
      }
    }

    // Rage / Gnosis / Willpower / Humanity above their starting values.
    for (const col of advCols(c)) {
      const k = col.title;
      const v = col.items[0][1];
      const base = b.adv[k] ?? v;
      if (v > base) charge(k, v - base, C[k]);
      if (v < base) warnings.push(`${k} starts at ${base}; it can't go lower at creation.`);
    }

    // Merits cost freebies; Flaws give up to 7 back.
    const meritPts = colBy(c, "Merits").list.reduce((s, x) => s + costOf(x), 0);
    const flawPts = colBy(c, "Flaws").list.reduce((s, x) => s + costOf(x), 0);
    if (meritPts) freebieUse.push({ what: "Merits", cost: meritPts });
    const flawBonus = Math.min(7, flawPts);
    if (flawPts > 7) warnings.push(`Flaws give at most 7 freebie points (yours add up to ${flawPts}).`);

    const total = b.freebies + flawBonus;
    const used = freebieUse.reduce((s, x) => s + x.cost, 0);
    b.result = { rows, warnings, freebieUse, total, used, flawBonus, costText: b.costText || DEFAULT_COST_TEXT };
    return b.result;
  }

  // "Fill the rest randomly": spends whatever creation points are left (not freebies).
  function fillRest(c) {
    const b = c.build;
    const res = budget(c);
    const row = (title) => res.rows.find((r) => r.title === title);
    const spread = (items, points, cap, ok, startOf) => {
      for (let p = 0; p < points; p++) {
        const open = items.filter((it) => it[1] < cap && ok(it[0], it[1]));
        if (!open.length) return;
        const owned = open.filter((it) => it[1] > startOf(it[0]));
        R.pick(owned.length && R.chance(0.6) ? owned : open)[1]++;
      }
    };
    secBy(c, "Attributes").columns.forEach((col, i) => {
      const part = row("Attributes").parts[i];
      spread(col.items, part.of - part.have, 5, (n, v) => v < attrMax(b, n), (n) => attrStart(b, n));
    });
    secBy(c, "Abilities").columns.forEach((col, i) => {
      const part = row("Abilities").parts[i];
      spread(col.items, part.of - part.have, 3, (n) => !b.avoid.includes(n), (n) => b.freeAbil[n] || 0);
    });
    const bgCol = colBy(c, "Backgrounds");
    const bgPart = row("Backgrounds").parts[0];
    for (let p = 0; p < bgPart.of - bgPart.have; p++) {
      const owned = bgCol.items.filter((it) => it[1] < 5);
      if (owned.length && R.chance(0.6)) { R.pick(owned)[1]++; continue; }
      const n = R.pick(bgCol.addOptions.filter((x) => !b.noBg.includes(x) && !bgCol.items.some((it) => it[0] === x && it[1] >= 5)));
      if (!n) break;
      const it = bgCol.items.find((x) => x[0] === n);
      if (it) it[1]++;
      else bgCol.items.push([n, 1, 5]);
    }
    for (const p of b.pools || []) {
      const part = row(p.title).parts[0];
      spread(colBy(c, p.column).items, part.of - part.have, p.fillCap || 5, () => true, (n) => poolStart(p, n));
    }
    // Gifts: one Level 1 from each own list that has none yet, then one per Rank level.
    const gCol = colBy(c, "Gifts");
    if (gCol) {
      const own = gCol.listOptions.filter((g) => g.own);
      const has = (o) => gCol.list.some((x) => x.split(" (")[0] === o.split(" (")[0]);
      const free = (level, src) => own.filter((g) => !src || g.source === src).flatMap((g) => g.options).filter((o) => giftLevel(o) === level && !has(o));
      const need = () => b.giftAllowance - (gCol.list.length - b.keepGifts.length);
      for (let lvl = 2; lvl <= b.rank && need() > 0; lvl++) {
        if (!gCol.list.some((g) => giftLevel(g) === lvl)) { const o = R.pick(free(lvl)); if (o) gCol.list.push(o); }
      }
      for (const src of b.ownSources) {
        if (need() > 0 && !gCol.list.some((g) => giftSource(g) === src)) { const o = R.pick(free(1, src)); if (o) gCol.list.push(o); }
      }
      while (need() > 0) { const o = R.pick(free(1)); if (!o) break; gCol.list.push(o); }
      gCol.list.sort((x, y) => giftLevel(x) - giftLevel(y));
    }
  }

  // ---- Experience. Each step is priced at the rating it starts from ("current rating").
  // Werewolf Revised chart (the Changing Breeds use it too) plus the Vampire kinds.
  const XP_STEP = {
    Attribute: (v) => v * 4,
    Ability: (v) => (v === 0 ? 3 : v * 2),
    Background: (v) => (v === 0 ? 3 : v * 3), // Storyteller's call; not on the Revised charts
    Rage: (v) => v,
    Gnosis: (v) => v * 2,
    Willpower: (v) => v,
    // Vampire: new Discipline 10; then clan × 5, Caitiff × 6, other × 7.
    Discipline: (v, ctx) => (v === 0 ? 10 : v * (ctx.c.build.caitiff ? 6 : (ctx.c.build.clanDisciplines || []).includes(ctx.name) ? 5 : 7)),
    Virtue: (v) => v * 2,
    Humanity: (v) => v * 2,
  };

  function traitKind(c, si, ci) {
    const s = c.sections[si];
    const col = s.columns[ci];
    if (s.title === "Attributes") return "Attribute";
    if (s.title === "Abilities") return "Ability";
    if (col.title === "Backgrounds") return "Background";
    const pool = ((c.build && c.build.pools) || []).find((p) => p.column === col.title);
    if (pool) return pool.kind;
    if (c.build && advKinds(c).includes(col.title)) return col.title;
    if (!c.build && DEFAULT_ADV.includes(col.title)) return col.title;
    return null; // Renown and the like change through play, not experience
  }

  // Cost of moving a rating from `from` to `to` (negative = refund). Steps below the
  // rating the character had when experience tracking began are free.
  function xpForChange(kind, from, to, floor, ctx = {}) {
    const step = XP_STEP[kind];
    if (!step) return 0;
    let cost = 0;
    for (let v = Math.max(from, floor); v < to; v++) cost += step(v, ctx);
    for (let v = Math.max(to, floor); v < from; v++) cost -= step(v, ctx);
    return cost;
  }
  const giftXp = (label, own) => giftLevel(label) * (own ? 3 : 5);

  // ---------------------------------------------------------------------------
  // Data-driven game for the smaller Changing Breeds. cfg fields:
  //   id, label, game, books, general (gift set), startGifts: ["breed","groupA","groupB","general"]
  //   breeds: { Name: { gnosis: n | {Female, Male}, start: [L1 names], gifts: set, avoid: [], noBg: [], free: {Ability: n}, note } }
  //   groupA / groupB: { label, choices: { Name: { rage, willpower, start, gifts, giftsBy: {Female, Male, Metis}, note, bgMin } } }
  //   rage / willpower: number | "breed" | "groupA" | null (no Rage);  gender: true adds a Gender option
  //   renownNames, renownTotals (or null), rankTitles, backgrounds, bgMin, forms(sel) -> [...], formColumns
  //   mfForbidden: Garou Merits/Flaws that don't fit;  names: { first, last, animal };  concepts, animalConcepts
  function mergeSets(...sets) {
    const core = {};
    for (const s of sets) for (const [lvl, names] of Object.entries((s && s.core) || {})) core[lvl] = [...new Set([...(core[lvl] || []), ...names])];
    return { core, extra: {} };
  }
  const valueFor = (v, sel) => (v && typeof v === "object" ? v[sel.breedIsMetis && "Metis" in v ? "Metis" : sel.gender] ?? v.Female : v);

  function simpleGame(cfg) {
    const physSocFor = cfg.formColumns || ["Strength", "Dexterity", "Stamina", "Manipulation", "Appearance"];
    // Make sure every named starting Gift exists in its Level 1 list.
    const addStart = (entry) => {
      if (!entry || !entry.start || !entry.gifts) return;
      const l1 = (entry.gifts.core[1] = entry.gifts.core[1] || []);
      for (const n of entry.start) if (!l1.includes(n)) l1.push(n);
    };
    Object.values(cfg.breeds).forEach(addStart);
    for (const grp of [cfg.groupA, cfg.groupB]) if (grp) Object.values(grp.choices).forEach(addStart);

    function generate(opts) {
      const rank = Math.min(5, Math.max(1, Number(opts.rank) || 1));
      const freebieTotal = Number.isFinite(opts.freebies) ? opts.freebies : 15;
      const breed = opts.breed || R.pick(Object.keys(cfg.breeds));
      const b = cfg.breeds[breed];
      const gender = pickGender(opts);
      const sel = { breed, gender, breedIsMetis: breed === "Metis" };
      const aName = cfg.groupA ? opts.groupA || R.pick(Object.keys(cfg.groupA.choices)) : null;
      const bName = cfg.groupB ? opts.groupB || R.pick(Object.keys(cfg.groupB.choices)) : null;
      const a = aName ? cfg.groupA.choices[aName] : {};
      const g2 = bName ? cfg.groupB.choices[bName] : {};
      const notes = [b.note, a.note, g2.note, cfg.note].filter(Boolean);

      const { attrs, priority: attrPriority } = attributes();
      const { abil, priority: abilPriority, ok: abilityOk } = abilities(b.avoid || []);
      for (const [n, v] of Object.entries({ ...(cfg.free || {}), ...(b.free || {}) })) abil[n] = Math.min(5, (abil[n] || 0) + v);
      const bgMin = { ...(cfg.bgMin || {}), ...(a.bgMin || {}) };
      const { bg, allowed: bgAllowed } = backgrounds(cfg.backgrounds, [...(b.noBg || []), ...(a.noBg || [])], bgMin);
      // Some groups get Background dots on top of the normal 5 (e.g. Knife-Skulkers' Contacts).
      for (const [n, v] of Object.entries(a.bgBonus || {})) bg[n] = Math.min(5, (bg[n] || 0) + v);
      if (b.maxAppearance && attrs.Appearance > b.maxAppearance) {
        notes.push(`${breed} start with Appearance ${b.maxAppearance} at most (lowered from ${attrs.Appearance}).`);
        attrs.Appearance = b.maxAppearance;
      }

      const aGifts = a.giftsBy ? (sel.breedIsMetis ? mergeSets(a.giftsBy.Female, a.giftsBy.Male) : a.giftsBy[gender]) : a.gifts;
      const sources = { breed: [b.gifts, breed], groupA: [aGifts, aName], groupB: [g2.gifts, bName], general: [cfg.general, "General"], extra: cfg.extraSource || [null, null] };
      const used = Object.values(sources).filter(([set, name]) => set && name);
      const picker = giftPicker(used, false);
      for (const key of cfg.startGifts) {
        const [set, name] = sources[key];
        if (!set) continue;
        const start = key === "breed" ? b.start : key === "groupA" ? (a.startBy ? a.startBy[sel.breedIsMetis ? "Metis" : gender] : a.start) : key === "groupB" ? g2.start : null;
        const pool = picker.available(1).filter((g) => g.source === name && (!start || start.includes(g.name)));
        const pick = R.pick(pool.length ? pool : picker.available(1).filter((g) => g.source === name));
        if (pick) picker.gifts.push(pick);
      }
      for (const n of a.freeGifts || []) if (!picker.gifts.some((g) => g.name === n)) picker.gifts.push({ name: n, level: 1, book: "Core", source: aName });
      for (let lvl = 2; lvl <= rank; lvl++) picker.take(lvl, null);

      const pickVal = (rule) => (rule === "breed" ? valueFor(b.gnosisFor || b.rage, sel) : rule === "groupA" ? valueFor(a.rage, sel) : rule);
      const adv = {};
      if (cfg.rage !== null) adv.Rage = cfg.rage === "groupA" ? valueFor(a.rage, sel) : typeof cfg.rage === "number" ? cfg.rage : pickVal(cfg.rage);
      adv.Gnosis = typeof cfg.gnosis === "number" ? cfg.gnosis : valueFor(b.gnosis, sel);
      adv.Willpower = cfg.willpower === "groupA" ? a.willpower : cfg.willpower === "breed" ? b.willpower : cfg.willpower;

      const renown = cfg.renownNames ? renownFn(cfg.renownNames, cfg.renownTotals[rank - 1]) : {};
      if (!cfg.renownNames) notes.push(cfg.renownNote || "This race has no Renown categories.");
      else if (cfg.renownAssumed) notes.push(`Renown needed per Rank isn't given in the book; this uses Garou-style totals (${cfg.renownTotals.join("/")}) in any mix.`);

      const W = window.WEREWOLF_DATA;
      const mfData = { merits: W.merits.filter((x) => !x[3] && !(cfg.mfForbidden || []).includes(x[0])), flaws: W.flaws.filter((x) => !x[3] && !(cfg.mfForbidden || []).includes(x[0])) };
      const rollable = (mf) => !W.randomSkip.includes(mf[0]) && !(b.avoid && W.lupusSkip.includes(mf[0]));
      const mf = meritsFlaws(mfData, freebieTotal, rollable, opts.meritsFlaws !== "No");
      const fr = spendFreebies({ attrs, abil, abilityOk, bg, bgAllowed, adv, picker }, mf.freebies);

      const names = cfg.names;
      const animalBorn = !!b.animal;
      const name = animalBorn ? R.pick(names.animal) : `${firstName(names, gender)} ${R.pick(names.last)}`;
      const header = [["Name", name], ["Player", ""], ["Chronicle", ""], ["Breed", breed]];
      header.push(["Gender", cfg.gender && sel.breedIsMetis ? `${gender} (metis)` : gender]);
      if (aName) header.push([cfg.groupA.label, a.title ? `${aName} (${a.title})` : aName]);
      if (bName) header.push([cfg.groupB.label, bName]);
      header.push(["Nature", R.pick(ARCHETYPES)], ["Demeanor", R.pick(ARCHETYPES)], ["Concept", animalBorn ? R.pick(cfg.animalConcepts) : R.pick(cfg.concepts)]);
      header.push(["Rank", `${rank}${cfg.rankTitles ? ` (${cfg.rankTitles[rank - 1]})` : ""}`]);
      while (header.length % 3) header.push([cfg.extraHeader ? cfg.extraHeader[header.length % cfg.extraHeader.length] : "Notes", ""]);

      const extras = [];
      for (const perk of [a.perk, g2.perk, b.perk].filter(Boolean)) extras.push({ title: perk[0], text: perk[1] });
      if (b.deformity) extras.push({ title: "Metis Deformity", text: R.pick(cfg.deformities || ["Hunchback", "Lame leg", "Missing fingers", "Strange odor", "Twisted limb", "Withered arm"]) });

      const own = used.map(([set, nm]) => [nm === "General" ? "General" : `${nm}`, nm, set]);
      const others = [];
      for (const [label, list] of [["breed", cfg.breeds], [cfg.groupA && cfg.groupA.label.toLowerCase(), cfg.groupA && cfg.groupA.choices], [cfg.groupB && cfg.groupB.label.toLowerCase(), cfg.groupB && cfg.groupB.choices]]) {
        if (!list) continue;
        for (const [n, v] of Object.entries(list)) {
          const set = v.giftsBy ? mergeSets(v.giftsBy.Female, v.giftsBy.Male) : v.gifts;
          if (set && !used.some(([, nm]) => nm === n)) others.push([`${n} (other ${label})`, n, set]);
        }
      }

      const c = sheet({
        game: cfg.game, name, header,
        attrs, attrPriority, abil, abilPriority, extraAbil: b.extraAbil,
        bg, bgList: cfg.backgrounds,
        gifts: picker.gifts, giftOptions: giftOptions(own, others),
        rank, renown,
        merits: mf.merits, flaws: mf.flaws, mfData, mfOwn: "",
        adv,
        formColumns: ["Form", ...physSocFor, ...(cfg.formDiff ? ["Diff."] : [])],
        formRows: formRows(cfg.forms(sel), attrs, physSocFor),
        extras, notes,
        freebieTotal, spent: fr.spent, leftover: fr.left,
        books: cfg.books,
        build: {
          avoid: b.avoid, noBg: [...(b.noBg || []), ...(a.noBg || [])],
          bgMin, bgStart: Object.fromEntries(Object.keys({ ...bgMin, ...(a.bgBonus || {}) }).map((n) => [n, (bgMin[n] || 0) + ((a.bgBonus || {})[n] || 0)])),
          freeAbil: { ...(cfg.free || {}), ...(b.free || {}) },
          keepGifts: a.freeGifts, maxAppearance: b.maxAppearance,
          giftHint: startHint(cfg, b, a, g2, breed, aName, bName, gender, sel) + (rank > 1 ? ` Plus one Gift of each Level from 2 to ${rank}.` : ""),
        },
      });
      c.selection = sel;
      c.choices = { breed, gender, groupA: aName, groupB: bName, rank };
      c.choiceFields = { breed: "Breed", gender: "Gender", rank: "Rank" };
      if (aName) c.choiceFields.groupA = cfg.groupA.label;
      if (bName) c.choiceFields.groupB = cfg.groupB.label;
      c.freeAbilityDots = Object.values({ ...(cfg.free || {}), ...(b.free || {}) }).reduce((s, x) => s + x, 0);
      return c;
    }

    const options = [{ id: "breed", label: "Breed", choices: Object.keys(cfg.breeds) }];
    options.push({ id: "gender", label: "Gender", choices: ["Female", "Male"] });
    if (cfg.groupA) options.push({ id: "groupA", label: cfg.groupA.label, choices: Object.keys(cfg.groupA.choices) });
    if (cfg.groupB) options.push({ id: "groupB", label: cfg.groupB.label, choices: Object.keys(cfg.groupB.choices) });
    options.push(
      { id: "rank", label: "Rank", choices: [1, 2, 3, 4, 5], default: 1, random: false },
      { id: "freebies", label: "Freebie points", type: "number", min: 0, max: 500, default: 15 },
      { id: "meritsFlaws", label: "Merits & Flaws", choices: ["Random", "No"], default: "Random", random: false }
    );
    WOD.registerGame({
      id: cfg.id,
      label: cfg.label,
      options,
      generate,
      recompute(c) {
        c.table.rows = formRows(cfg.forms(c.selection || {}), attrsFromSheet(c), physSocFor);
      },
      cfg,
    });
  }
  const renownFn = (names, need) => renown(names, need);

  // "Starting Gifts: one Level 1 Gift each from ..." for the points box.
  function startHint(cfg, b, a, g2, breed, aName, bName, gender, sel) {
    const where = { breed: breed, groupA: aName, groupB: bName, general: cfg.general ? "General" : null, extra: (cfg.extraSource || [])[1] };
    const lists = { breed: b.start, groupA: a.startBy ? a.startBy[sel.breedIsMetis ? "Metis" : gender] : a.start, groupB: g2.start };
    const parts = cfg.startGifts.filter((k) => where[k]).map((k) => (lists[k] ? `${where[k]} (${lists[k].join(", ")})` : where[k]));
    let text = `One Level 1 Gift from each: ${parts.join("; ")}.`;
    if (new Set(cfg.startGifts).size < cfg.startGifts.length) text = `${cfg.startGifts.length} Level 1 Gifts from: ${[...new Set(parts)].join("; ")}.`;
    if ((a.freeGifts || []).length) text += ` ${a.freeGifts.join(", ")} comes free.`;
    return text;
  }

  return { blank, budget, fillRest, fitPools, traitKind, xpForChange, giftXp, giftLevel, giftSource, costOf, XP_STEP, pickGender, firstName, simpleGame, mergeSets, ATTRIBUTES, ABILITIES, ARCHETYPES, HEALTH, COSTS, pts, G, giftEntries, giftLabel, mfLabel, giftPicker, giftOptions, attributes, abilities, backgrounds, renown, meritsFlaws, spendFreebies, formRows, attrsFromSheet, groupByCost, sheet };
})();
