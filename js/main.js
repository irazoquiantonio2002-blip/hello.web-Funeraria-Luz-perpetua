/* =============================================================
   FUNERARIA LUZ PERPETUA — Interacciones
   Pantalla de carga · nav móvil · header sticky · reveal on scroll
   · efecto máquina de escribir · partículas del hero · año dinámico
   ============================================================= */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. PANTALLA DE CARGA ---------- */
  window.addEventListener("load", function () {
    document.body.classList.add("loaded");
  });
  // Respaldo por si el evento load tarda demasiado
  setTimeout(function () { document.body.classList.add("loaded"); }, 2600);

  /* ---------- 2. AÑO DINÁMICO EN EL FOOTER ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3. HEADER STICKY ---------- */
  var header = document.getElementById("site-header");
  function onScrollHeader() {
    if (!header) return;
    header.classList.toggle("scrolled", window.scrollY > 40);
  }
  onScrollHeader();
  window.addEventListener("scroll", onScrollHeader, { passive: true });

  /* ---------- 4. NAVEGACIÓN MÓVIL ---------- */
  var navToggle = document.getElementById("nav-toggle");
  var mainNav = document.getElementById("main-nav");
  var navScrim = document.getElementById("nav-scrim");

  function closeNav() {
    document.body.classList.remove("nav-open");
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  if (navToggle && mainNav) {
    navToggle.addEventListener("click", function () {
      var open = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", open ? "true" : "false");
      navToggle.setAttribute("aria-label", open ? "Cerrar menú de navegación" : "Abrir menú de navegación");
    });
    mainNav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", closeNav);
    });
    if (navScrim) navScrim.addEventListener("click", closeNav);
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeNav();
    });
  }

  /* ---------- 5. REVEAL ON SCROLL ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  } else {
    var revObserver = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

    revealEls.forEach(function (el, i) {
      // Pequeño escalonado dentro de un mismo bloque
      el.style.transitionDelay = (i % 6) * 60 + "ms";
      revObserver.observe(el);
    });
  }

  /* ---------- 6. NAV LINK ACTIVO SEGÚN SECCIÓN ---------- */
  var sections = document.querySelectorAll("main section[id]");
  var navLinks = document.querySelectorAll(".main-nav .nav-link");
  if (sections.length && "IntersectionObserver" in window) {
    var secObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute("id");
          navLinks.forEach(function (l) {
            l.classList.toggle("active", l.getAttribute("href") === "#" + id);
          });
        }
      });
    }, { threshold: 0.5 });
    sections.forEach(function (s) { secObserver.observe(s); });
  }

  /* ---------- 7. EFECTO MÁQUINA DE ESCRIBIR ---------- */
  var twEl = document.getElementById("typewriter");
  if (twEl) {
    var words = (twEl.getAttribute("data-words") || "acompañamiento,respeto,serenidad")
      .split(",")
      .map(function (w) { return w.trim(); })
      .filter(Boolean);

    if (prefersReduced) {
      twEl.textContent = words[0] || "";
    } else {
      var wi = 0, ci = 0, deleting = false;
      var typeLoop = function () {
        var current = words[wi] || "";
        twEl.textContent = current.substring(0, ci);
        if (!deleting && ci < current.length) {
          ci++;
          setTimeout(typeLoop, 90);
        } else if (!deleting && ci === current.length) {
          deleting = true;
          setTimeout(typeLoop, 1900);
        } else if (deleting && ci > 0) {
          ci--;
          setTimeout(typeLoop, 45);
        } else {
          deleting = false;
          wi = (wi + 1) % words.length;
          setTimeout(typeLoop, 350);
        }
      };
      typeLoop();
    }
  }

  /* ---------- 8. PARTÍCULAS DEL HERO (luces suaves) ---------- */
  var canvas = document.getElementById("particles-canvas");
  if (canvas && canvas.getContext && !prefersReduced) {
    var ctx = canvas.getContext("2d");
    var particles = [];
    var raf = null;
    var hero = canvas.parentElement;

    function resize() {
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
      buildParticles();
    }

    function buildParticles() {
      var count = Math.min(70, Math.floor(canvas.width / 24));
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          r: Math.random() * 1.8 + 0.4,
          vy: -(Math.random() * 0.35 + 0.08),
          vx: (Math.random() - 0.5) * 0.18,
          a: Math.random() * 0.5 + 0.15
        });
      }
    }

    function tick() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
        if (p.x < -10) p.x = canvas.width + 10;
        if (p.x > canvas.width + 10) p.x = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(216, 186, 110, " + p.a + ")";
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    }

    resize();
    tick();
    window.addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      resize();
      tick();
    });
  }

  /* ---------- 9. PARALLAX SUTIL EN BANNERS (solo escritorio) ---------- */
  if (!prefersReduced && window.matchMedia("(min-width: 1025px)").matches) {
    var banners = document.querySelectorAll(".parallax-banner");
    window.addEventListener("scroll", function () {
      var vh = window.innerHeight;
      banners.forEach(function (b) {
        var rect = b.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < vh) {
          var offset = (rect.top - vh / 2) * 0.08;
          b.style.backgroundPositionY = "calc(50% + " + offset.toFixed(1) + "px)";
        }
      });
    }, { passive: true });
  }
})();
