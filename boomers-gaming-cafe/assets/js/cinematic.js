(() => {
  const $ = (selector, root = document) => root.querySelector(selector);

  const hero = $('#hero-sec');
  if (!hero) return;

  // Cinematic media rotation. Replace the local image paths with Boomer's final 6–8 second video cuts when supplied.
  const scenes = [
    '/assets/images/boomers_pc_lounge.jpg',
    '/assets/images/pc_ps5_cover.jpg',
    '/assets/images/boomers_racing_sim.jpg',
    '/assets/images/boomers_vr_lounge.jpg',
    '/assets/images/boomers_cafe_food.jpg',
    '/assets/images/party-booking.jpg'
  ];
  const sceneLayer = document.createElement('div');
  sceneLayer.className = 'hero-scenes';
  scenes.forEach((source, index) => {
    const scene = document.createElement('div');
    scene.className = `hero-scene${index === 0 ? ' active' : ''}`;
    scene.style.setProperty('--scene', `url('${source}')`);
    sceneLayer.append(scene);
  });
  hero.prepend(sceneLayer);
  const sceneNodes = [...sceneLayer.children];
  let activeScene = 0;
  setInterval(() => {
    sceneNodes[activeScene].classList.remove('active');
    activeScene = (activeScene + 1) % sceneNodes.length;
    sceneNodes[activeScene].classList.add('active');
  }, 7000);

  const particles = document.createElement('div');
  particles.className = 'hero-particles';
  Array.from({ length: 20 }, (_, index) => {
    const particle = document.createElement('i');
    particle.style.cssText = `left:${(index * 17 + 4) % 96}%;top:${(index * 29 + 8) % 86}%;--speed:${4 + (index % 5)}s;--drift:${-28 + (index % 7) * 9}px;animation-delay:-${index % 5}s`;
    particles.append(particle);
  });
  hero.append(particles);

  const heading = $('.hero h1');
  if (heading) heading.innerHTML = '<span class="hero-enter">Enter the</span><span class="hero-arena"><em>arena.</em></span>';

  hero.addEventListener('pointermove', (event) => {
    const box = hero.getBoundingClientRect();
    const x = (event.clientX - box.left) / box.width - .5;
    const y = (event.clientY - box.top) / box.height - .5;
    $('.hero-orbit', hero)?.style.setProperty('transform', `translate(${x * 16}px,${y * 12}px)`);
    $('.hero-light', hero)?.style.setProperty('transform', `translate(${x * 22}px,${y * 16}px)`);
    sceneLayer.style.transform = `translate(${x * -10}px,${y * -7}px)`;
  });

  const bookingCard = $('.booking-float');
  if (bookingCard) {
    const readout = document.createElement('div');
    readout.className = 'hero-live-readout';
    readout.innerHTML = '<div><b id="heroPcLive">12 PCs</b>Available</div><div><b id="heroPsLive">3 PS5</b>Ready</div><div class="is-full"><b id="heroVrLive">VR</b>Waiting list</div>';
    bookingCard.querySelector('.booking-row')?.after(readout);
  }

  const ticker = $('.activity-ticker-wrap');
  if (ticker) {
    const experience = document.createElement('section');
    experience.className = 'section experience-preview';
    experience.innerHTML = `<div class="wrap"><div class="library-head reveal"><div class="section-kicker">Choose your arena</div><h2 class="display">One place.<br><span>Every kind of play.</span></h2><p class="section-intro">Start with what you came for, see what is available, and book from the same screen.</p></div><div class="experience-preview-grid"><a class="experience-preview-card" href="#book" style="--accent:#55dcff; background-image:url('assets/images/boomers_pc_lounge.jpg')"><div class="experience-preview-meta"><span>PC Arena</span><span>12 available</span></div><h3>PC Arena</h3><p>RTX rigs, high refresh screens, and all-night sessions.</p><div class="experience-preview-meta"><span>From ₹100</span><span>Book now →</span></div></a><a class="experience-preview-card" href="#book" style="--accent:#9d74ff; background-image:url('assets/images/pc_ps5_cover.jpg')"><div class="experience-preview-meta"><span>PS5 Lounge</span><span>3 ready</span></div><h3>PS5 Lounge</h3><p>Couch co-op and big-screen competitive play.</p><div class="experience-preview-meta"><span>Live seating</span><span>Book now →</span></div></a><a class="experience-preview-card" href="#book" style="--accent:#58e7a4; background-image:url('assets/images/boomers_racing_sim.jpg')"><div class="experience-preview-meta"><span>Sim Racing</span><span>2 available</span></div><h3>Sim Racing</h3><p>Logitech cockpit sessions built for the corner.</p><div class="experience-preview-meta"><span>Race ready</span><span>Book now →</span></div></a><a class="experience-preview-card" href="#book" style="--accent:#e08cff; background-image:url('assets/images/boomers_vr_lounge.jpg')"><div class="experience-preview-meta"><span>VR Experience</span><span>Waiting list</span></div><h3>VR Experience</h3><p>PS VR2 immersion, no setup required.</p><div class="experience-preview-meta"><span>Join queue</span><span>Book now →</span></div></a></div></div>`;
    ticker.after(experience);
  }

  const storyCopy = $('.story-copy');
  if (storyCopy) {
    const watch = document.createElement('button');
    watch.className = 'watch-inside';
    watch.type = 'button';
    watch.textContent = "Watch inside Boomer's";
    storyCopy.append(watch);
  }

  const modal = document.createElement('div');
  modal.className = 'cinema-modal';
  modal.innerHTML = `
    <div class="cinema-modal-frame">
      <button class="cinema-close" aria-label="Close video" style="z-index: 10;">×</button>
      <video id="cinemaVideo" src="assets/images/coimbatore-trailer.mp4" controls playsinline style="width: 100%; height: 100%; object-fit: contain; border-radius: 4px; display: block;"></video>
    </div>
  `;
  document.body.append(modal);

  const videoEl = modal.querySelector('#cinemaVideo');

  $('.watch-inside')?.addEventListener('click', () => {
    modal.classList.add('show');
    if (videoEl) {
      videoEl.currentTime = 0;
      videoEl.play().catch(err => console.log("Video autoplay blocked or failed:", err));
    }
  });

  const stopVideo = () => {
    modal.classList.remove('show');
    if (videoEl) {
      videoEl.pause();
      videoEl.currentTime = 0;
    }
  };

  $('.cinema-close', modal)?.addEventListener('click', stopVideo);
  modal.addEventListener('click', (event) => { if (event.target === modal) stopVideo(); });

  const calendar = $('#calendar .wrap');
  if (calendar) {
    const liveTournament = document.createElement('div');
    liveTournament.className = 'tournament-live-now reveal';
    liveTournament.innerHTML = '<div><div class="live">LIVE NOW</div><h3>Campus Clash</h3><small>Valorant · Both branches</small></div><div><small>Starts in</small><div class="live-countdown" id="liveCountdown">01:39:21</div></div><a class="button" href="#book">Watch live →</a>';
    calendar.append(liveTournament);
  }



  let seconds = 5961;
  setInterval(() => {
    seconds = Math.max(0, seconds - 1);
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    const countdown = $('#liveCountdown');
    if (countdown) countdown.textContent = `${h}:${m}:${s}`;
  }, 1000);

  const availability = [
    ['12 PCs', '3 PS5', 'VR'],
    ['11 PCs', '4 PS5', 'VR'],
    ['13 PCs', '2 PS5', 'VR'],
  ];
  let readoutIndex = 0;
  setInterval(() => {
    readoutIndex = (readoutIndex + 1) % availability.length;
    $('#heroPcLive') && ($('#heroPcLive').textContent = availability[readoutIndex][0]);
    $('#heroPsLive') && ($('#heroPsLive').textContent = availability[readoutIndex][1]);
    $('#heroVrLive') && ($('#heroVrLive').textContent = availability[readoutIndex][2]);
  }, 6500);
})();
