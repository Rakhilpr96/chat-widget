const W = (e, t) => e === t, A = {
  equals: W
};
let H = k;
const w = 1, E = 2, P = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var h = null;
let T = null, Q = null, u = null, a = null, g = null, v = 0;
function X(e, t) {
  const s = u, n = h, l = e.length === 0, i = t === void 0 ? n : t, r = l ? P : {
    owned: null,
    cleanups: null,
    context: i ? i.context : null,
    owner: i
  }, o = l ? e : () => e(() => O(() => y(r)));
  h = r, u = null;
  try {
    return S(o, !0);
  } finally {
    u = s, h = n;
  }
}
function J(e, t) {
  t = t ? Object.assign({}, A, t) : A;
  const s = {
    value: e,
    observers: null,
    observerSlots: null,
    comparator: t.equals || void 0
  }, n = (l) => (typeof l == "function" && (l = l(s.value)), q(s, l));
  return [j.bind(s), n];
}
function _(e, t, s) {
  const n = I(e, t, !1, w);
  $(n);
}
function K(e, t, s) {
  s = s ? Object.assign({}, A, s) : A;
  const n = I(e, t, !0, 0);
  return n.observers = null, n.observerSlots = null, n.comparator = s.equals || void 0, $(n), j.bind(n);
}
function O(e) {
  if (u === null) return e();
  const t = u;
  u = null;
  try {
    return e();
  } finally {
    u = t;
  }
}
function j() {
  if (this.sources && this.state)
    if (this.state === w) $(this);
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
function q(e, t, s) {
  let n = e.value;
  return (!e.comparator || !e.comparator(n, t)) && (e.value = t, e.observers && e.observers.length && S(() => {
    for (let l = 0; l < e.observers.length; l += 1) {
      const i = e.observers[l], r = T && T.running;
      r && T.disposed.has(i), (r ? !i.tState : !i.state) && (i.pure ? a.push(i) : g.push(i), i.observers && F(i)), r || (i.state = w);
    }
    if (a.length > 1e6)
      throw a = [], new Error();
  }, !1)), t;
}
function $(e) {
  if (!e.fn) return;
  y(e);
  const t = v;
  Y(
    e,
    e.value,
    t
  );
}
function Y(e, t, s) {
  let n;
  const l = h, i = u;
  u = h = e;
  try {
    n = e.fn(t);
  } catch (r) {
    return e.pure && (e.state = w, e.owned && e.owned.forEach(y), e.owned = null), e.updatedAt = s + 1, G(r);
  } finally {
    u = i, h = l;
  }
  (!e.updatedAt || e.updatedAt <= s) && (e.updatedAt != null && "observers" in e ? q(e, n) : e.value = n, e.updatedAt = s);
}
function I(e, t, s, n = w, l) {
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
  return h === null || h !== P && (h.owned ? h.owned.push(i) : h.owned = [i]), i;
}
function M(e) {
  if (e.state === 0) return;
  if (e.state === E) return C(e);
  if (e.suspense && O(e.suspense.inFallback)) return e.suspense.effects.push(e);
  const t = [e];
  for (; (e = e.owner) && (!e.updatedAt || e.updatedAt < v); )
    e.state && t.push(e);
  for (let s = t.length - 1; s >= 0; s--)
    if (e = t[s], e.state === w)
      $(e);
    else if (e.state === E) {
      const n = a;
      a = null, S(() => C(e, t[0]), !1), a = n;
    }
}
function S(e, t) {
  if (a) return e();
  let s = !1;
  t || (a = []), g ? s = !0 : g = [], v++;
  try {
    const n = e();
    return Z(s), n;
  } catch (n) {
    s || (g = null), a = null, G(n);
  }
}
function Z(e) {
  if (a && (k(a), a = null), e) return;
  const t = g;
  g = null, t.length && S(() => H(t), !1);
}
function k(e) {
  for (let t = 0; t < e.length; t++) M(e[t]);
}
function C(e, t) {
  e.state = 0;
  for (let s = 0; s < e.sources.length; s += 1) {
    const n = e.sources[s];
    if (n.sources) {
      const l = n.state;
      l === w ? n !== t && (!n.updatedAt || n.updatedAt < v) && M(n) : l === E && C(n, t);
    }
  }
}
function F(e) {
  for (let t = 0; t < e.observers.length; t += 1) {
    const s = e.observers[t];
    s.state || (s.state = E, s.pure ? a.push(s) : g.push(s), s.observers && F(s));
  }
}
function y(e) {
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
    for (t = e.tOwned.length - 1; t >= 0; t--) y(e.tOwned[t]);
    delete e.tOwned;
  }
  if (e.owned) {
    for (t = e.owned.length - 1; t >= 0; t--) y(e.owned[t]);
    e.owned = null;
  }
  if (e.cleanups) {
    for (t = e.cleanups.length - 1; t >= 0; t--) e.cleanups[t]();
    e.cleanups = null;
  }
  e.state = 0;
}
function z(e) {
  return e instanceof Error ? e : new Error(typeof e == "string" ? e : "Unknown error", {
    cause: e
  });
}
function G(e, t = h) {
  throw z(e);
}
function ee(e, t) {
  return O(() => e(t || {}));
}
function te(e, t, s) {
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
          let d = r, x = 1, U;
          for (; ++d < l && d < i && !((U = c.get(t[d])) == null || U !== p + x); )
            x++;
          if (x > p - o) {
            const V = t[r];
            for (; o < p; ) e.insertBefore(s[o++], V);
          } else e.replaceChild(s[o++], t[r++]);
        } else r++;
      else t[r++].remove();
    }
  }
}
const D = "_$DX_DELEGATE";
function se(e, t, s, n = {}) {
  let l;
  return X((i) => {
    l = i, t === document ? e() : R(t, e(), t.firstChild ? null : void 0, s);
  }, n.owner), () => {
    l(), t.textContent = "";
  };
}
function B(e, t, s) {
  let n;
  const l = () => {
    const r = document.createElement("template");
    return r.innerHTML = e, r.content.firstChild;
  }, i = () => (n || (n = l())).cloneNode(!0);
  return i.cloneNode = i, i;
}
function ne(e, t = window.document) {
  const s = t[D] || (t[D] = /* @__PURE__ */ new Set());
  for (let n = 0, l = e.length; n < l; n++) {
    const i = e[n];
    s.has(i) || (s.add(i), t.addEventListener(i, le));
  }
}
function R(e, t, s, n) {
  if (s !== void 0 && !n && (n = []), typeof t != "function") return m(e, t, n, s);
  _((l) => m(e, t(), l, s), n);
}
function le(e) {
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
function m(e, t, s, n, l) {
  for (; typeof s == "function"; ) s = s();
  if (t === s) return s;
  const i = typeof t, r = n !== void 0;
  if (e = r && s[0] && s[0].parentNode || e, i === "string" || i === "number") {
    if (i === "number" && (t = t.toString(), t === s))
      return s;
    if (r) {
      let o = s[0];
      o && o.nodeType === 3 ? o.data !== t && (o.data = t) : o = document.createTextNode(t), s = b(e, s, n, o);
    } else
      s !== "" && typeof s == "string" ? s = e.firstChild.data = t : s = e.textContent = t;
  } else if (t == null || i === "boolean")
    s = b(e, s, n);
  else {
    if (i === "function")
      return _(() => {
        let o = t();
        for (; typeof o == "function"; ) o = o();
        s = m(e, o, s, n);
      }), () => s;
    if (Array.isArray(t)) {
      const o = [], f = s && Array.isArray(s);
      if (N(o, t, s, l))
        return _(() => s = m(e, o, s, n, !0)), () => s;
      if (o.length === 0) {
        if (s = b(e, s, n), r) return s;
      } else f ? s.length === 0 ? L(e, o, n) : te(e, s, o) : (s && b(e), L(e, o));
      s = o;
    } else if (t.nodeType) {
      if (Array.isArray(s)) {
        if (r) return s = b(e, s, n, t);
        b(e, s, null, t);
      } else s == null || s === "" || !e.firstChild ? e.appendChild(t) : e.replaceChild(t, e.firstChild);
      s = t;
    }
  }
  return s;
}
function N(e, t, s, n) {
  let l = !1;
  for (let i = 0, r = t.length; i < r; i++) {
    let o = t[i], f = s && s[e.length], c;
    if (!(o == null || o === !0 || o === !1)) if ((c = typeof o) == "object" && o.nodeType)
      e.push(o);
    else if (Array.isArray(o))
      l = N(e, o, f) || l;
    else if (c === "function")
      if (n) {
        for (; typeof o == "function"; ) o = o();
        l = N(
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
function L(e, t, s = null) {
  for (let n = 0, l = t.length; n < l; n++) e.insertBefore(t[n], s);
}
function b(e, t, s, n) {
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
var ie = /* @__PURE__ */ B("<div class=main-container>"), oe = /* @__PURE__ */ B("<button class=chat-bubble>Message Us"), re = /* @__PURE__ */ B("<div class=message-box-container><button class=close-button>Close");
function fe() {
  const [e, t] = J(!1);
  return (() => {
    var s = ie();
    return R(s, (() => {
      var n = K(() => !e());
      return () => n() ? (() => {
        var l = oe();
        return l.$$click = () => t(!e()), l;
      })() : (() => {
        var l = re(), i = l.firstChild;
        return i.$$click = () => t(!e()), l;
      })();
    })()), s;
  })();
}
ne(["click"]);
function ue() {
  const e = document.createElement("div");
  e.id = "widget", document.body.appendChild(e);
}
ue();
const ce = document.getElementById("widget");
se(() => ee(fe, {}), ce);
