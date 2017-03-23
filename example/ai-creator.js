var AIs = [];

function JSONToArray(data) {
    var arr = [];
	
    for (var key in data) {
        var value = data[key];
		if(typeof value !== 'function') {
			if (typeof value !== 'object') {
				arr.push(value);
			} else {
				var arr2 = JSONToArray(value);
				for(var i = 0; i < arr2.length; i++) {
					arr.push(arr2[i]);
				}
			}
		}
    }
	
    return arr;
}

function exe(action) {
	return (new Function("return " + action.join(" ")))();
}

function sigmoid(number) {
	return 1 / (1 + Math.pow(Math.E, 0 - number));
}

function genRandAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		var raw_input = [6]; // Push amount of properties each food has
		raw_input.push(food);
		
		raw_input.push(6); // Push amount of properties each player has
		raw_input.push(new Player());
		
		var input = JSONToArray(raw_input);
		
		AIs.push(new AI(input, 4, undefined));
	}
	
	if(timeout) {
		setTimeout(genRandAIs, 10);
	} else {
		setZeroTimeout(genRandAIs);
	}
}

$(function() {
	setTimeout(genRandAIs, 1000);
});
