class Spectrum{
	constructor(audioStream){
		this.audioStream = audioStream;
		this.intensityRange = Math.abs(this.audioStream.analyser.maxDecibels) - Math.abs(this.audioStream.analyser.minDecibels);
		this.width = 0;
		this.height = 0;

		this.drawingLoop = (canvasContext, canvasNode) => {
			this.width = canvasNode.width;
			this.height = canvasNode.height;

			let freqData = this.audioStream.getCurrentFFTData();
			freqData = freqData.slice(0, freqData.length*0.85);
			
			let barWidth = 1;
			let barsToShow = 0;
			let barToSkip = 1;
			while(this.width > barWidth * freqData.length){
				barWidth++;
			}

			barsToShow = Math.ceil(this.width/barWidth);
			if(barsToShow != freqData.length) barToSkip = Math.ceil(barsToShow/(freqData.length-barsToShow));

			let bar = {};
			let barIntensity = 0;
			let freqPos = 0;
			let barPosX = 0;
			let skipCounter = 0;

			while(freqPos<freqData.length){
				barIntensity = this.getFreqIntensity(freqData[freqPos]);
				bar = {
					posX: barPosX,
					posY: this.height*(1-barIntensity),
					width: barWidth,
					height: this.height*barIntensity
				};
				this.drawBar(bar, canvasContext);
				freqPos++;
				if(barToSkip != 1 && skipCounter <= barToSkip){
					freqPos++;
					skipCounter++;
				}else if(skipCounter == barToSkip){
					skipCounter = 0;
				}
				barPosX+=barWidth;
			}
		}
	}
	
	/*
		getFreqIntensity(freqSample)
		freqSample : intensity of a frequency in dB, one sample from a FFT
		Returns frequency intensity between 0 and 1
	*/
	getFreqIntensity(freqSample){
		let freqIntensity = 0;
		if(freqSample < this.audioStream.analyser.minDecibels) freqSample = this.audioStream.analyser.minDecibels;
		let currentFreqIntensity = Math.abs(this.audioStream.analyser.maxDecibels) - Math.abs(freqSample);
		freqIntensity = 1 - (currentFreqIntensity*100/this.intensityRange)/100;
		return freqIntensity;
	}
	drawBar(bar, canvasContext){
		//let colorPalette = ["#522119", "#221116", "#18121b", "#15121a", "#161826"];
		canvasContext.fillStyle = "#36384c";
		canvasContext.fillRect(bar.posX, bar.posY, bar.width, bar.height);
	}
}