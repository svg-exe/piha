module.exports = function (grunt) {
  var fs = require('fs');

  var uglify_options = {
    options: {
      banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    },
    build: {
      src: 'src/assets/js/app.js',
      dest: 'build/assets/js/app.js'
    }
  };

  var jshint_options = {
    files: ['gruntfile.js', 'src/assets/js/*'],
    options: grunt.file.readJSON('.jshintrc')
  };

  var hash_options = {
    options: {
      output: 'asset_map.json',
      merge: true
    },
    js: {
      cwd: 'build/assets/js/',
      src: '*.js',
      dest: 'dist/assets/js/'
    },
    css: {
      cwd: 'build/assets/css/',
      src: '*.css',
      dest: 'dist/assets/css/'
    }
  };


  var less_options = {
    production: {
      options: {
        paths: ["/"],
        yuicompress: true
      },
      files: {
        "build/assets/css/app.css": "src/assets/css/app.less"
      }
    }
  };

  var copy_options = {
    build: {
      files: [{
        expand: true,
        flatten: true,
        src: ['build/button.html', 'src/assets/js/adn.js', 'src/test.html'],
        dest: 'dist/'
      }]
    }
  };

  var watch_options = {
    css: {
      files: ['src/assets/css/app.less'],
      tasks: ['build']
    },
    js: {
      files: jshint_options.files,
      tasks: ['build']
    },
    html: {
      files: ["src/button.jade"],
      tasks: ['build']
    },
    test: {
      files: ["src/test.html"],
      tasks: ['build']
    }
  };

  var connect_options = {
    server: {
      options: {
        port: 9001,
        base: './dist'
      }
    }
  };

  var jade_options = {
    compile: {
      options: {
        data: {
          assets: function () {
            return grunt.file.readJSON('asset_map.json');
          },
          title: "awesoem town"
        }
      },
      files: {
        "build/button.html": ["src/button.jade"]
      }
    }
  };

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: uglify_options,
    jshint: jshint_options,
    hashmap: hash_options,
    less: less_options,
    copy: copy_options,
    connect: connect_options,
    jade: jade_options,
    watch: watch_options,
    clean: ['./build', './dist']
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-hashmap');

  grunt.registerTask('ensure_folders', function () {
    var folders = ['./dist', './dist/assets', './build', './build/assets'];
    folders.forEach(function (folder) {
      if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
      }
    });
  });

  grunt.registerTask('default', ['uglify']);
  grunt.registerTask('build', ['ensure_folders', 'jshint', 'uglify', 'less', 'hashmap', 'jade', 'copy']);
  grunt.registerTask('dev', ['build', 'connect', 'watch']);
};