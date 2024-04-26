const pr_str = (ast, readably = false) => {
  if (ast.value === null) return "nil";

  return ast.toString(readably);
};

module.exports = { pr_str };