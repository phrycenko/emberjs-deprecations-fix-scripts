# emberjs-deprecations-fix-scripts

This package includes scripts which will help you to get rid of EmberJS deprecated things.<br>

## Install 

Run `npm install emberjs-deprecations-fix-scripts`

## API

Currently only one type of deprecation is supported - to use a computed instead of property.

Example deprecated code 

```javascript
showGroupAvatar: function() {
  return this.get('thread.isGroupChat') || this.get('thread.isEventChat');
}.property('thread.isGroupChat', 'thread.isEventChat');
```


... now should look like

```javascript
showGroupAvatar: computed('thread.isGroupChat', 'thread.isEventChat', function() {
  return this.get('thread.isGroupChat') || this.get('thread.isEventChat');
};
```

And this is how this script works.

## Running

To run this script, you can eg add below to your ```package.json``` scripts

```javascript
"fix-start": "emberjs-deprecations-fix-scripts PROPERTY ./test/dummy-root ./test/temp",
```

and then run ```npm run-script fix-start``` from command line

Where ```PROPERTY``` is deprecation type constant.
```./test/dummy-root``` is source root directore which will be used to search files containing deprecated code,
and ```./test/temp``` is the target root directore which will be used to copy all files from source directory including those with deprecations replaced,

You can ommit target directory path - then source directory will be used as target but BE AWARE that files will be overriden.

