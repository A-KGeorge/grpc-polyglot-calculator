const grpc = require("@grpc/grpc-js");
const { CalculatorClient } = require("../generated/calculator_grpc_pb");
const { TwoNumbers } = require("../generated/calculator_pb");

// Operator -> backend mapping (method names are LOWERCASE on the stub)
const OP_MAP = {
  "+": { host: "python-add-server:50051", method: "add" },
  "-": { host: "java-subtract-server:50052", method: "subtract" },
  "*": { host: "cpp-multiply-server:50053", method: "multiply" },
  "/": { host: "rust-divide-server:50054", method: "divide" },
  "%": { host: "go-mod-server:50055", method: "modulus" },
  "^": { host: "elixir-exponent-server:50056", method: "exponentiate" },
};

// Client cache
const clientCache = new Map();

// Get a gRPC client for the specified host
function getClient(host) {
  if (!clientCache.has(host)) {
    clientCache.set(
      host,
      new CalculatorClient(host, grpc.credentials.createInsecure())
    );
  }
  return clientCache.get(host);
}

// Call a binary operation on the specified host
function callBinary(host, method, a, b, { timeoutMs = 2000 } = {}) {
  const client = getClient(host); // get gRPC client
  const req = new TwoNumbers(); // create request object
  req.setA(a); // set first operand
  req.setB(b); // set second operand

  const deadline = new Date(Date.now() + timeoutMs); // set timeout deadline

  // Call the gRPC method
  return new Promise((resolve, reject) => {
    client[method](req, { deadline }, (err, res) => {
      if (err) return reject(err);
      resolve(res.getResult());
    });
  });
}

// Call a binary operation on the specified host
function callOp(op, a, b, opts) {
  //   console.log(`Calling ${op} with a=${a}, b=${b} on ${OP_MAP[op].host}`);
  const svc = OP_MAP[op];
  if (!svc) throw new Error(`No service mapping for operator '${op}'`);
  return callBinary(svc.host, svc.method, a, b, opts);
}

module.exports = { callOp, OP_MAP };
