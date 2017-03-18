var AIs = [];

$(function() {
	for(var i = 0; i < 10; i++) {
		AIs.push(new AI(food, 2, undefined, {x: Math.floor(Math.random() * window.innerWidth), y: Math.floor(Math.random() * window.innerHeight), r: 0, g: 63, b: 127, radius: 50}));
	}
});
