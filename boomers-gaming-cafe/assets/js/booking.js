// Boomer's Gaming Cafe - Interactive Seat Booker, Wizard, and Cost Calculator

// Global state for active booking
let activeBooking = {
  branch: 'coimbatore',
  zone: 'pc',
  station: null,
  duration: 2,
  players: 1,
  slots: ['7:00 PM'],
  addedFood: [], // Array of food items added: { name, price }
  bundle: null // Selected bundle if any
};
window.activeBooking = activeBooking;

document.addEventListener('DOMContentLoaded', () => {
  initBookingWizard();
  initStationBookerElements();
  initCostCalculator();
  initLiveAvailabilityWidget();
});

/**
 * 1. Step-by-Step Booking Flow Wizard Controller
 */
function initBookingWizard() {
  const wizardForm = document.getElementById('bookingCardForm');
  if (!wizardForm) return;

  const panels = document.querySelectorAll('.booking-step-panel');
  const prevBtn = document.getElementById('wizardPrevBtn');
  const nextBtn = document.getElementById('wizardNextBtn');
  const stepIndicators = document.querySelectorAll('.step');

  let currentStep = 0;

  // Show a specific step panel
  function showStep(stepIndex) {
    // Hide all panels
    panels.forEach((p) => {
      p.classList.remove('active');
      p.style.opacity = '0';
      p.style.transform = 'translate3d(0, 10px, 0)';
    });

    const activePanel = panels[stepIndex];
    activePanel.classList.add('active');

    // Animate active panel fade-in
    if (window.gsap) {
      gsap.to(activePanel, {
        opacity: 1,
        y: 0,
        duration: 0.35,
        ease: 'power2.out'
      });
    } else {
      setTimeout(() => {
        activePanel.style.opacity = '1';
        activePanel.style.transform = 'translate3d(0, 0, 0)';
        activePanel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      }, 50);
    }

    // Update wizard button visibilities
    prevBtn.classList.toggle('hidden', stepIndex === 0 || stepIndex === panels.length - 1);
    
    if (stepIndex === panels.length - 2) {
      nextBtn.textContent = "Pay & Confirm →";
    } else if (stepIndex === panels.length - 1) {
      nextBtn.classList.add('hidden');
    } else {
      nextBtn.classList.remove('hidden');
      nextBtn.textContent = "Continue →";
    }


    // Highlight step progress indicators
    stepIndicators.forEach((indicator, idx) => {
      indicator.classList.toggle('active', idx === stepIndex);
      const stepNames = ["Branch", "Zone", "Station", "Time", "Food", "Summary", "Ticket"];
      const displayLabel = stepNames[idx] || "Step";
      indicator.innerHTML = `<b>${displayLabel}</b><p>0${idx + 1}</p>`;
      if (idx < stepIndex) {
        indicator.classList.add('completed');
      } else {
        indicator.classList.remove('completed');
      }
    });

    currentStep = stepIndex;
    window.bookingCurrentStep = stepIndex;
    if (window.updatePremiumSessionHUD) {
      window.updatePremiumSessionHUD();
    }

    // Load step-specific contents
    if (currentStep === 0) {
      // Branch Step
    } else if (currentStep === 1) {
      // Zone Step
      Tracker.trackBookingStart(activeBooking.branch);
    } else if (currentStep === 2) {
      // Station Map Step
      renderStationOptions();
    } else if (currentStep === 3) {
      // Time & Duration
    } else if (currentStep === 4) {
      // Café Food upgrades step
      renderWizardFoodOptions();
    } else if (currentStep === 5) {
      // Summary & Checkout
      renderBookingSummary();
    } else if (currentStep === 6) {
      // Success Confirmation Ticket
      renderSuccessTicket();
    }
  }

  // Expose wizard step switcher globally for interactive dot triggers
  window.bookingWizardShowStep = showStep;

  // Next Button click handler
  nextBtn.addEventListener('click', () => {
    if (currentStep === 0) {
      // Branch checked
      const selectedBranch = document.querySelector('input[name="w-branch"]:checked');
      if (selectedBranch) {
        activeBooking.branch = selectedBranch.value;
      }
      showStep(1);
    } else if (currentStep === 1) {
      // Zone checked
      const selectedZone = document.querySelector('input[name="w-zone"]:checked');
      if (selectedZone) {
        activeBooking.zone = selectedZone.value;
      }
      Tracker.trackZoneSelected(activeBooking.zone, ZONES[activeBooking.zone.toUpperCase()].name);
      showStep(2);
    } else if (currentStep === 2) {
      // Station checked
      if (!activeBooking.station) {
        alert("Please select a station on the map or list before continuing.");
        return;
      }
      showStep(3);
    } else if (currentStep === 3) {
      // Time slots checked
      const checkedSlots = document.querySelectorAll('input[name="w-slot"]:checked');
      if (checkedSlots.length === 0) {
        alert("Please select at least one time slot.");
        return;
      }
      activeBooking.slots = Array.from(checkedSlots).map(c => c.value);
      
      const durationInput = document.getElementById('w-duration');
      if (durationInput) activeBooking.duration = parseInt(durationInput.value);
      
      const playersInput = document.getElementById('w-players');
      if (playersInput) activeBooking.players = parseInt(playersInput.value);

      showStep(4);
    } else if (currentStep === 4) {
      // Go to summary
      showStep(5);
    } else if (currentStep === 5) {
      // Complete mock payment
      showStep(6);
    }
  });

  // Prev Button click handler
  prevBtn.addEventListener('click', () => {
    if (currentStep > 0) {
      showStep(currentStep - 1);
    }
  });

  // Event handler for selecting branch radios
  document.querySelectorAll('input[name="w-branch"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeBooking.branch = e.target.value;
      activeBooking.station = null; // Reset station when branch changes
    });
  });

  // Event handler for selecting zone buttons
  document.querySelectorAll('input[name="w-zone"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      activeBooking.zone = e.target.value;
      activeBooking.station = null; // Reset station when zone changes
    });
  });

  // Initial step setup
  showStep(0);
}

