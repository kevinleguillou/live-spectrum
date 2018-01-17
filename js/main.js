"use strict";

const streamURL = "http://localhost:8000/stream.ogg";
const streamMeta = "http://localhost:8000/status-json.xsl";

window.onload = function(){

	// Create a new canvas
	let canvas = new Canvas();
	let audioStream = new AudioPlayer(streamURL);
	let spectrum = new Spectrum(audioStream);
	// Register a loop that will draw the audio stream spectrum
	canvas.addDrawingLoop(spectrum.drawingLoop);

	let icecast = new Icecast(streamMeta, function(currentTrack){
		document.getElementById("track-title").innerText = currentTrack.title;
		document.getElementById("track-remixer").innerText = currentTrack.remixer;
		document.getElementById("track-artist").innerText = currentTrack.artist;
	});

};