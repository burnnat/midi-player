/*
	Build environment
	----------------------------------------
	1) Install NodeJS:
		http://nodejs.org/
	2) Install dev dependencies
	  npm install
	3) Install Grunt CLI globally
		npm install grunt-cli -g
	4) Install Bower dependencies
	  bower install
*/

var fs = require("fs");
var path = require("path");
var vm = require("vm");

var async = require("async");
var glob = require("glob");

module.exports = function (grunt) {
	grunt.initConfig({
		concat: {
			'build/MIDI.js': [
				'js/MIDI/AudioDetect.js',
				'js/MIDI/LoadPlugin.js',
				'js/MIDI/Plugin.js',
				'js/MIDI/Player.js',
				'js/Window/DOMLoader.XMLHttp.js', // req when using XHR
				'js/Window/DOMLoader.script.js', // req otherwise
//				'js/Color/SpaceW3.js', // optional
//				'js/MusicTheory/Synesthesia.js', // optional
//				'js/Widgets/Loader.js', // optional
//				'js/Window/Event.js' // optional
			]
		},
		uglify: {
			'build/MIDI.min.js': [
				'build/MIDI.js'
			]
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('soundfont', 'Build soundfont JSON files.', function() {
    var done = this.async();

    // options is optional
    glob(
      "bower_components/midi-js-soundfonts/FluidR3_GM/*-ogg.js",
      function (err, files) {
        if (err) {
          grunt.log.error(err);
          done(false);
          return;
        }
        else if (files.length < 1) {
          grunt.log.error("No soundfont files found. Have you run bower install?");
          done(false);
          return;
        }

        async.each(
          files,
          function(file, next) {
            fs.readFile(file, { encoding: 'utf-8' }, function(err, data) {
              if (err) {
                grunt.log.error(err);
                next(err);
              }
              else {
                var sandbox = {};

                vm.runInNewContext(data, sandbox, file);

                var output = sandbox.MIDI.Soundfont;
                var instrument = Object.keys(output)[0];

                fs.writeFile(
                  path.join('soundfont', path.basename(file, '.js') + '.json'),
                  JSON.stringify(output[instrument]),
                  function(err) {
                    next();
                  }
                );
              }
            });
          },
          function(err) {
            done(!err);
          }
        );
      }
    );
  });

	///
	grunt.registerTask('default', ['concat', 'uglify', 'soundfont']);
	///
};