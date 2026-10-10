import { ITestCase, ISubmitProblemResponse, ITestResult } from "@/types";

export function normalizeOutput(str: string): string {
  return (str || "")
    .trim()
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map(line => line.trimEnd())
    .join("\n");
}

function executeTestCaseInWorker(
  code: string,
  rawInput: string,
  timeoutMs = 2500,
): Promise<{ actualOutput: string; error?: string; executionTimeMs: number }> {
  return new Promise(resolve => {
    const startTime = performance.now();

    if (typeof window === "undefined" || typeof Worker === "undefined") {
      return resolve({
        actualOutput: "",
        error: "Client-side execution requires a browser environment.",
        executionTimeMs: 0,
      });
    }

    const workerScript = `
self.onmessage = function(e) {
  const { code, rawInput } = e.data;
  let __output = "";
  
  const customConsole = {
    log: function(...args) {
      __output += args.map(a => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ") + "\\n";
    },
    error: function(...args) {
      __output += "[error] " + args.join(" ") + "\\n";
    },
    warn: function(...args) {
      __output += "[warn] " + args.join(" ") + "\\n";
    },
  };

  const customRequire = function(moduleName) {
    if (moduleName === "fs") {
      return {
        readFileSync: function() { return rawInput; },
      };
    }
    throw new Error("Module '" + moduleName + "' is not supported in the browser sandbox.");
  };

  try {
    const input = rawInput;
    const userFn = new Function("input", "require", "console", \`
      \${code}
      return typeof solution === "function" ? solution : undefined;
    \`);
    const maybeSolution = userFn(input, customRequire, customConsole);
    if (__output.trim().length === 0 && typeof maybeSolution === "function") {
      const res = maybeSolution(input);
      if (res !== undefined && __output.trim().length === 0) {
        __output += (typeof res === "object" ? JSON.stringify(res) : String(res)) + "\\n";
      }
    }
    self.postMessage({ success: true, output: __output.trim() });
  } catch (err) {
    self.postMessage({ success: false, error: err && err.message ? err.message : String(err), output: __output.trim() });
  }
};
`;

    let workerUrl: string | null = null;
    let worker: Worker | null = null;
    let isSettled = false;

    try {
      const blob = new Blob([workerScript], { type: "application/javascript" });
      workerUrl = URL.createObjectURL(blob);
      worker = new Worker(workerUrl);
    } catch (e: unknown) {
      return resolve({
        actualOutput: "",
        error: (e as Error)?.message || "Worker initialization failed",
        executionTimeMs: Math.round(performance.now() - startTime),
      });
    }

    const cleanup = () => {
      if (worker) {
        worker.terminate();
        worker = null;
      }
      if (workerUrl) {
        URL.revokeObjectURL(workerUrl);
        workerUrl = null;
      }
    };

    const timer = setTimeout(() => {
      if (!isSettled) {
        isSettled = true;
        cleanup();
        resolve({
          actualOutput: "",
          error: "Time Limit Exceeded (Timeout)",
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      }
    }, timeoutMs);

    worker.onmessage = event => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        cleanup();
        const { success, output, error } = event.data;
        resolve({
          actualOutput: output || "",
          error: success ? undefined : error,
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      }
    };

    worker.onerror = err => {
      if (!isSettled) {
        isSettled = true;
        clearTimeout(timer);
        cleanup();
        resolve({
          actualOutput: "",
          error: err.message || "Runtime Execution Error",
          executionTimeMs: Math.round(performance.now() - startTime),
        });
      }
    };

    worker.postMessage({ code, rawInput });
  });
}

export async function runClientCode(
  code: string,
  testCases: ITestCase[],
  totalPoints = 100,
): Promise<ISubmitProblemResponse> {
  const visibleTests = testCases.filter(tc => !tc.isHidden);
  const testsToRun = visibleTests.length > 0 ? visibleTests : testCases;

  if (testsToRun.length === 0) {
    return {
      scoreAwarded: totalPoints,
      score: totalPoints,
      maxPoints: totalPoints,
      status: "ACCEPTED",
      testCasesPassed: 0,
      totalTestCases: 0,
      testResults: [],
    };
  }

  const results: ITestResult[] = [];
  let passedCount = 0;

  for (const tc of testsToRun) {
    const rawInput = tc.input || "";
    const expectedOutput = tc.expectedOutput || "";

    const exec = await executeTestCaseInWorker(code, rawInput, 2500);

    const actualNormalized = normalizeOutput(exec.actualOutput);
    const expectedNormalized = normalizeOutput(expectedOutput);

    const passed = !exec.error && actualNormalized === expectedNormalized;
    if (passed) passedCount++;

    results.push({
      testCaseId: tc.id,
      passed,
      input: rawInput,
      expectedOutput,
      actualOutput: exec.error ? exec.error : exec.actualOutput || "(Empty Output)",
      error: exec.error,
      executionTimeMs: exec.executionTimeMs,
      isHidden: false,
    });
  }

  const isAllPassed = passedCount === testsToRun.length;
  const fraction = testsToRun.length > 0 ? passedCount / testsToRun.length : 0;
  const scoreAwarded = Math.round(fraction * totalPoints);

  return {
    scoreAwarded,
    score: scoreAwarded,
    maxPoints: totalPoints,
    testCasesPassed: passedCount,
    totalTestCases: testsToRun.length,
    status: isAllPassed ? "ACCEPTED" : "WRONG_ANSWER",
    testResults: results,
  };
}
