var food = [];
var fps = "N/A";
var frames = 0;
var ff_time;

function Food(x, y, radius, r, g, b) {
	this.x = x;
	this.y = y;
	this.radius = radius;
	this.r = r;
	this.g = g;
	this.b = b;
}

function randomBetween(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function clearScreen(drawer) {
	drawer.fillStyle = "#fff";
	drawer.fillRect(0, 0, window.innerWidth, window.innerHeight);
}

function drawBg(drawer, line_count, bg_colour, line_colour) {
	drawer.fillStyle = bg_colour;
	drawer.fillRect(0, 0, window.innerWidth, window.innerHeight);
	
	drawer.strokeStyle = line_colour;
	
	for(var i = 0; i < line_count; i++) {
		drawer.moveTo(i * (window.innerWidth / line_count), 0);
		drawer.lineTo(i * (window.innerWidth / line_count), window.innerHeight);
		drawer.stroke();
	}
	
	for(var i = 0; i < line_count; i++) {
		drawer.moveTo(0, i * (window.innerWidth / line_count));
		drawer.lineTo(window.innerWidth, i * (window.innerWidth / line_count));
		drawer.stroke();
	}
}

function drawFood(drawer, food_id) {
	var x = food[food_id].x;
	var y = food[food_id].y;
	var radius = food[food_id].radius;
	var r = food[food_id].y;
	var g = food[food_id].g;
	var b = food[food_id].b;
	
	drawer.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	drawer.strokeStyle = "rgb(" + (r - 25) + "," + (g - 25) + "," + (b - 25) + ")";
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.fill();
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.stroke();
}

function drawAllFood(drawer) {
	for(var i = 0; i < food.length; i++) {
		drawFood(drawer, i);
	}
}

function runGame(drawer) {
	if(performance.now() - ff_time >= 1000) {
		fps = frames;
		frames = 0;
		ff_time = performance.now();
	}
	
	clearScreen(drawer);
	drawBg(drawer, 80, "#d5d5d5", "#ccc");
	typeFPS(drawer);
	drawAllFood(drawer);
	
	if(Math.floor(Math.random() * 25) == 1) {
		food.push(new Food(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight), randomBetween(3, 9), randomBetween(24, 256), randomBetween(24, 256), randomBetween(24, 256)));
	}
	
	frames++;
	
	setTimeout(function() {
		runGame(drawer);
	}, 0);
}

function typeFPS(drawer) {
	if(fps != "N/A") {
		drawer.font = "12px Arial";
		drawer.fillStyle = "#000";
		drawer.fillText("FPS: " + fps, 10, 20);
	}
}

$(function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	
	var drawer = canvas.getContext("2d");
	
	drawBg(drawer, 80, "#d5d5d5", "#ccc"); // To prevent flickering
	
	ff_time = performance.now();
	
	setTimeout(function() {
		runGame(drawer);
	}, 1000);
});
