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
    pkg: grunt.file.readJSON('package.json'),

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

    changelog: {
      build: {
        options: {
          after: 'v' + manifest.version,
          dest: 'CHANGELOG.md',
          insertType: 'prepend',
          template: '# <%= pkg.version %> / {{date}}\n\n{{> features}}{{> fixes}}',
          featureRegex: /^(.*?) ?\(closes #\d+\)(.*)$/gim,
          fixRegex: /^(.*?) ?\(fixes #\d+\)(.*)$/gim
        }
      }
    },

    bump: {
      options: {
        files: [
          'package.json',
          'manifest.json'
        ],

        updateConfigs: ['pkg'],

        commitFiles: [
          'package.json',
          'manifest.json',
          'CHANGELOG.md'
        ],

        commitMessage: 'Release %VERSION%',
        push: false
      }
    }
  });

  grunt.loadNpmTasks('grunt-bump');
  grunt.loadNpmTasks('grunt-changelog');
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

  grunt.registerTask(
    'release',
    function(target) {
      if (target == null) {
        return grunt.warn('Release target must be specified, like release:patch.');
      }

      grunt.task.run('bump-only:' + target);
      grunt.task.run('changelog:build');
      grunt.task.run('bump-commit');
    });
};
