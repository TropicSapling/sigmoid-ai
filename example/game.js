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

function drawFood(drawer, x, y, radius) {
	var r = randomBetween(24, 256);
	var g = randomBetween(24, 256);
	var b = randomBetween(24, 256);
	
	drawer.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	drawer.strokeStyle = "rgb(" r - 25 + "," + g - 25 + "," + b - 25 + ")";
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.fill();
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.stroke();
}

$(function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	
	var drawer = canvas.getContext("2d");
	
	drawBg(drawer, 80, "#d5d5d5", "#ccc"); // To prevent (40 ms) flickering
	
	setInterval(function() {
		clearScreen(drawer);
		drawBg(drawer, 80, "#d5d5d5", "#ccc");
		
//		drawFood(drawer, Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight), randomBetween(3, 9));
	}, 40);
});
