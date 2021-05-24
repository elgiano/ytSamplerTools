const ytdl = require('ytdl-core')
const s2b = require('stream-to-blob')
const YoutubePlayer = require('./youtubeFunctions')
const Looper = require('./looper')
const KeyboardLooper = require('./keyboard')
const {rand, irand, coin, choose} = require('./utils')

window.ytdl = ytdl
window.s2b = s2b
window.y = new YoutubePlayer()
window.l = new Looper(window.y)
window.k = new KeyboardLooper(window.y, window.l);
Object.assign(window, {rand, irand, coin, choose})

const getBlob = (url) => {
    url = url || window.location.href;
    let progress = 0;
    console.log('[Preloading]', url);
    const stream = ytdl(url);
    stream.on('progress', (chunkLen, got, tot)=> {
        const currProgress = Math.round(got / tot * 100);
        const diff = currProgress - progress
        if(diff >= 10) {
            progress += Math.floor(diff / 10) * 10
            const gotMb = Math.round(got / 1e4) / 1e2
            const totMb = Math.round(tot / 1e4) / 1e2
            console.log(`[Preloading] ${currProgress}% (${gotMb} of ${totMb}MB)`)
        }
    })
    s2b(stream).then(blob => {
        const video = document.querySelector('video')
        console.log('[Preloading] got blob:', blob);
        const play = !video.paused
        const pos = video.currentTime
        video.src = URL.createObjectURL(blob)
        video.currentTime = pos
        if(play) document.querySelector('video').play()
    })
    return stream
}

window.preload = getBlob

