const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: './src/index.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'build'),
    },
    target: "node",
    node: {
        __dirname: false,
        __filename: false,
    },
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
            },
            {
                exclude: /node_modules/,
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
}
