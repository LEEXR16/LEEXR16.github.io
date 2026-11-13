/* Site engine. Content lives in data/content.js; you should not need to edit this file. */
(function () {
  "use strict";
  var S = window.SITE, P = window.PROJECTS, PAGE = document.body.dataset.page;
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* text helper: escapes HTML and highlights [placeholders] */
  function t(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
      .replace(/\[([^\]]+)\]/g, '<span class="todo">[$1]</span>');
  }
  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function slot(path, cls, label) {
    return '<div class="slot ' + (cls || "") + '" data-img="' + path + '"><div class="ph"><b>IMAGE SLOT</b>' +
      t(label || "") + "<br>" + path + ".jpg</div></div>";
  }
  var AREAS = { upper: "Upper limb", lower: "Lower limb", balance: "Balance", trunk: "Trunk", hand: "Hand", other: "Other" };

  /* ---------- nav + footer ---------- */
  var pages = [["index.html", "Home", "home"], ["projects.html", "Projects", "projects"], ["publications.html", "Patents", "publications"], ["about.html", "About", "about"], ["contact.html", "Contact", "contact"]];
  var initials = S.name.split(/\s+/).map(function (w) { return w[0]; }).join("");
  $("#nav").innerHTML =
    '<nav class="nav"><div class="wrap"><a class="logo" href="index.html">' + "AKA<b>_</b>" + t(S.callsign) + "<i></i></a>" +
    '<button class="burger" aria-label="Menu">MENU</button><div class="nav-links">' +
    pages.map(function (p) {
      var on = p[2] === PAGE || (PAGE === "project" && p[2] === "projects");
      return '<a href="' + p[0] + '"' + (on ? ' class="on"' : "") + ">" + p[1] + "</a>";
    }).join("") +
    '</div><div class="clock"><b>&#9679;</b> IST <span id="clk">--:--:--</span></div></div></nav>';
  $("#foot").innerHTML =
    '<footer><div class="wrap"><span>&copy; ' + new Date().getFullYear() + " " + t(S.name) + "</span><span>" +
    t(S.title) + " // " + t(S.field) + "</span><span>Built by hand, hosted on GitHub Pages</span></div></footer>";
  $(".burger").addEventListener("click", function () { $(".nav-links").classList.toggle("open"); });
  function tick() {
    $("#clk").textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false });
  }
  tick(); setInterval(tick, 1000);

  /* ---------- card ---------- */
  function card(p, i) {
    return '<a class="card hud scan rv" href="project.html?id=' + p.id + '" data-area="' + p.area + '" data-group="' + (p.group ? 1 : 0) + '">' +
      '<span class="beam"></span>' + slot("assets/img/" + p.id + "/cover", "", p.name + " cover") +
      '<div class="card-body"><div class="card-meta"><span>P-' + pad(i + 1) + " // " + AREAS[p.area] + "</span>" +
      '<span class="st"><span class="dot ' + p.state + '"></span>' + t(p.status) + "</span></div>" +
      "<h3>" + t(p.name) + '</h3><div class="full">' + t(p.full) + "</div><p>" + t(p.tagline) + "</p>" +
      '<div class="tags">' + p.tags.map(function (g) {
        return '<span class="tag' + (g === "Group project" ? " grp" : "") + '">' + t(g) + "</span>";
      }).join("") + "</div></div></a>";
  }

  /* ---------- page renderers ---------- */
  var R = {
    home: function () {
      $("#h-eyebrow").innerHTML = t(S.title) + " // " + t(S.field);
      var parts = S.name.split(" ");
      $("#h-name").innerHTML = '<span class="l"><span>' + t(parts[0]) + '</span></span><span class="l"><span>' + t(parts.slice(1).join(" ")) + "</span></span>";
      $("#h-lead").innerHTML = t(S.tagline);
      $("#h-bio").innerHTML = (S.dossier || S.bio.slice(0, 2)).map(function (b) { return "<p>" + t(b) + "</p>"; }).join("");
      $("#h-portrait").innerHTML = slot("assets/img/profile", "tall", "Your photo");
      var granted = window.PATENTS.filter(function (x) { return x.state === "granted"; }).length;
      var st = [[S.projectCount || P.length, "Projects"], [window.PATENTS.length, "Patents filed"], [granted, "Patent granted"], [window.PAPERS.length, "Papers published"]];
      $("#h-stats").innerHTML = st.map(function (s) {
        return '<div class="stat"><div class="n" data-count="' + s[0] + '">00</div><div class="k">' + s[1] + "</div></div>";
      }).join("");
      var tk = P.map(function (p) {
        return '<a href="project.html?id=' + p.id + '"><span class="tk"></span>' + t(p.name) + "</a>";
      }).join("");
      $("#h-ticker").innerHTML = tk + tk;
      var feat = (S.featured || []).map(function (id) { return P.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
      if (!feat.length) feat = P.filter(function (p) { return p.featured; });
      $("#h-featured").innerHTML = feat.map(function (p) { return card(p, P.indexOf(p)); }).join("");
      $("#h-domains").innerHTML = S.skills.map(function (g, i) {
        return '<div class="domain hud rv"><div class="idx">D-' + pad(i + 1) + "</div><h3>" + t(g.group) + "</h3><ul>" +
          g.items.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("");
      $("#h-process").innerHTML = S.process.map(function (s, i) {
        return '<div class="step hud rv' + (s.key ? " key" : "") + '"><div class="num">' + pad(i + 1) + "</div><h3>" + t(s.step) + "</h3><p>" + t(s.text) + "</p>" +
          (s.flag ? '<span class="tag grp flag">' + t(s.flag) + "</span>" : "") + "</div>";
      }).join("");
      $("#h-am").innerHTML = slot("assets/img/additive", "wide", "Workshop or prototype photo");
      typed($("#h-typed"), S.typed);
      sim();
      boot();
    },
    projects: function () {
      var f = [["all", "All"]].concat(Object.keys(AREAS).filter(function (a) {
        return a !== "other" && P.some(function (p) { return p.area === a; });
      }).map(function (a) { return [a, AREAS[a]]; }));
      if (P.some(function (p) { return p.group; })) f.push(["group", "Group projects"]);
      $("#p-filters").innerHTML = f.map(function (x, i) { return '<button data-f="' + x[0] + '"' + (i ? "" : ' class="on"') + ">" + x[1] + "</button>"; }).join("");
      $("#p-grid").innerHTML = P.map(card).join("");
      
      $$("#p-filters button").forEach(function (b) {
        b.addEventListener("click", function () {
          $$("#p-filters button").forEach(function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          var v = b.dataset.f;
          $$("#p-grid .card").forEach(function (c) {
            var show = v === "all" || (v === "group" ? c.dataset.group === "1" : c.dataset.area === v);
            c.classList.toggle("hide", !show);
          });
        });
      });
    },
    project: function () {
      var id = new URLSearchParams(location.search).get("id"), i = 0;
      P.forEach(function (p, k) { if (p.id === id) i = k; });
      var p = P[i], prev = P[(i - 1 + P.length) % P.length], next = P[(i + 1) % P.length];
      document.title = p.name + " // " + S.name;
      var g = "";
      for (var n = 1; n <= 6; n++) g += '<div class="hud rv">' + slot("assets/img/" + p.id + "/" + n, "sq", "Gallery " + n) + "</div>";
      $("#d-root").innerHTML =
        '<div class="crumb"><a href="projects.html">Projects</a> / P-' + pad(i + 1) + "</div>" +
        '<div class="eyebrow">' + AREAS[p.area] + (p.group ? " // Group project" : "") + "</div>" +
        "<h1>" + t(p.name) + '</h1><div class="detail-meta"><span>' + t(p.full) + '</span><span class="st"><span class="dot ' + p.state + '"></span>' + t(p.status) + "</span></div>" +
        '<p class="lead rv">' + t(p.tagline) + "</p>" +
        '<div class="hud rv" style="margin-top:36px">' + slot("assets/img/" + p.id + "/hero", "wide", p.name + " hero image") + "</div>" +
        '<div class="blocks"><div>' +
        '<div class="block rv"><h3>01 // Problem</h3><p>' + t(p.problem) + "</p></div>" +
        '<div class="block rv"><h3>02 // Approach</h3><p>' + t(p.approach) + "</p></div>" +
        '<div class="block rv"><h3>03 // Design and fabrication</h3><p>' + t(p.build) + "</p></div>" +
        '<div class="block rv"><h3>04 // My role</h3><p>' + t(p.role) + "</p></div></div>" +
        '<aside class="spec hud rv"><h3>System spec</h3><dl>' + p.specs.map(function (s) { return "<dt>" + t(s[0]) + "</dt><dd>" + t(s[1]) + "</dd>"; }).join("") +
        '</dl><div class="tags" style="margin-top:8px">' + p.tags.map(function (x) { return '<span class="tag' + (x === "Group project" ? " grp" : "") + '">' + t(x) + "</span>"; }).join("") + "</div></aside></div>" +
        '<div class="block rv" style="margin-top:20px"><h3>05 // Gallery</h3></div><div class="gallery">' + g + "</div>" +
        '<div class="pager"><a href="project.html?id=' + prev.id + '"><small>&larr; Previous</small>' + t(prev.name) + '</a><a href="project.html?id=' + next.id + '"><small>Next &rarr;</small>' + t(next.name) + "</a></div>";
    },
    publications: function () {
      var granted = window.PATENTS.filter(function (x) { return x.state === "granted"; }).length;
      var st = [[window.PATENTS.length, "Patent applications filed"], [granted, "Granted"], [window.PATENTS.length - granted, "In examination"], [window.PAPERS.length, "Papers published"]];
      $("#pb-stats").innerHTML = st.map(function (s) { return '<div class="stat"><div class="n" data-count="' + s[0] + '">00</div><div class="k">' + s[1] + "</div></div>"; }).join("");
      $("#pb-papers").innerHTML = window.PAPERS.map(function (x) {
        return '<div class="list-row rv"><div class="yr">' + t(x.year) + "</div><div><h3>" + t(x.title) + "</h3><p>" + t(x.authors).replace("R. K. Lishwanth", '<b style="color:var(--text);font-weight:500">R. K. Lishwanth</b>') + " &middot; " + t(x.venue) + '</p></div><a class="pill" href="' + x.link + '" target="_blank" rel="noopener">Read &rarr;</a></div>';
      }).join("");
      $("#pb-patents").innerHTML = window.PATENTS.map(function (x) {
        return '<div class="list-row rv"><div class="yr">' + t(x.year) + "</div><div><h3>" + t(x.title) + "</h3><p>" + t(x.number) + (x.desc ? " &middot; " + t(x.desc) : "") + '</p></div><span class="pill ' + x.state + '">' + (x.state === "granted" ? "Granted" : "In examination") + "</span></div>";
      }).join("");
    },
    about: function () {
      $("#a-portrait").innerHTML = slot("assets/img/profile", "tall", "Your photo");
      $("#a-bio").innerHTML = '<p class="lead" style="margin-bottom:20px;color:var(--text)">' + t(S.title) + "</p>" + (S.current ? '<p style="font-family:var(--mono);font-size:13px;letter-spacing:.06em">' + t(S.current) + "</p>" : "") + S.bio.map(function (b) { return "<p>" + t(b) + "</p>"; }).join("");
      $("#a-edu").innerHTML = S.education.map(function (e) {
        return '<div class="list-row rv"><div class="yr">' + t(e.year) + "</div><div><h3>" + t(e.what) + "</h3><p>" + t(e.where) + "</p></div><span></span></div>";
      }).join("");
      $("#a-skills").innerHTML = S.skills.map(function (g, i) {
        return '<div class="domain hud rv"><div class="idx">D-' + pad(i + 1) + "</div><h3>" + t(g.group) + "</h3><ul>" + g.items.map(function (x) { return "<li>" + t(x) + "</li>"; }).join("") + "</ul></div>";
      }).join("");
    },
    contact: function () {
      $("#c-links").innerHTML = S.links.map(function (l) {
        return '<a class="link hud scan rv" href="' + t(l.href).replace(/<[^>]+>/g, "") + '"' + (/^https?:/.test(l.href) ? ' target="_blank" rel="noopener"' : "") + '><span class="beam"></span><span class="k">' + t(l.label) + '</span><span class="v">' + t(l.value) + "</span></a>";
      }).join("");
    },
  };

  /* ---------- effects ---------- */
  function typed(el, words) {
    if (reduced) { el.innerHTML = "&gt; <b>" + words.join(" / ") + "</b>"; return; }
    var w = 0, c = 0, del = false;
    (function step() {
      var word = words[w];
      c += del ? -1 : 1;
      el.innerHTML = "&gt; <b>" + word.slice(0, c) + "</b><i></i>";
      var wait = del ? 35 : 70;
      if (!del && c === word.length) { del = true; wait = 1500; }
      else if (del && c === 0) { del = false; w = (w + 1) % words.length; wait = 300; }
      setTimeout(step, wait);
    })();
  }

  /* hero panel: a robot arm printing a spur gear with hub in isometric 3D.
     Coarse layers on the gear body, fine layers on the hub. Decorative, not live machine data. */
  function sim() {
    var cv = $("#cell"); if (!cv) return;
    var g = cv.getContext("2d"), cw = 0, TAU = Math.PI * 2, S = 0.85, CX = 150, CY = 208, tip = null;
    var INK = "rgba(236,238,241,0.9)", SOFT = "rgba(236,238,241,0.3)", BODY = "#33363c", AMB = "#ffb454";
    function P(X, Y, Z) { return [CX + (X - Y) * 0.866 * S, CY + (X + Y) * 0.5 * S - Z * S]; }
    var L = [], z = 0, total = 0, i;
    for (i = 0; i < 8; i++) { z += 3; L.push({ z: z, h: 0.3, gear: true, dur: 0.8 }); }
    for (i = 0; i < 16; i++) { z += 1.5; L.push({ z: z, h: 0.15, r: i < 13 ? 26 : 26 - (i - 12) * 1.7, dur: 0.42 }); }
    var ZMAX = z;
    L.forEach(function (l) {
      var pts = [], k, a;
      if (l.gear) {
        var n = 16, p = TAU / n;
        for (k = 0; k < n; k++) [[48, -0.25], [58, -0.1], [58, 0.1], [48, 0.25]].forEach(function (q) { a = (k + q[1]) * p; pts.push([q[0] * Math.cos(a), q[0] * Math.sin(a)]); });
      } else for (k = 0; k < 44; k++) { a = k * TAU / 44; pts.push([l.r * Math.cos(a), l.r * Math.sin(a)]); }
      l.pts = pts; l.t0 = total; total += l.dur;
    });
    var bore = []; for (i = 0; i < 22; i++) bore.push([11 * Math.cos(i * TAU / 22), 11 * Math.sin(i * TAU / 22)]);
    var CYCLE = total + 3.2;
    function poly(pts, zz, n) {
      for (var k = 0; k < (n == null ? pts.length : n); k++) { var q = P(pts[k][0], pts[k][1], zz); g[k ? "lineTo" : "moveTo"](q[0], q[1]); }
    }
    function quad(a, b, c, d) { g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); }
    function tube(a, b, w) {
      g.lineCap = "round";
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = INK; g.lineWidth = w + 2.4; g.stroke();
      g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.strokeStyle = BODY; g.lineWidth = w; g.stroke();
      g.lineCap = "butt";
    }
    function knuckle(p, r) {
      g.beginPath(); g.arc(p[0], p[1], r, 0, TAU); g.fillStyle = "#0c0d0f"; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke();
      g.beginPath(); g.arc(p[0], p[1], r * 0.35, 0, TAU); g.stroke();
    }
    /* industrial-arm parts: stacked cylinders, tapered cast links, bolted joint housings */
    function cyl(X, Y, z0, z1, R) {
      var a = P(X, Y, z0), b = P(X, Y, z1), rx = R * 1.2247 * S, ry = R * 0.7071 * S;
      g.beginPath(); g.moveTo(b[0] - rx, b[1]); g.lineTo(a[0] - rx, a[1]); g.ellipse(a[0], a[1], rx, ry, 0, Math.PI, 0, true); g.lineTo(b[0] + rx, b[1]); g.closePath();
      g.fillStyle = BODY; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.2; g.stroke();
      g.beginPath(); g.ellipse(b[0], b[1], rx, ry, 0, 0, TAU); g.fillStyle = "#43474e"; g.fill(); g.stroke();
    }
    function taper(a, b, ra, rb) {
      var an = Math.atan2(b[1] - a[1], b[0] - a[0]), cx = Math.cos(an), sy = Math.sin(an);
      g.beginPath(); g.arc(a[0], a[1], ra, an + Math.PI / 2, an + 1.5 * Math.PI); g.arc(b[0], b[1], rb, an - Math.PI / 2, an + Math.PI / 2); g.closePath();
      g.fillStyle = BODY; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.3; g.stroke();
      g.beginPath(); g.moveTo(a[0] + cx * ra * 1.5, a[1] + sy * ra * 1.5); g.lineTo(b[0] - cx * rb * 1.8, b[1] - sy * rb * 1.8); g.strokeStyle = SOFT; g.lineWidth = 1; g.stroke();
    }
    function disc(p, r, bolts) {
      g.beginPath(); g.arc(p[0], p[1], r, 0, TAU); g.fillStyle = "#0c0d0f"; g.fill(); g.strokeStyle = INK; g.lineWidth = 1.4; g.stroke();
      g.beginPath(); g.arc(p[0], p[1], r * 0.42, 0, TAU); g.stroke();
      g.fillStyle = "rgba(236,238,241,0.6)";
      for (var k = 0; k < bolts; k++) { g.beginPath(); g.arc(p[0] + r * 0.72 * Math.cos(k * TAU / bolts), p[1] + r * 0.72 * Math.sin(k * TAU / bolts), 0.9, 0, TAU); g.fill(); }
    }
    function prism(x0, y0, x1, y1, z0, z1) {
      g.lineWidth = 1.1; g.strokeStyle = "rgba(236,238,241,0.7)";
      quad(P(x0, y1, z1), P(x1, y1, z1), P(x1, y1, z0), P(x0, y1, z0)); g.fillStyle = "#26282d"; g.fill(); g.stroke();
      quad(P(x1, y0, z1), P(x1, y1, z1), P(x1, y1, z0), P(x1, y0, z0)); g.fillStyle = "#1e2024"; g.fill(); g.stroke();
      quad(P(x0, y0, z1), P(x1, y0, z1), P(x1, y1, z1), P(x0, y1, z1)); g.fillStyle = "#3a3d43"; g.fill(); g.stroke();
    }
    function cable(a, b, cx, cy) {
      g.lineCap = "round";
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(cx, cy, b[0], b[1]); g.strokeStyle = "rgba(236,238,241,0.55)"; g.lineWidth = 4.2; g.stroke();
      g.beginPath(); g.moveTo(a[0], a[1]); g.quadraticCurveTo(cx, cy, b[0], b[1]); g.strokeStyle = "#08090a"; g.lineWidth = 2.8; g.stroke();
      g.lineCap = "butt";
    }
    function box(x0, y0, x1, y1, th) {
      var a = P(x0, y0, 0), b = P(x1, y0, 0), c = P(x1, y1, 0), d = P(x0, y1, 0), b2 = P(x1, y0, -th), c2 = P(x1, y1, -th), d2 = P(x0, y1, -th);
      g.lineWidth = 1; g.strokeStyle = SOFT;
      quad(d, c, c2, d2); g.fillStyle = "#101113"; g.fill(); g.stroke();
      quad(b, c, c2, b2); g.fillStyle = "#0e0f11"; g.fill(); g.stroke();
      quad(a, b, c, d); g.fillStyle = "#17181b"; g.fill(); g.strokeStyle = "rgba(236,238,241,0.5)"; g.stroke();
    }
    function frame(ms) {
      var w = cv.clientWidth, dpr = window.devicePixelRatio || 1;
      if (w !== cw) { cw = w; cv.width = Math.round(w * dpr); cv.height = Math.round(w * 290 / 360 * dpr); }
      g.setTransform(cv.width / 360, 0, 0, cv.width / 360, 0, 0); g.clearRect(0, 0, 360, 290); g.lineJoin = "round";
      var t = reduced ? total + 1 : (ms / 1000) % CYCLE, done = 0, cur = null;
      L.forEach(function (l) { if (t >= l.t0 + l.dur) done++; else if (t >= l.t0) cur = l; });

      /* robot plinth, then build plate with grid */
      var BX = -15, BY = -140, H0 = 60, L1 = 114, L2 = 112, LT = 26;
      box(-85, -85, 85, 85, 7);
      g.strokeStyle = "rgba(236,238,241,0.09)"; g.lineWidth = 1; g.beginPath();
      [-42.5, 0, 42.5].forEach(function (v) {
        var a = P(v, -85, 0), b = P(v, 85, 0), c = P(-85, v, 0), d = P(85, v, 0);
        g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.moveTo(c[0], c[1]); g.lineTo(d[0], d[1]);
      });
      g.stroke();

      /* finished layers, bottom to top: each one hides what is behind it */
      for (var k = 0; k < done; k++) {
        var l = L[k], top = k === done - 1;
        g.beginPath(); poly(l.pts, l.z); g.closePath(); poly(bore, l.z); g.closePath();
        g.fillStyle = top ? "#24262a" : "#141518"; g.fill("evenodd");
        g.strokeStyle = "rgba(236,238,241," + (top ? 0.9 : l.gear ? 0.6 : 0.42) + ")"; g.lineWidth = l.gear ? 1.1 : 0.8; g.stroke();
      }

      /* layer being printed: the perimeter laid down so far */
      var target = [0, 0, ZMAX + 40];
      if (cur) {
        var f = (t - cur.t0) / cur.dur, n = cur.pts.length, pos = f * n, a0 = cur.pts[Math.floor(pos) % n], a1 = cur.pts[(Math.floor(pos) + 1) % n], u = pos % 1;
        target = [a0[0] + (a1[0] - a0[0]) * u, a0[1] + (a1[1] - a0[1]) * u, cur.z];
        g.beginPath(); poly(cur.pts, cur.z, Math.floor(pos) + 1);
        var q = P(target[0], target[1], cur.z); g.lineTo(q[0], q[1]);
        g.strokeStyle = AMB; g.lineWidth = 1.7; g.stroke();
      }
      if (!tip || reduced) tip = target;
      else tip = [tip[0] + (target[0] - tip[0]) * 0.25, tip[1] + (target[1] - tip[1]) * 0.25, tip[2] + (target[2] - tip[2]) * 0.25];

      /* industrial six-axis arm on a riser with a controller cabinet: turret, counterbalanced lower arm,
         rear drive pack on the forearm, sagging cable bundles and a pellet-style print head */
      var wx = tip[0], wy = tip[1], wz = tip[2] + LT, yaw = Math.atan2(wy - BY, wx - BX), r = Math.hypot(wx - BX, wy - BY), dz = wz - H0;
      var d = Math.min(Math.hypot(r, dz), L1 + L2 - 1), c2 = Math.max(-1, Math.min(1, (d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2))), q2 = Math.acos(c2);
      var q1 = Math.atan2(dz, r) + Math.atan2(L2 * Math.sin(q2), L1 + L2 * Math.cos(q2)), ux = Math.cos(yaw), uy = Math.sin(yaw);
      function onArm(dist) { return P(BX + dist * Math.cos(q1) * ux, BY + dist * Math.cos(q1) * uy, H0 + dist * Math.sin(q1)); }
      var sh = P(BX, BY, H0), el = onArm(L1), wr = P(wx, wy, wz), tp = P(tip[0], tip[1], tip[2]);
      prism(BX + 36, BY - 30, BX + 62, BY - 6, 0, 44);
      var v0 = P(BX + 62, BY - 26, 34), v1 = P(BX + 62, BY - 10, 34);
      g.strokeStyle = SOFT; g.beginPath(); [0, 4, 8].forEach(function (o) { g.moveTo(v0[0], v0[1] + o); g.lineTo(v1[0], v1[1] + o); }); g.stroke();
      var fl = P(BX + 49, BY - 6, 0), fb = P(BX + 8, BY + 22, 14);
      cable(fl, fb, (fl[0] + fb[0]) / 2, Math.max(fl[1], fb[1]) + 10);
      prism(BX - 25, BY - 25, BX + 25, BY + 25, 0, 14);
      cyl(BX, BY, 14, 19, 23); cyl(BX, BY, 19, 38, 16.5);
      tube(P(BX, BY, 38), sh, 23);
      tube(sh, P(BX - ux * 24, BY - uy * 24, H0), 13);
      var cb0 = P(BX - ux * 16, BY - uy * 16, 36), cb1 = onArm(L1 * 0.4), cbm = [cb0[0] + (cb1[0] - cb0[0]) * 0.6, cb0[1] + (cb1[1] - cb0[1]) * 0.6];
      g.beginPath(); g.moveTo(cbm[0], cbm[1]); g.lineTo(cb1[0], cb1[1]); g.strokeStyle = INK; g.lineWidth = 2; g.stroke();
      tube(cb0, cbm, 5.5);
      taper(sh, el, 12.5, 9.5);
      var fa = Math.atan2(wr[1] - el[1], wr[0] - el[0]), mb = [el[0] - Math.cos(fa) * 24, el[1] - Math.sin(fa) * 24];
      tube(el, mb, 14);
      taper(el, wr, 8.5, 5.2);
      /* cable bundles: base up to the elbow pack, then hanging under the forearm to the print head */
      var rear = P(BX - ux * 30, BY - uy * 30, H0 + 20);
      cable(P(BX - ux * 12, BY - uy * 12, 40), mb, rear[0] + (mb[0] - rear[0]) * 0.35, rear[1] + (mb[1] - rear[1]) * 0.35 - 10);
      var hd = [tp[0] + 6, wr[1] + 6];
      cable(el, hd, (el[0] + hd[0]) / 2, Math.max(el[1], hd[1]) + 12);
      /* print head: extruder body, side drive, heater block, nozzle */
      tube(wr, [tp[0], tp[1] - 14], 9.5);
      g.fillStyle = BODY; g.strokeStyle = INK; g.lineWidth = 1.1;
      g.fillRect(tp[0] + 4, wr[1] + 2, 8, 9); g.strokeRect(tp[0] + 4, wr[1] + 2, 8, 9);
      g.fillStyle = "#0c0d0f"; g.fillRect(tp[0] - 6, tp[1] - 13, 12, 5); g.strokeRect(tp[0] - 6, tp[1] - 13, 12, 5);
      disc(sh, 13.5, 8); disc(el, 11, 6); disc(wr, 6, 0);
      g.beginPath(); g.moveTo(tp[0], tp[1]); g.lineTo(tp[0] - 4, tp[1] - 8); g.lineTo(tp[0] + 4, tp[1] - 8); g.closePath(); g.fillStyle = AMB; g.fill();
      if (cur) { g.beginPath(); g.arc(tp[0], tp[1], 5, 0, TAU); g.fillStyle = "rgba(255,180,84,0.25)"; g.fill(); }

      var nl = done + (cur ? 1 : 0), zc = cur ? cur.z : (done ? L[done - 1].z : 0);
      $("#ly").textContent = ("00" + nl).slice(-3) + "/" + ("00" + L.length).slice(-3);
      $("#lh").textContent = cur ? cur.h.toFixed(2) + " mm" : "done";
      $("#zh").textContent = (zc * 0.1).toFixed(2) + " mm";
      $("#st").textContent = cur ? (cur.gear ? "gear body" : "hub, fine layers") : "complete";
      if (!reduced) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
    if (reduced) addEventListener("resize", function () { requestAnimationFrame(frame); });
  }

  function boot() {
    var b = $("#boot"); if (!b) return;
    var seen = false;
    try { seen = sessionStorage.getItem("booted") === "1"; sessionStorage.setItem("booted", "1"); } catch (e) {}
    if (seen || reduced) { b.classList.add("done"); return; }
    var lines = ["> AKA_" + S.callsign + " // IDENTITY CONFIRMED", "> CAD MODELS ............. <b>OK</b>", "> PRINT QUEUE ............ <b>OK</b>", "> ACTUATORS .............. <b>OK</b>", "> " + (S.projectCount || P.length) + " PROJECTS ONLINE", "> READY"];
    var pre = $("pre", b), i = 0;
    var end = function () { b.classList.add("done"); };
    b.addEventListener("click", end);
    (function next() {
      if (i >= lines.length) { setTimeout(end, 350); return; }
      pre.innerHTML += lines[i++] + "\n"; setTimeout(next, 210);
    })();
  }

  /* background: blueprint grid with a gear train, planetary gearbox, four-bar, slider-crank,
     a pick-and-place manipulator and a probe-and-drogue docking mechanism */
  function background() {
    var c = $("#bg"), x = c.getContext("2d"), W, H, mx = -9999, my = -9999, off = 0, trains = [], small = false;
    var TAU = Math.PI * 2, PI = Math.PI, INK = "rgba(255,255,255,0.2)", FAINT = "rgba(255,255,255,0.1)", TXT = "rgba(255,255,255,0.3)", AMB = "rgba(255,180,84,0.75)";
    function ease(u) { return u <= 0 ? 0 : u >= 1 ? 1 : u * u * (3 - 2 * u); }
    function mix(a, b, u) { return { x: a.x + (b.x - a.x) * u, y: a.y + (b.y - a.y) * u }; }
    function train(x0, y0, m, teeth, angles, speed) {
      var gs = [{ x: x0, y: y0, n: teeth[0], r: m * teeth[0] / 2 }];
      for (var i = 1; i < teeth.length; i++) {
        var p = gs[i - 1], r = m * teeth[i] / 2, a = angles[i - 1] * PI / 180;
        gs.push({ x: p.x + (p.r + r) * Math.cos(a), y: p.y + (p.r + r) * Math.sin(a), n: teeth[i], r: r, a: a });
      }
      return { m: m, gs: gs, speed: speed };
    }
    function size() {
      W = c.width = innerWidth; H = c.height = innerHeight; small = W < 760;
      var m = small ? 6 : 9;
      trains = [train(W - (small ? 30 : 110), small ? 120 : 150, m, [30, 14, 20], [152, 78], 0.16)];
      if (small) trains.push(train(20, H - 40, m, [26, 12, 18], [-28, -75], -0.2));
    }
    size(); addEventListener("resize", size);
    addEventListener("pointermove", function (e) {
      mx = e.clientX; my = e.clientY;
      var g = $("#glow"); g.style.left = mx + "px"; g.style.top = my + "px";
    });
    function teeth(cx, cy, n, th, rr, ro) {
      var p = TAU / n;
      x.beginPath();
      for (var i = 0; i < n; i++) {
        var a = th + i * p;
        x.lineTo(cx + rr * Math.cos(a - 0.25 * p), cy + rr * Math.sin(a - 0.25 * p));
        x.lineTo(cx + ro * Math.cos(a - 0.11 * p), cy + ro * Math.sin(a - 0.11 * p));
        x.lineTo(cx + ro * Math.cos(a + 0.11 * p), cy + ro * Math.sin(a + 0.11 * p));
        x.lineTo(cx + rr * Math.cos(a + 0.25 * p), cy + rr * Math.sin(a + 0.25 * p));
      }
      x.closePath();
    }
    function gear(g, th, m, plain) {
      var hot = Math.hypot(g.x - mx, g.y - my) < g.r + 30, col = hot ? "255,180,84" : "255,255,255";
      teeth(g.x, g.y, g.n, th, g.r - 1.25 * m, g.r + m);
      x.fillStyle = "rgba(" + col + ",0.018)"; x.fill();
      x.strokeStyle = "rgba(" + col + "," + (hot ? 0.5 : 0.17) + ")"; x.lineWidth = 1.2; x.stroke();
      x.beginPath(); x.arc(g.x, g.y, g.r * 0.2, 0, TAU); x.moveTo(g.x + g.r * 0.08, g.y); x.arc(g.x, g.y, g.r * 0.08, 0, TAU); x.stroke();
      if (g.n >= 16) {
        var holes = g.n >= 24 ? 6 : 4;
        x.beginPath();
        for (var k = 0; k < holes; k++) {
          var b = th + k * TAU / holes, hx = g.x + g.r * 0.55 * Math.cos(b), hy = g.y + g.r * 0.55 * Math.sin(b);
          x.moveTo(hx + g.r * 0.15, hy); x.arc(hx, hy, g.r * 0.15, 0, TAU);
        }
        x.stroke();
      }
      if (plain) return;
      var ro = g.r + m;
      x.save(); x.setLineDash([3, 6]); x.strokeStyle = "rgba(" + col + ",0.09)";
      x.beginPath(); x.arc(g.x, g.y, g.r, 0, TAU);
      x.moveTo(g.x - ro - 14, g.y); x.lineTo(g.x + ro + 14, g.y); x.moveTo(g.x, g.y - ro - 14); x.lineTo(g.x, g.y + ro + 14); x.stroke(); x.restore();
      x.fillStyle = "rgba(" + col + "," + (hot ? 0.75 : 0.28) + ")";
      x.fillText("Z" + g.n + "  m" + m + "  Ø" + Math.round(g.r * 2), g.x + 8, g.y - 8);
    }
    function joint(px, py, r) { x.beginPath(); x.arc(px, py, r, 0, TAU); x.fillStyle = "#0c0d0f"; x.fill(); x.stroke(); }
    function link(x1, y1, x2, y2, w) {
      var a = Math.atan2(y2 - y1, x2 - x1);
      x.beginPath(); x.arc(x1, y1, w, a + PI / 2, a + 1.5 * PI); x.arc(x2, y2, w, a - PI / 2, a + PI / 2); x.closePath();
      x.fillStyle = "rgba(12,13,15,0.8)"; x.fill(); x.stroke();
    }
    function ink() { x.lineWidth = 1.4; x.strokeStyle = INK; x.setLineDash([]); }
    function dash() { x.setLineDash([3, 6]); x.strokeStyle = FAINT; }

    /* planetary gearbox: fixed ring, driven sun, three planets on a carrier */
    function planetary(t) {
      var m = 6, Ns = 18, Np = 12, Nr = 42, cx = 100, cy = H - 24, Rs = m * Ns / 2, Rp = m * Np / 2, Rr = m * Nr / 2;
      var ths = t * 0.6, phc = ths * Ns / (Ns + Nr), pts = [];
      ink(); x.strokeStyle = "rgba(255,255,255,0.17)";
      teeth(cx, cy, Nr, 0, Rr + 1.25 * m, Rr - m); x.stroke();
      x.beginPath(); x.arc(cx, cy, Rr + 3.2 * m, 0, TAU); x.stroke();
      gear({ x: cx, y: cy, n: Ns, r: Rs }, ths, m, true);
      for (var i = 0; i < 3; i++) {
        var ph = phc + i * TAU / 3, p = { x: cx + (Rs + Rp) * Math.cos(ph), y: cy + (Rs + Rp) * Math.sin(ph), n: Np, r: Rp };
        gear(p, ph + PI + PI / Np - (ths - ph) * Ns / Np, m, true); pts.push(p);
      }
      x.strokeStyle = "rgba(255,180,84,0.28)"; x.beginPath();
      pts.forEach(function (p, i) { x[i ? "lineTo" : "moveTo"](p.x, p.y); }); x.closePath(); x.stroke();
      x.fillStyle = TXT; x.fillText("PLANETARY  Zs18 / Zp12 / Zr42   i = 3.33 : 1", 22, cy - Rr - 3.2 * m - 12);
    }

    /* slider-crank and four-bar crank-rocker */
    function linkages(t) {
      var ox = W * 0.42, oy = 122, r = 30, l = 120, a = t * 1.1;
      var cxp = ox + r * Math.cos(a), cyp = oy + r * Math.sin(a), sx = cxp + Math.sqrt(l * l - Math.pow(cyp - oy, 2));
      dash(); x.beginPath(); x.arc(ox, oy, r, 0, TAU); x.moveTo(ox - 50, oy); x.lineTo(ox + 215, oy); x.stroke();
      ink(); x.beginPath(); x.moveTo(ox, oy); x.lineTo(cxp, cyp); x.lineTo(sx, oy); x.stroke();
      x.strokeRect(sx - 20, oy - 13, 40, 26);
      x.beginPath(); x.moveTo(ox + 55, oy + 17); x.lineTo(ox + 212, oy + 17); x.moveTo(ox + 55, oy - 17); x.lineTo(ox + 212, oy - 17); x.stroke();
      joint(ox, oy, 5); joint(cxp, cyp, 4); joint(sx, oy, 4);
      x.fillStyle = TXT; x.fillText("SLIDER-CRANK  x = " + (sx - ox).toFixed(0) + " mm", ox + 60, oy - 26);

      var ax = 60, ay = H * 0.56, dx = ax + 150, dy = ay + 10, cr = 36, cp = 150, rk = 86, b = t * 0.9;
      var bx = ax + cr * Math.cos(b), by = ay + cr * Math.sin(b);
      var d = Math.hypot(dx - bx, dy - by), k = (cp * cp - rk * rk + d * d) / (2 * d), h = Math.sqrt(Math.max(0, cp * cp - k * k));
      var px = bx + k * (dx - bx) / d, py = by + k * (dy - by) / d, qx = px + h * (dy - by) / d, qy = py - h * (dx - bx) / d;
      dash(); x.beginPath(); x.arc(ax, ay, cr, 0, TAU); x.moveTo(ax, ay); x.lineTo(dx, dy); x.stroke();
      ink(); x.beginPath(); x.moveTo(ax, ay); x.lineTo(bx, by); x.lineTo(qx, qy); x.lineTo(dx, dy); x.stroke();
      joint(ax, ay, 5); joint(dx, dy, 5); joint(bx, by, 4); joint(qx, qy, 4);
      x.fillStyle = TXT; x.fillText("FOUR-BAR  θ = " + (((b * 180 / PI) % 360 + 360) % 360).toFixed(0) + "°", ax - 30, ay + cr + 22);
    }

    /* 3R manipulator doing pick-and-place with inverse kinematics */
    function arm(t) {
      var bx = W - 80, by = H - 78, L1 = 120, L2 = 100, L3 = 46, T = 12, cyc = Math.floor(t / T), u = (t % T) / T;
      var A = { x: bx - 190, y: H - 30 }, B = { x: bx - 90, y: H - 150 };
      var from = cyc % 2 ? B : A, to = cyc % 2 ? A : B, hf = { x: from.x, y: from.y - 40 }, ht = { x: to.x, y: to.y - 40 }, p, g;
      if (u < 0.12) { p = mix(hf, from, ease(u / 0.12)); g = 0; }
      else if (u < 0.2) { p = from; g = ease((u - 0.12) / 0.06); }
      else if (u < 0.32) { p = mix(from, hf, ease((u - 0.2) / 0.12)); g = 1; }
      else if (u < 0.58) { p = mix(hf, ht, ease((u - 0.32) / 0.26)); g = 1; }
      else if (u < 0.7) { p = mix(ht, to, ease((u - 0.58) / 0.12)); g = 1; }
      else if (u < 0.78) { p = to; g = 1 - ease((u - 0.7) / 0.06); }
      else { p = mix(to, ht, ease((u - 0.78) / 0.1)); g = 0; }
      var held = u >= 0.17 && u < 0.72, cube = held ? p : (u < 0.17 ? from : to);
      var wx = p.x, wy = p.y - L3, dx = wx - bx, dy = wy - by, d = Math.min(Math.hypot(dx, dy), L1 + L2 - 1);
      var a2 = Math.acos((d * d - L1 * L1 - L2 * L2) / (2 * L1 * L2)), phi = Math.atan2(dy, dx), k = Math.atan2(L2 * Math.sin(a2), L1 + L2 * Math.cos(a2));
      var a1 = Math.sin(phi - k) < Math.sin(phi + k) ? phi - k : phi + k;
      var ex = bx + L1 * Math.cos(a1), ey = by + L1 * Math.sin(a1);
      ink();
      x.beginPath(); x.moveTo(A.x - 34, A.y); x.lineTo(A.x + 34, A.y); x.moveTo(B.x - 28, B.y); x.lineTo(B.x + 28, B.y);
      x.moveTo(B.x + 28, B.y); x.lineTo(B.x + 28, B.y + 14); x.stroke();
      x.strokeRect(bx - 26, by + 6, 52, H - by); x.strokeRect(bx - 16, by - 4, 32, 10);
      dash(); x.beginPath(); x.moveTo(hf.x, hf.y); x.lineTo(ht.x, ht.y); x.moveTo(A.x, A.y); x.lineTo(A.x, A.y - 40); x.moveTo(B.x, B.y); x.lineTo(B.x, B.y - 40); x.stroke();
      ink();
      link(bx, by, ex, ey, 9); link(ex, ey, wx, wy, 7); link(wx, wy, wx, p.y - 18, 4.5);
      joint(bx, by, 7); joint(ex, ey, 6); joint(wx, wy, 5);
      var jaw = 7 + 8 * (1 - g);
      x.beginPath(); x.moveTo(p.x - 17, p.y - 16); x.lineTo(p.x + 17, p.y - 16);
      x.moveTo(p.x - jaw, p.y - 16); x.lineTo(p.x - jaw, p.y); x.moveTo(p.x + jaw, p.y - 16); x.lineTo(p.x + jaw, p.y); x.stroke();
      x.strokeStyle = held ? AMB : INK; x.strokeRect(cube.x - 7, cube.y - 14, 14, 14);
      x.fillStyle = TXT;
      x.fillText("3R MANIPULATOR  J1 " + (-a1 * 180 / PI).toFixed(0) + "°  J2 " + ((((a1 - Math.atan2(wy - ey, wx - ex)) * 180 / PI + 540) % 360) - 180).toFixed(0) + "°  GRIP " + (g > 0.5 ? "CLOSED" : "OPEN"), A.x - 60, H - 10);
    }

    /* probe-and-drogue docking: approach, soft capture, retraction, hard dock, release */
    function dock(t) {
      var ox = W * 0.47, oy = H - 70, u = t % 14, d, st, hook = 0;
      if (u < 5) { d = 170 - 144 * ease(u / 5); st = "APPROACH"; }
      else if (u < 6) { d = 26; st = "SOFT CAPTURE"; }
      else if (u < 8) { d = 26 * (1 - ease((u - 6) / 2)); st = "RETRACTING"; }
      else if (u < 11) { d = 0; hook = ease((u - 8) / 0.8); st = "HARD DOCK"; }
      else if (u < 12) { d = 0; hook = 1 - ease(u - 11); st = "UNLATCH"; }
      else { d = 170 * ease((u - 12) / 2); st = "DEPARTURE"; }
      var lp = Math.min(60, d + 34), xs = ox + d, cap = u >= 5 && u < 12, locked = hook > 0.9;
      dash(); x.beginPath(); x.moveTo(ox - 170, oy); x.lineTo(ox + 280, oy); x.stroke();
      ink();
      /* target vehicle with drogue cone and solar array */
      x.strokeRect(ox - 90, oy - 26, 82, 52);
      x.beginPath(); x.moveTo(ox, oy - 20); x.lineTo(ox - 34, oy - 4); x.moveTo(ox, oy + 20); x.lineTo(ox - 34, oy + 4); x.stroke();
      x.strokeRect(ox - 42, oy - 5, 8, 10);
      x.strokeRect(ox - 156, oy - 9, 54, 18);
      x.beginPath(); x.moveTo(ox - 102, oy); x.lineTo(ox - 90, oy); x.moveTo(ox - 138, oy - 9); x.lineTo(ox - 138, oy + 9); x.moveTo(ox - 120, oy - 9); x.lineTo(ox - 120, oy + 9);
      x.moveTo(ox - 60, oy - 26); x.lineTo(ox - 60, oy - 40); x.stroke();
      x.beginPath(); x.arc(ox - 60, oy - 46, 6, 0.15 * PI, 0.85 * PI); x.stroke();
      /* chaser vehicle with probe, guide petals and latch hooks */
      x.strokeRect(xs + 8, oy - 26, 82, 52);
      x.strokeRect(xs - lp, oy - 2, lp, 4);
      x.beginPath(); x.moveTo(xs, oy - 20); x.lineTo(xs - 10, oy - 28); x.moveTo(xs, oy + 20); x.lineTo(xs - 10, oy + 28);
      x.moveTo(xs + 60, oy - 26); x.lineTo(xs + 60, oy - 34); x.lineTo(xs + 74, oy - 34); x.stroke();
      if (st === "APPROACH" || st === "DEPARTURE") {
        var f = 5 + 4 * Math.abs(Math.sin(t * 23)), sgn = st === "APPROACH" ? 1 : -1;
        x.strokeStyle = AMB; x.beginPath();
        [-18, 18].forEach(function (o) { var px = sgn < 0 ? xs + 8 : xs + 90; x.moveTo(px, oy + o); x.lineTo(px + sgn * f, oy + o - 2); x.moveTo(px, oy + o); x.lineTo(px + sgn * f, oy + o + 2); });
        x.stroke();
      }
      x.strokeStyle = locked ? AMB : INK;
      x.strokeRect(ox - 8, oy - 34, 8, 68); x.strokeRect(xs, oy - 34, 8, 68);
      [-1, 1].forEach(function (sd) {
        var py = oy + sd * 34, an = PI - sd * (1 - hook) * 0.9, hx = xs + 4 + 15 * Math.cos(an), hy = py + 15 * Math.sin(an);
        x.beginPath(); x.moveTo(xs + 4, py); x.lineTo(hx, hy); x.lineTo(hx - 4 * Math.sin(an) * sd, hy - 4 * sd * -Math.cos(an)); x.stroke();
      });
      x.strokeStyle = cap ? AMB : INK; joint(xs - lp, oy, 4);
      x.fillStyle = TXT; x.fillText("DOCKING // " + st + "   RANGE " + (d / 100).toFixed(2) + " m", ox - 90, oy - 58);
    }

    function draw(ms) {
      var t = (ms || 0) / 1000 + scrollY * 0.004;
      x.clearRect(0, 0, W, H);
      x.font = "10px 'JetBrains Mono', monospace";
      off = (off + 0.12) % 48;
      x.setLineDash([]); x.strokeStyle = "rgba(255,255,255,0.035)"; x.lineWidth = 1; x.beginPath();
      for (var gx = -48 + off; gx < W; gx += 48) { x.moveTo(gx, 0); x.lineTo(gx, H); }
      for (var gy = -48 + off; gy < H; gy += 48) { x.moveTo(0, gy); x.lineTo(W, gy); }
      x.stroke();
      trains.forEach(function (tr) {
        var th = t * tr.speed * TAU / 4, prev = null;
        tr.gs.forEach(function (g) {
          /* each gear turns opposite to its driver, phased so teeth sit in gaps */
          if (prev) th = g.a + PI + PI / g.n - (th - g.a) * prev.n / g.n;
          x.setLineDash([]); gear(g, th, tr.m); prev = g;
        });
      });
      if (!small) { planetary(t); linkages(t); dock(t); arm(t); }
      x.setLineDash([]);
      if (!reduced) requestAnimationFrame(draw);
    }
    draw(0);
    if (reduced) addEventListener("scroll", function () { draw(0); });
  }

  /* cursor: a twist drill traced from a line-art reference. Tip (the click point) top left, plain shank to the lower right.
     Fluted body with S-curved flute grooves that scroll so the drill looks like it is spinning;
     amber and faster over links, plunges on click. */
  function cursor() {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    var PER = 12.5, K = Math.PI * 2 / PER, W = 3.8, Y1 = 46, PI = Math.PI, RISE = 12, SW = 5.2, SS = 0.35, UL = 0;
    function gx(u, w) { return w * ((1 - SS) * (2 * u - 1) - SS * Math.cos(PI * u)); }
    while (UL < 0.5 && gx(UL, SW) < -W) UL += 0.005;
    function body(ph) {
      var l = "", r = "", y, t, wr, wl;
      for (y = 0; y <= Y1 + 0.01; y += 0.5) {
        t = 0.45 + 0.55 * Math.min(1, y / 1.5);
        wr = t * (W + 0.3 * Math.cos(K * (y - ph + RISE * UL))); wl = t * (W + 0.3 * Math.cos(K * (y - ph + RISE * (1 - UL))));
        r += (r ? "L" : "M") + wr.toFixed(2) + " " + y; l = "L" + (-wl).toFixed(2) + " " + y + l;
      }
      return { fill: r + l + "Z", edge: l.replace(/^L/, "M") + "L" + r.slice(1).replace(/^/, "") };
    }
    function stroke(y0, w, rise, hmax) {
      var up = "", lo = "", i, u, cx, cy, h;
      for (i = 0; i <= 12; i++) {
        u = i / 12; cx = gx(u, w); cy = y0 + rise * u; h = 0.5 + hmax * Math.sin(PI * u);
        up += (up ? "L" : "M") + cx.toFixed(2) + " " + (cy - h).toFixed(2); lo = "L" + cx.toFixed(2) + " " + (cy + h).toFixed(2) + lo;
      }
      return up + lo + "Z";
    }
    function grooves(ph) { var d = "", k; for (k = 0; k < 5; k++) d += stroke(ph - RISE + k * PER, SW, RISE, 1.5); return d; }
    var el = document.createElement("div"); el.id = "tool-cursor";
    el.innerHTML = '<div class="gs"><svg width="1" height="1" style="overflow:visible"><defs><clipPath id="drillClip"><path d=""/></clipPath></defs><g transform="scale(-1 1) rotate(40)">' +
      '<path class="bt" d="M-3.6 44V66L-2.8 68H2.8L3.6 66V44Z"/>' +
      '<path class="bk" d=""/><path class="bf" d=""/><path class="gv" clip-path="url(#drillClip)" d=""/>' +
      '<path class="gv" d="' + stroke(42, 3.7, RISE, 1.4) + '"/><path class="bo" d=""/><path class="bl" d="M-1.5 55V65"/></g></svg></div>';
    document.body.appendChild(el); document.documentElement.classList.add("gc");
    var pc = $("clipPath path", el), pk = $(".bk", el), pf = $(".bf", el), pg = $(".gv", el), po = $(".bo", el), x = -99, y = -99, tx = -99, ty = -99, ph = 0;
    function draw() {
      var b = body(ph);
      pc.setAttribute("d", b.fill); pk.setAttribute("d", b.fill); pf.setAttribute("d", b.fill); po.setAttribute("d", b.edge); pg.setAttribute("d", grooves(ph));
    }
    draw();
    document.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; el.classList.add("on"); });
    document.addEventListener("pointerover", function (e) { el.classList.toggle("hot", !!(e.target.closest && e.target.closest("a,button,.card"))); });
    document.addEventListener("pointerdown", function () { el.classList.add("down"); });
    document.addEventListener("pointerup", function () { el.classList.remove("down"); });
    document.addEventListener("mouseout", function (e) { if (!e.relatedTarget) el.classList.remove("on"); });
    (function loop() {
      var nx = x + (tx - x) * 0.5, ny = y + (ty - y) * 0.5, moved = Math.hypot(nx - x, ny - y), hot = el.classList.contains("hot");
      if (!reduced) { ph = (ph + (hot ? 0.35 : 0.09) + moved * 0.12) % PER; draw(); }
      x = nx; y = ny;
      el.style.transform = "translate3d(" + x.toFixed(1) + "px," + y.toFixed(1) + "px,0)";
      requestAnimationFrame(loop);
    })();
  }

  function slots() {
    $$(".slot[data-img]").forEach(function (el) {
      var exts = ["jpg", "png", "webp", "jpeg"], k = 0, img = new Image();
      img.alt = "";
      img.onload = function () { el.appendChild(img); requestAnimationFrame(function () { el.classList.add("filled"); }); };
      img.onerror = function () { if (++k < exts.length) img.src = el.dataset.img + "." + exts[k]; };
      img.src = el.dataset.img + "." + exts[0];
    });
  }

  function reveal() {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("in"); io.unobserve(e.target);
        $$("[data-count]", e.target.parentNode).concat(e.target.matches("[data-count]") ? [e.target] : []).forEach(count);
      });
    }, { threshold: 0.08 });
    $$(".rv").forEach(function (el, i) { el.style.transitionDelay = (i % 3) * 80 + "ms"; io.observe(el); });
    $$(".stats").forEach(function (s) { s.classList.add("rv"); io.observe(s); });
  }
  function count(el) {
    if (el.dataset.done) return; el.dataset.done = 1;
    var end = +el.dataset.count, t0 = performance.now();
    (function f(now) {
      var k = Math.min(1, (now - t0) / 900);
      el.textContent = pad(Math.round(end * k));
      if (k < 1) requestAnimationFrame(f);
    })(t0);
  }

  function tilt() {
    if (reduced || !matchMedia("(hover:hover)").matches) return;
    $$(".card").forEach(function (c) {
      c.addEventListener("pointermove", function (e) {
        var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = "perspective(900px) rotateY(" + px * 5 + "deg) rotateX(" + -py * 5 + "deg) translateY(-4px)";
      });
      c.addEventListener("pointerleave", function () { c.style.transform = ""; });
    });
  }

  function transitions() {
    document.addEventListener("click", function (e) {
      var a = e.target.closest("a"); if (!a) return;
      var h = a.getAttribute("href");
      if (!h || h[0] === "#" || a.target === "_blank" || /^(mailto:|https?:)/.test(h) || !/\.html/.test(h) || e.metaKey || e.ctrlKey) return;
      e.preventDefault(); document.body.classList.add("leaving");
      setTimeout(function () { location.href = h; }, 180);
    });
    addEventListener("pageshow", function () { document.body.classList.remove("leaving"); document.body.classList.add("ready"); });
  }

  if (R[PAGE]) R[PAGE]();
  background(); slots(); reveal(); tilt(); transitions(); cursor();
  document.body.classList.add("ready");
})();
