// ============================================================
// FEP2026 — Artist Recommendation Engine
// ============================================================

import { ARTISTS, getStage, timeToMinutes, timesOverlap } from './data.js';

/**
 * Build a genre profile from selected artists
 * Returns a Map<genre, weight> with weighted frequencies
 */
function buildGenreProfile(selectedIds) {
  const profile = new Map();
  let totalSelections = 0;

  for (const id of selectedIds) {
    const artist = ARTISTS.find(a => a.id === id);
    if (!artist) continue;
    totalSelections++;

    for (const genre of artist.genres) {
      profile.set(genre, (profile.get(genre) || 0) + 1);
    }
  }

  // Normalize weights
  if (totalSelections > 0) {
    for (const [genre, count] of profile) {
      profile.set(genre, count / totalSelections);
    }
  }

  return profile;
}

/**
 * Score an artist against a genre profile
 */
function scoreArtist(artist, profile) {
  if (artist.genres.length === 0) return 0;
  
  let score = 0;
  let matchedGenres = 0;

  for (const genre of artist.genres) {
    const weight = profile.get(genre) || 0;
    if (weight > 0) {
      score += weight;
      matchedGenres++;
    }
  }

  // Bonus for having multiple matching genres
  if (matchedGenres > 1) {
    score *= (1 + matchedGenres * 0.15);
  }

  return score;
}

/**
 * Get artist recommendations based on current selections
 * @param {Set<number>} selectedIds - Currently selected artist IDs
 * @param {boolean} hideConflicts - If true, exclude artists that conflict with selections
 * @param {number} maxResults - Maximum recommendations to return
 * @returns {Array<{artist, score, matchingGenres}>}
 */
export function getRecommendations(selectedIds, hideConflicts = false, maxResults = 8) {
  if (selectedIds.size === 0) return [];

  const profile = buildGenreProfile(selectedIds);
  const selectedArtists = ARTISTS.filter(a => selectedIds.has(a.id));
  const results = [];

  for (const artist of ARTISTS) {
    // Skip already selected
    if (selectedIds.has(artist.id)) continue;

    // Skip performance (Fuerza Bruta shows)
    if (artist.genres.includes('performance')) continue;

    // Optionally skip conflicts
    if (hideConflicts) {
      const hasConflict = selectedArtists.some(sel =>
        sel.day === artist.day &&
        timesOverlap(sel.startTime, sel.endTime, artist.startTime, artist.endTime)
      );
      if (hasConflict) continue;
    }

    const score = scoreArtist(artist, profile);
    if (score <= 0) continue;

    const matchingGenres = artist.genres.filter(g => profile.has(g) && profile.get(g) > 0);

    results.push({ artist, score, matchingGenres });
  }

  // Sort by score descending
  results.sort((a, b) => b.score - a.score);

  return results.slice(0, maxResults);
}

/**
 * Render recommendations panel
 */
export function renderRecommendations(selectedIds, targetEl, onAdd) {
  targetEl.innerHTML = '';

  if (selectedIds.size === 0) {
    targetEl.innerHTML = '<p class="rec-empty">Selecciona artistas para ver recomendaciones</p>';
    return;
  }

  const recommendations = getRecommendations(selectedIds, false, 8);

  if (recommendations.length === 0) {
    targetEl.innerHTML = '<p class="rec-empty">No hay más recomendaciones</p>';
    return;
  }

  const header = document.createElement('h3');
  header.textContent = '✨ También te puede gustar';
  targetEl.appendChild(header);

  for (const rec of recommendations) {
    const card = document.createElement('div');
    card.className = 'rec-card';
    
    const stage = getStage(rec.artist.stage);
    const dayLabels = { friday: 'Vie', saturday: 'Sáb', sunday: 'Dom' };
    
    // Check if it conflicts with existing selections
    const selectedArtists = ARTISTS.filter(a => selectedIds.has(a.id));
    const conflict = selectedArtists.find(sel =>
      sel.day === rec.artist.day &&
      timesOverlap(sel.startTime, sel.endTime, rec.artist.startTime, rec.artist.endTime)
    );

    card.innerHTML = `
      <div class="rec-info">
        <div class="rec-name">${rec.artist.name}</div>
        <div class="rec-meta">
          <span class="rec-day">${dayLabels[rec.artist.day]}</span>
          <span class="rec-time">${rec.artist.startTime}–${rec.artist.endTime}</span>
          <span class="rec-stage" style="color: ${stage.color}">${stage.name}</span>
        </div>
        <div class="rec-genres">${rec.matchingGenres.map(g => `<span class="genre-tag">${g}</span>`).join('')}</div>
        ${conflict ? `<div class="rec-conflict">⚠️ Conflicto con ${conflict.name}</div>` : ''}
      </div>
      <button class="rec-add" title="Agregar a mi agenda">+</button>
    `;

    card.querySelector('.rec-add').addEventListener('click', () => onAdd(rec.artist.id));
    targetEl.appendChild(card);
  }
}
