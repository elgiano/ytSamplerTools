const {rand, irand} = require('./utils')

class YoutubePlayer {

    get v() { return document.querySelector("video") }

    get curPos() { return this.v.currentTime }
    get dur() { return this.v.duration }
    get speed() { return this.v.playbackRate }
    get randPos() { return rand(0, this.dur) }

    seek(time) { this.v.currentTime = time }
    seekRand() { this.seek(this.randPos) }
    seekDelta(delta) { this.seek(this.curPos + delta) }
    seekDrand(lo = -1, hi = 1) { this.seekDelta(rand(lo,hi)) }
    seekD(delta, hi) { hi === undefined ? this.seekDelta(delta) : this.seekDrand(delta, hi) }

    set speed(newSpeed) { this.v.playbackRate = newSpeed < 0.25 ? 0.25 : newSpeed > 4 ? 4 : newSpeed }
    modSpeed(ratio, hi) { if(hi !== undefined) ratio = rand(ratio, hi); this.speed = this.speed * ratio; return this.speed }
    randSpeed(lo=-3, hi=3) { this.speed = Math.pow(2, rand(lo, hi)); return this.speed }
    sp(newSpeed, hi) { 
        if (newSpeed != undefined) {
            if (hi != undefined) randSpeed(newSpeed, hi)
            else this.speed = newSpeed;
        } 
        return this.speed 
    }

    pitchShift(activate = true) {
        const video = this.v;
        if (video.preservesPitch != undefined) { 
            video.preservesPitch = !activate 
        } else if (video.mozPreservesPitch != undefined) {
            video.mozPreservesPitch = !activate
        } else if (video.webkitPreservesPitch != undefined) {
            video.webkitPreservesPitch = !activate
        } else {
            console.warn("[pitchShift] not supported by this browser")
        }
    }

}

module.exports = YoutubePlayer
