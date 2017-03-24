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

function getInput() {
	var raw_input = [6]; // Push amount of properties each food has
	raw_input.push(food);
	
	raw_input.push(6); // Push amount of properties each player has
	raw_input.push(players);
	
	return JSONToArray(raw_input);
}

function genRandAI() {
	new Player();
	
	AIs.push(new AI(getInput(), 4));
}

function runAI(id) {
	var ai = AIs[id];
	
	ai.exeAction(input);
}

function runAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		genRandAI();
	}
	
	for(var i = 0; i < AIs.length; i++) {
		runAI(i);
	}
	
	if(timeout) {
		setTimeout(runAIs, 10);
	} else {
		setZeroTimeout(runAIs);
	}
}

$(function() {
	setTimeout(runAIs, 1000);
});
