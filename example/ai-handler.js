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

function sigmoid(number) {
	return 1 / (1 + Math.pow(Math.E, 0 - number));
}

function divideWithinRange(a, b) {
	b = (b < 1 && b >= 0) ? 1 : b;
	b = (b > -1 && b < 0) ? -1 : b;
	
	return a / b;
}

function getConstantInputs(id) {
	return [id, ["food", 6], ["players", 6]]; // [const, property_count]
}

function getInput() {
	var raw_input = [6]; // Push amount of properties each food has
	raw_input.push(food);
	
	raw_input.push(6); // Push amount of properties each player has
	raw_input.push(players);
	
	return JSONToArray(raw_input);
}

function genRandAI() {
	AIs.push(new AI(getConstantInputs(players.length - 1), 4, {player: new Player()}));
}

function runAI(id) {
	var ai = AIs[id];
	var player = ai.info.player;
	
	if(player.length > 0) {
		var input = getInput();
		
		player.changePos(divideWithinRange(1, ai.exeAction(0, input)), divideWithinRange(1, ai.exeAction(1, input)));
		
		if(Math.round(sigmoid(ai.exeAction(2, input)))) {
			player.spawnChild(Math.abs(ai.exeAction(3, input)));
		}
	} else {
		AIs.splice(id, 1);
	}
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
