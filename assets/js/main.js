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