/**
 * 2. Render Station options & maps dynamically
 */
function renderStationOptions() {
  const listContainer = document.getElementById('wizardStationList');
  if (!listContainer) return;

  // Filter stations based on branch and zone
  const filtered = STATIONS_DATA.filter(s => s.branch === activeBooking.branch && s.zone === activeBooking.zone);

  listContainer.innerHTML = '';
  
  filtered.forEach(station => {
    const isBusy = station.status === 'busy';
    const isSelected = activeBooking.station && activeBooking.station.id === station.id;

    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `station ${isSelected ? 'active' : ''} ${isBusy ? 'busy' : ''}`;
    btn.disabled = isBusy;
    btn.innerHTML = `
      <b>${station.name}</b>
      <small>${station.gpu} · ${station.monitor}</small>
      <em>● ${isBusy ? 'Busy' : 'Available · ₹' + station.price + '/hr'}</em>
    `;

    if (!isBusy) {
      btn.addEventListener('click', () => {
        selectStation(station);
      });
    }

    listContainer.appendChild(btn);
  });

  // Align station dots on the live SVG floor map
  highlightMapDots();
}

/**
 * Handles station selection from list or map dots
 */
function selectStation(station) {
  activeBooking.station = station;
  Tracker.trackStationSelected(station.id, station.name, station.price);

  // Sync class on station list buttons
  document.querySelectorAll('#wizardStationList .station').forEach(btn => {
    const btnName = btn.querySelector('b').textContent;
    btn.classList.toggle('active', btnName === station.name);
  });

  // Update map dot highlight
  document.querySelectorAll('.station-dot').forEach(dot => {
    const dotId = parseInt(dot.dataset.id);
    dot.classList.toggle('selected', dotId === station.id);
  });

  // Update detail panel inside step 3/2
  const detailPanel = document.getElementById('selectedStationDetail');
  if (detailPanel) {
    detailPanel.innerHTML = `
      <div class="status-row" style="border: 0; padding: 10px 0;">
        <div class="status-name">
          <b>${station.name} (${ZONES[station.zone.toUpperCase()].name})</b>
          <small>${station.gpu} · ${station.monitor}</small>
        </div>
        <div class="status-right" style="text-align: right;">
          <b>₹${station.price}/hr</b>
          <small>Current Game: ${station.game}</small>
        </div>
      </div>
    `;
  }
  if (window.updatePremiumSessionHUD) {
    window.updatePremiumSessionHUD();
  }
}

/**
 * Synchronize map dot displays based on current selected branch and zone
 */
function highlightMapDots() {
  const mapElement = document.querySelector('.floor-plan');
  if (!mapElement) return;

  // Remove existing dots
  document.querySelectorAll('.station-dot').forEach(dot => dot.remove());

  // Filter stations for active branch
  const branchStations = STATIONS_DATA.filter(s => s.branch === activeBooking.branch);

  // Map coordinates grid mockups
  const coords = {
    pc: [
      { left: '20%', top: '35%' },
      { left: '28%', top: '35%' },
      { left: '16%', top: '48%' },
      { left: '25%', top: '48%' }
    ],
    console: [
      { left: '55%', top: '25%' },
      { left: '68%', top: '25%' },
      { left: '61%', top: '38%' }
    ],
    vip: [
      { left: '52%', top: '65%' },
      { left: '65%', top: '70%' }
    ],
    racing: [
      { left: '18%', top: '75%' },
      { left: '24%', top: '75%' }
    ]
  };

  const indexCounters = { pc: 0, console: 0, vip: 0, racing: 0 };

  branchStations.forEach(station => {
    const zoneType = station.zone;
    const coordList = coords[zoneType];
    const index = indexCounters[zoneType]++;
    
    if (coordList && coordList[index]) {
      const dot = document.createElement('i');
      dot.className = `station-dot ${station.status === 'busy' ? 'busy' : ''}`;
      dot.dataset.id = station.id;
      
      // Select color matching zone
      let dotColor = '#efbd4e'; // PC
      if (zoneType === 'console') dotColor = '#ffbb54';
      if (zoneType === 'vip') dotColor = '#b07758';
      if (zoneType === 'racing') dotColor = '#00db78';

      dot.style.setProperty('--dot', dotColor);
      dot.style.left = coordList[index].left;
      dot.style.top = coordList[index].top;

      // Setup dynamic hover tooltip
      let tooltip = document.getElementById('mapTooltipBox');
      if (!tooltip) {
        tooltip = document.createElement('div');
        tooltip.id = 'mapTooltipBox';
        tooltip.className = 'map-tooltip';
        mapElement.appendChild(tooltip);
      }

      dot.addEventListener('mouseenter', () => {
        tooltip.innerHTML = `
          <b>${station.name}</b>
          ${station.gpu} · ${station.monitor}<br>
          Rate: ₹${station.price}/hr<br>
          <span style="color: ${station.status === 'busy' ? '#ff4f70' : '#00db78'}">
            ● ${station.status === 'busy' ? 'Busy (Playing: ' + station.game + ')' : 'Available'}
          </span>
        `;
        tooltip.style.display = 'block';
        tooltip.style.left = station.status === 'busy' ? coordList[index].left : coordList[index].left;
        tooltip.style.top = coordList[index].top;
      });

      dot.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });

      if (station.status !== 'busy') {
        dot.addEventListener('click', () => {
          selectStation(station);
          
          // Scroll to booking form and jump to Step 4 (index 3)
          document.getElementById('book').scrollIntoView({ behavior: 'smooth' });
          if (window.bookingWizardShowStep) {
            window.bookingWizardShowStep(3); // Jump to slot selections
          }
        });
      }

      mapElement.appendChild(dot);
    }
  });
}

