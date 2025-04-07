const path = require('path');
const copydir = require('copy-dir');
const fs = require('fs');
const inquirer = require('inquirer');

async function generate() {
  const type = await getType();
  const types = {
    layout: '02-layout',
    atom: '03-atom',
    molecule: '04-molecule',
    organism: '05-organism',
    page: '06-page',
  };
  const componentDirName = types[type] ?? false;
  const componentDirectory = `${path.resolve('source')}/${componentDirName}`;
  const filepath = await getComponentPath(componentDirectory);
  const makeJs = await hasJs();
  const makeScss = await hasScss();
  const pathToExample = `${path.resolve(__dirname)}/scaffold/example/`;
  const targetPath = `${componentDirectory}${filepath}`;
  let libraryPathArray = `${targetPath}`;
  libraryPathArray = libraryPathArray.split('/');
  const libraryPathSplice = libraryPathArray.indexOf(types[type]);
  libraryPathArray = libraryPathArray.splice(libraryPathSplice);
  const fileName = libraryPathArray[libraryPathArray.length - 1];
  libraryPathArray.shift();
  const libraryName = libraryPathArray.join('--');
  if (componentDirName && !fs.existsSync(targetPath)) {
    console.log('Copying Example');
    await fs.mkdirSync(targetPath, { recursive: true });

    await copydir.sync(pathToExample, targetPath, {
      utimes: true,  // keep add time and modify time
      mode: true,    // keep file mode
      cover: true    // cover file when exists, default is true
    });

    // I fully know the below is bad i will refactor when i have time
    console.log('Copy Complete');
    const name = fileName;
    const jsPath = `${targetPath}/example.js`;
    if (!makeJs) {
      fs.unlink(jsPath, (err) => {
        if (err) throw err;
        console.log(`${jsPath} was deleted`);
      });
    } else {
      await fs.promises.rename(jsPath, `${targetPath}/${name}.js`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });
      contentReplace(`${targetPath}/${name}.js`, type, libraryName);
    }
    const scssPath = `${targetPath}/_example.scss`;
    if (!makeScss) {
      fs.unlink(scssPath, (err) => {
        if (err) throw err;
        console.log(`${scssPath} was deleted`);
      });
    } else {
      await fs.promises.rename(scssPath, `${targetPath}/_${name}.scss`, function(err) {
        if ( err ) console.log('ERROR: ' + err);
      });
      contentReplace(`${targetPath}/_${name}.scss`, type, libraryName);
    }

    await fs.promises.rename(`${targetPath}/example.twig`, `${targetPath}/${name}.twig`, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });

    contentReplace(`${targetPath}/${name}.twig`, type, libraryName);

    await fs.promises.rename(`${targetPath}/example.yml`, `${targetPath}/${name}.yml`, function(err) {
      if ( err ) console.log('ERROR: ' + err);
    });

  }
}

async function getType() {
  const questions = [
    {
      type: 'list',
      name: 'componentType',
      message: 'What is the type of the component?',
      choices: [
        'layout',
        'atom',
        'molecule',
        'organism',
        'page',
      ]
    },
  ];
  const { componentType } = await inquirer.prompt(questions);
  return componentType.trim();
}

async function getComponentPath(path) {
  const questions = [
    {
      type: 'input',
      name: 'componentName',
      message: `Relative path within (start with /) ${path}`,
    },
  ];
  const { componentName } = await inquirer.prompt(questions);
  return componentName.trim();
}

function machineName(name) {
  return name.split(' ').join('-').toLowerCase();
}

async function hasJs() {
  const questions = [
    {
      type: 'confirm',
      name: 'makeJs',
      message: 'Should we generate a js file?',
    },
  ];
  const { makeJs } = await inquirer.prompt(questions);
  return makeJs;
}

async function hasScss() {
  const questions = [
    {
      type: 'confirm',
      name: 'makeScss',
      message: 'Should we generate a Scss file?',
    },
  ];
  const { makeScss } = await inquirer.prompt(questions);
  return makeScss;
}
function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return word.toUpperCase();
  }).replace(/\s+/g, '').replaceAll('-','');
}

async function contentReplace(file, type, name) {
   fs.readFile(file, 'utf8', function (err,data) {
    if (err) {
      return console.log(err);
    }

    var mapObj = {'ZtypeZ': type, 'ZpathZ': name, 'ZcamelNameZ': camelize(name)};

    var re = new RegExp(Object.keys(mapObj).join("|"),"gi");
    const result = data.replace(re, function(matched){
      return mapObj[matched];
    });

    fs.writeFile(file, result, 'utf8', function (err) {
      if (err) return console.log(err);
    });
  });
}

generate();
