const {
  MalList,
  MalSymbol,
  MalValue,
  MalVector,
  MalMap,
  MalString,
  MalKeyWord
} = require("./types");

class Reader {
  #tokens;
  #position;

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek() {
    return this.#tokens[this.#position];
  }

  next() {
    const token = this.peek();
    this.#position++;
    return token;
  }
}

const tokenize = (str) => {
  const regex = new RegExp(/[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g);
  return [...str.matchAll(regex)].slice(0, -1).map(x => x[1]);
}

const read_atom = reader => {
  const token = reader.peek();

  if (+token) return new MalValue(parseInt(token));
  if (token === 'true') return new MalValue(true);
  if (token === 'false') return new MalValue(false);
  if (token === 'nil') return new MalValue(null);
  if (token.startsWith(':')) return new MalKeyWord(token);
  if (token.startsWith('"') && token.endsWith('"')) {
    const value = token.split('')[1];
    return new MalString(value);
  };

  return new MalSymbol(token);
}

const read_map = reader => {
  const list = [];

  while (reader.peek() !== undefined) {
    if (reader.next() === undefined) throw "Unbalanced String";
    if (reader.peek() === '}') return new MalMap(list);
    list.push(read_form(reader));
  }

  return new MalMap(list);
}

const read_vector = reader => {
  const list = [];

  while (reader.peek() !== undefined) {
    if (reader.next() === undefined) throw "Unbalanced String";
    if (reader.peek() === ']') return new MalVector(list);
    list.push(read_form(reader));
  }

  return new MalVector(list);
}

const read_list = reader => {
  const list = [];

  while (reader.peek() !== undefined) {
    if (reader.next() === undefined) throw "Unbalanced String";
    if (reader.peek() === ')') return new MalList(list);
    list.push(read_form(reader));
  }

  return new MalList(list);
}

const read_form = (reader) => {
  const firstToken = reader.peek();

  switch (firstToken) {
    case '(':
      return read_list(reader);
    case '{':
      return read_map(reader);
    case '[':
      return read_vector(reader);
    default:
      return read_atom(reader);
  }
}

const read_str = str => {
  const tokens = tokenize(str)
  const reader = new Reader(tokens);

  return read_form(reader)
}

module.exports = { read_str };