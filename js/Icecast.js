/*
	HTTPRequest
	Create XMLHttpRequest and executes a callback once data is received
*/
class HTTPRequest{

	static call(uri, callback, errorHandler){
		this.request = new XMLHttpRequest();
		if(!this.request){
			console.error("Failed to init XMLHttpRequest");
			return false;
		}
		this.uri = uri;
		this.callback = callback;
		this.errorHandler = errorHandler ? errorHandler : {};

		this.request.onreadystatechange = () => {
			if(this.request.readyState === XMLHttpRequest.DONE){
				if(this.request.status === 200) {
					this.callback(this.request.responseText);
				} else {
					this.errorHandler(this.request.responseText);
					console.error("Failed to execute XMLHttpRequest", this.uri, this.request);
				}
			}
		};
		this.request.open('GET', this.uri);
		this.request.send();
	}
	
}

class Icecast{

	constructor(url, onTrackChange){
		this.url = url;
		this.track = {};
		this.refreshDelay = 8000;
		this.checkStream();
		this.onTrackChange = onTrackChange;
	}

	getRegexValue(match){
		var value = null;
		if(match != undefined) value = match.trim(); 
		return value;
	}

	/*
		If no ID3Tag info are available, analyzes the filename, extracts data
		Based on the most common naming conventions
			Artist Name - Title (Remixer Name)
		Matched elements should follow the following order
			- Artist          : Cell 1
			- Name            : Cell 2
			- Remixer         : Cell 3
	*/
	guessTrackMetadata(trackFilename){
		var currentTrack = {
			"artist" : null,
			"title" : trackFilename,
			"remixer" : null
		};
		var trackFilenameRegEx = /([\w\s\&\,\'\.]+)\s\-\s([\w\s\&\,\'\.]+)(?:\s)*(\([\w\s\&\,\'\.]+\))*/gi;
		var matchedElements = trackFilenameRegEx.exec(trackFilename);

		if(matchedElements != null){
			currentTrack.artist = this.getRegexValue(matchedElements[1]);
			currentTrack.title = this.getRegexValue(matchedElements[2]);
			currentTrack.remixer = this.getRegexValue(matchedElements[3]);
		}

		return currentTrack;
	}

	/*
		If Icecast provides all ID3Tags
		Check if the Track Title contains a Remixer
	*/
	extractRemixer(track){
		var currentTrack = {
			"artist" : track.artist,
			"title" : track.title,
			"remixer" : null
		};
		var trackRegEx = /([\w\s\&\,\.]+)(?:\s)*(\([\w\s\&\,\.]+\))*/gi;
		var matchedElements = trackRegEx.exec(currentTrack.title);

		if(matchedElements != null){
			currentTrack.title = this.getRegexValue(matchedElements[1]);
			currentTrack.remixer = this.getRegexValue(matchedElements[2]);
		}

		return currentTrack;
	}

	updateTrack(currentTrack){
		if(this.track.title !== currentTrack.title
		   || this.track.remixer !== currentTrack.remixer
		   || this.track.artist !== currentTrack.artist){
			this.track = currentTrack;
			this.onTrackChange(currentTrack);
		}
	}

	/*
		`title` is null if no track has been played yet
		Icecast returns null if an ID3Tag is empty, We use guessTrackMetadata() to guess them if that's the case
		Try to find a remixer inside the ID3Tag title field if it exists
	*/
	checkStream(){
		HTTPRequest.call(this.url, (data) => {
			let currentTrack = JSON.parse(data).icestats.source;
			if(currentTrack.title){
				if(currentTrack.artist == null){ currentTrack = this.guessTrackMetadata(currentTrack.title); }
				else{ currentTrack = this.extractRemixer(currentTrack); }
				this.updateTrack(currentTrack);
			}
			setTimeout(() => this.checkStream(), this.refreshDelay);
		});
	}

}