/**
 * 3. Render booking checkout details & summary pricing
 */
function renderBookingSummary() {
  const summaryDiv = document.getElementById('bookingSummaryCost');
  if (!summaryDiv) return;

  const station = activeBooking.station;
  if (!station) return;

  // Calculte costs
  const hrs = activeBooking.duration;
  const players = activeBooking.players;
  
  let gamingFee = station.price * hrs * players;
  let foodFee = 0;

  // Add food/combos costs
  let foodDetailsHTML = '';
  activeBooking.addedFood.forEach(item => {
    foodFee += item.price;
    foodDetailsHTML += `
      <div class="calc-row">
        <span>🥗 Add-on: ${item.name}</span>
        <b>₹${item.price}</b>
      </div>
    `;
  });

  if (activeBooking.bundle) {
    foodFee += activeBooking.bundle.price;
    foodDetailsHTML += `
      <div class="calc-row">
        <span>🎁 Bundle: ${activeBooking.bundle.name}</span>
        <b>₹${activeBooking.bundle.price}</b>
      </div>
    `;
  }

  const baseTotal = gamingFee + foodFee;
  const gst = Math.round(baseTotal * 0.18); // 18% GST
  const grandTotal = baseTotal + gst;

  summaryDiv.innerHTML = `
    <div class="calc-summary" style="border: 0; padding: 0;">
      <div class="calc-row">
        <span>🎮 Gaming Session (${station.name} x ${hrs} hrs x ${players} players)</span>
        <b>₹${gamingFee}</b>
      </div>
      ${foodDetailsHTML}
      <div class="calc-row">
        <span>💼 CGST & SGST (18%)</span>
        <b>₹${gst}</b>
      </div>
      <div class="calc-row total">
        <span>Grand Total</span>
        <b>₹${grandTotal}</b>
      </div>
    </div>
  `;
}

/**
 * 4. Success Card Rendering with offline QR Code canvas
 */
