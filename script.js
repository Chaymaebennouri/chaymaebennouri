(function () {
  const KEY = "theme";
  const btn = document.getElementById("themeToggle");

  function applyTheme(theme) {
    // Dark is default, light mode uses a class
    const isLight = theme === "light";
    document.body.classList.toggle("light-mode", isLight);

    if (btn) btn.textContent = isLight ? "☀️ Light" : "🌙 Dark";
  }

  // Load saved preference
  const saved = localStorage.getItem(KEY);
  applyTheme(saved || "dark");

  // Toggle on click
  if (btn) {
    btn.addEventListener("click", () => {
      const next = document.body.classList.contains("light-mode") ? "dark" : "light";
      localStorage.setItem(KEY, next);
      applyTheme(next);
    });
  }
})();