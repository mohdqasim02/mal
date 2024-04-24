const { pr_str } = require("./printer");
const { MalValue, MalList } = require("./types");

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
  "prn": (...args) => pr_str(args.join(" "), true),
  "str": (...args) => pr_str(args.join(""), false),
  "println": (...args) => pr_str(args.join(" "), false),
  "pr-str": (...args) => pr_str(`\"${args.join(" ")}\"`),
}

module.exports = { ns };