function getInput(canvas, id) {
	return JSONToArray(ctx.getImageData(0, 0, canvas.width, canvas.height).data);
}
