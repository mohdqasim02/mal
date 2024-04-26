const pr_str = (ast, readability = true) => {
  if (ast.value === null) return "nil";

  return ast.toString();
};

module.exports = { pr_str };