const ytdl = require('ytdl-core')
const s2b = require('stream-to-blob')
const YoutubePlayer = require('./youtubeFunctions')
const Looper = require('./looper')

window.ytdl = ytdl
window.s2b = s2b
window.yt = new YoutubePlayer()
window.loop = new Looper(window.yt)

const getBlob = (url) => {
    url = url || window.location.href;
    console.log('[Preloading]', url);
    const stream = ytdl(url);
    stream.on('progress', (chunkLen, got, total)=>console.log(`[Preloading] ${got / 1024} of ${total / 1024}MB`))
    s2b(stream).then(blob => {
        console.log('[Preloading] got blob:', blob);
        document.querySelector('video').src = URL.createObjectURL(blob)
    })
    return stream
}

window.preload = getBlob