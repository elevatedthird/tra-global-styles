const path = require('path');

const staticEntries = {
  'css/global': '../source/01-global/scss/global.scss',
  'css/wysiwyg': '../source/01-global/scss/wysiwyg.scss',
  'css/utilities': '../source/01-global/scss/utilities.scss',
}

const libraryGlobList = {
  scss: [
    `${path.resolve('source')}/02-layout/**/*.scss`,
    `${path.resolve('source')}/03-atom/**/*.scss`,
    `${path.resolve('source')}/04-molecule/**/*.scss`,
    `${path.resolve('source')}/05-organism/**/*.scss`,
    `${path.resolve('source')}/06-page/**/*.scss`,
    `${path.resolve('source')}/07-plugable/**/*.scss`,
  ],
  js: [
    `${path.resolve('source')}/02-layout/**/*.js`,
    `${path.resolve('source')}/03-atom/**/*.js`,
    `${path.resolve('source')}/04-molecule/**/*.js`,
    `${path.resolve('source')}/05-organism/**/*.js`,
    `${path.resolve('source')}/06-page/**/*.js`,
    `${path.resolve('source')}/07-plugable/**/*.js`,
  ],
};


module.exports = { staticEntries, libraryGlobList };
