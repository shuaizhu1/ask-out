/* =========================================================
   ✏️  CUSTOMIZE ME
   ========================================================= */
const CONFIG = {
  // Their name. You can also set it from the link: .../?to=Alex
  crushName: "Onyx",
  // Your name, shown on the final summary
  yourName: "Shuai",
  // Optional: fill these in to show "Text me" / "Email me" buttons at the end
  phone: "6692529301",   // e.g. "+15551234567"
  email: "applojuice@gmail.com",   // e.g. "you@example.com"
};

const GIFTS = {
  food: [
    { emoji: "🧋", name: "Boba", desc: "100% sugar, extra pearls" },
    { emoji: "🍣", name: "Sushi", desc: "Choose your favorite rolls" },
    { emoji: "🍜", name: "Ramen", desc: "Steamy & cozy" },
    { emoji: "🥩", name: "Korean BBQ", desc: "I'll do the grilling" },
    { emoji: "🍲", name: "Hot Pot", desc: "Spicy or mild broth" },
    { emoji: "🍝", name: "Pesto Pasta", desc: "Green, garlicky, perfect" },
    { emoji: "🍕", name: "Pizza", desc: "Classic, can't go wrong" },
    { emoji: "🌮", name: "Tacos", desc: "Taco Tuesday any day" },
    { emoji: "🍰", name: "Dessert Date", desc: "Cake, crepes, mochi..." },
  ],
  rp: [
    { emoji: "💎", name: "575 RP", desc: "A little treat" },
    { emoji: "💠", name: "1380 RP", desc: "Skin money" },
    { emoji: "🔷", name: "2800 RP", desc: "Big spender energy" },
    { emoji: "✨", name: "Skin of your choice", desc: "Any champ, I'll gift it" },
    { emoji: "🎟️", name: "Event Pass", desc: "Grind it together" },
    { emoji: "🎮", name: "Duo Queue Night", desc: "I'll play jungle" },
  ],
  plush: [
    { emoji: "🎀", name: "Hello Kitty", desc: "The OG icon" },
    { emoji: "🐰", name: "My Melody", desc: "Sweet & pink" },
    { emoji: "😈", name: "Kuromi", desc: "Cute but mischievous" },
    { emoji: "☁️", name: "Cinnamoroll", desc: "Fluffy cloud puppy" },
    { emoji: "🍮", name: "Pompompurin", desc: "Golden retriever vibes" },
    { emoji: "🐶", name: "Pochacco", desc: "Sporty & sunny" },
    { emoji: "🐸", name: "Keroppi", desc: "Ribbit ribbit" },
    { emoji: "🐧", name: "Badtz-Maru", desc: "Little rebel penguin" },
  ],
};

const NO_MESSAGES = [
  "No",
  "Are you sure?",
  "Really sure??",
  "Think again 🥺",
  "Last chance!",
  "Surely not?",
  "You might regret this",
  "Give it another thought",
  "Pretty please?",
  "I'll buy boba 🧋",
  "Kuromi is crying 😭",
  "My heart 💔",
  "Ok you can't catch me",
];

const NO_HINTS = [
  "",
  "hmm... the No button seems shy 👀",
  "it really doesn't want to be clicked",
  "just press Yes, it's right there 💖",
  "the Yes button is getting bigger for a reason...",
];

/* =========================================================
   Helpers & state
   ========================================================= */
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => Array.from(document.querySelectorAll(sel));

const state = {
  noCount: 0,
  selected: new Set(), // "cat:index"
  currentCat: "food",
};

