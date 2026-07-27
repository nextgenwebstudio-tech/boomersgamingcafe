// Boomer's Gaming Cafe - Gallery Lightbox, Calendar Events, Reviews Slider & Stats Counters

let currentLightboxIndex = 0;
const galleryImages = [
  "assets/images/boomers_pc_lounge.jpg",
  "assets/images/boomers_cafe_food.jpg",
  "assets/images/boomers_racing_sim.jpg",
  "assets/images/boomers_vr_lounge.jpg"
];

document.addEventListener('DOMContentLoaded', () => {
  initReviewsSlider();
  initCalendarEvents();
  initLiveScheduleTimeline();
  initAnimatedCounters();
});

/**
 * 1. Venue Gallery Lightbox functions
 */
window.openLightbox = function(index) {
  const lightbox = document.getElementById('galleryLightbox');
  const img = document.getElementById('lightboxImg');
  if (!lightbox || !img) return;

  currentLightboxIndex = index;
  img.src = galleryImages[currentLightboxIndex];
  lightbox.classList.add('active');
  
  Tracker.trackGalleryOpened(index, galleryImages[index]);
  
  // Disable body scroll when lightbox is open
  document.body.style.overflow = 'hidden';
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  lightbox.classList.remove('active');
  document.body.style.overflow = '';
};

window.changeLightboxSlide = function(direction) {
  currentLightboxIndex += direction;
  
  // Wrap around index limits
  if (currentLightboxIndex >= galleryImages.length) {
    currentLightboxIndex = 0;
  } else if (currentLightboxIndex < 0) {
    currentLightboxIndex = galleryImages.length - 1;
  }

  const img = document.getElementById('lightboxImg');
  if (img) {
    img.src = galleryImages[currentLightboxIndex];
  }
};

// Close lightbox on clicking outside content area
document.getElementById('galleryLightbox')?.addEventListener('click', (e) => {
  if (e.target.id === 'galleryLightbox') {
    closeLightbox();
  }
});

/**
 * 2. Reviews / Testimonials Slider Logic
 */
