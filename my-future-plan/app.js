/* ============================================================
   My Future Plan — front-end logic
   ============================================================ */

const $ = (id) => document.getElementById(id);

const els = {
  form: $("plan-form"),
  generateBtn: $("generate-btn"),
  formError: $("form-error"),
  intro: $("intro"),
  loading: $("loading"),
  loadingText: $("loading-text"),
  result: $("result"),
  // document
  docTitle: $("doc-title"),
  docEssence: $("doc-essence"),
  quoteText: $("quote-text"),
  quoteAuthor: $("quote-author"),
  horizons: $("horizons"),
  firstStep: $("first-step"),
  affirmation: $("affirmation"),
  // actions
  shareBtn: $("share-btn"),
  restartBtn: $("restart-btn"),
  // email modal
  emailModal: $("email-modal"),
  emailForm: $("email-form"),
  emailInput: $("email"),
  emailSubmit: $("email-submit"),
  emailError: $("email-error"),
  modalClose: $("modal-close"),
  // share modal
  shareModal: $("share-modal"),
  shareClose: $("share-close"),
  dlCard: $("dl-card"),
  dlPdf: $("dl-pdf"),
  copyLink: $("copy-link"),
  nativeShare: $("native-share"),
  cardCanvas: $("card-canvas"),
};

let currentPathway = null;
let currentName = "";
let emailUnlocked = false;

const LOADING_LINES = [
  "Taking it all in…",
  "Listening for what matters most…",
  "Tracing your ten-year horizon…",
  "Shaping your five-year milestones…",
  "Grounding the year ahead…",
  "Finding the words to carry you there…",
];

/* ---------- helpers ---------- */
function showError(el, msg) {
  el.textContent = msg;
  el.hidden = false;
}
function clearError(el) {
  el.hidden = true;
  el.textContent = "";
}
function setLoading(btn, on) {
  btn.classList.toggle("is-loading", on);
  btn.disabled = on;
}
function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 2600);
}
function esc(str) {
  const d = document.createElement("div");
  d.textContent = str == null ? "" : String(str);
  return d.innerHTML;
}

/* ---------- generate ---------- */
els.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError(els.formError);

  const data = {
    name: $("name").value.trim(),
    future: $("future").value.trim(),
    situation: $("situation").value.trim(),
    area: (els.form.querySelector('input[name="area"]:checked') || {}).value || "",
  };

  if (data.future.length < 4) {
    showError(els.formError, "Tell us where you want to be first.");
    return;
  }

  currentName = data.name;
  setLoading(els.generateBtn, true);

  // swap to loading view
  els.intro.hidden = true;
  els.loading.hidden = false;
  let li = 0;
  els.loadingText.textContent = LOADING_LINES[0];
  const loop = setInterval(() => {
    li = (li + 1) % LOADING_LINES.length;
    els.loadingText.textContent = LOADING_LINES[li];
  }, 2200);

  try {
    const res = await fetch("/.netlify/functions/generate-pathway", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) throw new Error(json.error || "Something went wrong. Please try again.");

    currentPathway = json.pathway;
    renderPathway(currentPathway, data.name);

    clearInterval(loop);
    els.loading.hidden = true;
    els.result.hidden = false;
    window.scrollTo({ top: 0, behavior: "smooth" });
  } catch (err) {
    clearInterval(loop);
    els.loading.hidden = true;
    els.intro.hidden = false;
    showError(els.formError, err.message || "Something went wrong. Please try again.");
  } finally {
    setLoading(els.generateBtn, false);
  }
});

/* ---------- render document ---------- */
function renderPathway(p, name) {
  els.docTitle.textContent = p.headline || (name ? `${name}'s Pathway` : "Your Pathway");
  els.docEssence.textContent = p.essence || "";

  if (p.quote && p.quote.text) {
    els.quoteText.textContent = `“${p.quote.text}”`;
    els.quoteAuthor.textContent = p.quote.author || "Unknown";
  }

  els.horizons.innerHTML = "";
  (p.horizons || []).forEach((h) => {
    const markers = (h.markers || [])
      .map((m) => `<li>${esc(m)}</li>`)
      .join("");
    const row = document.createElement("div");
    row.className = "horizon";
    row.innerHTML = `
      <div class="horizon-span">${esc(h.span || "")}</div>
      <div class="horizon-body">
        <h3>${esc(h.title || "")}</h3>
        <p>${esc(h.vision || "")}</p>
        <ul class="markers">${markers}</ul>
      </div>`;
    els.horizons.appendChild(row);
  });

  els.firstStep.textContent = p.firstStep || "";
  els.affirmation.textContent = p.affirmation ? `“${p.affirmation}”` : "";
}

