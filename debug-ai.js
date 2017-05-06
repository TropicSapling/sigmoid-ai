var ops = ["+", "-", "*", "/", "%", "&", "|", "^", "<<", ">>", ")"];
var constants = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7, "i", "("]; // "i" is not exactly a constant but it still fits in this category due to how the functions work
var constants_n = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7, "i"];
var functions = ["getInputById[1]", "Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]", "randomBetween[2]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function randomBetween(min, max) {
	return Math.floor(Math.random()*(max-min+1)+min);
}

function getInputById(input, i) {
	var input_item = input[i];
	
	return input_item ? input_item : 0;
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

function genRandFunc(id, calls) {
	if(!calls) {
		var calls = 1;
	}
	
	var func_parsed = parseRandFunc(functions[id], calls);
	var func = func_parsed[0];
	var pars = func_parsed[1];
	
	var isInputFunc = func_parsed[0][0] == "getInputById";
	
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
					var new_func = genRandFunc(rand - consts_len, calls + 1);
					
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
	
	if(isInputFunc) {
		func.splice(2, 0, "input", ",");
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

function genRandAction() {
	var action = [];
	var action_len;
	
	do {
		action_len = randomBetween(3, 5);
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
				var func = genRandFunc(rand - consts_len);
				
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

function genRandActions(output_count) {
	var outputs = [];
	for(var output = 0; output < output_count; output++) {
		outputs.push(genRandAction());
	}
	
	return outputs;
}

function mutateAction(action, chance) {
	var mutated_action = [];
	
	var parentheses = 0;
	
	for(var part = 0; part < action.length; part++) {
		if(action[part - 1] != "(" && action[part] != "(" && action[part + 1] != "("  && action[part - 1] != ")" && action[part] != ")" && action[part + 1] != ")" && action[part] != "," && action[part + 1] != "," && Math.floor(Math.random() * (1 / chance)) == 0) {
			if(Math.floor(Math.random() * 5) == 1) {
				if(part < action.length - 1 && Math.floor(Math.random() * 3) == 1) {
					console.log("DEL AT " + part + ": " + action[part] + " " + action[part + 1]);
					part += 1;
					console.log("ACT AT " + part + ": " + mutated_action.join(" "));
				} else {
					var rand = Math.floor(Math.random() * (action.length - 1));
					var tries = 0;
					
					while(tries < 9 && (action[rand - 1] == "(" || action[rand] == "(" || action[rand + 1] == "(" || action[rand - 1] == ")" || action[rand] == ")" || action[rand + 1] == ")" || ops.indexOf(action[part]) != ops.indexOf(action[rand]) || constants.indexOf(action[part]) != constants.indexOf(action[rand]) || functions.indexOf(action[part]) != functions.indexOf(action[rand]))) {
						rand = Math.floor(Math.random() * (action.length - 1));
						
						tries++;
					}
					
					if(tries < 9) {
						console.log("PASTE AT " + part + ": " + action[rand] + " " + action[rand + 1]);
						mutated_action.splice(part, 0, action[rand + 1]);
						mutated_action.splice(part, 0, action[rand]);
						part += 1;
						console.log("ACT AT " + part + ": " + mutated_action.join(" "));

						if(Math.round(Math.random())) {
							console.log("DEL ORG AT " + rand + ": " + action[rand] + " " + action[rand + 1]);
							action.splice(rand, 2);
							console.log("ACT AT " + part + ": " + mutated_action.join(" "));
							
							if(rand == part - 1) {
								part -= 3;
							} else if(rand == part) {
								part -= 2;
							} else if(rand == part + 1) {
								part -= 2;
							}
						}
					} else {
						part--;
					}
				}
			} else {
				console.log("EDIT AT " + part);
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
			
			console.log("ACT AT " + part + ": " + mutated_action.join(" "));
		} else {
			mutated_action.push(action[part]);
			console.log("NO ACT CHANGE");
		}
	}
	
	while(parentheses > 0) {
		mutated_action.push(")");
		parentheses--;
	}
	
	return mutated_action;
}

function mutateActions(actions, chance) {
	var mutated_actions = [];
	
	for(var action = 0; action < actions.length; action++) {
		mutated_actions.push(mutateAction(actions[action], chance));
	}
	
	return mutated_actions;
}

function regenAction(n, ai, calls) {
	if(!calls) {
		var calls = 1;
	}
	
	if(!ai.mutated || calls > 9) {
		var action = genRandAction();
	} else {
		var action = mutateAction(ai.actions[n], 0.2);
	}
	
	try {
		ai.actions_exe[n] = new Function("input", "i", "return " + action.join(" "));
		ai.actions[n] = action;
	} catch(e) {
		regenAction(n, ai, calls + 1);
	}
}

function AI(output_count, actions, mutation_chance, info) {
	var ai = this;
	
	this.actions = actions ? actions : genRandActions(output_count);
	
	this.actions_exe = [];
	for(var i = 0; i < ai.actions.length; i++) {
		try {
			ai.actions_exe.push(new Function("input", "i", "return " + ai.actions[i].join(" ")));
		} catch(e) {
			regenAction(i, ai);
		}
	}
	
	this.mutationChance = mutation_chance ? mutation_chance : randomBetween(10, 25) / 100;
	
	this.info = info;
	
	this.timeAlive = 0;
	
	this.exeAction = function(n, input, calls) {
		if(!calls) {
			var calls = 1;
		}
		
		try {
			var func = ai.actions_exe[n];
			var res = func(input, 0);
			
			if(isNaN(res)) {
				regenAction(n, ai, calls);
				
				return ai.exeAction(n, input, calls + 1);
			} else if(ai.actions[n].indexOf("i") != -1) {
				var res = 0;
				
				for(var i = 1; i < input.length; i++) {
					res += func(input, i);
				}
			}
			
			return res;
		} catch(e) {
			regenAction(n, ai, calls);
			
			return ai.exeAction(n, input, calls + 1);
		}
	}
	
	this.mutate = function(chance) {
		var new_actions = mutateActions(ai.actions, chance);
		
		for(var i = 0; i < new_actions.length; i++) {
			try {
				ai.actions_exe.push(new Function("input", "i", "return " + new_actions[i].join(" ")));
				ai.actions[i] = new_actions[i];
			} catch(e) {
				regenAction(i, ai);
			}
		}
		
		ai.mutated = true;
	}
}
