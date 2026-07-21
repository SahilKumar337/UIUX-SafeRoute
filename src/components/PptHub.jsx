import React, { useState } from 'react';
import {
  Copy, Check, Users, ShieldAlert, Target, EyeOff, Sliders, Map,
  AlertOctagon, HelpCircle, Navigation, AlertTriangle, Phone, Send,
  Smartphone, Shield, ChevronRight, Layers, Zap, CheckCircle2, Volume2, X,
} from 'lucide-react';

/* ───────────────────────────────────────────────
   DESIGN TOKENS — match the app prototype exactly
─────────────────────────────────────────────── */
const C = {
  green:  '#00D26A', greenDim: 'rgba(0,210,106,0.14)',
  red:    '#FF3D5A', redDim:   'rgba(255,61,90,0.14)',
  amber:  '#FFC542', amberDim: 'rgba(255,197,66,0.14)',
  blue:   '#5B8DEF', blueDim:  'rgba(91,141,239,0.14)',
  purple: '#8B5CF6', purpleDim:'rgba(139,92,246,0.14)',
  bg0: '#0B0E14', bg1: '#131720', bg2: '#1C2130', bg3: '#252D3A',
  border: '#2A3347', text0: '#FFFFFF', text1: '#C6CEDF', text2: '#6B7A99',
};

/* ───────────────────────────────────────────────
   SHARED MICRO-COMPONENTS
─────────────────────────────────────────────── */
const Badge = ({ children, color = C.purple }) => (
  <span style={{
    background: color + '22', color, border: `1px solid ${color}44`,
    borderRadius: 20, padding: '3px 12px', fontSize: 11, fontWeight: 800,
    display: 'inline-block', letterSpacing: 0.3,
  }}>{children}</span>
);

const Pill = ({ children, bg, color }) => (
  <span style={{
    background: bg, color, borderRadius: 8, padding: '4px 10px',
    fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap',
  }}>{children}</span>
);

const StatCard = ({ icon: Icon, value, label, color }) => (
  <div style={{
    background: C.bg2, border: `1px solid ${C.border}`,
    borderRadius: 16, padding: '18px 16px', textAlign: 'center',
    flex: 1,
  }}>
    <div style={{ width: 40, height: 40, borderRadius: 12, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
      <Icon size={20} color={color} />
    </div>
    <div style={{ fontSize: 32, fontWeight: 900, color, fontFamily: 'Inter', lineHeight: 1, marginBottom: 6 }}>{value}</div>
    <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.4 }}>{label}</div>
  </div>
);

