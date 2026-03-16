// ============================================================
// FEP2026 — Festival Map & Dynamic Route Rendering
// ============================================================

import { ARTISTS, DAYS, getArtistDisplayName, getArtistMetaLabel, timeToMinutes } from './data.js';
import { generateRoutePlan } from './merge.js';

const MAP_REFERENCE = {
  width: 2160,
  height: 1350,
  metersPerPixel: 0.42,
  walkingMetersPerMinute: 72,
};

const MAP_IMAGE_SRC = 'assets/images/map/fep-site-map.png';

export const DEFAULT_MAP_LAYERS = [];

const SUPPORT_STOP_META = {
  food: {
    icon: '🍔',
    label: 'Comida',
    badgeLabel: 'Comer',
    color: '#FF8A00',
  },
  water: {
    icon: '💧',
    label: 'Agua',
    badgeLabel: 'Agua',
    color: '#7CE7FF',
  },
  bathroom: {
    icon: '🚻',
    label: 'Baños',
    badgeLabel: 'Baños',
    color: '#4DD0FF',
  },
  service: {
    icon: '◎',
    label: 'Servicios',
    badgeLabel: 'Extra',
    color: '#64E38B',
  },
};

const MAP_LAYER_META = {
  stage: {
    label: 'Escenarios',
    icon: '♫',
    color: '#B388FF',
    description: 'Escenarios principales y espacios del lineup.',
  },
  club: {
    label: 'Clubes',
    icon: '✦',
    color: '#FF5B8A',
    description: 'Carpas y espacios off-grid de Clubes.',
  },
  entrance: {
    label: 'Accesos',
    icon: '↗',
    color: '#FFE066',
    description: 'Ingresos, taquilla y conexión con TransMi.',
  },
  food: {
    label: 'Comidas',
    icon: '🍔',
    color: '#FF8A00',
    description: 'Zonas de comidas y restaurantes del mapa oficial.',
  },
  water: {
    label: 'Agua',
    icon: '💧',
    color: '#7CE7FF',
    description: 'Puntos de mínimo vital de agua.',
  },
  bathroom: {
    label: 'Baños',
    icon: '🚻',
    color: '#4DD0FF',
    description: 'Baños y lavamanos.',
  },
  vip: {
    label: 'VIP',
    icon: '◆',
    color: '#83D4FF',
    description: 'Zonas VIP visibles en el mapa oficial.',
  },
  service: {
    label: 'Servicios',
    icon: '◎',
    color: '#64E38B',
    description: 'Oasis, cashless, merch, accesibilidad y Vassar.',
  },
};

const MAP_LOCATIONS = [
  { id: 'stage-bosque', label: 'Escenario Bosque', shortLabel: 'Bosque', x: 24.8, y: 30.8, category: 'stage' },
  { id: 'stage-un-mundo-distinto', label: 'Escenario Un Mundo Distinto', shortLabel: 'Un Mundo Distinto', x: 37.1, y: 64.0, category: 'stage' },
  { id: 'stage-lago', label: 'Escenario Lago', shortLabel: 'Lago', x: 68.5, y: 29.0, category: 'stage' },
  { id: 'stage-paramo', label: 'Escenario Páramo', shortLabel: 'Páramo', x: 84.0, y: 38.0, category: 'stage' },
  { id: 'stage-estereo-picnic', label: 'Escenario Estéreo Picnic', shortLabel: 'Estéreo Picnic', x: 90.5, y: 78.5, category: 'stage' },
  { id: 'stage-fuerza-bruta', label: 'Fuerza Bruta', shortLabel: 'Fuerza Bruta', x: 95.5, y: 39.5, category: 'stage' },
  { id: 'club-aora', label: 'Club AORA x Durex', shortLabel: 'AORA', x: 61.3, y: 28.0, category: 'club' },
  { id: 'club-rompe', label: 'Rompe x Sprite', shortLabel: 'Rompe x Sprite', x: 61.8, y: 36.0, category: 'club' },
  { id: 'club-coke', label: 'Club FEP x Coke Studio', shortLabel: 'Coke Studio', x: 64.8, y: 47.5, category: 'club' },
  { id: 'food-norte', label: 'Zona de comidas Norte', shortLabel: 'Comidas norte', x: 38.8, y: 14.8, category: 'food' },
  { id: 'food-sur', label: 'Zona de comidas Sur', shortLabel: 'Comidas sur', x: 46.3, y: 79.4, category: 'food' },
  { id: 'food-oriente', label: 'Zona de comidas Oriente', shortLabel: 'Comidas oriente', x: 97.1, y: 47.8, category: 'food' },
  { id: 'bath-bosque', label: 'Baños Bosque / VIP 3', shortLabel: 'Baños oeste', x: 30.8, y: 40.8, category: 'bathroom' },
  { id: 'bath-centro', label: 'Baños centro', shortLabel: 'Baños centro', x: 54.0, y: 21.2, category: 'bathroom' },
  { id: 'bath-coke', label: 'Baños Coke / Vassar', shortLabel: 'Baños Coke', x: 68.0, y: 46.8, category: 'bathroom' },
  { id: 'bath-vip1', label: 'Baños VIP 1', shortLabel: 'Baños VIP 1', x: 82.8, y: 72.0, category: 'bathroom' },
  { id: 'bath-sur', label: 'Baños sur', shortLabel: 'Baños sur', x: 61.2, y: 83.2, category: 'bathroom' },
  { id: 'water-bosque', label: 'Agua Bosque', shortLabel: 'Agua oeste', x: 20.6, y: 42.2, category: 'water' },
  { id: 'water-centro', label: 'Agua centro', shortLabel: 'Agua centro', x: 53.8, y: 18.2, category: 'water' },
  { id: 'water-coke', label: 'Agua Coke / Vassar', shortLabel: 'Agua Coke', x: 72.6, y: 46.3, category: 'water' },
  { id: 'water-sur', label: 'Agua sur', shortLabel: 'Agua sur', x: 60.1, y: 88.8, category: 'water' },
  { id: 'vip-1', label: 'Zona VIP 1', shortLabel: 'VIP 1', x: 83.0, y: 70.6, category: 'vip' },
  { id: 'vip-2', label: 'Zona VIP 2', shortLabel: 'VIP 2', x: 51.0, y: 73.2, category: 'vip' },
  { id: 'vip-3', label: 'Zona VIP 3', shortLabel: 'VIP 3', x: 26.8, y: 37.9, category: 'vip' },
  { id: 'entrance-festival', label: 'Ingreso al festival', shortLabel: 'Ingreso festival', x: 6.5, y: 39.8, category: 'entrance' },
  { id: 'entrance-vip', label: 'Ingreso accesible & suites VIP', shortLabel: 'Ingreso VIP', x: 58.6, y: 97.1, category: 'entrance' },
  { id: 'entrance-general', label: 'Ingreso General', shortLabel: 'Ingreso General', x: 69.2, y: 98.1, category: 'entrance' },
  { id: 'entrance-futuro', label: 'Ingreso Futuro Picnic', shortLabel: 'Ingreso Futuro Picnic', x: 83.7, y: 98.1, category: 'entrance' },
  { id: 'taquilla', label: 'Taquilla CC. Gran Estación', shortLabel: 'Taquilla', x: 4.0, y: 15.7, category: 'entrance' },
  { id: 'transmi', label: 'Servicio de TransMi', shortLabel: 'TransMi', x: 4.1, y: 21.8, category: 'entrance' },
  { id: 'service-oasis', label: 'Oasis & zona de recuperación', shortLabel: 'Oasis', x: 21.4, y: 35.8, category: 'service' },
  { id: 'service-merch', label: 'Merch Oficial & KOAJ', shortLabel: 'Merch', x: 52.0, y: 35.5, category: 'service' },
  { id: 'service-vassar-norte', label: 'Vassar Norte', shortLabel: 'Vassar Norte', x: 74.2, y: 15.0, category: 'service' },
  { id: 'service-vassar-oriente', label: 'Vassar Oriente', shortLabel: 'Vassar Oriente', x: 75.9, y: 67.0, category: 'service' },
  { id: 'service-cashless-coke', label: 'Cashless central', shortLabel: 'Cashless', x: 58.9, y: 63.4, category: 'service' },
  { id: 'service-access', label: 'Zona de accesibilidad', shortLabel: 'Accesibilidad', x: 63.2, y: 62.2, category: 'service' },
];

const STAGE_TO_LOCATION = {
  bosque: 'stage-bosque',
  'un-mundo-distinto': 'stage-un-mundo-distinto',
  lago: 'stage-lago',
  paramo: 'stage-paramo',
  'estereo-picnic': 'stage-estereo-picnic',
  'fuerza-bruta': 'stage-fuerza-bruta',
};

const CLUB_VENUE_TO_LOCATION = {
  aora: 'club-aora',
  'napoleon vs odem': 'club-rompe',
  "la pergola vs hi i'm sci": 'club-rompe',
  'suelta como gabete vs tejo turmeque': 'club-rompe',
  kaputt: 'club-coke',
  salsa: 'club-coke',
  muakk: 'club-coke',
};

