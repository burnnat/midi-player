Polymer('midi-volume', {
  volume: 100,
  muted: false,

  computed: {
    effectiveVolume: 'muted ? 0 : volume'
  },

  toggleMute: function() {
    this.muted = !this.muted;
  },

  unmute: function() {
    this.muted = false;
  },

  toIcon: function(level) {
    if (level === 0) {
      return 'av:volume-off';
    }
    else if (level <= 33) {
      return 'av:volume-mute';
    }
    else if (level <= 66) {
      return 'av:volume-down';
    }
    else {
      return 'av:volume-up';
    }
  }
});