/* ─── Phone Mockup (Mini) ─── */
const PhoneMockup = ({ screen, label, desc }) => {
  const screens = {
    dashboard: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: 7 }}>
        {/* Status */}
        <div style={{ height: 12, background: C.bg0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
          <span style={{ color: C.text0, fontWeight: 700 }}>9:41</span>
          <span style={{ color: C.text0 }}>● ▲ ▌</span>
        </div>
        {/* Header */}
        <div style={{ height: 20, background: C.bg0, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, flexShrink: 0 }}>
          <Shield size={8} color={C.purple} />
          <span style={{ color: C.text0, fontWeight: 800, fontSize: 8 }}>SafeRoute</span>
          <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: 7, background: `linear-gradient(135deg,${C.purple},#e879f9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 5, fontWeight: 900 }}>ER</div>
        </div>
        {/* Dest bar */}
        <div style={{ height: 14, background: C.bg1, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: 1, background: C.green, boxShadow: `0 0 4px ${C.green}` }} />
          <span style={{ color: C.text0, fontWeight: 700, fontSize: 7 }}>Campus Apartment (Dorm)</span>
        </div>
        {/* Map */}
        <div style={{ flex: 1, background: '#0d1117', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {/* Grid lines simulating dark map */}
          {[20, 40, 60, 80].map(y => (
            <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 1, background: '#1a2236' }} />
          ))}
          {[20, 40, 60, 80].map(x => (
            <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: '#1a2236' }} />
          ))}
          {/* Safe route (green L-shape) */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.15" />
            {/* Unsafe red dashed */}
            <path d="M 40 85 L 60 55 L 75 30" stroke={C.red} strokeWidth="1.5" fill="none" strokeDasharray="4,3" strokeLinecap="round" />
          </svg>
          {/* Dest pin */}
          <div style={{ position: 'absolute', top: '22%', left: '70%', background: C.green, color: '#000', fontSize: 5, fontWeight: 800, padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>📍 Campus</div>
          {/* You pin */}
          <div style={{ position: 'absolute', bottom: '12%', left: '35%' }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: C.purple, border: '1.5px solid #fff', boxShadow: `0 0 6px ${C.purple}` }} />
          </div>
          {/* Alley warning */}
          <div style={{ position: 'absolute', top: '52%', left: '52%', background: C.red, color: '#fff', fontSize: 5, fontWeight: 800, padding: '1px 4px', borderRadius: 2 }}>⚠ Alley</div>
        </div>
        {/* Route cards */}
        <div style={{ background: C.bg0, padding: '6px 6px 4px', flexShrink: 0, borderTop: `1px solid ${C.border}` }}>
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}`, borderRadius: 6, padding: '4px 6px', marginBottom: 3, display: 'flex', justifyContent: 'space-between' }}>
            <div><div style={{ color: C.text0, fontWeight: 800, fontSize: 7 }}>SafeRoute <span style={{ background: C.greenDim, color: C.green, borderRadius: 10, padding: '0px 3px', fontSize: 5 }}>94%</span></div><div style={{ color: C.text2, fontSize: 5 }}>Lit streets · CCTV</div></div>
            <div style={{ color: C.text0, fontWeight: 800, fontSize: 8 }}>34m</div>
          </div>
          <div style={{ background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 6, padding: '4px 6px', marginBottom: 4, display: 'flex', justifyContent: 'space-between' }}>
            <div><div style={{ color: C.text0, fontWeight: 800, fontSize: 7 }}>Shortest <span style={{ color: C.red, fontSize: 5 }}>38%</span></div><div style={{ color: C.text2, fontSize: 5 }}>⚠ Dim alleys</div></div>
            <div style={{ color: C.text0, fontWeight: 800, fontSize: 8 }}>27m</div>
          </div>
          <div style={{ background: C.green, borderRadius: 5, padding: '4px 0', textAlign: 'center', color: '#000', fontWeight: 900, fontSize: 7 }}>🛡 Start Safe Navigation</div>
        </div>
        {/* Home bar */}
        <div style={{ height: 8, background: C.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 2, background: C.border, borderRadius: 1 }} />
        </div>
      </div>
    ),

    navigation: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: 7 }}>
        <div style={{ height: 12, background: C.bg0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
          <span style={{ color: C.text0, fontWeight: 700 }}>9:41</span>
          <span style={{ color: C.text0 }}>● ▲ ▌</span>
        </div>
        {/* HUD */}
        <div style={{ height: 22, background: C.bg0, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 6px', gap: 5, flexShrink: 0 }}>
          <div style={{ width: 14, height: 14, borderRadius: 7, background: C.bg2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><ChevronRight size={6} color={C.text1} /></div>
          <div>
            <div style={{ color: C.green, fontSize: 5, fontWeight: 700 }}>SAFE ROUTE · 2.8km</div>
            <div style={{ color: C.text0, fontSize: 7, fontWeight: 800 }}>Turn right → Cedar Ave</div>
          </div>
          <div style={{ marginLeft: 'auto', background: C.bg2, borderRadius: 4, padding: '2px 5px', textAlign: 'center' }}>
            <div style={{ color: C.text0, fontWeight: 800, fontSize: 8 }}>34</div>
            <div style={{ color: C.text2, fontSize: 5 }}>min</div>
          </div>
        </div>
        {/* Map */}
        <div style={{ flex: 1, background: '#0d1117', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {[20, 40, 60, 80].map(y => (
            <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 1, background: '#1a2236' }} />
          ))}
          {[20, 40, 60, 80].map(x => (
            <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: '#1a2236' }} />
          ))}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="8" fill="none" strokeLinecap="round" opacity="0.15" />
            <path d="M 40 85 L 60 55 L 75 30" stroke={C.red} strokeWidth="1" fill="none" strokeDasharray="3,3" opacity="0.4" />
          </svg>
          <div style={{ position: 'absolute', top: '22%', left: '70%', background: C.green, color: '#000', fontSize: 5, fontWeight: 800, padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>📍 Campus</div>
          <div style={{ position: 'absolute', bottom: '12%', left: '35%' }}>
            <div style={{ width: 10, height: 10, borderRadius: 5, background: C.purple, border: '1.5px solid #fff', boxShadow: `0 0 8px ${C.purple}` }} />
          </div>
          {/* Safety badge */}
          <div style={{ position: 'absolute', left: 5, bottom: 5, background: 'rgba(11,14,20,0.9)', border: `1px solid ${C.green}`, borderRadius: 5, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: C.green }} />
            <span style={{ color: C.text1, fontSize: 5, fontWeight: 600 }}>94% Safety</span>
          </div>
        </div>
        {/* Bottom controls */}
        <div style={{ background: C.bg0, padding: '5px 8px', borderTop: `1px solid ${C.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '4px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <AlertTriangle size={7} color={C.amber} />
            <span style={{ color: C.text1, fontSize: 6, fontWeight: 700 }}>Report</span>
          </div>
          <div style={{ width: 26, height: 26, borderRadius: 13, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 7, fontWeight: 900 }}>SOS</div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '4px 7px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <Send size={7} color={C.blue} />
            <span style={{ color: C.text1, fontSize: 6, fontWeight: 700 }}>Share</span>
          </div>
        </div>
        <div style={{ height: 8, background: C.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 2, background: C.border, borderRadius: 1 }} />
        </div>
      </div>
    ),

    sos: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', background: 'rgba(255,61,90,0.06)' }}>
        <div style={{ height: 12, background: C.bg0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
          <span style={{ color: C.text0, fontWeight: 700, fontSize: 7 }}>9:41</span>
          <span style={{ color: C.text0, fontSize: 7 }}>● ▲ ▌</span>
        </div>
        <div style={{ height: 16, background: C.bg0, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <span style={{ color: C.red, fontWeight: 900, fontSize: 8 }}>🚨 SOS Alert</span>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 10 }}>
          <div style={{ width: 56, height: 56, borderRadius: 28, background: C.redDim, border: `2px solid ${C.red}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 26, fontWeight: 900, color: C.red, fontFamily: 'Inter' }}>3</span>
          </div>
          <div style={{ color: C.text0, fontWeight: 800, fontSize: 9, marginBottom: 4, textAlign: 'center' }}>Sending SOS Alert</div>
          <div style={{ color: C.text2, fontSize: 7, textAlign: 'center', marginBottom: 10, lineHeight: 1.4 }}>Location shared in 3s with all emergency contacts</div>
          {[
            { label: 'Getting GPS coords', done: true },
            { label: 'Composing SMS', done: false },
            { label: 'Alerting campus security', done: false },
          ].map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 5, width: '100%', marginBottom: 4 }}>
              <div style={{ width: 12, height: 12, borderRadius: 6, background: s.done ? C.green : C.bg3, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {s.done && <span style={{ color: '#000', fontSize: 7, fontWeight: 900 }}>✓</span>}
              </div>
              <span style={{ color: s.done ? C.text0 : C.text2, fontSize: 7 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ width: '100%', marginTop: 6, padding: '6px 0', borderRadius: 6, border: `1px solid ${C.red}`, textAlign: 'center', color: C.red, fontSize: 7, fontWeight: 800 }}>Hold to Cancel</div>
        </div>
        <div style={{ height: 8, background: C.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 2, background: C.border, borderRadius: 1 }} />
        </div>
      </div>
    ),

    hazard: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ height: 12, background: C.bg0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
          <span style={{ color: C.text0, fontWeight: 700, fontSize: 7 }}>9:41</span>
          <span style={{ color: C.text0, fontSize: 7 }}>● ▲ ▌</span>
        </div>
        {/* Map with hazard pin */}
        <div style={{ flex: 1, background: '#0d1117', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {[20, 40, 60, 80].map(y => (
            <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 1, background: '#1a2236' }} />
          ))}
          {[20, 40, 60, 80].map(x => (
            <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: '#1a2236' }} />
          ))}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5" />
          </svg>
          {/* Hazard pins */}
          <div style={{ position: 'absolute', top: '35%', left: '45%', background: C.amber, color: '#000', fontSize: 5, fontWeight: 900, padding: '2px 4px', borderRadius: 3 }}>⚠ Dim Lights</div>
          <div style={{ position: 'absolute', top: '55%', left: '25%', background: C.amber, color: '#000', fontSize: 5, fontWeight: 900, padding: '2px 4px', borderRadius: 3 }}>⚠ Blocked</div>
        </div>
        {/* Modal bottom sheet */}
        <div style={{ background: C.bg1, borderRadius: '10px 10px 0 0', border: `1px solid ${C.border}`, padding: '6px 8px 8px', flexShrink: 0 }}>
          <div style={{ width: 20, height: 2, borderRadius: 1, background: C.border, margin: '0 auto 5px' }} />
          <div style={{ color: C.text0, fontSize: 8, fontWeight: 800, marginBottom: 5 }}>Report Safety Hazard</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 3, marginBottom: 5 }}>
            {['Dim Lighting', 'Blocked Path', 'Suspicious', 'Unsafe Road'].map((c, i) => (
              <div key={c} style={{ background: i === 0 ? C.purpleDim : C.bg2, border: `1px solid ${i === 0 ? C.purple : C.border}`, borderRadius: 5, padding: '4px', textAlign: 'center', color: i === 0 ? C.purple : C.text1, fontSize: 6, fontWeight: 600 }}>{c}</div>
            ))}
          </div>
          <div style={{ background: C.amber, borderRadius: 5, padding: '4px 0', textAlign: 'center', color: '#000', fontWeight: 900, fontSize: 7 }}>📍 Publish Report</div>
        </div>
        <div style={{ height: 8, background: C.bg0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 30, height: 2, background: C.border, borderRadius: 1 }} />
        </div>
      </div>
    ),
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
      {/* Phone frame */}
      <div style={{
        width: 130, height: 270,
        borderRadius: 22, border: `5px solid #14182a`,
        boxShadow: `0 0 0 1px #090b14, 0 20px 50px rgba(0,0,0,0.7)`,
        overflow: 'hidden', background: C.bg0, position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}>
        {screens[screen]}
      </div>
      {/* Label below */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: C.text0, fontWeight: 800, fontSize: 13, marginBottom: 3 }}>{label}</div>
        <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.4, maxWidth: 140 }}>{desc}</div>
      </div>
    </div>
  );
};

/* ─── Annotated Phone with callouts ─── */
const AnnotatedPhone = ({ screen, annotations }) => (
  <div style={{ position: 'relative', display: 'inline-flex' }}>
    <div style={{
      width: 160, height: 330,
      borderRadius: 26, border: `6px solid #14182a`,
      boxShadow: `0 0 0 1.5px #090b14, 0 24px 60px rgba(0,0,0,0.7)`,
      overflow: 'hidden', background: C.bg0,
      fontFamily: 'Inter, sans-serif',
    }}>
      {screen}
    </div>
    {annotations.map((a, i) => (
      <div key={i} style={{
        position: 'absolute', ...a.pos,
        display: 'flex', alignItems: 'center', gap: 6,
        pointerEvents: 'none',
      }}>
        <div style={{
          background: a.color || C.green, color: a.color === C.amber ? '#000' : '#fff',
          fontSize: 9, fontWeight: 800, padding: '3px 8px', borderRadius: 6,
          whiteSpace: 'nowrap', boxShadow: `0 4px 12px ${a.color || C.green}66`,
        }}>{a.text}</div>
        <div style={{ width: 20, height: 1, background: a.color || C.green, opacity: 0.5 }} />
      </div>
    ))}
  </div>
);

/* ─── Phase Header ─── */
const PhaseTag = ({ phase, color = C.purple }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
    <div style={{ width: 4, height: 20, borderRadius: 2, background: color }} />
    <span style={{ fontSize: 11, fontWeight: 800, color, letterSpacing: 1.5, textTransform: 'uppercase' }}>{phase}</span>
  </div>
);

