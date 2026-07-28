// Boomer's Gaming Cafe - Main System Setup & Navigation Scripts

document.addEventListener('DOMContentLoaded', () => {
  // Initialize loading screen
  initLoadingScreen();

  // Initialize sticky navbar
  initStickyNavbar();

  // Initialize custom cursor glow
  initCustomCursor();

  // Initialize scroll spy navigation
  initScrollSpy();

  // Initialize desktop sticky booking bar
  initStickyBookingHeader();

  // Initialize floating availability sidebar widget
  initFloatingAvailabilityWidget();

  // Initialize mobile responsive menu
  initMobileMenu();

  // Initialize mobile responsive HUD toggle
  initMobileHUD();

  // Initialize context-aware bottom sticky CTA
  initContextAwareCTA();

  // Initialize scroll-visibility for mobile sticky booking bar
  initMobileBookBarScrollToggle();

  // Initialize lightweight hero mouse move parallax
  initHeroParallax();

  // Initialize background floating particles
  initHeroParticles();

  // Initialize trust badges count animations
  initTrustCounters();

  // Initialize Twitch live widget countdown clock
  initLiveCardCountdown();

  // Initialize magnetic buttons hover pull
  initMagneticButtons();

  // Initialize video performance observer
  initVideoPerformanceSpy();

  // Initialize click ripple effects on buttons
  initButtonRipples();

  // Initialize reveal animations (progressive fallback to IntersectionObserver if GSAP ScrollTrigger fails)
  initScrollReveals();
});

/**
 * 0. Branded Sticky Navbar Blur
 */
function initStickyNavbar() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });
  
  // Trigger on load in case page starts scrolled
  if (window.scrollY > 20) {
    nav.classList.add('scrolled');
  }
}

/**
 * 1. Branded Loading Screen
 * Fades out loading cover after animating progress bar to 100%
 */
function initLoadingScreen() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  // Fade out loader after 1.8 seconds of logo pulsing
  setTimeout(() => {
    loader.classList.add('loaded');
    Tracker.track('Loading Complete');
  }, 1800);
}

/**
 * 2. Subtle Custom Cursor Glow
 */
function initCustomCursor() {
  // Disable custom cursor on touch/mobile devices
  if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  document.body.appendChild(cursor);

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let cursorX = mouseX;
  let cursorY = mouseY;

  // Track real mouse coordinates
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  // Smooth easing loop
  function updateCursor() {
    const ease = 0.12; // Easing speed
    cursorX += (mouseX - cursorX) * ease;
    cursorY += (mouseY - cursorY) * ease;
    
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(updateCursor);
  }
  updateCursor();

  // Scale cursor glow on hoverable elements
  const hoverSelectors = 'a, button, .game-tab, .station, .slot, .gallery-item, .select';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.add('hovering');
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverSelectors)) {
      cursor.classList.remove('hovering');
    }
  });
}

/**
 * 3. Scroll Spy Active Navigation Highlights
 */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id], main[id], header[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    let currentId = '';
    const scrollPos = window.scrollY + 120; // Offset for navbar height

    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = section.getAttribute('id');
      }
    });

    if (currentId) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

/**
 * 4. Desktop Sticky Booking Header
 */
function initStickyBookingHeader() {
  const stickyHeader = document.getElementById('desktop-sticky-book');
  if (!stickyHeader) return;

  const threshold = 600; // Show after scrolling 600px
  window.addEventListener('scroll', () => {
    // Only apply on desktop viewports
    if (window.innerWidth > 800) {
      if (window.scrollY > threshold) {
        stickyHeader.classList.add('active');
      } else {
        stickyHeader.classList.remove('active');
      }
    } else {
      stickyHeader.classList.remove('active');
    }
  });
}

/**
 * 5. Scroll Reveals (Progressive Enhancement)
 * Utilizes GSAP ScrollTrigger if available; falls back to native IntersectionObserver.
 */
