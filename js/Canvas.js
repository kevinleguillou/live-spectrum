class Canvas{
	constructor(){
		let canvasNode = document.createElement("canvas");
		canvasNode.width = window.innerWidth;
		canvasNode.height = window.innerHeight;
		canvasNode.hasResized = false;
		document.body.appendChild(canvasNode);

		this.canvasNode = canvasNode;
		this.canvasContext = this.canvasNode.getContext("2d");
		this.drawingCalls = [];

		window.onresize = function(){
			canvasNode.width = window.innerWidth;
			canvasNode.height = window.innerHeight;
			canvasNode.hasResized = true;
		};

		this.drawingLoop();

		return this;
	}

	addDrawingLoop(drawingFunction){
		this.drawingCalls.push(drawingFunction);
	}

	drawingLoop(){
		this.canvasContext.clearRect(0, 0, this.canvasNode.width, this.canvasNode.height);
		for(let i=0; i<this.drawingCalls.length; i++){
			this.drawingCalls[i](this.canvasContext, this.canvasNode);
		}
		window.requestAnimationFrame(() => {
			this.drawingLoop();
		});
	}
}