const PATH_NODES = {
  'west-gate': { id: 'west-gate', x: 9.2, y: 40.6 },
  'west-inner': { id: 'west-inner', x: 14.3, y: 40.0 },
  'west-curve': { id: 'west-curve', x: 19.6, y: 39.8 },
  'bosque-hub': { id: 'bosque-hub', x: 25.1, y: 38.7 },
  'bosque-stage': { id: 'bosque-stage', x: 26.0, y: 33.3 },
  'north-west-1': { id: 'north-west-1', x: 31.2, y: 34.9 },
  'north-west-2': { id: 'north-west-2', x: 37.4, y: 30.8 },
  'north-west-3': { id: 'north-west-3', x: 44.3, y: 26.8 },
  'north-center': { id: 'north-center', x: 51.6, y: 23.5 },
  'north-center-2': { id: 'north-center-2', x: 58.1, y: 23.4 },
  'north-arc-1': { id: 'north-arc-1', x: 65.1, y: 23.0 },
  'north-arc-2': { id: 'north-arc-2', x: 72.2, y: 23.1 },
  'aora-node': { id: 'aora-node', x: 60.8, y: 28.8 },
  'rompe-node': { id: 'rompe-node', x: 60.8, y: 36.6 },
  'lago-node': { id: 'lago-node', x: 69.5, y: 29.4 },
  'east-upper-1': { id: 'east-upper-1', x: 76.3, y: 29.6 },
  'east-upper-2': { id: 'east-upper-2', x: 81.4, y: 31.7 },
  'paramo-node': { id: 'paramo-node', x: 84.0, y: 38.8 },
  'fb-node': { id: 'fb-node', x: 93.7, y: 41.2 },
  'center-west': { id: 'center-west', x: 33.0, y: 45.4 },
  'center-mid-1': { id: 'center-mid-1', x: 41.2, y: 47.0 },
  'center-mid-2': { id: 'center-mid-2', x: 48.8, y: 46.3 },
  'center-hub': { id: 'center-hub', x: 56.2, y: 43.8 },
  'center-east': { id: 'center-east', x: 62.2, y: 45.1 },
  'coke-node': { id: 'coke-node', x: 66.3, y: 48.2 },
  'east-mid-1': { id: 'east-mid-1', x: 72.9, y: 48.7 },
  'east-mid': { id: 'east-mid', x: 79.8, y: 49.5 },
  'east-descent-1': { id: 'east-descent-1', x: 76.8, y: 60.8 },
  'east-descent-2': { id: 'east-descent-2', x: 72.6, y: 68.0 },
  'south-west-1': { id: 'south-west-1', x: 30.6, y: 52.8 },
  'south-west-2': { id: 'south-west-2', x: 34.0, y: 58.5 },
  'south-west': { id: 'south-west', x: 39.8, y: 62.4 },
  'umd-node': { id: 'umd-node', x: 38.3, y: 63.7 },
  'south-center-1': { id: 'south-center-1', x: 53.9, y: 55.4 },
  'south-center-2': { id: 'south-center-2', x: 54.7, y: 62.8 },
  'south-center': { id: 'south-center', x: 55.6, y: 68.0 },
  'south-east-1': { id: 'south-east-1', x: 61.7, y: 70.8 },
  'south-east': { id: 'south-east', x: 68.4, y: 75.0 },
  'ep-approach': { id: 'ep-approach', x: 79.8, y: 77.2 },
  'ep-node': { id: 'ep-node', x: 88.7, y: 78.8 },
  'vip-corridor': { id: 'vip-corridor', x: 56.6, y: 84.7 },
  'vip-entry': { id: 'vip-entry', x: 58.7, y: 92.6 },
  'general-corridor': { id: 'general-corridor', x: 68.8, y: 87.0 },
  'general-entry': { id: 'general-entry', x: 69.1, y: 95.7 },
  'futuro-corridor': { id: 'futuro-corridor', x: 76.9, y: 88.8 },
  'futuro-entry': { id: 'futuro-entry', x: 83.3, y: 96.2 },
};

const PATH_EDGES = [
  ['west-gate', 'west-inner'],
  ['west-inner', 'west-curve'],
  ['west-curve', 'bosque-hub'],
  ['bosque-hub', 'bosque-stage'],
  ['bosque-hub', 'north-west-1'],
  ['north-west-1', 'north-west-2'],
  ['north-west-2', 'north-west-3'],
  ['north-west-3', 'north-center'],
  ['north-center', 'north-center-2'],
  ['north-center-2', 'north-arc-1'],
  ['north-arc-1', 'north-arc-2'],
  ['north-arc-2', 'lago-node'],
  ['north-center-2', 'aora-node'],
  ['aora-node', 'rompe-node'],
  ['aora-node', 'lago-node'],
  ['lago-node', 'east-upper-1'],
  ['east-upper-1', 'east-upper-2'],
  ['east-upper-2', 'paramo-node'],
  ['paramo-node', 'fb-node'],
  ['bosque-hub', 'center-west'],
  ['center-west', 'center-mid-1'],
  ['center-mid-1', 'center-mid-2'],
  ['center-mid-2', 'center-hub'],
  ['rompe-node', 'center-hub'],
  ['center-hub', 'center-east'],
  ['center-east', 'coke-node'],
  ['center-hub', 'south-center-1'],
  ['south-center-1', 'south-center-2'],
  ['south-center-2', 'south-center'],
  ['coke-node', 'east-mid-1'],
  ['east-mid-1', 'east-mid'],
  ['east-mid', 'east-descent-1'],
  ['east-descent-1', 'east-descent-2'],
  ['east-descent-2', 'south-east'],
  ['bosque-hub', 'south-west-1'],
  ['south-west-1', 'south-west-2'],
  ['south-west-2', 'south-west'],
  ['south-west', 'umd-node'],
  ['south-west', 'south-center-1'],
  ['south-center', 'south-east-1'],
  ['south-east-1', 'south-east'],
  ['south-center', 'vip-corridor'],
  ['vip-corridor', 'vip-entry'],
  ['vip-entry', 'general-entry'],
  ['general-entry', 'general-corridor'],
  ['general-corridor', 'south-east'],
  ['general-corridor', 'futuro-corridor'],
  ['futuro-corridor', 'futuro-entry'],
  ['south-east', 'ep-approach'],
  ['ep-approach', 'ep-node'],
  ['east-mid', 'paramo-node'],
  ['coke-node', 'south-east-1'],
];

const LOCATION_TO_PATH_NODE = {
  'stage-bosque': 'bosque-stage',
  'stage-un-mundo-distinto': 'umd-node',
  'stage-lago': 'lago-node',
  'stage-paramo': 'paramo-node',
  'stage-estereo-picnic': 'ep-node',
  'stage-fuerza-bruta': 'fb-node',
  'club-aora': 'aora-node',
  'club-rompe': 'rompe-node',
  'club-coke': 'coke-node',
};

const PATH_GRAPH = buildPathGraph();

