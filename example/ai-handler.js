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

function getInput() {
	var raw_input = [6]; // Push amount of properties each food has
	raw_input.push(food);
	
	raw_input.push(6); // Push amount of properties each player has
	raw_input.push(players);
	
	return JSONToArray(raw_input);
}

function genRandAI() {
	var p = new Player();
	
	AIs.push(new AI(3, undefined, {player: p}));
	
	var ai = AIs[AIs.length - 1];
	
	ai.actions.push(["randomBetween", "(", 7, "*", 4, ",", 7, "*", 5, ")"]); // Child spawn size
	ai.actions.push(["randomBetween", "(", 0, "-", 2, ",", 0, "-", 1, ")"]); // Mutation chance
}

function runAI(id) {
	var ai = AIs[id];
	var player = ai.info.player;
	
	if(player.radius < 10) {
		AIs.splice(id, 1);
	} else {
		var input = getInput();
		
		player.changePos(divideWithinRange(1, ai.exeAction(0, input)), divideWithinRange(1, ai.exeAction(1, input)));
		
		if(Math.round(sigmoid(ai.exeAction(2, input)))) {
			var child_radius = Math.abs(ai.exeAction(3, input));
			
			player.spawnChild(child_radius);
			
			if(child_radius <= player.radius && child_radius >= 10) {
				var child = players[players.length - 1];
				
				AIs.push(new AI(5, ai.actions, {player: child}));
				AIs[AIs.length - 1].mutate(sigmoid(ai.exeAction(4, input)));
			}
		}
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
