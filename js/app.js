// ============================================================
// FEP2026 — Main App Controller
// ============================================================

import { ARTISTS, DAYS, STAGES, getClubes, getClubSeries, getArtistDisplayName, getArtistMetaLabel, timeToMinutes } from './data.js';
import { renderScheduleGrid, renderScheduleList, updateSelectionVisuals, getConflicts } from './schedule.js';
import { encodeSeed, decodeSeed, saveToHash, loadFromHash, saveToStorage, loadFromStorage, getShareableURL, exportAsText } from './seed.js';
import { parseMergeInputs, mergeSchedules, generateRoutePlan, renderMergedSchedule } from './merge.js';
import { renderRecommendations } from './recommend.js';

// ============================================================
// Global State
// ============================================================
window._fepData = { ARTISTS };

let selectedIds = new Set();
let currentDay = 'friday';
let currentView = 'schedule'; // 'schedule' | 'my-schedule' | 'merge' | 'clubes'
let currentLayout = 'grid'; // 'grid' | 'list'

// ============================================================
// Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  init();
});

function init() {
  // Load selection from URL hash first, then localStorage
  const hashSelection = loadFromHash();
  const storageSelection = loadFromStorage();
  selectedIds = hashSelection.size > 0 ? hashSelection : storageSelection;
  const initialDay = DAYS.find(day => day.id === currentDay);
  if (initialDay) {
    document.body.style.setProperty('--day-gradient', initialDay.themeGradient);
  }

  setupDayTabs();
  setupNavigation();
  setupViewToggle();
  setupMergePanel();
  setupSharePanel();
  setupSearch();
  renderCurrentDay();
  updateMySchedule();
  updateRecommendations();
  updateCounter();
  renderClubesPanel(); // Initial render for clubes panel

  // Listen for hash changes (e.g., navigating back)
  window.addEventListener('hashchange', () => {
    const newSelection = loadFromHash();
    selectedIds = newSelection;
    renderCurrentDay();
    updateMySchedule();
    updateRecommendations();
    updateCounter();
    renderClubesPanel();
  });
}

// ============================================================
// Day Tabs
// ============================================================
function setupDayTabs() {
  const tabsContainer = document.getElementById('day-tabs');
  
  for (const day of DAYS) {
    const tab = document.createElement('button');
    tab.className = `day-tab ${day.id === currentDay ? 'active' : ''}`;
    tab.dataset.day = day.id;
    tab.innerHTML = `<span class="day-label">${day.label}</span>`;
    tab.addEventListener('click', () => switchDay(day.id));
    tabsContainer.appendChild(tab);
  }
}

function switchDay(dayId) {
  currentDay = dayId;
  
  // Update tab visuals
  document.querySelectorAll('.day-tab').forEach(tab => {
    tab.classList.toggle('active', tab.dataset.day === dayId);
  });

  // Update background theme
  const dayInfo = DAYS.find(d => d.id === dayId);
  document.body.style.setProperty('--day-gradient', dayInfo.themeGradient);

  renderCurrentDay();
}

// ============================================================
// Navigation
// ============================================================
function setupNavigation() {
  document.getElementById('nav-schedule')?.addEventListener('click', () => setView('schedule'));
  document.getElementById('nav-my-schedule')?.addEventListener('click', () => setView('my-schedule'));
  document.getElementById('nav-merge')?.addEventListener('click', () => setView('merge'));
  document.getElementById('nav-clubes')?.addEventListener('click', () => setView('clubes'));
  
  document.getElementById('btn-clubes-desktop')?.addEventListener('click', () => {
    if (currentView === 'clubes') {
      setView('schedule');
    } else {
      setView('clubes');
    }
  });
}

function setView(view) {
  currentView = view;
  document.querySelectorAll('.view-panel').forEach(p => p.classList.remove('active'));
  document.getElementById(`panel-${view}`)?.classList.add('active');
  
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`nav-${view}`)?.classList.add('active');

  document.querySelector('.day-tabs-wrapper')?.classList.toggle('is-hidden', view !== 'schedule');

  const desktopBtn = document.getElementById('btn-clubes-desktop');
  if (desktopBtn) {
    if (view === 'clubes') {
      desktopBtn.textContent = '⬅ Volver a la Grilla';
      desktopBtn.classList.add('btn-primary');
      desktopBtn.classList.remove('btn-secondary');
    } else {
      desktopBtn.textContent = '🎉 Clubes';
      desktopBtn.classList.add('btn-secondary');
      desktopBtn.classList.remove('btn-primary');
    }
  }

  if (view === 'clubes') {
    renderClubesPanel();
  }

  if (view === 'my-schedule') {
    updateMySchedule();
  }
}

