var ops = ["+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>", ")"];
var constants = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7, "("];
var constants_n = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]", "randomBetween[2]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function randomBetween(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function parseRandFunc(func, calls) {
	var i = func.indexOf("[");
	var pars = func.substring(i + 1, func.indexOf("]"));
	
	return [[func.substring(0, i), "("], pars ? Number(pars) : randomBetween(1, 4 / calls)];
}

function parseFunc(func) {
	var i = func.indexOf("[");
	var pars = func.substring(i + 1, func.indexOf("]"));
	
	return [[func.substring(0, i), "("], pars ? Number(pars) : -1];
}

function genRandFunc(id, inputs, calls) {
	if(!calls) {
		var calls = 1;
	}
	
	var func_parsed = parseRandFunc(functions[id], calls);
	var func = func_parsed[0];
	var pars = func_parsed[1];
	
	var func_len;
	
	var parentheses = 0;
	
	for(var par = 0; par < pars; par++) {
		do {
			func_len = randomBetween(1, 3);
		} while(func_len % 2 == 0);
		
		for(var part = 0; part < func_len; part++) {
			if(part % 2) {
				if(parentheses < func_len - part) {
					var op_arr = getRandOp(func.length > 0 && func[func.length - 1] == "(", parentheses);
					parentheses = op_arr[1];
					
					if(op_arr[0] == ")") {
						part--;
					}
					
					func.push(op_arr[0]);
				} else {
					func.push(")");
					
					parentheses--;
					part--;
				}
			} else {
				var consts_len = constants.length * 4;
				
				if(calls > 1) {
					var rand = Math.floor(Math.random() * constants.length);
				} else {
					var rand = Math.floor(Math.random() * (consts_len + functions.length));
				}
				
				if(rand < consts_len) {
					var constant = constants[rand % constants.length];
					
					if(constant == "(") {
						if(part > func_len - 3 || (func.length > 0 && func[func.length - 1] == ")")) {
							constant = constants_n[Math.floor(Math.random() * constants_n.length)];
						} else {
							parentheses++;
							part--;
						}
					}
					
					func.push(constant);
				} else {
					var new_func = genRandFunc(rand - consts_len, inputs, calls + 1);
					
					for(var i = 0; i < new_func.length; i++) {
						func.push(new_func[i]);
					}
				}
			}
		}
		
		while(parentheses > 0) {
 			func.push(")");
 			parentheses--;
 		}
		
		if(par + 1 < pars) {
			func.push(",");
		}
	}
	
	func.push(")");
	
	return func;
}

function getRandOp(parenthesis, parentheses) {
	var op = ops[Math.floor(Math.random() * ops.length)];
	
	if(op == ")") {
		if(parentheses < 1 || parenthesis) {
			return getRandOp(parenthesis, parentheses);
		} else {
			return [op, parentheses - 1];
		}
	}
	
	return [op, parentheses];
}

function genRandAction(inputs) {
	var action = [];
	var action_len;
	
	do {
		action_len = randomBetween(3, 7);
	} while(action_len % 2 == 0);
	
	var parentheses = 0;
	
	for(var part = 0; part < action_len; part++) {
		if(part % 2) {
			if(parentheses < action_len - part) {
				var op_arr = getRandOp(action.length > 0 && action[action.length - 1] == "(", parentheses);
				parentheses = op_arr[1];
				
				if(op_arr[0] == ")") {
					part--;
				}
				
				action.push(op_arr[0]);
			} else {
				action.push(")");
					
				parentheses--;
				part--;
			}
		} else {
			var consts_len = constants.length * 4;
			var rand = Math.floor(Math.random() * (consts_len + functions.length));
			
			if(rand < consts_len) {
				var constant = constants[rand % constants.length];
				
				if(constant == "(") {
					if(part > action_len - 3 || (action.length > 0 && action[action.length - 1] == ")")) {
						constant = constants_n[Math.floor(Math.random() * constants_n.length)];
					} else {
						parentheses++;
						part--;
					}
				}
				
				action.push(constant);
			} else {
				var func = genRandFunc(rand - consts_len, inputs);
				
				for(var i = 0; i < func.length; i++) {
					action.push(func[i]);
				}
			}
		}
	}
	
	while(parentheses > 0) {
 		action.push(")");
 		parentheses--;
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

function mutateAction(inputs, action, chance) {
	var mutated_action = [];
	
	var parentheses = 0;
	
	for(var part = 0; part < action.length; part++) {
		if(action[part - 1] != "(" && action[part] != "(" && action[part + 1] != "("  && action[part - 1] != ")" && action[part] != ")" && action[part + 1] != ")" && action[part] != "," && action[part + 1] != "," && Math.floor(Math.random() * (1 / chance)) == 0) {
			if(Math.floor(Math.random() * 5) == 1) {
				if(Math.floor(Math.random() * 3) == 1) {
					action.splice(part, 2);
				} else {
					var rand = Math.floor(Math.random() * (action.length - 1));
					var tries = 0;
					
					while(tries < 9 && (action[rand - 1] == "(" || action[rand] == "(" || action[rand + 1] == "(" || action[rand - 1] == ")" || action[rand] == ")" || action[rand + 1] == ")" || ops.indexOf(action[part]) != ops.indexOf(action[rand]) || constants.indexOf(action[part]) != constants.indexOf(action[rand]) || functions.indexOf(action[part]) != functions.indexOf(action[rand]))) {
						rand = Math.floor(Math.random() * (action.length - 1));
						
						tries++;
					}
					
					if(tries < 9) {
						action.splice(part, 0, action[rand + 1]);
						action.splice(part, 0, action[rand]);
						
						if(Math.round(Math.random())) {
							action.splice(rand, 2);
						}
					} else {
						part--;
					}
				}
			} else {
				if(ops.indexOf(action[part]) != -1) {
					var op_arr = getRandOp(action.length > 0 && action[action.length - 1] == "(", parentheses);
					parentheses = op_arr[1];
					
					mutated_action.push(op_arr[0]);
				} else if(constants.indexOf(action[part]) != -1 || constants.indexOf(Number(action[part])) != -1) {
					var constant = constants[Math.floor(Math.random() * constants.length)];
					
					if(constant == "(") {
						if(mutated_action.length > 0 && mutated_action[mutated_action.length - 1] == ")") {
							constant = constants_n[Math.floor(Math.random() * constants_n.length)];
						} else {
							parentheses++;
							
							action.splice(part + 1, 1);
						}
					}
					
					mutated_action.push(constant);
				} else {
					var pars;
					for(var id = 0; id < functions.length; id++) {
						var func_parsed = parseFunc(functions[id]);
						
						if(action[part] == func_parsed[0][0]) {
							pars = func_parsed[1];
							break;
						}
					}
					
					var mod_functions = [];
					for(var id = 0; id < functions.length; id++) {
						var func_parsed = parseFunc(functions[id]);
						
						if(func_parsed[1] == pars) {
							mod_functions.push(func_parsed[0][0]);
						}
					}
					
					mutated_action.push(mod_functions[Math.floor(Math.random() * mod_functions.length)]);
				}
			}
		} else {
			mutated_action.push(action[part]);
		}
	}
	
	while(parentheses > 0) {
		mutated_action.push(")");
		parentheses--;
	}
	
	return mutated_action;
}

function mutateActions(inputs, actions, chance) {
	var mutated_actions = [];
	
	for(var action = 0; action < actions.length; action++) {
		mutated_actions.push(mutateAction(inputs, actions[action], chance));
	}
	
	return mutated_actions;
}

function AI(inputs, output_count, actions, info) {
	var ai = this;
	
	this.actions = actions ? actions : genRandActions(inputs, output_count);
	this.inputs = inputs;
	
	this.info = info;
	
	this.exeAction = function(n, input, calls) {
		if(!calls) {
			calls = 1;
		}
		
		try { 
			return (new Function("input", "return " + ai.actions[n].join(" ")))(input);
		} catch(e) {
			console.log(ai.actions[n].join(" "));
			
			if(!ai.mutated || calls > 9) {
				ai.actions[n] = genRandAction(ai.inputs);
			} else {
				ai.actions[n] = mutateAction(ai.inputs, ai.actions[n], 0.2);
			}
			
			ai.exeAction(n, input, calls + 1);
		}
	}
	
	this.mutate = function(chance) {
		mutateActions(ai.inputs, ai.actions, chance);
		
		ai.mutated = true;
	}
}
