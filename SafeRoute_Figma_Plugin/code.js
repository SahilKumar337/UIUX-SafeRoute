// ================================================================
// SAFEROUTE — FIGMA AUTO-GENERATOR PLUGIN v1.0
// PETV157 UI/UX Project | By: SafeRoute Team
// ================================================================
// HOW TO USE:
//  1. Open Figma → Create a new empty file
//  2. Main Menu (☰) → Plugins → Development → Import plugin from manifest
//  3. Select THIS folder's manifest.json
//  4. Main Menu → Plugins → SafeRoute – Auto Generator → Run
//  5. Wait ~10 seconds → All 4 pages auto-generated!
// ================================================================

async function main() {

  // ── LOAD FONTS (with fallback: Inter → Roboto → Arial) ─────────
  let FONT = 'Arial';
  const SMAP = { Regular:'Regular', Medium:'Regular', SemiBold:'Bold', Bold:'Bold', ExtraBold:'Bold' };

  const tryFont = async (family, styles) => {
    try {
      for (const s of styles) await figma.loadFontAsync({ family, style: s });
      return true;
    } catch(e) { return false; }
  };

  if (await tryFont('Inter', ['Regular','Medium','SemiBold','Bold','ExtraBold'])) {
    FONT = 'Inter';
    SMAP.Medium = 'Medium'; SMAP.SemiBold = 'SemiBold'; SMAP.ExtraBold = 'ExtraBold';
  } else if (await tryFont('Roboto', ['Regular','Medium','Bold','Black'])) {
    FONT = 'Roboto';
    SMAP.Medium = 'Medium'; SMAP.ExtraBold = 'Black';
  } else {
    await figma.loadFontAsync({ family: 'Arial', style: 'Regular' });
    await figma.loadFontAsync({ family: 'Arial', style: 'Bold' });
  }

  // ── COLOR SYSTEM (0-1 range, optional a = opacity) ────────────
  const C = {
    bg:      { r: 0.043, g: 0.055, b: 0.078 },
    card:    { r: 0.075, g: 0.090, b: 0.125 },
    card2:   { r: 0.109, g: 0.129, b: 0.188 },
    purple:  { r: 0.388, g: 0.400, b: 0.945 },
    purpleD: { r: 0.388, g: 0.400, b: 0.945, a: 0.15 },
    green:   { r: 0.063, g: 0.725, b: 0.506 },
    greenD:  { r: 0.063, g: 0.725, b: 0.506, a: 0.15 },
    red:     { r: 0.937, g: 0.267, b: 0.267 },
    redD:    { r: 0.937, g: 0.267, b: 0.267, a: 0.15 },
    amber:   { r: 0.961, g: 0.620, b: 0.043 },
    amberD:  { r: 0.961, g: 0.620, b: 0.043, a: 0.15 },
    text:    { r: 0.886, g: 0.910, b: 0.941 },
    textS:   { r: 0.533, g: 0.573, b: 0.690 },
    textM:   { r: 0.350, g: 0.380, b: 0.470 },
    border:  { r: 0.110, g: 0.129, b: 0.188 },
    mapBg:   { r: 0.130, g: 0.160, b: 0.210 },
    mapRd:   { r: 0.200, g: 0.240, b: 0.300 },
    white:   { r: 1.000, g: 1.000, b: 1.000 },
    none:    { r: 0.000, g: 0.000, b: 0.000, a: 0 },
  };

  // ── HELPER: PAINT FILL ────────────────────────────────────────
  const fill = (c) => [{ type: 'SOLID', color: { r: c.r, g: c.g, b: c.b }, opacity: c.a !== undefined ? c.a : 1 }];

  // ── HELPER: RECTANGLE ─────────────────────────────────────────
  function R(p, x, y, w, h, c, radius = 0) {
    const n = figma.createRectangle();
    n.x = x; n.y = y;
    n.resize(Math.max(w, 1), Math.max(h, 1));
    n.fills = fill(c);
    if (radius) n.cornerRadius = radius;
    p.appendChild(n);
    return n;
  }

  // ── HELPER: TEXT ──────────────────────────────────────────────
  function T(p, s, x, y, sz, c, st = 'Regular', opts = {}) {
    const n = figma.createText();
    n.fontName = { family: FONT, style: SMAP[st] || 'Regular' };
    n.fontSize = sz;
    n.fills = fill(c);
    n.x = x; n.y = y;
    n.characters = String(s);
    if (opts.w) { n.textAutoResize = 'HEIGHT'; n.resize(opts.w, n.height); }
    if (opts.a) n.textAlignHorizontal = opts.a;
    if (opts.ls) n.letterSpacing = { value: opts.ls, unit: 'PIXELS' };
    p.appendChild(n);
    return n;
  }

  // ── HELPER: ELLIPSE (circle) ──────────────────────────────────
  function E(p, cx, cy, r, c) {
    const n = figma.createEllipse();
    n.x = cx - r; n.y = cy - r;
    n.resize(r * 2, r * 2);
    n.fills = fill(c);
    p.appendChild(n);
    return n;
  }

  // ── HELPER: FRAME ─────────────────────────────────────────────
  function F(p, name, x, y, w, h, c = null) {
    const n = figma.createFrame();
    n.name = name; n.x = x; n.y = y;
    n.resize(w, h);
    n.clipsContent = true;
    n.fills = c ? fill(c) : [];
    if (p) p.appendChild(n);
    return n;
  }

  // ── COMMON: STATUS BAR ────────────────────────────────────────
  function sb(p) {
    R(p, 0, 0, 390, 44, { r: 0, g: 0, b: 0, a: 0.2 });
    T(p, '9:41', 16, 14, 14, C.textS, 'SemiBold');
    T(p, '... WiFi 100%', 265, 15, 9, C.textS, 'Regular');
  }

  // ── COMMON: BOTTOM NAV ────────────────────────────────────────
  function BN(p, active = 'home') {
    const nav = F(p, '_BottomNav', 0, 786, 390, 58, C.card);
    R(nav, 0, 0, 390, 1, C.border);
    const tabs = [
      { icon: 'H', lbl: 'Home',     key: 'home',     x: 7 },
      { icon: 'N', lbl: 'Navigate', key: 'navigate', x: 85 },
      { icon: 'S', lbl: 'SOS',      key: 'sos',       x: 163 },
      { icon: '!', lbl: 'Report',   key: 'report',    x: 241 },
      { icon: 'P', lbl: 'Profile',  key: 'profile',   x: 319 },
    ];
    tabs.forEach(t => {
      const on = t.key === active;
      const col = on ? C.purple : C.textM;
      if (on) E(nav, t.x + 36, 20, 20, C.purpleD);
      R(nav, t.x + 16, 6, 42, 28, on ? C.purpleD : C.none, 14);
      T(nav, t.icon, t.x + 28, 9, 17, col, on ? 'ExtraBold' : 'Medium');
      T(nav, t.lbl, t.x + (t.lbl.length > 6 ? 0 : 5), 34, 9, col, on ? 'SemiBold' : 'Regular');
    });
    return nav;
  }

  // ── COMMON: MAP TILE ──────────────────────────────────────────
  function MAP(p, x, y, w, h) {
    R(p, x, y, w, h, C.mapBg, 12);
    // Grid lines
    for (let i = 1; i < 5; i++) R(p, x + i * (w / 5), y, 1, h, C.mapRd);
    for (let i = 1; i < 4; i++) R(p, x, y + i * (h / 4), w, 1, C.mapRd);
    // Roads
    R(p, x, y + h * 0.40, w, 7, C.mapRd);
    R(p, x + w * 0.35, y, 7, h, C.mapRd);
    // Safe route highlight (green)
    R(p, x + w * 0.35, y + h * 0.40, 7, h * 0.35, C.green, 3);
    R(p, x + w * 0.35, y + h * 0.75, w * 0.35, 7, C.green, 3);
    // Pins
    E(p, x + w * 0.35, y + h * 0.40, 9, C.green);
    E(p, x + w * 0.70, y + h * 0.75, 9, C.purple);
  }

  // ── COMMON: PHONE FRAME ───────────────────────────────────────
  function PH(parent, name, x, y) {
    const f = F(parent, name, x, y, 390, 844, C.bg);
    sb(f);
    return f;
  }

  // ── GRID POSITIONS ────────────────────────────────────────────
  const gx = i => 100 + i * (390 + 80);   // col x positions
  const gy = i => 100 + i * (844 + 100);  // row y positions

  // ================================================================
  //  UI SCREENS (12 total)
  // ================================================================

  // ── 01: SPLASH SCREEN ─────────────────────────────────────────
  function sc01(pg) {
    const f = PH(pg, '01 – Splash Screen', gx(0), gy(0));
    // Glow rings behind logo
    E(f, 195, 355, 120, { r: 0.388, g: 0.4, b: 0.945, a: 0.07 });
    E(f, 195, 355, 85,  { r: 0.388, g: 0.4, b: 0.945, a: 0.11 });
    // Logo circle
    E(f, 195, 355, 55, C.purple);
    T(f, 'S', 174, 323, 48, C.white, 'ExtraBold');
    // App name + tagline
    T(f, 'SafeRoute', 75, 438, 34, C.text, 'ExtraBold', { w: 240, a: 'CENTER' });
    T(f, 'Navigate Safely. Stay Protected.', 45, 488, 15, C.textS, 'Regular', { w: 300, a: 'CENTER' });
    // Stat cards
    const stats = [
      { val: '2.4M+', sub: 'Users Safe',  col: C.purple, x: 28 },
      { val: '99.8%', sub: 'Accuracy',    col: C.green,  x: 145 },
      { val: '4.9 *', sub: 'App Rating',  col: C.amber,  x: 262 },
    ];
    stats.forEach(s => {
      R(f, s.x, 548, 105, 60, C.card, 12);
      T(f, s.val, s.x + 10, 560, 18, s.col, 'Bold');
      T(f, s.sub, s.x + 10, 585, 10, C.textS, 'Regular');
    });
    // CTA
    R(f, 55, 698, 280, 52, C.purple, 26);
    T(f, 'Get Started', 118, 713, 16, C.white, 'SemiBold');
    T(f, 'Already have an account? Sign In', 58, 774, 13, C.textS, 'Regular');
  }

  // ── 02: ONBOARDING ────────────────────────────────────────────
  function sc02(pg) {
    const f = PH(pg, '02 – Onboarding', gx(1), gy(0));
    T(f, 'Skip', 328, 58, 14, C.textS, 'Medium');
    // Illustration card
    R(f, 30, 84, 330, 290, C.card, 20);
    E(f, 195, 232, 82, { r: 0.388, g: 0.4, b: 0.945, a: 0.10 });
    E(f, 195, 232, 56, { r: 0.388, g: 0.4, b: 0.945, a: 0.16 });
    E(f, 195, 232, 30, C.purple);
    // Neural net dots
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      E(f, 195 + Math.cos(a) * 68, 232 + Math.sin(a) * 68, 7, C.purpleD);
    }
    T(f, 'AI', 183, 220, 20, C.white, 'Bold');
    // Badge + title
    R(f, 148, 400, 94, 28, C.purpleD, 14);
    T(f, '01 / 03', 160, 408, 11, C.purple, 'SemiBold');
    T(f, 'AI-Powered\nRisk Assessment', 30, 440, 28, C.text, 'ExtraBold', { w: 330, a: 'CENTER' });
    T(f, 'Our AI analyzes crime data, lighting, crowd density,\nand real-time incidents before you step out.', 30, 514, 14, C.textS, 'Regular', { w: 330, a: 'CENTER' });
    // Dots + button
    E(f, 180, 620, 6, C.purple);
    E(f, 197, 620, 4, C.textM);
    E(f, 212, 620, 4, C.textM);
    R(f, 55, 665, 280, 52, C.purple, 26);
    T(f, 'Next', 157, 679, 16, C.white, 'SemiBold');
  }

  // ── 03: LOGIN / SIGN UP ───────────────────────────────────────
  function sc03(pg) {
    const f = PH(pg, '03 – Login / Sign Up', gx(2), gy(0));
    E(f, 195, 126, 36, C.purple);
    T(f, 'S', 181, 104, 28, C.white, 'ExtraBold');
    T(f, 'Welcome Back', 78, 178, 26, C.text, 'ExtraBold', { w: 234, a: 'CENTER' });
    T(f, 'Sign in to continue safely', 75, 215, 15, C.textS, 'Regular', { w: 240, a: 'CENTER' });
    // Google
    R(f, 30, 256, 330, 52, C.card2, 12);
    E(f, 60, 282, 14, C.white);
    T(f, 'G', 53, 270, 18, { r: 0.9, g: 0.2, b: 0.2 }, 'Bold');
    T(f, 'Continue with Google', 90, 268, 15, C.text, 'Medium');
    // Divider
    R(f, 30, 326, 130, 1, C.border);
    T(f, 'or', 183, 316, 13, C.textM, 'Regular');
    R(f, 220, 326, 140, 1, C.border);
    // Email
    T(f, 'Email Address', 30, 350, 11, C.textS, 'Medium');
    R(f, 30, 370, 330, 50, C.card, 10);
    R(f, 30, 370, 3, 50, C.purple, 2);
    T(f, 'sahil@example.com', 48, 386, 14, C.textS, 'Regular');
    // Password
    T(f, 'Password', 30, 434, 11, C.textS, 'Medium');
    R(f, 30, 452, 330, 50, C.card, 10);
    T(f, '* * * * * * * * * *', 48, 466, 14, C.textS, 'Regular');
    T(f, 'Forgot password?', 248, 518, 13, C.purple, 'Medium');
    // Login button
    R(f, 30, 558, 330, 52, C.purple, 26);
    T(f, 'Sign In', 153, 572, 16, C.white, 'SemiBold');
    T(f, "Don't have an account?", 72, 638, 13, C.textS, 'Regular');
    T(f, 'Create Account', 234, 638, 13, C.purple, 'SemiBold');
    T(f, 'By signing in, you agree to Terms & Privacy Policy', 42, 786, 11, C.textM, 'Regular', { w: 306, a: 'CENTER' });
  }

  // ── 04: DASHBOARD ─────────────────────────────────────────────
  function sc04(pg) {
    const f = PH(pg, '04 – Dashboard (Home)', gx(3), gy(0));
    T(f, 'Good Evening, Sahil', 20, 55, 18, C.text, 'SemiBold');
    E(f, 356, 67, 20, C.card2);
    T(f, 'o', 348, 56, 16, C.textS, 'Bold');
    // Risk card
    R(f, 20, 90, 350, 95, C.card, 16);
    R(f, 20, 90, 4, 95, C.green, 2);
    T(f, 'CURRENT SAFETY LEVEL', 36, 104, 10, C.textS, 'SemiBold', { ls: 1 });
    T(f, 'LOW RISK', 36, 122, 22, C.green, 'ExtraBold', { ls: 1.5 });
    T(f, 'Your area is currently safe', 36, 152, 13, C.textS, 'Regular');
    E(f, 332, 137, 28, C.greenD);
    T(f, 'OK', 320, 126, 14, C.green, 'Bold');
    // Mini map
    MAP(f, 20, 204, 350, 164);
    T(f, 'o Your Location', 32, 354, 11, { r: 1, g: 1, b: 1, a: 0.7 }, 'Medium');
    // Quick actions
    T(f, 'Quick Actions', 20, 388, 14, C.text, 'SemiBold');
    const acts = [
      { lbl: 'Navigate', sub: 'Plan route', c: C.purple, d: C.purpleD, x: 20 },
      { lbl: 'SOS Alert', sub: 'Emergency', c: C.red,    d: C.redD,    x: 135 },
      { lbl: 'Report',   sub: 'Add hazard', c: C.amber,  d: C.amberD,  x: 250 },
    ];
    acts.forEach(a => {
      R(f, a.x, 410, 105, 85, C.card, 14);
      R(f, a.x, 410, 105, 85, a.d, 14);
      E(f, a.x + 52, 440, 22, a.d);
      T(f, '*', a.x + 44, 428, 18, a.c, 'Bold');
      T(f, a.lbl, a.x + 8, 456, 13, C.text, 'SemiBold');
      T(f, a.sub, a.x + 8, 473, 10, C.textS, 'Regular');
    });
    // Recent routes
    T(f, 'Recent Routes', 20, 514, 14, C.text, 'SemiBold');
    T(f, 'See all', 318, 516, 12, C.purple, 'Medium');
    [
      { from: 'Home', to: 'College', score: '98', t: '22 min', c: C.green },
      { from: 'College', to: 'Market', score: '84', t: '14 min', c: C.amber },
    ].forEach((r, i) => {
      const ry = 538 + i * 72;
      R(f, 20, ry, 350, 62, C.card, 12);
      E(f, 50, ry + 31, 20, C.card2);
      T(f, r.from[0], 42, ry + 19, 20, r.c, 'Bold');
      T(f, r.from + ' - ' + r.to, 78, ry + 14, 14, C.text, 'SemiBold');
      T(f, r.t + '  · Safety ' + r.score + '%', 78, ry + 34, 12, C.textS, 'Regular');
      R(f, 284, ry + 17, 66, 26, { r: r.c.r, g: r.c.g, b: r.c.b, a: 0.15 }, 13);
      T(f, r.score + '%', 296, ry + 22, 12, r.c, 'SemiBold');
    });
    BN(f, 'home');
  }

  // ── 05: NAVIGATE (Route Selection) ───────────────────────────
  function sc05(pg) {
    const f = PH(pg, '05 – Navigate (Route Selection)', gx(0), gy(1));
    T(f, '< Back', 20, 55, 14, C.textS, 'Medium');
    T(f, 'Plan Route', 128, 55, 18, C.text, 'SemiBold');
    // From field
    R(f, 20, 90, 350, 48, C.card, 12);
    E(f, 46, 114, 12, C.greenD);
    T(f, 'o', 41, 102, 16, C.green, 'Bold');
    T(f, 'Current Location (GPS)', 62, 103, 14, C.textS, 'Regular');
    // To field
    R(f, 20, 148, 350, 48, C.card, 12);
    R(f, 20, 148, 350, 48, { r: 0.388, g: 0.4, b: 0.945, a: 0.04 }, 12);
    E(f, 46, 172, 12, C.purpleD);
    T(f, 'v', 41, 160, 16, C.purple, 'Bold');
    T(f, 'Where to? Search...', 62, 161, 14, C.textM, 'Regular');
    // Map
    MAP(f, 20, 210, 350, 258);
    // Route cards
    T(f, 'Recommended Routes', 20, 488, 14, C.text, 'SemiBold');
    [
      { lbl: 'Safest Route',  t: '24 min', d: '3.2 km', s: '98%', c: C.green, sel: true },
      { lbl: 'Fastest Route', t: '18 min', d: '2.8 km', s: '76%', c: C.amber, sel: false },
    ].forEach((r, i) => {
      const ry = 512 + i * 76;
      R(f, 20, ry, 350, 66, C.card, 14);
      if (r.sel) { R(f, 20, ry, 350, 66, { r: r.c.r, g: r.c.g, b: r.c.b, a: 0.05 }, 14); R(f, 20, ry, 4, 66, r.c, 2); }
      T(f, r.lbl, 36, ry + 12, 14, C.text, 'SemiBold');
      T(f, r.t + '  ·  ' + r.d, 36, ry + 34, 12, C.textS, 'Regular');
      R(f, 248, ry + 19, 94, 28, { r: r.c.r, g: r.c.g, b: r.c.b, a: 0.15 }, 14);
      T(f, r.s + ' Safe', 258, ry + 24, 11, r.c, 'SemiBold');
    });
    R(f, 20, 706, 350, 52, C.purple, 26);
    T(f, 'Start Navigation', 118, 720, 16, C.white, 'SemiBold');
    BN(f, 'navigate');
  }

  // ── 06: ACTIVE NAVIGATION ────────────────────────────────────
  function sc06(pg) {
    const f = PH(pg, '06 – Active Navigation', gx(1), gy(1));
    MAP(f, 0, 44, 390, 464);
    T(f, 'NAVIGATING', 138, 62, 10, C.white, 'SemiBold', { ls: 2 });
    R(f, 326, 57, 56, 28, { r: 0, g: 0, b: 0, a: 0.5 }, 14);
    T(f, 'X Exit', 334, 64, 11, C.white, 'Medium');
    // Direction sheet
    R(f, 0, 494, 390, 350, C.bg);
    R(f, 0, 494, 390, 350, C.card);
    E(f, 50, 532, 30, C.purpleD);
    T(f, '<', 37, 515, 26, C.purple, 'Bold');
    T(f, 'Turn left on', 90, 510, 12, C.textS, 'Regular');
    T(f, 'MG Road', 90, 528, 22, C.text, 'ExtraBold');
    T(f, 'In 200m', 90, 557, 14, C.textS, 'Regular');
    R(f, 20, 580, 350, 1, C.border);
    // Stats
    [
      { val: '3.2 km', lbl: 'Remaining', x: 28 },
      { val: '12 min', lbl: 'ETA',       x: 155 },
      { val: 'LOW',    lbl: 'Risk Level', x: 272 },
    ].forEach(s => {
      T(f, s.val, s.x, 596, 18, s.lbl === 'Risk Level' ? C.green : C.text, 'Bold');
      T(f, s.lbl, s.x, 621, 11, C.textS, 'Regular');
    });
    R(f, 20, 648, 350, 1, C.border);
    R(f, 20, 658, 350, 50, C.greenD, 12);
    T(f, 'v  Safe route · Well-lit area · Low risk', 38, 672, 12, C.green, 'Medium');
    // Emergency strip
    R(f, 20, 726, 160, 46, C.card2, 12);
    T(f, 'Share Location', 36, 742, 13, C.textS, 'Medium');
    R(f, 210, 726, 160, 46, C.redD, 12);
    T(f, '! SOS Emergency', 222, 742, 13, C.red, 'Medium');
  }

  // ── 07: SOS TRIGGER ──────────────────────────────────────────
  function sc07(pg) {
    const f = PH(pg, '07 – SOS Trigger', gx(2), gy(1));
    R(f, 0, 44, 390, 50, C.redD);
    T(f, '! EMERGENCY MODE', 106, 59, 14, C.red, 'Bold', { ls: 1 });
    T(f, 'Emergency SOS', 96, 114, 26, C.text, 'ExtraBold', { w: 198, a: 'CENTER' });
    T(f, 'Hold button 3 seconds to trigger', 42, 152, 14, C.textS, 'Regular', { w: 306, a: 'CENTER' });
    // Pulsing rings
    E(f, 195, 315, 114, { r: 0.937, g: 0.267, b: 0.267, a: 0.07 });
    E(f, 195, 315, 90,  { r: 0.937, g: 0.267, b: 0.267, a: 0.12 });
    E(f, 195, 315, 68, C.red);
    T(f, 'SOS', 162, 296, 30, C.white, 'ExtraBold');
    T(f, 'HOLD', 168, 336, 12, { r: 1, g: 1, b: 1, a: 0.7 }, 'Medium', { ls: 2 });
    // Countdown
    R(f, 145, 428, 100, 90, C.card, 45);
    T(f, '3', 178, 444, 40, C.red, 'ExtraBold');
    T(f, 'seconds', 155, 494, 11, C.textS, 'Regular');
    // Cancel
    R(f, 110, 540, 170, 44, C.card2, 22);
    T(f, 'X  Cancel SOS', 140, 555, 14, C.textS, 'Medium');
    // Contacts
    T(f, 'Will alert your contacts:', 20, 606, 12, C.textS, 'Medium');
    [
      { n: 'Mom - Priya Kumar',  p: '+91 98765 00001' },
      { n: 'Dad - Rajesh Kumar', p: '+91 98765 00002' },
    ].forEach((c, i) => {
      const cy = 628 + i * 66;
      R(f, 20, cy, 350, 56, C.card, 12);
      E(f, 50, cy + 28, 20, C.card2);
      T(f, c.n[0], 43, cy + 16, 20, C.purple, 'Bold');
      T(f, c.n, 76, cy + 14, 14, C.text, 'SemiBold');
      T(f, c.p, 76, cy + 34, 12, C.textS, 'Regular');
    });
    T(f, '+ Add Emergency Contact', 114, 772, 13, C.purple, 'Medium');
  }

  // ── 08: SOS ACTIVATED ────────────────────────────────────────
  function sc08(pg) {
    const f = PH(pg, '08 – SOS Activated', gx(3), gy(1));
    R(f, 0, 44, 390, 200, { r: 0.937, g: 0.267, b: 0.267, a: 0.07 });
    E(f, 195, 140, 55, C.redD);
    E(f, 195, 140, 38, C.red);
    T(f, '!', 186, 114, 36, C.white, 'ExtraBold');
    T(f, 'ALERT SENT', 104, 212, 26, C.red, 'ExtraBold', { ls: 3 });
    T(f, 'Emergency contacts notified\nand authorities alerted', 48, 252, 15, C.textS, 'Regular', { w: 294, a: 'CENTER' });
    // Live location card
    R(f, 20, 306, 350, 60, C.card, 14);
    R(f, 20, 306, 3, 60, C.green, 2);
    T(f, 'o', 40, 322, 20, C.green, 'Bold');
    T(f, 'Live location is being shared', 68, 315, 14, C.text, 'SemiBold');
    T(f, 'Updated every 10 seconds', 68, 337, 12, C.green, 'Regular');
    T(f, 'Contacts Notified:', 20, 382, 12, C.textS, 'Medium');
    [
      { n: 'Mom - Priya Kumar',  s: 'Notified · 0s ago', sc: C.green },
      { n: 'Dad - Rajesh Kumar', s: 'Notified · 2s ago', sc: C.green },
      { n: 'Police Control Room', s: 'Alert Sent · Auto', sc: C.amber },
    ].forEach((c, i) => {
      const cy = 404 + i * 68;
      R(f, 20, cy, 350, 58, C.card, 12);
      E(f, 50, cy + 29, 20, C.card2);
      T(f, c.n[0], 43, cy + 17, 20, C.purple, 'Bold');
      T(f, c.n, 76, cy + 15, 14, C.text, 'SemiBold');
      T(f, c.s, 76, cy + 35, 12, c.sc, 'Medium');
    });
    R(f, 20, 620, 350, 52, C.card2, 26);
    T(f, "I'm Safe - Cancel SOS", 96, 634, 15, C.text, 'SemiBold');
    T(f, 'SOS active for 00:45', 126, 690, 13, C.textS, 'Regular');
  }

  // ── 09: HAZARD REPORT ────────────────────────────────────────
  function sc09(pg) {
    const f = PH(pg, '09 – Hazard Report', gx(0), gy(2));
    T(f, '< Back', 20, 55, 14, C.textS, 'Medium');
    T(f, 'Report a Hazard', 106, 55, 18, C.text, 'SemiBold');
    // Camera area
    R(f, 20, 88, 350, 148, C.card, 16);
    E(f, 195, 162, 36, C.card2);
    T(f, '[+]', 178, 147, 22, C.textS, 'Regular');
    T(f, 'Tap to add photo', 128, 210, 13, C.textS, 'Regular');
    // Location
    R(f, 20, 252, 350, 50, C.card, 12);
    R(f, 20, 252, 3, 50, C.green, 2);
    T(f, 'GPS Location Auto-detected', 36, 260, 11, C.green, 'Medium');
    T(f, 'Near MG Road, Bangalore · 0.2km away', 36, 279, 13, C.text, 'Regular');
    // Hazard types
    T(f, 'Hazard Type', 20, 320, 12, C.textS, 'Medium');
    ['Poor Lighting', 'Suspicious', 'Broken Road', 'Flooding', 'Unsafe Area', 'Other'].forEach((t, i) => {
      const on = i === 0;
      const tx = 20 + (i % 3) * 120, ty = 342 + Math.floor(i / 3) * 42;
      R(f, tx, ty, 112, 32, on ? C.purpleD : C.card, 16);
      T(f, t, tx + 8, ty + 9, 11, on ? C.purple : C.textS, on ? 'SemiBold' : 'Regular');
    });
    // Description
    T(f, 'Description (optional)', 20, 440, 12, C.textS, 'Medium');
    R(f, 20, 460, 350, 80, C.card, 12);
    T(f, 'Describe the hazard here...', 36, 476, 14, C.textM, 'Regular');
    // Severity
    T(f, 'Severity Level', 20, 556, 12, C.textS, 'Medium');
    [
      { lbl: 'Low',    c: C.green, d: C.greenD, x: 20 },
      { lbl: 'Medium', c: C.amber, d: C.amberD, x: 140 },
      { lbl: 'High',   c: C.red,   d: C.redD,   x: 260 },
    ].forEach(s => {
      R(f, s.x, 576, 100, 34, s.d, 17);
      T(f, s.lbl, s.x + (s.lbl === 'Medium' ? 24 : 30), 584, 13, s.c, 'SemiBold');
    });
    // Submit
    R(f, 20, 690, 350, 52, C.amber, 26);
    T(f, 'Submit Report', 128, 704, 16, C.white, 'SemiBold');
    T(f, 'Reports reviewed by community in 2 hours', 72, 760, 12, C.textM, 'Regular');
  }

  // ── 10: COMMUNITY MAP ────────────────────────────────────────
  function sc10(pg) {
    const f = PH(pg, '10 – Community Map', gx(1), gy(2));
    T(f, 'Community Safety Map', 80, 55, 18, C.text, 'SemiBold');
    // Filter chips
    ['All', 'Lighting', 'Road', 'Crime', 'Other'].forEach((fil, i) => {
      const on = i === 0;
      R(f, 20 + i * 72, 88, 64, 28, on ? C.purple : C.card, 14);
      T(f, fil, 20 + i * 72 + (on ? 16 : 14), 95, 12, on ? C.white : C.textS, on ? 'SemiBold' : 'Regular');
    });
    // Map
    MAP(f, 0, 130, 390, 462);
    // Hazard pins
    [
      { x: 100, y: 200, c: C.amber, l: '!' },
      { x: 250, y: 280, c: C.red,   l: '!!' },
      { x: 180, y: 370, c: C.amber, l: '!' },
      { x: 310, y: 450, c: C.green, l: 'v' },
    ].forEach(pin => {
      E(f, pin.x, 130 + pin.y, 16, { r: pin.c.r, g: pin.c.g, b: pin.c.b, a: 0.85 });
      T(f, pin.l, pin.x - 6, 130 + pin.y - 10, 13, C.white, 'Bold');
    });
    // Legend
    R(f, 20, 606, 350, 90, C.card, 14);
    T(f, 'Legend:', 30, 618, 12, C.textS, 'SemiBold');
    [{ c: C.green, l: 'Safe Zone' }, { c: C.amber, l: 'Caution' }, { c: C.red, l: 'High Risk' }].forEach((l, i) => {
      E(f, 44 + i * 112, 660, 8, l.c);
      T(f, l.l, 56 + i * 112, 652, 12, C.textS, 'Regular');
    });
    T(f, '147 reports this week in your area', 54, 714, 13, C.textS, 'Regular');
    BN(f, 'report');
  }

  // ── 11: ROUTE SUMMARY ────────────────────────────────────────
  function sc11(pg) {
    const f = PH(pg, '11 – Route Summary', gx(2), gy(2));
    R(f, 0, 44, 390, 58, C.greenD);
    T(f, 'v  Trip Complete - Arrived Safely!', 48, 64, 15, C.green, 'SemiBold');
    T(f, 'Route Summary', 118, 122, 22, C.text, 'ExtraBold');
    T(f, 'College - Home  ·  July 21, 2026', 76, 154, 13, C.textS, 'Regular');
    // Score circle
    E(f, 195, 270, 74, C.card2);
    E(f, 195, 270, 65, { r: 0.063, g: 0.725, b: 0.506, a: 0.2 });
    T(f, '96', 172, 247, 38, C.green, 'ExtraBold');
    T(f, 'Safety Score', 150, 300, 11, C.textS, 'Regular', { w: 90, a: 'CENTER' });
    // Stats grid
    [
      { val: '4.2 km', lbl: 'Distance' },
      { val: '28 min', lbl: 'Duration' },
      { val: '97%',    lbl: 'Lit Path'  },
      { val: '0',      lbl: 'Hazards'   },
    ].forEach((s, i) => {
      const sx = 20 + (i % 2) * 185, sy = 368 + Math.floor(i / 2) * 76;
      R(f, sx, sy, 170, 62, C.card, 12);
      T(f, s.val, sx + 14, sy + 10, 22, C.text, 'Bold');
      T(f, s.lbl, sx + 14, sy + 38, 12, C.textS, 'Regular');
    });
    // Route map
    MAP(f, 20, 528, 350, 124);
    T(f, 'Safe route taken', 34, 640, 11, { r: 1, g: 1, b: 1, a: 0.6 }, 'Regular');
    // Actions
    R(f, 20, 672, 165, 50, C.card2, 25);
    T(f, 'Share Report', 42, 686, 13, C.text, 'SemiBold');
    R(f, 205, 672, 165, 50, C.purple, 25);
    T(f, 'New Route', 230, 686, 13, C.white, 'SemiBold');
    T(f, '* Rate this route', 145, 740, 13, C.amber, 'Medium');
    BN(f, 'home');
  }

  // ── 12: PROFILE & SETTINGS ───────────────────────────────────
  function sc12(pg) {
    const f = PH(pg, '12 – Profile & Settings', gx(3), gy(2));
    T(f, 'Profile & Settings', 96, 55, 18, C.text, 'SemiBold');
    // Avatar
    E(f, 195, 140, 50, C.purple);
    T(f, 'SK', 174, 120, 26, C.white, 'Bold');
    T(f, 'Sahil Kumar', 138, 206, 20, C.text, 'SemiBold', { w: 114, a: 'CENTER' });
    T(f, 'sahil@example.com', 104, 233, 13, C.textS, 'Regular', { w: 182, a: 'CENTER' });
    R(f, 148, 255, 94, 26, C.purpleD, 13);
    T(f, 'v Verified', 163, 262, 12, C.purple, 'SemiBold');
    // Profile stats
    [
      { val: '47',  lbl: 'Trips' },
      { val: '96%', lbl: 'Avg Safety' },
      { val: '2',   lbl: 'Contacts' },
    ].forEach((ps, i) => {
      R(f, 20 + i * 118, 294, 108, 52, C.card, 12);
      T(f, ps.val, 20 + i * 118 + 24, 304, 20, C.purple, 'Bold');
      T(f, ps.lbl, 20 + i * 118 + 12, 330, 11, C.textS, 'Regular');
    });
    // Settings rows
    let sy = 364;
    T(f, 'EMERGENCY CONTACTS', 20, sy, 10, C.textS, 'SemiBold', { ls: 1 }); sy += 22;
    ['Mom - Priya Kumar', 'Dad - Rajesh Kumar'].forEach(item => {
      R(f, 20, sy, 350, 48, C.card, 12);
      T(f, item, 36, sy + 15, 14, C.text, 'Regular');
      T(f, '>', 350, sy + 14, 18, C.textM, 'Regular');
      sy += 56;
    });
    sy += 10;
    T(f, 'PREFERENCES', 20, sy, 10, C.textS, 'SemiBold', { ls: 1 }); sy += 22;
    ['Notifications', 'Dark Mode', 'Auto SOS Trigger', 'Location Sharing'].forEach(item => {
      R(f, 20, sy, 350, 48, C.card, 12);
      T(f, item, 36, sy + 15, 14, C.text, 'Regular');
      T(f, '>', 350, sy + 14, 18, C.textM, 'Regular');
      sy += 56;
    });
    sy += 10;
    R(f, 20, sy, 350, 44, C.redD, 12);
    T(f, 'Sign Out', 150, sy + 13, 14, C.red, 'SemiBold');
    BN(f, 'profile');
  }

  // ================================================================
  //  PAGE 1: SITE MAP & ARCHITECTURE
  // ================================================================
  function buildSiteMap(pg) {
    pg.name = '01 – Site Map & Architecture';

    function BOX(x, y, w, h, label, sub, c) {
      R(pg, x, y, w, h, C.card, 10);
      R(pg, x, y, 4, h, c, 2);
      T(pg, label, x + 12, y + (h <= 42 ? 12 : h / 2 - 14), 13, C.text, 'SemiBold');
      if (sub && h > 42) T(pg, sub, x + 12, y + h / 2 + 5, 10, C.textS, 'Regular');
    }
    function VL(x, y, len) { R(pg, x, y, 2, len, C.border); }
    function HL(x, y, len) { R(pg, x, y, len, 2, C.border); }

    // Title
    T(pg, 'SafeRoute — Information Architecture & Site Map', 80, 40, 30, C.text, 'ExtraBold');
    T(pg, 'PETV157 UI/UX Project · Complete screen flow and navigation structure', 80, 82, 16, C.textS, 'Regular');

    // Legend
    T(pg, 'COLOR KEY:', 820, 48, 11, C.textS, 'SemiBold', { ls: 1 });
    [
      { c: C.purple, l: 'Auth / Onboarding Flow' },
      { c: C.green,  l: 'Core / Dashboard Screens' },
      { c: C.red,    l: 'Emergency SOS Flow' },
      { c: C.amber,  l: 'Hazard / Report Flow' },
    ].forEach((l, i) => {
      R(pg, 820, 72 + i * 30, 22, 18, l.c, 4);
      T(pg, l.l, 850, 75 + i * 30, 13, C.textS, 'Regular');
    });

    // ── Auth column (center, x=240)
    BOX(240, 140, 180, 50, 'Splash Screen', 'App entry · branding', C.purple);
    VL(329, 190, 30);
    BOX(240, 222, 180, 50, 'Onboarding (x3)', 'Feature intro slides', C.purple);
    VL(329, 272, 30);
    BOX(240, 304, 180, 50, 'Login / Sign Up', 'Authentication gate', C.purple);
    VL(329, 354, 44);
    // Arrow
    T(pg, 'v', 324, 390, 14, C.textM, 'Regular');

    // ── Dashboard (center)
    BOX(190, 406, 280, 62, 'DASHBOARD (HOME)', 'Central hub · Risk level · Quick actions', C.green);

    // ── Branch: Navigate (left)
    HL(80, 436, 188);
    VL(80, 436, 82);
    T(pg, 'v', 75, 510, 14, C.textM, 'Regular');
    BOX(18, 526, 160, 50, 'Navigate', 'Route selection', C.purple);
    VL(98, 576, 32);
    BOX(18, 610, 160, 50, 'Active Navigation', 'Turn-by-turn live', C.purple);
    VL(98, 660, 32);
    BOX(18, 694, 160, 50, 'Route Summary', 'Trip complete', C.green);

    // ── Branch: SOS (center-left)
    VL(298, 468, 56);
    T(pg, 'v', 293, 516, 14, C.textM, 'Regular');
    BOX(218, 532, 160, 50, 'SOS Trigger', 'Emergency hold button', C.red);
    VL(298, 582, 32);
    BOX(218, 616, 160, 50, 'SOS Activated', 'Alert sent · Live GPS', C.red);

    // ── Branch: Hazard Report (center-right)
    HL(470, 436, 78);
    VL(470, 436, 82);
    T(pg, 'v', 465, 510, 14, C.textM, 'Regular');
    BOX(390, 526, 160, 50, 'Hazard Report', 'Submit incident', C.amber);
    VL(470, 576, 32);
    BOX(390, 610, 160, 50, 'Community Map', 'View all hazards', C.amber);

    // ── Branch: Profile (far right)
    HL(470, 436, 200);
    VL(668, 436, 82);
    T(pg, 'v', 663, 510, 14, C.textM, 'Regular');
    BOX(588, 526, 160, 50, 'Profile & Settings', 'Contacts · Prefs', C.textS);

    // ── Bottom nav label
    R(pg, 18, 800, 752, 60, C.card, 12);
    T(pg, 'PERSISTENT BOTTOM NAVIGATION (All Main Screens):', 30, 810, 10, C.textS, 'SemiBold', { ls: 1 });
    T(pg, 'Home   |   Navigate   |   SOS   |   Report   |   Profile', 30, 830, 16, C.text, 'Regular');

    // ── Screen count
    T(pg, '12 Screens Total', 820, 200, 22, C.text, 'Bold');
    [
      '01 – Splash Screen', '02 – Onboarding (3 slides)', '03 – Login / Sign Up',
      '04 – Dashboard (Home)', '05 – Navigate (Route Select)', '06 – Active Navigation',
      '07 – SOS Trigger', '08 – SOS Activated', '09 – Hazard Report',
      '10 – Community Map', '11 – Route Summary', '12 – Profile & Settings',
    ].forEach((s, i) => {
      R(pg, 820, 228 + i * 36, 10, 10, C.purple, 2);
      T(pg, s, 838, 228 + i * 36, 13, C.textS, 'Regular');
    });
  }

  // ================================================================
  //  PAGE 2: DESIGN SYSTEM
  // ================================================================
  function buildDesignSystem(pg) {
    pg.name = '02 – Design System';
    T(pg, 'SafeRoute — Design System', 80, 40, 30, C.text, 'ExtraBold');
    T(pg, 'Colors · Typography · Components · Spacing · Patterns', 80, 82, 16, C.textS, 'Regular');

    // ── Colors
    T(pg, 'COLOR PALETTE', 80, 132, 11, C.textS, 'SemiBold', { ls: 2 });
    [
      { c: C.bg,     h: '#0B0E14', n: 'Background Primary' },
      { c: C.card,   h: '#131720', n: 'Card / Surface' },
      { c: C.card2,  h: '#1C2130', n: 'Elevated / Border' },
      { c: C.purple, h: '#6366F1', n: 'Accent Purple (CTA)' },
      { c: C.green,  h: '#10B981', n: 'Safe / Success' },
      { c: C.red,    h: '#EF4444', n: 'Danger / SOS' },
      { c: C.amber,  h: '#F59E0B', n: 'Warning / Caution' },
      { c: C.text,   h: '#E2E8F0', n: 'Text Primary' },
      { c: C.textS,  h: '#8892B0', n: 'Text Secondary' },
      { c: C.textM,  h: '#596178', n: 'Text Muted' },
    ].forEach((p, i) => {
      const px = 80 + (i % 5) * 168, py = 158 + Math.floor(i / 5) * 110;
      R(pg, px, py, 148, 70, p.c, 10);
      T(pg, p.h, px, py + 78, 11, C.text, 'SemiBold');
      T(pg, p.n, px, py + 94, 10, C.textS, 'Regular');
    });

    // ── Typography
    T(pg, 'TYPOGRAPHY — INTER (Google Fonts)', 80, 408, 11, C.textS, 'SemiBold', { ls: 2 });
    [
      { s: 'Display Heading',      sz: 32, st: 'ExtraBold', spec: '32px · ExtraBold' },
      { s: 'Section Title',         sz: 24, st: 'Bold',      spec: '24px · Bold' },
      { s: 'Subheading',            sz: 18, st: 'SemiBold',  spec: '18px · SemiBold' },
      { s: 'Body Text Regular',     sz: 14, st: 'Regular',   spec: '14px · Regular' },
      { s: 'Caption Text',          sz: 11, st: 'Regular',   spec: '11px · Regular' },
      { s: 'LABEL UPPERCASE',       sz: 10, st: 'SemiBold',  spec: '10px · SemiBold · 2px tracking' },
    ].forEach((t, i) => {
      T(pg, t.s, 80, 434 + i * 56, t.sz, C.text, t.st);
      T(pg, t.spec, 80, 434 + i * 56 + t.sz + 4, 10, C.textS, 'Regular');
    });

    // ── Components
    T(pg, 'CORE COMPONENTS', 860, 132, 11, C.textS, 'SemiBold', { ls: 2 });
    // Buttons
    T(pg, 'Buttons', 860, 158, 13, C.textS, 'Medium');
    R(pg, 860, 180, 230, 50, C.purple, 25); T(pg, 'Primary CTA Button', 910, 195, 14, C.white, 'SemiBold');
    R(pg, 860, 244, 230, 50, C.card2, 25);  T(pg, 'Secondary Button', 906, 259, 14, C.text, 'SemiBold');
    R(pg, 860, 308, 230, 50, C.redD, 25);   T(pg, 'Danger Button', 918, 323, 14, C.red, 'SemiBold');
    // Risk Badges
    T(pg, 'Risk Badges', 860, 382, 13, C.textS, 'Medium');
    [
      { lbl: 'LOW RISK',    c: C.green, d: C.greenD },
      { lbl: 'MEDIUM RISK', c: C.amber, d: C.amberD },
      { lbl: 'HIGH RISK',   c: C.red,   d: C.redD },
    ].forEach((b, i) => {
      R(pg, 860, 404 + i * 42, 148, 30, b.d, 15);
      T(pg, b.lbl, 876, 412 + i * 42, 11, b.c, 'SemiBold', { ls: 1 });
    });
    // Input Field
    T(pg, 'Input Field', 860, 546, 13, C.textS, 'Medium');
    R(pg, 860, 568, 330, 52, C.card, 12);
    R(pg, 860, 568, 3, 52, C.purple, 2);
    T(pg, 'Email Address', 878, 576, 11, C.purple, 'Medium');
    T(pg, 'sahil@example.com', 878, 595, 14, C.text, 'Regular');
    // Card
    T(pg, 'Card Component', 860, 642, 13, C.textS, 'Medium');
    R(pg, 860, 664, 330, 80, C.card, 14);
    R(pg, 860, 664, 4, 80, C.purple, 2);
    T(pg, 'Card Title', 878, 681, 14, C.text, 'SemiBold');
    T(pg, 'Supporting information text', 878, 703, 12, C.textS, 'Regular');
    T(pg, '>', 1162, 696, 18, C.purple, 'Bold');
    // Spacing
    T(pg, 'SPACING TOKENS', 860, 766, 11, C.textS, 'SemiBold', { ls: 2 });
    [4, 8, 12, 16, 24, 32, 48].forEach((sp, i) => {
      R(pg, 860 + i * 80, 792, sp, sp, C.purple, 2);
      T(pg, sp + 'px', 860 + i * 80, 822, 10, C.textS, 'Regular');
    });
  }

  // ================================================================
  //  PAGE 4: PROTOTYPE FLOW GUIDE
  // ================================================================
  function buildPrototypeGuide(pg) {
    pg.name = '04 – Prototype Flow Guide';
    T(pg, 'SafeRoute — Prototype Connection Guide', 80, 40, 30, C.text, 'ExtraBold');
    T(pg, 'Use Figma Prototype mode (top-right menu) to draw these connections', 80, 84, 16, C.textS, 'Regular');

    R(pg, 80, 120, 680, 60, C.greenD, 14);
    T(pg, 'HOW TO: In Figma → Switch to Prototype tab → Drag arrows between frames listed below', 100, 142, 14, C.green, 'SemiBold');

    const flows = [
      { from: '01 – Splash Screen',           to: '02 – Onboarding',              trigger: 'On Click / Tap',           note: 'Auto-advance after 2s' },
      { from: '02 – Onboarding',               to: '03 – Login / Sign Up',          trigger: 'Click "Next" button',      note: 'After 3rd slide' },
      { from: '03 – Login / Sign Up',          to: '04 – Dashboard (Home)',          trigger: 'Click "Sign In" button',   note: 'After auth success' },
      { from: '04 – Dashboard (Home)',          to: '05 – Navigate (Route Selection)', trigger: 'Click "Navigate" action', note: '' },
      { from: '05 – Navigate (Route Selection)', to: '06 – Active Navigation',        trigger: 'Click "Start Navigation"', note: '' },
      { from: '06 – Active Navigation',        to: '11 – Route Summary',             trigger: 'Trip End',                 note: '' },
      { from: '04 – Dashboard (Home)',          to: '07 – SOS Trigger',              trigger: 'Click "SOS Alert" button', note: 'Emergency flow' },
      { from: '07 – SOS Trigger',              to: '08 – SOS Activated',             trigger: 'Hold 3 seconds',           note: 'After countdown' },
      { from: '08 – SOS Activated',            to: '04 – Dashboard (Home)',          trigger: 'Click "Cancel SOS"',       note: '' },
      { from: '04 – Dashboard (Home)',          to: '09 – Hazard Report',            trigger: 'Click "Report" button',    note: '' },
      { from: '09 – Hazard Report',            to: '10 – Community Map',             trigger: 'Click "Submit Report"',    note: '' },
      { from: 'Bottom Nav - Home tab',         to: '04 – Dashboard (Home)',          trigger: 'Click Bottom Nav',         note: 'On all main screens' },
      { from: 'Bottom Nav - Navigate tab',     to: '05 – Navigate (Route Selection)', trigger: 'Click Bottom Nav',        note: '' },
      { from: 'Bottom Nav - Profile tab',      to: '12 – Profile & Settings',        trigger: 'Click Bottom Nav',         note: '' },
    ];

    // Header row
    R(pg, 80, 200, 680, 36, C.card2, 8);
    T(pg, 'FROM SCREEN', 96, 211, 11, C.textS, 'SemiBold', { ls: 1 });
    T(pg, 'TO SCREEN', 356, 211, 11, C.textS, 'SemiBold', { ls: 1 });
    T(pg, 'TRIGGER', 566, 211, 11, C.textS, 'SemiBold', { ls: 1 });

    flows.forEach((fl, i) => {
      const ry = 238 + i * 46;
      R(pg, 80, ry, 680, 40, i % 2 === 0 ? C.card : C.bg, 8);
      T(pg, fl.from, 96, ry + 13, 12, C.text, 'Regular');
      T(pg, '>', 344, ry + 12, 14, C.purple, 'Bold');
      T(pg, fl.to, 358, ry + 13, 12, C.text, 'Regular');
      T(pg, fl.trigger, 568, ry + 13, 12, C.purple, 'Medium');
    });

    // Settings reminder
    T(pg, 'PROTOTYPE SETTINGS TO APPLY IN FIGMA:', 80, 900, 11, C.textS, 'SemiBold', { ls: 1 });
    [
      'Device:  iPhone 14 (390 x 844)',
      'Background color:  #0B0E14',
      'Starting frame:  01 – Splash Screen',
      'Default animation:  Smart Animate · 300ms · Ease Out',
    ].forEach((s, i) => {
      R(pg, 80, 924 + i * 40, 520, 32, C.card, 8);
      T(pg, s, 96, 932 + i * 40, 13, C.text, 'Regular');
    });
  }

  // ================================================================
  //  MAIN: SMART PAGE MANAGEMENT (works with free plan, reuses pages)
  // ================================================================

  // Step 1: Get snapshot of all current pages
  const allExisting = [...figma.root.children];

  // Step 2: If more than 3 pages exist, remove extras from the end
  //         (can't remove if it's the only page, so we keep at least 1)
  for (let i = allExisting.length - 1; i >= 3; i--) {
    try { allExisting[i].remove(); } catch(e) {}
  }

  // Step 3: Create pages only if we need more (up to 3 total)
  while (figma.root.children.length < 3) {
    figma.createPage();
  }

  // Step 4: Grab references to the 3 pages
  const pg1 = figma.root.children[0];
  const pg2 = figma.root.children[1];
  const pg3 = figma.root.children[2];

  // Step 5: Clear ALL existing content from each page (fresh start)
  for (const pg of [pg1, pg2, pg3]) {
    const kids = [...pg.children];
    for (const k of kids) { try { k.remove(); } catch(e) {} }
  }

  // Step 6: Build all pages
  buildSiteMap(pg1);
  buildDesignSystem(pg2);

  pg3.name = '03 – UI Screens (12 Frames)';
  sc01(pg3); sc02(pg3); sc03(pg3); sc04(pg3);
  sc05(pg3); sc06(pg3); sc07(pg3); sc08(pg3);
  sc09(pg3); sc10(pg3); sc11(pg3); sc12(pg3);

  // ── STEP 7: AUTO-WIRE PROTOTYPE CONNECTIONS ──────────────────
  // All 12 frames are now in pg3.children in order [0..11]
  const sf = [...pg3.children]; // sf[0]=Splash, sf[1]=Onboarding ... sf[11]=Profile
  const trans = { type: 'SMART_ANIMATE', easing: { type: 'EASE_OUT' }, duration: 0.3 };
  const link = (from, to) => {
    try {
      from.reactions = [{
        trigger: { type: 'ON_CLICK' },
        action: {
          type: 'NODE',
          destinationId: to.id,
          navigation: 'NAVIGATE',
          transition: trans,
          preserveScrollPosition: false
        }
      }];
    } catch(e) { /* skip if unsupported */ }
  };

  if (sf.length >= 12) {
    // Entry flow
    link(sf[0],  sf[1]);   // Splash Screen     → Onboarding
    link(sf[1],  sf[2]);   // Onboarding         → Login / Sign Up
    link(sf[2],  sf[3]);   // Login              → Dashboard
    // Navigation flow
    link(sf[3],  sf[4]);   // Dashboard          → Navigate (Route Selection)
    link(sf[4],  sf[5]);   // Navigate           → Active Navigation
    link(sf[5],  sf[10]);  // Active Navigation  → Route Summary
    link(sf[10], sf[3]);   // Route Summary      → Dashboard
    // SOS flow
    link(sf[6],  sf[7]);   // SOS Trigger        → SOS Activated
    link(sf[7],  sf[3]);   // SOS Activated      → Dashboard
    // Report flow
    link(sf[8],  sf[9]);   // Hazard Report      → Community Map
    link(sf[9],  sf[3]);   // Community Map      → Dashboard
    // Profile
    link(sf[11], sf[3]);   // Profile & Settings → Dashboard
  }


  // Land user on the UI Screens page
  figma.currentPage = pg3;

  figma.closePlugin('✅ SafeRoute generated! 3 pages · 12 screens · Site map · Design system. Ready to present!');
}

main().catch(err => {
  console.error(err);
  figma.closePlugin('❌ Error: ' + (err.message || String(err)));
});
