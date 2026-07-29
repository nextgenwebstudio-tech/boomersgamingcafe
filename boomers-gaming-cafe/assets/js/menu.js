// Boomer's Gaming Cafe - Interactive Food Menu & Ordering System Logic

document.addEventListener('DOMContentLoaded', () => {
  initFoodMenuEngine();
});

/**
 * Main Interactive Food Menu Engine
 */
function initFoodMenuEngine() {
  const container = document.getElementById('cafeItemsContainer');
  const searchInput = document.getElementById('foodSearchInput');
  const filterButtons = document.querySelectorAll('.food-filter-btn');
  const tabButtons = document.querySelectorAll('.cafe-tab-btn');
  
  if (!container) return;

  let currentCategory = 'xp-starters';
  let activeSearchQuery = '';
  let activeFilterType = 'all'; // all, veg, non-veg, under-200, bestseller, snacks, drinks, combos

  // Flattened menu cache for searching and filtering
  const allFoodItems = [];
  Object.keys(POWER_UP_MENU).forEach(cat => {
    POWER_UP_MENU[cat].forEach(item => {
      // Inject category ID key to help filtering
      allFoodItems.push({ ...item, categoryKey: cat });
    });
  });

  // Render ranked Top 6 "Most Ordered" items shelf
  renderMostOrderedShelf(allFoodItems);

  // Render food gallery masonry
  renderFoodGalleryLightbox();

  // Initial menu render
  renderMenuGrid();

  // Search input handler
  // Search input handler
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const shortcut = document.querySelector('.search-shortcut-badge');
  const sortSelect = document.getElementById('foodSortSelect');
  
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = activeSearchQuery ? 'block' : 'none';
      }
      if (shortcut) {
        shortcut.style.display = activeSearchQuery ? 'none' : 'block';
      }
      renderMenuGrid();
    });
  }

  if (clearSearchBtn && searchInput) {
    clearSearchBtn.addEventListener('click', () => {
      searchInput.value = '';
      activeSearchQuery = '';
      clearSearchBtn.style.display = 'none';
      if (shortcut) {
        shortcut.style.display = 'block';
      }
      renderMenuGrid();
    });
  }

  // Rotating placeholders for search box
  const searchPlaceholders = [
    "Search burgers, pasta, mocktails...",
    "Search fries, sandwiches, energy drinks...",
    "Search squad combos, milkshakes, wraps...",
    "Search wings, instant maggi, popcorn..."
  ];
  let placeholderIdx = 0;
  setInterval(() => {
    if (searchInput) {
      placeholderIdx = (placeholderIdx + 1) % searchPlaceholders.length;
      searchInput.placeholder = searchPlaceholders[placeholderIdx];
    }
  }, 3000);

  // Dynamic category item counts
  tabButtons.forEach(btn => {
    const onclickStr = btn.getAttribute('onclick') || '';
    const match = onclickStr.match(/'([^']+)'/);
    if (match && match[1]) {
      const catKey = match[1];
      let count = 0;
      if (catKey === 'best-sellers') {
        count = allFoodItems.filter(item => 
          item.popularity === 'Must Try' || item.popularity === 'Bestseller' || parseFloat(item.rating) >= 4.9
        ).length;
      } else if (POWER_UP_MENU[catKey]) {
        count = POWER_UP_MENU[catKey].length;
      }
      
      const cleanText = btn.textContent.trim().replace(/\s*\(\d+\s*Items\)$/i, '').replace(/\s*\d+\s*Items$/i, '').replace(/\s*\(\d+\)$/i, '');
      btn.innerHTML = `${cleanText} <span style="opacity:0.75; font-size:9px; margin-left:4px;">(${count})</span>`;
    }
  });

  // Global helper for trending search chips
  window.applySearchQuery = function(query) {
    if (searchInput) {
      searchInput.value = query;
      activeSearchQuery = query.toLowerCase().trim();
      if (clearSearchBtn) {
        clearSearchBtn.style.display = 'block';
      }
      if (shortcut) {
        shortcut.style.display = 'none';
      }
      renderMenuGrid();
      
      // Focus and scroll
      searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Set checkmark prefix for filters dynamically
  filterButtons.forEach(btn => {
    const originalText = btn.textContent.replace('✓ ', '').trim();
    btn.dataset.original = originalText;
    if (btn.classList.contains('active') && !btn.textContent.startsWith('✓')) {
      btn.textContent = '✓ ' + originalText;
    }
  });

  // Filter tags click handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.textContent = b.dataset.original || b.textContent.replace('✓ ', '').trim();
      });
      btn.classList.add('active');
      btn.textContent = '✓ ' + (btn.dataset.original || btn.textContent.trim());
      activeFilterType = btn.dataset.filter;
      renderMenuGrid();
    });
  });

  // Sort dropdown change listener
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      renderMenuGrid();
    });
  }

  // Category tab button click handler
  window.switchCafeTab = function(category, btnElement) {
    currentCategory = category;
    
    // Update active tab styles
    tabButtons.forEach(btn => btn.classList.remove('active'));
    if (btnElement) {
      btnElement.classList.add('active');
    } else {
      // Find button by onclick parameter matching the category
      const targetBtn = Array.from(tabButtons).find(btn => btn.getAttribute('onclick').includes(category));
      if (targetBtn) targetBtn.classList.add('active');
    }

    // Clear search and other filters on tab change to prevent confusion
    if (searchInput) searchInput.value = '';
    activeSearchQuery = '';
    if (clearSearchBtn) clearSearchBtn.style.display = 'none';
    if (shortcut) shortcut.style.display = 'block';
    
    filterButtons.forEach(b => {
      b.classList.remove('active');
      b.textContent = b.dataset.original || b.textContent.replace('✓ ', '').trim();
    });
    const allFilterBtn = Array.from(filterButtons).find(b => b.dataset.filter === 'all');
    if (allFilterBtn) {
      allFilterBtn.classList.add('active');
      allFilterBtn.textContent = '✓ ' + (allFilterBtn.dataset.original || 'All Items');
    }
    activeFilterType = 'all';

    renderMenuGrid();
    Tracker.track('Cafe Tab Switched', { category });
  };

  /**
   * Evaluates filter conditions and renders matching cards
   */
  function renderMenuGrid() {
    container.innerHTML = '';
    
    let filteredList = [];

    // 1. Filter by category first (unless doing search or combos/snacks queries)
    if (currentCategory === 'best-sellers') {
      // Pull items matching bestseller criteria
      filteredList = allFoodItems.filter(item => 
        item.popularity === 'Must Try' || item.popularity === 'Bestseller' || parseFloat(item.rating) >= 4.9
      );
    } else {
      filteredList = allFoodItems.filter(item => item.categoryKey === currentCategory);
    }

    // 2. Apply search text query
    if (activeSearchQuery !== '') {
      filteredList = allFoodItems.filter(item => 
        item.name.toLowerCase().includes(activeSearchQuery) || 
        item.desc.toLowerCase().includes(activeSearchQuery)
      );
    }

    // 3. Apply tag filters
    if (activeFilterType === 'veg') {
      filteredList = filteredList.filter(item => item.isVeg === true);
    } else if (activeFilterType === 'non-veg') {
      filteredList = filteredList.filter(item => item.isVeg === false);
    } else if (activeFilterType === 'under-200') {
      filteredList = filteredList.filter(item => item.price < 200);
    } else if (activeFilterType === 'bestseller') {
      filteredList = filteredList.filter(item => item.popularity === 'Must Try' || item.popularity === 'Bestseller');
    } else if (activeFilterType === 'snacks') {
      filteredList = filteredList.filter(item => ['xp-starters', 'tactical-starters', 'popcorn'].includes(item.categoryKey));
    } else if (activeFilterType === 'drinks') {
      filteredList = filteredList.filter(item => ['milkshake', 'hot-beverages', 'cold-beverages', 'mocktails'].includes(item.categoryKey));
    } else if (activeFilterType === 'combos') {
      filteredList = allFoodItems.filter(item => item.categoryKey === 'squad-combos');
    }

    // 3.5 Apply sorting
    const sortVal = document.getElementById('foodSortSelect') ? document.getElementById('foodSortSelect').value : 'popular';
    const sortLabels = {
      'popular': 'Popular',
      'price-asc': 'Price Low → High',
      'price-desc': 'Price High → Low',
      'prep': 'Prep Time',
      'rating': 'Best Rated'
    };

    if (sortVal === 'price-asc') {
      filteredList.sort((a, b) => a.price - b.price);
    } else if (sortVal === 'price-desc') {
      filteredList.sort((a, b) => b.price - a.price);
    } else if (sortVal === 'prep') {
      filteredList.sort((a, b) => {
        const timeA = parseInt(a.prep) || 0;
        const timeB = parseInt(b.prep) || 0;
        return timeA - timeB;
      });
    } else if (sortVal === 'rating') {
      filteredList.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
    } else {
      // popular (default)
      filteredList.sort((a, b) => {
        const popRank = { 'Must Try': 3, 'Bestseller': 2, 'Popular': 1 };
        const rankA = popRank[a.popularity] || 0;
        const rankB = popRank[b.popularity] || 0;
        if (rankB !== rankA) return rankB - rankA;
        return parseFloat(b.rating) - parseFloat(a.rating);
      });
    }

    // Update search banner count & description
    const banner = document.getElementById('searchResultsBanner');
    const bannerText = document.getElementById('searchResultsCountText');
    if (banner && bannerText) {
      if (activeSearchQuery !== '' || activeFilterType !== 'all') {
        banner.style.display = 'flex';
        bannerText.textContent = `${filteredList.length} Results Found Sorted by ${sortLabels[sortVal]}`;
      } else {
        banner.style.display = 'none';
      }
    }

    // Empty state
    if (filteredList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 40px; color: var(--muted); font-family: var(--mono); font-size: 14px; background: rgba(255,255,255,0.02); border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; display:flex; flex-direction:column; align-items:center; gap:16px;">
          <span style="font-size: 32px;">🎮</span>
          <strong>No loadouts found.</strong>
          <span>Try another category or filter search terms.</span>
          <button class="button secondary" onclick="if(window.clearAllFoodFilters) window.clearAllFoodFilters()" style="padding: 6px 16px; font-size: 11px; border-radius: 6px; height:34px; min-height:34px !important; margin-top: 10px;">[ Show All ]</button>
        </div>
      `;
      return;
    }

    // 4. Render product cards
    filteredList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'badge-card glass-card food-product-card';
      card.style.cursor = 'pointer';
      
      const popularityBadge = item.popularity ? `<span class="food-pop-badge">${item.popularity === 'Bestseller' ? '🔥 Bestseller' : item.popularity}</span>` : '';
      const gamingBadge = `<span class="food-gaming-badge" style="position: absolute; right: 12px; top: 12px; font: 700 8px var(--mono); background: rgba(167, 110, 255, 0.95); color: #fff; padding: 4px 8px; border-radius: 4px; text-transform: uppercase; z-index: 2; letter-spacing: 0.05em; display: flex; align-items: center; gap: 4px;">🎮 Setup Delivery</span>`;
      
      card.innerHTML = `
        <div class="food-image-container" onclick="openFoodDetailsModal('${item.id}')">
          <div class="food-image-bg" style="background-image: url('${item.image}')"></div>
          ${popularityBadge}
          ${gamingBadge}
          <div class="quick-card-actions">
            <button class="quick-fav-btn" onclick="event.stopPropagation(); this.classList.toggle('active')" title="Add to Favorites" aria-label="Favorite">♡</button>
            <button class="quick-add-image-btn" onclick="event.stopPropagation(); addFoodToCart('${item.id}')" title="Quick Add to Booking" aria-label="Quick Add">+</button>
          </div>
        </div>
        <div class="food-card-details" onclick="openFoodDetailsModal('${item.id}')" style="padding: 16px;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="food-type-badge ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
            <div style="display:flex; align-items:center; gap:6px; font-family:var(--mono); font-size:10px; color:var(--accent);">
              <span>⭐ ${item.rating}</span>
              <span style="opacity:0.3">|</span>
              <span>⏱ ${item.prep}</span>
            </div>
          </div>
          <h4 class="food-card-title">${item.name}</h4>
          <p class="food-card-desc">${item.desc}</p>
        </div>
        <div class="food-card-footer">
          <span class="food-card-price">₹${item.price}</span>
          <button class="cafe-add-btn" onclick="event.stopPropagation(); addFoodToCart('${item.id}')">+ Add To Booking</button>
        </div>
      `;
      container.appendChild(card);
    });
  }
}

/**
 * Render Ranked top 6 most ordered items
 */
function renderMostOrderedShelf(foodItems) {
  const shelf = document.getElementById('mostOrderedShelf');
  if (!shelf) return;

  // Pull top 6 items based on rating & popularity
  const top6 = foodItems
    .filter(item => item.popularity === 'Must Try' || item.popularity === 'Bestseller')
    .slice(0, 6);

  shelf.innerHTML = '';

  top6.forEach((item, index) => {
    const card = document.createElement('div');
    card.className = 'badge-card glass-card food-product-card ranked-card';
    card.style.cursor = 'pointer';
    card.onclick = () => openFoodDetailsModal(item.id);
    
    card.innerHTML = `
      <div class="rank-number">${index + 1}</div>
      <div class="food-image-container" style="height:140px;">
        <div class="food-image-bg" style="background-image: url('${item.image}')"></div>
        <span class="food-pop-badge" style="background:var(--lime); color:#000;">★ Ranked #${index + 1}</span>
      </div>
      <div style="padding:16px;">
        <span class="food-type-badge ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
        <h4 style="font:700 16px var(--display); color:#fff; margin:6px 0 4px;">${item.name}</h4>
        <p style="font-size:11px; color:var(--muted); line-height:1.4; margin-bottom:12px; min-height:34px;">${item.desc}</p>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <span style="font:700 16px var(--display); color:var(--lime);">₹${item.price}</span>
          <button class="cafe-add-btn" onclick="event.stopPropagation(); addFoodToCart('${item.id}')">+ Add</button>
        </div>
      </div>
    `;
    shelf.appendChild(card);
  });
}

/**
 * Detailed Food Popup Modal opener
 */
/**
 * Detailed Food Popup Modal opener
 */
window.openFoodDetailsModal = function(itemId) {
  const modal = document.getElementById('foodDetailModal');
  if (!modal) return;

  // Find item in menu data
  let foundItem = null;
  Object.keys(POWER_UP_MENU).forEach(cat => {
    const item = POWER_UP_MENU[cat].find(f => f.id === itemId);
    if (item) foundItem = { ...item, categoryKey: cat };
  });

  if (!foundItem) return;

  window.modalCurrentItem = foundItem;

  const contentWrap = document.getElementById('foodModalContent');
  if (!contentWrap) return;

  // Find 4 related items (same category, different ID)
  const related = POWER_UP_MENU[foundItem.categoryKey]
    .filter(f => f.id !== itemId)
    .slice(0, 4);

  contentWrap.innerHTML = `
    <div class="food-modal-grid">
      <!-- Left: Image -->
      <div class="food-modal-media">
        <div class="modal-food-badge-wrap">
          ${foundItem.popularity === 'Bestseller' || foundItem.popularity === 'Must Try' ? `<span class="modal-food-badge bestseller">🔥 ${foundItem.popularity}</span>` : ''}
          <span class="modal-food-veg-badge ${foundItem.isVeg ? 'veg' : 'nonveg'}">${foundItem.isVeg ? '🟢 Vegetarian' : '🔴 Non-Vegetarian'}</span>
        </div>
        <img class="modal-food-img" src="${foundItem.image}" alt="${foundItem.name}">
        <!-- Favourite Heart Icon overlay -->
        <button class="modal-fav-btn" onclick="this.classList.toggle('active')" aria-label="Favorite">❤️</button>
      </div>
      <!-- Right: Content -->
      <div class="food-modal-body">
        <!-- Kicker + Title -->
        <div class="food-modal-header-block">
          <div class="food-modal-kicker">BGC Power-Up Refill</div>
          <h2 class="food-modal-title">${foundItem.name}</h2>
          <div class="food-modal-price-rating">
            <span class="food-modal-price">₹${foundItem.price}</span>
            <span class="food-modal-rating">⭐⭐⭐⭐⭐ ${foundItem.rating}</span>
          </div>
        </div>
        <!-- Description -->
        <p class="food-modal-desc">${foundItem.desc}</p>
        
        <!-- Premium Stat Chips -->
        <div class="food-stat-chips">
          <span class="food-stat-chip"><span class="chip-icon">⏱</span><span class="chip-label">Prep</span> ${foundItem.prep}</span>
          <span class="food-stat-chip"><span class="chip-icon">🔥</span><span class="chip-label">Calories</span> ${foundItem.calories || '—'}</span>
          <span class="food-stat-chip"><span class="chip-icon">⭐</span><span class="chip-label">Rating</span> ${foundItem.rating}</span>
        </div>

        <!-- Ingredients tags -->
        <div>
          <div class="food-modal-section-title">⚙️ Loadout Ingredients</div>
          <div class="food-ingredient-tags">
            ${foundItem.ingredients ? foundItem.ingredients.map(ing => `<span class="food-ingredient-tag">${ing}</span>`).join('') : '<span class="food-ingredient-tag">Premium ingredients</span>'}
          </div>
        </div>

        <!-- Desktop Quantity (hidden on mobile) -->
        <div class="food-qty-section-desktop">
          <div class="food-modal-section-title">🛒 Quantities</div>
          <div class="food-qty-row">
            <div class="food-qty-selector">
              <button class="food-qty-btn" onclick="decrementFoodQuantity()" aria-label="Decrease">−</button>
              <span class="food-qty-value" id="foodModalQty">1</span>
              <button class="food-qty-btn" onclick="incrementFoodQuantity()" aria-label="Increase">+</button>
            </div>
            <span class="food-prep-live"><span class="live-dot"></span> Prepared in ${foundItem.prep} min</span>
          </div>
          <div class="food-add-btn-wrap">
            <button class="food-add-btn" id="modalAddBtn" onclick="addFoodQtyToCart('${foundItem.id}')">
              Add to Booking <span class="btn-price" id="modalBtnPrice">· ₹${foundItem.price}</span>
            </button>
          </div>
        </div>

        <!-- Mobile Sticky Action Bar (hidden on desktop) -->
        <div class="food-add-sticky-wrap">
          <div class="food-qty-selector">
            <button class="food-qty-btn" onclick="decrementFoodQuantity()" aria-label="Decrease">−</button>
            <span class="food-qty-value" id="foodModalQtyMobile">1</span>
            <button class="food-qty-btn" onclick="incrementFoodQuantity()" aria-label="Increase">+</button>
          </div>
          <button class="food-add-btn" id="modalAddBtnMobile" onclick="addFoodQtyToCart('${foundItem.id}')">
            Add to Booking · <span id="modalBtnPriceMobile">₹${foundItem.price}</span>
          </button>
        </div>

        <!-- Related Items -->
        ${related.length > 0 ? `
          <div>
            <div class="food-modal-section-title">🎯 Customers Also Ordered</div>
            <div class="food-related-scroll">
              ${related.map(rel => `
                <div class="food-related-card" onclick="openFoodDetailsModal('${rel.id}')">
                  <img src="${rel.image}" alt="${rel.name}" loading="lazy">
                  <div class="food-related-info">
                    <div class="rel-name">${rel.name}</div>
                    <div class="rel-meta">
                      <span class="rel-price">₹${rel.price}</span>
                      <button class="rel-add" onclick="event.stopPropagation(); openFoodDetailsModal('${rel.id}')">+</button>
                    </div>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        ` : ''}

        <!-- Recommended Drink Pairing -->
        <div class="recommended-pairing-block">
          <div class="food-modal-section-title">🥤 Recommended Pairing</div>
          <div style="font-size:12px; color:#B8B8B8; display:flex; align-items:center; gap:8px;">
            <span>Recommended Drink:</span>
            <span style="color:#F5C64D; font-weight:700;">Mana Potion Thick Milkshake 🥤</span>
          </div>
        </div>

        <!-- Gaming tags -->
        <div style="border-top: 1px solid rgba(255,255,255,0.06); padding-top: 15px; font-size:11px; color:rgba(255,255,255,0.4); display:flex; gap:16px;">
          <span>🚀 Ready in ${foundItem.prep} minutes</span>
          <span>🎮 Perfect with PC Arena</span>
        </div>
      </div>
    </div>
  `;

  modal.classList.add('active');
  document.body.classList.add('no-scroll');

  Tracker.track('Food Modal Opened', { item: foundItem.name });
};

window.closeFoodDetailsModal = function() {
  const modal = document.getElementById('foodDetailModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.classList.remove('no-scroll');
  }
};

window.updateModalSubtotals = function(qty) {
  if (!window.modalCurrentItem) return;
  const price = window.modalCurrentItem.price;
  const total = price * qty;
  
  const btnPrice = document.getElementById('modalBtnPrice');
  if (btnPrice) btnPrice.textContent = `· ₹${total}`;
  
  const btnPriceMobile = document.getElementById('modalBtnPriceMobile');
  if (btnPriceMobile) btnPriceMobile.textContent = `₹${total}`;
};

// Quantity adjusters inside detailed popup
window.incrementFoodQuantity = function() {
  const qtyInput = document.getElementById('foodModalQty');
  const qtyInputMobile = document.getElementById('foodModalQtyMobile');
  let val = parseInt(qtyInput ? qtyInput.textContent : (qtyInputMobile ? qtyInputMobile.textContent : '1')) || 1;
  if (val < 10) {
    const newVal = val + 1;
    if (qtyInput) qtyInput.textContent = newVal;
    if (qtyInputMobile) qtyInputMobile.textContent = newVal;
    window.updateModalSubtotals(newVal);
  }
};

window.decrementFoodQuantity = function() {
  const qtyInput = document.getElementById('foodModalQty');
  const qtyInputMobile = document.getElementById('foodModalQtyMobile');
  let val = parseInt(qtyInput ? qtyInput.textContent : (qtyInputMobile ? qtyInputMobile.textContent : '1')) || 1;
  if (val > 1) {
    const newVal = val - 1;
    if (qtyInput) qtyInput.textContent = newVal;
    if (qtyInputMobile) qtyInputMobile.textContent = newVal;
    window.updateModalSubtotals(newVal);
  }
};

/**
 * Cart logic and sticky booking sidebar operations
 */
const cartState = {
  gamingRate: 120, // default rate
  gamingHrs: 2,
  gamingPlayers: 1,
  stationName: "Station 12",
  addedFood: [],
  selectedBundle: null
};

// Listen to station / duration changes from booking wizard to sync
document.addEventListener('change', () => {
  const durationInput = document.getElementById('w-duration');
  const playersInput = document.getElementById('w-players');
  if (durationInput) cartState.gamingHrs = parseInt(durationInput.value) || 2;
  if (playersInput) cartState.gamingPlayers = parseInt(playersInput.value) || 1;
  updatePremiumSessionHUD();
});

// Intercept booking wizard selections to sync station rates
window.addEventListener('stationSelected', (e) => {
  if (e.detail) {
    cartState.stationName = e.detail.name;
    cartState.gamingRate = e.detail.price;
    updatePremiumSessionHUD();
  }
});

/**
 * Add food from main product card (adds 1 quantity)
 */
window.addFoodToCart = function(itemId) {
  let found = null;
  Object.keys(POWER_UP_MENU).forEach(cat => {
    const item = POWER_UP_MENU[cat].find(f => f.id === itemId);
    if (item) found = item;
  });

  if (!found) return;

  // Add to main active booking list (for wizard sync)
  if (window.activeBooking) {
    activeBooking.addedFood.push({ name: found.name, price: found.price });
  }

  // Add to local cart state
  const existing = cartState.addedFood.find(f => f.id === itemId);
  if (existing) {
    existing.qty += 1;
  } else {
    cartState.addedFood.push({ id: found.id, name: found.name, price: found.price, qty: 1 });
  }

  updatePremiumSessionHUD();
  
  // Calculate total count
  const totalCount = cartState.addedFood.reduce((sum, item) => sum + item.qty, 0);
  if (window.showBgcNotification) {
    window.showBgcNotification(`✔ Added to Session`, `<strong>${found.name}</strong> added successfully • ${totalCount} Items total`);
  }
  
  Tracker.track('Cart Item Added', { name: found.name });
};

/**
 * Add food with specific quantity from details modal popup
 */
window.addFoodQtyToCart = function(itemId) {
  const qtyInput = document.getElementById('foodModalQty');
  const qty = qtyInput ? parseInt(qtyInput.value) || 1 : 1;

  let found = null;
  Object.keys(POWER_UP_MENU).forEach(cat => {
    const item = POWER_UP_MENU[cat].find(f => f.id === itemId);
    if (item) found = item;
  });

  if (!found) return;

  // Add to main active booking list (for wizard sync)
  if (window.activeBooking) {
    for (let i = 0; i < qty; i++) {
      activeBooking.addedFood.push({ name: found.name, price: found.price });
    }
  }

  // Add to local cart state
  const existing = cartState.addedFood.find(f => f.id === itemId);
  if (existing) {
    existing.qty += qty;
  } else {
    cartState.addedFood.push({ id: found.id, name: found.name, price: found.price, qty: qty });
  }

  updatePremiumSessionHUD();
  closeFoodDetailsModal();
  
  const totalCount = cartState.addedFood.reduce((sum, item) => sum + item.qty, 0);
  if (window.showBgcNotification) {
    window.showBgcNotification(`✔ Added to Session`, `<strong>${qty}x ${found.name}</strong> added successfully • ${totalCount} Items total`);
  }
};

/**
 * Remove food item from cart widget
 */
window.removeCartItem = function(itemId) {
  const idx = cartState.addedFood.findIndex(f => f.id === itemId);
  if (idx > -1) {
    const item = cartState.addedFood[idx];
    
    // Remove from activeBooking array too
    if (window.activeBooking) {
      activeBooking.addedFood = activeBooking.addedFood.filter(f => f.name !== item.name);
    }

    cartState.addedFood.splice(idx, 1);
    updatePremiumSessionHUD();
    Tracker.track('Cart Item Removed', { id: itemId });
  }
};

// Track previous cart values to animate changes
const previousCartValues = {
  gaming: 0,
  food: 0,
  gst: 0,
  grand: 0
};

/**
 * Value counter animator for premium numbers feel
 */
function animateCartValue(element, start, end, duration = 300) {
  if (!element) return;
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentVal = Math.floor(progress * (end - start) + start);
    element.textContent = `₹${currentVal}`;
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = `₹${end}`;
    }
  };
  window.requestAnimationFrame(step);
}

