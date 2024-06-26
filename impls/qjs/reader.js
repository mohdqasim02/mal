const {
  MalList,
  MalSymbol,
  MalValue,
  MalVector,
  MalMap,
  MalString,
  MalKeyWord,
  MalNil
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

  if (token == '0' || +token) return new MalValue(+token);
  if (token === 'true') return new MalValue(true);
  if (token === 'false') return new MalValue(false);
  if (token === 'nil') return new MalNil();
  if (token.startsWith(':')) return new MalKeyWord(token);
  if (token.match(/^"(?:\\.|[^\\"])*"$/)) {
    const value = token
      .slice(1, -1)
      .replace(/\\(.)/g, (_, c) => c === "n" ? "\n" : c);

    return new MalString(value);
  };

  return new MalSymbol(token);
}

const read_collection = (reader, closingBracket) => {
  const ast = [];

  while (reader.peek() !== undefined) {
    if (reader.next() === undefined) throw "Unbalanced String";
    if (reader.peek() === closingBracket) return ast;
    ast.push(read_form(reader));
  }

  return ast;
}

const read_map = reader => new MalMap(read_collection(reader, "}"));
const read_list = reader => new MalList(read_collection(reader, ")"));
const read_vector = reader => new MalVector(read_collection(reader, "]"));

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