var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", "!"];
var constants = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function parseRandFunc(func) {
	var i = func.indexOf("[");
	var pars = func.substring(i + 1, func.indexOf("]"));
	
	return [[func.substring(0, i), "("], pars ? Number(pars) : randomBetween(0, 10)];
}

function genRandFunc(id, inputs) {
	var func_parsed = parseRandFunc(functions[id]);
	var func = func_parsed[0];
	var pars = func_parsed[1];
	
	var func_len;
	
	for(var par = 0; par < pars; par++) {
		do {
			func_len = randomBetween(0, 4);
		} while(func_len % 2 == 0);
		
		for(var part = 0; part < func_len; part++) {
			if(part % 2) {
				func.push(ops[Math.floor(Math.random() * ops.length)]);
			} else {
				var rand = Math.floor(Math.random() * (constants.length + functions.length));
				
				if(rand < constants.length) {
					func.push(constants[rand]);
				} else {
					var new_func = genRandFunc(rand - constants.length);
					
					for(var i = 0; i < new_func.length; i++) {
						func.push(new_func[i]);
					}
				}
			}
		}
		
		if(par + 1 < pars) {
			func.push(",");
		}
	}
	
	func.push(")");
	
	return func;
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
				var func = genRandFunc(rand - constants.length, inputs);
				
				for(var i = 0; i < func.length; i++) {
					action.push(func[i]);
				}
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
