const { tokenize } = require("./tokenize");
const { toAST } = require("./parse");
const { evalAST } = require("./eval");

async function evaluateExpression(expr) {
  const tokens = tokenize(expr);
  const ast = toAST(tokens);
  return evalAST(ast);
}

async function main() {
  const readline = require("readline"); // package for reading user input
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  }); // get user input

  const ask = (q) => new Promise((res) => rl.question(q, res));

  console.log(
    "Polyglot gRPC Calculator (AST + parallel eval via generated stubs"
  );
  console.log(
    "supported: + (python) - (java) * (cpp) / (rust) % (go) ^ (elixir), paranthesis, decimals, unary minus"
  );
  const expr = (await ask("Enter expression: ")).trim();

  try {
    const result = await evaluateExpression(expr); // initialize and evaluate expression
    const pretty = (n) =>
      Number.isInteger(n) ? n : Number(n.toFixed(10)).valueOf(); // lambda for number formatting
    console.log(`Result: ${pretty(result)}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
  } finally {
    rl.close(); // close the readline interface
  }
}

if (require.main === module) {
  main().catch((e) => {
    console.error("Fatal:", e);
    process.exit(1);
  });
}

module.exports = { init: evaluateExpression };
