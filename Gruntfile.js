module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: ([
                    '/*! <%= pkg.name %> <%= pkg.version %>',
                    ' *  <%= pkg.author %>, <%= pkg.license %> license */',
                    '/* globals define, module, exports, require */\n'
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
                    /**
                    ============================================================
                    BROWSER BUNDLES
                    ============================================================
                    Core
                    **/
                    'builds/funkyjs2.bundled.min.js': [
                        'sources/_birds.js',
                        'sources/type.js',
                        'sources/arity.js',
                        'sources/lenses.js',
                        'sources/objects.js',
                        'sources/arrays.js',
                        'sources/decorators.js',
                        'sources/combinators.js',
                        'sources/contracts.js',
                        'sources/functors.js',
                        'sources/combinators.async.js',
                        'sources/decorators.beyond.js',
                        'sources/iterators.js',
                        'sources/trampolines.js',
                        'sources/strings.js',
                        'sources/advices.js'
                    ],

                    /**
                    ============================================================
                    AMD/COMMONJS BUNDLES
                    ============================================================
                    Core
                    **/
                    'builds/amd-cjs/birds.js': 'sources/_birds.js',
                    'builds/amd-cjs/type.js': 'sources/type.js',
                    'builds/amd-cjs/objects.js': 'sources/objects.js',
                    'builds/amd-cjs/arrays.js': 'sources/arrays.js',
                    'builds/amd-cjs/arity.js': 'sources/arity.js',
                    'builds/amd-cjs/lenses.js': 'sources/lenses.js',
                    'builds/amd-cjs/decorators.js': 'sources/decorators.js',
                    'builds/amd-cjs/combinators.js': 'sources/combinators.js',
                    'builds/amd-cjs/contracts.js': 'sources/contracts.js',
                    'builds/amd-cjs/functors.js': 'sources/functors.js',
                    'builds/amd-cjs/combinators2.js': 'sources/combinators.async.js',
                    'builds/amd-cjs/decorators2.js': 'sources/decorators.beyond.js',
                    'builds/amd-cjs/iterators.js': 'sources/iterators.js',
                    'builds/amd-cjs/trampolines.js': 'sources/trampolines.js',
                    'builds/amd-cjs/strings.js': 'sources/strings.js',
                    'builds/amd-cjs/advices.js': 'sources/advices.js',

                    /**
                    ============================================================
                    ADAPTERS
                    ============================================================
                    **/
                    'builds/adapters/dom.js': 'sources/adapters/dom/funkyDOM_jquery.js'
                }
            }
        },
        copy: {
            main: {
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['builds/*.bundled.min.js'],
                    dest: 'builder/libs/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    flatten: false,
                    cwd: 'builds/',
                    src: ['amd-cjs/**/*.js', 'adapters/dom.js'],
                    dest: 'builder/sources/',
                    filter: 'isFile'
                }, {
                    expand: true,
                    flatten: false,
                    src: ['logo.png'],
                    dest: 'docs/',
                    filter: 'isFile'
                }]
            }
        },
        yuidoc: {
            build: {
                name: '<%= pkg.name %>',
                version: '<%= pkg.version %>',
                description: '<%= pkg.description %>',
                logo: 'logo.png',
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
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register Tasks
    grunt.registerTask('default', ['uglify', 'yuidoc', 'copy']);

};