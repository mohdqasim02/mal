const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');
const { MalValue, MalList, MalSymbol, MalVector, MalMap } = require('./types');

const repl_env = {
  "+": (a, b) => new MalValue(a.value + b.value),
  "-": (a, b) => new MalValue(a.value - b.value),
  "*": (a, b) => new MalValue(a.value * b.value),
  "/": (a, b) => new MalValue(a.value / b.value),
}

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env[ast.value];
  if (ast instanceof MalList) return new MalList(ast.value.map((child) => EVAL(child, env)));
  if (ast instanceof MalVector) return new MalVector(ast.value.map((child) => EVAL(child, env)));
  if (ast instanceof MalMap) return new MalMap(ast.value.map((child) => EVAL(child, env)));
  return ast;
}

const READ = (str) => read_str(str);
const PRINT = (ast) => pr_str(ast, true);
const EVAL = (ast, env) => {
  if (ast instanceof MalList && ast.value.length == 0) return ast;
  if (ast instanceof MalList) {
    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
}

const rep = (input) => PRINT(EVAL(READ(input), repl_env));
const rl = readline.createInterface({ input, output });
const repl = () => rl.question("user> ", (answer) => {
  try {
    console.log(rep(answer));
  } catch (e) {
    console.log(e);
  }
  repl();
});

repl();