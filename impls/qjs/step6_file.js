const _ = require('lodash');
const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { Env } = require('./env');
const { pr_str } = require('./printer');
const { read_str } = require('./reader');
const { MalList, MalSymbol, MalVector, MalMap, MalFunction, MalNil } = require('./types');
const { ns } = require('./core');


function handleDo(ast, env) {
  const [_, ...list] = ast.value;
  list.slice(0, -1).map((x) => EVAL(x, env)).at(-1);
  return list.at(-1);
}

function handleLet(ast, env) {
  const newEnv = new Env(env);
  const [, bindings, exprs] = ast.value;
  const keyPairs = _.chunk(bindings.value, 2);

  keyPairs.forEach(([key, val]) => {
    newEnv.set(key.value, EVAL(val, newEnv));
  });

  return [exprs, newEnv];
}

function handleDef(ast, env) {
  const [_, key, val] = ast.value;
  env.set(key.value, EVAL(val, env));
  return env.get(key.value);
}

function handleIf(ast, env) {
  const [_, _cond, _if_ast, _else_ast] = ast.value;
  const evaluatedCond = EVAL(_cond, env).value

  if (evaluatedCond) return _if_ast;
  else if (!_else_ast) return new MalNil();
  else return _else_ast;
}

function handlefn(ast, env) {
  return new MalFunction(ast.value[1], ast.value[2], env);
}


const eval_ast = (ast, env) => {
  if (ast instanceof MalSymbol) return env.get(ast.value);
  if (ast instanceof MalList) return ast.value.map((child) => EVAL(child, env));
  if (ast instanceof MalVector) return new MalVector(ast.value.map((child) => EVAL(child, env)));
  if (ast instanceof MalMap) return new MalMap(ast.value.map((child) => EVAL(child, env)));

  return ast;
}

const READ = (str) => read_str(str);
const PRINT = (ast) => pr_str(ast);
const EVAL = (ast, env) => {
  while (true) {
    if (!(ast instanceof MalList)) return eval_ast(ast, env);
    if (ast.value.length == 0) return ast;

    switch (ast.value[0].value) {
      case "def!":
        return handleDef(ast, env);
      case "let*": {
        const [newAst, newEnv] = handleLet(ast, env);
        ast = newAst;
        env = newEnv;
        continue;
      }
      case "do": {
        ast = handleDo(ast, env);
        continue;
      }
      case "if": {
        ast = handleIf(ast, env);
        continue;
      }
      case "fn*":
        return handlefn(ast, env);
    }

    const [fn, ...args] = eval_ast(ast, env);

    if (fn instanceof MalFunction) {
      env = Env.create(fn.env, fn.params.value, args)
      ast = fn.body
    }
    else {
      return fn.apply(null, args);
    }
  }
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

repl_env.set("eval", (ast) => EVAL(ast, repl_env));
rep("(def! not (fn* (a) (if a false true)))");
rep("(def! load-file (fn* (f) (eval (read-string (str \"(do \" (slurp f) \"\nnil)\")))))");
console.clear();
repl();