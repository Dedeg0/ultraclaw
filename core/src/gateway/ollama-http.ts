import { execFile, spawn } from "node:child_process";
import type { IncomingMessage, ServerResponse } from "node:http";
import { promisify } from "node:util";
import type { GatewayBroadcastFn } from "./server-broadcast.js";

const execFileAsync = promisify(execFile);

// Broadcast event names
export const OLLAMA_EVENT_LOG = "ollama:install:log" as const;
export const OLLAMA_EVENT_DONE = "ollama:install:done" as const;

// Whether an install is already in progress (prevent concurrent runs)
let installRunning = false;

function sendJson(res: ServerResponse, status: number, body: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache");
  res.end(JSON.stringify(body));
}

async function isOllamaInstalled(): Promise<boolean> {
  try {
    await execFileAsync("which", ["ollama"]);
    return true;
  } catch {
    return false;
  }
}

async function isOllamaRunning(): Promise<boolean> {
  try {
    await execFileAsync("pgrep", ["-x", "ollama"]);
    return true;
  } catch {
    return false;
  }
}

async function isModelPulled(model: string): Promise<boolean> {
  try {
    const { stdout } = await execFileAsync("ollama", ["list"]);
    return stdout.includes(model);
  } catch {
    return false;
  }
}

export async function handleOllamaStatusRequest(
  req: IncomingMessage,
  res: ServerResponse,
): Promise<boolean> {
  if (req.url !== "/api/ollama/status" || req.method !== "GET") {
    return false;
  }

  const installed = await isOllamaInstalled();
  const running = installed ? await isOllamaRunning() : false;
  const model = process.env.OLLAMA_DEFAULT_MODEL ?? "llama3.2";
  const modelReady = installed && running ? await isModelPulled(model) : false;

  sendJson(res, 200, {
    installed,
    running,
    model,
    modelReady,
    installRunning,
  });
  return true;
}

export async function handleOllamaInstallRequest(
  req: IncomingMessage,
  res: ServerResponse,
  broadcast: GatewayBroadcastFn,
): Promise<boolean> {
  if (req.url !== "/api/ollama/install" || req.method !== "POST") {
    return false;
  }

  if (installRunning) {
    sendJson(res, 409, { ok: false, error: "Install already in progress" });
    return true;
  }

  const model = process.env.OLLAMA_DEFAULT_MODEL ?? "llama3.2";

  // Respond immediately — progress comes via WebSocket
  sendJson(res, 202, { ok: true, model });

  installRunning = true;

  const emit = (line: string) => {
    broadcast(OLLAMA_EVENT_LOG, { line });
  };

  // Run in background
  void (async () => {
    try {
      // Step 1: Install Ollama via official install script
      const isInstalled = await isOllamaInstalled();
      if (!isInstalled) {
        emit("==> Downloading Ollama installer...");
        await new Promise<void>((resolve, reject) => {
          const proc = spawn("bash", ["-c", "curl -fsSL https://ollama.com/install.sh | sh"], {
            env: { ...process.env, DEBIAN_FRONTEND: "noninteractive" },
          });
          proc.stdout.on("data", (chunk: Buffer) => {
            for (const line of chunk.toString().split("\n")) {
              if (line.trim()) emit(line);
            }
          });
          proc.stderr.on("data", (chunk: Buffer) => {
            for (const line of chunk.toString().split("\n")) {
              if (line.trim()) emit(line);
            }
          });
          proc.on("close", (code) => {
            if (code === 0) resolve();
            else reject(new Error(`Installer exited with code ${code}`));
          });
        });
        emit("==> Ollama installed successfully.");
      } else {
        emit("==> Ollama already installed, skipping.");
      }

      // Step 2: Start Ollama service
      emit("==> Starting Ollama service...");
      await new Promise<void>((resolve) => {
        const proc = spawn("bash", ["-c", "systemctl start ollama || ollama serve &"]);
        proc.on("close", () => resolve());
      });

      // Give it a moment to start
      await new Promise((r) => setTimeout(r, 3000));
      emit("==> Ollama service started.");

      // Step 3: Pull the model
      emit(`==> Pulling model: ${model} (this may take a while)...`);
      await new Promise<void>((resolve, reject) => {
        const proc = spawn("ollama", ["pull", model]);
        proc.stdout.on("data", (chunk: Buffer) => {
          for (const line of chunk.toString().split("\n")) {
            if (line.trim()) emit(line);
          }
        });
        proc.stderr.on("data", (chunk: Buffer) => {
          for (const line of chunk.toString().split("\n")) {
            if (line.trim()) emit(line);
          }
        });
        proc.on("close", (code) => {
          if (code === 0) resolve();
          else reject(new Error(`ollama pull exited with code ${code}`));
        });
      });

      emit(`==> Model ${model} ready.`);
      broadcast(OLLAMA_EVENT_DONE, { ok: true, model });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      emit(`==> ERROR: ${msg}`);
      broadcast(OLLAMA_EVENT_DONE, { ok: false, error: msg });
    } finally {
      installRunning = false;
    }
  })();

  return true;
}