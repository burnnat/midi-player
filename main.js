window.addEventListener('polymer-ready', function(e) {
  var app = document.getElementById('app');
  var toast = document.getElementById('toast');

  app.file = window.FILE;

  MIDI.loader = {
    message: function(message) {
      toast.text = message;
      toast.show();
    },

    update: function(id, message, percent) {
      percent = percent || message.replace(/.*?(\d+)%.*/g, '$1');
      this.message('Loading player: ' + percent + '%');
    },

    stop: function() {

    }
  };
});