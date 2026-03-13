// ============================================================
// FEP2026 — Schedule Merging & Route Planning
// ============================================================

import { ARTISTS, DAYS, getStage, timeToMinutes, timesOverlap } from './data.js';
import { decodeSeed } from './seed.js';

/**
 * Parse multiple seed inputs (seeds or full URLs)
 * Returns array of { name, selections: Set<number> }
 */
export function parseMergeInputs(inputs) {
  return inputs.map((input, idx) => {
    let seed = input.trim();

    // Extract seed from URL if full URL provided
    const hashMatch = seed.match(/#s=(.+)$/);
    if (hashMatch) {
      seed = hashMatch[1];
    }

    // Extract name if format is "name:seed"
    let name = `Persona ${idx + 1}`;
    const colonIdx = seed.indexOf(':');
    if (colonIdx > 0 && colonIdx < 20) {
      name = seed.substring(0, colonIdx).trim();
      seed = seed.substring(colonIdx + 1).trim();
    }

    return {
      name,
      selections: decodeSeed(seed),
    };
  });
}

/**
 * Merge multiple schedules and generate route analysis
 */
export function mergeSchedules(schedules) {
  // Collect all selected artist IDs across all schedules
  const allIds = new Set();
  for (const s of schedules) {
    for (const id of s.selections) {
      allIds.add(id);
    }
  }

  // Categorize each artist
  const merged = [];
  for (const id of allIds) {
    const artist = ARTISTS.find(a => a.id === id);
    if (!artist) continue;

    const owners = schedules
      .filter(s => s.selections.has(id))
      .map(s => s.name);

    merged.push({
      artist,
      owners,
      isShared: owners.length === schedules.length,
      isUnanimous: owners.length === schedules.length,
      ownerCount: owners.length,
    });
  }

  return merged;
}

/**
 * Generate route plan for a day showing where each person goes
 * and when the group needs to split/rejoin
 */
export function generateRoutePlan(schedules, dayId) {
  const dayArtists = ARTISTS.filter(a => a.day === dayId);
  const timeSlots = [];

  // Collect all unique time boundaries
  const boundaries = new Set();
  for (const s of schedules) {
    for (const id of s.selections) {
      const artist = dayArtists.find(a => a.id === id);
      if (!artist) continue;
      boundaries.add(artist.startTime);
      boundaries.add(artist.endTime);
    }
  }

  if (boundaries.size === 0) return [];

  // Sort boundaries
  const sortedTimes = Array.from(boundaries).sort((a, b) => {
    return timeToMinutes(a) - timeToMinutes(b);
  });

  // For each time boundary, determine where each person is
  for (const time of sortedTimes) {
    const snapshot = {
      time,
      people: [],
      allTogether: true,
      stages: new Set(),
    };

    for (const schedule of schedules) {
      const activeArtists = dayArtists.filter(a => {
        if (!schedule.selections.has(a.id)) return false;
        const s = timeToMinutes(a.startTime);
        const e = timeToMinutes(a.endTime);
        const t = timeToMinutes(time);
        return t >= s && t < e;
      });

      if (activeArtists.length > 0) {
        const artist = activeArtists[0]; // Primary artist at this time
        const stage = getStage(artist.stage);
        snapshot.people.push({
          name: schedule.name,
          artist: artist.name,
          stage: stage.name,
          stageId: artist.stage,
        });
        snapshot.stages.add(artist.stage);
      }
    }

    if (snapshot.stages.size > 1) {
      snapshot.allTogether = false;
    }

    if (snapshot.people.length > 0) {
      timeSlots.push(snapshot);
    }
  }

  return timeSlots;
}

/**
 * Render the merged view
 */
export function renderMergedSchedule(mergedData, routePlan, targetEl) {
  targetEl.innerHTML = '';

  // Color palette for different people
  const colors = ['#FF4D6A', '#7C4DFF', '#00BFA5', '#FF6D00', '#2979FF'];

  // Shared picks section
  const shared = mergedData.filter(m => m.isShared);
  if (shared.length > 0) {
    const section = document.createElement('div');
    section.className = 'merge-section merge-shared';
    section.innerHTML = `<h3>🎯 Todos juntos (${shared.length})</h3>`;
    const list = document.createElement('div');
    list.className = 'merge-list';
    for (const item of shared.sort((a, b) => timeToMinutes(a.artist.startTime) - timeToMinutes(b.artist.startTime))) {
      list.appendChild(createMergeCard(item, colors));
    }
    section.appendChild(list);
    targetEl.appendChild(section);
  }

  // Unique picks section
  const unique = mergedData.filter(m => !m.isShared);
  if (unique.length > 0) {
    const section = document.createElement('div');
    section.className = 'merge-section merge-unique';
    section.innerHTML = `<h3>🔀 Picks individuales (${unique.length})</h3>`;
    const list = document.createElement('div');
    list.className = 'merge-list';
    for (const item of unique.sort((a, b) => timeToMinutes(a.artist.startTime) - timeToMinutes(b.artist.startTime))) {
      list.appendChild(createMergeCard(item, colors));
    }
    section.appendChild(list);
    targetEl.appendChild(section);
  }

  // Route plan section
  if (routePlan.length > 0) {
    const section = document.createElement('div');
    section.className = 'merge-section merge-route';
    section.innerHTML = '<h3>🗺️ Ruta del día</h3>';
    const timeline = document.createElement('div');
    timeline.className = 'route-timeline';

    for (const slot of routePlan) {
      const entry = document.createElement('div');
      entry.className = `route-entry ${slot.allTogether ? 'together' : 'split'}`;
      
      let html = `<div class="route-time">${slot.time}</div><div class="route-detail">`;
      if (slot.allTogether && slot.people.length > 0) {
        html += `<span class="route-badge together">Juntos</span> ${slot.people[0].artist} @ ${slot.people[0].stage}`;
      } else {
        for (const p of slot.people) {
          html += `<div class="route-person"><strong>${p.name}</strong>: ${p.artist} @ ${p.stage}</div>`;
        }
      }
      html += '</div>';
      entry.innerHTML = html;
      timeline.appendChild(entry);
    }

    section.appendChild(timeline);
    targetEl.appendChild(section);
  }
}

function createMergeCard(item, colors) {
  const card = document.createElement('div');
  card.className = 'merge-card';
  const stage = getStage(item.artist.stage);

  card.innerHTML = `
    <div class="merge-card-time">${item.artist.startTime} – ${item.artist.endTime}</div>
    <div class="merge-card-name">${item.artist.name}</div>
    <div class="merge-card-stage" style="color: ${stage.color}">${stage.name}</div>
    <div class="merge-card-owners">
      ${item.owners.map((o, i) => `<span class="owner-dot" style="background: ${colors[i % colors.length]}" title="${o}"></span>`).join('')}
    </div>
  `;

  return card;
}
