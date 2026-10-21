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
  - Search instantaneously by **beer name**, **brewery**, **style**, **notes** (e.g. *"bottle pour"*, *"double mash"*, *"coffee"*), **stand number** (e.g. *`#39`*), or **country**.

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

---

## 📁 File Structure

- `index.html` — Semantic HTML5 application structure with accessible components.
- `style.css` — Modern stylesheet with CSS custom properties, responsive grid, and dark/light themes.
- `app.js` — Reactive filtering engine, URL state sync, localStorage wishlist manager, and sorting logic.
- `beers.json` — Raw JSON dataset with 463 beer entries.
- `beers-data.js` — Standalone JavaScript data bundle enabling zero-config `file://` protocol execution.

---

## 🔄 Updating the Data

If `beers.json` is modified or updated with new festival information, sync the offline fallback by running:

```bash
python3 -c "
with open('beers.json', 'r', encoding='utf-8') as f:
    c = f.read()
with open('beers-data.js', 'w', encoding='utf-8') as f:
    f.write('window.BEERS_DATA = ' + c + ';\n')
print('Updated beers-data.js')
"
```

