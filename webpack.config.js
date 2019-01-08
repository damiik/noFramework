const path = require('path');

const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
    mode: devMode ? 'development' : 'production',
    
    entry: './app/app.js', //an entry point for the application
    
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
      },
    module: {

        rules: [

            {
                // Look for JavaScript files and apply the babel-loader
                // excluding the './node_modules' directory. It uses the
                // configuration in `.babelrc`
                test: /\.(js)$/,
                exclude: /node_modules/,
                use: {

                    loader: 'babel-loader',
                    options: {
                        
                      presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                  'file-loader'
                ]
            },
            {
                test: /\.(scss|css)$/,
                use: [
                  'style-loader',
                  'css-loader',
                  'sass-loader'
                ]
            }
        ]
    }

};