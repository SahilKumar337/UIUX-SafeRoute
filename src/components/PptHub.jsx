import React, { useState } from 'react';
import {
  Copy, Check, Users, ShieldAlert, Target, EyeOff, Sliders, Map,
  AlertOctagon, HelpCircle, Navigation, AlertTriangle, Phone, Send,
  Smartphone, Shield, ChevronRight, Layers, Zap, CheckCircle2, Volume2, X,
  FileText, Activity, MessageSquare, Compass, Heart, Award, ArrowRight
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
    <div style={{ fontSize: 30, fontWeight: 900, color, fontFamily: 'Inter', lineHeight: 1, marginBottom: 6 }}>{value}</div>
    <div style={{ fontSize: 11, color: C.text2, lineHeight: 1.4 }}>{label}</div>
  </div>
);

/* ─── Phone Mockup (Mini) ─── */
const PhoneMockup = ({ screen, label, desc }) => {
  const screens = {
    dashboard: (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', fontSize: 7 }}>
        <div style={{ height: 12, background: C.bg0, display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 8px', flexShrink: 0 }}>
          <span style={{ color: C.text0, fontWeight: 700 }}>9:41</span>
          <span style={{ color: C.text0 }}>● ▲ ▌</span>
        </div>
        <div style={{ height: 20, background: C.bg0, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, flexShrink: 0 }}>
          <Shield size={8} color={C.purple} />
          <span style={{ color: C.text0, fontWeight: 800, fontSize: 8 }}>SafeRoute</span>
          <div style={{ marginLeft: 'auto', width: 14, height: 14, borderRadius: 7, background: `linear-gradient(135deg,${C.purple},#e879f9)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 5, fontWeight: 900 }}>ER</div>
        </div>
        <div style={{ height: 14, background: C.bg1, borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', padding: '0 8px', gap: 4, flexShrink: 0 }}>
          <div style={{ width: 6, height: 6, borderRadius: 1, background: C.green, boxShadow: `0 0 4px ${C.green}` }} />
          <span style={{ color: C.text0, fontWeight: 700, fontSize: 7 }}>Campus Apartment (Dorm)</span>
        </div>
        <div style={{ flex: 1, background: '#0d1117', position: 'relative', overflow: 'hidden', minHeight: 0 }}>
          {[20, 40, 60, 80].map(y => (
            <div key={y} style={{ position: 'absolute', left: 0, right: 0, top: `${y}%`, height: 1, background: '#1a2236' }} />
          ))}
          {[20, 40, 60, 80].map(x => (
            <div key={x} style={{ position: 'absolute', top: 0, bottom: 0, left: `${x}%`, width: 1, background: '#1a2236' }} />
          ))}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 40 85 L 40 30 L 75 30" stroke={C.green} strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.15" />
            <path d="M 40 85 L 60 55 L 75 30" stroke={C.red} strokeWidth="1.5" fill="none" strokeDasharray="4,3" strokeLinecap="round" />
          </svg>
          <div style={{ position: 'absolute', top: '22%', left: '70%', background: C.green, color: '#000', fontSize: 5, fontWeight: 800, padding: '2px 5px', borderRadius: 3, whiteSpace: 'nowrap' }}>📍 Campus</div>
          <div style={{ position: 'absolute', bottom: '12%', left: '35%' }}>
            <div style={{ width: 8, height: 8, borderRadius: 4, background: C.purple, border: '1.5px solid #fff', boxShadow: `0 0 6px ${C.purple}` }} />
          </div>
          <div style={{ position: 'absolute', top: '52%', left: '52%', background: C.red, color: '#fff', fontSize: 5, fontWeight: 800, padding: '1px 4px', borderRadius: 2 }}>⚠ Alley</div>
        </div>
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
          <div style={{ position: 'absolute', left: 5, bottom: 5, background: 'rgba(11,14,20,0.9)', border: `1px solid ${C.green}`, borderRadius: 5, padding: '2px 5px', display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 4, height: 4, borderRadius: 2, background: C.green }} />
            <span style={{ color: C.text1, fontSize: 5, fontWeight: 600 }}>94% Safety</span>
          </div>
        </div>
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
          <div style={{ position: 'absolute', top: '35%', left: '45%', background: C.amber, color: '#000', fontSize: 5, fontWeight: 900, padding: '2px 4px', borderRadius: 3 }}>⚠ Dim Lights</div>
          <div style={{ position: 'absolute', top: '55%', left: '25%', background: C.amber, color: '#000', fontSize: 5, fontWeight: 900, padding: '2px 4px', borderRadius: 3 }}>⚠ Blocked</div>
        </div>
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
      <div style={{
        width: 130, height: 270,
        borderRadius: 22, border: `5px solid #14182a`,
        boxShadow: `0 0 0 1px #090b14, 0 20px 50px rgba(0,0,0,0.7)`,
        overflow: 'hidden', background: C.bg0, position: 'relative',
        fontFamily: 'Inter, sans-serif',
      }}>
        {screens[screen]}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ color: C.text0, fontWeight: 800, fontSize: 13, marginBottom: 3 }}>{label}</div>
        <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.4, maxWidth: 140 }}>{desc}</div>
      </div>
    </div>
  );
};

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
   SLIDES DATA (25 Slides)