function showStep(id) {
  $$(".step").forEach((s) => s.classList.remove("active"));
  $("#" + id).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* =========================================================
   Background hearts
   ========================================================= */
(function spawnBackground() {
  const bg = $(".bg-hearts");
  const icons = ["💗", "💕", "🎀", "✨", "💖", "🌸"];
  for (let i = 0; i < 18; i++) {
    const s = document.createElement("span");
    s.textContent = icons[i % icons.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 14 + Math.random() * 22 + "px";
    s.style.animationDuration = 10 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    bg.appendChild(s);
  }
})();

/* =========================================================
   Step 1: The question + dodging No button
   ========================================================= */
const params = new URLSearchParams(location.search);
const crush = params.get("to") || CONFIG.crushName;
$("#greeting").textContent = `Hey ${crush}`;

const yesBtn = $("#yes-btn");
const noBtn = $("#no-btn");

function moveNoButton(pointerX, pointerY) {
  const pad = 16;
  const btnRect = noBtn.getBoundingClientRect();

  // First dodge: pin it where it currently is so the jump animates
  // (moved to <body> because the card's backdrop-filter would trap position: fixed)
  if (!noBtn.classList.contains("dodging")) {
    document.body.appendChild(noBtn);
    noBtn.style.left = btnRect.left + "px";
    noBtn.style.top = btnRect.top + "px";
    noBtn.classList.add("dodging");
    void noBtn.offsetWidth; // force reflow so the transition kicks in
  }

  const w = noBtn.offsetWidth;
  const h = noBtn.offsetHeight;
  const maxX = window.innerWidth - w - pad;
  const maxY = window.innerHeight - h - pad;
  const yesRect = yesBtn.getBoundingClientRect();

  let x, y;
  for (let tries = 0; tries < 30; tries++) {
    x = pad + Math.random() * Math.max(0, maxX - pad);
    y = pad + Math.random() * Math.max(0, maxY - pad);

    const overlapsYes =
      x < yesRect.right + 20 && x + w > yesRect.left - 20 &&
      y < yesRect.bottom + 20 && y + h > yesRect.top - 20;
    const nearPointer =
      pointerX != null &&
      Math.hypot(x + w / 2 - pointerX, y + h / 2 - pointerY) < 160;

    if (!overlapsYes && !nearPointer) break;
  }

  noBtn.style.left = x + "px";
  noBtn.style.top = y + "px";
}

function dodge(e) {
  if (e) e.preventDefault();
  state.noCount++;

  noBtn.textContent = NO_MESSAGES[Math.min(state.noCount, NO_MESSAGES.length - 1)];
  $("#no-hint").textContent = NO_HINTS[Math.min(state.noCount, NO_HINTS.length - 1)];

  // Yes grows, No shrinks
  // Growth speeds up with every chase, capped so it never spills off the screen
  const n = state.noCount;
  const maxGrow = Math.min(
    (window.innerWidth * 0.95) / yesBtn.offsetWidth,
    (window.innerHeight * 0.4) / yesBtn.offsetHeight
  );
  const grow = Math.min(1 + n * 0.25 + n * n * 0.04, maxGrow);
  yesBtn.style.setProperty("--grow", grow);
  // scale() doesn't take up layout space, so grow the row to push the text around it
  $("#btn-row").style.minHeight = yesBtn.offsetHeight * grow + 32 + "px";
  const shrink = Math.max(1 - state.noCount * 0.04, 0.6);
  noBtn.style.transform = `scale(${shrink})`;

  let px = null, py = null;
  if (e && e.touches && e.touches[0]) {
    px = e.touches[0].clientX; py = e.touches[0].clientY;
  } else if (e && "clientX" in e) {
    px = e.clientX; py = e.clientY;
  }
  moveNoButton(px, py);
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: false });
noBtn.addEventListener("click", dodge); // keyboard users can't escape either 😇

window.addEventListener("resize", () => {
  if (noBtn.classList.contains("dodging")) moveNoButton();
});

yesBtn.addEventListener("click", () => {
  noBtn.classList.add("hidden");
  confetti();
  renderGifts();
  showStep("step-gifts");
});

/* =========================================================
   Step 2: Gift picker
   ========================================================= */
// Only one pick per category; this is the note shown above each tab's grid
const TAB_NOTES = {
  food: "Choose 1 (I'll be hungry, choose wisely) 🍽️",
  rp: "Choose 1 (my wallet thanks you) 💸",
  plush: "Choose 1 (they're precious, okay?) 💕",
};

function renderGifts() {
  const grid = $("#gift-grid");
  grid.innerHTML = "";
  $("#tab-note").textContent = TAB_NOTES[state.currentCat];
  GIFTS[state.currentCat].forEach((g, i) => {
    const key = `${state.currentCat}:${i}`;
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "gift" + (state.selected.has(key) ? " selected" : "");
    btn.setAttribute("aria-pressed", state.selected.has(key));
    btn.innerHTML = `
      <span class="emoji">${g.emoji}</span>
      <span class="name">${g.name}</span>
      <span class="desc">${g.desc}</span>`;
    btn.addEventListener("click", () => {
      if (state.selected.has(key)) {
        state.selected.delete(key);
      } else {
        // Swap out any other pick from this category
        state.selected.forEach((k) => {
          if (k.startsWith(state.currentCat + ":")) state.selected.delete(k);
        });
        state.selected.add(key);
      }
      $$(".gift").forEach((el, j) => {
        const on = state.selected.has(`${state.currentCat}:${j}`);
        el.classList.toggle("selected", on);
        el.setAttribute("aria-pressed", on);
      });
      updateCart();
    });
    grid.appendChild(btn);
  });
}

function updateCart() {
  $("#gifts-next").disabled = state.selected.size === 0;
}

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    $$(".tab").forEach((t) => t.classList.remove("active"));
    tab.classList.add("active");
    state.currentCat = tab.dataset.cat;
    renderGifts();
  });
});

