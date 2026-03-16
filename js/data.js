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
  // Club stages (optional)
  { id: 'club-aora', name: 'AORA', sponsor: 'Durex', color: '#CDDC39', isClub: true },
  { id: 'club-rompe', name: 'Rompe x Sprite', sponsor: 'Sprite', color: '#F44336', isClub: true },
  { id: 'club-coke', name: 'Club FEP x Coke Studio', sponsor: 'Coke', color: '#9C27B0', isClub: true },
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

// Artist tiers based on flyer billing
export const TIERS = {
  headliner: { label: '⭐ Headliner', color: '#FFD700', short: 'HEADLINER', css: 'tier-headliner' },
  top:       { label: '🔥 Top', color: '#FF6D00', short: 'TOP', css: 'tier-top' },
  mid:       { label: '✦ Mid', color: '#B388FF', short: 'MID', css: 'tier-mid' },
  emerging:  { label: '◆ Emerging', color: '#4DD0E1', short: 'NEW', css: 'tier-emerging' },
};

let _id = 0;
const makeId = () => _id++;

// ============================================================
// VIERNES 20 DE MARZO
// ============================================================
const FRIDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'friday', stage: 'estereo-picnic', startTime: '14:45', endTime: '15:30', genres: ['rock'], tier: 'emerging' },
  { id: makeId(), name: 'Elniko Arias', day: 'friday', stage: 'estereo-picnic', startTime: '16:00', endTime: '16:45', genres: ['electronic', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Royel Otis', day: 'friday', stage: 'estereo-picnic', startTime: '16:45', endTime: '17:45', genres: ['indie', 'rock', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Katseye', day: 'friday', stage: 'estereo-picnic', startTime: '17:45', endTime: '18:45', genres: ['k-pop', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Djo', day: 'friday', stage: 'estereo-picnic', startTime: '18:45', endTime: '19:45', genres: ['indie', 'alternative', 'rock'], tier: 'mid' },
  { id: makeId(), name: 'Addison Rae', day: 'friday', stage: 'estereo-picnic', startTime: '19:45', endTime: '20:45', genres: ['pop'], tier: 'mid' },
  { id: makeId(), name: 'Turnstile', day: 'friday', stage: 'estereo-picnic', startTime: '20:45', endTime: '21:45', genres: ['punk', 'hardcore', 'post-punk'], tier: 'top' },
  { id: makeId(), name: 'Lorde', day: 'friday', stage: 'estereo-picnic', startTime: '21:45', endTime: '23:00', genres: ['pop', 'alternative', 'indie'], tier: 'headliner' },
  { id: makeId(), name: 'Tyler, The Creator', day: 'friday', stage: 'estereo-picnic', startTime: '23:15', endTime: '00:45', genres: ['hip-hop', 'rap', 'alternative'], tier: 'headliner' },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Error999', day: 'friday', stage: 'un-mundo-distinto', startTime: '15:15', endTime: '16:00', genres: ['electronic', 'experimental'], tier: 'emerging' },
  { id: makeId(), name: 'Manú', day: 'friday', stage: 'un-mundo-distinto', startTime: '16:45', endTime: '17:45', genres: ['latin', 'pop'], tier: 'emerging' },
  { id: makeId(), name: 'Santos Bravos', day: 'friday', stage: 'un-mundo-distinto', startTime: '18:45', endTime: '19:45', genres: ['rock', 'latin', 'alternative'], tier: 'mid' },
  { id: makeId(), name: 'Timø', day: 'friday', stage: 'un-mundo-distinto', startTime: '20:45', endTime: '21:45', genres: ['electronic', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Peggy Gou', day: 'friday', stage: 'un-mundo-distinto', startTime: '00:45', endTime: '02:15', genres: ['house', 'electronic', 'dj', 'techno'], tier: 'top' },

  // Bosque stage
  { id: makeId(), name: 'RØZ', day: 'friday', stage: 'bosque', startTime: '17:55', endTime: '19:10', genres: ['electronic', 'bass-music'], tier: 'emerging' },
  { id: makeId(), name: 'Briela Veneno', day: 'friday', stage: 'bosque', startTime: '19:10', endTime: '20:10', genres: ['latin', 'electronic', 'experimental'], tier: 'emerging' },
  { id: makeId(), name: 'Six Sex', day: 'friday', stage: 'bosque', startTime: '20:20', endTime: '21:20', genres: ['electronic', 'experimental'], tier: 'emerging' },
  { id: makeId(), name: '¥O$UK€ ¥UKIMAT$U', day: 'friday', stage: 'bosque', startTime: '21:30', endTime: '23:00', genres: ['electronic', 'experimental', 'bass-music'], tier: 'mid' },
  { id: makeId(), name: 'Diossa', day: 'friday', stage: 'bosque', startTime: '23:00', endTime: '00:00', genres: ['latin', 'pop', 'r&b'], tier: 'emerging' },
  { id: makeId(), name: 'Peter Blue', day: 'friday', stage: 'bosque', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'house'], tier: 'emerging' },
  { id: makeId(), name: 'Brutalismus 3000', day: 'friday', stage: 'bosque', startTime: '01:45', endTime: '03:00', genres: ['electronic', 'techno', 'punk', 'experimental'], tier: 'mid' },

  // Lago stage
  { id: makeId(), name: 'Entreco', day: 'friday', stage: 'lago', startTime: '16:00', endTime: '16:45', genres: ['rock', 'latin'], tier: 'emerging' },
  { id: makeId(), name: 'Innexen (Live)', day: 'friday', stage: 'lago', startTime: '16:45', endTime: '17:45', genres: ['electronic', 'live-electronic'], tier: 'emerging' },
  { id: makeId(), name: 'The Warning', day: 'friday', stage: 'lago', startTime: '17:45', endTime: '18:45', genres: ['rock', 'alternative'], tier: 'mid' },
  { id: makeId(), name: 'Nicolás y Los Fumadores', day: 'friday', stage: 'lago', startTime: '19:45', endTime: '20:45', genres: ['rock', 'latin', 'indie'], tier: 'emerging' },
  { id: makeId(), name: 'Balu Brigada', day: 'friday', stage: 'lago', startTime: '22:15', endTime: '23:15', genres: ['pop', 'electronic', 'alternative'], tier: 'emerging' },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'friday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'friday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'friday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'friday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'], tier: 'emerging' },
];

// ============================================================
// SÁBADO 21 DE MARZO
// ============================================================
const SATURDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'saturday', stage: 'estereo-picnic', startTime: '14:15', endTime: '15:00', genres: ['rock'], tier: 'emerging' },
  { id: makeId(), name: 'Manuel Lizarazo', day: 'saturday', stage: 'estereo-picnic', startTime: '15:15', endTime: '16:00', genres: ['latin', 'pop', 'singer-songwriter'], tier: 'emerging' },
  { id: makeId(), name: 'Aria Vega', day: 'saturday', stage: 'estereo-picnic', startTime: '16:15', endTime: '17:00', genres: ['pop', 'latin'], tier: 'emerging' },
  { id: makeId(), name: 'The Whitest Boy Alive', day: 'saturday', stage: 'estereo-picnic', startTime: '17:00', endTime: '18:00', genres: ['indie', 'electronic', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Tom Morello', day: 'saturday', stage: 'estereo-picnic', startTime: '18:00', endTime: '19:00', genres: ['rock', 'alternative', 'metal'], tier: 'mid' },
  { id: makeId(), name: 'Luis Alfonso', day: 'saturday', stage: 'estereo-picnic', startTime: '19:00', endTime: '20:00', genres: ['latin', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Kygo', day: 'saturday', stage: 'estereo-picnic', startTime: '20:00', endTime: '21:00', genres: ['electronic', 'house', 'pop'], tier: 'top' },
  { id: makeId(), name: 'Young Miko', day: 'saturday', stage: 'estereo-picnic', startTime: '21:00', endTime: '22:15', genres: ['reggaeton', 'latin', 'rap', 'trap'], tier: 'top' },
  { id: makeId(), name: 'The Killers', day: 'saturday', stage: 'estereo-picnic', startTime: '22:15', endTime: '23:45', genres: ['rock', 'alternative', 'indie'], tier: 'headliner' },
  { id: makeId(), name: 'Swedish House Mafia', day: 'saturday', stage: 'estereo-picnic', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'house', 'dj'], tier: 'headliner' },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Machaka', day: 'saturday', stage: 'un-mundo-distinto', startTime: '14:30', endTime: '15:15', genres: ['latin', 'hip-hop'], tier: 'emerging' },
  { id: makeId(), name: '31 Minutos', day: 'saturday', stage: 'un-mundo-distinto', startTime: '16:00', endTime: '17:00', genres: ['pop', 'alternative', 'latin'], tier: 'mid' },
  { id: makeId(), name: 'Ivan Cornejo', day: 'saturday', stage: 'un-mundo-distinto', startTime: '18:00', endTime: '19:00', genres: ['latin', 'singer-songwriter', 'folk'], tier: 'mid' },
  { id: makeId(), name: 'Guitarricadelafuente', day: 'saturday', stage: 'un-mundo-distinto', startTime: '20:00', endTime: '21:00', genres: ['indie', 'folk', 'singer-songwriter', 'latin'], tier: 'mid' },
  { id: makeId(), name: 'Mochakk', day: 'saturday', stage: 'un-mundo-distinto', startTime: '01:30', endTime: '03:00', genres: ['house', 'electronic', 'dj'], tier: 'mid' },

  // Páramo stage
  { id: makeId(), name: 'Kabinett', day: 'saturday', stage: 'paramo', startTime: '15:30', endTime: '16:30', genres: ['electronic', 'techno'], tier: 'emerging' },
  { id: makeId(), name: 'Daniel Andrés', day: 'saturday', stage: 'paramo', startTime: '16:30', endTime: '17:50', genres: ['electronic', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Roi Turbo', day: 'saturday', stage: 'paramo', startTime: '18:00', endTime: '19:00', genres: ['electronic', 'techno', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Silvia Ponce', day: 'saturday', stage: 'paramo', startTime: '19:10', endTime: '20:25', genres: ['electronic', 'house', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'TEED', day: 'saturday', stage: 'paramo', startTime: '20:25', endTime: '22:10', genres: ['electronic', 'house', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'HVOB (Live)', day: 'saturday', stage: 'paramo', startTime: '22:45', endTime: '23:55', genres: ['electronic', 'live-electronic', 'techno'], tier: 'mid' },
  { id: makeId(), name: 'Rebolledo', day: 'saturday', stage: 'paramo', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'techno', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Arcade Fire presents: Santa Pirata', day: 'saturday', stage: 'paramo', startTime: '01:30', endTime: '03:00', genres: ['indie', 'rock', 'alternative', 'dj'], tier: 'mid' },

  // Lago stage
  { id: makeId(), name: 'Universe', day: 'saturday', stage: 'lago', startTime: '15:15', endTime: '16:00', genres: ['electronic', 'pop'], tier: 'emerging' },
  { id: makeId(), name: 'Judeline', day: 'saturday', stage: 'lago', startTime: '17:00', endTime: '18:00', genres: ['pop', 'latin', 'r&b'], tier: 'mid' },
  { id: makeId(), name: 'Ruel', day: 'saturday', stage: 'lago', startTime: '19:00', endTime: '20:00', genres: ['pop', 'r&b', 'soul'], tier: 'mid' },
  { id: makeId(), name: 'Bob Moses', day: 'saturday', stage: 'lago', startTime: '21:00', endTime: '22:00', genres: ['electronic', 'live-electronic', 'house'], tier: 'mid' },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'saturday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'saturday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'saturday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'saturday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'], tier: 'emerging' },
];

// ============================================================
// DOMINGO 22 DE MARZO
// ============================================================
const SUNDAY = [
  // Estéreo Picnic stage
  { id: makeId(), name: 'School of Rock', day: 'sunday', stage: 'estereo-picnic', startTime: '14:15', endTime: '15:00', genres: ['rock'], tier: 'emerging' },
  { id: makeId(), name: 'Pirineos en Llamas', day: 'sunday', stage: 'estereo-picnic', startTime: '15:15', endTime: '16:00', genres: ['rock', 'latin', 'punk'], tier: 'emerging' },
  { id: makeId(), name: 'Travis', day: 'sunday', stage: 'estereo-picnic', startTime: '16:00', endTime: '17:00', genres: ['rock', 'alternative', 'indie'], tier: 'mid' },
  { id: makeId(), name: 'Viagra Boys', day: 'sunday', stage: 'estereo-picnic', startTime: '17:00', endTime: '18:00', genres: ['punk', 'post-punk', 'rock'], tier: 'mid' },
  { id: makeId(), name: 'Blood Orange', day: 'sunday', stage: 'estereo-picnic', startTime: '18:00', endTime: '19:00', genres: ['r&b', 'funk', 'soul', 'pop'], tier: 'mid' },
  { id: makeId(), name: 'Interpol', day: 'sunday', stage: 'estereo-picnic', startTime: '19:00', endTime: '20:00', genres: ['rock', 'post-punk', 'indie', 'alternative'], tier: 'top' },
  { id: makeId(), name: 'Doechii', day: 'sunday', stage: 'estereo-picnic', startTime: '20:00', endTime: '21:00', genres: ['hip-hop', 'rap'], tier: 'top' },
  { id: makeId(), name: 'Deftones', day: 'sunday', stage: 'estereo-picnic', startTime: '21:00', endTime: '22:15', genres: ['metal', 'alternative', 'rock'], tier: 'headliner' },
  { id: makeId(), name: 'Sabrina Carpenter', day: 'sunday', stage: 'estereo-picnic', startTime: '22:15', endTime: '23:45', genres: ['pop'], tier: 'headliner' },
  { id: makeId(), name: 'Skrillex', day: 'sunday', stage: 'estereo-picnic', startTime: '00:00', endTime: '01:30', genres: ['electronic', 'bass-music', 'dj', 'dubstep'], tier: 'headliner' },

  // Un Mundo Distinto stage
  { id: makeId(), name: 'Agraciada', day: 'sunday', stage: 'un-mundo-distinto', startTime: '14:30', endTime: '15:15', genres: ['latin', 'folk'], tier: 'emerging' },
  { id: makeId(), name: 'Lasso', day: 'sunday', stage: 'un-mundo-distinto', startTime: '16:00', endTime: '17:00', genres: ['pop', 'latin', 'singer-songwriter'], tier: 'mid' },
  { id: makeId(), name: 'Rusowsky', day: 'sunday', stage: 'un-mundo-distinto', startTime: '18:00', endTime: '19:00', genres: ['indie', 'pop', 'latin'], tier: 'mid' },
  { id: makeId(), name: 'Men I Trust', day: 'sunday', stage: 'un-mundo-distinto', startTime: '20:00', endTime: '21:00', genres: ['indie', 'pop', 'electronic'], tier: 'mid' },

  // Páramo stage
  { id: makeId(), name: 'Antopiko3', day: 'sunday', stage: 'paramo', startTime: '15:00', endTime: '15:45', genres: ['electronic', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Wost', day: 'sunday', stage: 'paramo', startTime: '16:15', endTime: '17:15', genres: ['electronic', 'techno', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Dj Babatr', day: 'sunday', stage: 'paramo', startTime: '17:45', endTime: '19:15', genres: ['electronic', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Badsista', day: 'sunday', stage: 'paramo', startTime: '19:15', endTime: '20:45', genres: ['electronic', 'bass-music', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Bunt.', day: 'sunday', stage: 'paramo', startTime: '21:00', endTime: '22:15', genres: ['electronic', 'folk', 'house'], tier: 'mid' },
  { id: makeId(), name: 'Hamdi', day: 'sunday', stage: 'paramo', startTime: '22:45', endTime: '00:00', genres: ['bass-music', 'electronic', 'dubstep'], tier: 'emerging' },
  { id: makeId(), name: 'Daccach', day: 'sunday', stage: 'paramo', startTime: '00:45', endTime: '01:45', genres: ['electronic', 'techno', 'dj'], tier: 'emerging' },
  { id: makeId(), name: 'Ben Böhmer', day: 'sunday', stage: 'paramo', startTime: '01:45', endTime: '03:00', genres: ['electronic', 'house', 'ambient', 'live-electronic'], tier: 'mid' },

  // Lago stage
  { id: makeId(), name: 'Zarigüeya', day: 'sunday', stage: 'lago', startTime: '14:15', endTime: '15:00', genres: ['rock', 'latin', 'punk'], tier: 'emerging' },
  { id: makeId(), name: 'dvd', day: 'sunday', stage: 'lago', startTime: '15:30', endTime: '16:15', genres: ['indie', 'pop', 'latin'], tier: 'emerging' },
  { id: makeId(), name: 'Macario Martínez', day: 'sunday', stage: 'lago', startTime: '17:00', endTime: '18:00', genres: ['latin', 'singer-songwriter'], tier: 'emerging' },
  { id: makeId(), name: '2Hollis', day: 'sunday', stage: 'lago', startTime: '19:00', endTime: '20:00', genres: ['electronic', 'experimental', 'hip-hop'], tier: 'mid' },
  { id: makeId(), name: 'Zaider', day: 'sunday', stage: 'lago', startTime: '21:00', endTime: '22:00', genres: ['reggaeton', 'latin'], tier: 'emerging' },

  // Fuerza Bruta stage
  { id: makeId(), name: 'Fuerza Bruta 17:30', day: 'sunday', stage: 'fuerza-bruta', startTime: '17:30', endTime: '18:00', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 18:45', day: 'sunday', stage: 'fuerza-bruta', startTime: '18:45', endTime: '19:15', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 20:00', day: 'sunday', stage: 'fuerza-bruta', startTime: '20:00', endTime: '20:30', genres: ['performance'], tier: 'emerging' },
  { id: makeId(), name: 'Fuerza Bruta 21:15', day: 'sunday', stage: 'fuerza-bruta', startTime: '21:15', endTime: '21:45', genres: ['performance'], tier: 'emerging' },
];

export const ARTISTS = [...FRIDAY, ...SATURDAY, ...SUNDAY];
export const TOTAL_ARTISTS = ARTISTS.length;

// ============================================================
// CLUBES FEP — Optional club stages
// ============================================================
const CLUBS_FRIDAY = [
  // AORA (Durex)
  { id: makeId(), name: 'Dolores te canta', day: 'friday', stage: 'club-aora', startTime: '18:00', endTime: '19:00', genres: ['latin', 'pop'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Prismátika DJ Set', day: 'friday', stage: 'club-aora', startTime: '19:10', endTime: '21:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Fleshapoids', day: 'friday', stage: 'club-aora', startTime: '22:00', endTime: '00:00', genres: ['electronic', 'experimental'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'GOTTMIK', day: 'friday', stage: 'club-aora', startTime: '00:30', endTime: '01:00', genres: ['pop', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Leeon DJ Set', day: 'friday', stage: 'club-aora', startTime: '01:00', endTime: '03:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Rompe x Sprite (Napoleón vs Odem)
  { id: makeId(), name: 'Mauro', day: 'friday', stage: 'club-rompe', startTime: '16:00', endTime: '17:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Marakes', day: 'friday', stage: 'club-rompe', startTime: '17:00', endTime: '18:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Tarik B2B VITA', day: 'friday', stage: 'club-rompe', startTime: '18:00', endTime: '19:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Mr Diamonds B2B Felipe Rz', day: 'friday', stage: 'club-rompe', startTime: '19:30', endTime: '21:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Iván Montes', day: 'friday', stage: 'club-rompe', startTime: '21:00', endTime: '22:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Daddy G', day: 'friday', stage: 'club-rompe', startTime: '22:00', endTime: '23:00', genres: ['electronic', 'dj', 'bass-music'], tier: 'mid', isClub: true },
  { id: makeId(), name: 'Alex Serrano F2F Puga', day: 'friday', stage: 'club-rompe', startTime: '23:00', endTime: '00:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'DJ Matt Is Good', day: 'friday', stage: 'club-rompe', startTime: '00:30', endTime: '02:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Frank B2B Harold', day: 'friday', stage: 'club-rompe', startTime: '02:00', endTime: '03:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Club FEP x Coke Studio (KAPUTT)
  { id: makeId(), name: 'Sylvana', day: 'friday', stage: 'club-coke', startTime: '17:30', endTime: '18:30', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Nuclear Digital Transistor', day: 'friday', stage: 'club-coke', startTime: '18:30', endTime: '19:30', genres: ['electronic', 'techno'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Mystery Affair', day: 'friday', stage: 'club-coke', startTime: '19:30', endTime: '21:00', genres: ['electronic', 'house', 'funk'], tier: 'mid', isClub: true },
  { id: makeId(), name: 'Prins Thomas', day: 'friday', stage: 'club-coke', startTime: '21:00', endTime: '22:30', genres: ['electronic', 'house', 'dj'], tier: 'mid', isClub: true },
  { id: makeId(), name: 'Ceberus Greek', day: 'friday', stage: 'club-coke', startTime: '22:30', endTime: '23:30', genres: ['electronic', 'techno'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Dharma', day: 'friday', stage: 'club-coke', startTime: '23:30', endTime: '00:30', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Joint4Nine', day: 'friday', stage: 'club-coke', startTime: '00:30', endTime: '01:30', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Byron The Aquarius', day: 'friday', stage: 'club-coke', startTime: '01:30', endTime: '03:00', genres: ['electronic', 'house', 'soul'], tier: 'mid', isClub: true },
];

const CLUBS_SATURDAY = [
  // AORA (Durex)
  { id: makeId(), name: 'Los Vagabundos del Dharma', day: 'saturday', stage: 'club-aora', startTime: '17:30', endTime: '18:30', genres: ['rock', 'latin'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'La Tigresa del Oriente', day: 'saturday', stage: 'club-aora', startTime: '19:00', endTime: '19:45', genres: ['latin', 'pop'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Cris Arias DJ Set', day: 'saturday', stage: 'club-aora', startTime: '20:00', endTime: '21:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Disco Amore DJ Set', day: 'saturday', stage: 'club-aora', startTime: '21:30', endTime: '23:30', genres: ['electronic', 'house', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'SOS DJ Set', day: 'saturday', stage: 'club-aora', startTime: '01:30', endTime: '03:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Rompe x Sprite (La Pérgola vs Hi I'm Sci)
  { id: makeId(), name: 'Alexxa Ro', day: 'saturday', stage: 'club-rompe', startTime: '16:00', endTime: '17:00', genres: ['electronic', 'pop', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Felipevs', day: 'saturday', stage: 'club-rompe', startTime: '17:00', endTime: '18:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Tatitron B2B Rivera', day: 'saturday', stage: 'club-rompe', startTime: '18:00', endTime: '19:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Blazekha B2B Twelve', day: 'saturday', stage: 'club-rompe', startTime: '19:30', endTime: '21:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Builes DJ', day: 'saturday', stage: 'club-rompe', startTime: '22:00', endTime: '23:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Jordan Lex F2F Blazekha', day: 'saturday', stage: 'club-rompe', startTime: '23:00', endTime: '00:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Rivera B2B Builes DJ', day: 'saturday', stage: 'club-rompe', startTime: '02:00', endTime: '03:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Club FEP x Coke Studio (Salsa)
  { id: makeId(), name: 'Martín Cubillos', day: 'saturday', stage: 'club-coke', startTime: '17:00', endTime: '18:00', genres: ['latin', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Gabo Forero', day: 'saturday', stage: 'club-coke', startTime: '18:00', endTime: '19:00', genres: ['latin', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Matta', day: 'saturday', stage: 'club-coke', startTime: '19:00', endTime: '20:00', genres: ['latin', 'electronic'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Harvy Valencia', day: 'saturday', stage: 'club-coke', startTime: '20:00', endTime: '21:30', genres: ['electronic', 'house', 'latin'], tier: 'mid', isClub: true },
  { id: makeId(), name: 'Calussa', day: 'saturday', stage: 'club-coke', startTime: '21:30', endTime: '23:00', genres: ['electronic', 'house'], tier: 'mid', isClub: true },
  { id: makeId(), name: 'Milo Cedeño', day: 'saturday', stage: 'club-coke', startTime: '23:00', endTime: '00:00', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Almma B2B Aimee', day: 'saturday', stage: 'club-coke', startTime: '00:00', endTime: '01:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Guy Mantzur', day: 'saturday', stage: 'club-coke', startTime: '01:00', endTime: '03:00', genres: ['electronic', 'house', 'techno'], tier: 'mid', isClub: true },
];

const CLUBS_SUNDAY = [
  // AORA (Durex)
  { id: makeId(), name: 'Jano von Skorpio DJ Set', day: 'sunday', stage: 'club-aora', startTime: '17:30', endTime: '19:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'LOMAASBELLO', day: 'sunday', stage: 'club-aora', startTime: '19:15', endTime: '20:15', genres: ['latin', 'pop'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'GOTTMIK DJ Set', day: 'sunday', stage: 'club-aora', startTime: '20:30', endTime: '22:00', genres: ['pop', 'dj', 'electronic'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Masha Ni DJ Set', day: 'sunday', stage: 'club-aora', startTime: '22:00', endTime: '23:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Patojazo DJ Set', day: 'sunday', stage: 'club-aora', startTime: '23:30', endTime: '01:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Rompe x Sprite (Suelta como Gabete vs Tejo Turmequé)
  { id: makeId(), name: 'El Show de Jimmy', day: 'sunday', stage: 'club-rompe', startTime: '16:00', endTime: '17:00', genres: ['latin', 'pop'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Chris Durán', day: 'sunday', stage: 'club-rompe', startTime: '17:00', endTime: '18:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Dj Lolita B2B Lagoona DJ', day: 'sunday', stage: 'club-rompe', startTime: '18:00', endTime: '19:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Julietota B2B Mariboss', day: 'sunday', stage: 'club-rompe', startTime: '19:30', endTime: '21:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Bayonats', day: 'sunday', stage: 'club-rompe', startTime: '21:00', endTime: '22:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Querubín', day: 'sunday', stage: 'club-rompe', startTime: '22:00', endTime: '23:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Michi Gyal F2F Miss Champús', day: 'sunday', stage: 'club-rompe', startTime: '23:00', endTime: '00:30', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'TORNALL', day: 'sunday', stage: 'club-rompe', startTime: '00:30', endTime: '02:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Sir Philis B2B Paquita Gallego', day: 'sunday', stage: 'club-rompe', startTime: '02:00', endTime: '03:00', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },

  // Club FEP x Coke Studio (MAAKK)
  { id: makeId(), name: 'Yajaira La Beyaca', day: 'sunday', stage: 'club-coke', startTime: '17:00', endTime: '17:45', genres: ['latin', 'pop'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Nixss', day: 'sunday', stage: 'club-coke', startTime: '17:45', endTime: '18:45', genres: ['electronic', 'dj'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Isablu', day: 'sunday', stage: 'club-coke', startTime: '18:45', endTime: '19:45', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Aleroj', day: 'sunday', stage: 'club-coke', startTime: '19:45', endTime: '21:15', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: '1tbsp', day: 'sunday', stage: 'club-coke', startTime: '21:15', endTime: '22:45', genres: ['electronic', 'house'], tier: 'emerging', isClub: true },
  { id: makeId(), name: '2AT', day: 'sunday', stage: 'club-coke', startTime: '22:45', endTime: '00:15', genres: ['electronic', 'techno'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Crrdr', day: 'sunday', stage: 'club-coke', startTime: '00:15', endTime: '01:30', genres: ['electronic', 'techno'], tier: 'emerging', isClub: true },
  { id: makeId(), name: 'Noise Mafia', day: 'sunday', stage: 'club-coke', startTime: '01:30', endTime: '03:00', genres: ['electronic', 'techno', 'bass-music'], tier: 'emerging', isClub: true },
];

export const CLUB_ARTISTS = [...CLUBS_FRIDAY, ...CLUBS_SATURDAY, ...CLUBS_SUNDAY];

// Combined getter: all artists (optionally with clubs)
export function getAllArtists(includeClubs = false) {
  return includeClubs ? [...ARTISTS, ...CLUB_ARTISTS] : ARTISTS;
}

// Helper: get artists for a specific day
export function getArtistsByDay(dayId, includeClubs = false) {
  const all = includeClubs ? [...ARTISTS, ...CLUB_ARTISTS] : ARTISTS;
  return all.filter(a => a.day === dayId);
}

// Helper: get artists for a specific stage on a specific day
export function getArtistsByDayAndStage(dayId, stageId) {
  const all = [...ARTISTS, ...CLUB_ARTISTS];
  return all.filter(a => a.day === dayId && a.stage === stageId);
}

// Helper: get a single artist by ID
export function getArtistById(id) {
  return ARTISTS.find(a => a.id === id) || CLUB_ARTISTS.find(a => a.id === id);
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
