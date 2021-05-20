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
    toggle(name) { if(this.has(name)) { this.isPlaying(name) ? pauseLoop(name) : playLoop(name) } };

    run(name) {
        if(!this.isPlaying(name)) return
        let delta = this.loops[name].fnDelta || 0.1;
        if (typeof delta === 'function') delta = this.loops[name].fnDelta()
        console.log(`[${name}] next: ${delta}`);
        this.loops[name].fn(); 
        this.loops[name].id = setTimeout(()=>runLoop(name), delta * 1000)
    }

    call(...args) { this.add(...args) };

    stut(delta) { 
        if(delta <= 0) pauseLoop('stut')
        else { 
            this.add('stut', () => sampler.seekDelta(-delta), () => delta / this.speed)
        }
    }

    stutCur(delta) { 
        const pos = curPos();
        if(delta <= 0) pauseLoop('stut')
        else { 
            this.add('stut', () => sampler.seek(pos), () => delta / this.speed)
        }
    }

    stutCurRand(lo = 0.1, hi = 0.2) { 
        const pos = curPos();
        if(delta <= 0) pauseLoop('stut')
        else { 
            this.add('stut', () => sampler.seek(pos), () => rand(lo, hi) / this.speed)
        }
    }

    stut2(delta, hi) { 
        (hi != undefined) ? this.stutCurRand(delta, hi) : this.stutCur(delta)  
    }

    skip(name, lo, hi, loDelta, hiDelta) { 
        this.add(name, ()=> this.seekDrand(lo, hi), ()=> rand(lo, hi) / this.speed )
    }
}

module.exports = Looper