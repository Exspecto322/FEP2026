// ============================================================
// FEP2026 — Schedule Data
// Extracted from official Estéreo Picnic 2026 schedule images
// ============================================================

export const STAGES = [
  { id: 'estereo-picnic', name: 'Estéreo Picnic', sponsor: 'Smirnoff', color: '#FF4D6A' },
  { id: 'un-mundo-distinto', name: 'Un Mundo Distinto', sponsor: 'Adidas', color: '#7C4DFF' },
  { id: 'bosque', name: 'Bosque', sponsor: 'Samsung Galaxy S26', color: '#00BFA5' },
  { id: 'paramo', name: 'Páramo', sponsor: '', color: '#FF6D00' },
  { id: 'lago', name: 'Lago', sponsor: '', color: '#2979FF' },
  { id: 'fuerza-bruta', name: 'Fuerza Bruta', sponsor: 'Falabella', color: '#E040FB' },
];

export const DAYS = [
  { id: 'friday', label: 'Viernes 20', date: '2026-03-20', themeGradient: 'linear-gradient(135deg, #7B2FF7 0%, #FF6B6B 100%)' },
  { id: 'saturday', label: 'Sábado 21', date: '2026-03-21', themeGradient: 'linear-gradient(135deg, #0F0C29 0%, #302B63 50%, #24243E 100%)' },
  { id: 'sunday', label: 'Domingo 22', date: '2026-03-22', themeGradient: 'linear-gradient(135deg, #F7971E 0%, #FFD200 50%, #FF6B6B 100%)' },
];

// Genre taxonomy for recommendations
export const GENRES = [
  'rock', 'alternative', 'indie', 'pop', 'electronic', 'house', 'techno',
  'hip-hop', 'rap', 'r&b', 'latin', 'reggaeton', 'cumbia', 'folk',
  'punk', 'metal', 'experimental', 'k-pop', 'j-pop', 'dj', 'live-electronic',
  'singer-songwriter', 'funk', 'soul', 'bass-music', 'ambient', 'post-punk',
  'hardcore', 'pop-punk', 'trap', 'dancehall', 'world', 'jazz', 'classical',
];

let _id = 0;
const makeId = () => _id++;

