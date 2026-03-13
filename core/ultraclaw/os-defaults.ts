/**
 * UltraClaw OS -- System Defaults
 *
 * Overrides standard UltraClaw config when running inside UltraClaw OS.
 * Detected via ULTRACLAW_OS=1 environment variable.
 *
 * Model priority:
 *   1. Ollama (local, no API key needed)
 *   2. Anthropic (remote, requires ANTHROPIC_API_KEY)
 *   3. OpenAI   (remote, requires OPENAI_API_KEY)
 */

export const ULTRACLAW_OS = process.env['ULTRACLAW_OS'] === '1';

export const OS_DEFAULTS = {
  gatewayPort: 18790,
  configDir: '~/.ultraclaw',
  dataDir: '/var/claw',
  defaultModel: 'ollama/llama3.2',
  modelFallbackChain: [
    'ollama/llama3.2',
    'anthropic/claude-haiku-4-5-20251001',
    'openai/gpt-4o-mini',
  ],
  ollama: {
    host: process.env['OLLAMA_HOST'] ?? 'http://127.0.0.1:11434',
    defaultModel: process.env['OLLAMA_DEFAULT_MODEL'] ?? 'llama3.2',
  },
  product: {
    name: 'UltraClaw OS',
    version: process.env['ULTRACLAW_OS_VERSION'] ?? '0.1.0',
    configName: 'ultraclaw',
  },
} as const;

export function getOSAgentConfig(userConfig: Record<string, unknown> = {}) {
  if (!ULTRACLAW_OS) return userConfig;
  return {
    agent: { model: OS_DEFAULTS.defaultModel, ...(userConfig['agent'] as object ?? {}) },
    gateway: { port: OS_DEFAULTS.gatewayPort, ...(userConfig['gateway'] as object ?? {}) },
    ...userConfig,
  };
}