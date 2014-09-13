Polymer('midi-app', {

  file: null,

  fileChanged: function(oldFile, newFile) {
    var me = this;
    var playbar = this.$.playbar;

    newFile.file(function(file) {
      var reader = new FileReader();

      reader.onloadend = function(e) {
        playbar.player = MIDI.Player;
        playbar.loadMidi(newFile.name, this.result);
        MIDI.loader.message('File loaded.');

        me.loadInstruments();
      };

      reader.readAsBinaryString(file);
    });
  },

  loadInstruments: function() {
    var playbar = this.$.playbar;
    var data = playbar.player.data;
    var results = [];

    for (var i = 0; i < data.length; i++) {
      event = data[i][0].event;

      if (event.subtype === 'programChange') {
        results.push(
          MIDI.GeneralMIDI.byId[event.programNumber].id
        );

        // Naive implementation, just sets all the program changes up front.
        // Ideally, MIDI.js would handle this as part of its playback.
        MIDI.channels[event.channel].instrument = event.programNumber;
      }
    }

    var queue = this.createQueue({
      items: results,

      getNext: function(instrumentId) {
        MIDI.loader.message('Loading instrument: ' + instrumentId);

        var req = new XMLHttpRequest();

        req.overrideMimeType("application/json");
        req.open('GET', 'soundfont/' + instrumentId + '-ogg.json', true);

        req.onload = function() {
          MIDI.Soundfont[instrumentId] = JSON.parse(req.responseText);
          queue.getNext();
        };

        req.send(null);
      },

      onComplete: function() {
        MIDI.WebAudio.connect({
          callback: function() {
            MIDI.loader.message('Player loaded.');
          }
        });
      }
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
  },

  createQueue: function(conf) {
    var self = {};
    self.queue = [];

    for (var key in conf.items) {
      if (conf.items.hasOwnProperty(key)) {
        self.queue.push(conf.items[key]);
      }
    }

    self.getNext = function() {
      if (!self.queue.length) {
        return conf.onComplete();
      }

      conf.getNext(self.queue.shift());
    };

    setTimeout(self.getNext, 1);

    return self;
    }
});