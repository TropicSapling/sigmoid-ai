var AIs = [];

$(function() {
	for(var i = 0; i < 10; i++) {
		AIs.push(new AI(food, 3, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 16}));
	}
	
	setZeroInterval(function() {
		if(Math.floor(Math.random() * 1000) == 1) {
			AIs.push(new AI(food, 3, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 16}));
		}
	});
});
