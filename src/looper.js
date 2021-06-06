const {rand, irand, CallableInstance} = require('./utils')

class Looper extends CallableInstance {
    constructor(sampler) {
        super('call');
        this.sampler = sampler;
        this.loops = {}
    }

    has(loopName) { return !!this.loops[loopName] }
    add(name, fn, fnDelta = 1000, playing = true) { 
        this.stop(name); 
        this.loops[name] = {fn, fnDelta, playing};
        this.run(name);
    };
    stop(name) { 
        if(!this.has(name)) return; 
        clearInterval(this.loops[name].id); 
        delete this.loops[name]
    };
    isPlaying(name) { return (!this.has(name)) ? (false) : (this.loops[name].playing) }
    pause(name) { if(this.has(name)) { this.loops[name].playing = false } };
    play(name) { if(this.has(name)) { this.loops[name].playing = true; this.run(name) } };
    toggle(name) { if(this.has(name)) { this.isPlaying(name) ? this.pause(name) : this.play(name) } };

    run(name) {
        if(!this.isPlaying(name)) return
        this.loops[name].fn();
        let delta = this.loops[name].fnDelta || 0.1;
        if (typeof delta === 'function') delta = this.loops[name].fnDelta()
        if (typeof delta != 'number') {
            console.log(`[${name}] delta is not a number: stopping`);
            this.pause(name)
        }
        delta = Math.max(0.1, delta)
        console.log(`[${name}] next: ${delta}`);
        clearInterval(this.loops[name].id)
        this.loops[name].id = setTimeout(()=>this.run(name), delta * 1000)
    }

    call(...args) { this.add(...args) };

    stut(delta) { 
        if(delta <= 0) this.pause('stut')
        else { 
            this.add('stut', () => this.sampler.seekDelta(-delta), () => delta)
        }
    }

    stutCur(delta) { 
        const pos = this.sampler.curPos;
        if(delta <= 0) this.pause('stut')
        else { 
            this.add('stut', () => this.sampler.seek(pos), () => delta)
        }
    }

    stutCurRand(lo = 0.1, hi = 0.2) { 
        const pos = this.sampler.curPos;
        if(lo <= 0) this.pause('stut')
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