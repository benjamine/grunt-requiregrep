Grunt Require-Grep Task
==================

Searchs for AMD modules required on your source code (eg. template files) and generates an AMD module from it.

Example:

```` html
<!-- a/path/to/page.html -->
<!-- require("jquery, widgets, twitter") -->

<!-- another/path/to/anotherpage.html -->
<!-- require("jquery, widgets, fx") -->
````

Running grunt-requiregrep can generate:

```` javascript
define(['jquery', 'widgets', 'twitter', 'fx'], function()){
	console.log('all modules loaded');
});
````

Now you can include this new module in your requirejs main config file. This way if you use a bundler like r.js (check [grunt-contrib-requirejs](https://github.com/gruntjs/grunt-contrib-requirejs)) it will include all modules used on your source files automatically.

## Installation
Install this grunt plugin with: `npm install grunt-requiregrep`

Then add this line to your [grunt.js gruntfile][getting_started]:

```javascript
grunt.loadNpmTasks('grunt-requiregrep');
```

[npm_registry_page]: http://search.npmjs.org/#/grunt-requiregrep
[grunt]: https://github.com/cowboy/grunt
[getting_started]: https://github.com/cowboy/grunt/blob/master/docs/getting_started.md

## Documentation

Supports the following options:

- src/files: source files to grep for AMD dependencies (default: **/*.*html).
- dest: output filename (eg ```all.js```)
- options:
  - requirePattern: regex to detect dependencies on source files, first capture group should be a comma-separated list of module names. default: ```/require\(\s*[\'\"]([^\'\"]*)[\'\"]/gi```
  - moduleName: output module name. default: null, ie. anonymous module
  - onLoad: code to include on module load (eg. ```console.log('all modules loaded!');```).
  - forEachFile: function that will be called for each parsed file with these arguments: file, contents, registerDependency (use this function add a dependency programmatically)

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
				files: {
					'scripts/all.js': [
						'home.html',
						'view/**/*.html'
					]
				},
				options: {
					onLoad: 'if (window.console){window.console('all modules loaded');}', // run after all dependencies are loaded
				}
			}
		}
	});

	grunt.registerTask('default', 'watch');
};
```

