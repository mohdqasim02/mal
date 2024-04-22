const readline = require('node:readline');
const { stdin: input, stdout: output } = require('node:process');
const rl = readline.createInterface({ input, output });

const READ = (str) => str;
const EVAL = (str) => str;
const PRINT = (str) => str;
const rep = (input) => PRINT(EVAL(READ(input)));


const repl = () => rl.question("user> ", (answer) => {
  console.log(rep(answer));
  repl();
});

repl();