/**
 * Aarhus Together 2026 Beer Explorer
 * Main Application Logic
 */

(function () {
  'use strict';

  // Country to Flag Emoji Mapping
  const COUNTRY_FLAGS = {
    'Belgium': '🇧🇪',
    'Croatia': '🇭🇷',
    'Czechia': '🇨🇿',
    'Denmark': '🇩🇰',
    'Estonia': '🇪🇪',
    'Finland': '🇫🇮',
    'France': '🇫🇷',
    'Germany': '🇩🇪',
    'Greece': '🇬🇷',
    'Hungary': '🇭🇺',
    'Iceland': '🇮🇸',
    'Ireland': '🇮🇪',
    'Italy': '🇮🇹',
    'Netherlands': '🇳🇱',
    'Norway': '🇳🇴',
    'Portugal': '🇵🇹',
    'Romania': '🇷🇴',
    'South Korea': '🇰🇷',
    'Spain': '🇪🇸',
    'Sweden': '🇸🇪',
    'Switzerland': '🇨🇭',
    'USA': '🇺🇸',
    'United Kingdom': '🇬🇧'
  };

  // State Management
  const state = {
    beers: [],
    favorites: new Set(),
    tasted: new Set(),
    modalTab: 'favs',
    summaryStylesExpanded: false,
    filters: {
      search: '',
      session: 'all',
      categories: new Set(), // Set of category strings (empty = all)
      hall: 'all',
      brewery: 'all',
      styles: new Set(),     // Set of specific style strings (empty = all)
      country: 'all',
      rating: 'all',
      abvPreset: 'all',
      abvMin: null,
      abvMax: null,
      onlyFavorites: false,
      onlyTasted: false,
      onlyUntasted: false,
      onlyNotes: false,
    },
    sort: 'rating-desc',
    viewMode: 'grid', // 'grid' | 'table'
    theme: 'dark'
  };

  // DOM Elements
  const DOM = {
    // Stats
    statBeers: document.getElementById('statBeers'),
    statBreweries: document.getElementById('statBreweries'),
    statCountries: document.getElementById('statCountries'),
    statAvgRating: document.getElementById('statAvgRating'),
    statTasted: document.getElementById('statTasted'),
    favCountBadge: document.getElementById('favCountBadge'),

    // Session tabs & counts
    sessionTabs: document.querySelectorAll('.session-tab'),
    countSessionAll: document.getElementById('countSessionAll'),
    countSessionFredag: document.getElementById('countSessionFredag'),
    countSessionLordagTidlig: document.getElementById('countSessionLordagTidlig'),
    countSessionLordagSen: document.getElementById('countSessionLordagSen'),

    // Search & quick categories
    searchInput: document.getElementById('searchInput'),
    searchClearBtn: document.getElementById('searchClearBtn'),
    categoryPills: document.getElementById('categoryPills'),

    // Advanced filters panel
    toggleFiltersBtn: document.getElementById('toggleFiltersBtn'),
    activeFiltersBadge: document.getElementById('activeFiltersBadge'),
    advancedFiltersPanel: document.getElementById('advancedFiltersPanel'),
    filterHall: document.getElementById('filterHall'),
    filterBrewery: document.getElementById('filterBrewery'),
    styleMultiSelect: document.getElementById('styleMultiSelect'),
    styleMultiSelectTrigger: document.getElementById('styleMultiSelectTrigger'),
    styleMultiSelectText: document.getElementById('styleMultiSelectText'),
    styleSelectBadge: document.getElementById('styleSelectBadge'),
    styleMultiSelectDropdown: document.getElementById('styleMultiSelectDropdown'),
    styleSearchInput: document.getElementById('styleSearchInput'),
    styleSelectAllBtn: document.getElementById('styleSelectAllBtn'),
    styleClearAllBtn: document.getElementById('styleClearAllBtn'),
    styleOptionsList: document.getElementById('styleOptionsList'),
    filterCountry: document.getElementById('filterCountry'),
    filterRating: document.getElementById('filterRating'),
    filterAbv: document.getElementById('filterAbv'),
    customAbvGroup: document.getElementById('customAbvGroup'),
    filterAbvMin: document.getElementById('filterAbvMin'),
    filterAbvMax: document.getElementById('filterAbvMax'),
    filterFavorites: document.getElementById('filterFavorites'),
    filterTasted: document.getElementById('filterTasted'),
    filterUntasted: document.getElementById('filterUntasted'),
    filterNotes: document.getElementById('filterNotes'),
    resetFiltersBtn: document.getElementById('resetFiltersBtn'),

    // Results bar & controls
    resultsCount: document.getElementById('resultsCount'),
    activeFilterChips: document.getElementById('activeFilterChips'),
    sortSelect: document.getElementById('sortSelect'),
    viewGridBtn: document.getElementById('viewGridBtn'),
    viewTableBtn: document.getElementById('viewTableBtn'),

    // View containers
    beerGrid: document.getElementById('beerGrid'),
    beerTableWrapper: document.getElementById('beerTableWrapper'),
    beerTableBody: document.getElementById('beerTableBody'),
    emptyState: document.getElementById('emptyState'),
    emptyResetBtn: document.getElementById('emptyResetBtn'),

    // Modal
    myListBtn: document.getElementById('myListBtn'),
    myListModal: document.getElementById('myListModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    closeModalBottomBtn: document.getElementById('closeModalBottomBtn'),
    modalTabFavs: document.getElementById('modalTabFavs'),
    modalTabTasted: document.getElementById('modalTabTasted'),
    modalFavCount: document.getElementById('modalFavCount'),
    modalTastedCount: document.getElementById('modalTastedCount'),
    modalListContent: document.getElementById('modalListContent'),
    exportCsvBtn: document.getElementById('exportCsvBtn'),
    clearMyListBtn: document.getElementById('clearMyListBtn'),

    // Share & Transfer to Phone Modal
    openSharePhoneBtn: document.getElementById('openSharePhoneBtn'),
    sharePhoneModal: document.getElementById('sharePhoneModal'),
    closeSharePhoneBtn: document.getElementById('closeSharePhoneBtn'),
    closeSharePhoneBottomBtn: document.getElementById('closeSharePhoneBottomBtn'),
    qrHostStatusBadge: document.getElementById('qrHostStatusBadge'),
    qrCodeImg: document.getElementById('qrCodeImg'),
    sharePlanLinkInput: document.getElementById('sharePlanLinkInput'),
    testLinkBtn: document.getElementById('testLinkBtn'),
    copyPlanLinkBtn: document.getElementById('copyPlanLinkBtn'),
    copyTextPlanBtn: document.getElementById('copyTextPlanBtn'),
    exportJsonBtn: document.getElementById('exportJsonBtn'),
    openImportBtn: document.getElementById('openImportBtn'),
    customHostInput: document.getElementById('customHostInput'),
    applyHostBtn: document.getElementById('applyHostBtn'),

    // Import Prompts
    importPromptModal: document.getElementById('importPromptModal'),
    importFavCount: document.getElementById('importFavCount'),
    importTastedCount: document.getElementById('importTastedCount'),
    importMergeBtn: document.getElementById('importMergeBtn'),
    importReplaceBtn: document.getElementById('importReplaceBtn'),
    importDismissBtn: document.getElementById('importDismissBtn'),

    // Manual Import Data
    importDataModal: document.getElementById('importDataModal'),
    closeImportDataBtn: document.getElementById('closeImportDataBtn'),
    importFileInput: document.getElementById('importFileInput'),
    importJsonTextarea: document.getElementById('importJsonTextarea'),
    executeImportBtn: document.getElementById('executeImportBtn'),

    // Utility
    shareBtn: document.getElementById('shareBtn'),
    themeToggleBtn: document.getElementById('themeToggleBtn'),
    themeIconDark: document.getElementById('themeIconDark'),
    themeIconLight: document.getElementById('themeIconLight'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    backToTopBtn: document.getElementById('backToTopBtn')
  };

  /**
   * Style categorizer for high-level grouping
   */
  function getStyleCategory(style) {
    if (!style) return 'Other';
    const s = style.toLowerCase();
    if (s.includes('non-alcoholic')) return 'Non-Alcoholic';
    if (s.startsWith('ipa') || s.includes(' ipa')) return 'IPA';
    if (s.includes('stout') || s.includes('porter')) return 'Stout & Porter';
    if (s.includes('sour') || s.includes('wild') || s.includes('lambic') || s.includes('gose') || s.includes('berliner')) return 'Sour & Wild';
    if (s.includes('pilsner') || s.includes('lager') || s.includes('keller') || s.includes('helles') || s.includes('dunkel') || s.includes('schwarzbier') || s.includes('rauchbier')) return 'Lager & Pilsner';
    if (s.startsWith('pale ale')) return 'Pale Ale';
    if (s.includes('barley wine') || s.includes('barleywine') || s.includes('rye wine') || s.includes('wheat wine')) return 'Barley Wine';
    if (s.includes('belgian') || s.includes('saison') || s.includes('garde') || s.includes('tripel') || s.includes('dubbel') || s.includes('quadrupel')) return 'Belgian & Saison';
    if (s.includes('wine') || s.includes('cider') || s.includes('mead') || s.includes('seltzer')) return 'Wine & Cider';
    return 'Other Ale';
  }

  /**
   * Helper to format ABV
   */
  function formatAbv(alc) {
    if (alc === null || alc === undefined || isNaN(alc)) return 'N/A';
    return `${alc}% ABV`;
  }

  /**
   * Helper to format Rating
   */
  function formatRating(rating) {
    if (!rating || rating === 0) return 'Unrated';
    return `★ ${rating.toFixed(2)}`;
  }

  /**
   * Natural Stand / Location comparator
   */
  function compareLocation(aLoc, bLoc) {
    const aStr = aLoc || '';
    const bStr = bLoc || '';
    const aMatch = aStr.match(/#(\d+)/);
    const bMatch = bStr.match(/#(\d+)/);
    const aHall = aStr.split('#')[0].trim();
    const bHall = bStr.split('#')[0].trim();

    if (aHall !== bHall) {
      return aHall.localeCompare(bHall);
    }
    const aNum = aMatch ? parseInt(aMatch[1], 10) : 9999;
    const bNum = bMatch ? parseInt(bMatch[1], 10) : 9999;
    return aNum - bNum;
  }

  /**
   * Load data from beers.json or offline fallback
   */
  async function loadData() {
    try {
      const response = await fetch('beers.json');
      if (response.ok) {
        state.beers = await response.json();
      } else {
        throw new Error('Fetch failed with status ' + response.status);
      }
    } catch (e) {
      // Fallback for file:// or offline mode
      if (window.BEERS_DATA && Array.isArray(window.BEERS_DATA)) {
        state.beers = window.BEERS_DATA;
      } else {
        console.error('Failed to load beers data:', e);
        DOM.resultsCount.textContent = 'Error loading beers.json';
        return;
      }
    }

    // Attach computed category to each beer
    state.beers.forEach(beer => {
      beer.category = getStyleCategory(beer.style);
    });
    buildSearchIndex();

    initStorage();
    initFiltersOptions();
    readUrlParams();
    updateTheme(state.theme);
    render();
  }

  /**
   * Initialize LocalStorage for favorites, tasted, and settings
   */
  function initStorage() {
    try {
      const savedFavs = localStorage.getItem('aat26_favs');
      if (savedFavs) {
        state.favorites = new Set(JSON.parse(savedFavs));
      }
      const savedTasted = localStorage.getItem('aat26_tasted');
      if (savedTasted) {
        state.tasted = new Set(JSON.parse(savedTasted));
      }
      const savedTheme = localStorage.getItem('aat26_theme');
      if (savedTheme) {
        state.theme = savedTheme;
      }
      const savedView = localStorage.getItem('aat26_view');
      if (savedView) {
        state.viewMode = savedView;
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    updateStorageCounters();
  }

  function saveStorage() {
    try {
      localStorage.setItem('aat26_favs', JSON.stringify([...state.favorites]));
      localStorage.setItem('aat26_tasted', JSON.stringify([...state.tasted]));
      localStorage.setItem('aat26_theme', state.theme);
      localStorage.setItem('aat26_view', state.viewMode);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
    updateStorageCounters();
  }

  function updateStorageCounters() {
    DOM.favCountBadge.textContent = state.favorites.size;
    DOM.statTasted.textContent = state.tasted.size;
    DOM.modalFavCount.textContent = state.favorites.size;
    DOM.modalTastedCount.textContent = state.tasted.size;
  }

  let allSortedStyles = [];
  let cachedStyleCounts = {};

  function renderStyleOptions(searchQuery = '') {
    const q = searchQuery.toLowerCase().trim();
    const filteredStyles = q
      ? allSortedStyles.filter(s => s.toLowerCase().includes(q))
      : allSortedStyles;

    if (filteredStyles.length === 0) {
      DOM.styleOptionsList.innerHTML = `<div style="padding:0.75rem 0.5rem;font-size:0.8rem;color:var(--text-muted);text-align:center;">No matching styles</div>`;
      return;
    }

    DOM.styleOptionsList.innerHTML = filteredStyles.map(s => {
      const isChecked = state.filters.styles.has(s);
      return `
        <label class="multiselect-option" data-style="${escapeHtml(s)}">
          <input type="checkbox" value="${escapeHtml(s)}" ${isChecked ? 'checked' : ''}>
          <span class="custom-check"></span>
          <span class="option-label" title="${escapeHtml(s)}">${escapeHtml(s)}</span>
          <span class="option-count">${cachedStyleCounts[s] || 0}</span>
        </label>
      `;
    }).join('');
  }

  function updateStyleMultiSelectTrigger() {
    const count = state.filters.styles.size;
    if (count === 0) {
      DOM.styleMultiSelectText.textContent = `All Specific Styles (${allSortedStyles.length})`;
      DOM.styleSelectBadge.style.display = 'none';
    } else if (count === 1) {
      const first = Array.from(state.filters.styles)[0];
      DOM.styleMultiSelectText.textContent = first;
      DOM.styleSelectBadge.style.display = 'none';
    } else {
      DOM.styleMultiSelectText.textContent = `${count} styles selected`;
      DOM.styleSelectBadge.textContent = count;
      DOM.styleSelectBadge.style.display = 'inline-block';
    }
  }

  /**
   * Populate filter dropdowns with unique sorted options and item counts
   */
  function initFiltersOptions() {
    // Breweries
    const breweryCounts = {};
    const styleCounts = {};
    const countryCounts = {};

    state.beers.forEach(b => {
      if (b.brewery) breweryCounts[b.brewery] = (breweryCounts[b.brewery] || 0) + 1;
      if (b.style) styleCounts[b.style] = (styleCounts[b.style] || 0) + 1;
      if (b.country) countryCounts[b.country] = (countryCounts[b.country] || 0) + 1;
    });

    // Populate Brewery Select
    const sortedBreweries = Object.keys(breweryCounts).sort((a, b) => a.localeCompare(b));
    DOM.filterBrewery.innerHTML = `<option value="all">All Breweries (${sortedBreweries.length})</option>` +
      sortedBreweries.map(name => `<option value="${escapeHtml(name)}">${escapeHtml(name)} (${breweryCounts[name]})</option>`).join('');

    // Populate Specific Style Multi-Select
    allSortedStyles = Object.keys(styleCounts).sort((a, b) => a.localeCompare(b));
    cachedStyleCounts = styleCounts;
    renderStyleOptions();
    updateStyleMultiSelectTrigger();

    // Populate Country Select
    const sortedCountries = Object.keys(countryCounts).sort((a, b) => a.localeCompare(b));
    DOM.filterCountry.innerHTML = `<option value="all">All Countries (${sortedCountries.length})</option>` +
      sortedCountries.map(c => {
        const flag = COUNTRY_FLAGS[c] || '🏳️';
        return `<option value="${escapeHtml(c)}">${flag} ${escapeHtml(c)} (${countryCounts[c]})</option>`;
      }).join('');
  }

  /**
   * Filter and Sort Logic
   */
  /**
   * Fuzzy search (Fuse.js, vendored for offline use)
   */
  const SEARCH_FIELDS = ['name', 'brewery', 'style', 'country', 'location', 'session', 'note', 'served_by'];
  let fuseIndex = null;

  // Lowercase and fold Danish letters and accents, so "lordag" finds "Lørdag"
  function foldText(str) {
    return (str || '')
      .toLowerCase()
      .replace(/ø/g, 'o')
      .replace(/æ/g, 'ae')
      .replace(/å/g, 'aa')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  function buildSearchIndex() {
    state.beers.forEach(beer => {
      beer.searchText = SEARCH_FIELDS.map(key => foldText(beer[key])).join(' | ');
    });
    if (typeof window.Fuse !== 'function') return;
    fuseIndex = new window.Fuse(state.beers, {
      keys: SEARCH_FIELDS.map(key => ({ name: key, getFn: beer => foldText(beer[key]) })),
      threshold: 0.3,
      ignoreLocation: true,
      includeScore: false
    });
  }

  // Each word must match. Words with digits (stand #39, ABV) and short words match exactly. Longer words
  // fall back to typo-tolerant matching only when nothing contains them, so "stout" doesn't also find "Southern".
  function getSearchMatches(query) {
    const words = foldText(query).split(/\s+/).filter(Boolean);
    if (words.length === 0) return null;

    let matches = null;
    words.forEach(word => {
      let ids;
      if (/^#\d+$/.test(word)) {
        const standPattern = new RegExp(word + '(?!\\d)');
        ids = new Set(state.beers.filter(b => standPattern.test(foldText(b.location))).map(b => b.id));
      } else {
        ids = new Set(state.beers.filter(b => b.searchText.includes(word)).map(b => b.id));
        if (ids.size === 0 && fuseIndex && word.length >= 5 && !/\d/.test(word)) {
          ids = new Set(fuseIndex.search(word).map(r => r.item.id));
        }
      }
      matches = matches ? new Set([...matches].filter(id => ids.has(id))) : ids;
    });
    return matches;
  }

  function getFilteredBeers() {
    const f = state.filters;
    const searchMatches = getSearchMatches(f.search);

    return state.beers.filter(b => {
      // Session filter
      if (f.session !== 'all' && b.session !== f.session) {
        return false;
      }

      // Quick category pill filter (multi-select)
      if (f.categories.size > 0 && !f.categories.has('all')) {
        if (!f.categories.has(b.category)) {
          return false;
        }
      }

      // Venue / Hall filter
      if (f.hall !== 'all') {
        if (!b.location || !b.location.startsWith(f.hall)) {
          return false;
        }
      }

      // Brewery filter
      if (f.brewery !== 'all' && b.brewery !== f.brewery) {
        return false;
      }

      // Specific style filter (multi-select)
      if (f.styles.size > 0 && !f.styles.has('all')) {
        if (!f.styles.has(b.style)) {
          return false;
        }
      }

      // Country filter
      if (f.country !== 'all' && b.country !== f.country) {
        return false;
      }

      // Rating filter
      if (f.rating !== 'all') {
        if (f.rating === 'unrated') {
          if (b.rating && b.rating > 0) return false;
        } else {
          const minR = parseFloat(f.rating);
          if (!b.rating || b.rating < minR) return false;
        }
      }

      // ABV Filter
      if (f.abvPreset !== 'all') {
        const alc = b.alc;
        if (alc === null || alc === undefined) {
          if (f.abvPreset !== 'all') return false;
        } else {
          if (f.abvPreset === 'low' && alc >= 4.5) return false;
          if (f.abvPreset === 'standard' && (alc < 4.5 || alc > 6.5)) return false;
          if (f.abvPreset === 'strong' && (alc <= 6.5 || alc > 9.0)) return false;
          if (f.abvPreset === 'heavy' && alc <= 9.0) return false;
          if (f.abvPreset === 'custom') {
            if (f.abvMin !== null && alc < f.abvMin) return false;
            if (f.abvMax !== null && alc > f.abvMax) return false;
          }
        }
      }

      // Status Toggles
      if (f.onlyFavorites && !state.favorites.has(b.id)) {
        return false;
      }
      if (f.onlyTasted && !state.tasted.has(b.id)) {
        return false;
      }
      if (f.onlyUntasted && state.tasted.has(b.id)) {
        return false;
      }
      if (f.onlyNotes && !b.note) {
        return false;
      }

      // Text Search across all fields
      if (searchMatches && !searchMatches.has(b.id)) {
        return false;
      }

      return true;
    });
  }

  function sortBeers(beers) {
    const s = state.sort;
    return [...beers].sort((a, b) => {
      switch (s) {
        case 'rating-desc': {
          const aR = a.rating || 0;
          const bR = b.rating || 0;
          if (bR !== aR) return bR - aR;
          return a.name.localeCompare(b.name);
        }
        case 'rating-asc': {
          const aR = a.rating === 0 || a.rating == null ? 999 : a.rating;
          const bR = b.rating === 0 || b.rating == null ? 999 : b.rating;
          if (aR !== bR) return aR - bR;
          return a.name.localeCompare(b.name);
        }
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'brewery-asc': {
          const bComp = (a.brewery || '').localeCompare(b.brewery || '');
          if (bComp !== 0) return bComp;
          return a.name.localeCompare(b.name);
        }
        case 'abv-desc': {
          const aAlc = a.alc ?? -1;
          const bAlc = b.alc ?? -1;
          if (bAlc !== aAlc) return bAlc - aAlc;
          return a.name.localeCompare(b.name);
        }
        case 'abv-asc': {
          const aAlc = a.alc ?? 999;
          const bAlc = b.alc ?? 999;
          if (aAlc !== bAlc) return aAlc - bAlc;
          return a.name.localeCompare(b.name);
        }
        case 'location-asc':
          return compareLocation(a.location, b.location);
        default:
          return 0;
      }
    });
  }

  /**
   * Escape HTML to prevent injection
   */
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /**
   * Session Class Helper
   */
  function getSessionClass(session) {
    if (!session) return '';
    const s = session.toLowerCase();
    if (s.includes('fredag')) return 'fredag';
    if (s.includes('tidlig')) return 'lordag-tidlig';
    if (s.includes('sen')) return 'lordag-sen';
    return '';
  }

  /**
   * Render Main View
   */
  function render() {
    const filtered = getFilteredBeers();
    const sorted = sortBeers(filtered);

    // Update Stats Bar
    updateStatsBar(sorted);

    // Update Category Pill Counts
    updateCategoryPillCounts();

    // Update Results Meta & Active Chips
    updateResultsMeta(sorted.length);

    // Toggle Empty State
    if (sorted.length === 0) {
      DOM.emptyState.style.display = 'block';
      DOM.beerGrid.style.display = 'none';
      DOM.beerTableWrapper.style.display = 'none';
      return;
    }

    DOM.emptyState.style.display = 'none';

    // Render Grid vs Table
    if (state.viewMode === 'grid') {
      DOM.beerGrid.style.display = 'grid';
      DOM.beerTableWrapper.style.display = 'none';
      DOM.viewGridBtn.classList.add('active');
      DOM.viewGridBtn.setAttribute('aria-pressed', 'true');
      DOM.viewTableBtn.classList.remove('active');
      DOM.viewTableBtn.setAttribute('aria-pressed', 'false');
      renderGrid(sorted);
    } else {
      DOM.beerGrid.style.display = 'none';
      DOM.beerTableWrapper.style.display = 'block';
      DOM.viewTableBtn.classList.add('active');
      DOM.viewTableBtn.setAttribute('aria-pressed', 'true');
      DOM.viewGridBtn.classList.remove('active');
      DOM.viewGridBtn.setAttribute('aria-pressed', 'false');
      renderTable(sorted);
    }

    syncUrlParams();
  }

  /**
   * Render Card Grid
   */
  function renderGrid(beers) {
    const html = beers.map(beer => {
      const isFav = state.favorites.has(beer.id);
      const isTasted = state.tasted.has(beer.id);
      const flag = COUNTRY_FLAGS[beer.country] || '🍺';
      const sessionClass = getSessionClass(beer.session);
      const untappdUrl = beer.untappd || '';
      const hasRating = beer.rating && beer.rating > 0;

      return `
        <article class="beer-card ${isFav ? 'is-favorite' : ''} ${isTasted ? 'is-tasted' : ''}" data-id="${beer.id}">
          <div class="card-top">
            <span class="session-tag ${sessionClass}">
              ${beer.session === 'Fredag' ? '🍻 Fredag' : (beer.session === 'Lørdag tidlig' ? '☀️ Lørdag tidlig' : '🌙 Lørdag sen')}
            </span>
            <span class="location-tag" title="${escapeHtml(beer.location)}">
              📍 ${escapeHtml(beer.location || 'TBA')}
            </span>
          </div>

          <div class="card-main">
            <h3 class="beer-name">${escapeHtml(beer.name)}</h3>
            <div class="brewery-row">
              <span class="country-flag" title="${escapeHtml(beer.country)}">${flag}</span>
              <span class="brewery-name">${escapeHtml(beer.brewery)}</span>
            </div>
            
            <div class="tags-row">
              <span class="style-badge">${escapeHtml(beer.style || 'Beer')}</span>
              ${beer.note ? `<span class="note-badge" title="Special Note">✦ ${escapeHtml(beer.note)}</span>` : ''}
              ${beer.served_by ? `<span class="served-by-tag">Served by: ${escapeHtml(beer.served_by)}</span>` : ''}
            </div>
          </div>

          <div class="card-bottom">
            <div class="card-metrics">
              <span class="metric-badge rating-badge ${hasRating ? '' : 'unrated'}" title="Untappd Community Rating">
                ${formatRating(beer.rating)}
              </span>
              <span class="metric-badge abv-badge" title="Alcohol by Volume">
                ${formatAbv(beer.alc)}
              </span>
            </div>

            <div class="card-actions">
              <div class="action-buttons-group">
                <button class="action-btn btn-fav ${isFav ? 'active' : ''}" data-action="toggle-fav" data-id="${beer.id}" title="${isFav ? 'Remove from wishlist' : 'Add to tasting wishlist'}">
                  <svg class="icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
                  <span>${isFav ? 'Saved' : 'Save'}</span>
                </button>

                <button class="action-btn btn-tasted ${isTasted ? 'active' : ''}" data-action="toggle-tasted" data-id="${beer.id}" title="${isTasted ? 'Mark as untasted' : 'Mark as tasted'}">
                  <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>${isTasted ? 'Tasted' : 'Taste'}</span>
                </button>
              </div>

              ${untappdUrl ? `
                <a href="${escapeHtml(untappdUrl)}" target="_blank" rel="noopener noreferrer" class="untappd-link" title="Open on Untappd">
                  <span>Untappd</span>
                  <svg class="icon" style="width:0.85rem;height:0.85rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              ` : `
                <span class="untappd-link untappd-disabled" title="No Untappd link available">
                  <span>Untappd</span>
                </span>
              `}
            </div>
          </div>
        </article>
      `;
    }).join('');

    DOM.beerGrid.innerHTML = html;
  }

  /**
   * Render Compact Table View
   */
  function renderTable(beers) {
    const html = beers.map(beer => {
      const isFav = state.favorites.has(beer.id);
      const isTasted = state.tasted.has(beer.id);
      const flag = COUNTRY_FLAGS[beer.country] || '🍺';
      const sessionClass = getSessionClass(beer.session);
      const untappdUrl = beer.untappd || '';
      const hasRating = beer.rating && beer.rating > 0;

      return `
        <tr data-id="${beer.id}" class="${isTasted ? 'is-tasted' : ''}">
          <td class="table-actions-cell">
            <button class="action-btn btn-fav ${isFav ? 'active' : ''}" data-action="toggle-fav" data-id="${beer.id}" title="${isFav ? 'Remove favorite' : 'Add favorite'}">
              <svg class="icon" viewBox="0 0 24 24" fill="${isFav ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
            <button class="action-btn btn-tasted ${isTasted ? 'active' : ''}" data-action="toggle-tasted" data-id="${beer.id}" title="${isTasted ? 'Tasted' : 'Mark tasted'}">
              <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
            </button>
          </td>
          <td>
            <div class="table-beer-title">${escapeHtml(beer.name)}</div>
            ${beer.note ? `<span class="note-badge">✦ ${escapeHtml(beer.note)}</span>` : ''}
          </td>
          <td><span class="table-brewery">${escapeHtml(beer.brewery)}</span></td>
          <td><span class="style-badge">${escapeHtml(beer.style)}</span></td>
          <td><span title="${escapeHtml(beer.country)}">${flag} ${escapeHtml(beer.country)}</span></td>
          <td><strong style="font-family:var(--font-mono);">${formatAbv(beer.alc)}</strong></td>
          <td>
            <span class="metric-badge rating-badge ${hasRating ? '' : 'unrated'}">
              ${formatRating(beer.rating)}
            </span>
          </td>
          <td><span class="location-tag">📍 ${escapeHtml(beer.location)}</span></td>
          <td><span class="session-tag ${sessionClass}">${escapeHtml(beer.session)}</span></td>
          <td>
            ${untappdUrl ? `
              <a href="${escapeHtml(untappdUrl)}" target="_blank" rel="noopener noreferrer" class="untappd-link" title="Untappd">
                <svg class="icon" style="width:0.85rem;height:0.85rem;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            ` : '-'}
          </td>
        </tr>
      `;
    }).join('');

    DOM.beerTableBody.innerHTML = html;
  }

  /**
   * Update Stats Bar
   */
  function updateStatsBar(currentBeers) {
    DOM.statBeers.textContent = currentBeers.length;

    const uniqueBreweries = new Set(currentBeers.map(b => b.brewery).filter(Boolean));
    DOM.statBreweries.textContent = uniqueBreweries.size;

    const uniqueCountries = new Set(currentBeers.map(b => b.country).filter(Boolean));
    DOM.statCountries.textContent = uniqueCountries.size;

    const ratedBeers = currentBeers.filter(b => b.rating && b.rating > 0);
    if (ratedBeers.length > 0) {
      const avg = ratedBeers.reduce((acc, b) => acc + b.rating, 0) / ratedBeers.length;
      DOM.statAvgRating.textContent = `★ ${avg.toFixed(2)}`;
    } else {
      DOM.statAvgRating.textContent = '—';
    }
  }

  /**
   * Update category pill counts dynamically based on active session
   */
  function updateCategoryPillCounts() {
    const currentSession = state.filters.session;
    const pool = currentSession === 'all'
      ? state.beers
      : state.beers.filter(b => b.session === currentSession);

    const counts = {};
    pool.forEach(b => {
      counts[b.category] = (counts[b.category] || 0) + 1;
    });

    DOM.categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
      const cat = pill.getAttribute('data-category');
      const badge = pill.querySelector('.pill-count');
      if (badge) {
        if (cat === 'all') {
          badge.textContent = pool.length;
        } else {
          badge.textContent = counts[cat] || 0;
        }
      }
    });
  }

  /**
   * Update Results Meta & Active Filter Chips
   */
  function updateResultsMeta(count) {
    DOM.resultsCount.textContent = `Showing ${count} ${count === 1 ? 'beer' : 'beers'}`;

    const chips = [];
    const f = state.filters;

    if (f.session !== 'all') {
      chips.push({ key: 'session', label: `Session: ${f.session}` });
    }
    if (f.categories.size > 0 && !f.categories.has('all')) {
      f.categories.forEach(cat => {
        chips.push({ key: 'category', value: cat, label: `Category: ${cat}` });
      });
    }
    if (f.hall !== 'all') {
      chips.push({ key: 'hall', label: `Hall: ${f.hall}` });
    }
    if (f.brewery !== 'all') {
      chips.push({ key: 'brewery', label: `Brewery: ${f.brewery}` });
    }
    if (f.styles.size > 0 && !f.styles.has('all')) {
      f.styles.forEach(s => {
        chips.push({ key: 'style', value: s, label: `Style: ${s}` });
      });
    }
    if (f.country !== 'all') {
      chips.push({ key: 'country', label: `Country: ${f.country}` });
    }
    if (f.rating !== 'all') {
      chips.push({ key: 'rating', label: f.rating === 'unrated' ? 'Unrated only' : `Rating: ${f.rating}+ ★` });
    }
    if (f.abvPreset !== 'all') {
      chips.push({ key: 'abvPreset', label: `ABV: ${f.abvPreset}` });
    }
    if (f.onlyFavorites) {
      chips.push({ key: 'onlyFavorites', label: '❤️ Wishlist' });
    }
    if (f.onlyTasted) {
      chips.push({ key: 'onlyTasted', label: '✅ Tasted' });
    }
    if (f.onlyUntasted) {
      chips.push({ key: 'onlyUntasted', label: '⏳ Untasted' });
    }
    if (f.onlyNotes) {
      chips.push({ key: 'onlyNotes', label: '📝 Has Notes' });
    }

    if (chips.length > 0) {
      DOM.activeFiltersBadge.style.display = 'inline-block';
      DOM.activeFiltersBadge.textContent = chips.length;
      DOM.activeFilterChips.innerHTML = chips.map(chip => `
        <span class="active-chip">
          <span>${escapeHtml(chip.label)}</span>
          <button data-remove-filter="${chip.key}" ${chip.value ? `data-filter-value="${escapeHtml(chip.value)}"` : ''} title="Remove filter">&times;</button>
        </span>
      `).join('');
    } else {
      DOM.activeFiltersBadge.style.display = 'none';
      DOM.activeFilterChips.innerHTML = '';
    }
  }

  /**
   * Reset All Filters
   */
  function resetAllFilters() {
    state.filters.search = '';
    state.filters.session = 'all';
    state.filters.categories.clear();
    state.filters.hall = 'all';
    state.filters.brewery = 'all';
    state.filters.styles.clear();
    state.filters.country = 'all';
    state.filters.rating = 'all';
    state.filters.abvPreset = 'all';
    state.filters.abvMin = null;
    state.filters.abvMax = null;
    state.filters.onlyFavorites = false;
    state.filters.onlyTasted = false;
    state.filters.onlyUntasted = false;
    state.filters.onlyNotes = false;

    // Reset UI Inputs
    DOM.searchInput.value = '';
    DOM.searchClearBtn.style.display = 'none';

    DOM.sessionTabs.forEach(tab => {
      tab.classList.toggle('active', tab.getAttribute('data-session') === 'all');
      tab.setAttribute('aria-selected', tab.getAttribute('data-session') === 'all');
    });

    DOM.categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
      pill.classList.toggle('active', pill.getAttribute('data-category') === 'all');
    });

    DOM.filterHall.value = 'all';
    DOM.filterBrewery.value = 'all';
    DOM.styleSearchInput.value = '';
    renderStyleOptions();
    updateStyleMultiSelectTrigger();

    DOM.filterCountry.value = 'all';
    DOM.filterRating.value = 'all';
    DOM.filterAbv.value = 'all';
    DOM.customAbvGroup.style.display = 'none';
    DOM.filterAbvMin.value = '';
    DOM.filterAbvMax.value = '';
    DOM.filterFavorites.checked = false;
    DOM.filterTasted.checked = false;
    DOM.filterUntasted.checked = false;
    DOM.filterNotes.checked = false;

    render();
    showToast('Filters reset');
  }

  /**
   * Remove a single filter by key
   */
  function removeFilter(key, value) {
    if (key === 'session') {
      state.filters.session = 'all';
      DOM.sessionTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-session') === 'all');
      });
    } else if (key === 'category') {
      if (value) {
        state.filters.categories.delete(value);
      } else {
        state.filters.categories.clear();
      }
      DOM.categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
        const cat = pill.getAttribute('data-category');
        if (cat === 'all') {
          pill.classList.toggle('active', state.filters.categories.size === 0);
        } else {
          pill.classList.toggle('active', state.filters.categories.has(cat));
        }
      });
    } else if (key === 'style') {
      if (value) {
        state.filters.styles.delete(value);
      } else {
        state.filters.styles.clear();
      }
      renderStyleOptions(DOM.styleSearchInput.value);
      updateStyleMultiSelectTrigger();
    } else if (key === 'hall') {
      state.filters.hall = 'all';
      DOM.filterHall.value = 'all';
    } else if (key === 'brewery') {
      state.filters.brewery = 'all';
      DOM.filterBrewery.value = 'all';
    } else if (key === 'country') {
      state.filters.country = 'all';
      DOM.filterCountry.value = 'all';
    } else if (key === 'rating') {
      state.filters.rating = 'all';
      DOM.filterRating.value = 'all';
    } else if (key === 'abvPreset') {
      state.filters.abvPreset = 'all';
      DOM.filterAbv.value = 'all';
      DOM.customAbvGroup.style.display = 'none';
    } else if (key === 'onlyFavorites') {
      state.filters.onlyFavorites = false;
      DOM.filterFavorites.checked = false;
    } else if (key === 'onlyTasted') {
      state.filters.onlyTasted = false;
      DOM.filterTasted.checked = false;
    } else if (key === 'onlyUntasted') {
      state.filters.onlyUntasted = false;
      DOM.filterUntasted.checked = false;
    } else if (key === 'onlyNotes') {
      state.filters.onlyNotes = false;
      DOM.filterNotes.checked = false;
    }
    render();
  }

  /**
   * Toast Notification Helper
   */
  let toastTimeout;
  function showToast(message) {
    DOM.toastMessage.textContent = message;
    DOM.toast.style.display = 'block';
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      DOM.toast.style.display = 'none';
    }, 2400);
  }

  /**
   * URL Query Params synchronization
   */
  function syncUrlParams() {
    const params = new URLSearchParams();
    const f = state.filters;

    if (f.search) params.set('q', f.search);
    if (f.session !== 'all') params.set('session', f.session);
    if (f.categories.size > 0 && !f.categories.has('all')) {
      params.set('cat', Array.from(f.categories).join(','));
    }
    if (f.hall !== 'all') params.set('hall', f.hall);
    if (f.brewery !== 'all') params.set('brewery', f.brewery);
    if (f.styles.size > 0 && !f.styles.has('all')) {
      params.set('styles', Array.from(f.styles).join(','));
    }
    if (f.country !== 'all') params.set('country', f.country);
    if (f.rating !== 'all') params.set('min_rating', f.rating);
    if (f.abvPreset !== 'all') params.set('abv', f.abvPreset);
    if (f.onlyFavorites) params.set('favs', '1');
    if (f.onlyTasted) params.set('tasted', '1');
    if (state.sort !== 'rating-desc') params.set('sort', state.sort);
    if (state.viewMode !== 'grid') params.set('view', state.viewMode);

    const queryString = params.toString();
    const newUrl = window.location.pathname + (queryString ? '?' + queryString : '');
    window.history.replaceState(null, '', newUrl);
  }

  function readUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('q')) {
      state.filters.search = params.get('q');
      DOM.searchInput.value = state.filters.search;
      DOM.searchClearBtn.style.display = 'block';
    }
    if (params.has('session')) {
      const s = params.get('session');
      state.filters.session = s;
      DOM.sessionTabs.forEach(tab => {
        tab.classList.toggle('active', tab.getAttribute('data-session') === s);
      });
    }
    if (params.has('cat')) {
      const cats = params.get('cat').split(',').map(s => s.trim()).filter(Boolean);
      state.filters.categories = new Set(cats);
      DOM.categoryPills.querySelectorAll('.cat-pill').forEach(pill => {
        const cat = pill.getAttribute('data-category');
        if (cat === 'all') {
          pill.classList.toggle('active', state.filters.categories.size === 0);
        } else {
          pill.classList.toggle('active', state.filters.categories.has(cat));
        }
      });
    }
    if (params.has('hall')) {
      state.filters.hall = params.get('hall');
      DOM.filterHall.value = state.filters.hall;
    }
    if (params.has('brewery')) {
      state.filters.brewery = params.get('brewery');
      DOM.filterBrewery.value = state.filters.brewery;
    }
    if (params.has('styles')) {
      const st = params.get('styles').split(',').map(s => s.trim()).filter(Boolean);
      state.filters.styles = new Set(st);
      renderStyleOptions();
      updateStyleMultiSelectTrigger();
    }
    if (params.has('country')) {
      state.filters.country = params.get('country');
      DOM.filterCountry.value = state.filters.country;
    }
    if (params.has('min_rating')) {
      state.filters.rating = params.get('min_rating');
      DOM.filterRating.value = state.filters.rating;
    }
    if (params.has('abv')) {
      state.filters.abvPreset = params.get('abv');
      DOM.filterAbv.value = state.filters.abvPreset;
    }
    if (params.get('favs') === '1') {
      state.filters.onlyFavorites = true;
      DOM.filterFavorites.checked = true;
    }
    if (params.get('tasted') === '1') {
      state.filters.onlyTasted = true;
      DOM.filterTasted.checked = true;
    }
    if (params.has('sort')) {
      state.sort = params.get('sort');
      DOM.sortSelect.value = state.sort;
    }
    if (params.has('view')) {
      state.viewMode = params.get('view');
    }

    // Check for shared tasting plan in URL (e.g. from QR code or shared link)
    if (params.has('plan') || params.has('tasted')) {
      const planParam = params.get('plan') || '';
      const tastedParam = params.get('tasted') || '';
      const incomingFavs = planParam.split(',').map(s => s.trim()).filter(Boolean);
      const incomingTasted = tastedParam.split(',').map(s => s.trim()).filter(Boolean);

      if (incomingFavs.length > 0 || incomingTasted.length > 0) {
        // If current device has no saved favorites or tasted yet (e.g. fresh phone browser)
        if (state.favorites.size === 0 && state.tasted.size === 0) {
          incomingFavs.forEach(id => state.favorites.add(id));
          incomingTasted.forEach(id => state.tasted.add(id));
          saveStorage();
          state.filters.onlyFavorites = true;
          DOM.filterFavorites.checked = true;
          showToast(`📲 Imported ${incomingFavs.length} favorites from your shared plan!`);
          
          // Clean URL query params to leave address bar clean
          const cleanUrl = window.location.pathname;
          window.history.replaceState(null, '', cleanUrl);
        } else {
          // Device already has saved items; show interactive prompt after short delay
          setTimeout(() => {
            showImportPrompt(incomingFavs, incomingTasted);
          }, 350);
        }
      }
    }
  }

  /**
   * Theme Switcher
   */
  function updateTheme(theme) {
    state.theme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      DOM.themeIconDark.style.display = 'block';
      DOM.themeIconLight.style.display = 'none';
    } else {
      DOM.themeIconDark.style.display = 'none';
      DOM.themeIconLight.style.display = 'block';
    }
    saveStorage();
  }

  /**
   * Tasting List Modal
   */
  function openModal(tab = 'favs') {
    state.modalTab = tab;
    DOM.modalTabFavs.classList.toggle('active', tab === 'favs');
    DOM.modalTabTasted.classList.toggle('active', tab === 'tasted');
    renderModalList();
    DOM.myListModal.style.display = 'flex';
  }

  function closeModal() {
    DOM.myListModal.style.display = 'none';
  }

  function renderModalList() {
    const isFavTab = state.modalTab === 'favs';
    const idSet = isFavTab ? state.favorites : state.tasted;
    const items = state.beers.filter(b => idSet.has(b.id));

    if (items.length === 0) {
      DOM.modalListContent.innerHTML = `
        <div style="text-align:center; padding: 3rem 1rem; color: var(--text-muted);">
          <div style="font-size: 2.5rem; margin-bottom: 0.5rem;">${isFavTab ? '⭐' : '🍺'}</div>
          <h4>No ${isFavTab ? 'favorites' : 'tasted beers'} yet</h4>
          <p style="font-size:0.85rem; margin-top:0.35rem;">Use the bookmark or taste button on any beer card to build your list.</p>
        </div>
      `;
      return;
    }

    DOM.modalListContent.innerHTML = renderListSummary(items, isFavTab) + items.map(beer => {
      const flag = COUNTRY_FLAGS[beer.country] || '🍺';
      return `
        <div class="modal-item-card">
          <div class="modal-item-info">
            <span class="modal-item-title">${escapeHtml(beer.name)}</span>
            <span class="modal-item-sub">${flag} ${escapeHtml(beer.brewery)} • ${escapeHtml(beer.style)} • ${formatAbv(beer.alc)}</span>
            <span class="modal-item-sub">📍 ${escapeHtml(beer.location)} (${escapeHtml(beer.session)})</span>
          </div>
          <div>
            <button class="btn btn-ghost btn-sm text-danger" data-modal-remove="${beer.id}" title="Remove">Remove</button>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Compact summary shown above the modal list (sessions, styles, ABV, rating)
   */
  function renderListSummary(items, isFavTab) {
    const average = values => values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
    const avgAbv = average(items.map(b => b.alc).filter(a => typeof a === 'number' && !isNaN(a)));
    const avgRating = average(items.map(b => b.rating).filter(r => r > 0));
    const breweries = new Set(items.map(b => b.brewery)).size;

    const stats = [
      { value: items.length, label: items.length === 1 ? 'Beer' : 'Beers' },
      { value: breweries, label: breweries === 1 ? 'Brewery' : 'Breweries' },
      { value: avgAbv !== null ? `${avgAbv.toFixed(1)}%` : '–', label: 'Avg ABV' },
      { value: avgRating !== null ? `★ ${avgRating.toFixed(2)}` : '–', label: 'Avg Rating' }
    ];
    if (isFavTab) {
      const tastedFavs = items.filter(b => state.tasted.has(b.id)).length;
      stats.push({ value: `${tastedFavs}/${items.length}`, label: 'Tasted' });
    }

    const sessionChips = ['Fredag', 'Lørdag tidlig', 'Lørdag sen']
      .map(sess => ({ sess, count: items.filter(b => b.session === sess).length }))
      .filter(s => s.count > 0)
      .map(s => `<span class="session-tag ${getSessionClass(s.sess)}">${escapeHtml(s.sess)} · ${s.count}</span>`)
      .join('');

    const categoryCounts = {};
    items.forEach(b => { categoryCounts[b.category] = (categoryCounts[b.category] || 0) + 1; });
    const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
    const hiddenCount = sortedCategories.length - 3;
    const shownCategories = state.summaryStylesExpanded ? sortedCategories : sortedCategories.slice(0, 3);
    let categoryChips = shownCategories
      .map(([cat, count]) => `<span class="list-summary-chip">${escapeHtml(cat)} · ${count}</span>`)
      .join('');
    if (hiddenCount > 0) {
      categoryChips += `<button class="list-summary-chip list-summary-toggle" data-summary-toggle>${state.summaryStylesExpanded ? 'Show less' : `+${hiddenCount} more`}</button>`;
    }

    return `
      <div class="list-summary">
        <div class="list-summary-stats">
          ${stats.map(s => `
            <div class="list-summary-stat">
              <span class="list-summary-value">${s.value}</span>
              <span class="list-summary-label">${s.label}</span>
            </div>
          `).join('')}
        </div>
        <div class="list-summary-chips">${sessionChips}${categoryChips}</div>
      </div>
    `;
  }

  /**
   * Export to CSV
   */
  function exportCsv() {
    const isFavTab = state.modalTab === 'favs';
    const idSet = isFavTab ? state.favorites : state.tasted;
    const items = state.beers.filter(b => idSet.has(b.id));

    if (items.length === 0) {
      showToast('List is empty, nothing to export');
      return;
    }

    const headers = ['ID', 'Name', 'Brewery', 'Style', 'Country', 'Session', 'Location', 'ABV', 'Untappd_Rating', 'Untappd_URL', 'Note'];
    const rows = items.map(b => [
      `"${b.id}"`,
      `"${(b.name || '').replace(/"/g, '""')}"`,
      `"${(b.brewery || '').replace(/"/g, '""')}"`,
      `"${(b.style || '').replace(/"/g, '""')}"`,
      `"${(b.country || '').replace(/"/g, '""')}"`,
      `"${(b.session || '').replace(/"/g, '""')}"`,
      `"${(b.location || '').replace(/"/g, '""')}"`,
      b.alc !== null && b.alc !== undefined ? b.alc : '',
      b.rating || '',
      `"${b.untappd || ''}"`,
      `"${(b.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `aarhus-together-2026-${isFavTab ? 'wishlist' : 'tasted'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported CSV file');
  }

  let currentCustomBaseUrl = '';

  /**
   * Generate complete shareable URL containing favorites and tasted beers
   */
  function generateSharePlanUrl(overrideBase) {
    let base = overrideBase || currentCustomBaseUrl || window.location.href;
    try {
      const url = new URL(base);
      url.search = '';
      if (state.favorites.size > 0) {
        url.searchParams.set('plan', Array.from(state.favorites).join(','));
      }
      if (state.tasted.size > 0) {
        url.searchParams.set('tasted', Array.from(state.tasted).join(','));
      }
      return url.toString();
    } catch (e) {
      const favList = Array.from(state.favorites).join(',');
      const tastedList = Array.from(state.tasted).join(',');
      const query = [];
      if (favList) query.push(`plan=${encodeURIComponent(favList)}`);
      if (tastedList) query.push(`tasted=${encodeURIComponent(tastedList)}`);
      return (overrideBase || window.location.href).split('?')[0] + (query.length > 0 ? '?' + query.join('&') : '');
    }
  }

  /**
   * Generate human-readable text itinerary for messaging apps / notes
   */
  function generateTextPlan() {
    const favBeers = state.beers.filter(b => state.favorites.has(b.id));
    if (favBeers.length === 0) return 'No favorites saved in your Aarhus Together plan yet!';

    const sessions = ['Fredag', 'Lørdag tidlig', 'Lørdag sen'];
    let text = `🍺 Aarhus Together 2026 — My Festival Tasting Plan (${favBeers.length} beers)\n\n`;

    sessions.forEach(sess => {
      const sessBeers = favBeers.filter(b => b.session === sess);
      if (sessBeers.length > 0) {
        text += `📍 ${sess} (${sessBeers.length} beers):\n`;
        sessBeers.forEach(b => {
          const abv = b.alc != null ? `${b.alc}%` : '';
          const rating = b.rating ? `★${b.rating}` : '';
          const info = [b.style, abv, rating].filter(Boolean).join(' • ');
          text += `• ${b.name} — ${b.brewery} [${b.location || 'TBA'}] (${info})\n`;
          if (b.note) text += `  ↳ Note: ${b.note}\n`;
        });
        text += '\n';
      }
    });

    return text.trim();
  }

  /**
   * Update host status banner in QR modal
   */
  function updateHostStatusBadge() {
    if (!DOM.qrHostStatusBadge) return;

    const isFile = window.location.protocol === 'file:';
    const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';

    if (currentCustomBaseUrl) {
      DOM.qrHostStatusBadge.className = 'host-status-badge status-custom';
      DOM.qrHostStatusBadge.innerHTML = `<span>🌐 Custom host active: <strong>${escapeHtml(currentCustomBaseUrl)}</strong></span>`;
    } else if (isFile) {
      DOM.qrHostStatusBadge.className = 'host-status-badge status-warning';
      DOM.qrHostStatusBadge.innerHTML = `<span>⚠️ Local file mode: Enter your laptop's Wi-Fi IP or hosted link below to scan</span>`;
    } else if (isLocalhost) {
      DOM.qrHostStatusBadge.className = 'host-status-badge status-warning';
      DOM.qrHostStatusBadge.innerHTML = `<span>⚠️ Localhost: For your phone to connect, set your laptop's Wi-Fi IP below</span>`;
    } else {
      DOM.qrHostStatusBadge.className = 'host-status-badge status-ready';
      DOM.qrHostStatusBadge.innerHTML = `<span>✅ Ready! Point your phone's camera at the QR code</span>`;
    }
  }

  function updateQrAndShareLink() {
    const shareUrl = generateSharePlanUrl();
    DOM.sharePlanLinkInput.value = shareUrl;
    if (DOM.testLinkBtn) {
      DOM.testLinkBtn.href = shareUrl;
    }

    // Generate high-contrast QR code
    DOM.qrCodeImg.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&data=${encodeURIComponent(shareUrl)}`;
    DOM.qrCodeImg.onerror = () => {
      DOM.qrCodeImg.style.display = 'none';
      const cap = document.querySelector('.qr-caption');
      if (cap) cap.textContent = 'QR image unavailable offline. Use "Copy Link" or "Copy Text Plan" below!';
    };
    DOM.qrCodeImg.onload = () => {
      DOM.qrCodeImg.style.display = 'block';
    };
  }

  /**
   * Open Share to Phone Modal
   */
  function openSharePhoneModal() {
    const totalCount = state.favorites.size + state.tasted.size;
    if (totalCount === 0) {
      showToast('Add some beers to your wishlist first! ⭐');
      return;
    }

    // Load any saved custom host
    const savedHost = localStorage.getItem('aat26_share_host');
    if (savedHost && !currentCustomBaseUrl) {
      currentCustomBaseUrl = savedHost;
    }
    if (currentCustomBaseUrl && DOM.customHostInput) {
      DOM.customHostInput.value = currentCustomBaseUrl;
    }

    updateQrAndShareLink();
    updateHostStatusBadge();

    DOM.sharePhoneModal.style.display = 'flex';
  }

  function closeSharePhoneModal() {
    DOM.sharePhoneModal.style.display = 'none';
  }

  /**
   * Export JSON Backup
   */
  function exportJsonBackup() {
    const data = {
      app: 'Aarhus Together 2026',
      exportedAt: new Date().toISOString(),
      favorites: Array.from(state.favorites),
      tasted: Array.from(state.tasted)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aarhus-together-plan-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast('Exported JSON plan 💾');
  }

  /**
   * Import data from JSON string or object
   */
  function importPlanData(jsonString, mode = 'merge') {
    try {
      const data = JSON.parse(jsonString);
      const incomingFavs = Array.isArray(data.favorites) ? data.favorites : (Array.isArray(data.plan) ? data.plan : []);
      const incomingTasted = Array.isArray(data.tasted) ? data.tasted : [];

      if (incomingFavs.length === 0 && incomingTasted.length === 0) {
        showToast('No valid beers found in data');
        return false;
      }

      if (mode === 'replace') {
        state.favorites = new Set(incomingFavs);
        state.tasted = new Set(incomingTasted);
      } else {
        incomingFavs.forEach(id => state.favorites.add(id));
        incomingTasted.forEach(id => state.tasted.add(id));
      }

      saveStorage();
      render();
      showToast(`Imported ${incomingFavs.length} favorites & ${incomingTasted.length} tasted beers! 🎉`);
      return true;
    } catch (e) {
      showToast('Could not parse JSON data');
      return false;
    }
  }

  let pendingIncomingFavs = [];
  let pendingIncomingTasted = [];

  function showImportPrompt(favs, tasted) {
    pendingIncomingFavs = favs;
    pendingIncomingTasted = tasted;
    DOM.importFavCount.textContent = favs.length;
    DOM.importTastedCount.textContent = tasted.length;
    DOM.importPromptModal.style.display = 'flex';
  }

  function applyPendingImport(mode) {
    if (mode === 'replace') {
      state.favorites = new Set(pendingIncomingFavs);
      state.tasted = new Set(pendingIncomingTasted);
    } else {
      pendingIncomingFavs.forEach(id => state.favorites.add(id));
      pendingIncomingTasted.forEach(id => state.tasted.add(id));
    }
    saveStorage();
    DOM.importPromptModal.style.display = 'none';
    state.filters.onlyFavorites = true;
    DOM.filterFavorites.checked = true;
    render();
    showToast(`Saved ${pendingIncomingFavs.length} favorites to this device! 📱`);

    // Clean URL query params to leave address bar clean
    const cleanUrl = window.location.pathname;
    window.history.replaceState(null, '', cleanUrl);
  }

  /**
   * Event Listeners Registration
   */
  function initEventListeners() {
    // Session Tabs
    DOM.sessionTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const session = tab.getAttribute('data-session');
        DOM.sessionTabs.forEach(t => {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
        state.filters.session = session;
        render();
      });
    });

    // Search Input with Debounce
    let searchDebounce;
    DOM.searchInput.addEventListener('input', (e) => {
      const val = e.target.value;
      DOM.searchClearBtn.style.display = val ? 'block' : 'none';
      clearTimeout(searchDebounce);
      searchDebounce = setTimeout(() => {
        state.filters.search = val;
        render();
      }, 180);
    });

    DOM.searchClearBtn.addEventListener('click', () => {
      DOM.searchInput.value = '';
      DOM.searchClearBtn.style.display = 'none';
      state.filters.search = '';
      render();
      DOM.searchInput.focus();
    });

    // Quick Category Pills (Multi-Select toggle)
    DOM.categoryPills.addEventListener('click', (e) => {
      const pill = e.target.closest('.cat-pill');
      if (!pill) return;
      const cat = pill.getAttribute('data-category');

      if (cat === 'all') {
        state.filters.categories.clear();
        DOM.categoryPills.querySelectorAll('.cat-pill').forEach(p => p.classList.remove('active'));
        pill.classList.add('active');
      } else {
        const allPill = DOM.categoryPills.querySelector('[data-category="all"]');
        allPill.classList.remove('active');

        if (state.filters.categories.has(cat)) {
          state.filters.categories.delete(cat);
          pill.classList.remove('active');
          if (state.filters.categories.size === 0) {
            allPill.classList.add('active');
          }
        } else {
          state.filters.categories.add(cat);
          pill.classList.add('active');
        }
      }
      render();
    });

    // Toggle Advanced Filters Panel
    DOM.toggleFiltersBtn.addEventListener('click', () => {
      const isVisible = DOM.advancedFiltersPanel.style.display !== 'none';
      DOM.advancedFiltersPanel.style.display = isVisible ? 'none' : 'block';
    });

    // Select Dropdowns
    DOM.filterHall.addEventListener('change', (e) => {
      state.filters.hall = e.target.value;
      render();
    });

    DOM.filterBrewery.addEventListener('change', (e) => {
      state.filters.brewery = e.target.value;
      render();
    });

    // Specific Style Multi-Select Trigger
    DOM.styleMultiSelectTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = DOM.styleMultiSelect.classList.toggle('is-open');
      DOM.styleMultiSelectDropdown.style.display = isOpen ? 'flex' : 'none';
      DOM.styleMultiSelectTrigger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      if (isOpen) {
        DOM.styleSearchInput.focus();
      }
    });

    // Close Dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!DOM.styleMultiSelect.contains(e.target)) {
        DOM.styleMultiSelect.classList.remove('is-open');
        DOM.styleMultiSelectDropdown.style.display = 'none';
        DOM.styleMultiSelectTrigger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && DOM.styleMultiSelect.classList.contains('is-open')) {
        DOM.styleMultiSelect.classList.remove('is-open');
        DOM.styleMultiSelectDropdown.style.display = 'none';
        DOM.styleMultiSelectTrigger.setAttribute('aria-expanded', 'false');
        DOM.styleMultiSelectTrigger.focus();
      }
    });

    // Search inside style dropdown
    DOM.styleSearchInput.addEventListener('input', (e) => {
      renderStyleOptions(e.target.value);
    });

    // Checkbox toggling in style options
    DOM.styleOptionsList.addEventListener('change', (e) => {
      const cb = e.target.closest('input[type="checkbox"]');
      if (!cb) return;
      const val = cb.value;
      if (cb.checked) {
        state.filters.styles.add(val);
      } else {
        state.filters.styles.delete(val);
      }
      updateStyleMultiSelectTrigger();
      render();
    });

    // Select All (filtered) styles
    DOM.styleSelectAllBtn.addEventListener('click', () => {
      const visibleCheckboxes = DOM.styleOptionsList.querySelectorAll('input[type="checkbox"]');
      visibleCheckboxes.forEach(cb => {
        cb.checked = true;
        state.filters.styles.add(cb.value);
      });
      updateStyleMultiSelectTrigger();
      render();
    });

    // Clear All styles
    DOM.styleClearAllBtn.addEventListener('click', () => {
      state.filters.styles.clear();
      const visibleCheckboxes = DOM.styleOptionsList.querySelectorAll('input[type="checkbox"]');
      visibleCheckboxes.forEach(cb => {
        cb.checked = false;
      });
      updateStyleMultiSelectTrigger();
      render();
    });

    DOM.filterCountry.addEventListener('change', (e) => {
      state.filters.country = e.target.value;
      render();
    });

    DOM.filterRating.addEventListener('change', (e) => {
      state.filters.rating = e.target.value;
      render();
    });

    DOM.filterAbv.addEventListener('change', (e) => {
      state.filters.abvPreset = e.target.value;
      if (e.target.value === 'custom') {
        DOM.customAbvGroup.style.display = 'block';
      } else {
        DOM.customAbvGroup.style.display = 'none';
      }
      render();
    });

    DOM.filterAbvMin.addEventListener('input', (e) => {
      state.filters.abvMin = e.target.value ? parseFloat(e.target.value) : null;
      render();
    });

    DOM.filterAbvMax.addEventListener('input', (e) => {
      state.filters.abvMax = e.target.value ? parseFloat(e.target.value) : null;
      render();
    });

    // Checkbox Toggles
    DOM.filterFavorites.addEventListener('change', (e) => {
      state.filters.onlyFavorites = e.target.checked;
      render();
    });

    DOM.filterTasted.addEventListener('change', (e) => {
      state.filters.onlyTasted = e.target.checked;
      if (e.target.checked) {
        state.filters.onlyUntasted = false;
        DOM.filterUntasted.checked = false;
      }
      render();
    });

    DOM.filterUntasted.addEventListener('change', (e) => {
      state.filters.onlyUntasted = e.target.checked;
      if (e.target.checked) {
        state.filters.onlyTasted = false;
        DOM.filterTasted.checked = false;
      }
      render();
    });

    DOM.filterNotes.addEventListener('change', (e) => {
      state.filters.onlyNotes = e.target.checked;
      render();
    });

    // Reset Buttons
    DOM.resetFiltersBtn.addEventListener('click', resetAllFilters);
    DOM.emptyResetBtn.addEventListener('click', resetAllFilters);

    // Active Chips Delegated Removal
    DOM.activeFilterChips.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-remove-filter]');
      if (btn) {
        const key = btn.getAttribute('data-remove-filter');
        const val = btn.getAttribute('data-filter-value');
        removeFilter(key, val);
      }
    });

    // Sort Dropdown
    DOM.sortSelect.addEventListener('change', (e) => {
      state.sort = e.target.value;
      render();
    });

    // View Mode Toggle
    DOM.viewGridBtn.addEventListener('click', () => {
      state.viewMode = 'grid';
      saveStorage();
      render();
    });

    DOM.viewTableBtn.addEventListener('click', () => {
      state.viewMode = 'table';
      saveStorage();
      render();
    });

    // Action clicks on Card Grid & Table (Favorite & Tasted toggles)
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      const id = btn.getAttribute('data-id');

      if (action === 'toggle-fav') {
        if (state.favorites.has(id)) {
          state.favorites.delete(id);
          showToast('Removed from Wishlist');
        } else {
          state.favorites.add(id);
          showToast('Added to Wishlist ⭐');
        }
        saveStorage();
        render();
      } else if (action === 'toggle-tasted') {
        if (state.tasted.has(id)) {
          state.tasted.delete(id);
          showToast('Marked as untasted');
        } else {
          state.tasted.add(id);
          showToast('Marked as tasted 🍻');
        }
        saveStorage();
        render();
      }
    });

    // Modal Events
    DOM.myListBtn.addEventListener('click', () => openModal('favs'));
    DOM.closeModalBtn.addEventListener('click', closeModal);
    DOM.closeModalBottomBtn.addEventListener('click', closeModal);
    DOM.myListModal.addEventListener('click', (e) => {
      if (e.target === DOM.myListModal) closeModal();
    });

    DOM.modalTabFavs.addEventListener('click', () => {
      state.modalTab = 'favs';
      DOM.modalTabFavs.classList.add('active');
      DOM.modalTabTasted.classList.remove('active');
      renderModalList();
    });

    DOM.modalTabTasted.addEventListener('click', () => {
      state.modalTab = 'tasted';
      DOM.modalTabTasted.classList.add('active');
      DOM.modalTabFavs.classList.remove('active');
      renderModalList();
    });

    DOM.modalListContent.addEventListener('click', (e) => {
      if (e.target.closest('[data-summary-toggle]')) {
        state.summaryStylesExpanded = !state.summaryStylesExpanded;
        renderModalList();
        return;
      }
      const removeBtn = e.target.closest('[data-modal-remove]');
      if (removeBtn) {
        const id = removeBtn.getAttribute('data-modal-remove');
        if (state.modalTab === 'favs') {
          state.favorites.delete(id);
        } else {
          state.tasted.delete(id);
        }
        saveStorage();
        renderModalList();
        render();
      }
    });

    DOM.exportCsvBtn.addEventListener('click', exportCsv);

    DOM.clearMyListBtn.addEventListener('click', () => {
      const isFavTab = state.modalTab === 'favs';
      if (confirm(`Are you sure you want to clear all ${isFavTab ? 'favorites' : 'tasted beers'}?`)) {
        if (isFavTab) {
          state.favorites.clear();
        } else {
          state.tasted.clear();
        }
        saveStorage();
        renderModalList();
        render();
        showToast(`Cleared ${isFavTab ? 'favorites' : 'tasted'} list`);
      }
    });

    // Transfer to Phone Modal Events
    DOM.openSharePhoneBtn.addEventListener('click', () => {
      closeModal();
      openSharePhoneModal();
    });

    DOM.closeSharePhoneBtn.addEventListener('click', closeSharePhoneModal);
    DOM.closeSharePhoneBottomBtn.addEventListener('click', closeSharePhoneModal);
    DOM.sharePhoneModal.addEventListener('click', (e) => {
      if (e.target === DOM.sharePhoneModal) closeSharePhoneModal();
    });

    // Copy Link Button
    DOM.copyPlanLinkBtn.addEventListener('click', () => {
      const link = DOM.sharePlanLinkInput.value;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(link)
          .then(() => showToast('Plan link copied to clipboard! 📋'))
          .catch(() => showToast('Failed to copy link'));
      } else {
        DOM.sharePlanLinkInput.select();
        document.execCommand('copy');
        showToast('Plan link copied! 📋');
      }
    });

    // Copy Text Plan Button
    DOM.copyTextPlanBtn.addEventListener('click', () => {
      const textPlan = generateTextPlan();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(textPlan)
          .then(() => showToast('Tasting itinerary copied! Ready for Notes or WhatsApp 📋'))
          .catch(() => showToast('Failed to copy plan'));
      } else {
        showToast('Clipboard error');
      }
    });

    // Export JSON Backup
    DOM.exportJsonBtn.addEventListener('click', exportJsonBackup);

    // Custom Host Input
    DOM.applyHostBtn.addEventListener('click', () => {
      const val = DOM.customHostInput.value.trim();
      if (!val) {
        currentCustomBaseUrl = '';
        localStorage.removeItem('aat26_share_host');
      } else {
        currentCustomBaseUrl = val.endsWith('/') ? val : val + '/';
        localStorage.setItem('aat26_share_host', currentCustomBaseUrl);
      }
      updateQrAndShareLink();
      updateHostStatusBadge();
      showToast('QR code updated! 📷');
    });

    DOM.customHostInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        DOM.applyHostBtn.click();
      }
    });

    // Import Prompt Modal (when URL has plan)
    DOM.importMergeBtn.addEventListener('click', () => applyPendingImport('merge'));
    DOM.importReplaceBtn.addEventListener('click', () => applyPendingImport('replace'));
    DOM.importDismissBtn.addEventListener('click', () => {
      DOM.importPromptModal.style.display = 'none';
      const cleanUrl = window.location.pathname;
      window.history.replaceState(null, '', cleanUrl);
    });

    // Manual Import Modal
    DOM.openImportBtn.addEventListener('click', () => {
      DOM.importDataModal.style.display = 'flex';
      DOM.importJsonTextarea.value = '';
    });
    DOM.closeImportDataBtn.addEventListener('click', () => {
      DOM.importDataModal.style.display = 'none';
    });
    DOM.importDataModal.addEventListener('click', (e) => {
      if (e.target === DOM.importDataModal) DOM.importDataModal.style.display = 'none';
    });

    DOM.executeImportBtn.addEventListener('click', () => {
      const text = DOM.importJsonTextarea.value.trim();
      if (!text) {
        showToast('Please paste JSON or backup text');
        return;
      }
      if (importPlanData(text, 'merge')) {
        DOM.importDataModal.style.display = 'none';
        closeSharePhoneModal();
      }
    });

    DOM.importFileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (importPlanData(event.target.result, 'merge')) {
          DOM.importDataModal.style.display = 'none';
          closeSharePhoneModal();
        }
      };
      reader.readAsText(file);
    });

    // Share Button (Copy URL to clipboard)
    DOM.shareBtn.addEventListener('click', () => {
      syncUrlParams();
      if (navigator.clipboard) {
        navigator.clipboard.writeText(window.location.href)
          .then(() => showToast('Link copied to clipboard! 📋'))
          .catch(() => showToast('Failed to copy link'));
      } else {
        showToast('Link ready in address bar');
      }
    });

    // Download menu: toggle on the button, close when clicking outside it or after picking a file
    const downloadMenu = document.getElementById('downloadMenu');
    const downloadMenuBtn = document.getElementById('downloadMenuBtn');
    const downloadMenuList = downloadMenu.querySelector('.download-menu-list');
    const setDownloadMenuOpen = (open) => {
      downloadMenuList.hidden = !open;
      downloadMenuBtn.setAttribute('aria-expanded', String(open));
      downloadMenu.classList.toggle('open', open);
    };
    document.addEventListener('click', (e) => {
      if (downloadMenuBtn.contains(e.target)) {
        setDownloadMenuOpen(downloadMenuList.hidden);
      } else if (!downloadMenuList.hidden && (!downloadMenu.contains(e.target) || e.target.closest('a'))) {
        setDownloadMenuOpen(false);
      }
    });

    // Theme Toggle Button
    DOM.themeToggleBtn.addEventListener('click', () => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      updateTheme(newTheme);
      showToast(`Switched to ${newTheme} mode`);
    });

    // Back to top button
    window.addEventListener('scroll', () => {
      if (window.scrollY > 400) {
        DOM.backToTopBtn.style.display = 'flex';
      } else {
        DOM.backToTopBtn.style.display = 'none';
      }
    });

    DOM.backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Application Launch
  document.addEventListener('DOMContentLoaded', () => {
    initEventListeners();
    loadData();
  });
})();
