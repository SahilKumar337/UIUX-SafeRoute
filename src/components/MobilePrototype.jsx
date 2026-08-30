import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Circle, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, ShieldCheck, ShieldAlert, ChevronLeft, AlertTriangle, Send, CheckCircle2,
  Volume2, VolumeX, Navigation, Home, MapPin, AlertOctagon,
  User, Star, Camera, Eye, EyeOff, Zap, Plus, Phone, PhoneCall, Share2,
  Radio, Sparkles, Lock, Mail, Search, Trash2, ArrowRight, Bell, Compass,
  RadioTower, LocateFixed, Wifi, WifiOff, Gauge, Route, Clock3, ShieldOff,
  ScanLine, Crosshair, Activity, Signal, Loader2, MousePointerClick
} from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRouting } from '../hooks/useRouting';
import { useSafetyData, POI_CONFIG } from '../hooks/useSafetyData';
import { useGeocoding } from '../hooks/useGeocoding';

/* ── Leaflet icon fix ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ═══════════════════════ DESIGN SYSTEM CONSTANTS ═══════════════════════ */
const C = {
  bg: '#06080F', bgCard: 'rgba(14,19,32,0.78)', bgSolid: '#0D1322',
  bgCard2: 'rgba(21,28,48,0.70)', bgCard3: 'rgba(30,40,68,0.75)',
  primary: '#6366F1', primaryGlow: 'rgba(99,102,241,0.40)', primaryDim: 'rgba(99,102,241,0.13)',
  cyan: '#00F5FF',    cyanGlow: 'rgba(0,245,255,0.38)', cyanDim: 'rgba(0,245,255,0.11)',
  safe: '#00E599',    safeGlow: 'rgba(0,229,153,0.38)', safeDim: 'rgba(0,229,153,0.12)',
  danger: '#FF2E63',  dangerGlow: 'rgba(255,46,99,0.45)', dangerDim: 'rgba(255,46,99,0.12)',
  warning: '#FFB800', warningGlow: 'rgba(255,184,0,0.38)', warningDim: 'rgba(255,184,0,0.12)',
  purple: '#A855F7',  purpleDim: 'rgba(168,85,247,0.13)',
  text: '#FFFFFF', textS: '#94A3B8', textM: '#64748B', textF: '#3D4F6F',
  border: 'rgba(255,255,255,0.08)', borderL: 'rgba(255,255,255,0.14)',
  borderNeon: 'rgba(99,102,241,0.5)',
};

/* ═══════════════════════ LEAFLET CUSTOM ICONS ═══════════════════════════ */
const makeGpsIcon = (color = '#00F5FF') => L.divIcon({
  className: '',
  html: `<div style="position:relative;width:22px;height:22px;display:flex;align-items:center;justify-content:center">
    <div style="position:absolute;width:22px;height:22px;border-radius:50%;background:${color}33;animation:radarRipple 1.8s infinite"></div>
    <div style="width:12px;height:12px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 0 14px ${color}"></div>
  </div>`,
  iconSize: [22, 22], iconAnchor: [11, 11],
});

const makeDestIcon = (label = 'Destination') => L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;gap:1px">
    <div style="background:#6366F1;color:#fff;font-size:9px;font-weight:900;padding:2px 7px;border-radius:6px;white-space:nowrap;font-family:Inter,sans-serif;box-shadow:0 0 12px #6366F1;max-width:110px;overflow:hidden;text-overflow:ellipsis">🎯 ${label.slice(0, 16)}</div>
    <div style="width:2px;height:4px;background:#6366F1"></div>
    <div style="width:8px;height:8px;border-radius:50%;background:#6366F1;border:2px solid #fff;box-shadow:0 0 10px #6366F1"></div>
  </div>`,
  iconSize: [110, 26], iconAnchor: [55, 26],
});

const makePoiIcon = (color, label, emoji) => L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;gap:1px">
    <div style="background:${color};color:#000;font-size:8px;font-weight:900;padding:2px 6px;border-radius:5px;white-space:nowrap;font-family:Inter,sans-serif;box-shadow:0 0 10px ${color};display:flex;align-items:center;gap:2px">
      <span>${emoji}</span><span>${(label || '').slice(0, 14)}</span>
    </div>
    <div style="width:1.5px;height:3px;background:${color}"></div>
    <div style="width:7px;height:7px;border-radius:50%;background:${color};border:1.5px solid #fff;box-shadow:0 0 8px ${color}"></div>
  </div>`,
  iconSize: [96, 24], iconAnchor: [48, 24],
});

const makeHazardIcon = (severity) => {
  const col = severity === 'high' ? '#FF2E63' : '#FFB800';
  const emoji = severity === 'high' ? '🚨' : '⚠️';
  return L.divIcon({
    className: '',
    html: `<div style="display:flex;flex-direction:column;align-items:center;gap:1px">
      <div style="background:${col};color:#000;font-size:8px;font-weight:900;padding:2px 5px;border-radius:5px;white-space:nowrap;font-family:Inter,sans-serif;box-shadow:0 0 10px ${col}">${emoji}</div>
      <div style="width:7px;height:7px;border-radius:50%;background:${col};border:1.5px solid #fff;box-shadow:0 0 8px ${col}"></div>
    </div>`,
    iconSize: [28, 20], iconAnchor: [14, 20],
  });
};

/* ═══════════════════════ SOUND ENGINE ══════════════════════════════════ */
class SFX {
  static ctx = null;
  static init() {
    if (!this.ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (AC) this.ctx = new AC();
    }
  }
  static play(freq = 880, type = 'sine', duration = 0.12, vol = 0.10) {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      g.gain.setValueAtTime(vol, this.ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(); osc.stop(this.ctx.currentTime + duration);
    } catch (_) {}
  }
  static siren() {
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(600, now);
      osc.frequency.linearRampToValueAtTime(1200, now + 0.28);
      osc.frequency.linearRampToValueAtTime(600, now + 0.56);
      g.gain.setValueAtTime(0.16, now);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.58);
      osc.connect(g); g.connect(this.ctx.destination);
      osc.start(); osc.stop(now + 0.58);
    } catch (_) {}
  }
  static haptic(pattern = [60]) {
    try { navigator.vibrate?.(pattern); } catch (_) {}
  }
}

/* ═══════════════════════ LEAFLET HELPER COMPONENTS ════════════════════ */

const DarkTileLayer = () => (
  <TileLayer
    url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
    attribution=""
    maxZoom={19}
  />
);

// Auto-adjust map viewport to fit both safe and shortcut routes simultaneously
const MapBoundsFitter = ({ origin, destination, routeCoords, altCoords }) => {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const allCoords = [
      ...(routeCoords || []),
      ...(altCoords || []),
    ];
    if (allCoords.length >= 2) {
      try {
        const bounds = L.latLngBounds(allCoords);
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 16 });
      } catch (_) {}
    } else if (origin && destination) {
      try {
        const bounds = L.latLngBounds([
          [origin.lat, origin.lng],
          [destination.lat, destination.lng],
        ]);
        map.fitBounds(bounds, { padding: [45, 45], maxZoom: 15 });
      } catch (_) {}
    } else if (origin) {
      map.setView([origin.lat, origin.lng], 15);
    }
  }, [map, origin?.lat, origin?.lng, destination?.lat, destination?.lng, routeCoords, altCoords]);
  return null;
};

// Map click listener to select a destination anywhere by tapping on map
const MapClickHandler = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      if (onMapClick) {
        onMapClick(e.latlng);
      }
    },
  });
  return null;
};

/* ═══════════════════════ HELPER UI COMPONENTS ═══════════════════════════ */

const ScoreRing = ({ score, size = 100, strokeWidth = 8 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 75 ? C.safe : score >= 50 ? C.warning : C.danger;

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke="rgba(255,255,255,0.06)" strokeWidth={strokeWidth} />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none"
          stroke={color} strokeWidth={strokeWidth}
          strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4,0,0.2,1), stroke 0.6s ease' }} />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <span style={{ fontSize: size * 0.28, fontWeight: 900, color, fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: size * 0.11, color: C.textM, fontWeight: 800, marginTop: 2, letterSpacing: 0.4 }}>SCORE</span>
      </div>
    </div>
  );
};

const Toggle = ({ on, onToggle, color = C.primary }) => (
  <button
    onClick={onToggle}
    style={{
      width: 36, height: 20, borderRadius: 10,
      background: on ? color : 'rgba(255,255,255,0.08)',
      border: `1px solid ${on ? color : 'rgba(255,255,255,0.1)'}`,
      position: 'relative', cursor: 'pointer', flexShrink: 0,
      transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: on ? `0 0 12px ${color}55` : 'none',
    }}
  >
    <div style={{
      width: 14, height: 14, borderRadius: 7, background: '#fff',
      position: 'absolute', top: 2, left: on ? 19 : 3,
      transition: 'left 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
      boxShadow: '0 1px 4px rgba(0,0,0,0.5)',
    }} />
  </button>
);

const Badge = ({ children, color, style: extra }) => (
  <span style={{
    background: color + '1A', color, border: `1px solid ${color}44`,
    borderRadius: 6, padding: '2px 7px', fontSize: 9, fontWeight: 900,
    letterSpacing: 0.4, display: 'inline-flex', alignItems: 'center', gap: 3,
    ...extra,
  }}>
    {children}
  </span>
);

const MetricTile = ({ label, value, unit, color = C.text, border }) => (
  <div style={{
    background: C.bgCard2, border: `1px solid ${border || C.border}`,
    borderRadius: 10, padding: '8px 10px', flex: 1,
  }}>
    <div style={{ fontSize: 16, fontWeight: 900, color, fontFamily: 'Plus Jakarta Sans, sans-serif', lineHeight: 1 }}>
      {value}<span style={{ fontSize: 10, fontWeight: 600, marginLeft: 2, color: C.textS }}>{unit}</span>
    </div>
    <div style={{ fontSize: 9, color: C.textM, marginTop: 3, fontWeight: 700, letterSpacing: 0.3, textTransform: 'uppercase' }}>{label}</div>
  </div>
);

