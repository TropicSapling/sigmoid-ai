var input = []; // Game specific; define yourself
var outputs = 1; // Game specific; define yourself

var ops = ["+", "-", "*", "/"];
var functions = ["Math.pow[2]", "Math.sqrt[1]", "Math.sin[1]", "Math.cos[1]", "Math.abs[1]"]; // [n] = amount of args

var AIs = [];
function AI(actions, colour) = {
	this.actions = actions ? actions : genRandActions(outputs);
	this.colour = colour ? colour : genRandColour();
}
