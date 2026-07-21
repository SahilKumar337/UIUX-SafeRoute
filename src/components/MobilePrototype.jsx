import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Shield, ChevronLeft, AlertTriangle, Send, CheckCircle2,
  Volume2, Navigation, X, Home, MapPin, AlertOctagon,
  User, Settings, Star, Heart, Activity, Camera, Eye, Zap,
  Plus, ChevronRight
} from 'lucide-react';

/* ── Fix Leaflet default icons ── */
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

/* ─────────────── Design Tokens (1-to-1 Figma Token System) ─────────────── */
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
  const [screenHistory, setScreenHistory] = useState(['01-splash']);
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

  // Navigation push function
  const navigateTo = (nextScreen) => {
    setScreenHistory(prev => [...prev, nextScreen]);
    setScreen(nextScreen);
  };

  // Back button pop function
  const goBack = () => {
    if (screenHistory.length > 1) {
      const newHistory = [...screenHistory];
      newHistory.pop();
      const prevScreen = newHistory[newHistory.length - 1];
      setScreenHistory(newHistory);
      setScreen(prevScreen);
    } else {
      navigateTo('04-dashboard');
    }
  };

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
        navigateTo('08-sos-activated');
      }
    } else {
      setSosCountdown(3);
    }
    return () => clearInterval(interval);
  }, [screen, sosCountdown]);

  // Bottom Navigation helper matching Figma 1-to-1
  const renderBottomNav = (currentTab) => {
    const tabs = [
      { id: 'home', icon: 'H', label: 'Home', screenId: '04-dashboard' },
      { id: 'navigate', icon: 'N', label: 'Navigate', screenId: '05-navigate' },
      { id: 'sos', icon: 'S', label: 'SOS', screenId: '07-sos-trigger' },
      { id: 'report', icon: '!', label: 'Report', screenId: '09-hazard-report' },
      { id: 'profile', icon: 'P', label: 'Profile', screenId: '12-profile' },
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
        flexShrink: 0,
        userSelect: 'none',
      }}>
        {tabs.map((t) => {
          const isActive = currentTab === t.id;
          const col = isActive ? C.purple : C.textM;
          return (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id);
                navigateTo(t.screenId);
              }}
              style={{
                background: 'none',
                border: 'none',
                color: col,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                flex: 1,
              }}
            >
              <div style={{
                width: 42,
                height: 28,
                borderRadius: 14,
                background: isActive ? C.purpleD : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 15,
                fontWeight: isActive ? 900 : 700,
                color: col,
              }}>
                {t.icon}
              </div>
              <span style={{ fontSize: 9, fontWeight: isActive ? 600 : 400, color: col }}>{t.label}</span>
            </button>
          );
        })}
      </div>
    );
  };

  // Status Bar Mockup matching Figma
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
      flexShrink: 0,
    }}>
      <span>9:41</span>
      <div style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 10 }}>
        <span>... WiFi 100%</span>
      </div>
    </div>
  );

  // Common Header with Back Button
  const renderHeader = (title, showBack = true, onBackClick = goBack) => (
    <div style={{
      padding: '14px 18px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: C.bg,
      borderBottom: `1px solid ${C.border}`,
      flexShrink: 0,
    }}>
      {showBack ? (
        <button
          onClick={onBackClick}
          style={{
            background: 'none',
            border: 'none',
            color: C.textS,
            fontSize: 14,
            fontWeight: 500,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            padding: 0,
          }}
        >
          <span>‹ Back</span>
        </button>
      ) : <div style={{ width: 45 }} />}
      
      <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0, textAlign: 'center' }}>{title}</h3>
      <div style={{ width: 45 }} />
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
          animation: screenFade 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        /* Hide all native browser scrollbars for clean aesthetic */
        ::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        * {
          scrollbar-width: none !important;
          -ms-overflow-style: none !important;
        }
        .leaflet-control-attribution {
          display: none !important;
        }
        button {
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
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
          Jump between the 12 screens directly using this navigator panel or interact with the mockup container on the right.
        </p>

        <h3 style={{ fontSize: 10, fontWeight: 700, color: C.textM, letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 12 }}>
          Figma Screen Architecture
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
                  navigateTo(s.id);
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
                    width: 110, height: 110, borderRadius: 55, background: C.purple,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: `0 8px 40px rgba(99, 102, 241, 0.4)`
                  }}>
                    <span style={{ fontSize: 48, fontWeight: 900, color: C.white }}>S</span>
                  </div>
                  <h1 style={{ fontSize: 34, fontWeight: 900, color: C.white, margin: 0 }}>SafeRoute</h1>
                  <span style={{ fontSize: 15, color: C.textS, textAlign: 'center' }}>Navigate Safely. Stay Protected.</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 10px' }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', textAlign: 'center', flex: 1, margin: '0 4px' }}>
                      <div style={{ color: C.purple, fontSize: 18, fontWeight: 800 }}>2.4M+</div>
                      <div style={{ color: C.textS, fontSize: 10, marginTop: 2 }}>Users Safe</div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', textAlign: 'center', flex: 1, margin: '0 4px' }}>
                      <div style={{ color: C.green, fontSize: 18, fontWeight: 800 }}>99.8%</div>
                      <div style={{ color: C.textS, fontSize: 10, marginTop: 2 }}>Accuracy</div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', textAlign: 'center', flex: 1, margin: '0 4px' }}>
                      <div style={{ color: C.amber, fontSize: 18, fontWeight: 800 }}>4.9 ★</div>
                      <div style={{ color: C.textS, fontSize: 10, marginTop: 2 }}>App Rating</div>
                    </div>
                  </div>
                  <button
                    onClick={() => navigateTo('02-onboarding')}
                    style={{
                      background: C.purple, border: 'none', color: C.white,
                      height: 52, borderRadius: 26, fontSize: 16, fontWeight: 700,
                      cursor: 'pointer', boxShadow: '0 4px 16px rgba(99,102,241,0.3)'
                    }}
                  >
                    Get Started
                  </button>
                  <button
                    onClick={() => navigateTo('03-login')}
                    style={{ background: 'none', border: 'none', color: C.textS, fontSize: 13, cursor: 'pointer', textAlign: 'center' }}
                  >
                    Already have an account? <span style={{ color: C.purple, fontWeight: 600 }}>Sign In</span>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Onboarding */}
            {screen === '02-onboarding' && (
              <div className="screen-container" style={{ justifyContent: 'space-between', padding: '20px 24px 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button onClick={() => navigateTo('03-login')} style={{ background: 'none', border: 'none', color: C.textS, fontSize: 14, cursor: 'pointer', fontWeight: 500 }}>Skip</button>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 24 }}>
                  <div style={{
                    width: 260, height: 260, borderRadius: 20, background: C.card,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', border: `1px solid ${C.border}`,
                    position: 'relative'
                  }}>
                    <div style={{
                      width: 140, height: 140, borderRadius: 70, background: C.purpleD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 60, height: 60, borderRadius: 30, background: C.purple,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: C.white, fontSize: 20, fontWeight: 800
                      }}>AI</div>
                    </div>
                  </div>
                  <div style={{ background: C.purpleD, padding: '4px 14px', borderRadius: 14, fontSize: 11, fontWeight: 700, color: C.purple }}>01 / 03</div>
                  <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: 0, lineHeight: 1.2 }}>AI-Powered{'\n'}Risk Assessment</h2>
                  <p style={{ fontSize: 14, color: C.textS, margin: 0, lineHeight: 1.6 }}>
                    Our AI analyzes crime data, lighting, crowd density, and real-time incidents before you step out.
                  </p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <div style={{ width: 12, height: 6, borderRadius: 3, background: C.purple }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: C.textM }} />
                    <div style={{ width: 6, height: 6, borderRadius: 3, background: C.textM }} />
                  </div>
                  <button
                    onClick={() => navigateTo('03-login')}
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
              <div className="screen-container" style={{ padding: '30px 24px 40px', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, margin: '20px 0 24px' }}>
                    <div style={{ width: 72, height: 72, borderRadius: 36, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 28, fontWeight: 900, color: C.white }}>S</span>
                    </div>
                    <h2 style={{ fontSize: 26, fontWeight: 800, color: C.white, margin: 0 }}>Welcome Back</h2>
                    <span style={{ fontSize: 15, color: C.textS }}>Sign in to continue safely</span>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 20 }}>
                    <button style={{
                      background: C.card2, border: `1px solid ${C.border}`, color: C.text,
                      height: 52, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      gap: 12, fontWeight: 600, cursor: 'pointer', fontSize: 15
                    }}>
                      <span style={{ fontSize: 18, color: C.red, fontWeight: 800 }}>G</span> Continue with Google
                    </button>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                      <span style={{ fontSize: 13, color: C.textM }}>or</span>
                      <div style={{ flex: 1, height: 1, background: C.border }} />
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textS, display: 'block', marginBottom: 6 }}>Email Address</label>
                      <div style={{ background: C.card, border: `1px solid ${C.purple}`, borderRadius: 10, height: 50, borderLeft: `3px solid ${C.purple}`, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <span style={{ color: C.textS, fontSize: 14 }}>sahil@example.com</span>
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: 11, fontWeight: 600, color: C.textS, display: 'block', marginBottom: 6 }}>Password</label>
                      <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, height: 50, display: 'flex', alignItems: 'center', padding: '0 14px' }}>
                        <span style={{ color: C.textS, fontSize: 14 }}>* * * * * * * * * *</span>
                      </div>
                      <div style={{ textAlign: 'right', marginTop: 6 }}>
                        <span style={{ fontSize: 13, color: C.purple, cursor: 'pointer', fontWeight: 500 }}>Forgot password?</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      navigateTo('04-dashboard');
                      setActiveTab('home');
                      triggerToast('Sign-in successful!');
                    }}
                    style={{
                      background: C.purple, border: 'none', color: C.white,
                      height: 52, width: '100%', borderRadius: 26, fontSize: 16, fontWeight: 700, cursor: 'pointer'
                    }}
                  >
                    Sign In
                  </button>
                  <div style={{ textAlign: 'center', marginTop: 14 }}>
                    <span style={{ fontSize: 13, color: C.textS }}>Don't have an account? </span>
                    <span onClick={() => navigateTo('04-dashboard')} style={{ fontSize: 13, color: C.purple, fontWeight: 600, cursor: 'pointer' }}>Create Account</span>
                  </div>
                </div>

                <div style={{ textAlign: 'center', fontSize: 11, color: C.textM }}>
                  By signing in, you agree to Terms & Privacy Policy
                </div>
              </div>
            )}

            {/* 4. Dashboard */}
            {screen === '04-dashboard' && (
              <div className="screen-container">
                {/* Header */}
                <div style={{ padding: '16px 20px 10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Good Evening, Sahil</h3>
                  <div style={{ width: 40, height: 40, borderRadius: 20, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textS, fontSize: 16, fontWeight: 700 }}>o</div>
                </div>

                {/* Risk Level Badge */}
                <div style={{ padding: '0 20px 14px' }}>
                  <div style={{
                    background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: '14px 16px',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${C.green}`
                  }}>
                    <div>
                      <span style={{ fontSize: 10, fontWeight: 700, color: C.textS, letterSpacing: 1 }}>CURRENT SAFETY LEVEL</span>
                      <h4 style={{ fontSize: 22, fontWeight: 900, color: C.green, margin: '2px 0 0', letterSpacing: 1 }}>LOW RISK</h4>
                      <span style={{ fontSize: 13, color: C.textS }}>Your area is currently safe</span>
                    </div>
                    <div style={{ width: 56, height: 56, borderRadius: 28, background: C.greenD, color: C.green, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>OK</div>
                  </div>
                </div>

                {/* Mini Interactive Leaflet Map */}
                <div style={{ flex: 1, position: 'relative', margin: '0 20px', borderRadius: 16, overflow: 'hidden', border: `1px solid ${C.border}`, minHeight: 160 }}>
                  <MapContainer key="dashboard-map" center={MAP_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(C.green, 'Campus Apt')} />
                  </MapContainer>
                  <div style={{ position: 'absolute', bottom: 10, left: 10, zIndex: 1000, background: 'rgba(11,14,20,0.85)', padding: '4px 10px', borderRadius: 8, fontSize: 11, border: `1px solid ${C.border}` }}>
                    o Your Location
                  </div>
                </div>

                {/* Quick Actions */}
                <div style={{ padding: '16px 20px 10px' }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 10px' }}>Quick Actions</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                    <button
                      onClick={() => { navigateTo('05-navigate'); setActiveTab('navigate'); }}
                      style={{
                        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, cursor: 'pointer', color: C.text
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: C.purpleD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontSize: 16, fontWeight: 800 }}>*</div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Navigate</span>
                      <span style={{ fontSize: 10, color: C.textS }}>Plan route</span>
                    </button>
                    <button
                      onClick={() => { navigateTo('07-sos-trigger'); setActiveTab('sos'); }}
                      style={{
                        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, cursor: 'pointer', color: C.text
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: C.redD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.red, fontSize: 16, fontWeight: 800 }}>*</div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>SOS Alert</span>
                      <span style={{ fontSize: 10, color: C.textS }}>Emergency</span>
                    </button>
                    <button
                      onClick={() => { navigateTo('09-hazard-report'); setActiveTab('report'); }}
                      style={{
                        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 12,
                        display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 4, cursor: 'pointer', color: C.text
                      }}
                    >
                      <div style={{ width: 36, height: 36, borderRadius: 18, background: C.amberD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.amber, fontSize: 16, fontWeight: 800 }}>*</div>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>Report</span>
                      <span style={{ fontSize: 10, color: C.textS }}>Add hazard</span>
                    </button>
                  </div>
                </div>

                {/* Recent Routes */}
                <div style={{ padding: '0 20px 14px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: 0 }}>Recent Routes</h4>
                    <span style={{ fontSize: 12, color: C.purple, fontWeight: 500, cursor: 'pointer' }}>See all</span>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 40, height: 40, borderRadius: 20, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, fontWeight: 800, fontSize: 16 }}>H</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Home - College</div>
                          <div style={{ fontSize: 12, color: C.textS }}>22 min · Safety 98%</div>
                        </div>
                      </div>
                      <div style={{ background: C.greenD, color: C.green, padding: '4px 10px', borderRadius: 13, fontSize: 12, fontWeight: 600 }}>98%</div>
                    </div>
                  </div>
                </div>

                {renderBottomNav('home')}
              </div>
            )}

            {/* 5. Navigate (Route Selection) */}
            {screen === '05-navigate' && (
              <div className="screen-container">
                {renderHeader('Plan Route', true, () => navigateTo('04-dashboard'))}

                {/* Search Bar Panel */}
                <div style={{ padding: '12px 20px', background: C.bg, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: C.greenD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.green, fontSize: 10, fontWeight: 800 }}>o</div>
                    <span style={{ fontSize: 14, color: C.textS }}>Current Location (GPS)</span>
                  </div>
                  <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10, border: `1px solid ${C.purple}` }}>
                    <div style={{ width: 10, height: 10, borderRadius: 5, background: C.purpleD, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontSize: 10, fontWeight: 800 }}>v</div>
                    <span style={{ fontSize: 14, color: C.white, fontWeight: 600 }}>Campus Apartment (Dormitory)</span>
                  </div>
                </div>

                {/* Map Route Visualizer */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key="navigate-routes-map" center={MAP_CENTER} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    <Polyline positions={SAFE_COORDS} pathOptions={{ color: C.green, weight: 6, opacity: routeType === 'safe' ? 1.0 : 0.4 }} />
                    <Polyline positions={UNSAFE_COORDS} pathOptions={{ color: C.red, weight: 5, opacity: routeType === 'unsafe' ? 1.0 : 0.4, dashArray: '10 5' }} />
                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(C.green, 'Campus Dorm')} />

                    {/* Warning pin on red line */}
                    {routeType === 'unsafe' && (
                      <Marker position={[12.979, 77.601]} icon={makeHazardMarker('High Crime Alley', C.red)} />
                    )}
                  </MapContainer>
                </div>

                {/* Recommended Routes Section matching Figma 1-to-1 */}
                <div style={{ padding: '14px 20px', background: C.bg, display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                  <h4 style={{ fontSize: 14, fontWeight: 700, color: C.text, margin: '0 0 2px' }}>Recommended Routes</h4>
                  
                  {/* Route option 1: SafeRoute */}
                  <div
                    onClick={() => setRouteType('safe')}
                    style={{
                      background: C.card, borderRadius: 14, padding: '14px 16px',
                      border: `1.5px solid ${routeType === 'safe' ? C.green : C.border}`,
                      display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>SafeRoute</span>
                        <span style={{ background: C.greenD, color: C.green, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>94% Safe</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>35 <span style={{ fontSize: 12, fontWeight: 500 }}>min</span></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: C.textS }}>💡 Lit streets · Open stores · CCTV cameras</span>
                      <span style={{ fontSize: 11, color: C.textS, fontWeight: 500 }}>2.9 km</span>
                    </div>
                  </div>

                  {/* Route option 2: Shortest Route (Red / Unsafe) */}
                  <div
                    onClick={() => setRouteType('unsafe')}
                    style={{
                      background: C.card, borderRadius: 14, padding: '14px 16px',
                      border: `1.5px solid ${routeType === 'unsafe' ? C.red : C.border}`,
                      display: 'flex', flexDirection: 'column', gap: 6, cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Shortest Route</span>
                        <span style={{ background: C.redD, color: C.red, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 700 }}>38% Safe</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span style={{ fontSize: 18, fontWeight: 800, color: C.text }}>26 <span style={{ fontSize: 12, fontWeight: 500 }}>min</span></span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 11, color: C.red, opacity: 0.9 }}>⚠️ Dim alleys · No CCTV · Low footfall</span>
                      <span style={{ fontSize: 11, color: C.textS, fontWeight: 500 }}>2.2 km</span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateTo('06-active-nav')}
                    style={{
                      width: '100%', height: 50, borderRadius: 25, border: 'none',
                      background: routeType === 'safe' ? C.purple : C.red, color: C.white,
                      fontSize: 15, fontWeight: 700, cursor: 'pointer', marginTop: 4, flexShrink: 0
                    }}
                  >
                    {routeType === 'safe' ? 'Start Safe Navigation' : '⚠️ Proceed via Shortest Route'}
                  </button>
                </div>

                {renderBottomNav('navigate')}
              </div>
            )}

            {/* 6. Active Navigation */}
            {screen === '06-active-nav' && (
              <div className="screen-container">
                {/* Map full screen background */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key={`active-nav-map-${routeType}`} center={MAP_CENTER} zoom={15} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    {routeType === 'safe' ? (
                      <Polyline positions={SAFE_COORDS} pathOptions={{ color: C.green, weight: 6 }} />
                    ) : (
                      <>
                        <Polyline positions={UNSAFE_COORDS} pathOptions={{ color: C.red, weight: 6, dashArray: '10 5' }} />
                        <Marker position={[12.979, 77.601]} icon={makeHazardMarker('High Crime Alley', C.red)} />
                      </>
                    )}
                    <Marker position={ORIGIN} icon={youIcon} />
                    <Marker position={DEST} icon={makeMarker(routeType === 'safe' ? C.green : C.red, 'Campus Dorm')} />
                  </MapContainer>

                  {/* Navigating Tag */}
                  <div style={{ position: 'absolute', top: 12, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', padding: '0 20px', zIndex: 1000 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1.5, color: C.white, background: routeType === 'safe' ? 'rgba(0,0,0,0.6)' : 'rgba(239,68,68,0.9)', padding: '4px 10px', borderRadius: 10 }}>
                      {routeType === 'safe' ? 'SAFE NAVIGATION' : '⚠️ UNSAFE ROUTE ACTIVE'}
                    </div>
                    <button
                      onClick={() => navigateTo('11-summary')}
                      style={{ background: 'rgba(0,0,0,0.6)', border: 'none', color: C.white, padding: '4px 12px', borderRadius: 14, fontSize: 11, fontWeight: 500, cursor: 'pointer' }}
                    >
                      X Exit
                    </button>
                  </div>
                </div>

                {/* Direction Sheet at bottom */}
                <div style={{ background: C.card, padding: 20, borderTop: `1px solid ${C.border}`, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 22,
                      background: routeType === 'safe' ? C.purpleD : C.redD,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: routeType === 'safe' ? C.purple : C.red,
                      fontSize: 22, fontWeight: 900
                    }}>
                      {routeType === 'safe' ? '‹' : '›'}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, color: C.textS }}>{routeType === 'safe' ? 'Turn left on' : 'Turn right on'}</div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: C.text }}>{routeType === 'safe' ? 'MG Road' : 'Cubbon Alley'}</div>
                      <div style={{ fontSize: 14, color: C.textS }}>{routeType === 'safe' ? 'In 200m' : 'In 100m'}</div>
                    </div>
                  </div>

                  <div style={{ height: 1, background: C.border }} />

                  {/* Stats */}
                  <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'left' }}>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{routeType === 'safe' ? '2.9 km' : '2.2 km'}</div>
                      <div style={{ fontSize: 11, color: C.textS }}>Remaining</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{routeType === 'safe' ? '35 min' : '26 min'}</div>
                      <div style={{ fontSize: 11, color: C.textS }}>ETA</div>
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: routeType === 'safe' ? C.green : C.red }}>
                        {routeType === 'safe' ? 'LOW' : 'HIGH'}
                      </div>
                      <div style={{ fontSize: 11, color: C.textS }}>Risk Level</div>
                    </div>
                  </div>

                  <div style={{
                    background: routeType === 'safe' ? C.greenD : C.redD,
                    border: `1px solid ${routeType === 'safe' ? C.green : C.red}`,
                    padding: 10, borderRadius: 12, textAlign: 'center',
                    color: routeType === 'safe' ? C.green : C.red,
                    fontSize: 12, fontWeight: 600
                  }}>
                    {routeType === 'safe' ? 'v Safe route · Well-lit area · Low risk' : '⚠️ Unsafe shortcut · Dim lighting · High risk area'}
                  </div>

                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => triggerToast('Location shared with emergency list!')}
                      style={{ flex: 1, height: 46, borderRadius: 12, background: C.card2, border: 'none', color: C.textS, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                    >
                      Share Location
                    </button>
                    <button
                      onClick={() => navigateTo('07-sos-trigger')}
                      style={{ flex: 1, height: 46, borderRadius: 12, background: C.redD, border: 'none', color: C.red, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}
                    >
                      ! SOS Emergency
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 7. SOS Trigger Screen */}
            {screen === '07-sos-trigger' && (
              <div className="screen-container" style={{ background: C.bg, justifyContent: 'space-between' }}>
                <div style={{ background: C.redD, padding: 12, textAlign: 'center', color: C.red, fontSize: 14, fontWeight: 700, letterSpacing: 1, flexShrink: 0 }}>
                  ! EMERGENCY MODE
                </div>

                <div style={{ padding: '0 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <h2 style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: 0 }}>Emergency SOS</h2>
                  <span style={{ fontSize: 14, color: C.textS }}>Hold button 3 seconds to trigger</span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 230, position: 'relative' }}>
                  <div style={{ position: 'absolute', width: 228, height: 228, borderRadius: '50%', background: C.redD, opacity: 0.15, animation: 'sosRing 2.2s infinite' }} />
                  <div style={{ position: 'absolute', width: 180, height: 180, borderRadius: '50%', background: C.redD, opacity: 0.3, animation: 'sosRing 1.6s infinite' }} />
                  
                  <button
                    onClick={() => navigateTo('08-sos-activated')}
                    style={{
                      position: 'absolute', width: 136, height: 136, borderRadius: '50%', background: C.red,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      border: 'none', cursor: 'pointer', boxShadow: '0 0 35px rgba(239,68,68,0.7)',
                      animation: 'sosPulse 1.6s infinite'
                    }}
                  >
                    <span style={{ color: C.white, fontSize: 30, fontWeight: 900, lineHeight: 1 }}>SOS</span>
                    <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, fontWeight: 500, letterSpacing: 2, marginTop: 4 }}>HOLD</span>
                  </button>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <div style={{
                    width: 100, height: 90, borderRadius: 45, background: C.card, border: `1px solid ${C.border}`,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 40, fontWeight: 900, color: C.red, lineHeight: 1 }}>{sosCountdown}</span>
                    <span style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>seconds</span>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px' }}>
                  <button
                    onClick={() => navigateTo('04-dashboard')}
                    style={{
                      width: 170, height: 44, borderRadius: 22, background: C.card2, border: 'none',
                      color: C.textS, fontSize: 14, fontWeight: 500, cursor: 'pointer'
                    }}
                  >
                    X Cancel SOS
                  </button>
                </div>

                <div style={{ padding: '0 24px 20px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.textS }}>Will alert your contacts:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>M</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Mom - Priya Kumar</div>
                        <div style={{ fontSize: 12, color: C.textS }}>+91 98765 00001</div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>D</div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Dad - Rajesh Kumar</div>
                        <div style={{ fontSize: 12, color: C.textS }}>+91 98765 00002</div>
                      </div>
                    </div>
                  </div>
                  <button style={{ background: 'none', border: 'none', color: C.purple, fontSize: 13, fontWeight: 500, cursor: 'pointer', textAlign: 'center', marginTop: 4 }}>
                    + Add Emergency Contact
                  </button>
                </div>
              </div>
            )}

            {/* 8. SOS Activated Screen */}
            {screen === '08-sos-activated' && (
              <div className="screen-container" style={{ background: C.bg, justifyContent: 'space-between', padding: '0 24px 40px' }}>
                <div style={{
                  width: '100%', padding: '32px 0 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
                  background: 'linear-gradient(to bottom, rgba(239, 68, 68, 0.15), transparent)'
                }}>
                  <div style={{
                    width: 76, height: 76, borderRadius: 38, background: C.redD, border: `3px solid ${C.red}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <span style={{ fontSize: 36, fontWeight: 900, color: C.white }}>!</span>
                  </div>
                  <h1 style={{ fontSize: 26, fontWeight: 900, color: C.red, margin: 0, letterSpacing: 3 }}>ALERT SENT</h1>
                  <span style={{ fontSize: 15, color: C.textS, textAlign: 'center', whiteSpace: 'pre-line' }}>
                    {`Emergency contacts notified\nand authorities alerted`}
                  </span>
                </div>

                <div style={{
                  background: C.card, borderRadius: 14, padding: 14,
                  display: 'flex', alignItems: 'center', gap: 12, borderLeft: `3px solid ${C.green}`
                }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: 4, background: C.green,
                    boxShadow: `0 0 8px ${C.green}`, animation: 'liveDot 1.2s infinite'
                  }} />
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Live location is being shared</div>
                    <div style={{ fontSize: 12, color: C.green, marginTop: 2 }}>Updated every 10 seconds</div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: 500, color: C.textS }}>Contacts Notified:</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>M</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Mom - Priya Kumar</div>
                          <div style={{ fontSize: 12, color: C.green }}>Notified · 0s ago</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>D</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Dad - Rajesh Kumar</div>
                          <div style={{ fontSize: 12, color: C.green }}>Notified · 2s ago</div>
                        </div>
                      </div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{ width: 32, height: 32, borderRadius: 16, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.purple, fontWeight: 700 }}>P</div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Police Control Room</div>
                          <div style={{ fontSize: 12, color: C.amber }}>Alert Sent · Auto</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <button
                    onClick={() => {
                      navigateTo('04-dashboard');
                      setActiveTab('home');
                      triggerToast('SOS alert cancelled.');
                    }}
                    style={{
                      height: 52, borderRadius: 26, border: 'none', background: C.card2,
                      color: C.text, fontSize: 15, fontWeight: 600, cursor: 'pointer'
                    }}
                  >
                    I'm Safe - Cancel SOS
                  </button>
                  <span style={{ fontSize: 13, color: C.textS, textAlign: 'center' }}>SOS active for 00:45</span>
                </div>
              </div>
            )}

            {/* 9. Hazard Report Screen (Exact 1-to-1 Figma Match) */}
            {screen === '09-hazard-report' && (
              <div className="screen-container">
                {renderHeader('Report a Hazard', true, () => navigateTo('04-dashboard'))}

                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
                  {/* Photo Box */}
                  <div style={{
                    height: 148, background: C.card, borderRadius: 16,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 8, cursor: 'pointer'
                  }}>
                    <div style={{ width: 44, height: 44, borderRadius: 22, background: C.card2, display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.textS, fontSize: 18 }}>[+]</div>
                    <span style={{ fontSize: 13, color: C.textS }}>Tap to add photo</span>
                  </div>

                  {/* Auto Location box */}
                  <div style={{
                    background: C.card, borderRadius: 12, padding: '12px 14px', borderLeft: `3px solid ${C.green}`,
                    display: 'flex', flexDirection: 'column', gap: 2
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: C.green }}>GPS Location Auto-detected</span>
                    <span style={{ fontSize: 13, color: C.text }}>Near MG Road, Bangalore · 0.2km away</span>
                  </div>

                  {/* Hazard type grid */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: C.textS, display: 'block', marginBottom: 8 }}>Hazard Type</label>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
                      {['Poor Lighting', 'Suspicious', 'Broken Road', 'Flooding', 'Unsafe Area', 'Other'].map(type => {
                        const isSel = selectedReportType === type;
                        return (
                          <button
                            key={type}
                            onClick={() => setSelectedReportType(type)}
                            style={{
                              height: 32, borderRadius: 16, border: 'none',
                              background: isSel ? C.purpleD : C.card, color: isSel ? C.purple : C.textS,
                              fontSize: 11, fontWeight: isSel ? 600 : 400, cursor: 'pointer'
                            }}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description field */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: C.textS, display: 'block', marginBottom: 8 }}>Description (optional)</label>
                    <div style={{ background: C.card, borderRadius: 12, padding: 12, height: 80 }}>
                      <textarea
                        placeholder="Describe the hazard here..."
                        value={reportDesc}
                        onChange={e => setReportDesc(e.target.value)}
                        style={{
                          width: '100%', height: '100%', background: 'transparent', border: 'none',
                          color: C.text, fontSize: 14, outline: 'none', resize: 'none', fontFamily: 'Inter'
                        }}
                      />
                    </div>
                  </div>

                  {/* Severity level */}
                  <div>
                    <label style={{ fontSize: 12, fontWeight: 500, color: C.textS, display: 'block', marginBottom: 8 }}>Severity Level</label>
                    <div style={{ display: 'flex', gap: 10 }}>
                      {[
                        { label: 'Low', col: C.green, bg: C.greenD },
                        { label: 'Medium', col: C.amber, bg: C.amberD },
                        { label: 'High', col: C.red, bg: C.redD }
                      ].map(s => {
                        const isSel = reportSeverity === s.label;
                        return (
                          <button
                            key={s.label}
                            onClick={() => setReportSeverity(s.label)}
                            style={{
                              flex: 1, height: 34, borderRadius: 17, border: 'none',
                              background: s.bg, color: s.col,
                              fontSize: 13, fontWeight: 600, cursor: 'pointer'
                            }}
                          >
                            {s.label}
                          </button>
                        );
                      })}
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
                      navigateTo('10-community-map');
                      setReportDesc('');
                      triggerToast('Report submitted successfully!');
                    }}
                    style={{
                      height: 52, borderRadius: 26, border: 'none', background: C.amber, color: C.white,
                      fontSize: 16, fontWeight: 700, cursor: 'pointer', marginTop: 10
                    }}
                  >
                    Submit Report
                  </button>

                  <div style={{ textAlign: 'center', fontSize: 12, color: C.textM }}>
                    Reports reviewed by community in 2 hours
                  </div>
                </div>
              </div>
            )}

            {/* 10. Community Map */}
            {screen === '10-community-map' && (
              <div className="screen-container">
                {renderHeader('Community Safety Map', true, () => navigateTo('04-dashboard'))}

                {/* Filter Chips */}
                <div style={{ padding: '8px 16px', background: C.bg, display: 'flex', gap: 8, overflowX: 'auto', flexShrink: 0 }}>
                  {['All', 'Lighting', 'Road', 'Crime', 'Other'].map((fil, i) => (
                    <div
                      key={fil}
                      style={{
                        background: i === 0 ? C.purple : C.card, color: i === 0 ? C.white : C.textS,
                        padding: '6px 14px', borderRadius: 14, fontSize: 12, fontWeight: i === 0 ? 600 : 400,
                        whiteSpace: 'nowrap', cursor: 'pointer'
                      }}
                    >
                      {fil}
                    </div>
                  ))}
                </div>

                {/* Map */}
                <div style={{ flex: 1, position: 'relative' }}>
                  <MapContainer key="community-map" center={MAP_CENTER} zoom={14} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                    <TileLayerDark />
                    {hazards.map(h => (
                      <Marker key={h.id} position={h.pos} icon={makeHazardMarker(h.label, h.severity === 'high' ? C.red : C.amber)} />
                    ))}
                    <Marker position={ORIGIN} icon={youIcon} />
                  </MapContainer>

                  {/* Legend Card */}
                  <div style={{
                    position: 'absolute', bottom: 16, left: 16, right: 16, zIndex: 1000,
                    background: C.card, borderRadius: 14, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 6
                  }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: C.textS }}>Legend:</span>
                    <div style={{ display: 'flex', justifyBetween: 'space-around', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textS }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.green }} />
                        <span>Safe Zone</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textS }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.amber }} />
                        <span>Caution</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: C.textS }}>
                        <div style={{ width: 8, height: 8, borderRadius: 4, background: C.red }} />
                        <span>High Risk</span>
                      </div>
                    </div>
                  </div>
                </div>

                {renderBottomNav('report')}
              </div>
            )}

            {/* 11. Route Summary (Exact 1-to-1 Figma Match) */}
            {screen === '11-summary' && (
              <div className="screen-container">
                {/* Green Completion Top Strip */}
                <div style={{ background: C.greenD, padding: '12px 0', textAlign: 'center', color: C.green, fontSize: 15, fontWeight: 600, flexShrink: 0 }}>
                  v Trip Complete - Arrived Safely!
                </div>

                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', overflowY: 'auto' }}>
                  <div style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: 22, fontWeight: 900, color: C.text, margin: '0 0 2px' }}>Route Summary</h2>
                    <span style={{ fontSize: 13, color: C.textS }}>College - Home · July 21, 2026</span>
                  </div>

                  {/* Safety Score double ring gauge */}
                  <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
                    <div style={{
                      width: 148, height: 148, borderRadius: 74, background: C.card2,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <div style={{
                        width: 130, height: 130, borderRadius: 65, background: C.greenD,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{ fontSize: 38, fontWeight: 900, color: C.green, lineHeight: 1 }}>96</span>
                        <span style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>Safety Score</span>
                      </div>
                    </div>
                  </div>

                  {/* Stats Grid 2x2 */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ background: C.card, borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>4.2 km</div>
                      <div style={{ fontSize: 12, color: C.textS, marginTop: 2 }}>Distance</div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>28 min</div>
                      <div style={{ fontSize: 12, color: C.textS, marginTop: 2 }}>Duration</div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>97%</div>
                      <div style={{ fontSize: 12, color: C.textS, marginTop: 2 }}>Lit Path</div>
                    </div>
                    <div style={{ background: C.card, borderRadius: 12, padding: 14 }}>
                      <div style={{ fontSize: 22, fontWeight: 700, color: C.text }}>0</div>
                      <div style={{ fontSize: 12, color: C.textS, marginTop: 2 }}>Hazards</div>
                    </div>
                  </div>

                  {/* Mini Map Snapshot */}
                  <div style={{ background: C.card, borderRadius: 12, height: 124, position: 'relative', overflow: 'hidden', margin: '14px 0' }}>
                    <MapContainer key="summary-map" center={MAP_CENTER} zoom={13} style={{ height: '100%', width: '100%' }} zoomControl={false} attributionControl={false}>
                      <TileLayerDark />
                      <Polyline positions={SAFE_COORDS} pathOptions={{ color: C.green, weight: 5 }} />
                    </MapContainer>
                    <div style={{ position: 'absolute', bottom: 8, left: 10, zIndex: 1000, color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>
                      Safe route taken
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <button
                      onClick={() => triggerToast('Route report copied to clipboard!')}
                      style={{ flex: 1, height: 50, borderRadius: 25, background: C.card2, border: 'none', color: C.text, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Share Report
                    </button>
                    <button
                      onClick={() => { navigateTo('04-dashboard'); setActiveTab('home'); }}
                      style={{ flex: 1, height: 50, borderRadius: 25, background: C.purple, border: 'none', color: C.white, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      New Route
                    </button>
                  </div>

                  <div style={{ textAlign: 'center', marginTop: 10 }}>
                    <span style={{ fontSize: 13, color: C.amber, fontWeight: 500 }}>* Rate this route</span>
                  </div>
                </div>

                {renderBottomNav('home')}
              </div>
            )}

            {/* 12. Profile Screen (Exact 1-to-1 Figma Match) */}
            {screen === '12-profile' && (
              <div className="screen-container">
                {renderHeader('Profile & Settings', true, () => navigateTo('04-dashboard'))}

                <div style={{ flex: 1, padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
                  {/* Profile Header */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 100, height: 100, borderRadius: 50, background: C.purple, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: C.white }}>SK</div>
                    <h3 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: C.text }}>Sahil Kumar</h3>
                    <span style={{ fontSize: 13, color: C.textS }}>sahil@example.com</span>
                    <div style={{ background: C.purpleD, color: C.purple, padding: '4px 14px', borderRadius: 13, fontSize: 12, fontWeight: 600 }}>v Verified</div>
                  </div>

                  {/* Profile stats cards */}
                  <div style={{ display: 'flex', gap: 10 }}>
                    <div style={{ flex: 1, background: C.card, borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: C.purple }}>47</div>
                      <div style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>Trips</div>
                    </div>
                    <div style={{ flex: 1, background: C.card, borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: C.purple }}>96%</div>
                      <div style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>Avg Safety</div>
                    </div>
                    <div style={{ flex: 1, background: C.card, borderRadius: 12, padding: 12 }}>
                      <div style={{ fontSize: 20, fontWeight: 700, color: C.purple }}>2</div>
                      <div style={{ fontSize: 11, color: C.textS, marginTop: 2 }}>Contacts</div>
                    </div>
                  </div>

                  {/* Emergency contacts list */}
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.textS, letterSpacing: 1, display: 'block', marginBottom: 8 }}>EMERGENCY CONTACTS</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {['Mom - Priya Kumar', 'Dad - Rajesh Kumar'].map(item => (
                        <div key={item} style={{ background: C.card, borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                          <span style={{ fontSize: 18, color: C.textM }}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Preferences list */}
                  <div>
                    <span style={{ fontSize: 10, fontWeight: 600, color: C.textS, letterSpacing: 1, display: 'block', marginBottom: 8 }}>PREFERENCES</span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {['Notifications', 'Dark Mode', 'Auto SOS Trigger', 'Location Sharing'].map(item => (
                        <div key={item} style={{ background: C.card, borderRadius: 12, padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: 14, color: C.text }}>{item}</span>
                          <span style={{ fontSize: 18, color: C.textM }}>›</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => { navigateTo('01-splash'); triggerToast('Signed out.'); }}
                    style={{
                      height: 44, borderRadius: 12, background: C.redD, border: 'none',
                      color: C.red, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginTop: 10
                    }}
                  >
                    Sign Out
                  </button>
                </div>

                {renderBottomNav('profile')}
              </div>
            )}

          </div>

          {/* Home indicator bar */}
          <div style={{
            height: 24, background: C.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderTop: screen === '01-splash' || screen === '02-onboarding' || screen === '03-login' || screen === '07-sos-trigger' || screen === '08-sos-activated' ? 'none' : `1px solid ${C.border}`
          }}>
            <div style={{ width: 120, height: 4, borderRadius: 2, background: C.border }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobilePrototype;
