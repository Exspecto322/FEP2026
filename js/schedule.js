// ============================================================
// FEP2026 — Schedule Grid Rendering & Interactions
// ============================================================

import { STAGES, DAYS, TIERS, getArtistsByDay, getStage, timeToMinutes, timesOverlap } from './data.js';

const GRID_START = 14 * 60;  // 14:00  
const GRID_END = (24 + 3) * 60; // 03:00 next day
const MINUTES_TOTAL = GRID_END - GRID_START; // 13 hours = 780 minutes
const ROW_HEIGHT_PER_MINUTE = 3; // px per minute

/**
 * Render the schedule grid for a given day
 */
export function renderScheduleGrid(dayId, selectedIds, onToggle) {
  const container = document.getElementById('schedule-grid');
  container.innerHTML = '';
  container.className = 'schedule-grid';

  const dayInfo = DAYS.find(d => d.id === dayId);
  const artists = getArtistsByDay(dayId).filter(a => !a.isClub);

  // Create time axis
  const timeAxis = document.createElement('div');
  timeAxis.className = 'time-axis';
  for (let h = 14; h <= 27; h++) { // 14:00 to 03:00 (27=03 next day)
    const label = document.createElement('div');
    label.className = 'time-label';
    const displayH = h >= 24 ? h - 24 : h;
    label.textContent = `${String(displayH).padStart(2, '0')}:00`;
    label.style.top = `${(h * 60 - GRID_START) * ROW_HEIGHT_PER_MINUTE}px`;
    timeAxis.appendChild(label);
  }
  container.appendChild(timeAxis);

  // Create stage columns
  const stagesContainer = document.createElement('div');
  stagesContainer.className = 'stages-container';

  for (const stage of STAGES) {
    if (stage.id === 'club') continue;

    const col = document.createElement('div');
    col.className = 'stage-column';
    col.dataset.stage = stage.id;

    // Stage header
    const header = document.createElement('div');
    header.className = 'stage-header';
    header.innerHTML = `<span class="stage-name">${stage.name}</span>`;
    header.style.borderBottomColor = stage.color;
    col.appendChild(header);

    // Artist blocks
    const stageArtists = artists.filter(a => a.stage === stage.id);
    const trackContainer = document.createElement('div');
    trackContainer.className = 'track-container';
    trackContainer.style.height = `${MINUTES_TOTAL * ROW_HEIGHT_PER_MINUTE}px`;

    // Time grid lines
    for (let h = 14; h <= 27; h++) {
      const line = document.createElement('div');
      line.className = 'grid-line';
      line.style.top = `${(h * 60 - GRID_START) * ROW_HEIGHT_PER_MINUTE}px`;
      trackContainer.appendChild(line);
    }

    for (const artist of stageArtists) {
      const block = createArtistBlock(artist, stage, selectedIds, onToggle);
      trackContainer.appendChild(block);
    }

    col.appendChild(trackContainer);
    stagesContainer.appendChild(col);
  }

  container.appendChild(stagesContainer);
}

/**
 * Create a single artist block element
 */
function createArtistBlock(artist, stage, selectedIds, onToggle) {
  const startMin = timeToMinutes(artist.startTime);
  const endMin = timeToMinutes(artist.endTime);
  const top = (startMin - GRID_START) * ROW_HEIGHT_PER_MINUTE;
  const height = (endMin - startMin) * ROW_HEIGHT_PER_MINUTE;

  const block = document.createElement('button');
  block.className = 'artist-block';
  block.dataset.artistId = artist.id;
  block.style.top = `${top}px`;
  block.style.height = `${Math.max(height, 30)}px`;
  block.style.setProperty('--stage-color', stage.color);

  // Add tier CSS class for hue tinting
  const tierInfo = TIERS[artist.tier];
  block.classList.add(tierInfo.css);

  if (selectedIds.has(artist.id)) {
    block.classList.add('selected');
  }

  // Check for conflicts
  const hasConflict = checkConflicts(artist, selectedIds);
  if (hasConflict) {
    block.classList.add('conflict');
  }

  const timeStr = `${artist.startTime} – ${artist.endTime}`;
  const showTierLabel = height >= 50; // Only show label if block is tall enough
  block.innerHTML = `
    <span class="artist-time">${timeStr}</span>
    <span class="artist-name">${artist.name}</span>
    ${showTierLabel ? `<span class="artist-tier" style="color:${tierInfo.color}">${tierInfo.short}</span>` : ''}
  `;

  block.addEventListener('click', (e) => {
    e.preventDefault();
    onToggle(artist.id);
  });

  return block;
}

/**
 * Check if an artist conflicts with any currently selected artist
 */
function checkConflicts(artist, selectedIds) {
  if (!selectedIds.has(artist.id)) return false;
  
  const { getArtistById } = require_data();
  for (const id of selectedIds) {
    if (id === artist.id) continue;
    const other = getArtistById(id);
    if (!other || other.day !== artist.day) continue;
    if (timesOverlap(artist.startTime, artist.endTime, other.startTime, other.endTime)) {
      return true;
    }
  }
  return false;
}

