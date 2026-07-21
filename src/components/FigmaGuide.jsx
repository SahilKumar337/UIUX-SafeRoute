import React from 'react';
import { Palette, Type, Grid, Layers, Sparkles, AlertTriangle } from 'lucide-react';

const FigmaGuide = () => {
  const colors = [
    { name: 'Canvas Black (Background)', hex: '#090A0F', use: 'Stealth night theme canvas. Limits screen glare for walking users.' },
    { name: 'Card Obsidian (Secondary)', hex: '#121420', use: 'Used for route lists, bottom action sheets, and modal forms.' },
    { name: 'Border Grey (Stroke)', hex: '#1E293B', use: '1px clean stroke defining card boundaries and divider items.' },
    { name: 'Safety Green (SafeRoute)', hex: '#0CD484', use: 'Well-lit paths, safety scores, active tracking, success flags.' },
    { name: 'Warning Yellow (Hazards)', hex: '#F59E0B', use: 'Poorly lit streets, user hazard pins, moderation notices.' },
    { name: 'SOS Red (Panic Button)', hex: '#FF3860', use: 'Main floating SOS action, emergency overlays, sirens.' }
  ];

  const typography = [
    { label: 'Screen Header H1', size: '24px (Bold)', spacing: '-0.03em', use: 'Main dashboard title (e.g. "SafeRoute")' },
    { label: 'Widget Sub-Header H2', size: '13px (Bold / Uppercase)', spacing: '0.06em', use: 'Sections headers (e.g. "CHOOSE ROUTE")' },
    { label: 'Card Title H3', size: '16px (Semi-Bold)', spacing: '-0.01em', use: 'Route names, warning labels, action text' },
    { label: 'Body Text / Info', size: '13px (Regular / Medium)', spacing: '0', use: 'Travel times, distance calculations, descriptions' },
    { label: 'Small Metadata', size: '11px (Regular)', spacing: '0', use: 'Safety percent tags, countdown alerts, time intervals' }
  ];

  const screens = [
    {
      name: 'Screen 1: Dashboard comparison',
      layout: 'Scrollable Frame (360x740px)',
      components: [
        'Top Search Input: Floating search box containing search icon and target destination placeholder',
        'Map Canvas Background: Dark slate map showing street lines, glowing green line (SafeRoute) and dotted red line (Shortest path)',
        'Route Choice Sheet (Bottom Overlay): Rounded panel showing SafeRoute card (94% safe, green borders, 15 Min) and Shortest card (38% safe, 12 Min, warning text)',
        'Primary Button: Flashing button "Start Safe Navigation" at bottom'
      ]
    },
    {
      name: 'Screen 2: Active Navigation HUD',
      layout: 'Full View Navigation Tracking',
      components: [
        'Upper HUD Panel: Direction bar "Turn right on Cedar Ave" highlighting street lamp status ("Lit Path • High Activity")',
        'Interactive Map: Shows blue current position glowing dot tracking along the active green path',
        'SOS Floating Panic Trigger: Flashing red SOS button at bottom center, accessible for quick thumb tap',
        'Hazard Report Widget: Floating pill button to log broken street lamps on map'
      ]
    },
    {
      name: 'Screen 3: SOS countdown page',
      layout: 'Full Screen Emergency Alert',
      components: [
        'Warning concentric rings: Flashing rings centered around a massive number "3" timer',
        'Warning subtitle: "Triggering SOS alarm - notifying contacts in 3s..."',
        'Verification Checklist: Step indicators showing "Drafting coordinate SMS", "Preparing audio siren"',
        'Abort Action bar: Outlined red button saying "Tap to Cancel Alarm"'
      ]
    },
    {
      name: 'Screen 4: Report Hazard overlay',
      layout: 'Bottom Sheet (slid up 65%)',
      components: [
        'Title Banner: "Report Safety Hazard" with close cross icon',
        'Category Selectors: Grid buttons containing "Dim Lighting" (Active/selected), "Blocked Path", "Unsettling Crowd"',
        'Text description box: Input box for custom detail notes',
        'Submit Button: Green CTA "Publish Safety Report"'
      ]
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), transparent)' }}>
        <h2 style={{ fontSize: '1.5rem', color: 'white', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Sparkles size={24} color="var(--accent-purple)" />
          Figma Blueprint Guide
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.6', maxWidth: '800px' }}>
          Follow these guidelines to recreate the high-fidelity SafeRoute interface on your Figma canvas. We have pre-compiled these layouts as SVG files in your workspace directory under `figma_export/`. Drag and drop them directly into Figma to start editing instantly!
        </p>
      </div>

      <div className="figma-grid">
        {/* Style Tokens */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={18} color="var(--accent-purple)" />
              1. Color Styles (HEX Tokens)
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Add these color variables to your Figma local library:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {colors.map((color, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: color.hex, border: '1px solid rgba(255,255,255,0.1)' }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '0.85rem', color: 'white' }}>{color.name}</strong>
                      <code style={{ fontSize: '0.75rem', color: 'var(--accent-purple)', background: 'rgba(255,255,255,0.05)', padding: '0.1rem 0.3rem', borderRadius: '4px' }}>{color.hex}</code>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{color.use}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Type size={18} color="var(--accent-purple)" />
              2. Typography Styles
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Typography rules optimized for nighttime legibility:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {typography.map((text, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.6rem 0.8rem' }}>
                  <div>
                    <strong style={{ fontSize: '0.85rem', color: 'white', display: 'block' }}>{text.label}</strong>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{text.use}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <code style={{ fontSize: '0.75rem', color: 'var(--accent-green)', display: 'block' }}>{text.size}</code>
                    {text.spacing !== '0' && <code style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ls: {text.spacing}</code>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Screen Blueprints */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Grid size={18} color="var(--accent-purple)" />
              3. Figma Screen Blueprints
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {screens.map((screen, idx) => (
                <div key={idx} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '0.9rem', color: 'white' }}>{screen.name}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--accent-purple)', background: 'var(--accent-purple-glow)', padding: '0.15rem 0.4rem', borderRadius: '4px', fontWeight: 'bold' }}>
                      {screen.layout}
                    </span>
                  </div>
                  <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
                    {screen.components.map((component, cidx) => (
                      <li key={cidx} style={{ position: 'relative', paddingLeft: '1.2rem', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem' }}>
                        <span style={{ position: 'absolute', left: 0, color: 'var(--accent-purple)' }}>▪</span>
                        {component}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card">
            <h3 style={{ fontSize: '1.1rem', color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Layers size={18} color="var(--accent-purple)" />
              4. Prototyping Wires (Figma Interaction Settings)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem' }}>
                <strong style={{ color: 'white', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>A. Choose SafeRoute</strong>
                <p>On Screen 1, wire the <strong>SafeRoute Card</strong> to Screen 2. Trigger: <code>On Tap</code>, Action: <code>Navigate To</code>, Transition: <code>Instant</code>.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem' }}>
                <strong style={{ color: 'white', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>B. Trigger SOS Alarm</strong>
                <p>On Screen 2, select the pulsing red <strong>SOS Button</strong>. Drag wire to Screen 3. Trigger: <code>On Tap</code>, Action: <code>Navigate To</code>, Transition: <code>Smart Animate (Fast)</code>, Duration: <code>200ms</code>.</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '0.75rem' }}>
                <strong style={{ color: 'white', display: 'block', fontSize: '0.85rem', marginBottom: '0.2rem' }}>C. Log Safety Hazard</strong>
                <p>On Screen 2, select the <strong>Report Hazard pill</strong>. Drag wire to Screen 4. Trigger: <code>On Tap</code>, Action: <code>Open Overlay</code>, Position: <code>Bottom Center</code>, Transition: <code>Move In (Upwards)</code>, Duration: <code>300ms (Ease Out)</code>.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FigmaGuide;
