var ops = ["+", "-", "*", "/"];
var functions = ["Math.pow[2]", "Math.sqrt[1]", "Math.sin[1]", "Math.cos[1]", "Math.abs[1]"]; // [n] = amount of args needed

function genRandActions(input, output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push([Math.round(Math.random())]); // WIP; WILL BE CHANGED
	}
	
	alert(outputs);
	return outputs;
}

function AI(input, output_count, actions, properties) {
	this.actions = actions ? actions : genRandActions(input, output_count);
	alert(this.actions);
	this.properties = properties;
}