function initScrollReveals() {
  const revealElements = document.querySelectorAll('.reveal');

  if (window.gsap && window.ScrollTrigger) {
    // If GSAP is loaded, let GSAP handle it for precise animations
    gsap.registerPlugin(ScrollTrigger);
    
    // Hero entry stagger
    gsap.to('.hero .reveal', {
      opacity: 1,
      y: 0,
      stagger: 0.16,
      duration: 1.05,
      ease: 'power3.out',
      delay: 1.3 // Delay until loading completes
    });

    // General scroll reveals
    gsap.utils.toArray('.section .reveal, .story .reveal, .moment .reveal, .happy .reveal, .book .reveal').forEach(el => {
      gsap.to(el, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 86%',
          once: true
        }
      });
    });
  } else {
    // Fallback: Native Intersection Observer
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.05
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          entry.target.style.opacity = 1;
          entry.target.style.transform = 'translate3d(0,0,0)';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => {
      // Force initial styles
      el.style.opacity = '0';
      el.style.transform = 'translate3d(0, 28px, 0)';
      el.style.transition = 'opacity 0.8s cubic-bezier(0.215, 0.61, 0.355, 1), transform 0.8s cubic-bezier(0.215, 0.61, 0.355, 1)';
      observer.observe(el);
    });
    
    // Instantly reveal hero if observer is running
    setTimeout(() => {
      document.querySelectorAll('.hero .reveal').forEach(el => {
        el.style.opacity = '1';
        el.style.transform = 'translate3d(0,0,0)';
      });
    }, 1500);
  }
}

/**
 * 6. Floating Quick Availability Sidebar Widget
 */
function initFloatingAvailabilityWidget() {
  const widget = document.getElementById('floatingAvailWidget');
  if (!widget) return;

  const threshold = 600;
  window.addEventListener('scroll', () => {
    if (window.innerWidth > 800) {
      if (window.scrollY > threshold) {
        widget.classList.add('active');
      } else {
        widget.classList.remove('active');
      }
    } else {
      widget.classList.remove('active');
    }
  });

  // Sync widget numbers periodically from main capacity dashboard
  function syncWidget() {
    const pcItem = document.querySelector('#liveAvailabilityDashboard .live-avail-item:nth-child(1) b');
    const psItem = document.querySelector('#liveAvailabilityDashboard .live-avail-item:nth-child(2) b');
    const vrItem = document.querySelector('#liveAvailabilityDashboard .live-avail-item:nth-child(3) b');
    
    const floatPc = document.getElementById('float-avail-pc');
    const floatPs = document.getElementById('float-avail-ps');
    const floatVr = document.getElementById('float-avail-vr');
    
    if (pcItem && floatPc) floatPc.textContent = pcItem.textContent.replace(' Avail', '') + ' Available';
    if (psItem && floatPs) floatPs.textContent = psItem.textContent.replace(' Avail', '') + ' Available';
    if (vrItem && floatVr) floatVr.textContent = vrItem.textContent;
  }

  // Initial sync and loop
  setTimeout(syncWidget, 500);
  setInterval(syncWidget, 3000);
}

/**
 * 7. Premium Fullscreen Mobile Overlay Menu Drawer
 */
function initMobileMenu() {
  const btn = document.getElementById('mobileMenuBtn');
  const overlay = document.getElementById('mobileMenuOverlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    const isOpen = overlay.classList.toggle('active');
    btn.classList.toggle('active', isOpen);
    document.body.classList.toggle('no-scroll', isOpen);
    
    // Animate overlay links with GSAP if loaded
    if (window.gsap) {
      if (isOpen) {
        gsap.to(overlay, { 
          opacity: 1, 
          y: 0, 
          duration: 0.35, 
          ease: 'power2.out',
          onStart: () => {
            overlay.style.pointerEvents = 'all';
          }
        });
        
        // Stagger links entrance
        gsap.fromTo('.mobile-menu-links a, .mobile-menu-links .button', 
          { opacity: 0, y: 15 },
          { opacity: 1, y: 0, stagger: 0.08, duration: 0.3, ease: 'power2.out', delay: 0.1 }
        );
      } else {
        gsap.to(overlay, { 
          opacity: 0, 
          y: -20, 
          duration: 0.25, 
          ease: 'power2.in',
          onComplete: () => {
            overlay.style.pointerEvents = 'none';
          }
        });
      }
    }
  });

  // Global toggle closer function
  window.toggleMobileMenu = function() {
    overlay.classList.remove('active');
    btn.classList.remove('active');
    document.body.classList.remove('no-scroll');
    if (window.gsap) {
      gsap.to(overlay, { opacity: 0, y: -20, duration: 0.25, onComplete: () => { overlay.style.pointerEvents = 'none'; } });
    }
  };
}

/**
 * 8. Mobile HUD Drawer Toggle & Swipe Setup
 */
