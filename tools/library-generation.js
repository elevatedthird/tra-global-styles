const write_yaml = require('write-yaml');
const merge = require('lodash.merge');
const _set = require('lodash.set');
const glob = require('glob');
const { libraryGlobList } = require('./config');

function processLibraries(acc, path, type) {
  const pathArr = path.split('/');
  const libName = pathArr.slice(pathArr.indexOf('source') + 1, -1);
  const regex = /[^a-z]/ig;
  prefix = libName[0].replace(regex, '');
  libName.splice(0, 1);
  libName.unshift(prefix);
  const entry = libName.join('--');
  let ext = pathArr[pathArr.length - 1].split('.').pop();
  if (!Object.prototype.hasOwnProperty.call(acc, entry)) {
    acc[entry] = {};
    _set(acc[entry], 'dependencies', ['aries/aries']);
  }
  if (ext === 'scss') {
    ext = 'css';
    _set(acc[entry], `css.theme['dist/css/${entry}.css']`, {});
  }
  if (ext === 'js') {
    const file = pathArr[pathArr.length - 1].replace('.js', '').replace('_', '');
    if (file !== 'config') {
      _set(acc[entry], `js['dist/js/${entry}.js']`, {});
    } else {
      const config = require(path);
      // set the default dep
      if (Object.prototype.hasOwnProperty.call(config, 'dependencies')) {
        config.dependencies.push('aries/aries');
      }

      // merge in the config js. does not support attributes yet.
      const merged = merge(acc[entry], config);
      acc[entry] = merged;
    }
  }
  return acc;
}

let libraries = {};
Object.keys(libraryGlobList).forEach((key) => {
  libraryGlobList[key].forEach((entry) => {
    const globLibraries = glob.sync(entry).reduce((acc, path) => processLibraries(acc, path, key), {});
    libraries = merge(libraries, globLibraries);
    // Object.assign(libraries, globLibraries);
  });
});
const data = libraries;

write_yaml('partials.yml', data, (err) => {
  console.log('generating partials.yml');
  if (err) {
    console.error('ERROR: Could not generate partials.yml');
  }
});
