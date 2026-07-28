(() => {
  const ticker = document.querySelector('.activity-ticker-wrap');
  if (!ticker || document.querySelector('.mobile-live-grid')) return;

  const grid = document.createElement('div');
  grid.className = 'mobile-live-grid';
  grid.innerHTML = `
    <article class="mobile-live-card pc"><small>● PC Arena</small><b data-mobile-live="pc">12 Available</b></article>
    <article class="mobile-live-card ps"><small>● PS5 Lounge</small><b data-mobile-live="ps">3 Available</b></article>
    <article class="mobile-live-card vr"><small>● VR</small><b>Waiting List</b></article>
    <article class="mobile-live-card race"><small>🏁 Sim Racing</small><b data-mobile-live="race">2 Available</b></article>`;
  ticker.append(grid);

  const updates = [
    { pc: '12 Available', ps: '3 Available', race: '2 Available' },
    { pc: '11 Available', ps: '4 Available', race: '1 Available' },
    { pc: '13 Available', ps: '3 Available', race: '2 Available' }
  ];
  let index = 0;
  window.setInterval(() => {
    index = (index + 1) % updates.length;
    Object.entries(updates[index]).forEach(([key, value]) => {
      const node = grid.querySelector(`[data-mobile-live="${key}"]`);
      if (node) {
        node.classList.remove('updating');
        // Force reflow so animation re-triggers
        void node.offsetWidth;
        node.classList.add('updating');
        node.textContent = value;
      }
    });
  }, 6500);
})();
