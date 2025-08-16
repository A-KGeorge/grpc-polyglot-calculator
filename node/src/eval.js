const { callOp } = require("./services");

// Evaluate an AST node
async function evalAST(node) {
  if (node.type === "num") return node.value; // return numeric literal value
  if (node.type === "binop") {
    const [a, b] = await Promise.all([evalAST(node.left), evalAST(node.right)]); // evaluate left and right subtrees in parallel
    if (node.operator === "/" && b === 0) throw new Error("Division by zero"); // handle division by zero
    return callOp(node.operator, a, b); // call the appropriate service for the operator
  }
  return new Error(`Unknown AST node type: ${node.type}`); // handle unknown node types
}

module.exports = { evalAST };
