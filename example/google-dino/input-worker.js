function JSONToArray(data) {
    var arr = [];
	var total_val = 0;
	var c = 0;
	
    for (var key in data) {
		if(key % 4 == 0) {
        	var value = data[key];
			
			if(data[key] == 247) {
				total_val += 1;
			}
			
			c++;
			
			if(c > 15) {
				arr.push(total_val / 16);
			}
		}
    }
	
    return arr;
}

function getInput(ctx, width, height, id) {
	return JSONToArray(ctx.getImageData(0, 0, width, height).data);
}

onmessage = function(e) {
	postMessage(getInput(e.data.ctx, e.data.canvas_width, e.data.canvas_height, e.data.id));
}
