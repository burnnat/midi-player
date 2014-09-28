var _ = require('lodash');
var project = require('./package.json');
var manifest = require('./manifest.json');

module.exports = function(grunt) {
  var assets = [
    'LICENSE',
    'manifest.json',
    'bower_components/midi/soundfont/*.json'
  ];

  assets = assets.concat(_.values(manifest.icons));
  assets = assets.concat(manifest.app.background.scripts);

  grunt.initConfig({
    clean: {
      build: [
        'build/*',
        '!build/dist/**'
      ]
    },

    vulcanize: {
      default: {
        options: {
          csp: true,
          inline: true
        },
        files: {
          'build/index.html': 'index.html'
        },
      },
    },

    copy: {
      build: {
        files: [
          {
            src: assets,
            dest: 'build/'
          }
        ]
      }
    },

    compress: {
      build: {
        options: {
          archive: 'build/dist/' + project.name + '-' + manifest.version + '.zip'
        },
        files: [
          {
            expand: true,
            cwd: 'build/',
            src: [
              '**',
              '!dist/**'
            ]
          }
        ]
      }
    },

    bump: {
      options: {
        files: [
          'package.json',
          'manifest.json'
        ],

        commitMessage: 'Release %VERSION%',
        push: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-vulcanize');

  grunt.registerTask(
    'mkdir',
    'Create build directory',
    function() {
      grunt.file.mkdir('build/dist/');
    }
  );

  grunt.registerTask(
    'default',
    [
      'clean:build',
      'mkdir',
      'vulcanize',
      'copy:build',
      'compress:build'
    ]
  );
};