function initMobileHUD() {
  const toggleBtn = document.getElementById('mobileHUDToggleBtn');
  const closeBtn = document.getElementById('hudCloseBtn');
  const hud = document.getElementById('premiumSessionHUD');
  
  if (!toggleBtn || !hud) return;

  // Show FAB only after scrolling past the hero (300px)
  const handleHUDScroll = () => {
    if (window.scrollY > 300) {
      toggleBtn.classList.remove('fab-hidden');
    } else {
      toggleBtn.classList.add('fab-hidden');
    }
  };
  window.addEventListener('scroll', handleHUDScroll);
  handleHUDScroll(); // Run initially

  // Create overlay if not present
  let cartOverlay = document.getElementById('mobileCartOverlay');
  if (!cartOverlay) {
    cartOverlay = document.createElement('div');
    cartOverlay.id = 'mobileCartOverlay';
    cartOverlay.className = 'cart-overlay';
    document.body.appendChild(cartOverlay);
  }

  const openHUD = () => {
    hud.classList.add('drawer-active');
    cartOverlay.classList.add('active');
    document.body.classList.add('no-scroll');
  };

  const closeHUD = () => {
    hud.classList.remove('drawer-active');
    cartOverlay.classList.remove('active');
    document.body.classList.remove('no-scroll');
  };

  toggleBtn.addEventListener('click', openHUD);
  if (closeBtn) closeBtn.addEventListener('click', closeHUD);
  cartOverlay.addEventListener('click', closeHUD);

  // Close when clicking reserve button
  const reserveBtn = hud.querySelector('#hudReserveBtn');
  if (reserveBtn) {
    reserveBtn.addEventListener('click', closeHUD);
  }
}

/**
 * 9. Context-Aware Sticky Bottom Booking CTA
 */
function initContextAwareCTA() {
  const label = document.getElementById('mobileBookLabel');
  if (!label) return;

  const sections = [
    { id: 'power-up', text: 'Order Combo →' },
    { id: 'mode-vr', text: 'Book VR Session →' },
    { id: 'mode-racing', text: 'Reserve Cockpit →' },
    { id: 'arena', text: 'Reserve PC Arena →' },
    { id: 'play', text: 'Reserve PC Arena →' },
    { id: 'hero-sec', text: 'Book a Station →' }
  ];

  window.addEventListener('scroll', () => {
    let currentText = 'Book a Station →';
    
    // Find which section is currently occupying the center of the viewport
    const viewportHeight = window.innerHeight;
    const centerLine = window.scrollY + (viewportHeight / 2);
    
    for (const sec of sections) {
      const el = document.getElementById(sec.id);
      if (el) {
        const rect = el.getBoundingClientRect();
        const top = window.scrollY + rect.top;
        const bottom = top + rect.height;
        
        if (centerLine >= top && centerLine <= bottom) {
          currentText = sec.text;
          break;
        }
      }
    }
    
    // Fallback if we scroll past booking form
    const bookEl = document.getElementById('book');
    if (bookEl) {
      const rect = bookEl.getBoundingClientRect();
      const top = window.scrollY + rect.top;
      if (window.scrollY + (viewportHeight * 0.75) >= top) {
        currentText = 'Lock My Station →';
      }
    }
    
    if (label.textContent !== currentText) {
      label.textContent = currentText;
    }
  });
}

/**
 * 10. Scroll-Visibility for Mobile Sticky Booking Bar
 */
function initMobileBookBarScrollToggle() {
  const bookBar = document.getElementById('mobileBookBar');
  if (!bookBar) return;
  
  // Hide on load
  bookBar.classList.add('mobile-book-hidden');
  
  window.addEventListener('scroll', () => {
    // Show only when scrolled down past the hero area (300px)
    if (window.scrollY < 300) {
      bookBar.classList.add('mobile-book-hidden');
    } else {
      bookBar.classList.remove('mobile-book-hidden');
    }
  });
}

/**
 * 11. Lightweight Mouse-Move Parallax for Desktop Viewports
 */