$("#gifts-next").addEventListener("click", () => showStep("step-when"));

/* =========================================================
   Step 3: Date & time
   ========================================================= */
const dateInput = $("#date-input");
const today = new Date();
const toISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
dateInput.min = toISO(today);

dateInput.addEventListener("input", () => {
  $("#when-next").disabled = !dateInput.value;
});

$$("[data-back]").forEach((b) =>
  b.addEventListener("click", () => showStep(b.dataset.back))
);

$("#when-next").addEventListener("click", () => {
  renderSummary();
  confetti(80);
  showStep("step-done");
});

/* =========================================================
   Step 4: Summary + sharing
   ========================================================= */
const CAT_LABELS = { food: "🍜 Food", rp: "⚔️ League RP", plush: "🎀 Sanrio Plushies" };

function getPicks() {
  const picks = { food: [], rp: [], plush: [] };
  state.selected.forEach((key) => {
    const [cat, i] = key.split(":");
    picks[cat].push(GIFTS[cat][i]);
  });
  return picks;
}

function prettyDate(iso) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

function buildPlainText() {
  const picks = getPicks();
  const lines = [`💖 ${crush} said YES to a date with ${CONFIG.yourName}!`, ""];
  lines.push(`📅 ${prettyDate(dateInput.value)} — ${$("#time-input").value}`, "");
  Object.keys(picks).forEach((cat) => {
    if (!picks[cat].length) return;
    lines.push(CAT_LABELS[cat] + ":");
    picks[cat].forEach((g) => lines.push(`  • ${g.emoji} ${g.name}`));
  });
  const note = $("#note-input").value.trim();
  if (note) lines.push("", `📝 ${note}`);
  if (state.noCount > 0) lines.push("", `(tried to press No ${state.noCount} time${state.noCount === 1 ? "" : "s"} 🙄)`);
  return lines.join("\n");
}

function renderSummary() {
  const picks = getPicks();
  let html = `<h3>When</h3><p>${prettyDate(dateInput.value)} · ${escapeHTML($("#time-input").value)}</p>`;
  Object.keys(picks).forEach((cat) => {
    if (!picks[cat].length) return;
    html += `<h3>${CAT_LABELS[cat]}</h3><ul>${picks[cat]
      .map((g) => `<li>${g.emoji} ${g.name}</li>`)
      .join("")}</ul>`;
  });
  const note = $("#note-input").value.trim();
  if (note) html += `<h3>Note</h3><p>${escapeHTML(note)}</p>`;
  if (state.noCount > 0) {
    html += `<h3>Fun fact</h3><p>You tried to press No ${state.noCount} time${state.noCount === 1 ? "" : "s"} 🙄</p>`;
  }
  $("#summary").innerHTML = html;

  const text = encodeURIComponent(buildPlainText());
  if (CONFIG.phone) {
    const t = $("#text-btn");
    t.href = `sms:${CONFIG.phone}?&body=${text}`;
    t.classList.remove("hidden");
  }
  if (CONFIG.email) {
    const m = $("#email-btn");
    m.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent("It's a date! 💖")}&body=${text}`;
    m.classList.remove("hidden");
  }
}

$("#copy-btn").addEventListener("click", async () => {
  const status = $("#copy-status");
  try {
    await navigator.clipboard.writeText(buildPlainText());
    status.textContent = "Copied! Now paste it in our chat 💌";
  } catch {
    status.textContent = "Couldn't copy, just screenshot this instead 📸";
  }
});

$("#restart-btn").addEventListener("click", () => {
  state.noCount = 0;
  state.selected.clear();
  state.currentCat = "food";
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.cat === "food"));
  updateCart();
  dateInput.value = "";
  $("#note-input").value = "";
  $("#when-next").disabled = true;
  $("#copy-status").textContent = "";
  $("#no-hint").textContent = "";
  yesBtn.style.setProperty("--grow", 1);
  $("#btn-row").style.minHeight = "";
  noBtn.textContent = "No";
  noBtn.style.cssText = "";
  noBtn.classList.remove("dodging", "hidden");
  $("#btn-row").appendChild(noBtn);
  showStep("step-ask");
});

/* =========================================================
   Confetti
   ========================================================= */
function confetti(count = 120) {
  const box = $("#confetti");
  const icons = ["💖", "💕", "🎀", "✨", "🌸", "💗", "🧋", "🍓"];
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = icons[Math.floor(Math.random() * icons.length)];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 14 + Math.random() * 20 + "px";
    const dur = 2.5 + Math.random() * 2.5;
    s.style.animationDuration = dur + "s";
    s.style.animationDelay = Math.random() * 0.8 + "s";
    box.appendChild(s);
    setTimeout(() => s.remove(), (dur + 1) * 1000);
  }
}
