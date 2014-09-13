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
    var playbar = this.$.playbar;

    newFile.file(function(file) {
      var reader = new FileReader();

      reader.onloadend = function(e) {
        playbar.loadMidi(newFile.name, this.result);
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
            description: 'MIDI files',
            mimeTypes: [
              "application/x-midi",
              "audio/midi"
            ],
            extensions: [
              "mid",
              "midi"
            ],
          }
        ],
        acceptsAllTypes: false
      },
      function(entry, entries) {
        me.file = entry;
      }
    );
  }
});