// ============================================================
// Schedule Rendering
// ============================================================
function renderCurrentDay() {
  if (currentLayout === 'list') {
    renderScheduleList(currentDay, selectedIds, toggleArtist);
  } else {
    renderScheduleGrid(currentDay, selectedIds, toggleArtist);
  }
}

// ============================================================
// View Toggle (Grid ↔ List)
// ============================================================
function setupViewToggle() {
  const toggle = document.getElementById('view-toggle');
  if (!toggle) return;

  toggle.addEventListener('click', () => {
    currentLayout = currentLayout === 'grid' ? 'list' : 'grid';
    toggle.setAttribute('aria-label', currentLayout === 'grid' ? 'Cambiar a lista' : 'Cambiar a grilla');
    toggle.querySelector('.toggle-icon').textContent = currentLayout === 'grid' ? '☰' : '▦';
    toggle.querySelector('.toggle-label').textContent = currentLayout === 'grid' ? 'Lista' : 'Grilla';
    renderCurrentDay();
  });
}

// ============================================================
// Artist Toggle
// ============================================================
function toggleArtist(artistId) {
  if (selectedIds.has(artistId)) {
    selectedIds.delete(artistId);
  } else {
    selectedIds.add(artistId);
  }

  saveToHash(selectedIds);
  saveToStorage(selectedIds);
  updateSelectionVisuals(selectedIds);
  updateMySchedule();
  updateRecommendations();
  updateCounter();
  renderClubesPanel(); // Re-render to show checkbox states
}

// ============================================================
// My Schedule Panel
// ============================================================
function updateMySchedule() {
  // Render into both desktop sidebar and mobile panel
  const panels = [
    document.getElementById('my-schedule-list'),
    document.getElementById('my-schedule-list-mobile'),
  ].filter(Boolean);

  for (const panel of panels) {
    panel.innerHTML = '';

    if (selectedIds.size === 0) {
      panel.innerHTML = '<p class="empty-state">Toca los artistas en la grilla para agregarlos a tu agenda</p>';
      continue;
    }

    const dayOrder = ['friday', 'saturday', 'sunday'];
    const dayLabels = { friday: 'Viernes 20', saturday: 'Sábado 21', sunday: 'Domingo 22' };

    // Show conflict summary
    const allConflicts = getConflicts(selectedIds, ARTISTS);
    if (allConflicts.length > 0) {
      const warning = document.createElement('div');
      warning.className = 'conflicts-summary';
      warning.innerHTML = `<p>⚠️ Tienes <strong>${allConflicts.length}</strong> conflicto${allConflicts.length > 1 ? 's' : ''} de horario</p>`;
      panel.appendChild(warning);
    }

    for (const dayId of dayOrder) {
      const dayArtists = ARTISTS
        .filter(a => selectedIds.has(a.id) && a.day === dayId)
        .sort((a, b) => {
          const ta = a.startTime < '06:00' ? '2' + a.startTime : '1' + a.startTime;
          const tb = b.startTime < '06:00' ? '2' + b.startTime : '1' + b.startTime;
          return ta.localeCompare(tb);
        });

      if (dayArtists.length === 0) continue;

      const daySection = document.createElement('div');
      daySection.className = 'my-day-section';
      daySection.innerHTML = `<h3 class="my-day-label">${dayLabels[dayId]}</h3>`;

      // Check conflicts within this day
      const conflicts = getConflicts(selectedIds, ARTISTS.filter(a => a.day === dayId));
      const conflictIds = new Set();
      for (const [a, b] of conflicts) {
        conflictIds.add(a.id);
        conflictIds.add(b.id);
      }

      for (const artist of dayArtists) {
        const stage = STAGES.find(s => s.id === artist.stage);
        const displayName = getArtistDisplayName(artist);
        const card = document.createElement('div');
        card.className = `my-artist-card ${conflictIds.has(artist.id) ? 'conflict' : ''}`;

        card.innerHTML = `
          <div class="my-artist-info">
            <div class="my-artist-time">${artist.startTime} – ${artist.endTime}</div>
            <div class="my-artist-name">${displayName} ${artist.isClub ? '<span class="club-tag-inline">🎉 CLUBES</span>' : ''}${artist.isSpecial ? ` <span class="special-tag-inline">${artist.specialLabel || 'Especial'}</span>` : ''}</div>
            <div class="my-artist-stage" style="color: ${stage.color}">${artist.isClub ? getArtistMetaLabel(artist) : stage.name}</div>
            ${conflictIds.has(artist.id) ? '<div class="conflict-badge">⚠️ Conflicto de horario</div>' : ''}
          </div>
          <button class="my-artist-remove" title="Quitar">✕</button>
        `;

        card.querySelector('.my-artist-remove').addEventListener('click', () => toggleArtist(artist.id));
        daySection.appendChild(card);
      }

      panel.appendChild(daySection);
    }
  }
}

