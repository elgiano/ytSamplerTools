const ytdl = require('ytdl-core')
const s2b = require('stream-to-blob')
const {CallableInstance} = require('./utils')

class VideoPreloader extends CallableInstance{
    constructor() {
        super('call');
        this.initDb();
        //this.openDb();
    }

    get hasStorage() { return !!this.db }

    initDb() {
        this.db = {};
    }

    clear() { delete this.db; this.initDb() }

    hasStored(id) { return this.hasStorage && !!this.db[id] }

    getStoredBlob(id) {
        return this.hasStored(id) ? this.db[id] : false
    }

    storeBlob(id, blob) {
        if (!this.hasStorage) return false
        this.db[id] = blob;
        return true
    }

    /*openDb() {
        const request = window.indexedDB.open("ytSamplerTools", 1)
        request.onversionchange = () => {
            this.db.createObjectStore('ytSamplerTools')
        }
        request.onsuccess = () => {
            this.db = request.result;
            this.dbTransaction = this.db.transaction(["ytSamplerTools"], IDBTransaction.READ_WRITE);
            this.db.onerror = e => {
                console.warn("[Preload] Error creating/accessing IndexedDB database")
                this.db = undefined
            };
        }
    }
    clear() { if (this.hasStorage) this.db.deleteObjectStore('ytSamplerTools') }
    isStored (id) {
        if (!this.hasStorage) return false
        return !!window.localStorage.ytSamplerToolsStorage[id]
    }
    getStoredBlob(id) {
        if (!this.hasStorage()) return false
        this.dbTransaction.objectStore("ytSamplerTools").get(id);
    }
    storeBlob(id, blob) {
        if (!this.hasStorage()) return false
        this.dbTransaction.objectStore("ytSamplerTools").put(blob, id);
    }
    */

    getId (url) {
        return new URLSearchParams(new URL(url).search).get('v');
    }

    preload(url, store = true, maxRetries = 4) {
        url = url || window.location.href;
        console.log('[Preloading]', url);
        const id = this.getId(url);
        if (this.hasStored(id)) {
            console.log('[Preloading] got it from storage')
            this.replaceVideo(this.getStoredBlob(id))
        } else {
            const stream = this.getBlob(url);
            stream.on('error', err => {
                console.error(`[Preloading] ${err}`)
                if (maxRetries > 0) {
                    console.warn(`[Preloading] retrying in 1s (attempts left: ${maxRetries})`)
                    setTimeout(() => this.preload(url, store, maxRetries - 1), 1000)
                }
            });
            s2b(stream).then(blob => {
                console.log('[Preloading] got blob:', blob);
                this.replaceVideo(blob)
                if (store) {
                    console.log('[Preloading] storing blob', id);
                    this.storeBlob(id, blob)
                }
            })
        }
    }

    replaceVideo(blob) {
        const video = document.querySelector('video')
        const play = !video.paused
        const pos = video.currentTime
        video.src = URL.createObjectURL(blob)
        video.currentTime = pos
        if(play) document.querySelector('video').play()
    }

    getBlob (url, store = true) {
        let progress = 0;
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
        return stream
    }

    call(url) { this.preload(url) }

}

module.exports = VideoPreloader;
