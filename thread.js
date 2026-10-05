// The scroll thread: one curve through every [data-wp] waypoint inside a host element.
// It draws itself as you scroll, lights each node it passes, and carries a traveler
// whose face is decided by the page (aging human on page 1, current industry on page 2).
window.makeThread = function (host, opts) {
  const NS = "http://www.w3.org/2000/svg";
  const svg = document.createElementNS(NS, "svg");
  svg.classList.add("thread-svg");
  const base = document.createElementNS(NS, "path"); base.classList.add("base");
  const live = document.createElementNS(NS, "path"); live.classList.add("live");
  svg.append(base, live);
  host.prepend(svg);
  const trav = document.createElement("div");
  trav.className = "traveler";
  trav.innerHTML = '<span class="emo"></span><small></small>';
  host.append(trav);
  const face = trav.querySelector(".emo"), label = trav.querySelector("small");

  let pts = [], L = 0, samples = [], wps = [];

  function build() {
    wps = [...host.querySelectorAll("[data-wp]")].filter(e => e.offsetParent !== null);
    const hr = host.getBoundingClientRect();
    pts = wps.map(el => {
      const r = el.getBoundingClientRect();
      return { x: r.left + r.width / 2 - hr.left, y: r.top + r.height / 2 - hr.top, el };
    }).sort((a, b) => a.y - b.y);
    svg.setAttribute("width", host.offsetWidth);
    svg.setAttribute("height", host.offsetHeight);
    if (pts.length < 2) return;
    let d = `M${pts[0].x},${pts[0].y}`;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], dy = b.y - a.y;
      // vertical tangents keep y monotonic, so scroll position maps cleanly to a point on the curve
      d += ` C${a.x},${a.y + dy * 0.5} ${b.x},${b.y - dy * 0.5} ${b.x},${b.y}`;
    }
    base.setAttribute("d", d); live.setAttribute("d", d);
    L = live.getTotalLength();
    live.style.strokeDasharray = L;
    samples = [];
    for (let s = 0; s <= L; s += 6) samples.push([s, live.getPointAtLength(s).y]);
    samples.push([L, live.getPointAtLength(L).y]);
    update();
  }

  function lengthAtY(y) {
    let lo = 0, hi = samples.length - 1;
    if (!hi) return 0;
    if (y <= samples[0][1]) return 0;
    if (y >= samples[hi][1]) return L;
    while (hi - lo > 1) { const m = (lo + hi) >> 1; samples[m][1] < y ? lo = m : hi = m; }
    const [s0, y0] = samples[lo], [s1, y1] = samples[hi];
    return s0 + (s1 - s0) * ((y - y0) / Math.max(1e-6, y1 - y0));
  }

  function update() {
    if (!L) return;
    const hr = host.getBoundingClientRect();
    const targetY = innerHeight * 0.55 - hr.top;
    const len = lengthAtY(targetY);
    live.style.strokeDashoffset = L - len;
    const p = live.getPointAtLength(len);
    trav.style.left = p.x + "px"; trav.style.top = p.y + "px";
    trav.style.opacity = len <= 0 ? 0 : 1;
    let current = null;
    for (const pt of pts) {
      const on = pt.y <= p.y + 2;
      pt.el.classList.toggle("lit", on);
      if (on && pt.el.classList.contains("node") && !pt.el.classList.contains("end")) current = pt.el;
    }
    const f = opts.face(len / L, current);
    face.textContent = f.emoji; label.textContent = f.label || "";
    const bar = document.querySelector(".progress");
    if (bar) bar.style.width = Math.min(100, Math.max(0, scrollY / (document.documentElement.scrollHeight - innerHeight) * 100)) + "%";
  }

  let raf = 0;
  addEventListener("scroll", () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); }, { passive: true });
  let t = 0;
  const rebuild = () => { clearTimeout(t); t = setTimeout(build, 80); };
  addEventListener("resize", rebuild);
  new ResizeObserver(rebuild).observe(host);
  if (document.fonts) document.fonts.ready.then(rebuild);
  build();
  return { rebuild: build, update };
};

// Shared helpers
window.fmt = {
  money(m) { // $ millions -> "$2.93T" / "$508B"
    if (m >= 1e6) return "$" + (m / 1e6).toFixed(2) + "T";
    if (m >= 1e3) return "$" + Math.round(m / 1e3) + "B";
    return "$" + Math.round(m) + "M";
  },
  jobs(k) { return k >= 1000 ? (k / 1000).toFixed(1) + "M" : Math.round(k) + "K"; },
  int(n) { return n.toLocaleString("en-US"); },
  pct(x, d = 1) { return x.toFixed(d) + "%"; }
};

window.revealOnScroll = function () {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px" });
  document.querySelectorAll(".reveal, .bar").forEach(el => io.observe(el));
};

window.setupTheme = function () {
  const btn = document.querySelector(".theme-btn");
  let saved = null;
  try { saved = localStorage.getItem("atlas-theme"); } catch (e) {}
  if (saved) document.documentElement.dataset.theme = saved;
  const isDark = () => (document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")) === "dark";
  const paint = () => btn.textContent = isDark() ? "☀️" : "🌙";
  paint();
  btn.onclick = () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("atlas-theme", next); } catch (e) {}
    paint();
  };
};

window.flashHash = function () {
  const go = () => {
    const el = location.hash && document.getElementById(location.hash.slice(1));
    if (!el) return;
    el.scrollIntoView({ block: "start", behavior: "instant" });
    const h = el.querySelector(".chapter-head") || el;
    h.classList.remove("flash"); void h.offsetWidth; h.classList.add("flash");
  };
  addEventListener("hashchange", go);
  setTimeout(go, 150);
};
