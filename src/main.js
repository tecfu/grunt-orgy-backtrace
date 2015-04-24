var fn = function(files){

	var falafel = require('falafel'),
			fs = require('fs'),
			glob = require('glob'),
			counter = [];
	files.forEach(function(path){

		var code = fs.readFileSync(path,"utf-8");

		//Remove any existing backtrace calls
		code = falafel({source:code,locations:true}, function (node) {
			if(node.type === 'CallExpression'){
				var source = node.source();
				if(source.search(/backtrace(.*)/) !== -1){
					var newSource = source.replace(/\.backtrace(.*)/,'');
					node.update(newSource);
				}
			}
		});

		//Add new ones
		var output = falafel({
			source:code,
			locations:true
			}, function (node) {
			if(node.type === 'CallExpression'){
				var source = node.source();
				if(source.search(/Orgy.deferred/) !== -1 &&
				source.search(/.backtrace/) === -1){
					counter.push(path+":"+node.loc.start.line);
					var obj = {
						line : node.loc.start.line,
						file : path
					};
					var oStr = JSON.stringify(obj);
					var newSource = source + '.backtrace('+oStr+')';
					node.update(newSource);
				}
			}
		});
	});

	if(counter.length){
		console.log("Added orgy-js backtrace support to " + counter);	
	}
};

module.exports = fn;
