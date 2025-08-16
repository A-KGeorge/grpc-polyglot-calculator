#!/usr/bin/env node
/**
 * Host-side test runner that pipes expressions into the node-client CLI via stdin.
 * Usage: node test.js
 */

const { spawn } = require("child_process");

// ----------------------- Config -----------------------------------
const SERVICE = "node-client";
const CLI_INVOKE = `printf "%s\\n" "$1" | node src/cli.js`;
const TIMEOUT_MS = 20000;

// Put your tests here:
const TESTS = [
  // Basic
  { expr: "1+2", expected: 3 },
  { expr: "5-3", expected: 2 },
  { expr: "4*6", expected: 24 },
  { expr: "8/2", expected: 4 },

  // Precedence
  { expr: "2+3*4", expected: 14 },
  { expr: "10-6/3", expected: 8 },
  { expr: "2*3+4", expected: 10 },

  // Parentheses
  { expr: "(2+3)*4", expected: 20 },
  { expr: "(10-2)*(8/2)", expected: 32 },
  { expr: "(1+2)*(3-1)", expected: 6 },

  // Nested
  { expr: "((1+2)*(3+4))/5", expected: 4.2 },
  { expr: "(8/(4-2))+(3*(2+1))", expected: 13 },

  // Unary minus (requires the -(...) tokenizer patch)
  { expr: "-3+5", expected: 2 },
  { expr: "-(2+3)*4", expected: -20 },
  { expr: "(-2)*(-3)", expected: 6 },

  // Decimals
  { expr: "3.5+1.2", expected: 4.7 },
  { expr: "(2.5*4)-1.25", expected: 8.75 },

  // Modulus
  { expr: "10%3", expected: 1 },

  // Power
  { expr: "2^3", expected: 8 },

  // Mixed
  { expr: "(10-2)*(8/(3+1))", expected: 16 },
  { expr: "2*2+(4-2)", expected: 6 },
  { expr: "(5*((1+2)+3))/4", expected: 7.5 },
  { expr: "5^0.5", expected: Math.sqrt(5) },
  { expr: "(2+3)^(1+2)", expected: 125 },
];

// ----------------------- Helpers ----------------------------------
function approxEqual(a, b, eps = 1e-9) {
  return Math.abs(a - b) <= eps;
}

function parseResult(stdout, stderr) {
  const combined = `${stdout}\n${stderr}`;
  // Accept negative/decimal numbers
  const m = combined.match(/Result:\s*([+-]?\d+(?:\.\d+)?)/);
  if (m) return { ok: true, value: parseFloat(m[1]), raw: combined };

  const e = combined.match(/Error:\s*(.+)/);
  if (e) return { ok: false, error: e[1].trim(), raw: combined };

  return { ok: false, error: "Unable to parse result", raw: combined };
}

function runProc(cmd, args, { timeoutMs = TIMEOUT_MS } = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: ["ignore", "pipe", "pipe"] });
    let stdout = "";
    let stderr = "";
    let timedOut = false;

    const t = setTimeout(() => {
      timedOut = true;
      child.kill("SIGKILL");
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err) => {
      clearTimeout(t);
      reject(err);
    });
    child.on("close", (code) => {
      clearTimeout(t);
      if (timedOut) return reject(new Error(`Timeout after ${timeoutMs}ms`));
      resolve({ code, stdout, stderr });
    });
  });
}

async function detectCompose() {
  try {
    const r = await runProc("docker", ["compose", "version"], {
      timeoutMs: 3000,
    });
    if (r.code === 0) return { cmd: "docker", baseArgs: ["compose"] };
  } catch {}
  const r2 = await runProc("docker-compose", ["version"], { timeoutMs: 3000 });
  if (r2.code === 0) return { cmd: "docker-compose", baseArgs: [] };
  throw new Error(
    "Neither `docker compose` nor `docker-compose` is available."
  );
}

async function runInContainer(compose, expr) {
  // Use sh -lc so we can safely pass expr as $1 without shell quoting issues.
  // POSIX: for `sh -c 'cmd' name arg1`, $0 is 'name', $1 is 'arg1'.
  const args = [
    ...compose.baseArgs,
    "exec",
    "-T",
    SERVICE,
    "sh",
    "-lc",
    CLI_INVOKE,
    "_expr_",
    expr,
  ];
  return runProc(compose.cmd, args);
}

// ----------------------- Main -------------------------------------
(async () => {
  const compose = await detectCompose().catch((e) => {
    console.error("Docker Compose not found:", e.message);
    process.exit(1);
  });

  // Quick availability check (container must be up)
  try {
    const warm = await runInContainer(compose, "0+0");
    if (warm.code !== 0) throw new Error(warm.stderr || warm.stdout);
  } catch (e) {
    console.error("Failed to exec inside container.");
    console.error("Make sure containers are running: `docker compose up -d`");
    console.error(String(e.message || e));
    process.exit(1);
  }

  let passed = 0;
  const t0 = Date.now();

  for (const { expr, expected } of TESTS) {
    const start = Date.now();
    try {
      const { code, stdout, stderr } = await runInContainer(compose, expr);
      const parsed = parseResult(stdout, stderr);

      if (code !== 0) {
        console.log(`💥 ${expr} → exit ${code}`);
        if (stderr.trim()) console.log(stderr.trim());
        continue;
      }

      if (!parsed.ok) {
        console.log(`❌ ${expr} → ${parsed.error}`);
        // Uncomment for debugging:
        // console.log(parsed.raw);
        continue;
      }

      const got = parsed.value;
      const ok =
        typeof expected === "number"
          ? approxEqual(got, expected)
          : got === expected;

      if (ok) {
        passed++;
        console.log(`✅ ${expr} = ${got} (${Date.now() - start}ms)`);
      } else {
        console.log(
          `❌ ${expr} → got ${got}, expected ${expected} (${
            Date.now() - start
          }ms)`
        );
      }
    } catch (err) {
      console.log(`💥 ${expr} → Error: ${err.message}`);
    }
  }

  const dt = Date.now() - t0;
  console.log(`\nDone: ${passed}/${TESTS.length} passed in ${dt}ms`);
  process.exit(passed === TESTS.length ? 0 : 1);
})();
