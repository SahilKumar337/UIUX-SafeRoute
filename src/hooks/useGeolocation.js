import { useState, useEffect, useRef, useCallback } from 'react';

// ── Demo GPS waypoints around Cubbon Park → Brigade Road, Bengaluru ──
const DEMO_PATH = [
  { lat: 12.9716, lng: 77.5946 },
  { lat: 12.9722, lng: 77.5958 },
  { lat: 12.9728, lng: 77.5971 },
  { lat: 12.9736, lng: 77.5985 },
  { lat: 12.9745, lng: 77.5999 },
  { lat: 12.9756, lng: 77.6013 },
  { lat: 12.9764, lng: 77.6027 },
  { lat: 12.9772, lng: 77.6040 },
  { lat: 12.9781, lng: 77.6053 },
  { lat: 12.9791, lng: 77.6062 },
  { lat: 12.9803, lng: 77.6071 },
  { lat: 12.9816, lng: 77.6078 },
  { lat: 12.9828, lng: 77.6084 },
  { lat: 12.9839, lng: 77.6089 },
  { lat: 12.9853, lng: 77.6095 },
];

const DEMO_ORIGIN = DEMO_PATH[0];

/**
 * useGeolocation
 * @param {boolean} demoMode - if true, simulates GPS along Bengaluru demo path
 * @returns {{ position, permissionStatus, error, demoIndex, demoPathLength }}
 */
export const useGeolocation = (demoMode = true) => {
  const [position, setPosition] = useState({
    lat: DEMO_ORIGIN.lat,
    lng: DEMO_ORIGIN.lng,
    accuracy: 10,
    heading: 42,
    speed: 1.3,
  });
  const [permissionStatus, setPermissionStatus] = useState(demoMode ? 'granted' : 'prompt');
  const [error, setError] = useState(null);
  const [demoIndex, setDemoIndex] = useState(0);

  const watchRef = useRef(null);
  const demoIntervalRef = useRef(null);
  const demoIdxRef = useRef(0);

  useEffect(() => {
    if (demoMode) {
      setPermissionStatus('granted');
      setError(null);
      demoIdxRef.current = 0;
      setDemoIndex(0);
      setPosition({
        ...DEMO_PATH[0],
        accuracy: 8,
        heading: 42,
        speed: 1.3,
      });

      demoIntervalRef.current = setInterval(() => {
        demoIdxRef.current = (demoIdxRef.current + 1) % DEMO_PATH.length;
        const coord = DEMO_PATH[demoIdxRef.current];
        setDemoIndex(demoIdxRef.current);
        setPosition({
          lat: coord.lat + (Math.random() - 0.5) * 0.000045,
          lng: coord.lng + (Math.random() - 0.5) * 0.000045,
          accuracy: 5 + Math.random() * 9,
          heading: 30 + Math.random() * 50,
          speed: 1.1 + Math.random() * 0.9,
        });
      }, 4000);

      return () => {
        clearInterval(demoIntervalRef.current);
      };
    }

    // ── Real GPS mode ──
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setPermissionStatus('unsupported');
      setError('Geolocation is not supported by this browser.');
      return;
    }

    const opts = { enableHighAccuracy: true, timeout: 12000, maximumAge: 2000 };

    watchRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        setPermissionStatus('granted');
        setError(null);
        setPosition({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy ?? 20,
          heading: pos.coords.heading ?? null,
          speed: pos.coords.speed ?? null,
        });
      },
      (err) => {
        if (err.code === err.PERMISSION_DENIED) {
          setPermissionStatus('denied');
          setError('Location access denied. Enable in browser settings.');
        } else if (err.code === err.TIMEOUT) {
          setError('GPS signal timeout — retrying…');
        } else {
          setError('Unable to get location: ' + err.message);
        }
      },
      opts
    );

    return () => {
      if (watchRef.current !== null) {
        navigator.geolocation.clearWatch(watchRef.current);
      }
    };
  }, [demoMode]);

  return {
    position,
    permissionStatus,
    error,
    demoIndex,
    demoPathLength: DEMO_PATH.length,
    demoPath: DEMO_PATH,
    originCoord: demoMode ? DEMO_ORIGIN : null,
  };
};
