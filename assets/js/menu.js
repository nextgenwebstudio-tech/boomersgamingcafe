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
  updateStickyCartWidget();
});

// Intercept booking wizard selections to sync station rates
window.addEventListener('stationSelected', (e) => {
  if (e.detail) {
    cartState.stationName = e.detail.name;
    cartState.gamingRate = e.detail.price;
    updateStickyCartWidget();
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

  updateStickyCartWidget();
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

  updateStickyCartWidget();
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
    updateStickyCartWidget();
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
function updateStickyCartWidget() {
  const cartBody = document.getElementById('stickyCartItemsList');
  const cartCount = document.getElementById('stickyCartCountBadge');
  const mobileCartCount = document.getElementById('mobileCartCountBadge');
  const gamingTotalDisp = document.getElementById('cart-gaming-total');
  const foodTotalDisp = document.getElementById('cart-food-total');
  const gstDisp = document.getElementById('cart-gst');
  const grandTotalDisp = document.getElementById('cart-grand-total');

  if (!cartBody) return;

  const hasStation = window.activeBooking && window.activeBooking.station;

  if (!hasStation) {
    // 6. Session Cart Empty State
    cartBody.innerHTML = `
      <div style="padding: 24px; text-align: center; font-size: 12px; color: var(--muted); line-height: 1.6;">
        <span style="font-size: 20px; display: block; margin-bottom: 8px;">🎮</span>
        <b>No station selected yet</b><br>
        <span style="font-size: 10px; display: block; margin-top: 4px; margin-bottom: 12px;">Choose a station to begin your session.</span>
        <button type="button" class="cafe-add-btn" onclick="document.getElementById('book').scrollIntoView({behavior: 'smooth'})" style="margin: 0 auto; display: block;">Browse Stations</button>
      </div>
    `;
    if (cartCount) cartCount.textContent = '0';
    if (mobileCartCount) mobileCartCount.textContent = '0';
    if (gamingTotalDisp) gamingTotalDisp.textContent = '₹0';
    if (foodTotalDisp) foodTotalDisp.textContent = '₹0';
    if (gstDisp) gstDisp.textContent = '₹0';
    if (grandTotalDisp) grandTotalDisp.textContent = '₹0';
    previousCartValues.gaming = 0;
    previousCartValues.food = 0;
    previousCartValues.gst = 0;
    previousCartValues.grand = 0;
    return;
  }

  // Compute Gaming Cost
  const gamingCost = cartState.gamingRate * cartState.gamingHrs * cartState.gamingPlayers;
  animateCartValue(gamingTotalDisp, previousCartValues.gaming, gamingCost);
  previousCartValues.gaming = gamingCost;

  // Populate food rows
  cartBody.innerHTML = '';
  let foodTotal = 0;
  let totalItems = 0;

  if (cartState.addedFood.length === 0) {
    // Dynamic empty state for Food Add-ons
    const emptyRow = document.createElement('div');
    emptyRow.style.padding = '12px';
    emptyRow.style.textAlign = 'center';
    emptyRow.style.fontSize = '11px';
    emptyRow.style.color = 'var(--muted)';
    emptyRow.style.border = '1px dashed rgba(255,255,255,0.08)';
    emptyRow.style.borderRadius = '8px';
    emptyRow.innerHTML = `
      🍔 No food added yet<br>
      <a href="#power-up" onclick="document.getElementById('power-up').scrollIntoView({behavior: 'smooth'})" style="color: var(--lime); text-decoration: underline; display: inline-block; margin-top: 6px; font-family: var(--mono); font-size: 10px;">Explore Power-Up Station →</a>
    `;
    cartBody.appendChild(emptyRow);
  } else {
    cartState.addedFood.forEach(item => {
      foodTotal += item.price * item.qty;
      totalItems += item.qty;

      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <span>${item.qty}x ${item.name}</span>
        <div>
          <b>₹${item.price * item.qty}</b>
          <button onclick="removeCartItem('${item.id}')" aria-label="Remove item">&times;</button>
        </div>
      `;
      cartBody.appendChild(row);
    });
  }

  animateCartValue(foodTotalDisp, previousCartValues.food, foodTotal);
  previousCartValues.food = foodTotal;
  
  if (cartCount) cartCount.textContent = totalItems;
  if (mobileCartCount) mobileCartCount.textContent = totalItems;

  // GST & Grand Total
  const subTotal = gamingCost + foodTotal;
  const gst = Math.round(subTotal * 0.18);
  const grandTotal = subTotal + gst;

  animateCartValue(gstDisp, previousCartValues.gst, gst);
  previousCartValues.gst = gst;
  
  animateCartValue(grandTotalDisp, previousCartValues.grand, grandTotal);
  previousCartValues.grand = grandTotal;

  // Sync with main booking cost displays if visible
  const summaryCostDisp = document.getElementById('bookingSummaryCost');
  if (summaryCostDisp && window.renderBookingSummary) {
    renderBookingSummary();
  }
}

/**
 * Render Food Gallery and open lightbox modal on click
 */
function renderFoodGalleryLightbox() {
  const gallery = document.getElementById('foodMasonryGallery');
  if (!gallery) return;

  const foodImagesList = [
    "assets/images/boomers_cafe_food.jpg",
    "assets/images/boomers_pc_lounge.jpg",
    "assets/images/boomers_cafe_food.jpg",
    "assets/images/boomers_cafe_food.jpg",
    "assets/images/boomers_pc_lounge.jpg",
    "assets/images/boomers_cafe_food.jpg"
  ];

  gallery.innerHTML = '';

  foodImagesList.forEach((src, idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.innerHTML = `<img src="${src}" alt="Food item ${idx + 1}" onclick="openLightbox(${idx})">`;
    gallery.appendChild(item);
  });
}
