module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        jshint: {
            ignore_warning: {
                src: [
                    'www/modules/**/*.js',
                    '!www/modules/**/*.spec.js'
                ],
            },
        },
        concat: {
            buildCss: {
                src: ['www/modules/**/css/*.scss'],
                dest: 'build/css/style.css'
            },
            srcCss: {
                src: ['www/modules/**/css/*.scss'],
                dest: 'www/css/style.css'
            },
            srcApp: {
                src: [
                    'www/modules/**/*.js',
                    '!www/modules/**/*.spec.js'
                ],
                dest: 'www/js/scripts.js'
            },
            srcLibs: {
                src: ['www/libs/*.js'],
                dest: 'www/js/libs.js'
            }
        },
        wrap:{
            scripts: {
                src: ['www/js/scripts.js'],
                dest: 'www/js/scripts.js',
                options: {
                    wrapper: ["'use strict';\n(function(){", "})();"]
                }
            }
        },
        htmlmin: {                                     // Task
            build: {                                      // Target
                options: {                                 // Target options
                    removeComments: true,
                    collapseWhitespace: true
                },
                files: {                                   // Dictionary of files
                    'build/index.html': 'src/index.html'
                }
            }
        },
        //TODO - concat and use 1 app.js file
        ngtemplates:{
            build:{
                options:{
                    module:'app',         // (Optional) The module the templates will be added to
                    htmlmin: {
                        collapseWhitespace: true,
                        collapseBooleanAttributes: true
                    }
                },
                cwd: 'www/modules',
                src:'**/partials/*.html',
                dest:'build/js/templates.js'
            },
            src:{
                options:{
                    base:'www/modules',        // $templateCache ID will be relative to this folder
                    module:'app'               // (Optional) The module the templates will be added to
                },
                cwd: 'www/modules',
                src: '**/partials/*.html',
                dest: 'www/js/templates.js'
            },
            test: {
                options:{
                    module: 'app',
                },
                cwd: 'www',
                src: 'index.html',
                dest: 'www/js.spec/testTemplates.js'
            }
        },
        //TODO - switch to ng-annotate?
        uglify: {
            buildApp: {
                src: [
                    'www/modules/**/*.js',
                    '!www/modules/**/*.spec.js'
                ],
                dest: 'build/js/scripts.js'
            },
            buildLibs: {
                src: 'www/libs/*.js',
                dest: 'build/js/libs.js'
            }
        },
        sass: {
            build: {
                options: {
                    style: 'compressed',
                    sourcemap: 'none'
                },
                files: {
                    'build/css/style.css': 'build/css/style.css'
                }
            },
            src: {
                options: {
                    style: 'expanded'
                },
                files: {
                    'www/css/style.css': 'www/css/style.css'
                }
            }
        },
        "merge-json": {
            i18nSrc: {
                src: [ "www/modules/**/i18n/en/*.json" ],
                dest: "www/i18n/en.json"
            },
            i18nBuild: {
                src: [ "www/modules/**/i18n/en/*.json" ],
                dest: "build/i18n/en.json"
            }
        },
        watch: {
            jsApp: {
                files: [
                    'www/modules/**/*.js',
                    '!www/modules/**/*.spec.js'
                ],
                tasks: ['newer:concat:srcApp', 'wrap']
            },
            jsLibs: {
                files: ['www/libs/*.js'],
                tasks: ['newer:concat:srcLibs']
            },
            css: {
                files: ['www/modules/**/*.scss'],
                tasks: ['newer:concat:srcCss', 'sass:src'],
            },
            templates: {
                files: ['www/modules/**/partials/*.html', 'www/index.html'],
                tasks: ['ngtemplates:src', 'ngtemplates:test']
            },
            i18n: {
                files: ['www/modules/**/i18n/en/*.json'],
                tasks: ['merge-json:i18nSrc']
            }
        },
        karma: {
            unit: {
                configFile: 'karma.config.js',
                client: {
                    mocha: {
                        reporter: 'html', // change Karma's debug.html to the mocha web reporter
                        ui: 'letbdd'
                    }
                }
            }
        },
        plato: {
            your_task: {
                files: {
                    'reports/plato': [
                        'www/modules/**/*.js',
                        '!www/modules/**/*.spec.js'
                    ]
                }
            }
        },
        connect: {
            src: {
                options: {
                    port: 8008,
                    keepalive: true,
                    hostname: '127.0.0.1'
                    // base: 'src'
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-htmlmin');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-angular-templates');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-wrap');
    grunt.loadNpmTasks('grunt-newer');
    grunt.loadNpmTasks('grunt-merge-json');
    grunt.loadNpmTasks('grunt-plato');
    grunt.loadNpmTasks('grunt-contrib-connect');

    // Default task(s).
    grunt.registerTask('default', [
            'concat',
            'wrap',
            'htmlmin',
            'ngtemplates',
            'uglify',
            'sass',
            'merge-json'
        ]
    );

};
