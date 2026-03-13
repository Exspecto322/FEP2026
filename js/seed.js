// ============================================================
// FEP2026 — Seed Encoding/Decoding
// Compresses schedule selections into a URL-safe string
// ============================================================

import { ARTISTS, TOTAL_ARTISTS } from './data.js';

// Base64url alphabet (URL-safe, no padding)
const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';

/**
 * Encode a Set of artist IDs into a compact seed string
 * Each artist is a bit in a bitfield, then base64url encoded
 */
export function encodeSeed(selectedIds) {
  const numBytes = Math.ceil(TOTAL_ARTISTS / 6); // 6 bits per b64 char
  const bits = new Array(TOTAL_ARTISTS).fill(0);

  for (const id of selectedIds) {
    if (id >= 0 && id < TOTAL_ARTISTS) {
      bits[id] = 1;
    }
  }

  let seed = '';
  for (let i = 0; i < bits.length; i += 6) {
    let val = 0;
    for (let j = 0; j < 6; j++) {
      if (i + j < bits.length && bits[i + j]) {
        val |= (1 << (5 - j));
      }
    }
    seed += B64[val];
  }

  // Trim trailing 'A' (zero) characters for brevity
  seed = seed.replace(/A+$/, '');
  return seed;
}

/**
 * Decode a seed string back into a Set of artist IDs
 */
export function decodeSeed(seed) {
  const selectedIds = new Set();
  
  for (let i = 0; i < seed.length; i++) {
    const val = B64.indexOf(seed[i]);
    if (val === -1) continue;

    for (let j = 0; j < 6; j++) {
      const bitIndex = i * 6 + j;
      if (bitIndex >= TOTAL_ARTISTS) break;
      if (val & (1 << (5 - j))) {
        selectedIds.add(bitIndex);
      }
    }
  }

  return selectedIds;
}

/**
 * Save selection to URL hash
 */
export function saveToHash(selectedIds) {
  if (selectedIds.size === 0) {
    history.replaceState(null, '', window.location.pathname);
    return;
  }
  const seed = encodeSeed(selectedIds);
  history.replaceState(null, '', `#s=${seed}`);
}

/**
 * Load selection from URL hash
 */
export function loadFromHash() {
  const hash = window.location.hash;
  if (!hash || !hash.startsWith('#s=')) return new Set();
  const seed = hash.substring(3);
  return decodeSeed(seed);
}

/**
 * Save to localStorage as backup
 */
export function saveToStorage(selectedIds) {
  const arr = Array.from(selectedIds);
  localStorage.setItem('fep2026_selection', JSON.stringify(arr));
}

/**
 * Load from localStorage
 */
export function loadFromStorage() {
  try {
    const data = localStorage.getItem('fep2026_selection');
    if (!data) return new Set();
    return new Set(JSON.parse(data));
  } catch {
    return new Set();
  }
}

/**
 * Generate a full shareable URL
 */
export function getShareableURL(selectedIds) {
  const seed = encodeSeed(selectedIds);
  const base = window.location.origin + window.location.pathname;
  return `${base}#s=${seed}`;
}

/**
 * Export schedule as plain text
 */
export function exportAsText(selectedIds) {
  const selected = ARTISTS.filter(a => selectedIds.has(a.id));
  const days = { friday: 'Viernes 20', saturday: 'Sábado 21', sunday: 'Domingo 22' };
  let text = '🎵 Mi Agenda — Estéreo Picnic 2026\n\n';

  for (const [dayId, dayLabel] of Object.entries(days)) {
    const dayArtists = selected
      .filter(a => a.day === dayId)
      .sort((a, b) => {
        const ta = a.startTime < '06:00' ? '2' + a.startTime : '1' + a.startTime;
        const tb = b.startTime < '06:00' ? '2' + b.startTime : '1' + b.startTime;
        return ta.localeCompare(tb);
      });

    if (dayArtists.length === 0) continue;

    text += `📅 ${dayLabel}\n`;
    for (const a of dayArtists) {
      text += `  ${a.startTime}–${a.endTime}  ${a.name}\n`;
    }
    text += '\n';
  }

  return text.trim();
}

/**
 * Generate QR code SVG (minimal inline implementation)
 * Uses a simple encoding suitable for short URLs
 */
export function generateQRSvg(data) {
  // We'll use a tiny QR library loaded from CDN instead
  // This is a placeholder — the app will use qrcode-generator
  return null;
}