// ============================================================
// VIERNES 20 DE MARZO
// ============================================================
const FRIDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'friday', stage: 'estereo-picnic', startTime: '14:45', endTime: '15:30', genres: ['rock'] },
  { id: makeId(), name: 'Elniko Arias', day: 'friday', stage: 'estereo-picnic', startTime: '16:00', endTime: '16:45', genres: ['electronic', 'dj'] },
  { id: makeId(), name: 'Royel Otis', day: 'friday', stage: 'estereo-picnic', startTime: '16:45', endTime: '17:45', genres: ['indie', 'rock', 'pop'] },
  { id: makeId(), name: 'Katseye', day: 'friday', stage: 'estereo-picnic', startTime: '17:45', endTime: '18:45', genres: ['k-pop', 'pop'] },
  { id: makeId(), name: 'Djo', day: 'friday', stage: 'estereo-picnic', startTime: '18:45', endTime: '19:45', genres: ['indie', 'alternative', 'rock'] },
  { id: makeId(), name: 'Addison Rae', day: 'friday', stage: 'estereo-picnic', startTime: '19:45', endTime: '20:45', genres: ['pop'] },
  { id: makeId(), name: 'Turnstile', day: 'friday', stage: 'estereo-picnic', startTime: '20:45', endTime: '21:45', genres: ['punk', 'hardcore', 'post-punk'] },
  { id: makeId(), name: 'Lorde', day: 'friday', stage: 'estereo-picnic', startTime: '21:45', endTime: '23:00', genres: ['pop', 'alternative', 'indie'] },
  { id: makeId(), name: 'Tyler, The Creator', day: 'friday', stage: 'estereo-picnic', startTime: '23:15', endTime: '00:45', genres: ['hip-hop', 'rap', 'alternative'] },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Error999', day: 'friday', stage: 'un-mundo-distinto', startTime: '15:15', endTime: '16:00', genres: ['electronic', 'experimental'] },
  { id: makeId(), name: 'Manú', day: 'friday', stage: 'un-mundo-distinto', startTime: '16:45', endTime: '17:45', genres: ['latin', 'pop'] },
  { id: makeId(), name: 'Santos Bravos', day: 'friday', stage: 'un-mundo-distinto', startTime: '18:45', endTime: '19:45', genres: ['rock', 'latin', 'alternative'] },
  { id: makeId(), name: 'Timø', day: 'friday', stage: 'un-mundo-distinto', startTime: '20:45', endTime: '21:45', genres: ['electronic', 'pop'] },
  { id: makeId(), name: 'Peggy Gou', day: 'friday', stage: 'un-mundo-distinto', startTime: '00:45', endTime: '02:15', genres: ['house', 'electronic', 'dj', 'techno'] },

  // Bosque stage
  { id: makeId(), name: 'RØZ', day: 'friday', stage: 'bosque', startTime: '17:55', endTime: '19:10', genres: ['electronic', 'bass-music'] },
  { id: makeId(), name: 'Briela Veneno', day: 'friday', stage: 'bosque', startTime: '19:10', endTime: '20:10', genres: ['latin', 'electronic', 'experimental'] },
  { id: makeId(), name: 'Six Sex', day: 'friday', stage: 'bosque', startTime: '20:20', endTime: '21:20', genres: ['electronic', 'experimental'] },
  { id: makeId(), name: '¥O$UK€ ¥UKIMAT$U', day: 'friday', stage: 'bosque', startTime: '21:30', endTime: '23:00', genres: ['electronic', 'experimental', 'bass-music'] },
  { id: makeId(), name: 'Diossa', day: 'friday', stage: 'bosque', startTime: '23:00', endTime: '00:00', genres: ['latin', 'pop', 'r&b'] },
  { id: makeId(), name: 'Peter Blue', day: 'friday', stage: 'bosque', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'house'] },
  { id: makeId(), name: 'Brutalismus 3000', day: 'friday', stage: 'bosque', startTime: '01:45', endTime: '03:00', genres: ['electronic', 'techno', 'punk', 'experimental'] },

  // Páramo stage
  // (no early acts visible)

  // Lago stage
  { id: makeId(), name: 'Entreco', day: 'friday', stage: 'lago', startTime: '16:00', endTime: '16:45', genres: ['rock', 'latin'] },
  { id: makeId(), name: 'Innexen (Live)', day: 'friday', stage: 'lago', startTime: '16:45', endTime: '17:45', genres: ['electronic', 'live-electronic'] },
  { id: makeId(), name: 'The Warning', day: 'friday', stage: 'lago', startTime: '17:45', endTime: '18:45', genres: ['rock', 'alternative'] },
  { id: makeId(), name: 'Nicolás y Los Fumadores', day: 'friday', stage: 'lago', startTime: '19:45', endTime: '20:45', genres: ['rock', 'latin', 'indie'] },
  { id: makeId(), name: 'Balu Brigada', day: 'friday', stage: 'lago', startTime: '22:15', endTime: '23:15', genres: ['pop', 'electronic', 'alternative'] },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'friday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'friday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'friday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'friday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'] },
];

