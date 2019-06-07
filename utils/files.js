'use strict';

const fs = require('fs');
const path = require('path');

const listFiles = (dir, done) => {
  let results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    let i = 0;
    (function next() {
      let file = list[i++];
      if (!file) return done(null, results);
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          listFiles(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};


const ensureDirectoryExist = (filePath) => {
  let dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  ensureDirectoryExist(dirname);
  fs.mkdirSync(dirname);
}


module.exports = {
  listFiles,
  ensureDirectoryExist
};
