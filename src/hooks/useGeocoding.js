import { useState, useCallback, useRef } from 'react';

/**
 * useGeocoding
 * Uses OpenStreetMap Nominatim API for real-time global place search & geocoding.
 * Free, no API key required.
 */
export const useGeocoding = () => {
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const debounceRef = useRef(null);

  const searchPlaces = useCallback((query, userLocation = null) => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    setSearching(true);

    debounceRef.current = setTimeout(async () => {
      try {
        let url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=6&addressdetails=1`;
        
        // If user location is known, prioritize nearby results with viewbox
        if (userLocation?.lat && userLocation?.lng) {
          const delta = 1.0; // ~100km box around user
          const left = (userLocation.lng - delta).toFixed(4);
          const top = (userLocation.lat + delta).toFixed(4);
          const right = (userLocation.lng + delta).toFixed(4);
          const bottom = (userLocation.lat - delta).toFixed(4);
          url += `&viewbox=${left},${top},${right},${bottom}`;
        }

        const resp = await fetch(url, {
          headers: {
            'Accept-Language': 'en',
          },
        });

        if (!resp.ok) throw new Error('Search failed');
        const data = await resp.json();

        const formatted = (data || []).map((item) => {
          const parts = (item.display_name || '').split(', ');
          const title = parts[0] || item.name || 'Location';
          const sub = parts.slice(1, 4).join(', ') || item.type || '';
          return {
            id: item.place_id || Math.random(),
            title,
            sub,
            fullName: item.display_name,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type || 'place',
          };
        });

        setResults(formatted);
      } catch (err) {
        console.warn('Geocoding warning:', err.message);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 280);
  }, []);

  const clearResults = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setResults([]);
    setSearching(false);
  }, []);

  return { results, searching, searchPlaces, clearResults };
};