function renderSuccessTicket() {
  const successDiv = document.getElementById('bookingSuccessTicket');
  if (!successDiv) return;

  const station = activeBooking.station;
  const branchName = activeBooking.branch === 'pune' ? 'Pune (Viman Nagar)' : 'Coimbatore (RS Puram)';
  const slotsList = activeBooking.slots.join(', ');
  const bookingId = `BMR-${Math.floor(100000 + Math.random() * 900000)}`;

  successDiv.innerHTML = `
  successDiv.innerHTML = `
    <div class="confirmation-card glass-card" style="padding: 28px; text-align: center; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px;">
      <span style="font-family: var(--mono); color: var(--lime); font-weight: 700; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase;">✔ Mission Locked</span>
      <h4 class="ticket-title" style="font-size: 26px; font-family: var(--display); letter-spacing: -0.06em; margin: 10px 0 20px; color: #fff;">${station ? station.name : 'Rig'} Active</h4>
      
      <div class="ticket-details" style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; text-align: left; border-top: 1px solid var(--line); border-bottom: 1px solid var(--line); padding: 20px 0; margin-bottom: 24px;">
        <div class="ticket-field">Booking ID<b>${bookingId}</b></div>
        <div class="ticket-field">Branch<b>${branchName}</b></div>
        <div class="ticket-field">Rig Station<b>${station ? station.name : 'N/A'}</b></div>
        <div class="ticket-field">Time Slot<b>${slotsList}</b></div>
        <div class="ticket-field">Duration<b>${activeBooking.duration} Hours</b></div>
        <div class="ticket-field">Gamers<b>${activeBooking.players} Player(s)</b></div>
        <div class="ticket-field" style="grid-column: span 2;">Power-Up Add-ons<b>${activeBooking.addedFood.map(f => f.name).join(', ') || 'None'}</b></div>
      </div>

      <!-- Canvas for dynamic offline QR Code drawing -->
      <div style="background: #fff; width: 130px; height: 130px; margin: 0 auto 24px; padding: 10px; border-radius: 8px; display: flex; align-items: center; justify-content: center;">
        <canvas id="qrCodeCanvas" width="110" height="110"></canvas>
      </div>

      <div class="ticket-actions" style="display: flex; flex-direction: column; gap: 8px;">
        <div style="display: flex; gap: 8px; width: 100%;">
          <button type="button" class="button" onclick="downloadMockTicket('${bookingId}')" style="flex: 1; font-size: 10px; padding: 12px 10px;">💾 Download Ticket</button>
          <button type="button" class="button secondary" onclick="alert('Syncing: Reservation added to your Calendar!')" style="flex: 1; font-size: 10px; padding: 12px 10px; border-color: rgba(255,255,255,0.2);">📅 Add to Calendar</button>
        </div>
        <div style="display: flex; gap: 8px; width: 100%;">
          <a href="https://maps.google.com" target="_blank" class="button secondary" style="flex: 1; font-size: 10px; padding: 12px 10px; border-color: rgba(255,255,255,0.2); text-decoration: none; display: inline-flex; align-items: center; justify-content: center; text-transform: uppercase;">🗺 Directions</a>
          <button type="button" class="button secondary" onclick="window.shareBooking && window.shareBooking('${bookingId}')" style="flex: 1; font-size: 10px; padding: 12px 10px; border-color: rgba(255,255,255,0.2);">🔗 Share Booking</button>
        </div>
        <button type="button" class="button secondary" onclick="window.bookingWizardShowStep(0)" style="width: 100%; font-size: 10px; padding: 10px; border-color: rgba(255,255,255,0.1); margin-top: 4px;">🔄 Book Another Session</button>
      </div>
    </div>
  `;

  // Draw dynamic QR code immediately on success render
  setTimeout(() => {
    drawOfflineQRCode('qrCodeCanvas', bookingId);
  }, 100);

  // Play success sound
  if (window.AudioContextEmitter) {
    window.AudioContextEmitter.playSuccessChord();
  }

  // Clear states after complete mock checkout
  Tracker.trackBookingCompleted({
    bookingId: bookingId,
    branch: activeBooking.branch,
    station: station ? station.name : 'N/A',
    hours: activeBooking.duration,
    players: activeBooking.players
  });
}

/**
 * Draws a mock QR code pattern to a canvas
 */
function drawOfflineQRCode(canvasId, text) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#000';
  // Top-left finder pattern
  ctx.fillRect(5, 5, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(10, 10, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillRect(15, 15, 10, 10);

  // Top-right finder pattern
  ctx.fillRect(75, 5, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(80, 10, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillRect(85, 15, 10, 10);

  // Bottom-left finder pattern
  ctx.fillRect(5, 75, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(10, 80, 20, 20);
  ctx.fillStyle = '#000';
  ctx.fillRect(15, 85, 10, 10);

  // Random pixel blocks for inner data
  ctx.fillStyle = '#000';
  for (let x = 40; x < 70; x += 6) {
    for (let y = 5; y < 105; y += 6) {
      if (Math.random() > 0.45) {
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }
  for (let x = 5; x < 40; x += 6) {
    for (let y = 40; y < 70; y += 6) {
      if (Math.random() > 0.45) {
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }
  for (let x = 70; x < 105; x += 6) {
    for (let y = 40; y < 105; y += 6) {
      if (Math.random() > 0.45) {
        ctx.fillRect(x, y, 4, 4);
      }
    }
  }
}

/**
 * Downloads mock ticket drawing coordinates to high resolution PNG file
 */
window.downloadMockTicket = function(bookingId) {
  const canvas = document.createElement('canvas');
  canvas.width = 400;
  canvas.height = 560;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = '#101115';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Outer border lines
  ctx.strokeStyle = '#efbd4e';
  ctx.lineWidth = 3;
  ctx.strokeRect(12, 12, canvas.width - 24, canvas.height - 24);

  // Title
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("BOOMER'S GAMING CAFÉ", canvas.width / 2, 50);

  ctx.fillStyle = '#efbd4e';
  ctx.font = 'bold 13px Space Grotesk, sans-serif';
  ctx.fillText("RESERVATION CONFIRMED", canvas.width / 2, 75);

  // Dash lines
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 6]);
  ctx.beginPath();
  ctx.moveTo(30, 95);
  ctx.lineTo(canvas.width - 30, 95);
  ctx.stroke();
  ctx.setLineDash([]);

  // Details
  ctx.fillStyle = '#898d8b';
  ctx.font = '11px DM Mono, monospace';
  ctx.textAlign = 'left';

  const details = [
    { label: "BOOKING ID", val: bookingId },
    { label: "BRANCH", val: activeBooking.branch === 'pune' ? "PUNE (VIMAN NAGAR)" : "COIMBATORE (RS PURAM)" },
    { label: "STATION", val: activeBooking.station ? activeBooking.station.name : "N/A" },
    { label: "TIME SLOT", val: activeBooking.slots.join(', ') },
    { label: "DURATION", val: `${activeBooking.duration} Hours` },
    { label: "PLAYERS", val: `${activeBooking.players} Gamer(s)` },
    { label: "FOOD ADD-ONS", val: activeBooking.addedFood.map(f => f.name).join(', ') || 'None' }
  ];

  let y = 135;
  details.forEach(item => {
    ctx.fillStyle = '#898d8b';
    ctx.fillText(item.label, 40, y);
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 12px Space Grotesk, sans-serif';
    ctx.fillText(item.val, 160, y);
    ctx.font = '11px DM Mono, monospace';
    y += 32;
  });

  // QR block
  ctx.fillStyle = '#fff';
  ctx.fillRect(140, 365, 120, 120);
  
  // Finder blocks
  ctx.fillStyle = '#000';
  ctx.fillRect(145, 370, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(151, 376, 18, 18);
  ctx.fillStyle = '#000';
  ctx.fillRect(155, 380, 10, 10);

  ctx.fillRect(225, 370, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(231, 376, 18, 18);
  ctx.fillStyle = '#000';
  ctx.fillRect(235, 380, 10, 10);

  ctx.fillRect(145, 450, 30, 30);
  ctx.fillStyle = '#fff';
  ctx.fillRect(151, 456, 18, 18);
  ctx.fillStyle = '#000';
  ctx.fillRect(155, 460, 10, 10);

  // QR Noise
  ctx.fillStyle = '#000';
  for (let px = 180; px < 220; px += 6) {
    for (let py = 370; py < 480; py += 6) {
      if (Math.random() > 0.4) ctx.fillRect(px, py, 4, 4);
    }
  }
  for (let px = 145; px < 180; px += 6) {
    for (let py = 410; py < 440; py += 6) {
      if (Math.random() > 0.4) ctx.fillRect(px, py, 4, 4);
    }
  }
  for (let px = 220; px < 255; px += 6) {
    for (let py = 410; py < 480; py += 6) {
      if (Math.random() > 0.4) ctx.fillRect(px, py, 4, 4);
    }
  }

  // Footer notes
  ctx.fillStyle = '#898d8b';
  ctx.font = '9px Space Grotesk, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("Show this ticket at reception to start gaming.", canvas.width / 2, 510);
  ctx.fillStyle = '#efbd4e';
  ctx.fillText("EAT · PLAY · REPEAT", canvas.width / 2, 530);

  const link = document.createElement('a');
  link.download = `boomers-ticket-${bookingId}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();

  Tracker.track('Ticket Downloaded', { bookingId });
};