// Lazy import to avoid circular deps
let _dataModule = null;
function require_data() {
  if (!_dataModule) {
    _dataModule = { getArtistById: (id) => {
      const { ARTISTS } = window._fepData || {};
      return ARTISTS ? ARTISTS.find(a => a.id === id) : null;
    }};
  }
  return _dataModule;
}

/**
 * Get all conflicts for a given selection
 */
export function getConflicts(selectedIds, artists) {
  const conflicts = [];
  const selected = artists.filter(a => selectedIds.has(a.id));

  for (let i = 0; i < selected.length; i++) {
    for (let j = i + 1; j < selected.length; j++) {
      const a = selected[i];
      const b = selected[j];
      if (a.day !== b.day) continue;
      if (timesOverlap(a.startTime, a.endTime, b.startTime, b.endTime)) {
        conflicts.push([a, b]);
      }
    }
  }
  return conflicts;
}

/**
 * Update visual states after selection change
 */
export function updateSelectionVisuals(selectedIds) {
  // Update both grid blocks and list rows
  document.querySelectorAll('.artist-block, .list-row').forEach(el => {
    const id = parseInt(el.dataset.artistId);
    el.classList.toggle('selected', selectedIds.has(id));
  });

  // Re-check conflicts for selected items
  document.querySelectorAll('.artist-block.selected, .list-row.selected').forEach(el => {
    const id = parseInt(el.dataset.artistId);
    const artist = window._fepData?.ARTISTS?.find(a => a.id === id);
    if (!artist) return;

    let hasConflict = false;
    for (const otherId of selectedIds) {
      if (otherId === id) continue;
      const other = window._fepData?.ARTISTS?.find(a => a.id === otherId);
      if (!other || other.day !== artist.day) continue;
      if (timesOverlap(artist.startTime, artist.endTime, other.startTime, other.endTime)) {
        hasConflict = true;
        break;
      }
    }
    el.classList.toggle('conflict', hasConflict);
  });
}

/**
 * Render the compact list view for a given day
 */
export function renderScheduleList(dayId, selectedIds, onToggle) {
  const container = document.getElementById('schedule-grid');
  container.innerHTML = '';
  container.className = 'schedule-list-view';

  const artists = getArtistsByDay(dayId)
    .filter(a => !a.genres.includes('performance') && !a.isClub)
    .sort((a, b) => {
      const ta = timeToMinutes(a.startTime);
      const tb = timeToMinutes(b.startTime);
      if (ta !== tb) return ta - tb;
      return a.stage.localeCompare(b.stage);
    });

  // Group by time slot (hour)
  let currentHour = -1;

  for (const artist of artists) {
    const startMin = timeToMinutes(artist.startTime);
    const hour = Math.floor(startMin / 60);

    // Add hour separator
    if (hour !== currentHour) {
      currentHour = hour;
      const displayH = hour >= 24 ? hour - 24 : hour;
      const separator = document.createElement('div');
      separator.className = 'list-hour-separator';
      separator.textContent = `${String(displayH).padStart(2, '0')}:00`;
      container.appendChild(separator);
    }

    const stage = getStage(artist.stage);
    const isSelected = selectedIds.has(artist.id);
    const tierInfo = TIERS[artist.tier];

    // Check conflict
    let hasConflict = false;
    if (isSelected) {
      for (const otherId of selectedIds) {
        if (otherId === artist.id) continue;
        const other = window._fepData?.ARTISTS?.find(a => a.id === otherId);
        if (!other || other.day !== artist.day) continue;
        if (timesOverlap(artist.startTime, artist.endTime, other.startTime, other.endTime)) {
          hasConflict = true;
          break;
        }
      }
    }

    const row = document.createElement('button');
    row.className = `list-row ${tierInfo.css}${isSelected ? ' selected' : ''}${hasConflict ? ' conflict' : ''}`;
    row.dataset.artistId = artist.id;
    row.style.setProperty('--stage-color', stage.color);

    row.innerHTML = `
      <span class="list-check">${isSelected ? '✓' : ''}</span>
      <span class="list-time">${artist.startTime} – ${artist.endTime}</span>
      <span class="list-name">${artist.name}</span>
      <span class="list-tier-badge" style="background: ${tierInfo.color}20; color: ${tierInfo.color}; border-color: ${tierInfo.color}40">${tierInfo.short}</span>
      <span class="list-stage" style="color: ${stage.color}">
        <span class="list-stage-dot" style="background: ${stage.color}"></span>
        ${stage.name}
      </span>
      <span class="list-genres">${artist.genres.slice(0, 3).join(' · ')}</span>
    `;

    row.addEventListener('click', (e) => {
      e.preventDefault();
      onToggle(artist.id);
    });

    container.appendChild(row);
  }
}
