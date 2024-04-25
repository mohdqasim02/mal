const pr_str = (ast, readability = true) => {
  if (typeof ast == 'function') return "#<function>";
  if (ast.value === null) return "nil";

  return ast.toString();
};

module.exports = { pr_str };