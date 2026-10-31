/*
  Shared code for the World of Darkness character generator.
  Each game lives in games/<name>.js and registers itself with WOD.registerGame().

  A character is one plain object (header, sections, table, ...). The sheet is
  drawn from that object, and every edit on the sheet changes the object and
  redraws, so what you see is always what gets printed or saved.

  Two kinds of sheet:
    NPC (c.mode "npc")     random character, edit freely.
    Player (c.mode "pc")   c.stage "build": the player spends creation points, shown in a points box;
                           c.stage "play":  raising a dot spends experience points (c.xp).
  Any NPC can also start tracking experience.
*/
window.WOD = (function () {
  const games = [];
  const SAVE_KEY = "wod-character-generator:last";

  const random = {
    int(min, max) {
      return min + Math.floor(Math.random() * (max - min + 1));
    },
    pick(list) {
      return list.length ? list[Math.floor(Math.random() * list.length)] : undefined;
    },
    chance(p) {
      return Math.random() < p;
    },
    shuffle(list) {
      const a = list.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    },
    // weights: { name: weight }
    weighted(weights) {
      const entries = Object.entries(weights).filter(([, w]) => w > 0);
      let roll = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
      for (const [k, w] of entries) {
        roll -= w;
        if (roll < 0) return k;
      }
      return entries[entries.length - 1][0];
    },
    // Add `points` dots one at a time to random keys, never going above `max`.
    distribute(obj, keys, points, max) {
      for (let p = 0; p < points; p++) {
        const open = keys.filter((k) => (obj[k] || 0) < max);
        if (!open.length) return points - p; // dots that couldn't be placed
        const k = random.pick(open);
        obj[k] = (obj[k] || 0) + 1;
      }
      return 0;
    },
  };

  function registerGame(game) {
    games.push(game);
  }

  // ---------- experience ----------

  const xpTotals = (c) => {
    const log = (c.xp && c.xp.log) || [];
    const earned = log.filter((e) => e.type === "earn").reduce((s, e) => s + e.xp, 0);
    const spent = log.filter((e) => e.type === "spend").reduce((s, e) => s + e.xp, 0);
    return { earned, spent, left: earned - spent };
  };
  const traitKey = (s, col, name) => `${s.title}|${col.title.split(" (")[0]}|${name}`;

  // Remember every rating as it is now; experience is only charged above these.
  function startXp(c) {
    c.stage = "play";
    c.xp = c.xp || { log: [] };
    c.xpBase = { gifts: [] };
    for (const s of c.sections) {
      for (const col of s.columns) {
        if (col.items) for (const [n, v] of col.items) c.xpBase[traitKey(s, col, n)] = v;
        if (col.title === "Gifts") c.xpBase.gifts = col.list.slice();
      }
    }
  }

  // ---------- rendering ----------

  function esc(s) {
    return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  function dots(value, max, path) {
    let out = "";
    for (let i = 1; i <= max; i++) {
      out += `<span class="dot${i <= value ? " on" : ""}" data-dot="${path}.${i}" title="Set to ${i}"></span>`;
    }
    return `<span class="dots" aria-label="${value} of ${max}">${out}</span>`;
  }

  function boxes(n) {
    return `<span class="boxes">${'<span class="box"></span>'.repeat(n)}</span>`;
  }

  function addSelect(path, groups, allowCustom, label) {
    let html = `<select class="add no-print" data-add="${path}"><option value="">+ ${esc(label)}&hellip;</option>`;
    for (const g of groups) {
      if (!g.options.length) continue;
      if (g.group) html += `<optgroup label="${esc(g.group)}">`;
      html += g.options.map((o) => `<option value="${esc(o)}">${esc(o)}</option>`).join("");
      if (g.group) html += `</optgroup>`;
    }
    if (allowCustom) html += `<option value="__custom">Type my own&hellip;</option>`;
    return html + `</select>`;
  }

  function renderColumn(col, si, ci) {
    const path = `${si}.${ci}`;
    let html = `<div class="col"><h3>${esc(col.title)}</h3>`;
    if (col.items) {
      if (!col.items.length) html += `<p class="empty">None</p>`;
      col.items.forEach(([name, value, max], ii) => {
        const remove = col.removable ? `<button class="remove no-print" data-remove="${path}.${ii}" title="Remove">&times;</button>` : "";
        html += `<div class="trait${value ? "" : " zero"}"><span class="trait-name">${remove}${esc(name)}</span>${dots(value, max, `${path}.${ii}`)}</div>`;
      });
      const have = col.items.map((x) => x[0]);
      const options = (col.addOptions || []).filter((o) => !have.includes(o));
      if (options.length || col.allowCustom) html += addSelect(path, [{ options }], col.allowCustom, col.addLabel || "Add");
    }
    if (col.boxes) html += `<div class="trait"><span class="trait-name">Current</span>${boxes(col.boxes)}</div>`;
    if (col.text) html += `<p class="col-text">${esc(col.text)}</p>`;
    if (col.list) {
      html += col.list.length
        ? `<ul>${col.list.map((x, ii) => `<li><button class="remove no-print" data-remove="${path}.${ii}" title="Remove">&times;</button>${esc(x)}</li>`).join("")}</ul>`
        : `<p class="empty">None</p>`;
      if (col.listOptions || col.allowCustom) {
        const groups = (col.listOptions || []).map((g) => ({ group: g.group, options: g.options.filter((o) => !col.list.includes(o)) }));
        html += addSelect(path, groups, col.allowCustom, col.addLabel || "Add");
      }
    }
    return html + "</div>";
  }

  // The points box shown while a player builds a character.
  function renderBudget(c) {
    const r = c.build.result;
    const chip = (name, have, of) => {
      const cls = have === of ? "ok" : have < of ? "left" : "over";
      const tail = have === of ? " ✓" : have < of ? ` — ${of - have} left` : ` — ${have - of} extra (freebies)`;
      return `<span class="chip ${cls}">${esc(name)} ${have}/${of}${tail}</span>`;
    };
    let html = `<div class="budget no-print"><h2>Character Creation Points</h2>`;
    for (const row of r.rows) {
      html += `<div class="brow"><strong>${esc(row.title)}</strong> ${row.parts.map((p) => chip(row.parts.length > 1 ? p.name : "", p.have, p.of)).join(" ")}`;
      if (row.hint) html += `<div class="bhint">${esc(row.hint)}</div>`;
      html += `</div>`;
    }
    const left = r.total - r.used;
    const cls = left === 0 ? "ok" : left > 0 ? "left" : "over";
    html += `<div class="brow"><strong>Freebie points</strong> <span class="chip ${cls}">${r.used} of ${r.total} used${left > 0 ? ` — ${left} left` : left < 0 ? ` — ${-left} too many` : " ✓"}</span>`;
    if (r.flawBonus) html += ` <span class="bhint">(includes ${r.flawBonus} from Flaws)</span>`;
    html += `<div class="bhint">${esc(r.costText)}</div>`;
    if (r.freebieUse.length) html += `<div class="bhint">Spent on: ${esc(r.freebieUse.map((x) => `${x.what} (${x.cost})`).join(", "))}</div>`;
    html += `</div>`;
    if (r.warnings.length) html += `<ul class="warnings">${r.warnings.map((w) => `<li>${esc(w)}</li>`).join("")}</ul>`;
    html += `<div class="bbuttons"><button data-action="fill">Fill the rest randomly</button> <button data-action="finish" class="primary">Finish character</button></div>`;
    return html + `</div>`;
  }

  function renderXp(c) {
    const t = xpTotals(c);
    let html = `<section class="xp"><h2>Experience</h2>`;
    html += `<p class="xp-totals"><strong>Earned:</strong> ${t.earned} &nbsp; <strong>Spent:</strong> ${t.spent} &nbsp; <strong>Unspent:</strong> <span class="${t.left < 0 ? "warn" : ""}">${t.left}</span></p>`;
    html += `<div class="xp-add no-print">
      <input type="number" id="xp-amount" min="1" max="999" placeholder="XP" aria-label="Experience points to add">
      <input type="text" id="xp-note" placeholder="What for? (e.g. Session 3)" aria-label="Reason">
      <button data-action="xp-add" class="primary">Add experience</button>
      <label class="xp-free"><input type="checkbox" data-action="free-edit"${c.freeEdit ? " checked" : ""}> Fix mistakes without spending XP</label>
    </div>`;
    const xpText = (c.build && c.build.xpText) || "Attribute = current × 4, Ability = current × 2 (new: 3), Gift = Level × 3 (other lists: × 5), Rage = current, Gnosis = current × 2, Willpower = current, Background = current × 3 (new: 3, with the Storyteller's OK).";
    html += `<p class="bhint no-print">Click a dot to raise a rating with experience: ${esc(xpText)} Lowering a dot you bought gives the XP back.</p>`;
    const log = c.xp.log;
    if (log.length) {
      html += `<ul class="xp-log">${log
        .map((e, i) => {
          const rm = e.type === "earn" ? `<button class="remove no-print" data-xp-remove="${i}" title="Remove">&times;</button>` : "";
          const amount = e.type === "earn" ? `+${e.xp}` : e.xp < 0 ? `+${-e.xp} back` : `−${e.xp}`;
          return `<li>${rm}<strong>${esc(amount)}</strong> ${esc(e.what)}</li>`;
        })
        .join("")}</ul>`;
    } else html += `<p class="empty">No experience recorded yet.</p>`;
    return html + `</section>`;
  }

  function renderSheet(c, game) {
    let html = `<div class="sheet-title"><h1>${esc(c.game)}</h1></div>`;
    if (c.stage === "build") {
      html += `<p class="hint no-print"><strong>Build your character:</strong> type a name and concept, click dots to spend points, and use the <strong>+ Add</strong> boxes for Backgrounds, Gifts, Merits and Flaws. The box below keeps count. When everything is spent, click <strong>Finish character</strong>.</p>`;
      html += renderBudget(c);
    } else if (c.stage === "play") {
      html += `<p class="hint no-print"><strong>Experience mode:</strong> clicking a dot up spends experience points (see the Experience box at the bottom). Tick "Fix mistakes without spending XP" to edit freely.</p>`;
    } else {
      html += `<p class="hint no-print">Click any dot to change a rating (click the last filled dot to lower it). Click a name below to type over it. Use the <strong>+ Add</strong> boxes to add Gifts, Backgrounds, Merits, Flaws or your own entries.</p>`;
    }

    html += `<div class="header-grid">`;
    const bound = Object.fromEntries(Object.entries(c.choiceFields || {}).map(([id, label]) => [label, id]));
    c.header.forEach(([label, value, choices], i) => {
      const opt = game && bound[label] && game.options.find((o) => o.id === bound[label]);
      if (opt && c.choices) {
        // A dropdown: changing it re-applies that choice's starting traits.
        const cur = String(c.choices[opt.id] ?? "");
        html += `<label class="field"><span class="label">${esc(label)}</span><select class="value hsel" data-choice="${esc(opt.id)}">`;
        html += (opt.choicesFor ? opt.choicesFor(c.choices) : opt.choices).map((ch) => `<option value="${esc(ch)}"${String(ch) === cur ? " selected" : ""}>${esc(String(ch) === cur ? value : ch)}</option>`).join("");
        html += `</select></label>`;
        return;
      }
      const list = choices ? ` list="hdr-list-${i}"` : "";
      const ph = !value && (label === "Name" || label === "Concept") && c.stage === "build" ? ` placeholder="type here"` : "";
      html += `<label class="field"><span class="label">${esc(label)}</span><input class="value" data-header="${i}" value="${esc(value)}"${list}${ph}>`;
      if (choices) html += `<datalist id="hdr-list-${i}">${choices.map((o) => `<option value="${esc(o)}">`).join("")}</datalist>`;
      html += `</label>`;
    });
    html += `</div>`;

    c.sections.forEach((s, si) => {
      const cls = s.columns.length === 1 ? "cols one" : s.columns.length === 2 ? "cols two" : "cols";
      html += `<section><h2>${esc(s.title)}</h2><div class="${cls}">${s.columns.map((col, ci) => renderColumn(col, si, ci)).join("")}</div></section>`;
    });

    html += `<section class="split">`;
    if (c.panel) {
      html += `<div><h2>${esc(c.panel.title)}</h2>${c.panel.lines.map((l) => `<p>${l[0] ? `<strong>${esc(l[0])}:</strong> ` : ""}${esc(l[1])}</p>`).join("")}</div>`;
    }
    if (c.table) {
      // Short headings keep wide form tables (up to 7 traits) inside the page.
      const ABBR = { Strength: "Str", Dexterity: "Dex", Stamina: "Sta", Charisma: "Cha", Manipulation: "Man", Appearance: "App", Perception: "Per" };
      html += `<div><h2>${esc(c.table.title)}</h2><table class="forms"><thead><tr>${c.table.columns.map((x) => `<th title="${esc(x)}">${esc(ABBR[x] || x)}</th>`).join("")}</tr></thead><tbody>`;
      for (const row of c.table.rows) {
        html += `<tr>${c.table.columns.map((x) => `<td>${esc(row[x])}</td>`).join("")}</tr>`;
      }
      html += `</tbody></table></div>`;
    }
    if (c.health) {
      html += `<div><h2>Health</h2><table class="health">`;
      for (const [lvl, pen] of c.health) html += `<tr><td>${esc(lvl)}</td><td>${esc(pen)}</td><td><span class="box"></span></td></tr>`;
      html += `</table></div>`;
    }
    html += `</section>`;

    html += `<section><h2>Notes</h2>`;
    for (const e of c.extras || []) html += `<p><strong>${esc(e.title)}:</strong> ${esc(e.text)}</p>`;
    if (c.freebies) {
      const label = c.mode === "pc" ? "Freebie points" : "Freebie points when generated";
      html += `<p><strong>${label} (${esc(c.freebies.total)}):</strong> ${esc(c.freebies.spent.join(", ") || "none")}</p>`;
    }
    for (const n of c.notes || []) html += `<p>${esc(n)}</p>`;
    if (c.sources && c.sources.length) html += `<p><strong>Supplements used:</strong> ${esc(c.sources.join("; "))}</p>`;
    if (c.edited && c.mode !== "pc") html += `<p><em>Edited by hand after generating.</em></p>`;
    html += `</section>`;

    if (c.xp && c.stage === "play") html += renderXp(c);
    if (c.stage === "play" && c.mode === "pc" && !c.xp.log.some((e) => e.type === "spend")) {
      html += `<p class="no-print"><button data-action="unfinish">Back to character creation</button></p>`;
    }
    if (!c.stage) html += `<p class="no-print"><button data-action="track-xp">Track experience points for this character</button></p>`;
    return html;
  }

  // ---------- page wiring ----------

  function init() {
    const gameSel = document.getElementById("game");
    const modeSel = document.getElementById("mode");
    const optsBox = document.getElementById("options");
    const sheet = document.getElementById("sheet");
    const genBtn = document.getElementById("generate");
    const fileInput = document.getElementById("open-file");
    let character = null;

    games.forEach((g, i) => gameSel.add(new Option(g.label, String(i))));
    // index.html?game=bastet opens one game; &mode=player opens the player build.
    const params = new URLSearchParams(location.search);
    const wantedIndex = games.findIndex((g) => g.id === params.get("game"));
    if (wantedIndex >= 0) gameSel.value = String(wantedIndex);
    if (/^(pc|player)$/i.test(params.get("mode") || "")) modeSel.value = "pc";

    const currentGame = () => games[Number(gameSel.value)];
    const isPc = () => modeSel.value === "pc";

    function buildOptions() {
      optsBox.innerHTML = "";
      for (const o of currentGame().options) {
        if (isPc() && (o.id === "meritsFlaws" || o.npcOnly)) continue; // players pick their own
        const label = document.createElement("label");
        label.textContent = o.label + " ";
        let input;
        if (o.type === "number") {
          input = document.createElement("input");
          input.type = "number";
          input.min = o.min;
          input.max = o.max;
          input.value = o.default;
          input.className = "num";
        } else {
          input = document.createElement("select");
          if (o.random !== false) input.add(new Option("Random", ""));
          o.choices.forEach((ch) => input.add(new Option(String(ch), String(ch))));
          if (o.default !== undefined) input.value = String(o.default);
        }
        input.id = "opt-" + o.id;
        label.appendChild(input);
        optsBox.appendChild(label);
      }
      genBtn.textContent = isPc() ? "Start new character" : "Generate";
    }

    function save() {
      try {
        localStorage.setItem(SAVE_KEY, JSON.stringify({ game: currentGame().id, character }));
      } catch (e) {
        /* private window or storage full: the sheet still works */
      }
    }

    function draw() {
      if (character.stage === "build") WOD.fera.budget(character);
      sheet.innerHTML = renderSheet(character, currentGame());
      document.title = `${character.name || "New character"} — ${currentGame().label}`;
      save();
    }

    function changed() {
      character.edited = true;
      const g = currentGame();
      if (g.recompute) g.recompute(character);
      draw();
    }

    function generate(ask) {
      if (ask && character && character.edited && !confirm("Replace this character? Your changes will be lost (use Save character first to keep it).")) return false;
      const g = currentGame();
      const opts = {};
      for (const o of g.options) {
        const el = document.getElementById("opt-" + o.id);
        const v = el ? el.value : o.default;
        opts[o.id] = o.type === "number" ? Math.max(o.min, Math.min(o.max, Number(v) || 0)) : v;
      }
      if (isPc()) {
        character = g.generate({ ...opts, freebies: 0, meritsFlaws: "No" });
        WOD.fera.blank(character, opts.freebies);
        if (g.recompute) g.recompute(character);
      } else {
        character = g.generate(opts);
        character.mode = "npc";
      }
      character.gameId = g.id;
      draw();
      return true;
    }

    // Load a saved character (from the browser or a file). Returns false if it isn't one.
    function load(data) {
      const i = data && data.character && Array.isArray(data.character.sections) ? games.findIndex((g) => g.id === data.game) : -1;
      if (i < 0) return false;
      gameSel.value = String(i);
      modeSel.value = data.character.mode === "pc" ? "pc" : "npc";
      buildOptions();
      character = data.character;
      character.gameId = data.game;
      draw();
      return true;
    }

    const colAt = (path) => {
      const [si, ci] = path.split(".").map(Number);
      return character.sections[si].columns[ci];
    };
    const charging = () => character.stage === "play" && !character.freeEdit;

    // Experience for a rating change; returns false if the player backs out.
    function payXp(si, ci, name, from, to) {
      if (!charging()) return true;
      const F = WOD.fera;
      const kind = F.traitKind(character, si, ci);
      if (!kind) return true;
      const s = character.sections[si];
      const col = s.columns[ci];
      const key = traitKey(s, col, name);
      const cost = F.xpForChange(kind, from, to, character.xpBase[key] ?? 0, { c: character, name });
      if (!cost) return true;
      const left = xpTotals(character).left;
      if (cost > left && !confirm(`That costs ${cost} XP, but there are only ${left} unspent. Buy it anyway?`)) return false;
      const label = col.title === name || ["Rage", "Gnosis", "Willpower"].includes(col.title) ? col.title : name;
      character.xp.log.push({ type: "spend", xp: cost, what: `${label} ${from} → ${to}${cost < 0 ? " (undone)" : ""}`, key });
      return true;
    }

    function payGift(col, label, adding) {
      if (!charging()) return true;
      if (adding) {
        let cost;
        const group = (col.listOptions || []).find((g) => g.options.includes(label));
        if (group) cost = WOD.fera.giftXp(label, group.own);
        else {
          const typed = prompt("How many experience points does this Gift cost? (Level × 3 for your own Gift lists, Level × 5 for others)", "3");
          if (typed === null) return false;
          cost = Math.max(0, Number(typed) || 0);
        }
        const left = xpTotals(character).left;
        if (cost > left && !confirm(`That Gift costs ${cost} XP, but there are only ${left} unspent. Take it anyway?`)) return false;
        if (cost) character.xp.log.push({ type: "spend", xp: cost, what: `Gift: ${label}`, key: "gift|" + label });
      } else if (!character.xpBase.gifts.includes(label)) {
        const bought = character.xp.log.filter((e) => e.key === "gift|" + label).reduce((s, e) => s + e.xp, 0);
        if (bought > 0) character.xp.log.push({ type: "spend", xp: -bought, what: `Gift removed: ${label}`, key: "gift|" + label });
      }
      return true;
    }

    sheet.addEventListener("click", (e) => {
      const dot = e.target.closest("[data-dot]");
      if (dot) {
        const [si, ci, ii, n] = dot.dataset.dot.split(".").map(Number);
        const item = character.sections[si].columns[ci].items[ii];
        const to = item[1] === n ? n - 1 : n;
        if (!payXp(si, ci, item[0], item[1], to)) return;
        item[1] = to;
        changed();
        return;
      }
      const rm = e.target.closest("[data-remove]");
      if (rm) {
        const [si, ci, ii] = rm.dataset.remove.split(".").map(Number);
        const col = colAt(`${si}.${ci}`);
        if (col.items) {
          if (!payXp(si, ci, col.items[ii][0], col.items[ii][1], 0)) return;
          col.items.splice(ii, 1);
        } else {
          if (col.title === "Gifts" && !payGift(col, col.list[ii], false)) return;
          col.list.splice(ii, 1);
        }
        changed();
        return;
      }
      const xpRm = e.target.closest("[data-xp-remove]");
      if (xpRm) {
        const entry = character.xp.log[Number(xpRm.dataset.xpRemove)];
        if (confirm(`Remove "+${entry.xp} ${entry.what}" from the experience record?`)) {
          character.xp.log.splice(Number(xpRm.dataset.xpRemove), 1);
          draw();
        }
        return;
      }
      const act = e.target.closest("[data-action]");
      if (!act) return;
      const action = act.dataset.action;
      if (action === "fill") {
        WOD.fera.fillRest(character);
        changed();
      } else if (action === "finish") {
        const r = WOD.fera.budget(character);
        const problems = [];
        for (const row of r.rows) for (const p of row.parts) if (p.have < p.of) problems.push(`${row.title}${row.parts.length > 1 ? " (" + p.name + ")" : ""}: ${p.of - p.have} left`);
        if (r.used < r.total) problems.push(`${r.total - r.used} freebie points left`);
        if (r.used > r.total) problems.push(`${r.used - r.total} freebie points too many`);
        problems.push(...r.warnings);
        if (!character.name) problems.push("no name yet");
        if (problems.length && !confirm(`Finish anyway?\n\n• ${problems.join("\n• ")}`)) return;
        character.freebies = { total: String(r.total), spent: r.freebieUse.map((x) => `${x.what} (${WOD.fera.pts(x.cost)})`) };
        startXp(character);
        draw();
      } else if (action === "unfinish") {
        character.stage = "build";
        character.freebies = null;
        draw();
      } else if (action === "track-xp") {
        startXp(character);
        draw();
      } else if (action === "xp-add") {
        const amount = Math.floor(Number(document.getElementById("xp-amount").value));
        if (!(amount > 0)) {
          alert("Type how many experience points to add first.");
          return;
        }
        const note = document.getElementById("xp-note").value.trim() || "Experience";
        character.xp.log.push({ type: "earn", xp: amount, what: note, date: new Date().toISOString().slice(0, 10) });
        draw();
      }
    });

    // Breed, auspice, tribe (etc.) changed on the sheet: make two blank templates, one
    // with the old choice and one with the new, and move the character by the difference
    // so starting Rage/Gnosis/Willpower, free dots, Gift lists, Renown and forms follow
    // while everything the player picked or bought stays.
    function changeChoice(id, value) {
      const g = currentGame();
      const c = character;
      const quiet = { freebies: 0, meritsFlaws: "No" };
      const next = { ...c.choices, [id]: id === "rank" ? Number(value) : value };
      const before = g.generate({ ...c.choices, ...quiet });
      const after = g.generate({ ...next, ...quiet });
      const cols = (ch) => ch.sections.flatMap((s) => s.columns);
      const col = (ch, title) => cols(ch).find((x) => x.title.split(" (")[0] === title || x.title.startsWith(title));
      const clamp = (v, max) => Math.max(0, Math.min(max, v));

      for (const [, label] of Object.entries(after.choiceFields || {})) {
        const h = c.header.find((x) => x[0] === label);
        const t = after.header.find((x) => x[0] === label);
        if (h && t) h[1] = t[1];
      }
      // Single ratings that come from the choices (Rage, Gnosis, Willpower, Humanity...).
      const advNames = (after.build && after.build.advKinds) || ["Rage", "Gnosis", "Willpower"];
      for (const k of advNames) {
        const a = col(after, k), b0 = col(before, k), mine = col(c, k);
        if (!a || !b0 || !mine || !mine.items) continue;
        const delta = a.items[0][1] - b0.items[0][1];
        mine.items[0][1] = clamp(mine.items[0][1] + delta, mine.items[0][2]);
        if (c.build && c.build.adv && k in c.build.adv) c.build.adv[k] += delta;
      }
      // Free Ability dots and Background dots that come with a breed or group.
      const shift = (title, oldMap, newMap, addIfMissing) => {
        for (const n of new Set([...Object.keys(oldMap || {}), ...Object.keys(newMap || {})])) {
          const d = ((newMap || {})[n] || 0) - ((oldMap || {})[n] || 0);
          if (!d) continue;
          const section = c.sections.find((s) => s.title === title);
          const holder = section ? section.columns.find((x) => x.items.some((it) => it[0] === n)) : col(c, title);
          const it = holder && holder.items.find((x) => x[0] === n);
          if (it) it[1] = clamp(it[1] + d, it[2]);
          else if (addIfMissing && d > 0) col(c, title).items.push([n, d, 5]);
        }
      };
      shift("Abilities", before.build.freeAbil, after.build.freeAbil, false);
      shift("Backgrounds", before.build.bgStart, after.build.bgStart, true);
      // Point pools whose items depend on the choice (e.g. clan Disciplines).
      for (const pool of after.build.pools || []) {
        const mine = col(c, pool.column);
        const theirs = col(after, pool.column);
        if (!mine || !theirs) continue;
        mine.items = [...mine.items.filter((it) => it[1] > 0 || theirs.items.some((x) => x[0] === it[0])), ...theirs.items.filter((x) => !mine.items.some((it) => it[0] === x[0])).map((x) => [x[0], 0, x[2]])];
        if (theirs.addOptions) mine.addOptions = theirs.addOptions;
      }
      // Lists and tables that simply follow the choice; free Gifts follow it too.
      const gifts = col(c, "Gifts");
      if (gifts) {
        const theirs = col(after, "Gifts");
        gifts.listOptions = theirs.listOptions;
        const oldFree = before.build.keepGifts || [];
        const newFree = after.build.keepGifts || [];
        const isFree = (l, names) => names.some((n) => l.startsWith(n + " ("));
        gifts.list = gifts.list.filter((l) => !isFree(l, oldFree) || isFree(l, newFree));
        for (const l of theirs.list) if (isFree(l, newFree) && !gifts.list.some((x) => x.split(" (")[0] === l.split(" (")[0])) gifts.list.unshift(l);
      }
      const renown = col(c, "Renown");
      if (renown) Object.assign(renown, JSON.parse(JSON.stringify(col(after, "Renown"))));
      for (const k of ["table", "panel", "extras", "selection", "choices", "choiceFields"]) if (k in after) c[k] = after[k];
      c.notes = after.notes.filter((n) => !(c.mode === "pc" && n.includes("left over")));
      for (const x of cols(after)) {
        if (x.text && col(c, x.title.split(" (")[0])) col(c, x.title.split(" (")[0]).text = x.text;
        if (x.boxes && col(c, x.title)) col(c, x.title).boxes = x.boxes;
      }
      const keep = { freebies: c.build.freebies, adv: c.build.adv, result: c.build.result };
      const kept = gifts ? gifts.list.filter((l) => (after.build.keepGifts || []).some((n) => l.startsWith(n + " ("))).length : 0;
      c.build = { ...after.build, ...keep };
      if (gifts) c.build.giftAllowance = col(after, "Gifts").list.length - kept;
      if (c.mode !== "pc") delete c.build.adv;
      changed();
    }

    sheet.addEventListener("change", (e) => {
      const choice = e.target.closest("[data-choice]");
      if (choice) {
        changeChoice(choice.dataset.choice, choice.value);
        return;
      }
      const free = e.target.closest('[data-action="free-edit"]');
      if (free) {
        character.freeEdit = free.checked;
        draw();
        return;
      }
      const sel = e.target.closest("[data-add]");
      if (!sel || !sel.value) return;
      const [si, ci] = sel.dataset.add.split(".").map(Number);
      const col = colAt(sel.dataset.add);
      let value = sel.value;
      if (value === "__custom") {
        value = (prompt(col.customPrompt || "Type the name:") || "").trim();
        if (!value) { sel.value = ""; return; }
      }
      // Merits and Flaws with a range of costs ("1-5 pts", "2 or 4 pts"): ask which.
      const range = value.match(/\((\d+)\s*(?:-|–|or)\s*(\d+) pts?/);
      if (range) {
        const pick = prompt(`How many points for ${value.split(" (")[0]}? (${range[1]} to ${range[2]})`, range[1]);
        const n = Math.round(Number(pick));
        if (pick === null || !(n >= Number(range[1]) && n <= Number(range[2]))) { sel.value = ""; return; }
        value = value.replace(range[0], `(${n} pt${n === 1 ? "" : "s"}`);
      }
      if (col.items) {
        if (!payXp(si, ci, value, 0, 1)) { sel.value = ""; return; }
        col.items.push([value, 1, col.addMax || 5]);
      } else {
        if (col.title === "Gifts" && !payGift(col, value, true)) { sel.value = ""; return; }
        col.list.push(value);
      }
      changed();
    });

    sheet.addEventListener("input", (e) => {
      const f = e.target.closest("[data-header]");
      if (!f) return;
      character.header[Number(f.dataset.header)][1] = f.value;
      if (f.dataset.header === "0") {
        character.name = f.value;
        document.title = `${f.value || "New character"} — ${currentGame().label}`;
      }
      character.edited = true;
      save();
    });

    gameSel.addEventListener("change", () => {
      buildOptions();
      if (!generate(true)) {
        gameSel.value = String(Math.max(0, games.findIndex((g) => g.id === character.gameId)));
        buildOptions();
      }
    });
    modeSel.addEventListener("change", () => {
      buildOptions();
      if (!generate(true)) {
        modeSel.value = character.mode === "pc" ? "pc" : "npc";
        buildOptions();
      }
    });
    genBtn.addEventListener("click", () => generate(true));
    document.getElementById("print").addEventListener("click", () => window.print());

    document.getElementById("save").addEventListener("click", () => {
      const data = JSON.stringify({ app: "wod-character-generator", version: 1, game: currentGame().id, character }, null, 1);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(new Blob([data], { type: "application/json" }));
      a.download = `${(character.name || "character").replace(/[^\w\- ]+/g, "").trim() || "character"} (${currentGame().id}).json`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    });
    document.getElementById("open").addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
      const file = fileInput.files[0];
      fileInput.value = "";
      if (!file) return;
      if (character && character.edited && !confirm("Open this file and replace the character on screen?")) return;
      file.text().then((text) => {
        let data = null;
        try { data = JSON.parse(text); } catch (err) { /* handled below */ }
        if (!load(data)) alert("That file isn't a saved character from this generator.");
      });
    });

    // Bring back the last character (handy if the page was closed by accident).
    let restored = false;
    if (!params.get("game") && !params.get("mode")) {
      try {
        restored = load(JSON.parse(localStorage.getItem(SAVE_KEY) || "null"));
      } catch (e) {
        restored = false;
      }
    }
    if (!restored) {
      buildOptions();
      generate(false);
    }
  }

  return { random, registerGame, renderSheet, init, games, startXp, xpTotals };
})();
