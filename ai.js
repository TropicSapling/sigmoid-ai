var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function genRandAction(inputs) {
	var action = [];
	var action_len;
	
	do {
		action_len = randomBetween(2, 8);
	} while(action_len % 2 == 0);
	
	for(var part = 0; part < action_len; part++) {
		if(part % 2) {
			var rand = Math.floor(Math.random() * (constants.length + functions.length));
			
			if(rand < constants.length) {
				action.push(constants[rand]);
			} else {
				action.push(functions[rand]);
			}
		} else {
			action.push(ops[Math.floor(Math.random() * ops.length)]);
		}
	}
	
	return action;
}

function genRandActions(inputs, output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push(genRandAction(inputs));
	}
	
	return outputs;
}

function AI(inputs, output_count, actions, info) {
	var ai = this;
	
	this.actions = actions ? actions : genRandActions(inputs, output_count);
	this.inputs = inputs;
	
	this.info = info;
	
	this.exeAction = function(n, input) {
		try { 
			return (new Function("input", "return " + ai.actions[n].join(" ")))(input);
		} catch(e) {
			ai.actions[n] = genRandAction(ai.inputs);
			ai.exeAction(n, input);
		}
	}
}