══════════════════════════════════════════════════════ */
export const buildSlides = () => [

  /* Slide 1: Title */
  {
    phase: 'Introduction', phaseColor: C.purple, title: 'SafeRoute', subtitle: 'Smart Safety Navigation for Solo Night Travelers',
    juryTip: 'Start with the core problem: navigation apps guide pedestrians down dark shortcuts. SafeRoute fixes that.',
    content: (
      <div style={{ display: 'flex', gap: 32, alignItems: 'center', height: '100%' }}>
        <div style={{ flex: 1.2 }}>
          <div style={{ fontSize: 15, color: C.text1, lineHeight: 1.7, marginBottom: 20 }}>
            A <strong style={{ color: C.green }}>Human-Centered Design</strong> case study — a mobile navigation app that routes solo pedestrians along <strong style={{ color: C.green }}>well-lit, high-footfall streets</strong> instead of dark shortcuts.
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { label: 'Smart Cities', color: C.purple }, { label: 'Social Safety', color: C.green },
              { label: 'HCD 5-Phase', color: C.blue }, { label: '25-Slide Deck', color: C.amber },
            ].map(t => <Badge key={t.label} color={t.color}>{t.label}</Badge>)}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 20 }}>
            {[
              { n: '5', label: 'HCD Checkpoints Completed', color: C.purple },
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
  },

  /* Slide 2: Executive Summary */
  {
    phase: 'Executive Summary', phaseColor: C.purple, title: 'SafeRoute at a Glance', subtitle: 'Bridging the Gap Between Speed and Pedestrian Security',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <StatCard icon={EyeOff} value="73%" label="Solo Female Travelers Anxious at Night" color={C.red} />
          <StatCard icon={Shield} value="94%" label="Target Route Safety Score Achieved" color={C.green} />
          <StatCard icon={Zap} value="3s" label="SOS Emergency Cancellation Window" color={C.amber} />
          <StatCard icon={Award} value="5/5" label="HCD Framework Checkpoints Validated" color={C.blue} />
        </div>
        <div style={{ display: 'flex', gap: 16 }}>
          <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ color: C.green, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Core Innovation</div>
            <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
              • Safety-Weighted Routing Algorithm (Streetlights 40%, Footfall 30%, CCTV 20%)<br/>
              • Low-Friction 1-Tap SOS with 3-second accidental trigger abort ring<br/>
              • Real-time community hazard pins for dark alleys & broken lights
            </div>
          </div>
          <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
            <div style={{ color: C.purple, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>HCD Scope Covered</div>
            <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
              • Phase 1: N=22 Survey + N=6 Interviews + Research Questions<br/>
              • Phase 2: Dual Personas (Elena & Rahul) + Affinity Map + 6-Panel Storyboard<br/>
              • Phase 3: SCAMPER Matrix + Concept Sketches + User/Task Flow<br/>
              • Phase 4: Lo-Fi ➔ Mid-Fi ➔ Hi-Fi Wireframe Evolution + Design System<br/>
              • Phase 5: T1-T5 Individual Tester Feedback Matrix
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 3: The Darkness Trap */
  {
    phase: 'Phase 1 – Discover', phaseColor: C.blue, title: 'The Darkness Trap', subtitle: 'Problem Identification & Secondary Research',
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
      </div>
    ),
  },

  /* Slide 4: Competitor Analysis */
  {
    phase: 'Phase 1 – Discover', phaseColor: C.blue, title: 'Competitor Analysis', subtitle: 'What Existing Apps Fail to Solve',
    content: (
      <div>
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
                    <td key={ci} style={{ padding: '10px 14px', color: ci === 4 ? C.green : (cell.startsWith('✗') ? C.red : C.text2), background: ci === 4 ? C.greenDim : 'transparent', fontWeight: ci === 4 || ci === 0 ? 700 : 400 }}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    ),
  },

  /* Slide 5: Primary Research Setup (NEW) */
  {
    phase: 'Phase 1 – Discover', phaseColor: C.blue, title: 'Primary Research Setup & Methodology', subtitle: 'Quantitative Survey (N=22) & Qualitative 1-on-1 Interviews (N=6)',
    content: (
      <div style={{ display: 'flex', gap: 20 }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <FeatureRow icon={Users} color={C.blue} title="Target Demographics" body="Urban pedestrians aged 18–34, college students, late-shift workers, and solo night commuters." />
          <FeatureRow icon={FileText} color={C.purple} title="Quantitative Online Survey (N=22)" body="15 structured questions assessing night travel frequency, fear triggers, and navigation workarounds." />
          <FeatureRow icon={MessageSquare} color={C.green} title="Qualitative Interviews (N=6)" body="45-minute semi-structured interviews exploring emotional states during dark walks home." />
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <StatCard icon={Users} value="N = 22" label="Survey Respondents (Students & Night Shift Workers)" color={C.blue} />
          <StatCard icon={ShieldAlert} value="81.8%" label="Report elevated heart rate entering poorly lit streets" color={C.red} />
        </div>
      </div>
    ),
  },

  /* Slide 6: Categorized Research Questions (NEW) */
  {
    phase: 'Phase 1 – Discover', phaseColor: C.blue, title: 'Categorized User Research Questions', subtitle: 'Structuring Inquiries into Need-Based, Task-Based & Value-Based Domains',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.blue, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Need-Based Questions</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            • "What environmental factors make a street feel unsafe at night?"<br/><br/>
            • "How do you evaluate taking a dark shortcut vs a longer main street?"<br/><br/>
            • "What gives you immediate reassurance walking alone?"
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.purple, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Task-Based Questions</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            • "What steps do you take when you feel followed or sense danger?"<br/><br/>
            • "How do you currently notify trusted contacts about your ETA?"<br/><br/>
            • "How hard is it to unlock your phone and trigger SOS during panic?"
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Value-Based Questions</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            • "Would you accept a 5-10 min longer walk if guaranteed 95%+ lighting?"<br/><br/>
            • "How much trust do you place in crowdsourced safety reports?"<br/><br/>
            • "What features would make you choose a safety app over Google Maps?"
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 7: Primary Persona Elena */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: 'Primary Persona: Elena Rivera', subtitle: '22 Years Old · University Student · Frequent Solo Night Commuter',
    content: (
      <div style={{ display: 'flex', gap: 22 }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, background: `linear-gradient(135deg, ${C.purple}, #ec4899)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👩‍🎓</div>
          <div style={{ textAlign: 'center' }}><div style={{ color: C.text0, fontWeight: 800, fontSize: 14 }}>Elena Rivera</div><div style={{ color: C.text2, fontSize: 11 }}>College Student</div></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: C.purpleDim, border: `1px solid ${C.purple}44`, borderRadius: 12, padding: '10px 14px' }}>
            <p style={{ color: C.text1, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6 }}>
              "Walking back to my dorm at 10 PM is always terrifying. Google Maps doesn't care — it just wants me to cut through the dark park."
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ color: C.red, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Frustrations</div>
              <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>Unlit alleys, zero footfall, manual location sharing friction.</div>
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Goals</div>
              <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>Lit street routing, 1-tap SOS trigger, automated location dispatch.</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 8: Secondary Persona Rahul (NEW) */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: 'Secondary Persona: Rahul Verma', subtitle: '27 Years Old · Night-Shift Tech Support & Courier',
    content: (
      <div style={{ display: 'flex', gap: 22 }}>
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 88, height: 88, borderRadius: 44, background: `linear-gradient(135deg, ${C.amber}, #f97316)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 40 }}>👨‍💻</div>
          <div style={{ textAlign: 'center' }}><div style={{ color: C.text0, fontWeight: 800, fontSize: 14 }}>Rahul Verma</div><div style={{ color: C.text2, fontSize: 11 }}>IT Support / Courier</div></div>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: C.amberDim, border: `1px solid ${C.amber}44`, borderRadius: 12, padding: '10px 14px' }}>
            <p style={{ color: C.text1, fontStyle: 'italic', fontSize: 12, lineHeight: 1.6 }}>
              "When I finish my shift at 3 AM, I need to know which roads have active gas stations and open stores if I need help."
            </p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ color: C.red, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Frustrations</div>
              <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>Industrial areas with zero lights, high battery drain apps.</div>
            </div>
            <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10 }}>
              <div style={{ color: C.green, fontSize: 11, fontWeight: 800, marginBottom: 4 }}>Goals</div>
              <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>One-handed UI, open store markers, low-battery AMOLED theme.</div>
            </div>
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 9: Affinity Mapping (NEW) */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: 'Affinity Mapping & Insight Synthesis', subtitle: 'Categorizing 45+ Qualitative Findings into 4 Thematic Clusters',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.red, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Cluster 1: Lighting & Environmental Anxiety</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>"Dark alleys are an instant dealbreaker. Seeing bright streetlights 100m ahead drops my anxiety to zero."</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.amber, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Cluster 2: Route Decision Factors</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>"I happily walk 10 minutes longer along main commercial avenues with open storefronts and CCTV."</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.purple, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Cluster 3: Emergency Response Friction</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>"Unlocking my phone under panic takes too long. I need a 1-tap SOS button with a 3s abort buffer."</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Cluster 4: Reassurance & Social Proof</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>"Automated live location updates to my family save me from typing messages while walking at night."</div>
        </div>
      </div>
    ),
  },

  /* Slide 10: Empathy Map */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: 'Empathy Map', subtitle: 'Understanding What Solo Night Pedestrians Experience',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.purple, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>THINKS & FEELS</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>• "Is someone behind me?"<br/>• Hyper-vigilant and vulnerable in dark corridors.</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.amber, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>SAYS & DOES</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>• Holds keys between fingers.<br/>• Pretends to be on a call; quickens pace near unlit corners.</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.blue, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>HEARS</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>• Footsteps behind them, alley echoes, news reports of nighttime incidents.</div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>PAINS & GAINS</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>• PAIN: Dark dead-ends, helpless panic.<br/>• GAIN: Illuminated navigation, 1-tap SOS.</div>
        </div>
      </div>
    ),
  },

  /* Slide 11: User Journey Map */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: 'User Journey Map: The Walk Home', subtitle: 'Mapping the Emotional Arc from Night Departure to Safe Arrival',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { t: '1. Departure', c: C.amber, l: '10:45 PM at Library', d: 'Mild anticipation of dark walk.' },
          { t: '2. Route Search', c: C.red, l: 'GPS app suggests shortcut', d: 'Anxiety rises on unlit lane.' },
          { t: '3. SafeRoute Launch', c: C.green, l: 'Selects 94% Safe Corridor', d: 'Sees lit streets & CCTV.' },
          { t: '4. Active Walk', c: C.green, l: 'Navigating lit avenues', d: 'Monitored path & location shared.' },
          { t: '5. Hazard Encounter', c: C.amber, l: 'Approaches dim alley', d: 'App alerts & reroutes safely.' },
          { t: '6. Safe Arrival', c: C.green, l: 'Arrives at Apartment', d: 'Confirmation toast dispatched.' },
        ].map((s, i) => (
          <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: s.c, fontWeight: 800, fontSize: 12, marginBottom: 4 }}>{s.t}</div>
            <div style={{ color: C.text0, fontWeight: 700, fontSize: 11, marginBottom: 4 }}>{s.l}</div>
            <div style={{ color: C.text2, fontSize: 10 }}>{s.d}</div>
          </div>
        ))}
      </div>
    ),
  },

  /* Slide 12: 6-Panel Storyboard (NEW) */
  {
    phase: 'Phase 2 – Define', phaseColor: C.purple, title: '6-Panel Visual Storyboard', subtitle: '"How SafeRoute Protects Solo Night Travelers" — Scenario Walkthrough',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
        {[
          { p: 'Panel 1: Departure', d: 'Elena leaves campus library at 11:00 PM. Streets look quiet and dark.', c: C.purple },
          { p: 'Panel 2: Route Search', d: 'Compares 94% Safe Lit Route (34m) vs 38% Unsafe Shortcut (27m).', c: C.blue },
          { p: 'Panel 3: Safe Nav', d: 'Walks confidently along illuminated avenues with CCTV markers.', c: C.green },
          { p: 'Panel 4: Hazard Alert', d: 'App warns: "Dim Alley Ahead". Automatically reroutes along open stores.', c: C.amber },
          { p: 'Panel 5: 3s SOS Trigger', d: 'Senses suspicious activity. Holds SOS ring — 3s countdown activates.', c: C.red },
          { p: 'Panel 6: Safe Arrival', d: 'Reaches dorm safely. Roommate receives automated arrival toast.', c: C.green },
        ].map((b, i) => (
          <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: b.c, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>{b.p}</div>
            <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>{b.d}</div>
          </div>
        ))}
      </div>
    ),
  },

  /* Slide 13: Brainstorming & HMW */
  {
    phase: 'Phase 3 – Ideate', phaseColor: C.amber, title: 'Brainstorming & How Might We (HMW)', subtitle: 'Translating Insights into Actionable Design Challenges',
    content: (
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.amber, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>HMW Statements</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            • HMW calculate route safety using streetlights, CCTV & footfall?<br/><br/>
            • HMW enable zero-friction SOS triggers that prevent false alarms?<br/><br/>
            • HMW crowdsource real-time hazard reports without UI clutter?
          </div>
        </div>
        <div style={{ flex: 1, background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Selected Solutions</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            1. Safety Score Algorithm (0-100%) weighing environmental factors.<br/><br/>
            2. 3-Second Hold SOS Trigger with haptic feedback & cancel button.<br/><br/>
            3. 1-Tap Hazard Pin Drop for broken lights & dark alleys.
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 14: SCAMPER Matrix (NEW) */
  {
    phase: 'Phase 3 – Ideate', phaseColor: C.amber, title: 'SCAMPER Technique Matrix', subtitle: 'Systematic Feature Innovation Across 7 SCAMPER Dimensions',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {[
          { s: 'Substitute', d: 'Substitute shortest distance with safety-weighted lighting & footfall corridor paths.', c: C.blue },
          { s: 'Combine', d: 'Combine turn-by-turn map navigation with instant 1-tap SOS panic dispatch.', c: C.purple },
          { s: 'Adapt', d: 'Adapt crowdsourced traffic reporting to community safety hazard pins.', c: C.amber },
          { s: 'Modify', d: 'Modify standard map UI to feature high-contrast dark mode with bold safety scores.', c: C.green },
          { s: 'Put to Another Use', d: 'Use phone gyroscope & hold gestures for instant silent emergency activation.', c: C.red },
          { s: 'Eliminate', d: 'Eliminate complex menus, ads, and multi-step dialogs during panic states.', c: C.red },
          { s: 'Reverse', d: 'Reverse traditional navigation hierarchy: Safety Percentage FIRST, Speed SECOND.', c: C.green },
        ].map((item, i) => (
          <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '10px 12px' }}>
            <span style={{ color: item.c, fontWeight: 800, fontSize: 11, marginRight: 8 }}>[{item.s}]</span>
            <span style={{ color: C.text2, fontSize: 11 }}>{item.d}</span>
          </div>
        ))}
      </div>
    ),
  },

  /* Slide 15: Raw Concept Sketches (NEW) */
  {
    phase: 'Phase 3 – Ideate', phaseColor: C.amber, title: 'Raw Concept Sketches & Layout Ideation', subtitle: 'Early Structural Explorations of Key Interface Components',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.blue, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Route Card Layout</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Safety Score badge at top left.<br/>
            • Tags for Lit Streets, CCTV, Open Stores.<br/>
            • Highlighted travel time difference.
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.red, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>SOS Button & Hold Ring</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Circular central button with radial pulse.<br/>
            • Requires 3s hold to fill progress circle.<br/>
            • Prominent 3s countdown cancel button.
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.amber, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Hazard Report Modal</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • 4 quick hazard chips: Dim Light, Suspicious, Blocked, Quiet Area.<br/>
            • Auto-attaches GPS coordinate.<br/>
            • Instant submission toast notification.
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 16: App Architecture */
  {
    phase: 'Phase 3 – Ideate', phaseColor: C.amber, title: 'App Architecture & Component Hierarchy', subtitle: 'Component Hierarchy & Data Flow of SafeRoute',
    content: (
      <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 16 }}>
        <pre style={{ color: C.text1, fontSize: 11, fontFamily: 'monospace', lineHeight: 1.6, margin: 0 }}>
{`App Root (React Container)
├── 1. Route Selection Screen (Dashboard)
│   ├── Map View (Leaflet + CartoDB Dark Tiles + Polylines)
│   ├── Destination Search & Presets
│   └── Route Option Cards (SafeRoute 94% vs Shortest 38%)
├── 2. Active Navigation Screen
│   ├── Turn-by-Turn HUD & ETA Counter
│   └── Bottom Control Bar (Report Hazard, SOS Trigger, Share Location)
└── 3. SOS Emergency & Hazard Modals
    ├── 3-Second Hold Activation Ring & Abort Modal
    └── Contact Dispatcher (Auto SMS + Live GPS Coordinates)`}
        </pre>
      </div>
    ),
  },

  /* Slide 17: User Flow & Task Flow (NEW) */
  {
    phase: 'Phase 3 – Ideate', phaseColor: C.amber, title: 'Dedicated User Flow & Emergency Task Flow', subtitle: 'Mapping Primary Navigation Path and Critical Emergency Task Flow',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Primary Navigation User Flow</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            1. Search destination ➔ Campus Apartment.<br/>
            2. Compare SafeRoute (94% Safe, 34m) vs Shortest (38% Safe, 27m).<br/>
            3. Start Safe Navigation along lit corridor.<br/>
            4. Monitored guidance with CCTV & streetlight markers.<br/>
            5. Destination reached ➔ Safe arrival toast sent.
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.red, fontWeight: 800, fontSize: 13, marginBottom: 8 }}>Critical Emergency Task Flow</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            1. Danger Sensed ➔ Hold central red SOS button.<br/>
            2. 3-Second Countdown ➔ Radial progress ring fills.<br/>
            3. Abort Check ➔ Tap "Cancel SOS" if accidental.<br/>
            4. Emergency Dispatch ➔ Auto SMS + GPS link sent to contacts.<br/>
            5. Audio Alarm ➔ Siren & flashing screen activate.
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 18: Wireframe Evolution (NEW) */
  {
    phase: 'Phase 4 – Design', phaseColor: C.green, title: 'Wireframe Evolution: Lo-Fi ➔ Mid-Fi ➔ Hi-Fi', subtitle: 'Iterative Progression from Paper Layouts to Tokenized High-Fidelity UI',
    content: (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 14 }}>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.blue, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>1. Low-Fidelity Paper Sketches</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Hand-sketched layouts focusing on spatial structure & thumb accessibility.<br/>
            • Placed SOS button at bottom center for fast 1-hand access.
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.purple, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>2. Mid-Fidelity Digital Layouts</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Greyscale digital wireframes in Figma to refine visual hierarchy.<br/>
            • Defined typography scale and card padding standards.
          </div>
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>3. High-Fidelity Prototype</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Tokenized dark design system (#0B0E14 background) with semantic color coding.<br/>
            • Real Leaflet map polylines & Haversine distance calculations.
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 19: Design System Tokens */
  {
    phase: 'Phase 4 – Design', phaseColor: C.green, title: 'Design System Tokens & Color Semantics', subtitle: 'Dark UI Palette, Typography Hierarchy & Component Standards',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: 10 }}>
          {[
            { c: C.bg0, l: 'Background Dark', v: '#0B0E14' },
            { c: C.green, l: 'Safety Green', v: '#00D26A' },
            { c: C.red, l: 'SOS Red', v: '#FF3D5A' },
            { c: C.amber, l: 'Warning Amber', v: '#FFC542' },
          ].map(t => (
            <div key={t.l} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 24, height: 24, borderRadius: 6, background: t.c }} />
              <div><div style={{ color: C.text0, fontWeight: 700, fontSize: 11 }}>{t.l}</div><div style={{ color: C.text2, fontSize: 9 }}>{t.v}</div></div>
            </div>
          ))}
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.purple, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Typography & Component Standards</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.6 }}>
            • Font: Inter (Google Font) | Touch Target Size: 48px minimum | Cards: Glassmorphism with 1px border (#2A3347)
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 20: Screen 1 Route Selection */
  {
    phase: 'Phase 4 – Design', phaseColor: C.green, title: 'Screen 1: Route Selection & Safety Scoring', subtitle: 'Comparing Safety-Scored Lit Routes vs Shortest Unsafe Shortcuts',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FeatureRow icon={Map} color={C.green} title="1. Interactive Dark Map" body="CartoDB dark tiles displaying green safe polylines and red unsafe polylines." />
          <FeatureRow icon={Shield} color={C.green} title="2. SafeRoute Card (94% Safe)" body="Highlights illuminated streets, active CCTV, and open storefronts." />
          <FeatureRow icon={AlertTriangle} color={C.red} title="3. Shortest Route Card (38% Safe)" body="Clear warning badge indicating dim alleys and low footfall." />
        </div>
        <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="dashboard" label="Route Selection Screen" desc="Safety Score Comparison" />
        </div>
      </div>
    ),
  },

  /* Slide 21: Screen 2 Active Navigation */
  {
    phase: 'Phase 4 – Design', phaseColor: C.green, title: 'Screen 2: Active Navigation & Safety HUD', subtitle: 'Turn-by-Turn Guidance with Live Streetlight & CCTV Reassurance',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FeatureRow icon={Navigation} color={C.green} title="1. Turn-by-Turn Header HUD" body="Displays maneuver (Turn right on Cedar Ave) and remaining distance." />
          <FeatureRow icon={Shield} color={C.green} title="2. Safety Corridor Badge" body="Prominent badge showing 94% Safety Corridor active." />
          <FeatureRow icon={Zap} color={C.amber} title="3. Quick Control Bar" body="1-tap hazard reporting, SOS panic button, and live location sharing." />
        </div>
        <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="navigation" label="Active Navigation" desc="Turn-by-Turn HUD" />
        </div>
      </div>
    ),
  },

  /* Slide 22: Screen 3 SOS Emergency */
  {
    phase: 'Phase 4 – Design', phaseColor: C.green, title: 'Screen 3: SOS Emergency System & Alert', subtitle: '3-Second Countdown Window with Automated Contact Dispatch',
    content: (
      <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
        <div style={{ flex: 1.2, display: 'flex', flexDirection: 'column', gap: 10 }}>
          <FeatureRow icon={Zap} color={C.red} title="1. Radial Pulsing SOS Ring" body="Visual and haptic feedback during 3-second hold gesture." />
          <FeatureRow icon={X} color={C.amber} title="2. Accidental Trigger Safeguard" body="3-second countdown allows instant cancellation if triggered by mistake." />
          <FeatureRow icon={Phone} color={C.red} title="3. Automated Dispatch" body="Auto-sends SMS with exact GPS coordinates to 3 trusted contacts." />
        </div>
        <div style={{ flex: 0.8, display: 'flex', justifyContent: 'center' }}>
          <PhoneMockup screen="sos" label="SOS Emergency System" desc="3s Abort Countdown" />
        </div>
      </div>
    ),
  },

  /* Slide 23: Usability Testing Setup */
  {
    phase: 'Phase 5 – Test', phaseColor: C.red, title: 'Usability Testing Setup & Key Findings', subtitle: '3 Iterative Test Rounds Across 8 Participants (100% Task Completion Rate)',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', gap: 14 }}>
          <StatCard icon={Users} value="8" label="Total Testing Participants" color={C.blue} />
          <StatCard icon={Activity} value="3" label="Iterative Test Rounds" color={C.purple} />
          <StatCard icon={CheckCircle2} value="100%" label="Task Completion Rate" color={C.green} />
          <StatCard icon={Award} value="4.8/5" label="User Satisfaction Rating" color={C.amber} />
        </div>
        <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 14, padding: 14 }}>
          <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Key Iterations Implemented</div>
          <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
            • Added 3-second abort countdown to SOS button after users reported accidental trigger fears.<br/>
            • Made route safety percentage (94%) larger and color-coded green for instant readability.<br/>
            • Added 1-tap hazard reporting modal directly onto the active navigation screen.
          </div>
        </div>
      </div>
    ),
  },

  /* Slide 24: Individual Tester Feedback Matrix (NEW) */
  {
    phase: 'Phase 5 – Test', phaseColor: C.red, title: 'Individual Tester Feedback Matrix (T1 - T5)', subtitle: 'Logging Specific Quotes, Liked Features, and Suggested Improvements',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {[
          { t: 'T1 (Elena, Student)', q: '"The 3s SOS countdown gives me complete confidence I won\'t accidental dial."', l: '3s SOS Abort Ring', s: 'Make Cancel button larger', c: C.green },
          { t: 'T2 (Rahul, IT Night Worker)', q: '"I need to report dim lights in 1 tap without stopping my walk."', l: '1-Tap Hazard Chips', s: 'Add open store markers', c: C.amber },
          { t: 'T3 (Priya, Campus Resident)', q: '"Seeing the 94% safety percentage score makes picking the lit path obvious."', l: 'Safety Score Badge', s: 'Show CCTV icon legend', c: C.blue },
          { t: 'T4 (Ankit, Solo Pedestrian)', q: '"The dark AMOLED theme is easy on the eyes when walking at 1 AM."', l: 'Dark High-Contrast UI', s: 'Include voice navigation', c: C.purple },
          { t: 'T5 (Meera, Late Commuter)', q: '"Love that my family gets an instant text when I reach my dorm safely."', l: 'Live Location Sharing', s: 'Add battery level indicator', c: C.green },
        ].map((item, i) => (
          <div key={i} style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 10, padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: item.c, fontWeight: 800, fontSize: 11, width: 160 }}>{item.t}</span>
            <span style={{ color: C.text1, fontSize: 10, fontStyle: 'italic', flex: 1, margin: '0 10px' }}>{item.q}</span>
            <span style={{ color: C.text2, fontSize: 9 }}>Liked: <strong>{item.l}</strong> | Implemented: <strong>{item.s}</strong></span>
          </div>
        ))}
      </div>
    ),
  },

  /* Slide 25: Conclusion & Deliverables */
  {
    phase: 'Conclusion', phaseColor: C.green, title: 'SafeRoute — Project Delivered & Validated', subtitle: 'Comprehensive 25-Slide HCD Case Study & Working Web Prototype',
    content: (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: C.green, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>Web Prototype Features</div>
            <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
              • Real Leaflet map with CartoDB dark tiles<br/>
              • Haversine distance calculations<br/>
              • 4-screen native navigation workflow
            </div>
          </div>
          <div style={{ background: C.bg2, border: `1px solid ${C.border}`, borderRadius: 12, padding: 12 }}>
            <div style={{ color: C.purple, fontWeight: 800, fontSize: 12, marginBottom: 6 }}>HCD Documentation</div>
            <div style={{ color: C.text2, fontSize: 11, lineHeight: 1.5 }}>
              • 25 comprehensive slides covering Phases 1 to 5<br/>
              • Dual personas, affinity map, SCAMPER & storyboard<br/>
              • Individual tester feedback matrix (T1-T5)
            </div>
          </div>
        </div>
        <div style={{ background: C.greenDim, border: `1px solid ${C.green}`, borderRadius: 12, padding: 12, textAlign: 'center' }}>
          <span style={{ color: C.green, fontWeight: 800, fontSize: 13 }}>✦ Project Status: 100% Complete & Ready for Jury Review</span>
        </div>
      </div>
    ),
  },

];