/**
 * 5. Cost Calculator Widget inside Section
 */
function initCostCalculator() {
  const calcBranch = document.getElementById('calc-branch');
  const calcGame = document.getElementById('calc-game');
  const calcHours = document.getElementById('calc-hours');
  const calcPlayers = document.getElementById('calc-players');

  if (!calcBranch) return;

  function recalculateWidgetCosts() {
    const branch = calcBranch.value;
    const game = calcGame.value;
    const hours = parseInt(calcHours.value) || 1;
    const players = parseInt(calcPlayers.value) || 1;

    // Find average station price for this branch/game
    let hourlyRate = branch === 'pune' ? 120 : 100;
    
    // Console game is slightly more expensive
    if (game === 'EA FC 25' || game === 'Tekken 8') {
      hourlyRate = branch === 'pune' ? 150 : 120;
    }

    const gamingTotal = hourlyRate * hours * players;
    
    // Mock bundle addition inside calculator for simulation
    let foodFee = 0;
    if (hours >= 2 && players >= 2) {
      foodFee = 399; // Apply Duo Combo
    } else if (hours >= 2) {
      foodFee = 120; // Apply standard burger add-on
    }

    const subTotal = gamingTotal + foodFee;
    const gst = Math.round(subTotal * 0.18);
    const grandTotal = subTotal + gst;

    document.getElementById('calc-disp-gaming').textContent = `₹${gamingTotal}`;
    document.getElementById('calc-disp-food').textContent = `₹${foodFee}`;
    document.getElementById('calc-disp-gst').textContent = `₹${gst}`;
    document.getElementById('calc-disp-total').textContent = `₹${grandTotal}`;
  }

  // Bind change listeners to calculator elements
  [calcBranch, calcGame, calcHours, calcPlayers].forEach(el => {
    el.addEventListener('change', recalculateWidgetCosts);
    el.addEventListener('input', recalculateWidgetCosts);
  });

  recalculateWidgetCosts();
}

/**
 * 6. Live Availability Dashboard Widget Updater
 */
