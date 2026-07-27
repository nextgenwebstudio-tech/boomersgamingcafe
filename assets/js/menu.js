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
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.toLowerCase().trim();
      renderMenuGrid();
    });
  }

  // Filter tags click handler
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilterType = btn.dataset.filter;
      renderMenuGrid();
    });
  });

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

    renderMenuGrid();
    
    // Clear search and other filters on tab change to prevent confusion
    if (searchInput) searchInput.value = '';
    activeSearchQuery = '';
    filterButtons.forEach(b => b.classList.remove('active'));
    const allFilterBtn = Array.from(filterButtons).find(b => b.dataset.filter === 'all');
    if (allFilterBtn) allFilterBtn.classList.add('active');
    activeFilterType = 'all';

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

    if (filteredList.length === 0) {
      container.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px; color: var(--muted); font-family: var(--mono); font-size: 13px;">
          ❌ No matching items found. Try another search or filter tag!
        </div>
      `;
      return;
    }

    // 4. Render product cards
    filteredList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'badge-card glass-card food-product-card';
      card.style.cursor = 'pointer';
      
      const popularityBadge = item.popularity ? `<span class="food-pop-badge">${item.popularity}</span>` : '';
      const prepBadge = `<span class="food-prep-badge">⏱️ ${item.prep}</span>`;
      const spiceIcons = '🌶️'.repeat(item.spice || 0);
      const spiceHTML = spiceIcons ? `<span style="margin-left:8px;">${spiceIcons}</span>` : '';
      
      card.innerHTML = `
        <div class="food-image-container" onclick="openFoodDetailsModal('${item.id}')">
          <div class="food-image-bg" style="background-image: url('${item.image}')"></div>
          ${popularityBadge}
          ${prepBadge}
        </div>
        <div class="food-card-details" onclick="openFoodDetailsModal('${item.id}')">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <span class="food-type-badge ${item.isVeg ? 'veg' : 'non-veg'}">${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}</span>
            <span style="color:#efbd4e; font-size:11px;">★ ${item.rating}</span>
          </div>
          <h4 class="food-card-title">${item.name}</h4>
          <p class="food-card-desc">${item.desc}</p>
          <div style="font: 500 9px var(--mono); color: var(--muted); margin-bottom: 12px; display:flex; align-items:center;">
            <span>🔥 ${item.calories}</span>
            ${spiceHTML}
          </div>
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

  const contentWrap = document.getElementById('foodModalContent');
  if (!contentWrap) return;

  // Build ingredients list items
  const ingredientsHTML = foundItem.ingredients 
    ? foundItem.ingredients.map(ing => `<li>${ing}</li>`).join('')
    : '<li>Premium ingredients mix</li>';

  // Find 2 related items (same category, different ID)
  const related = POWER_UP_MENU[foundItem.categoryKey]
    .filter(f => f.id !== itemId)
    .slice(0, 2);

  let relatedHTML = '';
  related.forEach(rel => {
    relatedHTML += `
      <div class="related-food-item" onclick="openFoodDetailsModal('${rel.id}')">
        <img src="${rel.image}" alt="${rel.name}">
        <div>
          <b>${rel.name}</b>
          <span>₹${rel.price}</span>
        </div>
      </div>
    `;
  });

  contentWrap.innerHTML = `
    <div class="food-modal-grid">
      <div class="food-modal-media" style="background-image: url('${foundItem.image}')">
        <span class="food-type-badge ${foundItem.isVeg ? 'veg' : 'non-veg'}" style="position:absolute; top:15px; left:15px;">
          ${foundItem.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
      </div>
      <div class="food-modal-details">
        <span style="font-family:var(--mono); color:var(--lime); font-size:10px; text-transform:uppercase; letter-spacing:0.12em;"> BGC Power-Up Refill</span>
        <h3 style="font:700 28px var(--display); letter-spacing:-0.05em; color:#fff; margin:6px 0 10px;">${foundItem.name}</h3>
        <p style="font-size:13px; color:var(--muted); line-height:1.6; margin-bottom:15px;">${foundItem.desc}</p>
        
        <div style="display:flex; gap:16px; font-size:11px; color:#fff; font-family:var(--mono); margin-bottom:20px; border-bottom:1px solid var(--line); padding-bottom:15px;">
          <span>⏱️ Prep: ${foundItem.prep}</span>
          <span>🔥 Calories: ${foundItem.calories}</span>
          <span>⭐ Rating: ${foundItem.rating}</span>
        </div>

        <h4 style="font:700 12px var(--mono); color:#fff; text-transform:uppercase; margin-bottom:8px;">Loadout Ingredients</h4>
        <ul style="font-size:12px; color:var(--muted); padding-left:18px; margin-bottom:24px; line-height:1.6;">
          ${ingredientsHTML}
        </ul>

        <div style="display:flex; align-items:center; gap:16px; margin-bottom:24px;">
          <div class="quantity-selector">
            <button onclick="decrementFoodQuantity()">-</button>
            <input type="number" id="foodModalQty" value="1" min="1" max="10" readonly>
            <button onclick="incrementFoodQuantity()">+</button>
          </div>
          <button class="button" onclick="addFoodQtyToCart('${foundItem.id}')" style="flex:1; justify-content:center;">
            Add to Booking · ₹${foundItem.price}
          </button>
        </div>

        ${relatedHTML ? `
          <h4 style="font:700 11px var(--mono); color:var(--muted); text-transform:uppercase; margin-bottom:10px; border-top:1px solid var(--line); padding-top:15px;">Related Upgrades</h4>
          <div class="related-items-wrap">
            ${relatedHTML}
          </div>
        ` : ''}
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

// Quantity adjusters inside detailed popup
window.incrementFoodQuantity = function() {
  const qtyInput = document.getElementById('foodModalQty');
  if (qtyInput) {
    let val = parseInt(qtyInput.value) || 1;
    if (val < 10) qtyInput.value = val + 1;
  }
};

window.decrementFoodQuantity = function() {
  const qtyInput = document.getElementById('foodModalQty');
  if (qtyInput) {
    let val = parseInt(qtyInput.value) || 1;
    if (val > 1) qtyInput.value = val - 1;
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
  alert(`Added ${found.name} to your session order!`);
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
  alert(`Added ${qty}x ${found.name} to your session order!`);
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
 * Re-calculate costs and update sticky widget HTML
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

  // 3. Station details & Thumbnail
  const nameDisp = document.getElementById('hudStationName');
  const specsDisp = document.getElementById('hudStationSpecs');
  const thumbDisp = document.getElementById('hudStationThumb');
  const playersDisp = document.getElementById('hudPlayersCount');
  const branchDisp = document.getElementById('hudBranchName');

  if (nameDisp) {
    nameDisp.textContent = activeBooking.station ? activeBooking.station.name : 'Select Station';
  }
  if (specsDisp) {
    specsDisp.textContent = activeBooking.station 
      ? `${activeBooking.station.gpu} · ${activeBooking.station.monitor}` 
      : 'No Specs Selected';
  }
  if (thumbDisp) {
    let thumbUrl = 'assets/images/boomers_pc_lounge.jpg';
    if (activeBooking.zone === 'racing') {
      thumbUrl = 'assets/images/boomers_racing_sim.jpg';
    } else if (activeBooking.zone === 'console' || activeBooking.zone === 'vr') {
      thumbUrl = 'assets/images/boomers_vr_lounge.jpg';
    }
    thumbDisp.style.backgroundImage = `url('${thumbUrl}')`;
  }
  if (playersDisp) {
    playersDisp.textContent = `${activeBooking.players} Gamer${activeBooking.players > 1 ? 's' : ''}`;
  }
  if (branchDisp) {
    branchDisp.textContent = activeBooking.branch.charAt(0).toUpperCase() + activeBooking.branch.slice(1);
  }

  // 4. Session details list
  const zoneDisp = document.getElementById('hudZoneName');
  const timeDisp = document.getElementById('hudTimeSlot');
  const durationDisp = document.getElementById('hudDurationText');

  if (zoneDisp) {
    const zoneLabels = { pc: 'PC Arena', console: 'Console Lounge', vip: 'VIP Squad', racing: 'Sim Racing', vr: 'VR Lounge' };
    zoneDisp.textContent = zoneLabels[activeBooking.zone] || activeBooking.zone.toUpperCase();
  }
  if (timeDisp) {
    timeDisp.textContent = activeBooking.slots && activeBooking.slots.length > 0 
      ? `Today • ${activeBooking.slots[0]}` 
      : 'Not Selected';
  }
  if (durationDisp) {
    durationDisp.textContent = `${activeBooking.duration} Hour${activeBooking.duration > 1 ? 's' : ''}`;
  }

  // 5. Gaming Equipment Specs
  const eqList = document.getElementById('hudEqList');
  if (eqList) {
    let eqHTML = '';
    const isPune = activeBooking.branch === 'pune';
    const gpuName = activeBooking.station ? activeBooking.station.gpu : (activeBooking.zone === 'vip' ? 'RTX 4070 SUPER' : (isPune ? 'RTX 4070 SUPER' : 'RTX 3070'));
    const monitorHz = activeBooking.station ? activeBooking.station.monitor : (isPune ? '240Hz' : '180Hz');

    if (activeBooking.zone === 'racing') {
      eqHTML = `
        <li><span>Rig:</span><strong>Logitech G29/G923</strong></li>
        <li><span>Pedals:</span><strong>3-Pedal Floor Unit</strong></li>
        <li><span>Shifter:</span><strong>Manual H-Shifter</strong></li>
        <li><span>Cockpit:</span><strong>Playseat Seat</strong></li>
        <li><span>Screen:</span><strong>Triple 27" Curved</strong></li>
      `;
    } else if (activeBooking.zone === 'vr') {
      eqHTML = `
        <li><span>Headset:</span><strong>PlayStation VR2</strong></li>
        <li><span>Controllers:</span><strong>Sense Haptic</strong></li>
        <li><span>Tracking:</span><strong>Inside-out IR</strong></li>
        <li><span>Area:</span><strong>3m x 3m VR Pod</strong></li>
        <li><span>Haptics:</span><strong>TactSuit Support</strong></li>
      `;
    } else if (activeBooking.zone === 'console') {
      eqHTML = `
        <li><span>Console:</span><strong>PlayStation 5</strong></li>
        <li><span>Display:</span><strong>4K OLED TV</strong></li>
        <li><span>Controller:</span><strong>DualSense Wireless</strong></li>
        <li><span>Couch:</span><strong>Premium Recliner</strong></li>
        <li><span>Sound:</span><strong>Dolby Atmos</strong></li>
      `;
    } else {
      // pc / vip
      const cpu = activeBooking.zone === 'vip' ? 'Intel i9' : 'Intel i7';
      eqHTML = `
        <li><span>Processor:</span><strong>${cpu}</strong></li>
        <li><span>Graphics:</span><strong>${gpuName}</strong></li>
        <li><span>Monitor:</span><strong>${monitorHz} Display</strong></li>
        <li><span>Keyboard:</span><strong>Mechanical Pro</strong></li>
        <li><span>Headset:</span><strong>HyperX Headset</strong></li>
      `;
    }
    eqList.innerHTML = eqHTML;
  }

  // 6. Food Preview cards aggregation
  const foodContainer = document.getElementById('hudFoodCards');
  let foodTotal = 0;
  let totalItemsCount = 0;
  if (foodContainer) {
    if (activeBooking.addedFood.length === 0) {
      foodContainer.innerHTML = '<div class="hud-food-empty">🍔 No food added yet</div>';
    } else {
      const aggregatedFood = [];
      activeBooking.addedFood.forEach(item => {
        foodTotal += item.price;
        totalItemsCount += 1;
        const existing = aggregatedFood.find(f => f.name === item.name);
        if (existing) {
          existing.qty += 1;
        } else {
          let prep = '12 mins';
          let categoryLabel = 'Snack';
          // Find details from POWER_UP_MENU
          Object.keys(POWER_UP_MENU).forEach(cat => {
            const found = POWER_UP_MENU[cat].find(f => f.name === item.name);
            if (found) {
              prep = found.prep;
              categoryLabel = found.popularity || 'Freshly Prepared';
            }
          });
          aggregatedFood.push({
            name: item.name,
            price: item.price,
            qty: 1,
            prep: prep,
            categoryLabel: categoryLabel
          });
        }
      });

      foodContainer.innerHTML = '';
      aggregatedFood.forEach(item => {
        const emoji = item.name.toLowerCase().includes('drink') || item.name.toLowerCase().includes('mojito') || item.name.toLowerCase().includes('soda') || item.name.toLowerCase().includes('shake') || item.name.toLowerCase().includes('tea') || item.name.toLowerCase().includes('coffee') ? '🥤' : '🍔';
        const card = document.createElement('div');
        card.className = 'hud-food-card';
        card.innerHTML = `
          <div class="hud-food-card-left">
            <strong>${emoji} ${item.qty}x ${item.name}</strong>
            <span>${item.categoryLabel} • ${item.prep}</span>
          </div>
          <div class="hud-food-card-right">
            <b>₹${item.price * item.qty}</b>
            <button type="button" onclick="window.removeHUDFoodItem('${item.name}')" aria-label="Remove item">&times;</button>
          </div>
        `;
        foodContainer.appendChild(card);
      });
    }
  }

  // 7. Badge count sync
  const mobileHUDBadge = document.getElementById('mobileHUDCountBadge');
  if (mobileHUDBadge) {
    mobileHUDBadge.textContent = totalItemsCount;
  }

  // 8. Cost calculations & Countup animation
  const rate = activeBooking.station ? activeBooking.station.price : 100;
  const gamingCost = rate * activeBooking.duration * activeBooking.players;
  const subTotal = gamingCost + foodTotal;
  const gst = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gst;

  const gamingDisp = document.getElementById('hudGamingCost');
  const kitchenDisp = document.getElementById('hudKitchenCost');
  const gstDisp = document.getElementById('hudGstCost');
  const totalDisp = document.getElementById('hudGrandTotal');

  animateCartValue(gamingDisp, previousCartValues.gaming, gamingCost);
  previousCartValues.gaming = gamingCost;

  animateCartValue(kitchenDisp, previousCartValues.food, foodTotal);
  previousCartValues.food = foodTotal;

  animateCartValue(gstDisp, previousCartValues.gst, gst);
  previousCartValues.gst = gst;

  animateCartValue(totalDisp, previousCartValues.grand, grandTotal);
  previousCartValues.grand = grandTotal;

  // 9. Ticket Preview Section (Visible on Step 7)
  const ticketPreview = document.getElementById('hudTicketPreview');
  if (ticketPreview) {
    if (currentStep === 6) {
      ticketPreview.style.display = 'block';
      const tZone = document.getElementById('hudTicketZone');
      const tStation = document.getElementById('hudTicketStation');
      const tTime = document.getElementById('hudTicketTime');
      if (tZone) {
        tZone.textContent = zoneDisp ? zoneDisp.textContent : 'PC Arena';
      }
      if (tStation) {
        tStation.textContent = activeBooking.station ? activeBooking.station.name : 'Station TBD';
      }
      if (tTime) {
        tTime.textContent = timeDisp ? timeDisp.textContent : 'Today • 7:00 PM';
      }
    } else {
      ticketPreview.style.display = 'none';
    }
  }

  // Sync with main booking cost displays if visible
  const summaryCostDisp = document.getElementById('bookingSummaryCost');
  if (summaryCostDisp && window.renderBookingSummary) {
    renderBookingSummary();
  }
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
