/* =============================================================
   MAIN.JS — Filtering, toggles, nav active state
   ============================================================= */

/* --- Mobile menu --- */
document.getElementById('hamburger').addEventListener('click', () => {
  document.getElementById('mobileMenu').classList.toggle('open');
});

document.querySelectorAll('.mobile-menu a').forEach(a => {
  a.addEventListener('click', () => {
    document.getElementById('mobileMenu').classList.remove('open');
  });
});

/* --- News: position-based show/hide (first 10 visible, rest toggled) --- */
const NEWS_LIMIT = 10;
let newsExpanded  = false;
let currentFilter = 'all';

function applyNewsDisplay() {
  const allItems = [...document.querySelectorAll('#newsList .news-item')];
  const matching = allItems.filter(el =>
    currentFilter === 'all' || el.dataset.type.split(' ').includes(currentFilter)
  );

  allItems.forEach(el => el.classList.add('hidden'));
  matching.forEach((el, i) => {
    if (newsExpanded || i < NEWS_LIMIT) el.classList.remove('hidden');
  });

  const toggleBtn = document.getElementById('newsToggleBtn');
  if (toggleBtn) {
    const extra = matching.length - NEWS_LIMIT;
    if (extra > 0 && !newsExpanded) {
      toggleBtn.style.display = 'block';
      toggleBtn.textContent   = `Show ${extra} more`;
    } else if (newsExpanded && matching.length > NEWS_LIMIT) {
      toggleBtn.style.display = 'block';
      toggleBtn.textContent   = 'Show fewer';
    } else {
      toggleBtn.style.display = 'none';
    }
  }
}

function toggleOlderNews() {
  newsExpanded = !newsExpanded;
  applyNewsDisplay();
}

function filterNews(type, btn) {
  document.querySelectorAll('#newsFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentFilter = type;
  newsExpanded  = false;
  applyNewsDisplay();
}

applyNewsDisplay();

/* --- Papers: year filter --- */
function filterPapers(year, btn) {
  document.querySelectorAll('#papersFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.querySelectorAll('#publications .year-group').forEach(group => {
    const matches = year === 'all' || group.dataset.year === String(year);
    group.classList.toggle('hidden', !matches);
  });
}

/* --- Navbar: active section on scroll --- */
const SECTIONS = ['about', 'news', 'publications', 'service', 'contact'];
const NAV_H    = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));

function updateNavActive() {
  let current = 'about';
  for (const id of SECTIONS) {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - NAV_H - 8) current = id;
  }
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}

window.addEventListener('scroll', updateNavActive, { passive: true });
updateNavActive();

/* --- Back to top --- */
const backToTopBtn = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* --- Copy email --- */
function copyEmail(email, card) {
  navigator.clipboard.writeText(email).then(() => {
    card.classList.add('copied');
    setTimeout(() => card.classList.remove('copied'), 1800);
  });
}

/* --- Google Scholar citation count --- */
(function fetchScholarCount() {
  const link = document.querySelector('.scholar-link');
  if (!link) return;
  const scholarId = link.dataset.scholarId;
  if (!scholarId) return;
  const badge = document.getElementById('scholarCount');
  if (!badge) return;

  fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(
    `https://scholar.google.com/citations?user=${scholarId}&hl=en`
  )}`)
    .then(r => r.json())
    .then(data => {
      const html = data.contents || '';
      // Citation count is the first .gsc_rsb_std cell in the stats table
      const match = html.match(/class="gsc_rsb_std"[^>]*>([\d,]+)/);
      if (match) {
        badge.textContent = match[1] + ' citations';
        badge.classList.add('loaded');
      }
    })
    .catch(() => {});
})();
