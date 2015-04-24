module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: ([
                    '/*! <%= pkg.name %> <%= pkg.version %>',
                    ' *  <%= pkg.author %>, <%= pkg.license %> license */',
                    '/* globals define, module, exports, require */'
                ].join('\n')),
                mangle: {
                    except: [
                        'require',
                        'define',
                        'exports',
                        'module'
                    ]
                }
            },
            build: {
                files: {
                    'builds/funkyjs2.browser.min.js': [
                        'sources/_core.js',
                        'sources/_birds.js',
                        'sources/type.js',
                        'sources/arity.js',
                        'sources/lambdas.js',
                        'sources/objects.js',
                        'sources/arrays.js',
                        'sources/decorators.js',
                        'sources/combinators.js'
                    ],
                    'builds/funkyjs2-amd-cjs/birds.js': 'sources/_birds.js',
                    'builds/funkyjs2-amd-cjs/type.js': 'sources/type.js',
                    'builds/funkyjs2-amd-cjs/lambdas.js': 'sources/lambdas.js',
                    'builds/funkyjs2-amd-cjs/objects.js': 'sources/objects.js',
                    'builds/funkyjs2-amd-cjs/arrays.js': 'sources/arrays.js',
                    'builds/funkyjs2-amd-cjs/arity.js': 'sources/arity.js',
                    'builds/funkyjs2-amd-cjs/decorators.js': 'sources/decorators.js',
                    'builds/funkyjs2-amd-cjs/combinators.js': 'sources/combinators.js'
                }
            }
        },
        yuidoc: {
            build: {
                name: '<%= pkg.name %>',
                version: '<%= pkg.version %>',
                description: '<%= pkg.description %>',
                options: {
                    // themedir: 'docs/theme/',
                    paths: 'sources/',
                    outdir: 'docs/'
                }
            }
        }
    });

    // Load the plugins.
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-yuidoc');

    // Register Tasks
    grunt.registerTask('default', ['uglify', 'yuidoc']);

};