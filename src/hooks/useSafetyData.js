import { useState, useEffect, useCallback } from 'react';

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';

export const POI_CONFIG = {
  police:       { label: 'Police Station', icon: '🚔', color: '#6366F1', bonus: 14 },
  hospital:     { label: 'Hospital',       icon: '🏥', color: '#00E599', bonus: 10 },
  pharmacy:     { label: '24h Pharmacy',   icon: '💊', color: '#00F5FF', bonus: 6  },
  fire_station: { label: 'Fire Station',   icon: '🚒', color: '#FF6B35', bonus: 8  },
  atm:          { label: 'ATM / Bank',     icon: '🏧', color: '#A855F7', bonus: 3  },
  bus_station:  { label: 'Bus Terminal',   icon: '🚌', color: '#38BDF8', bonus: 4  },
};

const buildQuery = (lat, lng, radius = 900) => `
  [out:json][timeout:20];
  (
    node["amenity"="police"](around:${radius},${lat},${lng});
    node["amenity"="hospital"](around:${radius},${lat},${lng});
    node["amenity"="pharmacy"](around:400,${lat},${lng});
    node["amenity"="fire_station"](around:${radius},${lat},${lng});
    node["amenity"="atm"](around:300,${lat},${lng});
    node["amenity"="bus_station"](around:400,${lat},${lng});
  );
  out body;
`;

const haversineMeters = (lat1, lng1, lat2, lng2) => {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(a)));
};

/**
 * useSafetyData
 * Fetches real safety POIs from Overpass API and calculates dynamic safety score.
 * @param {object} position - { lat, lng }
 * @param {Array}  hazards  - local hazard reports (subtracts from score)
 */
export const useSafetyData = (position, hazards = []) => {
  const [pois, setPois] = useState([]);
  const [safetyScore, setSafetyScore] = useState(85);
  const [loading, setLoading] = useState(false);
  const [lastFetched, setLastFetched] = useState(null);

  const calcScore = useCallback((fetchedPois, localHazards, lat, lng) => {
    let score = 55;

    fetchedPois.forEach(poi => {
      const bonus = POI_CONFIG[poi.amenity]?.bonus ?? 2;
      // Closer POIs give more bonus
      const distFactor = poi.distance <= 200 ? 1.0 : poi.distance <= 500 ? 0.7 : 0.4;
      score += bonus * distFactor;
    });

    // Time-of-day adjustment
    const hour = new Date().getHours();
    if (hour >= 23 || hour <= 4) score -= 22;
    else if (hour >= 21 || hour <= 6) score -= 10;
    else if (hour >= 7 && hour <= 19) score += 5; // Daytime bonus

    // Nearby hazard penalty
    const nearbyHazards = localHazards.filter(h => {
      if (!h.pos) return false;
      return haversineMeters(lat, lng, h.pos[0], h.pos[1]) < 600;
    });
    score -= nearbyHazards.length * 9;

    return Math.max(8, Math.min(100, Math.round(score)));
  }, []);

  useEffect(() => {
    if (!position?.lat || !position?.lng) return;

    // Only refetch if moved > 150m from last fetch point or 60s elapsed
    if (lastFetched) {
      const { lat: lLat, lng: lLng, time } = lastFetched;
      const moved = haversineMeters(position.lat, position.lng, lLat, lLng);
      const elapsed = Date.now() - time;
      if (moved < 150 && elapsed < 60000) {
        // Just recalculate score with current hazards
        setSafetyScore(calcScore(pois, hazards, position.lat, position.lng));
        return;
      }
    }

    let cancelled = false;
    const doFetch = async () => {
      setLoading(true);
      try {
        const query = buildQuery(position.lat, position.lng);
        const res = await fetch(OVERPASS_URL, {
          method: 'POST',
          body: `data=${encodeURIComponent(query)}`,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        });

        if (!res.ok) throw new Error('Overpass API unavailable');
        const data = await res.json();

        if (!cancelled) {
          const mapped = data.elements
            .filter(el => el.tags?.amenity)
            .map(el => ({
              id: el.id,
              lat: el.lat,
              lng: el.lon,
              amenity: el.tags.amenity,
              name: el.tags.name || POI_CONFIG[el.tags.amenity]?.label || 'Safety Point',
              phone: el.tags.phone || el.tags['contact:phone'] || null,
              distance: haversineMeters(position.lat, position.lng, el.lat, el.lon),
            }))
            .filter(poi => POI_CONFIG[poi.amenity])
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20);

          setPois(mapped);
          setSafetyScore(calcScore(mapped, hazards, position.lat, position.lng));
          setLastFetched({ lat: position.lat, lng: position.lng, time: Date.now() });
        }
      } catch {
        // Degrade gracefully — keep last score or default
        if (!cancelled) {
          setSafetyScore(calcScore(pois, hazards, position.lat, position.lng));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    doFetch();
    return () => { cancelled = true; };
  }, [
    Math.round(position?.lat * 1000) / 1000,
    Math.round(position?.lng * 1000) / 1000,
    hazards.length,
  ]);

  return { pois, safetyScore, loading, POI_CONFIG };
};