/* ═══════════════════════ MAIN COMPONENT ═══════════════════════════════ */
export default function MobilePrototype() {
  /* ── Navigation ── */
  const [screen, setScreen] = useState('01-splash');
  const [screenHistory, setScreenHistory] = useState(['01-splash']);
  const [activeTab, setActiveTab] = useState('home');

  /* ── Demo mode toggle (false by default for REAL GPS) ── */
  const [demoMode, setDemoMode] = useState(false);

  /* ── Real-time GPS & Routing hooks ── */
  const { position, permissionStatus, demoIndex, demoPathLength } = useGeolocation(demoMode);
  const { safeRoute, fastRoute, loading: routeLoading, error: routeError, fetchRoute, clearRoutes } = useRouting();
  const { results: searchResults, searching: searchSearching, searchPlaces, clearResults } = useGeocoding();

  /* ── Dynamic Destination State ── */
  const [dest, setDest] = useState('Central Campus / Main Gate');
  const [destCoord, setDestCoord] = useState(() => ({
    lat: 31.2536,
    lng: 75.7037, // Default near LPU / Punjab area
  }));
  const [origin, setOrigin] = useState('Current Location (GPS)');
  const [showSugg, setShowSugg] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState('safe');

  /* ── Local Hazards ── */
  const [hazards, setHazards] = useState([
    { id: 1, pos: [31.2580, 75.7050], label: 'Poor Lighting',    type: 'Lighting',   severity: 'medium', desc: 'Broken street lamps along campus road', upvotes: 18, time: '6m ago' },
    { id: 2, pos: [31.2490, 75.6980], label: 'Suspicious Group', type: 'Suspicious', severity: 'high',   desc: 'Unmonitored corner near highway flyover', upvotes: 34, time: '14m ago' },
    { id: 3, pos: [31.2540, 75.7120], label: 'Road Construction',type: 'Road',       severity: 'low',    desc: 'Footpath uneven, proceed on lit side',    upvotes:  9, time: '38m ago' },
  ]);
  const { pois, safetyScore, loading: poiLoading, POI_CONFIG } = useSafetyData(position, hazards);

  /* ── Sync default destination with user position on initial lock ── */
  const initializedPosRef = useRef(false);
  useEffect(() => {
    if (position && !initializedPosRef.current) {
      initializedPosRef.current = true;
      if (demoMode) {
        setDestCoord({ lat: 12.9853, lng: 77.6095 });
        setDest('Campus Apartment (Dormitory #4)');
      } else {
        // Set local destination ~1.2 km away from real GPS location
        setDestCoord({
          lat: position.lat + 0.009,
          lng: position.lng + 0.008,
        });
        setDest('Local Hub / Campus Gate');
      }
    }
  }, [position, demoMode]);

  /* ── Time ── */
  const [currentTime, setCurrentTime] = useState('');
  useEffect(() => {
    const tick = () => {
      const d = new Date();
      const h = d.getHours() % 12 || 12;
      const m = d.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${h}:${m}`);
    };
    tick();
    const id = setInterval(tick, 10000);
    return () => clearInterval(id);
  }, []);

  /* ── Auth state (persisted) ── */
  const [authName, setAuthName] = useState(() => localStorage.getItem('sr_name') || 'Sahil Kumar');
  const [authEmail, setAuthEmail] = useState(() => localStorage.getItem('sr_email') || 'sahil@example.com');
  const [authPass, setAuthPass] = useState('SecureRoute2026!');
  const [authMode, setAuthMode] = useState('signin');
  const [showPass, setShowPass] = useState(false);
  const [forgotOpen, setForgotOpen] = useState(false);

  /* ── Onboarding ── */
  const [slide, setSlide] = useState(0);

  /* ── Active Navigation ── */
  const [navStepIdx, setNavStepIdx] = useState(0);
  const [navMuted, setNavMuted] = useState(false);

  /* ── SOS ── */
  const [sosCountdown, setSosCountdown] = useState(3);
  const [sosSeconds, setSosSeconds] = useState(0);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState('');
  const [pinErr, setPinErr] = useState(false);

  /* ── Hazard report ── */
  const [repType, setRepType] = useState('Poor Lighting');
  const [repSev, setRepSev] = useState('Medium');
  const [repDesc, setRepDesc] = useState('');
  const [repImg, setRepImg] = useState(null);
  const [repAnon, setRepAnon] = useState(false);
  const [selHazard, setSelHazard] = useState(null);
  const [mapFilter, setMapFilter] = useState('All');
  const fileInputRef = useRef(null);

  /* ── Profile ── */
  const [contacts, setContacts] = useState([
    { id: 'c1', name: 'Priya Kumar (Mom)', phone: '+91 98765 00001', relation: 'Mother' },
    { id: 'c2', name: 'Rajesh Kumar (Dad)', phone: '+91 98765 00002', relation: 'Father' },
    { id: 'c3', name: 'Campus Security',    phone: '080-22940000',    relation: 'Desk'   },
  ]);
  const [addContactOpen, setAddContactOpen] = useState(false);
  const [newCName, setNewCName] = useState('');
  const [newCPhone, setNewCPhone] = useState('');
  const [prefs, setPrefs] = useState({ autoSos: true, walkWithMe: true, locationShare: true, stealthMode: false });

  /* ── Rating ── */
  const [stars, setStars] = useState(5);

  /* ── Toast ── */
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);
  const showToast = useCallback((msg, type = 'ok') => {
    clearTimeout(toastRef.current);
    setToast({ msg, type });
    SFX.play(type === 'err' ? 440 : 900, 'sine', 0.09);
    toastRef.current = setTimeout(() => setToast(null), 3000);
  }, []);

  /* ── Navigation Helpers ── */
  const nav = useCallback((nextScreen) => {
    SFX.play(600, 'sine', 0.04);
    SFX.haptic([30]);
    setScreenHistory(h => [...h, nextScreen]);
    setScreen(nextScreen);
    if (nextScreen === '04-dashboard') setActiveTab('home');
    else if (['05-navigate', '06-active-nav'].includes(nextScreen)) setActiveTab('navigate');
    else if (['07-sos-trigger', '08-sos-active'].includes(nextScreen)) setActiveTab('sos');
    else if (['09-hazard-report', '10-community-map'].includes(nextScreen)) setActiveTab('report');
    else if (nextScreen === '12-profile') setActiveTab('profile');
  }, []);

  const goBack = useCallback(() => {
    SFX.play(450, 'sine', 0.04);
    setScreenHistory(h => {
      if (h.length > 1) {
        const newH = h.slice(0, -1);
        setScreen(newH[newH.length - 1]);
        return newH;
      }
      setScreen('04-dashboard');
      return ['04-dashboard'];
    });
  }, []);

  /* ── SOS countdown ── */
  useEffect(() => {
    if (screen !== '07-sos-trigger') { setSosCountdown(3); return; }
    SFX.siren();
    SFX.haptic([200, 100, 200]);
    if (sosCountdown <= 0) { nav('08-sos-active'); return; }
    const t = setTimeout(() => {
      setSosCountdown(p => {
        SFX.play(800, 'square', 0.12);
        return p - 1;
      });
    }, 1000);
    return () => clearTimeout(t);
  }, [screen, sosCountdown]);

  /* ── SOS stopwatch ── */
  useEffect(() => {
    if (screen !== '08-sos-active') { setSosSeconds(0); return; }
    const t = setInterval(() => setSosSeconds(p => p + 1), 1000);
    return () => clearInterval(t);
  }, [screen]);

  /* ── Auto-fetch route when entering route planner or when destCoord changes ── */
  useEffect(() => {
    if (screen === '05-navigate' && position && destCoord) {
      fetchRoute(position, destCoord);
    }
  }, [screen, destCoord.lat, destCoord.lng, position?.lat, position?.lng]);

  /* ── Active nav auto-advance ── */
  useEffect(() => {
    if (screen !== '06-active-nav') { setNavStepIdx(0); return; }
    const currentRoute = selectedRoute === 'safe' ? safeRoute : fastRoute;
    if (!currentRoute?.steps?.length) return;
    const steps = currentRoute.steps;
    if (!navMuted) SFX.play(1046, 'sine', 0.07);
    const interval = setInterval(() => {
      setNavStepIdx(prev => {
        if (prev >= steps.length - 1) {
          clearInterval(interval);
          showToast('Destination reached! Generating analytics…');
          nav('11-summary');
          return 0;
        }
        if (!navMuted) SFX.play(900, 'sine', 0.06);
        return prev + 1;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [screen, selectedRoute, safeRoute, fastRoute, navMuted]);

  /* ── Real-time Search Handler ── */
  const handleDestInputChange = (text) => {
    setDest(text);
    setShowSugg(true);
    searchPlaces(text, position);
  };

  const handleSelectPlace = (place) => {
    setDest(place.title);
    setDestCoord({ lat: place.lat, lng: place.lng });
    setShowSugg(false);
    clearResults();
    if (position) {
      fetchRoute(position, { lat: place.lat, lng: place.lng });
    }
    showToast(`📍 Destination: ${place.title}`);
  };

  const handleMapClickSetDest = useCallback((latlng) => {
    const newDestCoord = { lat: latlng.lat, lng: latlng.lng };
    setDestCoord(newDestCoord);
    setDest(`Custom Pin (${latlng.lat.toFixed(3)}, ${latlng.lng.toFixed(3)})`);
    if (position) {
      fetchRoute(position, newDestCoord);
    }
    showToast('🎯 Destination updated to tapped location!');
  }, [position, fetchRoute, showToast]);

  /* ── Camera for hazard report ── */
  const capturePhoto = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setRepImg(url);
      showToast('Evidence photo attached!');
    }
  };

  /* ── Share location ── */
  const shareLocation = useCallback(async () => {
    const lat = position?.lat?.toFixed(5) || '0.00000';
    const lng = position?.lng?.toFixed(5) || '0.00000';
    const txt = `📍 My live location: https://maps.google.com/?q=${lat},${lng}\nSent via SafeRoute Pro 🛡️`;
    try {
      if (navigator.share) {
        await navigator.share({ title: 'My Live GPS Location — SafeRoute', text: txt });
        showToast('Location shared!');
      } else {
        await navigator.clipboard.writeText(txt);
        showToast('GPS link copied to clipboard!');
      }
    } catch (_) {
      showToast('Could not share — link copied!');
    }
  }, [position]);

  /* ── Distance formatter helper ── */
  const formatDistance = (meters) => {
    if (!meters || meters <= 0) return '0 m';
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  /* ── Dynamic Island content ── */
  const dynamicIsland = useMemo(() => {
    if (['07-sos-trigger', '08-sos-active'].includes(screen)) {
      return {
        width: 196,
        children: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 10px', gap: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: 4, background: C.danger, animation: 'neonPulse 0.85s infinite' }} />
              <span style={{ fontSize: 10, fontWeight: 900, color: C.danger, letterSpacing: 0.5 }}>SOS ACTIVE</span>
            </div>
            <span style={{ fontSize: 10, color: '#fff', fontFamily: 'JetBrains Mono', fontWeight: 700 }}>
              {Math.floor(sosSeconds / 60).toString().padStart(2, '0')}:{(sosSeconds % 60).toString().padStart(2, '0')}
            </span>
          </div>
        ),
      };
    }
    if (screen === '06-active-nav') {
      const currentRoute = selectedRoute === 'safe' ? safeRoute : fastRoute;
      const step = currentRoute?.steps?.[navStepIdx];
      return {
        width: 186,
        children: (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 8px', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <Navigation size={11} color={C.safe} style={{ transform: 'rotate(45deg)' }} />
              <span style={{ fontSize: 10, fontWeight: 800, color: '#fff', maxWidth: 90, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {step?.instruction?.slice(0, 16) || 'Navigating…'}
              </span>
            </div>
            <span style={{ fontSize: 10, color: C.safe, fontWeight: 900 }}>
              {currentRoute?.safetyScore ?? 94}%
            </span>
          </div>
        ),
      };
    }
    return { width: 110, children: (
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
        <div style={{ width: 9, height: 9, borderRadius: '50%', background: '#1A2136' }} />
        <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#0B0F1A' }} />
      </div>
    )};
  }, [screen, sosSeconds, safeRoute, fastRoute, navStepIdx, selectedRoute]);

  /* ── Status Bar ── */
  const StatusBar = () => (
    <div style={{
      height: 38, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '0 22px', flexShrink: 0, zIndex: 200, position: 'relative',
    }}>
      <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>{currentTime}</span>
      <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
        <Radio size={11} color={C.cyan} />
        <span style={{ fontSize: 10, color: C.cyan, fontWeight: 900, letterSpacing: 0.6 }}>5G</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 2, background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 6 }}>
          <Zap size={9} color={C.safe} />
          <span style={{ fontSize: 10, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>94%</span>
        </div>
      </div>
    </div>
  );

  /* ── Header ── */
  const Header = ({ title, right }) => (
    <div style={{
      height: 44, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 14px', background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(18px)',
      borderBottom: `1px solid ${C.border}`, flexShrink: 0, zIndex: 10,
    }}>
      <button onClick={goBack} style={{
        width: 30, height: 30, borderRadius: 9, background: 'rgba(255,255,255,0.05)',
        border: `1px solid ${C.border}`, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <ChevronLeft size={16} />
      </button>
      <span style={{ fontSize: 14, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans', letterSpacing: -0.2 }}>{title}</span>
      {right || <div style={{ width: 30 }} />}
    </div>
  );

  /* ── Bottom Nav ── */
  const BottomNav = () => {
    const tabs = [
      { id: 'home',     icon: Home,        label: 'Home',     to: '04-dashboard'     },
      { id: 'navigate', icon: Compass,      label: 'Route',    to: '05-navigate'      },
      { id: 'sos',      icon: AlertOctagon, label: 'SOS',      to: '07-sos-trigger', danger: true },
      { id: 'report',   icon: ShieldAlert,  label: 'Radar',    to: '10-community-map' },
      { id: 'profile',  icon: User,         label: 'Profile',  to: '12-profile'       },
    ];
    return (
      <div style={{ padding: '0 12px 10px', flexShrink: 0 }}>
        <div style={{
          height: 54, background: 'rgba(10,15,28,0.88)', backdropFilter: 'blur(20px)',
          border: `1px solid ${C.borderL}`, borderRadius: 27,
          display: 'flex', justifyContent: 'space-around', alignItems: 'center', padding: '0 6px',
          boxShadow: '0 12px 35px rgba(0,0,0,0.8), 0 0 0 1px rgba(99,102,241,0.08)',
        }}>
          {tabs.map(t => {
            const active = activeTab === t.id;
            const col = t.danger ? C.danger : (active ? C.primary : C.textM);
            return (
              <button key={t.id} onClick={() => { setActiveTab(t.id); nav(t.to); }}
                style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, background: 'none', border: 'none', padding: '2px 0', color: col }}>
                <div style={{
                  width: t.danger ? 32 : 38, height: 24, borderRadius: 12,
                  background: t.danger ? (active ? C.danger : C.dangerDim) : (active ? C.primaryDim : 'transparent'),
                  border: t.danger ? `1px solid ${C.danger}` : (active ? `1px solid ${C.borderNeon}` : 'none'),
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: t.danger ? (active ? '#fff' : C.danger) : col,
                  boxShadow: active ? (t.danger ? `0 0 14px ${C.dangerGlow}` : `0 0 12px ${C.primaryGlow}`) : 'none',
                  transition: 'all 0.2s ease',
                }}>
                  <t.icon size={t.danger ? 14 : 16} />
                </div>
                <span style={{ fontSize: 9, fontWeight: active ? 800 : 500 }}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  /* ═══════════════════════════════════════════════════════════
     SCREENS
  ═══════════════════════════════════════════════════════════ */

  /* ── 01 SPLASH ── */
  const renderSplash = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between', padding: '24px 20px 28px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 260, height: 200, background: `radial-gradient(ellipse, ${C.primaryGlow} 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ background: C.primaryDim, border: `1px solid ${C.borderNeon}`, padding: '3px 12px', borderRadius: 99, fontSize: 10, fontWeight: 900, color: C.cyan, display: 'flex', alignItems: 'center', gap: 5, letterSpacing: 0.5 }}>
          <Sparkles size={11} color={C.cyan} /> AI-POWERED PERSONAL DEFENSE
        </div>
      </div>

      {/* Hero Shield */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ position: 'relative', width: 100, height: 100 }}>
          <div style={{ position: 'absolute', inset: -12, borderRadius: '50%', border: `1px solid ${C.primaryGlow}`, animation: 'orbitGlow 6s linear infinite' }} />
          <div style={{ position: 'absolute', inset: -5, borderRadius: '50%', border: `1px dashed rgba(99,102,241,0.25)` }} />
          <div style={{ position: 'absolute', inset: 0, borderRadius: 30, background: `linear-gradient(135deg, ${C.primary}, #4338CA)`, filter: 'blur(18px)', opacity: 0.8, animation: 'neonPulse 2.5s ease-in-out infinite' }} />
          <div style={{
            position: 'relative', width: 100, height: 100, borderRadius: 30,
            background: 'linear-gradient(145deg, #7C7FFF, #4338CA, #312E81)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.22)',
            boxShadow: `0 14px 40px ${C.primaryGlow}, inset 0 1px 0 rgba(255,255,255,0.25)`,
          }}>
            <ShieldCheck size={52} color="#fff" />
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <h1 style={{
            fontSize: 34, fontWeight: 900, margin: 0, letterSpacing: -0.9,
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'linear-gradient(145deg, #FFFFFF 30%, #A5B4FC 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          }}>SafeRoute</h1>
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 3 }}>
            <span style={{ fontSize: 10, color: C.cyan, fontWeight: 900, letterSpacing: 1.5, textTransform: 'uppercase', fontFamily: 'JetBrains Mono' }}>PRO EDITION 2026</span>
          </div>
        </div>

        <p style={{ fontSize: 12, color: C.textS, textAlign: 'center', maxWidth: 240, lineHeight: 1.6 }}>
          Neural route intelligence, real-time global navigation & sub-second SOS response.
        </p>
      </div>

      {/* Stats strip */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {[
          { val: '2.4M+', label: 'Safe Trips',  color: C.cyan    },
          { val: '99.8%', label: 'Accuracy',    color: C.safe    },
          { val: '4.9 ★', label: 'App Rating',  color: C.warning },
        ].map((s, i) => (
          <div key={i} style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '8px 5px', textAlign: 'center' }}>
            <div style={{ fontSize: 14, fontWeight: 900, color: s.color, fontFamily: 'Plus Jakarta Sans' }}>{s.val}</div>
            <div style={{ fontSize: 9, color: C.textM, marginTop: 2, fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <button onClick={() => nav('02-onboarding')} style={{
          height: 50, borderRadius: 16, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366F1, #4338CA)',
          color: '#fff', fontSize: 14, fontWeight: 800, fontFamily: 'Plus Jakarta Sans',
          boxShadow: `0 10px 30px ${C.primaryGlow}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          Initialize SafeRoute <ArrowRight size={16} />
        </button>
        <button onClick={() => nav('03-login')} style={{ background: 'none', border: 'none', color: C.textS, fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>
          Have an account? <span style={{ color: C.cyan, fontWeight: 800 }}>Sign In</span>
        </button>
      </div>
    </div>
  );

  /* ── 02 ONBOARDING ── */
  const slides = [
    { icon: ShieldCheck, color: C.primary, glow: C.primaryGlow, title: 'AI Risk Telemetry', sub: 'Real-time analysis of streetlamp illumination, CCTV density, and footfall patterns.', badge: 'NEURAL RISK METER' },
    { icon: AlertOctagon, color: C.danger,  glow: C.dangerGlow,  title: 'Instant SOS Broadcast', sub: 'Trigger emergency alarm in 3 seconds — live GPS coordinates sent to guardians and 112.', badge: 'SUB-SECOND RELAY' },
    { icon: MapPin, color: C.safe, glow: C.safeGlow, title: 'Global Live Radar', sub: 'Search any destination worldwide, crowdsourced reports & verified 24/7 safe havens.', badge: 'GLOBAL RADAR' },
  ];

  const renderOnboarding = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between', padding: '12px 18px 26px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => slide > 0 ? setSlide(s => s - 1) : nav('01-splash')} style={{ background: 'none', border: 'none', color: C.textS, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}>
          <ChevronLeft size={15} /> Back
        </button>
        <button onClick={() => nav('03-login')} style={{ background: 'none', border: 'none', color: C.cyan, fontSize: 12, cursor: 'pointer', fontWeight: 800 }}>Skip</button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, textAlign: 'center' }}>
        <div style={{
          width: 190, height: 190, borderRadius: 26,
          background: 'rgba(14,19,32,0.85)', border: `1px solid ${C.borderL}`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12,
          boxShadow: `0 14px 35px rgba(0,0,0,0.8), 0 0 30px ${slides[slide].glow}22`,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 40%, ${slides[slide].glow.replace('0.38', '0.08')} 0%, transparent 70%)` }} />
          <div style={{ width: 70, height: 70, borderRadius: 35, background: slides[slide].color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1.5px solid ${slides[slide].color}44`, boxShadow: `0 0 22px ${slides[slide].glow}` }}>
            {React.createElement(slides[slide].icon, { size: 34, color: slides[slide].color })}
          </div>
          <Badge color={slides[slide].color}>{slides[slide].badge}</Badge>
        </div>

        <Badge color={C.cyan} style={{ fontSize: 10, letterSpacing: 1 }}>0{slide + 1} / 03</Badge>

        <div>
          <h2 style={{ fontSize: 21, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: '0 0 8px', lineHeight: 1.2 }}>
            {slides[slide].title}
          </h2>
          <p style={{ fontSize: 12, color: C.textS, lineHeight: 1.55, maxWidth: 260 }}>{slides[slide].sub}</p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
        <div style={{ display: 'flex', gap: 6 }}>
          {[0, 1, 2].map(i => (
            <button key={i} onClick={() => setSlide(i)} style={{
              width: slide === i ? 20 : 6, height: 6, borderRadius: 3, border: 'none', cursor: 'pointer',
              background: slide === i ? C.cyan : 'rgba(255,255,255,0.15)',
              boxShadow: slide === i ? `0 0 8px ${C.cyanGlow}` : 'none',
              transition: 'all 0.22s ease',
            }} />
          ))}
        </div>
        <button onClick={() => slide < 2 ? setSlide(s => s + 1) : nav('03-login')} style={{
          height: 48, width: '100%', borderRadius: 14, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366F1, #4338CA)',
          color: '#fff', fontSize: 13, fontWeight: 800, fontFamily: 'Plus Jakarta Sans',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: `0 8px 24px ${C.primaryGlow}`,
        }}>
          {slide === 2 ? 'Launch SafeRoute' : 'Continue'} <ArrowRight size={15} />
        </button>
      </div>
    </div>
  );

  /* ── 03 AUTH ── */
  const renderAuth = () => (
    <div className="screen-anim" style={{ padding: '10px 16px 22px', justifyContent: 'space-between' }}>
      <div>
        <button onClick={() => nav('01-splash')} style={{ background: 'none', border: 'none', color: C.textS, fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3, marginBottom: 6 }}>
          <ChevronLeft size={15} /> Back
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, margin: '6px 0 14px' }}>
          <div style={{ width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #6366F1, #2563EB)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 8px 24px ${C.primaryGlow}`, border: '1px solid rgba(255,255,255,0.2)' }}>
            <Shield size={26} color="#fff" />
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: 0 }}>
            {authMode === 'signin' ? 'Guardian Sign In' : 'Create Account'}
          </h2>
          <p style={{ fontSize: 11, color: C.textS, margin: 0 }}>
            {authMode === 'signin' ? 'Access your encrypted safety profile' : 'Join 2.4M+ protected commuters'}
          </p>
        </div>

        {/* Tab switcher */}
        <div style={{ display: 'flex', background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, borderRadius: 10, padding: 3, gap: 3, marginBottom: 14 }}>
          {['signin', 'signup'].map(m => (
            <button key={m} onClick={() => setAuthMode(m)} style={{
              flex: 1, height: 30, borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 11, fontWeight: 800,
              background: authMode === m ? C.primary : 'transparent',
              color: authMode === m ? '#fff' : C.textS,
              boxShadow: authMode === m ? `0 4px 14px ${C.primaryGlow}` : 'none',
              transition: 'all 0.18s ease',
            }}>
              {m === 'signin' ? 'Sign In' : 'Register'}
            </button>
          ))}
        </div>

        {/* Form fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {authMode === 'signup' && (
            <div>
              <label style={{ fontSize: 9, fontWeight: 800, color: C.textM, display: 'block', marginBottom: 3, letterSpacing: 0.5 }}>FULL NAME</label>
              <div style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 10, height: 42, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7 }}>
                <User size={14} color={C.textM} />
                <input value={authName} onChange={e => setAuthName(e.target.value)} placeholder="Sahil Kumar"
                  style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12, width: '100%', fontWeight: 600 }} />
              </div>
            </div>
          )}
          <div>
            <label style={{ fontSize: 9, fontWeight: 800, color: C.textM, display: 'block', marginBottom: 3, letterSpacing: 0.5 }}>EMAIL ADDRESS</label>
            <div style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 10, height: 42, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7 }}>
              <Mail size={14} color={C.textM} />
              <input type="email" value={authEmail} onChange={e => setAuthEmail(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12, width: '100%', fontWeight: 600 }} />
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <label style={{ fontSize: 9, fontWeight: 800, color: C.textM, letterSpacing: 0.5 }}>PASSWORD</label>
              {authMode === 'signin' && <span onClick={() => setForgotOpen(true)} style={{ fontSize: 10, color: C.cyan, fontWeight: 800, cursor: 'pointer' }}>Forgot?</span>}
            </div>
            <div style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 10, height: 42, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7 }}>
              <Lock size={14} color={C.textM} />
              <input type={showPass ? 'text' : 'password'} value={authPass} onChange={e => setAuthPass(e.target.value)}
                style={{ background: 'none', border: 'none', color: '#fff', fontSize: 12, width: '100%', fontWeight: 600 }} />
              <button type="button" onClick={() => setShowPass(p => !p)} style={{ background: 'none', border: 'none', color: C.textM, cursor: 'pointer' }}>
                {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
        </div>

        <button onClick={() => {
          if (!authEmail.includes('@')) { showToast('Enter a valid email address', 'err'); return; }
          localStorage.setItem('sr_name', authName); localStorage.setItem('sr_email', authEmail);
          showToast(authMode === 'signin' ? 'Authentication verified! 🛡️' : 'Account created!');
          nav('04-dashboard');
        }} style={{
          height: 44, width: '100%', borderRadius: 12, border: 'none', cursor: 'pointer', marginTop: 12,
          background: 'linear-gradient(135deg, #6366F1, #4338CA)', color: '#fff', fontSize: 13, fontWeight: 800,
          boxShadow: `0 8px 24px ${C.primaryGlow}`, fontFamily: 'Plus Jakarta Sans',
        }}>
          {authMode === 'signin' ? 'Sign In Securely' : 'Create Protected Account'}
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '10px 0' }}>
          <div style={{ flex: 1, height: 1, background: C.border }} />
          <span style={{ fontSize: 9, color: C.textM, fontWeight: 700 }}>OR</span>
          <div style={{ flex: 1, height: 1, background: C.border }} />
        </div>

        <button onClick={() => { showToast('Signed in via Google!'); nav('04-dashboard'); }} style={{
          height: 40, width: '100%', borderRadius: 10, border: `1px solid ${C.border}`, cursor: 'pointer',
          background: C.bgCard2, color: '#fff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        }}>
          <span style={{ color: '#EA4335', fontWeight: 900, fontSize: 14 }}>G</span> Continue with Google
        </button>
      </div>

      <p style={{ textAlign: 'center', fontSize: 9, color: C.textF }}>🔒 256-bit AES encrypted telemetry</p>

      {forgotOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18 }}>
          <div style={{ background: C.bgSolid, border: `1px solid ${C.borderL}`, borderRadius: 18, padding: 18, width: '100%' }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: '0 0 5px', fontFamily: 'Plus Jakarta Sans' }}>Reset Password</h3>
            <p style={{ fontSize: 11, color: C.textS, margin: '0 0 14px' }}>Enter your email to receive a recovery link.</p>
            <input defaultValue={authEmail} type="email" placeholder="your@email.com" style={{ width: '100%', height: 40, background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 8, color: '#fff', padding: '0 10px', fontSize: 12, marginBottom: 12 }} />
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => setForgotOpen(false)} style={{ flex: 1, height: 38, background: C.bgCard2, border: 'none', color: C.textS, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => { setForgotOpen(false); showToast('Reset link sent to inbox!'); }} style={{ flex: 1, height: 38, background: C.primary, border: 'none', color: '#fff', borderRadius: 8, fontSize: 11, fontWeight: 800, cursor: 'pointer' }}>Send Link</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── 04 DASHBOARD ── */
  const riskColor = safetyScore >= 75 ? C.safe : safetyScore >= 50 ? C.warning : C.danger;
  const riskLabel = safetyScore >= 75 ? 'LOW RISK' : safetyScore >= 50 ? 'CAUTION' : 'HIGH RISK';

  const renderDashboard = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      {/* Header */}
      <div style={{ padding: '8px 14px 4px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 5, height: 5, borderRadius: 3, background: C.safe, animation: 'neonPulse 1.4s infinite' }} />
            <span style={{ fontSize: 9, color: C.cyan, fontWeight: 900, letterSpacing: 0.8, fontFamily: 'JetBrains Mono' }}>
              {demoMode ? 'BENGALURU (DEMO)' : `${position?.lat?.toFixed(4) ?? '—'}, ${position?.lng?.toFixed(4) ?? '—'}`}
            </span>
          </div>
          <h3 style={{ fontSize: 18, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: '1px 0 0' }}>
            Hi, {authName.split(' ')[0]} 👋
          </h3>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button onClick={() => { setDemoMode(p => !p); showToast(demoMode ? '📡 Live GPS Mode active!' : '🎭 Demo Mode (Bengaluru)'); }} style={{
            background: demoMode ? C.warningDim : C.safeDim,
            border: `1px solid ${demoMode ? C.warning : C.safe}`,
            color: demoMode ? C.warning : C.safe,
            borderRadius: 8, padding: '2px 7px', fontSize: 9, fontWeight: 900,
            cursor: 'pointer', letterSpacing: 0.3,
          }}>
            {demoMode ? '🎭 DEMO' : '📡 LIVE'}
          </button>
          <div onClick={() => nav('12-profile')} style={{
            width: 34, height: 34, borderRadius: 11,
            background: 'linear-gradient(135deg, #6366F1, #3B82F6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 12, fontWeight: 900, color: '#fff', cursor: 'pointer',
            boxShadow: `0 4px 14px ${C.primaryGlow}`, border: '1px solid rgba(255,255,255,0.2)',
          }}>
            {authName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
        </div>
      </div>

      {/* Safety Score Banner */}
      <div style={{ padding: '0 12px 6px' }}>
        <div style={{
          background: C.bgCard, border: `1.5px solid ${riskColor}`,
          borderRadius: 16, padding: '10px 12px',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          boxShadow: `0 8px 24px ${riskColor}22`,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 3 }}>
              <div style={{ width: 5, height: 5, borderRadius: 3, background: riskColor, animation: 'neonPulse 1.2s infinite' }} />
              <span style={{ fontSize: 9, fontWeight: 900, color: C.textS, letterSpacing: 0.7 }}>AREA TELEMETRY {poiLoading ? '· updating…' : `· ${pois.length} POIs`}</span>
            </div>
            <div style={{ fontSize: 17, fontWeight: 900, color: riskColor, fontFamily: 'Plus Jakarta Sans', lineHeight: 1 }}>
              {safetyScore}% · {riskLabel}
            </div>
            <div style={{ fontSize: 10, color: C.textS, marginTop: 3 }}>
              {pois.length > 0
                ? `${pois[0].name} is ${formatDistance(pois[0].distance)} away`
                : 'Illuminated corridors · Active patrols nearby'}
            </div>
          </div>
          <ScoreRing score={safetyScore} size={72} strokeWidth={7} />
        </div>
      </div>

      {/* Live Map */}
      <div style={{ flex: 1, margin: '0 12px', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.borderL}`, minHeight: 130, position: 'relative' }}>
        {position && (
          <MapContainer key={`dash-map-${demoMode}-${position.lat}`} center={[position.lat, position.lng]} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
            <DarkTileLayer />
            <MapBoundsFitter origin={position} destination={destCoord} />
            <MapClickHandler onMapClick={handleMapClickSetDest} />
            {position.accuracy && <Circle center={[position.lat, position.lng]} radius={position.accuracy} pathOptions={{ color: C.cyan, fillColor: C.cyan, fillOpacity: 0.06, weight: 1.5, opacity: 0.6 }} />}
            <Marker position={[position.lat, position.lng]} icon={makeGpsIcon(C.cyan)} />
            {destCoord && <Marker position={[destCoord.lat, destCoord.lng]} icon={makeDestIcon(dest)} />}
            {/* Live POIs */}
            {pois.slice(0, 6).map(poi => {
              const cfg = POI_CONFIG[poi.amenity];
              return cfg ? <Marker key={poi.id} position={[poi.lat, poi.lng]} icon={makePoiIcon(cfg.color, poi.name, cfg.icon)} /> : null;
            })}
          </MapContainer>
        )}
        {/* Overlays */}
        <div style={{ position: 'absolute', bottom: 6, left: 8, zIndex: 1000, background: 'rgba(6,8,15,0.9)', backdropFilter: 'blur(8px)', padding: '2px 8px', borderRadius: 7, fontSize: 9, display: 'flex', alignItems: 'center', gap: 5, border: `1px solid ${C.border}` }}>
          <div style={{ width: 5, height: 5, borderRadius: 3, background: C.safe }} />
          <span style={{ color: C.text, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
            {demoMode ? `DEMO GPS · Step ${demoIndex + 1}/${demoPathLength}` : `LIVE GPS ±${Math.round(position?.accuracy ?? 0)}m`}
          </span>
        </div>
        <button onClick={() => nav('10-community-map')} style={{ position: 'absolute', top: 6, right: 6, zIndex: 1000, background: 'rgba(6,8,15,0.9)', border: `1px solid ${C.borderL}`, color: C.cyan, borderRadius: 7, padding: '3px 8px', fontSize: 9, cursor: 'pointer', fontWeight: 900, display: 'flex', alignItems: 'center', gap: 3 }}>
          <RadioTower size={11} /> Radar
        </button>
      </div>

      {/* Quick Actions */}
      <div style={{ padding: '6px 12px 4px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
          {[
            { icon: Compass,      label: 'Navigate',  sub: 'Plan Route',   color: C.primary, to: '05-navigate' },
            { icon: AlertOctagon, label: 'SOS Alert', sub: 'Instant 112', color: C.danger,  to: '07-sos-trigger', danger: true },
            { icon: ShieldAlert,  label: 'Report',    sub: 'Add Hazard',  color: C.warning, to: '09-hazard-report' },
          ].map((a, i) => (
            <button key={i} onClick={() => { setActiveTab(i === 0 ? 'navigate' : i === 1 ? 'sos' : 'report'); nav(a.to); }} style={{
              background: C.bgCard2, border: `1px solid ${a.danger ? C.dangerDim : C.border}`,
              borderRadius: 12, padding: '8px 6px', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, cursor: 'pointer',
            }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: a.color + '1A', display: 'flex', alignItems: 'center', justifyContent: 'center', color: a.color }}>
                {React.createElement(a.icon, { size: 15 })}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 11, fontWeight: 800, color: a.danger ? C.danger : '#fff', fontFamily: 'Plus Jakarta Sans' }}>{a.label}</div>
                <div style={{ fontSize: 8, color: C.textM, marginTop: 1 }}>{a.sub}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Frequent route banner */}
      <div style={{ padding: '0 12px 6px' }}>
        <div onClick={() => nav('05-navigate')} style={{
          background: C.bgCard2, borderRadius: 12, padding: '8px 10px', border: `1px solid ${C.border}`,
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, maxWidth: '75%' }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: C.safeDim, color: C.safe, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Route size={14} />
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                Target: {dest}
              </div>
              <div style={{ fontSize: 9, color: C.textS }}>
                {safeRoute ? `${formatDistance(safeRoute.distance)} · ${safeRoute.duration} min` : 'Tap to customize or search any location'}
              </div>
            </div>
          </div>
          <Badge color={C.safe}>ROUTE</Badge>
        </div>
      </div>

      <BottomNav />
    </div>
  );

  /* ── 05 ROUTE PLANNER ── */
  const renderRoutePlanner = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      <Header title="Route Intelligence" right={
        routeLoading && <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${C.primary}`, borderTopColor: 'transparent', animation: 'spinSlow 0.8s linear infinite' }} />
      } />

      {/* Search inputs with elevated z-index above map */}
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6, position: 'relative', zIndex: 5000 }}>
        {/* Origin */}
        <div style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 10, height: 38, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7 }}>
          <LocateFixed size={13} color={C.safe} />
          <input value={origin} onChange={e => setOrigin(e.target.value)} placeholder="Your GPS location…"
            style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, width: '100%', fontWeight: 700 }} />
          <span style={{ fontSize: 9, color: C.safe, fontWeight: 900, fontFamily: 'JetBrains Mono' }}>GPS</span>
        </div>

        {/* Destination with Real OSM Search */}
        <div style={{ position: 'relative', zIndex: 5100 }}>
          <div style={{ background: C.bgCard2, border: `1px solid ${showSugg ? C.cyan : C.borderNeon}`, borderRadius: 10, height: 40, display: 'flex', alignItems: 'center', padding: '0 10px', gap: 7, position: 'relative', zIndex: 5200 }}>
            <MapPin size={13} color={C.primary} />
            <input
              value={dest}
              onChange={e => handleDestInputChange(e.target.value)}
              onFocus={() => { if (searchResults.length) setShowSugg(true); }}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  if (searchResults.length > 0) {
                    handleSelectPlace(searchResults[0]);
                  } else if (dest.trim()) {
                    searchPlaces(dest, position);
                  }
                }
              }}
              placeholder="Search ANY place, city, landmark, or campus…"
              style={{ background: 'none', border: 'none', color: '#fff', fontSize: 11, width: '100%', fontWeight: 700 }}
            />
            {searchSearching ? (
              <Loader2 size={13} color={C.cyan} style={{ animation: 'spinSlow 0.8s linear infinite' }} />
            ) : (
              <button onClick={() => { if (dest.trim()) searchPlaces(dest, position); }} style={{ background: 'none', border: 'none', color: C.cyan, cursor: 'pointer', padding: 0 }}>
                <Search size={13} />
              </button>
            )}
          </div>

          {/* Transparent Backdrop to dismiss dropdown on click outside */}
          {showSugg && searchResults.length > 0 && (
            <div
              onClick={() => setShowSugg(false)}
              style={{
                position: 'fixed', inset: 0, zIndex: 5250, background: 'transparent'
              }}
            />
          )}

          {/* Real Live Place Autocomplete Dropdown floating OVER map */}
          {showSugg && searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: 46, left: 0, right: 0, zIndex: 5300,
              background: 'rgba(13,19,34,0.98)', backdropFilter: 'blur(24px)',
              border: `1.5px solid ${C.cyan}`, borderRadius: 12, padding: 5,
              boxShadow: `0 18px 45px rgba(0,0,0,0.98), 0 0 25px ${C.cyanGlow}`,
              maxHeight: 220, overflowY: 'auto',
            }}>
              <div style={{ padding: '4px 8px', fontSize: 9, fontWeight: 900, color: C.cyan, letterSpacing: 0.5, borderBottom: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>GLOBAL SEARCH RESULTS</span>
                <span onClick={() => setShowSugg(false)} style={{ cursor: 'pointer', fontSize: 10, color: C.textS }}>✕ close</span>
              </div>
              {searchResults.map((place) => (
                <div
                  key={place.id}
                  onClick={() => handleSelectPlace(place)}
                  style={{
                    padding: '8px 10px', borderRadius: 8, cursor: 'pointer',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    borderBottom: `1px solid rgba(255,255,255,0.04)`,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  <div style={{ maxWidth: '80%' }}>
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {place.title}
                    </div>
                    <div style={{ fontSize: 9, color: C.textS, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {place.sub}
                    </div>
                  </div>
                  <Badge color={C.cyan}>SELECT</Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Action bar: Map tap hint + Calculate button */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => {
            if (!position) { showToast('GPS acquiring…', 'err'); return; }
            fetchRoute(position, destCoord);
            showToast('Recalculating real OSRM path…');
          }} style={{
            flex: 1, height: 34, borderRadius: 9, border: `1px solid ${C.borderNeon}`, cursor: 'pointer',
            background: C.primaryDim, color: C.primary, fontSize: 11, fontWeight: 800,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
          }}>
            <Crosshair size={13} /> {routeLoading ? 'Routing…' : 'Calculate OSRM Route'}
          </button>
          <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', borderRadius: 9, padding: '0 8px', border: `1px solid ${C.border}`, fontSize: 9, color: C.textM, gap: 4 }}>
            <MousePointerClick size={11} color={C.cyan} /> Tap map to pin
          </div>
        </div>
      </div>

      {/* Map with Interactive Pinning & Dual Route Rendering */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }}>
        {position && (
          <MapContainer
            key={`route-map-${position.lat}-${destCoord.lat}-${screen}`}
            center={[position.lat, position.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <DarkTileLayer />
            <MapBoundsFitter
              origin={position}
              destination={destCoord}
              routeCoords={safeRoute ? safeRoute.coordinates : null}
              altCoords={fastRoute ? fastRoute.coordinates : null}
            />
            <MapClickHandler onMapClick={handleMapClickSetDest} />
            
            {/* 1. Safe Route (Avenue / Lit Corridor) */}
            {safeRoute && (
              <Polyline
                positions={safeRoute.coordinates}
                pathOptions={{
                  color: C.safe,
                  weight: selectedRoute === 'safe' ? 7 : 4,
                  opacity: selectedRoute === 'safe' ? 1.0 : 0.60,
                  dashArray: selectedRoute === 'safe' ? null : '6 6',
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
            
            {/* 2. Shortest / Direct Shortcut Path (Unlit / High Risk) */}
            {fastRoute && (
              <Polyline
                positions={fastRoute.coordinates}
                pathOptions={{
                  color: C.danger,
                  weight: selectedRoute === 'fast' ? 7 : 4,
                  opacity: selectedRoute === 'fast' ? 1.0 : 0.60,
                  dashArray: selectedRoute === 'fast' ? null : '6 6',
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
            
            <Marker position={[position.lat, position.lng]} icon={makeGpsIcon(C.cyan)} />
            {destCoord && <Marker position={[destCoord.lat, destCoord.lng]} icon={makeDestIcon(dest)} />}
          </MapContainer>
        )}

        {routeLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(6,8,15,0.65)', backdropFilter: 'blur(4px)', zIndex: 900 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: '50%', border: `3px solid ${C.primary}`, borderTopColor: 'transparent', animation: 'spinSlow 0.7s linear infinite' }} />
              <span style={{ fontSize: 11, color: C.cyan, fontWeight: 800, fontFamily: 'JetBrains Mono' }}>Computing Global Route…</span>
            </div>
          </div>
        )}
      </div>

      {/* Route selection cards */}
      <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 5 }}>
        {[
          { key: 'safe', route: safeRoute, label: 'SafeRoute AI', icon: ShieldCheck, color: C.safe, fallbackScore: 94 },
          { key: 'fast', route: fastRoute, label: 'Shortest Direct Path', icon: AlertTriangle, color: C.danger, fallbackScore: 38 },
        ].map(r => {
          const active = selectedRoute === r.key;
          const distStr = r.route ? formatDistance(r.route.distance) : '—';
          const timeStr = r.route ? `${r.route.duration}` : '—';
          const score = r.route ? r.route.safetyScore : r.fallbackScore;
          return (
            <div key={r.key} onClick={() => setSelectedRoute(r.key)} style={{
              background: C.bgCard2, border: `1.5px solid ${active ? r.color : C.border}`,
              borderRadius: 10, padding: '8px 10px', cursor: 'pointer',
              boxShadow: active ? `0 4px 16px ${r.color}22` : 'none',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                  {React.createElement(r.icon, { size: 13, color: r.color })}
                  <span style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>{r.label}</span>
                  <Badge color={r.color}>{score}% SAFE</Badge>
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>{timeStr}<span style={{ fontSize: 9, color: C.textS }}> min</span></span>
              </div>
              <div style={{ fontSize: 9, color: r.key === 'fast' ? C.danger : C.textS }}>
                {r.key === 'safe' ? `💡 Well-lit corridors · Guarded nodes · CCTV monitored` : `⚠️ Direct shortcuts · Reduced lighting · High risk`}
                <span style={{ marginLeft: 8, color: C.textM, fontWeight: 700 }}>{distStr}</span>
              </div>
            </div>
          );
        })}

        <button onClick={() => {
          setNavStepIdx(0);
          nav('06-active-nav');
          showToast('Live navigation started!');
        }} style={{
          height: 42, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: selectedRoute === 'safe' ? 'linear-gradient(135deg, #00E599, #059669)' : 'linear-gradient(135deg, #FF2E63, #C8004E)',
          color: '#000', fontSize: 13, fontWeight: 900, fontFamily: 'Plus Jakarta Sans',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          boxShadow: selectedRoute === 'safe' ? `0 6px 20px ${C.safeGlow}` : `0 6px 20px ${C.dangerGlow}`,
        }}>
          <Navigation size={15} />
          {selectedRoute === 'safe' ? 'Start Safe Navigation' : '⚠ Proceed via Direct Path'}
        </button>
      </div>

      <BottomNav />
    </div>
  );

  /* ── 06 ACTIVE NAV ── */
  const currentRoute = selectedRoute === 'safe' ? safeRoute : fastRoute;
  const activeStep = currentRoute?.steps?.[navStepIdx];

  const renderActiveNav = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      {/* Map full */}
      <div style={{ flex: 1, position: 'relative' }}>
        {position && (
          <MapContainer
            key={`nav-map-${position.lat}-${destCoord.lat}-${screen}`}
            center={[position.lat, position.lng]}
            zoom={16}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <DarkTileLayer />
            <MapBoundsFitter
              origin={position}
              destination={destCoord}
              routeCoords={currentRoute ? currentRoute.coordinates : null}
            />
            {currentRoute && (
              <Polyline
                positions={currentRoute.coordinates}
                pathOptions={{
                  color: selectedRoute === 'safe' ? C.safe : C.danger,
                  weight: 7,
                  lineCap: 'round',
                  lineJoin: 'round',
                }}
              />
            )}
            <Marker position={[position.lat, position.lng]} icon={makeGpsIcon(C.cyan)} />
            {destCoord && <Marker position={[destCoord.lat, destCoord.lng]} icon={makeDestIcon(dest)} />}
          </MapContainer>
        )}

        {/* Top HUD card */}
        <div style={{ position: 'absolute', top: 8, left: 10, right: 10, zIndex: 1000 }}>
          <div style={{
            background: 'rgba(8,12,22,0.95)', backdropFilter: 'blur(14px)',
            border: `1px solid ${C.borderL}`, borderRadius: 14, padding: '10px 12px',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            boxShadow: '0 8px 28px rgba(0,0,0,0.9)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: C.cyanDim, color: C.cyan, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Navigation size={18} style={{ transform: 'rotate(45deg)' }} />
              </div>
              <div>
                <div style={{ fontSize: 9, color: C.cyan, fontWeight: 900, letterSpacing: 0.5, fontFamily: 'JetBrains Mono' }}>
                  {activeStep?.distance ? `IN ${formatDistance(activeStep.distance)}` : 'NAVIGATING'}
                </div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', maxWidth: 180 }}>
                  {activeStep?.instruction || 'Following route to destination…'}
                </div>
              </div>
            </div>
            <button onClick={() => setNavMuted(m => !m)} style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${C.border}`, borderRadius: 7, padding: 6, color: navMuted ? C.danger : C.safe, cursor: 'pointer' }}>
              {navMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
            </button>
          </div>
        </div>

        {/* Step indicator */}
        <div style={{ position: 'absolute', bottom: 60, left: 10, right: 10, zIndex: 1000, background: 'rgba(6,8,15,0.85)', backdropFilter: 'blur(8px)', borderRadius: 8, padding: '4px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${C.border}` }}>
          <span style={{ color: C.safe, fontSize: 9, fontWeight: 700, fontFamily: 'JetBrains Mono' }}>
            ● Step {navStepIdx + 1}/{currentRoute?.steps?.length || 1} · {demoMode ? 'DEMO GPS' : 'LIVE GPS'}
          </span>
          <button onClick={() => setNavStepIdx(p => (p + 1) % (currentRoute?.steps?.length || 1))} style={{ background: 'none', border: 'none', color: C.cyan, fontSize: 9, fontWeight: 800, cursor: 'pointer' }}>
            Advance ⏭
          </button>
        </div>
      </div>

      {/* Telemetry sheet */}
      <div style={{ background: C.bgSolid, padding: '10px 12px', borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', gap: 5 }}>
          <MetricTile label="Remaining" value={formatDistance((currentRoute?.distance || 1000) * (1 - navStepIdx / Math.max(1, (currentRoute?.steps?.length || 1))))} unit="" border={C.border} />
          <MetricTile label="ETA" value={Math.max(1, Math.round((currentRoute?.duration || 10) * (1 - navStepIdx / Math.max(1, (currentRoute?.steps?.length || 1)))))} unit=" min" border={C.border} />
          <MetricTile label="Safety" value={currentRoute?.safetyScore ?? 94} unit="%" color={selectedRoute === 'safe' ? C.safe : C.danger} border={selectedRoute === 'safe' ? C.safe : C.danger} />
        </div>

        <div style={{ display: 'flex', gap: 5 }}>
          <button onClick={shareLocation} style={{ flex: 1, height: 36, borderRadius: 8, background: C.bgCard2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Share2 size={12} color={C.cyan} /> Share GPS
          </button>
          <button onClick={() => { nav('07-sos-trigger'); setActiveTab('sos'); }} style={{ flex: 1, height: 36, borderRadius: 8, background: C.dangerDim, border: `1px solid ${C.danger}`, color: C.danger, fontSize: 11, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <AlertOctagon size={13} /> Instant SOS
          </button>
        </div>

        <button onClick={() => nav('11-summary')} style={{ height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.border}`, color: C.textS, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>
          Arrived · Complete Trip
        </button>
      </div>
    </div>
  );

  /* ── 07 SOS TRIGGER ── */
  const renderSosTrigger = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between', padding: '0 14px 22px' }}>
      <div style={{ background: C.dangerDim, margin: '0 -14px', padding: '8px 14px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, borderBottom: `1px solid ${C.danger}` }}>
        <div style={{ width: 6, height: 6, borderRadius: 3, background: C.danger, animation: 'neonPulse 0.8s infinite' }} />
        <span style={{ fontSize: 11, fontWeight: 900, color: C.danger, letterSpacing: 1 }}>EMERGENCY MODE ACTIVATED</span>
      </div>

      <div style={{ textAlign: 'center', paddingTop: 10 }}>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: 0 }}>Emergency SOS</h2>
        <p style={{ fontSize: 11, color: C.textS, marginTop: 4 }}>Broadcasting live GPS to guardians & police in:</p>
      </div>

      {/* Concentric shockwaves */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 190, position: 'relative' }}>
        <div style={{ position: 'absolute', width: 186, height: 186, borderRadius: '50%', background: C.dangerDim, animation: 'sosShockwave 1.5s ease-out infinite' }} />
        <div style={{ position: 'absolute', width: 148, height: 148, borderRadius: '50%', background: 'rgba(255,46,99,0.22)', animation: 'sosShockwave 1.2s ease-out infinite 0.3s' }} />
        <button onClick={() => nav('08-sos-active')} style={{
          position: 'absolute', width: 108, height: 108, borderRadius: 54,
          background: 'linear-gradient(135deg, #FF2E63, #C8004E)', border: '2px solid rgba(255,255,255,0.3)',
          cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          boxShadow: `0 0 50px ${C.dangerGlow}, inset 0 1px 0 rgba(255,255,255,0.2)`,
          zIndex: 10,
        }}>
          <span style={{ fontSize: 28, fontWeight: 900, color: '#fff', lineHeight: 1, fontFamily: 'Plus Jakarta Sans' }}>SOS</span>
          <span style={{ fontSize: 8, fontWeight: 900, color: 'rgba(255,255,255,0.8)', letterSpacing: 1, marginTop: 2 }}>TAP TO SEND</span>
        </button>
      </div>

      {/* Countdown */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 74, height: 66, borderRadius: 14, background: C.bgCard2, border: `1.5px solid ${C.danger}`, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 20px ${C.dangerGlow}` }}>
          <span style={{ fontSize: 30, fontWeight: 900, color: C.danger, lineHeight: 1, fontFamily: 'JetBrains Mono' }}>{sosCountdown}</span>
          <span style={{ fontSize: 8, color: C.textM, fontWeight: 800, marginTop: 2 }}>SECONDS</span>
        </div>
      </div>

      {/* Contacts being notified */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: C.textM, letterSpacing: 0.5 }}>DISPATCHING TO:</span>
        {contacts.slice(0, 2).map(c => (
          <div key={c.id} style={{ background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 8, padding: '5px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: '#fff' }}>{c.name}</span>
            <span style={{ fontSize: 9, color: C.safe, fontWeight: 800 }}>Ready</span>
          </div>
        ))}
      </div>

      <button onClick={() => { nav('04-dashboard'); showToast('SOS cancelled.'); }} style={{
        height: 42, borderRadius: 12, background: 'rgba(255,255,255,0.04)', border: `1px solid ${C.borderL}`,
        color: '#fff', fontSize: 12, fontWeight: 800, cursor: 'pointer',
      }}>
        ✕ Cancel Emergency
      </button>
    </div>
  );

  /* ── 08 SOS ACTIVE ── */
  const renderSosActive = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between', padding: '16px 14px 22px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
        <div style={{ width: 58, height: 58, borderRadius: 29, background: C.dangerDim, border: `2px solid ${C.danger}`, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: `0 0 30px ${C.dangerGlow}` }}>
          <AlertTriangle size={30} color={C.danger} />
        </div>
        <h1 style={{ fontSize: 20, fontWeight: 900, color: C.danger, margin: 0, fontFamily: 'Plus Jakarta Sans', letterSpacing: 1.5 }}>ALERT TRANSMITTED</h1>
        <p style={{ fontSize: 11, color: C.textS, textAlign: 'center', lineHeight: 1.4 }}>Emergency contacts notified. Police unit assigned. Tracking active.</p>
      </div>

      {/* Live broadcast */}
      <div style={{ background: C.bgCard2, borderRadius: 12, padding: '10px 12px', border: `1px solid ${C.safe}`, display: 'flex', alignItems: 'center', gap: 10, boxShadow: `0 0 16px ${C.safeGlow}22` }}>
        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.safe, animation: 'neonPulse 1s infinite' }} />
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>Live GPS Stream Active</div>
          <div style={{ fontSize: 10, color: C.safe, marginTop: 1, fontFamily: 'JetBrains Mono' }}>
            {position ? `${position.lat.toFixed(5)}, ${position.lng.toFixed(5)}` : 'Live Coordinate Stream'} · Broadcasting
          </div>
        </div>
        <div style={{ marginLeft: 'auto', fontSize: 14, fontWeight: 900, color: C.danger, fontFamily: 'JetBrains Mono' }}>
          {Math.floor(sosSeconds / 60).toString().padStart(2, '0')}:{(sosSeconds % 60).toString().padStart(2, '0')}
        </div>
      </div>

      {/* Dispatch log */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <span style={{ fontSize: 9, fontWeight: 900, color: C.textM, letterSpacing: 0.5 }}>DISPATCH STATUS LOG:</span>
        {[
          { name: 'Mom (Priya Kumar)', sub: 'SMS & WhatsApp Alert Sent', status: 'Delivered', color: C.safe,    icon: CheckCircle2 },
          { name: 'Dad (Rajesh Kumar)', sub: 'Alert Link Opened',         status: 'Confirmed', color: C.safe,    icon: CheckCircle2 },
          { name: 'Police Unit #112',   sub: 'Ticket #SR-89241 Assigned', status: 'En Route',  color: C.warning, icon: PhoneCall    },
        ].map((d, i) => (
          <div key={i} style={{ background: C.bgCard2, borderRadius: 8, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${i < 2 ? C.border : C.warning + '44'}` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              {React.createElement(d.icon, { size: 14, color: d.color })}
              <div>
                <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{d.name}</div>
                <div style={{ fontSize: 9, color: C.textS }}>{d.sub}</div>
              </div>
            </div>
            <Badge color={d.color}>{d.status}</Badge>
          </div>
        ))}
      </div>

      <button onClick={() => setPinOpen(true)} style={{ height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.05)', border: `1px solid ${C.borderL}`, color: '#fff', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}>
        I'm Safe — Deactivate Alarm
      </button>

      {pinOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
          <div style={{ background: C.bgSolid, border: `1px solid ${C.borderL}`, borderRadius: 18, padding: 18, width: '100%', textAlign: 'center' }}>
            <h3 style={{ fontSize: 16, fontWeight: 900, margin: '0 0 4px', fontFamily: 'Plus Jakarta Sans' }}>Confirm Safety</h3>
            <p style={{ fontSize: 11, color: C.textS, margin: '0 0 12px' }}>Enter 4-digit PIN to deactivate (Default: 1234)</p>
            <input type="password" maxLength={4} value={pin} onChange={e => setPin(e.target.value)} placeholder="••••" style={{
              width: 110, height: 44, background: C.bgCard2, border: `1.5px solid ${pinErr ? C.danger : C.primary}`,
              borderRadius: 10, color: '#fff', fontSize: 22, textAlign: 'center', letterSpacing: 6, marginBottom: 12,
              fontFamily: 'JetBrains Mono',
            }} />
            {pinErr && <div style={{ color: C.danger, fontSize: 10, marginBottom: 8 }}>Invalid PIN. Try: 1234</div>}
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setPinOpen(false); setPin(''); setPinErr(false); }} style={{ flex: 1, height: 38, background: C.bgCard2, border: 'none', color: C.textS, borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Back</button>
              <button onClick={() => {
                if (pin.length >= 4) {
                  setPinOpen(false); setPin(''); setPinErr(false);
                  showToast('SOS deactivated. Safe status broadcast.');
                  nav('04-dashboard');
                } else { setPinErr(true); }
              }} style={{ flex: 1, height: 38, background: C.safe, border: 'none', color: '#000', borderRadius: 8, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
                Confirm Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  /* ── 09 HAZARD REPORT ── */
  const renderHazardReport = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      <Header title="Report Street Hazard" />
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 9, overflowY: 'auto' }}>
        <input type="file" ref={fileInputRef} accept="image/*" capture="environment" onChange={handleFileChange} style={{ display: 'none' }} />
        <button onClick={capturePhoto} style={{
          height: 90, borderRadius: 14, background: repImg ? `url(${repImg}) center/cover no-repeat` : C.bgCard2,
          border: `1.5px dashed ${repImg ? C.safe : C.borderL}`, cursor: 'pointer',
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4,
          position: 'relative', overflow: 'hidden',
        }}>
          {!repImg && <><Camera size={18} color={C.textS} /><span style={{ fontSize: 10, color: C.textS, fontWeight: 700 }}>Tap to capture evidence photo</span></>}
          {repImg && <div style={{ position: 'absolute', bottom: 6, right: 8, background: C.safeGlow, color: C.safe, fontSize: 9, fontWeight: 900, padding: '2px 7px', borderRadius: 6 }}>✓ Photo attached</div>}
        </button>

        {/* GPS tag */}
        <div style={{ background: C.bgCard2, borderRadius: 9, padding: '7px 10px', borderLeft: `3px solid ${C.safe}`, display: 'flex', alignItems: 'center', gap: 8 }}>
          <LocateFixed size={14} color={C.safe} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>
              {demoMode ? 'Cubbon Park, South Gate, Bangalore' : `${position?.lat?.toFixed(5) ?? '—'}, ${position?.lng?.toFixed(5) ?? '—'}`}
            </div>
            <div style={{ fontSize: 9, color: C.textS, fontFamily: 'JetBrains Mono' }}>
              {`GPS ±${Math.round(position?.accuracy ?? 10)}m · Auto-tagged`}
            </div>
          </div>
        </div>

        {/* Category */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 900, color: C.textM, display: 'block', marginBottom: 4, letterSpacing: 0.5 }}>HAZARD CATEGORY</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 4 }}>
            {['Poor Lighting', 'Suspicious Group', 'Broken Road', 'Flooding', 'Deserted Alley', 'Other'].map(t => (
              <button key={t} onClick={() => setRepType(t)} style={{
                padding: '5px 3px', borderRadius: 7, fontSize: 9, fontWeight: repType === t ? 900 : 600, cursor: 'pointer',
                background: repType === t ? C.primaryDim : C.bgCard2,
                border: `1px solid ${repType === t ? C.primary : C.border}`,
                color: repType === t ? C.cyan : C.textS,
              }}>{t}</button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 900, color: C.textM, display: 'block', marginBottom: 3, letterSpacing: 0.5 }}>DETAILS</label>
          <textarea value={repDesc} onChange={e => setRepDesc(e.target.value)} placeholder="Describe the hazard (e.g. 3 street lamps broken)…" style={{
            width: '100%', height: 50, background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 9,
            color: '#fff', fontSize: 11, padding: '7px 10px', resize: 'none', fontFamily: 'Inter',
          }} />
        </div>

        {/* Severity */}
        <div>
          <label style={{ fontSize: 9, fontWeight: 900, color: C.textM, display: 'block', marginBottom: 3, letterSpacing: 0.5 }}>SEVERITY LEVEL</label>
          <div style={{ display: 'flex', gap: 5 }}>
            {[['Low', C.safe], ['Medium', C.warning], ['High', C.danger]].map(([s, col]) => (
              <button key={s} onClick={() => setRepSev(s)} style={{
                flex: 1, padding: '5px', borderRadius: 7, fontSize: 10, fontWeight: 800, cursor: 'pointer',
                background: repSev === s ? col + '1A' : C.bgCard2, border: `1px solid ${repSev === s ? col : C.border}`, color: repSev === s ? col : C.textS,
              }}>{s}</button>
            ))}
          </div>
        </div>

        {/* Anonymous */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 11, color: C.textS, fontWeight: 600 }}>Post Anonymously</span>
          <Toggle on={repAnon} onToggle={() => setRepAnon(p => !p)} />
        </div>

        {/* Submit */}
        <button onClick={() => {
          const newH = {
            id: Date.now(), pos: [
              (position?.lat ?? 31.253) + (Math.random() - 0.5) * 0.006,
              (position?.lng ?? 75.703) + (Math.random() - 0.5) * 0.006,
            ],
            label: repType, type: repType, severity: repSev.toLowerCase(),
            desc: repDesc || 'Community hazard report', upvotes: 1, time: 'Just now',
          };
          setHazards(h => [newH, ...h]);
          setRepDesc(''); setRepImg(null);
          showToast('Hazard published to Community Radar!');
          nav('10-community-map');
        }} style={{
          height: 40, borderRadius: 10, border: 'none', cursor: 'pointer',
          background: 'linear-gradient(135deg, #FFB800, #D97706)',
          color: '#000', fontSize: 12, fontWeight: 900, fontFamily: 'Plus Jakarta Sans',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        }}>
          <Send size={13} /> Broadcast Report
        </button>
      </div>
      <BottomNav />
    </div>
  );

  /* ── 10 COMMUNITY MAP ── */
  const renderCommunityMap = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      <Header title="Community Safety Radar" />

      {/* Filter chips */}
      <div style={{ padding: '5px 12px', display: 'flex', gap: 5, overflowX: 'auto', flexShrink: 0 }}>
        {['All', 'Lighting', 'Suspicious', 'Road', 'Safe Havens'].map(f => (
          <button key={f} onClick={() => setMapFilter(f)} style={{
            background: mapFilter === f ? C.primary : C.bgCard2, border: `1px solid ${mapFilter === f ? C.borderNeon : C.border}`,
            color: mapFilter === f ? '#fff' : C.textS, padding: '4px 10px', borderRadius: 7,
            fontSize: 9, fontWeight: mapFilter === f ? 900 : 600, whiteSpace: 'nowrap', cursor: 'pointer',
          }}>{f}</button>
        ))}
      </div>

      {/* Map */}
      <div style={{ flex: 1, position: 'relative' }}>
        {position && (
          <MapContainer
            key={`community-map-${position.lat}-${screen}`}
            center={[position.lat, position.lng]}
            zoom={14}
            style={{ height: '100%', width: '100%' }}
            zoomControl={false}
            attributionControl={false}
          >
            <DarkTileLayer />
            <MapBoundsFitter origin={position} />
            <MapClickHandler onMapClick={handleMapClickSetDest} />
            <Marker position={[position.lat, position.lng]} icon={makeGpsIcon(C.cyan)} />

            {hazards.filter(h => mapFilter === 'All' || h.type.toLowerCase().includes(mapFilter.toLowerCase())).map(h => (
              <Marker key={h.id} position={h.pos} icon={makeHazardIcon(h.severity)} eventHandlers={{ click: () => setSelHazard(h) }} />
            ))}

            {(mapFilter === 'All' || mapFilter === 'Safe Havens') && pois.map(p => {
              const cfg = POI_CONFIG[p.amenity];
              return cfg ? (
                <Marker key={`ov-${p.id}`} position={[p.lat, p.lng]} icon={makePoiIcon(cfg.color, p.name, cfg.icon)} eventHandlers={{ click: () => showToast(`${p.name} (${formatDistance(p.distance)} away)`) }} />
              ) : null;
            })}
          </MapContainer>
        )}

        {/* FAB */}
        <button onClick={() => nav('09-hazard-report')} style={{
          position: 'absolute', bottom: 60, right: 10, zIndex: 1000,
          background: 'linear-gradient(135deg, #FFB800, #D97706)', color: '#000', border: 'none', borderRadius: 18,
          padding: '7px 13px', fontSize: 10, fontWeight: 900, cursor: 'pointer',
          boxShadow: `0 6px 20px ${C.warningGlow}`, display: 'flex', alignItems: 'center', gap: 4,
        }}>
          <Plus size={13} /> Report Hazard
        </button>

        {/* Map legend */}
        <div style={{ position: 'absolute', bottom: 8, left: 10, zIndex: 1000, background: 'rgba(6,8,15,0.9)', backdropFilter: 'blur(8px)', borderRadius: 9, padding: '5px 10px', display: 'flex', gap: 10, border: `1px solid ${C.border}` }}>
          {[[C.safe, 'Safe Zone'], [C.warning, 'Caution'], [C.danger, 'High Risk']].map(([c, l]) => (
            <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 5, height: 5, borderRadius: 3, background: c }} />
              <span style={{ fontSize: 8, color: C.textS, fontWeight: 700 }}>{l}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hazard detail drawer */}
      {selHazard && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(5px)', zIndex: 2000, display: 'flex', alignItems: 'flex-end' }}>
          <div style={{ background: C.bgSolid, borderTop: `1px solid ${C.borderL}`, borderRadius: '18px 18px 0 0', padding: 14, width: '100%', display: 'flex', flexDirection: 'column', gap: 9, animation: 'slideUp 0.22s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                <Badge color={selHazard.severity === 'high' ? C.danger : C.warning}>{selHazard.type}</Badge>
                <span style={{ fontSize: 9, color: C.textM }}>{selHazard.time}</span>
              </div>
              <button onClick={() => setSelHazard(null)} style={{ background: 'none', border: 'none', color: C.textS, cursor: 'pointer', fontSize: 14 }}>✕</button>
            </div>
            <h3 style={{ fontSize: 15, fontWeight: 900, margin: 0, fontFamily: 'Plus Jakarta Sans' }}>{selHazard.label}</h3>
            <p style={{ fontSize: 11, color: C.textS, margin: 0, lineHeight: 1.45 }}>{selHazard.desc}</p>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setHazards(h => h.map(x => x.id === selHazard.id ? { ...x, upvotes: x.upvotes + 1 } : x)); setSelHazard(s => ({ ...s, upvotes: s.upvotes + 1 })); showToast('Verified!'); }} style={{ flex: 1, height: 36, borderRadius: 8, background: C.bgCard2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>
                👍 Verify ({selHazard.upvotes})
              </button>
              <button onClick={() => { setHazards(h => h.filter(x => x.id !== selHazard.id)); setSelHazard(null); showToast('Marked resolved!'); }} style={{ flex: 1, height: 36, borderRadius: 8, background: C.safeDim, border: `1px solid ${C.safe}`, color: C.safe, fontSize: 10, fontWeight: 800, cursor: 'pointer' }}>
                ✓ Resolved
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );

  /* ── 11 TRIP SUMMARY ── */
  const renderSummary = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      <div style={{ background: C.safeDim, padding: '8px 14px', textAlign: 'center', color: C.safe, fontSize: 12, fontWeight: 900, borderBottom: `1px solid ${C.safe}`, fontFamily: 'Plus Jakarta Sans' }}>
        🎉 Destination Reached — Arrived Safely!
      </div>
      <div style={{ flex: 1, padding: '12px 12px', display: 'flex', flexDirection: 'column', gap: 11, overflowY: 'auto' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: 17, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: '0 0 2px' }}>Trip Safety Analytics</h2>
          <span style={{ fontSize: 10, color: C.textS }}>Route to {dest}</span>
        </div>

        {/* Score ring */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <ScoreRing score={96} size={110} strokeWidth={9} />
            <Badge color={C.safe}>EXCELLENT ROUTE</Badge>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
          <MetricTile label="Distance" value={currentRoute ? formatDistance(currentRoute.distance) : '2.9 km'} unit="" />
          <MetricTile label="Duration" value={currentRoute ? currentRoute.duration : '35'} unit=" min" />
          <MetricTile label="Well-Lit Path" value="98" unit="%" color={C.safe} border={C.safe} />
          <MetricTile label="Incidents" value="0" unit="" color={C.cyan} />
        </div>

        {/* Rating */}
        <div style={{ background: C.bgCard2, borderRadius: 12, padding: '10px 12px', border: `1px solid ${C.border}`, textAlign: 'center' }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: '#fff', marginBottom: 6, fontFamily: 'Plus Jakarta Sans' }}>Rate This Route</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 7 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={20} color={s <= stars ? C.warning : C.textM} fill={s <= stars ? C.warning : 'transparent'} onClick={() => { setStars(s); showToast(`Rated ${s} stars! Thanks 🙏`); }} style={{ cursor: 'pointer' }} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={shareLocation} style={{ flex: 1, height: 40, borderRadius: 9, background: C.bgCard2, border: `1px solid ${C.border}`, color: '#fff', fontSize: 11, fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
            <Share2 size={13} color={C.cyan} /> Share Report
          </button>
          <button onClick={() => { nav('04-dashboard'); setActiveTab('home'); }} style={{ flex: 1, height: 40, borderRadius: 9, background: C.primary, border: 'none', color: '#fff', fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans' }}>
            Home
          </button>
        </div>
      </div>
      <BottomNav />
    </div>
  );

  /* ── 12 PROFILE ── */
  const renderProfile = () => (
    <div className="screen-anim" style={{ justifyContent: 'space-between' }}>
      <Header title="Profile & Settings" />
      <div style={{ flex: 1, padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: 11, overflowY: 'auto' }}>
        {/* User card */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
          <div style={{ width: 58, height: 58, borderRadius: 29, background: 'linear-gradient(135deg, #6366F1, #3B82F6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 900, color: '#fff', boxShadow: `0 8px 22px ${C.primaryGlow}`, border: '2px solid rgba(255,255,255,0.18)' }}>
            {authName.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: 15, fontWeight: 900, color: '#fff', fontFamily: 'Plus Jakarta Sans', margin: 0 }}>{authName}</h3>
            <span style={{ fontSize: 10, color: C.textS, fontFamily: 'JetBrains Mono' }}>{authEmail}</span>
          </div>
          <Badge color={C.safe}>✓ Verified Guardian</Badge>
        </div>

        {/* Mode toggle */}
        <div style={{ background: C.bgCard2, borderRadius: 12, padding: '10px 12px', border: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#fff', fontFamily: 'Plus Jakarta Sans' }}>GPS Tracking Mode</div>
            <div style={{ fontSize: 9, color: C.textS }}>{demoMode ? '🎭 Demo Mode (Bengaluru simulation)' : '📡 Live GPS Mode (Your real device location)'}</div>
          </div>
          <Toggle on={!demoMode} onToggle={() => { setDemoMode(p => !p); showToast(demoMode ? '📡 Live GPS active!' : '🎭 Demo Mode active!'); }} color={C.cyan} />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5 }}>
          {[['47', 'Trips', C.cyan], ['96%', 'Safety', C.safe], [contacts.length.toString(), 'Contacts', C.primary]].map(([v, l, c]) => (
            <div key={l} style={{ background: C.bgCard2, borderRadius: 9, padding: '8px 5px', textAlign: 'center', border: `1px solid ${C.border}` }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: c, fontFamily: 'Plus Jakarta Sans' }}>{v}</div>
              <div style={{ fontSize: 8, color: C.textM, marginTop: 2, fontWeight: 700 }}>{l}</div>
            </div>
          ))}
        </div>

        {/* Emergency contacts */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 5 }}>
            <span style={{ fontSize: 9, fontWeight: 900, color: C.textM, letterSpacing: 0.5 }}>GUARDIAN CONTACTS ({contacts.length})</span>
            <button onClick={() => setAddContactOpen(true)} style={{ background: 'none', border: 'none', color: C.cyan, fontSize: 9, fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 2 }}>
              <Plus size={12} /> Add
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {contacts.map(c => (
              <div key={c.id} style={{ background: C.bgCard2, borderRadius: 8, padding: '6px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${C.border}` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                  <div style={{ width: 26, height: 26, borderRadius: 13, background: C.primaryDim, color: C.primary, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 900 }}>{c.name[0]}</div>
                  <div>
                    <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{c.name}</div>
                    <div style={{ fontSize: 9, color: C.textS, fontFamily: 'JetBrains Mono' }}>{c.phone}</div>
                  </div>
                </div>
                <button onClick={() => { setContacts(p => p.filter(x => x.id !== c.id)); showToast(`Removed ${c.name}`); }} style={{ background: 'none', border: 'none', color: C.textM, cursor: 'pointer' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Safety automations */}
        <div>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.textM, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>SAFETY AUTOMATIONS</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {[
              { key: 'autoSos', label: 'Auto SOS on Fall / Impact', desc: 'Detects sudden accelerometer spike' },
              { key: 'walkWithMe', label: 'Walk With Me', desc: 'Alerts contacts if stopped >5 min' },
              { key: 'locationShare', label: 'Share GPS to Guardians', desc: 'Real-time coordinate relay' },
            ].map(item => (
              <div key={item.key} style={{ background: C.bgCard2, borderRadius: 8, padding: '7px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: `1px solid ${C.border}` }}>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#fff' }}>{item.label}</div>
                  <div style={{ fontSize: 9, color: C.textS }}>{item.desc}</div>
                </div>
                <Toggle on={prefs[item.key]} onToggle={() => { setPrefs(p => ({ ...p, [item.key]: !p[item.key] })); showToast(`${item.label} updated`); }} />
              </div>
            ))}
          </div>
        </div>

        {/* Helplines */}
        <div>
          <span style={{ fontSize: 9, fontWeight: 900, color: C.textM, letterSpacing: 0.5, display: 'block', marginBottom: 5 }}>NATIONAL HELPLINES</span>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
            <a href="tel:112" style={{ textDecoration: 'none' }}>
              <button onClick={() => showToast('Dialing 112…')} style={{ width: '100%', background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 9, padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 6, color: '#fff', cursor: 'pointer' }}>
                <Phone size={14} color={C.danger} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, fontWeight: 900, fontFamily: 'Plus Jakarta Sans' }}>Police: 112</div>
                  <div style={{ fontSize: 8, color: C.textS }}>24/7 Helpline</div>
                </div>
              </button>
            </a>
            <a href="tel:1091" style={{ textDecoration: 'none' }}>
              <button onClick={() => showToast('Dialing 1091…')} style={{ width: '100%', background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 9, padding: '7px 8px', display: 'flex', alignItems: 'center', gap: 6, color: '#fff', cursor: 'pointer' }}>
                <Phone size={14} color={C.cyan} />
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontSize: 11, fontWeight: 900, fontFamily: 'Plus Jakarta Sans' }}>Women: 1091</div>
                  <div style={{ fontSize: 8, color: C.textS }}>Immediate Escort</div>
                </div>
              </button>
            </a>
          </div>
        </div>

        {/* Sign out */}
        <button onClick={() => { localStorage.removeItem('sr_name'); localStorage.removeItem('sr_email'); nav('01-splash'); showToast('Signed out.'); }} style={{
          height: 38, borderRadius: 9, background: C.dangerDim, border: `1px solid ${C.danger}`,
          color: C.danger, fontSize: 11, fontWeight: 900, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans',
        }}>
          Sign Out
        </button>
      </div>

      {/* Add contact modal */}
      {addContactOpen && (
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.88)', backdropFilter: 'blur(8px)', zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 14 }}>
          <div style={{ background: C.bgSolid, border: `1px solid ${C.borderL}`, borderRadius: 16, padding: 16, width: '100%' }}>
            <h3 style={{ fontSize: 14, fontWeight: 900, margin: '0 0 10px', fontFamily: 'Plus Jakarta Sans' }}>Add Guardian Contact</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginBottom: 12 }}>
              {[
                { val: newCName, set: setNewCName, ph: 'Full Name', type: 'text' },
                { val: newCPhone, set: setNewCPhone, ph: 'Phone (+91 98765 43210)', type: 'tel' },
              ].map((f, i) => (
                <input key={i} type={f.type} value={f.val} onChange={e => f.set(e.target.value)} placeholder={f.ph} style={{ height: 36, background: C.bgCard2, border: `1px solid ${C.border}`, borderRadius: 7, color: '#fff', padding: '0 10px', fontSize: 11, fontFamily: 'Inter' }} />
              ))}
            </div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => { setAddContactOpen(false); setNewCName(''); setNewCPhone(''); }} style={{ flex: 1, height: 36, background: C.bgCard2, border: 'none', color: C.textS, borderRadius: 7, fontSize: 11, fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => {
                if (!newCName || !newCPhone) { showToast('Fill all fields', 'err'); return; }
                setContacts(p => [...p, { id: `c${Date.now()}`, name: newCName, phone: newCPhone, relation: 'Guardian' }]);
                setNewCName(''); setNewCPhone(''); setAddContactOpen(false);
                showToast('Guardian added!');
              }} style={{ flex: 1, height: 36, background: C.primary, border: 'none', color: '#fff', borderRadius: 7, fontSize: 11, fontWeight: 900, cursor: 'pointer' }}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );

  /* ═══════════════════════ RENDER ═══════════════════════════ */
  const screenMap = {
    '01-splash':     renderSplash,
    '02-onboarding': renderOnboarding,
    '03-login':      renderAuth,
    '04-dashboard':  renderDashboard,
    '05-navigate':   renderRoutePlanner,
    '06-active-nav': renderActiveNav,
    '07-sos-trigger':renderSosTrigger,
    '08-sos-active': renderSosActive,
    '09-hazard-report': renderHazardReport,
    '10-community-map': renderCommunityMap,
    '11-summary':    renderSummary,
    '12-profile':    renderProfile,
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'absolute', top: 14, zIndex: 9999,
          background: 'rgba(10,14,24,0.95)', backdropFilter: 'blur(16px)',
          border: `1px solid ${toast.type === 'err' ? C.danger : C.cyan}`,
          borderRadius: 24, padding: '7px 16px', color: '#fff', fontSize: 12, fontWeight: 700,
          display: 'flex', alignItems: 'center', gap: 7,
          boxShadow: `0 10px 35px ${toast.type === 'err' ? C.dangerGlow : C.cyanGlow}`,
          animation: 'fadeIn 0.18s ease',
        }}>
          {toast.type === 'err' ? <AlertTriangle size={14} color={C.danger} /> : <CheckCircle2 size={14} color={C.safe} />}
          {toast.msg}
        </div>
      )}

      {/* iPhone Frame */}
      <div style={{
        width: 'min(390px, 94vw)',
        height: 'min(840px, 95vh)',
        background: C.bg,
        borderRadius: 48,
        border: '10px solid #141A28',
        boxShadow: '0 30px 90px rgba(0,0,0,0.95), 0 0 50px rgba(99,102,241,0.12), 0 0 0 1px rgba(255,255,255,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
      }}>
        {/* Dynamic Island */}
        <div style={{
          position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
          width: dynamicIsland.width, height: 28, background: '#000',
          borderRadius: 20, zIndex: 900,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'width 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          border: '1px solid rgba(255,255,255,0.10)',
          boxShadow: '0 4px 18px rgba(0,0,0,0.9)',
        }}>
          {dynamicIsland.children}
        </div>

        <StatusBar />

        {/* Screen */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative', overflow: 'hidden' }}>
          {(screenMap[screen] || renderSplash)()}
        </div>

        {/* Home indicator */}
        <div style={{ height: 18, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <div style={{ width: 120, height: 4, borderRadius: 2, background: 'rgba(255,255,255,0.22)' }} />
        </div>
      </div>
    </div>
  );
}