function normalizeLabel(value) {
  return (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

function getLocation(locationId) {
  return MAP_LOCATIONS.find(location => location.id === locationId) || null;
}

function resolveArtistLocation(artist) {
  if (!artist) return null;
  if (!artist.isClub) {
    return getLocation(STAGE_TO_LOCATION[artist.stage]);
  }

  const venueKey = normalizeLabel(artist.clubVenue);
  return getLocation(CLUB_VENUE_TO_LOCATION[venueKey]);
}

function resolveLocationFromStageKey(stageKey) {
  if (!stageKey) return null;
  if (stageKey.startsWith('club:')) {
    const parts = stageKey.split(':');
    const venue = normalizeLabel(parts.slice(2).join(':'));
    return getLocation(CLUB_VENUE_TO_LOCATION[venue]);
  }
  return getLocation(STAGE_TO_LOCATION[stageKey]);
}

function getDistanceInPixels(a, b) {
  const dx = ((a.x - b.x) / 100) * MAP_REFERENCE.width;
  const dy = ((a.y - b.y) / 100) * MAP_REFERENCE.height;
  return Math.hypot(dx, dy);
}

function buildPathGraph() {
  const graph = new Map();
  for (const [from, to] of PATH_EDGES) {
    const fromNode = PATH_NODES[from];
    const toNode = PATH_NODES[to];
    const distance = getDistanceInPixels(fromNode, toNode);

    if (!graph.has(from)) graph.set(from, []);
    if (!graph.has(to)) graph.set(to, []);
    graph.get(from).push({ id: to, distance });
    graph.get(to).push({ id: from, distance });
  }
  return graph;
}

function getNearestPathNodeId(location) {
  return Object.values(PATH_NODES).reduce((closest, node) => {
    if (!closest) return node.id;
    return getDistanceInPixels(location, node) < getDistanceInPixels(location, PATH_NODES[closest]) ? node.id : closest;
  }, null);
}

function getConnectorNodeId(location) {
  return LOCATION_TO_PATH_NODE[location.id] || getNearestPathNodeId(location);
}

function findPathNodeSequence(startNodeId, endNodeId) {
  if (!startNodeId || !endNodeId) return [];
  if (startNodeId === endNodeId) return [startNodeId];

  const distances = new Map([[startNodeId, 0]]);
  const previous = new Map();
  const queue = new Set(Object.keys(PATH_NODES));

  while (queue.size > 0) {
    let currentId = null;
    let currentDistance = Infinity;
    for (const nodeId of queue) {
      const distance = distances.get(nodeId) ?? Infinity;
      if (distance < currentDistance) {
        currentDistance = distance;
        currentId = nodeId;
      }
    }

    if (!currentId || currentDistance === Infinity) break;
    queue.delete(currentId);
    if (currentId === endNodeId) break;

    for (const neighbor of PATH_GRAPH.get(currentId) || []) {
      if (!queue.has(neighbor.id)) continue;
      const alt = currentDistance + neighbor.distance;
      if (alt < (distances.get(neighbor.id) ?? Infinity)) {
        distances.set(neighbor.id, alt);
        previous.set(neighbor.id, currentId);
      }
    }
  }

  const path = [];
  let cursor = endNodeId;
  while (cursor) {
    path.unshift(cursor);
    cursor = previous.get(cursor);
    if (cursor === startNodeId) {
      path.unshift(cursor);
      break;
    }
  }

  return path.length > 0 ? path : [startNodeId, endNodeId];
}

function dedupeSequentialPoints(points) {
  return points.filter((point, index, list) => {
    if (index === 0) return true;
    return point.x !== list[index - 1].x || point.y !== list[index - 1].y;
  });
}

function getRoutePointsBetweenLocations(from, to) {
  if (!from || !to) return [];
  if (from.id === to.id) return [from, to];

  const startNodeId = getConnectorNodeId(from);
  const endNodeId = getConnectorNodeId(to);
  const nodeSequence = findPathNodeSequence(startNodeId, endNodeId)
    .map(nodeId => PATH_NODES[nodeId])
    .filter(Boolean);

  return dedupeSequentialPoints([from, ...nodeSequence, to]);
}

function getPathLength(points) {
  let total = 0;
  for (let index = 0; index < points.length - 1; index++) {
    total += getDistanceInPixels(points[index], points[index + 1]);
  }
  return total;
}

function estimateWalkMinutes(a, b) {
  if (!a || !b) return 0;
  const distanceMeters = getDistanceInPixels(a, b) * MAP_REFERENCE.metersPerPixel;
  return Math.max(2, Math.round(distanceMeters / MAP_REFERENCE.walkingMetersPerMinute));
}

function getNearestLocation(location, category) {
  const candidates = MAP_LOCATIONS.filter(candidate => candidate.category === category);
  if (!location || candidates.length === 0) return null;

  return candidates.reduce((closest, candidate) => {
    if (!closest) return candidate;
    return getDistanceInPixels(location, candidate) < getDistanceInPixels(location, closest) ? candidate : closest;
  }, null);
}

function getItemSupport(location) {
  return {
    nearbyFood: location ? getNearestLocation(location, 'food') : null,
    nearbyWater: location ? getNearestLocation(location, 'water') : null,
    nearbyBathroom: location ? getNearestLocation(location, 'bathroom') : null,
    nearbyService: location ? getNearestLocation(location, 'service') : null,
  };
}

function getRouteGapMinutes(currentItem, nextItem) {
  if (!currentItem || !nextItem) return 0;
  return Math.max(0, timeToMinutes(nextItem.startTime) - timeToMinutes(currentItem.endTime));
}

function getServiceSuggestionTitle(location) {
  const normalized = normalizeLabel(location?.label || '');
  if (normalized.includes('cashless')) return 'Recarga cashless';
  if (normalized.includes('oasis')) return 'Pausa y recuperación';
  if (normalized.includes('merch')) return 'Punto útil al paso';
  return 'Parada útil';
}

function getServiceSuggestionBadge(location) {
  const normalized = normalizeLabel(location?.label || '');
  if (normalized.includes('cashless')) return 'Cashless';
  if (normalized.includes('oasis')) return 'Oasis';
  if (normalized.includes('merch')) return 'Merch';
  return 'Extra';
}

function createSupportSuggestion(type, location, title, reason) {
  if (!location) return null;
  const meta = SUPPORT_STOP_META[type];
  const badgeLabel = type === 'service' ? getServiceSuggestionBadge(location) : meta.badgeLabel;
  return {
    id: `${type}-${location.id}`,
    type,
    icon: meta.icon,
    color: meta.color,
    label: meta.label,
    badgeLabel,
    title,
    reason,
    location,
  };
}

function pushSuggestion(suggestions, usedLocationIds, suggestion) {
  if (!suggestion?.location || usedLocationIds.has(suggestion.location.id)) {
    return false;
  }

  suggestions.push(suggestion);
  usedLocationIds.add(suggestion.location.id);
  return true;
}

function buildRouteSuggestions(items, segments) {
  if (items.length === 0) return [];

  const suggestions = [];
  const usedLocationIds = new Set();
  const gaps = items.slice(0, -1).map((item, index) => ({
    item,
    next: items[index + 1],
    gapMinutes: getRouteGapMinutes(item, items[index + 1]),
    segment: segments[index],
  }));

  const mealCandidate = gaps
    .filter(entry => entry.gapMinutes >= 35)
    .sort((a, b) => b.gapMinutes - a.gapMinutes)[0];

  if (mealCandidate) {
    pushSuggestion(
      suggestions,
      usedLocationIds,
      createSupportSuggestion(
        'food',
        mealCandidate.item.nearbyFood || mealCandidate.next.nearbyFood,
        'Ventana para comer',
        `${mealCandidate.gapMinutes} min libres entre ${mealCandidate.item.title} y ${mealCandidate.next.title}.`
      )
    );
  }

  if (!suggestions.some(suggestion => suggestion.type === 'food')) {
    const anchor = items[Math.min(items.length - 1, Math.floor(items.length / 2))];
    pushSuggestion(
      suggestions,
      usedLocationIds,
      createSupportSuggestion(
        'food',
        anchor?.nearbyFood,
        'Comida a mano',
        anchor ? `Te queda cerca al pasar por ${anchor.title}.` : 'Queda al paso dentro de tu ruta.'
      )
    );
  }

  const longestSegment = segments.slice().sort((a, b) => b.walkMinutes - a.walkMinutes)[0];
  if (longestSegment) {
    const destinationItem = items.find(item => item.location?.id === longestSegment.to.id) || items[0];
    pushSuggestion(
      suggestions,
      usedLocationIds,
      createSupportSuggestion(
        'water',
        destinationItem?.nearbyWater || getNearestLocation(longestSegment.to, 'water'),
        'Hidratación antes del tramo largo',
        `El cambio hacia ${longestSegment.to.shortLabel} suma ~${longestSegment.walkMinutes} min caminando.`
      )
    );
  }

  const bathroomGap = gaps.find(entry => entry.gapMinutes >= 15 && (entry.next?.nearbyBathroom || entry.item?.nearbyBathroom));
  const bathroomAnchor = bathroomGap?.next || items[items.length - 1];
  pushSuggestion(
    suggestions,
    usedLocationIds,
    createSupportSuggestion(
      'bathroom',
      bathroomGap?.next?.nearbyBathroom || bathroomGap?.item?.nearbyBathroom || bathroomAnchor?.nearbyBathroom,
      bathroomGap ? 'Pausa técnica entre sets' : 'Baños a mano',
      bathroomGap
        ? `${bathroomGap.gapMinutes} min antes de ${bathroomGap.next.title}.`
        : bathroomAnchor
          ? `Te quedan cerca al cerrar por ${bathroomAnchor.title}.`
          : 'Quedan cerca dentro de tu recorrido.'
    )
  );

  const serviceAnchor = items[Math.min(items.length - 1, Math.floor(items.length / 2))];
  const serviceLocation = serviceAnchor?.nearbyService;
  pushSuggestion(
    suggestions,
    usedLocationIds,
    createSupportSuggestion(
      'service',
      serviceLocation,
      getServiceSuggestionTitle(serviceLocation),
      serviceAnchor ? `Queda al paso cerca de ${serviceAnchor.title}.` : 'Te queda en el centro de la ruta.'
    )
  );

  return suggestions.slice(0, 4);
}

function compressRouteLocations(items) {
  const locations = [];
  for (const item of items) {
    if (!item.location) continue;
    if (locations.length === 0 || locations[locations.length - 1].id !== item.location.id) {
      locations.push(item.location);
    }
  }
  return locations;
}

function buildRouteMetrics(pathLocations) {
  let totalWalkMinutes = 0;
  const segments = [];
  const routePoints = [];

  for (let i = 0; i < pathLocations.length - 1; i++) {
    const from = pathLocations[i];
    const to = pathLocations[i + 1];
    const segmentPoints = getRoutePointsBetweenLocations(from, to);
    const walkMinutes = Math.max(
      2,
      Math.round((getPathLength(segmentPoints) * MAP_REFERENCE.metersPerPixel) / MAP_REFERENCE.walkingMetersPerMinute)
    );
    totalWalkMinutes += walkMinutes;
    if (routePoints.length === 0) {
      routePoints.push(...segmentPoints);
    } else {
      routePoints.push(...segmentPoints.slice(1));
    }
    segments.push({
      from,
      to,
      walkMinutes,
      points: segmentPoints,
    });
  }

  return {
    totalWalkMinutes,
    segments,
    routePoints: routePoints.length > 0 ? dedupeSequentialPoints(routePoints) : pathLocations,
  };
}

function buildPersonalRoute(dayId, selectedIds) {
  const selectedArtists = ARTISTS
    .filter(artist => selectedIds.has(artist.id) && artist.day === dayId)
    .sort((a, b) => {
      const delta = timeToMinutes(a.startTime) - timeToMinutes(b.startTime);
      return delta !== 0 ? delta : a.name.localeCompare(b.name);
    });

  const items = selectedArtists.map((artist, index) => {
    const location = resolveArtistLocation(artist);
    const previous = selectedArtists[index - 1];
    const hasConflict = Boolean(previous) && timeToMinutes(artist.startTime) < timeToMinutes(previous.endTime);
    const support = getItemSupport(location);
    return {
      id: artist.id,
      startTime: artist.startTime,
      endTime: artist.endTime,
      title: getArtistDisplayName(artist),
      meta: getArtistMetaLabel(artist),
      location,
      locationId: location?.id || '',
      isConflict: hasConflict,
      conflictWith: [],
      ...support,
    };
  });

  for (let i = 0; i < selectedArtists.length; i++) {
    for (let j = i + 1; j < selectedArtists.length; j++) {
      const a = selectedArtists[i];
      const b = selectedArtists[j];
      if (timeToMinutes(a.startTime) < timeToMinutes(b.endTime) && timeToMinutes(b.startTime) < timeToMinutes(a.endTime)) {
        items[i].conflictWith.push(getArtistDisplayName(b));
        items[j].conflictWith.push(getArtistDisplayName(a));
      }
    }
  }

  const pathLocations = compressRouteLocations(items);
  const metrics = buildRouteMetrics(pathLocations);
  const suggestions = buildRouteSuggestions(items, metrics.segments);

  return {
    mode: 'personal',
    items,
    pathLocations,
    splitLocations: [],
    splitMoments: [],
    suggestions,
    ...metrics,
  };
}

function buildGroupRoute(dayId, mergeState) {
  if (!mergeState?.schedules?.length) {
    return {
      mode: 'group',
      items: [],
      pathLocations: [],
      splitLocations: [],
      splitMoments: [],
      suggestions: [],
      totalWalkMinutes: 0,
      segments: [],
      unavailableMessage: 'Combina al menos dos agendas para pintar la ruta del grupo.',
    };
  }

  const routePlan = generateRoutePlan(mergeState.schedules, dayId);
  const items = [];
  const splitMoments = [];
  let currentItem = null;

  for (let index = 0; index < routePlan.length; index++) {
    const slot = routePlan[index];
    const nextTime = routePlan[index + 1]?.time || slot.time;

    if (slot.allTogether && slot.people.length > 0) {
      const leader = slot.people[0];
      const location = resolveLocationFromStageKey(leader.stageId);
      if (currentItem && currentItem.locationId === leader.stageId) {
        currentItem.endTime = nextTime;
      } else {
        const support = getItemSupport(location);
        currentItem = {
          id: `group-${slot.time}-${leader.stageId}`,
          startTime: slot.time,
          endTime: nextTime,
          title: leader.artist,
          meta: leader.stage,
          location,
          locationId: leader.stageId,
          isConflict: false,
          ...support,
        };
        items.push(currentItem);
      }
    } else if (slot.people.length > 0) {
      const labels = Array.from(new Set(slot.people.map(person => person.stage)));
      splitMoments.push({
        time: slot.time,
        labels,
        locationIds: slot.people.map(person => person.stageId),
      });
      currentItem = null;
    } else {
      currentItem = null;
    }
  }

  const pathLocations = compressRouteLocations(items);
  const metrics = buildRouteMetrics(pathLocations);
  const suggestions = buildRouteSuggestions(items, metrics.segments);

  return {
    mode: 'group',
    items,
    pathLocations,
    splitLocations: Array.from(new Set(splitMoments.flatMap(moment => moment.locationIds))),
    splitMoments,
    suggestions,
    ...metrics,
  };
}

function getRouteData(dayId, selectedIds, mode, mergeState) {
  return mode === 'group' ? buildGroupRoute(dayId, mergeState) : buildPersonalRoute(dayId, selectedIds);
}

function offsetPoint(from, to, distance) {
  const deltaX = to.x - from.x;
  const deltaY = to.y - from.y;
  const length = Math.hypot(deltaX, deltaY);
  if (length === 0) {
    return { x: from.x, y: from.y };
  }

  return {
    x: from.x + (deltaX / length) * distance,
    y: from.y + (deltaY / length) * distance,
  };
}

function buildRoundedPath(points) {
  const deduped = dedupeSequentialPoints(points);
  if (deduped.length === 0) return '';
  if (deduped.length === 1) return `M ${deduped[0].x} ${deduped[0].y}`;
  if (deduped.length === 2) return `M ${deduped[0].x} ${deduped[0].y} L ${deduped[1].x} ${deduped[1].y}`;

  let path = `M ${deduped[0].x} ${deduped[0].y}`;

  for (let index = 1; index < deduped.length - 1; index++) {
    const previous = deduped[index - 1];
    const current = deduped[index];
    const next = deduped[index + 1];
    const prevDistance = Math.hypot(current.x - previous.x, current.y - previous.y);
    const nextDistance = Math.hypot(next.x - current.x, next.y - current.y);
    const radius = Math.min(1.3, prevDistance * 0.35, nextDistance * 0.35);
    const entry = offsetPoint(current, previous, radius);
    const exit = offsetPoint(current, next, radius);

    path += ` L ${entry.x} ${entry.y} Q ${current.x} ${current.y} ${exit.x} ${exit.y}`;
  }

  const last = deduped[deduped.length - 1];
  path += ` L ${last.x} ${last.y}`;
  return path;
}

function getPointAlongPolyline(points, fraction = 0.5) {
  const deduped = dedupeSequentialPoints(points);
  if (deduped.length === 0) return null;
  if (deduped.length === 1) return { x: deduped[0].x, y: deduped[0].y, angle: 0 };

  const segmentLengths = [];
  let totalLength = 0;

  for (let index = 0; index < deduped.length - 1; index++) {
    const start = deduped[index];
    const end = deduped[index + 1];
    const length = Math.hypot(end.x - start.x, end.y - start.y);
    segmentLengths.push(length);
    totalLength += length;
  }

  if (totalLength === 0) {
    return { x: deduped[0].x, y: deduped[0].y, angle: 0 };
  }

  const target = totalLength * fraction;
  let traversed = 0;

  for (let index = 0; index < segmentLengths.length; index++) {
    const length = segmentLengths[index];
    const start = deduped[index];
    const end = deduped[index + 1];
    if (traversed + length >= target) {
      const local = (target - traversed) / length;
      return {
        x: start.x + (end.x - start.x) * local,
        y: start.y + (end.y - start.y) * local,
        angle: Math.atan2(end.y - start.y, end.x - start.x) * (180 / Math.PI),
      };
    }
    traversed += length;
  }

  const lastStart = deduped[deduped.length - 2];
  const last = deduped[deduped.length - 1];
  return {
    x: last.x,
    y: last.y,
    angle: Math.atan2(last.y - lastStart.y, last.x - lastStart.x) * (180 / Math.PI),
  };
}

function buildRouteSvg(routeData, mode) {
  const routePoints = routeData.routePoints || routeData.pathLocations;
  if (routePoints.length < 2) {
    return '';
  }

  const pathData = buildRoundedPath(routePoints);
  const stopIds = new Set(routeData.pathLocations.map(location => location.id));
  const breadcrumbs = routePoints
    .filter((point, index) => index > 0 && index < routePoints.length - 1 && !stopIds.has(point.id))
    .map(point => `<circle class="map-route-breadcrumb ${mode}" cx="${point.x}" cy="${point.y}" r="0.42" />`)
    .join('');
  const directionMarkers = routeData.segments
    .map((segment, index) => {
      const point = getPointAlongPolyline(segment.points, 0.5);
      if (!point) return '';
      return `
        <g class="map-route-arrow ${mode}" transform="translate(${point.x} ${point.y}) rotate(${point.angle})">
          <circle class="map-route-arrow-backdrop" cx="0" cy="0" r="1.7" />
          <path class="map-route-arrow-glyph" d="M -0.6 -0.5 L 0.65 0 L -0.6 0.5" />
          <text class="map-route-arrow-label" x="0" y="3.25" text-anchor="middle">${index + 1}→${index + 2}</text>
        </g>
      `;
    })
    .join('');
  const start = routeData.pathLocations[0];
  const end = routeData.pathLocations[routeData.pathLocations.length - 1];
  const endpoints = [
    start ? `<circle class="map-route-endcap start ${mode}" cx="${start.x}" cy="${start.y}" r="1.7" />` : '',
    end && end.id !== start?.id ? `<circle class="map-route-endcap end ${mode}" cx="${end.x}" cy="${end.y}" r="1.7" />` : '',
  ].join('');

  return `
    <path class="map-route-track ${mode}" d="${pathData}" pathLength="100" />
    <path class="map-route-shadow" d="${pathData}" />
    <path class="map-route-line ${mode}" d="${pathData}" pathLength="100" />
    <path class="map-route-flow ${mode}" d="${pathData}" pathLength="100" />
    ${breadcrumbs}
    ${endpoints}
    ${directionMarkers}
  `;
}

function formatRouteOverview(routeData, dayId, activeMode) {
  const day = DAYS.find(entry => entry.id === dayId);
  if (activeMode === 'group' && routeData.unavailableMessage) {
    return `${day?.label || ''} · Ruta del grupo aún no disponible`;
  }
  if (routeData.items.length === 0) {
    return `${day?.label || ''} · No hay paradas seleccionadas`;
  }
  const start = routeData.pathLocations[0]?.shortLabel;
  const end = routeData.pathLocations[routeData.pathLocations.length - 1]?.shortLabel;
  const pathCopy = start && end
    ? start === end
      ? start
      : `${start} → ${end}`
    : `${routeData.items.length} parada${routeData.items.length === 1 ? '' : 's'}`;
  return `${day?.label || ''} · ${activeMode === 'group' ? 'Ruta del grupo' : 'Mi ruta'} · ${pathCopy}`;
}

function formatConflictList(names, limit = 2) {
  if (!names?.length) return '';
  if (names.length <= limit) return names.join(' · ');
  return `${names.slice(0, limit).join(' · ')} +${names.length - limit}`;
}

function buildNearbyChips(item) {
  const chips = [
    item.nearbyFood ? { type: 'food', icon: SUPPORT_STOP_META.food.icon, label: item.nearbyFood.shortLabel } : null,
    item.nearbyWater ? { type: 'water', icon: SUPPORT_STOP_META.water.icon, label: item.nearbyWater.shortLabel } : null,
    item.nearbyBathroom ? { type: 'bathroom', icon: SUPPORT_STOP_META.bathroom.icon, label: item.nearbyBathroom.shortLabel } : null,
    item.nearbyService ? { type: 'service', icon: SUPPORT_STOP_META.service.icon, label: item.nearbyService.shortLabel } : null,
  ].filter(Boolean);

  return chips
    .map(chip => `<span class="map-nearby-chip ${chip.type}">${chip.icon} ${chip.label}</span>`)
    .join('');
}

function renderModeButtons(target, preferredMode, hasGroupRoute, onSetMode) {
  target.innerHTML = '';
  const modes = [
    { id: 'personal', label: 'Mi ruta', icon: '🎵', disabled: false },
    { id: 'group', label: 'Ruta grupo', icon: '🤝', disabled: !hasGroupRoute },
  ];

  for (const mode of modes) {
    const button = document.createElement('button');
    button.className = `map-mode-btn ${preferredMode === mode.id ? 'active' : ''}`;
    button.disabled = mode.disabled;
    button.innerHTML = `<span>${mode.icon}</span><span>${mode.label}</span>`;
    button.addEventListener('click', () => onSetMode(mode.id));
    target.appendChild(button);
  }
}

function renderLayerToggles(target, visibleLayers, onToggleLayer) {
  target.innerHTML = '';

  for (const [layerId, meta] of Object.entries(MAP_LAYER_META)) {
    const button = document.createElement('button');
    button.className = `map-layer-chip ${visibleLayers.has(layerId) ? 'active' : ''}`;
    button.style.setProperty('--layer-color', meta.color);
    button.innerHTML = `<span class="map-layer-chip-dot"></span><span>${meta.label}</span>`;
    button.addEventListener('click', () => onToggleLayer(layerId));
    target.appendChild(button);
  }
}

function renderLegendGrid(target) {
  target.innerHTML = '';
  for (const [layerId, meta] of Object.entries(MAP_LAYER_META)) {
    const item = document.createElement('div');
    item.className = 'map-legend-item';
    item.style.setProperty('--legend-color', meta.color);
    item.innerHTML = `
      <span class="map-legend-icon">${meta.icon}</span>
      <div class="map-legend-copy">
        <strong>${meta.label}</strong>
        <span>${meta.description}</span>
      </div>
    `;
    target.appendChild(item);
  }
}

function renderRouteSummary(target, routeData, activeMode) {
  target.innerHTML = '';

  if (routeData.unavailableMessage) {
    target.innerHTML = `<p class="empty-state">${routeData.unavailableMessage}</p>`;
    return;
  }

  if (routeData.items.length === 0) {
    target.innerHTML = `<p class="empty-state">${activeMode === 'group' ? 'No hay bloques 100% compartidos en este día todavía.' : 'Selecciona artistas o clubes para ver la ruta sobre el mapa.'}</p>`;
    return;
  }

  const overview = document.createElement('div');
  overview.className = 'map-route-overview';
  const start = routeData.pathLocations[0]?.shortLabel;
  const end = routeData.pathLocations[routeData.pathLocations.length - 1]?.shortLabel;
  overview.innerHTML = `
    <strong>${routeData.items.length} parada${routeData.items.length === 1 ? '' : 's'}</strong>
    <span>~${routeData.totalWalkMinutes} min caminando</span>
    ${start ? `<span>${start}${end && end !== start ? ` → ${end}` : ''}</span>` : ''}
  `;
  target.appendChild(overview);

  routeData.items.forEach((item, index) => {
    const step = document.createElement('div');
    step.className = `map-route-step ${item.isConflict ? 'conflict' : ''}`;
    step.innerHTML = `
      <div class="map-route-step-index">${index + 1}</div>
      <div class="map-route-step-body">
        <div class="map-route-step-time">${item.startTime} – ${item.endTime}</div>
        <div class="map-route-step-title">${item.title}</div>
        <div class="map-route-step-meta">${item.meta}</div>
        <div class="map-route-step-nearby">
          ${buildNearbyChips(item)}
        </div>
        ${item.isConflict ? `<div class="map-route-warning">Conflicto con ${formatConflictList(item.conflictWith)}</div>` : ''}
      </div>
    `;
    target.appendChild(step);

    if (index < routeData.segments.length) {
      const segment = routeData.segments[index];
      const segmentEl = document.createElement('div');
      segmentEl.className = 'map-route-segment';
      segmentEl.textContent = `${index + 1} → ${index + 2} · ~${segment.walkMinutes} min hacia ${segment.to.shortLabel}`;
      target.appendChild(segmentEl);
    }
  });

  if (routeData.splitMoments.length > 0) {
    const splitBox = document.createElement('div');
    splitBox.className = 'map-split-summary';
    splitBox.innerHTML = '<strong>Momentos donde el grupo se divide</strong>';

    routeData.splitMoments.slice(0, 4).forEach(moment => {
      const row = document.createElement('div');
      row.className = 'map-split-row';
      row.innerHTML = `<span>${moment.time}</span><span>${moment.labels.join(' · ')}</span>`;
      splitBox.appendChild(row);
    });

    target.appendChild(splitBox);
  }
}

function renderRouteSuggestions(target, routeData, activeMode) {
  target.innerHTML = '';

  if (routeData.unavailableMessage) {
    target.innerHTML = '<p class="empty-state">Combina agendas para desbloquear sugerencias del grupo.</p>';
    return;
  }

  if (routeData.items.length === 0) {
    target.innerHTML = `<p class="empty-state">${activeMode === 'group' ? 'Cuando tengan ruta compartida, aquí aparecerán paradas sugeridas.' : 'Selecciona artistas para ver dónde conviene comer, hidratarte o hacer una pausa.'}</p>`;
    return;
  }

  if (!routeData.suggestions?.length) {
    target.innerHTML = '<p class="empty-state">No hay paradas sugeridas para esta ruta todavía.</p>';
    return;
  }

  const list = document.createElement('div');
  list.className = 'map-suggestion-list';

  routeData.suggestions.forEach((suggestion, index) => {
    const card = document.createElement('div');
    card.className = 'map-suggestion-card';
    card.style.setProperty('--suggestion-color', suggestion.color);
    card.innerHTML = `
      <div class="map-suggestion-index">${index + 1}</div>
      <div class="map-suggestion-icon">${suggestion.icon}</div>
      <div class="map-suggestion-body">
        <div class="map-suggestion-kicker">${suggestion.badgeLabel}</div>
        <div class="map-suggestion-title">${suggestion.location.shortLabel}</div>
        <div class="map-suggestion-meta">${suggestion.title}</div>
        <div class="map-suggestion-reason">${suggestion.reason}</div>
      </div>
    `;
    list.appendChild(card);
  });

  target.appendChild(list);
}

function renderMapNodes(target, visibleLayers, routeData) {
  target.innerHTML = '';

  const routeOrdersByLocation = new Map();
  routeData.pathLocations.forEach((location, index) => {
    const list = routeOrdersByLocation.get(location.id) || [];
    list.push(index + 1);
    routeOrdersByLocation.set(location.id, list);
  });
  const firstStopId = routeData.pathLocations[0]?.id || '';
  const lastStopId = routeData.pathLocations[routeData.pathLocations.length - 1]?.id || '';

  const splitLocations = new Set(
    routeData.splitLocations
      .map(resolveLocationFromStageKey)
      .filter(Boolean)
      .map(location => location.id)
  );
  const suggestionsByLocation = new Map(routeData.suggestions.map(suggestion => [suggestion.location.id, suggestion]));

  for (const location of MAP_LOCATIONS) {
    const isRoute = routeOrdersByLocation.has(location.id);
    const isSplit = splitLocations.has(location.id);
    const suggestion = suggestionsByLocation.get(location.id);
    const isSuggested = Boolean(suggestion);
    const isVisible = visibleLayers.has(location.category) || isRoute || isSplit || isSuggested;

    if (!isVisible) continue;

    const meta = MAP_LAYER_META[location.category];
    const orderList = routeOrdersByLocation.get(location.id) || [];
    const isStart = location.id === firstStopId;
    const isEnd = location.id === lastStopId;
    const node = document.createElement('div');
    node.className = `map-node ${visibleLayers.has(location.category) && !isRoute ? 'is-layer' : ''} ${isRoute ? 'is-route' : ''} ${isSplit ? 'is-split' : ''} ${isSuggested ? 'is-suggested' : ''} ${isStart ? 'is-start' : ''} ${isEnd ? 'is-end' : ''}`;
    node.style.left = `${location.x}%`;
    node.style.top = `${location.y}%`;
    node.style.setProperty('--node-color', meta.color);
    if (suggestion) {
      node.style.setProperty('--suggestion-color', suggestion.color);
    }
    node.title = suggestion ? `${location.label} · ${suggestion.title}` : location.label;

    const badge = orderList.join('·') || meta.icon;
    const routeLabel = isStart && isEnd
      ? `Inicio / final · ${location.shortLabel}`
      : isStart
        ? `Inicio · ${location.shortLabel}`
        : isEnd
          ? `Final · ${location.shortLabel}`
          : isSuggested
            ? `${suggestion.badgeLabel} · ${location.shortLabel}`
            : location.shortLabel;
    const label = isRoute || isSplit || isSuggested || visibleLayers.has(location.category)
      ? `<span class="map-node-label">${routeLabel}</span>`
      : '';
    const flag = isStart && isEnd
      ? '<span class="map-node-flag dual">Inicio / final</span>'
      : isStart
        ? '<span class="map-node-flag">Inicio</span>'
        : isEnd
          ? '<span class="map-node-flag end">Final</span>'
          : isSuggested
            ? `<span class="map-node-flag suggestion">${suggestion.badgeLabel}</span>`
            : '';

    node.innerHTML = `
      <span class="map-node-core">${badge}</span>
      ${flag}
      ${label}
    `;

    target.appendChild(node);
  }
}

function slugify(value) {
  return normalizeLabel(value).replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

function canvasToBlob(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (!blob) {
        reject(new Error('No se pudo exportar la imagen.'));
        return;
      }
      resolve(blob);
    }, 'image/png');
  });
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
    image.src = src;
  });
}

