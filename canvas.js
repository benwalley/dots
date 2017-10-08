var dotArr = []
var stopDots = false

var canvas = document.getElementById('dotCanvas') //defined canvas GLOBALY
if (canvas.getContext){
	var ctx = canvas.getContext('2d') //defined ctx GLOBALY
	console.log("working")
}else{
	// code for if a canvas is not allowed
	alert('canvas is not allowed on this page')
}





class Canvas {
	constructor(){
		this.canvas = canvas;
	}

	fill(){

		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		document.body.style.margin = "0"
		document.body.style.overflow = "hidden"
	}

	color(color){
		this.canvas.style.background = color
	}

	image(url, overlay){
		this.canvas.style.backgroundImage = "url("+ url +")";
	}
	
}

// class that handles drawing a circle
class DrawCircle {
	constructor(x,y,r,color){
		this.x = x;
		this.y = y;
		this.r = r;
		this.color = color;

		this.makeCircle()
	}

	makeCircle(){
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.r,0, 2*Math.PI);
		if(this.color != undefined){
			ctx.fillStyle = this.color
		}else{
			ctx.fillStyle = "white"

		}
		
		ctx.fill()
	}

	circleColor(color){
		this.color = color
	}

}

// convert to rgba, from hex, or rgb, or rgba
function toRGBA(color){

	if(color[0] == "#" && color.length ==7){
		// it is hex
	
		var r = parseInt(color.slice(1,3),16)
		var g = parseInt(color.slice(3,5),16)
		var b = parseInt(color.slice(5,),16)
		var a = 1
		return("rgba(" + r + ',' + g + ',' + b + ',' + a + ')')

	}else if(color.slice(0,4) == "rgba" || color.slice(0,4) == "RGBA"){
		// format is already RGBA
		return color

	}else if(color.slice(0,3) == "rgb" || color.slice(0,3) == "RGB"){
		// it is RGB
		rgb = color.slice(4,-1).split(",")
		return("rgba(" + rgb[0] + "," + rgb[1] + ',' + rgb[2] + ',' + "1" +')')
	}else{
		// keep the default color
		return false
	}

}



class DrawLine{
	constructor(startx, starty, endx, endy, color = "#ffffff", thickness = .1){

		if(toRGBA(color)){
			this.color = toRGBA(color);
		}else{
			this.color = color
		}
		this.thickness = thickness;

		this.startx = startx;
		this.starty = starty;
		this.endx = endx;
		this.endy = endy

		this.drawLine()
	}

	drawLine(){
		ctx.beginPath()
		ctx.moveTo(this.startx, this.starty);
		ctx.lineTo(this.endx, this.endy);
		ctx.lineWidth = this.thickness
		ctx.strokeStyle = this.color
		ctx.stroke()
	}


}

function drawLines(maxLineDist, lineColor, lineThickness){
	for(var i = 0; i < dotArr.length; i++){
		for(var q = 0; q < dotArr.length; q++){
			var len = ((Math.abs(dotArr[i].x - dotArr[q].x)) + (Math.abs(dotArr[i].y - dotArr[q].y)))/2
			if(len <= maxLineDist){
				var opacity = (maxLineDist - len)/maxLineDist
				var split = toRGBA(lineColor).split(",")
				split[3] = opacity + ")"
				newLineColor = split.toString()
				console.log(newLineColor)	
				var line = new DrawLine(dotArr[i].x, dotArr[i].y, dotArr[q].x, dotArr[q].y, newLineColor, lineThickness)
			}
			
		}
	}
}



// initialize creating circles
// if undefined, params will default to,( 100, 1, 2, grey)
function initCircles(numDots, speed, radius, color){
	// fill the array with data
	fillArray(numDots, speed, radius, color)
	// create dots from data
	drawCircles()
	// start animation
	animate()
}

// initialize circles and lines
function initCirclesLines(numDots, speed, radius, color, maxLineDist, lineColor, lineThickness){

}


function randomInt(min, max){
	return(Math.round(Math.random() * (max - min) + min))
}

// draw circle for all points in dotArr[]
function drawCircles(){
	for(var i = 0; i < dotArr.length; i++){
		circ = new DrawCircle(dotArr[i].x, dotArr[i].y, dotArr[i].r, dotArr[i].color)
	}
}

function random(arr){
	
}


// fills dotArr[] with x, y, r, color, dx, and dy
function fillArray(number = 100, speed = 1, radius = 2, color = "grey"){
	for(var i = 0; i < number; i++){
		if((Array.isArray(radius)) && (radius.length == 2)) {		
			var newRadius = (Math.random() * (radius[1] - radius[0])) + radius[0]
			
		}else{
			newRadius = radius
		}
		dotInfo = {
			x:randomInt(0, canvas.width),
			y:randomInt(0, canvas.height),
			r:newRadius,
			color:color,
			dx:(Math.random() * (speed *2))-speed,		
			dy:(Math.random() * (speed *2))-speed	
		}
		dotArr.push(dotInfo)

	}
	console.log(dotArr)
}

function moveCircles(){
	for (var i = 0; i < dotArr.length; i++) {
		if((dotArr[i].x < 0) || (dotArr[i].x > canvas.width)){
			dotArr[i].dx = -dotArr[i].dx
		}
		if((dotArr[i].y < 0) || (dotArr[i].y > canvas.height)){
			dotArr[i].dy = -dotArr[i].dy
		}
		dotArr[i].x += dotArr[i].dx
		dotArr[i].y += dotArr[i].dy
		
		
	}
}

function endDots(){
	stopDots = true
	ctx.clearRect(0,0,canvas.width, canvas.height)
}

function animate(){
	ctx.clearRect(0,0,canvas.width, canvas.height)
	// change coordinates in array
	moveCircles()
	// redraw
	drawCircles()
	drawLines(100, "#000000", .3)
	if(stopDots == false){
		window.requestAnimationFrame(animate)
	}else{
		ctx.clearRect(0,0,canvas.width, canvas.height)
	}
	
}

