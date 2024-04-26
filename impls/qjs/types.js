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

class MalCollection extends MalValue {
  openBracket;
  closeBracket;

  constructor(value, brackets) {
    super(value);
    [this.openBracket, this.closeBracket] = brackets;
  }

  toString(readably) {
    return this.openBracket
      + this.value.map(x => x.toString(readably)).join(" ")
      + this.closeBracket;
  }
}

class MalSymbol extends MalValue { }
class MalKeyWord extends MalValue { }

class MalList extends MalCollection {
  constructor(value) {
    super(value, ["(", ")"]);
  }
}

class MalVector extends MalCollection {
  constructor(value) {
    super(value, ["[", "]"]);
  }
}

class MalMap extends MalCollection {
  constructor(value) {
    super(value, ["{", "}"]);
  }
}

class MalFunction {
  env;
  body;
  params;

  constructor(params, body, env) {
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
