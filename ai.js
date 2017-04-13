var ops = ["+", "-", "*", "/", "%", "==", "!=", ">", "<", "&&", "||", ")"];
var constants = [Math.E, Math.PI, 0, 1, 2, 3, 4, 5, 6, 7, "("];
var functions = ["Math.abs[1]", "Math.acos[1]", "Math.asin[1]", "Math.atan[1]", "Math.atan2[2]", "Math.ceil[1]", "Math.cos[1]", "Math.floor[1]", "Math.max[]", "Math.min[]", "Math.pow[2]", "Math.random[0]", "Math.round[1]", "Math.sin[1]", "Math.sqrt[1]", "Math.tan[1]"]; // [n] = amount of args needed, if brackets are empty you can choose how many args

function parseRandFunc(func, calls) {
	var i = func.indexOf("[");
	var pars = func.substring(i + 1, func.indexOf("]"));
	
	return [[func.substring(0, i), "("], pars ? Number(pars) : randomBetween(0, 4 / calls)];
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
			func_len = randomBetween(0, 4);
		} while(func_len % 2 == 0);
		
		for(var part = 0; part < func_len; part++) {
			if(part % 2) {
				var op_arr = getRandOp(parentheses);
				parentheses = op_arr[1];
				
				func.push(op_arr[0]);
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
						parentheses++;
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

function getRandOp(parentheses) {
	var op = ops[Math.floor(Math.random() * ops.length)];
	
	if(op == ")") {
		if(parentheses > 0) {
			return [op, parentheses - 1];
		} else {
			return getRandOp(parentheses);
		}
	}
	
	return [op, parentheses];
}

function genRandAction(inputs) {
	var action = [];
	var action_len;
	
	do {
		action_len = randomBetween(2, 8);
	} while(action_len % 2 == 0);
	
	var parentheses = 0;
	
	for(var part = 0; part < action_len; part++) {
		if(part % 2) {
			var op_arr = getRandOp(parentheses);
			parentheses = op_arr[1];
			
			action.push(op_arr[0]);
		} else {
			var consts_len = constants.length * 4;
			var rand = Math.floor(Math.random() * (consts_len + functions.length));
			
			if(rand < consts_len) {
				var constant = constants[rand % constants.length];
				
				if(constant == "(") {
					parentheses++;
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