function initReviewsSlider() {
  const track = document.getElementById('reviewsTrack');
  const nav = document.getElementById('reviewsNav');
  if (!track || !nav) return;

  track.innerHTML = '';
  nav.innerHTML = '';

  GOOGLE_REVIEWS.forEach((rev, idx) => {
    // Render review slide in Google Review style card
    const slide = document.createElement('div');
    slide.className = 'review-slide';
    
    // Select a unique letter avatar background color
    const colors = ['#efbd4e', '#ad8cff', '#00c8ff', '#ff4f70'];
    const avatarColor = colors[idx % colors.length];
    
    slide.innerHTML = `
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 15px;">
        <div style="width: 44px; height: 44px; border-radius: 50%; background: ${avatarColor}; color: #000; display: flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--display); font-size: 16px;">
          ${rev.author[0]}
        </div>
        <div>
          <div style="font-weight: 700; color: #fff; display: flex; align-items: center; gap: 6px; font-family: var(--display);">
            ${rev.author} 
            <span style="font-size: 8px; font-family: var(--mono); background: var(--lime); color: #000; padding: 2px 6px; border-radius: 99px; font-weight: bold; text-transform: uppercase; display: inline-flex; align-items: center; gap: 2px;">
              ✓ Verified Gamer
            </span>
          </div>
          <small style="color: var(--muted); font-size: 11px; font-family: var(--mono);">${rev.date}</small>
        </div>
      </div>
      <div style="color: #efbd4e; font-size: 14px; margin-bottom: 10px; letter-spacing: 2px;">★★★★★</div>
      <p style="margin: 0; font-style: italic; color: #d0d3d1; line-height: 1.6; font-size: 13px;">“${rev.text}”</p>
    `;
    track.appendChild(slide);

    // Render navigator dot
    const dot = document.createElement('span');
    dot.className = `review-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => {
      goToReviewSlide(idx);
    });
    nav.appendChild(dot);
  });

  let currentSlide = 0;
  function goToReviewSlide(slideIndex) {
    track.style.transform = `translate3d(-${slideIndex * 100}%, 0, 0)`;
    
    // Update dots
    document.querySelectorAll('.review-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === slideIndex);
    });
    
    currentSlide = slideIndex;
  }

  // Auto slide every 7 seconds
  setInterval(() => {
    let nextSlide = currentSlide + 1;
    if (nextSlide >= GOOGLE_REVIEWS.length) {
      nextSlide = 0;
    }
    goToReviewSlide(nextSlide);
  }, 7000);
}

/**
 * 3. Render Tournament Calendar Grid
 */
function initCalendarEvents() {
  const container = document.getElementById('tournamentsCalendarContainer');
  if (!container) return;

  container.innerHTML = '';

  CALENDAR_EVENTS.forEach(event => {
    const article = document.createElement('article');
    article.className = 'calendar-event';
    article.innerHTML = `
      <time>${event.day}</time>
      <small>${event.month} · ${event.branch}</small>
      <b>${event.title}</b>
      <small>${event.type} · ${event.status}</small>
      <a href="#book" onclick="registerTournamentClick('${event.title}', '${event.branch}')">Register →</a>
    `;
    container.appendChild(article);
  });
}

window.registerTournamentClick = function(title, branch) {
  Tracker.trackTournamentRegistered(title, branch);
  alert(`Opening registration flow for: ${title} in ${branch}!`);
};

/**
 * 4. Render Live Schedule Timeline
 */
function initLiveScheduleTimeline() {
  const container = document.getElementById('liveScheduleContainer');
  if (!container) return;

  container.innerHTML = '';

  LIVE_SCHEDULE.forEach(item => {
    const row = document.createElement('div');
    row.className = 'timeline-item';
    row.innerHTML = `
      <div class="timeline-time">${item.time}</div>
      <div class="timeline-event">
        <b>${item.event}</b>
        <p>${item.details}</p>
      </div>
    `;
    container.appendChild(row);
  });
}

/**
 * 5. Animated Statistics Counters
 */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.count-metric');
  if (!counters.length) return;

  if (window.gsap && window.ScrollTrigger) {
    counters.forEach(counter => {
      const targetVal = parseInt(counter.dataset.val);
      
      gsap.fromTo(counter, 
        { textContent: 0 },
        {
          textContent: targetVal,
          duration: 2.2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counter,
            start: 'top 90%',
            once: true
          },
          onUpdate: function() {
            // Add comma/plus formatting dynamically
            const currentVal = parseInt(counter.textContent);
            if (targetVal >= 1000) {
              counter.textContent = Math.floor(currentVal / 1000) + 'K+';
            } else if (targetVal === 2) {
              counter.textContent = currentVal;
            } else {
              counter.textContent = currentVal + '+';
            }
          }
        }
      );
    });
  } else {
    // Fallback simple timer counter if GSAP isn't loaded
    counters.forEach(counter => {
      const targetVal = parseInt(counter.dataset.val);
      let count = 0;
      const duration = 2000; // 2 seconds
      const steps = 40;
      const stepValue = targetVal / steps;
      const stepDuration = duration / steps;
      
      const interval = setInterval(() => {
        count += stepValue;
        if (count >= targetVal) {
          count = targetVal;
          clearInterval(interval);
        }
        
        let textVal = Math.floor(count);
        if (targetVal >= 1000) {
          textVal = Math.floor(textVal / 1000) + 'K+';
        } else if (targetVal === 2) {
          textVal = textVal;
        } else {
          textVal = textVal + '+';
        }
        counter.textContent = textVal;
      }, stepDuration);
    });
  }
}

/**
 * 6. Live Countdown Timer for Community Events
 */
function initLiveCountdownTimer() {
  const countdownBox = document.getElementById('communityLiveEvent');
  if (!countdownBox) return;

  // Set event starts in 1 hour, 42 minutes, 12 seconds from load
  let totalSeconds = 1 * 3600 + 42 * 60 + 12;

  function updateTimer() {
    if (totalSeconds <= 0) {
      countdownBox.innerHTML = `
        <span style="font-family: var(--mono); color: #ff4f70; font-weight: 700; text-transform: uppercase;">🔴 LIVE NOW</span><br>
        <b style="color:#fff; font-size: 16px;">Campus Clash: Valorant</b><br>
        <span style="color:var(--lime)">Tournament is currently active!</span>
      `;
      return;
    }

    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    const timeString = [
      hrs.toString().padStart(2, '0'),
      mins.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');

    countdownBox.innerHTML = `
      <span style="font-family: var(--mono); color: #ff4f70; font-weight: 700; text-transform: uppercase; display: flex; align-items: center; gap: 6px;">
        <span class="live" style="margin-left: 0; color: #ff4f70; display: inline-flex;"></span> LIVE STREAM
      </span>
      <b style="color:#fff; font-size: 16px; display: block; margin: 4px 0 6px;">Campus Clash: Valorant</b>
      <div style="font-size: 11px; color: var(--muted); margin-bottom: 8px;">127 Watching · 24 Teams</div>
      <div style="font-family: var(--mono); font-size: 14px; color: var(--lime);">Starts in: <strong style="color:#fff;">${timeString}</strong></div>
    `;

    totalSeconds--;
  }

  updateTimer();
  setInterval(updateTimer, 1000);
}

// Register timer on load
document.addEventListener('DOMContentLoaded', () => {
  initLiveCountdownTimer();
});
