var path = require('path');

module.exports = {
    entry: './src/js/bg-date-picker.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist/js/',
        filename: 'bg-date-picker.js'
    },
    module: {
        loaders:[
            {
                test: /\.js$/,
                loader: 'babel',
                exclude: /node_modules/
            }
        ]
    },
};