// ============================================================
// SÁBADO 21 DE MARZO
// ============================================================
const SATURDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'saturday', stage: 'estereo-picnic', startTime: '14:15', endTime: '15:00', genres: ['rock'] },
  { id: makeId(), name: 'Manuel Lizarazo', day: 'saturday', stage: 'estereo-picnic', startTime: '15:15', endTime: '16:00', genres: ['latin', 'pop', 'singer-songwriter'] },
  { id: makeId(), name: 'Aria Vega', day: 'saturday', stage: 'estereo-picnic', startTime: '16:15', endTime: '17:00', genres: ['pop', 'latin'] },
  { id: makeId(), name: 'The Whitest Boy Alive', day: 'saturday', stage: 'estereo-picnic', startTime: '17:00', endTime: '18:00', genres: ['indie', 'electronic', 'pop'] },
  { id: makeId(), name: 'Tom Morello', day: 'saturday', stage: 'estereo-picnic', startTime: '18:00', endTime: '19:00', genres: ['rock', 'alternative', 'metal'] },
  { id: makeId(), name: 'Luis Alfonso', day: 'saturday', stage: 'estereo-picnic', startTime: '19:00', endTime: '20:00', genres: ['latin', 'pop'] },
  { id: makeId(), name: 'Kygo', day: 'saturday', stage: 'estereo-picnic', startTime: '20:00', endTime: '21:00', genres: ['electronic', 'house', 'pop'] },
  { id: makeId(), name: 'Young Miko', day: 'saturday', stage: 'estereo-picnic', startTime: '21:00', endTime: '22:15', genres: ['reggaeton', 'latin', 'rap', 'trap'] },
  { id: makeId(), name: 'The Killers', day: 'saturday', stage: 'estereo-picnic', startTime: '22:15', endTime: '23:45', genres: ['rock', 'alternative', 'indie'] },
  { id: makeId(), name: 'Swedish House Mafia', day: 'saturday', stage: 'estereo-picnic', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'house', 'dj'] },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Machaka', day: 'saturday', stage: 'un-mundo-distinto', startTime: '14:30', endTime: '15:15', genres: ['latin', 'hip-hop'] },
  { id: makeId(), name: '31 Minutos', day: 'saturday', stage: 'un-mundo-distinto', startTime: '16:00', endTime: '17:00', genres: ['pop', 'alternative', 'latin'] },
  { id: makeId(), name: 'Ivan Cornejo', day: 'saturday', stage: 'un-mundo-distinto', startTime: '18:00', endTime: '19:00', genres: ['latin', 'singer-songwriter', 'folk'] },
  { id: makeId(), name: 'Guitarricadelafuente', day: 'saturday', stage: 'un-mundo-distinto', startTime: '20:00', endTime: '21:00', genres: ['indie', 'folk', 'singer-songwriter', 'latin'] },
  { id: makeId(), name: 'Mochakk', day: 'saturday', stage: 'un-mundo-distinto', startTime: '01:30', endTime: '03:00', genres: ['house', 'electronic', 'dj'] },

  // Bosque stage
  // (no early acts)

  // Páramo stage
  { id: makeId(), name: 'Kabinett', day: 'saturday', stage: 'paramo', startTime: '15:30', endTime: '16:30', genres: ['electronic', 'techno'] },
  { id: makeId(), name: 'Daniel Andrés', day: 'saturday', stage: 'paramo', startTime: '16:30', endTime: '17:50', genres: ['electronic', 'dj'] },
  { id: makeId(), name: 'Roi Turbo', day: 'saturday', stage: 'paramo', startTime: '18:00', endTime: '19:00', genres: ['electronic', 'techno', 'dj'] },
  { id: makeId(), name: 'Silvia Ponce', day: 'saturday', stage: 'paramo', startTime: '19:10', endTime: '20:25', genres: ['electronic', 'house', 'dj'] },
  { id: makeId(), name: 'TEED', day: 'saturday', stage: 'paramo', startTime: '20:25', endTime: '22:10', genres: ['electronic', 'house', 'pop'] },
  { id: makeId(), name: 'HVOB (Live)', day: 'saturday', stage: 'paramo', startTime: '22:45', endTime: '23:55', genres: ['electronic', 'live-electronic', 'techno'] },
  { id: makeId(), name: 'Rebolledo', day: 'saturday', stage: 'paramo', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'techno', 'dj'] },
  { id: makeId(), name: 'Arcade Fire presents: Santa Pirata', day: 'saturday', stage: 'paramo', startTime: '01:30', endTime: '03:00', genres: ['indie', 'rock', 'alternative', 'dj'] },

  // Lago stage
  { id: makeId(), name: 'Universe', day: 'saturday', stage: 'lago', startTime: '15:15', endTime: '16:00', genres: ['electronic', 'pop'] },
  { id: makeId(), name: 'Judeline', day: 'saturday', stage: 'lago', startTime: '17:00', endTime: '18:00', genres: ['pop', 'latin', 'r&b'] },
  { id: makeId(), name: 'Ruel', day: 'saturday', stage: 'lago', startTime: '19:00', endTime: '20:00', genres: ['pop', 'r&b', 'soul'] },
  { id: makeId(), name: 'Bob Moses', day: 'saturday', stage: 'lago', startTime: '21:00', endTime: '22:00', genres: ['electronic', 'live-electronic', 'house'] },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'saturday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'saturday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'saturday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'saturday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'] },
];