/**
 * Re-calculate costs and update compact HUD panel
 */
function updatePremiumSessionHUD() {
  const hud = document.getElementById('premiumSessionHUD');
  if (!hud) return;

  const activeBooking = window.activeBooking || {
    branch: 'coimbatore',
    zone: 'pc',
    station: null,
    duration: 2,
    players: 1,
    slots: ['7:00 PM'],
    addedFood: []
  };

  // 1. Dynamic Theme Class
  hud.classList.remove('theme-valorant', 'theme-cs2', 'theme-eafc', 'theme-racing', 'theme-vr');
  const theme = getActiveGameTheme(activeBooking);
  if (theme) hud.classList.add(theme);

  // 2. Step Progress Bar
  const currentStep = window.bookingCurrentStep !== undefined ? window.bookingCurrentStep : 0;
  const progressText = document.getElementById('hudProgressText');
  const progressPercent = document.getElementById('hudProgressPercent');
  const progressBar = document.getElementById('hudProgressBar');
  if (progressText && progressPercent && progressBar) {
    const stepNum = currentStep + 1;
    progressText.textContent = `STEP ${stepNum} OF 7`;
    const percent = Math.round((stepNum / 7) * 100);
    progressPercent.textContent = `${percent}%`;
    progressBar.style.width = `${percent}%`;
  }

  // 3. Availability badge (header)
  const availBadge = document.getElementById('hudAvailBadge');
  if (availBadge && window.STATIONS_DATA) {
    const avCount = STATIONS_DATA.filter(s => s.branch === activeBooking.branch && s.zone === activeBooking.zone && s.status === 'available').length;
    availBadge.textContent = avCount > 0 ? `${avCount} Available` : 'Zone Full';
    availBadge.style.color = avCount > 0 ? '#00db78' : '#ff4f70';
  }

  // 4. Station thumbnail
  const thumbDisp = document.getElementById('hudStationThumb');
  if (thumbDisp) {
    let thumbUrl = 'assets/images/boomers_pc_lounge.jpg';
    if (activeBooking.zone === 'racing') thumbUrl = 'assets/images/boomers_racing_sim.jpg';
    else if (activeBooking.zone === 'console' || activeBooking.zone === 'vr') thumbUrl = 'assets/images/boomers_vr_lounge.jpg';
    thumbDisp.style.backgroundImage = `url('${thumbUrl}')`;
  }

  // 5. Station name + specs
  const nameDisp = document.getElementById('hudStationName');
  const specsDisp = document.getElementById('hudStationSpecs');
  if (nameDisp) nameDisp.textContent = activeBooking.station ? activeBooking.station.name : 'Browse Stations';
  if (specsDisp) {
    specsDisp.textContent = activeBooking.station
      ? `${activeBooking.station.gpu} · ${activeBooking.station.monitor}`
      : 'Select a station to continue';
  }

  // 6. Zone badge
  const zoneBadge = document.getElementById('hudZoneBadge');
  if (zoneBadge) {
    const zoneLabels = { pc: 'PC ARENA', console: 'CONSOLE', vip: 'VIP SQUAD', racing: 'SIM RACING', vr: 'VR LOUNGE' };
    zoneBadge.textContent = zoneLabels[activeBooking.zone] || activeBooking.zone.toUpperCase();
  }

  // 7. Branch + players
  const branchDisp = document.getElementById('hudBranchName');
  const playersDisp = document.getElementById('hudPlayersCount');
  if (branchDisp) branchDisp.textContent = activeBooking.branch.charAt(0).toUpperCase() + activeBooking.branch.slice(1);
  if (playersDisp) playersDisp.textContent = `${activeBooking.players} Gamer${activeBooking.players > 1 ? 's' : ''}`;

  // 8. Quick row: time / duration / rate
  const timeDisp = document.getElementById('hudTimeSlot');
  const durationDisp = document.getElementById('hudDurationText');
  const rateDisp = document.getElementById('hudRateText');
  const rate = activeBooking.station ? activeBooking.station.price : (() => {
    const priceMap = { pc: activeBooking.branch === 'pune' ? 120 : 100, console: activeBooking.branch === 'pune' ? 150 : 120, vip: activeBooking.branch === 'pune' ? 300 : 250, racing: activeBooking.branch === 'pune' ? 200 : 150, vr: 200 };
    return priceMap[activeBooking.zone] || 100;
  })();
  if (timeDisp) timeDisp.textContent = activeBooking.slots && activeBooking.slots.length > 0 ? activeBooking.slots[0] : '7:00 PM';
  if (durationDisp) durationDisp.textContent = `${activeBooking.duration}h`;
  if (rateDisp) rateDisp.textContent = `₹${rate}/hr`;

  // 9. Equipment chips (zone-specific)
  const chipsEl = document.getElementById('hudEqChips');
  if (chipsEl) {
    let chips = [];
    if (activeBooking.zone === 'racing') {
      chips = ['🏎 Logitech G29', '🖥 Triple Screen', '🪑 Playseat', '⚙️ H-Shifter'];
    } else if (activeBooking.zone === 'vr') {
      chips = ['🥽 PS VR2', '🎮 Sense Haptic', '📡 IR Tracking', '📦 3m × 3m Pod'];
    } else if (activeBooking.zone === 'console') {
      chips = ['🎮 PlayStation 5', '📺 4K OLED', '🔊 Dolby Atmos', '🛋 Recliner'];
    } else {
      // pc / vip
      const isPune = activeBooking.branch === 'pune';
      const gpu = activeBooking.station ? activeBooking.station.gpu : (activeBooking.zone === 'vip' || isPune ? 'RTX 4070 S' : 'RTX 3070');
      const hz = activeBooking.station ? activeBooking.station.monitor : (isPune || activeBooking.zone === 'vip' ? '240Hz' : '180Hz');
      chips = [`⚡ ${gpu}`, `🖥 ${hz}`, '⌨ Mechanical', '🎧 HyperX', '🖱 Gaming Mouse'];
    }
    chipsEl.innerHTML = chips.map(c => `<span class="hud-chip">${c}</span>`).join('');
  }

  // 10. Food section: combo card vs added food cards
  const foodContainer = document.getElementById('hudFoodCards');
  const comboCard = document.getElementById('hudComboCard');
  let foodTotal = 0;
  let totalItemsCount = 0;

  if (foodContainer) {
    if (activeBooking.addedFood.length === 0) {
      // Show and update the dynamic recommended combo card
      if (comboCard) {
        comboCard.style.display = 'flex';
        
        const recTag = comboCard.querySelector('.hud-combo-tag');
        const recTitle = comboCard.querySelector('strong');
        const recPrice = comboCard.querySelector('.hud-combo-price');
        const recBtn = comboCard.querySelector('.hud-combo-btn');
        
        if (activeBooking.zone === 'racing') {
          if (recTag) recTag.textContent = '🏎️ Perfect with Sim Racing';
          if (recTitle) recTitle.textContent = 'Pro Racer Pack';
          if (recPrice) recPrice.textContent = '₹449';
          if (recBtn) recBtn.setAttribute('onclick', "window.addBundleToBooking('bundle-3')");
        } else if (activeBooking.zone === 'console' || activeBooking.zone === 'vr') {
          if (recTag) recTag.textContent = '🎮 Perfect with Console';
          if (recTitle) recTitle.textContent = 'Console Co-Op Combo';
          if (recPrice) recPrice.textContent = '₹499';
          if (recBtn) recBtn.setAttribute('onclick', "window.addBundleToBooking('bundle-2')");
        } else {
          // PC Arena / VIP
          if (recTag) recTag.textContent = '🍔 Perfect with PC Arena';
          if (recTitle) recTitle.textContent = 'Solo Grinder Combo';
          if (recPrice) recPrice.textContent = '₹349';
          if (recBtn) recBtn.setAttribute('onclick', "window.addBundleToBooking('bundle-1')");
        }
      }
    } else {
      // Hide combo, show added items
      if (comboCard) comboCard.style.display = 'none';

      // Remove old dynamic cards (keep comboCard)
      const existingDynamic = foodContainer.querySelectorAll('.hud-food-card-dynamic');
      existingDynamic.forEach(el => el.remove());

      const aggregatedFood = [];
      activeBooking.addedFood.forEach(item => {
        foodTotal += item.price;
        totalItemsCount += 1;
        const existing = aggregatedFood.find(f => f.name === item.name);
        if (existing) { existing.qty += 1; } else { aggregatedFood.push({ name: item.name, price: item.price, qty: 1 }); }
      });

      aggregatedFood.forEach(item => {
        const isDrink = ['drink','mojito','soda','shake','tea','coffee'].some(k => item.name.toLowerCase().includes(k));
        const card = document.createElement('div');
        card.className = 'hud-food-card hud-food-card-dynamic';
        card.innerHTML = `
          <div class="hud-food-card-left">
            <strong>${isDrink ? '🥤' : '🍔'} ${item.qty}x ${item.name}</strong>
          </div>
          <div class="hud-food-card-right">
            <b>₹${item.price * item.qty}</b>
            <button type="button" onclick="window.removeHUDFoodItem('${item.name}')" aria-label="Remove">&times;</button>
          </div>
        `;
        foodContainer.appendChild(card);
      });
    }
  }

  // 11. Mobile badge count
  const mobileHUDBadge = document.getElementById('mobileHUDCountBadge');
  if (mobileHUDBadge) mobileHUDBadge.textContent = totalItemsCount;

  // 12. Cost calculations & count-up animation
  const gamingCost = rate * activeBooking.duration * activeBooking.players;
  const subTotal = gamingCost + foodTotal;
  const gst = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gst;

  animateCartValue(document.getElementById('hudGamingCost'), previousCartValues.gaming, gamingCost);
  previousCartValues.gaming = gamingCost;
  animateCartValue(document.getElementById('hudKitchenCost'), previousCartValues.food, foodTotal);
  previousCartValues.food = foodTotal;
  animateCartValue(document.getElementById('hudGstCost'), previousCartValues.gst, gst);
  previousCartValues.gst = gst;
  animateCartValue(document.getElementById('hudGrandTotal'), previousCartValues.grand, grandTotal);
  previousCartValues.grand = grandTotal;

  // 13. Ticket Preview (step 7 only)
  const ticketPreview = document.getElementById('hudTicketPreview');
  if (ticketPreview) {
    if (currentStep === 6) {
      ticketPreview.style.display = 'block';
      const zoneLabels = { pc: 'PC Arena', console: 'Console Lounge', vip: 'VIP Squad', racing: 'Sim Racing', vr: 'VR Lounge' };
      const el = document.getElementById('hudTicketZone');
      if (el) el.textContent = zoneLabels[activeBooking.zone] || 'PC Arena';
      const elS = document.getElementById('hudTicketStation');
      if (elS) elS.textContent = activeBooking.station ? activeBooking.station.name : 'Station TBD';
      const elT = document.getElementById('hudTicketTime');
      if (elT) elT.textContent = activeBooking.slots && activeBooking.slots.length ? `Today • ${activeBooking.slots[0]}` : 'Today • 7:00 PM';
    } else {
      ticketPreview.style.display = 'none';
    }
  }

  // Sync summary if open
  const summaryCostDisp = document.getElementById('bookingSummaryCost');
  if (summaryCostDisp && window.renderBookingSummary) renderBookingSummary();
}

