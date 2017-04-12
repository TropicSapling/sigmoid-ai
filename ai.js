var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function parseFunc(func) {
	var i = func.indexOf("[");
	var pars = func.substring(i + 1, func.indexOf("]"));
	
	return [func.substring(0, i) + "(", pars ? Number(pars) : randomBetween(0, 10)];
}

function genFunc(id) {
	var func_parsed = parseFunc(functions[id]);
	var func = func_parsed[0];
	var pars = func_parsed[1];
	
	for(var par = 0; par < pars; par++) {
		var rand = Math.floor(Math.random() * (constants.length + functions.length));
			
		if(rand < constants.length) {
			func += constants[rand];
		} else {
			func += genFunc(rand - constants.length);
		}
		
		if(par + 1 < pars) {
			func += ", ";
		}
	}
	
	return func + ")";
}

function genRandAction(inputs) {
	var action = [];
	var action_len;
	
	do {
		action_len = randomBetween(2, 8);
	} while(action_len % 2 == 0);
	
	for(var part = 0; part < action_len; part++) {
		if(part % 2) {
			action.push(ops[Math.floor(Math.random() * ops.length)]);
		} else {
			var rand = Math.floor(Math.random() * (constants.length + functions.length));
			
			if(rand < constants.length) {
				action.push(constants[rand]);
			} else {
				action.push(genFunc(rand - constants.length));
			}
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
