Polymer('midi-app', {

  file: null,

  ready: function() {
    var playbar = this.$.playbar;

    MIDI.WebAudio.connect({
      callback: function() {
        MIDI.loader.message('Player loaded.');
        playbar.player = MIDI.Player;
      }
    });
  },

  fileChanged: function(oldFile, newFile) {
    newFile.file(function(file) {
      var reader = new FileReader();

      reader.onloadend = function(e) {
        MIDI.Player.currentData = this.result;
    		MIDI.Player.loadMidiFile();

    		MIDI.loader.message('File loaded.');
      };

      reader.readAsBinaryString(file);
    });
  },

  chooseFile: function() {
    var me = this;

    chrome.fileSystem.chooseEntry(
      {
        accepts: [
          {
            description: 'MIDI Files',
            mimeTypes: [
              "application/x-midi",
              "audio/midi"
            ],
            extensions: [
              "mid",
              "midi"
            ],
          }
        ]
      },
      function(entry, entries) {
        me.file = entry;
      }
    );
  }
});