function getActiveGameTheme(activeBooking) {
  if (activeBooking.station && activeBooking.station.game) {
    const game = activeBooking.station.game.toLowerCase();
    if (game.includes('valorant')) return 'theme-valorant';
    if (game.includes('cs2') || game.includes('dota')) return 'theme-cs2';
    if (game.includes('fc') || game.includes('tekken')) return 'theme-eafc';
    if (game.includes('racing') || game.includes('sim')) return 'theme-racing';
    if (game.includes('vr') || game.includes('world')) return 'theme-vr';
  } else if (activeBooking.zone) {
    const zone = activeBooking.zone.toLowerCase();
    if (zone.includes('racing')) return 'theme-racing';
    if (zone.includes('console')) return 'theme-eafc';
    if (zone.includes('vip')) return 'theme-valorant';
    if (zone.includes('pc')) return 'theme-cs2';
    if (zone.includes('vr')) return 'theme-vr';
  }
  return '';
}

window.removeHUDFoodItem = function(foodName) {
  if (window.activeBooking) {
    const idx = activeBooking.addedFood.findIndex(f => f.name === foodName);
    if (idx > -1) {
      activeBooking.addedFood.splice(idx, 1);
      
      // Sync checkbox in step 5 if visible
      const checkboxes = document.querySelectorAll('#wizardFoodList .booking-choice-btn');
      checkboxes.forEach(card => {
        const title = card.querySelector('b').textContent;
        if (title === foodName) {
          const btn = card.querySelector('.cafe-add-btn');
          if (btn) btn.textContent = '+ Add';
          card.style.background = '#22242a';
          card.style.borderColor = 'var(--line)';
        }
      });

      window.updatePremiumSessionHUD();
      Tracker.track('Cart Item Removed', { name: foodName });
    }
  }
};

