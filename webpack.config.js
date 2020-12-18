const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

var webpackConfig = {
    mode: getMode(),
    devtool: 'cheap-module-eval-source-map',
    devServer: {
        disableHostCheck: true,
        host: '0.0.0.0',
        hot: true,
        port: 3000,
        contentBase: __dirname + '/build',
        historyApiFallback: true,
    },
    entry: {
        app: `${__dirname}/src/index.ts`,
    },
    output: {
        path: `${__dirname}/build/`,
        publicPath: '/',
        filename: isDev() ? '[name].[hash].js' : 't-catalog.js',
    },
    module: {
        rules: [{
                test: /\.(png|woff|woff2|eot|ttf|svg|pdf|jpg)$/,
                loader: 'url-loader',
                options: {
                    name: '[path][name].[hash].[ext]',
                    limit: 8192,
                    context: 'src',
                },
            },
            {
                test: /\.css$/,
                use: [
                    isDev() ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                ],
            },
            {
                test: /\.scss$/,
                loader: scssRules(),
            },
            {
                test: /\.js$|\.js$/,
                include: /src/,
                exclude: [/node_modules/],
                loader: 'babel-loader',
            },
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    happyPackMode: true,
                    experimentalWatchApi: true,
                    transpileOnly: true,
                },
            },
        ],
    },
    plugins: [
    ],
    resolve: {
        modules: ['src', 'node_modules'],
        extensions: ['.ts', '.js','.scss', '.css'],
    },
    optimization: {
        minimize: isDev() ? false : true,
        splitChunks: {
            chunks: 'initial',
            minSize: 30000,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '~',
            name: true,
            cacheGroups: {
                styles: {
                    name: 'styles',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true,
                    priority: 20,
                },
            },
        },
        minimizer: [
            new UglifyJsPlugin({
                exclude: /\.min\.js$/,
                cache: true,
                parallel: true,
                sourceMap: false,
                extractComments: false,
                uglifyOptions: {
                    compress: {
                        unused: true,
                        drop_debugger: true,
                    },
                    output: {
                        comments: false,
                    },
                },
            }),
        ],
    },
};

if (isDev()) {
    webpackConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            minify: {
                collapseWhitespace: true,
            },
            title: 't-catalog'
        })
    )
    webpackConfig.plugins.push(
        new webpack.HashedModuleIdsPlugin()
    )
}

if (isProd()) {
    Reflect.deleteProperty(webpackConfig, 'devtool');
    webpackConfig.plugins.push(
        new MiniCssExtractPlugin({
            filename: 't-catalog.css',
            chunkFilename: '[id].css',
        })
    );
}

module.exports = webpackConfig;

function scssRules() {
    return [
        isDev() ? 'style-loader' : MiniCssExtractPlugin.loader,
        {
            loader: 'css-loader',
            options: {
                importLoaders: 1,
            },
        },
        {
            loader: 'postcss-loader',
            options: {
                ident: 'postcss',
                plugins: function () {
                    return [require('autoprefixer')];
                },
            },
        },
        'sass-loader',
    ];
}

function isDev() {
    return process.env.NODE_ENV === 'development';
}

function isProd() {
    return process.env.NODE_ENV === 'production';
}

function getMode() {
    return isDev() ? 'development' : 'production';
}