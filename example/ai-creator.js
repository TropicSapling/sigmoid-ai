var AIs = [];

function JSONToArray(data) {
    var arr = [];
    for (var key in data) {
        var value = data[key];
        if (typeof value !== 'object') {
            arr.push(value);
        } else {
            arr.push(JSONToArray(value));
        }
    }
    return arr;
}

function genRandAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		AIs.push(new AI(food, 4, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 24}));
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
