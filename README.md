## ytSamplerTools
Some javascript tools to play youtube as a sampler

### Installation and usage
You can install ytSamplerTools as a bookmarklet:
- Go to [gianlucaelia.eu/ytSamplerTools](https://gianlucaelia.eu/ytSamplerTools).
- Right-click on the astronaut and save it as a bookmark.

Once you have the bookmark you can:
- go to youtube
- open a video
- click the bookmark to inject ytSamplerTools into the page
- start playing :)

_(you could also host the content of the `dist` folder on your own server and get your own bookmarklet to fetch code from there)_

### Features
Most features are implemented as functions you need to call from your browser console, once you have loaded the bookmarklet.

#### Preloading with node-ytdl-core

First issue with playing youtube is that its adaptive streaming feature makes it lag a lot. Now you can preload your video, and skip through it as fast as possible.

> **Note**: your browser needs to disable CORS for preloading to work. This is not recommended when browsing the Internet in general, because disabling CORS can create security vulnerabilities. I personally use a browser extension to disable CORS only when I'm playing with ytSampler: on Firefox I use [CORS Everywhere](https://addons.mozilla.org/en-US/firefox/addon/cors-everywhere/) and on Chromium [CORS Unblock](https://chrome.google.com/webstore/detail/cors-unblock/lfhmikememgdcahcdlaciloancbhjino).

To preload the current video run:
```javascript
p()
```

#### Pitch and speed
Browsers change video speed by time-stretching, without affecting pitch by default, but you can enable a tape-style speed control by running:
```javascript
ps(true)
```
and of course if you pass false instead you'll go back to default time-stretching mode

#### Change speed
```javascript
sp(); // prints current speed
sp(0.5); // sets speed to 0.5
modSpeed(1.5); // multiplies current speed by 1.5
randSpeed(0.5, 1.5); // sets a random speed between 0.5 and 1.5
```

#### Seeking around
```javascript
curPos(); // prints current position
seek(12.3); // seeks to 12.3 seconds
seekD(1.5); // seeks 1.5 forward
seekD(-2, 4.5); // seeks by a random value between -2 and 4.5 seconds
seekRand(); // seeks somewhere random
```

#### Common loop functions
```javascript
// seek 1 second backwards, every second (note: this drifts due to unprecise timing)
stut(1);

// save current position and seek back to it every second(doesn't drift, can still be unprecise with loop length though)
stut2(1);

// note: since stut2 saves a precise position, seeking around doesn't affect its start point. To change position and loop from there you need to reset stut2.
// move randomly within 10 seconds and loop from there:
seekD(-5, 5); stut2(1);
// move to 0:30 and loop from there
seek(30); stut2(1);

// stutter with random duration, here between 1 and 3 seconds
stut2(1, 3);

// stop stuttering
stut(0);

// seek and stutter
l("a", ()=>{seek(rand(10,100)); stut2(1.2)}, ()=>rand(5,15));
l.stop("a");

// stop all loops and stutters
l.stop()
```

#### Sequences
```javascript
// sequence of seek positions
s = seq([10, 20, 30])
l(0, ()=>{seek(s.next)}, ()=>rand(1,3))

// sequence of speeds
p = seq([1, 1.25, 1.5, 15/8])
l(1, ()=>{sp(p.next)}, ()=>rand(1,3))

// seek to position randomly chosen from a list
l(2, ()=>{seek(choose([1,2,3,4]))}, ()=>1)
```

### Development
Clone this repo and install dependencies:

```bash
git clone https://github.com/elgiano/ytSamplerTools
cd ytSamplerTools
npm install
```
If you are making changes to ytSamplerTools and want to run a local version, you can get started by running watchify (to recompile every time you make changes), and a local server to give you the updated code:
```
npm run watch & npm start
```
Then if you go to http://localhost:8080 you can get a bookmarklet for your local version
