// Boomer's Gaming Cafe - Analytics & Interaction Tracking Hooks

const Tracker = {
  // Flag to enable console logging for developer feedback
  DEBUG: true,

  // General event logger
  track: function(eventName, eventData = {}) {
    const payload = {
      event: eventName,
      properties: {
        ...eventData,
        timestamp: new Date().toISOString(),
        url: window.location.href,
        viewportWidth: window.innerWidth
      }
    };

    if (this.DEBUG) {
      console.log(`%c[Tracker] ${eventName}`, 'color: #efbd4e; font-weight: bold; background: #1a1a1a; padding: 2px 6px; border-radius: 2px;', payload.properties);
    }

    // Custom Event Dispatcher for future integrations (e.g. Google Analytics / Mixpanel)
    const customEvent = new CustomEvent('boomers_track_event', { detail: payload });
    window.dispatchEvent(customEvent);
  },

  // Helper methods for specific features
  trackBookingStart: function(branchName) {
    this.track('Booking Started', { branch: branchName });
  },

  trackZoneSelected: function(zoneId, zoneName) {
    this.track('Zone Selected', { zoneId, zoneName });
  },

  trackStationSelected: function(stationId, stationName, price) {
    this.track('Station Selected', { stationId, stationName, pricePerHr: price });
  },

  trackBundleAdded: function(bundleId, bundleName, price) {
    this.track('Food Bundle Added', { bundleId, bundleName, price });
  },

  trackBookingCompleted: function(bookingDetails) {
    this.track('Booking Completed', bookingDetails);
  },

  trackHeroCTAClick: function(destination) {
    this.track('Hero CTA Clicked', { destination });
  },

  trackGalleryOpened: function(imageIndex, imageSrc) {
    this.track('Gallery Opened', { imageIndex, imageSrc });
  },

  trackTournamentRegistered: function(tournamentTitle, branch) {
    this.track('Tournament Registration Clicked', { tournamentTitle, branch });
  }
};
