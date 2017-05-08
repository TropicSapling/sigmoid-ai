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

function getInput(id) {
	var raw_input = [id]; // Push player id
	var pos = players[id].pos;
	
	for(var i = 0; i < food.length; i++) {
		if(Math.round(food[i].pos.x / 100) == Math.round(pos.x / 100) && Math.round(food[i].pos.y / 100) == Math.round(pos.y / 100)) {
			raw_input.push(food[i]);
		}
	}
	
	for(var i = 0; i < players.length; i++) {
		if(Math.round(players[i].pos.x / 100) == Math.round(pos.x / 100) && Math.round(players[i].pos.y / 100) == Math.round(pos.y / 100)) {
			raw_input.push(food[i]);
		}
	}
	
	return JSONToArray(raw_input);
}

function genRandAI() {
	var p = new Player();
	
	AIs.push(new AI(2, undefined, undefined, {player: p}));
}

function genMutatedAI() {
	var par = JSON.parse(JSON.stringify(getPar())); // Deep clone
	var pp = par.info.player;
	
	var p = new Player({r: randomBetween(pp.colour.r - Math.round(par.mutationChance * 16), pp.colour.r + Math.round(par.mutationChance * 16)), g: randomBetween(pp.colour.g - Math.round(par.mutationChance * 16), pp.colour.g + Math.round(par.mutationChance * 16)), b: randomBetween(pp.colour.b - Math.round(par.mutationChance * 16), pp.colour.b + Math.round(par.mutationChance * 16))});
	var ai = new AI(2, par.actions, randomBetween(Math.round(par.mutationChance * 1000) - Math.round(par.mutationChance * 100), Math.round(par.mutationChance * 1000) + Math.round(par.mutationChance * 100)) / 1000, {player: p});
	
	AIs.push(ai);
	
	ai.mutate(par.mutationChance);
}

function getPar() {
	var total_time_alive = 0;
	var par_chance = [];
	for(var i = 0; i < best_AIs.length; i++) {
		par_chance.push([total_time_alive, total_time_alive + best_AIs[i].timeAlive]);
		total_time_alive += best_AIs[i].timeAlive;
	}
	
	var randNumber = Math.floor(Math.random() * total_time_alive);
	for(var i = 0; i < par_chance.length; i++) {
		if(randNumber >= par_chance[i][0] && randNumber < par_chance[i][1]) {
			return best_AIs[i];
		}
	}
}

function addBestAI(ai) {
	var not_full = best_AIs.length < 128;
	
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
	
	if(!players[player.id] || player.radius < 10) {
		addBestAI(AIs[id]);
		
		AIs.splice(id, 1);
		
		return 1;
	} else {
		var input = getInput(player.id);
		
		var x_change = sigmoid(ai.exeAction(0, input) / input.length);
		var y_change = sigmoid(ai.exeAction(1, input) / input.length);
		
		player.changePos(x_change < 0.5 ? 0 - x_change * 2 : (x_change - 0.5) * 2, y_change < 0.5 ? 0 - y_change * 2 : (y_change - 0.5) * 2);
		
		ai.timeAlive += 1;
	}
}

function runAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		if(best_AIs.length < 1 || Math.floor(Math.random() * 10) == 1) {
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