// ============================================================
// Clubes Panel
// ============================================================
function renderClubesPanel() {
  const container = document.getElementById('clubes-list-container');
  if (!container) return;

  container.innerHTML = '';
  const dayLabels = { friday: 'Viernes 20', saturday: 'Sábado 21', sunday: 'Domingo 22' };
  const clubes = getClubes();
  const conflictIds = new Set();
  for (const [a, b] of getConflicts(selectedIds, ARTISTS)) {
    conflictIds.add(a.id);
    conflictIds.add(b.id);
  }

  // Group by day
  for (const dayId of ['friday', 'saturday', 'sunday']) {
    const dayClubes = clubes
      .filter(c => c.day === dayId)
      .sort((a, b) => timeToMinutes(a.startTime) - timeToMinutes(b.startTime));
    if (dayClubes.length === 0) continue;

    const section = document.createElement('div');
    section.className = 'clubes-day-section';
    section.innerHTML = `<h3 class="clubes-day-title">${dayLabels[dayId]}</h3>`;

    const groups = new Map();
    for (const club of dayClubes) {
      const key = `${club.clubSeries || 'club'}::${club.clubVenue || 'sin-sede'}`;
      if (!groups.has(key)) {
        groups.set(key, {
          seriesId: club.clubSeries,
          venue: club.clubVenue,
          items: [],
        });
      }
      groups.get(key).items.push(club);
    }

    const grid = document.createElement('div');
    grid.className = 'clubes-venue-grid';
    const seriesOrder = ['aora', 'rompe', 'coke'];

    for (const group of Array.from(groups.values()).sort((a, b) => {
      const aIndex = seriesOrder.indexOf(a.seriesId);
      const bIndex = seriesOrder.indexOf(b.seriesId);
      const seriesDelta = (aIndex === -1 ? 99 : aIndex) - (bIndex === -1 ? 99 : bIndex);
      if (seriesDelta !== 0) return seriesDelta;
      return (a.venue || '').localeCompare(b.venue || '');
    })) {
      const series = getClubSeries(group.seriesId);
      const seriesColor = series?.color || '#E91E63';
      const card = document.createElement('section');
      card.className = 'clubes-venue-card';

      card.innerHTML = `
        <div class="clubes-venue-head">
          <span class="clubes-series-badge" style="background: ${seriesColor}22; border-color: ${seriesColor}55; color: ${seriesColor};">${series?.label || 'Clubes'}</span>
          ${group.venue ? `<h4 class="clubes-venue-name">${group.venue}</h4>` : ''}
        </div>
      `;

      const list = document.createElement('div');
      list.className = 'clubes-entry-list';

      for (const club of group.items) {
        const isSelected = selectedIds.has(club.id);
        const hasConflict = isSelected && conflictIds.has(club.id);
        const displayName = getArtistDisplayName(club);
        const detailBits = [];
        if (club.isSpecial && club.specialNote) {
          detailBits.push(`<span class="clubes-entry-meta">${club.specialNote}</span>`);
        }
        if (hasConflict) {
          detailBits.push('<span class="clubes-entry-conflict">Conflicto</span>');
        }

        const row = document.createElement('button');
        row.className = `clubes-entry ${club.isSpecial ? 'special' : ''} ${isSelected ? 'selected' : ''} ${hasConflict ? 'conflict' : ''}`;
        row.dataset.artistId = club.id;

        row.innerHTML = `
          <span class="clubes-entry-check">${isSelected ? '✓' : ''}</span>
          <span class="clubes-entry-time">${club.startTime} – ${club.endTime}</span>
          <span class="clubes-entry-body">
            <span class="clubes-entry-name-row">
              <span class="clubes-entry-name">${displayName}</span>
              ${club.isSpecial ? `<span class="special-tag-inline special-tag-inline-card">${club.specialLabel || 'Especial'}</span>` : ''}
            </span>
            ${detailBits.length > 0 ? `<span class="clubes-entry-meta-row">${detailBits.join('')}</span>` : ''}
          </span>
        `;

        row.addEventListener('click', (e) => {
          e.preventDefault();
          toggleArtist(club.id);
        });

        list.appendChild(row);
      }

      card.appendChild(list);
      grid.appendChild(card);
    }

    section.appendChild(grid);
    container.appendChild(section);
  }
}

