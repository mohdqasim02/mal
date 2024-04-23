class Env {
  data;
  outer;

  constructor(outer) {
    this.outer = outer;
    this.data = {};
  }

  set(malSymbol, malValue) {
    this.data[malSymbol] = malValue;
  }

  find(malSymbol) {
    if (malSymbol in this.data) return this;
    if (this.outer !== null) return this.outer.find(malSymbol);
    throw malSymbol + " not found";
  }

  get(malSymbol) {
    const env = this.find(malSymbol);
    return env.data[malSymbol];
  }
}

module.exports = { Env };