const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const { read_str } = require('./reader');
const { pr_str } = require('./printer');

const READ = (str) => read_str(str);
const EVAL = (str) => str;
const PRINT = (str) => pr_str(str);
const rep = (input) => PRINT(EVAL(READ(input)));

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