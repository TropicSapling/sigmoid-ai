var canvas;
var drawer;
var req_clear = [];
var req_draw = [];
var game_size = 2048; // 2048px by 2048px

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

window.onerror = function(msg, url, line, column, error) {
	alert("An error has occurred. Check console for details.");
	
	if(error) {
		console.log("[!] " + msg + " in file " + url);
		console.log("Line: " + line + ", column: " + column);
		console.log("Stack Trace:");
		console.log(error.stack);
	} else {
		alert("[!] Error: " + msg + " in file " + url + "\n\nLine: " + line + ", column: " + column);
	}
}

function deepClone(arr) {
	return arr.map(a => Object.assign({}, a));
}

function Player(colour) {
	var player = this;
	
	if(colour) {
		this.colour = {};
		this.colour.r = colour.r === undefined ? randomBetween(24, 256) : colour.r;
		this.colour.g = colour.g === undefined ? randomBetween(24, 256) : colour.g;
		this.colour.b = colour.b === undefined ? randomBetween(24, 256) : colour.b;
	} else {
		this.colour = {r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256)};
	}
	
	this.pos = {x: Math.floor(Math.random() * game_size), y: Math.floor(Math.random() * game_size)};
	
	this.radius = 32;
	
	this.graphics_cleared = true;
	
	this.changePos = function(x_change, y_change) {
		if(!player.graphics_cleared) {
			req_clear.push([player.pos, player.radius]);
			player.graphics_cleared = true;
		}
		
		if(x_change > 1) {
			player.pos.x += 1;
		} else if(x_change < -1) {
			player.pos.x -= 1;
		} else {
			player.pos.x += x_change;
		}
		
		if(y_change > 1) {
			player.pos.y += 1;
		} else if(y_change < -1) {
			player.pos.y -= 1;
		} else {
			player.pos.y += y_change;
		}
		
		req_draw.push(["player", player.id]);
	}
	
	this.eatFood = function() {
		var x = player.pos.x;
		var y = player.pos.y;
		var radius = player.radius;
		
		for(var i = 0; i < food.length; i++) {
			if(x - radius - food[i].radius / 10 <= food[i].pos.x - food[i].radius && x + radius + food[i].radius / 10 >= food[i].pos.x + food[i].radius && y - radius - food[i].radius / 10 <= food[i].pos.y - food[i].radius && y + radius + food[i].radius / 10 >= food[i].pos.y + food[i].radius) {
				var new_radius = Math.sqrt((Math.PI * Math.pow(radius, 2) + Math.PI * Math.pow(food[i].radius, 2)) / Math.PI);
				
				if(!food[i].graphics_cleared) {
					req_clear.push([food[i].pos, food[i].radius]);
				}
				
				food.splice(i, 1);
				
				player.radius = new_radius;
				
				req_draw.push(["player", player.id]);
			}
		}
	}
	
	this.spawnChild = function(radius) {
		if(radius <= player.radius) {
			if(!player.graphics_cleared) {
				req_clear.push([player.pos, player.radius]);
				player.graphics_cleared = true;
			}
			
			players.push(new Player({r: randomBetween(player.colour.r - 8, player.colour.r + 8), g: randomBetween(player.colour.g - 8, player.colour.g + 8), b: randomBetween(player.colour.b - 8, player.colour.b + 8)}));
			players[players.length - 1].pos = {x: randomBetween(player.pos.x - 16, player.pos.x + 16), y: randomBetween(player.pos.y - 16, player.pos.y + 16)};
			players[players.length - 1].radius = radius;
			
			player.radius = Math.sqrt((Math.pow(player.radius, 2) * Math.PI - Math.pow(radius, 2) * Math.PI) / Math.PI);
			
			req_draw.push(["player", player.id]);
		}
	}
	
	players.push(this);
	
	this.id = players.length - 1;
	
	req_draw.push(["player", this.id]);
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
	this.pos = {x: pos.x, y: pos.y};
	
	this.radius = radius;
	
	this.colour = {r: colour.r, g: colour.g, b: colour.b};
	
	this.graphics_cleared = true;
}

