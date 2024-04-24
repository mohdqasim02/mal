const { isEqual } = require("lodash");

class MalValue {
  value;

  constructor(value) {
    this.value = value
  }

  toString() {
    return this.value;
  }

  equals(other) {
    if (Array.isArray(this.value) && Array.isArray(other.value)) {
      if (this.value.length != other.value.length) return false
      return this.value.every((element, index) => element.equals(other.value[index]));
    }

    return isEqual(this, other);
  }
}

class MalSymbol extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalKeyWord extends MalValue {
  constructor(value) {
    super(value);
  }
}

class MalString extends MalValue {
  constructor(value) {
    super(value);
  }

  toString() {
    return '"' + this.value + '"';
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

module.exports = {
  MalList,
  MalSymbol,
  MalValue,
  MalVector,
  MalMap,
  MalString,
  MalKeyWord
};
