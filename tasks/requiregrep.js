/*
 * grunt-contrib-depgrep
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Benjamin Eidelman
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    // TODO: ditch this when grunt v0.4 is released
    grunt.util = grunt.util || grunt.utils;

    grunt.registerTask('requiregrep', 'Extract AMD dependencies from source files.', function() {

        require('shelljs/global');
        var fs = require('fs');
        var path = require('path');

        var _ = grunt.util._;
        var kindOf = grunt.util.kindOf;
        var helpers = require('grunt-lib-contrib').init(grunt);
        var options = helpers.options(this, {logLevel: 0});

        grunt.verbose.writeflags(options, 'Options');


        var fileRegex = options.files || /.*html$/;
        if (typeof fileRegex == 'string') {
            fileRegex = new RegExp('^'+fileRegex.replace('*','.*')+'$');
        }
        var files = find(options.folder || '.').filter(function(file) { return file.match(fileRegex); });

        var requirePattern = options.requirePattern || /require\(\s*[\'\"]([^\'\"]*)[\'\"]/g;

        var dependencies = [];
        files.forEach(function(file) {
            var contents = fs.readFileSync(file, 'utf8'),
            lines = contents.split(/\r*\n/);
            lines.forEach(function(line) {
                requirePattern.lastIndex = 0;
                var match;
                while(match = requirePattern.exec(line)) {
                    var deps = match[1].replace(/[\s]+/g,'').split(',');
                    deps.forEach(function(dep) {
                        if (dependencies.indexOf(dep) < 0){
                            dependencies.push(dep);
                        }
                    });
                    //console.log(match[1].replace(/[\s]+/g,'').split(','), ' at '+file);
                }
            });
        });

        var moduleName = options.moduleName;

        var moduleDef = [];
        moduleDef.push("define(");
        if (moduleName) {
            moduleDef.push("'", moduleName, "',");
        }
        if (dependencies.length) {
            moduleDef.push("[");
            moduleDef.push(dependencies.map(function(name){
                return "'"+name+"'";
            }).join(','));
            moduleDef.push("],");            
        }
        moduleDef.push("function(){");
        if (options.onLoad) {
            moduleDef.push('\n',options.onLoad,'\n');
        }
        moduleDef.push("});");
        var fileName = options.fileName || (moduleName + '.js');
        fs.writeFileSync(fileName, moduleDef.join(''));

        console.log('module '+(moduleName||'<anonymous>')+' saved at '+fileName+' with dependencies:', dependencies);
    });
};