function addRoundedRectPath(ctx, x, y, width, height, radius) {
  const safeRadius = Math.min(radius, width / 2, height / 2);
  ctx.beginPath();
  ctx.moveTo(x + safeRadius, y);
  ctx.lineTo(x + width - safeRadius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + safeRadius);
  ctx.lineTo(x + width, y + height - safeRadius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - safeRadius, y + height);
  ctx.lineTo(x + safeRadius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - safeRadius);
  ctx.lineTo(x, y + safeRadius);
  ctx.quadraticCurveTo(x, y, x + safeRadius, y);
  ctx.closePath();
}

function fillRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle = '', lineWidth = 1) {
  ctx.save();
  addRoundedRectPath(ctx, x, y, width, height, radius);
  ctx.fillStyle = fillStyle;
  ctx.fill();
  if (strokeStyle) {
    ctx.strokeStyle = strokeStyle;
    ctx.lineWidth = lineWidth;
    ctx.stroke();
  }
  ctx.restore();
}

function drawPill(ctx, x, y, text, options = {}) {
  const {
    fillStyle = 'rgba(255,255,255,0.08)',
    strokeStyle = 'rgba(255,255,255,0.14)',
    color = '#F8F3E8',
    font = "700 24px 'Outfit', sans-serif",
    paddingX = 18,
    paddingY = 10,
    radius = 999,
  } = options;

  ctx.save();
  ctx.font = font;
  const metrics = ctx.measureText(text);
  const width = metrics.width + paddingX * 2;
  const height = 24 + paddingY * 2;
  fillRoundedRect(ctx, x, y, width, height, radius, fillStyle, strokeStyle, 1);
  ctx.fillStyle = color;
  ctx.textBaseline = 'middle';
  ctx.fillText(text, x + paddingX, y + height / 2);
  ctx.restore();
  return width;
}

