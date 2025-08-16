const { PRECEDENCE, LEFT_ASSOC } = require("./precedence");

// normalize token -> operator symbol, tolerant to different field names
function opSym(t) {
  return t?.value ?? t?.op ?? t?.operator ?? undefined;
}

function toAST(tokens) {
  const out = []; // output array
  const ops = []; // operator stack

  // helper function to pop from the operator stack and create a binary expression
  const popMake = () => {
    const tok = ops.pop();
    if (!tok || tok.type !== "op") throw new Error("Operator stack underflow");
    const sym = opSym(tok);
    if (!sym) throw new Error("Missing operator symbol on token");
    const right = out.pop(); // right operand
    const left = out.pop(); // left operand
    if (!left || !right) throw new Error("Operand stack underflow");
    out.push({ type: "binop", operator: sym, left, right });
  };

  // main parsing loop
  for (const token of tokens) {
    if (token.type === "num") {
      // push number literals to the output
      out.push({ type: "num", value: token.value });
    } else if (token.type === "op") {
      // handle operators
      const tSym = opSym(token);
      if (!tSym) throw new Error("Malformed operator token");
      while (
        ops.length &&
        ops[ops.length - 1].type === "op" &&
        (PRECEDENCE[opSym(ops[ops.length - 1])] > PRECEDENCE[tSym] ||
          (PRECEDENCE[opSym(ops[ops.length - 1])] === PRECEDENCE[tSym] &&
            LEFT_ASSOC[tSym]))
      ) {
        popMake();
      }
      ops.push(token);
    } else if (token.type === "paren" && token.value === "(") {
      // handle left parenthesis
      ops.push(token);
    } else if (token.type === "paren" && token.value === ")") {
      // handle right parenthesis
      while (
        ops.length &&
        !(
          ops[ops.length - 1].type === "paren" &&
          ops[ops.length - 1].value === "("
        )
      )
        popMake();
      if (!ops.length) throw new Error("Mismatched parentheses");
      ops.pop(); // discard '('
    } else {
      throw new Error(`Unexpected token: ${JSON.stringify(token)}`);
    }
  }

  while (ops.length) {
    if (ops[ops.length - 1].type === "paren")
      throw new Error("Mismatched parenthesis");
    popMake();
  }

  if (out.length !== 1) throw new Error("Invalid expression");
  return out[0];
}

module.exports = { toAST };
