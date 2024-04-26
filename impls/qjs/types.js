const { isEqual } = require("lodash");

class MalValue {
  value;

  constructor(value) {
    this.value = value
  }

  toString(readably) {
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
  toString(readably) {
    if (readably) {
      return '"' + this.value
        .replace(/\\/g, "\\\\")
        .replace(/"/g, '\\"')
        .replace(/\n/g, "\\n") + '"'
    }

    return this.value;
  }
}

class MalList extends MalValue {
  toString(readably) {
    return "(" + this.value.map(x => x.toString(readably)).join(" ") + ")";
  }
}

class MalVector extends MalValue {
  toString(readably) {
    return "[" + this.value.map(x => x.toString(readably)).join(" ") + "]";
  }
}

class MalMap extends MalValue {
  toString(readably) {
    return "{" + this.value.map(x => x.toString(readably)).join(" ") + "}";
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

  toString(readably) {
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
