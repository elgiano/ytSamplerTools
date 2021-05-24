class KeyboardLooper {
    constructor(sampler, looper) {
        this.loops = {}
        this.keyupListenerFn = (e) => this.keyUp(e)
        this.keydownListenerFn = (e) => this.keyDown(e)
        this.looper = looper
        this.speeds = [4/9, 8/15, 2/3, 4/5, 1, 5/4, 3/2, 15/8, 9/4]
        this.bind(sampler)
    }

    has(name) { return !!this.loops[name] }
    hasComplete(name) {  return !!this.loops[name] && this.loops[name].end != undefined }

    initLoop(name, pos) {
        console.log(`[KeyLoop] '${name}' starts at ${pos}`)
        this.loops[name] = {start: pos};
    }

    finalizeLoop(name, pos, play = true) {
        const loop = this.loops[name];
        if(!loop || !loop.start) {
            console.warn(`[KeyLoop] loop ${name} didn't have a startPos`)
            return
        }
        loop.end = pos
        console.log(`[KeyLoop] '${name}' ${loop.start}->${loop.end} (${loop.end-loop.start}s)`)
        if(play) this.setupLoop(name)
    }

    clearLoop(name) { 
        console.log(`[KeyLoop] clearing '${name}'`)
        delete this.loops[name] 
    }

    setupLoop(name) {
        if (this.has(name)) {
            const loop = this.loops[name]
            this.looper.skip2(name, loop.start, loop.end - loop.start)
        } else {
            console.warn(`[KeyLoop] ${name} not initialized`)
        }
    }

    skipTo(name) {
        if(this.has(name))
            this.sampler.seek(this.loops[name].start)
        else
            console.warn(`[KeyLoop] ${name} not initialized`)
    }


    toggleLoop(name) {
        if (this.looper.has(name))
            this.looper.toggle(name)
        else {
            this.setupLoop(name)
        }
    }

    keyUp(event) {
        const name = event.key;
        if('QWERTYUIOP'.includes(name))
            this.finalizeLoop(name.toLowerCase(), this.sampler.curPos, false);
    }

    keyDown(event) {
        let name = event.key;
        let stopPropagation = false;
        if('qwertyuiop'.includes(name)) {
            //this.toggleLoop(name, this.sampler.curPos);
            this.skipTo(name)
            stopPropagation = true
        } else if('QWERTYUIOP'.includes(name)) {
            name = name.toLowerCase()
            if(!this.has(name) || this.hasComplete(name))
                this.initLoop(name, this.sampler.curPos);
            stopPropagation = true
        } else if('asdfghjkl'.includes(name)) {
            const nSpeed = 'asdfghjkl'.split('').indexOf(name)
            this.sampler.speed = this.speeds[nSpeed]
            stopPropagation = true
        }
        
        if (stopPropagation)
            event.stopImmediatePropagation();
    }

    bind(sampler) {
        if(sampler) this.sampler = sampler;
        window.addEventListener('keydown', this.keydownListenerFn, true)
        window.addEventListener('keyup', this.keyupListenerFn, true)

    }

    unbind() {
        window.removeEventListener('keydown', this.keydownListenerFn, true)
        window.removeEventListener('keyup', this.keyupListenerFn, true)
    }

}

module.exports = KeyboardLooper