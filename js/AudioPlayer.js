class AudioPlayer{

	constructor(url){
		this.audioContext = new AudioContext();

		this.source = this.audioContext.createMediaElementSource(new Audio(url));
		this.source.mediaElement.crossOrigin = "anonymous";
		this.gain = this.audioContext.createGain();
		this.analyser = this.audioContext.createAnalyser();
		this.analyser.fftSize = 2048;

		this.source.connect(this.gain);
		this.source.connect(this.analyser);
		this.gain.connect(this.audioContext.destination);

		this.source.mediaElement.play();
		this.source.mediaElement.currentTime = 60;
		return this;
	}

	getCurrentFFTData(){
		let bufferLength = this.analyser.frequencyBinCount;
		let fftData = new Float32Array(bufferLength);
		this.analyser.getFloatFrequencyData(fftData);
		return fftData;
	}

}