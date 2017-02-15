var path = require('path');
var APP_PATH = path.resolve(__dirname, './component/main.js');
var BUILD_PATH = path.resolve(__dirname, './build');

module.exports = {
    entry: APP_PATH,

    output: {
        path: BUILD_PATH,
        filename: 'bundle.js',
    },

    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel-loader',

            query: {
                presets: ['es2015', 'react', 'stage-2'] //stage-2 : analysis the spread operator
            }
        }, {
            test: /\.less$/,
            exclude: /node_modules/,
            loader: 'style-loader!css-loader!less-loader'
        }, {
            test: /\.html$/,
            exclude: [/node_modules/],
            loader: 'html'
        }]
    },
};
