class MalValue {
  value;

  constructor(value) {
    this.value = value
  }

  toString() {
    return this.value;
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalList extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return "(" + this.value.join(" ") + ")";
  }
}

class MalVector extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return "[" + this.value.join(" ") + "]";
  }
}

class MalMap extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return "{" + this.value.join(" ") + "}";
  }
}

module.exports = { MalList, MalSymbol, MalValue, MalVector, MalMap };
