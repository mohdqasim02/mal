const { pr_str } = require("./printer");
const { MalValue, MalList, MalString } = require("./types");

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
  "prn": (...args) => print(args, " ", true) || new MalValue(null),
  "println": (...args) => print(args, " ", false) || new MalValue(null),
}

module.exports = { ns };