const glob = require('glob');
const { libraryGlobList } = require('./config');

function processGlob(acc, path, type) {
  const pathArr = path.split('/');
  const partialsIndex = pathArr.indexOf('source');
  const entry = pathArr[pathArr.length - 1].replace(`.${type}`, '').replace('_', '');
  if (entry !== pathArr[pathArr.length - 2]) {
    return acc;
  }
  let prefix = '';
  pathArr.splice(0, partialsIndex + 1);
  const regex = /[^a-z]/ig;
  prefix = pathArr[0].replace(regex, '');
  pathArr.splice(0, 1);
  pathArr.pop();
  const newType = (type === 'scss' ? 'css' : type);
  if (prefix.length > 0) {
    prefix += '--';
  }
  acc[`${newType}/${prefix}${pathArr.join('--')}`] = path;
  return acc;
}


const entries = {};
Object.keys(libraryGlobList).forEach((key) => {
  libraryGlobList[key].forEach((entry) => {
    const globEntries = glob.sync(entry).reduce((acc, path) => processGlob(acc, path, key), {});
    Object.assign(entries, globEntries);
  });
});

module.exports = entries;
