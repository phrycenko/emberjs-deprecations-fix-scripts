'use strict';

const t = require('tap');
const fs = require('fs');
const rimraf = require('rimraf');
const spawn = require('child_process').spawn;
const node = process.execPath;
const filesUtils = require('../utils/files');
const fixScripts = require.resolve('../bin/emberjs-deprecations-fix-scripts');

const sourcePath = __dirname + '/dummy-root';
const targetPath = __dirname + '/temp';
const shouldBePath = __dirname + '/shouldbe-root';

t.test('setup', (t) => {
  rimraf.sync(targetPath);
  process.chdir(__dirname);
  t.end();
});


t.test('compare results to shoulbe files', (t) => {

  var child = spawn(node, [fixScripts, 'PROPERTY', sourcePath, targetPath], { "cwd": "." })
  child.on('exit', (code) => {

    filesUtils.listFiles(targetPath, (err, results) => {
      if (err) throw err;

      results.forEach( (filePath) => {

        var processedContent = fs.readFileSync(filePath, 'utf8');
        var shouldBeContent = fs.readFileSync(filePath, 'utf8');
        t.equal(processedContent, shouldBeContent);

      });

      t.end();

    });
  });
});


t.test('cleanup', (t) => {
  rimraf.sync(targetPath);
  t.end();
})


