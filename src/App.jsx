import React, { useState } from 'react';
import PptHub, { buildSlides } from './components/PptHub';
import FigmaGuide from './components/FigmaGuide';
import MobilePrototype from './components/MobilePrototype';
import { Presentation, Paintbrush, Smartphone, Info, Compass } from 'lucide-react';

function App() {
  const isPrintMode = window.location.search.includes('print=true');
  const [activeTab, setActiveTab] = useState('ppt');

  if (isPrintMode) {
    const slides = buildSlides();
    return (
      <div style={{ background: '#0B0E14', minHeight: '100vh', padding: '20px 0', margin: 0, boxSizing: 'border-box' }}>
        <style>{`
          @page {
            size: 1024px 576px;
            margin: 0;
          }
          @media print {
            body, html {
              background: #0B0E14 !important;
              color: white !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
              margin: 0 !important;
              padding: 0 !important;
            }
            .print-slide {
              page-break-after: always !important;
              page-break-inside: avoid !important;
              width: 1024px !important;
              height: 576px !important;
              box-sizing: border-box !important;
              display: flex !important;
              flex-direction: column !important;
              justify-content: space-between !important;
              background: #0B0E14 !important;
              padding: 30px 45px !important;
              margin: 0 !important;
              border: none !important;
            }
          }
          .print-slide {
            width: 1024px;
            height: 576px;
            margin: 0 auto 30px;
            background: #0B0E14;
            border: 1px solid #1C2130;
            padding: 30px 45px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            box-sizing: border-box;
            position: relative;
            color: white;
          }
        `}</style>
        {slides.map((s, idx) => (
          <div key={idx} className="print-slide">
            {/* Header */}
            <div style={{ borderBottom: '1px solid #1C2130', paddingBottom: 6, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 3, height: 12, borderRadius: 1.5, background: s.phaseColor }} />
                  <span style={{ fontSize: 9, fontWeight: 800, color: s.phaseColor, letterSpacing: 1.2, textTransform: 'uppercase' }}>
                    {s.phase}
                  </span>
                </div>
                <h1 style={{ fontSize: 20, fontWeight: 800, margin: 0, color: 'white' }}>{s.title}</h1>
              </div>
              <span style={{ fontSize: 11, color: '#8892B0', marginTop: 15 }}>{s.subtitle}</span>
            </div>
            {/* Content */}
            <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {s.content}
            </div>
            {/* Footer */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 6, borderTop: '1px solid #1C2130', color: '#8892B0', fontSize: 9 }}>
              <span>SafeRoute HCD Case Study</span>
              <span>Slide {idx + 1} of {slides.length}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── PROTOTYPE TAB: completely fullscreen, zero chrome ──
  if (activeTab === 'prototype') {
    return (
      <div style={{
        width: '100vw', height: '100vh', overflow: 'hidden',
        background: '#060810',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <MobilePrototype />

        {/* Ghost nav — barely visible, bottom-right corner */}
        <div style={{
          position: 'fixed', bottom: 14, right: 14, zIndex: 9999,
          display: 'flex', gap: 6,
        }}>
          <button onClick={() => setActiveTab('ppt')} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: 16,
            fontSize: 10, cursor: 'pointer', fontFamily: 'Inter', backdropFilter: 'blur(8px)',
          }}>PPT</button>
          <button onClick={() => setActiveTab('figma')} style={{
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.2)', padding: '5px 10px', borderRadius: 16,
            fontSize: 10, cursor: 'pointer', fontFamily: 'Inter', backdropFilter: 'blur(8px)',
          }}>Figma</button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <div className="logo-section">
          <div className="logo-icon">S</div>
          <span className="logo-text">SafeRoute HCD Portfolio</span>
        </div>
        <nav className="nav-tabs">
          <button className={`nav-tab ${activeTab === 'ppt' ? 'active' : ''}`} onClick={() => setActiveTab('ppt')}>
            <Presentation size={16} /><span>1. HCD Slide Deck (PPT)</span>
          </button>
          <button className={`nav-tab ${activeTab === 'figma' ? 'active' : ''}`} onClick={() => setActiveTab('figma')}>
            <Paintbrush size={16} /><span>2. Figma Design Guide</span>
          </button>
          <button className={`nav-tab ${activeTab === 'prototype' ? 'active' : ''}`} onClick={() => setActiveTab('prototype')}>
            <Smartphone size={16} /><span>3. Playable Prototype</span>
          </button>
        </nav>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.35rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Compass size={12} color="var(--accent-purple)" />Jury Mode
          </span>
        </div>
      </header>
      <main className="main-content">
        {activeTab === 'ppt' && (
          <div className="glass-card" style={{ marginBottom: '2rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08), transparent)' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <div style={{ background: 'var(--accent-purple-glow)', padding: '0.5rem', borderRadius: '10px', color: 'var(--accent-purple)' }}><Info size={20} /></div>
              <div>
                <h1 style={{ fontSize: '1.25rem', color: 'white', marginBottom: '0.25rem' }}>Design Challenge: From Problem to Prototype</h1>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>Full HCD blueprint — slides, Figma guide, and live prototype.</p>
              </div>
            </div>
          </div>
        )}
        <div style={{ transition: 'opacity 0.2s ease-in-out' }}>
          {activeTab === 'ppt'   && <PptHub />}
          {activeTab === 'figma' && <FigmaGuide />}
        </div>
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: 'auto' }}>
        <p>SafeRoute HCD Showcase &copy; 2026.</p>
      </footer>
    </div>
  );
}

export default App;
