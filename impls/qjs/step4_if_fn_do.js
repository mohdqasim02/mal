const _ = require('lodash');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { Env } = require('./env');
const { pr_str } = require('./printer');
const { read_str } = require('./reader');
const { MalList, MalSymbol, MalVector, MalMap } = require('./types');
const { ns } = require('./core');


function handleDo(ast, env) {
  const [_, ...list] = ast.value;
  return list.map((x) => EVAL(x, env)).at(-1);
}

function handleLet(env, ast) {
  const newEnv = new Env(env);
  const [, bindings, exprs] = ast.value;
  const keyPairs = _.chunk(bindings.value, 2);

  keyPairs.forEach(([key, val]) => {
    newEnv.set(key.value, EVAL(val, newEnv));
  });
  return EVAL(exprs, newEnv);
}

function handleDef(ast, env) {
  const [_, key, val] = ast.value;
  env.set(key.value, EVAL(val, env));
  return env.get(key.value);
}

function handleIf(ast, env) {
  const [_, _cond, _if, _else] = ast.value;
  const evaluatedCond = EVAL(_cond, env).value

  if (evaluatedCond === 0 || evaluatedCond === '' || evaluatedCond) return EVAL(_if, env);
  else if (!_else) return "nil";
  else return EVAL(_else, env);
}

function handlefn(ast, env) {
  const [, bindings, val] = ast.value;

  return (...exprs) => {
    const newEnv = Env.create(env, bindings.value, exprs);
    return EVAL(val, newEnv);
  };
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
      case "def!":
        return handleDef(ast, env);
      case "let*":
        return handleLet(env, ast);
      case "do":
        return handleDo(ast, env);
      case "if":
        return handleIf(ast, env);
      case "fn*":
        return handlefn(ast, env);
    }

    const [fn, ...args] = eval_ast(ast, env).value;
    return fn.apply(null, args);
  }

  return eval_ast(ast, env);
}

const repl_env = Env.create(null, Object.keys(ns), Object.values(ns));
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

rep("(def! not (fn* (a) (if a false true)))");
console.clear();
repl();