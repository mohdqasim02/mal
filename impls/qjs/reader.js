class Reader{
  #tokens;
  #position;

  constructor(tokens) {
    this.#tokens = tokens;
    this.#position = 0;
  }

  peek(){
    return this.#tokens[this.#position];
  }

  next(){
    const token = this.peek();
    this.#position++;
    return token;
  }
}

const tokenize = (str) => {
  const regex = new RegExp(/[\s,]*(~@|[\[\]{}()'`~^@]|"(?:\\.|[^\\"])*"?|;.*|[^\s\[\]{}('"`,;)]*)/g);
  return [...str.matchAll(regex)].slice(0, -1).map(x => x[1]);
}

const read_str = str => {
  const tokens = tokenize(str)
  const reader = new Reader(tokens);

  console.log(reader.next());
  console.log(reader.next());
  console.log(reader.next());
  console.log(reader.next());
  console.log(reader.next());
}

read_str("( + 1 3)");