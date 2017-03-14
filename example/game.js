function drawBg(drawer, line_count, colour) {
	drawer.fillStyle = colour;
	
	for(var i = 0; i < line_count; i++) {
		drawer.moveTo(i * (window.innerWidth / line_count), 0);
		drawer.lineTo(i * (window.innerWidth / line_count), window.innerHeight);
		drawer.stroke();
	}
	
	for(var i = 0; i < line_count; i++) {
		drawer.moveTo(0, i * (window.innerWidth / line_count));
		drawer.lineTo(window.innerWidth, i * (window.innerWidth / line_count));
		drawer.stroke();
	}
	
	drawer.fillStyle = "black";
}

$(function() {
	var canvas = document.getElementsByTagName("canvas")[0];
	
	canvas.setAttribute("width", window.innerWidth);
	canvas.setAttribute("height", window.innerHeight);
	
	var drawer = canvas.getContext("2d");
	
	drawBg(drawer, 10, "#eeeeee");
});
