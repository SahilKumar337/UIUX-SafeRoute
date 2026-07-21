import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, ChevronLeft, AlertTriangle, Send, CheckCircle2,
  Volume2, Navigation, X, Home, MapPin, AlertOctagon,
  User, Settings, Star, Heart, Activity, Camera, Eye, Zap,
  Plus
} from 'lucide-react';

/* ── Fix Leaflet's broken default icon paths in webpack/vite ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─────────────── Design Tokens (Matches Figma System) ─────────────── */
const C = {
  bg:      '#0B0E14',
  card:    '#131720',
  card2:   '#1C2130',
  purple:  '#6366F1',
  purpleD: 'rgba(99, 102, 241, 0.15)',
  green:   '#10B981',
  greenD:  'rgba(16, 185, 129, 0.15)',
  red:     '#EF4444',
  redD:    'rgba(239, 68, 68, 0.15)',
  amber:   '#F59E0B',
  amberD:  'rgba(245, 158, 11, 0.15)',
  text:    '#E2E8F0',
  textS:   '#8892B0',
  textM:   '#596178',
  border:  '#1C2130',
  white:   '#FFFFFF',
};

/* ─────────────── Map Coordinates (Bengaluru) ─────────────── */
const ORIGIN      = [12.9716, 77.5946];
const DEST        = [12.9853, 77.6095];
const MAP_CENTER  = [12.9785, 77.6020];

const SAFE_COORDS = [
  [12.9716, 77.5946],
  [12.9716, 77.6055],
  [12.9810, 77.6055],
  [12.9853, 77.6095],
];

const UNSAFE_COORDS = [
  [12.9716, 77.5946],
  [12.9790, 77.6012],
  [12.9853, 77.6095],
];

