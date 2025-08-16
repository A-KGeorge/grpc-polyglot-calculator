module.exports = {
  PRECEDENCE: { "+": 1, "-": 1, "*": 2, "/": 2, "%": 2, "^": 3 }, // Operators precedence
  LEFT_ASSOC: {
    "+": true,
    "-": true,
    "*": true,
    "/": true,
    "%": true,
    "^": false,
  }, // Operators associativity
  VALID_OPS: new Set(["+", "-", "*", "/", "%", "^"]), // Valid operators
};