// Start live countdown timer on load
function startHUDCountdown() {
  const timerDisp = document.getElementById('hudCountdownTimer');
  if (!timerDisp) return;

  let duration = 522; // 8m 42s
  setInterval(() => {
    duration--;
    if (duration < 0) duration = 900;
    const mins = Math.floor(duration / 60);
    const secs = duration % 60;
    timerDisp.textContent = `${mins.toString().padStart(2, '0')}m ${secs.toString().padStart(2, '0')}s`;
  }, 1000);
}

// Kickoff countdown
document.addEventListener('DOMContentLoaded', () => {
  startHUDCountdown();
});

/* **
 * Render Food Gallery and open lightbox modal on click
 */
function renderFoodGalleryLightbox() {
  const gallery = document.getElementById('foodMasonryGallery');
  if (!gallery) return;

  const foodImagesList = [
    "assets/images/cafe-background.jpg",
    "assets/images/boomers_pc_lounge.jpg",
    "assets/images/cafe-background.jpg",
    "assets/images/cafe-background.jpg",
    "assets/images/boomers_pc_lounge.jpg",
    "assets/images/cafe-background.jpg"
  ];

  gallery.innerHTML = '';

  foodImagesList.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Food item ${idx + 1}" onclick="openLightbox(${idx})">`;
    gallery.appendChild(item);
  });
}

