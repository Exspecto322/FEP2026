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

export const DEFAULT_MAP_LAYERS = [
  'stage',
  'club',
  'entrance',
  'food',
  'water',
  'bathroom',
  'vip',
  'service',
];

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

  for (let i = 0; i < pathLocations.length - 1; i++) {
    const from = pathLocations[i];
    const to = pathLocations[i + 1];
    const walkMinutes = estimateWalkMinutes(from, to);
    totalWalkMinutes += walkMinutes;
    segments.push({
      from,
      to,
      walkMinutes,
    });
  }

  return { totalWalkMinutes, segments };
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
    return {
      id: artist.id,
      startTime: artist.startTime,
      endTime: artist.endTime,
      title: getArtistDisplayName(artist),
      meta: getArtistMetaLabel(artist),
      location,
      locationId: location?.id || '',
      isConflict: hasConflict,
      nearbyWater: location ? getNearestLocation(location, 'water') : null,
      nearbyBathroom: location ? getNearestLocation(location, 'bathroom') : null,
    };
  });

  const pathLocations = compressRouteLocations(items);
  const metrics = buildRouteMetrics(pathLocations);

  return {
    mode: 'personal',
    items,
    pathLocations,
    splitLocations: [],
    splitMoments: [],
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
        currentItem = {
          id: `group-${slot.time}-${leader.stageId}`,
          startTime: slot.time,
          endTime: nextTime,
          title: leader.artist,
          meta: leader.stage,
          location,
          locationId: leader.stageId,
          isConflict: false,
          nearbyWater: location ? getNearestLocation(location, 'water') : null,
          nearbyBathroom: location ? getNearestLocation(location, 'bathroom') : null,
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

  return {
    mode: 'group',
    items,
    pathLocations,
    splitLocations: Array.from(new Set(splitMoments.flatMap(moment => moment.locationIds))),
    splitMoments,
    ...metrics,
  };
}

function getRouteData(dayId, selectedIds, mode, mergeState) {
  return mode === 'group' ? buildGroupRoute(dayId, mergeState) : buildPersonalRoute(dayId, selectedIds);
}

function buildRouteSvg(pathLocations, mode) {
  if (pathLocations.length < 2) {
    return '';
  }

  const points = pathLocations.map(location => `${location.x},${location.y}`).join(' ');
  return `
    <polyline class="map-route-shadow" points="${points}" />
    <polyline class="map-route-line ${mode}" points="${points}" />
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
  return `${day?.label || ''} · ${activeMode === 'group' ? 'Ruta del grupo' : 'Mi ruta'} · ${routeData.items.length} parada${routeData.items.length === 1 ? '' : 's'}`;
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
    button.innerHTML = `<span class="map-layer-chip-icon">${meta.icon}</span><span>${meta.label}</span>`;
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
  overview.innerHTML = `
    <strong>${routeData.items.length} parada${routeData.items.length === 1 ? '' : 's'}</strong>
    <span>~${routeData.totalWalkMinutes} min caminando</span>
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
          ${item.nearbyWater ? `💧 ${item.nearbyWater.shortLabel}` : ''}
          ${item.nearbyBathroom ? `🚻 ${item.nearbyBathroom.shortLabel}` : ''}
        </div>
        ${item.isConflict ? '<div class="map-route-warning">Se cruza con la parada anterior</div>' : ''}
      </div>
    `;
    target.appendChild(step);

    if (index < routeData.segments.length) {
      const segment = routeData.segments[index];
      const segmentEl = document.createElement('div');
      segmentEl.className = 'map-route-segment';
      segmentEl.textContent = `~${segment.walkMinutes} min caminando hacia ${segment.to.shortLabel}`;
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

function renderMapNodes(target, visibleLayers, routeData) {
  target.innerHTML = '';

  const routeOrdersByLocation = new Map();
  routeData.pathLocations.forEach((location, index) => {
    const list = routeOrdersByLocation.get(location.id) || [];
    list.push(index + 1);
    routeOrdersByLocation.set(location.id, list);
  });

  const splitLocations = new Set(
    routeData.splitLocations
      .map(resolveLocationFromStageKey)
      .filter(Boolean)
      .map(location => location.id)
  );

  for (const location of MAP_LOCATIONS) {
    const isRoute = routeOrdersByLocation.has(location.id);
    const isSplit = splitLocations.has(location.id);
    const isVisible = visibleLayers.has(location.category) || isRoute || isSplit;

    if (!isVisible) continue;

    const meta = MAP_LAYER_META[location.category];
    const node = document.createElement('div');
    node.className = `map-node ${isRoute ? 'is-route' : ''} ${isSplit ? 'is-split' : ''}`;
    node.style.left = `${location.x}%`;
    node.style.top = `${location.y}%`;
    node.style.setProperty('--node-color', meta.color);
    node.title = location.label;

    const badge = routeOrdersByLocation.get(location.id)?.join('·') || meta.icon;
    const label = isRoute || isSplit ? `<span class="map-node-label">${location.shortLabel}</span>` : '';

    node.innerHTML = `
      <span class="map-node-core">${badge}</span>
      ${label}
    `;

    target.appendChild(node);
  }
}

export function renderMapPanel({
  dayId,
  selectedIds,
  mapMode,
  mergeState,
  visibleLayers,
  onSetMode,
  onToggleLayer,
}) {
  const routeCaption = document.getElementById('map-route-caption');
  const routeSummary = document.getElementById('map-route-summary');
  const routeSvg = document.getElementById('festival-map-route');
  const poiLayer = document.getElementById('festival-map-pois');
  const layerToggles = document.getElementById('map-layer-toggles');
  const modeToggle = document.getElementById('map-mode-toggle');
  const legendGrid = document.getElementById('map-legend-grid');

  if (!routeCaption || !routeSummary || !routeSvg || !poiLayer || !layerToggles || !modeToggle || !legendGrid) {
    return;
  }

  const hasGroupRoute = Boolean(mergeState?.schedules?.length);
  const activeMode = mapMode === 'group' && hasGroupRoute ? 'group' : 'personal';
  const routeData = getRouteData(dayId, selectedIds, activeMode, mergeState);

  routeCaption.textContent = formatRouteOverview(routeData, dayId, activeMode);
  routeSvg.innerHTML = buildRouteSvg(routeData.pathLocations, activeMode);

  renderModeButtons(modeToggle, activeMode, hasGroupRoute, onSetMode);
  renderLayerToggles(layerToggles, visibleLayers, onToggleLayer);
  renderLegendGrid(legendGrid);
  renderRouteSummary(routeSummary, routeData, activeMode);
  renderMapNodes(poiLayer, visibleLayers, routeData);
}
