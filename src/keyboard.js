class KeyboardLooper {
    constructor(sampler, looper) {
        this.loops = {}
        this.keyupListenerFn = (e) => this.keyUp(e)
        this.keydownListenerFn = (e) => this.keyDown(e)
        this.mousedownListenerFn = (e) => this.mouseDown(e)
        this.looper = looper
        this.speeds = [4/9, 8/15, 2/3, 4/5, 1, 5/4, 3/2, 15/8, 9/4]
        this.initDefaultKeymap();
        this.bind(sampler)
    }

    initDefaultKeymap() {
        this.keymap = {
            'ArrowUp': (e) => {
                const delta = e.shiftKey ? 0.001 : e.ctrlKey ? 0.1 : 0.01;
                this.sampler.vol += delta
            },
            'ArrowDown': (e) => {
                const delta = e.shiftKey ? 0.001 : e.ctrlKey ? 0.1 : 0.01;
                this.sampler.vol -= delta
            },
        }

        for(const name of 'qwertyuiop') {
            this.keymap[name] = (e) => {
                //this.toggleLoop(name, this.sampler.curPos);
                this.skipTo(name)
            } 
        }
        for(let name of 'QWERTYUIOP') {
            this.keymap[name] = (e) => {
                name = name.toLowerCase()
                if(!this.has(name) || this.hasComplete(name))
                    this.initLoop(name, this.sampler.curPos);
            } 
        } 
        for(const nSpeed in 'asdfghjkl') {
            const name = 'asdfghjkl'.charAt(nSpeed)
            this.keymap[name] = (e) => {
                this.sampler.speed = this.speeds[nSpeed]
            }
        }

        this.keymap['z'] = (e) => this.sampler.togglePitchShift()
        this.keymap['b'] = (e) => this.sampler.toggleDisplay()
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
        const name = event.key;
        if(this.keymap.hasOwnProperty(name)) {
            this.keymap[name](event);
            event.stopImmediatePropagation()
        }
    }

    mouseDown(event) {
        //console.log(event.target)
        if(event.target.tagName.toLowerCase() == 'video')
            event.stopImmediatePropagation();
    }

    bind(sampler) {
        if(sampler) this.sampler = sampler;
        window.addEventListener('keydown', this.keydownListenerFn, true)
        window.addEventListener('click', this.mousedownListenerFn, true)
        window.addEventListener('keyup', this.keyupListenerFn, true)

    }

    unbind() {
        window.removeEventListener('keydown', this.keydownListenerFn, true)
        window.removeEventListener('keyup', this.keyupListenerFn, true)
        window.removeEventListener('click', this.mousedownListenerFn, true)
    }

}

module.exports = KeyboardLooper
