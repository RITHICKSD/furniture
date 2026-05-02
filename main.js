/**
 * FURNIQUE — Global Logic
 * Handles Theme, RTL/LTR, Navigation, and Animations
 */

// Initialize Lucide Icons
if (window.lucide) {
  lucide.createIcons();
}

// State Management & Initialization
const init = () => {
  // Theme Persistence
  const savedTheme = localStorage.getItem('furnique-theme') || 'light';
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    updateThemeIcon(true);
  }

  // Direction Persistence
  const savedDir = localStorage.getItem('furnique-dir') || 'ltr';
  document.documentElement.setAttribute('dir', savedDir);
  updateLangText(savedDir);
  
  // Re-run icons in case they were updated by state
  if (window.lucide) lucide.createIcons();
};

const updateThemeIcon = (isDark) => {
  const icon = document.getElementById('themeIcon');
  if (icon) {
    icon.setAttribute('data-lucide', isDark ? 'sun' : 'moon');
    if (window.lucide) lucide.createIcons();
  }
};

const updateLangText = (dir) => {
  const langText = document.getElementById('lang-toggle-text');
  if (langText) {
    langText.textContent = dir.toUpperCase();
  }
};

// Global Toggles
window.toggleTheme = () => {
  const isDark = document.body.classList.toggle('dark');
  localStorage.setItem('furnique-theme', isDark ? 'dark' : 'light');
  updateThemeIcon(isDark);
};

window.toggleDir = () => {
  const h = document.documentElement;
  const currentDir = h.getAttribute('dir') || 'ltr';
  const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
  h.setAttribute('dir', newDir);
  localStorage.setItem('furnique-dir', newDir);
  updateLangText(newDir);
};

// Header Scroll Effect
window.addEventListener('scroll', () => {
  const header = document.getElementById('mainHeader');
  if (header) {
    header.classList.toggle('scrolled', window.scrollY > 50);
  }
});

// Navigation Logic
window.openMobileNav = () => {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  if (nav) nav.classList.add('open');
  if (overlay) overlay.classList.add('open');
  document.querySelectorAll('.mobile-sub').forEach(s => s.classList.remove('open'));
};

window.closeMobileNav = () => {
  const nav = document.getElementById('mobileNav');
  const overlay = document.getElementById('overlay');
  if (nav) nav.classList.remove('open');
  if (overlay) overlay.classList.remove('open');
};

window.toggleMobileSub = (id, e) => {
  if (e) e.preventDefault();
  const sub = document.getElementById(id);
  if (sub) sub.classList.toggle('open');
};

window.toggleHeaderDropdown = (el, e) => {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  const d = el.nextElementSibling;
  document.querySelectorAll('.dropdown').forEach(dd => {
    if (dd !== d) dd.classList.remove('open');
  });
  if (d) d.classList.toggle('open');
};

// Close dropdowns on outside click
window.addEventListener('click', (e) => {
  if (!e.target.closest('.nav > li')) {
    document.querySelectorAll('.dropdown').forEach(d => d.classList.remove('open'));
  }
});

// Dashboard Logic
window.toggleSidebar = () => {
  const s = document.querySelector('.sidebar');
  const o = document.querySelector('.sidebar-overlay');
  if (s && o) {
    s.classList.toggle('active');
    o.classList.toggle('active');
    const btn = document.querySelector('.menu-toggle i');
    if (btn) {
      btn.setAttribute('data-lucide', s.classList.contains('active') ? 'x' : 'menu');
      if (window.lucide) lucide.createIcons();
    }
  }
};

window.switchView = (viewId, el) => {
  document.querySelectorAll('.view-section').forEach(s => s.classList.remove('active'));
  const target = document.getElementById('view-' + viewId);
  if (target) target.classList.add('active');
  
  if (el) {
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    el.classList.add('active');
  }
  
  if (window.innerWidth <= 1024) {
    const s = document.querySelector('.sidebar');
    if (s && s.classList.contains('active')) window.toggleSidebar();
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Reveal Animations (Intersection Observer)
const revealOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Only reveal once
    }
  });
}, revealOptions);

const observeReveals = () => {
  document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => {
    revealObserver.observe(el);
  });
};

// Initialize on Load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    init();
    observeReveals();
  });
} else {
  init();
  observeReveals();
}