// ============================================================
// DOMINGO 22 DE MARZO
// ============================================================
const SUNDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'sunday', stage: 'estereo-picnic', startTime: '14:15', endTime: '15:00', genres: ['rock'] },
  { id: makeId(), name: 'Pirineos en Llamas', day: 'sunday', stage: 'estereo-picnic', startTime: '15:15', endTime: '16:00', genres: ['rock', 'latin', 'punk'] },
  { id: makeId(), name: 'Travis', day: 'sunday', stage: 'estereo-picnic', startTime: '16:00', endTime: '17:00', genres: ['rock', 'alternative', 'indie'] },
  { id: makeId(), name: 'Viagra Boys', day: 'sunday', stage: 'estereo-picnic', startTime: '17:00', endTime: '18:00', genres: ['punk', 'post-punk', 'rock'] },
  { id: makeId(), name: 'Blood Orange', day: 'sunday', stage: 'estereo-picnic', startTime: '18:00', endTime: '19:00', genres: ['r&b', 'funk', 'soul', 'pop'] },
  { id: makeId(), name: 'Interpol', day: 'sunday', stage: 'estereo-picnic', startTime: '19:00', endTime: '20:00', genres: ['rock', 'post-punk', 'indie', 'alternative'] },
  { id: makeId(), name: 'Doechii', day: 'sunday', stage: 'estereo-picnic', startTime: '20:00', endTime: '21:00', genres: ['hip-hop', 'rap'] },
  { id: makeId(), name: 'Deftones', day: 'sunday', stage: 'estereo-picnic', startTime: '21:00', endTime: '22:15', genres: ['metal', 'alternative', 'rock'] },
  { id: makeId(), name: 'Sabrina Carpenter', day: 'sunday', stage: 'estereo-picnic', startTime: '22:15', endTime: '23:45', genres: ['pop'] },
  { id: makeId(), name: 'Skrillex', day: 'sunday', stage: 'estereo-picnic', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'bass-music', 'dj', 'dubstep'] },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Agraciada', day: 'sunday', stage: 'un-mundo-distinto', startTime: '14:30', endTime: '15:15', genres: ['latin', 'folk'] },
  { id: makeId(), name: 'Lasso', day: 'sunday', stage: 'un-mundo-distinto', startTime: '16:00', endTime: '17:00', genres: ['pop', 'latin', 'singer-songwriter'] },
  { id: makeId(), name: 'Rusowsky', day: 'sunday', stage: 'un-mundo-distinto', startTime: '18:00', endTime: '19:00', genres: ['indie', 'pop', 'latin'] },
  { id: makeId(), name: 'Men I Trust', day: 'sunday', stage: 'un-mundo-distinto', startTime: '20:00', endTime: '21:00', genres: ['indie', 'pop', 'electronic'] },

  // Bosque stage
  // (no acts visible in bosque for Sunday)

  // Páramo stage
  { id: makeId(), name: 'Antopiko3', day: 'sunday', stage: 'paramo', startTime: '15:00', endTime: '15:45', genres: ['electronic', 'dj'] },
  { id: makeId(), name: 'Wost', day: 'sunday', stage: 'paramo', startTime: '16:15', endTime: '17:15', genres: ['electronic', 'techno', 'dj'] },
  { id: makeId(), name: 'Dj Babatr', day: 'sunday', stage: 'paramo', startTime: '17:45', endTime: '19:15', genres: ['electronic', 'dj'] },
  { id: makeId(), name: 'Badsista', day: 'sunday', stage: 'paramo', startTime: '19:15', endTime: '20:45', genres: ['electronic', 'bass-music', 'dj'] },
  { id: makeId(), name: 'Bunt.', day: 'sunday', stage: 'paramo', startTime: '21:00', endTime: '22:15', genres: ['electronic', 'folk', 'house'] },
  { id: makeId(), name: 'Hamdi', day: 'sunday', stage: 'paramo', startTime: '22:45', endTime: '00:00', genres: ['bass-music', 'electronic', 'dubstep'] },
  { id: makeId(), name: 'Daccach', day: 'sunday', stage: 'paramo', startTime: '00:45', endTime: '01:45', genres: ['electronic', 'techno', 'dj'] },
  { id: makeId(), name: 'Ben Böhmer', day: 'sunday', stage: 'paramo', startTime: '01:45', endTime: '03:00', genres: ['electronic', 'house', 'ambient', 'live-electronic'] },

  // Lago stage
  { id: makeId(), name: 'Zarigüeya', day: 'sunday', stage: 'lago', startTime: '14:15', endTime: '15:00', genres: ['rock', 'latin', 'punk'] },
  { id: makeId(), name: 'dvd', day: 'sunday', stage: 'lago', startTime: '15:30', endTime: '16:15', genres: ['indie', 'pop', 'latin'] },
  { id: makeId(), name: 'Macario Martínez', day: 'sunday', stage: 'lago', startTime: '17:00', endTime: '18:00', genres: ['latin', 'singer-songwriter'] },
  { id: makeId(), name: '2Hollis', day: 'sunday', stage: 'lago', startTime: '19:00', endTime: '20:00', genres: ['electronic', 'experimental', 'hip-hop'] },
  { id: makeId(), name: 'Zaider', day: 'sunday', stage: 'lago', startTime: '21:00', endTime: '22:00', genres: ['reggaeton', 'latin'] },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'sunday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'sunday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'sunday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'] },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'sunday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'] },
];

