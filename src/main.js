var fn = function(files){

	var falafel = require('falafel'),
			fs = require('fs'),
			glob = require('glob'),
			counter = [];

	for(var i in files){

		var path = files[i];
		var code;

		try {
			code = fs.readFileSync(path,"utf-8");
		} catch (e) {
			console.error("Could not open file: "+path);
			continue;
		}

		try {
			code = falafel({source:code,locations:true}, function (node) {
				if(node.type === 'CallExpression'){
					var source = node.source();
					if(source.search(/._btrc(.*)/) !== -1){
						var newSource = source.replace(/._btrc(.*)/,'');
						node.update(newSource);
					}
				}
			});
		} catch (e){
			console.warn("Could not parse because of syntax error\n: "+path);
			console.log(e);
			continue;
		}

		//Add new ones
		var output = falafel({
			source:code,
			locations:true
			}, function (node) {

			if(node.type === 'CallExpression'){
				var source = node.source();
				if((source.search(/Orgy.deferred/) !== -1
				|| source.search(/Orgy.queue/) !== -1)
				&& source.search(/._btrc/) === -1){
					counter.push(path+":"+node.loc.start.line);
					var arr = [
						path,node.loc.start.line,
					];
					var oStr = JSON.stringify(arr);
					var newSource = source + '._btrc('+oStr+')';
					node.update(newSource);
				}
			}
		});

		//Write file
		fs.writeFileSync(path,output);
	}

	if(counter.length){
		console.log("\nScanned "+files.length+" files and added orgy-js _btrc support in "+counter.length+" places:");
		console.log(counter.join("\n"));
	}
};

module.exports = fn;
