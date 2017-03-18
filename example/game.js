var food = [];
var fps = "N/A";
var tps = "N/A";
var ticks = 0;
var ft_time;
var lastCalledTime;

function requestAnimFrame() {
	if(!lastCalledTime) {
 		lastCalledTime = performance.now();
 		return;
	}
	
	delta = (performance.now() - lastCalledTime) / 1000;
	lastCalledTime = performance.now();
	fps = 1 / delta;
} 

function defZeroDelayTimeout() {
	var timeouts = [];
    var messageName = "zero-timeout-message";
	
    function setZeroTimeout(fn) {
        timeouts.push(fn);
        window.postMessage(messageName, "*");
    }
	
    function handleMessage(event) {
        if (event.source == window && event.data == messageName) {
            event.stopPropagation();
            if (timeouts.length > 0) {
                var fn = timeouts.shift();
                fn();
            }
        }
    }
	
    window.addEventListener("message", handleMessage, true);
	
    window.setZeroTimeout = setZeroTimeout;
}

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

function drawBg(drawer, square_size, bg_colour, line_colour) {
	drawer.fillStyle = bg_colour;
	drawer.fillRect(0, 0, window.innerWidth, window.innerHeight);
	
	drawer.strokeStyle = line_colour;
	
	for(var i = 0; i < window.innerWidth; i += square_size) {
		drawer.moveTo(i, 0);
		drawer.lineTo(i, window.innerHeight);
		drawer.stroke();
	}
	
	for(var i = 0; i < window.innerHeight; i += square_size) {
		drawer.moveTo(0, i);
		drawer.lineTo(window.innerWidth, i);
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
		tps = ticks;
		ticks = 0;
		ft_time = performance.now();
	}
	
	drawBg(drawer, 100, "#d5d5d5", "#ccc");
	typePerf(drawer);
	drawAllFood(drawer);
	
	if(Math.floor(Math.random() * tps) == 1) {
		food.push(new Food(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight), randomBetween(3, 9), randomBetween(24, 256), randomBetween(24, 256), randomBetween(24, 256)));
	}
	
	ticks++;
	
	setZeroTimeout(function() {
		runGame(drawer);
	});
}

function typePerf(drawer) {
	if(fps != "N/A") {
		drawer.font = "12px Arial";
		drawer.fillStyle = "#000";
		drawer.fillText("FPS: " + fps, 10, 20);
	}
	
	if(tps != "N/A") {
		drawer.font = "12px Arial";
		drawer.fillStyle = "#000";
		drawer.fillText("TPS: " + tps, 10, 40);
	}
}

$(function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	
	var drawer = canvas.getContext("2d");
	
	drawBg(drawer, 100, "#d5d5d5", "#ccc"); // To prevent flickering
	
	defZeroDelayTimeout();
	
	setTimeout(function() {
		ft_time = performance.now();
		runGame(drawer);
	}, 0); // This seems to fix a lag spike in the beginning of the game for some reason
});
