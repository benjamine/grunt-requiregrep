/*
 * grunt-contrib-requiregrep
 * http://gruntjs.com/
 *
 * Copyright (c) 2012 Benjamin Eidelman
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {
    'use strict';

    grunt.registerMultiTask('requiregrep', 'Creates AMD module with dependencies extracted from source files.', function() {

        var src = grunt.helper('requiregrep', this.data);

        if (this.errorCount) {
            return false;
        } else {
            grunt.file.write(this.file.dest, src);
            grunt.log.writeln("Saved " + this.data.dest);
            return true;
        }
    });

    // ==========================================================================
    // HELPERS
    // ==========================================================================

    grunt.registerHelper('requiregrep', function(config) {

        var options = config.options;

        var fs = require('fs');
        var files = grunt.file.expandFiles(config.files || '**/*.html');

        var requirePattern = options.requirePattern || /require\(\s*[\'\"]([^\'\"]*)[\'\"]/gim;
        var dependencies = [];
        var dependenciesByFile = {};



        files.forEach(function(file) {
            var contents = fs.readFileSync(file, 'utf8');
            requirePattern.lastIndex = 0;
            var match = requirePattern.exec(contents);
            var registerDependency = function(dependencyName) {
                var depByFile = (dependenciesByFile[file] = dependenciesByFile[file] || []);
                if (depByFile.indexOf(dependencyName) < 0) {
                    depByFile.push(dependencyName);
                }
                if (dependencies.indexOf(dependencyName) < 0) {
                    dependencies.push(dependencyName);
                }
            };
            while(match) {
                var deps = match[1].replace(/[\s]+/g,'').split(',');
                deps.forEach(registerDependency);
                match = requirePattern.exec(contents);
            }
        });

        var prependText = null;
        if (config.prepend) {
            prependText = grunt.template.process(config.prepend, {
                dependencies: dependencies,
                dependenciesByFile: dependenciesByFile
            });
        }

        var moduleName = options.moduleName;

        var moduleDef = [];
        if (prependText) {
            moduleDef.push(prependText+'\n');
        }
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

        grunt.log.writeln('Created module '+(moduleName||'<anonymous>')+' with dependencies: ' + dependencies);

        return moduleDef.join('');

    });

};