Polymer('midi-play-bar', {
  // playing: false,
  
  onPlayPause: function() {
    var player = this.player;
    
    if (player.playing) {
      player.pause(true);
    }
    else {
      player.resume();
    }
  }
});