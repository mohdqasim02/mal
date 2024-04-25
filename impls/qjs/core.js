const { pr_str } = require("./printer");
const { MalValue, MalList } = require("./types");

const printAndReturn = (str, readability, returnValue) => {
  if (returnValue) {
    pr_str(str, readability);
    return returnValue;
  }

  return str;
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
  "str": (...args) => printAndReturn(args.join(""), false),
  "pr-str": (...args) => printAndReturn(`\"${args.join(" ")}\"`, true),
  "prn": (...args) => printAndReturn(args.join(" "), true, new MalValue(null)),
  "println": (...args) => printAndReturn(args.join(" "), false, new MalValue(null)),
}

module.exports = { ns };