function initLiveAvailabilityWidget() {
  const capacityDashboard = document.getElementById('liveAvailabilityDashboard');
  if (!capacityDashboard) return;

  function updateDashboardNumbers() {
    // Generate simulated dynamic counts
    const pcAvail = Math.floor(Math.random() * 8) + 8; // 8-15 available
    const psAvail = Math.floor(Math.random() * 4) + 1; // 1-5 available
    const vrState = Math.random() > 0.6 ? 'Full' : '1 Available';
    const raceAvail = Math.floor(Math.random() * 3); // 0-2 available

    const pcOccupied = 30 - pcAvail;
    const psOccupied = 12 - psAvail;
    const raceOccupied = 4 - raceAvail;
    const vrAvail = vrState === 'Full' ? 0 : (Math.random() > 0.5 ? 1 : 2);
    const vrOccupied = 6 - vrAvail;

    capacityDashboard.innerHTML = `
      <div class="live-card pc-arena-card" onclick="document.getElementById('book').scrollIntoView({behavior: 'smooth'})">
        <div class="live-card-glow"></div>
        <div class="live-card-header">
          <span class="live-card-category"><span class="pulse-dot cyan"></span>PC Arena</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="live-card-hero">
          <span class="hero-num cyan-text">${pcAvail}</span>
          <span class="hero-lbl">AVAILABLE STATIONS</span>
        </div>
        <div class="live-card-footer">
          <span class="footer-stat">${pcOccupied}/30 Occupied</span>
          <span class="hardware-preview">RTX 4070 · 240Hz</span>
        </div>
      </div>
      
      <div class="live-card ps5-lounge-card" onclick="document.getElementById('book').scrollIntoView({behavior: 'smooth'})">
        <div class="live-card-glow"></div>
        <div class="live-card-header">
          <span class="live-card-category"><span class="pulse-dot purple"></span>PS5 Lounge</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="live-card-hero">
          <span class="hero-num purple-text">${psAvail}</span>
          <span class="hero-lbl">AVAILABLE STATIONS</span>
        </div>
        <div class="live-card-footer">
          <span class="footer-stat">${psOccupied}/12 Occupied</span>
          <span class="hardware-preview">PS5 Slim · 4K HDR</span>
        </div>
      </div>

      <div class="live-card sim-racing-card" onclick="document.getElementById('book').scrollIntoView({behavior: 'smooth'})">
        <div class="live-card-glow"></div>
        <div class="live-card-header">
          <span class="live-card-category"><span class="pulse-dot gold"></span>Sim Racing</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="live-card-hero">
          <span class="hero-num gold-text">${raceAvail}</span>
          <span class="hero-lbl">AVAILABLE STATIONS</span>
        </div>
        <div class="live-card-footer">
          <span class="footer-stat">${raceOccupied}/4 Occupied</span>
          <span class="hardware-preview">Fanatec DD · Cockpit</span>
        </div>
      </div>

      <div class="live-card vr-lounge-card ${vrAvail === 0 ? 'dimmed' : ''}" onclick="document.getElementById('book').scrollIntoView({behavior: 'smooth'})">
        <div class="live-card-glow"></div>
        <div class="live-card-header">
          <span class="live-card-category"><span class="pulse-dot red"></span>VR Lounge</span>
          <svg class="chevron" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18l6-6-6-6"/></svg>
        </div>
        <div class="live-card-hero">
          <span class="hero-num red-text">${vrAvail === 0 ? 'WAIT' : vrAvail}</span>
          <span class="hero-lbl">${vrAvail === 0 ? 'WAITING LIST ACTIVE' : 'AVAILABLE STATIONS'}</span>
        </div>
        <div class="live-card-footer">
          <span class="footer-stat">${vrOccupied}/6 Occupied</span>
          <span class="hardware-preview">Quest 3 · Pro Arena</span>
        </div>
      </div>
    `;

    Tracker.track('Live Dashboard Refreshed');
  }

  updateDashboardNumbers();
  
  // Randomly refresh every 15 seconds
  setInterval(updateDashboardNumbers, 15000);
}

window.addFoodToBooking = function(foodName, price) {
  activeBooking.addedFood.push({ name: foodName, price: price });
  Tracker.trackBundleAdded('food', foodName, price);
  if (window.showBgcNotification) {
    window.showBgcNotification(`✔ Added to Session`, `<strong>${foodName}</strong> added to your booking loadout!`);
  }
  if (window.updatePremiumSessionHUD) {
    window.updatePremiumSessionHUD();
  }
  renderBookingSummary();
};

window.addBundleToBooking = function(bundleId) {
  const bundle = FOOD_GAMING_BUNDLES.find(b => b.id === bundleId);
  if (bundle) {
    activeBooking.bundle = bundle;
    Tracker.trackBundleAdded(bundle.id, bundle.name, bundle.price);
    
    // Extract bundle items and display them in the HUD list
    activeBooking.addedFood = activeBooking.addedFood.filter(f => !f.fromBundle);
    if (bundleId === 'bundle-1') {
      activeBooking.addedFood.push({ name: 'RTX Burger', price: 0, fromBundle: true });
      activeBooking.addedFood.push({ name: 'Soft Drink', price: 0, fromBundle: true });
    } else if (bundleId === 'bundle-2') {
      activeBooking.addedFood.push({ name: 'Loaded Nachos', price: 0, fromBundle: true });
      activeBooking.addedFood.push({ name: 'Soft Drink', price: 0, fromBundle: true });
      activeBooking.addedFood.push({ name: 'Soft Drink', price: 0, fromBundle: true });
    } else if (bundleId === 'bundle-3') {
      activeBooking.addedFood.push({ name: 'Spicy Wrap', price: 0, fromBundle: true });
      activeBooking.addedFood.push({ name: 'Red Bull', price: 0, fromBundle: true });
    }

    if (window.showBgcNotification) {
      window.showBgcNotification(`✔ Added to Session`, `<strong>${bundle.name}</strong> added to your reservation!`);
    }
    
    if (window.updatePremiumSessionHUD) {
      window.updatePremiumSessionHUD();
    }
    
    renderBookingSummary();
  }
};

// 7. Visual Branch Specs Switcher
window.switchBranchSpec = function(branchId, btnElement) {
  // Update button active classes
  document.querySelectorAll('.branch-button').forEach(btn => btn.classList.remove('active'));
  if (btnElement) {
    btnElement.classList.add('active');
  } else {
    // Find button by text content
    const buttons = document.querySelectorAll('.branch-button');
    buttons.forEach(btn => {
      if (btn.querySelector('b').textContent.toLowerCase().includes(branchId)) {
        btn.classList.add('active');
      }
    });
  }

  // Highlight the corresponding column in specs table
  const table = document.querySelector('.comparison-table');
  if (table) {
    const colIndex = branchId === 'pune' ? 1 : 2;
    table.querySelectorAll('tr').forEach(row => {
      row.querySelectorAll('td, th').forEach((cell, idx) => {
        cell.style.background = idx === colIndex ? 'rgba(239, 189, 78, 0.05)' : '';
        cell.style.borderColor = idx === colIndex ? 'var(--lime)' : '';
      });
    });
  }
  
  Tracker.track('Branch Specs Viewed', { branch: branchId });
};

