'use strict';

const path = require('path');

module.exports = {
 
  // production mode
  mode: "production",

  // input file
  entry: "./src/index.js",

  // output file
  output: {
      //path
      path: path.resolve(__dirname, 'dist'),

      // file name
      filename: "bundle.js"
  }
}

