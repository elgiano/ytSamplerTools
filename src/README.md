## ytSamplerTools
Some javscript tools to play youtube as a sampler

### Installation
You can install ytSamplerTools as a bookmarklet. Just go to [gianlucaelia.eu/ytSamplerTools](https://gianlucaelia.eu/ytSamplerTools), right click on the astronaut and save it as a bookmark.

Then, go to youtube and click the bookmark to inject ytSamplerTools into the page and start playing :)

You could also host the content of the `dist` folder on your own server and get your own bookmarklet to fetch code from there.

### Features
Most features are implemented as functions you need to call from your browser console, once you have loaded the bookmarklet.

#### Preloading with node-ytdl-core
First issue with playing youtube is that its adaptive streaming feature makes it lag a lot. Now you can preload your video, and skip through it as fast as possible.
To preload the current video run:
```
p()
```

#### Pitch and speed
Browsers change video speed by time-stretching, without affecting pitch by default, but you can enable a tape-style speed control by running:
```
ps(true)
```
and of course if you pass false instead you'll go back to default time-stretching mode

### Change speed
```
sp(); // prints current speed
sp(0.5); // sets speed to 0.5
modSpeed(1.5); // multiplies current speed by 1.5
randSpeed(0.5, 1.5); // sets a random speed between 0.5 and 1.5
```

### Seeking around
```
curPos(); // prints current position
seek(12.3); // seeks to 12.3 seconds
seekD(1.5); // seeks 1.5 forward
seekD(-2, 4.5); // seeks by a random value between -2 and 4.5 seconds
seekRand(); // seeks somewhere random
```

### Development
Clone this repo and install dependencies:
```
git clone https://github.com/elgiano/ytSamplerTools
cd ytSamplerTools
npm install
```
If you are making changes to ytSamplerTools and want to run a local version, you can get started by running watchify (to recompile every time you make changes), and a local server to give you the updated code:
```
npm run watch & npm start
```
Then if you go to http://localhost:8080 you can get a bookmarklet for your local version