// ============================================================
// Recommendations
// ============================================================
function updateRecommendations() {
  // Render into both desktop and mobile recommendation panels
  const targets = [
    document.getElementById('recommendations'),
    document.getElementById('recommendations-mobile'),
  ].filter(Boolean);
  for (const target of targets) {
    renderRecommendations(selectedIds, target, toggleArtist);
  }
}

// ============================================================
// Counter Badge
// ============================================================
function updateCounter() {
  const count = selectedIds.size;
  // Mobile nav badge
  const badge = document.getElementById('selection-count');
  if (badge) {
    badge.textContent = count;
    badge.classList.toggle('has-items', count > 0);
  }
  // Desktop counter
  const desktopCount = document.getElementById('selection-count-desktop');
  if (desktopCount) {
    desktopCount.textContent = count;
  }
}

// ============================================================
// Share Panel
// ============================================================
function setupSharePanel() {
  // Helper to copy text to clipboard
  async function copyToClipboard(text, successMsg) {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMsg);
    } catch {
      // Fallback: create a temporary textarea
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast(successMsg);
    }
  }

  // Wire up copy-link buttons (desktop + mobile)
  for (const id of ['btn-copy-link', 'btn-copy-link-mobile']) {
    document.getElementById(id)?.addEventListener('click', () => {
      copyToClipboard(getShareableURL(selectedIds), '¡Link copiado!');
    });
  }

  // Wire up copy-text buttons (desktop + mobile)
  for (const id of ['btn-copy-text', 'btn-copy-text-mobile']) {
    document.getElementById(id)?.addEventListener('click', () => {
      copyToClipboard(exportAsText(selectedIds), '¡Agenda copiada!');
    });
  }

  // Load seed buttons (desktop + mobile)
  function handleLoadSeed(inputId) {
    const seedInput = document.getElementById(inputId);
    const input = seedInput?.value?.trim();
    if (!input) return;

    let seed = input;
    const hashMatch = input.match(/#s=(.+)$/);
    if (hashMatch) seed = hashMatch[1];

    const newSelection = decodeSeed(seed);
    if (newSelection.size > 0) {
      selectedIds = newSelection;
      saveToHash(selectedIds);
      saveToStorage(selectedIds);
      renderCurrentDay();
      updateMySchedule();
      updateRecommendations();
      updateCounter();
      renderClubesPanel();
      showToast(`¡Agenda cargada! (${newSelection.size} artistas)`);
    } else {
      showToast('Seed inválido');
    }
  }

  document.getElementById('btn-load-seed')?.addEventListener('click', () => handleLoadSeed('seed-input'));
  document.getElementById('btn-load-seed-mobile')?.addEventListener('click', () => handleLoadSeed('seed-input-mobile'));
}

