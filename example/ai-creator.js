var AIs = [];

function JSONToArray(data) {
    var arr = [];
    for (var key in data) {
        var value = data[key];
        if (typeof value !== 'object') {
            arr.push(value);
        } else {
			var arr2 = JSONToArray(value);
			for(var i = 0; i < arr2.length; i++) {
				arr.push(arr2[i]);
			}
        }
    }
    return arr;
}

function genRandAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		var food_arr = JSONToArray(food);
		food_arr.push(Food.length);
		
		AIs.push(new AI(food_arr, 4, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 24}));
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