// Initialise HUD on page load
document.addEventListener('DOMContentLoaded', () => {
  if (window.updatePremiumSessionHUD) {
    window.updatePremiumSessionHUD();
  }
});

/**
 * 13. Global Helper to Clear All Food Filters (for Empty States)
 */
window.clearAllFoodFilters = function() {
  const searchInput = document.getElementById('foodSearchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const shortcut = document.querySelector('.search-shortcut-badge');
  const filterButtons = document.querySelectorAll('.food-filter-btn');
  const tabButtons = document.querySelectorAll('.cafe-tab-btn');
  
  if (searchInput) {
    searchInput.value = '';
    // Reset placeholder
    searchInput.placeholder = "Search burgers, pasta, mocktails...";
  }
  if (clearSearchBtn) clearSearchBtn.style.display = 'none';
  if (shortcut) shortcut.style.display = 'block';
  
  // Reset filter buttons
  filterButtons.forEach(b => {
    b.classList.remove('active');
    b.textContent = b.dataset.original || b.textContent.replace('✓ ', '').trim();
  });
  
  const allFilterBtn = Array.from(filterButtons).find(b => b.dataset.filter === 'all');
  if (allFilterBtn) {
    allFilterBtn.classList.add('active');
    allFilterBtn.textContent = '✓ ' + (allFilterBtn.dataset.original || 'All Items');
  }
  
  // Set category filter
  window.activeFilterType = 'all';
  window.activeSearchQuery = '';
  
  // Switch to first category
  window.switchCafeTab('best-sellers', tabButtons[0]);
};