function drawWrappedText(ctx, text, x, y, maxWidth, lineHeight, maxLines = Infinity) {
  if (!text) return y;

  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !current) {
      current = candidate;
      continue;
    }
    lines.push(current);
    current = word;
    if (lines.length === maxLines - 1) break;
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  } else if (current && lines.length === maxLines) {
    lines[maxLines - 1] = `${lines[maxLines - 1]}…`;
  }

  lines.forEach((line, index) => {
    ctx.fillText(line, x, y + index * lineHeight);
  });

  return y + lines.length * lineHeight;
}

function scalePointToRect(point, rect) {
  return {
    ...point,
    x: rect.x + (point.x / 100) * rect.width,
    y: rect.y + (point.y / 100) * rect.height,
  };
}

function drawArrowGlyph(ctx, x, y, angle, color, label = '') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate((angle * Math.PI) / 180);
  ctx.fillStyle = 'rgba(13, 13, 18, 0.76)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, 0, 18, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(-5, -4);
  ctx.lineTo(6, 0);
  ctx.lineTo(-5, 4);
  ctx.stroke();
  ctx.restore();

  if (!label) return;

  ctx.save();
  ctx.font = "700 16px 'Outfit', sans-serif";
  ctx.fillStyle = 'rgba(255,255,255,0.84)';
  ctx.strokeStyle = 'rgba(13,13,18,0.88)';
  ctx.lineWidth = 4;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.strokeText(label, x, y + 22);
  ctx.fillText(label, x, y + 22);
  ctx.restore();
}

