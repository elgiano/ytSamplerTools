const ytdl = require('ytdl-core')
const s2b = require('stream-to-blob')
const YoutubePlayer = require('./youtubeFunctions')
const Looper = require('./looper')
const KeyboardLooper = require('./keyboard')
const VideoPreloader = require('./preloader')
const {rand, irand, coin, choose, seq} = require('./utils')

window.ytdl = ytdl
window.s2b = s2b
window.y = new YoutubePlayer()
window.l = new Looper(window.y)
window.k = new KeyboardLooper(window.y, window.l);
window.p = new VideoPreloader();

Object.assign(window, {rand, irand, coin, choose, seq})

const forwardFunc = (obj, name) => {
    window[name] = (...args) => obj[name](...args)
}
const forwardPlayer = ['sp', 'ps', 'modSpeed', 'seek', 'seekD', 'seekRand', 'randSpeed', 'toggleDisplay']
const forwardLooper = ['stut', 'stut2', 'skip', 'skip2']
for(const name of forwardPlayer) { forwardFunc(window.y, name) }
for(const name of forwardLooper) { forwardFunc(window.l, name) }


