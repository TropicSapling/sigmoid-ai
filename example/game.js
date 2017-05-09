var bg_canvas;
var bg_drawer;
var canvas;
var drawer;
var perf_canvas;
var perf_drawer;
var req_clear = [];
var req_draw = [];
var game_size = 1920; // 1920px by 1920px

var zoom = 1;

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
	}
	
	alert("[!] Error: " + msg + " in file " + url + "\n\nLine: " + line + ", column: " + column);
}

Array.prototype.mapArr = function(callback) { // I use this instead of built-in .map to get better performance
    'use strict';
	
    if (typeof callback !== 'function') {
        throw new TypeError();
    }

    var thisArg = arguments.length >= 2 ? arguments[1] : void 0;

    for (var i = 0, len = this.length; i < len; i++) {
        this[i] = callback.call(thisArg, this[i], i, this);
    };
};

function deepClone(arr) {
	var arr_copy = [];
	
	arr.mapArr(a => (typeof a === "object" ? arr_copy.push(JSON.parse(JSON.stringify(a))) : arr_copy.push(a)));
	
	return arr_copy;
}

function Player(colour) {
	var player = this;
	
	if(colour) {
		this.colour = {};
		this.colour.r = colour.r === undefined ? randomBetween(25, 255) : colour.r;
		this.colour.g = colour.g === undefined ? randomBetween(25, 255) : colour.g;
		this.colour.b = colour.b === undefined ? randomBetween(25, 255) : colour.b;
	} else {
		this.colour = {r: randomBetween(25, 255), g: randomBetween(25, 255), b: randomBetween(25, 255)};
	}
	
	this.pos = {x: Math.floor(Math.random() * game_size), y: Math.floor(Math.random() * game_size)};
	
	this.radius = 32;
	
	this.graphics_cleared = true;
	
	this.changePos = function(x_change, y_change) {
		if(!player.graphics_cleared) {
			req_clear.push([{x: player.pos.x, y: player.pos.y}, player.radius]);
			player.graphics_cleared = true;
		}
		
		if(x_change > 1) {
			player.pos.x += 1;
		} else if(x_change < -1) {
			player.pos.x -= 1;
		} else if(x_change <= 1) {
			player.pos.x += x_change;
		}
		
		if(y_change > 1) {
			player.pos.y += 1;
		} else if(y_change < -1) {
			player.pos.y -= 1;
		} else if(y_change <= 1) {
			player.pos.y += y_change;
		}
		
		if(player.pos.x + player.radius > game_size) {
			player.pos.x = game_size - player.radius;
		} else if(player.pos.x < player.radius) {
			player.pos.x = player.radius;
		}
		
		if(player.pos.y + player.radius > game_size) {
			player.pos.y = game_size - player.radius;
		} else if(player.pos.y < player.radius) {
			player.pos.y = player.radius;
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
					req_clear.push([{x: food[i].pos.x, y: food[i].pos.y}, food[i].radius]);
				}
				
				food.splice(i, 1);
				
				player.radius = new_radius;
			} else if(x - radius - food[i].radius * 2 <= food[i].pos.x - food[i].radius && x + radius + food[i].radius * 2 >= food[i].pos.x + food[i].radius && y - radius - food[i].radius * 2 <= food[i].pos.y - food[i].radius && y + radius + food[i].radius * 2 >= food[i].pos.y + food[i].radius) {
				req_draw.push(["food", i]);
			}
		}
	}
	
	players.push(this);
	
	this.id = players.length - 1;
	
	req_draw.push(["player", this.id]);
}

$(document).on("keypress", function (e) {
    if(e.key == " ") {
		timeout = timeout ? false : true;
		last_tps = tps;
		
		e.preventDefault();
	}
});

