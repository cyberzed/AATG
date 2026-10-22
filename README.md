# Aarhus Together 2026 — Beer Explorer & Festival Guide 🍺

A fast, modern, and responsive website built to browse, search, and filter the complete beer lineup (463 beers across 80 breweries and 23 countries) for the **Aarhus Together** beer festival at **Centralværkstedet** and **Smedjen**.

---

## 🚀 How to Run

### Option 1: Direct File (Zero Setup)
Simply open `index.html` in your favorite web browser (double-click in Finder or open with Safari/Chrome/Firefox).
It includes an offline fallback dataset so it works directly off your local disk (`file://`) with no server required.

### Option 2: Local Web Server
You can also serve it with any lightweight HTTP server:

```bash
# Using Python:
python3 -m http.server 8000
# Then visit http://localhost:8000 in your browser

# Or using Node / npx:
npx serve .
```

---

## ✨ Features & Filtering Capabilities

- **Session Filtering**:
  - `All Sessions` (463 beers)
  - `🍻 Fredag` (154 beers)
  - `☀️ Lørdag tidlig` (154 beers)
  - `🌙 Lørdag sen` (155 beers)
  - Automatically updates category counts when switching sessions.

- **Instant Full-Text Search**:
  - Search instantaneously by **beer name**, **brewery**, **style**, **notes** (e.g. *"bottle pour"*, *"double mash"*, *"coffee"*), **stand number** (e.g. *`#39`*), **session**, or **country**.
  - **Typo-tolerant**: *"clodwatr"* finds Cloudwater and *"lordag"* finds Lørdag. Every word must match, in any order (*"alefarm ipa"*). Powered by [Fuse.js](https://fusejs.io), stored in `vendor/` so it works offline.

- **Style Categories & Specific Styles (Multi-Select Enabled)**:
  - **Multi-Select Quick Category Pills**: Click to toggle multiple styles simultaneously (e.g., select both *IPA* and *Sour & Wild* at the same time). Click *All Styles* to reset.
  - **Searchable Multi-Select for Specific Styles**: Filter panel features a searchable dropdown with checkboxes across all **148 specific styles** with individual counts, "Select All", and "Clear".
  - Active styles appear as individual removable chips in the active filters bar.

- **Venue & Stand Location**:
  - Filter by hall: **Centralværkstedet** (#1–#40) or **Smedjen** (#41–#74).
  - Stand-aware sorting (naturally orders stands by hall and number).

- **Untappd Rating & Strength (ABV)**:
  - Filter by Untappd score: Any, ⭐ 4.2+ (Top Tier), ⭐ 4.0+ (Excellent), ⭐ 3.8+ (Great), ⭐ 3.5+ (Good), or Unrated/Festival Exclusives.
  - ABV Strength presets: Non-Alc & Low (<4.5%), Standard (4.5%–6.5%), Strong (6.5%–9.0%), Imperial (9.0%+), or custom min/max sliders.

- **Personal Tasting Wishlist & Tasted Tracker**:
  - Bookmark beers into your **Tasting Wishlist** (⭐ Save) to plan your festival crawl.
  - Check off beers as **Tasted** (✓) to track what you've sampled.
  - Stored in browser `localStorage` across visits.

- **📱 Laptop-to-Phone Transfer & Sharing**:
  - **Scan QR Code**: Open **My List** and click **📱 Share to Phone**. Scan the on-screen QR code with your phone camera to instantly open and save your plan on your mobile device.
  - **Auto-Import on Phone**: Opening the share link on your phone automatically saves your favorites and tasted beers to your phone's browser storage.
  - **📋 Copy Text Plan**: 1-click formatted itinerary organized by session and stand number, ready to paste into WhatsApp, iMessage, Signal, or Apple Notes.
  - **💾 JSON Backup & Restore**: Export full JSON backups or import lists across any device or browser.
  - **Export CSV**: Download a spreadsheet for printing or offline viewing.

- **Views & Sharing**:
  - **Grid View**: Rich cards with session tags, Untappd links, brewery flags, and tasting notes.
  - **Compact Table View**: High-density list optimized for fast scanning while walking the floor.
  - **Shareable Filter URLs**: Active filters are automatically synchronized into the URL query string. Click **Share** to copy the filtered link to your clipboard!
  - **Dark & Light Themes**: Dark craft beer aesthetic by default with toggle for bright outdoor lighting.

- **📲 Installable & Offline (PWA)**:
  - Served over HTTPS (e.g. GitHub Pages), the site can be added to the home screen (iOS: Share → *Add to Home Screen*; Android: *Install app*) and works without signal after the first load.
  - `python3 sync-data.py` stamps a new cache version into `sw.js` whenever the data or app files change, so phones pick up updates.
  - Note: an installed iOS app has its own storage, separate from Safari. Move a list across with Share to Phone or JSON backup.

---

## 📁 File Structure

- `index.html` — Semantic HTML5 application structure with accessible components.
- `style.css` — Modern stylesheet with CSS custom properties, responsive grid, and dark/light themes.
- `app.js` — Reactive filtering engine, URL state sync, localStorage wishlist manager, and sorting logic.
- `vendor/fuse.basic.min.js` — Fuse.js v7.1.0 (Apache 2.0) for fuzzy search, kept in the repo for offline use.
- `beers.json` — Raw JSON dataset with 463 beer entries.
- `sync-data.py` — Rebuilds `beers-data.js` and stamps the service worker cache version.
- `manifest.webmanifest`, `sw.js`, `icons/` — PWA manifest, offline service worker and app icons.
- `beers-data.js` — Standalone JavaScript data bundle enabling zero-config `file://` protocol execution.

---

## 🔄 Updating the Data

After editing `beers.json` (or any app file), run this before committing:

```bash
python3 sync-data.py
```

It rebuilds the offline fallback `beers-data.js` and stamps `sw.js` with a new cache version, so installed phones pick up the update.

