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
                    /**
                    ============================================================
                    BROWSER BUNDLES
                    ============================================================
                    Core
                    **/
                    'builds/funkyjs2.browser.min.js': [
                        'sources/_core.js',
                        'sources/_birds.js',
                        'sources/type.js',
                        'sources/arity.js',
                        'sources/lenses.js',
                        'sources/objects.js',
                        'sources/arrays.js',
                        'sources/decorators.js',
                        'sources/combinators.js'
                    ],
                    /**
                    Extensions
                    **/
                    'builds/funkyjs2.ext.browser.min.js': [
                        'sources/extensions/contracts.js',
                        'sources/extensions/functors.js',
                        'sources/extensions/decorators.js',
                        'sources/extensions/iterators.js',
                        'sources/extensions/trampolines.js',
                        'sources/extensions/strings.js',
                        'sources/extensions/classes.js'
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
                    /**
                    Extensions
                    **/
                    'builds/amd-cjs/ext/contracts.js': 'sources/extensions/contracts.js',
                    'builds/amd-cjs/ext/functors.js': 'sources/extensions/functors.js',
                    'builds/amd-cjs/ext/decorators.js': 'sources/extensions/decorators.js',
                    'builds/amd-cjs/ext/iterators.js': 'sources/extensions/iterators.js',
                    'builds/amd-cjs/ext/trampolines.js': 'sources/extensions/trampolines.js',
                    'builds/amd-cjs/ext/strings.js': 'sources/extensions/strings.js',
                    'builds/amd-cjs/ext/classes.js': 'sources/extensions/classes.js'
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