export const ARTISTS = [...FRIDAY, ...SATURDAY, ...SUNDAY];
export const TOTAL_ARTISTS = ARTISTS.length;

// Helper: get artists for a specific day
export function getArtistsByDay(dayId) {
  return ARTISTS.filter(a => a.day === dayId);
}

// Helper: get artists for a specific stage on a specific day
export function getArtistsByDayAndStage(dayId, stageId) {
  return ARTISTS.filter(a => a.day === dayId && a.stage === stageId);
}

// Helper: get a single artist by ID
export function getArtistById(id) {
  return ARTISTS.find(a => a.id === id);
}

// Helper: parse time string to minutes since midnight (handles next-day times)
export function timeToMinutes(timeStr) {
  const [h, m] = timeStr.split(':').map(Number);
  // Times before 06:00 are considered next day (add 24h)
  return h < 6 ? (h + 24) * 60 + m : h * 60 + m;
}

// Helper: check if two time ranges overlap
export function timesOverlap(start1, end1, start2, end2) {
  const s1 = timeToMinutes(start1);
  const e1 = timeToMinutes(end1);
  const s2 = timeToMinutes(start2);
  const e2 = timeToMinutes(end2);
  return s1 < e2 && s2 < e1;
}

// Helper: get stage info by id
export function getStage(stageId) {
  return STAGES.find(s => s.id === stageId);
}