/* ---------- restart ---------- */
els.restartBtn.addEventListener("click", () => {
  els.result.hidden = true;
  els.intro.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

/* ---------- email gate → share ---------- */
els.shareBtn.addEventListener("click", () => {
  if (emailUnlocked) {
    openModal(els.shareModal);
  } else {
    openModal(els.emailModal);
    setTimeout(() => els.emailInput.focus(), 80);
  }
});

els.emailForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError(els.emailError);
  const email = els.emailInput.value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showError(els.emailError, "Please enter a valid email address.");
    return;
  }
  setLoading(els.emailSubmit, true);
  try {
    // Persist via Netlify Forms (no backend, exportable from the dashboard).
    await fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        "form-name": "pathway-emails",
        email,
        pathway: (currentPathway && currentPathway.headline) || "",
        "bot-field": "",
      }).toString(),
    }).catch(() => {}); // never block sharing on capture failure
    emailUnlocked = true;
    closeModal(els.emailModal);
    openModal(els.shareModal);
  } finally {
    setLoading(els.emailSubmit, false);
  }
});

/* ---------- modals ---------- */
function openModal(m) { m.hidden = false; }
function closeModal(m) { m.hidden = true; }
els.modalClose.addEventListener("click", () => closeModal(els.emailModal));
els.shareClose.addEventListener("click", () => closeModal(els.shareModal));
[els.emailModal, els.shareModal].forEach((m) => {
  m.addEventListener("click", (e) => { if (e.target === m) closeModal(m); });
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") { closeModal(els.emailModal); closeModal(els.shareModal); }
});

/* ---------- share actions ---------- */
els.dlPdf.addEventListener("click", () => {
  closeModal(els.shareModal);
  setTimeout(() => window.print(), 200);
});

els.copyLink.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(window.location.origin || window.location.href);
    toast("Link copied — send it to a friend ✦");
  } catch {
    toast(window.location.href);
  }
});

els.nativeShare.addEventListener("click", async () => {
  const text = currentPathway
    ? `My Beautiful Pathway: ${currentPathway.headline || ""} — make yours free`
    : "Make your Beautiful Pathway, free";
  if (navigator.share) {
    try {
      await navigator.share({ title: "My Future Plan", text, url: window.location.origin });
    } catch { /* user cancelled */ }
  } else {
    els.copyLink.click();
  }
});

els.dlCard.addEventListener("click", () => {
  const url = drawPoster();
  const a = document.createElement("a");
  a.href = url;
  a.download = "my-future-plan-poster.png";
  a.click();
  toast("Poster downloaded ✦");
});

/* ---------- poster (canvas, no dependencies) ---------- */
function drawPoster() {
  const c = els.cardCanvas;
  const ctx = c.getContext("2d");
  const W = c.width, H = c.height;
  const p = currentPathway || {};

  // background
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0, "#0b463f");
  bg.addColorStop(1, "#0f766e");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // soft glow
  const glow = ctx.createRadialGradient(W * 0.8, H * 0.1, 40, W * 0.8, H * 0.1, 700);
  glow.addColorStop(0, "rgba(20,184,166,0.35)");
  glow.addColorStop(1, "rgba(20,184,166,0)");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);

  // border frame
  ctx.strokeStyle = "rgba(199,154,85,0.55)";
  ctx.lineWidth = 4;
  ctx.strokeRect(70, 70, W - 140, H - 140);

  const cx = W / 2;
  ctx.textAlign = "center";

  // kicker
  ctx.fillStyle = "#c79a55";
  ctx.font = "600 26px Inter, sans-serif";
  ctx.fillText("A  B E A U T I F U L  P A T H W A Y", cx, 200);

  // headline
  ctx.fillStyle = "#ffffff";
  ctx.font = "500 64px Fraunces, Georgia, serif";
  wrapText(ctx, p.headline || "Your Pathway", cx, 300, W - 320, 70);

  // quote (the viral centerpiece)
  ctx.fillStyle = "rgba(255,255,255,0.95)";
  ctx.font = "italic 400 46px Fraunces, Georgia, serif";
  const qText = p.quote && p.quote.text ? `“${p.quote.text}”` : "";
  const endY = wrapText(ctx, qText, cx, 520, W - 280, 60);

  // author
  if (p.quote && p.quote.author) {
    ctx.fillStyle = "#c79a55";
    ctx.font = "600 30px Inter, sans-serif";
    ctx.fillText("— " + p.quote.author, cx, endY + 60);
  }

  // affirmation
  if (p.affirmation) {
    ctx.fillStyle = "rgba(255,255,255,0.9)";
    ctx.font = "italic 400 38px Fraunces, Georgia, serif";
    wrapText(ctx, `“${p.affirmation}”`, cx, H - 230, W - 320, 50);
  }

  // footer
  ctx.fillStyle = "rgba(255,255,255,0.7)";
  ctx.font = "500 28px Inter, sans-serif";
  ctx.fillText("my-future-plan.netlify.app · make yours, free", cx, H - 110);

  return c.toDataURL("image/png");
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  if (!text) return y;
  const words = String(text).split(/\s+/);
  let line = "";
  let curY = y;
  for (let n = 0; n < words.length; n++) {
    const test = line + words[n] + " ";
    if (ctx.measureText(test).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, curY);
      line = words[n] + " ";
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, curY);
  return curY;
}
