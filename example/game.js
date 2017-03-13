var canvas = document.getElementsByTagName("canvas")[0];
var drawer = canvas.getContext("2d");

drawer.moveTo(0,0);
drawer.lineTo(window.innerWidth, window.innerHeight);
drawer.stroke();
