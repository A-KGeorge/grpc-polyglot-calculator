const { VALID_OPS } = require("./precedence");

function tokenize(expr) {
  const tokens = [];
  let i = 0;

  const isDigit = (c) => c >= "0" && c <= "9";
  const isSpace = (c) => /\s/.test(c);

  // helper: peek next non-space char without consuming
  function peekNonSpace(idx) {
    let j = idx;
    while (j < expr.length && isSpace(expr[j])) j++;
    return { ch: expr[j], j };
  }

  while (i < expr.length) {
    const c = expr[i];

    if (isSpace(c)) {
      i++;
      continue;
    }

    if (c === "(" || c === ")") {
      tokens.push({ type: "paren", value: c });
      i++;
      continue;
    }

    if (VALID_OPS.has(c)) {
      // Handle unary minus
      const prev = tokens[tokens.length - 1];
      const isUnary =
        c === "-" &&
        (tokens.length === 0 ||
          prev.type === "op" ||
          (prev.type === "paren" && prev.value === "("));

      if (isUnary) {
        // Case 1: "-("  -> emit -1 * (
        const { ch: nextCh, j: nextIdx } = peekNonSpace(i + 1);
        if (nextCh === "(") {
          tokens.push({ type: "num", value: -1 });
          tokens.push({ type: "op", value: "*" });
          i = nextIdx; // do not consume '(' here; let top of loop handle it
          continue;
        }

        // Case 2: "-<number>"  (existing path)
        let j = i + 1;
        let sawDigit = false;
        let sawDot = false;
        if (j < expr.length && (isDigit(expr[j]) || expr[j] === ".")) {
          if (expr[j] === ".") {
            sawDot = true;
            j++;
          }
          while (j < expr.length && isDigit(expr[j])) {
            sawDigit = true;
            j++;
          }
          if (!sawDot && j < expr.length && expr[j] === ".") {
            sawDot = true;
            j++;
            while (j < expr.length && isDigit(expr[j])) {
              sawDigit = true;
              j++;
            }
          }
          if (!sawDigit) throw new Error("Invalid number after unary '-'");
          tokens.push({ type: "num", value: parseFloat(expr.slice(i, j)) });
          i = j;
          continue;
        }
        // fall through to treat '-' as binary op if not followed by number or '('
      }

      // binary operators
      tokens.push({ type: "op", value: c });
      i++;
      continue;
    }

    if (isDigit(c) || c === ".") {
      let j = i;
      let sawDot = false;
      if (expr[j] === ".") {
        sawDot = true;
        j++;
        if (j >= expr.length || !isDigit(expr[j])) {
          throw new Error("Invalid leading '.' in number");
        }
      }
      while (j < expr.length && isDigit(expr[j])) j++;
      if (j < expr.length && expr[j] === ".") {
        if (sawDot) throw new Error("Invalid number with multiple dots");
        sawDot = true;
        j++;
        while (j < expr.length && isDigit(expr[j])) j++;
      }
      tokens.push({ type: "num", value: parseFloat(expr.slice(i, j)) });
      i = j;
      continue;
    }

    throw new Error(`Unexpected character: '${c}'`);
  }

  return tokens;
}

module.exports = { tokenize };
