// ===== Year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Theme picker (persisted) =====
// To add a theme: add a [data-theme="id"] block in styles.css,
// then add an entry here. That's it.
const THEMES = [
  { id: "dark", label: "AI Generated (dark)" },
  { id: "light", label: "AI Generated (light)" },
  { id: "game", label: "Game" },
  { id: "terminal", label: "Terminal" },
];
const DEFAULT_THEME = "dark";

const root = document.documentElement;
const themeBtn = document.getElementById("themeBtn");
const themeBtnLabel = document.getElementById("themeBtnLabel");
const themeMenu = document.getElementById("themeMenu");

function applyTheme(id) {
  const theme = THEMES.find((t) => t.id === id) || THEMES[0];
  root.setAttribute("data-theme", theme.id);
  localStorage.setItem("theme", theme.id);
  themeBtnLabel.textContent = theme.label;
  themeMenu.querySelectorAll("li").forEach((li) => {
    li.setAttribute("aria-selected", li.dataset.theme === theme.id ? "true" : "false");
  });
}

// Build the menu from THEMES
THEMES.forEach((t) => {
  const li = document.createElement("li");
  li.dataset.theme = t.id;
  li.setAttribute("role", "option");
  // swatch carries the theme's own colors via a temporary data-theme scope
  li.innerHTML = `<span class="swatch" data-theme="${t.id}"></span><span>${t.label}</span>`;
  li.addEventListener("click", () => {
    applyTheme(t.id);
    closeMenu();
  });
  themeMenu.appendChild(li);
});

// Give each swatch its theme's accent gradient
themeMenu.querySelectorAll(".swatch").forEach((sw) => {
  sw.style.background =
    getComputedStyle(sw).getPropertyValue("--accent-grad") ||
    getComputedStyle(sw).getPropertyValue("--accent");
});

function openMenu() {
  themeMenu.classList.add("open");
  themeBtn.setAttribute("aria-expanded", "true");
}
function closeMenu() {
  themeMenu.classList.remove("open");
  themeBtn.setAttribute("aria-expanded", "false");
}
themeBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  themeMenu.classList.contains("open") ? closeMenu() : openMenu();
});
document.addEventListener("click", (e) => {
  if (!document.getElementById("themePicker").contains(e.target)) closeMenu();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeMenu();
});

applyTheme(localStorage.getItem("theme") || DEFAULT_THEME);

// ===== Nav state + scroll progress =====
const nav = document.getElementById("nav");
const progress = document.getElementById("scrollProgress");
function onScroll() {
  const y = window.scrollY;
  nav.classList.toggle("scrolled", y > 24);
  const h = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ===== Reveal on scroll =====
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// ===== Count-up stats =====
const counters = document.querySelectorAll(".stat-num");
const counterIO = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.count;
      let cur = 0;
      const step = Math.max(1, Math.round(target / 24));
      const tick = () => {
        cur = Math.min(target, cur + step);
        el.textContent = cur;
        if (cur < target) requestAnimationFrame(tick);
      };
      tick();
      counterIO.unobserve(el);
    });
  },
  { threshold: 0.6 }
);
counters.forEach((c) => counterIO.observe(c));