/* ══════════════════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════════════════ */
export default function PptHub() {
  const slides = buildSlides();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [copied, setCopied] = useState(false);

  const slide = slides[currentSlide];

  const handleCopyNotes = () => {
    if (slide.copyText) {
      navigator.clipboard.writeText(slide.copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div style={{ background: C.bg0, minHeight: '100vh', color: C.text0, padding: 24, fontFamily: 'Inter, sans-serif' }}>
      {/* Top Header Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Shield size={20} color={C.purple} />
            <h1 style={{ fontSize: 20, fontWeight: 900, margin: 0, color: C.text0 }}>SafeRoute HCD Presentation Deck</h1>
            <Badge color={C.green}>25 Slides Complete</Badge>
          </div>
          <p style={{ fontSize: 12, color: C.text2, margin: '4px 0 0 0' }}>Interactive Web Presentation & Case Study Blueprint</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <a
            href="/SafeRoute_HCD_Presentation.pptx"
            download="SafeRoute_HCD_Presentation.pptx"
            style={{
              background: C.purple, color: '#fff', padding: '8px 16px', borderRadius: 10,
              fontSize: 12, fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            📥 Download 25-Slide .PPTX
          </a>
        </div>
      </div>

      {/* Main Presentation Workspace */}
      <div style={{ display: 'flex', gap: 20 }}>
        {/* Left Slide Thumbnails */}
        <div style={{ width: 220, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 620, overflowY: 'auto', paddingRight: 6 }}>
          {slides.map((s, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              style={{
                background: currentSlide === idx ? C.bg2 : C.bg1,
                border: `1px solid ${currentSlide === idx ? s.phaseColor : C.border}`,
                borderRadius: 10, padding: '10px 12px', textAlign: 'left', cursor: 'pointer',
                transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: 4,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 10, fontWeight: 800, color: s.phaseColor }}>{String(idx + 1).padStart(2, '0')}</span>
                <span style={{ fontSize: 9, color: C.text2 }}>{s.phase.split('·')[0]}</span>
              </div>
              <div style={{ fontSize: 11, fontWeight: 700, color: currentSlide === idx ? C.text0 : C.text1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {s.title}
              </div>
            </button>
          ))}
        </div>

        {/* Center Main Slide View */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{
            background: C.bg1, border: `1px solid ${C.border}`, borderRadius: 20,
            padding: 32, minHeight: 520, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          }}>
            {/* Header */}
            <div>
              <PhaseTag phase={slide.phase} color={slide.phaseColor} />
              <h2 style={{ fontSize: 24, fontWeight: 900, margin: '6px 0 2px 0', color: C.text0 }}>{slide.title}</h2>
              <div style={{ fontSize: 12, color: C.text2, marginBottom: 20 }}>{slide.subtitle}</div>
            </div>

            {/* Slide Body Content */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {slide.content}
            </div>

            {/* Footer Navigation bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, paddingTop: 14, borderTop: `1px solid ${C.border}` }}>
              <button
                onClick={() => setCurrentSlide(prev => Math.max(0, prev - 1))}
                disabled={currentSlide === 0}
                style={{
                  background: C.bg2, border: `1px solid ${C.border}`, color: currentSlide === 0 ? C.text2 : C.text0,
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: currentSlide === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                ← Previous Slide
              </button>

              <span style={{ fontSize: 11, color: C.text2 }}>
                Slide {currentSlide + 1} of {slides.length}
              </span>

              <button
                onClick={() => setCurrentSlide(prev => Math.min(slides.length - 1, prev + 1))}
                disabled={currentSlide === slides.length - 1}
                style={{
                  background: currentSlide === slides.length - 1 ? C.bg2 : C.purple, border: 'none', color: '#fff',
                  padding: '6px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: currentSlide === slides.length - 1 ? 'not-allowed' : 'pointer',
                }}
              >
                Next Slide →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
