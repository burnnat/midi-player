Polymer('midi-play-bar', {

  player: null,

  // all time values are given in seconds
  offset: 0,
  remaining: 0,
  total: 0,

  // slider is accurate to a hundredth of a second
  resolution: 100,

  playerChanged: function(oldPlayer, newPlayer) {
    var me = this;

    if (oldPlayer) {
      oldPlayer.clearAnimation();
    }

    if (newPlayer) {
      newPlayer.setAnimation(function(data) {
        me.onPlayerUpdate(data);
      });
    }
  },

  loadMidi: function(data) {
    var player = this.player;

    player.currentData = data;
    player.loadMidiFile();
  },

  parseMetadata: function() {
    var data = this.player.data;
    var event;

    for (var i = 0; i < data.length; i++) {
      event = data[i][0].event;

      if (event.type === 'meta' && event.subtype === 'trackName') {
        this.songTitle = event.text;
        return;
      }
    }
  },

  onPlayPause: function() {
    var player = this.player;

    if (player.playing) {
      player.pause(true);
    }
    else {
      player.resume();
    }
  },

  onPlayerUpdate: function(data) {
    var now = data.now;
    var end = data.end;

    this.offset = now;
    this.remaining = end - now;
    this.total = end;

    if (this.remaining <= 0) {
      this.player.stop();
    }
  },

  pauseForDrag: false,

  onSliderDrag: function() {
    var player = this.player;

    if (player.playing) {
      this.pauseForDrag = true;
      player.pause(true);
    }
  },

  onSliderChange: function(event, data, el) {
    var player = this.player;

    // current time is given in milliseconds
    player.currentTime = el.immediateValue / this.resolution * 1000;

    if (this.pauseForDrag) {
      this.pauseForDrag = false;
      player.resume();
    }
  },

  timeFormat: function(value) {
    var minutes = String(value / 60 >> 0);
    var seconds = String(value - (minutes * 60) >> 0);

    if (seconds.length == 1) {
      // pad with zeroes if necessary
      seconds = "0" + seconds;
    }

    return minutes + ":" + seconds;
  }
});