// ============================================================
// Merge Panel
// ============================================================
function setupMergePanel() {
  // Initialize both desktop and mobile merge panels
  const panels = [
    { container: 'merge-inputs-desktop', addBtn: 'btn-add-merge-desktop', mergeBtn: 'btn-merge-desktop', result: 'merge-result-desktop' },
    { container: 'merge-inputs-mobile', addBtn: 'btn-add-merge-mobile', mergeBtn: 'btn-merge-mobile', result: 'merge-result-mobile' },
  ];

  for (const panel of panels) {
    const container = document.getElementById(panel.container);
    if (!container) continue;

    // Add initial 2 inputs
    addMergeInput(container, 1);
    addMergeInput(container, 2);

    // Add person button
    document.getElementById(panel.addBtn)?.addEventListener('click', () => {
      const count = container.querySelectorAll('.merge-input-row').length;
      addMergeInput(container, count + 1);
    });

    // Merge button
    document.getElementById(panel.mergeBtn)?.addEventListener('click', () => {
      const inputEls = container.querySelectorAll('.merge-input-row input');
      const inputs = [...inputEls].map(el => el.value.trim()).filter(Boolean);

      if (inputs.length < 2) {
        showToast('Necesitas al menos 2 agendas para combinar');
        return;
      }

      const schedules = parseMergeInputs(inputs);
      const merged = mergeSchedules(schedules);
      const resultEl = document.getElementById(panel.result);

      resultEl.innerHTML = '';

      const dayLabels = { friday: 'Viernes 20', saturday: 'Sábado 21', sunday: 'Domingo 22' };
      for (const [dayId, dayLabel] of Object.entries(dayLabels)) {
        const dayMerged = merged.filter(m => m.artist.day === dayId);
        if (dayMerged.length === 0) continue;

        const daySection = document.createElement('div');
        daySection.className = 'merge-day-section';
        daySection.innerHTML = `<h2>${dayLabel}</h2>`;

        const route = generateRoutePlan(schedules, dayId);
        renderMergedSchedule(dayMerged, route, daySection);
        resultEl.appendChild(daySection);
      }
    });
  }
}

function addMergeInput(container, num) {
  const row = document.createElement('div');
  row.className = 'merge-input-row';
  row.innerHTML = `
    <input type="text" placeholder="Seed o URL — Persona ${num}">
    <button class="btn btn-secondary btn-sm merge-use-mine" title="Usar mi agenda">🎵</button>
    <button class="btn btn-secondary btn-sm merge-remove-row" title="Quitar">✕</button>
  `;

  // "Use mine" button
  row.querySelector('.merge-use-mine').addEventListener('click', () => {
    row.querySelector('input').value = encodeSeed(selectedIds);
  });

  // Remove row button (only if more than 2 inputs remain)
  row.querySelector('.merge-remove-row').addEventListener('click', () => {
    if (container.querySelectorAll('.merge-input-row').length > 2) {
      row.remove();
    } else {
      showToast('Necesitas al menos 2 campos');
    }
  });

  container.appendChild(row);
}

// ============================================================
// Search
// ============================================================
function setupSearch() {
  const searchInput = document.getElementById('search-input');
  const searchResults = document.getElementById('search-results');

  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = '';

    if (query.length < 2) {
      searchResults.classList.remove('visible');
      return;
    }

    const matches = ARTISTS
      .filter(a => a.name.toLowerCase().includes(query) && !a.genres.includes('performance'))
      .sort((a, b) => {
        if (a.isClub !== b.isClub) return Number(a.isClub) - Number(b.isClub);
        return timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      })
      .slice(0, 8);

    if (matches.length === 0) {
      searchResults.classList.remove('visible');
      return;
    }

    searchResults.classList.add('visible');
    const dayLabels = { friday: 'Vie', saturday: 'Sáb', sunday: 'Dom' };

    for (const artist of matches) {
      const stage = STAGES.find(s => s.id === artist.stage);
      const metaLabel = artist.isClub ? `🎉 ${getArtistMetaLabel(artist)}` : stage.name;
      const displayName = getArtistDisplayName(artist);
      const item = document.createElement('button');
      item.className = `search-item ${selectedIds.has(artist.id) ? 'selected' : ''}`;
      item.innerHTML = `
        <span class="search-name">${displayName}${artist.isClub ? ' <span class="club-tag-inline">🎉 CLUBES</span>' : ''}${artist.isSpecial ? ` <span class="special-tag-inline">${artist.specialLabel || 'Especial'}</span>` : ''}</span>
        <span class="search-meta">${dayLabels[artist.day]} ${artist.startTime} · <span style="color:${stage.color}">${metaLabel}</span></span>
      `;
      item.addEventListener('click', () => {
        toggleArtist(artist.id);
        searchInput.value = '';
        searchResults.classList.remove('visible');
      });
      searchResults.appendChild(item);
    }
  });

  // Close search on click outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-wrapper')) {
      searchResults?.classList.remove('visible');
    }
  });
}

// ============================================================
// Toast Notification
// ============================================================
function showToast(message) {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.textContent = message;
  document.body.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}
