/**
 * Coordinate Parser Utility
 * Parses GPS coordinates in decimal, DMS (Degrees, Minutes, Seconds e.g. 0°49'41.4"S 79°28'54.8"W),
 * Google Maps URLs, or combined string formats.
 */

// Parses a single DMS coordinate string like:
// 0°49'41.4"S, 79°28'54.8"W, -0.828167, 0°49.69'S
export function parseSingleCoordinate(raw: any): number | null {
  if (raw === null || raw === undefined) return null;
  if (typeof raw === 'number') {
    return isFinite(raw) ? raw : null;
  }

  const str = String(raw).trim();
  if (!str) return null;

  // 1. Direct standard decimal number check (e.g. "-0.828167" or "79.481889")
  if (/^[+-]?\d+(?:\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    return isFinite(num) ? num : null;
  }

  // 2. DMS string parser: degrees° minutes' seconds" [NSEW]
  // Matches: 0°49'41.4"S or 79°28'54.8"W or with unicode primes ′ ″
  const dmsRegex = /([+-]?\d+(?:\.\d+)?)\s*°\s*(?:(\d+(?:\.\d+)?)\s*['′]\s*)?(?:(\d+(?:\.\d+)?)\s*["″]?\s*)?([NSEWnsew])?/iu;
  const match = str.match(dmsRegex);
  if (match) {
    const deg = parseFloat(match[1]);
    const min = match[2] ? parseFloat(match[2]) : 0;
    const sec = match[3] ? parseFloat(match[3]) : 0;
    const dir = match[4] ? match[4].toUpperCase() : null;

    if (!isFinite(deg) || !isFinite(min) || !isFinite(sec)) return null;

    let decimal = Math.abs(deg) + min / 60 + sec / 3600;

    // Apply negative sign
    if (deg < 0 || dir === 'S' || dir === 'W') {
      decimal = -decimal;
    } else if (dir === 'N' || dir === 'E') {
      decimal = Math.abs(decimal);
    }

    return isFinite(decimal) ? decimal : null;
  }

  return null;
}

// Parses a pair of coordinates from combined strings:
// e.g. "0°49'41.4\"S 79°28'54.8\"W", "-0.828167, -79.481889", Google Maps URL, etc.
export function parseCoordinatePair(raw: any): [number, number] | null {
  if (!raw) return null;
  const str = String(raw).trim();
  if (!str) return null;

  // 1. Google Maps URL matching
  if (str.includes('maps') || str.includes('goo.gl') || str.includes('google.com')) {
    const atMatch = str.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (atMatch) {
      const lat = parseFloat(atMatch[1]);
      const lng = parseFloat(atMatch[2]);
      if (isValidLatLng(lat, lng)) return [lat, lng];
    }
    const qMatch = str.match(/q=(-?\d+\.\d+),(-?\d+\.\d+)/);
    if (qMatch) {
      const lat = parseFloat(qMatch[1]);
      const lng = parseFloat(qMatch[2]);
      if (isValidLatLng(lat, lng)) return [lat, lng];
    }
    const embedMatch = str.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (embedMatch) {
      const lat = parseFloat(embedMatch[1]);
      const lng = parseFloat(embedMatch[2]);
      if (isValidLatLng(lat, lng)) return [lat, lng];
    }
  }

  // 2. Combined DMS matching: e.g. 0°49'41.4"S 79°28'54.8"W or separated by comma
  const dmsLatPart = '(\\d{1,3})\\s*°\\s*(?:(\\d{1,2})\\s*[\'′]\\s*)?(?:(\\d{1,2}(?:\\.\\d+)?)\\s*["″]?\\s*)?([NSns])';
  const dmsLngPart = '(\\d{1,3})\\s*°\\s*(?:(\\d{1,2})\\s*[\'′]\\s*)?(?:(\\d{1,2}(?:\\.\\d+)?)\\s*["″]?\\s*)?([EWew])';

  const latThenLngRegex = new RegExp(`${dmsLatPart}\\s*,?\\s*${dmsLngPart}`, 'i');
  const latThenLngMatch = str.match(latThenLngRegex);
  if (latThenLngMatch) {
    const latDeg = parseFloat(latThenLngMatch[1]);
    const latMin = latThenLngMatch[2] ? parseFloat(latThenLngMatch[2]) : 0;
    const latSec = latThenLngMatch[3] ? parseFloat(latThenLngMatch[3]) : 0;
    const latDir = latThenLngMatch[4].toUpperCase();
    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === 'S') lat = -lat;

    const lngDeg = parseFloat(latThenLngMatch[5]);
    const lngMin = latThenLngMatch[6] ? parseFloat(latThenLngMatch[6]) : 0;
    const lngSec = latThenLngMatch[7] ? parseFloat(latThenLngMatch[7]) : 0;
    const lngDir = latThenLngMatch[8].toUpperCase();
    let lng = lngDeg + lngMin / 60 + lngSec / 3600;
    if (lngDir === 'W') lng = -lng;

    if (isValidLatLng(lat, lng)) return [lat, lng];
  }

  const lngThenLatRegex = new RegExp(`${dmsLngPart}\\s*,?\\s*${dmsLatPart}`, 'i');
  const lngThenLatMatch = str.match(lngThenLatRegex);
  if (lngThenLatMatch) {
    const lngDeg = parseFloat(lngThenLatMatch[1]);
    const lngMin = lngThenLatMatch[2] ? parseFloat(lngThenLatMatch[2]) : 0;
    const lngSec = lngThenLatMatch[3] ? parseFloat(lngThenLatMatch[3]) : 0;
    const lngDir = lngThenLatMatch[4].toUpperCase();
    let lng = lngDeg + lngMin / 60 + lngSec / 3600;
    if (lngDir === 'W') lng = -lng;

    const latDeg = parseFloat(lngThenLatMatch[5]);
    const latMin = lngThenLatMatch[6] ? parseFloat(lngThenLatMatch[6]) : 0;
    const latSec = lngThenLatMatch[7] ? parseFloat(lngThenLatMatch[7]) : 0;
    const latDir = lngThenLatMatch[8].toUpperCase();
    let lat = latDeg + latMin / 60 + latSec / 3600;
    if (latDir === 'S') lat = -lat;

    if (isValidLatLng(lat, lng)) return [lat, lng];
  }

  // 3. Comma or space separated decimal: "-0.828167, -79.481889"
  const decMatch = str.match(/^(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)$/);
  if (decMatch) {
    const lat = parseFloat(decMatch[1]);
    const lng = parseFloat(decMatch[2]);
    if (isValidLatLng(lat, lng)) return [lat, lng];
  }

  return null;
}

// Full resolver for an estate object
export function resolveEstateCoordinates(estate: any): [number, number] | null {
  if (!estate) return null;

  // Case A: estate.latitude has combined coordinates (e.g. pasted "0°49'41.4\"S 79°28'54.8\"W")
  if (estate.latitude && typeof estate.latitude === 'string') {
    const pair = parseCoordinatePair(estate.latitude);
    if (pair) return pair;
  }

  // Case B: estate.location has combined coordinates
  if (estate.location && typeof estate.location === 'string') {
    const pair = parseCoordinatePair(estate.location);
    if (pair) return pair;
  }

  // Case C: estate.latitude and estate.longitude are separate fields
  if (estate.latitude != null && estate.longitude != null) {
    const lat = parseSingleCoordinate(estate.latitude);
    const lng = parseSingleCoordinate(estate.longitude);

    if (lat !== null && lng !== null && isValidLatLng(lat, lng)) {
      return [lat, lng];
    }
  }

  return null;
}

function isValidLatLng(lat: number, lng: number): boolean {
  return (
    isFinite(lat) &&
    isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    // Guard against literal 0,0 which is off the coast of Africa
    (Math.abs(lat) > 0.0001 || Math.abs(lng) > 0.0001)
  );
}

// Ecuadorian Cities, Cantons and Provinces GPS Reference Directory
export const ECUADOR_CITY_COORDINATES: Record<string, [number, number]> = {
  // Principales
  quito: [-0.180653, -78.467834],
  guayaquil: [-2.189412, -79.889069],
  cuenca: [-2.900128, -79.005896],
  quevedo: [-1.025452, -79.461677],
  manta: [-0.967664, -80.708910],
  portoviejo: [-1.054580, -80.454453],
  salinas: [-2.214486, -80.951515],
  ambato: [-1.249080, -78.616753],
  'santo domingo': [-0.253050, -79.175362],
  machala: [-3.258111, -79.955406],
  loja: [-3.993130, -79.204224],
  ibarra: [0.351710, -78.122330],
  riobamba: [-1.663550, -78.654648],
  esmeraldas: [0.968170, -79.651720],
  babahoyo: [-1.802170, -79.534430],
  'puerto quito': [0.122400, -79.255800],
  latacunga: [-0.935210, -78.615540],
  tulcan: [0.811560, -77.717270],
  tulcán: [0.811560, -77.717270],
  puyo: [-1.483690, -77.998050],
  tena: [-0.993800, -77.812860],
  macas: [-2.308680, -78.111350],
  zamora: [-4.069220, -78.956790],
  cotacachi: [0.301500, -78.263800],
  otavalo: [0.224400, -78.261200],
  samborondon: [-2.096300, -79.722500],
  samborondón: [-2.096300, -79.722500],
  daule: [-1.862100, -79.977400],
  duran: [-2.170600, -79.822800],
  durán: [-2.170600, -79.822800],
  milagro: [-2.134000, -79.594000],
  'la troncal': [-2.425800, -79.337500],
  azogues: [-2.739700, -78.847500],
  chone: [-0.698200, -80.093600],
  'bahia de caraquez': [-0.598000, -80.423700],
  'bahía de caráquez': [-0.598000, -80.423700],
  pedernales: [0.071900, -80.052600],
  playas: [-2.631900, -80.388100],
  'general villamil': [-2.631900, -80.388100],
  'santa elena': [-2.226700, -80.858700],
  montañita: [-1.826700, -80.752800],
  montanita: [-1.826700, -80.752800],
  ayangue: [-1.977300, -80.750300],
  olón: [-1.801400, -80.753300],
  olon: [-1.801400, -80.753300],
  montecristi: [-1.044400, -80.659200],
  jipijapa: [-1.348900, -80.579400],
  vinces: [-1.556100, -79.751700],
  ventanas: [-1.442800, -79.459700],
  'buena fe': [-0.893600, -79.492500],
  valencia: [-0.950800, -79.352200],
  mocache: [-1.183300, -79.508300],
  palenque: [-1.433300, -79.750000],
  montalvo: [-1.791700, -79.288900],
  urdaneta: [-1.566700, -79.466700],
  cuxibamba: [-3.993130, -79.204224],
  atacames: [0.869700, -79.845800],
  tonsupa: [0.887200, -79.814700],
  same: [0.825800, -79.878900],
  muisne: [0.612800, -80.019400],
  cayambe: [0.041700, -78.143600],
  ruminahui: [-0.333300, -78.450000],
  sangolqui: [-0.333300, -78.450000],
  sangolquí: [-0.333300, -78.450000],
  cumbaya: [-0.200000, -78.433300],
  cumbayá: [-0.200000, -78.433300],
  tumbaco: [-0.216700, -78.400000],
  guayllabamba: [-0.058300, -78.341700],
  tabacundo: [0.050000, -78.216700],
  machachi: [-0.510300, -78.567500],
  yantzaza: [-3.833300, -78.766700],
  'santa rosa': [-3.448900, -79.959700],
  pasaje: [-3.325800, -79.805800],
  huaquillas: [-3.475300, -80.228900],
  pinas: [-3.681100, -79.680800],
  piñas: [-3.681100, -79.680800],
  zaruma: [-3.691700, -79.612500],
  'el guabo': [-3.243900, -79.832200],
  // Provincias
  pichincha: [-0.180653, -78.467834],
  guayas: [-2.189412, -79.889069],
  azuay: [-2.900128, -79.005896],
  manabi: [-1.054580, -80.454453],
  manabí: [-1.054580, -80.454453],
  'los rios': [-1.025452, -79.461677],
  'los ríos': [-1.025452, -79.461677],
  tungurahua: [-1.249080, -78.616753],
  chimborazo: [-1.663550, -78.654648],
  imbabura: [0.351710, -78.122330],
  cotopaxi: [-0.935210, -78.615540],
  'el oro': [-3.258111, -79.955406],
  carchi: [0.811560, -77.717270],
  pastaza: [-1.483690, -77.998050],
  napo: [-0.993800, -77.812860],
  'morona santiago': [-2.308680, -78.111350],
};

// Resolves GPS coordinates for a given city or province name
export function getCityCoordinates(cityName?: string | null): [number, number] | null {
  if (!cityName) return null;
  const raw = String(cityName).trim();
  if (!raw) return null;

  const clean = raw
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
  if (!clean) return null;

  // Direct match
  if (ECUADOR_CITY_COORDINATES[clean]) {
    return ECUADOR_CITY_COORDINATES[clean];
  }

  // Exact match without normalization
  const lower = raw.toLowerCase();
  if (ECUADOR_CITY_COORDINATES[lower]) {
    return ECUADOR_CITY_COORDINATES[lower];
  }

  // Substring match
  for (const [key, coords] of Object.entries(ECUADOR_CITY_COORDINATES)) {
    const keyClean = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    if (clean.includes(keyClean) || keyClean.includes(clean)) {
      return coords;
    }
  }

  return null;
}

