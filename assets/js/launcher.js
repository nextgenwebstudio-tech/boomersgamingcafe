// Boomer's Gaming Cafe - Living Game Launcher Panel Logic

document.addEventListener('DOMContentLoaded', () => {
  initGameLauncher();
});

/**
 * Game Launcher Initializer
 */
function initGameLauncher() {
  const tabs = document.querySelectorAll('.game-tab');
  const panel = document.getElementById('gamePanel');
  const title = document.getElementById('gameTitle');
  const copy = document.getElementById('gameCopy');
  
  // Stats elements inside panel
  const players = document.getElementById('gamePlayers');
  const stations = document.getElementById('gameStations');
  const waitTime = document.getElementById('gameWaitTime');
  const setup = document.getElementById('gameSetup');
  const badge = document.getElementById('gameBadge');
  const rating = document.getElementById('gameRating');

  const launcherSection = document.querySelector('.launcher');

  if (!tabs.length || !panel) return;

  function updatePanel(gameInfo) {
    const themeColor = gameInfo.accent;
    
    if (title) title.textContent = gameInfo.name;
    if (copy) copy.textContent = gameInfo.copy;
    if (players) players.textContent = `${gameInfo.players} online`;
    if (stations) stations.textContent = `${gameInfo.stations} available`;
    if (waitTime) waitTime.textContent = gameInfo.waitTime;
    if (setup) setup.textContent = gameInfo.setup;
    if (badge) {
      badge.textContent = gameInfo.tag;
      badge.style.background = themeColor;
    }
    if (rating) rating.textContent = "★".repeat(gameInfo.rating);

    panel.style.setProperty('--panel-image', `url('${gameInfo.image}')`);
    panel.style.setProperty('--game', themeColor);
    launcherSection.style.setProperty('--game-glow', `${themeColor}28`);
    panel.style.setProperty('--glow', `${themeColor}44`);
    
    // Subtly transition section background to match active game theme
    if (launcherSection) {
      launcherSection.style.background = `radial-gradient(circle at 75% 25%, ${themeColor}12 0%, #08090c 65%)`;
      launcherSection.style.transition = 'background 0.5s ease-out';
    }

    // Update custom cursor glow theme to match the game
    const customCursor = document.querySelector('.custom-cursor');
    if (customCursor) {
      customCursor.style.backgroundImage = `radial-gradient(circle, ${themeColor}1a 0%, ${themeColor}00 70%)`;
    }
  }

  // Add click listener to each game tab
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // 1. Remove active state from current tabs and add to clicked
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const gameId = tab.dataset.id;
      const gameInfo = GAMES_DATA.find(g => g.id === gameId) || GAMES_DATA[0];

      // 2. Track event
      Tracker.track('Game Selected', { game: gameInfo.name });

      // 3. Smooth transition content using GSAP or standard CSS transition
      if (window.gsap) {
        gsap.to(panel, {
          opacity: 0,
          x: 12,
          duration: 0.16,
          onComplete() {
            updatePanel(gameInfo);
            gsap.to(panel, {
              opacity: 1,
              x: 0,
              duration: 0.38,
              ease: 'power2.out'
            });
          }
        });
      } else {
        // Fallback CSS Fade
        panel.style.opacity = '0';
        panel.style.transform = 'translate3d(12px, 0, 0)';
        
        setTimeout(() => {
          updatePanel(gameInfo);
          panel.style.opacity = '1';
          panel.style.transform = 'translate3d(0, 0, 0)';
          panel.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        }, 160);
      }

      // 4. Spawn subtle gaming particle details (Floating embers matching color)
      // Only spawn if not on mobile/touch to protect performance
      if (window.innerWidth > 800) {
        spawnLauncherParticles(launcherSection, gameInfo.accent);
      }
    });
  });

  // Trigger initial particle loop (desktop only)
  setInterval(() => {
    if (window.innerWidth <= 800) return;
    const activeTab = document.querySelector('.game-tab.active');
    if (activeTab) {
      const gameId = activeTab.dataset.id;
      const gameInfo = GAMES_DATA.find(g => g.id === gameId);
      if (gameInfo) {
        spawnLauncherParticles(launcherSection, gameInfo.accent, 2);
      }
    }
  }, 3000);
}

/**
 * Creates low-overhead floating ember particles in the launcher background
 */
function spawnLauncherParticles(container, color, count = 6) {
  if (document.hidden) return; // Tab in background, stop spawning
  
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    
    particle.style.position = 'absolute';
    particle.style.width = `${Math.random() * 4 + 2}px`;
    particle.style.height = particle.style.width;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.boxShadow = `0 0 10px ${color}`;
    particle.style.pointerEvents = 'none';
    particle.style.zIndex = '0';
    
    const startX = Math.random() * 100;
    const startY = Math.random() * 40 + 50; // Spawn near bottom
    
    particle.style.left = `${startX}%`;
    particle.style.top = `${startY}%`;
    particle.style.opacity = '0';
    
    container.appendChild(particle);

    // Animate upward and fade out
    if (window.gsap) {
      gsap.to(particle, {
        opacity: Math.random() * 0.4 + 0.2,
        y: -150 - Math.random() * 150,
        x: Math.random() * 60 - 30,
        duration: Math.random() * 4 + 3,
        ease: 'power1.out',
        onComplete: () => particle.remove()
      });
    } else {
      // Fallback timeout removal
      particle.style.transition = 'all 4s ease-out';
      setTimeout(() => {
        particle.style.opacity = '0.3';
        particle.style.transform = `translate3d(${Math.random() * 60 - 30}px, -180px, 0)`;
        setTimeout(() => particle.remove(), 4000);
      }, 50);
    }
  }
}
