var AIs = [];

function genRandAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		AIs.push(new AI(food, 4, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 16}));
	}
	
	setZeroTimeout(genRandAIs);
}

$(function() {
	for(var i = 0; i < 10; i++) {
		AIs.push(new AI(food, 4, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 16}));
	}
	
	setTimeout(genRandAIs, 1000);
});
