/* NEURON ($NRN) site script. Your settings live in config.js; you shouldn't need to edit this file. */
(function () {
  "use strict";

  var root = document.documentElement;
  root.classList.add("reveal-on");

  function $(sel) { return document.querySelector(sel); }
  function $$(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
  function safe(fn) {
    try { fn(); } catch (err) { if (window.console && console.error) console.error(err); }
  }

  /* Scroll reveals run first, so nothing can get stuck hidden. */
  safe(function () {
    var items = $$(".reveal");
    if (!("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-in"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-in");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (el) { io.observe(el); });
  });

  /* Settings from config.js */
  var cfg = window.NRN_CONFIG || {};
  var found = String(cfg.contractAddress || "").match(/[1-9A-HJ-NP-Za-km-z]{32,44}/);
  var ca = found ? found[0] : "";
  var live = ca !== "";
  root.classList.toggle("is-live", live);

  function link(value, base, fallback) {
    var v = String(value || "").trim();
    if (!v) return fallback;
    if (v.charAt(0) === "@" && base) return base + v.slice(1);
    if (!/^https?:\/\//i.test(v)) v = "https://" + v.replace(/^\/+/, "");
    return v;
  }

  var links = {
    buy: link(cfg.buyUrl, "", live ? "https://pump.fun/coin/" + ca : "https://pump.fun"),
    chart: link(cfg.chartUrl, "", live ? "https://dexscreener.com/solana/" + ca : "https://dexscreener.com/solana"),
    x: link(cfg.x, "https://x.com/", "https://x.com/"),
    telegram: link(cfg.telegram, "https://t.me/", "https://t.me/")
  };

  /* Every link with data-link (or data-link-live / data-link-pre) points at the right place. */
  safe(function () {
    $$("[data-link], [data-link-live], [data-link-pre]").forEach(function (el) {
      var key = el.getAttribute(live ? "data-link-live" : "data-link-pre") || el.getAttribute("data-link");
      if (key && links[key]) el.setAttribute("href", links[key]);
    });
  });

  /* Contract address: fill it in and make every copy button work. */
  safe(function () {
    if (!live) return;
    var shortCa = ca.slice(0, 6) + "…" + ca.slice(-6);
    $$("[data-ca-full]").forEach(function (el) { el.textContent = ca; });
    $$("[data-ca-short]").forEach(function (el) { el.textContent = shortCa; });
    var status = $("#ca-status");
    $$("[data-copy-ca]").forEach(function (btn) {
      var timer = 0;
      btn.addEventListener("click", function () {
        copyText(ca).then(function () {
          btn.classList.add("is-copied");
          if (status) status.textContent = "Contract address copied";
          clearTimeout(timer);
          timer = setTimeout(function () {
            btn.classList.remove("is-copied");
            if (status) status.textContent = "";
          }, 1800);
        }, function () {
          window.prompt("Copy the contract address:", ca);
        });
      });
    });
  });

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "fixed";
      ta.style.top = "-1000px";
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      if (ok) { resolve(); } else { reject(new Error("copy failed")); }
    });
  }

  /* Mobile menu */
  safe(function () {
    var toggle = $(".nav__toggle");
    var menu = $("#mobile-menu");
    if (!toggle || !menu) return;
    function setMenu(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      menu.hidden = !open;
    }
    toggle.addEventListener("click", function () { setMenu(menu.hidden); });
    menu.addEventListener("click", function (e) {
      if (e.target.closest && e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !menu.hidden) { setMenu(false); toggle.focus(); }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth >= 768 && !menu.hidden) setMenu(false);
    });
  });

  /* Footer year */
  safe(function () {
    var y = $("#year");
    if (y) y.textContent = String(new Date().getFullYear());
  });

  /* Hero neural network: nodes drift, link up, and fire toward the cursor. */
  safe(function () {
    var canvas = $("#neural");
    if (canvas && canvas.getContext) neural(canvas, $(".hero"));
  });

  function neural(canvas, hero) {
    var g = canvas.getContext("2d");
    if (!g) return;
    var reduce = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var LINK = 140, LINK2 = LINK * LINK, REACH = 170, PUSH = 120;
    var w = 0, h = 0, nodes = [], raf = 0, running = false, onScreen = true;
    var mouse = { x: -9999, y: -9999 };

    function size(forceSeed) {
      var r = canvas.getBoundingClientRect();
      var nw = Math.max(1, r.width), nh = Math.max(1, r.height);
      var widthChanged = Math.abs(nw - w) > 1;
      w = nw;
      h = nh;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (forceSeed || widthChanged || !nodes.length) {
        var count = Math.round(Math.min(78, Math.max(30, (w * h) / 17000)));
        nodes = [];
        for (var i = 0; i < count; i++) {
          nodes.push({
            x: Math.random() * w,
            y: Math.random() * h,
            vx: (Math.random() - 0.5) * 0.28,
            vy: (Math.random() - 0.5) * 0.28
          });
        }
      }
    }

    function draw() {
      g.clearRect(0, 0, w, h);
      g.globalCompositeOperation = "lighter";
      for (var i = 0; i < nodes.length; i++) {
        var a = nodes[i];
        for (var j = i + 1; j < nodes.length; j++) {
          var b = nodes[j];
          var dx = a.x - b.x, dy = a.y - b.y, d2 = dx * dx + dy * dy;
          if (d2 < LINK2) {
            var t = 1 - Math.sqrt(d2) / LINK;
            g.strokeStyle = "rgba(56,232,255," + (t * 0.32).toFixed(3) + ")";
            g.lineWidth = t * 1.1;
            g.beginPath();
            g.moveTo(a.x, a.y);
            g.lineTo(b.x, b.y);
            g.stroke();
          }
        }
        var mx = a.x - mouse.x, my = a.y - mouse.y;
        var md = Math.sqrt(mx * mx + my * my);
        var near = md < REACH;
        if (near) {
          var tm = 1 - md / REACH;
          g.strokeStyle = "rgba(198,255,60," + (tm * 0.5).toFixed(3) + ")";
          g.lineWidth = tm * 1.3;
          g.beginPath();
          g.moveTo(a.x, a.y);
          g.lineTo(mouse.x, mouse.y);
          g.stroke();
        }
        g.fillStyle = near ? "rgba(198,255,60,0.95)" : "rgba(120,240,255,0.85)";
        g.beginPath();
        g.arc(a.x, a.y, near ? 2.6 : 1.7, 0, Math.PI * 2);
        g.fill();
      }
      g.globalCompositeOperation = "source-over";
    }

    function step() {
      for (var i = 0; i < nodes.length; i++) {
        var n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;
        var dx = n.x - mouse.x, dy = n.y - mouse.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        if (d < PUSH && d > 0.01) {
          n.x += (dx / d) * 0.4;
          n.y += (dy / d) * 0.4;
        }
        if (n.x < 0) { n.x = 0; n.vx = Math.abs(n.vx); } else if (n.x > w) { n.x = w; n.vx = -Math.abs(n.vx); }
        if (n.y < 0) { n.y = 0; n.vy = Math.abs(n.vy); } else if (n.y > h) { n.y = h; n.vy = -Math.abs(n.vy); }
      }
    }

    function frame() {
      step();
      draw();
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (running || reduce || !onScreen || document.hidden) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(raf);
    }

    size(true);
    draw();
    start();

    function resetMouse() { mouse.x = -9999; mouse.y = -9999; }
    window.addEventListener("pointermove", function (e) {
      var r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    }, { passive: true });
    window.addEventListener("mouseout", function (e) { if (!e.relatedTarget) resetMouse(); });
    window.addEventListener("blur", resetMouse);
    window.addEventListener("pointercancel", resetMouse);
    window.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") resetMouse(); }, { passive: true });

    var resizeRaf = 0;
    function onResize() {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(function () {
        size(false);
        if (!running) draw();
      });
    }
    if ("ResizeObserver" in window) new ResizeObserver(onResize).observe(canvas);
    else window.addEventListener("resize", onResize);

    if ("IntersectionObserver" in window && hero) {
      new IntersectionObserver(function (entries) {
        onScreen = entries[0].isIntersecting;
        if (onScreen) start(); else stop();
      }).observe(hero);
    }
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop(); else start();
    });
  }
})();
