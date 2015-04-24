/*
 * grunt-orgy-backtrace
 * https://github.com/root/grunt-orgy-backtrace
 *
 * Copyright (c) 2015 tecfu
 * Licensed under the MIT license.
 */

'use strict';

var path = require("path");
var sp = path.resolve(__dirname + '/../src/main.js');
var main = require(sp);

module.exports = function(grunt) {

	// Please see the Grunt documentation for more information regarding task
	// creation: http://gruntjs.com/creating-tasks

	grunt.registerMultiTask('orgy_backtrace', 'Filename, line number backtrace support for orgy-js.', function() {

		// Iterate over all specified file groups.
		this.files.forEach(function(f) {
			// Concat specified files.
			var src = f.src.filter(function(filepath) {
				// Warn on and remove invalid source files (if nonull was set).
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			});

			main(src);
		});
	});
};
