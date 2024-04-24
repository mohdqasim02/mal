const _ = require('lodash');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { Env } = require('./env');
const { pr_str } = require('./printer');
const { read_str } = require('./reader');
const { MalValue, MalList, MalSymbol, MalVector, MalMap } = require('./types');

const create_env = () => {
  const env = new Env(null);

  env.set("+", (a, b) => new MalValue(a.value + b.value));
  env.set("-", (a, b) => new MalValue(a.value - b.value));
  env.set("*", (a, b) => new MalValue(a.value * b.value));
  env.set("/", (a, b) => new MalValue(a.value / b.value));

  return env;
}

const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast.value);
  if (ast instanceof MalList) return new MalList(ast.value.map((child) => EVAL(child, env)));
  if (ast instanceof MalVector) return new MalVector(ast.value.map((child) => EVAL(child, env)));
  if (ast instanceof MalMap) return new MalMap(ast.value.map((child) => EVAL(child, env)));

  return ast;
}

const READ = (str) => read_str(str);
const PRINT = (ast) => pr_str(ast);
const EVAL = (ast, env) => {
  if (ast instanceof MalList && ast.value.length == 0) return ast;
  if (ast instanceof MalList) {
    switch (ast.value[0].value) {
      case "def!": {
        const [_, key, val] = ast.value;
        env.set(key.value, EVAL(val, env));
        return env.get(key.value);
      }
      case "let*": {
        const newEnv = new Env(env);
        const [, bindings, val] = ast.value;
        const keyPairs = _.chunk(bindings.value, 2);

        keyPairs.forEach(([key, val]) => {
          newEnv.set(key.value, EVAL(val, newEnv))
        });
        return EVAL(val, newEnv);
      }
      case "do": {
        const [_, ...list] = ast.value;
        return list.map((x) => EVAL(x, env)).at(-1);
      }
      case "if": {
        const [_, _cond, _if, _else] = ast.value;
        if (EVAL(_cond, env).value) return EVAL(_if, env);
        else if (!_else) return "nil";
        else return EVAL(_else, env);
      }
    }

    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
}

const repl_env = create_env();
const rep = (input) => PRINT(EVAL(READ(input), repl_env));
const rl = readline.createInterface({ input, output });
const repl = () => rl.question("user> ", (answer) => {
  try {
    rep(answer);
  } catch (e) {
    console.log(e);
  }
  repl();
});

repl();