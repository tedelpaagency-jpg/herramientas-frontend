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