// 8. Power-Up Station Cafe Category Switcher
window.switchCafeTab = function(category, btnElement) {
  // Update category tab button active state
  document.querySelectorAll('.cafe-tab-btn').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const container = document.getElementById('cafeItemsContainer');
  if (!container) return;

  const items = POWER_UP_MENU[category] || [];
  container.innerHTML = '';

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'badge-card';
    card.style.textAlign = 'left';
    card.style.padding = '0';
    card.style.overflow = 'hidden';
    card.style.display = 'flex';
    card.style.flexDirection = 'column';
    
    // Check if spicy exists to render icons
    const spicyHTML = item.spicy ? `<span>${item.spicy}</span>` : '';
    const caloriesHTML = item.calories ? `<span>🔥 ${item.calories}</span>` : '';
    const popularityHTML = item.popularity ? `<span style="position: absolute; top: 10px; left: 10px; font: 700 8px var(--mono); background: var(--lime); color: #000; padding: 3px 6px; border-radius: 4px; text-transform: uppercase; z-index: 2;">${item.popularity}</span>` : '';
    const prepHTML = item.prep ? `<span style="position: absolute; top: 10px; right: 10px; font: 700 8px var(--mono); background: rgba(0,0,0,0.6); color: #fff; padding: 3px 6px; border-radius: 4px; z-index: 2;">⏱️ ${item.prep}</span>` : '';

    card.innerHTML = `
      <div style="height: 120px; background: url('${item.image}') center/cover; position: relative; border-bottom: 1px solid var(--line);">
        ${popularityHTML}
        ${prepHTML}
      </div>
      <div style="padding: 16px; flex-grow: 1; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <h4 style="font: 700 16px var(--display); margin: 0 0 6px; color: #fff;">${item.name}</h4>
          <p style="font-size: 11px; color: var(--muted); margin: 0 0 12px; line-height: 1.4; min-height: 38px;">${item.desc}</p>
        </div>
        <div style="display: flex; gap: 10px; font: 500 9px var(--mono); color: var(--muted); margin-bottom: 15px;">
          ${caloriesHTML}
          ${spicyHTML}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 12px;">
          <span style="font: 700 18px var(--display); color: var(--lime);">₹${item.price}</span>
          <button class="cafe-add-btn" onclick="addFoodToBooking('${item.name}', ${item.price})">+ Add Item</button>
        </div>
      </div>
    `;
    container.appendChild(card);
  });

  Tracker.track('Cafe Menu Tab Switched', { category });
};

// 9. Wizard Food List Option Renderer
function renderWizardFoodOptions() {
  const container = document.getElementById('wizardFoodList');
  if (!container) return;

  container.innerHTML = '';
  
  // Flatten POWER_UP_MENU to show top items from all 12 categories
  const items = [];
  Object.keys(POWER_UP_MENU).forEach(cat => {
    if (POWER_UP_MENU[cat][0]) items.push(POWER_UP_MENU[cat][0]);
    if (POWER_UP_MENU[cat][1]) items.push(POWER_UP_MENU[cat][1]);
  });

  items.forEach(item => {
    const isAdded = activeBooking.addedFood.some(f => f.name === item.name);
    const card = document.createElement('div');
    card.className = 'booking-choice-btn';
    card.style.padding = '12px';
    card.style.marginBottom = '8px';
    card.style.background = isAdded ? 'rgba(239, 189, 78, 0.08)' : '#22242a';
    card.style.borderColor = isAdded ? 'var(--lime)' : 'var(--line)';
    card.style.borderRadius = '12px';
    card.style.display = 'flex';
    card.style.justifyContent = 'space-between';
    card.style.alignItems = 'center';
    
    card.innerHTML = `
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:14px; background: rgba(0,0,0,0.2); padding: 4px 6px; border-radius: 4px;">
          ${item.isVeg ? '🟢 Veg' : '🔴 Non-Veg'}
        </span>
        <div>
          <b style="font-size:12px; color:#fff; display:block;">${item.name}</b>
          <small style="font-size:9px; color:var(--muted);">${item.calories} · Prep: ${item.prep} · ★${item.rating}</small>
        </div>
      </div>
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-family:var(--display); font-weight:700; color:var(--lime); font-size:13px;">₹${item.price}</span>
        <button type="button" class="cafe-add-btn" style="padding:6px 10px; font-size:9px; border-radius: 4px;" onclick="toggleFoodInWizard('${item.name}', ${item.price}, this)">
          ${isAdded ? 'Remove' : '+ Add'}
        </button>
      </div>
    `;
    container.appendChild(card);
  });
}

