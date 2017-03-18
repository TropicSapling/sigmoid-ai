var AIs = [];

$(function() {
	for(var i = 0; i < 10; i++) {
		AIs.push(new AI(food, 2));
	}
});
