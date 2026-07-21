# SafeRoute — Figma Auto-Generator Plugin
## PETV157 UI/UX Project

This Figma plugin auto-generates the ENTIRE SafeRoute design:
- **Page 1:** Site Map & Information Architecture
- **Page 2:** Design System (colors, typography, components)
- **Page 3:** All 12 Hi-Fi UI Screens (390×844px each)
- **Page 4:** Prototype Flow Connection Guide

---

## How to Run (Step-by-Step)

### Step 1: Open Figma
Go to https://figma.com → Create a **New File** (blank)

### Step 2: Import the Plugin
1. Click the **Main Menu** (☰ top-left in Figma)
2. Go to **Plugins → Development → Import plugin from manifest...**
3. Navigate to this folder: `e:\UIUX\SafeRoute_Figma_Plugin\`
4. Select **manifest.json** → Click **Open**

### Step 3: Run the Plugin
1. Click the **Main Menu** (☰) again
2. Go to **Plugins → SafeRoute – Auto Generator**
3. Click **Run**
4. Wait ~10-15 seconds while it generates...
5. Done! ✅

### Step 4: Connect the Prototype
After generation, to add interactive prototype connections:
1. Switch to **Prototype** tab (top-right panel)
2. Set **Device:** iPhone 14
3. Set **Background:** #0B0E14
4. Set **Starting Frame:** 01 – Splash Screen
5. Follow the connection guide on **Page 4** of the generated file

---

## What Gets Generated

| Page | Content |
|---|---|
| **01 – Site Map** | Full architecture flowchart with color-coded flows |
| **02 – Design System** | 10 colors, 6 type styles, buttons, badges, cards, inputs |
| **03 – UI Screens** | All 12 screens in a 4×3 grid, 390×844px each |
| **04 – Prototype Guide** | 14 prototype connection instructions |

### The 12 Screens:
1. Splash Screen
2. Onboarding (Feature Intro)
3. Login / Sign Up
4. Dashboard (Home)
5. Navigate (Route Selection)
6. Active Navigation
7. SOS Trigger
8. SOS Activated
9. Hazard Report
10. Community Safety Map
11. Route Summary
12. Profile & Settings

---

## If You Get an Error

- Make sure you have a **blank Figma file** open before running
- The plugin requires **Inter font** — Figma has this built-in ✓
- If plugin doesn't appear in menu, re-import the manifest.json

---

Developed for: PETV157 UI/UX Design Project | SafeRoute Team
