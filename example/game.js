var canvas;
var drawer;
var timeout = false;

var food = [];
var fps = "N/A";
var last_fps = "N/A";
var tps = "N/A";
var last_tps = "N/A";
var ticks = 0;
var ft_time;
var lastCalledTime;

var players = [];

function Player(pos, colour) {
	this.colour.r = colour.r === undefined ? Math.floor(Math.random() * 256) : colour.r;
	this.colour.g = colour.g === undefined ? Math.floor(Math.random() * 256) : colour.g;
	this.colour.b = colour.b === undefined ? Math.floor(Math.random() * 256) : colour.b;
	
	this.changePos = function(x_change, y_change) {
		if(x_change > 1) {
			this.pos.x += 1;
		} else if(x_change < -1) {
			this.pos.x -= 1;
		} else {
			this.pos.x += x_change;
		}
		
		if(y_change > 1) {
			this.pos.y += 1;
		} else if(y_change < -1) {
			this.pos.y -= 1;
		} else {
			this.pos.y += y_change;
		}
	}
}

$(document).on("keypress", function (e) {
    if(e.which == 32) {
		timeout = timeout ? false : true;
		last_tps = tps;
	}
});

function calcFPS() {
	if(!lastCalledTime) {
 		lastCalledTime = performance.now();
 		return;
	}
	
	delta = (performance.now() - lastCalledTime) / 1000;
	lastCalledTime = performance.now();
	fps = Math.round(1 / delta);
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

function Food(pos, radius, colour) {
	this.pos.x = pos.x;
	this.pos.y = pos.y;
	this.radius = radius;
	this.colour.r = colour.r;
	this.colour.g = colour.g;
	this.colour.b = colour.b;
}

function randomBetween(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function drawBg(square_size, bg_colour, line_colour) {
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

function drawFood(food_id) {
	var x = food[food_id].pos.x;
	var y = food[food_id].pos.y;
	var radius = food[food_id].radius;
	var r = food[food_id].colour.r;
	var g = food[food_id].colour.g;
	var b = food[food_id].colour.b;
	
	drawer.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	drawer.strokeStyle = "rgb(" + (r - 25) + "," + (g - 25) + "," + (b - 25) + ")";
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.fill();
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.stroke();
}

function drawAllFood() {
	for(var i = 0; i < food.length; i++) {
		drawFood(i);
	}
}

function drawPlayer(id) {
	var x = players[id].pos.x;
	var y = players[id].pos.y;
	
	var radius = players[id].radius;
	
	var r = players[id].colour.r;
	var g = players[id].colour.g;
	var b = players[id].colour.b;
	
	drawer.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
	drawer.strokeStyle = "rgb(" + (r - 25) + "," + (g - 25) + "," + (b - 25) + ")";
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.fill();
	
	drawer.beginPath();
	drawer.arc(x, y, radius, 0, 2 * Math.PI);
	drawer.stroke();
}

function drawPlayers() {
	for(var i = 0; i < players.length; i++) {
		drawPlayer(i);
	}
}

function exe(action) {
	return (new Function("return " + action.join(" ")))();
}

function sigmoid(number) {
	return 1 / (1 + Math.pow(Math.E, 0 - number));
}

function eatFood(pos, radius) {
	var x = pos.x;
	var y = pos.y;
	
	for(var i = 0; i < food.length; i++) {
		if(x - radius - food[i].radius / 10 <= food[i].x - food[i].radius && x + radius + food[i].radius / 10 >= food[i].x + food[i].radius && y - radius - food[i].radius / 10 <= food[i].y - food[i].radius && y + radius + food[i].radius / 10 >= food[i].y + food[i].radius) {
			var new_radius = Math.sqrt((Math.PI * Math.pow(radius, 2) + Math.PI * Math.pow(food[i].radius, 2)) / Math.PI);
			food.splice(i, 1);
			return new_radius;
		}
	}
	
	return radius;
}

function updatePlayer(id) {
	var player = players[id];
	
	player.radius = player.radius * 0.999;
	
	if(player.radius < 10) {
		players.splice(id, 1);
		return;
	}
	
	var x_movement = 1 / exe(AIs[id].actions[0]);
	var y_movement = 1 / exe(AIs[id].actions[1]);
	
	player.pos.x += x_movement;
	player.pos.y += y_movement;
	
	var child = Math.round(sigmoid(AIs[id].actions[2]));
	if(child) {
		var child_radius = Math.abs(exe(AIs[id].actions[3]));
		if(props.radius - child_radius >= 0 && (child_radius >= 10 || (props.radius - child_radius < 10 && child_radius + props.radius - child_radius >= 10))) {
			props.radius -= child_radius;
			if(props.radius - child_radius < 10) {
				child_radius += props.radius;
				props.radius = 0;
			}
			AIs.push(new AI(food, 4, props.actions, {x: props.x, y: props.y, r: randomBetween(props.r - 8, props.r + 8), g: randomBetween(props.g - 8, props.g + 8), b: randomBetween(props.b - 8, props.b + 8), radius: child_radius}));
		}
	}
	
	player.radius = eatFood(player.pos, player.radius);
	
	players[id] = player;
}

function updatePlayers() {
	for(var i = 0; i < players.length; i++) {
		updatePlayer(i);
	}
}

function runGame() {
	if(performance.now() - ft_time >= 1000) {
		tps = ticks;
		ticks = 0;
		ft_time = performance.now();
	}
	
	if(Math.floor(Math.random() * 200) == 1) {
		food.push(new Food(Math.floor(Math.random() * window.innerWidth), Math.floor(Math.random() * window.innerHeight), randomBetween(3, 9), randomBetween(24, 256), randomBetween(24, 256), randomBetween(24, 256)));
	}
	
	updatePlayers();
	
	ticks++;
	
	if(timeout) {
		setTimeout(function() {
			runGame();
		}, Math.round(last_tps / 5000));
	} else {
		setZeroTimeout(function() {
			runGame();
		});
	}
}

function drawGame() {
	drawBg(100, "#d5d5d5", "#ccc");
	drawAllFood();
	drawPlayers();
	typePerf();
	
	calcFPS();
	requestAnimationFrame(drawGame);
}

function typePerf() {
	if(fps != "N/A") {
		drawer.font = "12px Arial";
		drawer.fillStyle = "#000";
		
		if(last_fps == "N/A" || Math.floor(Math.random() * fps) == 1) {
			last_fps = fps;
		}
		
		drawer.fillText("FPS: " + last_fps, 10, 20);
	}
	
	if(tps != "N/A") {
		drawer.font = "12px Arial";
		drawer.fillStyle = "#000";
		drawer.fillText("TPS: " + tps, 10, 40);
	}
}

$(function() {
	canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	
	drawer = canvas.getContext("2d");
	
	drawBg(100, "#d5d5d5", "#ccc"); // To prevent flickering
	
	defZeroDelayTimeout();
	
	ft_time = performance.now();
	setTimeout(function() {
		runGame();
	}, 0);
	
	requestAnimationFrame(drawGame);
});
