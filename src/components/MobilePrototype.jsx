import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, ChevronLeft, AlertTriangle, Send,
  CheckCircle2, Volume2, Navigation, X,
} from 'lucide-react';

/* ── Fix Leaflet's broken default icon paths in webpack/vite ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─────────────── Design Tokens ─────────────── */
const T = {
  bg0:      '#0B0E14',
  bg1:      '#131720',
  bg2:      '#1C2130',
  bg3:      '#252D3A',
  border:   '#2A3347',
  green:    '#00D26A',
  greenDim: 'rgba(0,210,106,0.12)',
  red:      '#FF3D5A',
  redDim:   'rgba(255,61,90,0.12)',
  amber:    '#FFC542',
  amberDim: 'rgba(255,197,66,0.12)',
  blue:     '#5B8DEF',
  purple:   '#8B5CF6',
  purpleDim:'rgba(139,92,246,0.12)',
  text0:    '#FFFFFF',
  text1:    '#C6CEDF',
  text2:    '#6B7A99',
};

/* ─────────────── Map Coordinates (Bengaluru) ─────────────── */
const ORIGIN      = [12.9716, 77.5946]; // "You are here" — current position
const DEST        = [12.9853, 77.6095]; // Campus Apartment — destination
const MAP_CENTER  = [12.9785, 77.6020];
const NAV_CENTER  = [12.9760, 77.6030];

/*
  Safe Route:  L-shaped via lit main roads (longer but fully lit)
  Unsafe Route: Diagonal shortcut through dim alleys
*/
const SAFE_COORDS = [
  [12.9716, 77.5946],
  [12.9716, 77.6000],
  [12.9716, 77.6055],
  [12.9762, 77.6055],
  [12.9810, 77.6055],
  [12.9853, 77.6095],
];

const UNSAFE_COORDS = [
  [12.9716, 77.5946],
  [12.9748, 77.5972],
  [12.9790, 77.6012],
  [12.9853, 77.6095],
];

/* ─────────────── Haversine Distance ─────────────── */
const calcDist = (coords) => {
  let d = 0;
  for (let i = 0; i < coords.length - 1; i++) {
    const [lat1, lon1] = coords[i];
    const [lat2, lon2] = coords[i + 1];
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;
    d += R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }
  return d;
};

const SAFE_KM    = calcDist(SAFE_COORDS).toFixed(1);
const UNSAFE_KM  = calcDist(UNSAFE_COORDS).toFixed(1);
// Walking speed ≈ 5 km/h → 12 min/km
const SAFE_MIN   = Math.round(parseFloat(SAFE_KM) * 12);
const UNSAFE_MIN = Math.round(parseFloat(UNSAFE_KM) * 12);

/* ─────────────── Custom Map Markers ─────────────── */
const makeMarker = (color, label) => L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none">
    <div style="background:${color};color:${color === '#00D26A' ? '#000' : '#fff'};
      font-size:9px;font-weight:800;padding:3px 8px;border-radius:5px;
      white-space:nowrap;font-family:Inter,sans-serif;
      box-shadow:0 2px 10px ${color}99">${label}</div>
    <div style="width:2px;height:5px;background:${color}"></div>
    <div style="width:12px;height:12px;border-radius:50%;
      background:${color};border:2px solid #fff;
      box-shadow:0 0 8px ${color}"></div>
  </div>`,
  iconSize: [110, 35],
  iconAnchor: [55, 35],
});

const makeHazardMarker = (label) => L.divIcon({
  className: '',
  html: `<div style="background:#FFC542;color:#000;font-size:8px;font-weight:800;
    padding:2px 7px;border-radius:4px;white-space:nowrap;
    font-family:Inter,sans-serif;box-shadow:0 2px 6px rgba(255,197,66,0.6)">⚠ ${label}</div>`,
  iconSize: [80, 18],
  iconAnchor: [40, 9],
});

const youIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none">
    <div style="width:18px;height:18px;border-radius:50%;
      background:#8B5CF6;border:3px solid #fff;
      box-shadow:0 0 14px #8B5CF6,0 0 0 4px rgba(139,92,246,0.25)"></div>
    <div style="background:#8B5CF6;color:#fff;font-size:7px;font-weight:800;
      padding:2px 5px;border-radius:3px;white-space:nowrap;
      margin-top:2px;font-family:Inter,sans-serif">You are here</div>
  </div>`,
  iconSize: [70, 32],
  iconAnchor: [9, 9],
});

/* Map center controller — animates when screen changes */
const MapFlyTo = ({ center, zoom }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [center[0], center[1], zoom]);
  return null;
};

/* ─────────────── Status Bar ─────────────── */
const StatusBar = () => (
  <div style={{
    height: 44, flexShrink: 0, background: T.bg0,
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0 18px', position: 'relative',
  }}>
    <span style={{ color: T.text0, fontSize: 14, fontWeight: 700, fontFamily: 'Inter' }}>9:41</span>
    {/* Dynamic Island */}
    <div style={{
      position: 'absolute', left: '50%', top: 6,
      transform: 'translateX(-50%)',
      width: 100, height: 26, borderRadius: 13, background: '#000',
    }} />
    {/* Signals */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
      <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
        {[4, 6, 8, 10].map((h, i) => (
          <div key={i} style={{ width: 3, height: h, borderRadius: 1, background: i < 3 ? T.text0 : T.text2 }} />
        ))}
      </div>
      {/* WiFi icon */}
      <svg width="14" height="11" viewBox="0 0 14 11" fill="none" style={{ margin: '0 2px' }}>
        <path d="M7 2.8c1.9 0 3.6.8 4.8 2.1L13 3.5C11.4 1.4 9.3.3 7 .3S2.6 1.4 1 3.5l1.2 1.4C3.4 3.6 5.1 2.8 7 2.8z" fill={T.text0}/>
        <path d="M7 5.8c1.2 0 2.3.5 3 1.3l1.2-1.4C10.1 4.6 8.6 3.8 7 3.8S3.9 4.6 2.8 5.7L4 7.1C4.7 6.3 5.8 5.8 7 5.8z" fill={T.text0}/>
        <circle cx="7" cy="9.5" r="1.7" fill={T.text0}/>
      </svg>
      {/* Battery */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: 20, height: 10, borderRadius: 2.5, border: `1.5px solid ${T.text1}`, padding: 1.5 }}>
          <div style={{ width: '78%', height: '100%', background: T.green, borderRadius: 1 }} />
        </div>
        <div style={{ width: 2, height: 5, background: T.text2, borderRadius: 1, marginLeft: 1 }} />
      </div>
    </div>
  </div>
);

/* ─────────────── Home Indicator ─────────────── */
const HomeBar = () => (
  <div style={{
    height: 28, flexShrink: 0, background: T.bg0,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
  }}>
    <div style={{ width: 120, height: 4, borderRadius: 2, background: T.border }} />
  </div>
);

/* ─────────────── Route Option Card ─────────────── */
const RouteCard = ({ label, badge, badgeRgb, sub, time, km, selected, onClick }) => (
  <div onClick={onClick} style={{
    background: selected ? `rgba(${badgeRgb},0.08)` : T.bg1,
    border: `1.5px solid ${selected ? `rgb(${badgeRgb})` : T.border}`,
    borderRadius: 12, padding: '9px 12px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    cursor: 'pointer', transition: 'all 0.15s ease',
  }}>
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
        <span style={{ color: T.text0, fontWeight: 700, fontSize: 13, fontFamily: 'Inter' }}>{label}</span>
        <span style={{
          fontSize: 9, fontWeight: 800, fontFamily: 'Inter',
          background: `rgba(${badgeRgb},0.15)`, color: `rgb(${badgeRgb})`,
          padding: '2px 6px', borderRadius: 20,
        }}>{badge}</span>
      </div>
      <span style={{ color: T.text2, fontSize: 10, fontFamily: 'Inter' }}>{sub}</span>
    </div>
    <div style={{ textAlign: 'right', flexShrink: 0, marginLeft: 10 }}>
      <div style={{ color: T.text0, fontWeight: 800, fontSize: 15, fontFamily: 'Inter' }}>{time}<span style={{ fontSize: 10, fontWeight: 500, marginLeft: 2 }}>min</span></div>
      <div style={{ color: T.text2, fontSize: 9, fontFamily: 'Inter' }}>{km} km</div>
    </div>
  </div>
);

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
═══════════════════════════════════════════════════════ */
const MobilePrototype = () => {
  const [screen,       setScreen]       = useState('dashboard');
  const [route,        setRoute]        = useState('safe');
  const [hazardModal,  setHazardModal]  = useState(false);
  const [toast,        setToast]        = useState('');
  const [hazardCat,    setHazardCat]    = useState('Dim Lighting');
  const [hazardNote,   setHazardNote]   = useState('');
  const [pins,         setPins]         = useState([]);
  const [countdown,    setCountdown]    = useState(3);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  useEffect(() => {
    let t;
    if (screen === 'sos-countdown') {
      if (countdown > 0) t = setTimeout(() => setCountdown(c => c - 1), 1000);
      else setScreen('sos-active');
    }
    return () => clearTimeout(t);
  }, [screen, countdown]);

  const goNav  = () => { setScreen('navigation'); showToast('🛡 Safe navigation started!'); };
  const goSOS  = () => { setCountdown(3); setScreen('sos-countdown'); };
  const abortSOS = () => { setScreen('navigation'); showToast('SOS cancelled.'); };

  const submitHazard = () => {
    setPins(prev => [...prev, {
      id: Date.now(), cat: hazardCat,
      pos: [
        ORIGIN[0] + (Math.random() - 0.3) * 0.006,
        ORIGIN[1] + (Math.random() + 0.3) * 0.005,
      ],
    }]);
    setHazardModal(false);
    setHazardNote('');
    showToast(`📍 "${hazardCat}" pinned on map!`);
  };

  /* Shared map tile — CartoDB Dark Matter matches our dark theme perfectly */
  const TILE = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
  const ATTR = '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com">CARTO</a>';
  const mapStyle = { height: '100%', width: '100%' };

  /* Phone dimensions — fixed for the 1920×912 viewport */
  const PH = 760; // phone height
  const PW = 360; // phone width

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      width: '100%', height: '100%',
    }}>

      {/* ── Phone Shell ── */}
      <div style={{
        width: PW, height: PH,
        borderRadius: 48,
        border: '9px solid #12151f',
        boxShadow: '0 0 0 1.5px #090b14, 0 40px 100px rgba(0,0,0,0.8), inset 0 0 0 1px rgba(255,255,255,0.05)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        background: T.bg0,
        position: 'relative',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}>

        {/* ── Global keyframes + leaflet overrides ── */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

          @keyframes sosPulse {
            0%   { box-shadow: 0 0 0 0 rgba(255,61,90,0.8); }
            70%  { box-shadow: 0 0 0 20px rgba(255,61,90,0); }
            100% { box-shadow: 0 0 0 0 rgba(255,61,90,0); }
          }
          @keyframes dotPing {
            0%,100%{ box-shadow:0 0 0 0 rgba(139,92,246,0.7); }
            50%    { box-shadow:0 0 0 10px rgba(139,92,246,0); }
          }
          @keyframes sosRing {
            from { transform:scale(0.8); opacity:1; }
            to   { transform:scale(1.8); opacity:0; }
          }
          @keyframes strobeRed {
            0%,100%{ background:rgba(255,61,90,0.05); }
            50%    { background:rgba(255,61,90,0.15); }
          }
          @keyframes slideUp {
            from { transform:translateY(100%); }
            to   { transform:translateY(0); }
          }
          @keyframes fadeIn {
            from { opacity:0; transform:translateY(-8px); }
            15%  { opacity:1; transform:translateY(0); }
            80%  { opacity:1; }
            to   { opacity:0; }
          }

          /* Leaflet overrides — hide controls that look bad inside phone frame */
          .leaflet-control-zoom   { display:none !important; }
          .leaflet-control-attribution {
            font-size: 7px !important;
            opacity: 0.35 !important;
            background: rgba(0,0,0,0.5) !important;
            color: rgba(255,255,255,0.4) !important;
          }
          /* Pinch / touch scroll enabled */
          .leaflet-container { touch-action: none; }
        `}</style>

        <StatusBar />

        {/* ── TOAST notification ── */}
        {toast && (
          <div style={{
            position: 'absolute', top: 50, left: 12, right: 12, zIndex: 1500,
            background: T.bg3, border: `1px solid ${T.green}`,
            borderRadius: 12, padding: '9px 13px',
            display: 'flex', alignItems: 'center', gap: 8,
            boxShadow: `0 8px 28px rgba(0,210,106,0.3)`,
            animation: 'fadeIn 3s ease forwards',
          }}>
            <CheckCircle2 size={15} color={T.green} />
            <span style={{ color: T.text0, fontSize: 12, fontWeight: 600 }}>{toast}</span>
          </div>
        )}

        {/* ═════════════════════════════════════
            SCREEN 1 — ROUTE SELECTION
        ═════════════════════════════════════ */}
        {screen === 'dashboard' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

            {/* App header */}
            <div style={{
              padding: '8px 14px', flexShrink: 0,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              background: T.bg0, borderBottom: `1px solid ${T.border}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <Shield size={16} color={T.purple} />
                <span style={{ color: T.text0, fontSize: 15, fontWeight: 800 }}>SafeRoute</span>
              </div>
              <div style={{
                width: 30, height: 30, borderRadius: 15,
                background: `linear-gradient(135deg, ${T.purple}, #e879f9)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 10, fontWeight: 900,
              }}>ER</div>
            </div>

            {/* Destination strip */}
            <div style={{
              padding: '7px 14px', flexShrink: 0,
              background: T.bg1, borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', gap: 9,
            }}>
              <div style={{ width: 9, height: 9, borderRadius: 2, background: T.green, boxShadow: `0 0 8px ${T.green}`, flexShrink: 0 }} />
              <span style={{ color: T.text0, fontWeight: 700, fontSize: 12, flex: 1 }}>Campus Apartment (Dorm)</span>
              <span style={{ color: T.text2, fontSize: 10, background: T.bg2, borderRadius: 12, padding: '2px 8px', border: `1px solid ${T.border}` }}>Change</span>
            </div>

            {/* ── LIVE MAP — fully scrollable & pannable ── */}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <MapContainer
                center={MAP_CENTER}
                zoom={15}
                style={mapStyle}
                zoomControl={false}
                scrollWheelZoom={true}
                dragging={true}
                touchZoom={true}
                doubleClickZoom={true}
              >
                <TileLayer url={TILE} attribution={ATTR} />

                {/* Safe route: bright green solid line + glow */}
                <Polyline
                  positions={SAFE_COORDS}
                  pathOptions={{ color: T.green, weight: 16, opacity: 0.12, lineCap: 'round', lineJoin: 'round' }}
                />
                <Polyline
                  positions={SAFE_COORDS}
                  pathOptions={{ color: T.green, weight: 5, opacity: route === 'safe' ? 1 : 0.55, lineCap: 'round', lineJoin: 'round' }}
                />

                {/* Unsafe route: red dashed */}
                <Polyline
                  positions={UNSAFE_COORDS}
                  pathOptions={{ color: T.red, weight: 4, opacity: route === 'fastest' ? 0.95 : 0.45, dashArray: '10 7', lineCap: 'round' }}
                />

                {/* Destination marker */}
                <Marker position={DEST}   icon={makeMarker(T.green, '📍 Campus Apt')} />

                {/* Origin marker */}
                <Marker position={ORIGIN} icon={youIcon} />

                {/* Dim alley warning on unsafe route */}
                <Marker
                  position={[12.9775, 77.5995]}
                  icon={makeHazardMarker('Dim Alley')}
                />

                {/* User hazard reports */}
                {pins.map(p => (
                  <Marker key={p.id} position={p.pos} icon={makeHazardMarker(p.cat.split(' ')[0])} />
                ))}
              </MapContainer>

              {/* Route legend overlay */}
              <div style={{
                position: 'absolute', bottom: 10, left: 10, zIndex: 800,
                display: 'flex', flexDirection: 'column', gap: 5,
                pointerEvents: 'none',
              }}>
                <div style={{
                  background: 'rgba(11,14,20,0.88)', border: `1px solid ${T.green}`,
                  borderRadius: 8, padding: '5px 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ width: 16, height: 3, background: T.green, borderRadius: 2 }} />
                  <span style={{ color: T.green, fontSize: 9, fontWeight: 700 }}>Safe: {SAFE_KM} km · {SAFE_MIN} min</span>
                </div>
                <div style={{
                  background: 'rgba(11,14,20,0.88)', border: `1px solid ${T.red}`,
                  borderRadius: 8, padding: '5px 10px',
                  display: 'flex', alignItems: 'center', gap: 6,
                  backdropFilter: 'blur(10px)',
                }}>
                  <div style={{ width: 16, height: 0, border: `2px dashed ${T.red}`, borderRadius: 1 }} />
                  <span style={{ color: T.red, fontSize: 9, fontWeight: 700 }}>Unsafe: {UNSAFE_KM} km · {UNSAFE_MIN} min</span>
                </div>
              </div>
            </div>

            {/* ── Route selection + CTA ── */}
            <div style={{
              flexShrink: 0, background: T.bg0,
              padding: '10px 12px 10px',
              borderTop: `1px solid ${T.border}`,
              display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ color: T.text2, fontSize: 9, fontWeight: 800, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 1 }}>Choose Route</div>

              <RouteCard
                label="SafeRoute" badge="94% Safe" badgeRgb="0,210,106"
                sub="💡 Lit streets · Open stores · CCTV cameras"
                time={SAFE_MIN} km={SAFE_KM}
                selected={route === 'safe'}
                onClick={() => setRoute('safe')}
              />
              <RouteCard
                label="Shortest Route" badge="38% Safe" badgeRgb="255,61,90"
                sub="⚠ Dim alleys · No CCTV · Low footfall"
                time={UNSAFE_MIN} km={UNSAFE_KM}
                selected={route === 'fastest'}
                onClick={() => setRoute('fastest')}
              />

              <button onClick={goNav} style={{
                width: '100%', padding: '12px 0', borderRadius: 12,
                border: 'none', cursor: 'pointer',
                fontWeight: 900, fontSize: 13, fontFamily: 'Inter', marginTop: 2,
                background: route === 'safe' ? T.green : T.red,
                color: route === 'safe' ? '#000' : '#fff',
                boxShadow: route === 'safe'
                  ? `0 4px 20px rgba(0,210,106,0.45)`
                  : `0 4px 20px rgba(255,61,90,0.45)`,
                transition: 'all 0.2s ease',
              }}>
                {route === 'safe' ? '🛡 Start Safe Navigation' : '⚡ Start Anyway (Risky)'}
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════
            SCREEN 2 — ACTIVE NAVIGATION
        ═════════════════════════════════════ */}
        {screen === 'navigation' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

            {/* Turn-by-turn HUD */}
            <div style={{
              flexShrink: 0, background: T.bg0,
              padding: '8px 12px', borderBottom: `1px solid ${T.border}`,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <button onClick={() => setScreen('dashboard')} style={{
                background: T.bg2, border: 'none', width: 32, height: 32, borderRadius: 16,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}>
                <ChevronLeft size={16} color={T.text1} />
              </button>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 1 }}>
                  <Navigation size={10} color={T.green} />
                  <span style={{ color: T.green, fontSize: 9, fontWeight: 700, letterSpacing: 0.5 }}>SAFE ROUTE · {SAFE_KM} km</span>
                </div>
                <span style={{ color: T.text0, fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                  Turn right in 200m → Cedar Ave
                </span>
              </div>
              <div style={{ background: T.bg2, borderRadius: 8, padding: '3px 8px', textAlign: 'center', flexShrink: 0 }}>
                <div style={{ color: T.text0, fontWeight: 800, fontSize: 13, fontFamily: 'Inter' }}>{SAFE_MIN}</div>
                <div style={{ color: T.text2, fontSize: 8 }}>min</div>
              </div>
            </div>

            {/* ── Navigation MAP ── */}
            <div style={{ flex: 1, minHeight: 0, position: 'relative' }}>
              <MapContainer
                center={NAV_CENTER}
                zoom={16}
                style={mapStyle}
                zoomControl={false}
                scrollWheelZoom={true}
                dragging={true}
                touchZoom={true}
              >
                <TileLayer url={TILE} attribution={ATTR} />

                {/* Active safe route — bright and bold */}
                <Polyline positions={SAFE_COORDS}
                  pathOptions={{ color: T.green, weight: 18, opacity: 0.12, lineCap: 'round', lineJoin: 'round' }} />
                <Polyline positions={SAFE_COORDS}
                  pathOptions={{ color: T.green, weight: 6, opacity: 1, lineCap: 'round', lineJoin: 'round' }} />

                {/* Unsafe dimmed in background */}
                <Polyline positions={UNSAFE_COORDS}
                  pathOptions={{ color: T.red, weight: 2.5, opacity: 0.35, dashArray: '8 6' }} />

                {/* Markers */}
                <Marker position={DEST}   icon={makeMarker(T.green, '📍 Campus Apt')} />
                <Marker position={ORIGIN} icon={youIcon} />

                {/* Hazard pins */}
                {pins.map(p => (
                  <Marker key={p.id} position={p.pos} icon={makeHazardMarker(p.cat.split(' ')[0])} />
                ))}
              </MapContainer>

              {/* Safety badge */}
              <div style={{
                position: 'absolute', left: 10, bottom: 10, zIndex: 800,
                background: 'rgba(11,14,20,0.88)', border: `1px solid ${T.green}`,
                borderRadius: 10, padding: '5px 10px',
                display: 'flex', alignItems: 'center', gap: 6,
                backdropFilter: 'blur(10px)',
                pointerEvents: 'none',
              }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: T.green, boxShadow: `0 0 6px ${T.green}` }} />
                <span style={{ color: T.text1, fontSize: 10, fontWeight: 600 }}>94% Safety Corridor</span>
              </div>
            </div>

            {/* Bottom controls */}
            <div style={{
              flexShrink: 0, background: T.bg0,
              padding: '10px 14px', borderTop: `1px solid ${T.border}`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <button onClick={() => setHazardModal(true)} style={{
                background: T.bg2, border: `1px solid ${T.border}`,
                color: T.text1, padding: '9px 14px', borderRadius: 22,
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center',
                gap: 5, cursor: 'pointer',
              }}>
                <AlertTriangle size={12} color={T.amber} />Report
              </button>

              <button onClick={goSOS} style={{
                width: 60, height: 60, borderRadius: 30,
                background: T.red, border: '3px solid rgba(255,61,90,0.3)',
                color: '#fff', fontWeight: 900, fontSize: 13, cursor: 'pointer',
                animation: 'sosPulse 1.5s infinite', fontFamily: 'Inter',
              }}>SOS</button>

              <button onClick={() => showToast('📍 Live location shared!')} style={{
                background: T.bg2, border: `1px solid ${T.border}`,
                color: T.text1, padding: '9px 14px', borderRadius: 22,
                fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center',
                gap: 5, cursor: 'pointer',
              }}>
                <Send size={12} color={T.blue} />Share
              </button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════
            SCREEN 3 — SOS COUNTDOWN
        ═════════════════════════════════════ */}
        {screen === 'sos-countdown' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, animation: 'strobeRed 1s infinite' }}>
            {/* Header */}
            <div style={{ padding: '9px 14px', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 10, borderBottom: `1px solid ${T.border}` }}>
              <button onClick={abortSOS} style={{ background: T.bg2, border: 'none', width: 32, height: 32, borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                <ChevronLeft size={16} color={T.text1} />
              </button>
              <span style={{ color: T.red, fontWeight: 800, fontSize: 14 }}>🚨 SOS Alert</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 22px' }}>
              {/* Countdown rings */}
              <div style={{ position: 'relative', width: 140, height: 140, marginBottom: 24 }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{
                    position: 'absolute', inset: -i * 15, borderRadius: '50%',
                    border: `1.5px solid ${T.red}`, opacity: 0.08 + i * 0.04,
                  }} />
                ))}
                <div style={{
                  position: 'absolute', inset: -10, borderRadius: '50%',
                  border: `2px solid ${T.red}`,
                  animation: 'sosRing 1.2s ease-out infinite',
                }} />
                <div style={{
                  position: 'absolute', inset: 0, borderRadius: '50%',
                  background: T.redDim, border: `3px solid ${T.red}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <span style={{ fontSize: 60, fontWeight: 900, color: T.red, lineHeight: 1, fontFamily: 'Inter' }}>{countdown}</span>
                </div>
              </div>

              <h3 style={{ color: T.text0, fontSize: 18, fontWeight: 800, margin: '0 0 6px', textAlign: 'center', fontFamily: 'Inter' }}>Sending SOS Alert</h3>
              <p style={{ color: T.text2, fontSize: 11, textAlign: 'center', margin: '0 0 20px', lineHeight: 1.5, fontFamily: 'Inter' }}>
                Location sent to all emergency contacts in <strong style={{ color: T.red }}>{countdown}s</strong>
              </p>

              {/* Status checklist */}
              <div style={{ width: '100%', background: T.bg1, borderRadius: 12, padding: '12px 14px', border: `1px solid ${T.border}`, marginBottom: 18 }}>
                {[
                  { label: 'Getting GPS coordinates',  done: true },
                  { label: 'Composing emergency SMS',   done: countdown < 2 },
                  { label: 'Alerting campus security',  done: false },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: i < 2 ? 10 : 0 }}>
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      background: s.done ? T.green : T.bg3,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {s.done && <span style={{ color: '#000', fontSize: 10, fontWeight: 900 }}>✓</span>}
                    </div>
                    <span style={{ color: s.done ? T.text0 : T.text2, fontSize: 11 }}>{s.label}</span>
                  </div>
                ))}
              </div>

              <button onClick={abortSOS} style={{
                width: '100%', padding: '12px 0', borderRadius: 12,
                background: 'transparent', border: `1.5px solid ${T.red}`,
                color: T.red, fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter',
              }}>Hold to Cancel Alert</button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════
            SCREEN 4 — SOS ACTIVE
        ═════════════════════════════════════ */}
        {screen === 'sos-active' && (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, animation: 'strobeRed 0.6s infinite' }}>
            <div style={{ padding: '10px 14px', textAlign: 'center', borderBottom: `1px solid ${T.border}`, flexShrink: 0 }}>
              <span style={{ color: T.red, fontWeight: 900, fontSize: 14, letterSpacing: 1, fontFamily: 'Inter' }}>🚨 SOS ACTIVE</span>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 20px' }}>
              <div style={{ width: 66, height: 66, borderRadius: 33, background: T.redDim, border: `2px solid ${T.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Volume2 size={30} color={T.red} />
              </div>
              <h3 style={{ color: T.red, fontSize: 18, fontWeight: 900, textTransform: 'uppercase', letterSpacing: 2, margin: '0 0 6px', fontFamily: 'Inter' }}>Alert Sent</h3>
              <p style={{ color: T.text2, fontSize: 11, textAlign: 'center', margin: '0 0 18px', lineHeight: 1.6 }}>
                Audio siren is active. Emergency contacts received your live GPS location.
              </p>

              {/* Contact rows */}
              <div style={{ width: '100%', background: T.bg1, border: `1px solid ${T.border}`, borderRadius: 14, overflow: 'hidden', marginBottom: 16 }}>
                {[
                  { name: 'Mom',          phone: '+91 98XX XXXXX', emoji: '👩' },
                  { name: 'Roommate',     phone: '+91 87XX XXXXX', emoji: '🏠' },
                  { name: 'Campus Police',phone: '100',            emoji: '🚔' },
                ].map((c, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px',
                    borderBottom: i < 2 ? `1px solid ${T.border}` : 'none',
                  }}>
                    <div style={{ width: 32, height: 32, borderRadius: 16, background: T.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16 }}>{c.emoji}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: T.text0, fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                      <div style={{ color: T.text2, fontSize: 10 }}>{c.phone}</div>
                    </div>
                    <div style={{ background: T.greenDim, border: `1px solid ${T.green}`, borderRadius: 20, padding: '3px 8px' }}>
                      <span style={{ color: T.green, fontSize: 9, fontWeight: 800 }}>✓ Notified</span>
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={() => { setScreen('dashboard'); showToast('SOS resolved. Stay safe! ✅'); }} style={{
                width: '100%', padding: '12px 0', borderRadius: 12,
                background: T.green, border: 'none', color: '#000',
                fontWeight: 900, fontSize: 13, cursor: 'pointer', fontFamily: 'Inter',
                boxShadow: `0 5px 20px rgba(0,210,106,0.45)`,
              }}>✓ I Am Safe — Dismiss Alert</button>
            </div>
          </div>
        )}

        {/* ═════════════════════════════════════
            MODAL — HAZARD REPORT
        ═════════════════════════════════════ */}
        {hazardModal && (
          <div style={{
            position: 'absolute', inset: 0, zIndex: 900,
            background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'flex-end',
          }}>
            <div style={{
              width: '100%', background: T.bg1,
              borderRadius: '22px 22px 0 0', border: `1px solid ${T.border}`, borderBottom: 'none',
              padding: '16px 16px 24px',
              animation: 'slideUp 0.28s cubic-bezier(0.16,1,0.3,1)',
            }}>
              {/* Handle */}
              <div style={{ width: 36, height: 4, borderRadius: 2, background: T.border, margin: '0 auto 14px' }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ color: T.text0, fontSize: 14, fontWeight: 800 }}>Report Safety Hazard</span>
                <button onClick={() => setHazardModal(false)} style={{
                  background: T.bg3, border: 'none', width: 26, height: 26, borderRadius: 13,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}><X size={12} color={T.text1} /></button>
              </div>

              <div style={{ color: T.text2, fontSize: 9, fontWeight: 800, letterSpacing: 1.2, textTransform: 'uppercase', marginBottom: 8 }}>Category</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 10 }}>
                {['Dim Lighting', 'Blocked Path', 'Suspicious Crowd', 'Unsafe Road'].map(cat => (
                  <div key={cat} onClick={() => setHazardCat(cat)} style={{
                    background: hazardCat === cat ? T.purpleDim : T.bg2,
                    border: `1.5px solid ${hazardCat === cat ? T.purple : T.border}`,
                    borderRadius: 10, padding: '8px', textAlign: 'center',
                    cursor: 'pointer', color: hazardCat === cat ? T.purple : T.text1,
                    fontSize: 11, fontWeight: 600, transition: 'all 0.15s',
                  }}>{cat}</div>
                ))}
              </div>

              <input
                type="text" placeholder="Add notes (optional)"
                value={hazardNote} onChange={e => setHazardNote(e.target.value)}
                style={{
                  width: '100%', background: T.bg2, border: `1px solid ${T.border}`,
                  borderRadius: 10, padding: '9px 12px', color: T.text0, fontSize: 12,
                  outline: 'none', boxSizing: 'border-box', marginBottom: 10, fontFamily: 'Inter',
                }}
              />
              <button onClick={submitHazard} style={{
                width: '100%', padding: '12px 0', borderRadius: 11,
                background: T.amber, border: 'none', color: '#000',
                fontWeight: 800, fontSize: 12, cursor: 'pointer', fontFamily: 'Inter',
                boxShadow: `0 4px 16px rgba(255,197,66,0.4)`,
              }}>📍 Publish Hazard Report</button>
            </div>
          </div>
        )}

        <HomeBar />
      </div>
    </div>
  );
};

export default MobilePrototype;
