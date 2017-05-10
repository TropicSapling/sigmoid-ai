var ai = {};
var best_AIs = [];

var canvas = document.getElementById("runner-canvas");
var ctx = canvas.getContext("2d");

var last_input = [];

var quickSort = (function () {
    function partition(array, left, right) {
        var cmp = array[right - 1].info.timeAlive,
            minEnd = left,
            maxEnd;
        for (maxEnd = left; maxEnd < right - 1; maxEnd += 1) {
            if (array[maxEnd].info.timeAlive <= cmp) {
                swap(array, maxEnd, minEnd);
                minEnd += 1;
            }
        }
        swap(array, minEnd, right - 1);
        return minEnd;
    }

    function swap(array, i, j) {
        var temp = array[i].info.timeAlive;
        array[i].info.timeAlive = array[j].info.timeAlive;
        array[j].info.timeAlive = temp;
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

function arraysEqual(a, b) {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length != b.length) return false;
	
	for (var i = 0; i < a.length; ++i) {
		if (a[i] !== b[i]) return false;
	}
	
	return true;
}

function sigmoid(number) {
	return 1 / (1 + Math.pow(Math.E, 0 - number));
}

function getInput(id) {
	return JSONToArray(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
}

function genRandAI() {
	var p = new Player();
	
	ai = new AI(2, undefined, undefined, {timeAlive: 0});
}

function genMutatedAI() {
	var par = JSON.parse(JSON.stringify(getPar())); // Deep clone
	
	ai = new AI(2, par.actions, randomBetween(Math.round(par.mutationChance * 1000) - Math.round(par.mutationChance * 100), Math.round(par.mutationChance * 1000) + Math.round(par.mutationChance * 100)) / 1000, {timeAlive: 0});
	
	ai.mutate(par.mutationChance);
}

function getPar() {
	var total_time_alive = 0;
	var par_chance = [];
	for(var i = 0; i < best_AIs.length; i++) {
		par_chance.push([total_time_alive, total_time_alive + best_AIs[i].info.timeAlive]);
		total_time_alive += best_AIs[i].info.timeAlive;
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
	
	if(not_full || ai.info.timeAlive > best_AIs[0].info.timeAlive) {
		if(not_full) {
			best_AIs.push(ai);
		} else {
			best_AIs[0] = ai;
		}
		
		quickSort(best_AIs);
	}
}

function runAI() {
	var input = getInput();
	
	if(arraysEqual(last_input, input)) {
		addBestAI();
		
		genRandAI();
		
		return 1;
	} else {
		var input = getInput();
		
		var x_change = sigmoid(ai.exeAction(0, input) / input.length);
		var y_change = sigmoid(ai.exeAction(1, input) / input.length);
		
		ai.info.timeAlive += 1;
	}
}

function runAIs() {
	runAI();
	
	if(timeout) {
		setTimeout(runAIs, 10);
	} else {
		setZeroTimeout(runAIs);
	}
}

$(function() {
	setTimeout(runAIs, 1000);
});
