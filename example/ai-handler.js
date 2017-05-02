var AIs = [];
var best_AIs = [];

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

function getInput(id) {
	var raw_input = [id, 6]; // Push player id and amount of properties each food has
	raw_input.push(food);
	
	raw_input.push(6); // Push amount of properties each player has
	raw_input.push(players);
	
	return JSONToArray(raw_input);
}

function genRandAI() {
	var p = new Player();
	
	AIs.push(new AI(2, undefined, {player: p}));
	
	var ai = AIs[AIs.length - 1];
	
	var mutation_chance = ["randomBetween", "(", 0, "-", 2, ",", 0, "-", 1, ")"];
	
	ai.actions.push(mutation_chance);
	ai.actions_exe.push(new Function("input", "i", "return " + mutation_chance.join(" ")));
}

function genMutatedAI() {
	// WIP
}

function addBestAI(ai) {
	if(ai.timeAlive > best_AIs[bestAIs.length - 1].timeAlive) {
		// WIP
	}
}

function runAI(id) {
	var ai = AIs[id];
	var player = ai.info.player;
	
	if(player.radius < 10) {
		addBestAI(AIs[id]);
		
		AIs.splice(id, 1);
		
		return 1;
	} else {
		var input = getInput(player.id);
		
		player.changePos(divideWithinRange(1, ai.exeAction(0, input)), divideWithinRange(1, ai.exeAction(1, input)));
	}
}

function runAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		if(Math.floor(Math.random() * 10) == 1) {
			genRandAI();
		} else {
			genMutatedAI();
		}
	}
	
	for(var i = 0; i < AIs.length; i++) {
		if(runAI(i)) {
			i--;
		}
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