function randomBetween(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function drawBg(square_size, bg_colour, line_colour) {
	drawer.fillStyle = bg_colour;
	drawer.fillRect(0, 0, game_size, game_size);
	
	drawer.strokeStyle = line_colour;
	
	for(var i = 0; i < game_size; i += square_size) {
		drawer.moveTo(i, 0);
		drawer.lineTo(i, game_size);
		drawer.stroke();
	}
	
	for(var i = 0; i < game_size; i += square_size) {
		drawer.moveTo(0, i);
		drawer.lineTo(game_size, i);
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

function updatePlayer(id) {
	var player = players[id];
	
	player.radius = player.radius * 0.999;
		
	if(player.radius < 10) {
		if(!player.graphics_cleared) {
			req_clear.push([player.pos, player.radius, player.id]);
		}
		
		players.splice(id, 1);
		
		return;
	}
	
	req_draw.push(["player", id]);
	
	player.eatFood();
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
		food.push(new Food({x: Math.floor(Math.random() * game_size), y: Math.floor(Math.random() * game_size)}, randomBetween(3, 9), {r: randomBetween(24, 256), g: randomBetween(24, 256), b: randomBetween(24, 256)}));
		req_draw.push(["food", food.length - 1]);
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

function clearCircle(pos, radius) {
	drawer.fillStyle = "#d5d5d5";
	
	drawer.beginPath();
	drawer.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
	drawer.fill();
}

function cleanRequests() {
	var req_clear_copy = deepClone(req_clear);
	var req_draw_copy = deepClone(req_draw);
	
	req_clear = [];
	req_draw = [];
	
	for(var i = 0; i < players.length; i++) {
		players[i].graphics_cleared = false;
	}
	
	for(var i = 0; i < food.length; i++) {
		food[i].graphics_cleared = false;
	}
	
	var clears = [];
	for(var i = 0; i < req_clear_copy.length; i++) {
		var req = req_clear_copy[i];
		
		if(req[2]) {
			clears.push(req[2]);
		}
	}
	
	var taken_ids = [];
	
	for(var i = req_draw_copy.length - 1; i >= 0; i++) {
		var req = req_draw_copy[i];
		var taken = false;
		
		for(var j = 0; j < taken_ids.length; j++) {
			if(req[1] == taken_ids[j]) {
				taken = true;
				break;
			}
		}
		
		if(taken) {
			req_draw_copy.splice(i, 1);
			continue;
		}
		
		for(var j = 0; j < clears.length; j++) {
			if(req[1] == clears[j]) {
				req_draw_copy.splice(i, 1);
				break;
			}
		}
		
		taken_ids.push(req[1]);
	}
	
	return [req_clear_copy, req_draw_copy];
}

function drawGame() {
	var req_copy = cleanRequests(); // Copy needed because of async stuff
	
	var req_clear_copy = req_copy[0];
	var req_draw_copy = req_copy[1];
	
	for(var i = 0; i < req_clear_copy.length; i++) {
		var req = req_clear_copy[i];
		
		clearCircle(req[0], req[1]);
	}
	
	for(var i = 0; i < req_draw_copy.length; i++) {
		var req = req_draw_copy[i];
		
		if(req[0] == "food" && req[1] < food.length) {
			drawFood(req[1]);
		} else if(req[1] < players.length) {
			drawPlayer(req[1]);
		}
	}	
	
	typePerf();
	calcFPS();
	
	requestAnimationFrame(drawGame);
}

function typePerf() {
	if(fps != "N/A" && (last_fps == "N/A" || Math.floor(Math.random() * fps) == 1)) {
		drawer.fillStyle = "#d5d5d5";
		
		drawer.fillRect(10, 0, 70, 20);
		
		last_fps = fps;
		
		drawer.font = "18px Arial";
		drawer.fillStyle = "#000";
		
		drawer.fillText("FPS: " + last_fps, 10, 20);
	}
	
	if(tps != "N/A") {
		drawer.fillStyle = "#d5d5d5";
		drawer.fillRect(10, 20, 100, 21);
		
		drawer.font = "18px Arial";
		drawer.fillStyle = "#000";
		drawer.fillText("TPS: " + tps, 10, 40);
	}
}

$(function() {
	canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", game_size + "px");
	canvas.setAttribute("height", game_size + "px");
	
	drawer = canvas.getContext("2d");
	
	drawBg(100, "#d5d5d5", "#ccc");
	
	defZeroDelayTimeout();
	
	ft_time = performance.now();
	setTimeout(function() {
		runGame();
	}, 0);
	
	requestAnimationFrame(drawGame);
});
