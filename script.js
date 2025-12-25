/* =========================================
   Portfolio UI Enhancements
   - Dark-first theme with persistence
   - Scroll spy: active nav link
   - Back-to-top button
   - Smooth anchor scrolling with header offset
   ========================================= */

(function () {
  const THEME_KEY = "theme"; // "dark" | "light"

  // -------- Theme handling (dark-first)
  function applyTheme(theme) {
    // theme: "dark" or "light"
    if (theme === "light") {
      document.body.classList.add("light");
    } else {
      document.body.classList.remove("light");
    }

    const btn = document.getElementById("themeToggle");
    if (btn) {
      const isLight = document.body.classList.contains("light");
      btn.textContent = isLight ? "☀️ Light" : "🌙 Dark";
      btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    }
  }

  function getSavedTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch { return null; }
  }

  function saveTheme(theme) {
    try { localStorage.setItem(THEME_KEY, theme); } catch {}
  }

  function initTheme() {
    // Default: dark. If user saved a preference, use it.
    const saved = getSavedTheme();
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
      return;
    }

    // Optional: respect system preference ONLY if no saved choice
    const prefersLight = window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    applyTheme(prefersLight ? "light" : "dark");
  }

  function toggleTheme() {
    const isLight = document.body.classList.contains("light");
    const next = isLight ? "dark" : "light";
    applyTheme(next);
    saveTheme(next);
  }

  // -------- Back-to-top button
  function ensureBackToTop() {
    if (document.getElementById("backToTop")) return;

    const wrap = document.createElement("div");
    wrap.id = "backToTop";
    wrap.innerHTML = `<button type="button" aria-label="Back to top">↑ Top</button>`;
    document.body.appendChild(wrap);

    wrap.querySelector("button").addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  function handleBackToTop() {
    const el = document.getElementById("backToTop");
    if (!el) return;
    if (window.scrollY > 700) el.classList.add("show");
    else el.classList.remove("show");
  }

  // -------- Smooth scrolling with header offset
  function getHeaderOffset() {
    const header = document.querySelector("header");
    return header ? header.getBoundingClientRect().height + 10 : 70;
  }

  function scrollToHash(hash) {
    const id = hash.replace("#", "");
    const target = document.getElementById(id);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.pageYOffset - getHeaderOffset();
    window.scrollTo({ top, behavior: "smooth" });
  }

  function wireAnchorLinks() {
    // Only intercept same-page anchors (#...)
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a");
      if (!a) return;

      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.getElementById(href.slice(1));
      if (!target) return;

      e.preventDefault();
      scrollToHash(href);
      history.replaceState(null, "", href);
    });

    // If page loads with a hash, adjust scroll after layout
    if (window.location.hash) {
      setTimeout(() => scrollToHash(window.location.hash), 50);
    }
  }

  // -------- Scroll spy (active nav link)
  function initScrollSpy() {
    const navLinks = Array.from(document.querySelectorAll("nav a"))
      .filter(a => (a.getAttribute("href") || "").startsWith("#"));

    if (navLinks.length === 0) return;

    const sections = navLinks
      .map(a => document.querySelector(a.getAttribute("href")))
      .filter(Boolean);

    const setActive = (id) => {
      navLinks.forEach(a => {
        const isMatch = a.getAttribute("href") === `#${id}`;
        a.classList.toggle("active", isMatch);
      });
    };

    // IntersectionObserver for better performance
    const headerOffset = getHeaderOffset();
    const observer = new IntersectionObserver((entries) => {
      // Pick the entry most visible
      const visible = entries
        .filter(en => en.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible && visible.target && visible.target.id) {
        setActive(visible.target.id);
      }
    }, {
      root: null,
      rootMargin: `-${headerOffset}px 0px -60% 0px`,
      threshold: [0.2, 0.35, 0.5, 0.65]
    });

    sections.forEach(sec => observer.observe(sec));
  }

  // -------- Init
  document.addEventListener("DOMContentLoaded", () => {
    initTheme();

    const btn = document.getElementById("themeToggle");
    if (btn) btn.addEventListener("click", toggleTheme);

    ensureBackToTop();
    handleBackToTop();
    window.addEventListener("scroll", handleBackToTop, { passive: true });

    wireAnchorLinks();
    initScrollSpy();
  });
})();
