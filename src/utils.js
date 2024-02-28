const rand = (lo = 0, hi = 1) => Math.random() * (hi -lo) + lo
const irand = (lo = 0, hi = 1) => Math.round(Math.random() * (hi -lo) + lo)
const coin = (prob = 0.5) => Math.random() < prob
const choose = (list) => list[irand(0, list.length - 1)]

const seq = (list) => {
  return {
    pos: -1,
    get next() {
      this.pos = (this.pos + 1) % list.length
      return list[this.pos]
    }}
}

function CallableInstance(property) {
  var func = this.constructor.prototype[property];
  var apply = function() { return func.apply(apply, arguments); }
  Object.setPrototypeOf(apply, this.constructor.prototype);
  Object.getOwnPropertyNames(func).forEach(function (p) {
    Object.defineProperty(apply, p, Object.getOwnPropertyDescriptor(func, p));
  });
  return apply;
}
CallableInstance.prototype = Object.create(Function.prototype);

module.exports = {rand, irand, coin, choose, CallableInstance, seq}
