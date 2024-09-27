const R = (e, t) => e === t, B = {
  equals: R
};
let V = j;
const w = 1, x = 2, U = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let $ = null, H = null, u = null, a = null, g = null, E = 0;
function M(e, t) {
  const s = u, n = h, l = e.length === 0, i = t === void 0 ? n : t, r = l ? U : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = l ? e : () => e(() => N(() => b(r)));
  h = r, u = null;
  try {
    return S(o, !0);
  } finally {
    u = s, h = n;
  }
}
function Q(e, t) {
  t = t ? Object.assign({}, B, t) : B;
  const s = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (l) => (typeof l == "function" && (l = l(s.value)), L(s, l));
  return [X.bind(s), n];
}
function v(e, t, s) {
  const n = K(e, t, !1, w);
  P(n);
}
function N(e) {
  if (u === null) return e();
  const t = u;
  u = null;
  try {
    return e();
  } finally {
    u = t;
  }
}
function X() {
  if (this.sources && this.state)
    if (this.state === w) P(this);
    else {
      const e = a;
      a = null, S(() => C(this), !1), a = e;
    }
  if (u) {
    const e = this.observers ? this.observers.length : 0;
    u.sources ? (u.sources.push(this), u.sourceSlots.push(e)) : (u.sources = [this], u.sourceSlots = [e]), this.observers ? (this.observers.push(u), this.observerSlots.push(u.sources.length - 1)) : (this.observers = [u], this.observerSlots = [u.sources.length - 1]);
  }
  return this.value;
}
function L(e, t, s) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && S(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], r = $ && $.running;
      r && $.disposed.has(i), (r ? !i.tState : !i.state) && (i.pure ? a.push(i) : g.push(i), i.observers && k(i)), r || (i.state = w);
    }
    if (a.length > 1e6)
      throw a = [], new Error();
  }, !1)), t;
}
function P(e) {
  if (!e.fn) return;
  b(e);
  const t = E;
  J(
    e,
    e.value,
    t
  );
}
function J(e, t, s) {
  let n;
  const l = h, i = u;
  u = h = e;
  try {
    n = e.fn(t);
  } catch (r) {
    return e.pure && (e.state = w, e.owned && e.owned.forEach(b), e.owned = null), e.updatedAt = s + 1, W(r);
  } finally {
    u = i, h = l;
  }
  (!e.updatedAt || e.updatedAt <= s) && (e.updatedAt != null && "observers" in e ? L(e, n) : e.value = n, e.updatedAt = s);
}
function K(e, t, s, n = w, l) {
  const i = {
    fn: e,
    state: n,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: t,
    owner: h,
    context: h ? h.context : null,
    pure: s
  };
  return h === null || h !== U && (h.owned ? h.owned.push(i) : h.owned = [i]), i;
}
function I(e) {
  if (e.state === 0) return;
  if (e.state === x) return C(e);
  if (e.suspense && N(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < E); )
    e.state && t.push(e);
  for (let s = t.length - 1; s >= 0; s--)
    if (e = t[s], e.state === w)
      P(e);
    else if (e.state === x) {
      const n = a;
      a = null, S(() => C(e, t[0]), !1), a = n;
    }
}
function S(e, t) {
  if (a) return e();
  let s = !1;
  t || (a = []), g ? s = !0 : g = [], E++;
  try {
    const n = e();
    return Y(s), n;
  } catch (n) {
    s || (g = null), a = null, W(n);
  }
}
function Y(e) {
  if (a && (j(a), a = null), e) return;
  const t = g;
  g = null, t.length && S(() => V(t), !1);
}
function j(e) {
  for (let t = 0; t < e.length; t++) I(e[t]);
}
function C(e, t) {
  e.state = 0;
  for (let s = 0; s < e.sources.length; s += 1) {
    const n = e.sources[s];
    if (n.sources) {
      const l = n.state;
      l === w ? n !== t && (!n.updatedAt || n.updatedAt < E) && I(n) : l === x && C(n, t);
    }
  }
}
function k(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const s = e.observers[t];
    s.state || (s.state = x, s.pure ? a.push(s) : g.push(s), s.observers && k(s));
  }
}
function b(e) {
  let t;
  if (e.sources)
    for (; e.sources.length; ) {
      const s = e.sources.pop(), n = e.sourceSlots.pop(), l = s.observers;
      if (l && l.length) {
        const i = l.pop(), r = s.observerSlots.pop();
        n < l.length && (i.sourceSlots[r] = n, l[n] = i, s.observerSlots[n] = r);
      }
    }
  if (e.tOwned) {
    for (t = e.tOwned.length - 1; t >= 0; t--) b(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) b(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function Z(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function W(e, t = h) {
  throw Z(e);
}
function q(e, t) {
  return N(() => e(t || {}));
}
function z(e, t, s) {
  let n = s.length, l = t.length, i = n, r = 0, o = 0, f = t[l - 1].nextSibling, c = null;
  for (; r < l || o < i; ) {
    if (t[r] === s[o]) {
      r++, o++;
      continue;
    }
    for (; t[l - 1] === s[i - 1]; )
      l--, i--;
    if (l === r) {
      const p = i < n ? o ? s[o - 1].nextSibling : s[i - o] : f;
      for (; o < i; ) e.insertBefore(s[o++], p);
    } else if (i === o)
      for (; r < l; )
        (!c || !c.has(t[r])) && t[r].remove(), r++;
    else if (t[r] === s[i - 1] && s[o] === t[l - 1]) {
      const p = t[--l].nextSibling;
      e.insertBefore(s[o++], t[r++].nextSibling), e.insertBefore(s[--i], p), t[l] = s[i];
    } else {
      if (!c) {
        c = /* @__PURE__ */ new Map();
        let d = o;
        for (; d < i; ) c.set(s[d], d++);
      }
      const p = c.get(t[r]);
      if (p != null)
        if (o < p && p < i) {
          let d = r, m = 1, _;
          for (; ++d < l && d < i && !((_ = c.get(t[d])) == null || _ !== p + m); )
            m++;
          if (m > p - o) {
            const G = t[r];
            for (; o < p; ) e.insertBefore(s[o++], G);
          } else e.replaceChild(s[o++], t[r++]);
        } else r++;
      else t[r++].remove();
    }
  }
}
const O = "_$DX_DELEGATE";
function ee(e, t, s, n = {}) {
  let l;
  return M((i) => {
    l = i, t === document ? e() : F(t, e(), t.firstChild ? null : void 0, s);
  }, n.owner), () => {
    l(), t.textContent = "";
  };
}
function te(e, t, s) {
  let n;
  const l = () => {
    const r = document.createElement("template");
    return r.innerHTML = e, r.content.firstChild;
  }, i = () => (n || (n = l())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function se(e, t = window.document) {
  const s = t[O] || (t[O] = /* @__PURE__ */ new Set());
  for (let n = 0, l = e.length; n < l; n++) {
    const i = e[n];
    s.has(i) || (s.add(i), t.addEventListener(i, ne));
  }
}
function F(e, t, s, n) {
  if (s !== void 0 && !n && (n = []), typeof t != "function") return A(e, t, n, s);
  v((l) => A(e, t(), l, s), n);
}
function ne(e) {
  let t = e.target;
  const s = `$$${e.type}`, n = e.target, l = e.currentTarget, i = (f) => Object.defineProperty(e, "target", {
    configurable: !0,
    value: f
  }), r = () => {
    const f = t[s];
    if (f && !t.disabled) {
      const c = t[`${s}Data`];
      if (c !== void 0 ? f.call(t, c, e) : f.call(t, e), e.cancelBubble) return;
    }
    return t.host && typeof t.host != "string" && !t.host._$host && t.contains(e.target) && i(t.host), !0;
  }, o = () => {
    for (; r() && (t = t._$host || t.parentNode || t.host); ) ;
  };
  if (Object.defineProperty(e, "currentTarget", {
    configurable: !0,
    get() {
      return t || document;
    }
  }), e.composedPath) {
    const f = e.composedPath();
    i(f[0]);
    for (let c = 0; c < f.length - 2 && (t = f[c], !!r()); c++) {
      if (t._$host) {
        t = t._$host, o();
        break;
      }
      if (t.parentNode === l)
        break;
    }
  } else o();
  i(n);
}
function A(e, t, s, n, l) {
  for (; typeof s == "function"; ) s = s();
  if (t === s) return s;
  const i = typeof t, r = n !== void 0;
  if (e = r && s[0] && s[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === s))
      return s;
    if (r) {
      let o = s[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), s = y(e, s, n, o);
    } else
      s !== "" && typeof s == "string" ? s = e.firstChild.data = t : s = e.textContent = t;
  } else if (t == null || i === "boolean")
    s = y(e, s, n);
  else {
    if (i === "function")
      return v(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        s = A(e, o, s, n);
      }), () => s;
    if (Array.isArray(t)) {
      const o = [], f = s && Array.isArray(s);
      if (T(o, t, s, l))
        return v(() => s = A(e, o, s, n, !0)), () => s;
      if (o.length === 0) {
        if (s = y(e, s, n), r) return s;
      } else f ? s.length === 0 ? D(e, o, n) : z(e, s, o) : (s && y(e), D(e, o));
      s = o;
    } else if (t.nodeType) {
      if (Array.isArray(s)) {
        if (r) return s = y(e, s, n, t);
        y(e, s, null, t);
      } else s == null || s === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      s = t;
    }
  }
  return s;
}
function T(e, t, s, n) {
  let l = !1;
  for (let i = 0, r = t.length; i < r; i++) {
    let o = t[i], f = s && s[e.length], c;
    if (!(o == null || o === !0 || o === !1)) if ((c = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      l = T(e, o, f) || l;
    else if (c === "function")
      if (n) {
        for (; typeof o == "function"; ) o = o();
        l = T(
          e,
          Array.isArray(o) ? o : [o],
          Array.isArray(f) ? f : [f]
        ) || l;
      } else
        e.push(o), l = !0;
    else {
      const p = String(o);
      f && f.nodeType === 3 && f.data === p ? e.push(f) : e.push(document.createTextNode(p));
    }
  }
  return l;
}
function D(e, t, s = null) {
  for (let n = 0, l = t.length; n < l; n++) e.insertBefore(t[n], s);
}
function y(e, t, s, n) {
  if (s === void 0) return e.textContent = "";
  const l = n || document.createTextNode("");
  if (t.length) {
    let i = !1;
    for (let r = t.length - 1; r >= 0; r--) {
      const o = t[r];
      if (l !== o) {
        const f = o.parentNode === e;
        !i && !r ? f ? e.replaceChild(l, o) : e.insertBefore(l, s) : f && o.remove();
      } else i = !0;
    }
  } else e.insertBefore(l, s);
  return [l];
}
var le = /* @__PURE__ */ te("<div><h3>Counter Widget</h3><p>Current Count: </p><button>Increment</button><button>Decrement");
function ie() {
  const [e, t] = Q(0);
  return (() => {
    var s = le(), n = s.firstChild, l = n.nextSibling;
    l.firstChild;
    var i = l.nextSibling, r = i.nextSibling;
    return s.style.setProperty("border", "1px solid black"), s.style.setProperty("padding", "20px"), s.style.setProperty("width", "200px"), s.style.setProperty("textAlign", "center"), s.style.setProperty("position", "absolute"), s.style.setProperty("bottom", "10px"), s.style.setProperty("right", "10px"), F(l, e, null), i.$$click = () => t(e() + 1), r.$$click = () => t(e() - 1), s;
  })();
}
function oe() {
  return q(ie, {});
}
se(["click"]);
function re() {
  const e = document.createElement("div");
  e.id = "widget", document.body.appendChild(e);
}
re();
const fe = document.getElementById("widget");
ee(() => q(oe, {}), fe);
