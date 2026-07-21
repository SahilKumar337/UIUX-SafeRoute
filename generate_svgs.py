import os

def create_svgs():
    # Helper to generate SVG headers/footers with Vivid Light Theme details
    def wrap_svg(content):
        return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 740" width="360" height="740" style="background:#F8FAFC; font-family:'Plus Jakarta Sans','Inter',system-ui,sans-serif;">
        <!-- Light Theme Status Bar -->
        <g id="Status-Bar">
            <rect x="0" y="0" width="360" height="40" fill="#F8FAFC"/>
            <text x="24" y="24" fill="#0F172A" font-size="12" font-weight="700">9:41</text>
            <!-- Notch -->
            <rect x="105" y="0" width="150" height="24" rx="12" fill="#E2E8F0"/>
            <circle cx="180" cy="12" r="4" fill="#CBD5E1"/>
            <!-- Signals (Dark indicators) -->
            <path d="M300 14h2v8h-2zm4-3h2v11h-2zm4-3h2v14h-2zm4-4h2v18h-2z" fill="#0F172A"/>
            <rect x="320" y="11" width="18" height="10" rx="2" fill="none" stroke="#0F172A" stroke-width="1"/>
            <rect x="322" y="13" width="12" height="6" fill="#10B981"/>
        </g>
        
        {content}
        
        <!-- Home Bar Indicator -->
        <g id="Home-Indicator">
            <rect x="120" y="730" width="120" height="4" rx="2" fill="#CBD5E1"/>
        </g>
        </svg>'''

    # Screen 1: Dashboard comparison (Light Theme)
    screen1 = wrap_svg('''
        <!-- Map Canvas Background -->
        <g id="Map-Background">
            <rect x="16" y="56" width="328" height="380" rx="24" fill="#E2E8F0" stroke="#CBD5E1" stroke-width="1"/>
            <!-- Simulated Streets -->
            <path d="M 40 100 L 320 100" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
            <path d="M 40 220 L 320 220" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
            <path d="M 40 340 L 320 340" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
            <path d="M 100 80 L 100 380" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
            <path d="M 260 80 L 260 380" stroke="#FFFFFF" stroke-width="12" stroke-linecap="round"/>
            
            <!-- Standard / Shortest path (Red warning line) -->
            <path d="M 100 340 L 100 220 L 260 220 L 260 100" fill="none" stroke="#EF4444" stroke-width="6" stroke-dasharray="4 4" stroke-linecap="round" opacity="0.8"/>
            <circle cx="170" cy="220" r="10" fill="#EF4444" opacity="0.2"/>
            <circle cx="170" cy="220" r="4" fill="#EF4444"/>
            
            <!-- SafeRoute Glowing Path (Green) -->
            <path d="M 100 340 L 260 340 L 260 220 L 260 100" fill="none" stroke="#10B981" stroke-width="6" stroke-linecap="round"/>
            
            <!-- Safe Lights nodes -->
            <circle cx="180" cy="340" r="6" fill="#10B981"/>
            <circle cx="260" cy="280" r="6" fill="#10B981"/>
            
            <!-- Pin Start & End -->
            <circle cx="100" cy="340" r="14" fill="#4F46E5" opacity="0.3"/>
            <circle cx="100" cy="340" r="6" fill="#4F46E5"/>
            
            <circle cx="260" cy="100" r="14" fill="#10B981" opacity="0.3"/>
            <circle cx="260" cy="100" r="6" fill="#10B981"/>
        </g>
        
        <!-- App Search Header (Light Mode) -->
        <g id="Header-Search">
            <rect x="24" y="68" width="312" height="48" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.03))"/>
            <text x="64" y="97" fill="#64748B" font-size="14">Enter campus apartment...</text>
            <circle cx="44" cy="92" r="8" fill="none" stroke="#64748B" stroke-width="2"/>
            <line x1="50" y1="98" x2="56" y2="104" stroke="#64748B" stroke-width="2"/>
        </g>

        <!-- Route Selection Sheet (Light Mode) -->
        <g id="Route-Selector-Sheet">
            <rect x="16" y="452" width="328" height="260" rx="24" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" filter="drop-shadow(0px -4px 15px rgba(0,0,0,0.02))"/>
            <rect x="160" y="462" width="40" height="4" rx="2" fill="#E2E8F0"/>
            
            <!-- Option 1: SafeRoute Card -->
            <g id="Option-Safe">
                <rect x="32" y="482" width="296" height="74" rx="16" fill="#ECFDF5" stroke="#10B981" stroke-width="1.5"/>
                <text x="48" y="512" fill="#0F172A" font-size="16" font-weight="700">SafeRoute</text>
                <text x="48" y="534" fill="#059669" font-size="12" font-weight="600">94% Safety Score</text>
                <text x="240" y="512" fill="#0F172A" font-size="16" font-weight="700" text-anchor="end">15 Min</text>
                <text x="240" y="534" fill="#475569" font-size="11" text-anchor="end">Well Lit Path</text>
            </g>
            
            <!-- Option 2: Fastest Card -->
            <g id="Option-Fastest">
                <rect x="32" y="572" width="296" height="74" rx="16" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1"/>
                <text x="48" y="602" fill="#475569" font-size="15" font-weight="700">Shortest Route</text>
                <text x="48" y="624" fill="#EF4444" font-size="12" font-weight="600">38% Safety (Dim Alleys)</text>
                <text x="240" y="602" fill="#475569" font-size="15" font-weight="700" text-anchor="end">12 Min</text>
                <text x="240" y="624" fill="#64748B" font-size="11" text-anchor="end">3 Mins Faster</text>
            </g>
            
            <!-- Start Button -->
            <rect x="32" y="660" width="296" height="40" rx="12" fill="#10B981"/>
            <text x="180" y="685" fill="#FFFFFF" font-size="14" font-weight="700" text-anchor="middle">Start Safe Navigation</text>
        </g>
    ''')

    # Screen 2: Active Navigation HUD (Light Theme)
    screen2 = wrap_svg('''
        <!-- Map Canvas Background -->
        <g id="Map-Active">
            <rect x="0" y="40" width="360" height="700" fill="#F1F5F9"/>
            <path d="M -40 200 L 400 200" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round"/>
            <path d="M 120 100 L 120 600" stroke="#FFFFFF" stroke-width="24" stroke-linecap="round"/>
            
            <!-- Green safe path -->
            <path d="M 120 450 L 120 200 L 320 200" fill="none" stroke="#10B981" stroke-width="10" stroke-linecap="round"/>
            
            <!-- Current Position Dot -->
            <circle cx="120" cy="380" r="22" fill="#4F46E5" opacity="0.25"/>
            <circle cx="120" cy="380" r="12" fill="#FFFFFF"/>
            <circle cx="120" cy="380" r="7" fill="#4F46E5"/>
            
            <!-- Map Pin Warning Icon -->
            <g transform="translate(190, 175)">
                <circle cx="15" cy="15" r="14" fill="#F59E0B" opacity="0.2"/>
                <path d="M15 6 L24 22 L6 22 Z" fill="#F59E0B"/>
                <text x="15" y="20" fill="#FFFFFF" font-size="9" font-weight="800" text-anchor="middle">!</text>
            </g>
        </g>
        
        <!-- Navigation HUD details overlay (Light Theme) -->
        <g id="HUD-Details">
            <!-- Top Alert Box -->
            <rect x="16" y="56" width="328" height="68" rx="20" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1.5" filter="drop-shadow(0px 4px 10px rgba(0,0,0,0.03))"/>
            <text x="32" y="84" fill="#0F172A" font-size="14" font-weight="700">Turn right on Cedar Ave</text>
            <text x="32" y="104" fill="#059669" font-size="11" font-weight="600">Lit Path   •   High Activity Segment</text>
            <text x="328" y="94" fill="#0F172A" font-size="16" font-weight="800" text-anchor="end">200m</text>
        </g>
        
        <!-- Bottom Floating Controllers -->
        <g id="Floating-Controllers">
            <!-- SOS Flashing Button (Vivid red) -->
            <circle cx="180" cy="650" r="44" fill="#EF4444" opacity="0.2"/>
            <circle cx="180" cy="650" r="34" fill="#EF4444"/>
            <text x="180" y="656" fill="#FFFFFF" font-size="16" font-weight="800" text-anchor="middle">SOS</text>
            
            <!-- Hazard Report button -->
            <rect x="24" y="635" width="100" height="36" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.02))"/>
            <text x="74" y="657" fill="#475569" font-size="11" font-weight="700" text-anchor="middle">Report</text>
            <path d="M40 644 L44 658 L48 644 Z" fill="#EF4444"/>
            
            <!-- Share Location button -->
            <rect x="236" y="635" width="100" height="36" rx="18" fill="#FFFFFF" stroke="#E2E8F0" stroke-width="1" filter="drop-shadow(0px 2px 4px rgba(0,0,0,0.02))"/>
            <text x="286" y="657" fill="#475569" font-size="11" font-weight="700" text-anchor="middle">Share</text>
            <circle cx="254" cy="653" r="4" fill="none" stroke="#4F46E5" stroke-width="2"/>
        </g>
    ''')

    # Screen 3: SOS countdown page (Light Theme)
    screen3 = wrap_svg('''
        <!-- Dark Blur Background -->
        <rect x="0" y="40" width="360" height="700" fill="#FFFFFF" opacity="0.95"/>
        
        <!-- Outer Glowing Warning Rings -->
        <circle cx="180" cy="300" r="90" fill="none" stroke="#EF4444" stroke-width="2" stroke-dasharray="10 10"/>
        <circle cx="180" cy="300" r="76" fill="#EF4444" opacity="0.1"/>
        <circle cx="180" cy="300" r="64" fill="#EF4444"/>
        
        <!-- Big Number -->
        <text x="180" y="318" fill="#FFFFFF" font-size="52" font-weight="800" text-anchor="middle">3</text>
        
        <!-- Heading text -->
        <text x="180" y="440" fill="#0F172A" font-size="20" font-weight="800" text-anchor="middle">Triggering SOS Alarm</text>
        <text x="180" y="465" fill="#475569" font-size="12" text-anchor="middle">Notifying emergency contacts in 3 seconds...</text>
        
        <!-- Actions checklist -->
        <g transform="translate(60, 500)" opacity="0.9">
            <!-- Action 1 -->
            <circle cx="15" cy="15" r="8" fill="#10B981"/>
            <text x="15" y="18" fill="#FFFFFF" font-size="9" font-weight="800" text-anchor="middle">✓</text>
            <text x="32" y="18" fill="#0F172A" font-size="12" font-weight="600">Formatting live coordinates</text>
            
            <!-- Action 2 -->
            <circle cx="15" cy="40" r="8" fill="none" stroke="#94A3B8" stroke-width="2"/>
            <text x="32" y="43" fill="#475569" font-size="12">Drafting emergency SMS log</text>
        </g>
        
        <!-- Hold to Cancel button -->
        <rect x="40" y="620" width="280" height="52" rx="26" fill="#FFFFFF" stroke="#EF4444" stroke-width="1.5"/>
        <text x="180" y="652" fill="#EF4444" font-size="14" font-weight="800" text-anchor="middle">Tap to Cancel Alarm</text>
    ''')

    # Screen 4: Report Hazard overlay (Light Theme)
    screen4 = wrap_svg('''
        <!-- Back Map -->
        <rect x="0" y="40" width="360" height="700" fill="#E2E8F0" opacity="0.4"/>
        
        <!-- Overlay Panel -->
        <g id="Report-Sheet">
            <rect x="16" y="200" width="328" height="500" rx="24" fill="#FFFFFF" stroke="#CBD5E1" stroke-width="1.5" filter="drop-shadow(0px -8px 24px rgba(0,0,0,0.05))"/>
            <rect x="160" y="210" width="40" height="4" rx="2" fill="#E2E8F0"/>
            
            <!-- Sheet Title -->
            <text x="32" y="246" fill="#0F172A" font-size="18" font-weight="800">Report Safety Hazard</text>
            <text x="32" y="266" fill="#64748B" font-size="12">Help nearby pedestrians by logging local safety alerts.</text>
            
            <!-- Categories Selector Grid -->
            <text x="32" y="316" fill="#4F46E5" font-size="11" font-weight="800" letter-spacing="0.05">SELECT CATEGORY</text>
            
            <!-- Block 1: Dim Lights -->
            <g transform="translate(32, 336)">
                <rect x="0" y="0" width="138" height="56" rx="12" fill="#EEF2FF" stroke="#4F46E5" stroke-width="1.5"/>
                <text x="16" y="32" fill="#0F172A" font-size="13" font-weight="700">Dim Lighting</text>
                <circle cx="116" cy="28" r="8" fill="#4F46E5"/>
                <text x="116" y="31" fill="#FFFFFF" font-size="8" font-weight="800" text-anchor="middle">✓</text>
            </g>
            
            <!-- Block 2: Abandoned -->
            <g transform="translate(190, 336)">
                <rect x="0" y="0" width="138" height="56" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
                <text x="16" y="32" fill="#475569" font-size="13" font-weight="700">Blocked Path</text>
            </g>
            
            <!-- Block 3: Crowd -->
            <g transform="translate(32, 408)">
                <rect x="0" y="0" width="138" height="56" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
                <text x="16" y="32" fill="#475569" font-size="13" font-weight="700">Unsafe Crowd</text>
            </g>
            
            <!-- Block 4: Other -->
            <g transform="translate(190, 408)">
                <rect x="0" y="0" width="138" height="56" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
                <text x="16" y="32" fill="#475569" font-size="13" font-weight="700">Other Issue</text>
            </g>
            
            <!-- Description textarea simulator -->
            <text x="32" y="500" fill="#4F46E5" font-size="11" font-weight="800" letter-spacing="0.05">ADDITIONAL DETAILS (OPTIONAL)</text>
            <rect x="32" y="515" width="296" height="74" rx="12" fill="#F8FAFC" stroke="#E2E8F0" stroke-width="1"/>
            <text x="44" y="538" fill="#94A3B8" font-size="12">Explain lighting condition...</text>
            
            <!-- Submit Button -->
            <rect x="32" y="618" width="296" height="44" rx="12" fill="#10B981"/>
            <text x="180" y="644" fill="#FFFFFF" font-size="14" font-weight="800" text-anchor="middle">Publish Safety Report</text>
        </g>
    ''')

    # Save SVG files
    os.makedirs("figma_export", exist_ok=True)
    with open("figma_export/SafeRoute_Figma_Screen1_Dashboard.svg", "w", encoding="utf-8") as f:
        f.write(screen1)
    with open("figma_export/SafeRoute_Figma_Screen2_ActiveNav.svg", "w", encoding="utf-8") as f:
        f.write(screen2)
    with open("figma_export/SafeRoute_Figma_Screen3_SOS_Trigger.svg", "w", encoding="utf-8") as f:
        f.write(screen3)
    with open("figma_export/SafeRoute_Figma_Screen4_HazardReport.svg", "w", encoding="utf-8") as f:
        f.write(screen4)
        
    print("Figma Light SVG screens created successfully!")

if __name__ == "__main__":
    create_svgs()
