var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI, "AIs[n]"];
var variables = ["input_id"];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function genRandAction(input) {
	var action = [];
	
	return action;
}

function genRandActions(input, output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push(genRandAction(input));
	}
	
	return outputs;
}

function AI(input, output_count, actions) {
	var ai = this;
	
	this.actions = actions ? actions : genRandActions(input, output_count);
	
	this.exeAction = function(n, input) {
		return (new Function("return " + ai.actions[n].join(" ")))();
	}
}