function initHeroParallax() {
  const hero = document.getElementById('hero-sec');
  if (!hero || window.innerWidth < 1024) return;
  
  const light = hero.querySelector('.hero-light');
  const content = hero.querySelector('.hero-main');
  const media = hero.querySelector('.hero-media');
  const video = hero.querySelector('.hero-video');
  const orbitWrap = hero.querySelector('.hero-orbit-wrap');
  const liveCard = hero.querySelector('.hero-live-card');
  
  hero.addEventListener('mousemove', (e) => {
    const { clientX, clientY } = e;
    const { width, height } = hero.getBoundingClientRect();
    const x = (clientX / width - 0.5) * 2; // scale of -1 to 1
    const y = (clientY / height - 0.5) * 2;
    
    if (light) {
      light.style.transform = `translate3d(${x * -25}px, ${y * -25}px, 0)`;
    }
    if (content) {
      content.style.transform = `translate3d(${x * 10}px, ${y * 10}px, 0)`;
    }
    if (media) {
      media.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0) scale(1.05)`;
    }
    if (video) {
      video.style.transform = `translate3d(${x * 12}px, ${y * 12}px, 0) scale(1.05)`;
    }
    if (orbitWrap) {
      orbitWrap.style.transform = `translate3d(${x * -15}px, ${y * -15}px, 0)`;
    }
    if (liveCard) {
      liveCard.style.transform = `translate3d(${x * -18}px, ${y * -18}px, 0)`;
    }
  });
}

/**
 * 12. Premium BGC iOS/Apple Style Toast Notification Framework
 */
window.showBgcNotification = function(title, desc) {
  let toast = document.getElementById('bgcToastNotification');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'bgcToastNotification';
    toast.className = 'bgc-toast';
    toast.innerHTML = `
      <div class="bgc-toast-title" id="bgcToastTitle"></div>
      <div class="bgc-toast-desc" id="bgcToastDesc"></div>
    `;
    document.body.appendChild(toast);
  }
  
  const titleEl = document.getElementById('bgcToastTitle');
  const descEl = document.getElementById('bgcToastDesc');
  if (titleEl) titleEl.innerHTML = title;
  if (descEl) descEl.innerHTML = desc;
  
  // Trigger transition reflow
  toast.offsetHeight; 
  toast.classList.add('show');
  
  if (window.bgcToastTimer) clearTimeout(window.bgcToastTimer);
  window.bgcToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
};

/**
 * 13. Background Warm-Gold Floating Particles Effect
 */
function initHeroParticles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = canvas.width = canvas.offsetWidth;
  let height = canvas.height = canvas.offsetHeight;
  
  const particles = [];
  const particleCount = 35;
  
  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedY: -(Math.random() * 0.3 + 0.08),
      speedX: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.4 + 0.1
    });
  }
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = 0; i < particleCount; i++) {
      const p = particles[i];
      p.y += p.speedY;
      p.x += p.speedX;
      
      // Reset if offscreen top
      if (p.y < 0) {
        p.y = height;
        p.x = Math.random() * width;
      }
      if (p.x < 0 || p.x > width) {
        p.speedX = -p.speedX;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 183, 3, ${p.opacity})`;
      ctx.fill();
    }
    requestAnimationFrame(animate);
  }
  
  window.addEventListener('resize', () => {
    if (canvas.offsetWidth && canvas.offsetHeight) {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    }
  });
  
  animate();
}

/**
 * 14. Trust Badge Number Count up Micro-Interactions
 */
function initTrustCounters() {
  const counters = [
    { id: 'count-rating', target: 4.9, decimals: 1, suffix: '' },
    { id: 'count-gamers', target: 14, decimals: 0, suffix: 'K+' },
    { id: 'count-tournaments', target: 200, decimals: 0, suffix: '+' },
    { id: 'count-stations', target: 64, decimals: 0, suffix: '' }
  ];
  
  // Use IntersectionObserver so animation triggers when visible
  const strip = document.getElementById('heroTrustStrip');
  if (!strip) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        counters.forEach(c => {
          const el = document.getElementById(c.id);
          if (!el) return;
          
          let current = 0;
          const stepTime = 25;
          const steps = 30;
          const increment = c.target / steps;
          
          const timer = setInterval(() => {
            current += increment;
            if (current >= c.target) {
              current = c.target;
              clearInterval(timer);
            }
            el.textContent = current.toFixed(c.decimals) + c.suffix;
          }, stepTime);
        });
        observer.unobserve(strip);
      }
    });
  }, { threshold: 0.1 });
  
  observer.observe(strip);
}

/**
 * 15. Live Stream Match Ticking Countdown Timer
 */
function initLiveCardCountdown() {
  const timerEl = document.getElementById('liveCardCountdown');
  if (!timerEl) return;
  
  let totalSecs = 1 * 3600 + 42 * 60 + 18; // 01:42:18
  
  setInterval(() => {
    totalSecs--;
    if (totalSecs < 0) totalSecs = 3 * 3600; // reset
    
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    
    timerEl.textContent = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }, 1000);
}

