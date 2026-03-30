/* ══════════════════════════════════════════════════
   APOD SURGE — NASA APOD Explorer
   script.js

   Replace DEMO_KEY with your free key from:
   https://api.nasa.gov
   ══════════════════════════════════════════════════ */

const NASA_KEY  = '8NbIc8RtemqFpGhg4ku7oifwPdysf1KH3MjcIglc';
const APOD_URL  = 'https://api.nasa.gov/planetary/apod';
const STORE_KEY = 'apodsurge_favourites';

/* ── Utilities ────────────────────────────────── */

function todayISO() {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, '0'),
    String(d.getDate()).padStart(2, '0')
  ].join('-');
}

function randomDate() {
  const start = new Date('1995-06-16').getTime();
  const end   = Date.now();
  const r     = new Date(start + Math.random() * (end - start));
  return [
    r.getFullYear(),
    String(r.getMonth() + 1).padStart(2, '0'),
    String(r.getDate()).padStart(2, '0')
  ].join('-');
}

function prettyDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function isValidDate(str) {
  return /^\d{4}-\d{2}-\d{2}$/.test(str) && !isNaN(Date.parse(str));
}

/* ── Toast ────────────────────────────────────── */
let toastTimer;
function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
}

/* ── Favourites ───────────────────────────────── */
function getFavs() {
  try { return JSON.parse(localStorage.getItem(STORE_KEY)) || []; }
  catch { return []; }
}
function setFavs(arr) { localStorage.setItem(STORE_KEY, JSON.stringify(arr)); }
function isFav(date)  { return getFavs().some(f => f.date === date); }

function addFav(apod) {
  const favs = getFavs();
  if (!favs.some(f => f.date === apod.date)) { favs.unshift(apod); setFavs(favs); }
}

function removeFav(date) {
  setFavs(getFavs().filter(f => f.date !== date));
}

/* ── Screen: show / clear ─────────────────────── */
function showLoader() {
  const inner = document.getElementById('screenInner');
  // Remove injected media
  inner.querySelectorAll('img, iframe').forEach(el => el.remove());
  document.getElementById('loaderState').hidden = false;
  document.getElementById('errorState').hidden  = true;
}

function showError(msg) {
  document.getElementById('loaderState').hidden = true;
  const errState = document.getElementById('errorState');
  errState.hidden = false;
  document.getElementById('errorMsg').textContent = msg;
}

function showMedia(apod) {
  const inner = document.getElementById('screenInner');
  inner.querySelectorAll('img, iframe').forEach(el => el.remove());
  document.getElementById('loaderState').hidden = true;
  document.getElementById('errorState').hidden  = true;
console.log(apod);
  if (apod.media_type === 'video') {
    const iframe = document.createElement('iframe');
    iframe.src   = apod.url;
    iframe.title = apod.title;
    iframe.allow = 'fullscreen';
    iframe.loading = 'lazy';
    inner.appendChild(iframe);
  } else {
    const img   = document.createElement('img');
    img.src     = apod.url;
    img.alt     = apod.title;
    img.loading = 'lazy';
    console.log(img);
    inner.appendChild(img);
  }
}

/* ── Render info card ─────────────────────────── */
let currentApod = null;

function renderInfo(apod) {
  const section = document.getElementById('infoSection');
  document.getElementById('infoTitle').textContent       = apod.title;
  document.getElementById('infoDate').textContent        = prettyDate(apod.date);
  document.getElementById('infoDate').setAttribute('datetime', apod.date);
  document.getElementById('infoCopyright').textContent   = apod.copyright ? apod.copyright.trim() : '';

  // Explanation + read-more
  const explEl  = document.getElementById('infoExplanation');
  const fadeEl  = document.getElementById('explanationFade');
  const toggleBtn = document.getElementById('readToggle');

  explEl.textContent = apod.explanation || '';
  explEl.classList.remove('expanded');
  fadeEl.classList.remove('hidden');

  if (apod.explanation && apod.explanation.length > 280) {
    toggleBtn.hidden       = false;
    toggleBtn.textContent  = 'Read more ↓';
  } else {
    toggleBtn.hidden = true;
    fadeEl.classList.add('hidden');
  }

  // HD link
  const hdLink = document.getElementById('hdLink');
  if (apod.hdurl && apod.media_type !== 'video') {
    hdLink.href   = apod.hdurl;
    hdLink.hidden = false;
  } else {
    hdLink.hidden = true;
  }

  updateFavBtn(apod.date);
  section.hidden = false;
}

function updateFavBtn(date) {
  const btn   = document.getElementById('favBtn');
  const label = document.getElementById('favBtnLabel');
  if (isFav(date)) {
    btn.classList.add('saved');
    label.textContent = 'SAVED ♥';
  } else {
    btn.classList.remove('saved');
    label.textContent = 'ADD TO FAVOURITES';
  }
}