window.toggleFoodInWizard = function(name, price, btn) {
  const idx = activeBooking.addedFood.findIndex(f => f.name === name);
  const cardElement = btn.parentElement.parentElement;
  if (idx > -1) {
    activeBooking.addedFood.splice(idx, 1);
    btn.textContent = '+ Add';
    cardElement.style.background = '#22242a';
    cardElement.style.borderColor = 'var(--line)';
  } else {
    activeBooking.addedFood.push({ name, price });
    btn.textContent = 'Remove';
    cardElement.style.background = 'rgba(239, 189, 78, 0.08)';
    cardElement.style.borderColor = 'var(--lime)';
  }
  
  // Track selection
  Tracker.track('Wizard Food Toggled', { name, price });
  if (window.updatePremiumSessionHUD) {
    window.updatePremiumSessionHUD();
  }
};

// Initial calls on load
document.addEventListener('DOMContentLoaded', () => {
  // Load default cafe tab (XP Starters)
  switchCafeTab('xp-starters');
  
  // Highlight default spec column (Coimbatore is column 2, Pune is column 1)
  switchBranchSpec('pune');

  // Initialize compact booking card controls
  initCompactBookingCard();
});

/**
 * 7. Compact Booking Card Controller & Flow Transition
 */
function initCompactBookingCard() {
  const branchSelect = document.getElementById('compact-branch');
  const zoneSelect = document.getElementById('compact-zone');
  
  if (!branchSelect || !zoneSelect) return;

  function updateCompactCardDetails() {
    const branch = branchSelect.value;
    const zone = zoneSelect.value;

    // 1. Calculate live availability
    let availCount = 0;
    if (window.STATIONS_DATA) {
      const filtered = STATIONS_DATA.filter(s => s.branch === branch && s.zone === zone);
      availCount = filtered.filter(s => s.status === 'available').length;
    }
    
    const availText = document.getElementById('compact-avail-text');
    if (availText) {
      if (availCount > 0) {
        availText.innerHTML = `🟢 ${availCount} Available Station${availCount > 1 ? 's' : ''}`;
      } else {
        availText.innerHTML = `🔴 Zone Full`;
      }
    }

    // 2. Set starting price dynamically
    let priceVal = 100;
    if (zone === 'pc') priceVal = branch === 'pune' ? 120 : 100;
    else if (zone === 'console') priceVal = branch === 'pune' ? 150 : 120;
    else if (zone === 'vip') priceVal = branch === 'pune' ? 300 : 250;
    else if (zone === 'racing') priceVal = branch === 'pune' ? 200 : 150;
    else if (zone === 'vr') priceVal = 200;

    const priceText = document.getElementById('compact-price-text');
    if (priceText) {
      if (zone === 'vr' && branch === 'coimbatore') {
        priceText.textContent = 'Pune Only';
        if (availText) availText.innerHTML = `🔴 Not Available`;
      } else {
        priceText.textContent = `From ₹${priceVal}/hr`;
      }
    }
  }

  branchSelect.addEventListener('change', updateCompactCardDetails);
  zoneSelect.addEventListener('change', updateCompactCardDetails);

  // Run once to initialize
  updateCompactCardDetails();
}

window.startFullBookingFlow = function() {
  const branchSelect = document.getElementById('compact-branch');
  const zoneSelect = document.getElementById('compact-zone');
  if (!branchSelect || !zoneSelect) return;

  const selectedBranch = branchSelect.value;
  const selectedZone = zoneSelect.value;

  // 1. Programmatically select radios in wizard form
  const branchRadio = document.querySelector(`input[name="w-branch"][value="${selectedBranch}"]`);
  const zoneRadio = document.querySelector(`input[name="w-zone"][value="${selectedZone}"]`);

  if (branchRadio) {
    branchRadio.checked = true;
    branchRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }
  if (zoneRadio) {
    zoneRadio.checked = true;
    zoneRadio.dispatchEvent(new Event('change', { bubbles: true }));
  }

  // 2. Toggle visible cards
  const compactCard = document.getElementById('compactBookingCard');
  const wizardForm = document.getElementById('bookingCardForm');
  if (compactCard) compactCard.style.display = 'none';
  if (wizardForm) wizardForm.style.display = 'block';

  // 3. Show Detailed Session HUD Sidebar
  const hud = document.getElementById('premiumSessionHUD');
  if (hud) {
    hud.classList.add('active');
    const mobileHUDBadge = document.getElementById('mobileHUDCountBadge');
    if (mobileHUDBadge) mobileHUDBadge.textContent = '0';
  }

  // 4. Jump directly to step 3 (Station selection)
  if (window.bookingWizardShowStep) {
    window.bookingWizardShowStep(2);
  }
  
  if (window.updatePremiumSessionHUD) {
    window.updatePremiumSessionHUD();
  }
};

/**
 * 8. Share Booking functionality with navigator.share and clipboard copy fallbacks
 */
window.shareBooking = function(bookingId) {
  if (navigator.share) {
    navigator.share({
      title: "My Boomer's Gaming Cafe Reservation",
      text: `Hey! I just locked my rig at Boomer's Gaming Cafe! Booking ID: ${bookingId}. Join my queue!`,
      url: window.location.href
    }).catch(() => {});
  } else {
    // Fallback: Copy link
    navigator.clipboard.writeText(`Boomer's Gaming Cafe Booking ID: ${bookingId}`).then(() => {
      if (window.showBgcNotification) {
        window.showBgcNotification("✔ Link Copied", "Booking ID copied to clipboard!");
      } else {
        alert("Booking ID copied to clipboard!");
      }
    });
  }
};
