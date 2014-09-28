(function() {
  var POLYMER_READY = false;
  var initialFile = window.FILE;

  var loadFile = function(file) {
    document.getElementById('app').file = file;
  };

  window.addEventListener('polymer-ready', function(e) {
    POLYMER_READY = true;

    var toast = document.getElementById('toast');

    MIDI.loader = {
      message: function(message) {
        toast.text = message;
        toast.show();
      },

      update: function(id, message, percent) {
        this.message(message + ': ' + percent + '%');
      },

      stop: function() {

      }
    };

    loadFile(initialFile);
  });

  window.setFile = function(file) {
    if (POLYMER_READY) {
      loadFile(file);
    }
    else {
      initialFile = file;
    }
  };
})();