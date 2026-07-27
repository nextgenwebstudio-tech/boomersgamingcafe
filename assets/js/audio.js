// Boomer's Gaming Cafe - Web Audio Synthesizer & Audio Toggle Controller

let isAudioEnabled = false;
let audioCtx = null;

document.addEventListener('DOMContentLoaded', () => {
  initAudioController();
});

/**
 * Initializes the audio controller toggle button
 */
function initAudioController() {
  const toggleBtn = document.getElementById('audioToggleBtn');
  if (!toggleBtn) return;

  // Display audio toggle button once JS is ready
  toggleBtn.style.display = 'flex';

  toggleBtn.addEventListener('click', () => {
    isAudioEnabled = !isAudioEnabled;
    
    // Toggle state style and text
    toggleBtn.classList.toggle('active', isAudioEnabled);
    const icon = toggleBtn.querySelector('.audio-icon');
    const stateText = toggleBtn.querySelector('.audio-state-text');
    
    if (isAudioEnabled) {
      if (icon) icon.textContent = '🔊';
      if (stateText) stateText.textContent = 'ON';
      
      // Initialize Audio Context on user interaction
      if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      // Play a quick confirmation click sound
      playClickSound();
      Tracker.track('Audio Toggled', { state: 'ON' });
    } else {
      if (icon) icon.textContent = '🔇';
      if (stateText) stateText.textContent = 'OFF';
      Tracker.track('Audio Toggled', { state: 'OFF' });
    }
  });

  // Attach quick hover/click sounds to key interactive targets
  bindSoundTargets();
}

/**
 * Synthesizes a clean, retro digital click sound
 */
function playClickSound() {
  if (!isAudioEnabled || !audioCtx) return;

  try {
    // Resume context if suspended (browser security policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime); // High pitch bip
    osc.frequency.exponentialRampToValueAtTime(150, audioCtx.currentTime + 0.08); // Quick slide down

    gain.gain.setValueAtTime(0.05, audioCtx.currentTime); // Low volume
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
  } catch (error) {
    console.warn("Audio play failed:", error);
  }
}

/**
 * Synthesizes a premium ascending success chord sweep
 */
function playSuccessSound() {
  if (!isAudioEnabled || !audioCtx) return;

  try {
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;
    
    // Play 3 notes in quick succession (ascending major chord)
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, now + idx * 0.08);

      gain.gain.setValueAtTime(0, now + idx * 0.08);
      gain.gain.linearRampToValueAtTime(0.04, now + idx * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now + idx * 0.08);
      osc.stop(now + idx * 0.08 + 0.25);
    });
  } catch (error) {
    console.warn("Success audio failed:", error);
  }
}

/**
 * Binds generic click sound triggers to interactive classes
 */
function bindSoundTargets() {
  const triggerSelectors = 'a, button, .game-tab, .slot, .station, .select, .gallery-item';
  
  document.addEventListener('click', (e) => {
    if (e.target.closest(triggerSelectors)) {
      // Play simple click sound
      playClickSound();
    }
  });

  // Specific hook for booking completion success chord
  window.addEventListener('boomers_track_event', (e) => {
    if (e.detail && e.detail.event === 'Booking Completed') {
      setTimeout(playSuccessSound, 200);
    }
  });
}
