const { MalList } = require("./types");

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

  static create(outer, binds, exprs) {
    const newEnv = new Env(outer);

    for (let i = 0; i < binds.length; i++) {
      const b = binds[i];
      if (b.value === "&" && binds[i + 1]) {
        newEnv.set(binds[i + 1], new MalList(exprs.slice(i)));
        break;
      }
      newEnv.set(b, exprs[i]);
    }

    return newEnv;
  }
}

module.exports = { Env };