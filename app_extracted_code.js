((Co = "gullycrix.v1.matches"),
  (T0 = "gullycrix.v1.settings"),
  (wc = { sound: !0, animations: !0, name: "" }),
  (w0 = z.createContext(null)));
function dT(n) {
  const s = n;
  return (
    !!s &&
    typeof s.id == "string" &&
    Array.isArray(s.events) &&
    typeof s.cursor == "number" &&
    !!s.config
  );
}
function hT() {
  try {
    const n = localStorage.getItem(Co);
    if (!n) return { matches: [], note: null };
    const s = JSON.parse(n);
    if (!Array.isArray(s)) throw new Error("bad shape");
    const l = s.filter(dT),
      o = s.length - l.length;
    return {
      matches: l,
      note: o
        ? `${o} damaged match record${o > 1 ? "s were" : " was"} skipped while recovering your history.`
        : null,
    };
  } catch {
    try {
      const n = localStorage.getItem(Co);
      n && localStorage.setItem(Co + ".corrupt." + Date.now(), n);
    } catch {}
    return {
      matches: [],
      note: "Saved matches could not be read. A backup copy of the raw data was kept on this device.",
    };
  }
}
function mT() {
  try {
    const n = localStorage.getItem(T0);
    return n ? { ...wc, ...JSON.parse(n) } : wc;
  } catch {
    return wc;
  }
}
function pT({ children: n }) {
  const s = z.useMemo(hT, []),
    [l, o] = z.useState(s.matches),
    [c, d] = z.useState(mT),
    [f, p] = z.useState(null),
    [m, g] = z.useState(s.note),
    x = z.useRef(!0),
    v = z.useCallback((j) => {
      try {
        (localStorage.setItem(Co, JSON.stringify(j)), p(null));
      } catch (A) {
        const C =
          A instanceof DOMException && /quota/i.test(A.name + A.message);
        p(
          C
            ? "Device storage is full. Remove old matches or team logos, then retry."
            : "Could not save to this device. Your latest changes live only in this tab.",
        );
      }
    }, []);
  (z.useEffect(() => {
    if (x.current) {
      x.current = !1;
      return;
    }
    v(l);
  }, [l, v]),
    z.useEffect(() => {
      try {
        localStorage.setItem(T0, JSON.stringify(c));
      } catch {
        p("Settings could not be saved on this device.");
      }
      document.documentElement.classList.toggle("no-anim", !c.animations);
    }, [c]));
  const S = {
    matches: l,
    settings: c,
    saveError: f,
    recoveryNote: m,
    saveMatch: (j) =>
      o((A) => {
        const C = A.findIndex((H) => H.id === j.id);
        if (C === -1) return [j, ...A];
        const k = A.slice();
        return ((k[C] = j), k);
      }),
    deleteMatch: (j) => o((A) => A.filter((C) => C.id !== j)),
    getMatch: (j) => l.find((A) => A.id === j),
    updateSettings: (j) => d((A) => ({ ...A, ...j })),
    retrySave: () => v(l),
    dismissRecovery: () => g(null),
    clearAll: () => o([]),
  };
  return h.jsx(w0.Provider, { value: S, children: n });
}
function Mn() {
  const n = z.useContext(w0);
  if (!n) throw new Error("useStore outside provider");
  return n;
}
const Tf = z.createContext({});
function wf(n) {
  const s = z.useRef(null);
  return (s.current === null && (s.current = n()), s.current);
}
const gT = typeof window < "u",
  Ef = gT ? z.useLayoutEffect : z.useEffect,
  Jo = z.createContext(null);
function Af(n, s) {
  n.indexOf(s) === -1 && n.push(s);
}
function Lo(n, s) {
  const l = n.indexOf(s);
  l > -1 && n.splice(l, 1);
}
const un = (n, s, l) => (l > s ? s : l < n ? n : l);
let Wo = () => {};
const ia = {},
  E0 = (n) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(n),
  A0 = (n) => typeof n == "object" && n !== null,
  C0 = (n) => /^0[^.\s]+$/u.test(n);
function j0(n) {
  let s;
  return () => (s === void 0 && (s = n()), s);
}
const Fe = (n) => n,
  tl = (...n) => n.reduce((s, l) => (o) => l(s(o))),
  Qi = (n, s, l) => {
    const o = s - n;
    return o ? (l - n) / o : 1;
  };
class Cf {
  constructor() {
    this.subscriptions = [];
  }
  add(s) {
    return (Af(this.subscriptions, s), () => Lo(this.subscriptions, s));
  }
  notify(s, l, o) {
    const c = this.subscriptions.length;
    if (c)
      if (c === 1) this.subscriptions[0](s, l, o);
      else
        for (let d = 0; d < c; d++) {
          const f = this.subscriptions[d];
          f && f(s, l, o);
        }
  }
  getSize() {
    return this.subscriptions.length;
  }
  clear() {
    this.subscriptions.length = 0;
  }
}
const De = (n) => n * 1e3,
  Ge = (n) => n / 1e3,
  M0 = (n, s) => (s ? n * (1e3 / s) : 0),
  N0 = (n, s, l) =>
    (((1 - 3 * l + 3 * s) * n + (3 * l - 6 * s)) * n + 3 * s) * n,
  yT = 1e-7,
  xT = 12;
function bT(n, s, l, o, c) {
  let d,
    f,
    p = 0;
  do ((f = s + (l - s) / 2), (d = N0(f, o, c) - n), d > 0 ? (l = f) : (s = f));
  while (Math.abs(d) > yT && ++p < xT);
  return f;
}
function el(n, s, l, o) {
  if (n === s && l === o) return Fe;
  const c = (d) => bT(d, 0, 1, n, l);
  return (d) => (d === 0 || d === 1 ? d : N0(c(d), s, o));
}
const R0 = (n) => (s) => (s <= 0.5 ? n(2 * s) / 2 : (2 - n(2 * (1 - s))) / 2),
  D0 = (n) => (s) => 1 - n(1 - s),
  k0 = el(0.33, 1.53, 0.69, 0.99),
  jf = D0(k0),
  O0 = R0(jf),
  B0 = (n) =>
    n >= 1
      ? 1
      : (n *= 2) < 1
        ? 0.5 * jf(n)
        : 0.5 * (2 - Math.pow(2, -10 * (n - 1))),
  Mf = (n) => 1 - Math.sin(Math.acos(n)),
  z0 = D0(Mf),
  V0 = R0(Mf),
  vT = el(0.42, 0, 1, 1),
  ST = el(0, 0, 0.58, 1),
  _0 = el(0.42, 0, 0.58, 1),
  TT = (n) => Array.isArray(n) && typeof n[0] != "number",
  L0 = (n) => Array.isArray(n) && typeof n[0] == "number",
  wT = {
    linear: Fe,
    easeIn: vT,
    easeInOut: _0,
    easeOut: ST,
    circIn: Mf,
    circInOut: V0,
    circOut: z0,
    backIn: jf,
    backInOut: O0,
    backOut: k0,
    anticipate: B0,
  },
  ET = (n) => typeof n == "string",
  xg = (n) => {
    if (L0(n)) {
      Wo(n.length === 4);
      const [s, l, o, c] = n;
      return el(s, l, o, c);
    } else if (ET(n)) return wT[n];
    return n;
  },
  So = [
    "setup",
    "read",
    "resolveKeyframes",
    "preUpdate",
    "update",
    "preRender",
    "render",
    "postRender",
  ];
function AT(n) {
  let s = new Set(),
    l = new Set(),
    o = !1,
    c = !1;
  const d = new WeakSet();
  let f = { delta: 0, timestamp: 0, isProcessing: !1 };
  function p(g) {
    (d.has(g) && (m.schedule(g), n()), g(f));
  }
  const m = {
    schedule: (g, x = !1, v = !1) => {
      const j = v && o ? s : l;
      return (x && d.add(g), j.add(g), g);
    },
    cancel: (g) => {
      (l.delete(g), d.delete(g));
    },
    process: (g) => {
      if (((f = g), o)) {
        c = !0;
        return;
      }
      o = !0;
      const x = s;
      ((s = l),
        (l = x),
        s.forEach(p),
        s.clear(),
        (o = !1),
        c && ((c = !1), m.process(g)));
    },
  };
  return m;
}
const CT = 40;
function U0(n, s) {
  let l = !1,
    o = !0;
  const c = { delta: 0, timestamp: 0, isProcessing: !1 },
    d = () => (l = !0),
    f = So.reduce((L, K) => ((L[K] = AT(d)), L), {}),
    {
      setup: p,
      read: m,
      resolveKeyframes: g,
      preUpdate: x,
      update: v,
      preRender: S,
      render: j,
      postRender: A,
    } = f,
    C = () => {
      const L = ia.useManualTiming,
        K = L ? c.timestamp : performance.now();
      ((l = !1),
        L ||
          (c.delta = o ? 1e3 / 60 : Math.max(Math.min(K - c.timestamp, CT), 1)),
        (c.timestamp = K),
        (c.isProcessing = !0),
        p.process(c),
        m.process(c),
        g.process(c),
        x.process(c),
        v.process(c),
        S.process(c),
        j.process(c),
        A.process(c),
        (c.isProcessing = !1),
        l && s && ((o = !1), n(C)));
    },
    k = () => {
      ((l = !0), (o = !0), c.isProcessing || n(C));
    };
  return {
    schedule: So.reduce((L, K) => {
      const P = f[K];
      return (
        (L[K] = (st, nt = !1, V = !1) => (l || k(), P.schedule(st, nt, V))),
        L
      );
    }, {}),
    cancel: (L) => {
      for (let K = 0; K < So.length; K++) f[So[K]].cancel(L);
    },
    state: c,
    steps: f,
  };
}
const {
  schedule: _t,
  cancel: la,
  state: re,
  steps: Ec,
} = U0(typeof requestAnimationFrame < "u" ? requestAnimationFrame : Fe, !0);
let jo;
function jT() {
  jo = void 0;
}
const pe = {
    now: () => (
      jo === void 0 &&
        pe.set(
          re.isProcessing || ia.useManualTiming
            ? re.timestamp
            : performance.now(),
        ),
      jo
    ),
    set: (n) => {
      ((jo = n), queueMicrotask(jT));
    },
  },
  H0 = (n) => (s) => typeof s == "string" && s.startsWith(n),
  G0 = H0("--"),
  MT = H0("var(--"),
  Nf = (n) => (MT(n) ? NT.test(n.split("/*")[0].trim()) : !1),
  NT =
    /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
function bg(n) {
  return typeof n != "string" ? !1 : n.split("/*")[0].includes("var(--");
}
const Os = {
    test: (n) => typeof n == "number",
    parse: parseFloat,
    transform: (n) => n,
  },
  Pi = { ...Os, transform: (n) => un(0, 1, n) },
  To = { ...Os, default: 1 },
  Fi = (n) => Math.round(n * 1e5) / 1e5,
  Rf = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
function RT(n) {
  return n == null;
}
const DT =
    /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,
  Df = (n, s) => (l) =>
    !!(
      (typeof l == "string" && DT.test(l) && l.startsWith(n)) ||
      (s && !RT(l) && Object.prototype.hasOwnProperty.call(l, s))
    ),
  F0 = (n, s, l) => (o) => {
    if (typeof o != "string") return o;
    const [c, d, f, p] = o.match(Rf);
    return {
      [n]: parseFloat(c),
      [s]: parseFloat(d),
      [l]: parseFloat(f),
      alpha: p !== void 0 ? parseFloat(p) : 1,
    };
  },
  kT = (n) => un(0, 255, n),
  Ac = { ...Os, transform: (n) => Math.round(kT(n)) },
  ka = {
    test: Df("rgb", "red"),
    parse: F0("red", "green", "blue"),
    transform: ({ red: n, green: s, blue: l, alpha: o = 1 }) =>
      "rgba(" +
      Ac.transform(n) +
      ", " +
      Ac.transform(s) +
      ", " +
      Ac.transform(l) +
      ", " +
      Fi(Pi.transform(o)) +
      ")",
  };
function OT(n) {
  let s = "",
    l = "",
    o = "",
    c = "";
  return (
    n.length > 5
      ? ((s = n.substring(1, 3)),
        (l = n.substring(3, 5)),
        (o = n.substring(5, 7)),
        (c = n.substring(7, 9)))
      : ((s = n.substring(1, 2)),
        (l = n.substring(2, 3)),
        (o = n.substring(3, 4)),
        (c = n.substring(4, 5)),
        (s += s),
        (l += l),
        (o += o),
        (c += c)),
    {
      red: parseInt(s, 16),
      green: parseInt(l, 16),
      blue: parseInt(o, 16),
      alpha: c ? parseInt(c, 16) / 255 : 1,
    }
  );
}
const Xc = { test: Df("#"), parse: OT, transform: ka.transform },
  nl = (n) => ({
    test: (s) =>
      typeof s == "string" && s.endsWith(n) && s.split(" ").length === 1,
    parse: parseFloat,
    transform: (s) => `${s}${n}`,
  }),
  jn = nl("deg"),
  rn = nl("%"),
  ot = nl("px"),
  BT = nl("vh"),
  zT = nl("vw"),
  vg = {
    ...rn,
    parse: (n) => rn.parse(n) / 100,
    transform: (n) => rn.transform(n * 100),
  },
  Cs = {
    test: Df("hsl", "hue"),
    parse: F0("hue", "saturation", "lightness"),
    transform: ({ hue: n, saturation: s, lightness: l, alpha: o = 1 }) =>
      "hsla(" +
      Math.round(n) +
      ", " +
      rn.transform(Fi(s)) +
      ", " +
      rn.transform(Fi(l)) +
      ", " +
      Fi(Pi.transform(o)) +
      ")",
  },
  $t = {
    test: (n) => ka.test(n) || Xc.test(n) || Cs.test(n),
    parse: (n) =>
      ka.test(n) ? ka.parse(n) : Cs.test(n) ? Cs.parse(n) : Xc.parse(n),
    transform: (n) =>
      typeof n == "string"
        ? n
        : n.hasOwnProperty("red")
          ? ka.transform(n)
          : Cs.transform(n),
    getAnimatableNone: (n) => {
      const s = $t.parse(n);
      return ((s.alpha = 0), $t.transform(s));
    },
  },
  VT =
    /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
function _T(n) {
  return (
    isNaN(n) &&
    typeof n == "string" &&
    (n.match(Rf)?.length || 0) + (n.match(VT)?.length || 0) > 0
  );
}
const q0 = "number",
  Y0 = "color",
  LT = "var",
  UT = "var(",
  Sg = "${}",
  HT =
    /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
function Rs(n) {
  const s = n.toString(),
    l = [],
    o = { color: [], number: [], var: [] },
    c = [];
  let d = 0;
  const p = s
    .replace(
      HT,
      (m) => (
        $t.test(m)
          ? (o.color.push(d), c.push(Y0), l.push($t.parse(m)))
          : m.startsWith(UT)
            ? (o.var.push(d), c.push(LT), l.push(m))
            : (o.number.push(d), c.push(q0), l.push(parseFloat(m))),
        ++d,
        Sg
      ),
    )
    .split(Sg);
  return { values: l, split: p, indexes: o, types: c };
}
function GT(n) {
  return Rs(n).values;
}
function X0({ split: n, types: s }) {
  const l = n.length;
  return (o) => {
    let c = "";
    for (let d = 0; d < l; d++)
      if (((c += n[d]), o[d] !== void 0)) {
        const f = s[d];
        f === q0
          ? (c += Fi(o[d]))
          : f === Y0
            ? (c += $t.transform(o[d]))
            : (c += o[d]);
      }
    return c;
  };
}
function FT(n) {
  return X0(Rs(n));
}
const qT = (n) =>
    typeof n == "number" ? 0 : $t.test(n) ? $t.getAnimatableNone(n) : n,
  YT = (n, s) =>
    typeof n == "number" ? (s?.trim().endsWith("/") ? n : 0) : qT(n);
function XT(n) {
  const s = Rs(n);
  return X0(s)(s.values.map((o, c) => YT(o, s.split[c])));
}
const $e = {
  test: _T,
  parse: GT,
  createTransformer: FT,
  getAnimatableNone: XT,
};
function Cc(n, s, l) {
  return (
    l < 0 && (l += 1),
    l > 1 && (l -= 1),
    l < 1 / 6
      ? n + (s - n) * 6 * l
      : l < 1 / 2
        ? s
        : l < 2 / 3
          ? n + (s - n) * (2 / 3 - l) * 6
          : n
  );
}
function KT({ hue: n, saturation: s, lightness: l, alpha: o }) {
  ((n /= 360), (s /= 100), (l /= 100));
  let c = 0,
    d = 0,
    f = 0;
  if (!s) c = d = f = l;
  else {
    const p = l < 0.5 ? l * (1 + s) : l + s - l * s,
      m = 2 * l - p;
    ((c = Cc(m, p, n + 1 / 3)), (d = Cc(m, p, n)), (f = Cc(m, p, n - 1 / 3)));
  }
  return {
    red: Math.round(c * 255),
    green: Math.round(d * 255),
    blue: Math.round(f * 255),
    alpha: o,
  };
}
function Uo(n, s) {
  return (l) => (l > 0 ? s : n);
}
const Vt = (n, s, l) => n + (s - n) * l,
  jc = (n, s, l) => {
    const o = n * n,
      c = l * (s * s - o) + o;
    return c < 0 ? 0 : Math.sqrt(c);
  },
  ZT = [Xc, ka, Cs],
  QT = (n) => ZT.find((s) => s.test(n));
function Tg(n) {
  const s = QT(n);
  if (!s) return !1;
  let l = s.parse(n);
  return (s === Cs && (l = KT(l)), l);
}
const wg = (n, s) => {
    const l = Tg(n),
      o = Tg(s);
    if (!l || !o) return Uo(n, s);
    const c = { ...l };
    return (d) => (
      (c.red = jc(l.red, o.red, d)),
      (c.green = jc(l.green, o.green, d)),
      (c.blue = jc(l.blue, o.blue, d)),
      (c.alpha = Vt(l.alpha, o.alpha, d)),
      ka.transform(c)
    );
  },
  Kc = new Set(["none", "hidden"]);
function PT(n, s) {
  return Kc.has(n) ? (l) => (l <= 0 ? n : s) : (l) => (l >= 1 ? s : n);
}
function $T(n, s) {
  return (l) => Vt(n, s, l);
}
function kf(n) {
  return typeof n == "number"
    ? $T
    : typeof n == "string"
      ? Nf(n)
        ? Uo
        : $t.test(n)
          ? wg
          : IT
      : Array.isArray(n)
        ? K0
        : typeof n == "object"
          ? $t.test(n)
            ? wg
            : JT
          : Uo;
}
function K0(n, s) {
  const l = [...n],
    o = l.length,
    c = n.map((d, f) => kf(d)(d, s[f]));
  return (d) => {
    for (let f = 0; f < o; f++) l[f] = c[f](d);
    return l;
  };
}
function JT(n, s) {
  const l = { ...n, ...s },
    o = {};
  for (const c in l)
    n[c] !== void 0 && s[c] !== void 0 && (o[c] = kf(n[c])(n[c], s[c]));
  return (c) => {
    for (const d in o) l[d] = o[d](c);
    return l;
  };
}
function WT(n, s) {
  const l = [],
    o = { color: 0, var: 0, number: 0 };
  for (let c = 0; c < s.values.length; c++) {
    const d = s.types[c],
      f = n.indexes[d][o[d]],
      p = n.values[f] ?? 0;
    ((l[c] = p), o[d]++);
  }
  return l;
}
const IT = (n, s) => {
  const l = $e.createTransformer(s),
    o = Rs(n),
    c = Rs(s);
  return o.indexes.var.length === c.indexes.var.length &&
    o.indexes.color.length === c.indexes.color.length &&
    o.indexes.number.length >= c.indexes.number.length
    ? (Kc.has(n) && !c.values.length) || (Kc.has(s) && !o.values.length)
      ? PT(n, s)
      : tl(K0(WT(o, c), c.values), l)
    : Uo(n, s);
};
function Z0(n, s, l) {
  return typeof n == "number" && typeof s == "number" && typeof l == "number"
    ? Vt(n, s, l)
    : kf(n)(n, s);
}
const tw = (n) => {
    const s = ({ timestamp: l }) => n(l);
    return {
      start: (l = !0) => _t.update(s, l),
      stop: () => la(s),
      now: () => (re.isProcessing ? re.timestamp : pe.now()),
    };
  },
  Q0 = (n, s, l = 10) => {
    let o = "";
    const c = Math.max(Math.round(s / l), 2);
    for (let d = 0; d < c; d++)
      o += Math.round(n(d / (c - 1)) * 1e4) / 1e4 + ", ";
    return `linear(${o.substring(0, o.length - 2)})`;
  },
  Ho = 2e4;
function Of(n) {
  let s = 0;
  const l = 50;
  let o = n.next(s);
  for (; !o.done && s < Ho;) ((s += l), (o = n.next(s)));
  return s >= Ho ? 1 / 0 : s;
}
function ew(n, s = 100, l) {
  const o = l({ ...n, keyframes: [0, s] }),
    c = Math.min(Of(o), Ho);
  return {
    type: "keyframes",
    ease: (d) => o.next(c * d).value / s,
    duration: Ge(c),
  };
}
const Xt = {
  stiffness: 100,
  damping: 10,
  mass: 1,
  velocity: 0,
  duration: 800,
  bounce: 0.3,
  visualDuration: 0.3,
  restSpeed: { granular: 0.01, default: 2 },
  restDelta: { granular: 0.005, default: 0.5 },
  minDuration: 0.01,
  maxDuration: 10,
  minDamping: 0.05,
  maxDamping: 1,
};
function Zc(n, s) {
  return n * Math.sqrt(1 - s * s);
}
const nw = 12;
function aw(n, s, l) {
  let o = l;
  for (let c = 1; c < nw; c++) o = o - n(o) / s(o);
  return o;
}
const Mc = 0.001;
function sw({
  duration: n = Xt.duration,
  bounce: s = Xt.bounce,
  velocity: l = Xt.velocity,
  mass: o = Xt.mass,
}) {
  let c,
    d,
    f = 1 - s;
  ((f = un(Xt.minDamping, Xt.maxDamping, f)),
    (n = un(Xt.minDuration, Xt.maxDuration, Ge(n))),
    f < 1
      ? ((c = (g) => {
          const x = g * f,
            v = x * n,
            S = x - l,
            j = Zc(g, f),
            A = Math.exp(-v);
          return Mc - (S / j) * A;
        }),
        (d = (g) => {
          const v = g * f * n,
            S = v * l + l,
            j = Math.pow(f, 2) * Math.pow(g, 2) * n,
            A = Math.exp(-v),
            C = Zc(Math.pow(g, 2), f);
          return ((-c(g) + Mc > 0 ? -1 : 1) * ((S - j) * A)) / C;
        }))
      : ((c = (g) => {
          const x = Math.exp(-g * n),
            v = (g - l) * n + 1;
          return -Mc + x * v;
        }),
        (d = (g) => {
          const x = Math.exp(-g * n),
            v = (l - g) * (n * n);
          return x * v;
        })));
  const p = 5 / n,
    m = aw(c, d, p);
  if (((n = De(n)), isNaN(m)))
    return { stiffness: Xt.stiffness, damping: Xt.damping, duration: n };
  {
    const g = Math.pow(m, 2) * o;
    return { stiffness: g, damping: f * 2 * Math.sqrt(o * g), duration: n };
  }
}
const iw = ["duration", "bounce"],
  lw = ["stiffness", "damping", "mass"];
function Eg(n, s) {
  return s.some((l) => n[l] !== void 0);
}
function ow(n) {
  let s = {
    velocity: Xt.velocity,
    stiffness: Xt.stiffness,
    damping: Xt.damping,
    mass: Xt.mass,
    isResolvedFromDuration: !1,
    ...n,
  };
  if (!Eg(n, lw) && Eg(n, iw))
    if (((s.velocity = 0), n.visualDuration)) {
      const l = n.visualDuration,
        o = (2 * Math.PI) / (l * 1.2),
        c = o * o,
        d = 2 * un(0.05, 1, 1 - (n.bounce || 0)) * Math.sqrt(c);
      s = { ...s, mass: Xt.mass, stiffness: c, damping: d };
    } else {
      const l = sw({ ...n, velocity: 0 });
      ((s = { ...s, ...l, mass: Xt.mass }), (s.isResolvedFromDuration = !0));
    }
  return s;
}
function Go(n = Xt.visualDuration, s = Xt.bounce) {
  const l =
    typeof n != "object"
      ? { visualDuration: n, keyframes: [0, 1], bounce: s }
      : n;
  let { restSpeed: o, restDelta: c } = l;
  const d = l.keyframes[0],
    f = l.keyframes[l.keyframes.length - 1],
    p = { done: !1, value: d },
    {
      stiffness: m,
      damping: g,
      mass: x,
      duration: v,
      velocity: S,
      isResolvedFromDuration: j,
    } = ow({ ...l, velocity: -Ge(l.velocity || 0) }),
    A = S || 0,
    C = g / (2 * Math.sqrt(m * x)),
    k = f - d,
    H = Ge(Math.sqrt(m / x)),
    U = Math.abs(k) < 5;
  (o || (o = U ? Xt.restSpeed.granular : Xt.restSpeed.default),
    c || (c = U ? Xt.restDelta.granular : Xt.restDelta.default));
  let L, K, P, st, nt, V;
  if (C < 1)
    ((P = Zc(H, C)),
      (st = (A + C * H * k) / P),
      (L = (Z) => {
        const mt = Math.exp(-C * H * Z);
        return f - mt * (st * Math.sin(P * Z) + k * Math.cos(P * Z));
      }),
      (nt = C * H * st + k * P),
      (V = C * H * k - st * P),
      (K = (Z) =>
        Math.exp(-C * H * Z) * (nt * Math.sin(P * Z) + V * Math.cos(P * Z))));
  else if (C === 1) {
    L = (mt) => f - Math.exp(-H * mt) * (k + (A + H * k) * mt);
    const Z = A + H * k;
    K = (mt) => Math.exp(-H * mt) * (H * Z * mt - A);
  } else {
    const Z = H * Math.sqrt(C * C - 1);
    L = (vt) => {
      const pt = Math.exp(-C * H * vt),
        O = Math.min(Z * vt, 300);
      return (
        f - (pt * ((A + C * H * k) * Math.sinh(O) + Z * k * Math.cosh(O))) / Z
      );
    };
    const mt = (A + C * H * k) / Z,
      ht = C * H * mt - k * Z,
      Ut = C * H * k - mt * Z;
    K = (vt) => {
      const pt = Math.exp(-C * H * vt),
        O = Math.min(Z * vt, 300);
      return pt * (ht * Math.sinh(O) + Ut * Math.cosh(O));
    };
  }
  const J = {
    calculatedDuration: (j && v) || null,
    velocity: (Z) => De(K(Z)),
    next: (Z) => {
      if (!j && C < 1) {
        const ht = Math.exp(-C * H * Z),
          Ut = Math.sin(P * Z),
          vt = Math.cos(P * Z),
          pt = f - ht * (st * Ut + k * vt),
          O = De(ht * (nt * Ut + V * vt));
        return (
          (p.done = Math.abs(O) <= o && Math.abs(f - pt) <= c),
          (p.value = p.done ? f : pt),
          p
        );
      }
      const mt = L(Z);
      if (j) p.done = Z >= v;
      else {
        const ht = De(K(Z));
        p.done = Math.abs(ht) <= o && Math.abs(f - mt) <= c;
      }
      return ((p.value = p.done ? f : mt), p);
    },
    toString: () => {
      const Z = Math.min(Of(J), Ho),
        mt = Q0((ht) => J.next(Z * ht).value, Z, 30);
      return Z + "ms " + mt;
    },
    toTransition: () => {},
  };
  return J;
}
Go.applyToOptions = (n) => {
  const s = ew(n, 100, Go);
  return (
    (n.ease = s.ease),
    (n.duration = De(s.duration)),
    (n.type = "keyframes"),
    n
  );
};
const rw = 5;
function P0(n, s, l) {
  const o = Math.max(s - rw, 0);
  return M0(l - n(o), s - o);
}
function Qc({
  keyframes: n,
  velocity: s = 0,
  power: l = 0.8,
  timeConstant: o = 325,
  bounceDamping: c = 10,
  bounceStiffness: d = 500,
  modifyTarget: f,
  min: p,
  max: m,
  restDelta: g = 0.5,
  restSpeed: x,
}) {
  const v = n[0],
    S = { done: !1, value: v },
    j = (V) => (p !== void 0 && V < p) || (m !== void 0 && V > m),
    A = (V) =>
      p === void 0
        ? m
        : m === void 0 || Math.abs(p - V) < Math.abs(m - V)
          ? p
          : m;
  let C = l * s;
  const k = v + C,
    H = f === void 0 ? k : f(k);
  H !== k && (C = H - v);
  const U = (V) => -C * Math.exp(-V / o),
    L = (V) => H + U(V),
    K = (V) => {
      const J = U(V),
        Z = L(V);
      ((S.done = Math.abs(J) <= g), (S.value = S.done ? H : Z));
    };
  let P, st;
  const nt = (V) => {
    j(S.value) &&
      ((P = V),
      (st = Go({
        keyframes: [S.value, A(S.value)],
        velocity: P0(L, V, S.value),
        damping: c,
        stiffness: d,
        restDelta: g,
        restSpeed: x,
      })));
  };
  return (
    nt(0),
    {
      calculatedDuration: null,
      next: (V) => {
        let J = !1;
        return (
          !st && P === void 0 && ((J = !0), K(V), nt(V)),
          P !== void 0 && V >= P ? st.next(V - P) : (!J && K(V), S)
        );
      },
    }
  );
}
function uw(n, s, l) {
  const o = [],
    c = l || ia.mix || Z0,
    d = n.length - 1;
  for (let f = 0; f < d; f++) {
    let p = c(n[f], n[f + 1]);
    if (s) {
      const m = Array.isArray(s) ? s[f] || Fe : s;
      p = tl(m, p);
    }
    o.push(p);
  }
  return o;
}
function cw(n, s, { clamp: l = !0, ease: o, mixer: c } = {}) {
  const d = n.length;
  if ((Wo(d === s.length), d === 1)) return () => s[0];
  if (d === 2 && s[0] === s[1]) return () => s[1];
  const f = n[0] === n[1];
  n[0] > n[d - 1] && ((n = [...n].reverse()), (s = [...s].reverse()));
  const p = uw(s, o, c),
    m = p.length,
    g = (x) => {
      if (f && x < n[0]) return s[0];
      let v = 0;
      if (m > 1) for (; v < n.length - 2 && !(x < n[v + 1]); v++);
      const S = Qi(n[v], n[v + 1], x);
      return p[v](S);
    };
  return l ? (x) => g(un(n[0], n[d - 1], x)) : g;
}
function fw(n, s) {
  const l = n[n.length - 1];
  for (let o = 1; o <= s; o++) {
    const c = Qi(0, s, o);
    n.push(Vt(l, 1, c));
  }
}
function dw(n) {
  const s = [0];
  return (fw(s, n.length - 1), s);
}
function hw(n, s) {
  return n.map((l) => l * s);
}
function mw(n, s) {
  return n.map(() => s || _0).splice(0, n.length - 1);
}
function qi({
  duration: n = 300,
  keyframes: s,
  times: l,
  ease: o = "easeInOut",
}) {
  const c = TT(o) ? o.map(xg) : xg(o),
    d = { done: !1, value: s[0] },
    f = hw(l && l.length === s.length ? l : dw(s), n),
    p = cw(f, s, { ease: Array.isArray(c) ? c : mw(s, c) });
  return {
    calculatedDuration: n,
    next: (m) => ((d.value = p(m)), (d.done = m >= n), d),
  };
}
const pw = (n) => n !== null;
function Io(n, { repeat: s, repeatType: l = "loop" }, o, c = 1) {
  const d = n.filter(pw),
    p = c < 0 || (s && l !== "loop" && s % 2 === 1) ? 0 : d.length - 1;
  return !p || o === void 0 ? d[p] : o;
}
const gw = { decay: Qc, inertia: Qc, tween: qi, keyframes: qi, spring: Go };
function $0(n) {
  typeof n.type == "string" && (n.type = gw[n.type]);
}
class Bf {
  constructor() {
    this.updateFinished();
  }
  get finished() {
    return this._finished;
  }
  updateFinished() {
    this._finished = new Promise((s) => {
      this.resolve = s;
    });
  }
  notifyFinished() {
    this.resolve();
  }
  then(s, l) {
    return this.finished.then(s, l);
  }
}
const yw = (n) => n / 100;
class Fo extends Bf {
  constructor(s) {
    (super(),
      (this.state = "idle"),
      (this.startTime = null),
      (this.isStopped = !1),
      (this.currentTime = 0),
      (this.holdTime = null),
      (this.playbackSpeed = 1),
      (this.delayState = { done: !1, value: void 0 }),
      (this.stop = () => {
        const { motionValue: l } = this.options;
        (l && l.updatedAt !== pe.now() && this.tick(pe.now()),
          (this.isStopped = !0),
          this.state !== "idle" && (this.teardown(), this.options.onStop?.()));
      }),
      (this.options = s),
      this.initAnimation(),
      this.play(),
      s.autoplay === !1 && this.pause());
  }
  initAnimation() {
    const { options: s } = this;
    $0(s);
    const {
      type: l = qi,
      repeat: o = 0,
      repeatDelay: c = 0,
      repeatType: d,
      velocity: f = 0,
    } = s;
    let { keyframes: p } = s;
    const m = l || qi;
    m !== qi &&
      typeof p[0] != "number" &&
      ((this.mixKeyframes = tl(yw, Z0(p[0], p[1]))), (p = [0, 100]));
    const g = m({ ...s, keyframes: p });
    (d === "mirror" &&
      (this.mirroredGenerator = m({
        ...s,
        keyframes: [...p].reverse(),
        velocity: -f,
      })),
      g.calculatedDuration === null && (g.calculatedDuration = Of(g)));
    const { calculatedDuration: x } = g;
    ((this.calculatedDuration = x),
      (this.resolvedDuration = x + c),
      (this.totalDuration = this.resolvedDuration * (o + 1) - c),
      (this.generator = g));
  }
  updateTime(s) {
    const l = Math.round(s - this.startTime) * this.playbackSpeed;
    this.holdTime !== null
      ? (this.currentTime = this.holdTime)
      : (this.currentTime = l);
  }
  tick(s, l = !1) {
    const {
      generator: o,
      totalDuration: c,
      mixKeyframes: d,
      mirroredGenerator: f,
      resolvedDuration: p,
      calculatedDuration: m,
    } = this;
    if (this.startTime === null) return o.next(0);
    const {
      delay: g = 0,
      keyframes: x,
      repeat: v,
      repeatType: S,
      repeatDelay: j,
      type: A,
      onUpdate: C,
      finalKeyframe: k,
    } = this.options;
    (this.speed > 0
      ? (this.startTime = Math.min(this.startTime, s))
      : this.speed < 0 &&
        (this.startTime = Math.min(s - c / this.speed, this.startTime)),
      l ? (this.currentTime = s) : this.updateTime(s));
    const H = this.currentTime - g * (this.playbackSpeed >= 0 ? 1 : -1),
      U = this.playbackSpeed >= 0 ? H < 0 : H > c;
    ((this.currentTime = Math.max(H, 0)),
      this.state === "finished" &&
        this.holdTime === null &&
        (this.currentTime = c));
    let L = this.currentTime,
      K = o;
    if (v) {
      const V = Math.min(this.currentTime, c) / p;
      let J = Math.floor(V),
        Z = V % 1;
      (!Z && V >= 1 && (Z = 1),
        Z === 1 && J--,
        (J = Math.min(J, v + 1)),
        J % 2 &&
          (S === "reverse"
            ? ((Z = 1 - Z), j && (Z -= j / p))
            : S === "mirror" && (K = f)),
        (L = un(0, 1, Z) * p));
    }
    let P;
    (U
      ? ((this.delayState.value = x[0]), (P = this.delayState))
      : (P = K.next(L)),
      d && !U && (P.value = d(P.value)));
    let { done: st } = P;
    !U &&
      m !== null &&
      (st =
        this.playbackSpeed >= 0
          ? this.currentTime >= c
          : this.currentTime <= 0);
    const nt =
      this.holdTime === null &&
      (this.state === "finished" || (this.state === "running" && st));
    return (
      nt && A !== Qc && (P.value = Io(x, this.options, k, this.speed)),
      C && C(P.value),
      nt && this.finish(),
      P
    );
  }
  then(s, l) {
    return this.finished.then(s, l);
  }
  get duration() {
    return Ge(this.calculatedDuration);
  }
  get iterationDuration() {
    const { delay: s = 0 } = this.options || {};
    return this.duration + Ge(s);
  }
  get time() {
    return Ge(this.currentTime);
  }
  set time(s) {
    ((s = De(s)),
      (this.currentTime = s),
      this.startTime === null ||
      this.holdTime !== null ||
      this.playbackSpeed === 0
        ? (this.holdTime = s)
        : this.driver &&
          (this.startTime = this.driver.now() - s / this.playbackSpeed),
      this.driver
        ? this.driver.start(!1)
        : ((this.startTime = 0),
          (this.state = "paused"),
          (this.holdTime = s),
          this.tick(s)));
  }
  getGeneratorVelocity() {
    const s = this.currentTime;
    if (s <= 0) return this.options.velocity || 0;
    if (this.generator.velocity) return this.generator.velocity(s);
    const l = this.generator.next(s).value;
    return P0((o) => this.generator.next(o).value, s, l);
  }
  get speed() {
    return this.playbackSpeed;
  }
  set speed(s) {
    const l = this.playbackSpeed !== s;
    (l && this.driver && this.updateTime(pe.now()),
      (this.playbackSpeed = s),
      l && this.driver && (this.time = Ge(this.currentTime)));
  }
  play() {
    if (this.isStopped) return;
    const { driver: s = tw, startTime: l } = this.options;
    (this.driver || (this.driver = s((c) => this.tick(c))),
      this.options.onPlay?.());
    const o = this.driver.now();
    (this.state === "finished"
      ? (this.updateFinished(), (this.startTime = o))
      : this.holdTime !== null
        ? (this.startTime = o - this.holdTime)
        : this.startTime || (this.startTime = l ?? o),
      this.state === "finished" &&
        this.speed < 0 &&
        (this.startTime += this.calculatedDuration),
      (this.holdTime = null),
      (this.state = "running"),
      this.driver.start());
  }
  pause() {
    ((this.state = "paused"),
      this.updateTime(pe.now()),
      (this.holdTime = this.currentTime));
  }
  complete() {
    (this.state !== "running" && this.play(),
      (this.state = "finished"),
      (this.holdTime = null));
  }
  finish() {
    (this.notifyFinished(),
      this.teardown(),
      (this.state = "finished"),
      this.options.onComplete?.());
  }
  cancel() {
    ((this.holdTime = null),
      (this.startTime = 0),
      this.tick(0),
      this.teardown(),
      this.options.onCancel?.());
  }
  teardown() {
    ((this.state = "idle"),
      this.stopDriver(),
      (this.startTime = this.holdTime = null));
  }
  stopDriver() {
    this.driver && (this.driver.stop(), (this.driver = void 0));
  }
  sample(s) {
    return ((this.startTime = 0), this.tick(s, !0));
  }
  attachTimeline(s) {
    return (
      this.options.allowFlatten &&
        ((this.options.type = "keyframes"),
        (this.options.ease = "linear"),
        this.initAnimation()),
      this.driver?.stop(),
      s.observe(this)
    );
  }
}
function xw(n) {
  for (let s = 1; s < n.length; s++) n[s] ?? (n[s] = n[s - 1]);
}
const Oa = (n) => (n * 180) / Math.PI,
  Pc = (n) => {
    const s = Oa(Math.atan2(n[1], n[0]));
    return $c(s);
  },
  bw = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (n) => (Math.abs(n[0]) + Math.abs(n[3])) / 2,
    rotate: Pc,
    rotateZ: Pc,
    skewX: (n) => Oa(Math.atan(n[1])),
    skewY: (n) => Oa(Math.atan(n[2])),
    skew: (n) => (Math.abs(n[1]) + Math.abs(n[2])) / 2,
  },
  $c = (n) => ((n = n % 360), n < 0 && (n += 360), n),
  Ag = Pc,
  Cg = (n) => Math.sqrt(n[0] * n[0] + n[1] * n[1]),
  jg = (n) => Math.sqrt(n[4] * n[4] + n[5] * n[5]),
  vw = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX: Cg,
    scaleY: jg,
    scale: (n) => (Cg(n) + jg(n)) / 2,
    rotateX: (n) => $c(Oa(Math.atan2(n[6], n[5]))),
    rotateY: (n) => $c(Oa(Math.atan2(-n[2], n[0]))),
    rotateZ: Ag,
    rotate: Ag,
    skewX: (n) => Oa(Math.atan(n[4])),
    skewY: (n) => Oa(Math.atan(n[1])),
    skew: (n) => (Math.abs(n[1]) + Math.abs(n[4])) / 2,
  };
function Jc(n) {
  return n.includes("scale") ? 1 : 0;
}
function Wc(n, s) {
  if (!n || n === "none") return Jc(s);
  const l = n.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
  let o, c;
  if (l) ((o = vw), (c = l));
  else {
    const p = n.match(/^matrix\(([-\d.e\s,]+)\)$/u);
    ((o = bw), (c = p));
  }
  if (!c) return Jc(s);
  const d = o[s],
    f = c[1].split(",").map(Tw);
  return typeof d == "function" ? d(f) : f[d];
}
const Sw = (n, s) => {
  const { transform: l = "none" } = getComputedStyle(n);
  return Wc(l, s);
};
function Tw(n) {
  return parseFloat(n.trim());
}
const Bs = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY",
  ],
  zs = new Set([...Bs, "pathRotation"]),
  Mg = (n) => n === Os || n === ot,
  ww = new Set(["x", "y", "z"]),
  Ew = Bs.filter((n) => !ww.has(n));
function Aw(n) {
  const s = [];
  return (
    Ew.forEach((l) => {
      const o = n.getValue(l);
      o !== void 0 &&
        (s.push([l, o.get()]), o.set(l.startsWith("scale") ? 1 : 0));
    }),
    s
  );
}
const sa = {
  width: (
    { x: n },
    { paddingLeft: s = "0", paddingRight: l = "0", boxSizing: o },
  ) => {
    const c = n.max - n.min;
    return o === "border-box" ? c : c - parseFloat(s) - parseFloat(l);
  },
  height: (
    { y: n },
    { paddingTop: s = "0", paddingBottom: l = "0", boxSizing: o },
  ) => {
    const c = n.max - n.min;
    return o === "border-box" ? c : c - parseFloat(s) - parseFloat(l);
  },
  top: (n, { top: s }) => parseFloat(s),
  left: (n, { left: s }) => parseFloat(s),
  bottom: ({ y: n }, { top: s }) => parseFloat(s) + (n.max - n.min),
  right: ({ x: n }, { left: s }) => parseFloat(s) + (n.max - n.min),
  x: (n, { transform: s }) => Wc(s, "x"),
  y: (n, { transform: s }) => Wc(s, "y"),
};
sa.translateX = sa.x;
sa.translateY = sa.y;
const Ba = new Set();
let Ic = !1,
  tf = !1,
  ef = !1;
function J0() {
  if (tf) {
    const n = Array.from(Ba).filter((o) => o.needsMeasurement),
      s = new Set(n.map((o) => o.element)),
      l = new Map();
    (s.forEach((o) => {
      const c = Aw(o);
      c.length && (l.set(o, c), o.render());
    }),
      n.forEach((o) => o.measureInitialState()),
      s.forEach((o) => {
        o.render();
        const c = l.get(o);
        c &&
          c.forEach(([d, f]) => {
            o.getValue(d)?.set(f);
          });
      }),
      n.forEach((o) => o.measureEndState()),
      n.forEach((o) => {
        o.suspendedScrollY !== void 0 && window.scrollTo(0, o.suspendedScrollY);
      }));
  }
  ((tf = !1), (Ic = !1), Ba.forEach((n) => n.complete(ef)), Ba.clear());
}
function W0() {
  Ba.forEach((n) => {
    (n.readKeyframes(), n.needsMeasurement && (tf = !0));
  });
}
function Cw() {
  ((ef = !0), W0(), J0(), (ef = !1));
}
class zf {
  constructor(s, l, o, c, d, f = !1) {
    ((this.state = "pending"),
      (this.isAsync = !1),
      (this.needsMeasurement = !1),
      (this.unresolvedKeyframes = [...s]),
      (this.onComplete = l),
      (this.name = o),
      (this.motionValue = c),
      (this.element = d),
      (this.isAsync = f));
  }
  scheduleResolve() {
    ((this.state = "scheduled"),
      this.isAsync
        ? (Ba.add(this),
          Ic || ((Ic = !0), _t.read(W0), _t.resolveKeyframes(J0)))
        : (this.readKeyframes(), this.complete()));
  }
  readKeyframes() {
    const {
      unresolvedKeyframes: s,
      name: l,
      element: o,
      motionValue: c,
    } = this;
    if (s[0] === null) {
      const d = c?.get(),
        f = s[s.length - 1];
      if (d !== void 0) s[0] = d;
      else if (o && l) {
        const p = o.readValue(l, f);
        p != null && (s[0] = p);
      }
      (s[0] === void 0 && (s[0] = f), c && d === void 0 && c.set(s[0]));
    }
    xw(s);
  }
  setFinalKeyframe() {}
  measureInitialState() {}
  renderEndStyles() {}
  measureEndState() {}
  complete(s = !1) {
    ((this.state = "complete"),
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, s),
      Ba.delete(this));
  }
  cancel() {
    this.state === "scheduled" && (Ba.delete(this), (this.state = "pending"));
  }
  resume() {
    this.state === "pending" && this.scheduleResolve();
  }
}
const jw = (n) => n.startsWith("--");
function I0(n, s, l) {
  jw(s) ? n.style.setProperty(s, l) : (n.style[s] = l);
}
const Mw = {};
function tx(n, s) {
  const l = j0(n);
  return () => Mw[s] ?? l();
}
const Nw = tx(() => window.ScrollTimeline !== void 0, "scrollTimeline"),
  ex = tx(() => {
    try {
      document
        .createElement("div")
        .animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch {
      return !1;
    }
    return !0;
  }, "linearEasing"),
  Hi = ([n, s, l, o]) => `cubic-bezier(${n}, ${s}, ${l}, ${o})`,
  Ng = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: Hi([0, 0.65, 0.55, 1]),
    circOut: Hi([0.55, 0, 1, 0.45]),
    backIn: Hi([0.31, 0.01, 0.66, -0.59]),
    backOut: Hi([0.33, 1.53, 0.69, 0.99]),
  };
function nx(n, s) {
  if (n)
    return typeof n == "function"
      ? ex()
        ? Q0(n, s)
        : "ease-out"
      : L0(n)
        ? Hi(n)
        : Array.isArray(n)
          ? n.map((l) => nx(l, s) || Ng.easeOut)
          : Ng[n];
}
function Rw(
  n,
  s,
  l,
  {
    delay: o = 0,
    duration: c = 300,
    repeat: d = 0,
    repeatType: f = "loop",
    ease: p = "easeOut",
    times: m,
  } = {},
  g = void 0,
) {
  const x = { [s]: l };
  m && (x.offset = m);
  const v = nx(p, c);
  Array.isArray(v) && (x.easing = v);
  const S = {
    delay: o,
    duration: c,
    easing: Array.isArray(v) ? "linear" : v,
    fill: "both",
    iterations: d + 1,
    direction: f === "reverse" ? "alternate" : "normal",
  };
  return (g && (S.pseudoElement = g), n.animate(x, S));
}
function ax(n) {
  return typeof n == "function" && "applyToOptions" in n;
}
function Dw({ type: n, ...s }) {
  return ax(n) && ex()
    ? n.applyToOptions(s)
    : (s.duration ?? (s.duration = 300), s.ease ?? (s.ease = "easeOut"), s);
}
class sx extends Bf {
  constructor(s) {
    if (
      (super(),
      (this.finishedTime = null),
      (this.isStopped = !1),
      (this.manualStartTime = null),
      !s)
    )
      return;
    const {
      element: l,
      name: o,
      keyframes: c,
      pseudoElement: d,
      allowFlatten: f = !1,
      finalKeyframe: p,
      onComplete: m,
    } = s;
    ((this.isPseudoElement = !!d),
      (this.allowFlatten = f),
      (this.options = s),
      Wo(typeof s.type != "string"));
    const g = Dw(s);
    ((this.animation = Rw(l, o, c, g, d)),
      g.autoplay === !1 && this.animation.pause(),
      (this.animation.onfinish = () => {
        if (((this.finishedTime = this.time), !d)) {
          const x = Io(c, this.options, p, this.speed);
          (this.updateMotionValue && this.updateMotionValue(x),
            I0(l, o, x),
            this.animation.cancel());
        }
        (m?.(), this.notifyFinished());
      }));
  }
  play() {
    this.isStopped ||
      ((this.manualStartTime = null),
      this.animation.play(),
      this.state === "finished" && this.updateFinished());
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.finish?.();
  }
  cancel() {
    try {
      this.animation.cancel();
    } catch {}
  }
  stop() {
    if (this.isStopped) return;
    this.isStopped = !0;
    const { state: s } = this;
    s === "idle" ||
      s === "finished" ||
      (this.updateMotionValue ? this.updateMotionValue() : this.commitStyles(),
      this.isPseudoElement || this.cancel());
  }
  commitStyles() {
    const s = this.options?.element;
    !this.isPseudoElement && s?.isConnected && this.animation.commitStyles?.();
  }
  get duration() {
    const s = this.animation.effect?.getComputedTiming?.().duration || 0;
    return Ge(Number(s));
  }
  get iterationDuration() {
    const { delay: s = 0 } = this.options || {};
    return this.duration + Ge(s);
  }
  get time() {
    return Ge(Number(this.animation.currentTime) || 0);
  }
  set time(s) {
    const l = this.finishedTime !== null;
    ((this.manualStartTime = null),
      (this.finishedTime = null),
      (this.animation.currentTime = De(s)),
      l && this.animation.pause());
  }
  get speed() {
    return this.animation.playbackRate;
  }
  set speed(s) {
    (s < 0 && (this.finishedTime = null), (this.animation.playbackRate = s));
  }
  get state() {
    return this.finishedTime !== null ? "finished" : this.animation.playState;
  }
  get startTime() {
    return this.manualStartTime ?? Number(this.animation.startTime);
  }
  set startTime(s) {
    this.manualStartTime = this.animation.startTime = s;
  }
  attachTimeline({ timeline: s, rangeStart: l, rangeEnd: o, observe: c }) {
    return (
      this.allowFlatten &&
        this.animation.effect?.updateTiming({ easing: "linear" }),
      (this.animation.onfinish = null),
      s && Nw()
        ? ((this.animation.timeline = s),
          l && (this.animation.rangeStart = l),
          o && (this.animation.rangeEnd = o),
          Fe)
        : c(this)
    );
  }
}
const ix = { anticipate: B0, backInOut: O0, circInOut: V0 };
function kw(n) {
  return n in ix;
}
function Ow(n) {
  typeof n.ease == "string" && kw(n.ease) && (n.ease = ix[n.ease]);
}
const Nc = 10;
class Bw extends sx {
  constructor(s) {
    (Ow(s),
      $0(s),
      super(s),
      s.startTime !== void 0 &&
        s.autoplay !== !1 &&
        (this.startTime = s.startTime),
      (this.options = s));
  }
  updateMotionValue(s) {
    const {
      motionValue: l,
      onUpdate: o,
      onComplete: c,
      element: d,
      ...f
    } = this.options;
    if (!l) return;
    if (s !== void 0) {
      l.set(s);
      return;
    }
    const p = new Fo({ ...f, autoplay: !1 }),
      m = Math.max(Nc, pe.now() - this.startTime),
      g = un(0, Nc, m - Nc),
      x = p.sample(m).value,
      { name: v } = this.options;
    (d && v && I0(d, v, x),
      l.setWithVelocity(p.sample(Math.max(0, m - g)).value, x, g),
      p.stop());
  }
}
const Rg = (n, s) =>
  s === "zIndex"
    ? !1
    : !!(
        typeof n == "number" ||
        Array.isArray(n) ||
        (typeof n == "string" &&
          ($e.test(n) || n === "0") &&
          !n.startsWith("url("))
      );
function zw(n) {
  const s = n[0];
  if (n.length === 1) return !0;
  for (let l = 0; l < n.length; l++) if (n[l] !== s) return !0;
}
function Vw(n, s, l, o) {
  const c = n[0];
  if (c === null) return !1;
  if (s === "display" || s === "visibility") return !0;
  const d = n[n.length - 1],
    f = Rg(c, s),
    p = Rg(d, s);
  return !f || !p ? !1 : zw(n) || ((l === "spring" || ax(l)) && o);
}
function nf(n) {
  ((n.duration = 0), (n.type = "keyframes"));
}
const lx = new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform",
    "backgroundColor",
  ]),
  _w = /^(?:oklch|oklab|lab|lch|color|color-mix|light-dark)\(/;
function Lw(n) {
  for (let s = 0; s < n.length; s++)
    if (typeof n[s] == "string" && _w.test(n[s])) return !0;
  return !1;
}
const Uw = new Set([
    "color",
    "backgroundColor",
    "outlineColor",
    "fill",
    "stroke",
    "borderColor",
    "borderTopColor",
    "borderRightColor",
    "borderBottomColor",
    "borderLeftColor",
  ]),
  Hw = j0(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
function Gw(n) {
  const {
      motionValue: s,
      name: l,
      repeatDelay: o,
      repeatType: c,
      damping: d,
      type: f,
      keyframes: p,
    } = n,
    m = s?.owner?.current;
  if (!(m instanceof HTMLElement) && !(m instanceof SVGElement)) return !1;
  const { onUpdate: g, transformTemplate: x } = s.owner.getProps();
  return (
    Hw() &&
    l &&
    (lx.has(l) || (Uw.has(l) && Lw(p))) &&
    (l !== "transform" || !x) &&
    !g &&
    !o &&
    c !== "mirror" &&
    d !== 0 &&
    f !== "inertia"
  );
}
const Fw = 40;
class qw extends Bf {
  constructor({
    autoplay: s = !0,
    delay: l = 0,
    type: o = "keyframes",
    repeat: c = 0,
    repeatDelay: d = 0,
    repeatType: f = "loop",
    keyframes: p,
    name: m,
    motionValue: g,
    element: x,
    ...v
  }) {
    (super(),
      (this.stop = () => {
        (this._animation && (this._animation.stop(), this.stopTimeline?.()),
          this.keyframeResolver?.cancel());
      }),
      (this.createdAt = pe.now()));
    const S = {
        autoplay: s,
        delay: l,
        type: o,
        repeat: c,
        repeatDelay: d,
        repeatType: f,
        name: m,
        motionValue: g,
        element: x,
        ...v,
      },
      j = x?.KeyframeResolver || zf;
    ((this.keyframeResolver = new j(
      p,
      (A, C, k) => this.onKeyframesResolved(A, C, S, !k),
      m,
      g,
      x,
    )),
      this.keyframeResolver?.scheduleResolve());
  }
  onKeyframesResolved(s, l, o, c) {
    this.keyframeResolver = void 0;
    const {
      name: d,
      type: f,
      velocity: p,
      delay: m,
      isHandoff: g,
      onUpdate: x,
    } = o;
    this.resolvedAt = pe.now();
    let v = !0;
    Vw(s, d, f, p) ||
      ((v = !1),
      (ia.instantAnimations || !m) && x?.(Io(s, o, l)),
      (s[0] = s[s.length - 1]),
      nf(o),
      (o.repeat = 0));
    const j = {
        startTime: c
          ? this.resolvedAt
            ? this.resolvedAt - this.createdAt > Fw
              ? this.resolvedAt
              : this.createdAt
            : this.createdAt
          : void 0,
        finalKeyframe: l,
        ...o,
        keyframes: s,
      },
      A = v && !g && Gw(j),
      C = j.motionValue?.owner?.current;
    let k;
    if (A)
      try {
        k = new Bw({ ...j, element: C });
      } catch {
        k = new Fo(j);
      }
    else k = new Fo(j);
    (k.finished
      .then(() => {
        this.notifyFinished();
      })
      .catch(Fe),
      this.pendingTimeline &&
        ((this.stopTimeline = k.attachTimeline(this.pendingTimeline)),
        (this.pendingTimeline = void 0)),
      (this._animation = k));
  }
  get finished() {
    return this._animation ? this.animation.finished : this._finished;
  }
  then(s, l) {
    return this.finished.finally(s).then(() => {});
  }
  get animation() {
    return (
      this._animation || (this.keyframeResolver?.resume(), Cw()),
      this._animation
    );
  }
  get duration() {
    return this.animation.duration;
  }
  get iterationDuration() {
    return this.animation.iterationDuration;
  }
  get time() {
    return this.animation.time;
  }
  set time(s) {
    this.animation.time = s;
  }
  get speed() {
    return this.animation.speed;
  }
  get state() {
    return this.animation.state;
  }
  set speed(s) {
    this.animation.speed = s;
  }
  get startTime() {
    return this.animation.startTime;
  }
  attachTimeline(s) {
    return (
      this._animation
        ? (this.stopTimeline = this.animation.attachTimeline(s))
        : (this.pendingTimeline = s),
      () => this.stop()
    );
  }
  play() {
    this.animation.play();
  }
  pause() {
    this.animation.pause();
  }
  complete() {
    this.animation.complete();
  }
  cancel() {
    (this._animation && this.animation.cancel(),
      this.keyframeResolver?.cancel());
  }
}
function ox(n, s, l, o = 0, c = 1) {
  const d = Array.from(n)
      .sort((g, x) => g.sortNodePosition(x))
      .indexOf(s),
    f = n.size,
    p = (f - 1) * o;
  return typeof l == "function" ? l(d, f) : c === 1 ? d * o : p - d * o;
}
const Dg = 30,
  Yw = (n) => !isNaN(parseFloat(n));
class Xw {
  constructor(s, l = {}) {
    ((this.canTrackVelocity = null),
      (this.events = {}),
      (this.updateAndNotify = (o) => {
        const c = pe.now();
        if (
          (this.updatedAt !== c && this.setPrevFrameValue(),
          (this.prev = this.current),
          this.setCurrent(o),
          this.current !== this.prev &&
            (this.events.change?.notify(this.current), this.dependents))
        )
          for (const d of this.dependents) d.dirty();
      }),
      (this.hasAnimated = !1),
      this.setCurrent(s),
      (this.owner = l.owner));
  }
  setCurrent(s) {
    ((this.current = s),
      (this.updatedAt = pe.now()),
      this.canTrackVelocity === null &&
        s !== void 0 &&
        (this.canTrackVelocity = Yw(this.current)));
  }
  setPrevFrameValue(s = this.current) {
    ((this.prevFrameValue = s), (this.prevUpdatedAt = this.updatedAt));
  }
  onChange(s) {
    return this.on("change", s);
  }
  on(s, l) {
    this.events[s] || (this.events[s] = new Cf());
    const o = this.events[s].add(l);
    return s === "change"
      ? () => {
          (o(),
            _t.read(() => {
              this.events.change.getSize() || this.stop();
            }));
        }
      : o;
  }
  clearListeners() {
    for (const s in this.events) this.events[s].clear();
  }
  attach(s, l) {
    ((this.passiveEffect = s), (this.stopPassiveEffect = l));
  }
  set(s) {
    this.passiveEffect
      ? this.passiveEffect(s, this.updateAndNotify)
      : this.updateAndNotify(s);
  }
  setWithVelocity(s, l, o) {
    (this.set(l),
      (this.prev = void 0),
      (this.prevFrameValue = s),
      (this.prevUpdatedAt = this.updatedAt - o));
  }
  jump(s, l = !0) {
    (this.updateAndNotify(s),
      (this.prev = s),
      (this.prevUpdatedAt = this.prevFrameValue = void 0),
      l && this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
  dirty() {
    this.events.change?.notify(this.current);
  }
  addDependent(s) {
    (this.dependents || (this.dependents = new Set()), this.dependents.add(s));
  }
  removeDependent(s) {
    this.dependents && this.dependents.delete(s);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    const s = pe.now();
    if (
      !this.canTrackVelocity ||
      this.prevFrameValue === void 0 ||
      s - this.updatedAt > Dg
    )
      return 0;
    const l = Math.min(this.updatedAt - this.prevUpdatedAt, Dg);
    return M0(parseFloat(this.current) - parseFloat(this.prevFrameValue), l);
  }
  start(s) {
    return (
      this.stop(),
      new Promise((l) => {
        ((this.hasAnimated = !0),
          (this.animation = s(l)),
          this.events.animationStart && this.events.animationStart.notify());
      }).then(() => {
        (this.events.animationComplete &&
          this.events.animationComplete.notify(),
          this.clearAnimation());
      })
    );
  }
  stop() {
    (this.animation &&
      (this.animation.stop(),
      this.events.animationCancel && this.events.animationCancel.notify()),
      this.clearAnimation());
  }
  isAnimating() {
    return !!this.animation;
  }
  clearAnimation() {
    delete this.animation;
  }
  destroy() {
    (this.dependents?.clear(),
      this.events.destroy?.notify(),
      this.clearListeners(),
      this.stop(),
      this.stopPassiveEffect && this.stopPassiveEffect());
  }
}
function Ds(n, s) {
  return new Xw(n, s);
}
function rx(n, s) {
  if (n?.inherit && s) {
    const { inherit: l, ...o } = n;
    return { ...s, ...o };
  }
  return n;
}
function Vf(n, s) {
  const l = n?.[s] ?? n?.default ?? n;
  return l !== n ? rx(l, n) : l;
}
const Kw = { type: "spring", stiffness: 500, damping: 25, restSpeed: 10 },
  Zw = (n) => ({
    type: "spring",
    stiffness: 550,
    damping: n === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10,
  }),
  Qw = { type: "keyframes", duration: 0.8 },
  Pw = { type: "keyframes", ease: [0.25, 0.1, 0.35, 1], duration: 0.3 },
  $w = (n, { keyframes: s }) =>
    s.length > 2
      ? Qw
      : zs.has(n)
        ? n.startsWith("scale")
          ? Zw(s[1])
          : Kw
        : Pw,
  Jw = new Set([
    "when",
    "delay",
    "delayChildren",
    "staggerChildren",
    "staggerDirection",
    "repeat",
    "repeatType",
    "repeatDelay",
    "from",
    "elapsed",
  ]);
function Ww(n) {
  for (const s in n) if (!Jw.has(s)) return !0;
  return !1;
}
const _f =
    (n, s, l, o = {}, c, d) =>
    (f) => {
      const p = Vf(o, n) || {},
        m = p.delay || o.delay || 0;
      let { elapsed: g = 0 } = o;
      g = g - De(m);
      const x = {
        keyframes: Array.isArray(l) ? l : [null, l],
        ease: "easeOut",
        velocity: s.getVelocity(),
        ...p,
        delay: -g,
        onUpdate: (S) => {
          (s.set(S), p.onUpdate && p.onUpdate(S));
        },
        onComplete: () => {
          (f(), p.onComplete && p.onComplete());
        },
        name: n,
        motionValue: s,
        element: d ? void 0 : c,
      };
      (Ww(p) || Object.assign(x, $w(n, x)),
        x.duration && (x.duration = De(x.duration)),
        x.repeatDelay && (x.repeatDelay = De(x.repeatDelay)),
        x.from !== void 0 && (x.keyframes[0] = x.from));
      let v = !1;
      if (
        ((x.type === !1 || (x.duration === 0 && !x.repeatDelay)) &&
          (nf(x), x.delay === 0 && (v = !0)),
        (ia.instantAnimations ||
          ia.skipAnimations ||
          c?.shouldSkipAnimations ||
          p.skipAnimations) &&
          ((v = !0), nf(x), (x.delay = 0)),
        (x.allowFlatten = !p.type && !p.ease),
        v && !d && s.get() !== void 0)
      ) {
        const S = Io(x.keyframes, p);
        if (S !== void 0) {
          _t.update(() => {
            (x.onUpdate(S), x.onComplete());
          });
          return;
        }
      }
      return p.isSync ? new Fo(x) : new qw(x);
    },
  Iw = /^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;
function tE(n) {
  const s = Iw.exec(n);
  if (!s) return [,];
  const [, l, o, c] = s;
  return [`--${l ?? o}`, c];
}
function ux(n, s, l = 1) {
  const [o, c] = tE(n);
  if (!o) return;
  const d = window.getComputedStyle(s).getPropertyValue(o);
  if (d) {
    const f = d.trim();
    return E0(f) ? parseFloat(f) : f;
  }
  return Nf(c) ? ux(c, s, l + 1) : c;
}
function kg(n) {
  const s = [{}, {}];
  return (
    n?.values.forEach((l, o) => {
      ((s[0][o] = l.get()), (s[1][o] = l.getVelocity()));
    }),
    s
  );
}
function Lf(n, s, l, o) {
  if (typeof s == "function") {
    const [c, d] = kg(o);
    s = s(l !== void 0 ? l : n.custom, c, d);
  }
  if (
    (typeof s == "string" && (s = n.variants && n.variants[s]),
    typeof s == "function")
  ) {
    const [c, d] = kg(o);
    s = s(l !== void 0 ? l : n.custom, c, d);
  }
  return s;
}
function za(n, s, l) {
  const o = n.getProps();
  return Lf(o, s, l !== void 0 ? l : o.custom, n);
}
const cx = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...Bs,
  ]),
  af = (n) => Array.isArray(n);
function eE(n, s, l) {
  n.hasValue(s) ? n.getValue(s).set(l) : n.addValue(s, Ds(l));
}
function nE(n) {
  return af(n) ? n[n.length - 1] || 0 : n;
}
function aE(n, s) {
  const l = za(n, s);
  let { transitionEnd: o = {}, transition: c = {}, ...d } = l || {};
  d = { ...d, ...o };
  for (const f in d) {
    const p = nE(d[f]);
    eE(n, f, p);
  }
}
const ce = (n) => !!(n && n.getVelocity);
function sE(n) {
  return !!(ce(n) && n.add);
}
function sf(n, s) {
  const l = n.getValue("willChange");
  if (sE(l)) return l.add(s);
  if (!l && ia.WillChange) {
    const o = new ia.WillChange("auto");
    (n.addValue("willChange", o), o.add(s));
  }
}
function Uf(n) {
  return n.replace(/([A-Z])/g, (s) => `-${s.toLowerCase()}`);
}
const iE = "framerAppearId",
  fx = "data-" + Uf(iE);
function dx(n) {
  return n.props[fx];
}
function lE({ protectedKeys: n, needsAnimating: s }, l) {
  const o = n.hasOwnProperty(l) && s[l] !== !0;
  return ((s[l] = !1), o);
}
function hx(n, s, { delay: l = 0, transitionOverride: o, type: c } = {}) {
  let { transition: d, transitionEnd: f, ...p } = s;
  const m = n.getDefaultTransition();
  d = d ? rx(d, m) : m;
  const g = d?.reduceMotion,
    x = d?.skipAnimations;
  o && (d = o);
  const v = [],
    S = c && n.animationState && n.animationState.getState()[c],
    j = d?.path;
  j && j.animateVisualElement(n, p, d, l, v);
  for (const A in p) {
    const C = n.getValue(A, n.latestValues[A] ?? null),
      k = p[A];
    if (k === void 0 || (S && lE(S, A))) continue;
    const H = { delay: l, ...Vf(d || {}, A) };
    x && (H.skipAnimations = !0);
    const U = C.get();
    if (
      U !== void 0 &&
      !C.isAnimating() &&
      !Array.isArray(k) &&
      k === U &&
      !H.velocity
    ) {
      _t.update(() => C.set(k));
      continue;
    }
    let L = !1;
    if (window.MotionHandoffAnimation) {
      const st = dx(n);
      if (st) {
        const nt = window.MotionHandoffAnimation(st, A, _t);
        nt !== null && ((H.startTime = nt), (L = !0));
      }
    }
    sf(n, A);
    const K = g ?? n.shouldReduceMotion;
    C.start(_f(A, C, k, K && cx.has(A) ? { type: !1 } : H, n, L));
    const P = C.animation;
    P && v.push(P);
  }
  if (f) {
    const A = () =>
      _t.update(() => {
        f && aE(n, f);
      });
    v.length ? Promise.all(v).then(A) : A();
  }
  return v;
}
function lf(n, s, l = {}) {
  const o = za(n, s, l.type === "exit" ? n.presenceContext?.custom : void 0);
  let { transition: c = n.getDefaultTransition() || {} } = o || {};
  l.transitionOverride && (c = l.transitionOverride);
  const d = o ? () => Promise.all(hx(n, o, l)) : () => Promise.resolve(),
    f =
      n.variantChildren && n.variantChildren.size
        ? (m = 0) => {
            const {
              delayChildren: g = 0,
              staggerChildren: x,
              staggerDirection: v,
            } = c;
            return oE(n, s, m, g, x, v, l);
          }
        : () => Promise.resolve(),
    { when: p } = c;
  if (p) {
    const [m, g] = p === "beforeChildren" ? [d, f] : [f, d];
    return m().then(() => g());
  } else return Promise.all([d(), f(l.delay)]);
}
function oE(n, s, l = 0, o = 0, c = 0, d = 1, f) {
  const p = [];
  for (const m of n.variantChildren)
    (m.notify("AnimationStart", s),
      p.push(
        lf(m, s, {
          ...f,
          delay:
            l +
            (typeof o == "function" ? 0 : o) +
            ox(n.variantChildren, m, o, c, d),
        }).then(() => m.notify("AnimationComplete", s)),
      ));
  return Promise.all(p);
}
function rE(n, s, l = {}) {
  n.notify("AnimationStart", s);
  let o;
  if (Array.isArray(s)) {
    const c = s.map((d) => lf(n, d, l));
    o = Promise.all(c);
  } else if (typeof s == "string") o = lf(n, s, l);
  else {
    const c = typeof s == "function" ? za(n, s, l.custom) : s;
    o = Promise.all(hx(n, c, l));
  }
  return o.then(() => {
    n.notify("AnimationComplete", s);
  });
}
const uE = { test: (n) => n === "auto", parse: (n) => n },
  mx = (n) => (s) => s.test(n),
  px = [Os, ot, rn, jn, zT, BT, uE],
  Og = (n) => px.find(mx(n));
function cE(n) {
  return typeof n == "number"
    ? n === 0
    : n !== null
      ? n === "none" || n === "0" || C0(n)
      : !0;
}
const fE = new Set(["brightness", "contrast", "saturate", "opacity"]);
function dE(n) {
  const [s, l] = n.slice(0, -1).split("(");
  if (s === "drop-shadow") return n;
  const [o] = l.match(Rf) || [];
  if (!o) return n;
  const c = l.replace(o, "");
  let d = fE.has(s) ? 1 : 0;
  return (o !== l && (d *= 100), s + "(" + d + c + ")");
}
const hE = /\b([a-z-]*)\(.*?\)/gu,
  of = {
    ...$e,
    getAnimatableNone: (n) => {
      const s = n.match(hE);
      return s ? s.map(dE).join(" ") : n;
    },
  },
  rf = {
    ...$e,
    getAnimatableNone: (n) => {
      const s = $e.parse(n);
      return $e.createTransformer(n)(
        s.map((o) =>
          typeof o == "number"
            ? 0
            : typeof o == "object"
              ? { ...o, alpha: 1 }
              : o,
        ),
      );
    },
  },
  Bg = { ...Os, transform: Math.round },
  mE = {
    rotate: jn,
    pathRotation: jn,
    rotateX: jn,
    rotateY: jn,
    rotateZ: jn,
    scale: To,
    scaleX: To,
    scaleY: To,
    scaleZ: To,
    skew: jn,
    skewX: jn,
    skewY: jn,
    distance: ot,
    translateX: ot,
    translateY: ot,
    translateZ: ot,
    x: ot,
    y: ot,
    z: ot,
    perspective: ot,
    transformPerspective: ot,
    opacity: Pi,
    originX: vg,
    originY: vg,
    originZ: ot,
  },
  qo = {
    borderWidth: ot,
    borderTopWidth: ot,
    borderRightWidth: ot,
    borderBottomWidth: ot,
    borderLeftWidth: ot,
    borderRadius: ot,
    borderTopLeftRadius: ot,
    borderTopRightRadius: ot,
    borderBottomRightRadius: ot,
    borderBottomLeftRadius: ot,
    width: ot,
    maxWidth: ot,
    height: ot,
    maxHeight: ot,
    top: ot,
    right: ot,
    bottom: ot,
    left: ot,
    inset: ot,
    insetBlock: ot,
    insetBlockStart: ot,
    insetBlockEnd: ot,
    insetInline: ot,
    insetInlineStart: ot,
    insetInlineEnd: ot,
    padding: ot,
    paddingTop: ot,
    paddingRight: ot,
    paddingBottom: ot,
    paddingLeft: ot,
    paddingBlock: ot,
    paddingBlockStart: ot,
    paddingBlockEnd: ot,
    paddingInline: ot,
    paddingInlineStart: ot,
    paddingInlineEnd: ot,
    margin: ot,
    marginTop: ot,
    marginRight: ot,
    marginBottom: ot,
    marginLeft: ot,
    marginBlock: ot,
    marginBlockStart: ot,
    marginBlockEnd: ot,
    marginInline: ot,
    marginInlineStart: ot,
    marginInlineEnd: ot,
    fontSize: ot,
    backgroundPositionX: ot,
    backgroundPositionY: ot,
    ...mE,
    zIndex: Bg,
    fillOpacity: Pi,
    strokeOpacity: Pi,
    numOctaves: Bg,
  },
  pE = {
    ...qo,
    color: $t,
    backgroundColor: $t,
    outlineColor: $t,
    fill: $t,
    stroke: $t,
    borderColor: $t,
    borderTopColor: $t,
    borderRightColor: $t,
    borderBottomColor: $t,
    borderLeftColor: $t,
    filter: of,
    WebkitFilter: of,
    mask: rf,
    WebkitMask: rf,
  },
  gx = (n) => pE[n],
  gE = new Set([of, rf]);
function yx(n, s) {
  let l = gx(n);
  return (
    gE.has(l) || (l = $e),
    l.getAnimatableNone ? l.getAnimatableNone(s) : void 0
  );
}
const yE = new Set(["auto", "none", "0"]);
function xE(n, s, l) {
  let o = 0,
    c;
  for (; o < n.length && !c;) {
    const d = n[o];
    (typeof d == "string" && !yE.has(d) && Rs(d).values.length && (c = n[o]),
      o++);
  }
  if (c && l) for (const d of s) n[d] = yx(l, c);
}
class bE extends zf {
  constructor(s, l, o, c, d) {
    super(s, l, o, c, d, !0);
  }
  readKeyframes() {
    const { unresolvedKeyframes: s, element: l, name: o } = this;
    if (!l || !l.current) return;
    super.readKeyframes();
    for (let x = 0; x < s.length; x++) {
      let v = s[x];
      if (typeof v == "string" && ((v = v.trim()), Nf(v))) {
        const S = ux(v, l.current);
        (S !== void 0 && (s[x] = S),
          x === s.length - 1 && (this.finalKeyframe = v));
      }
    }
    if ((this.resolveNoneKeyframes(), !cx.has(o) || s.length !== 2)) return;
    const [c, d] = s,
      f = Og(c),
      p = Og(d),
      m = bg(c),
      g = bg(d);
    if (m !== g && sa[o]) {
      this.needsMeasurement = !0;
      return;
    }
    if (f !== p)
      if (Mg(f) && Mg(p))
        for (let x = 0; x < s.length; x++) {
          const v = s[x];
          typeof v == "string" && (s[x] = parseFloat(v));
        }
      else sa[o] && (this.needsMeasurement = !0);
  }
  resolveNoneKeyframes() {
    const { unresolvedKeyframes: s, name: l } = this,
      o = [];
    for (let c = 0; c < s.length; c++) (s[c] === null || cE(s[c])) && o.push(c);
    o.length && xE(s, o, l);
  }
  measureInitialState() {
    const { element: s, unresolvedKeyframes: l, name: o } = this;
    if (!s || !s.current) return;
    (o === "height" && (this.suspendedScrollY = window.pageYOffset),
      (this.measuredOrigin = sa[o](
        s.measureViewportBox(),
        window.getComputedStyle(s.current),
      )),
      (l[0] = this.measuredOrigin));
    const c = l[l.length - 1];
    c !== void 0 && s.getValue(o, c).jump(c, !1);
  }
  measureEndState() {
    const { element: s, name: l, unresolvedKeyframes: o } = this;
    if (!s || !s.current) return;
    const c = s.getValue(l);
    c && c.jump(this.measuredOrigin, !1);
    const d = o.length - 1,
      f = o[d];
    ((o[d] = sa[l](s.measureViewportBox(), window.getComputedStyle(s.current))),
      f !== null && this.finalKeyframe === void 0 && (this.finalKeyframe = f),
      this.removedTransforms?.length &&
        this.removedTransforms.forEach(([p, m]) => {
          s.getValue(p).set(m);
        }),
      this.resolveNoneKeyframes());
  }
}
const Hf = [
  "borderTopLeftRadius",
  "borderTopRightRadius",
  "borderBottomRightRadius",
  "borderBottomLeftRadius",
];
function xx(n, s, l) {
  if (n == null) return [];
  if (n instanceof EventTarget) return [n];
  if (typeof n == "string") {
    let o = document;
    const c = l?.[n] ?? o.querySelectorAll(n);
    return c ? Array.from(c) : [];
  }
  return Array.from(n).filter((o) => o != null);
}
const uf = (n, s) => (s && typeof n == "number" ? s.transform(n) : n);
function Mo(n) {
  return A0(n) && "offsetHeight" in n && !("ownerSVGElement" in n);
}
const { schedule: Gf } = U0(queueMicrotask, !1),
  Qe = { x: !1, y: !1 };
function bx() {
  return Qe.x || Qe.y;
}
function vE(n) {
  return n === "x" || n === "y"
    ? Qe[n]
      ? null
      : ((Qe[n] = !0),
        () => {
          Qe[n] = !1;
        })
    : Qe.x || Qe.y
      ? null
      : ((Qe.x = Qe.y = !0),
        () => {
          Qe.x = Qe.y = !1;
        });
}
function vx(n, s) {
  const l = xx(n),
    o = new AbortController(),
    c = { passive: !0, ...s, signal: o.signal };
  return [l, c, () => o.abort()];
}
function SE(n) {
  return !(n.pointerType === "touch" || bx());
}
function TE(n, s, l = {}) {
  const [o, c, d] = vx(n, l);
  return (
    o.forEach((f) => {
      let p = !1,
        m = !1,
        g;
      const x = () => {
          f.removeEventListener("pointerleave", A);
        },
        v = (k) => {
          (g && (g(k), (g = void 0)), x());
        },
        S = (k) => {
          ((p = !1),
            window.removeEventListener("pointerup", S),
            window.removeEventListener("pointercancel", S),
            m && ((m = !1), v(k)));
        },
        j = () => {
          ((p = !0),
            window.addEventListener("pointerup", S, c),
            window.addEventListener("pointercancel", S, c));
        },
        A = (k) => {
          if (k.pointerType !== "touch") {
            if (p) {
              m = !0;
              return;
            }
            v(k);
          }
        },
        C = (k) => {
          if (!SE(k)) return;
          m = !1;
          const H = s(f, k);
          typeof H == "function" &&
            ((g = H), f.addEventListener("pointerleave", A, c));
        };
      (f.addEventListener("pointerenter", C, c),
        f.addEventListener("pointerdown", j, c));
    }),
    d
  );
}
const Sx = (n, s) => (s ? (n === s ? !0 : Sx(n, s.parentElement)) : !1),
  Ff = (n) =>
    n.pointerType === "mouse"
      ? typeof n.button != "number" || n.button <= 0
      : n.isPrimary !== !1,
  wE = new Set(["BUTTON", "INPUT", "SELECT", "TEXTAREA", "A"]);
function EE(n) {
  return wE.has(n.tagName) || n.isContentEditable === !0;
}
const AE = new Set(["INPUT", "SELECT", "TEXTAREA"]);
function CE(n) {
  return AE.has(n.tagName) || n.isContentEditable === !0;
}
const No = new WeakSet();
function zg(n) {
  return (s) => {
    s.key === "Enter" && n(s);
  };
}
function Rc(n, s) {
  n.dispatchEvent(
    new PointerEvent("pointer" + s, { isPrimary: !0, bubbles: !0 }),
  );
}
const jE = (n, s) => {
  const l = n.currentTarget;
  if (!l) return;
  const o = zg(() => {
    if (No.has(l)) return;
    Rc(l, "down");
    const c = zg(() => {
        Rc(l, "up");
      }),
      d = () => Rc(l, "cancel");
    (l.addEventListener("keyup", c, s), l.addEventListener("blur", d, s));
  });
  (l.addEventListener("keydown", o, s),
    l.addEventListener("blur", () => l.removeEventListener("keydown", o), s));
};
function Vg(n) {
  return Ff(n) && !bx();
}
const _g = new WeakSet();
function ME(n, s, l = {}) {
  const [o, c, d] = vx(n, l),
    f = (p) => {
      const m = p.currentTarget;
      if (!Vg(p) || _g.has(p)) return;
      (No.add(m), l.stopPropagation && _g.add(p));
      const g = s(m, p),
        x = { ...c, capture: !0 },
        v = (A, C) => {
          (window.removeEventListener("pointerup", S, x),
            window.removeEventListener("pointercancel", j, x),
            No.has(m) && No.delete(m),
            Vg(A) && typeof g == "function" && g(A, { success: C }));
        },
        S = (A) => {
          v(
            A,
            m === window ||
              m === document ||
              l.useGlobalTarget ||
              Sx(m, A.target),
          );
        },
        j = (A) => {
          v(A, !1);
        };
      (window.addEventListener("pointerup", S, x),
        window.addEventListener("pointercancel", j, x));
    };
  return (
    o.forEach((p) => {
      ((l.useGlobalTarget ? window : p).addEventListener("pointerdown", f, c),
        Mo(p) &&
          (p.addEventListener("focus", (g) => jE(g, c)),
          !EE(p) && !p.hasAttribute("tabindex") && (p.tabIndex = 0)));
    }),
    d
  );
}
function qf(n) {
  return A0(n) && "ownerSVGElement" in n;
}
const Ro = new WeakMap();
let Do;
const Tx = (n, s, l) => (o, c) =>
    c && c[0]
      ? c[0][n + "Size"]
      : qf(o) && "getBBox" in o
        ? o.getBBox()[s]
        : o[l],
  NE = Tx("inline", "width", "offsetWidth"),
  RE = Tx("block", "height", "offsetHeight");
function DE({ target: n, borderBoxSize: s }) {
  Ro.get(n)?.forEach((l) => {
    l(n, {
      get width() {
        return NE(n, s);
      },
      get height() {
        return RE(n, s);
      },
    });
  });
}
function kE(n) {
  n.forEach(DE);
}
function OE() {
  typeof ResizeObserver > "u" || (Do = new ResizeObserver(kE));
}
function BE(n, s) {
  Do || OE();
  const l = xx(n);
  return (
    l.forEach((o) => {
      let c = Ro.get(o);
      (c || ((c = new Set()), Ro.set(o, c)), c.add(s), Do?.observe(o));
    }),
    () => {
      l.forEach((o) => {
        const c = Ro.get(o);
        (c?.delete(s), c?.size || Do?.unobserve(o));
      });
    }
  );
}
const ko = new Set();
let js;
function zE() {
  ((js = () => {
    const n = {
      get width() {
        return window.innerWidth;
      },
      get height() {
        return window.innerHeight;
      },
    };
    ko.forEach((s) => s(n));
  }),
    window.addEventListener("resize", js));
}
function VE(n) {
  return (
    ko.add(n),
    js || zE(),
    () => {
      (ko.delete(n),
        !ko.size &&
          typeof js == "function" &&
          (window.removeEventListener("resize", js), (js = void 0)));
    }
  );
}
function Lg(n, s) {
  return typeof n == "function" ? VE(n) : BE(n, s);
}
function _E(n) {
  return qf(n) && n.tagName === "svg";
}
const LE = [...px, $t, $e],
  UE = (n) => LE.find(mx(n)),
  Ug = () => ({ translate: 0, scale: 1, origin: 0, originPoint: 0 }),
  Ms = () => ({ x: Ug(), y: Ug() }),
  Hg = () => ({ min: 0, max: 0 }),
  te = () => ({ x: Hg(), y: Hg() }),
  HE = new WeakMap();
function tr(n) {
  return n !== null && typeof n == "object" && typeof n.start == "function";
}
function $i(n) {
  return typeof n == "string" || Array.isArray(n);
}
const Yf = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit",
  ],
  Xf = ["initial", ...Yf];
function er(n) {
  return tr(n.animate) || Xf.some((s) => $i(n[s]));
}
function wx(n) {
  return !!(er(n) || n.variants);
}
function GE(n, s, l) {
  for (const o in s) {
    const c = s[o],
      d = l[o];
    if (ce(c)) n.addValue(o, c);
    else if (ce(d)) n.addValue(o, Ds(c, { owner: n }));
    else if (d !== c)
      if (n.hasValue(o)) {
        const f = n.getValue(o);
        f.liveStyle === !0 ? f.jump(c) : f.hasAnimated || f.set(c);
      } else {
        const f = n.getStaticValue(o);
        n.addValue(o, Ds(f !== void 0 ? f : c, { owner: n }));
      }
  }
  for (const o in l) s[o] === void 0 && n.removeValue(o);
  return s;
}
const cf = { current: null },
  Ex = { current: !1 },
  FE = typeof window < "u";
function qE() {
  if (((Ex.current = !0), !!FE))
    if (window.matchMedia) {
      const n = window.matchMedia("(prefers-reduced-motion)"),
        s = () => (cf.current = n.matches);
      (n.addEventListener("change", s), s());
    } else cf.current = !1;
}
const Gg = [
  "AnimationStart",
  "AnimationComplete",
  "Update",
  "BeforeLayoutMeasure",
  "LayoutMeasure",
  "LayoutAnimationStart",
  "LayoutAnimationComplete",
];
let Yo = {};
function Ax(n) {
  Yo = n;
}
function YE() {
  return Yo;
}
class XE {
  scrapeMotionValuesFromProps(s, l, o) {
    return {};
  }
  constructor(
    {
      parent: s,
      props: l,
      presenceContext: o,
      reducedMotionConfig: c,
      skipAnimations: d,
      blockInitialAnimation: f,
      visualState: p,
    },
    m = {},
  ) {
    ((this.current = null),
      (this.children = new Set()),
      (this.isVariantNode = !1),
      (this.isControllingVariants = !1),
      (this.shouldReduceMotion = null),
      (this.shouldSkipAnimations = !1),
      (this.values = new Map()),
      (this.KeyframeResolver = zf),
      (this.features = {}),
      (this.valueSubscriptions = new Map()),
      (this.prevMotionValues = {}),
      (this.hasBeenMounted = !1),
      (this.events = {}),
      (this.propEventSubscriptions = {}),
      (this.notifyUpdate = () => this.notify("Update", this.latestValues)),
      (this.render = () => {
        this.current &&
          (this.triggerBuild(),
          this.renderInstance(
            this.current,
            this.renderState,
            this.props.style,
            this.projection,
          ));
      }),
      (this.renderScheduledAt = 0),
      (this.scheduleRender = () => {
        const j = pe.now();
        this.renderScheduledAt < j &&
          ((this.renderScheduledAt = j), _t.render(this.render, !1, !0));
      }));
    const { latestValues: g, renderState: x } = p;
    ((this.latestValues = g),
      (this.baseTarget = { ...g }),
      (this.initialValues = l.initial ? { ...g } : {}),
      (this.renderState = x),
      (this.parent = s),
      (this.props = l),
      (this.presenceContext = o),
      (this.depth = s ? s.depth + 1 : 0),
      (this.reducedMotionConfig = c),
      (this.skipAnimationsConfig = d),
      (this.options = m),
      (this.blockInitialAnimation = !!f),
      (this.isControllingVariants = er(l)),
      (this.isVariantNode = wx(l)),
      this.isVariantNode && (this.variantChildren = new Set()),
      (this.manuallyAnimateOnMount = !!(s && s.current)));
    const { willChange: v, ...S } = this.scrapeMotionValuesFromProps(
      l,
      {},
      this,
    );
    for (const j in S) {
      const A = S[j];
      g[j] !== void 0 && ce(A) && A.set(g[j]);
    }
  }
  mount(s) {
    if (this.hasBeenMounted)
      for (const l in this.initialValues)
        (this.values.get(l)?.jump(this.initialValues[l]),
          (this.latestValues[l] = this.initialValues[l]));
    ((this.current = s),
      HE.set(s, this),
      this.projection && !this.projection.instance && this.projection.mount(s),
      this.parent &&
        this.isVariantNode &&
        !this.isControllingVariants &&
        (this.removeFromVariantTree = this.parent.addVariantChild(this)),
      this.values.forEach((l, o) => this.bindToMotionValue(o, l)),
      this.reducedMotionConfig === "never"
        ? (this.shouldReduceMotion = !1)
        : this.reducedMotionConfig === "always"
          ? (this.shouldReduceMotion = !0)
          : (Ex.current || qE(), (this.shouldReduceMotion = cf.current)),
      (this.shouldSkipAnimations = this.skipAnimationsConfig ?? !1),
      this.parent?.addChild(this),
      this.update(this.props, this.presenceContext),
      (this.hasBeenMounted = !0));
  }
  unmount() {
    (this.projection && this.projection.unmount(),
      la(this.notifyUpdate),
      la(this.render),
      this.valueSubscriptions.forEach((s) => s()),
      this.valueSubscriptions.clear(),
      this.removeFromVariantTree && this.removeFromVariantTree(),
      this.parent?.removeChild(this));
    for (const s in this.events) this.events[s].clear();
    for (const s in this.features) {
      const l = this.features[s];
      l && (l.unmount(), (l.isMounted = !1));
    }
    this.current = null;
  }
  addChild(s) {
    (this.children.add(s),
      this.enteringChildren ?? (this.enteringChildren = new Set()),
      this.enteringChildren.add(s));
  }
  removeChild(s) {
    (this.children.delete(s),
      this.enteringChildren && this.enteringChildren.delete(s));
  }
  bindToMotionValue(s, l) {
    if (
      (this.valueSubscriptions.has(s) && this.valueSubscriptions.get(s)(),
      l.accelerate && lx.has(s) && this.current instanceof HTMLElement)
    ) {
      const {
          factory: f,
          keyframes: p,
          times: m,
          ease: g,
          duration: x,
        } = l.accelerate,
        v = new sx({
          element: this.current,
          name: s,
          keyframes: p,
          times: m,
          ease: g,
          duration: De(x),
        }),
        S = f(v);
      this.valueSubscriptions.set(s, () => {
        (S(), v.cancel());
      });
      return;
    }
    const o = zs.has(s);
    o && this.onBindTransform && this.onBindTransform();
    const c = l.on("change", (f) => {
      ((this.latestValues[s] = f),
        this.props.onUpdate && _t.preRender(this.notifyUpdate),
        o && this.projection && (this.projection.isTransformDirty = !0),
        this.scheduleRender());
    });
    let d;
    (typeof window < "u" &&
      window.MotionCheckAppearSync &&
      (d = window.MotionCheckAppearSync(this, s, l)),
      this.valueSubscriptions.set(s, () => {
        (c(), d && d());
      }));
  }
  sortNodePosition(s) {
    return !this.current ||
      !this.sortInstanceNodePosition ||
      this.type !== s.type
      ? 0
      : this.sortInstanceNodePosition(this.current, s.current);
  }
  updateFeatures() {
    let s = "animation";
    for (s in Yo) {
      const l = Yo[s];
      if (!l) continue;
      const { isEnabled: o, Feature: c } = l;
      if (
        (!this.features[s] &&
          c &&
          o(this.props) &&
          (this.features[s] = new c(this)),
        this.features[s])
      ) {
        const d = this.features[s];
        d.isMounted ? d.update() : (d.mount(), (d.isMounted = !0));
      }
    }
  }
  triggerBuild() {
    this.build(this.renderState, this.latestValues, this.props);
  }
  measureViewportBox() {
    return this.current
      ? this.measureInstanceViewportBox(this.current, this.props)
      : te();
  }
  getStaticValue(s) {
    return this.latestValues[s];
  }
  setStaticValue(s, l) {
    this.latestValues[s] = l;
  }
  update(s, l) {
    ((s.transformTemplate || this.props.transformTemplate) &&
      this.scheduleRender(),
      (this.prevProps = this.props),
      (this.props = s),
      (this.prevPresenceContext = this.presenceContext),
      (this.presenceContext = l));
    for (let o = 0; o < Gg.length; o++) {
      const c = Gg[o];
      this.propEventSubscriptions[c] &&
        (this.propEventSubscriptions[c](),
        delete this.propEventSubscriptions[c]);
      const d = "on" + c,
        f = s[d];
      f && (this.propEventSubscriptions[c] = this.on(c, f));
    }
    ((this.prevMotionValues = GE(
      this,
      this.scrapeMotionValuesFromProps(s, this.prevProps || {}, this),
      this.prevMotionValues,
    )),
      this.handleChildMotionValue && this.handleChildMotionValue());
  }
  getProps() {
    return this.props;
  }
  getVariant(s) {
    return this.props.variants ? this.props.variants[s] : void 0;
  }
  getDefaultTransition() {
    return this.props.transition;
  }
  getTransformPagePoint() {
    return this.props.transformPagePoint;
  }
  getClosestVariantNode() {
    return this.isVariantNode
      ? this
      : this.parent
        ? this.parent.getClosestVariantNode()
        : void 0;
  }
  addVariantChild(s) {
    const l = this.getClosestVariantNode();
    if (l)
      return (
        l.variantChildren && l.variantChildren.add(s),
        () => l.variantChildren.delete(s)
      );
  }
  addValue(s, l) {
    const o = this.values.get(s);
    l !== o &&
      (o && this.removeValue(s),
      this.bindToMotionValue(s, l),
      this.values.set(s, l),
      (this.latestValues[s] = l.get()));
  }
  removeValue(s) {
    this.values.delete(s);
    const l = this.valueSubscriptions.get(s);
    (l && (l(), this.valueSubscriptions.delete(s)),
      delete this.latestValues[s],
      this.removeValueFromRenderState(s, this.renderState));
  }
  hasValue(s) {
    return this.values.has(s);
  }
  getValue(s, l) {
    if (this.props.values && this.props.values[s]) return this.props.values[s];
    let o = this.values.get(s);
    return (
      o === void 0 &&
        l !== void 0 &&
        ((o = Ds(l === null ? void 0 : l, { owner: this })),
        this.addValue(s, o)),
      o
    );
  }
  readValue(s, l) {
    let o =
      this.latestValues[s] !== void 0 || !this.current
        ? this.latestValues[s]
        : (this.getBaseTargetFromProps(this.props, s) ??
          this.readValueFromInstance(this.current, s, this.options));
    return (
      o != null &&
        (typeof o == "string" && (E0(o) || C0(o))
          ? (o = parseFloat(o))
          : !UE(o) && $e.test(l) && (o = yx(s, l)),
        this.setBaseTarget(s, ce(o) ? o.get() : o)),
      ce(o) ? o.get() : o
    );
  }
  setBaseTarget(s, l) {
    this.baseTarget[s] = l;
  }
  getBaseTarget(s) {
    const { initial: l } = this.props;
    let o;
    if (typeof l == "string" || typeof l == "object") {
      const d = Lf(this.props, l, this.presenceContext?.custom);
      d && (o = d[s]);
    }
    if (l && o !== void 0) return o;
    const c = this.getBaseTargetFromProps(this.props, s);
    return c !== void 0 && !ce(c)
      ? c
      : this.initialValues[s] !== void 0 && o === void 0
        ? void 0
        : this.baseTarget[s];
  }
  on(s, l) {
    return (
      this.events[s] || (this.events[s] = new Cf()),
      this.events[s].add(l)
    );
  }
  notify(s, ...l) {
    this.events[s] && this.events[s].notify(...l);
  }
  scheduleRenderMicrotask() {
    Gf.render(this.render);
  }
}
class Cx extends XE {
  constructor() {
    (super(...arguments), (this.KeyframeResolver = bE));
  }
  sortInstanceNodePosition(s, l) {
    return s.compareDocumentPosition(l) & 2 ? 1 : -1;
  }
  getBaseTargetFromProps(s, l) {
    const o = s.style;
    return o ? o[l] : void 0;
  }
  removeValueFromRenderState(s, { vars: l, style: o }) {
    (delete l[s], delete o[s]);
  }
  handleChildMotionValue() {
    this.childSubscription &&
      (this.childSubscription(), delete this.childSubscription);
    const { children: s } = this.props;
    ce(s) &&
      (this.childSubscription = s.on("change", (l) => {
        this.current && (this.current.textContent = `${l}`);
      }));
  }
}
class ua {
  constructor(s) {
    ((this.isMounted = !1), (this.node = s));
  }
  update() {}
}
function jx({ top: n, left: s, right: l, bottom: o }) {
  return { x: { min: s, max: l }, y: { min: n, max: o } };
}
function KE({ x: n, y: s }) {
  return { top: s.min, right: n.max, bottom: s.max, left: n.min };
}
function ZE(n, s) {
  if (!s) return n;
  const l = s({ x: n.left, y: n.top }),
    o = s({ x: n.right, y: n.bottom });
  return { top: l.y, left: l.x, bottom: o.y, right: o.x };
}
function Dc(n) {
  return n === void 0 || n === 1;
}
function ff({ scale: n, scaleX: s, scaleY: l }) {
  return !Dc(n) || !Dc(s) || !Dc(l);
}
function Da(n) {
  return (
    ff(n) ||
    Mx(n) ||
    n.z ||
    n.rotate ||
    n.rotateX ||
    n.rotateY ||
    n.skewX ||
    n.skewY
  );
}
function Mx(n) {
  return Fg(n.x) || Fg(n.y);
}
function Fg(n) {
  return n && n !== "0%";
}
function Xo(n, s, l) {
  const o = n - l,
    c = s * o;
  return l + c;
}
function qg(n, s, l, o, c) {
  return (c !== void 0 && (n = Xo(n, c, o)), Xo(n, l, o) + s);
}
function df(n, s = 0, l = 1, o, c) {
  ((n.min = qg(n.min, s, l, o, c)), (n.max = qg(n.max, s, l, o, c)));
}
function Nx(n, { x: s, y: l }) {
  (df(n.x, s.translate, s.scale, s.originPoint),
    df(n.y, l.translate, l.scale, l.originPoint));
}
const Yg = 0.999999999999,
  Xg = 1.0000000000001;
function QE(n, s, l, o = !1) {
  const c = l.length;
  if (!c) return;
  s.x = s.y = 1;
  let d, f;
  for (let p = 0; p < c; p++) {
    ((d = l[p]), (f = d.projectionDelta));
    const { visualElement: m } = d.options;
    (m && m.props.style && m.props.style.display === "contents") ||
      (o &&
        d.options.layoutScroll &&
        d.scroll &&
        d !== d.root &&
        (on(n.x, -d.scroll.offset.x), on(n.y, -d.scroll.offset.y)),
      f && ((s.x *= f.x.scale), (s.y *= f.y.scale), Nx(n, f)),
      o && Da(d.latestValues) && Oo(n, d.latestValues, d.layout?.layoutBox));
  }
  (s.x < Xg && s.x > Yg && (s.x = 1), s.y < Xg && s.y > Yg && (s.y = 1));
}
function on(n, s) {
  ((n.min += s), (n.max += s));
}
function Kg(n, s, l, o, c = 0.5) {
  const d = Vt(n.min, n.max, c);
  df(n, s, l, d, o);
}
function Zg(n, s) {
  return typeof n == "string" ? (parseFloat(n) / 100) * (s.max - s.min) : n;
}
function Oo(n, s, l) {
  const o = l ?? n;
  (Kg(n.x, Zg(s.x, o.x), s.scaleX, s.scale, s.originX),
    Kg(n.y, Zg(s.y, o.y), s.scaleY, s.scale, s.originY));
}
function Rx(n, s) {
  return jx(ZE(n.getBoundingClientRect(), s));
}
function PE(n, s, l) {
  const o = Rx(n, l),
    { scroll: c } = s;
  return (c && (on(o.x, c.offset.x), on(o.y, c.offset.y)), o);
}
const $E = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective",
  },
  JE = Bs.length;
function WE(n, s, l) {
  let o = "",
    c = !0;
  for (let f = 0; f < JE; f++) {
    const p = Bs[f],
      m = n[p];
    if (m === void 0) continue;
    let g = !0;
    if (typeof m == "number") g = m === (p.startsWith("scale") ? 1 : 0);
    else {
      const x = parseFloat(m);
      g = p.startsWith("scale") ? x === 1 : x === 0;
    }
    if (!g || l) {
      const x = uf(m, qo[p]);
      if (!g) {
        c = !1;
        const v = $E[p] || p;
        o += `${v}(${x}) `;
      }
      l && (s[p] = x);
    }
  }
  const d = n.pathRotation;
  return (
    d && ((c = !1), (o += `rotate(${uf(d, qo.pathRotation)}) `)),
    (o = o.trim()),
    l ? (o = l(s, c ? "" : o)) : c && (o = "none"),
    o
  );
}
function Kf(n, s, l) {
  const { style: o, vars: c, transformOrigin: d } = n;
  let f = !1,
    p = !1;
  for (const m in s) {
    const g = s[m];
    if (zs.has(m)) {
      f = !0;
      continue;
    } else if (G0(m)) {
      c[m] = g;
      continue;
    } else {
      const x = uf(g, qo[m]);
      m.startsWith("origin") ? ((p = !0), (d[m] = x)) : (o[m] = x);
    }
  }
  if (
    (s.transform ||
      (f || l
        ? (o.transform = WE(s, n.transform, l))
        : o.transform && (o.transform = "none")),
    p)
  ) {
    const { originX: m = "50%", originY: g = "50%", originZ: x = 0 } = d;
    o.transformOrigin = `${m} ${g} ${x}`;
  }
}
function Dx(n, { style: s, vars: l }, o, c) {
  const d = n.style;
  let f;
  for (f in s) d[f] = s[f];
  c?.applyProjectionStyles(d, o);
  for (f in l) d.setProperty(f, l[f]);
}
function Qg(n, s) {
  return s.max === s.min ? 0 : (n / (s.max - s.min)) * 100;
}
const Vi = {
    correct: (n, s) => {
      if (!s.target) return n;
      if (typeof n == "string")
        if (ot.test(n)) n = parseFloat(n);
        else return n;
      const l = Qg(n, s.target.x),
        o = Qg(n, s.target.y);
      return `${l}% ${o}%`;
    },
  },
  IE = {
    correct: (n, { treeScale: s, projectionDelta: l }) => {
      const o = n,
        c = $e.parse(n);
      if (c.length > 5) return o;
      const d = $e.createTransformer(n),
        f = typeof c[0] != "number" ? 1 : 0,
        p = l.x.scale * s.x,
        m = l.y.scale * s.y;
      ((c[0 + f] /= p), (c[1 + f] /= m));
      const g = Vt(p, m, 0.5);
      return (
        typeof c[2 + f] == "number" && (c[2 + f] /= g),
        typeof c[3 + f] == "number" && (c[3 + f] /= g),
        d(c)
      );
    },
  },
  hf = {
    borderRadius: { ...Vi, applyTo: [...Hf] },
    borderTopLeftRadius: Vi,
    borderTopRightRadius: Vi,
    borderBottomLeftRadius: Vi,
    borderBottomRightRadius: Vi,
    boxShadow: IE,
  };
function kx(n, { layout: s, layoutId: l }) {
  return (
    zs.has(n) ||
    n.startsWith("origin") ||
    ((s || l !== void 0) && (!!hf[n] || n === "opacity"))
  );
}
function Zf(n, s, l) {
  const o = n.style,
    c = s?.style,
    d = {};
  if (!o) return d;
  for (const f in o)
    (ce(o[f]) ||
      (c && ce(c[f])) ||
      kx(f, n) ||
      l?.getValue(f)?.liveStyle !== void 0) &&
      (d[f] = o[f]);
  return d;
}
function tA(n) {
  return window.getComputedStyle(n);
}
class eA extends Cx {
  constructor() {
    (super(...arguments), (this.type = "html"), (this.renderInstance = Dx));
  }
  mount(s) {
    (Wo(!!s.style), super.mount(s));
  }
  readValueFromInstance(s, l) {
    if (zs.has(l)) return this.projection?.isProjecting ? Jc(l) : Sw(s, l);
    {
      const o = tA(s),
        c = (G0(l) ? o.getPropertyValue(l) : o[l]) || 0;
      return typeof c == "string" ? c.trim() : c;
    }
  }
  measureInstanceViewportBox(s, { transformPagePoint: l }) {
    return Rx(s, l);
  }
  build(s, l, o) {
    Kf(s, l, o.transformTemplate);
  }
  scrapeMotionValuesFromProps(s, l, o) {
    return Zf(s, l, o);
  }
}
const nA = { offset: "stroke-dashoffset", array: "stroke-dasharray" },
  aA = { offset: "strokeDashoffset", array: "strokeDasharray" };
function sA(n, s, l = 1, o = 0, c = !0) {
  n.pathLength = 1;
  const d = c ? nA : aA;
  ((n[d.offset] = `${-o}`), (n[d.array] = `${s} ${l}`));
}
const iA = ["offsetDistance", "offsetPath", "offsetRotate", "offsetAnchor"];
function Ox(
  n,
  {
    attrX: s,
    attrY: l,
    attrScale: o,
    pathLength: c,
    pathSpacing: d = 1,
    pathOffset: f = 0,
    ...p
  },
  m,
  g,
  x,
) {
  if ((Kf(n, p, g), m)) {
    n.style.viewBox && (n.attrs.viewBox = n.style.viewBox);
    return;
  }
  ((n.attrs = n.style), (n.style = {}));
  const { attrs: v, style: S } = n;
  (v.transform && ((S.transform = v.transform), delete v.transform),
    (S.transform || v.transformOrigin) &&
      ((S.transformOrigin = v.transformOrigin ?? "50% 50%"),
      delete v.transformOrigin),
    S.transform &&
      ((S.transformBox = x?.transformBox ?? "fill-box"),
      delete v.transformBox));
  for (const j of iA) v[j] !== void 0 && ((S[j] = v[j]), delete v[j]);
  (s !== void 0 && (v.x = s),
    l !== void 0 && (v.y = l),
    o !== void 0 && (v.scale = o),
    c !== void 0 && sA(v, c, d, f, !1));
}
const Bx = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust",
  ]),
  zx = (n) => typeof n == "string" && n.toLowerCase() === "svg";
function lA(n, s, l, o) {
  Dx(n, s, void 0, o);
  for (const c in s.attrs) n.setAttribute(Bx.has(c) ? c : Uf(c), s.attrs[c]);
}
function Vx(n, s, l) {
  const o = Zf(n, s, l);
  for (const c in n)
    if (ce(n[c]) || ce(s[c])) {
      const d =
        Bs.indexOf(c) !== -1
          ? "attr" + c.charAt(0).toUpperCase() + c.substring(1)
          : c;
      o[d] = n[c];
    }
  return o;
}
class oA extends Cx {
  constructor() {
    (super(...arguments),
      (this.type = "svg"),
      (this.isSVGTag = !1),
      (this.measureInstanceViewportBox = te));
  }
  getBaseTargetFromProps(s, l) {
    return s[l];
  }
  readValueFromInstance(s, l) {
    if (zs.has(l)) {
      const o = gx(l);
      return (o && o.default) || 0;
    }
    return ((l = Bx.has(l) ? l : Uf(l)), s.getAttribute(l));
  }
  scrapeMotionValuesFromProps(s, l, o) {
    return Vx(s, l, o);
  }
  build(s, l, o) {
    Ox(s, l, this.isSVGTag, o.transformTemplate, o.style);
  }
  renderInstance(s, l, o, c) {
    lA(s, l, o, c);
  }
  mount(s) {
    ((this.isSVGTag = zx(s.tagName)), super.mount(s));
  }
}
const rA = Xf.length;
function _x(n) {
  if (!n) return;
  if (!n.isControllingVariants) {
    const l = n.parent ? _x(n.parent) || {} : {};
    return (n.props.initial !== void 0 && (l.initial = n.props.initial), l);
  }
  const s = {};
  for (let l = 0; l < rA; l++) {
    const o = Xf[l],
      c = n.props[o];
    ($i(c) || c === !1) && (s[o] = c);
  }
  return s;
}
function Lx(n, s) {
  if (!Array.isArray(s)) return !1;
  const l = s.length;
  if (l !== n.length) return !1;
  for (let o = 0; o < l; o++) if (s[o] !== n[o]) return !1;
  return !0;
}
const uA = [...Yf].reverse(),
  cA = Yf.length;
function fA(n) {
  return (s) =>
    Promise.all(s.map(({ animation: l, options: o }) => rE(n, l, o)));
}
function dA(n) {
  let s = fA(n),
    l = Pg(),
    o = !0,
    c = !1;
  const d = (g) => (x, v) => {
    const S = za(n, v, g === "exit" ? n.presenceContext?.custom : void 0);
    if (S) {
      const { transition: j, transitionEnd: A, ...C } = S;
      x = { ...x, ...C, ...A };
    }
    return x;
  };
  function f(g) {
    s = g(n);
  }
  function p(g) {
    const { props: x } = n,
      v = _x(n.parent) || {},
      S = [],
      j = new Set();
    let A = {},
      C = 1 / 0;
    for (let H = 0; H < cA; H++) {
      const U = uA[H],
        L = l[U],
        K = x[U] !== void 0 ? x[U] : v[U],
        P = $i(K),
        st = U === g ? L.isActive : null;
      st === !1 && (C = H);
      let nt = K === v[U] && K !== x[U] && P;
      if (
        (nt && (o || c) && n.manuallyAnimateOnMount && (nt = !1),
        (L.protectedKeys = { ...A }),
        (!L.isActive && st === null) ||
          (!K && !L.prevProp) ||
          tr(K) ||
          typeof K == "boolean")
      )
        continue;
      if (U === "exit" && L.isActive && st !== !0) {
        L.prevResolvedValues && (A = { ...A, ...L.prevResolvedValues });
        continue;
      }
      const V = hA(L.prevProp, K);
      let J = V || (U === g && L.isActive && !nt && P) || (H > C && P),
        Z = !1;
      const mt = Array.isArray(K) ? K : [K];
      let ht = mt.reduce(d(U), {});
      st === !1 && (ht = {});
      const { prevResolvedValues: Ut = {} } = L,
        vt = { ...Ut, ...ht },
        pt = (W) => {
          ((J = !0),
            j.has(W) && ((Z = !0), j.delete(W)),
            (L.needsAnimating[W] = !0));
          const ut = n.getValue(W);
          ut && (ut.liveStyle = !1);
        };
      for (const W in vt) {
        const ut = ht[W],
          T = Ut[W];
        if (A.hasOwnProperty(W)) continue;
        let F = !1;
        (af(ut) && af(T) ? (F = !Lx(ut, T) || V) : (F = ut !== T),
          F
            ? ut != null
              ? pt(W)
              : j.add(W)
            : ut !== void 0 && j.has(W)
              ? pt(W)
              : (L.protectedKeys[W] = !0));
      }
      ((L.prevProp = K),
        (L.prevResolvedValues = ht),
        L.isActive && (A = { ...A, ...ht }),
        (o || c) && n.blockInitialAnimation && (J = !1));
      const O = nt && V;
      J &&
        (!O || Z) &&
        S.push(
          ...mt.map((W) => {
            const ut = { type: U };
            if (
              typeof W == "string" &&
              (o || c) &&
              !O &&
              n.manuallyAnimateOnMount &&
              n.parent
            ) {
              const { parent: T } = n,
                F = za(T, W);
              if (T.enteringChildren && F) {
                const { delayChildren: tt } = F.transition || {};
                ut.delay = ox(T.enteringChildren, n, tt);
              }
            }
            return { animation: W, options: ut };
          }),
        );
    }
    if (j.size) {
      const H = {};
      if (typeof x.initial != "boolean") {
        const U = za(n, Array.isArray(x.initial) ? x.initial[0] : x.initial);
        U && U.transition && (H.transition = U.transition);
      }
      (j.forEach((U) => {
        const L = n.getBaseTarget(U),
          K = n.getValue(U);
        (K && (K.liveStyle = !0), (H[U] = L ?? null));
      }),
        S.push({ animation: H }));
    }
    let k = !!S.length;
    return (
      o &&
        (x.initial === !1 || x.initial === x.animate) &&
        !n.manuallyAnimateOnMount &&
        (k = !1),
      (o = !1),
      (c = !1),
      k ? s(S) : Promise.resolve()
    );
  }
  function m(g, x) {
    if (l[g].isActive === x) return Promise.resolve();
    (n.variantChildren?.forEach((S) => S.animationState?.setActive(g, x)),
      (l[g].isActive = x));
    const v = p(g);
    for (const S in l) l[S].protectedKeys = {};
    return v;
  }
  return {
    animateChanges: p,
    setActive: m,
    setAnimateFunction: f,
    getState: () => l,
    reset: () => {
      ((l = Pg()), (c = !0));
    },
  };
}
function hA(n, s) {
  return typeof s == "string" ? s !== n : Array.isArray(s) ? !Lx(s, n) : !1;
}
function Ra(n = !1) {
  return {
    isActive: n,
    protectedKeys: {},
    needsAnimating: {},
    prevResolvedValues: {},
  };
}
function Pg() {
  return {
    animate: Ra(!0),
    whileInView: Ra(),
    whileHover: Ra(),
    whileTap: Ra(),
    whileDrag: Ra(),
    whileFocus: Ra(),
    exit: Ra(),
  };
}
function mf(n, s) {
  ((n.min = s.min), (n.max = s.max));
}
function Ke(n, s) {
  (mf(n.x, s.x), mf(n.y, s.y));
}
function $g(n, s) {
  ((n.translate = s.translate),
    (n.scale = s.scale),
    (n.originPoint = s.originPoint),
    (n.origin = s.origin));
}
const Ux = 1e-4,
  mA = 1 - Ux,
  pA = 1 + Ux,
  Hx = 0.01,
  gA = 0 - Hx,
  yA = 0 + Hx;
function ge(n) {
  return n.max - n.min;
}
function xA(n, s, l) {
  return Math.abs(n - s) <= l;
}
function Jg(n, s, l, o = 0.5) {
  ((n.origin = o),
    (n.originPoint = Vt(s.min, s.max, n.origin)),
    (n.scale = ge(l) / ge(s)),
    (n.translate = Vt(l.min, l.max, n.origin) - n.originPoint),
    ((n.scale >= mA && n.scale <= pA) || isNaN(n.scale)) && (n.scale = 1),
    ((n.translate >= gA && n.translate <= yA) || isNaN(n.translate)) &&
      (n.translate = 0));
}
function Yi(n, s, l, o) {
  (Jg(n.x, s.x, l.x, o ? o.originX : void 0),
    Jg(n.y, s.y, l.y, o ? o.originY : void 0));
}
function Wg(n, s, l, o = 0) {
  const c = o ? Vt(l.min, l.max, o) : l.min;
  ((n.min = c + s.min), (n.max = n.min + ge(s)));
}
function bA(n, s, l, o) {
  (Wg(n.x, s.x, l.x, o?.x), Wg(n.y, s.y, l.y, o?.y));
}
function Ig(n, s, l, o = 0) {
  const c = o ? Vt(l.min, l.max, o) : l.min;
  ((n.min = s.min - c), (n.max = n.min + ge(s)));
}
function Ko(n, s, l, o) {
  (Ig(n.x, s.x, l.x, o?.x), Ig(n.y, s.y, l.y, o?.y));
}
function ty(n, s, l, o, c) {
  return (
    (n -= s),
    (n = Xo(n, 1 / l, o)),
    c !== void 0 && (n = Xo(n, 1 / c, o)),
    n
  );
}
function vA(n, s = 0, l = 1, o = 0.5, c, d = n, f = n) {
  if (
    (rn.test(s) &&
      ((s = parseFloat(s)), (s = Vt(f.min, f.max, s / 100) - f.min)),
    typeof s != "number")
  )
    return;
  let p = Vt(d.min, d.max, o);
  (n === d && (p -= s),
    (n.min = ty(n.min, s, l, p, c)),
    (n.max = ty(n.max, s, l, p, c)));
}
function ey(n, s, [l, o, c], d, f) {
  vA(n, s[l], s[o], s[c], s.scale, d, f);
}
const SA = ["x", "scaleX", "originX"],
  TA = ["y", "scaleY", "originY"];
function ny(n, s, l, o) {
  (ey(n.x, s, SA, l ? l.x : void 0, o ? o.x : void 0),
    ey(n.y, s, TA, l ? l.y : void 0, o ? o.y : void 0));
}
function ay(n) {
  return n.translate === 0 && n.scale === 1;
}
function Gx(n) {
  return ay(n.x) && ay(n.y);
}
function sy(n, s) {
  return n.min === s.min && n.max === s.max;
}
function wA(n, s) {
  return sy(n.x, s.x) && sy(n.y, s.y);
}
function iy(n, s) {
  return (
    Math.round(n.min) === Math.round(s.min) &&
    Math.round(n.max) === Math.round(s.max)
  );
}
function Fx(n, s) {
  return iy(n.x, s.x) && iy(n.y, s.y);
}
function ly(n) {
  return ge(n.x) / ge(n.y);
}
function oy(n, s) {
  return (
    n.translate === s.translate &&
    n.scale === s.scale &&
    n.originPoint === s.originPoint
  );
}
function ln(n) {
  return [n("x"), n("y")];
}
function EA(n, s, l) {
  let o = "";
  const c = n.x.translate / s.x,
    d = n.y.translate / s.y,
    f = l?.z || 0;
  if (
    ((c || d || f) && (o = `translate3d(${c}px, ${d}px, ${f}px) `),
    (s.x !== 1 || s.y !== 1) && (o += `scale(${1 / s.x}, ${1 / s.y}) `),
    l)
  ) {
    const {
      transformPerspective: g,
      rotate: x,
      pathRotation: v,
      rotateX: S,
      rotateY: j,
      skewX: A,
      skewY: C,
    } = l;
    (g && (o = `perspective(${g}px) ${o}`),
      x && (o += `rotate(${x}deg) `),
      v && (o += `rotate(${v}deg) `),
      S && (o += `rotateX(${S}deg) `),
      j && (o += `rotateY(${j}deg) `),
      A && (o += `skewX(${A}deg) `),
      C && (o += `skewY(${C}deg) `));
  }
  const p = n.x.scale * s.x,
    m = n.y.scale * s.y;
  return ((p !== 1 || m !== 1) && (o += `scale(${p}, ${m})`), o || "none");
}
const AA = Hf.length,
  ry = (n) => (typeof n == "string" ? parseFloat(n) : n),
  uy = (n) => typeof n == "number" || ot.test(n);
function CA(n, s, l, o, c, d) {
  c
    ? ((n.opacity = Vt(0, l.opacity ?? 1, jA(o))),
      (n.opacityExit = Vt(s.opacity ?? 1, 0, MA(o))))
    : d && (n.opacity = Vt(s.opacity ?? 1, l.opacity ?? 1, o));
  for (let f = 0; f < AA; f++) {
    const p = Hf[f];
    let m = cy(s, p),
      g = cy(l, p);
    if (m === void 0 && g === void 0) continue;
    (m || (m = 0),
      g || (g = 0),
      m === 0 || g === 0 || uy(m) === uy(g)
        ? ((n[p] = Math.max(Vt(ry(m), ry(g), o), 0)),
          (rn.test(g) || rn.test(m)) && (n[p] += "%"))
        : (n[p] = g));
  }
  (s.rotate || l.rotate) && (n.rotate = Vt(s.rotate || 0, l.rotate || 0, o));
}
function cy(n, s) {
  return n[s] !== void 0 ? n[s] : n.borderRadius;
}
const jA = qx(0, 0.5, z0),
  MA = qx(0.5, 0.95, Fe);
function qx(n, s, l) {
  return (o) => (o < n ? 0 : o > s ? 1 : l(Qi(n, s, o)));
}
function NA(n, s, l) {
  const o = ce(n) ? n : Ds(n);
  return (o.start(_f("", o, s, l)), o.animation);
}
function Ji(n, s, l, o = { passive: !0 }) {
  return (n.addEventListener(s, l, o), () => n.removeEventListener(s, l, o));
}
const RA = (n, s) => n.depth - s.depth;
class DA {
  constructor() {
    ((this.children = []), (this.isDirty = !1));
  }
  add(s) {
    (Af(this.children, s), (this.isDirty = !0));
  }
  remove(s) {
    (Lo(this.children, s), (this.isDirty = !0));
  }
  forEach(s) {
    (this.isDirty && this.children.sort(RA),
      (this.isDirty = !1),
      this.children.forEach(s));
  }
}
function kA(n, s) {
  const l = pe.now(),
    o = ({ timestamp: c }) => {
      const d = c - l;
      d >= s && (la(o), n(d - s));
    };
  return (_t.setup(o, !0), () => la(o));
}
function Bo(n) {
  return ce(n) ? n.get() : n;
}
class OA {
  constructor() {
    this.members = [];
  }
  add(s) {
    Af(this.members, s);
    for (let l = this.members.length - 1; l >= 0; l--) {
      const o = this.members[l];
      if (o === s || o === this.lead || o === this.prevLead) continue;
      const c = o.instance;
      (!c || c.isConnected === !1) &&
        !o.snapshot &&
        (Lo(this.members, o), o.unmount());
    }
    s.scheduleRender();
  }
  remove(s) {
    if (
      (Lo(this.members, s),
      s === this.prevLead && (this.prevLead = void 0),
      s === this.lead)
    ) {
      const l = this.members[this.members.length - 1];
      l && this.promote(l);
    }
  }
  relegate(s) {
    for (let l = this.members.indexOf(s) - 1; l >= 0; l--) {
      const o = this.members[l];
      if (o.isPresent !== !1 && o.instance?.isConnected !== !1)
        return (this.promote(o), !0);
    }
    return !1;
  }
  promote(s, l) {
    const o = this.lead;
    if (s !== o && ((this.prevLead = o), (this.lead = s), s.show(), o)) {
      (o.updateSnapshot(), s.scheduleRender());
      const { layoutDependency: c } = o.options,
        { layoutDependency: d } = s.options;
      ((c === void 0 || c !== d) &&
        ((s.resumeFrom = o),
        l && (o.preserveOpacity = !0),
        o.snapshot &&
          ((s.snapshot = o.snapshot),
          (s.snapshot.latestValues = o.animationValues || o.latestValues)),
        s.root?.isUpdating && (s.isLayoutDirty = !0)),
        s.options.crossfade === !1 && o.hide());
    }
  }
  exitAnimationComplete() {
    this.members.forEach((s) => {
      (s.options.onExitComplete?.(),
        s.resumingFrom?.options.onExitComplete?.());
    });
  }
  scheduleRender() {
    this.members.forEach((s) => s.instance && s.scheduleRender(!1));
  }
  removeLeadSnapshot() {
    this.lead?.snapshot && (this.lead.snapshot = void 0);
  }
}
const zo = { hasAnimatedSinceResize: !0, hasEverUpdated: !1 },
  kc = ["", "X", "Y", "Z"],
  BA = 1e3;
let zA = 0;
function Oc(n, s, l, o) {
  const { latestValues: c } = s;
  c[n] && ((l[n] = c[n]), s.setStaticValue(n, 0), o && (o[n] = 0));
}
function Yx(n) {
  if (((n.hasCheckedOptimisedAppear = !0), n.root === n)) return;
  const { visualElement: s } = n.options;
  if (!s) return;
  const l = dx(s);
  if (window.MotionHasOptimisedAnimation(l, "transform")) {
    const { layout: c, layoutId: d } = n.options;
    window.MotionCancelOptimisedAnimation(l, "transform", _t, !(c || d));
  }
  const { parent: o } = n;
  o && !o.hasCheckedOptimisedAppear && Yx(o);
}
function Xx({
  attachResizeListener: n,
  defaultParent: s,
  measureScroll: l,
  checkIsScrollRoot: o,
  resetTransform: c,
}) {
  return class {
    constructor(f = {}, p = s?.()) {
      ((this.id = zA++),
        (this.animationId = 0),
        (this.animationCommitId = 0),
        (this.children = new Set()),
        (this.options = {}),
        (this.isTreeAnimating = !1),
        (this.isAnimationBlocked = !1),
        (this.isLayoutDirty = !1),
        (this.isProjectionDirty = !1),
        (this.isSharedProjectionDirty = !1),
        (this.isTransformDirty = !1),
        (this.updateManuallyBlocked = !1),
        (this.updateBlockedByResize = !1),
        (this.isUpdating = !1),
        (this.isSVG = !1),
        (this.needsReset = !1),
        (this.shouldResetTransform = !1),
        (this.hasCheckedOptimisedAppear = !1),
        (this.treeScale = { x: 1, y: 1 }),
        (this.eventHandlers = new Map()),
        (this.hasTreeAnimated = !1),
        (this.layoutVersion = 0),
        (this.updateScheduled = !1),
        (this.scheduleUpdate = () => this.update()),
        (this.projectionUpdateScheduled = !1),
        (this.checkUpdateFailed = () => {
          this.isUpdating && ((this.isUpdating = !1), this.clearAllSnapshots());
        }),
        (this.updateProjection = () => {
          ((this.projectionUpdateScheduled = !1),
            this.nodes.forEach(LA),
            this.nodes.forEach(YA),
            this.nodes.forEach(XA),
            this.nodes.forEach(UA));
        }),
        (this.resolvedRelativeTargetAt = 0),
        (this.linkedParentVersion = 0),
        (this.hasProjected = !1),
        (this.isVisible = !0),
        (this.animationProgress = 0),
        (this.sharedNodes = new Map()),
        (this.latestValues = f),
        (this.root = p ? p.root || p : this),
        (this.path = p ? [...p.path, p] : []),
        (this.parent = p),
        (this.depth = p ? p.depth + 1 : 0));
      for (let m = 0; m < this.path.length; m++)
        this.path[m].shouldResetTransform = !0;
      this.root === this && (this.nodes = new DA());
    }
    addEventListener(f, p) {
      return (
        this.eventHandlers.has(f) || this.eventHandlers.set(f, new Cf()),
        this.eventHandlers.get(f).add(p)
      );
    }
    notifyListeners(f, ...p) {
      const m = this.eventHandlers.get(f);
      m && m.notify(...p);
    }
    hasListeners(f) {
      return this.eventHandlers.has(f);
    }
    mount(f) {
      if (this.instance) return;
      ((this.isSVG = qf(f) && !_E(f)), (this.instance = f));
      const { layoutId: p, layout: m, visualElement: g } = this.options;
      if (
        (g && !g.current && g.mount(f),
        this.root.nodes.add(this),
        this.parent && this.parent.children.add(this),
        this.root.hasTreeAnimated && (m || p) && (this.isLayoutDirty = !0),
        n)
      ) {
        let x,
          v = 0;
        const S = () => (this.root.updateBlockedByResize = !1);
        (_t.read(() => {
          v = window.innerWidth;
        }),
          n(f, () => {
            const j = window.innerWidth;
            j !== v &&
              ((v = j),
              (this.root.updateBlockedByResize = !0),
              x && x(),
              (x = kA(S, 250)),
              zo.hasAnimatedSinceResize &&
                ((zo.hasAnimatedSinceResize = !1), this.nodes.forEach(hy)));
          }));
      }
      (p && this.root.registerSharedNode(p, this),
        this.options.animate !== !1 &&
          g &&
          (p || m) &&
          this.addEventListener(
            "didUpdate",
            ({
              delta: x,
              hasLayoutChanged: v,
              hasRelativeLayoutChanged: S,
              layout: j,
            }) => {
              if (this.isTreeAnimationBlocked()) {
                ((this.target = void 0), (this.relativeTarget = void 0));
                return;
              }
              const A =
                  this.options.transition || g.getDefaultTransition() || $A,
                { onLayoutAnimationStart: C, onLayoutAnimationComplete: k } =
                  g.getProps(),
                H = !this.targetLayout || !Fx(this.targetLayout, j),
                U = !v && S;
              if (
                this.options.layoutRoot ||
                this.resumeFrom ||
                U ||
                (v && (H || !this.currentAnimation))
              ) {
                this.resumeFrom &&
                  ((this.resumingFrom = this.resumeFrom),
                  (this.resumingFrom.resumingFrom = void 0));
                const L = { ...Vf(A, "layout"), onPlay: C, onComplete: k };
                ((g.shouldReduceMotion || this.options.layoutRoot) &&
                  ((L.delay = 0), (L.type = !1)),
                  this.startAnimation(L),
                  this.setAnimationOrigin(x, U, L.path));
              } else
                (v || hy(this),
                  this.isLead() &&
                    this.options.onExitComplete &&
                    this.options.onExitComplete());
              this.targetLayout = j;
            },
          ));
    }
    unmount() {
      (this.options.layoutId && this.willUpdate(),
        this.root.nodes.remove(this));
      const f = this.getStack();
      (f && f.remove(this),
        this.parent && this.parent.children.delete(this),
        (this.instance = void 0),
        this.eventHandlers.clear(),
        la(this.updateProjection));
    }
    blockUpdate() {
      this.updateManuallyBlocked = !0;
    }
    unblockUpdate() {
      this.updateManuallyBlocked = !1;
    }
    isUpdateBlocked() {
      return this.updateManuallyBlocked || this.updateBlockedByResize;
    }
    isTreeAnimationBlocked() {
      return (
        this.isAnimationBlocked ||
        (this.parent && this.parent.isTreeAnimationBlocked()) ||
        !1
      );
    }
    startUpdate() {
      this.isUpdateBlocked() ||
        ((this.isUpdating = !0),
        this.nodes && this.nodes.forEach(KA),
        this.animationId++);
    }
    getTransformTemplate() {
      const { visualElement: f } = this.options;
      return f && f.getProps().transformTemplate;
    }
    willUpdate(f = !0) {
      if (((this.root.hasTreeAnimated = !0), this.root.isUpdateBlocked())) {
        this.options.onExitComplete && this.options.onExitComplete();
        return;
      }
      if (
        (window.MotionCancelOptimisedAnimation &&
          !this.hasCheckedOptimisedAppear &&
          Yx(this),
        !this.root.isUpdating && this.root.startUpdate(),
        this.isLayoutDirty)
      )
        return;
      this.isLayoutDirty = !0;
      for (let x = 0; x < this.path.length; x++) {
        const v = this.path[x];
        ((v.shouldResetTransform = !0),
          (typeof v.latestValues.x == "string" ||
            typeof v.latestValues.y == "string") &&
            (v.isLayoutDirty = !0),
          v.updateScroll("snapshot"),
          v.options.layoutRoot && v.willUpdate(!1));
      }
      const { layoutId: p, layout: m } = this.options;
      if (p === void 0 && !m) return;
      const g = this.getTransformTemplate();
      ((this.prevTransformTemplateValue = g
        ? g(this.latestValues, "")
        : void 0),
        this.updateSnapshot(),
        f && this.notifyListeners("willUpdate"));
    }
    update() {
      if (((this.updateScheduled = !1), this.isUpdateBlocked())) {
        const m = this.updateBlockedByResize;
        (this.unblockUpdate(),
          (this.updateBlockedByResize = !1),
          this.clearAllSnapshots(),
          m && this.nodes.forEach(GA),
          this.nodes.forEach(fy));
        return;
      }
      if (this.animationId <= this.animationCommitId) {
        this.nodes.forEach(dy);
        return;
      }
      ((this.animationCommitId = this.animationId),
        this.isUpdating
          ? ((this.isUpdating = !1),
            this.nodes.forEach(FA),
            this.nodes.forEach(qA),
            this.nodes.forEach(VA),
            this.nodes.forEach(_A))
          : this.nodes.forEach(dy),
        this.clearAllSnapshots());
      const p = pe.now();
      ((re.delta = un(0, 1e3 / 60, p - re.timestamp)),
        (re.timestamp = p),
        (re.isProcessing = !0),
        Ec.update.process(re),
        Ec.preRender.process(re),
        Ec.render.process(re),
        (re.isProcessing = !1));
    }
    didUpdate() {
      this.updateScheduled ||
        ((this.updateScheduled = !0), Gf.read(this.scheduleUpdate));
    }
    clearAllSnapshots() {
      (this.nodes.forEach(HA), this.sharedNodes.forEach(ZA));
    }
    scheduleUpdateProjection() {
      this.projectionUpdateScheduled ||
        ((this.projectionUpdateScheduled = !0),
        _t.preRender(this.updateProjection, !1, !0));
    }
    scheduleCheckAfterUnmount() {
      _t.postRender(() => {
        this.isLayoutDirty
          ? this.root.didUpdate()
          : this.root.checkUpdateFailed();
      });
    }
    updateSnapshot() {
      this.snapshot ||
        !this.instance ||
        ((this.snapshot = this.measure()),
        this.snapshot &&
          !ge(this.snapshot.measuredBox.x) &&
          !ge(this.snapshot.measuredBox.y) &&
          (this.snapshot = void 0));
    }
    updateLayout() {
      if (
        !this.instance ||
        (this.updateScroll(),
        !(this.options.alwaysMeasureLayout && this.isLead()) &&
          !this.isLayoutDirty)
      )
        return;
      if (this.resumeFrom && !this.resumeFrom.instance)
        for (let m = 0; m < this.path.length; m++) this.path[m].updateScroll();
      const f = this.layout;
      ((this.layout = this.measure(!1)),
        this.layoutVersion++,
        this.layoutCorrected || (this.layoutCorrected = te()),
        (this.isLayoutDirty = !1),
        (this.projectionDelta = void 0),
        this.notifyListeners("measure", this.layout.layoutBox));
      const { visualElement: p } = this.options;
      p &&
        p.notify(
          "LayoutMeasure",
          this.layout.layoutBox,
          f ? f.layoutBox : void 0,
        );
    }
    updateScroll(f = "measure") {
      let p = !!(this.options.layoutScroll && this.instance);
      if (
        (this.scroll &&
          this.scroll.animationId === this.root.animationId &&
          this.scroll.phase === f &&
          (p = !1),
        p && this.instance)
      ) {
        const m = o(this.instance);
        this.scroll = {
          animationId: this.root.animationId,
          phase: f,
          isRoot: m,
          offset: l(this.instance),
          wasRoot: this.scroll ? this.scroll.isRoot : m,
        };
      }
    }
    resetTransform() {
      if (!c) return;
      const f =
          this.isLayoutDirty ||
          this.shouldResetTransform ||
          this.options.alwaysMeasureLayout,
        p = this.projectionDelta && !Gx(this.projectionDelta),
        m = this.getTransformTemplate(),
        g = m ? m(this.latestValues, "") : void 0,
        x = g !== this.prevTransformTemplateValue;
      f &&
        this.instance &&
        (p || Da(this.latestValues) || x) &&
        (c(this.instance, g),
        (this.shouldResetTransform = !1),
        this.scheduleRender());
    }
    measure(f = !0) {
      const p = this.measurePageBox();
      let m = this.removeElementScroll(p);
      return (
        f && (m = this.removeTransform(m)),
        JA(m),
        {
          animationId: this.root.animationId,
          measuredBox: p,
          layoutBox: m,
          latestValues: {},
          source: this.id,
        }
      );
    }
    measurePageBox() {
      const { visualElement: f } = this.options;
      if (!f) return te();
      const p = f.measureViewportBox();
      if (!(this.scroll?.wasRoot || this.path.some(WA))) {
        const { scroll: g } = this.root;
        g && (on(p.x, g.offset.x), on(p.y, g.offset.y));
      }
      return p;
    }
    removeElementScroll(f) {
      const p = te();
      if ((Ke(p, f), this.scroll?.wasRoot)) return p;
      for (let m = 0; m < this.path.length; m++) {
        const g = this.path[m],
          { scroll: x, options: v } = g;
        g !== this.root &&
          x &&
          v.layoutScroll &&
          (x.wasRoot && Ke(p, f), on(p.x, x.offset.x), on(p.y, x.offset.y));
      }
      return p;
    }
    applyTransform(f, p = !1, m) {
      const g = m || te();
      Ke(g, f);
      for (let x = 0; x < this.path.length; x++) {
        const v = this.path[x];
        (!p &&
          v.options.layoutScroll &&
          v.scroll &&
          v !== v.root &&
          (on(g.x, -v.scroll.offset.x), on(g.y, -v.scroll.offset.y)),
          Da(v.latestValues) && Oo(g, v.latestValues, v.layout?.layoutBox));
      }
      return (
        Da(this.latestValues) &&
          Oo(g, this.latestValues, this.layout?.layoutBox),
        g
      );
    }
    removeTransform(f) {
      const p = te();
      Ke(p, f);
      for (let m = 0; m < this.path.length; m++) {
        const g = this.path[m];
        if (!Da(g.latestValues)) continue;
        let x;
        (g.instance &&
          (ff(g.latestValues) && g.updateSnapshot(),
          (x = te()),
          Ke(x, g.measurePageBox())),
          ny(p, g.latestValues, g.snapshot?.layoutBox, x));
      }
      return (Da(this.latestValues) && ny(p, this.latestValues), p);
    }
    setTargetDelta(f) {
      ((this.targetDelta = f),
        this.root.scheduleUpdateProjection(),
        (this.isProjectionDirty = !0));
    }
    setOptions(f) {
      this.options = {
        ...this.options,
        ...f,
        crossfade: f.crossfade !== void 0 ? f.crossfade : !0,
      };
    }
    clearMeasurements() {
      ((this.scroll = void 0),
        (this.layout = void 0),
        (this.snapshot = void 0),
        (this.prevTransformTemplateValue = void 0),
        (this.targetDelta = void 0),
        (this.target = void 0),
        (this.isLayoutDirty = !1));
    }
    forceRelativeParentToResolveTarget() {
      this.relativeParent &&
        this.relativeParent.resolvedRelativeTargetAt !== re.timestamp &&
        this.relativeParent.resolveTargetDelta(!0);
    }
    resolveTargetDelta(f = !1) {
      const p = this.getLead();
      (this.isProjectionDirty || (this.isProjectionDirty = p.isProjectionDirty),
        this.isTransformDirty || (this.isTransformDirty = p.isTransformDirty),
        this.isSharedProjectionDirty ||
          (this.isSharedProjectionDirty = p.isSharedProjectionDirty));
      const m = !!this.resumingFrom || this !== p;
      if (!(
        f ||
        (m && this.isSharedProjectionDirty) ||
        this.isProjectionDirty ||
        this.parent?.isProjectionDirty ||
        this.attemptToResolveRelativeTarget ||
        this.root.updateBlockedByResize
      ))
        return;
      const { layout: x, layoutId: v } = this.options;
      if (!this.layout || !(x || v)) return;
      this.resolvedRelativeTargetAt = re.timestamp;
      const S = this.getClosestProjectingParent();
      (S &&
        this.linkedParentVersion !== S.layoutVersion &&
        !S.options.layoutRoot &&
        this.removeRelativeTarget(),
        !this.targetDelta &&
          !this.relativeTarget &&
          (this.options.layoutAnchor !== !1 && S && S.layout
            ? this.createRelativeTarget(
                S,
                this.layout.layoutBox,
                S.layout.layoutBox,
              )
            : this.removeRelativeTarget()),
        !(!this.relativeTarget && !this.targetDelta) &&
          (this.target ||
            ((this.target = te()), (this.targetWithTransforms = te())),
          this.relativeTarget &&
          this.relativeTargetOrigin &&
          this.relativeParent &&
          this.relativeParent.target
            ? (this.forceRelativeParentToResolveTarget(),
              bA(
                this.target,
                this.relativeTarget,
                this.relativeParent.target,
                this.options.layoutAnchor || void 0,
              ))
            : this.targetDelta
              ? (this.resumingFrom
                  ? this.applyTransform(this.layout.layoutBox, !1, this.target)
                  : Ke(this.target, this.layout.layoutBox),
                Nx(this.target, this.targetDelta))
              : Ke(this.target, this.layout.layoutBox),
          this.attemptToResolveRelativeTarget &&
            ((this.attemptToResolveRelativeTarget = !1),
            this.options.layoutAnchor !== !1 &&
            S &&
            !!S.resumingFrom == !!this.resumingFrom &&
            !S.options.layoutScroll &&
            S.target &&
            this.animationProgress !== 1
              ? this.createRelativeTarget(S, this.target, S.target)
              : (this.relativeParent = this.relativeTarget = void 0))));
    }
    getClosestProjectingParent() {
      if (!(
        !this.parent ||
        ff(this.parent.latestValues) ||
        Mx(this.parent.latestValues)
      ))
        return this.parent.isProjecting()
          ? this.parent
          : this.parent.getClosestProjectingParent();
    }
    isProjecting() {
      return !!(
        (this.relativeTarget || this.targetDelta || this.options.layoutRoot) &&
        this.layout
      );
    }
    createRelativeTarget(f, p, m) {
      ((this.relativeParent = f),
        (this.linkedParentVersion = f.layoutVersion),
        this.forceRelativeParentToResolveTarget(),
        (this.relativeTarget = te()),
        (this.relativeTargetOrigin = te()),
        Ko(
          this.relativeTargetOrigin,
          p,
          m,
          this.options.layoutAnchor || void 0,
        ),
        Ke(this.relativeTarget, this.relativeTargetOrigin));
    }
    removeRelativeTarget() {
      this.relativeParent = this.relativeTarget = void 0;
    }
    calcProjection() {
      const f = this.getLead(),
        p = !!this.resumingFrom || this !== f;
      let m = !0;
      if (
        ((this.isProjectionDirty || this.parent?.isProjectionDirty) && (m = !1),
        p &&
          (this.isSharedProjectionDirty || this.isTransformDirty) &&
          (m = !1),
        this.resolvedRelativeTargetAt === re.timestamp && (m = !1),
        m)
      )
        return;
      const { layout: g, layoutId: x } = this.options;
      if (
        ((this.isTreeAnimating = !!(
          (this.parent && this.parent.isTreeAnimating) ||
          this.currentAnimation ||
          this.pendingAnimation
        )),
        this.isTreeAnimating ||
          (this.targetDelta = this.relativeTarget = void 0),
        !this.layout || !(g || x))
      )
        return;
      Ke(this.layoutCorrected, this.layout.layoutBox);
      const v = this.treeScale.x,
        S = this.treeScale.y;
      (QE(this.layoutCorrected, this.treeScale, this.path, p),
        f.layout &&
          !f.target &&
          (this.treeScale.x !== 1 || this.treeScale.y !== 1) &&
          ((f.target = f.layout.layoutBox), (f.targetWithTransforms = te())));
      const { target: j } = f;
      if (!j) {
        this.prevProjectionDelta &&
          (this.createProjectionDeltas(), this.scheduleRender());
        return;
      }
      (!this.projectionDelta || !this.prevProjectionDelta
        ? this.createProjectionDeltas()
        : ($g(this.prevProjectionDelta.x, this.projectionDelta.x),
          $g(this.prevProjectionDelta.y, this.projectionDelta.y)),
        Yi(this.projectionDelta, this.layoutCorrected, j, this.latestValues),
        (this.treeScale.x !== v ||
          this.treeScale.y !== S ||
          !oy(this.projectionDelta.x, this.prevProjectionDelta.x) ||
          !oy(this.projectionDelta.y, this.prevProjectionDelta.y)) &&
          ((this.hasProjected = !0),
          this.scheduleRender(),
          this.notifyListeners("projectionUpdate", j)));
    }
    hide() {
      this.isVisible = !1;
    }
    show() {
      this.isVisible = !0;
    }
    scheduleRender(f = !0) {
      if ((this.options.visualElement?.scheduleRender(), f)) {
        const p = this.getStack();
        p && p.scheduleRender();
      }
      this.resumingFrom &&
        !this.resumingFrom.instance &&
        (this.resumingFrom = void 0);
    }
    createProjectionDeltas() {
      ((this.prevProjectionDelta = Ms()),
        (this.projectionDelta = Ms()),
        (this.projectionDeltaWithTransform = Ms()));
    }
    setAnimationOrigin(f, p = !1, m) {
      const g = this.snapshot,
        x = g ? g.latestValues : {},
        v = { ...this.latestValues },
        S = Ms();
      ((!this.relativeParent || !this.relativeParent.options.layoutRoot) &&
        (this.relativeTarget = this.relativeTargetOrigin = void 0),
        (this.attemptToResolveRelativeTarget = !p));
      const j = te(),
        A = g ? g.source : void 0,
        C = this.layout ? this.layout.source : void 0,
        k = A !== C,
        H = this.getStack(),
        U = !H || H.members.length <= 1,
        L = !!(k && !U && this.options.crossfade === !0 && !this.path.some(PA));
      this.animationProgress = 0;
      let K;
      const P = m?.interpolateProjection(f);
      ((this.mixTargetDelta = (st) => {
        const nt = st / 1e3,
          V = P?.(nt);
        (V
          ? ((S.x.translate = V.x),
            (S.x.scale = Vt(f.x.scale, 1, nt)),
            (S.x.origin = f.x.origin),
            (S.x.originPoint = f.x.originPoint),
            (S.y.translate = V.y),
            (S.y.scale = Vt(f.y.scale, 1, nt)),
            (S.y.origin = f.y.origin),
            (S.y.originPoint = f.y.originPoint))
          : (my(S.x, f.x, nt), my(S.y, f.y, nt)),
          this.setTargetDelta(S),
          this.relativeTarget &&
            this.relativeTargetOrigin &&
            this.layout &&
            this.relativeParent &&
            this.relativeParent.layout &&
            (Ko(
              j,
              this.layout.layoutBox,
              this.relativeParent.layout.layoutBox,
              this.options.layoutAnchor || void 0,
            ),
            QA(this.relativeTarget, this.relativeTargetOrigin, j, nt),
            K && wA(this.relativeTarget, K) && (this.isProjectionDirty = !1),
            K || (K = te()),
            Ke(K, this.relativeTarget)),
          k &&
            ((this.animationValues = v), CA(v, x, this.latestValues, nt, L, U)),
          V &&
            V.rotate !== void 0 &&
            (this.animationValues || (this.animationValues = v),
            (this.animationValues.pathRotation = V.rotate)),
          this.root.scheduleUpdateProjection(),
          this.scheduleRender(),
          (this.animationProgress = nt));
      }),
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0));
    }
    startAnimation(f) {
      (this.notifyListeners("animationStart"),
        this.currentAnimation?.stop(),
        this.resumingFrom?.currentAnimation?.stop(),
        this.pendingAnimation &&
          (la(this.pendingAnimation), (this.pendingAnimation = void 0)),
        (this.pendingAnimation = _t.update(() => {
          ((zo.hasAnimatedSinceResize = !0),
            this.motionValue || (this.motionValue = Ds(0)),
            this.motionValue.jump(0, !1),
            (this.currentAnimation = NA(this.motionValue, [0, 1e3], {
              ...f,
              velocity: 0,
              isSync: !0,
              onUpdate: (p) => {
                (this.mixTargetDelta(p), f.onUpdate && f.onUpdate(p));
              },
              onComplete: () => {
                (f.onComplete && f.onComplete(), this.completeAnimation());
              },
            })),
            this.resumingFrom &&
              (this.resumingFrom.currentAnimation = this.currentAnimation),
            (this.pendingAnimation = void 0));
        })));
    }
    completeAnimation() {
      this.resumingFrom &&
        ((this.resumingFrom.currentAnimation = void 0),
        (this.resumingFrom.preserveOpacity = void 0));
      const f = this.getStack();
      (f && f.exitAnimationComplete(),
        (this.resumingFrom =
          this.currentAnimation =
          this.animationValues =
            void 0),
        this.notifyListeners("animationComplete"));
    }
    finishAnimation() {
      (this.currentAnimation &&
        (this.mixTargetDelta && this.mixTargetDelta(BA),
        this.currentAnimation.stop()),
        this.completeAnimation());
    }
    applyTransformsToTarget() {
      const f = this.getLead();
      let {
        targetWithTransforms: p,
        target: m,
        layout: g,
        latestValues: x,
      } = f;
      if (!(!p || !m || !g)) {
        if (
          this !== f &&
          this.layout &&
          g &&
          Kx(this.options.animationType, this.layout.layoutBox, g.layoutBox)
        ) {
          m = this.target || te();
          const v = ge(this.layout.layoutBox.x);
          ((m.x.min = f.target.x.min), (m.x.max = m.x.min + v));
          const S = ge(this.layout.layoutBox.y);
          ((m.y.min = f.target.y.min), (m.y.max = m.y.min + S));
        }
        (Ke(p, m),
          Oo(p, x),
          Yi(this.projectionDeltaWithTransform, this.layoutCorrected, p, x));
      }
    }
    registerSharedNode(f, p) {
      (this.sharedNodes.has(f) || this.sharedNodes.set(f, new OA()),
        this.sharedNodes.get(f).add(p));
      const g = p.options.initialPromotionConfig;
      p.promote({
        transition: g ? g.transition : void 0,
        preserveFollowOpacity:
          g && g.shouldPreserveFollowOpacity
            ? g.shouldPreserveFollowOpacity(p)
            : void 0,
      });
    }
    isLead() {
      const f = this.getStack();
      return f ? f.lead === this : !0;
    }
    getLead() {
      const { layoutId: f } = this.options;
      return f ? this.getStack()?.lead || this : this;
    }
    getPrevLead() {
      const { layoutId: f } = this.options;
      return f ? this.getStack()?.prevLead : void 0;
    }
    getStack() {
      const { layoutId: f } = this.options;
      if (f) return this.root.sharedNodes.get(f);
    }
    promote({ needsReset: f, transition: p, preserveFollowOpacity: m } = {}) {
      const g = this.getStack();
      (g && g.promote(this, m),
        f && ((this.projectionDelta = void 0), (this.needsReset = !0)),
        p && this.setOptions({ transition: p }));
    }
    relegate() {
      const f = this.getStack();
      return f ? f.relegate(this) : !1;
    }
    resetSkewAndRotation() {
      const { visualElement: f } = this.options;
      if (!f) return;
      let p = !1;
      const { latestValues: m } = f;
      if (
        ((m.z ||
          m.rotate ||
          m.rotateX ||
          m.rotateY ||
          m.rotateZ ||
          m.skewX ||
          m.skewY) &&
          (p = !0),
        !p)
      )
        return;
      const g = {};
      m.z && Oc("z", f, g, this.animationValues);
      for (let x = 0; x < kc.length; x++)
        (Oc(`rotate${kc[x]}`, f, g, this.animationValues),
          Oc(`skew${kc[x]}`, f, g, this.animationValues));
      f.render();
      for (const x in g)
        (f.setStaticValue(x, g[x]),
          this.animationValues && (this.animationValues[x] = g[x]));
      f.scheduleRender();
    }
    applyProjectionStyles(f, p) {
      if (!this.instance || this.isSVG) return;
      if (!this.isVisible) {
        f.visibility = "hidden";
        return;
      }
      const m = this.getTransformTemplate();
      if (this.needsReset) {
        ((this.needsReset = !1),
          (f.visibility = ""),
          (f.opacity = ""),
          (f.pointerEvents = Bo(p?.pointerEvents) || ""),
          (f.transform = m ? m(this.latestValues, "") : "none"));
        return;
      }
      const g = this.getLead();
      if (!this.projectionDelta || !this.layout || !g.target) {
        (this.options.layoutId &&
          ((f.opacity =
            this.latestValues.opacity !== void 0
              ? this.latestValues.opacity
              : 1),
          (f.pointerEvents = Bo(p?.pointerEvents) || "")),
          this.hasProjected &&
            !Da(this.latestValues) &&
            ((f.transform = m ? m({}, "") : "none"), (this.hasProjected = !1)));
        return;
      }
      f.visibility = "";
      const x = g.animationValues || g.latestValues;
      this.applyTransformsToTarget();
      let v = EA(this.projectionDeltaWithTransform, this.treeScale, x);
      (m && (v = m(x, v)), (f.transform = v));
      const { x: S, y: j } = this.projectionDelta;
      ((f.transformOrigin = `${S.origin * 100}% ${j.origin * 100}% 0`),
        g.animationValues
          ? (f.opacity =
              g === this
                ? (x.opacity ?? this.latestValues.opacity ?? 1)
                : this.preserveOpacity
                  ? this.latestValues.opacity
                  : x.opacityExit)
          : (f.opacity =
              g === this
                ? x.opacity !== void 0
                  ? x.opacity
                  : ""
                : x.opacityExit !== void 0
                  ? x.opacityExit
                  : 0));
      for (const A in hf) {
        if (x[A] === void 0) continue;
        const { correct: C, applyTo: k, isCSSVariable: H } = hf[A],
          U = v === "none" ? x[A] : C(x[A], g);
        if (k) {
          const L = k.length;
          for (let K = 0; K < L; K++) f[k[K]] = U;
        } else
          H ? (this.options.visualElement.renderState.vars[A] = U) : (f[A] = U);
      }
      this.options.layoutId &&
        (f.pointerEvents = g === this ? Bo(p?.pointerEvents) || "" : "none");
    }
    clearSnapshot() {
      this.resumeFrom = this.snapshot = void 0;
    }
    resetTree() {
      (this.root.nodes.forEach((f) => f.currentAnimation?.stop()),
        this.root.nodes.forEach(fy),
        this.root.sharedNodes.clear());
    }
  };
}
function VA(n) {
  n.updateLayout();
}
function _A(n) {
  const s = n.resumeFrom?.snapshot || n.snapshot;
  if (n.isLead() && n.layout && s && n.hasListeners("didUpdate")) {
    const { layoutBox: l, measuredBox: o } = n.layout,
      { animationType: c } = n.options,
      d = s.source !== n.layout.source;
    if (c === "size")
      ln((x) => {
        const v = d ? s.measuredBox[x] : s.layoutBox[x],
          S = ge(v);
        ((v.min = l[x].min), (v.max = v.min + S));
      });
    else if (c === "x" || c === "y") {
      const x = c === "x" ? "y" : "x";
      mf(d ? s.measuredBox[x] : s.layoutBox[x], l[x]);
    } else
      Kx(c, s.layoutBox, l) &&
        ln((x) => {
          const v = d ? s.measuredBox[x] : s.layoutBox[x],
            S = ge(l[x]);
          ((v.max = v.min + S),
            n.relativeTarget &&
              !n.currentAnimation &&
              ((n.isProjectionDirty = !0),
              (n.relativeTarget[x].max = n.relativeTarget[x].min + S)));
        });
    const f = Ms();
    Yi(f, l, s.layoutBox);
    const p = Ms();
    d ? Yi(p, n.applyTransform(o, !0), s.measuredBox) : Yi(p, l, s.layoutBox);
    const m = !Gx(f);
    let g = !1;
    if (!n.resumeFrom) {
      const x = n.getClosestProjectingParent();
      if (x && !x.resumeFrom) {
        const { snapshot: v, layout: S } = x;
        if (v && S) {
          const j = n.options.layoutAnchor || void 0,
            A = te();
          Ko(A, s.layoutBox, v.layoutBox, j);
          const C = te();
          (Ko(C, l, S.layoutBox, j),
            Fx(A, C) || (g = !0),
            x.options.layoutRoot &&
              ((n.relativeTarget = C),
              (n.relativeTargetOrigin = A),
              (n.relativeParent = x)));
        }
      }
    }
    n.notifyListeners("didUpdate", {
      layout: l,
      snapshot: s,
      delta: p,
      layoutDelta: f,
      hasLayoutChanged: m,
      hasRelativeLayoutChanged: g,
    });
  } else if (n.isLead()) {
    const { onExitComplete: l } = n.options;
    l && l();
  }
  n.options.transition = void 0;
}
function LA(n) {
  n.parent &&
    (n.isProjecting() || (n.isProjectionDirty = n.parent.isProjectionDirty),
    n.isSharedProjectionDirty ||
      (n.isSharedProjectionDirty = !!(
        n.isProjectionDirty ||
        n.parent.isProjectionDirty ||
        n.parent.isSharedProjectionDirty
      )),
    n.isTransformDirty || (n.isTransformDirty = n.parent.isTransformDirty));
}
function UA(n) {
  n.isProjectionDirty = n.isSharedProjectionDirty = n.isTransformDirty = !1;
}
function HA(n) {
  n.clearSnapshot();
}
function fy(n) {
  n.clearMeasurements();
}
function GA(n) {
  ((n.isLayoutDirty = !0), n.updateLayout());
}
function dy(n) {
  n.isLayoutDirty = !1;
}
function FA(n) {
  n.isAnimationBlocked &&
    n.layout &&
    !n.isLayoutDirty &&
    ((n.snapshot = n.layout), (n.isLayoutDirty = !0));
}
function qA(n) {
  const { visualElement: s } = n.options;
  (s && s.getProps().onBeforeLayoutMeasure && s.notify("BeforeLayoutMeasure"),
    n.resetTransform());
}
function hy(n) {
  (n.finishAnimation(),
    (n.targetDelta = n.relativeTarget = n.target = void 0),
    (n.isProjectionDirty = !0));
}
function YA(n) {
  n.resolveTargetDelta();
}
function XA(n) {
  n.calcProjection();
}
function KA(n) {
  n.resetSkewAndRotation();
}
function ZA(n) {
  n.removeLeadSnapshot();
}
function my(n, s, l) {
  ((n.translate = Vt(s.translate, 0, l)),
    (n.scale = Vt(s.scale, 1, l)),
    (n.origin = s.origin),
    (n.originPoint = s.originPoint));
}
function py(n, s, l, o) {
  ((n.min = Vt(s.min, l.min, o)), (n.max = Vt(s.max, l.max, o)));
}
function QA(n, s, l, o) {
  (py(n.x, s.x, l.x, o), py(n.y, s.y, l.y, o));
}
function PA(n) {
  return n.animationValues && n.animationValues.opacityExit !== void 0;
}
const $A = { duration: 0.45, ease: [0.4, 0, 0.1, 1] },
  gy = (n) =>
    typeof navigator < "u" &&
    navigator.userAgent &&
    navigator.userAgent.toLowerCase().includes(n),
  yy = gy("applewebkit/") && !gy("chrome/") ? Math.round : Fe;
function xy(n) {
  ((n.min = yy(n.min)), (n.max = yy(n.max)));
}
function JA(n) {
  (xy(n.x), xy(n.y));
}
function Kx(n, s, l) {
  return (
    n === "position" || (n === "preserve-aspect" && !xA(ly(s), ly(l), 0.2))
  );
}
function WA(n) {
  return n !== n.root && n.scroll?.wasRoot;
}
const IA = Xx({
    attachResizeListener: (n, s) => Ji(n, "resize", s),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body?.scrollLeft || 0,
      y: document.documentElement.scrollTop || document.body?.scrollTop || 0,
    }),
    checkIsScrollRoot: () => !0,
  }),
  Bc = { current: void 0 },
  Zx = Xx({
    measureScroll: (n) => ({ x: n.scrollLeft, y: n.scrollTop }),
    defaultParent: () => {
      if (!Bc.current) {
        const n = new IA({});
        (n.mount(window), n.setOptions({ layoutScroll: !0 }), (Bc.current = n));
      }
      return Bc.current;
    },
    resetTransform: (n, s) => {
      n.style.transform = s !== void 0 ? s : "none";
    },
    checkIsScrollRoot: (n) => window.getComputedStyle(n).position === "fixed",
  }),
  Qf = z.createContext({
    transformPagePoint: (n) => n,
    isStatic: !1,
    reducedMotion: "never",
  });
function by(n, s) {
  if (typeof n == "function") return n(s);
  n != null && (n.current = s);
}
function t5(...n) {
  return (s) => {
    let l = !1;
    const o = n.map((c) => {
      const d = by(c, s);
      return (!l && typeof d == "function" && (l = !0), d);
    });
    if (l)
      return () => {
        for (let c = 0; c < o.length; c++) {
          const d = o[c];
          typeof d == "function" ? d() : by(n[c], null);
        }
      };
  };
}
function e5(...n) {
  return z.useCallback(t5(...n), n);
}
class n5 extends z.Component {
  getSnapshotBeforeUpdate(s) {
    const l = this.props.childRef.current;
    if (
      Mo(l) &&
      s.isPresent &&
      !this.props.isPresent &&
      this.props.pop !== !1
    ) {
      const o = l.offsetParent,
        c = (Mo(o) && o.offsetWidth) || 0,
        d = (Mo(o) && o.offsetHeight) || 0,
        f = getComputedStyle(l),
        p = this.props.sizeRef.current;
      ((p.height = parseFloat(f.height)),
        (p.width = parseFloat(f.width)),
        (p.top = l.offsetTop),
        (p.left = l.offsetLeft),
        (p.right = c - p.width - p.left),
        (p.bottom = d - p.height - p.top),
        (p.direction = f.direction));
    }
    return null;
  }
  componentDidUpdate() {}
  render() {
    return this.props.children;
  }
}
function a5({
  children: n,
  isPresent: s,
  anchorX: l,
  anchorY: o,
  root: c,
  pop: d,
}) {
  const f = z.useId(),
    p = z.useRef(null),
    m = z.useRef({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      direction: "ltr",
    }),
    { nonce: g } = z.useContext(Qf),
    x = d !== !1 ? (n.props?.ref ?? n?.ref) : void 0,
    v = e5(p, x);
  return (
    z.useInsertionEffect(() => {
      const {
        width: S,
        height: j,
        top: A,
        left: C,
        right: k,
        bottom: H,
        direction: U,
      } = m.current;
      if (s || d === !1 || !p.current || !S || !j) return;
      const L = U === "rtl",
        K =
          l === "left"
            ? L
              ? `right: ${k}`
              : `left: ${C}`
            : L
              ? `left: ${C}`
              : `right: ${k}`,
        P = o === "bottom" ? `bottom: ${H}` : `top: ${A}`;
      p.current.dataset.motionPopId = f;
      const st = document.createElement("style");
      g && (st.nonce = g);
      const nt = c ?? document.head;
      return (
        nt.appendChild(st),
        st.sheet &&
          st.sheet.insertRule(`
          [data-motion-pop-id="${f}"] {
            position: absolute !important;
            width: ${S}px !important;
            height: ${j}px !important;
            ${K}px !important;
            ${P}px !important;
          }
        `),
        () => {
          (p.current?.removeAttribute("data-motion-pop-id"),
            nt.contains(st) && nt.removeChild(st));
        }
      );
    }, [s]),
    h.jsx(n5, {
      isPresent: s,
      childRef: p,
      sizeRef: m,
      pop: d,
      children: d === !1 ? n : z.cloneElement(n, { ref: v }),
    })
  );
}
const s5 = ({
  children: n,
  initial: s,
  isPresent: l,
  onExitComplete: o,
  custom: c,
  presenceAffectsLayout: d,
  mode: f,
  anchorX: p,
  anchorY: m,
  root: g,
}) => {
  const x = wf(i5),
    v = z.useId(),
    S = z.useRef(l),
    j = z.useRef(o);
  Ef(() => {
    ((S.current = l), (j.current = o));
  });
  let A = !0,
    C = z.useMemo(
      () => (
        (A = !1),
        {
          id: v,
          initial: s,
          isPresent: l,
          custom: c,
          onExitComplete: (k) => {
            x.set(k, !0);
            for (const H of x.values()) if (!H) return;
            o && o();
          },
          register: (k) => (
            x.set(k, !1),
            () => {
              (x.delete(k), !S.current && !x.size && j.current?.());
            }
          ),
        }
      ),
      [l, x, o],
    );
  return (
    d && A && (C = { ...C }),
    z.useMemo(() => {
      x.forEach((k, H) => x.set(H, !1));
    }, [l]),
    z.useEffect(() => {
      !l && !x.size && o && o();
    }, [l]),
    (n = h.jsx(a5, {
      pop: f === "popLayout",
      isPresent: l,
      anchorX: p,
      anchorY: m,
      root: g,
      children: n,
    })),
    h.jsx(Jo.Provider, { value: C, children: n })
  );
};
function i5() {
  return new Map();
}
function Qx(n = !0) {
  const s = z.useContext(Jo);
  if (s === null) return [!0, null];
  const { isPresent: l, onExitComplete: o, register: c } = s,
    d = z.useId();
  z.useEffect(() => {
    if (n) return c(d);
  }, [n]);
  const f = z.useCallback(() => n && o && o(d), [d, o, n]);
  return !l && o ? [!1, f] : [!0];
}
const wo = (n) => n.key || "";
function vy(n) {
  const s = [];
  return (
    z.Children.forEach(n, (l) => {
      z.isValidElement(l) && s.push(l);
    }),
    s
  );
}
const Ns = ({
    children: n,
    custom: s,
    initial: l = !0,
    onExitComplete: o,
    presenceAffectsLayout: c = !0,
    mode: d = "sync",
    propagate: f = !1,
    anchorX: p = "left",
    anchorY: m = "top",
    root: g,
  }) => {
    const [x, v] = Qx(f),
      S = z.useMemo(() => vy(n), [n]),
      j = f && !x ? [] : S.map(wo),
      A = z.useRef(!0),
      C = z.useRef(S),
      k = wf(() => new Map()),
      H = z.useRef(new Set()),
      [U, L] = z.useState(S),
      [K, P] = z.useState(S);
    Ef(() => {
      ((A.current = !1), (C.current = S));
      for (let V = 0; V < K.length; V++) {
        const J = wo(K[V]);
        j.includes(J)
          ? (k.delete(J), H.current.delete(J))
          : k.get(J) !== !0 && k.set(J, !1);
      }
    }, [K, j.length, j.join("-")]);
    const st = [];
    if (S !== U) {
      let V = [...S];
      for (let J = 0; J < K.length; J++) {
        const Z = K[J],
          mt = wo(Z);
        j.includes(mt) || (V.splice(J, 0, Z), st.push(Z));
      }
      return (d === "wait" && st.length && (V = st), P(vy(V)), L(S), null);
    }
    const { forceRender: nt } = z.useContext(Tf);
    return h.jsx(h.Fragment, {
      children: K.map((V) => {
        const J = wo(V),
          Z = f && !x ? !1 : S === K || j.includes(J),
          mt = () => {
            if (H.current.has(J)) return;
            if (k.has(J)) (H.current.add(J), k.set(J, !0));
            else return;
            let ht = !0;
            (k.forEach((Ut) => {
              Ut || (ht = !1);
            }),
              ht && (nt?.(), P(C.current), f && v?.(), o && o()));
          };
        return h.jsx(
          s5,
          {
            isPresent: Z,
            initial: !A.current || l ? void 0 : !1,
            custom: s,
            presenceAffectsLayout: c,
            mode: d,
            root: g,
            onExitComplete: Z ? void 0 : mt,
            anchorX: p,
            anchorY: m,
            children: V,
          },
          J,
        );
      }),
    });
  },
  Px = z.createContext({ strict: !1 }),
  Sy = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag",
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"],
  };
let Ty = !1;
function l5() {
  if (Ty) return;
  const n = {};
  for (const s in Sy) n[s] = { isEnabled: (l) => Sy[s].some((o) => !!l[o]) };
  (Ax(n), (Ty = !0));
}
function $x() {
  return (l5(), YE());
}
function o5(n) {
  const s = $x();
  for (const l in n) s[l] = { ...s[l], ...n[l] };
  Ax(s);
}
const r5 = new Set([
  "animate",
  "exit",
  "variants",
  "initial",
  "style",
  "values",
  "variants",
  "transition",
  "transformTemplate",
  "custom",
  "inherit",
  "onBeforeLayoutMeasure",
  "onAnimationStart",
  "onAnimationComplete",
  "onUpdate",
  "onDragStart",
  "onDrag",
  "onDragEnd",
  "onMeasureDragConstraints",
  "onDirectionLock",
  "onDragTransitionEnd",
  "_dragX",
  "_dragY",
  "onHoverStart",
  "onHoverEnd",
  "onViewportEnter",
  "onViewportLeave",
  "globalTapTarget",
  "propagate",
  "ignoreStrict",
  "viewport",
]);
function Zo(n) {
  return (
    n.startsWith("while") ||
    (n.startsWith("drag") && n !== "draggable") ||
    n.startsWith("layout") ||
    n.startsWith("onTap") ||
    n.startsWith("onPan") ||
    n.startsWith("onLayout") ||
    r5.has(n)
  );
}
let Jx = (n) => !Zo(n);
function u5(n) {
  typeof n == "function" && (Jx = (s) => (s.startsWith("on") ? !Zo(s) : n(s)));
}
try {
  u5(require("@emotion/is-prop-valid").default);
} catch {}
function c5(n, s, l) {
  const o = {};
  for (const c in n)
    (c === "values" && typeof n.values == "object") ||
      ce(n[c]) ||
      ((Jx(c) ||
        (l === !0 && Zo(c)) ||
        (!s && !Zo(c)) ||
        (n.draggable && c.startsWith("onDrag"))) &&
        (o[c] = n[c]));
  return o;
}
const nr = z.createContext({});
function f5(n, s) {
  if (er(n)) {
    const { initial: l, animate: o } = n;
    return {
      initial: l === !1 || $i(l) ? l : void 0,
      animate: $i(o) ? o : void 0,
    };
  }
  return n.inherit !== !1 ? s : {};
}
function d5(n) {
  const { initial: s, animate: l } = f5(n, z.useContext(nr));
  return z.useMemo(() => ({ initial: s, animate: l }), [wy(s), wy(l)]);
}
function wy(n) {
  return Array.isArray(n) ? n.join(" ") : n;
}
const Pf = () => ({ style: {}, transform: {}, transformOrigin: {}, vars: {} });
function Wx(n, s, l) {
  for (const o in s) !ce(s[o]) && !kx(o, l) && (n[o] = s[o]);
}
function h5({ transformTemplate: n }, s) {
  return z.useMemo(() => {
    const l = Pf();
    return (Kf(l, s, n), Object.assign({}, l.vars, l.style));
  }, [s]);
}
function m5(n, s) {
  const l = n.style || {},
    o = {};
  return (Wx(o, l, n), Object.assign(o, h5(n, s)), o);
}
function p5(n, s) {
  const l = {},
    o = m5(n, s);
  return (
    n.drag &&
      n.dragListener !== !1 &&
      ((l.draggable = !1),
      (o.userSelect = o.WebkitUserSelect = o.WebkitTouchCallout = "none"),
      (o.touchAction =
        n.drag === !0 ? "none" : `pan-${n.drag === "x" ? "y" : "x"}`)),
    n.tabIndex === void 0 &&
      (n.onTap || n.onTapStart || n.whileTap) &&
      (l.tabIndex = 0),
    (l.style = o),
    l
  );
}
const Ix = () => ({ ...Pf(), attrs: {} });
function g5(n, s, l, o) {
  const c = z.useMemo(() => {
    const d = Ix();
    return (
      Ox(d, s, zx(o), n.transformTemplate, n.style),
      { ...d.attrs, style: { ...d.style } }
    );
  }, [s]);
  if (n.style) {
    const d = {};
    (Wx(d, n.style, n), (c.style = { ...d, ...c.style }));
  }
  return c;
}
const y5 = [
  "animate",
  "circle",
  "defs",
  "desc",
  "ellipse",
  "g",
  "image",
  "line",
  "filter",
  "marker",
  "mask",
  "metadata",
  "path",
  "pattern",
  "polygon",
  "polyline",
  "rect",
  "stop",
  "switch",
  "symbol",
  "svg",
  "text",
  "tspan",
  "use",
  "view",
];
function $f(n) {
  return typeof n != "string" || n.includes("-")
    ? !1
    : !!(y5.indexOf(n) > -1 || /[A-Z]/u.test(n));
}
function x5(n, s, l, { latestValues: o }, c, d = !1, f) {
  const m = ((f ?? $f(n)) ? g5 : p5)(s, o, c, n),
    g = c5(s, typeof n == "string", d),
    x = n !== z.Fragment ? { ...g, ...m, ref: l } : {},
    { children: v } = s,
    S = z.useMemo(() => (ce(v) ? v.get() : v), [v]);
  return z.createElement(n, { ...x, children: S });
}
function b5({ scrapeMotionValuesFromProps: n, createRenderState: s }, l, o, c) {
  return { latestValues: v5(l, o, c, n), renderState: s() };
}
function v5(n, s, l, o) {
  const c = {},
    d = o(n, {});
  for (const S in d) c[S] = Bo(d[S]);
  let { initial: f, animate: p } = n;
  const m = er(n),
    g = wx(n);
  s &&
    g &&
    !m &&
    n.inherit !== !1 &&
    (f === void 0 && (f = s.initial), p === void 0 && (p = s.animate));
  let x = l ? l.initial === !1 : !1;
  x = x || f === !1;
  const v = x ? p : f;
  if (v && typeof v != "boolean" && !tr(v)) {
    const S = Array.isArray(v) ? v : [v];
    for (let j = 0; j < S.length; j++) {
      const A = Lf(n, S[j]);
      if (A) {
        const { transitionEnd: C, transition: k, ...H } = A;
        for (const U in H) {
          let L = H[U];
          if (Array.isArray(L)) {
            const K = x ? L.length - 1 : 0;
            L = L[K];
          }
          L !== null && (c[U] = L);
        }
        for (const U in C) c[U] = C[U];
      }
    }
  }
  return c;
}
const tb = (n) => (s, l) => {
    const o = z.useContext(nr),
      c = z.useContext(Jo),
      d = () => b5(n, s, o, c);
    return l ? d() : wf(d);
  },
  S5 = tb({ scrapeMotionValuesFromProps: Zf, createRenderState: Pf }),
  T5 = tb({ scrapeMotionValuesFromProps: Vx, createRenderState: Ix }),
  w5 = Symbol.for("motionComponentSymbol");
function E5(n, s, l) {
  const o = z.useRef(l);
  z.useInsertionEffect(() => {
    o.current = l;
  });
  const c = z.useRef(null);
  return z.useCallback(
    (d) => {
      (d && n.onMount?.(d), s && (d ? s.mount(d) : s.unmount()));
      const f = o.current;
      if (typeof f == "function")
        if (d) {
          const p = f(d);
          typeof p == "function" && (c.current = p);
        } else c.current ? (c.current(), (c.current = null)) : f(d);
      else f && (f.current = d);
    },
    [s],
  );
}
const eb = z.createContext({});
function As(n) {
  return (
    n &&
    typeof n == "object" &&
    Object.prototype.hasOwnProperty.call(n, "current")
  );
}
function A5(n, s, l, o, c, d) {
  const { visualElement: f } = z.useContext(nr),
    p = z.useContext(Px),
    m = z.useContext(Jo),
    g = z.useContext(Qf),
    x = g.reducedMotion,
    v = g.skipAnimations,
    S = z.useRef(null),
    j = z.useRef(!1);
  ((o = o || p.renderer),
    !S.current &&
      o &&
      ((S.current = o(n, {
        visualState: s,
        parent: f,
        props: l,
        presenceContext: m,
        blockInitialAnimation: m ? m.initial === !1 : !1,
        reducedMotionConfig: x,
        skipAnimations: v,
        isSVG: d,
      })),
      j.current && S.current && (S.current.manuallyAnimateOnMount = !0)));
  const A = S.current,
    C = z.useContext(eb);
  A &&
    !A.projection &&
    c &&
    (A.type === "html" || A.type === "svg") &&
    C5(S.current, l, c, C);
  const k = z.useRef(!1);
  z.useInsertionEffect(() => {
    A && k.current && A.update(l, m);
  });
  const H = l[fx],
    U = z.useRef(
      !!H &&
        typeof window < "u" &&
        !window.MotionHandoffIsComplete?.(H) &&
        window.MotionHasOptimisedAnimation?.(H),
    );
  return (
    Ef(() => {
      ((j.current = !0),
        A &&
          ((k.current = !0),
          (window.MotionIsMounted = !0),
          A.updateFeatures(),
          A.scheduleRenderMicrotask(),
          U.current && A.animationState && A.animationState.animateChanges()));
    }),
    z.useEffect(() => {
      A &&
        (!U.current && A.animationState && A.animationState.animateChanges(),
        U.current &&
          (queueMicrotask(() => {
            window.MotionHandoffMarkAsComplete?.(H);
          }),
          (U.current = !1)),
        (A.enteringChildren = void 0));
    }),
    A
  );
}
function C5(n, s, l, o) {
  const {
    layoutId: c,
    layout: d,
    drag: f,
    dragConstraints: p,
    layoutScroll: m,
    layoutRoot: g,
    layoutAnchor: x,
    layoutCrossfade: v,
  } = s;
  ((n.projection = new l(
    n.latestValues,
    s["data-framer-portal-id"] ? void 0 : nb(n.parent),
  )),
    n.projection.setOptions({
      layoutId: c,
      layout: d,
      alwaysMeasureLayout: !!f || (p && As(p)),
      visualElement: n,
      animationType: typeof d == "string" ? d : "both",
      initialPromotionConfig: o,
      crossfade: v,
      layoutScroll: m,
      layoutRoot: g,
      layoutAnchor: x,
    }));
}
function nb(n) {
  if (n) return n.options.allowProjection !== !1 ? n.projection : nb(n.parent);
}
function zc(n, { forwardMotionProps: s = !1, type: l } = {}, o, c) {
  o && o5(o);
  const d = l ? l === "svg" : $f(n),
    f = d ? T5 : S5;
  function p(g, x) {
    let v;
    const S = { ...z.useContext(Qf), ...g, layoutId: j5(g) },
      { isStatic: j } = S,
      A = d5(g),
      C = f(g, j);
    if (!j && typeof window < "u") {
      M5();
      const k = N5(S);
      ((v = k.MeasureLayout),
        (A.visualElement = A5(n, C, S, c, k.ProjectionNode, d)));
    }
    return h.jsxs(nr.Provider, {
      value: A,
      children: [
        v && A.visualElement
          ? h.jsx(v, { visualElement: A.visualElement, ...S })
          : null,
        x5(n, g, E5(C, A.visualElement, x), C, j, s, d),
      ],
    });
  }
  p.displayName = `motion.${typeof n == "string" ? n : `create(${n.displayName ?? n.name ?? ""})`}`;
  const m = z.forwardRef(p);
  return ((m[w5] = n), m);
}
function j5({ layoutId: n }) {
  const s = z.useContext(Tf).id;
  return s && n !== void 0 ? s + "-" + n : n;
}
function M5(n, s) {
  z.useContext(Px).strict;
}
function N5(n) {
  const s = $x(),
    { drag: l, layout: o } = s;
  if (!l && !o) return {};
  const c = { ...l, ...o };
  return {
    MeasureLayout:
      l?.isEnabled(n) || o?.isEnabled(n) ? c.MeasureLayout : void 0,
    ProjectionNode: c.ProjectionNode,
  };
}
function R5(n, s) {
  if (typeof Proxy > "u") return zc;
  const l = new Map(),
    o = (d, f) => zc(d, f, n, s),
    c = (d, f) => o(d, f);
  return new Proxy(c, {
    get: (d, f) =>
      f === "create"
        ? o
        : (l.has(f) || l.set(f, zc(f, void 0, n, s)), l.get(f)),
  });
}
const D5 = (n, s) =>
  (s.isSVG ?? $f(n))
    ? new oA(s)
    : new eA(s, { allowProjection: n !== z.Fragment });
class k5 extends ua {
  constructor(s) {
    (super(s), s.animationState || (s.animationState = dA(s)));
  }
  updateAnimationControlsSubscription() {
    const { animate: s } = this.node.getProps();
    tr(s) && (this.unmountControls = s.subscribe(this.node));
  }
  mount() {
    this.updateAnimationControlsSubscription();
  }
  update() {
    const { animate: s } = this.node.getProps(),
      { animate: l } = this.node.prevProps || {};
    s !== l && this.updateAnimationControlsSubscription();
  }
  unmount() {
    (this.node.animationState.reset(), this.unmountControls?.());
  }
}
let O5 = 0;
class B5 extends ua {
  constructor() {
    (super(...arguments), (this.id = O5++), (this.isExitComplete = !1));
  }
  update() {
    if (!this.node.presenceContext) return;
    const { isPresent: s, onExitComplete: l } = this.node.presenceContext,
      { isPresent: o } = this.node.prevPresenceContext || {};
    if (!this.node.animationState || s === o) return;
    if (s && o === !1) {
      if (this.isExitComplete) {
        const { initial: d, custom: f } = this.node.getProps();
        if (
          typeof d == "string" ||
          (typeof d == "object" && d !== null && !Array.isArray(d))
        ) {
          const p = za(this.node, d, f);
          if (p) {
            const { transition: m, transitionEnd: g, ...x } = p;
            for (const v in x) this.node.getValue(v)?.jump(x[v]);
          }
        }
        (this.node.animationState.reset(),
          this.node.animationState.animateChanges());
      } else this.node.animationState.setActive("exit", !1);
      this.isExitComplete = !1;
      return;
    }
    const c = this.node.animationState.setActive("exit", !s);
    l &&
      !s &&
      c.then(() => {
        ((this.isExitComplete = !0), l(this.id));
      });
  }
  mount() {
    const { register: s, onExitComplete: l } = this.node.presenceContext || {};
    (l && l(this.id), s && (this.unmount = s(this.id)));
  }
  unmount() {}
}
const z5 = { animation: { Feature: k5 }, exit: { Feature: B5 } };
function al(n) {
  return { point: { x: n.pageX, y: n.pageY } };
}
const V5 = (n) => (s) => Ff(s) && n(s, al(s));
function Xi(n, s, l, o) {
  return Ji(n, s, V5(l), o);
}
const ab = ({ current: n }) => (n ? n.ownerDocument.defaultView : null),
  Ey = (n, s) => Math.abs(n - s);
function _5(n, s) {
  const l = Ey(n.x, s.x),
    o = Ey(n.y, s.y);
  return Math.sqrt(l ** 2 + o ** 2);
}
const Ay = new Set(["auto", "scroll"]);
class sb {
  constructor(
    s,
    l,
    {
      transformPagePoint: o,
      contextWindow: c = window,
      dragSnapToOrigin: d = !1,
      distanceThreshold: f = 3,
      element: p,
    } = {},
  ) {
    if (
      ((this.startEvent = null),
      (this.lastMoveEvent = null),
      (this.lastMoveEventInfo = null),
      (this.lastRawMoveEventInfo = null),
      (this.handlers = {}),
      (this.contextWindow = window),
      (this.scrollPositions = new Map()),
      (this.removeScrollListeners = null),
      (this.onElementScroll = (A) => {
        this.handleScroll(A.target);
      }),
      (this.onWindowScroll = () => {
        this.handleScroll(window);
      }),
      (this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo)) return;
        this.lastRawMoveEventInfo &&
          (this.lastMoveEventInfo = Eo(
            this.lastRawMoveEventInfo,
            this.transformPagePoint,
          ));
        const A = Vc(this.lastMoveEventInfo, this.history),
          C = this.startEvent !== null,
          k = _5(A.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!C && !k) return;
        const { point: H } = A,
          { timestamp: U } = re;
        this.history.push({ ...H, timestamp: U });
        const { onStart: L, onMove: K } = this.handlers;
        (C ||
          (L && L(this.lastMoveEvent, A),
          (this.startEvent = this.lastMoveEvent)),
          K && K(this.lastMoveEvent, A));
      }),
      (this.handlePointerMove = (A, C) => {
        ((this.lastMoveEvent = A),
          (this.lastRawMoveEventInfo = C),
          (this.lastMoveEventInfo = Eo(C, this.transformPagePoint)),
          _t.update(this.updatePoint, !0));
      }),
      (this.handlePointerUp = (A, C) => {
        this.end();
        const { onEnd: k, onSessionEnd: H, resumeAnimation: U } = this.handlers;
        if (
          ((this.dragSnapToOrigin || !this.startEvent) && U && U(),
          !(this.lastMoveEvent && this.lastMoveEventInfo))
        )
          return;
        const L = Vc(
          A.type === "pointercancel"
            ? this.lastMoveEventInfo
            : Eo(C, this.transformPagePoint),
          this.history,
        );
        (this.startEvent && k && k(A, L), H && H(A, L));
      }),
      !Ff(s))
    )
      return;
    ((this.dragSnapToOrigin = d),
      (this.handlers = l),
      (this.transformPagePoint = o),
      (this.distanceThreshold = f),
      (this.contextWindow = c || window));
    const m = al(s),
      g = Eo(m, this.transformPagePoint),
      { point: x } = g,
      { timestamp: v } = re;
    this.history = [{ ...x, timestamp: v }];
    const { onSessionStart: S } = l;
    S && S(s, Vc(g, this.history));
    const j = { passive: !0, capture: !0 };
    ((this.removeListeners = tl(
      Xi(this.contextWindow, "pointermove", this.handlePointerMove, j),
      Xi(this.contextWindow, "pointerup", this.handlePointerUp, j),
      Xi(this.contextWindow, "pointercancel", this.handlePointerUp, j),
    )),
      p && this.startScrollTracking(p));
  }
  startScrollTracking(s) {
    let l = s.parentElement;
    for (; l;) {
      const o = getComputedStyle(l);
      ((Ay.has(o.overflowX) || Ay.has(o.overflowY)) &&
        this.scrollPositions.set(l, { x: l.scrollLeft, y: l.scrollTop }),
        (l = l.parentElement));
    }
    (this.scrollPositions.set(window, { x: window.scrollX, y: window.scrollY }),
      window.addEventListener("scroll", this.onElementScroll, { capture: !0 }),
      window.addEventListener("scroll", this.onWindowScroll),
      (this.removeScrollListeners = () => {
        (window.removeEventListener("scroll", this.onElementScroll, {
          capture: !0,
        }),
          window.removeEventListener("scroll", this.onWindowScroll));
      }));
  }
  handleScroll(s) {
    const l = this.scrollPositions.get(s);
    if (!l) return;
    const o = s === window,
      c = o
        ? { x: window.scrollX, y: window.scrollY }
        : { x: s.scrollLeft, y: s.scrollTop },
      d = { x: c.x - l.x, y: c.y - l.y };
    (d.x === 0 && d.y === 0) ||
      (o
        ? this.lastMoveEventInfo &&
          ((this.lastMoveEventInfo.point.x += d.x),
          (this.lastMoveEventInfo.point.y += d.y))
        : this.history.length > 0 &&
          ((this.history[0].x -= d.x), (this.history[0].y -= d.y)),
      this.scrollPositions.set(s, c),
      _t.update(this.updatePoint, !0));
  }
  updateHandlers(s) {
    this.handlers = s;
  }
  end() {
    (this.removeListeners && this.removeListeners(),
      this.removeScrollListeners && this.removeScrollListeners(),
      this.scrollPositions.clear(),
      la(this.updatePoint));
  }
}
function Eo(n, s) {
  return s ? { point: s(n.point) } : n;
}
function Cy(n, s) {
  return { x: n.x - s.x, y: n.y - s.y };
}
function Vc({ point: n }, s) {
  return {
    point: n,
    delta: Cy(n, ib(s)),
    offset: Cy(n, L5(s)),
    velocity: U5(s, 0.1),
  };
}
function L5(n) {
  return n[0];
}
function ib(n) {
  return n[n.length - 1];
}
function U5(n, s) {
  if (n.length < 2) return { x: 0, y: 0 };
  let l = n.length - 1,
    o = null;
  const c = ib(n);
  for (; l >= 0 && ((o = n[l]), !(c.timestamp - o.timestamp > De(s)));) l--;
  if (!o) return { x: 0, y: 0 };
  o === n[0] &&
    n.length > 2 &&
    c.timestamp - o.timestamp > De(s) * 2 &&
    (o = n[1]);
  const d = Ge(c.timestamp - o.timestamp);
  if (d === 0) return { x: 0, y: 0 };
  const f = { x: (c.x - o.x) / d, y: (c.y - o.y) / d };
  return (f.x === 1 / 0 && (f.x = 0), f.y === 1 / 0 && (f.y = 0), f);
}
function H5(n, { min: s, max: l }, o) {
  return (
    s !== void 0 && n < s
      ? (n = o ? Vt(s, n, o.min) : Math.max(n, s))
      : l !== void 0 && n > l && (n = o ? Vt(l, n, o.max) : Math.min(n, l)),
    n
  );
}
function jy(n, s, l) {
  return {
    min: s !== void 0 ? n.min + s : void 0,
    max: l !== void 0 ? n.max + l - (n.max - n.min) : void 0,
  };
}
function G5(n, { top: s, left: l, bottom: o, right: c }) {
  return { x: jy(n.x, l, c), y: jy(n.y, s, o) };
}
function My(n, s) {
  let l = s.min - n.min,
    o = s.max - n.max;
  return (
    s.max - s.min < n.max - n.min && ([l, o] = [o, l]),
    { min: l, max: o }
  );
}
function F5(n, s) {
  return { x: My(n.x, s.x), y: My(n.y, s.y) };
}
function q5(n, s) {
  let l = 0.5;
  const o = ge(n),
    c = ge(s);
  return (
    c > o
      ? (l = Qi(s.min, s.max - o, n.min))
      : o > c && (l = Qi(n.min, n.max - c, s.min)),
    un(0, 1, l)
  );
}
function Y5(n, s) {
  const l = {};
  return (
    s.min !== void 0 && (l.min = s.min - n.min),
    s.max !== void 0 && (l.max = s.max - n.min),
    l
  );
}
const pf = 0.35;
function X5(n = pf) {
  return (
    n === !1 ? (n = 0) : n === !0 && (n = pf),
    { x: Ny(n, "left", "right"), y: Ny(n, "top", "bottom") }
  );
}
function Ny(n, s, l) {
  return { min: Ry(n, s), max: Ry(n, l) };
}
function Ry(n, s) {
  return typeof n == "number" ? n : n[s] || 0;
}
const K5 = new WeakMap();
class Z5 {
  constructor(s) {
    ((this.openDragLock = null),
      (this.isDragging = !1),
      (this.currentDirection = null),
      (this.originPoint = { x: 0, y: 0 }),
      (this.constraints = !1),
      (this.hasMutatedConstraints = !1),
      (this.elastic = te()),
      (this.latestPointerEvent = null),
      (this.latestPanInfo = null),
      (this.visualElement = s));
  }
  start(s, { snapToCursor: l = !1, distanceThreshold: o } = {}) {
    const { presenceContext: c } = this.visualElement;
    if (c && c.isPresent === !1) return;
    const d = (v) => {
        (l && this.snapToCursor(al(v).point), this.stopAnimation());
      },
      f = (v, S) => {
        const { drag: j, dragPropagation: A, onDragStart: C } = this.getProps();
        if (
          j &&
          !A &&
          (this.openDragLock && this.openDragLock(),
          (this.openDragLock = vE(j)),
          !this.openDragLock)
        )
          return;
        ((this.latestPointerEvent = v),
          (this.latestPanInfo = S),
          (this.isDragging = !0),
          (this.currentDirection = null),
          this.resolveConstraints(),
          this.visualElement.projection &&
            ((this.visualElement.projection.isAnimationBlocked = !0),
            (this.visualElement.projection.target = void 0)),
          ln((H) => {
            let U = this.getAxisMotionValue(H).get() || 0;
            if (rn.test(U)) {
              const { projection: L } = this.visualElement;
              if (L && L.layout) {
                const K = L.layout.layoutBox[H];
                K && (U = ge(K) * (parseFloat(U) / 100));
              }
            }
            this.originPoint[H] = U;
          }),
          C && _t.update(() => C(v, S), !1, !0),
          sf(this.visualElement, "transform"));
        const { animationState: k } = this.visualElement;
        k && k.setActive("whileDrag", !0);
      },
      p = (v, S) => {
        ((this.latestPointerEvent = v), (this.latestPanInfo = S));
        const {
          dragPropagation: j,
          dragDirectionLock: A,
          onDirectionLock: C,
          onDrag: k,
        } = this.getProps();
        if (!j && !this.openDragLock) return;
        const { offset: H } = S;
        if (A && this.currentDirection === null) {
          ((this.currentDirection = P5(H)),
            this.currentDirection !== null && C && C(this.currentDirection));
          return;
        }
        (this.updateAxis("x", S.point, H),
          this.updateAxis("y", S.point, H),
          this.visualElement.render(),
          k && _t.update(() => k(v, S), !1, !0));
      },
      m = (v, S) => {
        ((this.latestPointerEvent = v),
          (this.latestPanInfo = S),
          this.stop(v, S),
          (this.latestPointerEvent = null),
          (this.latestPanInfo = null));
      },
      g = () => {
        const { dragSnapToOrigin: v } = this.getProps();
        (v || this.constraints) && this.startAnimation({ x: 0, y: 0 });
      },
      { dragSnapToOrigin: x } = this.getProps();
    this.panSession = new sb(
      s,
      {
        onSessionStart: d,
        onStart: f,
        onMove: p,
        onSessionEnd: m,
        resumeAnimation: g,
      },
      {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin: x,
        distanceThreshold: o,
        contextWindow: ab(this.visualElement),
        element: this.visualElement.current,
      },
    );
  }
  stop(s, l) {
    const o = s || this.latestPointerEvent,
      c = l || this.latestPanInfo,
      d = this.isDragging;
    if ((this.cancel(), !d || !c || !o)) return;
    const { velocity: f } = c;
    this.startAnimation(f);
    const { onDragEnd: p } = this.getProps();
    p && _t.postRender(() => p(o, c));
  }
  cancel() {
    this.isDragging = !1;
    const { projection: s, animationState: l } = this.visualElement;
    (s && (s.isAnimationBlocked = !1), this.endPanSession());
    const { dragPropagation: o } = this.getProps();
    (!o &&
      this.openDragLock &&
      (this.openDragLock(), (this.openDragLock = null)),
      l && l.setActive("whileDrag", !1));
  }
  endPanSession() {
    (this.panSession && this.panSession.end(), (this.panSession = void 0));
  }
  updateAxis(s, l, o) {
    const { drag: c } = this.getProps();
    if (!o || !Ao(s, c, this.currentDirection)) return;
    const d = this.getAxisMotionValue(s);
    let f = this.originPoint[s] + o[s];
    (this.constraints &&
      this.constraints[s] &&
      (f = H5(f, this.constraints[s], this.elastic[s])),
      d.set(f));
  }
  resolveConstraints() {
    const { dragConstraints: s, dragElastic: l } = this.getProps(),
      o =
        this.visualElement.projection && !this.visualElement.projection.layout
          ? this.visualElement.projection.measure(!1)
          : this.visualElement.projection?.layout,
      c = this.constraints;
    (s && As(s)
      ? this.constraints || (this.constraints = this.resolveRefConstraints())
      : s && o
        ? (this.constraints = G5(o.layoutBox, s))
        : (this.constraints = !1),
      (this.elastic = X5(l)),
      c !== this.constraints &&
        !As(s) &&
        o &&
        this.constraints &&
        !this.hasMutatedConstraints &&
        ln((d) => {
          this.constraints !== !1 &&
            this.getAxisMotionValue(d) &&
            (this.constraints[d] = Y5(o.layoutBox[d], this.constraints[d]));
        }));
  }
  resolveRefConstraints() {
    const { dragConstraints: s, onMeasureDragConstraints: l } = this.getProps();
    if (!s || !As(s)) return !1;
    const o = s.current,
      { projection: c } = this.visualElement;
    if (!c || !c.layout) return !1;
    c.root && ((c.root.scroll = void 0), c.root.updateScroll());
    const d = PE(o, c.root, this.visualElement.getTransformPagePoint());
    let f = F5(c.layout.layoutBox, d);
    if (l) {
      const p = l(KE(f));
      ((this.hasMutatedConstraints = !!p), p && (f = jx(p)));
    }
    return f;
  }
  startAnimation(s) {
    const {
        drag: l,
        dragMomentum: o,
        dragElastic: c,
        dragTransition: d,
        dragSnapToOrigin: f,
        onDragTransitionEnd: p,
      } = this.getProps(),
      m = this.constraints || {},
      g = ln((x) => {
        if (!Ao(x, l, this.currentDirection)) return;
        let v = (m && m[x]) || {};
        (f === !0 || f === x) && (v = { min: 0, max: 0 });
        const S = c ? 200 : 1e6,
          j = c ? 40 : 1e7,
          A = {
            type: "inertia",
            velocity: o ? s[x] : 0,
            bounceStiffness: S,
            bounceDamping: j,
            timeConstant: 750,
            restDelta: 1,
            restSpeed: 10,
            ...d,
            ...v,
          };
        return this.startAxisValueAnimation(x, A);
      });
    return Promise.all(g).then(p);
  }
  startAxisValueAnimation(s, l) {
    const o = this.getAxisMotionValue(s);
    return (
      sf(this.visualElement, s),
      o.start(_f(s, o, 0, l, this.visualElement, !1))
    );
  }
  stopAnimation() {
    ln((s) => this.getAxisMotionValue(s).stop());
  }
  getAxisMotionValue(s) {
    const l = `_drag${s.toUpperCase()}`,
      c = this.visualElement.getProps()[l];
    return (
      c ||
      this.visualElement.getValue(s, this.visualElement.latestValues[s] ?? 0)
    );
  }
  snapToCursor(s) {
    ln((l) => {
      const { drag: o } = this.getProps();
      if (!Ao(l, o, this.currentDirection)) return;
      const { projection: c } = this.visualElement,
        d = this.getAxisMotionValue(l);
      if (c && c.layout) {
        const { min: f, max: p } = c.layout.layoutBox[l],
          m = d.get() || 0;
        d.set(s[l] - Vt(f, p, 0.5) + m);
      }
    });
  }
  scalePositionWithinConstraints() {
    if (!this.visualElement.current) return;
    const { drag: s, dragConstraints: l } = this.getProps(),
      { projection: o } = this.visualElement;
    if (!As(l) || !o || !this.constraints) return;
    this.stopAnimation();
    const c = { x: 0, y: 0 };
    ln((f) => {
      const p = this.getAxisMotionValue(f);
      if (p && this.constraints !== !1) {
        const m = p.get();
        c[f] = q5({ min: m, max: m }, this.constraints[f]);
      }
    });
    const { transformTemplate: d } = this.visualElement.getProps();
    ((this.visualElement.current.style.transform = d ? d({}, "") : "none"),
      o.root && o.root.updateScroll(),
      o.updateLayout(),
      (this.constraints = !1),
      this.resolveConstraints(),
      ln((f) => {
        if (!Ao(f, s, null)) return;
        const p = this.getAxisMotionValue(f),
          { min: m, max: g } = this.constraints[f];
        p.set(Vt(m, g, c[f]));
      }),
      this.visualElement.render());
  }
  addListeners() {
    if (!this.visualElement.current) return;
    K5.set(this.visualElement, this);
    const s = this.visualElement.current,
      l = Xi(s, "pointerdown", (g) => {
        const { drag: x, dragListener: v = !0 } = this.getProps(),
          S = g.target,
          j = S !== s && CE(S);
        x && v && !j && this.start(g);
      });
    let o;
    const c = () => {
        const { dragConstraints: g } = this.getProps();
        As(g) &&
          g.current &&
          ((this.constraints = this.resolveRefConstraints()),
          o ||
            (o = Q5(s, g.current, () =>
              this.scalePositionWithinConstraints(),
            )));
      },
      { projection: d } = this.visualElement,
      f = d.addEventListener("measure", c);
    (d && !d.layout && (d.root && d.root.updateScroll(), d.updateLayout()),
      _t.read(c));
    const p = Ji(window, "resize", () => this.scalePositionWithinConstraints()),
      m = d.addEventListener(
        "didUpdate",
        ({ delta: g, hasLayoutChanged: x }) => {
          this.isDragging &&
            x &&
            (ln((v) => {
              const S = this.getAxisMotionValue(v);
              S &&
                ((this.originPoint[v] += g[v].translate),
                S.set(S.get() + g[v].translate));
            }),
            this.visualElement.render());
        },
      );
    return () => {
      (p(), l(), f(), m && m(), o && o());
    };
  }
  getProps() {
    const s = this.visualElement.getProps(),
      {
        drag: l = !1,
        dragDirectionLock: o = !1,
        dragPropagation: c = !1,
        dragConstraints: d = !1,
        dragElastic: f = pf,
        dragMomentum: p = !0,
      } = s;
    return {
      ...s,
      drag: l,
      dragDirectionLock: o,
      dragPropagation: c,
      dragConstraints: d,
      dragElastic: f,
      dragMomentum: p,
    };
  }
}
function Dy(n) {
  let s = !0;
  return () => {
    if (s) {
      s = !1;
      return;
    }
    n();
  };
}
function Q5(n, s, l) {
  const o = Lg(n, Dy(l)),
    c = Lg(s, Dy(l));
  return () => {
    (o(), c());
  };
}
function Ao(n, s, l) {
  return (s === !0 || s === n) && (l === null || l === n);
}
function P5(n, s = 10) {
  let l = null;
  return (Math.abs(n.y) > s ? (l = "y") : Math.abs(n.x) > s && (l = "x"), l);
}
class $5 extends ua {
  constructor(s) {
    (super(s),
      (this.removeGroupControls = Fe),
      (this.removeListeners = Fe),
      (this.controls = new Z5(s)));
  }
  mount() {
    const { dragControls: s } = this.node.getProps();
    (s && (this.removeGroupControls = s.subscribe(this.controls)),
      (this.removeListeners = this.controls.addListeners() || Fe));
  }
  update() {
    const { dragControls: s } = this.node.getProps(),
      { dragControls: l } = this.node.prevProps || {};
    s !== l &&
      (this.removeGroupControls(),
      s && (this.removeGroupControls = s.subscribe(this.controls)));
  }
  unmount() {
    (this.removeGroupControls(),
      this.removeListeners(),
      this.controls.isDragging || this.controls.endPanSession());
  }
}
const _c = (n) => (s, l) => {
  n && _t.update(() => n(s, l), !1, !0);
};
class J5 extends ua {
  constructor() {
    (super(...arguments), (this.removePointerDownListener = Fe));
  }
  onPointerDown(s) {
    this.session = new sb(s, this.createPanHandlers(), {
      transformPagePoint: this.node.getTransformPagePoint(),
      contextWindow: ab(this.node),
    });
  }
  createPanHandlers() {
    const {
      onPanSessionStart: s,
      onPanStart: l,
      onPan: o,
      onPanEnd: c,
    } = this.node.getProps();
    return {
      onSessionStart: _c(s),
      onStart: _c(l),
      onMove: _c(o),
      onEnd: (d, f) => {
        (delete this.session, c && _t.postRender(() => c(d, f)));
      },
    };
  }
  mount() {
    this.removePointerDownListener = Xi(this.node.current, "pointerdown", (s) =>
      this.onPointerDown(s),
    );
  }
  update() {
    this.session && this.session.updateHandlers(this.createPanHandlers());
  }
  unmount() {
    (this.removePointerDownListener(), this.session && this.session.end());
  }
}
let Lc = !1;
class W5 extends z.Component {
  componentDidMount() {
    const {
        visualElement: s,
        layoutGroup: l,
        switchLayoutGroup: o,
        layoutId: c,
      } = this.props,
      { projection: d } = s;
    (d &&
      (l.group && l.group.add(d),
      o && o.register && c && o.register(d),
      Lc && d.root.didUpdate(),
      d.addEventListener("animationComplete", () => {
        this.safeToRemove();
      }),
      d.setOptions({
        ...d.options,
        layoutDependency: this.props.layoutDependency,
        onExitComplete: () => this.safeToRemove(),
      })),
      (zo.hasEverUpdated = !0));
  }
  getSnapshotBeforeUpdate(s) {
    const {
        layoutDependency: l,
        visualElement: o,
        drag: c,
        isPresent: d,
      } = this.props,
      { projection: f } = o;
    return (
      f &&
        ((f.isPresent = d),
        s.layoutDependency !== l &&
          f.setOptions({ ...f.options, layoutDependency: l }),
        (Lc = !0),
        c || s.layoutDependency !== l || l === void 0 || s.isPresent !== d
          ? f.willUpdate()
          : this.safeToRemove(),
        s.isPresent !== d &&
          (d
            ? f.promote()
            : f.relegate() ||
              _t.postRender(() => {
                const p = f.getStack();
                (!p || !p.members.length) && this.safeToRemove();
              }))),
      null
    );
  }
  componentDidUpdate() {
    const { visualElement: s, layoutAnchor: l } = this.props,
      { projection: o } = s;
    o &&
      ((o.options.layoutAnchor = l),
      o.root.didUpdate(),
      Gf.postRender(() => {
        !o.currentAnimation && o.isLead() && this.safeToRemove();
      }));
  }
  componentWillUnmount() {
    const {
        visualElement: s,
        layoutGroup: l,
        switchLayoutGroup: o,
      } = this.props,
      { projection: c } = s;
    ((Lc = !0),
      c &&
        (c.scheduleCheckAfterUnmount(),
        l && l.group && l.group.remove(c),
        o && o.deregister && o.deregister(c)));
  }
  safeToRemove() {
    const { safeToRemove: s } = this.props;
    s && s();
  }
  render() {
    return null;
  }
}
function lb(n) {
  const [s, l] = Qx(),
    o = z.useContext(Tf);
  return h.jsx(W5, {
    ...n,
    layoutGroup: o,
    switchLayoutGroup: z.useContext(eb),
    isPresent: s,
    safeToRemove: l,
  });
}
const I5 = {
  pan: { Feature: J5 },
  drag: { Feature: $5, ProjectionNode: Zx, MeasureLayout: lb },
};
function ky(n, s, l) {
  const { props: o } = n;
  n.animationState &&
    o.whileHover &&
    n.animationState.setActive("whileHover", l === "Start");
  const c = "onHover" + l,
    d = o[c];
  d && _t.postRender(() => d(s, al(s)));
}
class tC extends ua {
  mount() {
    const { current: s } = this.node;
    s &&
      (this.unmount = TE(
        s,
        (l, o) => (ky(this.node, o, "Start"), (c) => ky(this.node, c, "End")),
      ));
  }
  unmount() {}
}
class eC extends ua {
  constructor() {
    (super(...arguments), (this.isActive = !1));
  }
  onFocus() {
    let s = !1;
    try {
      s = this.node.current.matches(":focus-visible");
    } catch {
      s = !0;
    }
    !s ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !0),
      (this.isActive = !0));
  }
  onBlur() {
    !this.isActive ||
      !this.node.animationState ||
      (this.node.animationState.setActive("whileFocus", !1),
      (this.isActive = !1));
  }
  mount() {
    this.unmount = tl(
      Ji(this.node.current, "focus", () => this.onFocus()),
      Ji(this.node.current, "blur", () => this.onBlur()),
    );
  }
  unmount() {}
}
function Oy(n, s, l) {
  const { props: o } = n;
  if (n.current instanceof HTMLButtonElement && n.current.disabled) return;
  n.animationState &&
    o.whileTap &&
    n.animationState.setActive("whileTap", l === "Start");
  const c = "onTap" + (l === "End" ? "" : l),
    d = o[c];
  d && _t.postRender(() => d(s, al(s)));
}
class nC extends ua {
  mount() {
    const { current: s } = this.node;
    if (!s) return;
    const { globalTapTarget: l, propagate: o } = this.node.props;
    this.unmount = ME(
      s,
      (c, d) => (
        Oy(this.node, d, "Start"),
        (f, { success: p }) => Oy(this.node, f, p ? "End" : "Cancel")
      ),
      { useGlobalTarget: l, stopPropagation: o?.tap === !1 },
    );
  }
  unmount() {}
}
const gf = new WeakMap(),
  Uc = new WeakMap(),
  aC = (n) => {
    const s = gf.get(n.target);
    s && s(n);
  },
  sC = (n) => {
    n.forEach(aC);
  };
function iC({ root: n, ...s }) {
  const l = n || document;
  Uc.has(l) || Uc.set(l, {});
  const o = Uc.get(l),
    c = JSON.stringify(s);
  return (
    o[c] || (o[c] = new IntersectionObserver(sC, { root: n, ...s })),
    o[c]
  );
}
function lC(n, s, l) {
  const o = iC(s);
  return (
    gf.set(n, l),
    o.observe(n),
    () => {
      (gf.delete(n), o.unobserve(n));
    }
  );
}
const oC = { some: 0, all: 1 };
class rC extends ua {
  constructor() {
    (super(...arguments), (this.hasEnteredView = !1), (this.isInView = !1));
  }
  startObserver() {
    this.stopObserver?.();
    const { viewport: s = {} } = this.node.getProps(),
      { root: l, margin: o, amount: c = "some", once: d } = s,
      f = {
        root: l ? l.current : void 0,
        rootMargin: o,
        threshold: typeof c == "number" ? c : oC[c],
      },
      p = (m) => {
        const { isIntersecting: g } = m;
        if (
          this.isInView === g ||
          ((this.isInView = g), d && !g && this.hasEnteredView)
        )
          return;
        (g && (this.hasEnteredView = !0),
          this.node.animationState &&
            this.node.animationState.setActive("whileInView", g));
        const { onViewportEnter: x, onViewportLeave: v } = this.node.getProps(),
          S = g ? x : v;
        S && S(m);
      };
    this.stopObserver = lC(this.node.current, f, p);
  }
  mount() {
    this.startObserver();
  }
  update() {
    if (typeof IntersectionObserver > "u") return;
    const { props: s, prevProps: l } = this.node;
    ["amount", "margin", "root"].some(uC(s, l)) && this.startObserver();
  }
  unmount() {
    (this.stopObserver?.(), (this.hasEnteredView = !1), (this.isInView = !1));
  }
}
function uC({ viewport: n = {} }, { viewport: s = {} } = {}) {
  return (l) => n[l] !== s[l];
}
const cC = {
    inView: { Feature: rC },
    tap: { Feature: nC },
    focus: { Feature: eC },
    hover: { Feature: tC },
  },
  fC = { layout: { ProjectionNode: Zx, MeasureLayout: lb } },
  dC = { ...z5, ...cC, ...I5, ...fC },
  Bt = R5(dC, D5);
function ob({ className: n }) {
  return h.jsxs("svg", {
    viewBox: "0 0 100 100",
    className: n,
    "aria-hidden": !0,
    children: [
      h.jsx("defs", {
        children: h.jsxs("radialGradient", {
          id: "bg-ball",
          cx: "35%",
          cy: "30%",
          r: "75%",
          children: [
            h.jsx("stop", { offset: "0%", stopColor: "#ff6b5e" }),
            h.jsx("stop", { offset: "45%", stopColor: "#E52525" }),
            h.jsx("stop", { offset: "100%", stopColor: "#7d0d10" }),
          ],
        }),
      }),
      h.jsx("circle", { cx: "50", cy: "50", r: "48", fill: "url(#bg-ball)" }),
      h.jsx("path", {
        d: "M22 12 C 44 34, 44 66, 22 88",
        fill: "none",
        stroke: "#F8F5E8",
        strokeOpacity: ".85",
        strokeWidth: "2.2",
      }),
      h.jsx("path", {
        d: "M30 8 C 54 32, 54 68, 30 92",
        fill: "none",
        stroke: "#F8F5E8",
        strokeOpacity: ".85",
        strokeWidth: "2.2",
      }),
      Array.from({ length: 9 }).map((s, l) => {
        const o = 18 + l * 8,
          c = 30 + Math.sin((l / 8) * Math.PI) * 15;
        return h.jsx(
          "path",
          {
            d: `M${c - 4} ${o - 2} l3 3 M${c + 6} ${o - 2} l-3 3`,
            stroke: "#F8F5E8",
            strokeOpacity: ".6",
            strokeWidth: "1.3",
          },
          l,
        );
      }),
      h.jsx("ellipse", {
        cx: "34",
        cy: "28",
        rx: "12",
        ry: "7",
        fill: "#fff",
        opacity: ".18",
        transform: "rotate(-30 34 28)",
      }),
    ],
  });
}
function Va({ className: n, broken: s }) {
  return h.jsxs("svg", {
    viewBox: "0 0 60 100",
    className: n,
    "aria-hidden": !0,
    children: [
      [10, 27, 44].map((l) =>
        h.jsx(
          "rect",
          { x: l, y: "14", width: "6", height: "84", rx: "3", fill: "#F8F5E8" },
          l,
        ),
      ),
      h.jsx(Bt.rect, {
        x: "8",
        y: "8",
        width: "24",
        height: "5",
        rx: "2.5",
        fill: "#F5C451",
        animate: s
          ? { x: -20, y: -30, rotate: -60, opacity: 0 }
          : { x: 8, y: 8, rotate: 0, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }),
      h.jsx(Bt.rect, {
        x: "28",
        y: "8",
        width: "24",
        height: "5",
        rx: "2.5",
        fill: "#F5C451",
        animate: s
          ? { x: 60, y: -26, rotate: 70, opacity: 0 }
          : { x: 28, y: 8, rotate: 0, opacity: 1 },
        transition: { duration: 0.5, ease: "easeOut" },
      }),
    ],
  });
}
function _a({ team: n, size: s = 40, className: l }) {
  const o =
    n.name
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((c) => c[0])
      .join("")
      .toUpperCase() || "T";
  return h.jsx("div", {
    className: Rt(
      "shrink-0 rounded-full grid place-items-center overflow-hidden font-extrabold text-[#F8F5E8] ring-2 ring-[#F8F5E8]/70",
      l,
    ),
    style: { width: s, height: s, background: n.color, fontSize: s * 0.36 },
    children: n.logo
      ? h.jsx("img", {
          src: n.logo,
          alt: "",
          className: "w-full h-full object-cover",
        })
      : o,
  });
}
function Ki({ open: n, onClose: s, title: l, children: o, dark: c }) {
  return (
    z.useEffect(() => {
      if (!n) return;
      const d = (f) => f.key === "Escape" && s();
      return (
        window.addEventListener("keydown", d),
        () => window.removeEventListener("keydown", d)
      );
    }, [n, s]),
    h.jsx(Ns, {
      children:
        n &&
        h.jsxs(Bt.div, {
          className:
            "fixed inset-0 z-50 flex items-end sm:items-center justify-center",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          children: [
            h.jsx("div", {
              className: "absolute inset-0 bg-[#0B1C10]/60 backdrop-blur-[2px]",
              onClick: s,
              "data-testid": "sheet-backdrop",
            }),
            h.jsxs(Bt.div, {
              role: "dialog",
              "aria-modal": !0,
              className: Rt(
                "relative w-full sm:max-w-md max-h-[90dvh] overflow-y-auto rounded-t-[2rem] sm:rounded-[2rem] p-5 pb-8 shadow-2xl",
                c
                  ? "bg-[#102B17] text-[#F8F5E8]"
                  : "bg-[#FBF9F0] text-[#0B1C10]",
              ),
              initial: { y: 60, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              exit: { y: 60, opacity: 0 },
              transition: { type: "spring", damping: 26, stiffness: 320 },
              children: [
                h.jsx("div", {
                  className:
                    "mx-auto mb-3 h-1.5 w-10 rounded-full bg-current opacity-15 sm:hidden",
                }),
                h.jsxs("div", {
                  className: "flex items-center justify-between mb-4",
                  children: [
                    h.jsx("h2", {
                      className: "text-lg font-bold",
                      children: l,
                    }),
                    h.jsx("button", {
                      onClick: s,
                      className:
                        "press h-9 w-9 grid place-items-center rounded-full bg-current/10",
                      "aria-label": "Close",
                      "data-testid": "button-close-sheet",
                      children: h.jsx(r0, { className: "h-4 w-4" }),
                    }),
                  ],
                }),
                o,
              ],
            }),
          ],
        }),
    })
  );
}
function Qo({
  open: n,
  onClose: s,
  title: l,
  body: o,
  confirmLabel: c,
  onConfirm: d,
  danger: f,
}) {
  return h.jsxs(Ki, {
    open: n,
    onClose: s,
    title: l,
    children: [
      h.jsx("p", { className: "text-sm text-[#0B1C10]/70 mb-6", children: o }),
      h.jsxs("div", {
        className: "grid grid-cols-2 gap-3",
        children: [
          h.jsx("button", {
            onClick: s,
            className: "press h-12 rounded-2xl bg-[#0B1C10]/8 font-semibold",
            "data-testid": "button-confirm-cancel",
            children: "Keep playing",
          }),
          h.jsx("button", {
            onClick: () => {
              (d(), s());
            },
            className: Rt(
              "press h-12 rounded-2xl font-bold text-[#F8F5E8]",
              f ? "bg-[#E52525]" : "bg-[#102B17]",
            ),
            "data-testid": "button-confirm-ok",
            children: c,
          }),
        ],
      }),
    ],
  });
}
function Vo({ value: n, onChange: s, min: l, max: o, label: c }) {
  return h.jsxs("div", {
    className:
      "flex items-center justify-between rounded-2xl bg-[#0B1C10]/5 p-2",
    children: [
      h.jsx("span", { className: "pl-2 text-sm font-medium", children: c }),
      h.jsxs("div", {
        className: "flex items-center gap-2",
        children: [
          h.jsx("button", {
            className:
              "press h-10 w-10 rounded-full bg-[#F8F5E8] shadow-sm font-bold disabled:opacity-30",
            disabled: n <= l,
            onClick: () => s(n - 1),
            "data-testid": `button-dec-${c}`,
            children: "-",
          }),
          h.jsx(
            Bt.span,
            {
              initial: { scale: 1.4 },
              animate: { scale: 1 },
              className: "w-8 text-center text-xl font-extrabold",
              children: n,
            },
            n,
          ),
          h.jsx("button", {
            className:
              "press h-10 w-10 rounded-full bg-[#102B17] text-[#F8F5E8] font-bold disabled:opacity-30",
            disabled: n >= o,
            onClick: () => s(n + 1),
            "data-testid": `button-inc-${c}`,
            children: "+",
          }),
        ],
      }),
    ],
  });
}
function Zi({ checked: n, onChange: s, label: l, hint: o, id: c }) {
  return h.jsxs("button", {
    type: "button",
    onClick: () => s(!n),
    className:
      "w-full flex items-center justify-between gap-3 rounded-2xl bg-[#0B1C10]/5 px-4 py-3 text-left",
    "data-testid": `toggle-${c}`,
    "aria-pressed": n,
    children: [
      h.jsxs("span", {
        children: [
          h.jsx("span", {
            className: "block text-sm font-semibold",
            children: l,
          }),
          o &&
            h.jsx("span", {
              className: "block text-xs opacity-60",
              children: o,
            }),
        ],
      }),
      h.jsx("span", {
        className: Rt(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors",
          n ? "bg-[#4CAF50]" : "bg-[#0B1C10]/20",
        ),
        children: h.jsx(Bt.span, {
          layout: !0,
          transition: { type: "spring", stiffness: 500, damping: 30 },
          className: Rt(
            "absolute top-1 h-5 w-5 rounded-full bg-[#F8F5E8] shadow",
            n ? "right-1" : "left-1",
          ),
        }),
      }),
    ],
  });
}
function Po({ eyebrow: n, title: s, right: l }) {
  return h.jsxs("header", {
    className: "flex items-end justify-between gap-4 pt-6 pb-5",
    children: [
      h.jsxs("div", {
        children: [
          h.jsx("p", {
            className:
              "text-xs font-bold uppercase tracking-[0.2em] text-[#4CAF50]",
            children: n,
          }),
          h.jsx("h1", {
            className:
              "text-3xl sm:text-4xl font-extrabold tracking-tight text-[#0B1C10]",
            children: s,
          }),
        ],
      }),
      l,
    ],
  });
}
const hC = [
  { href: "/", label: "Home", icon: yS },
  { href: "/matches", label: "Matches", icon: pS },
  { href: "/setup", label: "Create", icon: o0, center: !0 },
  { href: "/stats", label: "Stats", icon: tS },
  { href: "/profile", label: "Profile", icon: qS },
];
function mC() {
  const { settings: n } = Mn(),
    [s, l] = z.useState(() => {
      try {
        return !sessionStorage.getItem("gc.splash");
      } catch {
        return !1;
      }
    }),
    [o, c] = z.useState(!1);
  return (
    z.useEffect(() => {
      if (!s) return;
      try {
        sessionStorage.setItem("gc.splash", "1");
      } catch {}
      const d = !n.animations,
        f = setTimeout(() => c(!0), d ? 0 : 620),
        p = setTimeout(() => l(!1), d ? 300 : 1500);
      return () => {
        (clearTimeout(f), clearTimeout(p));
      };
    }, [s, n.animations]),
    h.jsx(Ns, {
      children:
        s &&
        h.jsxs(Bt.div, {
          className:
            "fixed inset-0 z-[90] pitch-bg mow grid place-items-center",
          exit: { opacity: 0 },
          transition: { duration: 0.35 },
          "data-testid": "splash",
          children: [
            h.jsxs("div", {
              className: "relative w-64 h-40",
              children: [
                h.jsx(Va, {
                  broken: o,
                  className: "absolute right-6 bottom-0 h-32",
                }),
                h.jsx(Bt.div, {
                  className: "absolute left-0 bottom-6 h-10 w-10",
                  initial: { x: 0, y: -80, rotate: 0 },
                  animate: { x: 168, y: 0, rotate: 540 },
                  transition: { duration: 0.62, ease: [0.4, 0, 0.9, 0.6] },
                  children: h.jsx(ob, { className: "h-full w-full" }),
                }),
              ],
            }),
            h.jsxs(Bt.p, {
              initial: { opacity: 0, y: 10 },
              animate: { opacity: 1, y: 0 },
              transition: { delay: 0.5 },
              className:
                "absolute bottom-[22%] text-[#F8F5E8] text-3xl font-black tracking-tight",
              children: [
                "GULLY ",
                h.jsx("span", {
                  className: "text-[#F5C451]",
                  children: "CRIX",
                }),
              ],
            }),
          ],
        }),
    })
  );
}
function pC() {
  const {
      saveError: n,
      retrySave: s,
      recoveryNote: l,
      dismissRecovery: o,
    } = Mn(),
    c = n ?? l;
  return c
    ? h.jsxs("div", {
        className: Rt(
          "fixed top-3 inset-x-3 z-[70] mx-auto max-w-lg rounded-2xl px-4 py-3 flex items-center gap-3 shadow-lg text-sm",
          n ? "bg-[#E52525] text-[#F8F5E8]" : "bg-[#F5C451] text-[#0B1C10]",
        ),
        role: "alert",
        "data-testid": "status-save",
        children: [
          h.jsx(_S, { className: "h-5 w-5 shrink-0" }),
          h.jsx("span", { className: "flex-1 font-medium", children: c }),
          n
            ? h.jsxs("button", {
                onClick: s,
                className:
                  "press flex items-center gap-1 font-bold rounded-full bg-[#F8F5E8]/20 px-3 py-1",
                "data-testid": "button-retry-save",
                children: [h.jsx(kS, { className: "h-3.5 w-3.5" }), "Retry"],
              })
            : h.jsx("button", {
                onClick: o,
                "aria-label": "Dismiss",
                "data-testid": "button-dismiss-recovery",
                children: h.jsx(r0, { className: "h-4 w-4" }),
              }),
        ],
      })
    : null;
}
function gC({ children: n }) {
  const [s] = Ii(),
    l = s.startsWith("/match/");
  return h.jsxs("div", {
    className: "min-h-[100dvh] bg-[#F8F5E8]",
    children: [
      h.jsx(pC, {}),
      h.jsx("div", {
        className: Rt(!l && "pb-28 md:pb-0 md:pl-24"),
        children: n,
      }),
      !l &&
        h.jsx("nav", {
          className:
            "fixed z-40 bottom-3 inset-x-3 md:inset-x-auto md:left-3 md:top-3 md:bottom-3 md:w-20 rounded-[1.75rem] bg-[#0B1C10] shadow-[0_12px_30px_-10px_rgba(11,28,16,.6)]",
          children: h.jsx("ul", {
            className:
              "flex md:flex-col md:h-full md:justify-center items-center justify-around gap-1 p-2",
            children: hC.map((o) => {
              const c = o.href === "/" ? s === "/" : s.startsWith(o.href),
                d = o.icon;
              return o.center
                ? h.jsx(
                    "li",
                    {
                      children: h.jsx(ue, {
                        href: o.href,
                        className:
                          "press -mt-7 md:mt-0 md:my-3 grid place-items-center h-14 w-14 rounded-full bg-[#E52525] text-[#F8F5E8] ring-4 ring-[#F8F5E8] md:ring-[#0B1C10] shadow-lg",
                        "aria-label": "Create match",
                        "data-testid": "link-nav-create",
                        children: h.jsx(d, {
                          className: "h-6 w-6",
                          strokeWidth: 3,
                        }),
                      }),
                    },
                    o.href,
                  )
                : h.jsx(
                    "li",
                    {
                      children: h.jsxs(ue, {
                        href: o.href,
                        className: Rt(
                          "press relative flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 text-[10px] font-semibold transition-colors",
                          c
                            ? "text-[#0B1C10]"
                            : "text-[#F8F5E8]/60 hover:text-[#F8F5E8]",
                        ),
                        "data-testid": `link-nav-${o.label.toLowerCase()}`,
                        children: [
                          c &&
                            h.jsx(Bt.span, {
                              layoutId: "nav-pill",
                              className:
                                "absolute inset-0 rounded-2xl bg-[#F5C451]",
                              transition: {
                                type: "spring",
                                stiffness: 400,
                                damping: 32,
                              },
                            }),
                          h.jsx(d, { className: "relative h-5 w-5" }),
                          h.jsx("span", {
                            className: "relative",
                            children: o.label,
                          }),
                        ],
                      }),
                    },
                    o.href,
                  );
            }),
          }),
        }),
    ],
  });
}
const yC = {
    overs: 6,
    maxWickets: 10,
    wideRuns: 1,
    noBallRuns: 1,
    wideLegal: !1,
    noBallLegal: !1,
    freeHit: !0,
    localRules: "",
  },
  ks = (n) => `${Math.floor(n / 6)}.${n % 6}`;
function Gi(n, s, l, o) {
  if (!Number.isInteger(n) || n < s || n > l)
    throw new Error(`${o} must be between ${s} and ${l}.`);
}
function rb(n) {
  if (
    (Gi(n.rules.overs, 1, 100, "Overs"),
    Gi(n.rules.maxWickets, 1, 10, "Wickets"),
    Gi(n.rules.wideRuns, 0, 10, "Wide penalty"),
    Gi(n.rules.noBallRuns, 0, 10, "No-ball penalty"),
    n.teams.some((s) => !s.name.trim()))
  )
    throw new Error("Both teams need a name.");
  if (
    n.teams[0].name.trim().toLowerCase() ===
    n.teams[1].name.trim().toLowerCase()
  )
    throw new Error("Choose different team names.");
  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    config: structuredClone(n),
    events: [],
    cursor: 0,
  };
}
function By(n) {
  return {
    teamIndex: n,
    runs: 0,
    wickets: 0,
    balls: 0,
    extras: 0,
    fours: 0,
    sixes: 0,
    striker: 0,
    freeHit: !1,
    deliveries: [],
    closed: !1,
  };
}
function xC(n, s, l) {
  if ((Gi(s.runs, 0, 100, "Runs"), s.kind === "wicket" && s.runs !== 0))
    throw new Error("Record wicket deliveries with zero runs.");
  if (s.kind === "wicket" && n.freeHit && s.dismissal !== "runout")
    throw new Error("On a free hit, select run out or record runs.");
  const o =
      s.kind === "wide"
        ? l.wideLegal
        : s.kind === "noball"
          ? l.noBallLegal
          : !0,
    c = s.kind === "wide" ? l.wideRuns : s.kind === "noball" ? l.noBallRuns : 0,
    d = s.runs + c,
    f = Math.floor(n.balls / 6);
  ((n.runs += d),
    (s.kind === "wide" || s.kind === "bye" || s.kind === "legbye") &&
      (n.extras += d),
    s.kind === "noball" && (n.extras += c),
    s.kind === "wicket" && n.wickets++,
    (s.kind === "runs" || s.kind === "noball") && s.runs === 4 && n.fours++,
    (s.kind === "runs" || s.kind === "noball") && s.runs === 6 && n.sixes++,
    s.runs % 2 && (n.striker = n.striker === 0 ? 1 : 0),
    o &&
      (n.balls++, n.balls % 6 === 0 && (n.striker = n.striker === 0 ? 1 : 0)),
    s.kind === "noball" && l.freeHit
      ? (n.freeHit = !0)
      : o && (n.freeHit = !1));
  const p = {
      runs: "",
      wide: "wd",
      noball: "nb",
      bye: "b",
      legbye: "lb",
      wicket: "W",
    }[s.kind],
    m =
      s.kind === "wicket"
        ? "W"
        : s.kind === "runs"
          ? String(s.runs)
          : `${d}${p}`;
  n.deliveries.push({ ...s, total: d, legal: o, label: m, over: f });
}
function oa(n) {
  const { config: s } = n,
    l = s.rules,
    o = [By(s.battingFirst)];
  let c = 0,
    d = "playing",
    f = null,
    p = null,
    m = "";
  const g = () => {
    d = "complete";
    const x = o[0],
      v = o[1];
    if (((v.closed = !0), v.runs > x.runs)) {
      p = v.teamIndex;
      const S = l.maxWickets - v.wickets;
      m = `${s.teams[p].name} won by ${S} wicket${S === 1 ? "" : "s"}`;
    } else if (v.runs < x.runs) {
      p = x.teamIndex;
      const S = x.runs - v.runs;
      m = `${s.teams[p].name} won by ${S} run${S === 1 ? "" : "s"}`;
    } else m = "Match tied! What a battle!";
  };
  for (const x of n.events.slice(0, n.cursor)) {
    if (d === "complete" || d === "abandoned") break;
    let v = o[c];
    if (x.type === "abandon") {
      ((d = "abandoned"), (m = "Match abandoned — no result"));
      break;
    }
    if (x.type === "endInnings") {
      ((v.closed = !0),
        c === 0
          ? ((f = v.runs + 1),
            (c = 1),
            o.push(By(s.battingFirst === 0 ? 1 : 0)),
            (d = "playing"))
          : g());
      continue;
    }
    if (d === "inningsBreak") continue;
    if (x.type === "swap") {
      v.striker = v.striker === 0 ? 1 : 0;
      continue;
    }
    xC(v, x, l);
    const S = v.balls >= l.overs * 6 || v.wickets >= l.maxWickets;
    c === 1 && (v.runs >= f || S)
      ? g()
      : c === 0 &&
        S &&
        ((v.closed = !0), (d = "inningsBreak"), (f = v.runs + 1));
  }
  return {
    innings: o,
    current: o[c],
    inningsIndex: c,
    status: d,
    target: f,
    winner: p,
    result: m,
  };
}
function zy(n, s) {
  const l = oa(n);
  if (l.status === "complete" || l.status === "abandoned")
    throw new Error("This match has finished. Undo to change the last event.");
  if (
    l.status === "inningsBreak" &&
    s.type !== "endInnings" &&
    s.type !== "abandon"
  )
    throw new Error("Start the chase before scoring.");
  const o = [...n.events.slice(0, n.cursor), s],
    c = { ...n, events: o, cursor: o.length };
  return (oa(c), c);
}
function bC(n) {
  return { ...n, cursor: Math.max(0, n.cursor - 1) };
}
function vC(n) {
  return { ...n, cursor: Math.min(n.events.length, n.cursor + 1) };
}
function SC() {
  const { matches: n, settings: s } = Mn(),
    [l, o] = z.useState(!1),
    c = z.useMemo(
      () =>
        n
          .map((p) => ({ m: p, s: oa(p) }))
          .filter(
            (p) => p.s.status === "playing" || p.s.status === "inningsBreak",
          )
          .slice(0, 2),
      [n],
    ),
    d = new Date().getHours(),
    f =
      d < 12
        ? "Morning session"
        : d < 17
          ? "Afternoon session"
          : "Evening session";
  return h.jsxs("div", {
    className: "min-h-[100dvh] md:min-h-0",
    children: [
      h.jsxs("section", {
        className:
          "relative pitch-bg mow overflow-hidden rounded-b-[2.5rem] md:rounded-[2.5rem] md:m-3 px-5 pt-8 pb-14 text-[#F8F5E8]",
        children: [
          h.jsx("div", {
            className:
              "absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-40 sm:w-52 bg-[#d8c99a]/15 border-x-2 border-[#F8F5E8]/15",
          }),
          h.jsx("div", {
            className:
              "absolute left-1/2 -translate-x-1/2 top-[30%] w-56 sm:w-72 h-0.5 bg-[#F8F5E8]/40",
          }),
          h.jsx("div", {
            className:
              "absolute left-1/2 -translate-x-1/2 bottom-[18%] w-56 sm:w-72 h-0.5 bg-[#F8F5E8]/40",
          }),
          h.jsxs("div", {
            className: "relative flex items-center justify-between",
            children: [
              h.jsxs("div", {
                children: [
                  h.jsx("p", {
                    className:
                      "text-xs uppercase tracking-[0.25em] text-[#F5C451] font-bold",
                    children: f,
                  }),
                  h.jsxs("h1", {
                    className: "text-2xl font-black tracking-tight",
                    children: [
                      "GULLY ",
                      h.jsx("span", {
                        className: "text-[#F5C451]",
                        children: "CRIX",
                      }),
                    ],
                  }),
                ],
              }),
              h.jsx(ue, {
                href: "/profile",
                className:
                  "press h-10 w-10 rounded-full bg-[#F8F5E8]/10 grid place-items-center text-sm font-bold",
                "data-testid": "link-profile-avatar",
                children: s.name
                  ? s.name[0].toUpperCase()
                  : h.jsx(XS, { className: "h-4 w-4" }),
              }),
            ],
          }),
          h.jsxs("div", {
            className: "relative mt-6 flex flex-col items-center",
            children: [
              h.jsx(Va, { className: "h-24 opacity-90" }),
              h.jsxs("div", {
                className: "relative mt-6 h-44 w-44 sm:h-52 sm:w-52",
                children: [
                  h.jsx("span", {
                    className:
                      "ball-ring absolute inset-0 rounded-full border-2 border-[#F5C451]",
                  }),
                  h.jsx(Bt.button, {
                    onClick: () => o(!0),
                    whileTap: { scale: 0.88, rotate: -25 },
                    whileHover: { rotate: 12 },
                    className:
                      "ball-bob relative h-full w-full rounded-full drop-shadow-[0_24px_24px_rgba(0,0,0,.45)]",
                    "aria-label": "Start a match",
                    "data-testid": "button-ball-start",
                    children: h.jsx(ob, { className: "h-full w-full" }),
                  }),
                ],
              }),
              h.jsx("p", {
                className: "mt-5 text-sm font-semibold text-[#F8F5E8]/70",
                children: "Tap the ball to start a match",
              }),
              h.jsxs("h2", {
                className:
                  "mt-2 text-4xl sm:text-5xl font-black text-center leading-[0.95] tracking-tight",
                children: [
                  "Score fast.",
                  h.jsx("br", {}),
                  h.jsx("span", {
                    className: "text-[#4CAF50]",
                    children: "Play more.",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      h.jsxs("div", {
        className: "px-5 max-w-3xl mx-auto",
        children: [
          c.length > 0 &&
            h.jsx("section", {
              className: "-mt-8 relative space-y-3",
              children: c.map(({ m: p, s: m }) =>
                h.jsxs(
                  ue,
                  {
                    href: `/match/${p.id}`,
                    className:
                      "press block rounded-3xl bg-[#FBF9F0] border border-[#0B1C10]/10 p-4 shadow-[0_14px_30px_-18px_rgba(11,28,16,.5)]",
                    "data-testid": `card-live-${p.id}`,
                    children: [
                      h.jsxs("div", {
                        className:
                          "flex items-center gap-2 text-xs font-bold text-[#E52525] uppercase tracking-widest",
                        children: [
                          h.jsx("span", {
                            className:
                              "h-2 w-2 rounded-full bg-[#E52525] animate-pulse",
                          }),
                          " ",
                          m.status === "inningsBreak"
                            ? "Innings break"
                            : "In progress",
                        ],
                      }),
                      h.jsxs("div", {
                        className: "mt-2 flex items-center gap-3",
                        children: [
                          h.jsx(_a, {
                            team: p.config.teams[m.current.teamIndex],
                            size: 40,
                          }),
                          h.jsxs("div", {
                            className: "flex-1 min-w-0",
                            children: [
                              h.jsxs("p", {
                                className: "font-bold truncate",
                                children: [
                                  p.config.teams[0].name,
                                  " vs ",
                                  p.config.teams[1].name,
                                ],
                              }),
                              h.jsxs("p", {
                                className: "text-sm text-[#0B1C10]/60",
                                children: [
                                  p.config.teams[m.current.teamIndex].name,
                                  " ",
                                  m.current.runs,
                                  "/",
                                  m.current.wickets,
                                  " in ",
                                  ks(m.current.balls),
                                  " ov",
                                ],
                              }),
                            ],
                          }),
                          h.jsxs("span", {
                            className:
                              "rounded-full bg-[#102B17] text-[#F8F5E8] px-3 py-1.5 text-xs font-bold flex items-center gap-1",
                            children: [
                              "Resume ",
                              h.jsx(Yc, { className: "h-3 w-3" }),
                            ],
                          }),
                        ],
                      }),
                    ],
                  },
                  p.id,
                ),
              ),
            }),
          h.jsxs("section", {
            className: "mt-8 grid grid-cols-2 gap-3",
            children: [
              h.jsxs(ue, {
                href: "/setup",
                className:
                  "press col-span-2 sm:col-span-1 rounded-3xl bg-[#F5C451] p-5 flex flex-col justify-between min-h-32",
                "data-testid": "link-quick-match",
                children: [
                  h.jsx(ug, { className: "h-6 w-6" }),
                  h.jsxs("div", {
                    children: [
                      h.jsx("p", {
                        className: "text-xl font-extrabold",
                        children: "Quick Match",
                      }),
                      h.jsx("p", {
                        className: "text-sm opacity-70",
                        children: "Two teams, any overs, your rules.",
                      }),
                    ],
                  }),
                ],
              }),
              h.jsxs(ue, {
                href: "/matches",
                className:
                  "press rounded-3xl bg-[#102B17] text-[#F8F5E8] p-5 flex flex-col justify-between min-h-32",
                "data-testid": "link-history",
                children: [
                  h.jsx("p", {
                    className: "text-4xl font-black",
                    children: n.length,
                  }),
                  h.jsx("p", {
                    className: "text-sm font-semibold opacity-80",
                    children: "matches on this device",
                  }),
                ],
              }),
              h.jsxs(ue, {
                href: "/stats",
                className:
                  "press rounded-3xl bg-[#4CAF50] text-[#0B1C10] p-5 flex flex-col justify-between min-h-32",
                "data-testid": "link-stats",
                children: [
                  h.jsx(US, { className: "h-6 w-6" }),
                  h.jsx("p", {
                    className: "text-sm font-bold",
                    children: "Your gully numbers",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      h.jsx(Ki, {
        open: l,
        onClose: () => o(!1),
        title: "Pick your game",
        children: h.jsxs("div", {
          className: "space-y-3",
          children: [
            h.jsxs(ue, {
              href: "/setup",
              className:
                "press flex items-center gap-4 rounded-3xl bg-[#102B17] text-[#F8F5E8] p-4",
              "data-testid": "link-select-quick",
              children: [
                h.jsx("span", {
                  className:
                    "h-12 w-12 rounded-2xl bg-[#F5C451] text-[#0B1C10] grid place-items-center",
                  children: h.jsx(ug, { className: "h-6 w-6" }),
                }),
                h.jsxs("span", {
                  className: "flex-1",
                  children: [
                    h.jsx("span", {
                      className: "block font-bold text-lg",
                      children: "Quick Match",
                    }),
                    h.jsx("span", {
                      className: "block text-sm opacity-70",
                      children:
                        "Teams, toss, overs. Ball one in under a minute.",
                    }),
                  ],
                }),
                h.jsx(Yc, { className: "h-5 w-5" }),
              ],
            }),
            [
              {
                t: "Full Match",
                d: "Player rosters, batting cards, bowling figures.",
              },
              { t: "Single Player", d: "Track your own innings across games." },
            ].map((p) =>
              h.jsxs(
                "div",
                {
                  "aria-disabled": !0,
                  className:
                    "flex items-center gap-4 rounded-3xl border-2 border-dashed border-[#0B1C10]/15 p-4 opacity-70",
                  "data-testid": `option-${p.t.toLowerCase().replace(" ", "-")}`,
                  children: [
                    h.jsx("span", {
                      className:
                        "h-12 w-12 rounded-2xl bg-[#0B1C10]/8 grid place-items-center",
                      children: h.jsx(SS, { className: "h-5 w-5" }),
                    }),
                    h.jsxs("span", {
                      className: "flex-1",
                      children: [
                        h.jsx("span", {
                          className: "block font-bold",
                          children: p.t,
                        }),
                        h.jsx("span", {
                          className: "block text-sm opacity-70",
                          children: p.d,
                        }),
                      ],
                    }),
                    h.jsx("span", {
                      className:
                        "rounded-full bg-[#0B1C10]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider",
                      children: "Later phase",
                    }),
                  ],
                },
                p.t,
              ),
            ),
          ],
        }),
      }),
    ],
  });
}
const Hc = [
    "#E52525",
    "#4CAF50",
    "#F5C451",
    "#2563a8",
    "#7a3fb0",
    "#e07a1f",
    "#102B17",
    "#d9468f",
  ],
  TC = [6, 8, 10, 15, 20, 25, 50],
  Vy = {
    Standard: {
      wideRuns: 1,
      noBallRuns: 1,
      wideLegal: !1,
      noBallLegal: !1,
      freeHit: !0,
      maxWickets: 10,
    },
    Gully: {
      wideRuns: 1,
      noBallRuns: 1,
      wideLegal: !0,
      noBallLegal: !1,
      freeHit: !1,
      maxWickets: 6,
    },
    Tape: {
      wideRuns: 1,
      noBallRuns: 1,
      wideLegal: !1,
      noBallLegal: !1,
      freeHit: !0,
      maxWickets: 8,
    },
  },
  wC = {
    Standard:
      "Wides and no-balls cost one and are re-bowled. Free hit after a no-ball.",
    Gully:
      "Wides count as a ball, no re-bowl. No free hits. Six wickets and done.",
    Tape: "Tape-ball tempo: extras re-bowled, free hits on, eight wickets.",
    Custom: "Set every dial yourself.",
  },
  _y = ["Teams", "Toss", "Format", "Ready"];
function EC() {
  const [, n] = Ii(),
    { saveMatch: s } = Mn(),
    [l, o] = z.useState(0),
    [c, d] = z.useState([
      { name: "", color: Hc[0] },
      { name: "", color: Hc[1] },
    ]),
    [f, p] = z.useState(""),
    [m, g] = z.useState(null),
    [x, v] = z.useState(null),
    [S, j] = z.useState(6),
    [A, C] = z.useState(""),
    [k, H] = z.useState("Gully"),
    [U, L] = z.useState({ ...yC, ...Vy.Gully, overs: 6, localRules: "" }),
    [K, P] = z.useState([]),
    [st, nt] = z.useState(null),
    [V, J] = z.useState(null),
    [Z, mt] = z.useState(null),
    [ht, Ut] = z.useState(null),
    vt = c.map((N, X) => N.name.trim() || `Team ${X === 0 ? "A" : "B"}`),
    pt = S === -1 ? Number(A) : S;
  function O(N, X) {
    d((et) => {
      const Ht = [...et];
      return ((Ht[N] = { ...Ht[N], ...X }), Ht);
    });
  }
  function Q(N) {
    (H("Custom"), L((X) => ({ ...X, ...N })));
  }
  function W(N) {
    (H(N), N !== "Custom" && L((X) => ({ ...X, ...Vy[N] })));
  }
  function ut(N, X) {
    if ((nt(null), !X)) return;
    if (!X.type.startsWith("image/")) return nt("Logo must be an image file.");
    if (X.size > 200 * 1024)
      return nt(`Logo is ${(X.size / 1024).toFixed(0)}KB. Max is 200KB.`);
    const et = new FileReader();
    ((et.onload = () => O(N, { logo: String(et.result) })),
      (et.onerror = () => nt("Could not read that file.")),
      et.readAsDataURL(X));
  }
  function T(N) {
    const X = [];
    return (
      N === 0 &&
        (vt[0].toLowerCase() === vt[1].toLowerCase() &&
          X.push("Teams need different names."),
        c.some((et) => et.name.length > 24) &&
          X.push("Team names max 24 characters.")),
      N === 1 &&
        (m === null && X.push("Choose who won the toss."),
        x === null && X.push("Choose who bats first.")),
      N === 2 &&
        ((!Number.isInteger(pt) || pt < 1 || pt > 100) &&
          X.push("Overs must be a whole number from 1 to 100."),
        (U.maxWickets < 1 || U.maxWickets > 10) &&
          X.push("Wickets must be 1 to 10."),
        U.localRules.length > 280 &&
          X.push("Local rules note max 280 characters.")),
      X
    );
  }
  function F() {
    const N = T(l);
    (P(N), N.length || o((X) => Math.min(3, X + 1)));
  }
  function tt(N, X) {
    (J({ call: X, caller: N }),
      mt(null),
      setTimeout(() => {
        const et = Math.random() < 0.5 ? "H" : "T";
        (mt(et), g(et === X ? N : 1 - N), v(null), J(null));
      }, 1100));
  }
  function I() {
    try {
      const N = rb({
        teams: [
          { ...c[0], name: vt[0] },
          { ...c[1], name: vt[1] },
        ],
        battingFirst: x,
        tossWinner: m,
        venue: f.trim(),
        rules: { ...U, overs: pt, localRules: U.localRules.trim() },
      });
      (s(N), n(`/match/${N.id}`));
    } catch (N) {
      Ut(N instanceof Error ? N.message : "Could not create the match.");
    }
  }
  return h.jsxs("div", {
    className: "max-w-xl mx-auto px-5 pt-6 pb-10",
    children: [
      h.jsxs("div", {
        className: "flex items-center gap-3",
        children: [
          h.jsx("button", {
            onClick: () => (l ? (P([]), o(l - 1)) : n("/")),
            className:
              "press h-10 w-10 rounded-full bg-[#0B1C10]/8 grid place-items-center",
            "aria-label": "Back",
            "data-testid": "button-setup-back",
            children: h.jsx(J2, { className: "h-5 w-5" }),
          }),
          h.jsxs("div", {
            className: "flex-1",
            children: [
              h.jsx("p", {
                className:
                  "text-xs font-bold uppercase tracking-[0.2em] text-[#4CAF50]",
                children: "Quick match",
              }),
              h.jsx("h1", {
                className: "text-2xl font-extrabold",
                children: _y[l],
              }),
            ],
          }),
          h.jsxs("span", {
            className: "text-sm font-bold opacity-50",
            children: [l + 1, "/4"],
          }),
        ],
      }),
      h.jsx("div", {
        className: "mt-4 grid grid-cols-4 gap-1.5",
        children: _y.map((N, X) =>
          h.jsx(
            "div",
            {
              className: "h-1.5 rounded-full bg-[#0B1C10]/10 overflow-hidden",
              children: h.jsx(Bt.div, {
                className: "h-full bg-[#4CAF50]",
                initial: !1,
                animate: { scaleX: X <= l ? 1 : 0 },
                style: { originX: 0 },
              }),
            },
            N,
          ),
        ),
      }),
      h.jsx(Ns, {
        mode: "wait",
        children: h.jsxs(
          Bt.div,
          {
            initial: { opacity: 0, x: 24 },
            animate: { opacity: 1, x: 0 },
            exit: { opacity: 0, x: -24 },
            transition: { duration: 0.2 },
            className: "mt-6 space-y-4",
            children: [
              l === 0 &&
                h.jsxs(h.Fragment, {
                  children: [
                    [0, 1].map((N) =>
                      h.jsxs(
                        "div",
                        {
                          className:
                            "rounded-3xl bg-[#FBF9F0] border border-[#0B1C10]/10 p-4 space-y-3",
                          children: [
                            h.jsxs("div", {
                              className: "flex items-center gap-3",
                              children: [
                                h.jsx(_a, {
                                  team: { ...c[N], name: vt[N] },
                                  size: 52,
                                }),
                                h.jsx("input", {
                                  value: c[N].name,
                                  onChange: (X) =>
                                    O(N, { name: X.target.value }),
                                  maxLength: 30,
                                  placeholder: `Team ${N === 0 ? "A" : "B"} name`,
                                  className:
                                    "flex-1 h-12 rounded-2xl bg-[#0B1C10]/5 px-4 font-semibold outline-none focus:ring-2 focus:ring-[#4CAF50]",
                                  "data-testid": `input-team-${N}`,
                                }),
                              ],
                            }),
                            h.jsxs("div", {
                              className: "flex items-center gap-2 flex-wrap",
                              children: [
                                Hc.map((X) =>
                                  h.jsx(
                                    "button",
                                    {
                                      onClick: () => O(N, { color: X }),
                                      className: Rt(
                                        "press h-8 w-8 rounded-full grid place-items-center",
                                        c[N].color === X &&
                                          "ring-2 ring-offset-2 ring-[#0B1C10]",
                                      ),
                                      style: { background: X },
                                      "aria-label": `Color ${X}`,
                                      "data-testid": `button-color-${N}-${X}`,
                                      children:
                                        c[N].color === X &&
                                        h.jsx(nS, {
                                          className: "h-4 w-4 text-[#F8F5E8]",
                                        }),
                                    },
                                    X,
                                  ),
                                ),
                                h.jsxs("label", {
                                  className:
                                    "press ml-auto flex items-center gap-1.5 rounded-full bg-[#0B1C10]/8 px-3 h-8 text-xs font-semibold cursor-pointer",
                                  "data-testid": `button-logo-${N}`,
                                  children: [
                                    h.jsx(bS, { className: "h-4 w-4" }),
                                    " Logo",
                                    h.jsx("input", {
                                      type: "file",
                                      accept: "image/*",
                                      className: "hidden",
                                      onChange: (X) => {
                                        (ut(N, X.target.files?.[0]),
                                          (X.target.value = ""));
                                      },
                                    }),
                                  ],
                                }),
                                c[N].logo &&
                                  h.jsx("button", {
                                    onClick: () => O(N, { logo: void 0 }),
                                    className:
                                      "press h-8 w-8 grid place-items-center rounded-full bg-[#E52525]/10 text-[#E52525]",
                                    "aria-label": "Remove logo",
                                    "data-testid": `button-remove-logo-${N}`,
                                    children: h.jsx(vf, {
                                      className: "h-4 w-4",
                                    }),
                                  }),
                              ],
                            }),
                          ],
                        },
                        N,
                      ),
                    ),
                    st &&
                      h.jsx("p", {
                        className: "text-sm font-semibold text-[#E52525]",
                        "data-testid": "text-logo-error",
                        children: st,
                      }),
                    h.jsx("input", {
                      value: f,
                      onChange: (N) => p(N.target.value),
                      maxLength: 40,
                      placeholder:
                        "Venue (optional) - e.g. Lane 4 behind the temple",
                      className:
                        "w-full h-12 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/10 px-4 outline-none focus:ring-2 focus:ring-[#4CAF50]",
                      "data-testid": "input-venue",
                    }),
                  ],
                }),
              l === 1 &&
                h.jsxs(h.Fragment, {
                  children: [
                    h.jsxs("div", {
                      className:
                        "rounded-3xl pitch-bg text-[#F8F5E8] p-5 text-center",
                      children: [
                        h.jsx("div", {
                          className: "mx-auto h-24 w-24",
                          style: { perspective: 600 },
                          children: h.jsx(Bt.div, {
                            animate: V
                              ? { rotateY: 1800, y: [0, -60, 0] }
                              : { rotateY: Z === "T" ? 180 : 0, y: 0 },
                            transition: {
                              duration: V ? 1.1 : 0.3,
                              ease: "easeOut",
                            },
                            className:
                              "h-24 w-24 rounded-full bg-[#F5C451] text-[#0B1C10] grid place-items-center text-3xl font-black shadow-[inset_0_-6px_0_rgba(0,0,0,.15)]",
                            style: { transformStyle: "preserve-3d" },
                            "data-testid": "img-coin",
                            children: Z ?? "H",
                          }),
                        }),
                        h.jsx("p", {
                          className: "mt-4 text-sm opacity-80",
                          children:
                            m !== null
                              ? `${vt[m]} won the toss`
                              : "Who calls? Tap a call to flip.",
                        }),
                        h.jsx("div", {
                          className: "mt-4 grid grid-cols-2 gap-2",
                          children: [0, 1].map((N) =>
                            h.jsxs(
                              "div",
                              {
                                className: "rounded-2xl bg-[#F8F5E8]/8 p-2",
                                children: [
                                  h.jsxs("p", {
                                    className:
                                      "text-xs font-bold truncate mb-2",
                                    children: [vt[N], " calls"],
                                  }),
                                  h.jsx("div", {
                                    className: "grid grid-cols-2 gap-1.5",
                                    children: ["H", "T"].map((X) =>
                                      h.jsx(
                                        "button",
                                        {
                                          disabled: !!V,
                                          onClick: () => tt(N, X),
                                          className:
                                            "press h-9 rounded-xl bg-[#F8F5E8] text-[#0B1C10] text-xs font-bold",
                                          "data-testid": `button-call-${N}-${X}`,
                                          children:
                                            X === "H" ? "Heads" : "Tails",
                                        },
                                        X,
                                      ),
                                    ),
                                  }),
                                ],
                              },
                              N,
                            ),
                          ),
                        }),
                      ],
                    }),
                    h.jsx("p", {
                      className:
                        "text-xs font-bold uppercase tracking-widest opacity-50",
                      children: "Or set it manually",
                    }),
                    h.jsxs("div", {
                      children: [
                        h.jsx("p", {
                          className: "text-sm font-semibold mb-2",
                          children: "Toss won by",
                        }),
                        h.jsx("div", {
                          className: "grid grid-cols-2 gap-2",
                          children: [0, 1].map((N) =>
                            h.jsx(
                              _i,
                              {
                                on: m === N,
                                onClick: () => g(N),
                                id: `toss-${N}`,
                                children: vt[N],
                              },
                              N,
                            ),
                          ),
                        }),
                      ],
                    }),
                    h.jsxs("div", {
                      children: [
                        h.jsx("p", {
                          className: "text-sm font-semibold mb-2",
                          children: "Batting first",
                        }),
                        h.jsx("div", {
                          className: "grid grid-cols-2 gap-2",
                          children: [0, 1].map((N) =>
                            h.jsx(
                              _i,
                              {
                                on: x === N,
                                onClick: () => v(N),
                                id: `bat-${N}`,
                                children: vt[N],
                              },
                              N,
                            ),
                          ),
                        }),
                      ],
                    }),
                  ],
                }),
              l === 2 &&
                h.jsxs(h.Fragment, {
                  children: [
                    h.jsxs("div", {
                      children: [
                        h.jsx("p", {
                          className: "text-sm font-semibold mb-2",
                          children: "Overs per side",
                        }),
                        h.jsxs("div", {
                          className: "grid grid-cols-4 gap-2",
                          children: [
                            TC.map((N) =>
                              h.jsx(
                                _i,
                                {
                                  on: S === N,
                                  onClick: () => j(N),
                                  id: `overs-${N}`,
                                  children: N,
                                },
                                N,
                              ),
                            ),
                            h.jsx(_i, {
                              on: S === -1,
                              onClick: () => j(-1),
                              id: "overs-custom",
                              children: "Custom",
                            }),
                          ],
                        }),
                        S === -1 &&
                          h.jsx("input", {
                            inputMode: "numeric",
                            value: A,
                            onChange: (N) =>
                              C(N.target.value.replace(/[^0-9]/g, "")),
                            placeholder: "1 - 100",
                            className:
                              "mt-2 w-full h-12 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/10 px-4 font-bold outline-none focus:ring-2 focus:ring-[#4CAF50]",
                            "data-testid": "input-custom-overs",
                          }),
                      ],
                    }),
                    h.jsxs("div", {
                      children: [
                        h.jsx("p", {
                          className: "text-sm font-semibold mb-2",
                          children: "House rules",
                        }),
                        h.jsx("div", {
                          className: "grid grid-cols-4 gap-2",
                          children: ["Standard", "Gully", "Tape", "Custom"].map(
                            (N) =>
                              h.jsx(
                                _i,
                                {
                                  on: k === N,
                                  onClick: () => W(N),
                                  id: `preset-${N}`,
                                  children: N,
                                },
                                N,
                              ),
                          ),
                        }),
                        h.jsx("p", {
                          className: "mt-2 text-xs opacity-60",
                          children: wC[k],
                        }),
                      ],
                    }),
                    h.jsxs("div", {
                      className: "space-y-2",
                      children: [
                        h.jsx(Vo, {
                          label: "Wickets",
                          value: U.maxWickets,
                          min: 1,
                          max: 10,
                          onChange: (N) => Q({ maxWickets: N }),
                        }),
                        h.jsx(Vo, {
                          label: "Wide runs",
                          value: U.wideRuns,
                          min: 0,
                          max: 5,
                          onChange: (N) => Q({ wideRuns: N }),
                        }),
                        h.jsx(Vo, {
                          label: "No-ball runs",
                          value: U.noBallRuns,
                          min: 0,
                          max: 5,
                          onChange: (N) => Q({ noBallRuns: N }),
                        }),
                        h.jsx(Zi, {
                          id: "reball-wide",
                          label: "Re-bowl wides",
                          hint: "Off means a wide counts as a ball",
                          checked: !U.wideLegal,
                          onChange: (N) => Q({ wideLegal: !N }),
                        }),
                        h.jsx(Zi, {
                          id: "reball-nb",
                          label: "Re-bowl no-balls",
                          checked: !U.noBallLegal,
                          onChange: (N) => Q({ noBallLegal: !N }),
                        }),
                        h.jsx(Zi, {
                          id: "free-hit",
                          label: "Free hit after no-ball",
                          hint: "Only run out on a free hit",
                          checked: U.freeHit,
                          onChange: (N) => Q({ freeHit: N }),
                        }),
                      ],
                    }),
                    h.jsx("textarea", {
                      value: U.localRules,
                      onChange: (N) =>
                        L((X) => ({ ...X, localRules: N.target.value })),
                      rows: 3,
                      placeholder:
                        "Local rules - e.g. one-tip-one-hand, wall is four, over the gate is out",
                      className:
                        "w-full rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/10 p-4 text-sm outline-none focus:ring-2 focus:ring-[#4CAF50]",
                      "data-testid": "input-local-rules",
                    }),
                  ],
                }),
              l === 3 &&
                m !== null &&
                x !== null &&
                h.jsxs("div", {
                  className: "rounded-[2rem] pitch-bg mow text-[#F8F5E8] p-6",
                  children: [
                    h.jsx("div", {
                      className: "flex items-center justify-between gap-3",
                      children: [0, 1]
                        .map((N) =>
                          h.jsxs(
                            "div",
                            {
                              className:
                                "flex-1 flex flex-col items-center text-center gap-2",
                              children: [
                                h.jsx(_a, {
                                  team: { ...c[N], name: vt[N] },
                                  size: 64,
                                }),
                                h.jsx("p", {
                                  className: "font-bold leading-tight",
                                  children: vt[N],
                                }),
                                x === N &&
                                  h.jsx("span", {
                                    className:
                                      "rounded-full bg-[#F5C451] text-[#0B1C10] text-[10px] font-bold px-2 py-0.5 uppercase",
                                    children: "Bats first",
                                  }),
                              ],
                            },
                            N,
                          ),
                        )
                        .flatMap((N, X) =>
                          X
                            ? [
                                h.jsx(
                                  "span",
                                  {
                                    className:
                                      "text-2xl font-black text-[#F5C451]",
                                    children: "vs",
                                  },
                                  "vs",
                                ),
                                N,
                              ]
                            : [N],
                        ),
                    }),
                    h.jsxs("dl", {
                      className: "mt-6 grid grid-cols-2 gap-3 text-sm",
                      children: [
                        h.jsx(Es, { k: "Overs", v: String(pt) }),
                        h.jsx(Es, { k: "Wickets", v: String(U.maxWickets) }),
                        h.jsx(Es, { k: "Rules", v: k }),
                        h.jsx(Es, { k: "Toss", v: vt[m] }),
                        h.jsx(Es, {
                          k: "Wide / NB",
                          v: `+${U.wideRuns} / +${U.noBallRuns}`,
                        }),
                        h.jsx(Es, {
                          k: "Free hit",
                          v: U.freeHit ? "On" : "Off",
                        }),
                      ],
                    }),
                    f.trim() &&
                      h.jsxs("p", {
                        className: "mt-4 text-sm opacity-80",
                        children: ["At ", f.trim()],
                      }),
                    U.localRules.trim() &&
                      h.jsxs("p", {
                        className: "mt-2 text-sm italic opacity-80",
                        children: ['"', U.localRules.trim(), '"'],
                      }),
                  ],
                }),
            ],
          },
          l,
        ),
      }),
      (K.length > 0 || ht) &&
        h.jsx("div", {
          className:
            "mt-4 rounded-2xl bg-[#E52525]/10 text-[#b51b1b] p-3 text-sm font-semibold space-y-1",
          role: "alert",
          "data-testid": "text-setup-errors",
          children: [...K, ...(ht ? [ht] : [])].map((N) =>
            h.jsxs(
              "p",
              {
                className: "flex items-center gap-2",
                children: [h.jsx(bf, { className: "h-4 w-4 shrink-0" }), N],
              },
              N,
            ),
          ),
        }),
      h.jsxs("button", {
        onClick: l === 3 ? I : F,
        className:
          "press mt-6 w-full h-14 rounded-full bg-[#E52525] text-[#F8F5E8] font-extrabold text-lg flex items-center justify-center gap-2 shadow-[0_10px_24px_-10px_#E52525]",
        "data-testid": "button-setup-next",
        children: [
          l === 3 ? "Play ball" : "Next",
          " ",
          h.jsx(Yc, { className: "h-5 w-5" }),
        ],
      }),
    ],
  });
}
function _i({ on: n, onClick: s, children: l, id: o }) {
  return h.jsx("button", {
    onClick: s,
    className: Rt(
      "press h-12 rounded-2xl px-2 text-sm font-bold truncate transition-colors",
      n
        ? "bg-[#102B17] text-[#F8F5E8]"
        : "bg-[#FBF9F0] border border-[#0B1C10]/10",
    ),
    "data-testid": `button-${o}`,
    children: l,
  });
}
function Es({ k: n, v: s }) {
  return h.jsxs("div", {
    className: "rounded-2xl bg-[#F8F5E8]/8 p-3",
    children: [
      h.jsx("dt", {
        className: "text-[10px] uppercase tracking-widest opacity-60",
        children: n,
      }),
      h.jsx("dd", { className: "font-bold truncate", children: s }),
    ],
  });
}
let Pe = null;
function Ze(n, s, l, o = "sine", c = 0.15) {
  if (!Pe) return;
  const d = Pe.createOscillator(),
    f = Pe.createGain();
  ((d.type = o),
    d.frequency.setValueAtTime(n, Pe.currentTime + s),
    f.gain.setValueAtTime(c, Pe.currentTime + s),
    f.gain.exponentialRampToValueAtTime(1e-4, Pe.currentTime + s + l),
    d.connect(f).connect(Pe.destination),
    d.start(Pe.currentTime + s),
    d.stop(Pe.currentTime + s + l));
}
function ub(n) {
  try {
    const s = window.AudioContext || window.webkitAudioContext;
    if (!s) return;
    ((Pe = Pe ?? new s()),
      n === "tap" && Ze(520, 0, 0.06, "triangle", 0.08),
      n === "four" && (Ze(660, 0, 0.12), Ze(880, 0.1, 0.18)),
      n === "six" &&
        (Ze(523, 0, 0.1),
        Ze(659, 0.09, 0.1),
        Ze(784, 0.18, 0.1),
        Ze(1046, 0.27, 0.25)),
      n === "wicket" &&
        (Ze(220, 0, 0.12, "square", 0.08), Ze(150, 0.1, 0.3, "square", 0.08)),
      n === "end" && (Ze(392, 0, 0.15), Ze(523, 0.15, 0.3)));
  } catch {}
}
function AC(n) {
  try {
    navigator.vibrate?.(n);
  } catch {}
}
function Jf(n) {
  const s = new Map();
  return (
    n.forEach((l) => {
      const o = s.get(l.over) ?? [];
      (o.push(l), s.set(l.over, o));
    }),
    Array.from(s.entries()).sort((l, o) => l[0] - o[0])
  );
}
function Wf(n, s) {
  return s ? ((n / s) * 6).toFixed(2) : "0.00";
}
function CC(n, s) {
  return `${n.config.teams[s.teamIndex].name}  ${s.runs}/${s.wickets} (${ks(s.balls)} ov)`;
}
function jC(n) {
  const s = oa(n),
    [l, o] = n.config.teams,
    c = [];
  return (
    c.push("GULLY CRIX SCORECARD"),
    c.push(`${l.name} vs ${o.name}`),
    n.config.venue && c.push(`Venue: ${n.config.venue}`),
    c.push(`Date: ${new Date(n.createdAt).toLocaleString()}`),
    c.push(
      `Format: ${n.config.rules.overs} overs, ${n.config.rules.maxWickets} wickets`,
    ),
    c.push(
      `Toss: ${n.config.teams[n.config.tossWinner].name}, batting first: ${n.config.teams[n.config.battingFirst].name}`,
    ),
    n.config.rules.localRules &&
      c.push(`Local rules: ${n.config.rules.localRules}`),
    c.push(""),
    s.innings.forEach((d, f) => {
      (c.push(`INNINGS ${f + 1}: ${CC(n, d)}`),
        c.push(
          `Run rate ${Wf(d.runs, d.balls)} | Extras ${d.extras} | 4s ${d.fours} | 6s ${d.sixes}`,
        ),
        Jf(d.deliveries).forEach(([p, m]) => {
          const g = m.reduce((x, v) => x + v.total, 0);
          c.push(`  Over ${p + 1}: ${m.map((x) => x.label).join(" ")}  (${g})`);
        }),
        c.push(""));
    }),
    c.push(`RESULT: ${s.result || s.status}`),
    c.join(`
`)
  );
}
const Ly = { wide: "Wide", noball: "No ball", bye: "Byes", legbye: "Leg byes" };
function MC() {
  const { id: n } = Sf(),
    { getMatch: s, saveMatch: l, settings: o } = Mn(),
    [, c] = Ii(),
    d = s(n),
    [f, p] = z.useState(null),
    [m, g] = z.useState(null),
    [x, v] = z.useState(0),
    [S, j] = z.useState(!1),
    [A, C] = z.useState(5),
    [k, H] = z.useState(!1),
    [U, L] = z.useState(null),
    [K, P] = z.useState(!1),
    st = z.useRef(void 0),
    nt = d ? Uy(d) : null;
  if (
    (z.useEffect(() => {
      if (nt && (nt.status === "complete" || nt.status === "abandoned")) {
        const $ = setTimeout(() => c(`/result/${n}`), 1400);
        return () => clearTimeout($);
      }
    }, [nt?.status, n, c]),
    !d || !nt)
  )
    return h.jsx("div", {
      className:
        "min-h-[100dvh] pitch-bg grid place-items-center text-[#F8F5E8] p-6 text-center",
      children: h.jsxs("div", {
        children: [
          h.jsx(Va, { broken: !0, className: "h-24 mx-auto" }),
          h.jsx("h1", {
            className: "mt-6 text-2xl font-extrabold",
            children: d ? "This match record is damaged" : "Match not found",
          }),
          h.jsx("p", {
            className: "mt-2 opacity-70",
            children: "It may have been deleted from this device.",
          }),
          h.jsx(ue, {
            href: "/matches",
            className:
              "press inline-block mt-6 rounded-full bg-[#F5C451] text-[#0B1C10] px-6 py-3 font-bold",
            "data-testid": "link-back-matches",
            children: "Back to matches",
          }),
        ],
      }),
    });
  const V = d,
    J = nt,
    Z = J.current,
    mt = V.config.teams,
    ht = mt[Z.teamIndex],
    Ut = mt[1 - Z.teamIndex],
    vt = V.config.rules.overs * 6,
    pt = Math.max(0, vt - Z.balls),
    O = J.target !== null ? J.target - Z.runs : null,
    Q = J.status === "playing";
  function W($, gt) {
    (clearTimeout(st.current),
      p({ id: Date.now(), text: $, tone: gt }),
      (st.current = setTimeout(() => p(null), 1500)));
  }
  function ut($) {
    try {
      const gt = zy(V, $);
      if ((l(gt), $.type === "delivery")) {
        const Je = Uy(gt);
        ($.kind === "wicket"
          ? (W($.dismissal === "runout" ? "RUN OUT" : "OUT!", "wicket"),
            T("wicket", [60, 40, 120]))
          : $.kind === "runs" && $.runs === 6
            ? (W("SIX!", "six"), T("six", [30, 30, 30]))
            : $.kind === "runs" && $.runs === 4
              ? (W("FOUR!", "four"), T("four", 40))
              : $.kind === "noball" && V.config.rules.freeHit
                ? (W("FREE HIT next ball", "info"), T("tap", 15))
                : T("tap", 10),
          Je &&
            Je.status !== J.status &&
            Je.status === "complete" &&
            T("end", 0));
      }
    } catch (gt) {
      W(
        gt instanceof Error
          ? gt.message
          : "That action is not allowed right now.",
        "error",
      );
    }
  }
  function T($, gt) {
    (o.sound && ub($), gt && AC(gt));
  }
  function F() {
    try {
      (l(bC(V)), T("tap", 8));
    } catch ($) {
      W($ instanceof Error ? $.message : "Nothing to undo", "error");
    }
  }
  function tt() {
    try {
      (l(vC(V)), T("tap", 8));
    } catch ($) {
      W($ instanceof Error ? $.message : "Nothing to redo", "error");
    }
  }
  function I() {
    try {
      l(zy(V, { type: "endInnings" }));
    } catch {}
    P(!0);
  }
  const N = Jf(Z.deliveries).pop(),
    et =
      Z.balls > 0 &&
      Z.balls % 6 === 0 &&
      !!Z.deliveries.length &&
      Z.deliveries[Z.deliveries.length - 1].legal
        ? []
        : (N?.[1] ?? []),
    Ht = et.filter(($) => $.legal).length;
  return h.jsxs("div", {
    className:
      "min-h-[100dvh] flex flex-col bg-[#F8F5E8] md:max-w-xl md:mx-auto",
    children: [
      h.jsxs("section", {
        className:
          "pitch-bg mow text-[#F8F5E8] rounded-b-[2.25rem] px-5 pt-4 pb-6 relative overflow-hidden",
        children: [
          h.jsxs("div", {
            className: "flex items-center justify-between",
            children: [
              h.jsx(ue, {
                href: "/",
                className:
                  "press h-10 w-10 grid place-items-center rounded-full bg-[#F8F5E8]/10",
                "aria-label": "Home",
                "data-testid": "link-match-home",
                children: h.jsx(i0, { className: "h-5 w-5" }),
              }),
              h.jsxs("p", {
                className:
                  "text-xs font-bold uppercase tracking-[0.2em] opacity-70",
                "data-testid": "text-innings-label",
                children: [
                  J.inningsIndex === 0 ? "1st innings" : "2nd innings",
                  " · ",
                  V.config.rules.overs,
                  " ov",
                ],
              }),
              h.jsxs("div", {
                className: "flex gap-1.5",
                children: [
                  h.jsx("button", {
                    onClick: F,
                    disabled: V.cursor <= 0,
                    className:
                      "press h-10 w-10 grid place-items-center rounded-full bg-[#F8F5E8]/10 disabled:opacity-30",
                    "aria-label": "Undo",
                    "data-testid": "button-undo",
                    children: h.jsx(GS, { className: "h-4 w-4" }),
                  }),
                  h.jsx("button", {
                    onClick: tt,
                    disabled: V.cursor >= V.events.length,
                    className:
                      "press h-10 w-10 grid place-items-center rounded-full bg-[#F8F5E8]/10 disabled:opacity-30",
                    "aria-label": "Redo",
                    "data-testid": "button-redo",
                    children: h.jsx(MS, { className: "h-4 w-4" }),
                  }),
                ],
              }),
            ],
          }),
          h.jsxs("div", {
            className: "mt-5 flex items-center gap-3",
            children: [
              h.jsx(_a, { team: ht, size: 44 }),
              h.jsxs("div", {
                className: "min-w-0 flex-1",
                children: [
                  h.jsx("p", {
                    className: "font-bold truncate",
                    "data-testid": "text-batting-team",
                    children: ht.name,
                  }),
                  h.jsxs("p", {
                    className: "text-xs opacity-60 truncate",
                    children: [
                      "bowling: ",
                      Ut.name,
                      V.config.venue ? ` · ${V.config.venue}` : "",
                    ],
                  }),
                ],
              }),
              Z.freeHit &&
                Q &&
                h.jsx("span", {
                  className:
                    "rounded-full bg-[#F5C451] text-[#0B1C10] px-3 py-1 text-xs font-black uppercase animate-pulse",
                  "data-testid": "status-free-hit",
                  children: "Free hit",
                }),
            ],
          }),
          h.jsxs("div", {
            className: "mt-3 flex items-end gap-3",
            children: [
              h.jsxs(
                Bt.p,
                {
                  initial: { y: 10, opacity: 0.4 },
                  animate: { y: 0, opacity: 1 },
                  className:
                    "text-7xl font-black tracking-tighter leading-none",
                  "data-testid": "text-score",
                  children: [
                    Z.runs,
                    h.jsx("span", {
                      className: "text-[#F8F5E8]/40",
                      children: "/",
                    }),
                    Z.wickets,
                  ],
                },
                `${Z.runs}-${Z.wickets}`,
              ),
              h.jsxs("p", {
                className: "pb-2 text-lg font-bold text-[#F5C451]",
                "data-testid": "text-overs",
                children: [
                  ks(Z.balls),
                  h.jsxs("span", {
                    className: "text-sm opacity-60 text-[#F8F5E8]",
                    children: [" / ", V.config.rules.overs],
                  }),
                ],
              }),
            ],
          }),
          h.jsxs("div", {
            className: "mt-4 grid grid-cols-3 gap-2 text-center",
            children: [
              h.jsx(Li, { k: "Run rate", v: Wf(Z.runs, Z.balls), id: "crr" }),
              J.target !== null
                ? h.jsxs(h.Fragment, {
                    children: [
                      h.jsx(Li, {
                        k: "Target",
                        v: String(J.target),
                        id: "target",
                      }),
                      h.jsx(Li, {
                        k: "Req. rate",
                        v: pt
                          ? ((Math.max(0, O ?? 0) / pt) * 6).toFixed(2)
                          : "-",
                        id: "rrr",
                      }),
                    ],
                  })
                : h.jsxs(h.Fragment, {
                    children: [
                      h.jsx(Li, {
                        k: "Projected",
                        v: Z.balls
                          ? String(Math.round((Z.runs / Z.balls) * vt))
                          : "-",
                        id: "projected",
                      }),
                      h.jsx(Li, {
                        k: "Extras",
                        v: String(Z.extras),
                        id: "extras",
                      }),
                    ],
                  }),
            ],
          }),
          J.target !== null &&
            O !== null &&
            Q &&
            h.jsxs("p", {
              className: "mt-3 text-sm font-semibold text-center",
              "data-testid": "text-equation",
              children: [
                "Need ",
                h.jsx("span", {
                  className: "text-[#F5C451]",
                  children: Math.max(0, O),
                }),
                " off ",
                h.jsx("span", { className: "text-[#F5C451]", children: pt }),
                " balls",
              ],
            }),
          h.jsxs("div", {
            className: "mt-4 flex items-center gap-1.5",
            "data-testid": "row-over-balls",
            children: [
              h.jsx("span", {
                className:
                  "text-[10px] font-bold uppercase tracking-widest opacity-60 mr-1",
                children: "This over",
              }),
              h.jsx(Ns, {
                initial: !1,
                children: et.map(($, gt) =>
                  h.jsx(
                    Bt.span,
                    {
                      initial: { scale: 0 },
                      animate: { scale: 1 },
                      transition: {
                        type: "spring",
                        stiffness: 500,
                        damping: 20,
                      },
                      className: Rt(
                        "min-w-8 h-8 px-1.5 rounded-full grid place-items-center text-[11px] font-extrabold",
                        NC($.kind, $.runs),
                      ),
                      children: $.label,
                    },
                    `${$.over}-${gt}`,
                  ),
                ),
              }),
              Array.from({ length: Math.max(0, 6 - Ht) }).map(($, gt) =>
                h.jsx(
                  "span",
                  {
                    className:
                      "h-8 w-8 rounded-full border-2 border-dashed border-[#F8F5E8]/20",
                  },
                  `e${gt}`,
                ),
              ),
            ],
          }),
        ],
      }),
      h.jsx("div", {
        className: "flex-1 px-5 pt-5 pb-6 flex flex-col",
        children: Q
          ? h.jsxs(h.Fragment, {
              children: [
                h.jsxs("div", {
                  className:
                    "grid grid-cols-4 gap-3 sm:gap-4 max-w-sm mx-auto w-full",
                  children: [
                    [0, 1, 2, 3, 4, 6].map(($) =>
                      h.jsx(
                        Bt.button,
                        {
                          whileTap: { scale: 0.85 },
                          onClick: () =>
                            ut({ type: "delivery", kind: "runs", runs: $ }),
                          className: Rt(
                            "aspect-square rounded-full text-3xl font-black grid place-items-center shadow-[0_6px_0_rgba(11,28,16,.18)] active:shadow-none active:translate-y-1 transition-[box-shadow,transform]",
                            $ === 4
                              ? "bg-[#4CAF50] text-[#0B1C10]"
                              : $ === 6
                                ? "bg-[#F5C451] text-[#0B1C10]"
                                : $ === 0
                                  ? "bg-[#FBF9F0] border-2 border-[#0B1C10]/10 text-[#0B1C10]/60"
                                  : "bg-[#102B17] text-[#F8F5E8]",
                          ),
                          "data-testid": `button-runs-${$}`,
                          children:
                            $ === 0
                              ? h.jsx("span", {
                                  className: "text-xl",
                                  children: "DOT",
                                })
                              : $,
                        },
                        $,
                      ),
                    ),
                    h.jsx(Bt.button, {
                      whileTap: { scale: 0.85 },
                      onClick: () => {
                        (C(5), j(!0));
                      },
                      className:
                        "aspect-square rounded-full bg-[#FBF9F0] border-2 border-[#0B1C10]/10 grid place-items-center shadow-[0_6px_0_rgba(11,28,16,.12)]",
                      "aria-label": "More runs",
                      "data-testid": "button-runs-more",
                      children: h.jsx(fS, { className: "h-7 w-7" }),
                    }),
                    h.jsx(Bt.button, {
                      whileTap: { scale: 0.85 },
                      onClick: () => H(!0),
                      className:
                        "aspect-square rounded-full bg-[#E52525] text-[#F8F5E8] text-sm font-black grid place-items-center shadow-[0_6px_0_#8f1414]",
                      "data-testid": "button-wicket",
                      children: "OUT",
                    }),
                  ],
                }),
                h.jsx("div", {
                  className:
                    "mt-5 grid grid-cols-4 gap-2 max-w-sm mx-auto w-full",
                  children: ["wide", "noball", "legbye", "bye"].map(($) =>
                    h.jsx(
                      "button",
                      {
                        onClick: () => {
                          (g($), v($ === "bye" || $ === "legbye" ? 1 : 0));
                        },
                        className:
                          "press h-12 rounded-2xl bg-[#0B1C10]/6 border border-[#0B1C10]/10 font-extrabold text-sm",
                        "data-testid": `button-extra-${$}`,
                        children:
                          $ === "wide"
                            ? "WD"
                            : $ === "noball"
                              ? "NB"
                              : $ === "legbye"
                                ? "LB"
                                : "BYE",
                      },
                      $,
                    ),
                  ),
                }),
                h.jsxs("div", {
                  className:
                    "mt-auto pt-6 grid grid-cols-3 gap-2 max-w-sm mx-auto w-full",
                  children: [
                    h.jsx(Gc, {
                      icon: P2,
                      label: "Swap ends",
                      onClick: () => ut({ type: "swap" }),
                      id: "swap",
                    }),
                    h.jsx(Gc, {
                      icon: hS,
                      label: "End innings",
                      onClick: () => L("innings"),
                      id: "end-innings",
                    }),
                    h.jsx(Gc, {
                      icon: lS,
                      label: "Abandon",
                      onClick: () => L("abandon"),
                      id: "abandon",
                      danger: !0,
                    }),
                  ],
                }),
                h.jsxs("p", {
                  className: "mt-3 text-center text-xs opacity-50",
                  "data-testid": "text-striker",
                  children: [
                    "Striker at ",
                    Z.striker === 0 ? "end A" : "end B",
                    " · 4s ",
                    Z.fours,
                    " · 6s ",
                    Z.sixes,
                  ],
                }),
              ],
            })
          : J.status === "inningsBreak" && !K
            ? h.jsxs(Bt.div, {
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 },
                className:
                  "rounded-[2rem] bg-[#F5C451] p-6 text-center my-auto",
                "data-testid": "panel-innings-break",
                children: [
                  h.jsx("p", {
                    className: "text-xs font-bold uppercase tracking-[0.2em]",
                    children: "Innings break",
                  }),
                  h.jsxs("p", {
                    className: "mt-2 text-2xl font-extrabold",
                    children: [
                      mt[J.innings[0].teamIndex].name,
                      " posted ",
                      J.innings[0].runs,
                      "/",
                      J.innings[0].wickets,
                    ],
                  }),
                  h.jsxs("p", {
                    className: "mt-1 opacity-70",
                    children: [
                      mt[1 - J.innings[0].teamIndex].name,
                      " need ",
                      J.innings[0].runs + 1,
                      " to win from ",
                      V.config.rules.overs,
                      " overs.",
                    ],
                  }),
                  h.jsx("button", {
                    onClick: I,
                    className:
                      "press mt-5 h-14 w-full rounded-full bg-[#0B1C10] text-[#F8F5E8] font-extrabold",
                    "data-testid": "button-start-chase",
                    children: "Start the chase",
                  }),
                  h.jsx("button", {
                    onClick: F,
                    className:
                      "press mt-2 text-sm font-semibold underline underline-offset-4",
                    "data-testid": "button-undo-break",
                    children: "Undo last action",
                  }),
                ],
              })
            : J.status === "inningsBreak"
              ? h.jsxs("div", {
                  className: "my-auto text-center",
                  "data-testid": "panel-waiting",
                  children: [
                    h.jsx("p", {
                      className: "font-bold",
                      children: "Waiting to start the second innings.",
                    }),
                    h.jsx("button", {
                      onClick: I,
                      className:
                        "press mt-4 h-12 px-6 rounded-full bg-[#102B17] text-[#F8F5E8] font-bold",
                      "data-testid": "button-retry-chase",
                      children: "Start chase",
                    }),
                  ],
                })
              : h.jsxs("div", {
                  className: "my-auto text-center",
                  "data-testid": "panel-finished",
                  children: [
                    h.jsx(Va, {
                      broken: !0,
                      className: "h-24 mx-auto [&_rect]:fill-[#102B17]",
                    }),
                    h.jsx("p", {
                      className: "mt-4 text-2xl font-extrabold",
                      children: J.result || "Match over",
                    }),
                    h.jsx(ue, {
                      href: `/result/${V.id}`,
                      className:
                        "press inline-block mt-4 rounded-full bg-[#E52525] text-[#F8F5E8] px-6 py-3 font-bold",
                      "data-testid": "link-view-result",
                      children: "See the result",
                    }),
                    h.jsx("button", {
                      onClick: F,
                      className:
                        "press block mx-auto mt-3 text-sm font-semibold underline underline-offset-4",
                      "data-testid": "button-undo-finish",
                      children: "Undo last action",
                    }),
                  ],
                }),
      }),
      h.jsx(Ns, {
        children:
          f &&
          o.animations &&
          f.tone !== "error" &&
          f.tone !== "info" &&
          h.jsx(
            Bt.div,
            {
              className:
                "pointer-events-none fixed inset-0 z-40 grid place-items-center",
              initial: { opacity: 0 },
              animate: { opacity: 1 },
              exit: { opacity: 0 },
              children: h.jsx(Bt.p, {
                initial: { scale: 0.3, rotate: -12 },
                animate: { scale: 1, rotate: -6 },
                exit: { scale: 1.4, opacity: 0 },
                transition: { type: "spring", stiffness: 300, damping: 14 },
                className: Rt(
                  "text-7xl font-black tracking-tighter drop-shadow-[0_6px_0_rgba(11,28,16,.35)]",
                  f.tone === "six"
                    ? "text-[#F5C451]"
                    : f.tone === "four"
                      ? "text-[#4CAF50]"
                      : "text-[#E52525]",
                ),
                children: f.text,
              }),
            },
            f.id,
          ),
      }),
      h.jsx(Ns, {
        children:
          f &&
          h.jsxs(
            Bt.div,
            {
              initial: { y: -40, opacity: 0 },
              animate: { y: 0, opacity: 1 },
              exit: { y: -40, opacity: 0 },
              role: "status",
              className: Rt(
                "pointer-events-none fixed top-3 inset-x-0 mx-auto w-fit max-w-[90vw] z-50 rounded-full px-4 py-2 text-sm font-bold shadow-lg flex items-center gap-2",
                f.tone === "error"
                  ? "bg-[#E52525] text-[#F8F5E8]"
                  : "bg-[#0B1C10] text-[#F8F5E8]",
              ),
              "data-testid": "toast-flash",
              children: [
                f.tone === "error" && h.jsx(bf, { className: "h-4 w-4" }),
                f.text,
              ],
            },
            `t${f.id}`,
          ),
      }),
      h.jsx(Ki, {
        open: !!m,
        onClose: () => g(null),
        title: m ? Ly[m] : "",
        children:
          m &&
          h.jsxs("div", {
            className: "space-y-4",
            children: [
              h.jsxs("p", {
                className: "text-sm opacity-70",
                children: [
                  m === "wide" &&
                    `Penalty +${V.config.rules.wideRuns}. Add any runs taken on top.`,
                  m === "noball" &&
                    `Penalty +${V.config.rules.noBallRuns}. Add runs scored off the bat.`,
                  (m === "bye" || m === "legbye") &&
                    "Runs taken without bat contact.",
                ],
              }),
              h.jsx("div", {
                className: "grid grid-cols-7 gap-1.5",
                children: [0, 1, 2, 3, 4, 5, 6].map(($) =>
                  h.jsx(
                    "button",
                    {
                      disabled: (m === "bye" || m === "legbye") && $ === 0,
                      onClick: () => v($),
                      className: Rt(
                        "press aspect-square rounded-full font-extrabold disabled:opacity-25",
                        x === $
                          ? "bg-[#102B17] text-[#F8F5E8]"
                          : "bg-[#0B1C10]/6",
                      ),
                      "data-testid": `button-extra-runs-${$}`,
                      children: $,
                    },
                    $,
                  ),
                ),
              }),
              h.jsxs("p", {
                className: "text-center text-sm",
                children: [
                  "Total to score: ",
                  h.jsx("b", {
                    "data-testid": "text-extra-total",
                    children:
                      x +
                      (m === "wide"
                        ? V.config.rules.wideRuns
                        : m === "noball"
                          ? V.config.rules.noBallRuns
                          : 0),
                  }),
                ],
              }),
              h.jsxs("button", {
                onClick: () => {
                  (ut({ type: "delivery", kind: m, runs: x }), g(null));
                },
                className:
                  "press h-14 w-full rounded-full bg-[#E52525] text-[#F8F5E8] font-extrabold",
                "data-testid": "button-extra-confirm",
                children: ["Add ", Ly[m].toLowerCase()],
              }),
            ],
          }),
      }),
      h.jsx(Ki, {
        open: S,
        onClose: () => j(!1),
        title: "More runs",
        children: h.jsxs("div", {
          className: "space-y-4",
          children: [
            h.jsx(Vo, {
              label: "Runs",
              value: A,
              min: 5,
              max: 12,
              onChange: C,
            }),
            h.jsxs("button", {
              onClick: () => {
                (ut({ type: "delivery", kind: "runs", runs: A }), j(!1));
              },
              className:
                "press h-14 w-full rounded-full bg-[#102B17] text-[#F8F5E8] font-extrabold",
              "data-testid": "button-more-confirm",
              children: ["Add ", A, " runs"],
            }),
          ],
        }),
      }),
      h.jsxs(Ki, {
        open: k,
        onClose: () => H(!1),
        title: Z.freeHit ? "Wicket on a free hit" : "Wicket",
        children: [
          Z.freeHit &&
            h.jsx("p", {
              className: "mb-3 text-sm font-semibold text-[#E52525]",
              children: "Free hit: only a run out counts.",
            }),
          h.jsxs("div", {
            className: "grid grid-cols-2 gap-3",
            children: [
              h.jsxs("button", {
                disabled: Z.freeHit,
                onClick: () => {
                  (ut({
                    type: "delivery",
                    kind: "wicket",
                    runs: 0,
                    dismissal: "normal",
                  }),
                    H(!1));
                },
                className:
                  "press h-24 rounded-3xl bg-[#E52525] text-[#F8F5E8] font-extrabold disabled:opacity-30",
                "data-testid": "button-wicket-normal",
                children: [
                  "Out",
                  h.jsx("span", {
                    className: "block text-xs font-medium opacity-80",
                    children: "bowled, caught, one-tip",
                  }),
                ],
              }),
              h.jsxs("button", {
                onClick: () => {
                  (ut({
                    type: "delivery",
                    kind: "wicket",
                    runs: 0,
                    dismissal: "runout",
                  }),
                    H(!1));
                },
                className:
                  "press h-24 rounded-3xl bg-[#102B17] text-[#F8F5E8] font-extrabold",
                "data-testid": "button-wicket-runout",
                children: [
                  "Run out",
                  h.jsx("span", {
                    className: "block text-xs font-medium opacity-80",
                    children: "short of the crease",
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
      h.jsx(Qo, {
        open: U === "innings",
        onClose: () => L(null),
        title: "End this innings?",
        body: `${ht.name} finish on ${Z.runs}/${Z.wickets}. You can undo this.`,
        confirmLabel: "End innings",
        onConfirm: () => ut({ type: "endInnings" }),
      }),
      h.jsx(Qo, {
        open: U === "abandon",
        onClose: () => L(null),
        title: "Abandon the match?",
        body: "Rain, a broken window, or Mom calling. The match will be saved as abandoned. You can still undo.",
        confirmLabel: "Abandon",
        danger: !0,
        onConfirm: () => ut({ type: "abandon" }),
      }),
    ],
  });
}
function Uy(n) {
  try {
    return oa(n);
  } catch {
    return null;
  }
}
function NC(n, s) {
  return n === "wicket"
    ? "bg-[#E52525] text-[#F8F5E8]"
    : n === "runs" && s === 6
      ? "bg-[#F5C451] text-[#0B1C10]"
      : n === "runs" && s === 4
        ? "bg-[#4CAF50] text-[#0B1C10]"
        : n !== "runs"
          ? "bg-[#F8F5E8]/20 text-[#F5C451]"
          : "bg-[#F8F5E8] text-[#0B1C10]";
}
function Li({ k: n, v: s, id: l }) {
  return h.jsxs("div", {
    className: "rounded-2xl bg-[#F8F5E8]/8 py-2",
    children: [
      h.jsx("p", {
        className: "text-[10px] uppercase tracking-widest opacity-60",
        children: n,
      }),
      h.jsx("p", {
        className: "text-lg font-extrabold",
        "data-testid": `text-${l}`,
        children: s,
      }),
    ],
  });
}
function Gc({ icon: n, label: s, onClick: l, id: o, danger: c }) {
  return h.jsxs("button", {
    onClick: l,
    className: Rt(
      "press flex flex-col items-center gap-1 rounded-2xl py-2.5 text-xs font-semibold",
      c ? "text-[#E52525] bg-[#E52525]/8" : "bg-[#0B1C10]/6",
    ),
    "data-testid": `button-${o}`,
    children: [h.jsx(n, { className: "h-4 w-4" }), s],
  });
}
function RC() {
  const { id: n } = Sf(),
    { getMatch: s, saveMatch: l } = Mn(),
    [, o] = Ii(),
    [c, d] = z.useState(null),
    f = s(n);
  let p = null;
  try {
    p = f ? oa(f) : null;
  } catch {
    p = null;
  }
  if (!f || !p)
    return h.jsxs("div", {
      className: "max-w-xl mx-auto px-5 py-20 text-center",
      children: [
        h.jsx(Va, {
          broken: !0,
          className: "h-24 mx-auto [&_rect]:fill-[#102B17]",
        }),
        h.jsx("h1", {
          className: "mt-6 text-2xl font-extrabold",
          children: "Result not found",
        }),
        h.jsx(ue, {
          href: "/matches",
          className:
            "press inline-block mt-6 rounded-full bg-[#102B17] text-[#F8F5E8] px-6 py-3 font-bold",
          "data-testid": "link-back-matches",
          children: "Back to matches",
        }),
      ],
    });
  const m = f,
    g = p,
    x = g.status === "complete" || g.status === "abandoned",
    v = g.winner !== null ? m.config.teams[g.winner] : null;
  function S() {
    try {
      const C = new Blob([jC(m)], { type: "text/plain" }),
        k = document.createElement("a");
      ((k.href = URL.createObjectURL(C)),
        (k.download =
          `gully-crix-${m.config.teams[0].name}-vs-${m.config.teams[1].name}.txt`
            .replace(/\s+/g, "-")
            .toLowerCase()),
        k.click(),
        setTimeout(() => URL.revokeObjectURL(k.href), 1e3),
        d({ t: "Scorecard downloaded." }));
    } catch {
      d({ t: "Download failed on this browser.", err: !0 });
    }
  }
  async function j() {
    const C =
      `${m.config.teams[0].name} vs ${m.config.teams[1].name}: ${g.result}
` +
      g.innings
        .map(
          (k) =>
            `${m.config.teams[k.teamIndex].name} ${k.runs}/${k.wickets} (${ks(k.balls)})`,
        )
        .join(" | ") +
      `
Scored on GULLY CRIX`;
    try {
      if (navigator.share) {
        (await navigator.share({ title: "GULLY CRIX result", text: C }),
          d({ t: "Shared." }));
        return;
      }
      (await navigator.clipboard.writeText(C),
        d({ t: "Result copied to clipboard." }));
    } catch (k) {
      if (k instanceof DOMException && k.name === "AbortError") return;
      d({
        t: "Could not share or copy. Try downloading the scorecard instead.",
        err: !0,
      });
    }
  }
  function A() {
    try {
      const C = rb(m.config);
      (l(C), o(`/match/${C.id}`));
    } catch (C) {
      d({
        t: C instanceof Error ? C.message : "Could not start rematch.",
        err: !0,
      });
    }
  }
  return h.jsxs("div", {
    className: "max-w-3xl mx-auto px-5 pb-10",
    children: [
      h.jsxs("div", {
        className: "pt-5 flex items-center gap-3",
        children: [
          h.jsx(ue, {
            href: "/matches",
            className:
              "press h-10 w-10 rounded-full bg-[#0B1C10]/8 grid place-items-center",
            "aria-label": "Back",
            "data-testid": "link-result-back",
            children: h.jsx(i0, { className: "h-5 w-5" }),
          }),
          h.jsxs("p", {
            className:
              "text-xs font-bold uppercase tracking-[0.2em] text-[#4CAF50]",
            children: [
              new Date(m.createdAt).toLocaleDateString(void 0, {
                day: "numeric",
                month: "short",
                year: "numeric",
              }),
              m.config.venue ? ` · ${m.config.venue}` : "",
            ],
          }),
        ],
      }),
      h.jsxs(Bt.section, {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        className:
          "mt-4 rounded-[2.25rem] pitch-bg mow text-[#F8F5E8] p-6 relative overflow-hidden",
        children: [
          h.jsx("p", {
            className:
              "text-xs font-bold uppercase tracking-[0.25em] text-[#F5C451]",
            children:
              g.status === "abandoned"
                ? "Abandoned"
                : x
                  ? v
                    ? "Winner"
                    : "Tied"
                  : "In progress",
          }),
          h.jsxs("div", {
            className: "mt-3 flex items-center gap-4",
            children: [
              v &&
                h.jsx(Bt.div, {
                  initial: { scale: 0, rotate: -40 },
                  animate: { scale: 1, rotate: 0 },
                  transition: { type: "spring", delay: 0.2 },
                  children: h.jsx(_a, { team: v, size: 72 }),
                }),
              h.jsx("h1", {
                className: "text-3xl sm:text-4xl font-black leading-tight",
                "data-testid": "text-result",
                children: g.result || (x ? "Match over" : "Still being played"),
              }),
            ],
          }),
          h.jsx("div", {
            className: "mt-6 space-y-2",
            children: g.innings.map((C, k) =>
              h.jsxs(
                "div",
                {
                  className: Rt(
                    "flex items-center gap-3 rounded-2xl p-3",
                    g.winner === C.teamIndex
                      ? "bg-[#F5C451] text-[#0B1C10]"
                      : "bg-[#F8F5E8]/8",
                  ),
                  "data-testid": `row-innings-${k}`,
                  children: [
                    h.jsx(_a, { team: m.config.teams[C.teamIndex], size: 36 }),
                    h.jsx("p", {
                      className: "flex-1 font-bold truncate",
                      children: m.config.teams[C.teamIndex].name,
                    }),
                    h.jsxs("p", {
                      className: "text-2xl font-black",
                      children: [C.runs, "/", C.wickets],
                    }),
                    h.jsxs("p", {
                      className: "text-xs opacity-70 w-14 text-right",
                      children: [ks(C.balls), " ov"],
                    }),
                  ],
                },
                k,
              ),
            ),
          }),
        ],
      }),
      c &&
        h.jsx("p", {
          className: Rt(
            "mt-3 text-sm font-semibold",
            c.err ? "text-[#E52525]" : "text-[#2f7a33]",
          ),
          role: "status",
          "data-testid": "text-result-msg",
          children: c.t,
        }),
      h.jsxs("div", {
        className: "mt-4 grid grid-cols-3 gap-2",
        children: [
          h.jsx(Fc, { icon: BS, label: "Share", onClick: j, id: "share" }),
          h.jsx(Fc, {
            icon: l0,
            label: "Scorecard",
            onClick: S,
            id: "download",
          }),
          h.jsx(Fc, {
            icon: RS,
            label: "Rematch",
            onClick: A,
            id: "rematch",
            primary: !0,
          }),
        ],
      }),
      !x &&
        h.jsxs(ue, {
          href: `/match/${m.id}`,
          className:
            "press mt-2 flex items-center justify-center gap-2 h-12 rounded-2xl bg-[#102B17] text-[#F8F5E8] font-bold",
          "data-testid": "link-resume",
          children: [h.jsx(wS, { className: "h-4 w-4" }), "Resume scoring"],
        }),
      h.jsxs("div", {
        className:
          "mt-2 flex items-center gap-2 rounded-2xl border-2 border-dashed border-[#0B1C10]/15 px-4 py-3 text-sm opacity-60",
        "data-testid": "status-go-live",
        children: [
          h.jsx(CS, { className: "h-4 w-4" }),
          " Live sharing for spectators arrives in a later phase.",
        ],
      }),
      g.innings.map((C, k) =>
        h.jsxs(
          "section",
          {
            className: "mt-8",
            children: [
              h.jsxs("div", {
                className: "flex items-end justify-between",
                children: [
                  h.jsx("h2", {
                    className: "text-xl font-extrabold",
                    children: m.config.teams[C.teamIndex].name,
                  }),
                  h.jsxs("p", {
                    className: "text-xs opacity-60",
                    children: [
                      "RR ",
                      Wf(C.runs, C.balls),
                      " · Extras ",
                      C.extras,
                      " · 4s ",
                      C.fours,
                      " · 6s ",
                      C.sixes,
                    ],
                  }),
                ],
              }),
              C.deliveries.length === 0
                ? h.jsx("p", {
                    className: "mt-3 text-sm opacity-60",
                    children: "No balls bowled.",
                  })
                : h.jsx("ol", {
                    className: "mt-3 space-y-2",
                    children: Jf(C.deliveries).map(([H, U]) =>
                      h.jsxs(
                        "li",
                        {
                          className:
                            "flex items-center gap-3 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/8 p-2.5",
                          "data-testid": `row-over-${k}-${H}`,
                          children: [
                            h.jsxs("span", {
                              className: "w-10 text-xs font-bold opacity-50",
                              children: ["Ov ", H + 1],
                            }),
                            h.jsx("div", {
                              className: "flex-1 flex flex-wrap gap-1",
                              children: U.map((L, K) =>
                                h.jsx(
                                  "span",
                                  {
                                    className: Rt(
                                      "min-w-7 h-7 px-1 rounded-full grid place-items-center text-[11px] font-extrabold",
                                      L.kind === "wicket"
                                        ? "bg-[#E52525] text-[#F8F5E8]"
                                        : L.kind === "runs" && L.runs === 6
                                          ? "bg-[#F5C451]"
                                          : L.kind === "runs" && L.runs === 4
                                            ? "bg-[#4CAF50]"
                                            : L.kind !== "runs"
                                              ? "bg-[#0B1C10]/10"
                                              : "bg-[#0B1C10]/5",
                                    ),
                                    children: L.label,
                                  },
                                  K,
                                ),
                              ),
                            }),
                            h.jsx("span", {
                              className: "font-extrabold",
                              children: U.reduce((L, K) => L + K.total, 0),
                            }),
                          ],
                        },
                        H,
                      ),
                    ),
                  }),
            ],
          },
          k,
        ),
      ),
      m.config.rules.localRules &&
        h.jsxs("p", {
          className: "mt-8 text-sm italic opacity-60",
          children: ["Local rules: ", m.config.rules.localRules],
        }),
    ],
  });
}
function Fc({ icon: n, label: s, onClick: l, id: o, primary: c }) {
  return h.jsxs("button", {
    onClick: l,
    className: Rt(
      "press flex flex-col items-center gap-1 rounded-2xl py-3 text-sm font-bold",
      c ? "bg-[#E52525] text-[#F8F5E8]" : "bg-[#0B1C10]/6",
    ),
    "data-testid": `button-${o}`,
    children: [h.jsx(n, { className: "h-5 w-5" }), s],
  });
}
const DC = ["All", "Live", "Complete", "Abandoned"];
function kC() {
  const { matches: n, deleteMatch: s } = Mn(),
    [l, o] = z.useState("All"),
    [c, d] = z.useState(null),
    f = z.useMemo(
      () =>
        n
          .map((m) => {
            try {
              return { m, s: oa(m) };
            } catch {
              return { m, s: null };
            }
          })
          .sort((m, g) => g.m.createdAt.localeCompare(m.m.createdAt)),
      [n],
    ),
    p = f.filter(
      ({ s: m }) =>
        l === "All" ||
        (l === "Live"
          ? m && (m.status === "playing" || m.status === "inningsBreak")
          : l === "Complete"
            ? m?.status === "complete"
            : m?.status === "abandoned"),
    );
  return h.jsxs("div", {
    className: "max-w-3xl mx-auto px-5",
    children: [
      h.jsx(Po, { eyebrow: "On this device", title: "Matches" }),
      h.jsx("div", {
        className: "flex gap-2 overflow-x-auto pb-1",
        children: DC.map((m) =>
          h.jsxs(
            "button",
            {
              onClick: () => o(m),
              className: Rt(
                "press relative shrink-0 rounded-full px-4 h-9 text-sm font-bold",
                l === m ? "text-[#F8F5E8]" : "bg-[#0B1C10]/6",
              ),
              "data-testid": `button-filter-${m.toLowerCase()}`,
              children: [
                l === m &&
                  h.jsx(Bt.span, {
                    layoutId: "filter-pill",
                    className: "absolute inset-0 rounded-full bg-[#102B17]",
                  }),
                h.jsx("span", { className: "relative", children: m }),
              ],
            },
            m,
          ),
        ),
      }),
      p.length === 0
        ? h.jsxs("div", {
            className:
              "mt-10 rounded-[2rem] pitch-bg mow text-[#F8F5E8] p-8 text-center",
            "data-testid": "empty-matches",
            children: [
              h.jsx(Va, { className: "h-20 mx-auto" }),
              h.jsx("p", {
                className: "mt-5 text-xl font-extrabold",
                children: f.length
                  ? "Nothing in this filter"
                  : "The pitch is empty",
              }),
              h.jsx("p", {
                className: "mt-1 text-sm opacity-70",
                children: f.length
                  ? "Try another filter."
                  : "Score your first gully game and it lands here.",
              }),
              !f.length &&
                h.jsxs(ue, {
                  href: "/setup",
                  className:
                    "press mt-5 inline-flex items-center gap-2 rounded-full bg-[#F5C451] text-[#0B1C10] px-5 py-3 font-bold",
                  "data-testid": "link-empty-create",
                  children: [h.jsx(o0, { className: "h-4 w-4" }), "New match"],
                }),
            ],
          })
        : h.jsx("ul", {
            className: "mt-4 space-y-3",
            children: p.map(({ m, s: g }, x) => {
              const v =
                g && (g.status === "playing" || g.status === "inningsBreak");
              return h.jsxs(
                Bt.li,
                {
                  initial: { opacity: 0, y: 12 },
                  animate: { opacity: 1, y: 0 },
                  transition: { delay: Math.min(x, 8) * 0.04 },
                  className: "relative",
                  children: [
                    h.jsxs(ue, {
                      href: v ? `/match/${m.id}` : `/result/${m.id}`,
                      className:
                        "press block rounded-3xl bg-[#FBF9F0] border border-[#0B1C10]/10 p-4 pr-14",
                      "data-testid": `card-match-${m.id}`,
                      children: [
                        h.jsxs("div", {
                          className:
                            "flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest",
                          children: [
                            h.jsx("span", {
                              className: Rt(
                                "h-2 w-2 rounded-full",
                                g
                                  ? v
                                    ? "bg-[#E52525] animate-pulse"
                                    : g.status === "abandoned"
                                      ? "bg-[#0B1C10]/30"
                                      : "bg-[#4CAF50]"
                                  : "bg-[#0B1C10]/30",
                              ),
                            }),
                            h.jsxs("span", {
                              className: "opacity-60",
                              children: [
                                g
                                  ? v
                                    ? "Live"
                                    : g.status === "abandoned"
                                      ? "Abandoned"
                                      : "Complete"
                                  : "Damaged record",
                                " · ",
                                new Date(m.createdAt).toLocaleDateString(
                                  void 0,
                                  { day: "numeric", month: "short" },
                                ),
                                " · ",
                                m.config.rules.overs,
                                " ov",
                              ],
                            }),
                          ],
                        }),
                        h.jsx("div", {
                          className: "mt-3 space-y-1.5",
                          children: [0, 1].map((S) => {
                            const j = g?.innings.find((A) => A.teamIndex === S);
                            return h.jsxs(
                              "div",
                              {
                                className: "flex items-center gap-2.5",
                                children: [
                                  h.jsx(_a, {
                                    team: m.config.teams[S],
                                    size: 26,
                                  }),
                                  h.jsx("span", {
                                    className: Rt(
                                      "flex-1 truncate font-semibold",
                                      g?.winner === S && "font-extrabold",
                                    ),
                                    children: m.config.teams[S].name,
                                  }),
                                  h.jsx("span", {
                                    className: "font-extrabold tabular-nums",
                                    children: j
                                      ? `${j.runs}/${j.wickets}`
                                      : "-",
                                  }),
                                  h.jsx("span", {
                                    className:
                                      "w-10 text-right text-xs opacity-50",
                                    children: j ? ks(j.balls) : "",
                                  }),
                                ],
                              },
                              S,
                            );
                          }),
                        }),
                        g?.result &&
                          h.jsx("p", {
                            className:
                              "mt-2 text-sm font-semibold text-[#2f7a33]",
                            children: g.result,
                          }),
                      ],
                    }),
                    h.jsx("button", {
                      onClick: () => d(m.id),
                      className:
                        "press absolute right-3 top-3 h-9 w-9 grid place-items-center rounded-full text-[#E52525] bg-[#E52525]/8",
                      "aria-label": "Delete match",
                      "data-testid": `button-delete-${m.id}`,
                      children: h.jsx(vf, { className: "h-4 w-4" }),
                    }),
                  ],
                },
                m.id,
              );
            }),
          }),
      h.jsx(Qo, {
        open: !!c,
        onClose: () => d(null),
        title: "Delete this match?",
        body: "It will be removed from this device and from your stats. This cannot be undone.",
        confirmLabel: "Delete",
        danger: !0,
        onConfirm: () => c && s(c),
      }),
    ],
  });
}
function OC() {
  const { matches: n } = Mn(),
    s = z.useMemo(() => {
      let o = 0,
        c = 0,
        d = 0,
        f = 0,
        p = 0,
        m = 0,
        g = 0,
        x = 0,
        v = 0,
        S = 0,
        j = 0,
        A = null;
      const C = new Map();
      for (const H of n) {
        let U;
        try {
          U = oa(H);
        } catch {
          continue;
        }
        (U.status === "complete" ? o++ : U.status === "abandoned" ? c++ : d++,
          U.status === "complete" && U.winner === null && f++);
        for (const L of U.innings)
          (!L.balls && !L.runs) ||
            (j++,
            (p += L.runs),
            (m += L.wickets),
            (g += L.balls),
            (x += L.fours),
            (v += L.sixes),
            (S += L.extras),
            (!A || L.runs > A.runs) &&
              (A = {
                runs: L.runs,
                wkts: L.wickets,
                team: H.config.teams[L.teamIndex].name,
              }));
        U.status === "complete" &&
          H.config.teams.forEach((L, K) => {
            const P = L.name.trim(),
              st = C.get(P) ?? { played: 0, won: 0 };
            (st.played++, U.winner === K && st.won++, C.set(P, st));
          });
      }
      const k = Array.from(C.entries())
        .sort((H, U) => U[1].won - H[1].won || U[1].played - H[1].played)
        .slice(0, 8);
      return {
        complete: o,
        abandoned: c,
        live: d,
        ties: f,
        runs: p,
        wkts: m,
        balls: g,
        fours: x,
        sixes: v,
        extras: S,
        innings: j,
        best: A,
        table: k,
      };
    }, [n]);
  if (!n.length)
    return h.jsxs("div", {
      className: "max-w-3xl mx-auto px-5",
      children: [
        h.jsx(Po, { eyebrow: "Your numbers", title: "Stats" }),
        h.jsxs("div", {
          className:
            "rounded-[2rem] pitch-bg mow text-[#F8F5E8] p-8 text-center",
          "data-testid": "empty-stats",
          children: [
            h.jsx(Va, { className: "h-20 mx-auto" }),
            h.jsx("p", {
              className: "mt-5 text-xl font-extrabold",
              children: "No numbers yet",
            }),
            h.jsx("p", {
              className: "mt-1 text-sm opacity-70",
              children: "Every ball you score feeds this page.",
            }),
            h.jsx(ue, {
              href: "/setup",
              className:
                "press mt-5 inline-block rounded-full bg-[#F5C451] text-[#0B1C10] px-5 py-3 font-bold",
              "data-testid": "link-stats-create",
              children: "Start a match",
            }),
          ],
        }),
      ],
    });
  const l = [
    {
      k: "Runs scored",
      v: s.runs,
      c: "bg-[#102B17] text-[#F8F5E8] col-span-2",
    },
    { k: "Sixes", v: s.sixes, c: "bg-[#F5C451]" },
    { k: "Fours", v: s.fours, c: "bg-[#4CAF50]" },
    { k: "Wickets", v: s.wkts, c: "bg-[#E52525] text-[#F8F5E8]" },
    {
      k: "Overs bowled",
      v: `${Math.floor(s.balls / 6)}.${s.balls % 6}`,
      c: "bg-[#FBF9F0] border border-[#0B1C10]/10",
    },
  ];
  return h.jsxs("div", {
    className: "max-w-3xl mx-auto px-5 pb-6",
    children: [
      h.jsx(Po, { eyebrow: "Your numbers", title: "Stats" }),
      h.jsx("div", {
        className: "grid grid-cols-2 sm:grid-cols-4 gap-3",
        children: l.map((o, c) =>
          h.jsxs(
            Bt.div,
            {
              initial: { opacity: 0, scale: 0.9 },
              animate: { opacity: 1, scale: 1 },
              transition: { delay: c * 0.05 },
              className: `rounded-3xl p-4 ${o.c}`,
              "data-testid": `stat-${o.k.toLowerCase().replace(/\s/g, "-")}`,
              children: [
                h.jsx("p", {
                  className: "text-4xl font-black tracking-tight",
                  children: o.v,
                }),
                h.jsx("p", {
                  className:
                    "text-xs font-bold uppercase tracking-widest opacity-70 mt-1",
                  children: o.k,
                }),
              ],
            },
            o.k,
          ),
        ),
      }),
      h.jsxs("dl", {
        className:
          "mt-6 grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-3 rounded-3xl bg-[#FBF9F0] border border-[#0B1C10]/10 p-5 text-sm",
        children: [
          h.jsx(aa, { k: "Matches", v: n.length }),
          h.jsx(aa, { k: "Completed", v: s.complete }),
          h.jsx(aa, { k: "Abandoned", v: s.abandoned }),
          h.jsx(aa, { k: "In progress", v: s.live }),
          h.jsx(aa, { k: "Ties", v: s.ties }),
          h.jsx(aa, { k: "Extras", v: s.extras }),
          h.jsx(aa, {
            k: "Avg innings",
            v: s.innings ? (s.runs / s.innings).toFixed(1) : "-",
          }),
          h.jsx(aa, {
            k: "Scoring rate",
            v: s.balls ? ((s.runs / s.balls) * 6).toFixed(2) : "-",
          }),
        ],
      }),
      s.best &&
        h.jsxs("div", {
          className: "mt-4 rounded-3xl pitch-bg text-[#F8F5E8] p-5",
          "data-testid": "stat-best-innings",
          children: [
            h.jsx("p", {
              className:
                "text-xs font-bold uppercase tracking-widest text-[#F5C451]",
              children: "Highest total",
            }),
            h.jsxs("p", {
              className: "text-3xl font-black",
              children: [s.best.runs, "/", s.best.wkts],
            }),
            h.jsx("p", {
              className: "text-sm opacity-70",
              children: s.best.team,
            }),
          ],
        }),
      h.jsx("h2", {
        className: "mt-8 text-lg font-extrabold",
        children: "Team ledger",
      }),
      s.table.length === 0
        ? h.jsx("p", {
            className: "mt-2 text-sm opacity-60",
            children: "Finish a match to start the ledger.",
          })
        : h.jsx("ol", {
            className: "mt-3 space-y-2",
            children: s.table.map(([o, c], d) =>
              h.jsxs(
                "li",
                {
                  className:
                    "flex items-center gap-3 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/8 px-4 py-3",
                  "data-testid": `row-team-${d}`,
                  children: [
                    h.jsx("span", {
                      className: "w-5 font-black opacity-40",
                      children: d + 1,
                    }),
                    h.jsx("span", {
                      className: "flex-1 font-semibold truncate",
                      children: o,
                    }),
                    h.jsxs("span", {
                      className: "text-sm opacity-60",
                      children: [c.played, " played"],
                    }),
                    h.jsxs("span", {
                      className: "font-extrabold w-14 text-right",
                      children: [c.won, " won"],
                    }),
                  ],
                },
                o,
              ),
            ),
          }),
    ],
  });
}
function aa({ k: n, v: s }) {
  return h.jsxs("div", {
    children: [
      h.jsx("dt", {
        className: "text-[11px] uppercase tracking-widest opacity-50",
        children: n,
      }),
      h.jsx("dd", { className: "text-xl font-extrabold", children: s }),
    ],
  });
}
function BC() {
  const { settings: n, updateSettings: s, matches: l, clearAll: o } = Mn(),
    [c, d] = z.useState(n.name),
    [f, p] = z.useState(null),
    [m, g] = z.useState(!1);
  function x() {
    const S = c.trim();
    if (S.length > 30) return p({ t: "Name max 30 characters.", err: !0 });
    (s({ name: S }), p({ t: "Name saved." }));
  }
  function v() {
    try {
      const S = new Blob(
          [
            JSON.stringify(
              {
                app: "gully-crix",
                version: 1,
                exportedAt: new Date().toISOString(),
                settings: n,
                matches: l,
              },
              null,
              2,
            ),
          ],
          { type: "application/json" },
        ),
        j = document.createElement("a");
      ((j.href = URL.createObjectURL(S)),
        (j.download = `gully-crix-export-${new Date().toISOString().slice(0, 10)}.json`),
        j.click(),
        setTimeout(() => URL.revokeObjectURL(j.href), 1e3),
        p({ t: `Exported ${l.length} matches.` }));
    } catch {
      p({ t: "Export failed on this browser.", err: !0 });
    }
  }
  return h.jsxs("div", {
    className: "max-w-xl mx-auto px-5 pb-6",
    children: [
      h.jsx(Po, { eyebrow: "This device", title: "Profile" }),
      h.jsxs("div", {
        className:
          "rounded-[2rem] pitch-bg mow text-[#F8F5E8] p-5 flex items-center gap-4",
        children: [
          h.jsx("div", {
            className:
              "h-16 w-16 rounded-full bg-[#F5C451] text-[#0B1C10] grid place-items-center text-2xl font-black",
            children: (n.name || "G")[0].toUpperCase(),
          }),
          h.jsxs("div", {
            children: [
              h.jsx("p", {
                className: "text-xl font-extrabold",
                "data-testid": "text-profile-name",
                children: n.name || "Gully scorer",
              }),
              h.jsxs("p", {
                className: "text-sm opacity-70",
                children: [l.length, " matches scored here"],
              }),
            ],
          }),
        ],
      }),
      h.jsxs("section", {
        className: "mt-6 space-y-2",
        children: [
          h.jsx("label", {
            className: "text-sm font-semibold",
            htmlFor: "name",
            children: "Your name",
          }),
          h.jsxs("div", {
            className: "flex gap-2",
            children: [
              h.jsx("input", {
                id: "name",
                value: c,
                onChange: (S) => d(S.target.value),
                maxLength: 40,
                placeholder: "What the gang calls you",
                className:
                  "flex-1 h-12 rounded-2xl bg-[#FBF9F0] border border-[#0B1C10]/10 px-4 outline-none focus:ring-2 focus:ring-[#4CAF50]",
                "data-testid": "input-profile-name",
              }),
              h.jsx("button", {
                onClick: x,
                className:
                  "press h-12 px-5 rounded-2xl bg-[#102B17] text-[#F8F5E8] font-bold",
                "data-testid": "button-save-name",
                children: "Save",
              }),
            ],
          }),
        ],
      }),
      h.jsxs("section", {
        className: "mt-6 space-y-2",
        children: [
          h.jsx("h2", {
            className:
              "text-xs font-bold uppercase tracking-[0.2em] opacity-50",
            children: "Feel",
          }),
          h.jsx(Zi, {
            id: "sound",
            label: "Sound effects",
            hint: "Chimes for fours, sixes and wickets",
            checked: n.sound,
            onChange: (S) => {
              (s({ sound: S }), S && ub("four"));
            },
          }),
          h.jsx(Zi, {
            id: "animations",
            label: "Animations",
            hint: "Splash, big hit celebrations, motion",
            checked: n.animations,
            onChange: (S) => s({ animations: S }),
          }),
        ],
      }),
      h.jsxs("section", {
        className: "mt-6 space-y-2",
        children: [
          h.jsx("h2", {
            className:
              "text-xs font-bold uppercase tracking-[0.2em] opacity-50",
            children: "Data",
          }),
          h.jsxs("button", {
            onClick: v,
            className:
              "press w-full flex items-center gap-3 rounded-2xl bg-[#0B1C10]/5 px-4 py-3 font-semibold",
            "data-testid": "button-export-json",
            children: [
              h.jsx(l0, { className: "h-5 w-5" }),
              "Export all data as JSON",
            ],
          }),
          h.jsxs("button", {
            onClick: () => g(!0),
            disabled: !l.length,
            className:
              "press w-full flex items-center gap-3 rounded-2xl bg-[#E52525]/8 text-[#E52525] px-4 py-3 font-semibold disabled:opacity-40",
            "data-testid": "button-clear-matches",
            children: [
              h.jsx(vf, { className: "h-5 w-5" }),
              "Delete all matches",
            ],
          }),
          h.jsxs("div", {
            className:
              "flex items-center gap-3 rounded-2xl border-2 border-dashed border-[#0B1C10]/15 px-4 py-3 text-sm opacity-60",
            "data-testid": "status-cloud",
            children: [
              h.jsx(rS, { className: "h-5 w-5" }),
              "Accounts and cloud sync arrive in a later phase. Everything lives on this device for now.",
            ],
          }),
        ],
      }),
      f &&
        h.jsx("p", {
          className: `mt-4 text-sm font-semibold ${f.err ? "text-[#E52525]" : "text-[#2f7a33]"}`,
          role: "status",
          "data-testid": "text-profile-msg",
          children: f.t,
        }),
      h.jsx(Qo, {
        open: m,
        onClose: () => g(!1),
        title: "Delete every match?",
        body: "All history and stats on this device will be erased. Export first if you want a copy.",
        confirmLabel: "Delete all",
        danger: !0,
        onConfirm: () => {
          (o(), p({ t: "All matches deleted." }));
        },
      }),
    ],
  });
}
function zC() {
  return h.jsx(VC, {
    children: h.jsxs(fT, {
      children: [
        h.jsx(na, { path: "/", component: SC }),
        h.jsx(na, { path: "/setup", component: EC }),
        h.jsx(na, { path: "/match/:id", component: MC }),
        h.jsx(na, { path: "/result/:id", component: RC }),
        h.jsx(na, { path: "/matches", component: kC }),
        h.jsx(na, { path: "/stats", component: OC }),
        h.jsx(na, { path: "/profile", component: BC }),
        h.jsx(na, { component: QS }),
      ],
    }),
  });
}
function VC({ children: n }) {
  const [s] = Ii();
  return h.jsx(Hy, { resetKey: s, children: n });
}
function _C() {
  return h.jsx(pT, {
    children: h.jsxs(v0, {
      base: "/".replace(/\/$/, ""),
      children: [h.jsx(mC, {}), h.jsx(gC, { children: h.jsx(zC, {}) })],
    }),
  });
}
q1.createRoot(document.getElementById("root"), {
  onCaughtError: (n, s) => {
    console.error(n, s.componentStack);
  },
}).render(h.jsx(Hy, { children: h.jsx(_C, {}) }));