function drawRouteOnCanvas(ctx, routeData, mode, rect) {
  const color = mode === 'group' ? '#00e676' : '#ffd166';
  const routePoints = (routeData.routePoints || routeData.pathLocations).map(point => scalePointToRect(point, rect));
  if (routePoints.length < 2) return;

  const path = new Path2D(buildRoundedPath(routePoints));

  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 16;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.globalAlpha = 0.18;
  ctx.stroke(path);

  ctx.globalAlpha = 1;
  ctx.strokeStyle = 'rgba(0,0,0,0.5)';
  ctx.lineWidth = 10;
  ctx.stroke(path);

  ctx.strokeStyle = color;
  ctx.lineWidth = 7;
  ctx.stroke(path);

  ctx.strokeStyle = 'rgba(255,255,255,0.92)';
  ctx.lineWidth = 2.5;
  ctx.setLineDash([6, 18]);
  ctx.lineDashOffset = -12;
  ctx.stroke(path);
  ctx.restore();

  const stopIds = new Set(routeData.pathLocations.map(location => location.id));
  routePoints
    .filter((point, index) => index > 0 && index < routePoints.length - 1 && !stopIds.has(point.id))
    .forEach(point => {
      ctx.save();
      ctx.fillStyle = mode === 'group' ? '#8cf7b1' : '#ffe08a';
      ctx.globalAlpha = 0.82;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 3.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

  routeData.segments.forEach((segment, index) => {
    const point = getPointAlongPolyline(segment.points.map(entry => scalePointToRect(entry, rect)), 0.55);
    if (!point) return;
    drawArrowGlyph(ctx, point.x, point.y, point.angle, color, `${index + 1}→${index + 2}`);
  });

  routeData.pathLocations
    .map((location, index) => ({ location: scalePointToRect(location, rect), index }))
    .forEach(({ location, index }) => {
      const isStart = index === 0;
      const isEnd = index === routeData.pathLocations.length - 1;
      ctx.save();
      ctx.fillStyle = color;
      ctx.strokeStyle = 'rgba(255,255,255,0.96)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(location.x, location.y, 18, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#101012';
      ctx.font = "800 20px 'Outfit', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(index + 1), location.x, location.y + 1);
      ctx.restore();

      const label = isStart && isEnd
        ? 'Inicio / final'
        : isStart
          ? 'Inicio'
          : isEnd
            ? 'Final'
            : '';
      if (label) {
        drawPill(
          ctx,
          location.x - 40,
          location.y - 52,
          label,
          {
            fillStyle: isEnd ? 'rgba(0,230,118,0.2)' : isStart && isEnd ? 'rgba(179,136,255,0.2)' : 'rgba(255,209,102,0.2)',
            strokeStyle: isEnd ? 'rgba(0,230,118,0.28)' : isStart && isEnd ? 'rgba(179,136,255,0.3)' : 'rgba(255,209,102,0.3)',
            color: isEnd ? '#8cf7b1' : isStart && isEnd ? '#d2b9ff' : '#ffd98a',
            font: "800 16px 'Outfit', sans-serif",
            paddingX: 12,
            paddingY: 6,
          }
        );
      }
    });

  routeData.suggestions
    .filter(suggestion => !routeData.pathLocations.some(location => location.id === suggestion.location.id))
    .forEach(suggestion => {
      const point = scalePointToRect(suggestion.location, rect);
      ctx.save();
      ctx.fillStyle = suggestion.color;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(point.x, point.y, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    });
}

function getRouteExportBaseName(dayId, mode) {
  const day = DAYS.find(entry => entry.id === dayId);
  return `fep2026-${slugify(day?.label || dayId)}-${mode === 'group' ? 'ruta-grupo' : 'mi-ruta'}`;
}

function buildRouteTextExport(routeData, dayId, activeMode, shareUrl = '', selectionSeed = '') {
  const day = DAYS.find(entry => entry.id === dayId);

  if (routeData.unavailableMessage) {
    return `🗺️ Ruta ${activeMode === 'group' ? 'del grupo' : 'personal'} — ${day?.label || dayId}\n\n${routeData.unavailableMessage}`;
  }

  const lines = [
    `🗺️ ${activeMode === 'group' ? 'Ruta del grupo' : 'Mi ruta'} — Estéreo Picnic 2026`,
    `${day?.label || dayId}`,
    `Recorrido: ${routeData.pathLocations[0]?.shortLabel || 'Sin inicio'}${routeData.pathLocations.length > 1 ? ` → ${routeData.pathLocations[routeData.pathLocations.length - 1]?.shortLabel || 'Sin final'}` : ''}`,
    `Caminata estimada: ~${routeData.totalWalkMinutes} min`,
  ];

  if (activeMode === 'personal' && selectionSeed) {
    lines.push(`Seed: ${selectionSeed}`);
  }
  if (activeMode === 'personal' && shareUrl) {
    lines.push(`Link: ${shareUrl}`);
  }

  lines.push('', 'Paradas');

  routeData.items.forEach((item, index) => {
    lines.push(`${index + 1}. ${item.startTime}–${item.endTime} · ${item.title}`);
    lines.push(`   ${item.meta}`);
    const nearby = [
      item.nearbyFood ? `🍔 ${item.nearbyFood.shortLabel}` : '',
      item.nearbyWater ? `💧 ${item.nearbyWater.shortLabel}` : '',
      item.nearbyBathroom ? `🚻 ${item.nearbyBathroom.shortLabel}` : '',
      item.nearbyService ? `◎ ${item.nearbyService.shortLabel}` : '',
    ].filter(Boolean);
    if (nearby.length > 0) {
      lines.push(`   Cerca: ${nearby.join(' · ')}`);
    }
    if (item.isConflict) {
      lines.push(`   Conflicto con ${formatConflictList(item.conflictWith, 3)}`);
    }
    const segment = routeData.segments[index];
    if (segment) {
      lines.push(`   ${index + 1} → ${index + 2} · ~${segment.walkMinutes} min hacia ${segment.to.shortLabel}`);
    }
    lines.push('');
  });

  if (routeData.suggestions?.length) {
    lines.push('Paradas útiles sugeridas');
    routeData.suggestions.forEach(suggestion => {
      lines.push(`- ${suggestion.icon} ${suggestion.badgeLabel}: ${suggestion.location.shortLabel}`);
      lines.push(`  ${suggestion.title}. ${suggestion.reason}`);
    });
    lines.push('');
  }

  if (routeData.splitMoments?.length) {
    lines.push('Momentos donde el grupo se divide');
    routeData.splitMoments.forEach(moment => {
      lines.push(`- ${moment.time}: ${moment.labels.join(' · ')}`);
    });
  }

  return lines.join('\n').trim();
}

async function exportRouteImage(routeData, dayId, activeMode, shareUrl = '', selectionSeed = '') {
  const day = DAYS.find(entry => entry.id === dayId);
  const mapImage = await loadImage(MAP_IMAGE_SRC);
  const width = 1600;
  const mapHeight = 860;
  const stopsHeight = Math.max(220, routeData.items.length * 120 + 120);
  const suggestionsHeight = Math.max(180, routeData.suggestions.length * 100 + 120);
  const footerHeight = activeMode === 'personal' ? 170 : 120;
  const height = 260 + mapHeight + stopsHeight + suggestionsHeight + footerHeight;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  const background = ctx.createLinearGradient(0, 0, width, height);
  background.addColorStop(0, '#07110f');
  background.addColorStop(0.45, '#151022');
  background.addColorStop(1, '#0a0814');
  ctx.fillStyle = background;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  ctx.globalAlpha = 0.18;
  ctx.fillStyle = activeMode === 'group' ? '#00e676' : '#ffd166';
  ctx.beginPath();
  ctx.arc(width - 180, 170, 180, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#7c4dff';
  ctx.beginPath();
  ctx.arc(140, height - 170, 220, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  const insetX = 52;
  const insetY = 42;
  const insetWidth = width - insetX * 2;
  const insetHeight = height - insetY * 2;
  fillRoundedRect(ctx, insetX, insetY, insetWidth, insetHeight, 40, 'rgba(7,10,18,0.62)', 'rgba(255,255,255,0.08)', 1.5);

  const contentX = 92;
  const contentWidth = width - contentX * 2;
  let pillX = contentX;
  const pillY = 82;
  pillX += drawPill(ctx, pillX, pillY, day?.label || dayId, {
    fillStyle: 'rgba(255,255,255,0.08)',
    strokeStyle: 'rgba(255,255,255,0.14)',
    color: '#F8F3E8',
  }) + 12;
  pillX += drawPill(ctx, pillX, pillY, activeMode === 'group' ? 'Ruta grupo' : 'Mi ruta', {
    fillStyle: activeMode === 'group' ? 'rgba(0,230,118,0.16)' : 'rgba(255,209,102,0.16)',
    strokeStyle: activeMode === 'group' ? 'rgba(0,230,118,0.26)' : 'rgba(255,209,102,0.24)',
    color: activeMode === 'group' ? '#8cf7b1' : '#ffd98a',
  }) + 12;
  drawPill(ctx, pillX, pillY, `~${routeData.totalWalkMinutes} min caminando`, {
    fillStyle: 'rgba(124,77,255,0.16)',
    strokeStyle: 'rgba(124,77,255,0.22)',
    color: '#d2b9ff',
  });

  ctx.save();
  ctx.fillStyle = '#F8F3E8';
  ctx.font = "800 60px 'Outfit', sans-serif";
  ctx.fillText(activeMode === 'group' ? 'Ruta compartida del día' : 'Ruta del día', contentX, 176);
  ctx.fillStyle = 'rgba(248,243,232,0.72)';
  ctx.font = "500 28px 'Outfit', sans-serif";
  const topCopy = routeData.pathLocations[0]?.shortLabel
    ? `${routeData.pathLocations[0].shortLabel}${routeData.pathLocations.length > 1 ? ` → ${routeData.pathLocations[routeData.pathLocations.length - 1].shortLabel}` : ''}`
    : 'Sin recorrido definido';
  ctx.fillText(topCopy, contentX, 214);
  ctx.restore();

  const mapRect = { x: contentX, y: 258, width: contentWidth, height: mapHeight };
  ctx.save();
  addRoundedRectPath(ctx, mapRect.x, mapRect.y, mapRect.width, mapRect.height, 34);
  ctx.clip();
  ctx.drawImage(mapImage, mapRect.x, mapRect.y, mapRect.width, mapRect.height);
  drawRouteOnCanvas(ctx, routeData, activeMode, mapRect);
  ctx.restore();
  fillRoundedRect(ctx, mapRect.x, mapRect.y, mapRect.width, mapRect.height, 34, 'rgba(255,255,255,0)', 'rgba(255,255,255,0.1)', 1.5);

  let y = mapRect.y + mapRect.height + 54;
  ctx.save();
  ctx.fillStyle = '#F8F3E8';
  ctx.font = "800 34px 'Outfit', sans-serif";
  ctx.fillText('Itinerario', contentX, y);
  ctx.restore();
  y += 26;

  routeData.items.forEach((item, index) => {
    const cardHeight = 106;
    fillRoundedRect(ctx, contentX, y, contentWidth, cardHeight, 28, 'rgba(255,255,255,0.04)', item.isConflict ? 'rgba(255,77,77,0.24)' : 'rgba(255,255,255,0.08)', 1.2);

    fillRoundedRect(
      ctx,
      contentX + 18,
      y + 18,
      56,
      56,
      20,
      activeMode === 'group' ? 'rgba(0,230,118,0.2)' : 'rgba(255,209,102,0.2)',
      activeMode === 'group' ? 'rgba(0,230,118,0.3)' : 'rgba(255,209,102,0.3)',
      1.2
    );
    ctx.save();
    ctx.fillStyle = activeMode === 'group' ? '#8cf7b1' : '#ffd98a';
    ctx.font = "800 24px 'Outfit', sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(index + 1), contentX + 46, y + 46);
    ctx.restore();

    const textX = contentX + 96;
    ctx.save();
    ctx.fillStyle = 'rgba(248,243,232,0.64)';
    ctx.font = "600 18px 'Outfit', sans-serif";
    ctx.fillText(`${item.startTime} – ${item.endTime}`, textX, y + 30);
    ctx.fillStyle = '#F8F3E8';
    ctx.font = "800 28px 'Outfit', sans-serif";
    ctx.fillText(item.title, textX, y + 58);
    ctx.fillStyle = 'rgba(248,243,232,0.68)';
    ctx.font = "500 18px 'Outfit', sans-serif";
    ctx.fillText(item.meta, textX, y + 84);
    const nearbyText = [
      item.nearbyFood ? `🍔 ${item.nearbyFood.shortLabel}` : '',
      item.nearbyWater ? `💧 ${item.nearbyWater.shortLabel}` : '',
      item.nearbyBathroom ? `🚻 ${item.nearbyBathroom.shortLabel}` : '',
      item.nearbyService ? `◎ ${item.nearbyService.shortLabel}` : '',
    ].filter(Boolean).join(' · ');
    ctx.fillStyle = 'rgba(210, 203, 235, 0.82)';
    ctx.font = "500 16px 'Outfit', sans-serif";
    drawWrappedText(ctx, nearbyText, textX, y + 106, contentWidth - 120, 20, 2);
    ctx.restore();

    const segment = routeData.segments[index];
    if (segment) {
      ctx.save();
      ctx.fillStyle = 'rgba(210, 203, 235, 0.65)';
      ctx.font = "600 16px 'Outfit', sans-serif";
      ctx.fillText(`${index + 1} → ${index + 2} · ~${segment.walkMinutes} min hacia ${segment.to.shortLabel}`, contentX + 18, y + cardHeight + 24);
      ctx.restore();
      y += cardHeight + 38;
    } else {
      y += cardHeight + 18;
    }
  });

  y += 10;
  ctx.save();
  ctx.fillStyle = '#F8F3E8';
  ctx.font = "800 34px 'Outfit', sans-serif";
  ctx.fillText('Paradas útiles', contentX, y);
  ctx.restore();
  y += 26;

  if (routeData.suggestions.length === 0) {
    ctx.save();
    ctx.fillStyle = 'rgba(248,243,232,0.6)';
    ctx.font = "500 20px 'Outfit', sans-serif";
    ctx.fillText('No hay paradas sugeridas para esta ruta.', contentX, y + 36);
    ctx.restore();
    y += 54;
  } else {
    routeData.suggestions.forEach(suggestion => {
      fillRoundedRect(ctx, contentX, y, contentWidth, 90, 24, 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)', 1);
      fillRoundedRect(ctx, contentX + 16, y + 15, 54, 54, 18, `${suggestion.color}22`, `${suggestion.color}55`, 1);
      ctx.save();
      ctx.font = "700 28px 'Outfit', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = suggestion.color;
      ctx.fillText(suggestion.icon, contentX + 43, y + 43);
      ctx.restore();

      ctx.save();
      ctx.fillStyle = suggestion.color;
      ctx.font = "800 16px 'Outfit', sans-serif";
      ctx.fillText(suggestion.badgeLabel.toUpperCase(), contentX + 92, y + 28);
      ctx.fillStyle = '#F8F3E8';
      ctx.font = "800 24px 'Outfit', sans-serif";
      ctx.fillText(suggestion.location.shortLabel, contentX + 92, y + 54);
      ctx.fillStyle = 'rgba(248,243,232,0.66)';
      ctx.font = "500 16px 'Outfit', sans-serif";
      drawWrappedText(ctx, `${suggestion.title}. ${suggestion.reason}`, contentX + 92, y + 76, contentWidth - 110, 18, 2);
      ctx.restore();
      y += 104;
    });
  }

  y += 18;
  fillRoundedRect(ctx, contentX, y, contentWidth, activeMode === 'personal' ? 118 : 90, 24, 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.08)', 1);
  ctx.save();
  ctx.fillStyle = '#F8F3E8';
  ctx.font = "700 20px 'Outfit', sans-serif";
  ctx.fillText('Exportado desde Mi Agenda FEP 2026', contentX + 20, y + 32);
  ctx.fillStyle = 'rgba(248,243,232,0.68)';
  ctx.font = "500 15px 'Outfit', sans-serif";
  drawWrappedText(ctx, `Recorrido: ${topCopy}`, contentX + 20, y + 58, contentWidth - 40, 18, 2);
  if (activeMode === 'personal' && selectionSeed) {
    drawWrappedText(ctx, `Seed: ${selectionSeed}`, contentX + 20, y + 84, contentWidth - 40, 18, 2);
  }
  if (activeMode === 'personal' && shareUrl) {
    drawWrappedText(ctx, `Link: ${shareUrl}`, contentX + 20, y + 102, contentWidth - 40, 18, 2);
  }
  ctx.restore();

  const blob = await canvasToBlob(canvas);
  downloadBlob(blob, `${getRouteExportBaseName(dayId, activeMode)}.png`);
}

function exportRouteText(routeData, dayId, activeMode, shareUrl = '', selectionSeed = '') {
  const text = buildRouteTextExport(routeData, dayId, activeMode, shareUrl, selectionSeed);
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  downloadBlob(blob, `${getRouteExportBaseName(dayId, activeMode)}.txt`);
}

export function renderMapPanel({
  dayId,
  selectedIds,
  mapMode,
  mergeState,
  visibleLayers,
  shareUrl,
  selectionSeed,
  onToast,
  onSetMode,
  onToggleLayer,
}) {
  const routeCaption = document.getElementById('map-route-caption');
  const routeSummary = document.getElementById('map-route-summary');
  const routeSuggestions = document.getElementById('map-route-suggestions');
  const routeSvg = document.getElementById('festival-map-route');
  const poiLayer = document.getElementById('festival-map-pois');
  const layerToggles = document.getElementById('map-layer-toggles');
  const modeToggle = document.getElementById('map-mode-toggle');
  const legendGrid = document.getElementById('map-legend-grid');
  const exportImageButton = document.getElementById('btn-export-map-image');
  const exportTextButton = document.getElementById('btn-export-map-text');

  if (!routeCaption || !routeSummary || !routeSuggestions || !routeSvg || !poiLayer || !layerToggles || !modeToggle || !legendGrid || !exportImageButton || !exportTextButton) {
    return;
  }

  const hasGroupRoute = Boolean(mergeState?.schedules?.length);
  const activeMode = mapMode === 'group' && hasGroupRoute ? 'group' : 'personal';
  const routeData = getRouteData(dayId, selectedIds, activeMode, mergeState);

  routeCaption.textContent = formatRouteOverview(routeData, dayId, activeMode);
  routeSvg.innerHTML = buildRouteSvg(routeData, activeMode);

  renderModeButtons(modeToggle, activeMode, hasGroupRoute, onSetMode);
  renderLayerToggles(layerToggles, visibleLayers, onToggleLayer);
  renderLegendGrid(legendGrid);
  renderRouteSummary(routeSummary, routeData, activeMode);
  renderRouteSuggestions(routeSuggestions, routeData, activeMode);
  renderMapNodes(poiLayer, visibleLayers, routeData);

  const canExport = !routeData.unavailableMessage && routeData.items.length > 0;
  exportImageButton.disabled = !canExport;
  exportTextButton.disabled = !canExport;

  exportImageButton.onclick = async () => {
    if (!canExport) return;
    try {
      await exportRouteImage(routeData, dayId, activeMode, shareUrl, selectionSeed);
      onToast?.('Imagen de la ruta descargada');
    } catch {
      onToast?.('No se pudo exportar la imagen');
    }
  };

  exportTextButton.onclick = () => {
    if (!canExport) return;
    try {
      exportRouteText(routeData, dayId, activeMode, shareUrl, selectionSeed);
      onToast?.('Texto de la ruta descargado');
    } catch {
      onToast?.('No se pudo exportar el texto');
    }
  };
}
