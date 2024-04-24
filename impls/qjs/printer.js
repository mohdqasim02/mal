const pr_str = (ast, readability = true) => {
  if (ast.value === null) console.log("nil");
  if (typeof ast == 'function') console.log("#<function>");
  else console.log(ast.toString());
  return 'nil';
};

module.exports = { pr_str };