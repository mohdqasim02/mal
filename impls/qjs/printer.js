const pr_str = (ast, readability = true) => {
  if (typeof ast == 'function') console.log("#<function>");
  else if (ast.value === null) console.log("nil");
  else console.log(ast.toString());
};

module.exports = { pr_str };