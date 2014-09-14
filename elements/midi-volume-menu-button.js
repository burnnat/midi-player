Polymer('midi-volume-menu-button', {
  tapAction: function(event) {
    // Only react to events directly on the button.
    // Other menu events should be passed through.
    if (event.target === this) {
      this.super();
    }
  }
});