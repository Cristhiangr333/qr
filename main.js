(function () {
  "use strict";

  /* ---------------------------------------------------------------------
   * Helpers
   * ------------------------------------------------------------------- */
  const $  = (sel, scope) => (scope || document).querySelector(sel);
  const $$ = (sel, scope) => Array.from((scope || document).querySelectorAll(sel));
  const escHTML = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, c =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  function safe(fn, name) { try { return fn(); } catch (e) { console.warn("[" + name + "]", e); } }
  function debounce(fn, ms) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }
  const BRAND = window.__BRAND__ || {};

  const EMOJIS = ["😀","❤️","⭐","🍕","☕","🏠","🐾","🌿","🎉","💈","🛠️","📷","🚲","🏋️","💇","🍷"];

  /* ---------------------------------------------------------------------
   * State
   * ------------------------------------------------------------------- */
  const state = {
    contentType: "link",
    text: "",
    wifi: { ssid: "", pass: "", enc: "WPA" },
    style: "redondeado",
    colorBase: "#F4F1EA",
    colorCode: "#1B1B22",
    codeMode: "solid", // 'solid' | 'gradient'
    colorCode2: "#D9622B",
    gradientType: "linear", // 'linear' | 'radial'
    center: { type: null, value: null }, // type: 'emoji'|'logo'
    frame: "ninguno", // 'ninguno' | 'arriba' | 'abajo'
    frameText: "ESCANÉAME",
    format: "soporte",
    objectText: ""
  };

  let genCounter = 0; // async rebuild race guard

  /* ---------------------------------------------------------------------
   * Content mounts (idempotent)
   * ------------------------------------------------------------------- */
  function mountHowItWorks() {
    const el = $("[data-how-it-works]");
    if (!el || el.children.length || !BRAND.howItWorks) return;
    el.innerHTML = BRAND.howItWorks.map(s => `
      <div class="step-card"><h3>${escHTML(s.title)}</h3><p>${escHTML(s.text)}</p></div>
    `).join("");
  }

  function mountUseCases() {
    const el = $("[data-use-cases]");
    if (!el || el.children.length || !BRAND.useCases) return;
    el.innerHTML = BRAND.useCases.map(u => `
      <div class="usecase-card"><span class="usecase-icon">${u.icon}</span><h3>${escHTML(u.title)}</h3><p>${escHTML(u.text)}</p></div>
    `).join("");
  }

  function mountFaq() {
    const el = $("[data-faq]");
    if (!el || el.children.length || !BRAND.faqs) return;
    el.innerHTML = BRAND.faqs.map((f, i) => `
      <details class="faq-item"${i === 0 ? " open" : ""}>
        <summary>${escHTML(f.q)}</summary>
        <p>${escHTML(f.a)}</p>
      </details>
    `).join("");
  }

  function styleIconSVG(cfg) {
    const round = cfg.dots === "dots" ? "50%" : (cfg.dots === "square" ? "12%" : "38%");
    return `<svg viewBox="0 0 30 30" fill="none">
      <rect x="1" y="1" width="8" height="8" rx="${cfg.corners === "square" ? 1 : 3}" fill="var(--ink)"/>
      <rect x="21" y="1" width="8" height="8" rx="${cfg.corners === "square" ? 1 : 3}" fill="var(--ink)"/>
      <rect x="1" y="21" width="8" height="8" rx="${cfg.corners === "square" ? 1 : 3}" fill="var(--ink)"/>
      <rect x="12" y="12" width="6" height="6" rx="${round}" fill="var(--accent)"/>
      <rect x="21" y="12" width="6" height="6" rx="${round}" fill="var(--ink)"/>
      <rect x="12" y="21" width="6" height="6" rx="${round}" fill="var(--ink)"/>
    </svg>`;
  }

  function mountStyleGrid() {
    const el = $("[data-style-grid]");
    if (!el || el.children.length || !BRAND.styles) return;
    el.innerHTML = Object.entries(BRAND.styles).map(([key, cfg]) => `
      <button type="button" class="style-chip${key === state.style ? " is-active" : ""}" data-style="${key}">
        ${styleIconSVG(cfg)}<span>${escHTML(cfg.label)}</span>
      </button>
    `).join("");
    $$("[data-style]", el).forEach(btn => btn.addEventListener("click", () => {
      state.style = btn.dataset.style;
      $$(".style-chip", el).forEach(b => b.classList.toggle("is-active", b === btn));
      requestRebuild();
    }));
  }

  function mountColorPresets() {
    const el = $("[data-color-presets]");
    if (!el || el.children.length || !BRAND.colorPresets) return;
    el.innerHTML = BRAND.colorPresets.map((p, i) => `
      <button type="button" class="color-preset-btn${i === 0 ? " is-active" : ""}" data-base="${p.base}" data-code="${p.code}" title="${escHTML(p.label)}" aria-label="${escHTML(p.label)}">
        <span style="background:${p.base}"></span><span style="background:${p.code}"></span>
      </button>
    `).join("");
    $$(".color-preset-btn", el).forEach(btn => btn.addEventListener("click", () => {
      state.colorBase = btn.dataset.base;
      state.colorCode = btn.dataset.code;
      $("#color-base").value = state.colorBase;
      $("#color-code").value = state.colorCode;
      $$(".color-preset-btn", el).forEach(b => b.classList.toggle("is-active", b === btn));
      requestRebuild();
    }));
  }

  function mountFrameGrid() {
    const el = $("[data-frame-grid]");
    if (!el || el.children.length || !BRAND.framePresets) return;
    el.innerHTML = BRAND.framePresets.map((f, i) => `
      <button type="button" class="seg-btn${i === 0 ? " is-active" : ""}" data-frame="${f.key}" role="tab" aria-selected="${i === 0}">${escHTML(f.label)}</button>
    `).join("");
    $$("[data-frame]", el).forEach(btn => btn.addEventListener("click", () => {
      state.frame = btn.dataset.frame;
      $$("[data-frame]", el).forEach(b => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
      $("#frame-text").hidden = state.frame === "ninguno";
    }));
  }

  function mountEmojiPicker() {
    const el = $("[data-emoji-picker]");
    if (!el || el.children.length) return;
    el.innerHTML = EMOJIS.map(e => `<button type="button" class="emoji-btn" data-emoji="${e}">${e}</button>`).join("");
    $$(".emoji-btn", el).forEach(btn => btn.addEventListener("click", () => {
      state.center = { type: "emoji", value: btn.dataset.emoji };
      $$(".emoji-btn", el).forEach(b => b.classList.toggle("is-active", b === btn));
      $("[data-clear-center]").hidden = false;
      requestRebuild();
    }));
  }

  /* ---------------------------------------------------------------------
   * Payload builders
   * ------------------------------------------------------------------- */
  function escWifi(s) { return String(s || "").replace(/([\\;,:"])/g, "\\$1"); }

  function buildPayload() {
    if (state.contentType === "wifi") {
      const t = state.wifi.enc === "nopass" ? "nopass" : state.wifi.enc;
      return `WIFI:T:${t};S:${escWifi(state.wifi.ssid)};${t === "nopass" ? "" : "P:" + escWifi(state.wifi.pass) + ";"};`;
    }
    let v = (state.text || "").trim();
    if (!v) return "https://tu-web.com";
    if (!/^[a-z]+:\/\//i.test(v) && v.includes(".") && !v.includes(" ")) v = "https://" + v;
    return v;
  }

  function slugFromPayload() {
    const p = buildPayload();
    return p.replace(/^https?:\/\//i, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 40).toLowerCase() || "qr";
  }

  function styleOptions() {
    return (BRAND.styles && BRAND.styles[state.style]) || { dots: "square", corners: "square", cornerDot: "square" };
  }

  function hasCenterImage() { return !!(state.center && state.center.type && state.center.value); }

  function centerImageDataURL() {
    if (!hasCenterImage()) return undefined;
    if (state.center.type === "logo") return state.center.value;
    // emoji -> rasterize
    const c = document.createElement("canvas");
    c.width = c.height = 200;
    const ctx = c.getContext("2d");
    ctx.font = "160px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.center.value, 100, 112);
    return c.toDataURL("image/png");
  }

  function codeFillOptions() {
    if (state.codeMode !== "gradient") return { color: state.colorCode };
    return {
      gradient: {
        type: state.gradientType === "radial" ? "radial" : "linear",
        rotation: Math.PI / 4,
        colorStops: [{ offset: 0, color: state.colorCode }, { offset: 1, color: state.colorCode2 }]
      }
    };
  }

  function qrOptions(sizePx) {
    const s = styleOptions();
    const fill = codeFillOptions();
    const opts = {
      width: sizePx, height: sizePx,
      margin: 8,
      type: "canvas",
      data: buildPayload(),
      qrOptions: { errorCorrectionLevel: hasCenterImage() ? "H" : "M" },
      dotsOptions: Object.assign({ type: s.dots }, fill),
      cornersSquareOptions: Object.assign({ type: s.corners }, fill),
      cornersDotOptions: Object.assign({ type: s.cornerDot }, fill),
      backgroundOptions: { color: state.colorBase }
    };
    if (hasCenterImage()) {
      opts.image = centerImageDataURL();
      opts.imageOptions = { crossOrigin: "anonymous", margin: 4, imageSize: 0.4, hideBackgroundDots: true };
    }
    return opts;
  }

  /* ---------------------------------------------------------------------
   * 2D preview + PNG/SVG downloads
   * ------------------------------------------------------------------- */
  let qrPreviewInstance = null;

  function renderQR2D() {
    const host = $("[data-qr-preview]");
    if (!host || !window.QRCodeStyling) return;
    host.innerHTML = "";
    qrPreviewInstance = new QRCodeStyling(qrOptions(260));
    qrPreviewInstance.append(host);
  }

  async function drawFrame(qrBlob) {
    const qrDataUrl = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(qrBlob); });
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = qrDataUrl; });
    const pad = Math.round(img.width * 0.06);
    const barH = Math.round(img.width * 0.16);
    const c = document.createElement("canvas");
    c.width = img.width + pad * 2;
    c.height = img.height + pad * 2 + barH;
    const ctx = c.getContext("2d");
    ctx.fillStyle = state.colorBase;
    ctx.fillRect(0, 0, c.width, c.height);
    const barY = state.frame === "arriba" ? 0 : c.height - barH;
    const qrY = state.frame === "arriba" ? barH + pad : pad;
    ctx.fillStyle = state.colorCode;
    ctx.fillRect(0, barY, c.width, barH);
    ctx.fillStyle = state.colorBase;
    ctx.font = `800 ${Math.round(barH * 0.42)}px Manrope, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(state.frameText || "ESCANÉAME", c.width / 2, barY + barH / 2);
    // small arrow pointing toward the code
    const ax = c.width / 2, arrowH = Math.round(barH * 0.22);
    const ay = state.frame === "arriba" ? barY + barH - 2 : barY + 2;
    const dir = state.frame === "arriba" ? 1 : -1;
    ctx.beginPath();
    ctx.moveTo(ax - arrowH, ay);
    ctx.lineTo(ax + arrowH, ay);
    ctx.lineTo(ax, ay + arrowH * dir);
    ctx.closePath();
    ctx.fill();
    ctx.drawImage(img, pad, qrY, img.width, img.height);
    return new Promise((res) => c.toBlob(res, "image/png"));
  }

  async function downloadImage(ext) {
    if (!window.QRCodeStyling) return;
    const qr = new QRCodeStyling(qrOptions(1000));
    let blob = await qr.getRawData(ext);
    if (!blob) return;
    if (ext === "png" && state.frame !== "ninguno") {
      const framed = await drawFrame(blob);
      if (framed) blob = framed;
    }
    saveBlob(blob, `qr-${slugFromPayload()}.${ext}`);
    notifyDownloaded();
  }

  function saveBlob(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------------------------------------------------------------------
   * Print-quality warnings
   * ------------------------------------------------------------------- */
  const FORMATS = {
    soporte: { label: "soporte de mesa", shape: "wedge", qrSizeMM: 40, thetaDeg: 38, frontWallMM: 4, thicknessBase: 3.2, textStripMM: 8 },
    llavero: { label: "llavero", shape: "rect", qrSizeMM: 26, thickness: 3, hasHole: true, ringHoleMM: 4.5, textStripMM: 5 },
    placa: { label: "placa de pared", shape: "rect", qrSizeMM: 46, thickness: 3.2, hasHole: true, hangHoleMM: 4, textStripMM: 6 },
    iman: { label: "imán", shape: "rect", qrSizeMM: 22, thickness: 2.6, hasHole: false, textStripMM: 4 },
    posavasos: { label: "posavasos", shape: "circle", qrSizeMM: 38, diameterMM: 90, thickness: 4, textStripMM: 7 },
    "placa-redonda": { label: "placa redonda", shape: "circle", qrSizeMM: 46, diameterMM: 78, thickness: 3.2, textStripMM: 6 }
  };

  function luminance(hex) {
    const c = hex.replace("#", "");
    const r = parseInt(c.slice(0, 2), 16) / 255, g = parseInt(c.slice(2, 4), 16) / 255, b = parseInt(c.slice(4, 6), 16) / 255;
    const lin = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  }
  function contrastRatio(a, b) {
    const l1 = luminance(a), l2 = luminance(b);
    const hi = Math.max(l1, l2), lo = Math.min(l1, l2);
    return (hi + 0.05) / (lo + 0.05);
  }

  function estimateModuleCount() {
    // rough estimate from qr-code-styling internals if available, else heuristic from payload length
    try {
      if (qrPreviewInstance && qrPreviewInstance._qr && typeof qrPreviewInstance._qr.getModuleCount === "function") {
        return qrPreviewInstance._qr.getModuleCount();
      }
    } catch (_) {}
    const len = buildPayload().length;
    return Math.max(21, Math.min(65, 21 + Math.ceil(len / 6) * 2));
  }

  function renderWarnings() {
    const host = $("[data-print-warnings]");
    if (!host) return;
    const fmt = FORMATS[state.format];
    const n = estimateModuleCount();
    const mmPerModule = fmt.qrSizeMM / n;
    const ratio = contrastRatio(state.colorBase, state.colorCode);
    const lBase = luminance(state.colorBase), lCode = luminance(state.colorCode);
    const items = [];

    if (ratio < 3) {
      items.push({ level: "danger", text: `⚠️ Contraste muy bajo (${ratio.toFixed(1)}:1) — este código probablemente no escaneará. Elige una base clara y un código oscuro.` });
    } else if (lCode > lBase) {
      items.push({ level: "warn", text: "El código es más claro que la base (QR invertido). La mayoría de móviles lo leen, algunos antiguos no." });
    } else {
      items.push({ level: "ok", text: `✓ Buen contraste (${ratio.toFixed(1)}:1).` });
    }

    if (mmPerModule < 1.5) {
      items.push({ level: "danger", text: `⚠️ Módulo de ${mmPerModule.toFixed(2)} mm — muy pequeño para imprimirse bien (mínimo recomendado 1,5 mm). Prueba un enlace más corto o el formato "placa".` });
    } else {
      items.push({ level: "ok", text: `✓ Tamaño de módulo adecuado (${mmPerModule.toFixed(2)} mm).` });
    }

    if (hasCenterImage()) {
      items.push({ level: "warn", text: "El logo/emoji central cubre parte del código — haz una prueba de escaneo antes de imprimir varias unidades." });
    }

    host.innerHTML = items.map(i => `<div class="print-warning level-${i.level}">${i.text}</div>`).join("");
  }

  /* ---------------------------------------------------------------------
   * Grid / mask utilities (shared by QR relief and text relief)
   * ------------------------------------------------------------------- */
  function gridRects(on, cols, rows) {
    const used = new Uint8Array(cols * rows), out = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      if (used[r * cols + c] || !on(r, c)) continue;
      let w = 1; while (c + w < cols && !used[r * cols + c + w] && on(r, c + w)) w++;
      let h = 1;
      grow: while (r + h < rows) {
        for (let k = 0; k < w; k++) if (used[(r + h) * cols + c + k] || !on(r + h, c + k)) break grow;
        h++;
      }
      for (let rr = r; rr < r + h; rr++) for (let cc = c; cc < c + w; cc++) used[rr * cols + cc] = 1;
      out.push({ c, r, w, h });
    }
    return out;
  }

  async function buildSilhouetteDataURL() {
    // returns an opaque-black-on-transparent silhouette for the center image, or undefined
    if (!hasCenterImage()) return undefined;
    if (state.center.type === "emoji") return centerImageDataURL(); // already alpha-based glyph
    // logo: threshold by alpha (if has real transparency) or luminance otherwise
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const c = document.createElement("canvas");
        c.width = img.width; c.height = img.height;
        const ctx = c.getContext("2d");
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, c.width, c.height);
        let transparentCount = 0;
        for (let i = 3; i < data.data.length; i += 4) if (data.data[i] < 20) transparentCount++;
        const totalPx = c.width * c.height;
        const useAlpha = transparentCount / totalPx > 0.04;
        for (let i = 0; i < data.data.length; i += 4) {
          let on;
          if (useAlpha) { on = data.data[i + 3] > 128; }
          else {
            const lum = 0.2126 * data.data[i] + 0.7152 * data.data[i + 1] + 0.0722 * data.data[i + 2];
            on = lum < 140;
          }
          data.data[i] = 0; data.data[i + 1] = 0; data.data[i + 2] = 0;
          data.data[i + 3] = on ? 255 : 0;
        }
        ctx.putImageData(data, 0, 0);
        resolve(c.toDataURL("image/png"));
      };
      img.onerror = () => resolve(undefined);
      img.src = state.center.value;
    });
  }

  async function buildQRMask(sizeModules) {
    // renders the SAME styled QR, forced pure B/W, margin 0, at ~12px/module
    const px = sizeModules * 12;
    const s = styleOptions();
    const silhouette = await buildSilhouetteDataURL();
    const opts = {
      width: px, height: px, margin: 0, type: "canvas",
      data: buildPayload(),
      qrOptions: { errorCorrectionLevel: hasCenterImage() ? "H" : "M" },
      dotsOptions: { type: s.dots, color: "#000000" },
      cornersSquareOptions: { type: s.corners, color: "#000000" },
      cornersDotOptions: { type: s.cornerDot, color: "#000000" },
      backgroundOptions: { color: "#ffffff" }
    };
    if (silhouette) opts.image = silhouette, opts.imageOptions = { margin: 4, imageSize: 0.4, hideBackgroundDots: true };
    const qr = new QRCodeStyling(opts);
    const blob = await qr.getRawData("png");
    const dataUrl = await new Promise((res) => { const fr = new FileReader(); fr.onload = () => res(fr.result); fr.readAsDataURL(blob); });
    const img = await new Promise((res, rej) => { const im = new Image(); im.onload = () => res(im); im.onerror = rej; im.src = dataUrl; });
    const c = document.createElement("canvas"); c.width = px; c.height = px;
    const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, px, px);
    const data = ctx.getImageData(0, 0, px, px).data;
    const cell = 12;
    const cols = sizeModules, rows = sizeModules;
    const on = (r, cIdx) => {
      const x = Math.min(px - 1, Math.round(cIdx * cell + cell / 2));
      const y = Math.min(px - 1, Math.round(r * cell + cell / 2));
      const i = (y * px + x) * 4;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      return lum < 128;
    };
    return { rects: gridRects(on, cols, rows), cols, rows };
  }

  function rasterizeText(text) {
    if (!text || !text.trim()) return null;
    const h = 40;
    const measure = document.createElement("canvas").getContext("2d");
    measure.font = `700 ${h * 0.78}px Manrope, sans-serif`;
    const w = Math.ceil(measure.measureText(text).width) + 16;
    const c = document.createElement("canvas"); c.width = w; c.height = h;
    const ctx = c.getContext("2d");
    ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#000"; ctx.font = `700 ${h * 0.78}px Manrope, sans-serif`;
    ctx.textBaseline = "middle"; ctx.textAlign = "center";
    ctx.fillText(text, w / 2, h / 2 + 1);
    const data = ctx.getImageData(0, 0, w, h).data;
    const on = (r, cIdx) => {
      const i = (r * w + cIdx) * 4;
      const lum = 0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
      return lum < 128;
    };
    return { rects: gridRects(on, w, h), cols: w, rows: h };
  }

  /* ---------------------------------------------------------------------
   * 3D geometry: triangle-soup builder (positions only, per-face flat)
   * ------------------------------------------------------------------- */
  function newSoup() { return { positions: [] }; } // flat array of xyz triples, 3 per vertex, CCW winding

  function pushTri(soup, a, b, c) {
    soup.positions.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
  }
  function pushQuad(soup, a, b, c, d) { // a,b,c,d CCW
    pushTri(soup, a, b, c); pushTri(soup, a, c, d);
  }

  // Oriented box: origin = corner at (u0,v0,n0); axes are already scaled per-unit vectors.
  function addOrientedBox(soup, origin, uDir, vDir, nDir, u0, u1, v0, v1, n0, n1) {
    const P = (u, v, n) => [
      origin[0] + uDir[0] * u + vDir[0] * v + nDir[0] * n,
      origin[1] + uDir[1] * u + vDir[1] * v + nDir[1] * n,
      origin[2] + uDir[2] * u + vDir[2] * v + nDir[2] * n
    ];
    const p000 = P(u0, v0, n0), p100 = P(u1, v0, n0), p110 = P(u1, v1, n0), p010 = P(u0, v1, n0);
    const p001 = P(u0, v0, n1), p101 = P(u1, v0, n1), p111 = P(u1, v1, n1), p011 = P(u0, v1, n1);
    // 6 faces, CCW seen from outside (n1 = "top"/outward side)
    pushQuad(soup, p001, p101, p111, p011); // top (n=n1)
    pushQuad(soup, p100, p000, p010, p110); // bottom (n=n0)
    pushQuad(soup, p000, p100, p101, p001); // v=v0 side
    pushQuad(soup, p110, p010, p011, p111); // v=v1 side
    pushQuad(soup, p010, p000, p001, p011); // u=u0 side
    pushQuad(soup, p100, p110, p111, p101); // u=u1 side
  }

  function cross3(a, b) { return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]]; }
  function norm3(a) { const l = Math.hypot(a[0],a[1],a[2]) || 1; return [a[0]/l, a[1]/l, a[2]/l]; }

  /* Design-face frame: returns {origin, uDir, vDir, nDir, faceWidth, faceHeight} in world (X=width,Y=up,Z=toward-camera) */
  function designFace(fmt) {
    if (fmt.shape === "wedge") {
      const theta = fmt.thetaDeg * Math.PI / 180;
      const faceLength = fmt.qrSizeMM + fmt.textStripMM + 6; // qr + gap + text strip + top margin
      const backZ = faceLength * Math.sin(theta);
      const uDir = [1, 0, 0];
      const vDir = norm3([0, Math.cos(theta), -Math.sin(theta)]);
      const nDir = norm3(cross3(uDir, vDir));
      const origin = [-fmt.qrSizeMM / 2 - 4, fmt.frontWallMM, backZ];
      return { origin, uDir, vDir, nDir, faceWidth: fmt.qrSizeMM + 8, faceHeight: faceLength, thickness: fmt.thicknessBase };
    }
    // rect (llavero / placa / iman) or circle (posavasos / placa-redonda): flat, facing camera (+Z)
    const extraTop = fmt.hasHole ? (fmt.ringHoleMM || fmt.hangHoleMM || 4) + 6 : 4;
    const faceHeight = fmt.qrSizeMM + fmt.textStripMM + extraTop;
    const uDir = [1, 0, 0], vDir = [0, 1, 0], nDir = [0, 0, 1];
    const origin = [-fmt.qrSizeMM / 2 - 4, fmt.shape === "circle" ? (fmt.diameterMM - faceHeight) / 2 : 3, fmt.thickness];
    return { origin, uDir, vDir, nDir, faceWidth: fmt.qrSizeMM + 8, faceHeight, thickness: fmt.thickness, extraTop };
  }

  const RELIEF_H = 1.2, SINK = 0.15;

  function addReliefFromMask(soup, face, mask, gx0, gy0, cellMM) {
    if (!mask) return;
    mask.rects.forEach(rect => {
      const u0 = gx0 + rect.c * cellMM, u1 = gx0 + (rect.c + rect.w) * cellMM;
      const v0 = gy0 + (mask.rows - rect.r - rect.h) * cellMM, v1 = gy0 + (mask.rows - rect.r) * cellMM; // flip Y (image row0 = top)
      addOrientedBox(soup, face.origin, face.uDir, face.vDir, face.nDir,
        u0 - 0.01, u1 + 0.01, v0 - 0.01, v1 + 0.01, -SINK, RELIEF_H);
    });
  }

  /* Circular disc (coaster / round plaque): triangle-fan top+bottom caps + side wall */
  function addDiscSoup(soup, radius, thickness, segments) {
    segments = segments || 48;
    const top = [], bottom = [];
    for (let i = 0; i < segments; i++) {
      const a = (i / segments) * Math.PI * 2;
      const x = Math.cos(a) * radius, z = Math.sin(a) * radius;
      top.push([x, thickness, z]);
      bottom.push([x, 0, z]);
    }
    const centerTop = [0, thickness, 0], centerBottom = [0, 0, 0];
    for (let i = 0; i < segments; i++) {
      const j = (i + 1) % segments;
      pushTri(soup, centerTop, top[i], top[j]);          // top cap (CCW seen from +Y)
      pushTri(soup, centerBottom, bottom[j], bottom[i]);  // bottom cap (CCW seen from -Y)
      pushQuad(soup, bottom[i], bottom[j], top[j], top[i]); // side wall (outward)
    }
  }

  /* Base builders — return a triangle soup for the base plate/wedge/disc */
  function buildBaseSoup(fmt, face) {
    const soup = newSoup();
    if (fmt.shape === "circle") {
      addDiscSoup(soup, fmt.diameterMM / 2, fmt.thickness, 56);
      return soup;
    }
    if (fmt.shape === "wedge") {
      const theta = fmt.thetaDeg * Math.PI / 180;
      const W = face.faceWidth, hw = W / 2;
      const backZ = face.faceHeight * Math.sin(theta);
      const frontWallH = fmt.frontWallMM;
      const topY = frontWallH + face.faceHeight * Math.cos(theta);
      // profile in (Z,Y): p0(front-bottom) p1(front-top) p2(back-top) p3(back-bottom)
      const p0 = [backZ, 0], p1 = [backZ, frontWallH], p2 = [0, topY], p3 = [0, 0];
      const V = (z, y, x) => [x, y, z];
      const A0 = V(p0[0], p0[1], -hw), A1 = V(p1[0], p1[1], -hw), A2 = V(p2[0], p2[1], -hw), A3 = V(p3[0], p3[1], -hw);
      const B0 = V(p0[0], p0[1],  hw), B1 = V(p1[0], p1[1],  hw), B2 = V(p2[0], p2[1],  hw), B3 = V(p3[0], p3[1],  hw);
      // bottom (y=0): A0,B0,B3,A3
      pushQuad(soup, A0, B0, B3, A3);
      // front wall: A0,A1,B1,B0
      pushQuad(soup, A0, A1, B1, B0);
      // incline (design face underside->outside): A1,A2,B2,B1 (outward normal must match face.nDir)
      pushQuad(soup, A1, A2, B2, B1);
      // back wall: A2,A3,B3,B2 wait need CCW outward (-Z). Use A3,A2,B2,B3
      pushQuad(soup, A3, A2, B2, B3);
      // sides: x=-hw (A0,A1,A2,A3) outward normal -X
      pushQuad(soup, A1, A0, A3, A2);
      // x=+hw (B0,B1,B2,B3) outward normal +X
      pushQuad(soup, B0, B1, B2, B3);
      return soup;
    }
    // flat rectangular plate (llavero / placa / imán). Ring/hang holes are cut as a
    // gap-band in the slab (no CSG needed) when the format declares hasHole; imán
    // ships as a plain solid slab (magnet glues to the back, no hole needed).
    const t = fmt.thickness;
    const w = face.faceWidth, h = face.faceHeight;
    const x0 = -w / 2, y0 = 0, y1 = h, z0 = 0, z1 = t;
    const uDir = [1, 0, 0], vDir = [0, 1, 0], nDir = [0, 0, 1];
    if (fmt.hasHole) {
      const holeSizeMM = fmt.ringHoleMM || fmt.hangHoleMM || 4;
      const holeR = holeSizeMM / 2;
      const holeY = h - (holeSizeMM + 2);
      const bandGap = holeR * 2 + 1.2;
      if (holeY > y0 + bandGap && holeY < y1 - 0.1) {
        addOrientedBox(soup, [x0, 0, 0], uDir, vDir, nDir, 0, w, y0, holeY - bandGap / 2, z0, z1);
        addOrientedBox(soup, [x0, 0, 0], uDir, vDir, nDir, 0, w, holeY + bandGap / 2, y1, z0, z1);
        return soup;
      }
    }
    addOrientedBox(soup, [x0, 0, 0], uDir, vDir, nDir, 0, w, y0, y1, z0, z1);
    return soup;
  }

  /* ---------------------------------------------------------------------
   * Full model build (base soup + relief soup) — used for both 3MF & STL & preview
   * ------------------------------------------------------------------- */
  async function buildModelSoups() {
    const fmt = FORMATS[state.format];
    const face = designFace(fmt);
    const n = estimateModuleCount();
    const cellMM = fmt.qrSizeMM / n;
    const qrMask = await buildQRMask(n);
    const textMask = rasterizeText(state.objectText);

    const relief = newSoup();
    // QR block: placed in the upper part of the face
    const qrV0 = face.faceHeight - fmt.qrSizeMM - (face.extraTop || (fmt.thetaDeg ? 6 : 6));
    addReliefFromMask(relief, face, qrMask, (face.faceWidth - fmt.qrSizeMM) / 2, qrV0, cellMM);

    if (textMask) {
      const textCellMM = fmt.textStripMM * 0.85 / textMask.rows;
      const textW = textMask.cols * textCellMM;
      addReliefFromMask(relief, face, textMask, (face.faceWidth - textW) / 2, qrV0 - fmt.textStripMM, textCellMM);
    }

    const base = buildBaseSoup(fmt, face);
    return { base, relief, face };
  }

  /* ---------------------------------------------------------------------
   * 3MF writer (hand-built XML, zipped with JSZip)
   * ------------------------------------------------------------------- */
  function weldPositions(flatPositions) {
    const map = new Map();
    const verts = [];
    const idx = [];
    const key = (x, y, z) => Math.round(x * 1000) + "_" + Math.round(y * 1000) + "_" + Math.round(z * 1000);
    for (let i = 0; i < flatPositions.length; i += 3) {
      const x = flatPositions[i], y = flatPositions[i + 1], z = flatPositions[i + 2];
      const k = key(x, y, z);
      let vi = map.get(k);
      if (vi === undefined) { vi = verts.length / 3; verts.push(x, y, z); map.set(k, vi); }
      idx.push(vi);
    }
    return { verts, idx };
  }

  function toPositiveOctant(soups) {
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    soups.forEach(s => { for (let i = 0; i < s.positions.length; i += 3) {
      minX = Math.min(minX, s.positions[i]); minY = Math.min(minY, s.positions[i+1]); minZ = Math.min(minZ, s.positions[i+2]);
    }});
    soups.forEach(s => { for (let i = 0; i < s.positions.length; i += 3) {
      s.positions[i] -= minX; s.positions[i+1] -= minY; s.positions[i+2] -= minZ;
    }});
  }

  function meshXML(objId, pid, pindex, soup) {
    // NOTE: 3MF/print convention = Z up. We authored in three.js Y-up, so swap Y<->Z on export.
    const { verts, idx } = weldPositions(soup.positions);
    let vXml = "";
    for (let i = 0; i < verts.length; i += 3) {
      vXml += `<vertex x="${verts[i].toFixed(3)}" y="${verts[i+2].toFixed(3)}" z="${verts[i+1].toFixed(3)}"/>`;
    }
    let tXml = "";
    for (let i = 0; i < idx.length; i += 3) {
      if (idx[i] === idx[i+1] || idx[i+1] === idx[i+2] || idx[i] === idx[i+2]) continue;
      tXml += `<triangle v1="${idx[i]}" v2="${idx[i+1]}" v3="${idx[i+2]}"/>`;
    }
    return `<object id="${objId}" type="model" pid="${pid}" pindex="${pindex}"><mesh><vertices>${vXml}</vertices><triangles>${tXml}</triangles></mesh></object>`;
  }

  function hex8(hex) { return hex.replace("#", "").toUpperCase() + "FF"; }

  async function export3MF() {
    const { base, relief } = await buildModelSoups();
    toPositiveOctant([base, relief]);
    const baseObj = meshXML(2, 1, 0, base);
    const reliefObj = meshXML(3, 1, 1, relief);
    const model = `<?xml version="1.0" encoding="UTF-8"?>
<model unit="millimeter" xml:lang="es-ES" xmlns="http://schemas.microsoft.com/3dmanufacturing/core/2015/02">
  <resources>
    <basematerials id="1">
      <base name="Base" displaycolor="#${hex8(state.colorBase)}"/>
      <base name="Codigo" displaycolor="#${hex8(state.colorCode)}"/>
    </basematerials>
    ${baseObj}
    ${reliefObj}
  </resources>
  <build><item objectid="2"/><item objectid="3"/></build>
</model>`;
    const contentTypes = `<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="model" ContentType="application/vnd.ms-package.3dmanufacturing-3dmodel+xml"/></Types>`;
    const rels = `<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rel0" Type="http://schemas.microsoft.com/3dmanufacturing/2013/01/3dmodel" Target="/3D/3dmodel.model"/></Relationships>`;

    const zip = new JSZip();
    zip.file("[Content_Types].xml", contentTypes);
    zip.file("_rels/.rels", rels);
    zip.file("3D/3dmodel.model", model);
    const blob = await zip.generateAsync({ type: "blob", mimeType: "model/3mf", compression: "DEFLATE" });

    // verify by re-parsing (definition of done, rule 11)
    await verify3MF(blob);
    saveBlob(blob, `qr3d-${slugFromPayload()}-${state.format}.3mf`);
    notifyDownloaded();
  }

  async function verify3MF(blob) {
    try {
      const zip = await JSZip.loadAsync(blob);
      const xml = await zip.file("3D/3dmodel.model").async("string");
      const objCount = (xml.match(/<object /g) || []).length;
      const colorCount = (xml.match(/displaycolor=/g) || []).length;
      const triCount = (xml.match(/<triangle /g) || []).length;
      if (objCount !== 2 || colorCount !== 2 || triCount === 0) {
        console.warn("[3mf verify] unexpected structure", { objCount, colorCount, triCount });
      }
    } catch (e) { console.warn("[3mf verify] failed", e); }
  }

  async function exportSTL() {
    const THREE = await import("three");
    const { STLExporter } = await import("three/addons/exporters/STLExporter.js");
    const { base, relief } = await buildModelSoups();
    toPositiveOctant([base, relief]);
    const group = new THREE.Group();
    [base, relief].forEach(soup => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(soup.positions, 3));
      geo.computeVertexNormals();
      group.add(new THREE.Mesh(geo, new THREE.MeshBasicMaterial()));
    });
    const exporter = new STLExporter();
    const baseSTL = exporter.parse(group.children[0], { binary: true });
    const reliefSTL = exporter.parse(group.children[1], { binary: true });
    const zip = new JSZip();
    zip.file(`base-${state.format}.stl`, baseSTL);
    zip.file(`codigo-${state.format}.stl`, reliefSTL);
    zip.file("LEEME.txt", "Importa los dos archivos STL en tu programa de impresión, colócalos en la posición 0,0 (superpuestos) y asigna un filamento/color distinto a cada pieza:\n- base-*.stl -> color de la base\n- codigo-*.stl -> color del código\n");
    const blob = await zip.generateAsync({ type: "blob" });
    saveBlob(blob, `qr3d-${slugFromPayload()}-${state.format}-stl.zip`);
    notifyDownloaded();
  }

  /* ---------------------------------------------------------------------
   * Three.js live preview (lazy, gated, background-safe)
   * ------------------------------------------------------------------- */
  const viewer = { THREE: null, OrbitControls: null, scene: null, camera: null, renderer: null, controls: null,
    baseMesh: null, reliefMesh: null, isVisible: false, started: false, lastFormat: null, raf: null };

  function webglAvailable() {
    try {
      const c = document.createElement("canvas");
      return !!(window.WebGLRenderingContext && (c.getContext("webgl") || c.getContext("experimental-webgl")));
    } catch (_) { return false; }
  }

  async function initViewer() {
    const root = $("[data-viewer-root]");
    const canvasHost = $("[data-viewer-canvas]");
    const status = $("[data-viewer-status]");
    if (!root || !canvasHost) return;
    if (!webglAvailable()) { status.textContent = "Tu navegador no admite vista 3D — las descargas siguen funcionando con normalidad."; return; }

    try {
      const THREE = await import("three");
      const { OrbitControls } = await import("three/addons/controls/OrbitControls.js");
      viewer.THREE = THREE; viewer.OrbitControls = OrbitControls;
    } catch (e) { console.warn("[viewer] three load failed", e); status.textContent = "No se pudo cargar la vista 3D."; return; }

    const THREE = viewer.THREE;
    const w = canvasHost.clientWidth || 300, h = canvasHost.clientHeight || 225;
    viewer.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    viewer.renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 2));
    viewer.renderer.setSize(w, h);
    canvasHost.appendChild(viewer.renderer.domElement);

    viewer.scene = new THREE.Scene();
    viewer.camera = new THREE.PerspectiveCamera(35, w / h, 0.1, 2000);
    viewer.controls = new viewer.OrbitControls(viewer.camera, viewer.renderer.domElement);
    viewer.controls.enableDamping = true;
    viewer.controls.dampingFactor = 0.08;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 1.1);
    const dir = new THREE.DirectionalLight(0xffffff, 1.6);
    dir.position.set(60, 100, 80);
    viewer.scene.add(hemi, dir);

    viewer.started = true;
    root.classList.add("is-ready");
    await rebuildViewerModel(true);
    startRenderLoop();
    window.addEventListener("resize", debounce(() => resizeViewer(canvasHost), 150));
  }

  function resizeViewer(canvasHost) {
    if (!viewer.renderer || !viewer.camera) return;
    const w = canvasHost.clientWidth, h = canvasHost.clientHeight;
    if (!w || !h) return;
    viewer.renderer.setSize(w, h);
    viewer.camera.aspect = w / h;
    viewer.camera.updateProjectionMatrix();
  }

  function startRenderLoop() {
    const loop = () => {
      viewer.raf = requestAnimationFrame(loop);
      if (!viewer.isVisible || document.hidden) return;
      viewer.controls && viewer.controls.update();
      viewer.renderer && viewer.camera && viewer.renderer.render(viewer.scene, viewer.camera);
    };
    loop();
  }

  async function rebuildViewerModel(fitCamera) {
    if (!viewer.started) return;
    const myGen = ++genCounter;
    const THREE = viewer.THREE;
    const { base, relief, face } = await buildModelSoups();
    if (myGen !== genCounter) return; // a newer rebuild started meanwhile

    [viewer.baseMesh, viewer.reliefMesh].forEach(m => { if (m) { viewer.scene.remove(m); m.geometry.dispose(); m.material.dispose(); } });

    const makeMesh = (soup, colorHex) => {
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.Float32BufferAttribute(soup.positions, 3));
      geo.computeVertexNormals();
      const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.55, metalness: 0.05 });
      return new THREE.Mesh(geo, mat);
    };
    viewer.baseMesh = makeMesh(base, state.colorBase);
    viewer.reliefMesh = makeMesh(relief, state.colorCode);
    viewer.scene.add(viewer.baseMesh, viewer.reliefMesh);

    if (fitCamera || viewer.lastFormat !== state.format) {
      fitCameraToObject(face);
      viewer.lastFormat = state.format;
    }
  }

  function fitCameraToObject(face) {
    const THREE = viewer.THREE;
    const box = new THREE.Box3().setFromObject(viewer.baseMesh);
    const size = new THREE.Vector3(); box.getSize(size);
    const center = new THREE.Vector3(); box.getCenter(center);
    const radius = size.length() * 0.6;
    const dist = radius / Math.tan((viewer.camera.fov * Math.PI / 180) / 2);
    const dir = state.format === "soporte" ? new THREE.Vector3(0.9, 0.55, 1.1) : new THREE.Vector3(0, 0.15, 1.4);
    dir.normalize();
    viewer.camera.position.copy(center).addScaledVector(dir, dist * 1.15);
    viewer.controls.target.copy(center);
    viewer.controls.update();
  }

  function setupViewerVisibilityGuards() {
    const root = $("[data-viewer-root]");
    if (!root) return;
    let retryTimer = null;
    const tryActivate = () => {
      if (viewer.started) { viewer.isVisible = true; return; }
      if (innerHeight === 0) { retryTimer = setTimeout(tryActivate, 400); return; }
      safe(initViewer, "initViewer");
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        viewer.isVisible = e.isIntersecting;
        if (e.isIntersecting) tryActivate();
      });
    }, { rootMargin: "200px" });
    io.observe(root);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden && !viewer.started) tryActivate();
      if (!document.hidden) viewer.isVisible = true;
    });
  }

  /* ---------------------------------------------------------------------
   * Rebuild pipeline (debounced) — 2D preview always; 3D only if started
   * ------------------------------------------------------------------- */
  const requestRebuild = debounce(() => {
    safe(renderQR2D, "renderQR2D");
    safe(renderWarnings, "renderWarnings");
    if (viewer.started) safe(() => rebuildViewerModel(false), "rebuildViewerModel");
  }, 130);

  /* ---------------------------------------------------------------------
   * Ad placeholders: download interstitial + corner toast
   * ------------------------------------------------------------------- */
  function notifyDownloaded() {
    document.dispatchEvent(new CustomEvent("qr:downloaded"));
  }
  function initDownloadDialog() {
    const dialog = $("[data-download-dialog]");
    if (!dialog) return;
    document.addEventListener("qr:downloaded", () => {
      setTimeout(() => { try { dialog.showModal(); } catch (_) {} }, 350);
    });
    $$("[data-dialog-close]", dialog).forEach(btn => btn.addEventListener("click", () => dialog.close()));
    dialog.addEventListener("click", (e) => { if (e.target === dialog) dialog.close(); });
  }
  function initCornerToast() {
    const toast = $("[data-corner-toast]");
    if (!toast) return;
    if (sessionStorage.getItem("qr3d_toast_dismissed")) return;
    setTimeout(() => { toast.hidden = false; }, 6000);
    $("[data-corner-toast-close]", toast).addEventListener("click", () => {
      toast.hidden = true;
      sessionStorage.setItem("qr3d_toast_dismissed", "1");
    });
  }

  /* ---------------------------------------------------------------------
   * Control wiring
   * ------------------------------------------------------------------- */
  function initControls() {
    $$(".seg-btn").forEach(btn => btn.addEventListener("click", () => {
      state.contentType = btn.dataset.contentType;
      $$(".seg-btn").forEach(b => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
      $('[data-panel="link"]').hidden = state.contentType !== "link";
      $('[data-panel="wifi"]').hidden = state.contentType !== "wifi";
      requestRebuild();
    }));

    $("#qr-text").addEventListener("input", (e) => { state.text = e.target.value; requestRebuild(); });
    $("#wifi-ssid").addEventListener("input", (e) => { state.wifi.ssid = e.target.value; requestRebuild(); });
    $("#wifi-pass").addEventListener("input", (e) => { state.wifi.pass = e.target.value; requestRebuild(); });
    $("#wifi-enc").addEventListener("change", (e) => { state.wifi.enc = e.target.value; requestRebuild(); });

    $("#color-base").addEventListener("input", (e) => { state.colorBase = e.target.value; requestRebuild(); });
    $("#color-code").addEventListener("input", (e) => { state.colorCode = e.target.value; requestRebuild(); });
    $("#color-code-2").addEventListener("input", (e) => { state.colorCode2 = e.target.value; requestRebuild(); });
    $("#gradient-type").addEventListener("change", (e) => { state.gradientType = e.target.value; requestRebuild(); });

    $$("[data-code-mode]").forEach(btn => btn.addEventListener("click", () => {
      state.codeMode = btn.dataset.codeMode;
      $$("[data-code-mode]").forEach(b => { b.classList.toggle("is-active", b === btn); b.setAttribute("aria-selected", b === btn); });
      $("[data-gradient-row]").hidden = state.codeMode !== "gradient";
      requestRebuild();
    }));

    $("#frame-text").addEventListener("input", debounce((e) => { state.frameText = e.target.value; }, 150));

    $("#logo-upload").addEventListener("change", (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        state.center = { type: "logo", value: reader.result };
        $$(".emoji-btn").forEach(b => b.classList.remove("is-active"));
        $("[data-clear-center]").hidden = false;
        requestRebuild();
      };
      reader.readAsDataURL(file);
    });
    $("[data-clear-center]").addEventListener("click", () => {
      state.center = { type: null, value: null };
      $$(".emoji-btn").forEach(b => b.classList.remove("is-active"));
      $("#logo-upload").value = "";
      $("[data-clear-center]").hidden = true;
      requestRebuild();
    });

    $$(".format-btn").forEach(btn => btn.addEventListener("click", () => {
      state.format = btn.dataset.format;
      $$(".format-btn").forEach(b => b.classList.toggle("is-active", b === btn));
      requestRebuild();
    }));

    $("#object-text").addEventListener("input", debounce((e) => { state.objectText = e.target.value; requestRebuild(); }, 200));

    $$("[data-download]").forEach(btn => btn.addEventListener("click", async () => {
      const kind = btn.dataset.download;
      const original = btn.textContent;
      btn.textContent = "Generando…";
      btn.disabled = true;
      try {
        if (kind === "png" || kind === "svg") await downloadImage(kind);
        else if (kind === "3mf") await export3MF();
        else if (kind === "stl") await exportSTL();
      } catch (err) {
        console.warn("[download]", err);
        alert("No se pudo generar el archivo. Prueba de nuevo o simplifica el diseño.");
      } finally {
        btn.textContent = original;
        btn.disabled = false;
      }
    }));
  }

  /* ---------------------------------------------------------------------
   * Boot
   * ------------------------------------------------------------------- */
  function boot() {
    safe(mountHowItWorks, "mountHowItWorks");
    safe(mountUseCases, "mountUseCases");
    safe(mountFaq, "mountFaq");
    safe(mountStyleGrid, "mountStyleGrid");
    safe(mountColorPresets, "mountColorPresets");
    safe(mountEmojiPicker, "mountEmojiPicker");
    safe(mountFrameGrid, "mountFrameGrid");
    safe(initControls, "initControls");
    safe(renderQR2D, "renderQR2D");
    safe(renderWarnings, "renderWarnings");
    safe(setupViewerVisibilityGuards, "setupViewerVisibilityGuards");
    safe(initDownloadDialog, "initDownloadDialog");
    safe(initCornerToast, "initCornerToast");
    document.documentElement.classList.add("is-ready");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