/* ── Fetch APOD ───────────────────────────────── */
async function fetchAPOD(date) {
  showLoader();
  document.getElementById('infoSection').hidden = true;
  currentApod = null;

  try {
    const res  = await fetch(`${APOD_URL}?api_key=${NASA_KEY}&date=${date}&thumbs=true`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.msg || `Error ${res.status}`);
    }
    const data = await res.json();
    currentApod = data;
    showMedia(data);
    renderInfo(data);
    renderFavs();
  } catch (e) {
    showError(e.message || 'Something went wrong. Please try again.');
  }
}

/* ── Render Favourites ────────────────────────── */
function renderFavs() {
  const grid  = document.getElementById('favsGrid');
  const empty = document.getElementById('favsEmpty');
  const favs  = getFavs();

  grid.innerHTML = '';

  if (favs.length === 0) {
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  favs.forEach((apod, i) => {
    const card = document.createElement('article');
    card.className = 'fav-card';
    card.style.animationDelay = `${i * 0.05}s`;

    let thumbHTML;
    if (apod.media_type === 'video') {
      const thumb = apod.thumbnail_url;
      thumbHTML = thumb
        ? `<img class="fav-thumb" src="${thumb}" alt="${escHtml(apod.title)}" loading="lazy" />`
        : `<div class="fav-thumb-video">▶</div>`;
    } else {
      thumbHTML = `<img class="fav-thumb" src="${apod.url}" alt="${escHtml(apod.title)}" loading="lazy" />`;
    }

    card.innerHTML = `
      ${thumbHTML}
      <div class="fav-card-body">
        <div class="fav-card-date">${apod.date}</div>
        <h4 class="fav-card-title">${escHtml(apod.title)}</h4>
        <div class="fav-card-actions">
          <button class="btn-view-small" data-date="${apod.date}">View →</button>
          <button class="btn-remove-small" title="Remove" data-date="${apod.date}">✕</button>
        </div>
      </div>`;

    card.querySelector('.btn-view-small').addEventListener('click', () => {
      document.getElementById('dateInput').value = apod.date;
      fetchAPOD(apod.date);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    card.querySelector('.btn-remove-small').addEventListener('click', e => {
      e.stopPropagation();
      removeFav(apod.date);
      showToast('Removed from favourites');
      renderFavs();
      if (currentApod && currentApod.date === apod.date) updateFavBtn(apod.date);
    });

    grid.appendChild(card);
  });
}

/* ── Escape HTML helper ───────────────────────── */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* ── Auto-format date input ───────────────────── */
function autoFormatDate(input) {
  let v = input.value.replace(/\D/g, '');
  if (v.length > 4)  v = v.slice(0,4) + '-' + v.slice(4);
  if (v.length > 7)  v = v.slice(0,7) + '-' + v.slice(7,9);
  input.value = v.slice(0, 10);
}

/* ── Init ─────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  const dateInput = document.getElementById('dateInput');
  const today     = todayISO();

  // Today button
  document.getElementById('todayBtn').addEventListener('click', () => {
    dateInput.value = today;
    fetchAPOD(today);
  });

  // Random button
  document.getElementById('randomBtn').addEventListener('click', () => {
    const d = randomDate();
    dateInput.value = d;
    fetchAPOD(d);
  });

  // Auto-format & fetch on Enter
  dateInput.addEventListener('input', () => autoFormatDate(dateInput));
  dateInput.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
      const val = dateInput.value.trim();
      if (!isValidDate(val)) { showToast('Use format YYYY-MM-DD'); return; }
      fetchAPOD(val);
    }
  });

  // Read more toggle
  document.getElementById('readToggle').addEventListener('click', () => {
    const explEl  = document.getElementById('infoExplanation');
    const fadeEl  = document.getElementById('explanationFade');
    const btn     = document.getElementById('readToggle');
    const expanded = explEl.classList.toggle('expanded');
    btn.textContent = expanded ? 'Read less ↑' : 'Read more ↓';
    fadeEl.classList.toggle('hidden', expanded);
  });

  // Fav button
  document.getElementById('favBtn').addEventListener('click', () => {
    if (!currentApod) return;
    if (isFav(currentApod.date)) {
      removeFav(currentApod.date);
      showToast('Removed from favourites');
    } else {
      addFav(currentApod);
      showToast('♥ Added to favourites');
    }
    updateFavBtn(currentApod.date);
    renderFavs();
  });

  // Initial render
  renderFavs();
  dateInput.value = today;
  fetchAPOD(today);
});