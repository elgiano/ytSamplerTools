const {rand, irand, CallableInstance} = require('./utils')

class Looper extends CallableInstance {
    constructor(sampler) {
        super('call');
        this.sampler = sampler;
        this.loops = {}
        this.isPaused = false
    }

    call(...args) { this.add(...args) };

    has(loopName) { return !!this.loops[loopName] }
    /**
     *  registers a new loop
     *  @param name {any} loop identifier (e.g. 'a' or 1)
     *  @param fn {()=>void} loop function
     *  @param fnDelta {()=>number} function returning loop delta time
     * */
    add(name, fn, fnDelta = 1000, playing = true) { 
        this.stop(name); 
        this.loops[name] = {fn, fnDelta, playing, id: null};
        if (playing)
            this.run(name);
    };
    /**
    * stop loop
    * param name {any?} if undefined, stop all
    * */
    stop(name) { 
        if(name == undefined) return this.stopAll()
        if(!this.has(name)) return; 
        clearInterval(this.loops[name].id); 
        delete this.loops[name].id
    };
    stopAll() {
        for (const name in this.loops)
            this.stop(name)
    }
    isPlaying(name) { return (!this.has(name)) ? (false) : (this.loops[name].id != null) }
    play(name) { if(this.has(name)) { this.loops[name].playing = true; this.run(name) } };
    toggle(name) { if(this.has(name)) { this.isPlaying(name) ? this.stop(name) : this.play(name) } };

    /**
    * pause the looper, preventing further loops executions
    * running loops will be resumed when .resume() is called
    * */
    pause(pause=true) {
        this.isPaused = pause; 
        if(!pause) {
            for (const name in this.loops)
            if (this.loops[name].playing)
            this.run(name)
        }
    };
    resume() { this.pause(false) }

    run(name) {
        if(this.isPaused) return
        let loop = this.loops[name]
        try {
            let now = new Date();
            loop.fn();
            if (loop.lastExecTime) {
                let delta = (now - loop.lastExecTime) / 1000
                console.log(`[ytst] l(${name}) prev: ${delta.toFixed(2)}`);
            }
            loop.lastExecTime = now
        } catch (err) {
            console.error(`[ytst] l(${name}) ERROR: stopping`);
            throw err
        }

        let delta = loop.fnDelta || 0.1;
        if (typeof delta === 'function') delta = loop.fnDelta()
        if (typeof delta != 'number') {
            console.error(`[ytst] l(${name}) delta is not a number: stopping`);
            this.stop(name)
            return
        }
        delta = Math.max(0.1, delta)
        console.log(`[ytst] l(${name}) next: ${delta.toFixed(2)}`);

        clearInterval(loop.id)
        loop.id = setTimeout(()=>this.run(name), delta * 1000)
    }


    stut(delta) { 
        if(delta <= 0) this.stop('stut')
        else { 
            this.add('stut', () => this.sampler.seekDelta(-delta), () => delta)
        }
    }

    stutCur(delta) { 
        const pos = this.sampler.curPos;
        if(delta <= 0) this.stop('stut')
        else { 
            this.add('stut', () => this.sampler.seek(pos), () => delta)
        }
    }

    stutCurRand(lo = 0.1, hi = 0.2) { 
        const pos = this.sampler.curPos;
        if(lo <= 0) this.stop('stut')
        else { 
            this.add('stut', () => this.sampler.seek(pos), () => rand(lo, hi))
        }
    }

    stut2(delta, hi) { 
        (hi != undefined) ? this.stutCurRand(delta, hi) : this.stutCur(delta)  
    }

    skip(name, lo, hi, loDelta, hiDelta) {
        hi = hi || lo
        loDelta = loDelta || Math.abs(lo)
        hiDelta = hiDelta || loDelta
        this.add(name, ()=> this.sampler.seekD(lo, hi), ()=> rand(loDelta, hiDelta))
    }

    skip2(name, pos, loDelta, hiDelta) { 
        hiDelta = hiDelta || loDelta
        this.add(name, ()=> this.sampler.seek(pos), ()=> rand(loDelta, hiDelta))
    }
}

module.exports = Looper
