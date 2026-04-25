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

/* --- Papers: combined year + type filter --- */
let currentYear    = 'all';
let currentPubType = 'all';

function applyPaperFilters() {
  document.querySelectorAll('#publications .paper-card').forEach(card => {
    const group          = card.closest('.year-group');
    const yearMatch      = currentYear === 'all' || group.dataset.year === currentYear;
    const typeMatch      = currentPubType === 'all'
                        || (currentPubType === 'spotlight' ? card.dataset.spotlight === 'true' : card.dataset.pubType === currentPubType);
    card.classList.toggle('hidden', !(yearMatch && typeMatch));
  });

  document.querySelectorAll('#publications .year-group').forEach(group => {
    const yearMatch = currentYear === 'all' || group.dataset.year === currentYear;
    if (!yearMatch) {
      group.classList.add('hidden');
      return;
    }
    const hasVisible = [...group.querySelectorAll('.paper-card')].some(c => !c.classList.contains('hidden'));
    group.classList.toggle('hidden', !hasVisible);
  });
}

function filterPapers(year, btn) {
  document.querySelectorAll('#papersYearFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentYear = String(year);
  applyPaperFilters();
}

function filterPapersByType(type, btn) {
  document.querySelectorAll('#papersTypeFilterBar .filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  currentPubType = type;
  applyPaperFilters();
}

/* --- BibTeX toggle & copy --- */
function toggleBibtex(btn) {
  const card      = btn.closest('.paper-card');
  const bibtexDiv = card.querySelector('.paper-bibtex');
  const isOpen    = bibtexDiv.classList.toggle('open');
  if (isOpen) {
    btn.innerHTML = '<i class="fa-solid fa-xmark"></i> Close';
  } else {
    btn.innerHTML = '<i class="fa-solid fa-quote-left"></i> BibTeX';
  }
}

function copyBibtex(btn) {
  const pre = btn.closest('.paper-bibtex').querySelector('pre');
  navigator.clipboard.writeText(pre.textContent.trim()).then(() => {
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = 'Copy';
      btn.classList.remove('copied');
    }, 1800);
  });
}

/* --- Conference venue badge coloring --- */
(function colorVenueBadges() {
  const CONF_COLORS = {
    'ASPLOS': 'badge-conf-asplos',
    'HPCA':   'badge-conf-hpca',
    'MICRO':  'badge-conf-micro',
    'ISCA':   'badge-conf-isca',
    'IPDPS':  'badge-conf-ipdps',
    'ISMM':   'badge-conf-ismm',
    'CAL':    'badge-conf-cal',
    'YARCH':  'badge-conf-yarch',
  };
  document.querySelectorAll('.badge-venue-dyn').forEach(badge => {
    const text = badge.textContent.trim().toUpperCase();
    const match = text.match(/^([A-Z]+)/);
    if (!match) return;
    const cls = CONF_COLORS[match[1]];
    if (cls) {
      badge.classList.remove('badge-venue');
      badge.classList.add(cls);
    }
  });
})();

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
      const match = html.match(/class="gsc_rsb_std"[^>]*>([\d,]+)/);
      if (match) {
        badge.textContent = match[1] + ' citations';
        badge.classList.add('loaded');
      }
    })
    .catch(() => {});
})();
