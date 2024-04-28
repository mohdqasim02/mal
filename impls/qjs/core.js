const { readFileSync } = require("node:fs");
const { pr_str } = require("./printer");
const { read_str } = require("./reader");
const { MalValue, MalList, MalString, MalNil, MalAtom } = require("./types");

const print = (args, separator, readably) => {
  const str = args.map(x => pr_str(x, readably)).join(separator);
  console.log(str);
}

const ns = {
  "<": (a, b) => new MalValue(a < b),
  ">": (a, b) => new MalValue(a > b),
  "<=": (a, b) => new MalValue(a <= b),
  ">=": (a, b) => new MalValue(a >= b),
  "=": (a, b) => new MalValue(a.equals(b)),
  "+": (...args) => new MalValue(args.reduce((a, b) => a + b)),
  "-": (...args) => new MalValue(args.reduce((a, b) => a - b)),
  "*": (...args) => new MalValue(args.reduce((a, b) => a * b)),
  "/": (...args) => new MalValue(args.reduce((a, b) => a / b)),
  "list": (...args) => new MalList(args),
  "list?": (args) => new MalValue(args instanceof MalList),
  "empty?": (args) => new MalValue(args.value.length === 0),
  "count": (args) => new MalValue((args.value || []).length),
  "str": (...args) => new MalString(args.map(x => pr_str(x, false)).join("")),
  "pr-str": (...args) => new MalString(args.map(x => pr_str(x, true)).join(" ")),
  "prn": (...args) => print(args, " ", true) || new MalNil(),
  "println": (...args) => print(args, " ", false) || new MalNil(),
  "read-string": malString => read_str(malString.value),
  "slurp": filename => new MalString(readFileSync(filename.value, 'utf-8')),
  "atom": malValue => new MalAtom(malValue),
  "atom?": malValue => new MalValue(malValue instanceof MalAtom),
  "deref": malAtom => malAtom.value,
  "reset!": (malAtom, malValue) => malAtom.update(malValue),
  "swap!": (malAtom, fn, ...args) => malAtom.swap(fn, args),
}

module.exports = { ns };