$(window).bind('mousewheel', function(e) {
    if(e.originalEvent.wheelDelta >= 0) {
        zoom = zoom * 1.1;
    } else {
        zoom = zoom * (1 / 1.1);
    }
	
	if(zoom > 0.99 && zoom < 1.01) {
		zoom = 1;
	}
	
	$('#game').css('zoom', zoom);
	$('#bg').css('zoom', zoom);
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
	bg_drawer.fillStyle = bg_colour;
	bg_drawer.fillRect(0, 0, game_size, game_size);
	
	bg_drawer.strokeStyle = line_colour;
	
	for(var i = 0; i < game_size; i += square_size) {
		bg_drawer.moveTo(i, 0);
		bg_drawer.lineTo(i, game_size);
		bg_drawer.stroke();
	}
	
	for(var i = 0; i < game_size; i += square_size) {
		bg_drawer.moveTo(0, i);
		bg_drawer.lineTo(game_size, i);
		bg_drawer.stroke();
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
	
	if(!player.graphics_cleared) {
		req_clear.push([{x: player.pos.x, y: player.pos.y}, player.radius, player.id]);
		player.graphics_cleared = true;
	}
	
	player.radius = Math.sqrt((Math.pow(player.radius, 2) * Math.PI - 2) / Math.PI);
	
	player.eatFood();
		
	if(player.radius < 10) {
		players.splice(id, 1);
		
		return 1;
	}
	
	req_draw.push(["player", id]);
}

function updatePlayers() {
	for(var i = 0; i < players.length; i++) {
		if(updatePlayer(i)) {
			i--;
		}
	}
}

function runGame() {
	if(performance.now() - ft_time >= 1000) {
		tps = ticks;
		ticks = 0;
		ft_time = performance.now();
	}
	
	if(Math.floor(Math.random() * 500) == 1) {
		var spawn_range = game_size - 32;
		
		food.push(new Food({x: Math.floor(Math.random() * spawn_range) + 16, y: Math.floor(Math.random() * spawn_range) + 16}, randomBetween(6, 8), {r: randomBetween(25, 255), g: randomBetween(25, 255), b: randomBetween(25, 255)}));
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
	drawer.save();
	
	drawer.beginPath();
	drawer.arc(pos.x, pos.y, radius + 2, 0, 2 * Math.PI);
	drawer.clip();
	drawer.clearRect(pos.x - radius - 2, pos.y - radius - 2, radius * 2 + 4, radius * 2 + 4);
	
	drawer.restore();
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
	
	for(var i = req_draw_copy.length - 1; i >= 0; i--) {
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
		} else if(req[0] == "player" && req[1] < players.length) {
			drawPlayer(req[1]);
		}
	}	
	
	typePerf();
	calcFPS();
	
	requestAnimationFrame(drawGame);
}

function typePerf() {
	if(fps != "N/A" && (last_fps == "N/A" || Math.floor(Math.random() * fps) == 1)) {
		perf_drawer.clearRect(10, 0, 80, 20);
		
		last_fps = fps;
		
		perf_drawer.font = "18px Arial";
		perf_drawer.fillStyle = "#000";
		
		perf_drawer.fillText("FPS: " + last_fps, 10, 20);
	}
	
	if(tps != "N/A") {
		perf_drawer.clearRect(10, 20, 100, 21);
		
		perf_drawer.font = "18px Arial";
		perf_drawer.fillStyle = "#000";
		perf_drawer.fillText("TPS: " + tps, 10, 40);
	}
}

$(function() {
	// Background
	bg_canvas = document.getElementById("bg");
	
	bg_canvas.setAttribute("width", game_size + "px");
	bg_canvas.setAttribute("height", game_size + "px");
	
	bg_drawer = bg_canvas.getContext("2d");
	
	drawBg(100, "#d5d5d5", "#ccc");
	
	// Game
	canvas = document.getElementById("game");
	
	canvas.setAttribute("width", game_size + "px");
	canvas.setAttribute("height", game_size + "px");
	
	drawer = canvas.getContext("2d");
	
	// Performance
	perf_canvas = document.getElementById("perf");
	
	perf_canvas.setAttribute("width", "150px");
	perf_canvas.setAttribute("height", "50px");
	
	perf_drawer = perf_canvas.getContext("2d");
	
	defZeroDelayTimeout();
	
	ft_time = performance.now();
	setTimeout(function() {
		runGame();
	}, 0);
	
	requestAnimationFrame(drawGame);
});
