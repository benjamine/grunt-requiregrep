Grunt RequireDep Task
==================

Searchs for dependencies required on your source code (eg. template files) and generates an AMD module from it.

Example:

```` html
<!-- a/path/to/page.html -->
<!-- require("jquery, widgets, twitter") -->

<!-- another/path/to/anotherpage.html -->
<!-- require("jquery, widgets, fx") -->
````

Running ```grunt requiredep``` can generate:

```` javascript
// all.js
define(['jquery', 'widgets', 'twitter', 'fx'], function()){
	console.log('all modules loaded');
});
````

Now you can include this new module in your requirejs main config file. This allows you to use a AMD bundler like r.js (check [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs)).

## Installation
Install this grunt plugin next to your project's [grunt.js gruntfile][getting_started] with: `npm install grunt-contrib-requiregrep`

Then add this line to your project's gruntfile:

```javascript
grunt.loadNpmTasks('grunt-requiregrep');
```

[npm_registry_page]: http://search.npmjs.org/#/grunt-requiregrep
[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

Supports the following options:

- files: source files to grep for AMD dependencies (eg. *.html).
- dest: output filename (eg ```all.js```)
- options:
  - requirePattern: regex to detect dependencies on source files, first capture group should be a comma-separated list of module names. default: ```/require\(\s*[\'\"]([^\'\"]*)[\'\"]/gi```
  - moduleName: output module name. default: null, ie. anonymous module
  - onLoad: code to include on module load (eg. ```console.log('all modules loaded!');```). default: ''
  - forEachFile: function that will be called for each parsed file with these arguments: file, contents, registerDependency (use this function add a dependency)

## Example Usage
```javascript
/*jslint node:true*/

module.exports = function (grunt) {

	'use strict';

	grunt.loadNpmTasks('grunt-requiregrep'); // load the task

	grunt.initConfig({
		watch: {
			files: '<config:requiregrep.files>',
			tasks: 'requiregrep'
		},

		requiregrep: { // configure the task
			all: {
				files: [ // some example files
					'home.html',
					'view/**/*.html'
				],
				dest: 'scripts/all.js',
				options: {
					onLoad: 'if (window.console){window.console('all modules loaded');}', // run after all dependencies are loaded
				}
			}
		}
	});

	grunt.registerTask('default', 'watch');
};
```