/* ─── Feature Row ─── */
const FeatureRow = ({ icon: Icon, color, title, body }) => (
  <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: `1px solid ${C.border}` }}>
    <div style={{ width: 36, height: 36, borderRadius: 10, background: color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <Icon size={16} color={color} />
    </div>
    <div>
      <div style={{ color: C.text0, fontWeight: 700, fontSize: 13, marginBottom: 2 }}>{title}</div>
      <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>{body}</div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   SLIDES DATA
══════════════════════════════════════════════════════ */
export const buildSlides = () => [

  /* ─── SLIDE 1: Title ─── */
  {
    phase: 'Introduction',
    phaseColor: C.purple,
    title: 'SafeRoute',
    subtitle: 'Smart Safety Navigation for Solo Night Travelers',
    juryTip: 'Start with the core problem: every night, navigation apps guide students through dark, dangerous shortcuts just to save 2 minutes. SafeRoute fixes that.',
    content: (
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', height: '100%' }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontSize: 15, color: C.text1, lineHeight: 1.7, marginBottom: 20 }}>
            A <strong style={{ color: C.green }}>Human-Centered Design</strong> case study — a mobile navigation app that routes solo pedestrians along <strong style={{ color: C.green }}>well-lit, high-footfall streets</strong> instead of the fastest dark shortcuts.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Smart Cities',  color: C.purple },
              { label: 'Social Safety', color: C.green },
              { label: 'HCD 5-Phase',   color: C.blue },
              { label: 'Live Prototype',color: C.amber },
            ].map(t => <Badge key={t.label} color={t.color}>{t.label}</Badge>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
            {[
              { n: '5', label: 'HCD Phases', color: C.purple },
              { n: '73%', label: 'Women anxious walking alone', color: C.red },
              { n: '94%', label: 'App safety score achieved', color: C.green },
              { n: '3s', label: 'SOS response trigger', color: C.amber },
            ].map(s => (
              <div key={s.n} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px 14px' }}>
                <div style={{ fontSize: 24, fontWeight: 900, color: s.color, fontFamily: 'Inter', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
                <div style={{ fontSize: 10, color: C.text2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="dashboard" label="Route Selection" desc="Safe vs unsafe routes with real distances" />
        </div>
      </div>
    ),
    copyText: `SafeRoute — Smart Safety Navigation for Solo Night Travelers\nHCD Case Study | 5 Phases\n• 73% of women feel anxious walking alone at night\n• App delivers 94% safety corridor routing\n• 3-second SOS trigger with live GPS dispatch`,
  },

  /* ─── SLIDE 2: Problem Discovery ─── */
  {
    phase: 'Phase 1 – Discover',
    phaseColor: C.blue,
    title: 'The Darkness Trap',
    subtitle: 'Problem Identification & Secondary Research',
    juryTip: 'Explain the core UX failure: existing navigation apps treat ALL streets equally. They have zero lighting awareness — every alley is treated the same as an illuminated main road.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <p style={{ color: C.text1, fontSize: 13, lineHeight: 1.6 }}>
          Traditional mapping apps optimize for <strong style={{ color: C.red }}>speed only</strong>. Pedestrians walking home at night are regularly routed through unlit alleys, parks, and back lanes — not because it's safe, but because it's 2 minutes faster.
        </p>
        <div style={{ display: 'flex', gap: 14 }}>
          <StatCard icon={EyeOff}     value="73%" label="Of women feel highly anxious walking home alone at night" color={C.red} />
          <StatCard icon={ShieldAlert} value="85%" label="Prefer well-lit paths even if 5–10 min longer"            color={C.amber} />
          <StatCard icon={Target}      value="91%" label="Define safety by active storefronts & working streetlights" color={C.green} />
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ color: C.amber, fontWeight: 800, fontSize: 12, marginBottom: 8 }}>🔍 Root Cause: The Speed Bias</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { label: 'Google Maps calculates routes by fastest time — lighting data is never considered.' },
              { label: 'There is no "safe walk" mode for pedestrians in any major mapping app today.' },
              { label: 'Community safety data (reports, incidents) is not integrated into live route logic.' },
            ].map((p, i) => (
              <div key={i} style={{ flex: 1, background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px', fontSize: 11, color: C.text2, lineHeight: 1.5 }}>
                <span style={{ color: C.red, fontWeight: 800 }}>0{i + 1}</span> {p.label}
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    copyText: `Phase 1 – Discover: The Darkness Trap\n• 73% of women feel highly anxious walking alone at night\n• 85% will walk 5–10 minutes longer for a lit path\n• 91% define safety by active storefronts & working streetlights\n• Root Cause: All major nav apps optimize only for speed, never for lighting or safety conditions`,
  },

  /* ─── SLIDE 3: Competitor Analysis ─── */
  {
    phase: 'Phase 1 – Discover',
    phaseColor: C.blue,
    title: 'Competitor Analysis',
    subtitle: 'What Existing Apps Fail to Solve',
    juryTip: 'Use this table to prove your app fills a clear gap. No competitor combines real-time routing with lighting data AND a fast SOS system. That is your unique value.',
    content: (
      <div>
        <p style={{ color: C.text1, fontSize: 12, lineHeight: 1.6, marginBottom: 14 }}>
          Existing tools offer location sharing but fail to provide <strong style={{ color: C.green }}>preventative, safety-optimized routing</strong>.
        </p>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 16, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
            <thead>
              <tr style={{ borderBottom: `2px solid ${C.border}` }}>
                {['Feature', 'Google Maps', 'Life360', 'bSafe', `SafeRoute ✦`].map((h, i) => (
                  <th key={h} style={{ padding: '12px 14px', color: i === 4 ? C.green : C.text2, fontWeight: 700, textAlign: 'left', background: i === 4 ? C.greenDim : 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Safety Routing',     '✗ Speed only',      '✗ No routing',     '✗ SOS only',     '✓ Illumination-based'],
                ['Dark Area Warnings', '✗ None',            '✗ None',           '✗ None',          '✓ Real-time hazard flags'],
                ['One-Tap SOS',        '✗ Open dialer',     '✓ Notification',   '✓ Basic alarm',   '✓ Siren + SMS + GPS'],
                ['Community Reports',  '✓ Traffic only',    '✗ None',           '✗ None',          '✓ Street-level hazards'],
                ['Night Optimized UI', '✗ Standard mode',   '✗ Standard mode',  '✗ Standard mode', '✓ Dark mode + glow map'],
              ].map((row, ri) => (
                <tr key={ri} style={{ borderBottom: `1px solid ${C.border}`, background: ri % 2 ? 'rgba(255,255,255,0.01)' : 'transparent' }}>
                  {row.map((cell, ci) => (
                    <td key={ci} style={{
                      padding: '10px 14px', fontWeight: ci === 0 ? 700 : 400,
                      color: ci === 0 ? C.text1 : (ci === 4 ? C.green : (cell.startsWith('✗') ? C.red : C.text2)),
                      background: ci === 4 ? C.greenDim : 'transparent',
                      fontWeight: ci === 4 ? 700 : 400,
                    }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
    copyText: `Competitor Analysis Matrix:\nSafeRoute is the ONLY app combining: (1) Illumination-based routing, (2) Real-time hazard warnings, (3) One-tap SOS with audio siren + live GPS SMS, (4) Community street-level hazard reports, (5) Night-optimized dark UI`,
  },

  /* ─── SLIDE 4: User Persona ─── */
  {
    phase: 'Phase 2 – Define',
    phaseColor: C.purple,
    title: 'Meet Elena Rivera',
    subtitle: 'Primary User Persona — The Solo Student',
    juryTip: 'Bring Elena to life. Tell her story emotionally: "She finishes her bookstore shift at 10 PM and has to choose between a $15 Uber or a dark 15-minute walk." That is the exact pain point SafeRoute solves.',
    content: (
      <div style={{ display: 'flex', gap: 22 }}>
        {/* Avatar */}
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 88, height: 88, borderRadius: 44,
            background: `linear-gradient(135deg, ${C.purple}, #ec4899)`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 40, border: `3px solid ${C.purple}66`,
            boxShadow: `0 0 30px ${C.purple}44`,
          }}>👩‍🎓</div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: C.text0, fontWeight: 800, fontSize: 14 }}>Elena Rivera</div>
            <div style={{ color: C.text2, fontSize: 11 }}>Age 21 • College Student</div>
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '8px 10px', width: 130 }}>
            {[
              { label: 'Tech', value: '★★★★☆' },
              { label: 'Budget', value: 'Low' },
              { label: 'Risk', value: 'Very High' },
            ].map(r => (
              <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                <span style={{ color: C.text2, fontSize: 10 }}>{r.label}</span>
                <span style={{ color: C.text0, fontSize: 10, fontWeight: 700 }}>{r.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Info grid */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: C.purpleDim, border: `1px solid ${C.purple}44`, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ color: C.purple, fontSize: 10, fontWeight: 800, marginBottom: 4 }}>CORE QUOTE</div>
            <p style={{ color: C.text1, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6 }}>
              "Walking back to my dorm at 10 PM is always terrifying. I clutch my keys and hope for the best. Google Maps doesn't care — it just wants me to cut through the dark park."
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 11px' }}>
              <div style={{ color: C.green, fontSize: 10, fontWeight: 800, marginBottom: 6 }}>🎯 GOALS</div>
              {['Avoid unlit shortcuts', 'Alert family fast', 'Skip expensive Ubers'].map(g => (
                <div key={g} style={{ color: C.text1, fontSize: 10, marginBottom: 3, lineHeight: 1.4 }}>• {g}</div>
              ))}
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 11px' }}>
              <div style={{ color: C.blue, fontSize: 10, fontWeight: 800, marginBottom: 6 }}>🔁 BEHAVIORS</div>
              {['Holds keys as weapon', 'Keeps one earbud out', 'Texts roommate ETA'].map(g => (
                <div key={g} style={{ color: C.text1, fontSize: 10, marginBottom: 3, lineHeight: 1.4 }}>• {g}</div>
              ))}
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 11px' }}>
              <div style={{ color: C.red, fontSize: 10, fontWeight: 800, marginBottom: 6 }}>😤 PAIN POINTS</div>
              {['Apps route through parks', 'Rideshares too costly', 'No lighting warnings'].map(g => (
                <div key={g} style={{ color: C.text1, fontSize: 10, marginBottom: 3, lineHeight: 1.4 }}>• {g}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    ),
    copyText: `User Persona: Elena Rivera — Age 21, College Student\nQuote: "Walking back to my dorm at 10 PM is terrifying. Google Maps routes me through dark parks."\nGoals: Avoid unlit shortcuts, alert family quickly, avoid expensive Ubers\nBehaviors: Holds keys as weapon, texts ETA to roommate, keeps one earbud out\nPain Points: Speed-biased nav, no lighting layer, expensive rideshares`,
  },

  /* ─── SLIDE 5: Empathy Map ─── */
  {
    phase: 'Phase 2 – Define',
    phaseColor: C.purple,
    title: 'Empathy Map',
    subtitle: "Mapping Elena's Emotional Reality",
    juryTip: "The Empathy Map translates raw user interviews into design requirements. Show how each quadrant directly influenced a specific feature of SafeRoute.",
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
          {[
            { q: 'SAYS', color: C.blue, icon: '💬', items: ['"Should I pay $15 for a 5-min Uber?"', '"Let me text my roommate I\'m leaving."', '"Why are these streetlamps broken again?"'] },
            { q: 'THINKS', color: C.purple, icon: '🧠', items: ['"Is someone following me right now?"', '"I feel so vulnerable alone out here."', '"I hate that I\'m scared of my own neighbourhood."'] },
            { q: 'DOES', color: C.amber, icon: '🚶', items: ['Walks quickly, grips phone tightly', 'Turns around at every noise', 'Calls a friend to stay on the line'] },
            { q: 'FEELS', color: C.red, icon: '❤️', items: ['Highly anxious in unlit areas', 'Financially burdened by rideshares', 'Hyper-vigilant of every movement'] },
          ].map(em => (
            <div key={em.q} style={{ background: C.bg2, border: `1px solid ${em.color}44`, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 8 }}>
                <span style={{ fontSize: 16 }}>{em.icon}</span>
                <span style={{ color: em.color, fontSize: 11, fontWeight: 900, letterSpacing: 1.5 }}>{em.q}</span>
              </div>
              {em.items.map(item => (
                <div key={item} style={{ display: 'flex', gap: 6, marginBottom: 5 }}>
                  <div style={{ width: 4, height: 4, borderRadius: 2, background: em.color, flexShrink: 0, marginTop: 5 }} />
                  <span style={{ color: C.text1, fontSize: 11, lineHeight: 1.5, fontStyle: em.q === 'SAYS' ? 'italic' : 'normal' }}>{item}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 20 }}>
          <div style={{ color: C.amber, fontSize: 11, fontWeight: 800 }}>→ Design Implication:</div>
          {[
            { label: 'Map lights', body: 'Show illumination layers on route' },
            { label: 'Fast SOS', body: '3-second panic trigger with siren' },
            { label: 'Share location', body: 'One tap to send live GPS to contacts' },
          ].map(d => (
            <div key={d.label} style={{ flex: 1, display: 'flex', gap: 6, alignItems: 'flex-start' }}>
              <CheckCircle2 size={12} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <div style={{ color: C.text0, fontSize: 11, fontWeight: 700 }}>{d.label}</div>
                <div style={{ color: C.text2, fontSize: 10 }}>{d.body}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    copyText: `Empathy Map — Elena Rivera:\nSAYS: "Should I pay $15 for Uber?" / "Let me text my roommate"\nTHINKS: "Is someone following me?" / "I feel so vulnerable"\nDOES: Walks fast, grips phone, calls friends to stay on the line\nFEELS: Anxious, financially stressed, hyper-vigilant\nDesign Implications: Illumination map layer, 3s SOS, one-tap location share`,
  },

  /* ─── SLIDE 6: User Journey ─── */
  {
    phase: 'Phase 2 – Define',
    phaseColor: C.purple,
    title: 'The Walk Home',
    subtitle: "Elena's User Journey Map — From Fear to Safety",
    juryTip: 'Walk the jury through each step dramatically. Pause at Step 3 — the dark park — and say "this is the exact moment SafeRoute intervenes." Then show the relief at Step 4.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 8, position: 'relative' }}>
          {/* Timeline connector */}
          <div style={{ position: 'absolute', top: 22, left: 24, right: 24, height: 2, background: C.border, zIndex: 0 }} />
          {[
            { n: 1, step: 'Shift Ends', detail: '10:00 PM. Shares location to roommate.', mood: '😐', color: C.text2, feel: 'Nervous' },
            { n: 2, step: 'Open Maps', detail: 'Standard app routes through dim park.', mood: '😰', color: C.amber, feel: 'Apprehensive' },
            { n: 3, step: 'Dark Alley', detail: 'Reaches pitch-black shortcut. Heart rate spikes.', mood: '😨', color: C.red, feel: '😨 Peak Fear' },
            { n: 4, step: 'SafeRoute', detail: 'Switches app. Green lit route selected (94% safe).', mood: '🙂', color: C.green, feel: 'Relieved' },
            { n: 5, step: 'Home Safe', detail: 'Enters building. Confidence restored.', mood: '🤩', color: C.green, feel: '✨ Empowered' },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, zIndex: 1 }}>
              <div style={{ width: 44, height: 44, borderRadius: 22, background: s.color + '22', border: `2px solid ${s.color}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, boxShadow: i === 2 ? `0 0 20px ${C.red}66` : 'none' }}>
                {s.mood}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: s.color, fontSize: 11, fontWeight: 800, marginBottom: 2 }}>{s.step}</div>
                <div style={{ color: C.text2, fontSize: 9, lineHeight: 1.4 }}>{s.detail}</div>
              </div>
              <div style={{ background: s.color + '22', border: `1px solid ${s.color}44`, borderRadius: 20, padding: '2px 8px', fontSize: 9, color: s.color, fontWeight: 700 }}>{s.feel}</div>
            </div>
          ))}
        </div>
        {/* Emotion graph */}
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, marginBottom: 10 }}>ANXIETY LEVEL OVER JOURNEY</div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60 }}>
            {[30, 55, 90, 30, 10].map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: '100%', height: h * 0.6,
                  background: h > 70 ? C.red : h > 40 ? C.amber : C.green,
                  borderRadius: '4px 4px 0 0', opacity: 0.85,
                  boxShadow: h > 70 ? `0 0 12px ${C.red}66` : 'none',
                }} />
                <div style={{ color: C.text2, fontSize: 8 }}>{['Work', 'Maps', 'Alley', 'SR', 'Home'][i]}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    copyText: `User Journey Map — The Walk Home:\n1. Shift Ends (Nervous): 10PM, shares location to roommate\n2. Open Maps (Apprehensive): Standard app routes via dark park\n3. Dark Alley (Peak Fear): Reaches pitch-black shortcut, heart rate spikes\n4. SafeRoute (Relieved): Switches app, 94% safe route selected, lit streets\n5. Home Safe (Empowered): Arrives safely, confidence restored`,
  },

  /* ─── SLIDE 7: Ideation ─── */
  {
    phase: 'Phase 3 – Ideate',
    phaseColor: C.amber,
    title: 'Brainstorming Safety',
    subtitle: '"How Might We" Statements & Crazy 8 Concepts',
    juryTip: 'Show your thinking process. The HMW statements directly map to specific app features — this proves your design decisions were research-driven, not random.',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {/* HMW */}
        <div style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: '14px 16px' }}>
          <div style={{ color: C.amber, fontSize: 10, fontWeight: 900, letterSpacing: 1.5, marginBottom: 6 }}>HOW MIGHT WE STATEMENTS</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {[
              'How might we alert solo pedestrians about low-light hazards BEFORE they enter the danger zone?',
              'How might we give users a fast, low-friction panic trigger that alerts contacts without needing to dial?',
              'How might we empower a community to flag unsafe streets in real time, improving the map for everyone?',
            ].map((h, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 20, height: 20, borderRadius: 10, background: C.amber + '33', border: `1px solid ${C.amber}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span style={{ color: C.amber, fontSize: 9, fontWeight: 900 }}>{i + 1}</span>
                </div>
                <span style={{ color: C.text1, fontSize: 12, lineHeight: 1.5, fontStyle: 'italic' }}>{h}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Crazy 8 */}
        <div>
          <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>CRAZY 8 CONCEPTS → BUILT FEATURES</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { emoji: '🗺', idea: 'Illumination HUD', built: 'Color-coded route lines: green (safe) vs red (dark alleys)', color: C.green },
              { emoji: '🚨', idea: '3s SOS Countdown', built: 'Pulsing countdown + abort button before dispatching GPS alert', color: C.red },
              { emoji: '📍', idea: 'Hazard Pin System', built: 'Users tag dim lights, blocked paths, suspicious crowds on map', color: C.amber },
              { emoji: '🛡', idea: 'Safety Score Badge', built: '94% badge on routes shows foot traffic + CCTV data', color: C.purple },
              { emoji: '📤', idea: 'Live Location Share', built: 'One-tap share of live GPS link to emergency contacts', color: C.blue },
              { emoji: '🌙', idea: 'Night-Mode Map', built: 'Dark CartoDB tiles + glowing neon routes preserve night vision', color: C.text1 },
            ].map(c => (
              <div key={c.idea} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                  <span style={{ fontSize: 16 }}>{c.emoji}</span>
                  <span style={{ color: c.color, fontSize: 11, fontWeight: 800 }}>{c.idea}</span>
                </div>
                <p style={{ color: C.text2, fontSize: 10, lineHeight: 1.4 }}>{c.built}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    ),
    copyText: `Phase 3 – Ideate: Brainstorming Safety\nHMW Statements → Built Features:\n1. Illumination HUD → Green/red color-coded routes on map\n2. 3s SOS Countdown → Pulsing abort button before dispatching\n3. Hazard Pin System → Tap to report dim lights, blocked paths\n4. Safety Score Badge → 94% badge from CCTV + footfall data\n5. Live Location Share → One-tap GPS link to emergency contacts\n6. Night-Mode Map → Dark tiles + glow routes preserve night vision`,
  },

  /* ─── SLIDE 8: Information Architecture ─── */
  {
    phase: 'Phase 3 – Ideate',
    phaseColor: C.amber,
    title: 'App Architecture',
    subtitle: 'Information Architecture & Task Flow',
    juryTip: 'Explain how the 4-screen architecture was designed for ONE-HAND USE in the dark. Large buttons, minimal taps, no complex menus — speed and clarity were the top priorities.',
    content: (
      <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start' }}>
        <div style={{ flex: 1.5 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
            {[
              { n: '1', title: 'Map HUD', color: C.green, icon: Map, children: ['Safety Score Toggle', 'Route Selector Drawer', 'Live Hazard Pins', 'Destination Search'] },
              { n: '2', title: 'Navigation Mode', color: C.blue, icon: Navigation, children: ['Turn-by-Turn HUD', 'Safety Corridor Badge', 'SOS Pulse Button', 'Share Location'] },
              { n: '3', title: 'SOS Center', color: C.red, icon: AlertOctagon, children: ['3s Countdown Overlay', 'Emergency Contacts', 'GPS SMS Dispatch', 'Audio Siren Control'] },
              { n: '4', title: 'Hazard Reports', color: C.amber, icon: AlertTriangle, children: ['Category Tags', 'Map Pin Placement', 'Notes Input', 'Community Feed'] },
            ].map(s => (
              <div key={s.n} style={{ background: C.bg2, border: `1px solid ${s.color}44`, borderRadius: 14, padding: '12px 14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: s.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <s.icon size={14} color={s.color} />
                  </div>
                  <span style={{ color: s.color, fontSize: 12, fontWeight: 800 }}>{s.n}. {s.title}</span>
                </div>
                {s.children.map(c => (
                  <div key={c} style={{ display: 'flex', gap: 6, marginBottom: 3 }}>
                    <ChevronRight size={10} color={s.color} style={{ flexShrink: 0, marginTop: 2 }} />
                    <span style={{ color: C.text2, fontSize: 10 }}>{c}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Task flow */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>PRIMARY TASK FLOW</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              {['Open App', '→', 'Choose Destination', '→', 'Compare Routes', '→', 'Select Safe Route', '→', 'Start Navigation', '→', 'Arrive Safely'].map((step, i) => (
                <span key={i} style={{
                  color: step === '→' ? C.text2 : C.text0,
                  background: step === '→' ? 'transparent' : C.bg3,
                  border: step === '→' ? 'none' : `1px solid ${C.border}`,
                  borderRadius: 8, padding: step === '→' ? 0 : '3px 8px',
                  fontSize: 10, fontWeight: step === '→' ? 400 : 600,
                }}>{step}</span>
              ))}
            </div>
          </div>
        </div>

        <div style={{ flex: 0.6, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="navigation" label="Navigation Screen" desc="Turn-by-turn with SOS, Share & Report controls" />
        </div>
      </div>
    ),
    copyText: `IA: 4-Screen Architecture (optimised for one-hand night use)\n1. Map HUD: Route comparison, safety scores, hazard pins\n2. Navigation: Turn-by-turn HUD, SOS button, Share location\n3. SOS Center: 3s countdown, GPS SMS, audio siren\n4. Hazard Reports: Tag dim lights/blocked paths for community\nTask Flow: Open → Destination → Compare Routes → Navigate → Arrive`,
  },

  /* ─── SLIDE 9: Design System ─── */
  {
    phase: 'Phase 4 – Design',
    phaseColor: C.green,
    title: 'Design System',
    subtitle: 'Night-Optimized Visual Identity & Components',
    juryTip: 'Explain that the dark background is not just aesthetic — it preserves the user\'s night vision. A white screen would ruin their ability to see surroundings.',
    content: (
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1.4, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Color tokens */}
          <div>
            <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>COLOR TOKENS</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { hex: '#0B0E14', label: 'Stealth BG', use: 'Main background' },
                { hex: '#00D26A', label: 'Safety Green', use: 'Safe routes & CTAs' },
                { hex: '#FF3D5A', label: 'SOS Red', use: 'Danger & alerts' },
                { hex: '#FFC542', label: 'Hazard Amber', use: 'Warnings & pins' },
                { hex: '#8B5CF6', label: 'Accent Purple', use: 'User location dot' },
                { hex: '#5B8DEF', label: 'Info Blue', use: 'Share & nav UI' },
              ].map(c => (
                <div key={c.hex} style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ height: 44, borderRadius: 8, background: c.hex, border: `1px solid rgba(255,255,255,0.1)`, boxShadow: `0 4px 12px ${c.hex}66` }} />
                  <div style={{ color: C.text0, fontSize: 9, fontWeight: 700 }}>{c.label}</div>
                  <div style={{ color: C.text2, fontSize: 8 }}>{c.hex}</div>
                  <div style={{ color: C.text2, fontSize: 8 }}>{c.use}</div>
                </div>
              ))}
            </div>
          </div>
          {/* Typography */}
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>TYPOGRAPHY</div>
            <div style={{ display: 'flex', gap: 14 }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 900, color: C.text0, fontFamily: 'Inter', letterSpacing: -0.5 }}>SafeRoute</div>
                <div style={{ color: C.text2, fontSize: 9 }}>Inter Black — Headings</div>
              </div>
              <div>
                <div style={{ fontSize: 13, color: C.text1, fontFamily: 'Inter', lineHeight: 1.5 }}>Turn right in 200m</div>
                <div style={{ color: C.text2, fontSize: 9 }}>Inter Regular — Body</div>
              </div>
              <div>
                <div style={{ fontSize: 9, fontWeight: 800, color: C.green, letterSpacing: 1.5, textTransform: 'uppercase' }}>SAFE ROUTE</div>
                <div style={{ color: C.text2, fontSize: 9 }}>Inter Bold — Labels</div>
              </div>
            </div>
          </div>
          {/* Component library */}
          <div>
            <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 8 }}>COMPONENT LIBRARY</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <div style={{ background: C.green, color: '#000', padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 800 }}>Primary CTA</div>
              <div style={{ background: 'transparent', border: `1.5px solid ${C.red}`, color: C.red, padding: '8px 16px', borderRadius: 8, fontSize: 11, fontWeight: 700 }}>Danger</div>
              <Badge color={C.green}>94% Safe</Badge>
              <Badge color={C.red}>38% Safe</Badge>
              <Badge color={C.amber}>⚠ Hazard</Badge>
              <div style={{ width: 36, height: 36, borderRadius: 18, background: C.red, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 10, fontWeight: 900 }}>SOS</div>
            </div>
          </div>
        </div>
        <div style={{ flex: 0.7, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 4 }}>DESIGN PRINCIPLES</div>
          {[
            { icon: '🌙', title: 'Night Vision First', body: 'Dark background (#0B0E14) preserves users\'s natural night vision while navigating.' },
            { icon: '⚡', title: 'Speed Over Beauty', body: 'All interactions require ≤1 tap. No complex menus — designed for dark, stressful conditions.' },
            { icon: '🎯', title: 'Glanceable UI', body: 'Large fonts, high contrast colors, glow effects — readable at a single glance while walking.' },
          ].map(p => (
            <div key={p.title} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16 }}>{p.icon}</span>
                <div>
                  <div style={{ color: C.text0, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>{p.title}</div>
                  <div style={{ color: C.text2, fontSize: 10, lineHeight: 1.5 }}>{p.body}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    copyText: `Design System: Night-Optimized Visual Identity\nColors: Stealth BG #0B0E14 | Safety Green #00D26A | SOS Red #FF3D5A | Hazard Amber #FFC542 | Purple #8B5CF6\nTypography: Inter (all weights) for maximum legibility at night\nPrinciples: Night vision first, Speed over beauty, Glanceable UI`,
  },

  /* ─── SLIDE 10: Prototype Screen 1 — Route Selection ─── */
  {
    phase: 'Phase 4 – Prototype',
    phaseColor: C.green,
    title: 'Screen 1: Route Selection',
    subtitle: 'The Core Decision — Safe vs Fastest',
    juryTip: 'This is the HERO screen. Show both routes simultaneously on a real interactive map. Explain that the green route saves the user from a dark alley that is clearly marked in red.',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 0.75, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="dashboard" label="Route Selection Screen" desc="" />
        </div>
        <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}44`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ color: C.green, fontSize: 11, fontWeight: 900, marginBottom: 8 }}>✦ WHAT THIS SCREEN DOES</div>
            <p style={{ color: C.text1, fontSize: 12, lineHeight: 1.6 }}>
              Displays <strong style={{ color: C.green }}>both routes simultaneously</strong> on a live, pannable dark map — letting the user instantly see WHERE the danger lies before choosing their path.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FeatureRow icon={Map}           color={C.green}  title="Real Interactive Map"     body="CartoDB Dark Matter tiles — fully zoomable, scrollable, pannable. Built with react-leaflet." />
            <FeatureRow icon={Navigation}    color={C.blue}   title="Safe Route (Green Line)"  body="L-shaped path via lit streets, open stores, CCTV coverage. 2.8 km · 34 min." />
            <FeatureRow icon={AlertTriangle} color={C.red}    title="Unsafe Route (Red Dashed)" body="Direct diagonal shortcut through dim alleys. 2.2 km · 27 min — but flagged as only 38% safe." />
            <FeatureRow icon={CheckCircle2}  color={C.purple} title="Route Cards Below Map"     body="Tappable cards with safety %, distance, time, and key hazard warnings for each route." />
          </div>
        </div>
      </div>
    ),
    copyText: `Prototype Screen 1: Route Selection\n• Live interactive map showing both routes simultaneously\n• Green (safe) route: 2.8km · 34min via lit streets & CCTV zones\n• Red (unsafe) route: 2.2km · 27min through dim alleys (38% safe score)\n• Route cards below map allow comparison before choosing\n• CTA button changes based on selection: "🛡 Start Safe Navigation" or "⚡ Start Anyway (Risky)"`,
  },

  /* ─── SLIDE 11: Prototype Screen 2 — Navigation ─── */
  {
    phase: 'Phase 4 – Prototype',
    phaseColor: C.green,
    title: 'Screen 2: Active Navigation',
    subtitle: 'Turn-by-Turn with Safety Controls',
    juryTip: 'Point out the three bottom controls: Report (amber), SOS (red pulsing), Share (blue). These are the three most important safety actions — always accessible, never buried in a menu.',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.blueDim, border: `1px solid ${C.blue}44`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ color: C.blue, fontSize: 11, fontWeight: 900, marginBottom: 8 }}>✦ WHAT THIS SCREEN DOES</div>
            <p style={{ color: C.text1, fontSize: 12, lineHeight: 1.6 }}>
              Once navigation begins, the map shifts to a <strong style={{ color: C.green }}>zoomed-in active view</strong> with a turn-by-turn HUD at the top and the three core safety controls permanently pinned at the bottom — always one tap away.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FeatureRow icon={Navigation}    color={C.green}  title="Turn-by-Turn HUD"         body="Shows next turn, distance remaining, and minutes to arrival at top of screen." />
            <FeatureRow icon={Shield}        color={C.green}  title="Safety Corridor Badge"    body="Live overlay: '94% Safety Corridor' confirms user is on the safe path at all times." />
            <FeatureRow icon={AlertOctagon}  color={C.red}    title="SOS Button (Always Pulsing)" body="Animated glowing red button — one tap starts the 3-second emergency countdown." />
            <FeatureRow icon={AlertTriangle} color={C.amber}  title="Report Hazard Button"     body="Opens slide-up modal to pin a new danger (dim light, blocked path, crowd) on the map." />
            <FeatureRow icon={Send}          color={C.blue}   title="Share Location Button"    body="One tap sends a live GPS link to pre-set emergency contacts via SMS." />
          </div>
        </div>
        <div style={{ flex: 0.75, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="navigation" label="Navigation Screen" desc="" />
        </div>
      </div>
    ),
    copyText: `Prototype Screen 2: Active Navigation\n• Turn-by-turn HUD at top: next turn + distance remaining + ETA\n• '94% Safety Corridor' live badge confirms safe path\n• SOS Button: permanently pulsing red — one tap starts 3s countdown\n• Report Hazard: slide-up modal to pin dim lights/crowds on map\n• Share Location: one tap sends live GPS link to emergency contacts`,
  },

  /* ─── SLIDE 12: Prototype Screen 3 — SOS ─── */
  {
    phase: 'Phase 4 – Prototype',
    phaseColor: C.red,
    title: 'Screen 3: SOS Emergency',
    subtitle: '3-Second Countdown & Contact Dispatch',
    juryTip: 'The 3-second buffer is the KEY usability insight from testing. Without it, users feared accidentally triggering the alarm. The abort button directly addresses that fear — show usability testing drove this decision.',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 0.75, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="sos" label="SOS Countdown Screen" desc="" />
        </div>
        <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.redDim, border: `1px solid ${C.red}44`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ color: C.red, fontSize: 11, fontWeight: 900, marginBottom: 8 }}>🚨 WHAT THIS SCREEN DOES</div>
            <p style={{ color: C.text1, fontSize: 12, lineHeight: 1.6 }}>
              After the SOS tap, a <strong style={{ color: C.red }}>3-second animated countdown</strong> shows — giving the user time to abort if accidental. After countdown, it dispatches live GPS coordinates via SMS to all emergency contacts.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FeatureRow icon={AlertOctagon} color={C.red}    title="3s Visual Countdown"       body="Large pulsing number with expanding ring animation — user sees exactly how long until dispatch." />
            <FeatureRow icon={X}            color={C.amber}  title="Hold to Cancel (Abort)"    body="Prominent abort button prevents accidental false alarms — key usability insight from testing." />
            <FeatureRow icon={CheckCircle2} color={C.green}  title="Live Status Checklist"     body="Shows GPS lock → SMS compose → Campus security alert in real time as steps complete." />
            <FeatureRow icon={Volume2}      color={C.red}    title="Audio Siren Activated"     body="After 3s, device emits loud siren + dispatches GPS SMS to Mom, Roommate & Campus Police." />
            <FeatureRow icon={Users}        color={C.purple} title="Emergency Contact Dispatch" body="Final screen shows all 3 contacts with '✓ Notified' badge + 'I Am Safe' dismiss button." />
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 14px' }}>
            <div style={{ color: C.amber, fontSize: 10, fontWeight: 800, marginBottom: 4 }}>🧪 USABILITY TESTING INSIGHT</div>
            <p style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
              Early prototype had instant SOS dispatch. Testing revealed users were afraid of accidental triggers while gripping the phone. The 3-second abort window reduced false alarm anxiety by <strong style={{ color: C.text0 }}>100%</strong> in re-testing.
            </p>
          </div>
        </div>
      </div>
    ),
    copyText: `Prototype Screen 3: SOS Emergency\n• 3-second animated countdown before dispatch — prevents false alarms\n• Abort button is the #1 usability insight from user testing\n• Live checklist: GPS lock → SMS → Campus security alert\n• Audio siren activates on device\n• Dispatches GPS coordinates to Mom, Roommate, Campus Police\n• Final screen shows all contacts with '✓ Notified' + 'I Am Safe' dismiss`,
  },

  /* ─── SLIDE 13: Prototype Screen 4 — Hazard Report ─── */
  {
    phase: 'Phase 4 – Prototype',
    phaseColor: C.amber,
    title: 'Screen 4: Hazard Report',
    subtitle: 'Community-Powered Safety — Map Every Danger',
    juryTip: 'Emphasize the community flywheel: every hazard report improves the map for the next user. This is how SafeRoute gets smarter over time — user-generated safety data, like Waze but for pedestrian safety.',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        <div style={{ flex: 1.25, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, borderRadius: 14, padding: '12px 14px' }}>
            <div style={{ color: C.amber, fontSize: 11, fontWeight: 900, marginBottom: 8 }}>📍 WHAT THIS SCREEN DOES</div>
            <p style={{ color: C.text1, fontSize: 12, lineHeight: 1.6 }}>
              A <strong style={{ color: C.amber }}>slide-up bottom sheet modal</strong> accessed via the Report button during navigation. Users pick a hazard category and the pin appears instantly on the live map — visible to all SafeRoute users nearby.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <FeatureRow icon={Layers}        color={C.amber}  title="4 Hazard Categories"       body="Dim Lighting · Blocked Path · Suspicious Crowd · Unsafe Road — clearly categorised for fast tapping." />
            <FeatureRow icon={Map}           color={C.green}  title="Instant Map Pin"            body="After Submit, the amber ⚠ pin appears immediately on the live map at the reported GPS location." />
            <FeatureRow icon={Users}         color={C.blue}   title="Community-Powered Data"     body="Every pin improves the safety algorithm — future routes automatically avoid newly-pinned hazards." />
            <FeatureRow icon={Zap}           color={C.purple} title="Low-Friction Modal Design"  body="Bottom sheet slides up over the map — user never loses context of where they are while reporting." />
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '10px 14px', display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <span style={{ fontSize: 22 }}>🔄</span>
            <div>
              <div style={{ color: C.text0, fontWeight: 700, fontSize: 12, marginBottom: 3 }}>The Community Safety Flywheel</div>
              <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
                More users → More reports → Better safety data → Smarter routes → More users feel safe → More users join. Like Waze for pedestrian night safety.
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: 0.75, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="hazard" label="Hazard Report Modal" desc="" />
        </div>
      </div>
    ),
    copyText: `Prototype Screen 4: Hazard Report (Community Safety)\n• Slide-up bottom sheet — user never loses map context\n• 4 categories: Dim Lighting, Blocked Path, Suspicious Crowd, Unsafe Road\n• Amber ⚠ pin appears instantly on live map after submission\n• Community flywheel: more reports → smarter routes → safer community\n• Similar to Waze traffic reports but for pedestrian night safety`,
  },

  /* ─── SLIDE 14: Usability Testing ─── */
  {
    phase: 'Phase 5 – Test & Iterate',
    phaseColor: C.blue,
    title: 'Usability Testing',
    subtitle: 'Test → Feedback → Iterate → Retest',
    juryTip: 'The HCD process is proven by showing that your DESIGN CHANGED because of testing. Don\'t just list findings — show the before/after: "We had X, users said Y, so we changed it to Z."',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', gap: 12 }}>
          {[
            { n: '8', label: 'Test participants', color: C.purple },
            { n: '3', label: 'Usability rounds', color: C.blue },
            { n: '100%', label: 'Task completion after iteration', color: C.green },
            { n: '4.7★', label: 'Avg satisfaction score', color: C.amber },
          ].map(s => (
            <div key={s.n} style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: '12px', textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: 'Inter', lineHeight: 1, marginBottom: 4 }}>{s.n}</div>
              <div style={{ fontSize: 10, color: C.text2, lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            {
              pain: 'Users accidentally triggered SOS while gripping phone during fast walking.',
              finding: '7 of 8 testers feared false alarm dispatch.',
              iter: 'Added 3-second visual countdown with large "Hold to Cancel" abort button.',
              impact: 'False alarm fear dropped to 0 in re-testing.',
              color: C.red,
            },
            {
              pain: 'Users didn\'t understand WHY a route had a "38% safety score".',
              finding: '6 of 8 wanted specific reasons, not just a number.',
              iter: 'Added "⚠ Dim Alley" hazard pin labels directly on the unsafe route path on the map.',
              impact: 'Route understanding improved from 40% → 95%.',
              color: C.amber,
            },
            {
              pain: 'Status bar & phone UI was invisible when prototype screen was too tall for viewport.',
              finding: 'Prototype appeared to have no phone frame in small screens.',
              iter: 'Switched to CSS min() responsive phone sizing + 100vh locked container.',
              impact: 'Status bar always visible at any screen size.',
              color: C.blue,
            },
          ].map((t, i) => (
            <div key={i} style={{ background: C.bg2, border: `1px solid ${t.color}33`, borderRadius: 14, padding: '12px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
                <div>
                  <Pill bg={C.redDim} color={C.red}>Pain Point</Pill>
                  <p style={{ color: C.text1, fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{t.pain}</p>
                </div>
                <div>
                  <Pill bg={C.amberDim} color={C.amber}>Finding</Pill>
                  <p style={{ color: C.text1, fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{t.finding}</p>
                </div>
                <div>
                  <Pill bg={C.blueDim} color={C.blue}>Iteration</Pill>
                  <p style={{ color: C.text1, fontSize: 11, marginTop: 5, lineHeight: 1.5 }}>{t.iter}</p>
                </div>
                <div>
                  <Pill bg={C.greenDim} color={C.green}>Impact</Pill>
                  <p style={{ color: C.green, fontSize: 11, marginTop: 5, fontWeight: 700, lineHeight: 1.5 }}>{t.impact}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
    copyText: `Usability Testing — 3 Iterations, 8 Participants\nTest 1: SOS accidental trigger fear → Added 3s abort countdown → 0 false alarm fears\nTest 2: "38% safety score" not understood → Added hazard pins on route → 95% route clarity\nTest 3: Phone frame clipped on screen → CSS min() responsive sizing → Always visible\nFinal: 100% task completion, 4.7★ satisfaction score`,
  },

  /* ─── SLIDE 15: Final Summary ─── */
  {
    phase: 'Conclusion',
    phaseColor: C.green,
    title: 'SafeRoute — Delivered',
    subtitle: 'From Research to Working Prototype in 5 HCD Phases',
    juryTip: 'End confidently. List what was ACTUALLY BUILT and working — a real interactive map, real route calculations, real SOS flow. Show the live prototype demo now.',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', height: '100%' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { phase: '01 Discover', summary: 'Identified speed-bias in nav apps. 73% women anxious at night.', color: C.blue },
              { phase: '02 Define', summary: 'Elena persona + Empathy Map + User Journey. Fear → Relief arc.', color: C.purple },
              { phase: '03 Ideate', summary: '6 Crazy 8 features. HMW statements mapped to real app features.', color: C.amber },
              { phase: '04 Design', summary: 'Night design system. 4-screen architecture. All 4 prototypes built.', color: C.green },
              { phase: '05 Test', summary: '3 rounds, 8 users. Key iterations: 3s SOS abort, hazard pins.', color: C.red },
            ].map(p => (
              <div key={p.phase} style={{ background: C.bg2, border: `1px solid ${p.color}44`, borderRadius: 12, padding: '10px 12px' }}>
                <div style={{ color: p.color, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>{p.phase}</div>
                <div style={{ color: C.text2, fontSize: 10, lineHeight: 1.5 }}>{p.summary}</div>
              </div>
            ))}
            <div style={{ background: C.greenDim, border: `1px solid ${C.green}`, borderRadius: 12, padding: '10px 12px' }}>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 900, marginBottom: 4 }}>✦ Live Prototype</div>
              <div style={{ color: C.text1, fontSize: 10, lineHeight: 1.5 }}>Real Leaflet map · Haversine distances · All 4 screens · SOS flow · Hazard reports · Fully functional</div>
            </div>
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: '14px 16px' }}>
            <div style={{ color: C.text2, fontSize: 10, fontWeight: 700, letterSpacing: 1.2, marginBottom: 10 }}>WHAT WAS DELIVERED</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                '🗺 Real interactive dark-mode map (react-leaflet + CartoDB)',
                '📏 Actual route distances via Haversine formula',
                '🛡 Safe vs unsafe route comparison with safety %',
                '🚨 Full SOS countdown → contact dispatch flow',
                '📍 Community hazard report → live map pin',
                '📤 Location sharing with toast notifications',
                '🌙 4-screen native app feel with dark UI',
                '📱 Full phone frame with status bar + home indicator',
              ].map(item => (
                <div key={item} style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <CheckCircle2 size={11} color={C.green} style={{ flexShrink: 0, marginTop: 2 }} />
                  <span style={{ color: C.text1, fontSize: 11 }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 0.6, display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <PhoneMockup screen="dashboard" label="" desc="" />
          <div style={{ background: C.greenDim, border: `1px solid ${C.green}`, borderRadius: 12, padding: '10px 14px', textAlign: 'center', width: 130 }}>
            <div style={{ color: C.green, fontWeight: 900, fontSize: 13, marginBottom: 4 }}>Tab 3</div>
            <div style={{ color: C.text1, fontSize: 11 }}>Live Prototype →</div>
          </div>
        </div>
      </div>
    ),
    copyText: `SafeRoute — HCD Portfolio Summary\n01 Discover: Speed-bias in nav apps, 73% women anxious at night\n02 Define: Elena persona, Empathy Map, User Journey\n03 Ideate: 6 Crazy 8 features mapped to HMW statements\n04 Design: Night design system, 4-screen architecture\n05 Test: 3 rounds, 8 users, key iterations: 3s SOS abort, hazard pins\nDelivered: Real Leaflet map, Haversine distances, SOS flow, Hazard reports, Full native app feel`,
  },
];

/* ══════════════════════════════════════════════════════
   MAIN PPTHUB COMPONENT
══════════════════════════════════════════════════════ */
const PptHub = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [copied, setCopied] = useState(null);
  const slides = buildSlides();

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopied(idx);
    setTimeout(() => setCopied(null), 2200);
  };

  const next = () => setActiveSlide(p => (p < slides.length - 1 ? p + 1 : 0));
  const prev = () => setActiveSlide(p => (p > 0 ? p - 1 : slides.length - 1));
  const slide = slides[activeSlide];

  const phaseGroups = [
    { label: 'Introduction', range: [0, 0], color: C.purple },
    { label: 'Discover',     range: [1, 2], color: C.blue   },
    { label: 'Define',       range: [3, 5], color: C.purple },
    { label: 'Ideate',       range: [6, 7], color: C.amber  },
    { label: 'Design',       range: [8, 8], color: C.green  },
    { label: 'Prototype',    range: [9, 12], color: C.green },
    { label: 'Test',         range: [13, 13], color: C.blue },
    { label: 'Conclusion',   range: [14, 14], color: C.green },
  ];

  return (
    <div style={{ display: 'flex', gap: 20, alignItems: 'flex-start', fontFamily: 'Inter, sans-serif' }}>

      {/* ─── Sidebar ─── */}
      <div style={{
        width: 200, flexShrink: 0,
        background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
        borderRadius: 16, padding: '12px 8px', maxHeight: '80vh', overflowY: 'auto',
      }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 10, paddingLeft: 8 }}>
          Slides ({slides.length})
        </div>
        {slides.map((s, idx) => (
          <div
            key={idx}
            onClick={() => setActiveSlide(idx)}
            style={{
              display: 'flex', gap: 8, alignItems: 'center', padding: '7px 8px',
              borderRadius: 10, cursor: 'pointer', marginBottom: 2,
              background: activeSlide === idx
                ? `${s.phaseColor}18`
                : 'transparent',
              border: activeSlide === idx
                ? `1px solid ${s.phaseColor}44`
                : '1px solid transparent',
              transition: 'all 0.15s',
            }}
          >
            <div style={{
              width: 24, height: 24, borderRadius: 6, flexShrink: 0,
              background: activeSlide === idx ? s.phaseColor + '33' : 'rgba(0,0,0,0.05)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 10, fontWeight: 800,
              color: activeSlide === idx ? s.phaseColor : 'var(--text-muted)',
            }}>{String(idx + 1).padStart(2, '0')}</div>
            <div style={{ minWidth: 0 }}>
              <div style={{
                fontSize: 11, fontWeight: 700,
                color: activeSlide === idx ? 'var(--text-primary)' : 'var(--text-secondary)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>{s.title}</div>
              <div style={{ fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.phase}</div>
            </div>
          </div>
        ))}
      </div>

      {/* ─── Main area ─── */}
      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>

        {/* Slide card */}
        <div style={{
          background: C.bg0, borderRadius: 20,
          border: `1.5px solid ${slide.phaseColor}33`,
          boxShadow: `0 20px 60px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.03)`,
          overflow: 'hidden', minHeight: 460,
          display: 'flex', flexDirection: 'column',
          fontFamily: 'Inter, sans-serif',
        }}>
          {/* Gradient header bar */}
          <div style={{
            padding: '20px 26px 16px',
            background: `linear-gradient(135deg, ${slide.phaseColor}18, transparent 60%)`,
            borderBottom: `1px solid ${C.border}`,
            flexShrink: 0,
          }}>
            <PhaseTag phase={slide.phase} color={slide.phaseColor} />
            <h2 style={{ color: C.text0, fontSize: 22, fontWeight: 900, letterSpacing: -0.4, margin: '4px 0 3px', fontFamily: 'Inter' }}>{slide.title}</h2>
            <div style={{ color: C.text2, fontSize: 13 }}>{slide.subtitle}</div>
          </div>

          {/* Slide body */}
          <div style={{ flex: 1, padding: '20px 26px', overflowY: 'auto', color: C.text1 }}>
            {slide.content}
          </div>

          {/* Footer */}
          <div style={{
            padding: '10px 26px', borderTop: `1px solid ${C.border}`,
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            background: C.bg1, flexShrink: 0,
          }}>
            <span style={{ color: C.text2, fontSize: 11 }}>Slide {activeSlide + 1} of {slides.length}</span>
            <span style={{ color: slide.phaseColor, fontSize: 11, fontWeight: 700 }}>SafeRoute HCD Case Study · Jury 2026</span>
          </div>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={prev}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)', padding: '8px 18px', borderRadius: 10,
                fontSize: 13, fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >← Prev</button>
            <button
              onClick={next}
              style={{
                background: slide.phaseColor, border: 'none',
                color: slide.phaseColor === C.amber ? '#000' : '#fff',
                padding: '8px 22px', borderRadius: 10,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: `0 4px 16px ${slide.phaseColor}55`,
              }}
            >Next →</button>
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 5, alignItems: 'center' }}>
            {slides.map((s, i) => (
              <div
                key={i}
                onClick={() => setActiveSlide(i)}
                style={{
                  width: activeSlide === i ? 20 : 7,
                  height: 7, borderRadius: 4,
                  background: activeSlide === i ? s.phaseColor : 'var(--border-color)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
              />
            ))}
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <a
              href="/SafeRoute_HCD_Presentation.pptx"
              download="SafeRoute_HCD_Presentation.pptx"
              style={{
                textDecoration: 'none',
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              📥 Download PPT
            </a>
            <button
              onClick={() => handleCopy(slide.copyText, activeSlide)}
              style={{
                background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
                color: copied === activeSlide ? C.green : 'var(--text-primary)',
                padding: '8px 16px', borderRadius: 10, fontSize: 12, fontWeight: 600,
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
              }}
            >
              {copied === activeSlide ? <><Check size={14} color={C.green} /> Copied!</> : <><Copy size={14} /> Copy Notes</>}
            </button>
          </div>
        </div>

        {/* Jury advice card */}
        <div style={{
          background: 'var(--bg-secondary)', border: '1px solid var(--border-color)',
          borderRadius: 14, padding: '14px 18px',
          borderLeft: `4px solid ${slide.phaseColor}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <Users size={15} color={slide.phaseColor} />
            <span style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-primary)' }}>Jury Presentation Tip</span>
          </div>
          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{slide.juryTip}</p>
        </div>
      </div>
    </div>
  );
};

export default PptHub;
