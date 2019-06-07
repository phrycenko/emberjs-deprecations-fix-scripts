#!/usr/bin/env node

'use strict';

var fs = require('fs');
const chalk = require('chalk');
const Confirm = require('prompt-confirm');
const filesUtils = require('../utils/files');

const logInfo = (text) => console.log(chalk.blue(text));
const logError = (text) => console.log(chalk.bold.red(text));
const logWarn = (text) => console.log(chalk.bold.yellow(text));
const logSuccess = (text) => console.log(chalk.bold.green(text));

/**
    eg. call node emberjs-deprecations-repleacer.js PROPERTY ./dummy-root ./_processed
**/

const DEPRECATION_PROPERTY = 'PROPERTY';

const SUPPORTED_DEPRECATIONS = [ DEPRECATION_PROPERTY ];

if(!process.argv[2] || !process.argv[3]) {

  logError('Insufficient number of arguments! Give deprecation type and source directory path and optionally target directory path if different than the source');

} else {

  let targetDir = process.argv[4];

  if(!targetDir) {
    targetDir = process.argv[3];
  }

  if(targetDir === process.argv[3]) {
    const prompt = new Confirm('Source and target dir is the same, are you sure you would like to override your source files ? ');

    prompt.ask( (answer) => {
      if(answer) {
        run(process.argv[2], process.argv[3], targetDir);
      }
    });

  } else {
    run(process.argv[2], process.argv[3], targetDir);
  }

}


function run(deprecation, sourceDirPath, targetDirPath) {

  if(sourceDirPath.endsWith('/')) {
    sourceDirPath = sourceDirPath.substring(0, sourceDirPath.length-1);
  }

  if(targetDirPath.endsWith('/')) {
    targetDirPath = targetDirPath.substring(0, targetDirPath.length-1);
  }

  switch(deprecation) {

    case DEPRECATION_PROPERTY :
      replacePropertyDeprecations(sourceDirPath, targetDirPath);
    default:
      return;
      logError('Please specify supported deprecation type: ' + SUPPORTED_DEPRECATIONS.join(' or ') );

  }

}

function replacePropertyDeprecations(sourceDirPath, targetDirPath) {

  filesUtils.listFiles(sourceDirPath, (err, results) => {
    if (err) throw err;
    results.forEach( (filePath) => {
      processFile(filePath, sourceDirPath, targetDirPath);
    });

    logSuccess("Done!");
  });

}

function processFile(filePath, sourcedirPath, targetDirPath) {

  logInfo('Processing file: ' + filePath );

  let targetPath = filePath.replace(sourcedirPath, targetDirPath);

  filesUtils.ensureDirectoryExist(targetPath);

  let content = fs.readFileSync(filePath, 'utf8');

  content = replacePropertyDeprecation(filePath, content);

  fs.writeFileSync(targetPath, content, { flag: 'w' });

}


function replacePropertyDeprecation(filePath, fileContent) {

  if(fileContent.includes('.property')) {

    logWarn("Property deprecation found at file: " + filePath);

    let parts = fileContent.split('.property');

    let toComputeAmount = parts.length;
    let newContemt = '';

    let i = 0;

    for(i ; i < toComputeAmount-1; i++) {

      var pre = parts[i];
      let post = parts[i+1];
      let postPropsEndIndex = post.indexOf(')');
      let neededPost = post.substring(0, postPropsEndIndex);

      parts[i+1] = post.substring(postPropsEndIndex+1);

      pre = pre.replace('function', 'computed' + neededPost + ', function') ;

      newContemt += pre;

    }

    return newContemt + parts[parts.length - 1];

  } else {

    logSuccess("No property deprecation found at file: " + filePath);
    return fileContent;

  }

}


