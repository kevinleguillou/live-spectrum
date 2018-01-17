[LiveSpectrum](documentation/logo.svg)

LiveSpectrum is a simple overlay for DJs that want visuals for their livestream.

Start broadcasting from your DJ software using [Icecast](http://icecast.org/download/), and the page will display a live spectrum of the broadcast and the current song. You can place this over another layer in your broadcasting software.

[LiveSpectrum showcase](documentation/livespectrum-showcase.jpg)

## How to Setup LiveSpectrum

In this example, we use **Traktor** which has a broadcasting function built-in. Open the Preferences and fill the Broadcasting page with Icecasts default parameters. The default password is `hackme` and can be edited in `icecast.xml` located where you installed Icecast.

[Setup Traktor Broadcasting](documentation/setup-traktor-broadcasting.jpg)

Run the Icecast server so it's ready to receive your broadcast.

[Run Icecast Server](documentation/run-icecast-server.jpg)

In your DJ software, start broadcasting : in Traktor you need to click on the tab with the tape, then on the button with the antenna.
Any audio you play will be broadcast to the Icecast server, and each time you hit *Play* on a deck, the server will update the current track title.

Check if your Icecast server works properly by playing something and listening for the feedback on http://localhost:8000/stream.ogg

Open the `LiveSpectrum.html` page to test the visuals and track name display.

[Start Broadcasting](documentation/start-broadcasting.jpg)

In this example we use **OBS Studio**. Open your livestream software and add a web page to your scene. In OBS you do this by adding a new Source called BrowserSource. Load LiveSpectrum.html.

[Load As File](documentation/load-as-file.jpg)

Note that you can load the page with the dimensions you want. Once you've added LiveSpectrum on your livestream, you can arrange your layout and add other visuals.
In the example below, I've loaded a background image, a cropped window of Traktor showing Deck A & B, and LiveSpectrum.

[Arrange Your Livestream Layout](documentation/arrange-your-livestream-layout.jpg)

I've tried to write modern JS using ES6 and commented as I've seen fit so it's easy to look at the code and improve upon it. Feel free to customize it to fit your needs.