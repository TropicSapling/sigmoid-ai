var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed

function genRandAction(input) {
	return [randomBetween(-17, 16)]; // WIP; WILL BE CHANGED
}

function genRandActions(input, output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push(genRandAction(input));
	}
	
	return outputs;
}

function AI(input, output_count, actions, properties) {
	this.actions = actions ? actions : genRandActions(input, output_count);
	this.properties = properties;
}
