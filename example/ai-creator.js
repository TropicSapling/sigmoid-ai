var AIs = [];

function genRandAIs() {
	if(Math.floor(Math.random() * 1000) == 1) {
		AIs.push(new AI(food, 4, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256), radius: 24}));
	}
	
	setZeroTimeout(genRandAIs);
}

$(function() {
	setTimeout(genRandAIs, 1000);
});
