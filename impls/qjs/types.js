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

class MalSymbol extends MalValue { }

class MalKeyWord extends MalValue { }

class MalString extends MalValue {
  toString() {
    return '"' + this.value + '"';
  }
}

class MalList extends MalValue {
  toString() {
    return "(" + this.value.join(" ") + ")";
  }
}

class MalVector extends MalValue {
  toString() {
    return "[" + this.value.join(" ") + "]";
  }
}

class MalMap extends MalValue {
  toString() {
    return "{" + this.value.join(" ") + "}";
  }
}

class MalFunction extends MalValue {
  env;
  body;
  params;

  constructor(params, body, env) {
    super();
    this.env = env;
    this.body = body;
    this.params = params;
  }

  toString() {
    return "#<function>";
  }
}

module.exports = {
  MalList,
  MalSymbol,
  MalValue,
  MalVector,
  MalMap,
  MalString,
  MalKeyWord,
  MalFunction
};
