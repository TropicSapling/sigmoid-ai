var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI, "AIs[n]"];
var variables = ["input_id"];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function genRandAction(inputs) {
	var action = [];
	
	action.push("randomBetween(-17, 16)"); // WIP; will be changed
	
	return action;
}

function genRandActions(inputs, output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push(genRandAction(inputs));
	}
	
	return outputs;
}

function insertInput(action, input) {
	return action; // WIP; will be changed
}

function AI(inputs, output_count, actions, info) {
	var ai = this;
	
	this.actions = actions ? actions : genRandActions(inputs, output_count);
	this.info = info;
	
	this.exeAction = function(n, input) {
		return (new Function("n", "input", "return " + insertInput(ai.actions[n], input).join(" ")))(n, input);
	}
}
