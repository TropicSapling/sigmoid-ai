var AIs = [];
var best_AIs = [];

var quickSort = (function () {
    function partition(array, left, right) {
        var cmp = array[right - 1].timeAlive,
            minEnd = left,
            maxEnd;
        for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
            if (array[maxEnd].timeAlive <= cmp) {
                swap(array, maxEnd, minEnd);
                minEnd += 1;
            }
        }
        swap(array, minEnd, right - 1);
        return minEnd;
    }

    function swap(array, i, j) {
        var temp = array[i].timeAlive;
        array[i].timeAlive = array[j].timeAlive;
        array[j].timeAlive = temp;
        return array;
    }

    function quickSort(array, left, right) {
        if (left < right) {
            var p = partition(array, left, right);
            quickSort(array, left, p);
            quickSort(array, p + 1, right);
        }
        return array;
    }

    return function (array) {
        return quickSort(array, 0, array.length);
    };
}());

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
	var ai = new AI(2, undefined, {player: p});
	
	AIs.push(ai);
	
	var mutation_chance = ["randomBetween", "(", 0, "-", 2, ",", 0, "-", 1, ")"];
	
	ai.actions.push(mutation_chance);
	ai.actions_exe.push(new Function("input", "i", "return " + mutation_chance.join(" ")));
}

function genMutatedAI() {
	var p = new Player();
	var ai = new AI(2, getRandActions(), {player: p});
	
	AIs.push(ai);
	
	ai.mutate();
}

function getRandActions() {
	// WIP
}

function addBestAI(ai) {
	var not_full = bestAIs.length < 128;
	
	if(not_full || ai.timeAlive > best_AIs[0].timeAlive) {
		if(not_full) {
			best_AIs.push(ai);
		} else {
			best_AIs[0] = ai;
		}
		
		quickSort(best_AIs);
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
		
		ai.timeAlive += 1;
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