/* ─────────────── Custom Markers ─────────────── */
const makeMarker = (color, label) => L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none">
    <div style="background:${color};color:#000;font-size:9px;font-weight:800;padding:2px 6px;border-radius:4px;white-space:nowrap;box-shadow:0 2px 6px rgba(0,0,0,0.5);font-family:Inter,sans-serif">${label}</div>
    <div style="width:2px;height:4px;background:${color}"></div>
    <div style="width:10px;height:10px;border-radius:50%;background:${color};border:1.5px solid #fff;box-shadow:0 0 6px ${color}"></div>
  </div>`,
  iconSize: [100, 30],
  iconAnchor: [50, 30],
});

const makeHazardMarker = (label, color = C.amber) => L.divIcon({
  className: '',
  html: `<div style="background:${color};color:#000;font-size:8px;font-weight:800;padding:2px 5px;border-radius:3px;white-space:nowrap;box-shadow:0 2px 4px rgba(0,0,0,0.5);font-family:Inter,sans-serif">⚠️ ${label}</div>`,
  iconSize: [80, 16],
  iconAnchor: [40, 8],
});

const youIcon = L.divIcon({
  className: '',
  html: `<div style="display:flex;flex-direction:column;align-items:center;pointer-events:none">
    <div style="width:14px;height:14px;border-radius:50%;background:${C.purple};border:2px solid #fff;box-shadow:0 0 10px ${C.purple}"></div>
  </div>`,
  iconSize: [14, 14],
  iconAnchor: [7, 7],
});

const TileLayerDark = () => (
  <TileLayer
    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    attribution=""
  />
);

/* ─────────────── Mobile Prototype Component ─────────────── */
const MobilePrototype = () => {
  const [screen, setScreen] = useState('01-splash');
  const [routeType, setRouteType] = useState('safe');
  const [activeTab, setActiveTab] = useState('home');
  const [sosCountdown, setSosCountdown] = useState(3);
  const [hazards, setHazards] = useState([
    { id: 1, pos: [12.976, 77.601], label: 'Poor Lighting', type: 'lighting', severity: 'medium' },
    { id: 2, pos: [12.981, 77.603], label: 'Suspicious Activity', type: 'suspicious', severity: 'high' }
  ]);
  const [selectedReportType, setSelectedReportType] = useState('Poor Lighting');
  const [reportSeverity, setReportSeverity] = useState('Medium');
  const [reportDesc, setReportDesc] = useState('');
  const [toast, setToast] = useState('');

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  };

  // SOS Countdown logic
  useEffect(() => {
    let interval;
    if (screen === '07-sos-trigger') {
      if (sosCountdown > 0) {
        interval = setInterval(() => {
          setSosCountdown(prev => prev - 1);
        }, 1000);
      } else {
        setScreen('08-sos-activated');
      }
    } else {
      setSosCountdown(3);
    }
    return () => clearInterval(interval);
  }, [screen, sosCountdown]);

  // Bottom Navigation helper
  const renderBottomNav = (currentTab) => {
    const tabs = [
      { id: 'home', icon: <Home size={18} />, label: 'Home', screenId: '04-dashboard' },
      { id: 'navigate', icon: <Navigation size={18} />, label: 'Navigate', screenId: '05-navigate' },
      { id: 'sos', icon: <AlertOctagon size={18} />, label: 'SOS', screenId: '07-sos-trigger' },
      { id: 'report', icon: <AlertTriangle size={18} />, label: 'Report', screenId: '09-hazard-report' },
      { id: 'profile', icon: <User size={18} />, label: 'Profile', screenId: '12-profile' },
    ];

    return (
      <div style={{
        height: 58,
        background: C.card,
        borderTop: `1px solid ${C.border}`,
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 4,
      }}>
        {tabs.map((t) => {
          const isActive = currentTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                setScreen(t.screenId);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: isActive ? C.purple : C.textS,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 3,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                fontSize: 10,
                fontWeight: isActive ? 600 : 400,
                flex: 1,
              }}
            >
              <div style={{
                padding: '4px 12px',
                borderRadius: 14,
                background: isActive ? C.purpleD : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {t.icon}
              </div>
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Status Bar Mockup
  const renderStatusBar = () => (
    <div style={{
      height: 38,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '0 18px',
      fontSize: 12,
      fontWeight: 600,
      color: C.textS,
      background: C.bg,
      userSelect: 'none',
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>
  );

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      maxWidth: 1100,
      height: 860,
      background: '#07090e',
      borderRadius: 24,
      border: '1px solid #1c2130',
      boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
      overflow: 'hidden',
      fontFamily: 'Inter, sans-serif',
      color: C.text,
    }}>
      {/* Inject premium style overrides and animations */}
      <style>{`
        @keyframes sosPulse {
          0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.5); }
          70% { box-shadow: 0 0 0 25px rgba(239, 68, 68, 0); }
          100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
        }
        @keyframes sosRing {
          from { transform: scale(0.85); opacity: 0.8; }
          to { transform: scale(1.4); opacity: 0; }
        }
        @keyframes alertStrobe {
          0%, 100% { background-color: rgba(239, 68, 68, 0.05); }
          50% { background-color: rgba(239, 68, 68, 0.18); }
        }
        @keyframes liveDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.4; }
        }
        @keyframes screenFade {
          from { opacity: 0; transform: scale(0.985) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .screen-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
          animation: screenFade 0.38s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        button {
          transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1) !important;
        }
        button:hover {
          filter: brightness(1.15);
          transform: translateY(-1px);
        }
        button:active {
          filter: brightness(0.9);
          transform: translateY(1px) scale(0.98);
        }
      `}</style>

      {/* ── LEFT PRESENTATION SIDEBAR ── */}
      <div style={{
        width: 320,
        background: '#0e1118',
        borderRight: '1px solid #1c2130',
        display: 'flex',
        flexDirection: 'column',
        padding: 24,
        overflowY: 'auto',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Shield size={24} color={C.purple} />
          <h2 style={{ fontSize: 18, fontWeight: 800, margin: 0 }}>SafeRoute UI</h2>
        </div>
        <p style={{ fontSize: 12, color: C.textS, lineHeight: 1.5, marginBottom: 20 }}>
          Present safety workflow screens directly to the jury using this jump panel, or interact with the mockup container on the right.
        </p>

        <h3 style={{ fontSize: 10, fontWeight: 700, color: C.textM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Jump to Design Screen
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: '01-splash', label: '01. Splash Screen', cat: 'entry' },
            { id: '02-onboarding', label: '02. Onboarding Intro', cat: 'entry' },
            { id: '03-login', label: '03. Login / Sign Up', cat: 'entry' },
            { id: '04-dashboard', label: '04. Dashboard (Home)', cat: 'core' },
            { id: '05-navigate', label: '05. Route Planner', cat: 'core' },
            { id: '06-active-nav', label: '06. Active Turn-by-Turn', cat: 'core' },
            { id: '07-sos-trigger', label: '07. SOS Countdowns', cat: 'sos' },
            { id: '08-sos-activated', label: '08. SOS Alert Transmitted', cat: 'sos' },
            { id: '09-hazard-report', label: '09. Report Hazard Form', cat: 'hazard' },
            { id: '10-community-map', label: '10. Community Safety Map', cat: 'hazard' },
            { id: '11-summary', label: '11. Route Summary Metrics', cat: 'core' },
            { id: '12-profile', label: '12. Profile & Settings', cat: 'core' },
          ].map(s => {
            const isCurrent = screen === s.id;
            let themeColor = C.purple;
            if (s.cat === 'sos') themeColor = C.red;
            if (s.cat === 'hazard') themeColor = C.amber;
            if (s.cat === 'core' && s.id !== '12-profile') themeColor = C.green;

            return (
              <button
                key={s.id}
                onClick={() => {
                  setScreen(s.id);
                  if (s.id === '04-dashboard') setActiveTab('home');
                  if (s.id === '05-navigate') setActiveTab('navigate');
                  if (s.id === '07-sos-trigger') setActiveTab('sos');
                  if (s.id === '09-hazard-report') setActiveTab('report');
                  if (s.id === '12-profile') setActiveTab('profile');
                }}
                style={{
                  background: isCurrent ? `${themeColor}20` : '#131720',
                  border: `1.5px solid ${isCurrent ? themeColor : 'transparent'}`,
                  color: isCurrent ? C.white : C.text,
                  padding: '10px 14px',
                  borderRadius: 10,
                  textAlign: 'left',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span>{s.label}</span>
                {isCurrent && <div style={{ width: 6, height: 6, borderRadius: '50%', background: themeColor }} />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT MOBILE PREVIEW CONTAINER ── */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#090b10',
        position: 'relative',
      }}>
        {/* Toast Notification */}
        {toast && (
          <div style={{
            position: 'absolute',
            top: 60,
            zIndex: 1000,
            background: C.card2,
            border: `1px solid ${C.purple}`,
            borderRadius: 20,
            padding: '8px 16px',
            color: C.text,
            fontSize: 12,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            boxShadow: '0 8px 30px rgba(99,102,241,0.3)',
          }}>
            <CheckCircle2 size={14} color={C.green} />
            <span>{toast}</span>
          </div>
        )}

        {/* 📱 Mobile Device Frame Mockup */}
        <div style={{
          width: 390,
          height: 844,
          background: C.bg,
          borderRadius: 44,
          border: '10px solid #1C2130',
          boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
        }}>
          {renderStatusBar()}

          {/* ───────────────── SCREEN CONTROLLER ───────────────── */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            
            {/* 1. Splash Screen */}
            {screen === '01-splash' && (
              <div className="screen-container" style={{ justifyContent: 'space-between', padding: '40px 24px 60px' }}>
                <div />
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
                  <div style={{
                    width: 90, height: 90, borderRadius: 28, background: C.purple,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 30px rgba(99, 102, 241, 0.4)`
                  }}>
                    <Shield size={48} color={C.white} />
                  </div>
                  <h1 style={{ fontSize: 32, fontWeight: 900, color: C.white, margin: 0 }}>SafeRoute</h1>
                  <span style={{ fontSize: 14, color: C.textS, textAlign: 'center' }}>Navigate Safely. Stay Protected.</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: C.purple, fontSize: 18, fontWeight: 800 }}>2.4M+</div>
                      <div style={{ color: C.textS, fontSize: 10 }}>Users Protected</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: C.green, fontSize: 18, fontWeight: 800 }}>99.8%</div>
                      <div style={{ color: C.textS, fontSize: 10 }}>AI Accuracy</div>
                    </div>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ color: C.amber, fontSize: 18, fontWeight: 800 }}>4.9 ★</div>
                      <div style={{ color: C.textS, fontSize: 10 }}>App Rating</div>
                    </div>
                  </div>
                  <button
                    onClick={() => setScreen('02-onboarding')}
                    style={{
                      background: C.purple, border: 'none', color: C.white,
                      height: 52, borderRadius: 26, fontSize: 16, fontWeight: 700,
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            )}

            {/* 2. Onboarding */}
            {screen === '02-onboarding' && (
              <div className="screen-container" style={{ justifyContent: 'space-between', padding: '20px 24px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => setScreen('03-login')} style={{ background: 'none', border: 'none', color: C.textS, fontSize: 14, cursor: 'pointer' }}>Skip</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
                  <div style={{
                    width: 200, height: 200, borderRadius: 100, background: '#131720',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #1c2130',
                    position: 'relative'
                  }}>
                    <div style={{
                      width: 140, height: 140, borderRadius: 70, background: C.purpleD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Zap size={54} color={C.purple} />
                    </div>
                  </div>
                  <div style={{ background: C.purpleD, padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, color: C.purple }}>01 / 03</div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>AI-Powered Risk Assessment</h2>
                  <p style={{ fontSize: 14, color: C.textS, margin: 0, lineHeight: 1.6 }}>
                    Our AI analyzes crime data, street lighting, pedestrian flow, and crowd safety to compute optimal travel paths.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div style={{ width: 16, height: 6, borderRadius: 3, background: C.purple }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: C.border }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: C.border }} />
                  </div>
                  <button
                    onClick={() => setScreen('03-login')}
                    style={{
                      background: C.purple, border: 'none', color: C.white,
                      height: 52, width: '100%', borderRadius: 26, fontSize: 16, fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* 3. Login Screen */}
            {screen === '03-login' && (
              <div className="screen-container" style={{ padding: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '40px 0 30px' }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={24} color={C.white} />
                  </div>
                  <h2 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: 0 }}>Welcome Back</h2>
                  <span style={{ fontSize: 14, color: C.textS }}>Sign in to continue commuting safely</span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
                  <button style={{
                    background: C.card, border: `1px solid ${C.border}`, color: C.text,
                    height: 50, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    gap: 12, fontWeight: 600, cursor: 'pointer'
                  }}>
                    <span style={{ fontSize: 16 }}>G</span> Continue with Google
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                    <span style={{ fontSize: 12, color: C.textM }}>or</span>
                    <div style={{ flex: 1, height: 1, background: C.border }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.textS, display: 'block', marginBottom: 6 }}>EMAIL ADDRESS</label>
                    <input type="text" defaultValue="sahil@example.com" style={{
                      width: '100%', height: 48, background: C.card, border: `1px solid ${C.purple}`,
                      borderRadius: 10, padding: '0 14px', color: C.white, fontSize: 14, boxSizing: 'border-box'
                    }} />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 600, color: C.textS, display: 'block', marginBottom: 6 }}>PASSWORD</label>
                    <input type="password" defaultValue="password123" style={{
                      width: '100%', height: 48, background: C.card, border: `1px solid ${C.border}`,
                      borderRadius: 10, padding: '0 14px', color: C.white, fontSize: 14, boxSizing: 'border-box'
                    }} />
                  </div>
                </div>

                <button
                  onClick={() => {
                    setScreen('04-dashboard');
                    setActiveTab('home');
                    triggerToast('Sign-in successful!');
                  }}
                  style={{
                    background: C.purple, border: 'none', color: C.white,
                    height: 50, borderRadius: 25, fontSize: 15, fontWeight: 700, cursor: 'pointer'
                  }}
                >
                  Sign In
                </button>
              </div>
            )}

            {/* 4. Dashboard */}
            {screen === '04-dashboard' && (
              <div className="screen-container">
                {/* Header */}
                <div style={{ padding: '16px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: 12, color: C.textS }}>Good Evening,</span>
                    <h3 style={{ fontSize: 18, fontWeight: 800, color: C.white, margin: 0 }}>Sahil Kumar</h3>
                  </div>
                  <div style={{ width: 36, height: 36, borderRadius: 18, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>SK</div>
                </div>

                {/* Risk Level Badge */}
                <div style={{ padding: '0 20px 16px' }}>
                  <div style={{
                    background: C.card, border: '1px solid #1c2130', borderRadius: 16, padding: 14,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${C.green}`
                  }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.textS, letterSpacing: 1 }}>CURRENT RISK LEVEL</span>
                      <h4 style={{ fontSize: 20, fontWeight: 900, color: C.green, margin: '2px 0 0' }}>LOW RISK ZONE</h4>
                    </div>
                    <div style={{ background: C.greenD, color: C.green, padding: '6px 12px', borderRadius: 20, fontSize: 12, fontWeight: 700 }}>OK</div>
                  </div>
                </div>

                {/* Mini Interactive Leaflet Map (Attribution control disabled) */}
                <div style={{ flex: 1, position: 'relative', margin: '0 20px', borderRadius: 16, overflow: 'hidden', border: '1px solid #1c2130', minHeight: 160 }}>
                  <MapContainer key="dashboard-map" center={MAP_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(C.green, 'Campus Apt')} />
                  </MapContainer>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: C.bg, padding: '4px 10px', borderRadius: 8, fontSize: 10, border: '1px solid #1c2130' }}>
                    📍 MG Road, Bengaluru
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '20px 20px 10px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: C.textS, margin: '0 0 12px' }}>QUICK ACTIONS</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <button
                      onClick={() => { setScreen('05-navigate'); setActiveTab('navigate'); }}
                      style={{
                        background: C.card, border: '1px solid #1c2130', borderRadius: 12, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', color: C.text
                      }}
                    >
                      <Navigation size={20} color={C.purple} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Navigate</span>
                    </button>
                    <button
                      onClick={() => { setScreen('07-sos-trigger'); setActiveTab('sos'); }}
                      style={{
                        background: C.card, border: '1px solid #1c2130', borderRadius: 12, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', color: C.text
                      }}
                    >
                      <AlertOctagon size={20} color={C.red} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>SOS Alert</span>
                    </button>
                    <button
                      onClick={() => { setScreen('09-hazard-report'); setActiveTab('report'); }}
                      style={{
                        background: C.card, border: '1px solid #1c2130', borderRadius: 12, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, cursor: 'pointer', color: C.text
                      }}
                    >
                      <AlertTriangle size={20} color={C.amber} />
                      <span style={{ fontSize: 11, fontWeight: 600 }}>Report</span>
                    </button>
                  </div>
                </div>

                {/* Recent Routes */}
                <div style={{ padding: '0 20px 16px' }}>
                  <h4 style={{ fontSize: 13, fontWeight: 700, color: C.textS, margin: '0 0 8px' }}>RECENT COMMUTES</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 10, padding: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700 }}>College Dorm ➔ Central Tech Hub</div>
                        <div style={{ fontSize: 10, color: C.textS }}>Last traveled: 2 hours ago</div>
                      </div>
                      <div style={{ color: C.green, fontSize: 12, fontWeight: 700 }}>98% Safe</div>
                    </div>
                  </div>
                </div>

                {renderBottomNav('home')}
              </div>
            )}

            {/* 5. Navigate (Route Selection) */}
            {screen === '05-navigate' && (
              <div className="screen-container">
                {/* Search Bar Panel */}
                <div style={{ padding: '12px 20px', background: C.card, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />
                    <input type="text" readOnly value="My Current Location (GPS)" style={{ flex: 1, background: C.card2, border: 'none', borderRadius: 8, height: 36, padding: '0 12px', color: C.text, fontSize: 13 }} />
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: C.purple }} />
                    <input type="text" readOnly value="Campus Apartment (Dorm)" style={{ flex: 1, background: C.card2, border: 'none', borderRadius: 8, height: 36, padding: '0 12px', color: C.text, fontSize: 13 }} />
                  </div>
                </div>

                {/* Map Route Visualizer (Attribution control disabled) */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key="navigate-routes-map" center={MAP_CENTER} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    
                    {/* Safe Corridor route */}
                    <Polyline positions={SAFE_COORDS} pathOptions={{ color: C.green, weight: 6, opacity: routeType === 'safe' ? 1.0 : 0.4 }} />
                    {/* Alternate Unsafe shortcut route */}
                    <Polyline positions={UNSAFE_COORDS} pathOptions={{ color: C.red, weight: 5, opacity: routeType === 'unsafe' ? 1.0 : 0.4, dashArray: '10 5' }} />

                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(C.green, 'Campus Dorm')} />

                    {/* Hazard warning flag on unsafe path */}
                    {routeType === 'unsafe' && (
                      <Marker position={[12.979, 77.601]} icon={makeHazardMarker('High Crime Zone', C.red)} />
                    )}
                  </MapContainer>

                  {/* Quick toggle banner */}
                  <div style={{ position: 'absolute', top: 12, left: 12, right: 12, zIndex: 1000, display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => setRouteType('safe')}
                      style={{
                        flex: 1, height: 36, borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: routeType === 'safe' ? C.green : C.card, color: routeType === 'safe' ? '#000' : C.text
                      }}
                    >
                      🛡️ Safe Path
                    </button>
                    <button
                      onClick={() => setRouteType('unsafe')}
                      style={{
                        flex: 1, height: 36, borderRadius: 8, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer',
                        background: routeType === 'unsafe' ? C.red : C.card, color: routeType === 'unsafe' ? C.white : C.text
                      }}
                    >
                      ⚠️ Alley Shortcut
                    </button>
                  </div>
                </div>

                {/* Bottom Route Details Card */}
                <div style={{ padding: '16px 20px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <div>
                      <h4 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>
                        {routeType === 'safe' ? 'SafeRoute Corridor' : 'Unsafe Dark Shortcut'}
                      </h4>
                      <span style={{ fontSize: 12, color: C.textS }}>
                        {routeType === 'safe' ? 'Well-lit • Active Pedestrians • CCTV' : 'Dim Alley • Unmonitored • Isolated'}
                      </span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 16, fontWeight: 800, color: routeType === 'safe' ? C.green : C.red }}>
                        {routeType === 'safe' ? '98% Safe' : '38% Risky'}
                      </div>
                      <span style={{ fontSize: 11, color: C.textS }}>
                        {routeType === 'safe' ? '24 Min • 3.2 km' : '14 Min • 1.8 km'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => setScreen('06-active-nav')}
                    style={{
                      width: '100%', height: 50, borderRadius: 25, border: 'none',
                      background: routeType === 'safe' ? C.green : C.red,
                      color: routeType === 'safe' ? '#000' : C.white,
                      fontSize: 15, fontWeight: 800, cursor: 'pointer',
                      boxShadow: `0 4px 15px ${routeType === 'safe' ? C.greenD : C.redD}`
                    }}
                  >
                    Start Navigation
                  </button>
                </div>

                {renderBottomNav('navigate')}
              </div>
            )}

            {/* 6. Active Navigation */}
            {screen === '06-active-nav' && (
              <div className="screen-container">
                {/* HUD Banner */}
                <div style={{
                  padding: '12px 18px', background: C.card, borderBottom: `1px solid ${C.border}`,
                  display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <Navigation size={18} color={C.green} style={{ transform: 'rotate(45deg)' }} />
                    <div>
                      <h4 style={{ margin: 0, fontSize: 14, fontWeight: 800 }}>Turn left on MG Road</h4>
                      <span style={{ fontSize: 11, color: C.textS }}>In 150 meters</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setScreen('11-summary')}
                    style={{
                      background: C.redD, border: `1px solid ${C.red}`, color: C.red,
                      padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    End Trip
                  </button>
                </div>

                {/* Map with current route (Attribution control disabled) */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key="active-navigation-map" center={MAP_CENTER} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    <Polyline positions={SAFE_COORDS} pathOptions={{ color: C.green, weight: 6 }} />
                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(C.green, 'Dest')} />
                  </MapContainer>

                  {/* Safety Corridor alert */}
                  <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, zIndex: 1000 }}>
                    <div style={{
                      background: 'rgba(19, 23, 32, 0.95)', border: `1px solid ${C.green}`, borderRadius: 12, padding: 12,
                      display: 'flex', alignItems: 'center', gap: 10
                    }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green, boxShadow: `0 0 6px ${C.green}` }} />
                      <span style={{ fontSize: 12, fontWeight: 600 }}>Active Safety Corridor: Well-lit area</span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div style={{ padding: '12px 20px', display: 'flex', justifyItems: 'center', justifyContent: 'space-between', gap: 10, background: C.bg }}>
                  <button
                    onClick={() => triggerToast('GPS coordinates broadcasted to emergency list!')}
                    style={{
                      flex: 1, height: 44, borderRadius: 22, background: C.card2, border: `1px solid ${C.border}`,
                      color: C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    📡 Share GPS
                  </button>
                  <button
                    onClick={() => setScreen('07-sos-trigger')}
                    style={{
                      flex: 1, height: 44, borderRadius: 22, background: C.red, border: 'none',
                      color: C.white, fontSize: 13, fontWeight: 800, cursor: 'pointer',
                      boxShadow: `0 4px 12px ${C.redD}`
                    }}
                  >
                    🚨 SOS TRIGGER
                  </button>
                </div>
              </div>
            )}

            {/* 7. SOS Trigger Screen (Identical to Figma Design) */}
            {screen === '07-sos-trigger' && (
              <div className="screen-container" style={{ background: C.bg, justifyContent: 'space-between' }}>
                {/* Top Warning Strip */}
                <div style={{ background: C.redD, padding: '12px 0', textAlign: 'center', borderBottom: `1px solid ${C.red}`, flexShrink: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 800, color: C.red, letterSpacing: 2 }}>⚠️ EMERGENCY MODE</span>
                </div>

                {/* Text description */}
                <div style={{ padding: '20px 24px 0', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: 0 }}>Emergency SOS</h2>
                  <span style={{ fontSize: 14, color: C.textS }}>Hold button 3 seconds to trigger</span>
                </div>

                {/* Pulsing button */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 230, position: 'relative' }}>
                  {/* Outer Rings */}
                  <div style={{ position: 'absolute', width: 228, height: 228, borderRadius: '50%', background: C.redD, opacity: 0.15, animation: 'sosRing 2.2s infinite' }} />
                  <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: C.redD, opacity: 0.3, animation: 'sosRing 1.6s infinite' }} />
                  
                  {/* Center Solid Button */}
                  <button
                    onClick={() => setScreen('08-sos-activated')}
                    style={{
                      position: 'absolute', width: 136, height: 136, borderRadius: '50%', background: C.red,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer', boxShadow: '0 0 35px rgba(239,68,68,0.7)',
                      animation: 'sosPulse 1.6s infinite'
                    }}
                  >
                    <span style={{ color: C.white, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>SOS</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 700, letterSpacing: 2, marginTop: 4 }}>HOLD</span>
                  </button>
                </div>

                {/* Countdown display */}
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 100, height: 90, borderRadius: 45, background: C.card, border: `1.5px solid ${C.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: C.red, lineHeight: 1 }}>{sosCountdown}</span>
                    <span style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>seconds</span>
                  </div>
                </div>

                {/* Cancel Button */}
                <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
                  <button
                    onClick={() => setScreen('04-dashboard')}
                    style={{
                      width: 170, height: 44, borderRadius: 22, background: C.card2, border: `1.5px solid ${C.border}`,
                      color: C.text, fontSize: 14, fontWeight: 600, cursor: 'pointer',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
                    }}
                  >
                    ✕  Cancel SOS
                  </button>
                </div>

                {/* Contacts Preview section */}
                <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textS }}>Will alert your contacts:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.border}`, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 14, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700, fontSize: 11 }}>M</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Mom - Priya Kumar</div>
                          <div style={{ fontSize: 10, color: C.textS }}>+91 98765 00001</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', border: `1.5px solid ${C.border}`, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 14, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700, fontSize: 11 }}>D</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>Dad - Rajesh Kumar</div>
                          <div style={{ fontSize: 10, color: C.textS }}>+91 98765 00002</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: C.purple, fontSize: 13, fontWeight: 600, cursor: 'pointer', textAlign: 'center', marginTop: 4 }}>
                    + Add Emergency Contact
                  </button>
                </div>
              </div>
            )}

            {/* 8. SOS Activated Screen (Identical to Figma Design) */}
            {screen === '08-sos-activated' && (
              <div className="screen-container" style={{ background: C.bg, justifyContent: 'space-between', padding: '0 24px 40px' }}>
                {/* Red warning header */}
                <div style={{
                  width: '100%', padding: '32px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.15), transparent)'
                }}>
                  {/* Warning emblem */}
                  <div style={{
                    width: 76, height: 76, borderRadius: 38, background: C.redD, border: `3px solid ${C.red}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: C.white, fontFamily: 'Inter' }}>!</span>
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: C.red, margin: 0, letterSpacing: 3 }}>ALERT SENT</h1>
                  <span style={{ fontSize: 15, color: C.textS, textAlign: 'center', whiteSpace: 'pre-line' }}>
                    {`Emergency contacts notified\nand authorities alerted`}
                  </span>
                </div>

                {/* Live location share status card */}
                <div style={{
                  background: C.card, borderLeft: `3px solid ${C.green}`, borderRadius: 14, padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12, border: `1.5px solid ${C.border}`, borderLeft: `3px solid ${C.green}`
                }}>
                  {/* Blinking green dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, background: C.green,
                    boxShadow: `0 0 8px ${C.green}`, animation: 'liveDot 1.2s infinite'
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>Live location is being shared</div>
                    <div style={{ fontSize: 12, color: C.green, fontWeight: 600, marginTop: 2 }}>Updated every 10 seconds</div>
                  </div>
                </div>

                {/* Dispatch timeline logs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: C.textS }}>Contacts Notified:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.border}`, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>M</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Mom - Priya Kumar</div>
                          <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Notified · 0s ago</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.border}`, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>D</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Dad - Rajesh Kumar</div>
                          <div style={{ fontSize: 12, color: C.green, fontWeight: 600 }}>Notified · 2s ago</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', border: `1.5px solid ${C.border}`, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>P</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Police Control Room</div>
                          <div style={{ fontSize: 12, color: C.amber, fontWeight: 600 }}>Alert Sent · Auto</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cancel button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => {
                      setScreen('04-dashboard');
                      setActiveTab('home');
                      triggerToast('SOS alert cancelled successfully.');
                    }}
                    style={{
                      height: 52, borderRadius: 26, border: 'none', background: C.card2, border: `1.5px solid ${C.border}`,
                      color: C.text, fontSize: 15, fontWeight: 700, cursor: 'pointer',
                      boxShadow: '0 4px 15px rgba(0,0,0,0.3)'
                    }}
                  >
                    I'm Safe - Cancel SOS
                  </button>
                  <span style={{ fontSize: 13, color: C.textS, textAlign: 'center' }}>SOS active for 00:45</span>
                </div>
              </div>
            )}

            {/* 9. Hazard Report Screen */}
            {screen === '09-hazard-report' && (
              <div className="screen-container" style={{ padding: 24, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <h3 style={{ fontSize: 18, fontWeight: 800, color: C.white, margin: 0 }}>Report Hazard</h3>

                  {/* Photo upload box */}
                  <div style={{
                    height: 120, background: C.card, border: `2px dashed ${C.border}`, borderRadius: 12,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                  }}>
                    <Camera size={24} color={C.textS} />
                    <span style={{ fontSize: 12, color: C.textS }}>Tap to attach photo</span>
                  </div>

                  {/* Category selector */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textS, display: 'block', marginBottom: 8 }}>HAZARD TYPE</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                      {['Poor Lighting', 'Suspicious Person', 'Broken Road', 'Flooding'].map(type => {
                        const isSel = selectedReportType === type;
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedReportType(type)}
                            style={{
                              height: 38, borderRadius: 8, border: `1.5px solid ${isSel ? C.purple : C.border}`,
                              background: isSel ? C.purpleD : C.card, color: isSel ? C.white : C.textS,
                              fontSize: 12, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Severity selector */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textS, display: 'block', marginBottom: 8 }}>SEVERITY LEVEL</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                      {['Low', 'Medium', 'High'].map(sev => {
                        const isSel = reportSeverity === sev;
                        let sColor = C.green;
                        if (sev === 'Medium') sColor = C.amber;
                        if (sev === 'High') sColor = C.red;

                        return (
                          <button
                            key={sev}
                            onClick={() => setReportSeverity(sev)}
                            style={{
                              flex: 1, height: 36, borderRadius: 8, border: `1.5px solid ${isSel ? sColor : C.border}`,
                              background: isSel ? `${sColor}20` : C.card, color: isSel ? C.white : C.textS,
                              fontSize: 12, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {sev}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 700, color: C.textS, display: 'block', marginBottom: 8 }}>DESCRIPTION</label>
                    <textarea
                      placeholder="Add auxiliary details here..."
                      value={reportDesc}
                      onChange={e => setReportDesc(e.target.value)}
                      style={{
                        width: '100%', height: 70, background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 10, padding: 12, color: C.white, fontSize: 13, outline: 'none',
                        resize: 'none', boxSizing: 'border-box'
                      }}
                    />
                  </div>
                </div>

                <button
                  onClick={() => {
                    const newH = {
                      id: Date.now(),
                      pos: [12.978 + (Math.random() - 0.5) * 0.01, 77.602 + (Math.random() - 0.5) * 0.01],
                      label: selectedReportType,
                      type: selectedReportType.toLowerCase().includes('light') ? 'lighting' : 'other',
                      severity: reportSeverity.toLowerCase()
                    };
                    setHazards(prev => [...prev, newH]);
                    setScreen('10-community-map');
                    setReportDesc('');
                    triggerToast('Incident reported successfully!');
                  }}
                  style={{
                    height: 50, borderRadius: 25, border: 'none', background: C.amber, color: '#000',
                    fontSize: 15, fontWeight: 800, cursor: 'pointer'
                  }}
                >
                  Publish Report
                </button>
              </div>
            )}

            {/* 10. Community Map */}
            {screen === '10-community-map' && (
              <div className="screen-container">
                {/* Header info */}
                <div style={{ padding: '12px 18px', background: C.card, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
                  <h3 style={{ margin: 0, fontSize: 15, fontWeight: 800 }}>Community Safety Map</h3>
                  <span style={{ fontSize: 11, color: C.textS }}>{hazards.length} alerts near you</span>
                </div>

                {/* Map showing all reports (Attribution control disabled) */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key="community-map" center={MAP_CENTER} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    {hazards.map(h => (
                      <Marker key={h.id} position={h.pos} icon={makeHazardMarker(h.label, h.severity === 'high' ? C.red : C.amber)} />
                    ))}
                    <Marker position={ORIGIN} icon={youIcon} />
                  </MapContainer>

                  {/* Floating map controls to reset/add */}
                  <button
                    onClick={() => { setScreen('09-hazard-report'); }}
                    style={{
                      position: 'absolute', bottom: 20, right: 20, zIndex: 1000,
                      width: 50, height: 50, borderRadius: 25, background: C.purple, border: 'none',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.white,
                      boxShadow: '0 4px 15px rgba(99,102,241,0.5)', cursor: 'pointer'
                    }}
                  >
                    <Plus size={20} />
                  </button>
                </div>

                {renderBottomNav('report')}
              </div>
            )}

            {/* 11. Route Summary */}
            {screen === '11-summary' && (
              <div className="screen-container" style={{ padding: 24, justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 20 }}>
                  <div style={{
                    width: 60, height: 60, borderRadius: 30, background: C.greenD,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <CheckCircle2 size={36} color={C.green} />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 24, fontWeight: 800, color: C.white, margin: '0 0 4px' }}>Arrived Safely!</h2>
                    <span style={{ fontSize: 13, color: C.textS }}>Trip ended • Jul 21, 2026</span>
                  </div>

                  {/* Safety Score gauge */}
                  <div style={{
                    width: 120, height: 120, borderRadius: 60, border: `6px solid ${C.green}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    background: C.card, boxShadow: `0 0 20px ${C.greenD}`
                  }}>
                    <span style={{ fontSize: 32, fontWeight: 900, color: C.green }}>96</span>
                    <span style={{ fontSize: 10, color: C.textS }}>Safety Score</span>
                  </div>

                  {/* Stats Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, width: '100%' }}>
                    {[
                      { val: '4.2 km', label: 'Distance Traveled' },
                      { val: '28 min', label: 'Travel Duration' },
                      { val: '97%', label: 'Lit Corridor Ratio' },
                      { val: '0', label: 'Alerts Triggered' },
                    ].map((st, idx) => (
                      <div key={idx} style={{ background: C.card, padding: 12, borderRadius: 10, border: '1px solid #1c2130' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: C.white }}>{st.val}</div>
                        <div style={{ fontSize: 10, color: C.textS }}>{st.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center', alignItems: 'center' }}>
                    <span style={{ fontSize: 12, color: C.textS }}>Rate this route:</span>
                    <div style={{ display: 'flex', gap: 4 }}>
                      {[1, 2, 3, 4, 5].map(star => (
                        <Star key={star} size={14} fill={star <= 4 ? C.amber : 'none'} color={C.amber} />
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => { setScreen('04-dashboard'); setActiveTab('home'); }}
                    style={{
                      height: 50, borderRadius: 25, border: 'none', background: C.purple, color: C.white,
                      fontSize: 15, fontWeight: 800, cursor: 'pointer'
                    }}
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            )}

            {/* 12. Profile Screen */}
            {screen === '12-profile' && (
              <div className="screen-container">
                <div style={{ padding: '24px 20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 80, height: 80, borderRadius: 40, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 800 }}>SK</div>
                  <div style={{ textAlign: 'center' }}>
                    <h3 style={{ margin: '0 0 2px', fontSize: 20, fontWeight: 800 }}>Sahil Kumar</h3>
                    <span style={{ fontSize: 13, color: C.textS }}>sahil@example.com</span>
                  </div>
                  <div style={{ background: C.purpleD, color: C.purple, padding: '4px 12px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>
                    ✓ Verified Commuter
                  </div>
                </div>

                {/* Profile metrics */}
                <div style={{ display: 'flex', justifyContent: 'space-around', padding: '10px 20px', borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, flexShrink: 0 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>47</div>
                    <div style={{ fontSize: 10, color: C.textS }}>Safe Journeys</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>96%</div>
                    <div style={{ fontSize: 10, color: C.textS }}>Avg Safety Score</div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 16, fontWeight: 800 }}>2</div>
                    <div style={{ fontSize: 10, color: C.textS }}>Safety Contacts</div>
                  </div>
                </div>

                {/* Settings list */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textM, letterSpacing: 1 }}>EMERGENCY CONTACTS</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0 20px' }}>
                    <div style={{ background: C.card, padding: 12, borderRadius: 10, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Mom (Priya Kumar)</div>
                        <div style={{ fontSize: 11, color: C.textS }}>+91 98765 00001</div>
                      </div>
                      <span>⚙️</span>
                    </div>
                    <div style={{ background: C.card, padding: 12, borderRadius: 10, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600 }}>Dad (Rajesh Kumar)</div>
                        <div style={{ fontSize: 11, color: C.textS }}>+91 98765 00002</div>
                      </div>
                      <span>⚙️</span>
                    </div>
                  </div>

                  <span style={{ fontSize: 10, fontWeight: 700, color: C.textM, letterSpacing: 1 }}>PREFERENCES</span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, margin: '8px 0' }}>
                    <div style={{ background: C.card, padding: 12, borderRadius: 10, display: 'flex', justifyItems: 'center', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span>Automatic SOS Countdown</span>
                      <span style={{ color: C.purple, fontWeight: 700 }}>ON</span>
                    </div>
                    <button
                      onClick={() => { setScreen('01-splash'); triggerToast('Signed out.'); }}
                      style={{
                        width: '100%', height: 44, borderRadius: 10, background: C.redD, border: `1px solid ${C.red}`,
                        color: C.red, fontSize: 13, fontWeight: 700, cursor: 'pointer', marginTop: 12
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>

                {renderBottomNav('profile')}
              </div>
            )}

          </div>

          {/* Home indicator bar */}
          <div style={{
            height: 24, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderTop: screen === '01-splash' || screen === '02-onboarding' || screen === '03-login' || screen === '07-sos-trigger' || screen === '08-sos-activated' || screen === '11-summary' ? 'none' : `1px solid ${C.border}`
          }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: C.border }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePrototype;
