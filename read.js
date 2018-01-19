const fs = require("fs");

//Read the file
fs.readFile('vocab.txt', function(err, data){
	var lines = (data + '').split('\n');
	var counter = 0;
	var file = [];
	var fileCounter = 1;
	for(index in lines){
		console.log("reading line: " + index);
		counter ++;
		if(counter <= 50){
			file.push(lines[index]);
			if(counter == 50){
				counter = 0;
				fs.writeFile('vocab-' + fileCounter + '.txt', file.join('\n'), function(err){});
				file = [];
				fileCounter++;
			}
		}
	}
});