/**
 * 16. Magnetic CTA Pull effect on Cursor Hover
 */
function initMagneticButtons() {
  if (window.innerWidth < 1024) return;
  
  const ctaBtn = document.querySelector('.hero-primary-cta');
  if (!ctaBtn) return;
  
  ctaBtn.addEventListener('mousemove', (e) => {
    const rect = ctaBtn.getBoundingClientRect();
    const x = e.clientX - rect.left - (rect.width / 2);
    const y = e.clientY - rect.top - (rect.height / 2);
    
    ctaBtn.style.transform = `translate3d(${x * 0.3}px, ${y * 0.3}px, 0) scale(1.02)`;
  });
  
  ctaBtn.addEventListener('mouseleave', () => {
    ctaBtn.style.transform = 'translate3d(0,0,0) scale(1)';
  });
}

/**
 * 17. Video Pause Observer (respect viewport off-screen status)
 */
function initVideoPerformanceSpy() {
  const videos = document.querySelectorAll('video');
  if (!videos.length || !('IntersectionObserver' in window)) return;
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const video = entry.target;
      if (entry.isIntersecting) {
        if (video.paused && video.autoplay) {
          video.play().catch(() => {});
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, { threshold: 0.1 });
  
  videos.forEach(v => observer.observe(v));
}

/**
 * 18. Button Ripple Click Effect
 */
function initButtonRipples() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.button');
    if (!btn) return;
    
    const circle = document.createElement('span');
    const diameter = Math.max(btn.clientWidth, btn.clientHeight);
    const radius = diameter / 2;
    
    const rect = btn.getBoundingClientRect();
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.className = 'btn-ripple';
    
    const existing = btn.querySelector('.btn-ripple');
    if (existing) existing.remove();
    
    btn.appendChild(circle);
  });
}

/**
 * 19. Mobile Live Countdown Sync
 * Keeps the mobile hero live card countdown in sync with desktop card
 */
(function initMobileLiveCountdown() {
  const mobileEl = document.getElementById('mobileLiveCountdown');
  if (!mobileEl) return;

  let totalSecs = 1 * 3600 + 42 * 60 + 18;

  setInterval(() => {
    totalSecs--;
    if (totalSecs < 0) totalSecs = 3 * 3600;
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    mobileEl.textContent = `${hrs.toString().padStart(2,'0')}:${mins.toString().padStart(2,'0')}:${secs.toString().padStart(2,'0')}`;
  }, 1000);
})();

/**
 * 20. Lazy Image Loading
 * Adds loading="lazy" to all non-critical images
 */
(function initLazyImages() {
  document.querySelectorAll('img:not([loading])').forEach(img => {
    if (!img.closest('.nav') && !img.closest('#loader') && !img.closest('.hero-main')) {
      img.setAttribute('loading', 'lazy');
    }
  });
})();

/**
 * 21. Active Section Nav Detection
 * Adds .active class to nav links when their section is in view
 */
(function initActiveSectionDetection() {
  if (!('IntersectionObserver' in window)) return;
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  if (!navLinks.length) return;

  const sectionIds = Array.from(navLinks).map(a => a.getAttribute('href').slice(1)).filter(Boolean);
  const sections = sectionIds.map(id => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href').slice(1) === id);
        });
      }
    });
  }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });

  sections.forEach(s => observer.observe(s));
})();

/**
 * 22. Count-Up for membership/stats metric elements
 * Animates data-val attributes on .count-metric elements
 */
(function initAllMetricCounters() {
  if (!('IntersectionObserver' in window)) return;
  const metrics = document.querySelectorAll('.count-metric[data-val]');
  if (!metrics.length) return;

  function animateCount(el, target) {
    const isDecimal = !Number.isInteger(target);
    const duration = 1600;
    const startTime = performance.now();

    function step(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * target;

      if (isDecimal) {
        el.textContent = current.toFixed(1);
      } else if (target >= 1000) {
        el.textContent = Math.floor(current / 1000) + 'K+';
      } else {
        el.textContent = Math.floor(current) + '+';
      }

      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCount(el, parseFloat(el.getAttribute('data-val')));
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  metrics.forEach(m => observer.observe(m));
})();

/**
 * 23. Enhanced Scroll Reveal
 */
(function initEnhancedScrollReveal() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -60px 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

