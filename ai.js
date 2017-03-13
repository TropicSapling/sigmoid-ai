var ops = ["+", "-", "*", "/"];
var functions = ["Math.pow[2]", "Math.sqrt[1]", "Math.sin[1]", "Math.cos[1]", "Math.abs[1]"]; // [n] = amount of args needed

var AIs = [];
function AI(input, output_count, actions) = {
	this.actions = actions ? actions : genRandActions(output_count);
}
