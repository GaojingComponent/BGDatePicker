// Karma configuration
// Generated on Mon Feb 01 2016 21:34:22 GMT+0800 (中国标准时间)
var webpack = require('karma-webpack');
module.exports = function(config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],

        // list of files / patterns to load in the browser
        files: [
            'test/date-picker.spec.js'
        ],

        // list of files to exclude
        exclude: [
        ],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
            'src/js/*.js': ['webpack'],
            'test/*.spec.js': ['webpack']
        },

        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],//, 'coverage', 'verbose'],

        coverageReporter:{
            reporters: [{
                type:'text-summary'
            }, {
                type: 'html',
                dir: 'test/coverage'
            }, {
                type: 'cobertura',
                subdir: '.',
                dir: 'test/coverage'
            }]
        },

        webpack: {
            module: {
                loaders: [{
                  test: /\.(js|jsx)$/, exclude: /(bower_components|node_modules)/,
                  loader: 'babel-loader'
                }],
                postLoaders: [{
                  test: /\.(js|jsx)$/, exclude: /(node_modules|bower_components|test)/,
                  loader: 'istanbul-instrumenter'
                }]
            }
        },

        // web server port
        port: 9876,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],

        plugins: [
            webpack,
            'karma-jasmine',
            'karma-coverage',
            'karma-verbose-reporter',
            'karma-phantomjs-launcher',
            'karma-chrome-launcher'
        ],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
