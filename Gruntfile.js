module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      all: [
        'Gruntfile.js',
        'features/**/*.js',
        'example/**/*.js',
        'lib/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    clean: {
    },

    shell: {
      features: {
        command: 'node bin/parallel-cucumber-js --workers 4'
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('features', ['shell:features']);

  grunt.registerTask('test', ['jshint', 'features']);
  grunt.registerTask('default', ['test']);

};