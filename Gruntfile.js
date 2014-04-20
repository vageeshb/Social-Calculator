'use strict';

module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      options:  {
        jshintrc:'.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: ['Gruntfile.js', 'app.js'],
      
    },
    bowerInstall: {
      target: {
        src: [
          'views/layout.jade'
        ],
        ignorePath: '../public/'
      }
    },
    uglify: {
      my_target: {
        files: {
          'public/js/app.min.js': ['public/js/app.js']
        }
      }
    },
    watch: {
      jade: {
        files: ['**/*.jade'],
        options: {
          livereload: false,
        },
      },
      scripts: {
        files: ['**/*.js', ],
        tasks: ['jshint', 'bowerInstall', 'express:dev'],
        options: {
          spawn: false,
        },
      },
    },
    express: {
      options: {
        port: 3000,
      },
      dev: {
        options: {
          script: 'app.js'
        }
      },
    },
    open: {
      dev : {
        path : 'http://localhost:3000',
      },
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-bower-install');
  grunt.loadNpmTasks('grunt-express-server');
  grunt.loadNpmTasks('grunt-open');

  grunt.registerTask('default', ['jshint', 'uglify', 'bowerInstall', 'express', 'open:dev', 'watch']);
};